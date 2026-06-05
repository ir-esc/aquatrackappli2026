#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "AuthAPI.h"
#include <Preferences.h>

String AuthAPI::getToken() {
    return moduleToken;
}

// Sauvegarde du jeton
void AuthAPI::saveToken(const String& token) {
  Preferences prefs;
  prefs.begin("aquatrack", false);
  prefs.putString("token", token);
  prefs.end();
}

// Lecture du jeton
String AuthAPI::loadToken() {
  Preferences prefs;
  prefs.begin("aquatrack", true);
  moduleToken = prefs.getString("token", "");
  prefs.end();
  return moduleToken;
}

void AuthAPI::fetchToken(String module_uid) {
    HTTPClient http;

    String url = "http://aquatrackapi.ir.lan/ass";

    http.begin(url);

    http.addHeader("Content-Type", "application/json");

    String body = "{\"module_uid\":\"" + module_uid + "\"}";

    int httpCode = http.POST(body);

    Serial.print("HTTP Code : ");
    Serial.println(httpCode);

    if (httpCode <= 0) {
        Serial.println("Erreur HTTP");
        http.end();
        return;
    }

    String payload = http.getString();

    http.end();

    Serial.println(payload);

    JsonDocument doc;

    DeserializationError err = deserializeJson(doc, payload);

    if (err) {
        Serial.print("Erreur JSON : ");
        Serial.println(err.c_str());
        return;
    }

    // Récupération du jeton
    if (doc["jeton"]) {
        moduleToken = doc["jeton"].as<String>();
        saveToken(moduleToken);
        Serial.println("Jeton sauvegardé : " + moduleToken);
    } else {
        Serial.println("Champ jeton absent");
    }
}
