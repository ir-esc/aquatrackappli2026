#include <Arduino.h>
#include "Scheduler.h"
#include "Wifi_handling.h"

void setup() {
    Serial.begin(115200);
    Serial.println("=== TEST Scheduler ===");

    // NTP nécessaire pour le test 5
    initWiFi();

    // Test 1 : parseConfig mode interval
    Serial.println("--- Test 1 : parseConfig interval ---");
    delay(2000);
    scheduler.parseConfig("{\"mode\":\"interval\",\"interval\":60}");
    if (scheduler.mode == "interval" && scheduler.intervalle_ms == 60000) {
        Serial.println("PASS : mode=" + scheduler.mode + " intervalle=" + String(scheduler.intervalle_ms) + "ms");
    } else {
        Serial.println("FAIL");
    }
    delay(5000);

    // Test 2 : parseConfig mode schedule
    Serial.println("--- Test 2 : parseConfig schedule ---");
    delay(2000);
    scheduler.parseConfig("{\"mode\":\"schedule\",\"day\":1,\"hour\":11,\"minute\":0}");
    if (scheduler.mode == "schedule" && scheduler.jour == 1 && scheduler.heure == 11 && scheduler.minute == 0) {
        Serial.println("PASS : jour=" + String(scheduler.jour) + " heure=" + String(scheduler.heure) + "h" + String(scheduler.minute));
    } else {
        Serial.println("FAIL");
    }
    delay(5000);

    // Test 3 : parseConfig JSON invalide
    Serial.println("--- Test 3 : JSON invalide ---");
    delay(2000);
    String modeBefore = scheduler.mode;
    scheduler.parseConfig("ceci_nest_pas_du_json");
    if (scheduler.mode == modeBefore) {
        Serial.println("PASS : mode inchangé après JSON invalide");
    } else {
        Serial.println("FAIL : mode modifié");
    }
    delay(5000);

    // Test 4 : anti-doublon doitPrendrePhoto
    Serial.println("--- Test 4 : anti-doublon ---");
    delay(2000);
    scheduler.mode = "schedule";
    scheduler.derniere_minute = 5;
    scheduler.minute = 5;
    bool result = scheduler.doitPrendrePhoto();
    if (!result) {
        Serial.println("PASS : pas de double photo sur la même minute");
    } else {
        Serial.println("FAIL : double photo détectée");
    }
    delay(5000);

    // Test 5 : doitPrendrePhoto avec heure NTP réelle
    Serial.println("--- Test 5 : doitPrendrePhoto avec NTP ---");
    delay(2000);
    struct tm timeinfo;
    if (getLocalTime(&timeinfo)) {
        // On configure le scheduler avec l'heure actuelle pour forcer un true
        scheduler.mode = "schedule";
        scheduler.jour    = timeinfo.tm_wday;
        scheduler.heure   = timeinfo.tm_hour;
        scheduler.minute  = timeinfo.tm_min;
        scheduler.derniere_minute = -1; // reset anti-doublon

        bool photo = scheduler.doitPrendrePhoto();
        if (photo) {
            Serial.println("PASS : doitPrendrePhoto() retourne true à l'heure actuelle");
        } else {
            Serial.println("FAIL : devrait retourner true");
        }
    } else {
        Serial.println("SKIP : NTP pas dispo");
    }
}

void loop() {}