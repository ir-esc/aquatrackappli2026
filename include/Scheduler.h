#ifndef SCHEDULER_H
#define SCHEDULER_H

#include <Arduino.h>
#include <ArduinoJson.h>
#include <time.h>

// Gère la logique de quand prendre les photos, selon la config reçue de l'API
class Scheduler {
public:
    String mode;
    long intervalle_ms;
    int jour;
    int heure;
    int minute;
    int derniere_minute;

    Scheduler();
    void parseConfig(String configStr);
    bool doitPrendrePhoto();
};

extern Scheduler scheduler;

#endif