#include <WiFi.h>
#include "WifiManager.h"
#include <Arduino.h>

void connexionWifi(const char* ssid, const char* password) {
    WiFi.begin(ssid, password);

    Serial.println("\nConnecting");

    while (WiFi.status() != WL_CONNECTED) {
        Serial.print(".");
        delay(100);
    }

    Serial.println("\nConnected to WiFi network");
    Serial.println(WiFi.localIP());
}