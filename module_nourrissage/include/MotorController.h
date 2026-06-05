#ifndef MOTOR_CONTROLLER_H
#define MOTOR_CONTROLLER_H
#include <Arduino.h>
#include "ConfigAPI.h"

class MotorController {
private:
    int ENA;
    int IN1;
    int IN2;
    int CONTACTEUR;

    int etat_moteur = 2;

    unsigned long temps_rebond = 0;
    unsigned long temps_cycle = 0;

    int derniereHeure = -1;
    int dernierJour = -1;

public:
    MotorController(int ena, int in1, int in2, int contacteur);
    void begin();
    void update(struct tm* timeinfo, ConfigAPI& config);
};

#endif