#include <Arduino.h>

int led1 = 26;
int led2 = 27;

int pwmChannel1 = 0;	// Déclare le canal PWM à utiliser 
int pwmChannel2 = 1;	// Déclare le canal PWM à utiliser (le canal est différent pour les deux leds aient des intensités différentes)
int freq = 1000;
int resolution = 8;

void setup() {
 pinMode(led1,OUTPUT);
 pinMode(led2,OUTPUT);
 ledcSetup(pwmChannel, freq, resolution);	// Configure pwmChannel1 avec la fréquence et la résolution définies
 ledcSetup(pwmChannel2, freq, resolution);	// Configure pwmChannel2 avec la fréquence et la résolution définies
 ledcAttachPin(led1, pwmChannel1);	 // Attache la led1 au canal pwmChannel1
 ledcAttachPin(led2, pwmChannel2);	// Attache la led2 au canal pwmChannel2
 Serial.begin(115200);
}

void loop(){
   ledcWrite(pwmChannel1, 64);	//Intensité de la led1 à 25%
   ledcWrite(pwmChannel2, 192);	//Intensité de la led2 à 75%
}