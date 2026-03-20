#include <Arduino.h>

int led1 = 26;
int led2 = 27;

void setup() {
  pinMode(led1,OUTPUT);
  pinMode(led2,OUTPUT);
  Serial.begin(115200);
}

void loop() {
  digitalWrite(led1,HIGH);  //Allume la led1
  digitalWrite(led2,HIGH);  //Allume la led2
  delay(2000);    //Attendre 2 secondes
  digitalWrite(led1,LOW);   //Éteint la led1
  digitalWrite(led2,LOW);   //Éteint la led2
  delay(2000);    //Attendre 2 secondes
}