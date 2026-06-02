#include "Wifi_handling.h"

WiFiServer localserver(80);

const char* ssid = "IRO";
const char* password = "Cirrus=14014";

String sessionCookie = "";
  
void initWiFi() {
    WiFi.setHostname("esp32cam"); // optionnel, mais ça peut aider à identifier l'appareil dans le routeur ou les logs de l'API
    WiFi.begin(ssid, password);
    // On attend la connexion WiFi avant de continuer, sinon les requêtes à l'API échoueront
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
    }




    Serial.println("WiFi connecté");
    Serial.println(WiFi.localIP());

    configTime(3600, 3600, "pool.ntp.org"); // On configure le NTP pour avoir l'heure, ce qui est nécessaire pour les timestamps des observations et pour la logique de scheduler si on utilise le mode "schedule"
    // On attend d'avoir l'heure avant de continuer, sinon les timestamps des observations seront à 1970 et la logique de scheduler basée sur l'heure ne fonctionnera pas
    struct tm timeinfo;
    if (!getLocalTime(&timeinfo, 10000)) {
        Serial.println("Echec NTP");
    } else {
        Serial.println("NTP OK");
    }


    localserver.begin(); 
}