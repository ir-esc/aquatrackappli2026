#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "wifi_config.h"
#include "WifiManager.h"
#include "Login.h"
#include "Horaire.h"

int ENA = 25;
int IN1 = 26;
int IN2 = 27;
int CONTACTEUR = 13;

int etat_moteur = 2;

unsigned long temps_rebond = 0;

unsigned long dernierRefreshHoraires = 0;

const char* ntpServer = "pool.ntp.org";

const long gmtOffset_sec = 3600 * 1;
const int daylightOffset_sec = 3600 * 1;

void setup() {
    Serial.begin(115200);
    pinMode(IN1, OUTPUT);
    pinMode(IN2, OUTPUT);
    pinMode(ENA, OUTPUT);
    pinMode(CONTACTEUR, INPUT_PULLUP);

    connexionWifi(ssid, password);

    loginApi();

    configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);

    getHoraires();
}

void loop() {
    // rafraîchissement toutes les 30 secondes
    if (millis() - dernierRefreshHoraires > 30000) {
        getHoraires();
        dernierRefreshHoraires = millis();
    }

    struct tm timeinfo;

    if (!getLocalTime(&timeinfo)) {
        Serial.println("Failed to obtain time");
        return;
    }

    // moteur arrêté
    if (etat_moteur == 2) {
        for (int i = 0; i < nbHoraires; i++) {
            if (timeinfo.tm_hour == horaires[i].heure && timeinfo.tm_min == horaires[i].minute && !deja_declenche[i]) {
                digitalWrite(ENA, HIGH);
                digitalWrite(IN1, LOW);
                digitalWrite(IN2, HIGH);
                etat_moteur = 0;
                deja_declenche[i] = true;
            }
        }
    }

    // reset du déclenchement
    for (int i = 0; i < nbHoraires; i++) {
        if (timeinfo.tm_min != horaires[i].minute) {
            deja_declenche[i] = false;
        }
    }

    // quitter contacteur
    if (etat_moteur == 0) {
        if (digitalRead(CONTACTEUR) == HIGH) {
            etat_moteur = 1;
        }
    }

    // rotation
    if (etat_moteur == 1) {
        if (digitalRead(CONTACTEUR) == LOW) {
            temps_rebond = millis();
            etat_moteur = 3;
        }
    }

    // anti rebond
    if (etat_moteur == 3) {
        if (millis() - temps_rebond > 30) {
            if (digitalRead(CONTACTEUR) == LOW) {
                digitalWrite(IN1, LOW);
                digitalWrite(IN2, LOW);
                digitalWrite(ENA, LOW);
                etat_moteur = 2;
            }
            else {
                etat_moteur = 1;
            }
        }
    }

    delay(100);
}
