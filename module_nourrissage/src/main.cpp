#include <Arduino.h>

int led1 = 26;
int led2 = 27;

int pwmChannel = 0;	// Déclare le canal PWM à utiliser 
int freq = 1000;	// Fréquence du signal PWM en Hz
int resolution = 8;	// Résolution du PWM en bits (2^8 = 256, le PWM peut aller de 0 à 255)

void setup() {
 pinMode(led1,OUTPUT);
 pinMode(led2,OUTPUT);
 ledcSetup(pwmChannel, freq, resolution);	// Configure le canal PWM avec la fréquence et la résolution
 ledcAttachPin(led1, pwmChannel);	 // Attache la led1 au canal pwmChannel
 ledcAttachPin(led2, pwmChannel);	// Attache la led2 au canal pwmChannel
 Serial.begin(115200);
}

void loop(){
   // Augmente progressivement la luminosité de des leds
   for(int dutyCycle = 0; dutyCycle <= 255; dutyCycle++){
       ledcWrite(pwmChannel, dutyCycle);
       delay(15);
   }
}