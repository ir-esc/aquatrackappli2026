#include "Wifi_handling.h"

WiFiServer localserver(80);

const char* ssid = "IRO";
const char* password = "Cirrus=14014";

String sessionCookie = "";

  
void initWiFi() {
    WiFi.setHostname("esp32cam");
    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
    }




Serial.println("WiFi connecté");
    Serial.println(WiFi.localIP());

    configTime(3600, 3600, "pool.ntp.org");

    struct tm timeinfo;
    if (!getLocalTime(&timeinfo, 10000)) {
        Serial.println("Echec NTP");
    } else {
        Serial.println("NTP OK");
    }


    localserver.begin(); 
}