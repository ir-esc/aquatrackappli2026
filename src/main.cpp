#include "esp_camera.h"
#include <WiFi.h>
#include <time.h>
#include <stdio.h>
#include "Wifi_handling.h"
#include "LOGIN_Handling.h"
#include "Photo_sending.h"
#include "Config_Fetcher.h"
#include "Scheduler.h"
#include <esp_task_wdt.h>

// ================== VARIABLES ==================
unsigned long last_photo = 0;
unsigned long lastLogin = 0;
unsigned long last_config_fetch = 0;
String moduleToken = ""; // Variable globale pour stocker le token d'authentification du module, accessible dans tous les fichiers qui incluent LOGIN_Handling.h


// ================== CAMERA ==================
#define PWDN_GPIO_NUM     32
#define RESET_GPIO_NUM    -1
#define XCLK_GPIO_NUM     0
#define SIOD_GPIO_NUM     26
#define SIOC_GPIO_NUM     27
#define Y9_GPIO_NUM       35
#define Y8_GPIO_NUM       34
#define Y7_GPIO_NUM       39
#define Y6_GPIO_NUM       36
#define Y5_GPIO_NUM       21
#define Y4_GPIO_NUM       19
#define Y3_GPIO_NUM       18
#define Y2_GPIO_NUM       5
#define VSYNC_GPIO_NUM    25
#define HREF_GPIO_NUM     23
#define PCLK_GPIO_NUM     22


// ================== CAMERA INIT ==================
void startCamera() {
    camera_config_t config;
    config.ledc_channel = LEDC_CHANNEL_0;
    config.ledc_timer = LEDC_TIMER_0;
    config.pin_d0 = Y2_GPIO_NUM;
    config.pin_d1 = Y3_GPIO_NUM;
    config.pin_d2 = Y4_GPIO_NUM;
    config.pin_d3 = Y5_GPIO_NUM;
    config.pin_d4 = Y6_GPIO_NUM;
    config.pin_d5 = Y7_GPIO_NUM;
    config.pin_d6 = Y8_GPIO_NUM;
    config.pin_d7 = Y9_GPIO_NUM;
    config.pin_xclk = XCLK_GPIO_NUM;
    config.pin_pclk = PCLK_GPIO_NUM;
    config.pin_vsync = VSYNC_GPIO_NUM;
    config.pin_href = HREF_GPIO_NUM;
    config.pin_sccb_sda = SIOD_GPIO_NUM;
    config.pin_sccb_scl = SIOC_GPIO_NUM;
    config.pin_pwdn = PWDN_GPIO_NUM;
    config.pin_reset = RESET_GPIO_NUM;
    config.xclk_freq_hz = 20000000;
    config.pixel_format = PIXFORMAT_JPEG;
    config.frame_size = FRAMESIZE_QVGA; // liste des formats disponibles ici: FRAMESIZE_QVGA, FRAMESIZE_VGA, FRAMESIZE_SVGA, FRAMESIZE_XGA, FRAMESIZE_SXGA
    config.jpeg_quality = 20; // 0-63 lower means higher quality
    config.fb_count = 1;

    if (esp_camera_init(&config) != ESP_OK) {
        while (true) { delay(1000); }
    }
}

// Fonction courte pour gérer la prise de photo et déleguer l'envoi à d'autres fonctions
void prendrePhoto() {
    camera_fb_t* fb = esp_camera_fb_get();
    if (!fb) {
        Serial.println("Erreur capture photo");
        return;
    }
    int obsId = createObservation();
   
    if (obsId > 0) {
        Serial.println("observation créee");
        addMediaToObservation(obsId, fb);
        Serial.println("Média ajoutée a l'observation");
    }
    esp_camera_fb_return(fb);
}

// ================== SETUP ==================
void setup() {

    Serial.begin(115200);
    Serial.print("test");
    initWiFi();
// Test NTP
    struct tm timeinfo;
if (getLocalTime(&timeinfo)) {
    Serial.println("Heure ESP32: " + String(timeinfo.tm_hour) + "h" + String(timeinfo.tm_min));
} else {
    Serial.println("NTP pas dispo");
} // fin test NTP
    moduleToken = loadToken(); // Charger le token depuis la mémoire flash au démarrage
    if (moduleToken == "") {
        Serial.println("Aucun token trouvé, fetchToken nécessaire");
        fetchToken(WiFi.macAddress()); // On utilise l'adresse MAC comme identifiant unique du module pour récupérer le token correspondant à ce module dans l'API
        Serial.println("Token récupéré et stocké : " + moduleToken);
    } else {
        Serial.println("Token trouvé en mémoire : " + moduleToken);
    }
    delay(500);
    fetchConfig();
    delay(500);
    startCamera();
    Serial.println("caméra démarée");

    // laisser la caméra s'ajuster à la lumière
    delay(2000);

    // captures à blanc pour stabiliser l'exposition
    for (int i = 0; i < 3; i++) {
        camera_fb_t* fb = esp_camera_fb_get();
        esp_camera_fb_return(fb);
        delay(100);
    }

Serial.println("Caméra stabilisée");


     // Test création observation + upload media
       esp_task_wdt_init(300, true); // redémarre si bloqué plus de 5mi,
    esp_task_wdt_add(NULL); // ajoute la tâche actuelle (loop) au watchdog, pour que le watchdog puisse surveiller si loop est bloqué ou non. Si on oublie d'ajouter loop au watchdog, alors le watchdog ne fera rien et ne redémarrera jamais l'ESP32 même si loop est bloqué, ce qui n'est pas ce qu'on veut. En ajoutant loop au watchdog, on s'assure que si jamais loop se bloque (par exemple à cause d'une requête réseau qui ne répond pas), alors le watchdog redémarrera l'ESP32 pour tenter de résoudre le problème.
    prendrePhoto();
     Serial.println("photo de setup prise");
    
}


// ================== LOOP ==================
void loop() {

    esp_task_wdt_reset(); // reset le watchdog timer

    // Fetch config toutes les 30s pour être sûr d'avoir la config à jour
    if (millis() - last_config_fetch >= 30000) {
        last_config_fetch = millis();
        fetchConfig();
    }
  
    // Logique de prise de photo selon la config
    if (scheduler.mode == "interval") {
        if (millis() - last_photo >= scheduler.intervalle_ms) {
            last_photo = millis();
            prendrePhoto();
        }
    } else if (scheduler.mode == "schedule") {
        if (scheduler.doitPrendrePhoto()) {
            prendrePhoto();
        }
    }

    // Reconnexion wifi automatique

    if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi perdu, reconnexion...");
    WiFi.reconnect();
    delay(500);
    return; // on attend la prochaine itération
}
}