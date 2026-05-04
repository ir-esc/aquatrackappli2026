#include "DFRobot_ESP_PH.h"
#include <EEPROM.h>
#include "Wifi.h"

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
    ph.begin();

    connexionWifi("IR", "G00dWave$");
}


void loop() {
    static unsigned long lastTime = millis();

	if (millis() - lastTime >= (getIntervalle())*1000) {
		lastTime = millis();

		voltage = analogRead(PH_PIN) / ESPADC * ESPVOLTAGE;

		phValue = ph.readPH(voltage, temperature);


		Serial.print("Voltage: ");
		Serial.println(voltage);
		Serial.print("pH : ");
		Serial.println(phValue, 1);
    }
}


