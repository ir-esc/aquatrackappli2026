#include <Arduino.h>
#include <WiFi.h>
#include "time.h"
#include "wifi_config.h"

int ENA = 25;
int IN1 = 26;
int IN2 = 27;
int CONTACTEUR = 13;

int etat_moteur = 2;
unsigned long temps_rebond = 0;

int heure_declenchement = 14;
int minute_declenchement = 32;

bool deja_declenche = false;    // permet d'éviter plusieurs déclenchements

const char* ntpServer = "pool.ntp.org";
const long  gmtOffset_sec = 3600 * 1;
const int   daylightOffset_sec = 3600 * 1;  //Heure d'été

void setup() {
   pinMode(IN1, OUTPUT);
   pinMode(IN2, OUTPUT);
   pinMode(ENA, OUTPUT);
   pinMode(CONTACTEUR, INPUT_PULLUP);
   Serial.begin(115200);
   delay(1000);

   WiFi.begin(ssid, password);
   Serial.println("\nConnecting");

   while (WiFi.status() != WL_CONNECTED) {
       Serial.print(".");
       delay(100);
   }

   Serial.println("\nConnected to the Wifi network");
   Serial.println(WiFi.localIP());

   configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
}

void loop() {
   struct tm timeinfo;

   if (!getLocalTime(&timeinfo)) {
       Serial.println("Failed to obtain time");
       return;
   }

   Serial.println(&timeinfo, "%H:%M:%S");

   // moteur arrêté sur contacteur
   if (etat_moteur == 2) {
       if (timeinfo.tm_hour == heure_declenchement && timeinfo.tm_min  == minute_declenchement && !deja_declenche) {
           digitalWrite(ENA, HIGH);
           digitalWrite(IN1, LOW);
           digitalWrite(IN2, HIGH);

           etat_moteur = 0;
           deja_declenche = true;
       }
   }

   // reset du déclenchement
   if (timeinfo.tm_min != minute_declenchement) {
       deja_declenche = false;
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
               digitalWrite(IN1, LOW);
               digitalWrite(IN2, LOW);
               digitalWrite(ENA, LOW);

               etat_moteur = 2;
           } else {
               etat_moteur = 1;
           }
       }
   }
   delay(100);
}
