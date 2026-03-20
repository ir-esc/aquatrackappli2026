#include <Arduino.h>

int BUTTON = 13;  //Le bouton remplace le contacteur dans la simulation
int ENA = 25;
int IN1 = 26;
int IN1 = 27;

int pwmChannel = 0;
int freq = 1000;
int resolution = 8;

void setup() {
 pinMode(BUTTON, INPUT_PULLUP);
 pinMode(IN1, OUTPUT);
 pinMode(IN2, OUTPUT);
 pinMode(ENA, OUTPUT);
 ledcSetup(pwmChannel, freq, resolution);
 ledcAttachPin(ENA, pwmChannel);
 Serial.begin(115200);
}

void loop() {
 // Marche
 digitalWrite(IN1, HIGH);
 digitalWrite(IN2, LOW)
 ledcWrite(pwmChannel, 64);
 Serial.println("Marche");

 // Attente du contacteur
 while (digitalRead(BUTTON) == HIGH) {
   // moteur en rotation
 }

   // Contacteur déclenché
 Serial.println("Tour détecté");

 // Arrêt
 digitalWrite(IN1, LOW);
 digitalWrite(IN2, LOW);
 ledcWrite(pwmChannel, 0);
 Serial.println("Arrêt");
 delay(1000);
}