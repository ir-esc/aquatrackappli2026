#include <Arduino.h>

int ENA=25;
int IN1=26;
int IN2=27;
int CONTACTEUR=13;
int BOUTON = 12; //pour simuler la demande de nourrissage
int etat_moteur = 2;        // état du moteur à 2 donc à l'arrêt sur le contacteur

void setup(){
   pinMode(IN1,OUTPUT);
   pinMode(IN2,OUTPUT);
   pinMode(ENA,OUTPUT);
   pinMode(CONTACTEUR, INPUT_PULLUP);
   pinMode(BOUTON, INPUT_PULLUP);
   Serial.begin(115200);
}

void loop() {
    if (etat_moteur == 2) {     //si le moteur est arrêté sur le contacteur
        if (digitalRead(BOUTON) == LOW) {   //et que le bouton est enclenché
            etat_moteur = 0;        //alors le moteur se met en position prêt à démarrer
            digitalWrite(ENA,HIGH);
            digitalWrite(IN1,LOW);
            digitalWrite(IN2,HIGH);
        }
    }

    if (etat_moteur == 0) {     //si le moteur est prêt à démarrer
        if (digitalRead(CONTACTEUR) == HIGH) {  //et que le contacteur est libéré
            etat_moteur = 1;        //alors le moteur démarre
            digitalWrite(ENA,HIGH);
            digitalWrite(IN1,LOW);
            digitalWrite(IN2,HIGH);
        }
    }

    if (etat_moteur == 1) {     //si le moteur tourne
        if (digitalRead(CONTACTEUR) == LOW) {   //et que le contacteur est enclenché
            etat_moteur = 2;        //alors le moteur s'arrête sur le contacteur
            digitalWrite(IN1,LOW);
            digitalWrite(IN2,LOW);
        }
    }

}
