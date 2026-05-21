# 📸 Aquatrack - Module ESP32-CAM

## 🎯 Vue d'Ensemble du Module

**Aquatrack - Module ESP32-CAM** est le firmware responsable de la capture et de la transmission automatique de photos d'aquarium. Ce module fait partie d'un écosystème plus large incluant une API backend, une interface web de gestion, et potentiellement d'autres modules de capteurs.

**Responsabilité de ce module** : Capturer les photos via la caméra ESP32-CAM, se connecter au réseau WiFi, s'authentifier auprès de l'API backend, et envoyer régulièrement les photos selon un planning configurable depuis l'API.

**Ressources du projet Aquatrack global** : API backend (`aquatrackapi.ir.lan`), interface de gestion, autres modules de monitoring

> **⚠️ Note Importante** : Ce dossier contient **le code source du firmware pour l'ESP32-CAM uniquement**. 
> - Les autres modules, l'API backend, et l'interface web se trouvent dans d'autres dépôts/projets
> - Ce module communique avec l'API mais ne la gère pas
> - Les modifications ici affectent uniquement le comportement du module ESP32-CAM en production

---

## 🏗️ Architecture du Module

### Structure des Fichiers

```
Aquatrack/ (Module ESP32-CAM uniquement)
├── src/                          # Code source (implémentations .cpp)
│   ├── main.cpp                  # Point d'entrée principal
│   ├── Wifi_handling.cpp         # Gestion de la connexion WiFi et NTP
│   ├── LOGIN_Handling.cpp        # Authentification via l'API
│   ├── Config_Fetcher.cpp        # Récupération de la config du scheduler
│   ├── Scheduler.cpp             # Logique de planification des photos
│   └── Photo_sending.cpp         # Capture et envoi des photos
├── include/                      # Fichiers d'en-tête (.h)
│   ├── Wifi_handling.h
│   ├── LOGIN_Handling.h
│   ├── Config_Fetcher.h
│   ├── Scheduler.h
│   └── Photo_sending.h
├── lib/                          # Dépendances externes (librairie)
├── platformio.ini                # Configuration PlatformIO
└── README.md                     # Ce fichier

```

---

## 🔧 Configuration et Installation

### Matériel Requis

- Microcontrôleur : ESP32-CAM (avec caméra OV2640 intégrée)
- Alimentation : 5V stable (via micro USB ou alimentation externe 5V)
- Réseau : Accès WiFi au même réseau que l'API backend

### Prérequis Logiciels (pour modifier le code)

1. PlatformIO avec l'extension VS Code


### Dépendances

Le projet utilise ArduinoJson (déclaré dans `platformio.ini`).

### Variables de Configuration

Les paramètres réseau et API sont définis dans les sources :
- WiFi : `src/Wifi_handling.cpp`
- API host/port : `src/Photo_sending.cpp` et `src/LOGIN_Handling.cpp`

---

## 📊 Architecture Fonctionnelle

Ce firmware suit une boucle principale : connexion WiFi/NTP → authentification → récupération de configuration → prise de photos selon scheduler → envoi des médias à l'API.

---

## 📝 Modules principaux

- `Wifi_handling.*`: connexion WiFi et synchronisation NTP
- `LOGIN_Handling.*`: authentification et stockage de cookie de session
- `Config_Fetcher.*`: récupération de configuration depuis l'API
- `Scheduler.*`: logique de planification (interval ou schedule)
- `Photo_sending.*`: création d'observation et upload d'images

---

Pour démarrer : ouvrez le projet avec PlatformIO/VS Code, ajustez les identifiants WiFi et API dans les fichiers mentionnés, puis compilez et téléversez sur l'ESP32-CAM.
2. Parse la réponse JSON pour extraire le champ `config`
3. Transmet cette configuration au `Scheduler` qui la parse

#### Format de réponse attendu :
```json
{
  "id": 6,
  "config": "{\"mode\":\"interval\",\"interval\":30}"
}
```

#### Exemple de requête :
```
GET /mod/6 HTTP/1.1
Host: aquatrackapi.ir.lan
Cookie: ci_session=abc123...
accept: application/json
```

---

### 4️⃣ **Scheduler.cpp / Scheduler.h**

**Responsabilité** : Décider quand prendre les photos selon la configuration reçue

