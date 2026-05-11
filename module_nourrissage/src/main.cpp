#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "wifi_config.h"
#include "WifiManager.h"
#include "Intervalle.h"
#include "Login.h"

int ENA=25;
int IN1=26;
int IN2=27;
int CONTACTEUR=13;

int etat_moteur = 2;
unsigned long temps_rebond = 0;
unsigned long temps_cycle = 0;

void setup() {
    Serial.begin(115200);
    pinMode(IN1,OUTPUT);
    pinMode(IN2,OUTPUT);
    pinMode(ENA,OUTPUT);
    pinMode(CONTACTEUR, INPUT_PULLUP);

    connexionWifi(ssid, password);

    int intervalle = getIntervalle();

    if (intervalle > 0) {
        Serial.println(intervalle);
    }
    else {
        Serial.println("Erreur récupération intervalle");
    }

    loginApi();
}

void loop() {
    // moteur arrêté sur contacteur
    if (etat_moteur == 2) {
        if (millis() - temps_cycle >= (getIntervalle())*1000) {
            digitalWrite(ENA,HIGH);
            digitalWrite(IN1,LOW);
            digitalWrite(IN2,HIGH);
            etat_moteur = 0;
        }
    }

    // quitter le contacteur
    if (etat_moteur == 0) {
        if (digitalRead(CONTACTEUR) == HIGH) {
            etat_moteur = 1;
        }
    }

    // moteur en rotation
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
                digitalWrite(IN1,LOW);
                digitalWrite(IN2,LOW);
                temps_cycle = millis();  //reset du timer
                etat_moteur = 2;
            }
            else {
                etat_moteur = 1;
            }
        }
    }
}