#include <Arduino.h>

int button = 13;
int led = 2; //led intégrée sur l’ESP32

void setup() {
  pinMode(button, INPUT_PULLUP); // Active la résistance pull-up interne
  pinMode(led, OUTPUT);
  pinMode(led, OUTPUT);
  Serial.begin(115200);
}

void loop() {
  if (digitalRead(button) == LOW){ //Rappel : En pull up LOW = bouton enclenché alors qu’en pull down HIGH = bouton enclenché
    digitalWrite(led, HIGH);
    Serial.println("LED ON");
    delay(100);
  } else {
    digitalWrite(led, LOW);
    Serial.println("LED OFF");
    delay(100);
  }
}