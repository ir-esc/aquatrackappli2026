#include "esp_camera.h"
#include <WiFi.h>
#include <HTTPClient.h>
#include <time.h>
#include <stdio.h>

#define MAX_PHOTOS 20  // nombre maximum de photos à garder en mémoire

// ================== VARIABLES ==================
unsigned long last_photo = 0;
unsigned long interval_saisie = 10000; // 10s
int photoCounter = 0;
String photoList[MAX_PHOTOS]; // liste des noms de photos

// ================== WIFI ==================
const char* ssid = "Redmi Note 11S";
const char* password = "ezzzzzzz";
IPAddress local_IP(10, 106, 170, 100);
IPAddress gateway(10, 106, 170, 89);
IPAddress subnet(255, 255, 255, 0);

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

WiFiServer server(80);
const char* photoServerURL = "http://192.168.1.100/upload";

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
    config.frame_size = FRAMESIZE_SXGA;
    config.jpeg_quality = 12;
    config.fb_count = 1;

    if (esp_camera_init(&config) != ESP_OK) {
        while (true) { delay(1000); }
    }
}

// ================== ENVOI PHOTO ==================
void sendPhoto(camera_fb_t* fb, const String& photoName) {
    if (!fb) return;
    HTTPClient http;
    http.begin(photoServerURL);
    http.addHeader("Content-Type", "image/jpeg");
    int code = http.POST(fb->buf, fb->len);
    http.end();

    // Ajouter le nom à la liste
    photoList[photoCounter % MAX_PHOTOS] = photoName;
    photoCounter++;
}

String getTimestamp() {
    struct tm timeinfo;

    if (!getLocalTime(&timeinfo)) {
        // si le NTP ne marche pas encore
        return "no_time_" + String(millis());
    }

    char buffer[30];
    strftime(buffer, sizeof(buffer), "%Y-%m-%d_%H-%M-%S", &timeinfo);
    return String(buffer);
}


// ================== SETUP ==================
void setup() {
    Serial.begin(115200);
    startCamera();

    WiFi.config(local_IP, gateway, subnet);
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) { delay(500); }

    server.begin();
}

// ================== GESTION CLIENT ==================
void handleClient() {
    WiFiClient client = server.available();
    if (!client) return;

    String request = client.readStringUntil('\n');
    client.flush();

    // /photos : liste des photos
    if (request.indexOf("/photos") != -1) {
        client.println("HTTP/1.1 200 OK");
        client.println("Content-Type: text/plain");
        client.println();
        for (int i = 0; i < MAX_PHOTOS; i++) {
            if (photoList[i].length() > 0)
                client.println(photoList[i]);
        }
    }

    // /capture : capture immédiate
    else if (request.indexOf("/capture") != -1) {
        camera_fb_t* fb = esp_camera_fb_get();
        if (!fb) return;

        String photoName = "photo_" + String(photoCounter) + ".jpg";
        client.println("HTTP/1.1 200 OK");
        client.println("Content-Type: image/jpeg");
        client.println("Content-Length: " + String(fb->len));
        client.println("Connection: close");
        client.println();
        client.write(fb->buf, fb->len);

        sendPhoto(fb, photoName);
        esp_camera_fb_return(fb);
    }

    client.stop();
}

// ================== LOOP ==================
void loop() {
    handleClient();

    // Photo automatique toutes les interval_saisie
    unsigned long tps = millis();
    if (tps - last_photo >= interval_saisie) {
        last_photo = tps;
        camera_fb_t* fb = esp_camera_fb_get();
        if (fb) {
            String photoName = "photo_" + String(photoCounter) + getTimestamp() + ".jpg";
            sendPhoto(fb, photoName);
            esp_camera_fb_return(fb);
        }
    }
}
