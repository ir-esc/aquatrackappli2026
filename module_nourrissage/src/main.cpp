#include <Arduino.h>

int ENA=25;
int IN1=26;
int IN2=27;
int CONTACTEUR=13;
int BOUTON = 12; //pour simuler la demande de nourrissage
int etat_moteur = 0;        // état du moteur à 0 donc à l’arrêt

void setup(){
   pinMode(IN1,OUTPUT);
   pinMode(IN2,OUTPUT);
   pinMode(ENA,OUTPUT);
   pinMode(CONTACTEUR, INPUT_PULLUP);
   pinMode(BOUTON, INPUT_PULLUP);
   Serial.begin(115200);
}

void loop() {
    if (etat_moteur == 0) {
        if (digitalRead(BOUTON) == LOW) {
            etat_moteur = 1;	//marche
            digitalWrite(ENA,HIGH);
            digitalWrite(IN1,LOW);
            digitalWrite(IN2,HIGH);
    }
}

    if (etat_moteur == 1) {
        if (digitalRead(CONTACTEUR) == LOW) {
            etat_moteur = 0;	//arrêt
            digitalWrite(IN1,LOW);
            digitalWrite(IN2,LOW);
        }
    }
}
