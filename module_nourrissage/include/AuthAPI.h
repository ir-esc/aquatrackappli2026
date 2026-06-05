#ifndef AUTHAPI_H
#define AUTHAPI_H
#include <Arduino.h>

class AuthAPI {
private:
    String moduleToken;
    void saveToken(const String& token);
public:
    String loadToken();
    void fetchToken(String module_uid);
    String getToken();
};

#endif
