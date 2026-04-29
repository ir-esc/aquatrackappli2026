#include "Scheduler.h"

Scheduler scheduler;

Scheduler::Scheduler() {
    mode = "interval";
    intervalle_ms = 1000000;
    jour = 0;
    heure = 0;
    minute = 0;
    derniere_minute = -1;
}

void Scheduler::parseConfig(String configStr) {
    DynamicJsonDocument doc(256);
    if (deserializeJson(doc, configStr) != DeserializationError::Ok) {
        Serial.println("Erreur parsing config");
        return;
    }

    mode = doc["mode"].as<String>();

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

bool Scheduler::doitPrendrePhoto() {
    struct tm timeinfo;
    if (!getLocalTime(&timeinfo)) return false;

    bool ok = (timeinfo.tm_wday == jour)   &&
              (timeinfo.tm_hour == heure)  &&
              (timeinfo.tm_min  == minute) &&
              (derniere_minute  != minute);

    if (ok) derniere_minute = minute;
    return ok;
}