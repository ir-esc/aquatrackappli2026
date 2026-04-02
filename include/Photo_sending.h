#ifndef PHOTO_SENDING_H
#define PHOTO_SENDING_H

#include <Arduino.h>
#include <esp_camera.h>

int createObservation();                                // crée une observation et retourne son ID
void addMediaToObservation(int obsId, camera_fb_t* fb); // ajoute un media à l'observation

#endif