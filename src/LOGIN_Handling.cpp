#include "LOGIN_Handling.h"
#include <Arduino.h>
#include <WiFi.h>
#include <ArduinoJson.h>
#include "Wifi_handling.h"

void loginAPI() {
    WiFiClient client; // On utilise WiFiClient directement pour mieux contrôler la requête et lire la réponse complète

    if (!client.connect("192.168.63.44", 80)) {
        Serial.println("Login: connexion échouée");
        return;
    }

    // Préparer le corps de la requête avec les identifiants, temporaire car il faudrait créer un utilisateur admin special esp32 dans l'API
    String body = "{\"email\":\"Alex@ir.lan\",\"motdepasse\":\"Alex1234\"}";


    client.println("POST /log HTTP/1.1");
    client.println("Host: aquatrackapi.ir.lan");
    client.println("Content-Type: application/json");
    client.println("accept: application/json");
    client.println("Content-Length: " + String(body.length()));
    client.println();
    client.print(body);

    String response = "";
    while (client.connected() || client.available()) {
        if (client.available()) {
            response += client.readString();
        }
    }

     // extraire le cookie de session
    int cookieStart = response.indexOf("ci_session=");
    if (cookieStart != -1) {
        int cookieEnd = response.indexOf(";", cookieStart);
        sessionCookie = response.substring(cookieStart, cookieEnd);
        Serial.println("Cookie stocké: " + sessionCookie);
    } else {
        Serial.println("Pas de cookie dans la réponse");
    }
    client.stop();

    Serial.println("Réponse login: " + response);
}