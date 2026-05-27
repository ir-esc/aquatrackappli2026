#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "Intervalle.h"

int getIntervalle() {

    static int dernierIntervalle = -999;

    HTTPClient http;

    String url = "http://aquatrackapi.ir.lan/mod/8";
    http.begin(url);

    int httpCode = http.GET();

    // Vérification HTTP
    if (httpCode <= 0) {
        Serial.print("Erreur HTTP : ");
        Serial.println(httpCode);

        http.end();
        return -1;
    }

    // Lecture réponse
    String payload = http.getString();
    http.end();

    // Parsing JSON principal
    JsonDocument doc;

    DeserializationError err = deserializeJson(doc, payload);

    if (err) {
        Serial.print("Erreur JSON principal : ");
        Serial.println(err.c_str());
        return -2;
    }

    // Récupération du champ config
    const char* configStr = doc["config"];

    if (!configStr) {
        Serial.println("Champ config absent");
        return -3;
    }

    // Parsing JSON contenu dans config
    JsonDocument configDoc;

    err = deserializeJson(configDoc, configStr);

    if (err) {
        Serial.print("Erreur JSON config : ");
        Serial.println(err.c_str());
        return -4;
    }

    // Vérifie présence intervalle
    if (!configDoc.containsKey("intervalle")) {
        Serial.println("Champ intervalle absent");
        return -5;
    }

    int intervalle = configDoc["intervalle"];

    // Affiche seulement si changement
    if (intervalle != dernierIntervalle) {

        Serial.print("Nouvel intervalle : ");
        Serial.println(intervalle);

        dernierIntervalle = intervalle;
    }

    return intervalle;
}

