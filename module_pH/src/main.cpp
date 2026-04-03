#include <Arduino.h>
#include <WiFi.h>

const char* ssid = "IR";
const char* password = "G00dWave$";

void setup() {
    Serial.begin(115200);
    delay(1000);

    Serial.print("Connexion au WiFi ");
    Serial.println(ssid);

    WiFi.begin(ssid, password);


    int retry = 0;
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.print(".");
        retry++;
        if(retry > 20){
            Serial.println("\nImpossible de se connecter au WiFi.");
            return;
        }
    }

    Serial.println("\nConnecté !");
    Serial.print("Adresse IP : ");
    Serial.println(WiFi.localIP());
}

void loop() {

}
