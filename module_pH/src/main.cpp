#include <Arduino.h>
#include <Preferences.h>

#define PH_PIN 34

Preferences prefs;

float voltageAtPH7;
float slope;

float readVoltage() {
    int adc = analogRead(PH_PIN);
    return adc * 3.3 / 4095.0;
}

void saveCalibration() {
    prefs.begin("phCal", false);
    prefs.putFloat("v7", voltageAtPH7);
    prefs.putFloat("slope", slope);
    prefs.end();
}

void loadCalibration() {
    prefs.begin("phCal", true);
    voltageAtPH7 = prefs.getFloat("v7", 1.45);
    slope = prefs.getFloat("slope", -0.17);
    prefs.end();
}

void setup() {
    Serial.begin(115200);
    analogReadResolution(12);
    analogSetAttenuation(ADC_11db);

    loadCalibration();

    Serial.println("=== pH Sensor Ready ===");
    Serial.println("Tapez 7 pour calibrer pH7");
    Serial.println("Tapez 4 pour calibrer pH4");
    Serial.println("Tapez R pour reset");
}

void loop() {

    if (Serial.available()) {
        char cmd = Serial.read();

        if (cmd == '7') {
            Serial.println("Placez la sonde dans solution pH 7...");
            delay(5000);
            voltageAtPH7 = readVoltage();
            saveCalibration();
            Serial.println("Calibration pH7 OK");
        }

        if (cmd == '4') {
            Serial.println("Placez la sonde dans solution pH 4...");
            delay(5000);
            float voltage4 = readVoltage();
            slope = (voltage4 - voltageAtPH7) / (4.0 - 7.0);
            saveCalibration();
            Serial.println("Calibration pH4 OK");
        }

        if (cmd == 'R') {
            voltageAtPH7 = 1.45;
            slope = -0.17;
            saveCalibration();
            Serial.println("Calibration reset");
        }
    }

    float voltage = readVoltage();
    float pH = 7.0 + (voltage - voltageAtPH7) / slope;

    Serial.print("Voltage: ");
    Serial.print(voltage, 3);
    Serial.print(" V | pH: ");
    Serial.println(pH, 2);

    delay(1000);
}
