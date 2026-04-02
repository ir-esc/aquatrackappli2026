#include "Photo_sending.h"
#include <HTTPClient.h>
#include <WiFi.h>
#include <ArduinoJson.h>
#include "Wifi_handling.h"

const char* server = "aquatrackapi.ir.lan";
const int aquariumId = 11; // ID de ton aquarium

// ================== Création de l'observation ==================
int createObservation() {
    HTTPClient http;
    String url = "http://" + String(server) + "/aqr/" + String(aquariumId) + "/obs";
    http.begin(url);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("accept", "application/json");

    String body = R"({
        "texte": "Test ESP32",
        "date": "2026-03-23T09:25:57.627Z",
        "media_id": 2
    })";

    int httpCode = http.POST(body);

    if (httpCode > 0) {
        String response = http.getString();
        Serial.println("Réponse obs:");
        Serial.println(response);

        DynamicJsonDocument doc(1024);
        DeserializationError error = deserializeJson(doc, response);
        if (!error) {
            int obsId = doc["id"];
            wifiLog("Observation ID: ");
            Serial.println(obsId);
            http.end();
            return obsId;
        } else {
            wifiLog("Erreur JSON");
        }
    } else {
        wifiLog("Erreur HTTP: ");
        Serial.println(httpCode);
    }

    http.end();
    return -1; // erreur
}

// ================== Ajout media à l'observation ==================
void addMediaToObservation(int obsId, camera_fb_t* fb) {
    if (!fb || obsId < 0) return;

    WiFiClient client;
    int port = 80;
    String boundary = "----ESP32CamBoundary";

    if (!client.connect(server, port)) {
        wifiLog("Connexion échouée");
        return;
    }

    String url = "/obs/" + String(obsId) + "/med";
    String fieldName = "media";

    String bodyStart =
        "--" + boundary + "\r\n"
        "Content-Disposition: form-data; name=\"" + fieldName + "\"; filename=\"photo.jpg\"\r\n"
        "Content-Type: image/jpeg\r\n\r\n";

    String bodyEnd = "\r\n--" + boundary + "--\r\n";
    int contentLength = bodyStart.length() + fb->len + bodyEnd.length();

    // Header HTTP
    client.println("POST " + url + " HTTP/1.1");
    client.println("Host: " + String(server));
    client.println("Content-Type: multipart/form-data; boundary=" + boundary);
    client.println("Content-Length: " + String(contentLength));
    client.println();

    // Envoi body
    client.print(bodyStart);
    client.write(fb->buf, fb->len);
    client.print(bodyEnd);

    // Lire réponse
    while (client.connected()) {
        String line = client.readStringUntil('\n');
        Serial.println(line);
        if (line == "\r") break;
    }

    wifiLog("Media upload terminé");
    client.stop();
}