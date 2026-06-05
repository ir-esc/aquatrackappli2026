// login.js - Page de connexion

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

const API_BASE = "https://aquatrackapi.ir.lan";

// ─── Connexion ────────────────────────────────────────────────────────────────
function afficherLogin() {
    webix.ui({
        id: "vue_login",
        view: "window",
        fullscreen: true,
        body: {
            view: "form",
            id: "form_login",
            width: 350,
            borderless: true,
            elements: [
                {
                    view: "template",
                    template: "<div style='text-align:center; font-size:24px; color:#0077b6; padding:20px'>AquaTrack</div>",
                    height: 80,
                    borderless: true
                },
                {
                    view: "text",
                    id: "champ_identifiant",
                    label: "Identifiant",
                    // met l'identifiant automatiquement
                    value: "Alex@ir.lan",
                    placeholder: "Votre identifiant",
                    labelPosition: "top"
                },
                {
                    view: "text",
                    id: "champ_mdp",
                    // met le mdp automatiquement
                    value: "Alex1234",
                    label: "Mot de passe",
                    type: "password",
                    placeholder: "Votre mot de passe",
                    labelPosition: "top"
                },
                {
                    view: "button",
                    value: "Se connecter",
                    css: "webix_primary",
                    click: function () {
                        var email = $$("champ_identifiant").getValue();
                        var mdp = $$("champ_mdp").getValue();

                        if (!email || !mdp) {
                            webix.message({ type: "error", text: "Veuillez remplir tous les champs !" });
                            return;
                        }

                        apiLogin(email, mdp, function (err, data) {
                            if (err) {
                                webix.message({ type: "error", text: err });
                            } else {
                                webix.message({ type: "success", text: "Connexion réussie !" });
                                $$("vue_login").destructor();
                                afficherApp();
                            }
                        });
                    }
                },
                { height: 20 },
                {
                    view: "button",
                    value: "Créer un compte",
                    click: function () { afficherFormulaireInscription(); }
                }
            ]
        }
    }).show();
}

// ─── Appel API login ──────────────────────────────────────────────────────────
function apiLogin(email, motdepasse, callback) {
    fetch(API_BASE + "/log", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, motdepasse: motdepasse })
    })
        .then(function (r) {
            return r.json().then(function (data) {
                if (r.ok) {
                    callback(null, data);
                } else {
                    callback(data.message || "Echec de l authentification", null);
                }
            });
        })
        .catch(function (err) {
            callback("Erreur reseau : " + err.message, null);
        });
}


// ─── Inscription ──────────────────────────────────────────────────────────────
function afficherFormulaireInscription() {
    webix.ui({
        view: "window",
        id: "fenetre_inscription",
        head: "Creer un compte",
        modal: true,
        position: "center",
        width: 350,
        body: {
            view: "form",
            id: "form_inscription",
            elements: [
                {
                    view: "text",
                    id: "email_inscription",
                    label: "Email",
                    placeholder: "Votre email",
                    labelPosition: "top"
                },
                {
                    view: "text",
                    id: "mdp_inscription",
                    label: "Mot de passe",
                    type: "password",
                    placeholder: "Votre mot de passe",
                    labelPosition: "top"
                },
                {
                    cols: [
                        {
                            view: "button",
                            value: "Annuler",
                            click: function () { $$("fenetre_inscription").close(); }
                        },
                        {
                            view: "button",
                            value: "S inscrire",
                            css: "webix_primary",
                            click: function () {
                                var email = $$("email_inscription").getValue();
                                var mdp = $$("mdp_inscription").getValue();

                                if (!email || !mdp) {
                                    webix.message({ type: "error", text: "Veuillez remplir tous les champs !" });
                                    return;
                                }

                                // POST /utl  →  { email, motdepasse }
                                fetch(API_BASE + "/utl", {
                                    method: "POST",
                                    credentials: "include",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ email: email, motdepasse: mdp })
                                })
                                    .then(function (r) {
                                        return r.json().then(function (data) {

                                            if (r.status === 201) {
                                                // Succes
                                                webix.message({ type: "success", text: "Compte cree avec succes ! Vous pouvez vous connecter." });
                                                $$("fenetre_inscription").close();

                                            } else if (r.status === 409) {
                                                // Email deja utilise : message dans data.messages.error
                                                var msg = (data.messages && data.messages.error) ? data.messages.error : "Email deja utilise";
                                                webix.message({ type: "error", text: msg });

                                            } else if (r.status === 400) {
                                                // Donnees invalides : message dans data.message
                                                webix.message({ type: "error", text: data.message || "Donnees invalides" });

                                            } else {
                                                webix.message({ type: "error", text: data.message || "Erreur inconnue" });
                                            }
                                        });
                                    })
                                    .catch(function (err) {
                                        webix.message({ type: "error", text: "Erreur reseau : " + err.message });
                                    });
                            }
                        }
                    ]
                }
            ]
        }
    }).show();
}

