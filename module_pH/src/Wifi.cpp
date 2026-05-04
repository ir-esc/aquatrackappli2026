#include <WiFi.h>
#include "Wifi.h"
#include "Arduino.h"


void connexionWifi(const char* ssid, const char* password) {
    Serial.print("Connexion au WiFi...");

    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }

    Serial.println("\nConnecté !");
    Serial.print("Adresse IP : ");
    Serial.println(WiFi.localIP());
}