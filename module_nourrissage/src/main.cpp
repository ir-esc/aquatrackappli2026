#include <Arduino.h>

int ENA=25;
int IN1=26;
int IN2=27;
int CONTACTEUR=13;

void setup(){
   pinMode(IN1,OUTPUT);
   pinMode(IN2,OUTPUT);
   pinMode(ENA,OUTPUT);
   pinMode(CONTACTEUR, INPUT_PULLUP);
   Serial.begin(115200);
}

void loop(){
   digitalWrite(ENA,HIGH);
   digitalWrite(IN1,LOW); // Marche
   digitalWrite(IN2,HIGH);
   delay(1000);
  
   while (digitalRead(CONTACTEUR) == HIGH) {
       // Moteur en rotation
   }

   digitalWrite(IN1,LOW); // Arrêt
   digitalWrite(IN2,LOW);
   delay(1000);
}
