#include <Arduino.h>

int ENA=25;
int IN1=26;
int IN2=27;

void setup(){
   pinMode(IN1,OUTPUT);
   pinMode(IN2,OUTPUT);
   pinMode(ENA,OUTPUT);
   Serial.begin(115200);
}

void loop(){
   digitalWrite(ENA,HIGH);// si ENA n’est pas à 1 le moteur de tourne pas
   digitalWrite(IN1,LOW);// rotate forward
   digitalWrite(IN2,HIGH);
   delay(2000);
   digitalWrite(IN1,HIGH);// rotate reverse
   digitalWrite(IN2,LOW);
   delay(2000);
   digitalWrite(IN1,LOW);// stop
   digitalWrite(IN2,LOW);
   delay(2000);
}
