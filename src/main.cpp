#include "esp_camera.h"
#include <WiFi.h>
#include <HTTPClient.h>
#include <time.h>
#include <stdio.h>
#include "Wifi_handling.h"
#include "LOGIN_Handling.h"
#include "Photo_sending.h"

#define MAX_PHOTOS 20  // nombre maximum de photos à garder en mémoire

// ================== VARIABLES ==================
unsigned long last_photo = 0;
unsigned long interval_saisie = 10000; // 10s
int photoCounter = 0;
String photoList[MAX_PHOTOS]; // liste des noms de photos



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
    config.frame_size = FRAMESIZE_SVGA;
    config.jpeg_quality = 10;
    config.fb_count = 1;

    if (esp_camera_init(&config) != ESP_OK) {
        while (true) { delay(1000); }
    }
}

// ================== ENVOI PHOTO ==================
void sendPhoto(camera_fb_t* fb, const String& photoName) {
    if (!fb) return;

    WiFiClient client;
    String server = "aquatrackapi.ir.lan";
    String url = "/aqr/11/med";  //  mets ton aquariumId ici

    Serial.println("Connexion au serveur...");

    if (!client.connect(server.c_str(), 80)) {
        Serial.println("Connexion échouée");
        return;
    }

    String boundary = "----ESP32CamBoundary";

    // Corps début
    String bodyStart =
        "--" + boundary + "\r\n"
        "Content-Disposition: form-data; name=\"media\"; filename=\"" + photoName + "\"\r\n"
        "Content-Type: image/jpeg\r\n\r\n";

    String bodyEnd = "\r\n--" + boundary + "--\r\n";

    int contentLength = bodyStart.length() + fb->len + bodyEnd.length();

    // HEADER HTTP
    client.println("POST " + url + " HTTP/1.1");
    client.println("Host: " + server);
    client.println("Content-Type: multipart/form-data; boundary=" + boundary);
    client.println("Content-Length: " + String(contentLength));
    client.println();

    Serial.println("Envoi header OK");

    // ENVOI DATA
    client.print(bodyStart);
    client.write(fb->buf, fb->len);
    client.print(bodyEnd);

    Serial.println("Image envoyée, attente réponse...");

    //  LECTURE REPONSE
    while (client.connected()) {
        String line = client.readStringUntil('\n');
        Serial.println(line);
        if (line == "\r") break;
    }

    Serial.println("Upload terminé");
    client.stop();
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

WiFiServer debugServer(8080);  // petit port juste pour debug

void startDebugServer() {
    debugServer.begin();
}
// ================== SETUP ==================
void setup() {
    Serial.begin(115200);
    Serial.print("test");
    initWiFi();
    startDebugServer();
    loginAPI();
    startCamera();
    wifiLog("caméra démarée");
     // Test création observation + upload media
    camera_fb_t* fb = esp_camera_fb_get();
     wifiLog("photo de setup prise");
    if (fb) {
        int obsId = createObservation();
         wifiLog("observation créee");
        if (obsId > 0) {
            addMediaToObservation(obsId, fb);
             wifiLog("Média ajoutée a l'observation");
        }
        esp_camera_fb_return(fb);
    }
}

// ================== GESTION CLIENT ==================
/* void handleClient() {
    WiFiClient client = localserver.available();
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
} */





void handleDebugClient() {
    WiFiClient client = debugServer.available();
    if (!client) return;

    // attendre que le client envoie une requête HTTP (ici on ne lit pas vraiment)
    while (!client.available()) delay(1);

    String req = client.readStringUntil('\n');
    client.flush();

    // envoyer le contenu du buffer
    client.println("HTTP/1.1 200 OK");
    client.println("Content-Type: text/plain");
    client.println();
    client.print(logsBuffer); // <- pas println, sinon double saut
    logsBuffer = "";           // <- réinitialiser après lecture

    client.stop();
}

// ================== LOOP ==================
void loop() {
   // handleClient();
    handleDebugClient();
    // Photo automatique toutes les interval_saisie
    unsigned long tps = millis();
    if (tps - last_photo >= interval_saisie) {
        last_photo = tps;
        camera_fb_t* fb = esp_camera_fb_get();
        if (fb) {
            String photoName = "photo_" + String(photoCounter) + getTimestamp() + ".jpg";
            sendPhoto(fb, photoName);
            esp_camera_fb_return(fb);
            wifiLog("Photo auto");
        }
    }
}
