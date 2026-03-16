// api.js - Fonctions pour appeler l'API REST

var API_URL = "http://localhost:3000"; // adresse du serveur

// Récupérer le cookie de session stocké
function getSession() {
    return localStorage.getItem("session_cookie");
}

// Sauvegarder le cookie de session
function saveSession(cookie) {
    localStorage.setItem("session_cookie", cookie);
}

// Supprimer la session (déconnexion)
function supprimerSession() {
    localStorage.removeItem("session_cookie");
    localStorage.removeItem("user_id");
}

// Connexion : GET /log?id=...&mdp=...
function apiConnexion(identifiant, motDePasse, callback) {
    fetch(API_URL + "/log?id=" + identifiant + "&mdp=" + motDePasse)
        .then(function(reponse) { return reponse.json(); })
        .then(function(data) { callback(null, data); })
        .catch(function(err) { callback(err, null); });
}

// Liste des aquariums : GET /aqr
function apiGetAquariums(callback) {
    fetch(API_URL + "/aqr", {
        headers: { "Cookie": getSession() }
    })
        .then(function(r) { return r.json(); })
        .then(function(data) { callback(null, data); })
        .catch(function(err) { callback(err, null); });
}

// Créer un aquarium : POST /aqr
function apiCreerAquarium(nom, volume, callback) {
    fetch(API_URL + "/aqr", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Cookie": getSession()
        },
        body: JSON.stringify({ nom: nom, volume: volume })
    })
        .then(function(r) { return r.json(); })
        .then(function(data) { callback(null, data); })
        .catch(function(err) { callback(err, null); });
}

// Supprimer un aquarium : DELETE /aqr/(id)
function apiSupprimerAquarium(id, callback) {
    fetch(API_URL + "/aqr/" + id, {
        method: "DELETE",
        headers: { "Cookie": getSession() }
    })
        .then(function(r) { callback(null, r.status); })
        .catch(function(err) { callback(err, null); });
}

// Paramètres physico-chimiques d'un aquarium : GET /aqr/(id)/ppc
function apiGetParametres(idAquarium, callback) {
    fetch(API_URL + "/aqr/" + idAquarium + "/ppc", {
        headers: { "Cookie": getSession() }
    })
        .then(function(r) { return r.json(); })
        .then(function(data) { callback(null, data); })
        .catch(function(err) { callback(err, null); });
}

// Ajouter une mesure : POST /aqr/(id)/ppc
function apiAjouterMesure(idAquarium, type, valeur, callback) {
    var maintenant = new Date().toISOString();
    fetch(API_URL + "/aqr/" + idAquarium + "/ppc", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Cookie": getSession()
        },
        body: JSON.stringify({ type: type, valeur: valeur, date: maintenant })
    })
        .then(function(r) { return r.json(); })
        .then(function(data) { callback(null, data); })
        .catch(function(err) { callback(err, null); });
}

// Observations d'un aquarium : GET /aqr/(id)/obs
function apiGetObservations(idAquarium, callback) {
    fetch(API_URL + "/aqr/" + idAquarium + "/obs", {
        headers: { "Cookie": getSession() }
    })
        .then(function(r) { return r.json(); })
        .then(function(data) { callback(null, data); })
        .catch(function(err) { callback(err, null); });
}

// Ajouter une observation : POST /aqr/(id)/obs
function apiAjouterObservation(idAquarium, texte, callback) {
    fetch(API_URL + "/aqr/" + idAquarium + "/obs", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Cookie": getSession()
        },
        body: JSON.stringify({ texte: texte })
    })
        .then(function(r) { return r.json(); })
        .then(function(data) { callback(null, data); })
        .catch(function(err) { callback(err, null); });
}

// Modules d'un aquarium : GET /aqr/(id)/mod
function apiGetModules(idAquarium, callback) {
    fetch(API_URL + "/aqr/" + idAquarium + "/mod", {
        headers: { "Cookie": getSession() }
    })
        .then(function(r) { return r.json(); })
        .then(function(data) { callback(null, data); })
        .catch(function(err) { callback(err, null); });
}

// Liste des utilisateurs : GET /utl  (admin seulement)
function apiGetUtilisateurs(callback) {
    fetch(API_URL + "/utl", {
        headers: { "Cookie": getSession() }
    })
        .then(function(r) { return r.json(); })
        .then(function(data) { callback(null, data); })
        .catch(function(err) { callback(err, null); });
}

// Créer un utilisateur : POST /utl
function apiCreerUtilisateur(identifiant, motDePasse, callback) {
    fetch(API_URL + "/utl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifiant: identifiant, motDePasse: motDePasse })
    })
        .then(function(r) { return r.json(); })
        .then(function(data) { callback(null, data); })
        .catch(function(err) { callback(err, null); });
}

// Médias (photos) d'un aquarium : GET /aqr/(id)/med  => via /obs
function apiGetPhotos(idAquarium, callback) {
    // Les photos sont liées aux observations
    apiGetObservations(idAquarium, callback);
}
