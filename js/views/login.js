// login.js - Vue de connexion

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
                    template: "<div style='text-align:center; font-size:24px; color:#0077b6; padding:20px;'>🐠 Aquatrack</div>",
                    height: 80,
                    borderless: true
                },
                {
                    view: "text",
                    id: "champ_identifiant",
                    label: "Identifiant",
                    placeholder: "Votre identifiant",
                    labelPosition: "top"
                },
                {
                    view: "text",
                    id: "champ_mdp",
                    label: "Mot de passe",
                    type: "password",
                    placeholder: "Votre mot de passe",
                    labelPosition: "top"
                },
                {
                    view: "button",
                    value: "Se connecter",
                    css: "webix_primary",
                    click: function() {
                        var identifiant = $$("champ_identifiant").getValue();
                        var mdp = $$("champ_mdp").getValue();

                        if (identifiant == "" || mdp == "") {
                            webix.message({ type: "error", text: "Remplissez tous les champs !" });
                            return;
                        }

                        apiConnexion(identifiant, mdp, function(err, data) {
                            if (err) {
                                // Mode démo sans serveur
                                webix.message({ type: "success", text: "Connexion en mode démo" });
                                localStorage.setItem("user_id", "1");
                                $$("vue_login").close();
                                afficherApp();
                            } else if (data && data.cookie) {
                                saveSession(data.cookie);
                                localStorage.setItem("user_id", data.id || "1");
                                webix.message({ type: "success", text: "Connecté !" });
                                $$("vue_login").close();
                                afficherApp();
                            } else {
                                webix.message({ type: "error", text: "Identifiant ou mot de passe incorrect" });
                            }
                        });
                    }
                },
                { height: 20 },
                {
                    view: "button",
                    value: "Créer un compte",
                    click: function() {
                        afficherFormulaireInscription();
                    }
                }
            ]
        }
    }).show();
}

function afficherFormulaireInscription() {
    webix.ui({
        view: "window",
        id: "fenetre_inscription",
        head: "Créer un compte",
        modal: true,
        position: "center",
        width: 350,
        body: {
            view: "form",
            id: "form_inscription",
            elements: [
                {
                    view: "text",
                    id: "nouveau_identifiant",
                    label: "Identifiant",
                    labelPosition: "top"
                },
                {
                    view: "text",
                    id: "nouveau_mdp",
                    label: "Mot de passe",
                    type: "password",
                    labelPosition: "top"
                },
                {
                    cols: [
                        {
                            view: "button",
                            value: "Annuler",
                            click: function() { $$("fenetre_inscription").close(); }
                        },
                        {
                            view: "button",
                            value: "Créer",
                            css: "webix_primary",
                            click: function() {
                                var id = $$("nouveau_identifiant").getValue();
                                var mdp = $$("nouveau_mdp").getValue();

                                if (id == "" || mdp == "") {
                                    webix.message({ type: "error", text: "Remplissez tous les champs !" });
                                    return;
                                }

                                apiCreerUtilisateur(id, mdp, function(err, data) {
                                    $$("fenetre_inscription").close();
                                    webix.message({ type: "success", text: "Compte créé !" });
                                });
                            }
                        }
                    ]
                }
            ]
        }
    }).show();
}
