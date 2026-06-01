#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "wifi_config.h"
#include "WifiManager.h"
#include "Login.h"
#include "ConfigAPI.h"

int ENA = 25;
int IN1 = 26;
int IN2 = 27;
int CONTACTEUR = 13;

int etat_moteur = 2;

unsigned long temps_rebond = 0;
unsigned long temps_cycle = 0;
unsigned long dernierRefresh = 0;

// mémorisation du dernier nourrissage
int derniereHeure = -1;
int derniereMinute = -1;

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

    getConfigModule();
}

void loop() {
    // rafraîchissement toutes les 30 secondes
    if (millis() - dernierRefresh > 30000) {
        getHoraires();
        dernierRefresh = millis();
    }

    struct tm timeinfo;

    if (!getLocalTime(&timeinfo)) {
        Serial.println("Failed to obtain time");
        return;
    }

    // moteur arrêté
    if (etat_moteur == 2) {
        // mode intervalle
        if (modeIntervalle) {
            if (millis() - temps_cycle >= intervalle * 1000) {
                digitalWrite(ENA, HIGH);
                digitalWrite(IN1, LOW);
                digitalWrite(IN2, HIGH);
                etat_moteur = 1;
            }
        }
        // mode horaire
        if (modeHoraires) {
            for (int i = 0; i < nbHoraires; i++) {
                bool deja_declenche = timeinfo.tm_hour == derniereHeure && timeinfo.tm_min == derniereMinute;
                if (timeinfo.tm_hour == horaires[i].heure && timeinfo.tm_min == horaires[i].minute && !deja_declenche) {
                    digitalWrite(ENA, HIGH);
                    digitalWrite(IN1, LOW);
                    digitalWrite(IN2, HIGH);
                    etat_moteur = 1;

                    // mémorisation du dernier nourrissage
                    derniereHeure = timeinfo.tm_hour;
                    derniereMinute = timeinfo.tm_min;
                }
            }
        }
    }

    // moteur en rotation
    if (etat_moteur == 1) {
        if (digitalRead(CONTACTEUR) == LOW) {
            etat_moteur = 0;
        }
    }

    // quitter contacteur
    if (etat_moteur == 0) {
        if (digitalRead(CONTACTEUR) == HIGH) {
			temps_rebond = millis();
            etat_moteur = 3;
        }
    }

    // anti rebond
    if (etat_moteur == 3) {
        if (millis() - temps_rebond > 30) {
            if (digitalRead(CONTACTEUR) == HIGH) {
                digitalWrite(IN1, LOW);
                digitalWrite(IN2, LOW);
                digitalWrite(ENA, LOW);
                temps_cycle = millis();

                etat_moteur = 2;
            }
            else {
                etat_moteur = 0;
            }
        }
    }

    delay(10);
}
