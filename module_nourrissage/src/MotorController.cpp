#include <Arduino.h>
#include "MotorController.h"
#include "ConfigAPI.h"

MotorController::MotorController(int ena, int in1, int in2, int contacteur)
{
    ENA = ena;
    IN1 = in1;
    IN2 = in2;
    CONTACTEUR = contacteur;
}

void MotorController::begin()
{
    pinMode(IN1, OUTPUT);
    pinMode(IN2, OUTPUT);
    pinMode(ENA, OUTPUT);
    pinMode(CONTACTEUR, INPUT_PULLUP);
}

void MotorController::update(struct tm* timeinfo, ConfigAPI& config)
{
    // moteur arrêté
    if (etat_moteur == 2) {
        // mode intervalle
        if (config.isModeIntervalle()) {
            if (millis() - temps_cycle >= config.getIntervalle() * 3600000UL) { //conversion en heure
                digitalWrite(ENA, HIGH);
                digitalWrite(IN1, LOW);
                digitalWrite(IN2, HIGH);
                etat_moteur = 1;
            }
        }

        // mode horaire
        if (config.isModeHoraires()) {
            Horaire* horaires = config.getHoraires();
            for (int i = 0; i < config.getNbHoraires(); i++) {
                bool deja_declenche = timeinfo->tm_wday == dernierJour && timeinfo->tm_hour == derniereHeure;
                if (timeinfo->tm_wday == horaires[i].jour && timeinfo->tm_hour == horaires[i].heure && !deja_declenche) {
                    digitalWrite(ENA, HIGH);
                    digitalWrite(IN1, LOW);
                    digitalWrite(IN2, HIGH);
                    etat_moteur = 1;

                    // mémorisation du dernier nourrissage
                    derniereHeure = timeinfo->tm_hour;
                    dernierJour = timeinfo->tm_wday;
                }
            }
        }
    }

    // rotation
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

    // anti-rebond
    if (etat_moteur == 3) {
        if (millis() - temps_rebond > 30) {
            if (digitalRead(CONTACTEUR) == HIGH) {
                digitalWrite(ENA, LOW);
                digitalWrite(IN1, LOW);
                digitalWrite(IN2, LOW);
                temps_cycle = millis();
                etat_moteur = 2;
            }
            else {
                etat_moteur = 0;
            }
        }
    }
}