#ifndef LOGIN_HANDLING_H
#define LOGIN_HANDLING_H
#include <Arduino.h>

extern String moduleToken; // token d'authentification pour les requêtes à l'API, à récupérer après le login et à stocker dans une variable globale pour pouvoir l'utiliser facilement dans les autres fonctions qui font des requêtes à l'API

// S'authentifie à l'api, afin de gérer la session et récupérer le cookie nécessaire pour les autres requêtes
void fetchToken(String module_uid);
void saveToken(const String& token);
String loadToken();
#endif