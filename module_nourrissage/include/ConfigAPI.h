#ifndef CONFIGAPI_H
#define CONFIGAPI_H

#include <Arduino.h>

const int MAX_HORAIRES = 20;

struct Horaire {
    int heure;
    int jour;
};

class ConfigAPI {
private:
    Horaire horaires[MAX_HORAIRES];
    int nbHoraires = 0;
    int intervalle = 0;
    bool modeIntervalle = false;
    bool modeHoraires = false;

public:
    void getConfigModule(String token);
    bool isModeIntervalle();
    bool isModeHoraires();
    int getIntervalle();
    Horaire* getHoraires();
    int getNbHoraires();
};

#endif
