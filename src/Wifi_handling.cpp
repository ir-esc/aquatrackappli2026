#include "Wifi_handling.h"

WiFiServer localserver(80);
const char* photoServerURL = "http://aquatrackapi.ir.lan/aqr/1/med";
const char* ssid = "Redmi Note 11S";
const char* password = "ezzzzzzz";

String logsBuffer = "";  // buffer global

void wifiLog(const String &msg) {
    logsBuffer += msg + "\n";
    // Optionnel : limite la taille du buffer pour éviter de saturer
    if (logsBuffer.length() > 4000) logsBuffer = logsBuffer.substring(logsBuffer.length() - 4000);
}

void initWiFi() {
    WiFi.setHostname("esp32cam");
    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
    }

    Serial.println("WiFi connecté");
    Serial.println(WiFi.localIP());

    configTime(3600, 0, "pool.ntp.org");

    struct tm timeinfo;
    if (!getLocalTime(&timeinfo, 10000)) {
        Serial.println("Echec NTP");
    } else {
        Serial.println("NTP OK");
    }

    localserver.begin(); 
}