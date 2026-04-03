#include "DFRobot_ESP_PH.h"
#include <EEPROM.h>

#define ESPADC      4096.0
#define ESPVOLTAGE  3300
#define PH_PIN      34
#define INTERVAL_MS 1000


DFRobot_ESP_PH ph;

float voltage  = 0.0;
float phValue  = 0.0;
float temperature = 25.0;


void setup() {
    Serial.begin(115200);
    while (!Serial) { ; }

    EEPROM.begin(32);
    ph.begin();

    Serial.println("Température fixée à 25.0 °C (test)");
    Serial.println("Envoyez 'ENTERPH' pour démarrer la calibration");
    Serial.println("------------------------------------\n");
}


void loop() {
    static unsigned long lastTime = millis();

    if (millis() - lastTime >= INTERVAL_MS) {
        lastTime = millis();

        voltage = analogRead(PH_PIN) / ESPADC * ESPVOLTAGE;

        phValue = ph.readPH(voltage, temperature);

        Serial.println("------------------------------------");
        Serial.print("Tension    : ");
        Serial.print(voltage, 2);
        Serial.println(" mV");

        Serial.print("Température: ");
        Serial.print(temperature, 1);
        Serial.println(" °C (fixe)");

        Serial.print("pH         : ");
        Serial.println(phValue, 2);
    }

    ph.calibration(voltage, temperature);
}


