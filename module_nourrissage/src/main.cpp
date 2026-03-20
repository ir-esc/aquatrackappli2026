#include <Arduino.h>

int led1 = 26;
int led2 = 27;
char inChar;      //Définit une variable pour stocker les caractères reçus via le port série

void setup() {
  pinMode(led1,OUTPUT);
  pinMode(led2,OUTPUT);
  Serial.begin(115200);
}

void loop() {
 if (Serial.available()){   //Juge si les données ont été reçues ou non
   inChar = Serial.read();    //Lit un caractère
   Serial.print("Character received:");   //Affiche "Character received:" dans le moniteur série
   Serial.println(inChar);    //Affiche le caractère reçu dans le moniteur série
 }
 if (inChar == '1'){
   digitalWrite(led1, HIGH);    //Lorsque le caractère '1' est reçu la led1 s'allume
 }

 if (inChar == '2'){
   digitalWrite(led1, LOW);   //Lorsque le caractère '2' est reçu la led1 s'éteint
 }

 if (inChar == '3'){
   digitalWrite(led2, HIGH);    //Lorsque le caractère '3' est reçu la led2 s'allume
 }

 if (inChar == '4'){
   digitalWrite(led2, LOW);   //Lorsque le caractère '4' est reçu la led2 s'éteint
 }
}
