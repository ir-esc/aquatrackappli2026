#include <Arduino.h>

int ENA = 25;
int IN1 = 26;
int IN2 = 27;

int pwmChannel = 0;
int freq = 1000;
int resolution = 8;

void setup() {
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(ENA, OUTPUT);
  ledcSetup(pwmChannel, freq, resolution);
  ledcAttachPin(ENA, pwmChannel);
  Serial.begin(115200);
}

void loop() {
  // Sens 1
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  ledcWrite(pwmChannel, 127);
  Serial.println("Sens 1");
  delay(1000);

  // Sens 2
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  ledcWrite(pwmChannel, 127);
  Serial.println("Sens 2");
  delay(1000);


  // Arret
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  ledcWrite(pwmChannel, 0);
  Serial.println("Arret");
  delay(1000);

  //Vitesse
  for (int vitesse = 0; vitesse <= 255; vitesse++) {
    ledcWrite(pwmChannel, vitesse);
    Serial.println("Vitesse");
    delay(15);
  }
}