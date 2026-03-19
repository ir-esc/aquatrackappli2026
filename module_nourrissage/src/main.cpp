#include <Arduino.h>

int led1 = 26;  //Attribue la led1 à la pin 26
int led2 = 27;  //Attribue la led2 à la pin 27

void setup() {
  pinMode(led1,OUTPUT);   //Initialise led1 en sortie
  pinMode(led2,OUTPUT);   //Initialise led2 en sortie
  Serial.begin(115200);   //Initialise la communication série à 115200 bauds
}

void loop() {
  digitalWrite(led1,HIGH);  //Allume la led1
  digitalWrite(led2,HIGH);  //Allume la led2
}
