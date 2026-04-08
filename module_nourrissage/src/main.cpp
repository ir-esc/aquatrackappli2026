#include <Arduino.h>
#include <WiFi.h>
#include "time.h"
#include "wifi_config.h"

const char* ntpServer = "pool.ntp.org";		//Serveur NTP
const long  gmtOffset_sec = 3600 * 1;
const int   daylightOffset_sec = 3600 * 1;  //Heure d'été

void setup() {
Serial.begin(115200);
delay(1000);

WiFi.begin(ssid, password);
Serial.println("\nConnecting");

while (WiFi.status() != WL_CONNECTED) {
 Serial.print(".");
 delay(100);
}

Serial.println("\nConnected to the WiFi network");
Serial.print("Local ESP32 IP: ");
Serial.println(WiFi.localIP());

//Configuration du serveur NTP
configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
}

void loop() {
struct tm timeinfo;
if (!getLocalTime(&timeinfo)) {
 Serial.println("Failed to obtain time");
}
Serial.println(&timeinfo, "%A, %B %d %Y %H:%M:%S");
delay(1000);
}
