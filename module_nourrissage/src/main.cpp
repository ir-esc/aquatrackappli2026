#include <Arduino.h>

int ENA = 26;	//La borne ENA de la carte L298N est simulée par une led
int IN1 = 27;

int pwmChannel = 0;
int freq = 1000;
int resolution = 8;

void setup() {
  pinMode(IN1, OUTPUT);
  pinMode(ENA, OUTPUT);
  ledcSetup(pwmChannel, freq, resolution);
  ledcAttachPin(ENA, pwmChannel);
  Serial.begin(115200);
}

void loop() {
  // Marche
  digitalWrite(IN1, HIGH);
  ledcWrite(pwmChannel, 127);
  Serial.println("Marche");
  delay(1000);

  // Arrêt
  digitalWrite(IN1, LOW);
  ledcWrite(pwmChannel, 0);
  Serial.println("Arret");
  delay(1000);
}