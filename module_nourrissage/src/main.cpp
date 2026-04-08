#include <Arduino.h>
#include <WiFi.h>
#include "time.h"
#include "wifi_config.h"

int ENA=25;
int IN1=26;
int IN2=27;
int CONTACTEUR=13;

int etat_moteur = 2;
unsigned long temps_rebond = 0;

const char* ntpServer = "pool.ntp.org";
const long  gmtOffset_sec = 3600 * 1;
const int   daylightOffset_sec = 3600 * 1;	//Heure d'été

void setup() {
pinMode(IN1,OUTPUT);
pinMode(IN2,OUTPUT);
pinMode(ENA,OUTPUT);
pinMode(CONTACTEUR, INPUT_PULLUP);
Serial.begin(115200);
delay(1000);

WiFi.begin(ssid, password);
Serial.println("\nConnecting");

while (WiFi.status() != WL_CONNECTED) {
  Serial.print(".");
  delay(100);
}

Serial.println("\nConnected to the WiFi network");
Serial.print("Local ESP32 IP: ");
Serial.println(WiFi.localIP());

// On configure le seveur NTP
configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
}

void loop() {
struct tm timeinfo;
if (!getLocalTime(&timeinfo)) {
 Serial.println("Failed to obtain time");
}
Serial.println(&timeinfo, "%A, %B %d %Y %H:%M:%S");
delay(1000);

// moteur arrêté sur contacteur
 if (etat_moteur == 2) {
     if (timeinfo.tm_hour == 10 && timeinfo.tm_min == 25) {
         digitalWrite(ENA,HIGH);
         digitalWrite(IN1,LOW);
         digitalWrite(IN2,HIGH);
         etat_moteur = 0;
     }
 }

 // quitter le contacteur
 if (etat_moteur == 0) {
     if (digitalRead(CONTACTEUR) == HIGH) {
         etat_moteur = 1;
     }
 }

 // moteur en rotation
 if (etat_moteur == 1) {
     if (digitalRead(CONTACTEUR) == LOW) {
         temps_rebond = millis();
         etat_moteur = 3;
     }
 }

 // anti rebond
 if (etat_moteur == 3) {
     if (millis() - temps_rebond > 30) {
         if (digitalRead(CONTACTEUR) == LOW) {
             digitalWrite(IN1,LOW);
             digitalWrite(IN2,LOW);
             etat_moteur = 2;
         }
         else {
             etat_moteur = 1;
         }
     }
 }
}
