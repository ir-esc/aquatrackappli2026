#ifndef AUTHAPI_H
#define AUTHAPI_H
#include <Arduino.h>

extern String moduleToken;

void saveToken(const String& token);
String loadToken();
void fetchToken(String module_uid);

#endif
