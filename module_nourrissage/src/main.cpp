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

//tableau pour effectuer plusieurs déclenchements à des horaires différents
int horaires[] [2] = {
   {16,25},
   {16,27},
   {16,31},
   {16,34}
};
const int NB_HORAIRES = sizeof(horaires) / sizeof(horaires[0]);     //permet de calculer le nombre de ligne du tableau

bool deja_declenche[NB_HORAIRES];    //permet de réaliser un seul déclenchement à la fois

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

   for (int i = 0; i < NB_HORAIRES; i++) {
       deja_declenche[i] = false;
   }

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
       for (int i = 0; i < NB_HORAIRES; i++) {
           if (timeinfo.tm_hour == horaires[i][0] && timeinfo.tm_min  == horaires[i][1] && !deja_declenche[i]) {
               digitalWrite(ENA, HIGH);
               digitalWrite(IN1, LOW);
               digitalWrite(IN2, HIGH);
               etat_moteur = 0;
               deja_declenche[i] = true;
           }
           // reset du déclenchement
           if (timeinfo.tm_min != horaires[i][1]) {
               deja_declenche[i] = false;
           }
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
