// api.js - Fonctions pour appeler l'API REST AquaTrack

var API_URL = "https://aquatrackapi.ir.lan";

webix.attachEvent("onAjaxError", function (mode, url, data, request) {
    request.withCredentials = true; // Assurer que les cookies sont envoyés pour les erreurs d'authentification
});


// ─── Gestion de session (token) ──────────────────────────────────────────────

function getSession() {
    return localStorage.getItem("session_token");
}

function saveSession(token) {
    localStorage.setItem("session_token", token);
}

function supprimerSession() {
    localStorage.removeItem("session_token");
    localStorage.removeItem("user_id");
}

// Helper : construit les headers avec le token d'authentification
function authHeaders(extra) {
    var token = getSession();
    var headers = {};
    if (token) {
        headers["Authorization"] = "Bearer " + token;
    }
    return Object.assign(headers, extra || {});
}

// ─── Authentification ────────────────────────────────────────────────────────

// Connexion : GET /log?id=...&mdp=...
// La réponse doit contenir un token → appeler saveSession(data.token)
function apiConnexion(identifiant, motDePasse, callback) {
    fetch(API_URL + "/log?id=" + encodeURIComponent(identifiant) + "&mdp=" + encodeURIComponent(motDePasse))
        .then(function (reponse) { return reponse.json(); })
        .then(function (data) {
            // Sauvegarder le token retourné par l'API si présent
            if (data && data.token) {
                saveSession(data.token);
            }
            if (data && data.id) {
                localStorage.setItem("user_id", data.id);
            }
            callback(null, data);
        })
        .catch(function (err) { callback(err, null); });
}

// ─── Observations ────────────────────────────────────────────────────────────

// Lire les observations : GET /aqr/{id}/obs
function apiGetObservations(idAquarium, callback) {
    fetch(API_URL + "/aqr/" + idAquarium + "/obs", {
        headers: authHeaders()
    })
        .then(function (r) { return r.json(); })
        .then(function (data) { callback(null, data); })
        .catch(function (err) { callback(err, null); });
}

// Ajouter une observation : POST /aqr/{id}/obs
function apiAjouterObservation(idAquarium, texte, callback) {
    fetch(API_URL + "/aqr/" + idAquarium + "/obs", {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ texte: texte })
    })
        .then(function (r) { return r.json(); })
        .then(function (data) { callback(null, data); })
        .catch(function (err) { callback(err, null); });
}

// ─── Modules ─────────────────────────────────────────────────────────────────

// Modules d'un aquarium : GET /aqr/{id}/mod
function apiGetModules(idAquarium, callback) {
    fetch(API_URL + "/aqr/" + idAquarium + "/mod", {
        headers: authHeaders()
    })
        .then(function (r) { return r.json(); })
        .then(function (data) { callback(null, data); })
        .catch(function (err) { callback(err, null); });
}

// ─── Utilisateurs ────────────────────────────────────────────────────────────

// Liste des utilisateurs : GET /utl (admin seulement)
function apiGetUtilisateurs(callback) {
    fetch(API_URL + "/utl", {
        headers: authHeaders()
    })
        .then(function (r) { return r.json(); })
        .then(function (data) { callback(null, data); })
        .catch(function (err) { callback(err, null); });
}

// Créer un utilisateur : POST /utl
function apiCreerUtilisateur(identifiant, motDePasse, callback) {
    fetch(API_URL + "/utl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifiant: identifiant, motDePasse: motDePasse })
    })
        .then(function (r) { return r.json(); })
        .then(function (data) { callback(null, data); })
        .catch(function (err) { callback(err, null); });
}

// ─── Médias (photos) ─────────────────────────────────────────────────────────

// Photos d'un aquarium : GET /aqr/{id}/med
function apiGetPhotos(idAquarium, callback) {
    fetch(API_URL + "/aqr/" + idAquarium + "/med", {
        headers: authHeaders()
    })
        .then(function (r) { return r.json(); })
        .then(function (data) { callback(null, data); })
        .catch(function (err) { callback(err, null); });
}
