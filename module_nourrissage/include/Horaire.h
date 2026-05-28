#ifndef HORAIRE_H
#define HORAIRE_H

#include <Arduino.h>

const int MAX_HORAIRES = 20;

struct Horaire {
    int heure;
    int minute;
};

extern Horaire horaires[MAX_HORAIRES];
extern bool deja_declenche[MAX_HORAIRES];
extern int nbHoraires;

void getHoraires();

#endif
