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
extern const char* photoServerURL;
extern String logsBuffer;
// ================== INIT ==================
void initWiFi();


//debug
extern WiFiServer debugServer;  // déjà déclaré dans ton main

void wifiLog(const String &msg);
#endif