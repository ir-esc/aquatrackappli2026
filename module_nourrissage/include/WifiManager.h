#ifndef WIFI_MANAGER_H
#define WIFI_MANAGER_H
#include <Arduino.h>
#include <WiFi.h>

class WifiManager {
public :
    void connexionWifi(const char* ssid, const char* password);
};

#endif