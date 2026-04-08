#include <Arduino.h>
#include <WiFi.h>
#include "wifi_config.h"

void setup() {
   Serial.begin(115200);
   delay(1000);

   WiFi.begin(ssid, password);
   Serial.print("\nConnecting");

   // Attente de la connexion
   while (WiFi.status() != WL_CONNECTED) {
       Serial.print(".");
       delay(1000);
}

  Serial.println("\nConnected to the Wifi network");
  Serial.print("Local ESP32 IP: ");
  Serial.println(WiFi.localIP());
}

void loop() {}
