#include "ConfigAPI.h"
#include <HTTPClient.h>
#include <ArduinoJson.h>

Horaire horaires[MAX_HORAIRES];

int nbHoraires = 0;

int intervalle = 0;

bool modeIntervalle = false;
bool modeHoraires = false;

void getConfigModule() {

    HTTPClient http;

    String url = "http://aquatrackapi.ir.lan/mod/8";

    http.begin(url);

    int httpCode = http.GET();

    if (httpCode <= 0) {

        Serial.print("Erreur HTTP : ");
        Serial.println(httpCode);

        http.end();
        return;
    }

    String payload = http.getString();

    http.end();

    JsonDocument doc;

    DeserializationError err = deserializeJson(doc, payload);

    if (err) {

        Serial.print("Erreur JSON principal : ");
        Serial.println(err.c_str());

        return;
    }

    const char* configStr = doc["config"];

    if (!configStr) {

        Serial.println("Champ config absent");

        return;
    }

    JsonDocument configDoc;

    err = deserializeJson(configDoc, configStr);

    if (err) {

        Serial.print("Erreur JSON config : ");
        Serial.println(err.c_str());

        return;
    }

    // reset des modes
    modeIntervalle = false;
    modeHoraires = false;

    // mode intervalle
    if (configDoc["intervalle"]) {

        intervalle = configDoc["intervalle"];

        modeIntervalle = true;

        Serial.println("Mode intervalle");

        Serial.print("Intervalle : ");
        Serial.print(intervalle);
        Serial.println(" secondes");
    }

    // mode horaire
    if (configDoc["horaires"]) {

        JsonArray horairesJson = configDoc["horaires"];

        nbHoraires = 0;

        for (JsonObject h : horairesJson) {

            if (nbHoraires >= MAX_HORAIRES)
                break;

            horaires[nbHoraires].heure = h["heure"];
            horaires[nbHoraires].minute = h["minute"];

            nbHoraires++;
        }

        modeHoraires = true;

        Serial.println("Mode horaires");

        for (int i = 0; i < nbHoraires; i++) {

            Serial.print("Horaire : ");

            Serial.print(horaires[i].heure);
            Serial.print("h");

            if (horaires[i].minute < 10)
                Serial.print("0");

            Serial.println(horaires[i].minute);
        }
    }
}
