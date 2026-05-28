#include "Horaire.h"
#include <HTTPClient.h>
#include <ArduinoJson.h>

Horaire horaires[MAX_HORAIRES];
bool deja_declenche[MAX_HORAIRES];
int nbHoraires = 0;

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
    JsonArray horairesJson = configDoc["horaires"];

    // Vérification présence horaires
    if (horairesJson.isNull()) {
        Serial.println("Champ horaires absent");
        return;
    }

    String horairesActuels = "";

    nbHoraires = 0;

    // Lecture des horaires
    for (JsonObject h : horairesJson) {
        if (nbHoraires >= MAX_HORAIRES) {
            Serial.println("Maximum horaires atteint");
            break;
        }
        // Récupération heure et minute
        horaires[nbHoraires].heure = h["heure"];
        horaires[nbHoraires].minute = h["minute"];

        // Construction chaîne horaires
        horairesActuels +=
            String(horaires[nbHoraires].heure)
            + "h"
            + String(horaires[nbHoraires].minute)
            + " ";
        nbHoraires++;
    }

    // Affichage seulement si changement
    if (horairesActuels != anciensHoraires) {
        Serial.println("Nouveaux horaires :");
        // Réaffichage détaillé
        for (int i = 0; i < nbHoraires; i++) {
            Serial.print("Horaire : ");
            Serial.print(horaires[i].heure);
            Serial.print("h");

            // Ajout d'un 0 devant les minutes si minute < 10
            if (horaires[i].minute < 10)
                Serial.print("0");
            Serial.println(horaires[i].minute);
            deja_declenche[i] = false;
        }
        anciensHoraires = horairesActuels;
    }
}