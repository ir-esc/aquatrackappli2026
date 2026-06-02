#include "Config_Fetcher.h"
#include <WiFi.h>
#include <ArduinoJson.h>
#include "Wifi_handling.h"
#include "Scheduler.h"
#include "LOGIN_Handling.h"

int aquariumId = -1; // Valeur par défaut, sera mise à jour dans fetchConfig() après récupération de la config depuis l'API

void fetchConfig() {
    WiFiClient client; // On utilise WiFiClient directement pour mieux contrôler la requête et lire la réponse complète

    if (!client.connect("192.168.63.44", 80)) {
        Serial.println("Config: connexion échouée");
        return;
    }

    client.println("GET /mod/0 HTTP/1.1");
    client.println("Host: aquatrackapi.ir.lan");
    client.println("Authorization: Bearer " + moduleToken);
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
    // On extrait aussi le aquarium_id pour l'utiliser dans les autres fonctions qui font des requêtes à l'API
    aquariumId = doc["aquarium_id"].as<int>();
    // Deuxième parse — fait dans parseConfig() du scheduler
    scheduler.parseConfig(configStr);
}