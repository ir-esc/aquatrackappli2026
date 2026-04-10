#ifndef WIFI_HANDLING_H
#define WIFI_HANDLING_H

#include <Arduino.h>
#include <WiFi.h>
#include <time.h>

// ================== WIFI CONFIG ==================
extern const char* ssid;
extern const char* password;

// ================== SERVEUR ==================
extern WiFiServer localserver;
extern String logsBuffer;
// ================== INIT ==================
void initWiFi();


#endif