#### Classe `Scheduler`

```cpp
class Scheduler {
public:
    String mode;              // "interval" ou "schedule"
    long intervalle_ms;       // Intervalle en millisecondes (mode interval)
    int jour;                 // Jour de la semaine (0=dimanche, 6=samedi) pour mode schedule
    int heure;                // Heure (0-23) pour mode schedule
    int minute;               // Minute (0-59) pour mode schedule
    int derniere_minute;      // Suivi pour éviter les doublons
};
```

#### Modes de fonctionnement :

**Mode "interval"** (par défaut)
- Prend une photo tous les X secondes
- Configuration : `{"mode":"interval","interval":30}`
- Résultat : Une photo toutes les 30 secondes

**Mode "schedule"** 
- Prend une photo à une heure/jour spécifiques
- Configuration : `{"mode":"schedule","day":3,"hour":14,"minute":30}`
- Résultat : Une photo le mercredi à 14h30

#### Fonctions principales :
- `parseConfig(String configStr)` : Parse le JSON et met à jour les paramètres
- `doitPrendrePhoto()` : Retourne `true` si c'est le moment de prendre une photo
  - Utilise `getLocalTime()` pour récupérer l'heure actuelle
  - Vérifie les conditions selon le mode
  - Évite les doublons en vérifiant que la minute a changé depuis la dernière photo

---

### 5️⃣ **Photo_sending.cpp / Photo_sending.h**

**Responsabilité** : Capturer les photos et les envoyer à l'API

#### Fonctions principales :

