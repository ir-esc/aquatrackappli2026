#ifndef CONFIGAPI_H
#define CONFIGAPI_H

#include <Arduino.h>

const int MAX_HORAIRES = 20;

struct Horaire {
    int heure;
    int minute;
};

extern Horaire horaires[MAX_HORAIRES];
extern int nbHoraires;

extern int intervalle;

extern bool modeIntervalle;
extern bool modeHoraires;

void getConfigModule();

#endif
