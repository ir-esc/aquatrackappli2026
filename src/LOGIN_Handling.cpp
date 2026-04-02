#include "Login_handling.h"
#include <Arduino.h>

void loginAPI() {
    HTTPClient http;

    String url = "http://aquatrackapi.ir.lan/log";
    http.begin(url);

    http.addHeader("Content-Type", "application/json");
    http.addHeader("accept", "application/json");

    String body = R"({
        "email": "Alex@ir.lan",
        "motdepasse": "motdepasse"
    })";

    Serial.println("Envoi requête login...");

    int httpCode = http.POST(body);

    if (httpCode > 0) {
        Serial.print("Code HTTP: ");
        Serial.println(httpCode);

        String response = http.getString();
        Serial.println("Réponse serveur:");
        Serial.println(response);
    } else {
        Serial.print("Erreur HTTP: ");
        Serial.println(httpCode);
    }

    http.end();
}