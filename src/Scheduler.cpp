#include "Scheduler.h"

Scheduler scheduler; // Instance globale du scheduler, pour que main.cpp puisse y accéder facilement

Scheduler::Scheduler() {
    mode = "interval";
    intervalle_ms = 1000000; // valeur par défaut très grande pour ne pas prendre de photo avant d'avoir la config de l'API
    jour = 0;
    heure = 0;
    minute = 0;
    derniere_minute = -1;
}
// Parse la config reçue de l'API et met à jour les paramètres du scheduler
void Scheduler::parseConfig(String configStr) {
    DynamicJsonDocument doc(512);
    if (deserializeJson(doc, configStr) != DeserializationError::Ok) {
        Serial.println("Erreur parsing config");
        return;
    }

    mode = doc["mode"].as<String>(); // "interval" ou "schedule"
    // Selon le mode, on parse les paramètres correspondants
    if (mode == "interval") {
        intervalle_ms = (long)doc["interval"] * 1000;
        Serial.println("Mode interval: " + String(intervalle_ms / 1000) + "s");
    } else if (mode == "schedule") {
        jour   = doc["day"];
        heure  = doc["hour"];
        minute = doc["minute"];
        Serial.println("Mode schedule: jour=" + String(jour) + " " + String(heure) + "h" + String(minute));
    }
}

// Vérifie si selon la config actuelle, il est temps de prendre une photo
bool Scheduler::doitPrendrePhoto() {
    struct tm timeinfo;
    if (!getLocalTime(&timeinfo)) return false;

    bool ok = (timeinfo.tm_wday == jour)   &&
              (timeinfo.tm_hour == heure)  &&
              (timeinfo.tm_min  == minute) &&
              (derniere_minute  != minute); // on vérifie que la minute a changé depuis la dernière fois pour éviter de prendre plusieurs photos dans la même minute si loop() s'exécute plusieurs fois

    if (ok) derniere_minute = minute;
    return ok; // on retourne true seulement si c'est le bon jour/heure/minute et que la minute a changé depuis la dernière photo, pour éviter les doublons
}