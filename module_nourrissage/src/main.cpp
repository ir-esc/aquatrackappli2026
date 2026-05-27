#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "wifi_config.h"
#include "WifiManager.h"
#include "Login.h"
#include "Horaire.h"

void setup() {
    Serial.begin(115200);
    connexionWifi(ssid, password);
    loginApi();
}

void loop() {
	getHoraires();
	delay(2000);
}