#include "Login_handling.h"
#include <Arduino.h>
#include <WiFi.h>
#include <ArduinoJson.h>
#include "Wifi_handling.h"

void loginAPI() {
    WiFiClient client;

    if (!client.connect("192.168.63.44", 80)) {
        Serial.println("Login: connexion échouée");
        return;
    }

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
    client.stop();

    Serial.println("Réponse login: " + response);
}