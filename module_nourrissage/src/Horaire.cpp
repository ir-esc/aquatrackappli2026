#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "Horaire.h"

void getHoraires() {

    static String anciensHoraires = "";

    HTTPClient http;

    String url = "http://aquatrackapi.ir.lan/mod/8";
    http.begin(url);

    int httpCode = http.GET();

    // Vérification HTTP
    if (httpCode <= 0) {
        Serial.print("Erreur HTTP : ");
        Serial.println(httpCode);

        http.end();
        return;
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
        return;
    }

    // Récupération du champ config
    const char* configStr = doc["config"];

    if (!configStr) {
        Serial.println("Champ config absent");
        return;
    }

    // Parsing JSON contenu dans config
    JsonDocument configDoc;

    err = deserializeJson(configDoc, configStr);

    if (err) {
        Serial.print("Erreur JSON config : ");
        Serial.println(err.c_str());
        return;
    }

    // Récupération tableau horaires
    JsonArray horaires = configDoc["horaires"];

    // Vérification présence horaires
    if (horaires.isNull()) {
        Serial.println("Champ horaires absent");
        return;
    }

    String horairesActuels = "";

    // Lecture des horaires
    for (JsonObject h : horaires) {

        // Récupération heure et minute
        int heure = h["heure"];
        int minute = h["minute"];

        // Construction chaîne horaires
        horairesActuels += String(heure);
        horairesActuels += "h";
        horairesActuels += String(minute);
        horairesActuels += " ";
    }

    // Affichage seulement si changement
    if (horairesActuels != anciensHoraires) {
        Serial.println("Nouveaux horaires :");
        // Réaffichage détaillé
        for (JsonObject h : horaires) {
            int heure = h["heure"];
            int minute = h["minute"];
            Serial.print("Horaire : ");
            Serial.print(heure);
            Serial.print("h");
            // Ajout d'un 0 devant les minutes si minute < 10
            if (minute < 10) {
                Serial.print("0");
            }
            Serial.println(minute);
        }

        anciensHoraires = horairesActuels;
    }
}

