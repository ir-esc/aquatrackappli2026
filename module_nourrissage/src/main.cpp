#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "wifi_config.h"
#include "WifiManager.h"
#include "AuthAPI.h"
#include "ConfigAPI.h"
#include "MotorController.h"

MotorController moteur(25, 26, 27, 13);

WifiManager wifi;

AuthAPI auth;

ConfigAPI config;

unsigned long dernierRefresh = 0;

const char* ntpServer = "pool.ntp.org";

const long gmtOffset_sec = 3600 * 1;
const int daylightOffset_sec = 3600 * 1;

void setup() {
    Serial.begin(115200);
    moteur.begin();

    wifi.connexionWifi(ssid, password);
    configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);

    String token = auth.loadToken(); // Chargement du jeton depuis la mémoire flash au démarrage
    if (token == "") {
        Serial.println("Aucun token trouvé, fetchToken nécessaire");
        auth.fetchToken(WiFi.macAddress());
        Serial.println("Token récupéré et stocké : " + token);
    } else {
        Serial.println("Token trouvé en mémoire : " + token);
    }

    config.getConfigModule(auth.getToken());
}

void loop() {
    if (millis() - dernierRefresh > 15000) {
        config.getConfigModule(auth.getToken());
        dernierRefresh = millis();
    }

    struct tm timeinfo;

    if (!getLocalTime(&timeinfo)) {
        Serial.println("Failed to obtain time");
        return;
    }

    moteur.update(&timeinfo, config);

    delay(10);
}
