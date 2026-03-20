#include <Arduino.h>

int button = 13;
int led = 26;

void setup() {
  pinMode(button, INPUT_PULLUP);
  pinMode(led, OUTPUT);
  Serial.begin(115200);
}

void loop() {
  if (digitalRead(button) == LOW) {
    digitalWrite(led, HIGH);
    Serial.println("LED ON");
    delay(100);
  } else {
    digitalWrite(led, LOW);
    Serial.println("LED OFF");
  }
}