#include <Arduino.h>

#define PH_PIN 34

float voltageAtPH7 = 1.45; // mesure réelle de la tension
float slope = -0.17;    // V/pH à 25°C

void setup() {
    Serial.begin(115200);
    analogReadResolution(12);
    analogSetAttenuation(ADC_11db);
    Serial.println("SEN0161 pH sensor ready");
}

void loop() {
    int adc = analogRead(PH_PIN);
    float voltage = adc * 3.3 / 4095.0;

    float pH = 7.0 + (voltage - voltageAtPH7) / slope;

    Serial.print("ADC = ");
    Serial.print(adc);
    Serial.print(" | Voltage = ");
    Serial.print(voltage, 3);
    Serial.print(" V | pH = ");
    Serial.println(pH, 2);

    delay(1000);
}
