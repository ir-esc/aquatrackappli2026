#include <Arduino.h>

void setup() {
  pinMode(13, INPUT_PULLUP);	//Résistance interne de l'ESP32
  Serial.begin(115200);
}

void loop() {
 bool buttonStatus = digitalRead(13);	  // Lit l'état de la broche 13 et stocke le résultat dans la variable buttonStatus (HIGH = bouton non pressé, LOW = bouton pressé)
 Serial.println(buttonStatus);	//Envoie l'état du bouton au moniteur série (affiche 1 pour HIGH, 0 pour LOW)
 delay(100);
}
