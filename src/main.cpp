#include "esp_camera.h"
#include <WiFi.h>
#include <time.h>
#include <stdio.h>

// Variables 
unsigned long last_photo = 0; //dernière photo prise (pour intervalle)
unsigned long interval_saisie = 10000; // 10s



// ================== WIFI ==================
const char* ssid = "Redmi Note 11S";
const char* password = "ezzzzzzz";

// IP FIXE 10.106.170.89
IPAddress local_IP(10, 106, 170, 100);
IPAddress gateway(10, 106, 170, 89);
IPAddress subnet(255, 255, 255, 0);

// ================== CAMERA AI THINKER ==================
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

// ================== TEMPS ==================
bool getTime(struct tm &timeinfo)
{
    return getLocalTime(&timeinfo);
}

struct Schedule {
    bool days[7];        // dimanche=0 samedi=7
    int startHour;
    int endHour;
    
};


// ================== INIT CAMERA ==================
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

  config.frame_size = FRAMESIZE_SXGA;  // res 
  config.jpeg_quality = 12;
  config.fb_count = 1;

  if (esp_camera_init(&config) != ESP_OK) {
    while (true) { delay(1000); }
  }
}

// ================== SETUP ==================
void setup() {
  startCamera();
// temps réel



  // IP fixe
  WiFi.config(local_IP, gateway, subnet);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }

  // ================== TEMPS NTP ==================
const long gmtOffset_sec = 3600;      // UTC+1
const int daylightOffset_sec = 0;  // heure d'été
const char* ntpServer = "pool.ntp.org";

  server.begin();
}

// ================== LOOP ==================
void loop() {

//Photo par date choisie



     // Photo par intervalle 

  unsigned long tps =millis();
    if (tps - last_photo >= interval_saisie) {
        last_photo = tps;
    
        camera_fb_t* fb = esp_camera_fb_get();
        
    if (fb) {
      // api
      esp_camera_fb_return(fb);
    }
    }

  // Photo à la demande
  WiFiClient client = server.available();
  if (!client) return;

  String request = client.readStringUntil('\r');
  client.flush();

 
  if (request.indexOf("/") != -1) {
    camera_fb_t* fb = esp_camera_fb_get();
    if (!fb) return;

    client.println("HTTP/1.1 200 OK");
    client.println("Content-Type: image/jpeg");
    client.println("Content-Length: " + String(fb->len));
    client.println("Connection: close");
    client.println();
    client.write(fb->buf, fb->len);

    esp_camera_fb_return(fb);
  }
}
