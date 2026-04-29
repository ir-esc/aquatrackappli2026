#include "Config_Fetcher.h"
#include <WiFi.h>
#include <ArduinoJson.h>
#include "Wifi_handling.h"
#include "Scheduler.h"

const int moduleId = 6;

void fetchConfig() {
    WiFiClient client;

    if (!client.connect("192.168.63.44", 80)) {
        Serial.println("Config: connexion échouée");
        return;
    }

    client.println("GET /mod/" + String(moduleId) + " HTTP/1.1");
    client.println("Host: aquatrackapi.ir.lan");
    client.println("Cookie: " + sessionCookie);
    client.println("accept: application/json");
    client.println("Connection: close");
    client.println();

    String response = "";
    while (client.connected() || client.available()) {
        if (client.available()) {
            response += client.readString();
        }
    }
    client.stop();

    // Premier parse — réponse complète de l'API
    int jsonStart = response.indexOf('{');
    if (jsonStart == -1) {
        Serial.println("Config: pas de JSON");
        return;
    }
    String json = response.substring(jsonStart);

    DynamicJsonDocument doc(1024);
    if (deserializeJson(doc, json) != DeserializationError::Ok) {
        Serial.println("Config: erreur JSON");
        return;
    }

    // On extrait le champ config
    String configStr = doc["config"].as<String>();

    // Deuxième parse — fait dans parseConfig() du scheduler
    scheduler.parseConfig(configStr);
}