#ifndef CONFIG_FETCHER_H
#define CONFIG_FETCHER_H
 
#include <Arduino.h>
 
// Appelle l'API et retourne l'intervalle en millisecondes
// Retourne -1 si erreur
void fetchConfig();
 
#endif