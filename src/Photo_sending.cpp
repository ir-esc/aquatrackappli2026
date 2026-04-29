#include "Photo_sending.h"
#include <HTTPClient.h>
#include <WiFi.h>
#include <ArduinoJson.h>
#include "Wifi_handling.h"

const char* server = "aquatrackapi.ir.lan"; 
const int aquariumId = 116; // ID de ton aquarium

// ================== Création de l'observation ==================
int createObservation() {
    WiFiClient client;

    if (!client.connect("aquatrackapi.ir.lan", 80)) {
        Serial.println("Connexion échouée");
        return -1;
    }
struct tm timeinfo;
getLocalTime(&timeinfo);
char buffer[30];
strftime(buffer, sizeof(buffer), "%Y-%m-%dT%H:%M:%S.000Z", &timeinfo);
String date = String(buffer);

String body = "{\"texte\":\"Photo ESP32\",\"date\":\"" + date + "\"}";

    client.println("POST /aqr/" + String(aquariumId) + "/obs HTTP/1.1");
    client.println("Host: aquatrackapi.ir.lan");
    client.println("Content-Type: application/json");
    client.println("Cookie: " + sessionCookie);
    client.println("accept: application/json");
    client.println("Content-Length: " + String(body.length()));
    client.println();
    client.print(body);

    // Lire réponse complète
    String response = "";
    while (client.connected() || client.available()) {
        if (client.available()) {
            response += client.readString();
        }
    }
    client.stop();

    Serial.println("Réponse obs: " + response);

    // Extraire juste le JSON (après les headers HTTP)
    int jsonStart = response.indexOf('{');
    if (jsonStart == -1) {
        Serial.println("Pas de JSON dans la réponse");
        return -1;
    }
    String json = response.substring(jsonStart);
    Serial.println("JSON extrait: " + json);

    DynamicJsonDocument doc(1024);
    if (deserializeJson(doc, json) != DeserializationError::Ok) {
        Serial.println("Erreur JSON");
        return -1;
    }

    int obsId = doc["id"];
    Serial.println("Observation ID: " + String(obsId));
    return obsId;
}

// ================== Ajout media à l'observation ==================
void addMediaToObservation(int obsId, camera_fb_t* fb) {
    if (!fb || obsId < 0) return;

    WiFiClient client;
    int port = 80;
    String boundary = "----ESP32CamBoundary";

    if (!client.connect(server, port)) {
        Serial.println("Connexion échouée");
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
    client.println("Host: aquatrackapi.ir.lan");
    client.println("Content-Type: multipart/form-data; boundary=" + boundary);
    client.println("Cookie: " + sessionCookie);
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

    Serial.println("Media upload terminé");
    client.stop();
}