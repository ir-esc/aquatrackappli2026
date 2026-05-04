#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "Intervalle.h"

int getIntervalle() {

  HTTPClient http;
  http.begin("https://aquatrackapi.ir.lan/mod/7");

  int httpCode = http.GET();
  if (httpCode <= 0) {
    http.end();
    return -1;
  }

  String payload = http.getString();
  http.end();

 
  DynamicJsonDocument doc(1024);
  DeserializationError err = deserializeJson(doc, payload);
  if (err) return -2; 

  const char* configStr = doc["config"];
  if (!configStr) return -3;

 
  DynamicJsonDocument configDoc(256);
  err = deserializeJson(configDoc, configStr);
  if (err) return -4; 

  if (!configDoc.containsKey("intervalle")) return -5;

  return configDoc["intervalle"];
}