**`int createObservation()`**
- Crée une "observation" (entrée horodatée) dans l'API
- Envoie une requête **POST** vers `/aqr/{aquariumId}/obs`
- Inclut la date/heure au format ISO 8601 : `2024-01-15T14:30:45.000Z`
- Retourne l'ID de l'observation (nécessaire pour l'étape suivante)

**`void addMediaToObservation(int obsId, camera_fb_t* fb)`**
- Envoie la photo à l'observation créée
- Utilise **multipart/form-data** (format standard pour upload de fichiers)
- Envoie une requête **POST** vers `/obs/{obsId}/med`
- Définit un boundary HTTP pour délimiter le fichier

#### Architecture de la caméra

Configuration des pins GPIO dans `main.cpp` :
```cpp
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
#define XCLK_GPIO_NUM     0
#define SIOD_GPIO_NUM     26
#define SIOC_GPIO_NUM     27
#define PWDN_GPIO_NUM     32
```

#### Paramètres de capture :
```cpp
config.pixel_format = PIXFORMAT_JPEG;  // Format JPEG
config.frame_size = FRAMESIZE_SVGA;    // Résolution SVGA (800x600)
config.jpeg_quality = 10;              // Qualité (1-63, plus haut = meilleur)
config.fb_count = 1;                   // Un buffer frame
config.xclk_freq_hz = 20000000;        // 20 MHz clock
```

---

### 6️⃣ **main.cpp**

**Responsabilité** : Orchestrer tous les modules et implémenter la boucle principale

#### Setup (exécuté une seule fois) :
1. Initialise le port série (115200 baud)
2. Initialise WiFi + NTP
3. S'authentifie auprès de l'API
4. Initialise la caméra

#### Boucle principale (s'exécute en continu) :

```cpp
void loop() {
    // Récupère la configuration du scheduler
    if (millis() - last_config_fetch > 60000) { // Toutes les 60s
        fetchConfig();
        last_config_fetch = millis();
    }
    
    // Vérifie s'il est temps de prendre une photo
    if (scheduler.doitPrendrePhoto()) {
        prendrePhoto();
        last_photo = millis();
    }
    
    // Ré-authentification si nécessaire
    if (millis() - lastLogin > 3600000) { // Toutes les heures
        loginAPI();
        lastLogin = millis();
    }
}
```

#### Variables de timing :
```cpp
unsigned long last_photo = 0;              // Timestamp de la dernière photo
unsigned long interval_saisie = 10000;     // Intervalle de la boucle (10s)
unsigned long lastLogin = 0;               // Timestamp de la dernière authentification
unsigned long last_config_fetch = 0;       // Timestamp du dernier fetch de config
```

---

## 🔄 Flux de Requête HTTP

### 1. Authentification

```
[ESP32] ──POST /log──▶ [API]
        
Headers:
  Content-Type: application/json
  
Body:
  {"email":"Alex@ir.lan","motdepasse":"Alex1234"}

Response:
  Set-Cookie: ci_session=xxx...
  {"success":true,...}
```

### 2. Récupération de Configuration

```
[ESP32] ──GET /mod/6──▶ [API]
        
Headers:
  Cookie: ci_session=xxx...
  
Response:
  {
    "id": 6,
    "name": "ESP32 Aquarium",
    "config": "{\"mode\":\"interval\",\"interval\":30}"
  }
```

### 3. Création d'Observation

```
[ESP32] ──POST /aqr/116/obs──▶ [API]
        
Headers:
  Cookie: ci_session=xxx...
  Content-Type: application/json
  
Body:
  {"texte":"Photo ESP32","date":"2024-01-15T14:30:45.000Z"}
  
Response:
  {"id":5234,"texte":"Photo ESP32","date":"2024-01-15T14:30:45.000Z"}
```

### 4. Upload de Média (Photo)

```
[ESP32] ──POST /obs/5234/med──▶ [API]
        
Headers:
  Cookie: ci_session=xxx...
  Content-Type: multipart/form-data; boundary=----ESP32CamBoundary
  
Body:
  ----ESP32CamBoundary\r\n
  Content-Disposition: form-data; name="media"; filename="photo.jpg"\r\n
  Content-Type: image/jpeg\r\n\r\n
  [IMAGE BINARY DATA]
  \r\n----ESP32CamBoundary--\r\n
  
Response:
  {"success":true}
```

---

## 📈 Timing et Optimisations

### Timing des Boucles

| Opération | Fréquence | Raison |
|-----------|-----------|--------|
| Prise de photo | Configuration API | Selon scheduler (interval ou schedule) |
| Récupération config | 60 secondes | Permet les changements dynamiques |
| Ré-authentification | 60 minutes | Renouvellement du cookie de session |

### Optimisations Implémentées

- **Buffer de caméra unique** : `fb_count = 1` pour économiser la RAM
- **Compression JPEG** : Qualité 10/63 pour réduire la taille des fichiers
- **WiFiClient direct** : Plus efficace que HTTPClient pour ce cas d'usage
- **Double parsing JSON** : Config reçue en tant que JSON en string et reparsée

---

## 🐛 Débogage et Suivi

### Sortie Série (Serial Monitor)

Le projet utilise `Serial.println()` pour le débogage :

```
Heure ESP32: 14h30
WiFi connecté
192.168.1.100
NTP OK
Cookie stocké: ci_session=xxx...
Mode interval: 30s
observation créee
Média ajoutée a l'observation
```

### Configuration du Moniteur Série

```ini
monitor_speed = 115200
```

**Accès** : Dans PlatformIO, cliquez sur "Serial Monitor" ou raccourci Ctrl+Shift+P → "Serial Monitor"

### Points de Suivi

1. **Connexion WiFi** : Cherchez "WiFi connecté"
2. **Time Server** : Cherchez "NTP OK"
3. **Authentification** : Cherchez "Cookie stocké"
4. **Scheduler** : Cherchez "Mode interval" ou "Mode schedule"
5. **Capture photo** : Cherchez "observation créee"
6. **Upload** : Cherchez "Média ajoutée"

---

## ⚠️ Points d'Attention et Limitations

### Problèmes Connus

| Problème | Cause | Solution |
|----------|-------|----------|
| Pas de cookie dans la réponse login | Identifiants incorrects | Vérifier les credentials dans LOGIN_Handling.cpp |
| "Pas de JSON dans la réponse" | API non accessible | Vérifier la connectivité WiFi et l'IP de l'API |
| Photos manquantes | Mode schedule avec mauvaise heure | Vérifier la synchronisation NTP |
| Crash après quelques photos | Fuite mémoire ou déconnexion WiFi | Reboot recommandé toutes les 2-4 heures |

### Limitation Connues

- ⚠️ **Pas de reconnexion WiFi automatique** après déconnexion
- ⚠️ **Pas de gestion des erreurs** pour la réconnexion à l'API
- ⚠️ **Mode schedule** ne prend qu'une seule photo par minute (protection contre les doublons)
- ⚠️ **Cookie de session** ne se renouvelle que toutes les heures
- ⚠️ **Pas de stockage local** des photos en cas d'échec d'envoi

---

## 🚀 Modification et Compilation

> **Note** : Ce section couvre la modification du code source du module. L'ESP32-CAM est déjà flashé avec ce firmware en production. Les modifications se font via le cable USB de transmission de données connecté à votre ordinateur via PlatformIO.

### Compilation

```bash
# Compiler le projet (sans flasher l'appareil)
pio run -e esp32cam
```

### Upload/Flash sur l'ESP32-CAM

```bash
# Compiler et flasher le nouveau firmware sur l'ESP32
pio run -e esp32cam -t upload
```

#### Prérequis pour le flash :
- Cable USB branché à l'ordinateur
- ESP32-CAM sous tension (5V)
- Drivers USB à jour pour l'ESP32 (généralement automatiques sur Windows 10+)

### Monitoring et Débogage

```bash
# Lancer le moniteur série pour voir les logs en direct
pio device monitor -b 115200
```

**Raccourci PlatformIO** : Vous pouvez aussi cliquer sur l'icône "Build, Upload, Monitor" ▶️ dans la barre inférieure de VS Code pour compiler, flasher et lancer le moniteur en une action.

---

## 🔮 Améliorations Futures Possibles

Suggestions pour améliorer ce module ESP32-CAM (liste non exhaustive) :

### Robustesse & Fiabilité
1. **Reconnexion WiFi automatique** : Implémenter une boucle de reconnexion robuste en cas de déconnexion
2. **Gestion des erreurs avancée** : Retry avec backoff exponentiel pour les requêtes API
3. **Stockage local** : Sauvegarder les photos en flash en cas d'échec d'envoi à l'API
4. **Watchdog timer** : Redémarrage automatique en cas de blocage du système

### Fonctionnalités
5. **Web interface locale** : Afficher la dernière photo via le serveur local existant (`localserver` port 80)
6. **Capteurs additionnels** : Ajouter des capteurs (température, pH, luminosité) pour enrichir les données
7. **Compression d'image dynamique** : Adapter la qualité JPEG selon la bande passante disponible
8. **Configuration par WiFi** : Interface web pour modifier les paramètres sans recompilation

### Optimisations
9. **Multi-résolutions** : Supporter différentes résolutions selon le contexte (économie d'énergie/qualité)
10. **Statistiques locales** : Compteur de photos envoyées, d'erreurs, uptime, utilisation mémoire
11. **Gestion mémoire** : Optimisation pour éviter les fuites mémoire sur longue durée

### Architecture Projet
12. **Intégration avec d'autres modules** : Coordination avec d'autres modules Aquatrack pour le monitoring global
13. **Configuration externalisée** : Fichiers de configuration JSON stockés localement pour éviter la recompilation

---

## 📚 Références Utiles

- **Documentation PlatformIO** : https://docs.platformio.org/
- **Guide ESP32-CAM** : https://randomnerdtutorials.com/esp32-cam-ov2640-camera/
- **ArduinoJson Documentation** : https://arduinojson.org/
- **Format multipart/form-data** : https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type#multipartform-data
- **ISO 8601** (format date) : https://en.wikipedia.org/wiki/ISO_8601

---

## 📄 Licence et Auteur

**Projet** : Aquatrack  
**Plateforme** : ESP32-CAM  
**Backend API** : aquatrackapi.ir.lan  

---

## ✅ Checklist de Configuration

Avant de déployer sur l'appareil, assurez-vous :

- [ ] WiFi SSID et mot de passe correctement configurés
- [ ] Adresse IP de l'API accessible
- [ ] IDs (aquariumId, moduleId) correctement définis
- [ ] Identifiants API créés dans le backend
- [ ] Port série testé (115200 baud)
- [ ] Caméra physiquement correctement connectée
- [ ] Alimentation 5V stable fournie à l'ESP32-CAM
- [ ] Moniteur série lancé avant le upload pour voir les logs
- [ ] Configuration du scheduler testée
- [ ] Synchronisation NTP vérifiée dans les logs

---

**Dernière mise à jour** : Avril 2026  
**Status** : ✅ Fonctionnel (photos envoyées avec succès via API)
