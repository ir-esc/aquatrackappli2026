#include <Arduino.h>
#include <WiFi.h>
#include <time.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "wifi_config.h"
#include "WifiManager.h"

void setup() {
    Serial.begin(115200);

    connexionWifi(ssid, password);
    configTime(3600, 3600, "pool.ntp.org");
}

void loginApi() {
    HTTPClient http;

    http.begin("http://aquatrackapi.ir.lan/log");

    http.addHeader("Content-Type", "application/json");

    String body = "{";
    body += "\"email\":\"Alex@ir.lan\",";
    body += "\"motdepasse\":\"Alex1234\"";
    body += "}";

    int code = http.POST(body);

    Serial.print("Login code: ");
    Serial.println(code);
    Serial.println(http.getString());

    http.end();
}

void envoiAPI() {
    struct tm timeinfo;

    getLocalTime(&timeinfo);
    char buffer[20];
    strftime(buffer, sizeof(buffer), "%Y-%m-%d %H:%M:%S", &timeinfo);
    String date = String(buffer);

    HTTPClient http;

    //URL complète
    String url = "http://aquatrackapi.ir.lan/aqr/116/obs";
    http.begin(url);

    //Header JSON
    http.addHeader("Content-Type", "application/json");

    //Corps de la requète
    StaticJsonDocument<200> doc;
    doc["texte"] = "test nourrissage";
    doc["date"] = date;

    String requestBody;
    serializeJson(doc, requestBody);

    //Envoi POST
    int httpResponseCode = http.POST(requestBody);

    if (httpResponseCode > 0) {
        Serial.print("Code HTTP : ");
        Serial.println(httpResponseCode);

        String response = http.getString();
        Serial.println("Réponse : " + response);
    } else {
        Serial.print("Erreur requète : ");
        Serial.println(httpResponseCode);
    }

    http.end();
}

void loop() {
    loginApi();
    envoiAPI();
    delay(30000);
}