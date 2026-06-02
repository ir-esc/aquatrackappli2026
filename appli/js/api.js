// api.js - Fonctions pour appeler l'API REST AquaTrack

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