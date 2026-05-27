#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "Login.h"

void loginApi() {
    HTTPClient http;

    http.begin("http://aquatrackapi.ir.lan/log");

    http.addHeader("Content-Type", "application/json");

    String body = "{";
    body += "\"email\":\"Alex@ir.lan\",";
    body += "\"motdepasse\":\"Alex1234\"";
    body += "}";

    int code = http.POST(body);

    Serial.print("Login code: ");
    Serial.println(code);
    Serial.println(http.getString());

    http.end();
}
