#include <Arduino.h>

int led1 = 26;
int led2 = 27;

void setup() {
  pinMode(led1,OUTPUT);
  pinMode(led2,OUTPUT);
  Serial.begin(115200);
}

void loop() {
  digitalWrite(led1,HIGH);
  digitalWrite(led2,LOW);
  delay(1000);    //Attendre une seconde
  digitalWrite(led1,HIGH);
  digitalWrite(led2,HIGH);
  delay(1000);    //Attendre une seconde
  digitalWrite(led1,LOW);
  digitalWrite(led2,HIGH);
  delay(1000);      //Attendre une seconde
  digitalWrite(led1,LOW);
  digitalWrite(led2,LOW);
  delay(1000);      //Attendre une seconde
}