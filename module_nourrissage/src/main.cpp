#include <Arduino.h>

int ENA=25;
int IN1=26;
int IN2=27;
int CONTACTEUR=13;
int BOUTON = 12;

int etat_moteur = 2;
unsigned long temps_rebond = 0;

void setup(){
  pinMode(IN1,OUTPUT);
  pinMode(IN2,OUTPUT);
  pinMode(ENA,OUTPUT);
  pinMode(CONTACTEUR, INPUT_PULLUP);
  pinMode(BOUTON, INPUT_PULLUP);
}

void loop() {
   // moteur arrêté sur contacteur
   if (etat_moteur == 2) {
       if (digitalRead(BOUTON) == LOW) {
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
