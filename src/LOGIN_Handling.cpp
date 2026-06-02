#include "LOGIN_Handling.h"
#include <Arduino.h>
#include <WiFi.h>
#include <ArduinoJson.h>
#include "Wifi_handling.h"
#include <Preferences.h>

// Sauvegarder le token
void saveToken(const String& token) {
  Preferences prefs;
  prefs.begin("aquatrack", false);  // namespace
  prefs.putString("token", token);
  prefs.end();
}

// Lire le token
String loadToken() {
  Preferences prefs;
  prefs.begin("aquatrack", true);   // true = lecture seule
  String token = prefs.getString("token", "");  // "" = valeur par défaut
  prefs.end();
  return token;
}


void fetchToken(String module_uid) {
    WiFiClient client;

    if (!client.connect("192.168.63.44", 80)) {
        Serial.println("Token: connexion échouée");
        return;
    }

    String body = "{ \"module_uid\": \"" + String(module_uid) + "\" }";
    client.println("POST /ass HTTP/1.1");
    client.println("Host: aquatrackapi.ir.lan");
    client.println("Content-Type: application/json");
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
    Serial.println("Réponse /ass : " + response);
     int jsonStart = response.indexOf('{');
    if (jsonStart == -1) {
        Serial.println("Pas de JSON dans la réponse");
        return;
    }
    String json = response.substring(jsonStart);

    DynamicJsonDocument doc(1024);
    if (deserializeJson(doc, json) != DeserializationError::Ok) {
        Serial.println("Erreur parsing JSON");
        return;
    }

    //Récupère le jeton 
    if (doc.containsKey("jeton")) {
        moduleToken = doc["jeton"].as<String>();
        saveToken(moduleToken);
        Serial.println("Token stocké : " + moduleToken);
    } else {
        Serial.println("Champ token introuvable dans la réponse");
    }
}

