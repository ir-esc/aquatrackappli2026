#include "ConfigAPI.h"
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "AuthAPI.h"

void ConfigAPI::getConfigModule(String token) {

    HTTPClient http;

    String url = "http://aquatrackapi.ir.lan/mod/0";

    http.begin(url);

    http.addHeader("Authorization", "Bearer " + token);

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
        Serial.println("h");
    }

    // mode horaire
    if (configDoc["horaires"]) {

        JsonArray horairesJson = configDoc["horaires"];

        nbHoraires = 0;

        for (JsonObject h : horairesJson) {

            if (nbHoraires >= MAX_HORAIRES)
                break;

            horaires[nbHoraires].jour = h["jour"];
			if (horaires[nbHoraires].jour == 7) {
				horaires[nbHoraires].jour = 0;
			}
            horaires[nbHoraires].heure = h["heure"];

            nbHoraires++;
        }

        modeHoraires = true;

        Serial.println("Mode horaires");

        for (int i = 0; i < nbHoraires; i++) {

			Serial.print("Jour : ");
            Serial.println(horaires[i].jour);

			Serial.print("Heure : ");
            Serial.println(horaires[i].heure);
        }
    }

// Getters
bool ConfigAPI::isModeIntervalle()
{
    return modeIntervalle;
}

bool ConfigAPI::isModeHoraires()
{
    return modeHoraires;
}

int ConfigAPI::getIntervalle()
{
    return intervalle;
}

Horaire* ConfigAPI::getHoraires()
{
    return horaires;
}

int ConfigAPI::getNbHoraires()
{
    return nbHoraires;
}

}
