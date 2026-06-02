#ifndef CONFIG_FETCHER_H
#define CONFIG_FETCHER_H
 
#include <Arduino.h>
 
// Appelle l'API et récupère la config, puis la transmet au scheduler
void fetchConfig();
// id de l'aquarium récupéré dans la config
extern int aquariumId;
#endif