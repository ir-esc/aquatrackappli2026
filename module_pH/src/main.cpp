#include "DFRobot_ESP_PH.h"
#include "Wifi.h"
#include "Arduino.h"
#include "Intervalle.h"
#include <HTTPClient.h>
#include <ArduinoJson.h>

#define ESPADC 4096.0
#define ESPVOLTAGE 3300
#define PH_PIN 34

DFRobot_ESP_PH ph;

float voltage = 0.0;
float phValue = 0.0;
float temperature = 25.0;

void setup() {
Serial.begin(115200);
ph.begin();

connexionWifi("IR", "G00dWave$");
configTime(3600, 3600, "pool.ntp.org");

int intervalle = getIntervalle();

if (intervalle > 0) {
  Serial.println(intervalle);
} else {
  Serial.println("Erreur récupération intervalle");
}
}

void envoiAPI(float phValue){
	struct tm timeinfo;

	getLocalTime(&timeinfo);
	char buffer[20];
	strftime(buffer, sizeof(buffer), "%Y-%m-%d %H:%M:%S", &timeinfo);
	String date = String(buffer);


    HTTPClient http;

    String url = "http://aquatrackapi.ir.lan/aqr/116/ppc";
    http.begin(url);
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<200> doc;
    doc["type_id"] = 2;
    doc["valeur"] = phValue;
    doc["date"] = date;

    String requestBody;
    serializeJson(doc, requestBody);

    int httpResponseCode = http.POST(requestBody);

    if (httpResponseCode > 0) {
        Serial.print("Code réponse: ");
        Serial.println(httpResponseCode);

        String response = http.getString();
        Serial.println(response);
    } else {
        Serial.print("Erreur requête: ");
        Serial.println(httpResponseCode);
    }

    http.end();
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


void loop() {
static unsigned long lastTime = millis();

if (millis() - lastTime >= (getIntervalle())*1000) {
lastTime = millis();

voltage = analogRead(PH_PIN) / ESPADC * ESPVOLTAGE;

phValue = ph.readPH(voltage, temperature);

Serial.print("Voltage: ");
Serial.println(voltage);
Serial.print("pH : ");
Serial.println(phValue, 1);
loginApi();
envoiAPI(phValue);
}
}