#ifndef SCHEDULER_H
#define SCHEDULER_H

#include <Arduino.h>
#include <ArduinoJson.h>
#include <time.h>

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