#include <Arduino.h>

int IN1 = 26;	//La borne IN1 de la carte L298N est simuler par une led
int IN2 = 27;	//La borne IN2 de la carte L298N est simuler par une autre led

void setup() {
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  Serial.begin(115200);
}

void loop() {
  // Sens 1
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  Serial.println("Sens 1");
  delay(2000);

  // Sens 2
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  Serial.println("Sens 2");
  delay(2000);

  // Arrêt
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  Serial.println("Arret");
  delay(2000);
}