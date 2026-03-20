#include <Arduino.h>

int led1 = 26;
int led2 = 27;

int pwmChannel1 = 0;
int pwmChannel2 = 1;
int freq = 1000;
int resolution = 8;

char inChar;

void setup() {
 pinMode(led1,OUTPUT);
 pinMode(led2,OUTPUT);
 ledcSetup(pwmChannel1, freq, resolution);
 ledcSetup(pwmChannel2, freq, resolution);
 ledcAttachPin(led1, pwmChannel);
 ledcAttachPin(led2, pwmChannel);
 Serial.begin(115200);
}

void loop(){
 if (Serial.available()){
   inChar = Serial.read();
   Serial.print("Character received:");
   Serial.println(inChar);
 }

 if (inChar == '0'){
   ledcWrite(pwmChannel1, 0);
 }
 if (inChar == '1'){
   ledcWrite(pwmChannel1, 64);
 }
 if (inChar == '2'){
   ledcWrite(pwmChannel1, 127);
 }

 if (inChar == '3'){
   ledcWrite(pwmChannel1, 191);
 }

 if (inChar == '4'){
   ledcWrite(pwmChannel1, 255);
 }
 if (inChar == '5'){
   ledcWrite(pwmChannel2, 0);
 }

 if (inChar == '7'){
   ledcWrite(pwmChannel2, 64);
 }

 if (inChar == '6'){
   ledcWrite(pwmChannel2, 127);
 }

 if (inChar == '8'){
   ledcWrite(pwmChannel2, 191);
 }

 if (inChar == '9'){
   ledcWrite(pwmChannel2, 255);
 }
}
