// FICHIER : login.js - Vue de connexion pour Aquatrack
// =============================================================================
// // PARTIE 1 : FENÊTRE DE CONNEXION PRINCIPALE


// Affiche la fenêtre de connexion en plein écran
// Formulaire avec identifiant + mot de passe
// Bouton "Se connecter" qui appelle l'API
// Bouton "Créer un compte" qui ouvre le formulaire d'inscription

function afficherLogin() {
    // 1.1 Création de la fenêtre principale
    webix.ui({
        id: "vue_login",           // ID unique pour fermer/accéder à la fenêtre
        view: "window",
        fullscreen: true,          // Plein écran
        body: {
            // 1.2 Formulaire centralisé (largeur 350px)
            view: "form",
            id: "form_login",
            width: 350,
            borderless: true,
            elements: [
                
                // 1.3 Titre de l'application
                {
                    view: "template",
                    template: "<div style='text-align:center; font-size:24px; color:#0077b6; padding:20px;'>🐠 Aquatrack</div>",
                    height: 80,
                    borderless: true
                },
                
                // 1.4 Champ identifiant utilisateur
                {
                    view: "text",
                    id: "champ_identifiant",
                    label: "Identifiant",
                    placeholder: "Votre identifiant",
                    labelPosition: "top"
                },
                
                // 1.5 Champ mot de passe (masqué)
                {
                    view: "text",
                    id: "champ_mdp",
                    label: "Mot de passe",
                    type: "password",// Masque les caractères
                    placeholder: "Votre mot de passe",
                    labelPosition: "top"
                },
                
                // 1.6 Bouton principal "Se connecter"
                {
                    view: "button",
                    value: "Se connecter",
                    css: "webix_primary",  // Style bouton principal (bleu)
                    click: function() {
                        // 1.6.1 Récupération des valeurs des champs
                        var identifiant = $$("champ_identifiant").getValue();
                        var mdp = $$("champ_mdp").getValue();

                        // 1.6.2 Validation des champs vides
                        if (identifiant == "" || mdp == "") {
                            webix.message({ type: "error", text: "Remplissez tous les champs !" });
                            return;  // Arrêt de l'exécution
                        }

                        // 1.6.3 Appel à l'API de connexion
                        apiConnexion(identifiant, mdp, function(err, data) {
                            // 1.6.4 Gestion des cas d'erreur (mode démo)
                            if (err) {
                                webix.message({ type: "success", text: "Connexion en mode démo" });
                                localStorage.setItem("user_id", "1");
                                $$("vue_login").close();// Ferme la fenêtre de connexion
                                afficherApp();  // Lance l'application principale
                            } 
                            // 1.6.5 Gestion du succès avec cookie
                            else if (data && data.cookie) {/
                                saveSession(data.cookie);
                                localStorage.setItem("user_id", data.id || "1");// Stocke l'ID utilisateur (mode démo : "1")
                                webix.message({ type: "success", text: "Connecté !" });
                                $$("vue_login").close();
                                afficherApp();
                            } 
                            // 1.6.6 Identifiants incorrects
                            else {
                                webix.message({ type: "error", text: "Identifiant ou mot de passe incorrect" });// Affiche un message d'erreur
                            }
                        });
                    }
                },
                
                // 1.7 Espace de séparation
                { height: 20 },
                
                // 1.8 Bouton secondaire "Créer un compte"
                {
                    view: "button",
                    value: "Créer un compte",
                    click: function() {
                        afficherFormulaireInscription();  // Ouvre la fenêtre d'inscription
                    }
                }
            ]
        }
    }).show();  // Affiche la fenêtre
}

// =============================================================================
// PARTIE 2 : FENÊTRE D'INSCRIPTION (CRÉATION DE COMPTE)
// =============================================================================

// Affiche une fenêtre modale centrée pour créer un nouveau compte
// Formulaire avec identifiant + mot de passe
// Boutons "Annuler" et "Créer"

function afficherFormulaireInscription() {
    // 2.1 Création de la fenêtre modale
    webix.ui({
        view: "window",
        id: "fenetre_inscription",  // ID unique
        head: "Créer un compte",    // Titre de la fenêtre
        modal: true,                // Bloque l'interaction avec le reste
        position: "center",         // Centrée à l'écran
        width: 350,
        body: {
            // 2.2 Formulaire d'inscription
            view: "form",
            id: "form_inscription",
            elements: [
                
                // 2.3 Champ identifiant (nouveau)
                {
                    view: "text",
                    id: "nouveau_identifiant",
                    label: "Identifiant",
                    labelPosition: "top"
                },
                
                // 2.4 Champ mot de passe (nouveau)
                {
                    view: "text",
                    id: "nouveau_mdp",
                    label: "Mot de passe",
                    type: "password",
                    labelPosition: "top"
                },
                
                // 2.5 Ligne de boutons horizontale (centrée)
                {
                    cols: [
                        // 2.5.1 Bouton Annuler
                        {
                            view: "button",
                            value: "Annuler",
                            click: function() { 
                                $$("fenetre_inscription").close(); 
                            }
                        },
                        
                        // 2.5.2 Bouton Créer (principal)
                        {
                            view: "button",
                            value: "Créer",
                            css: "webix_primary",
                            click: function() {
                                // 2.5.2.1 Récupération des valeurs
                                var id = $$("nouveau_identifiant").getValue();// Récupération du nouvel identifiant
                                var mdp = $$("nouveau_mdp").getValue();// Récupération du mot de passe

                                // 2.5.2.2 Validation des champs
                                if (id == "" || mdp == "") {
                                    webix.message({ type: "error", text: "Remplissez tous les champs !" });
                                    return;
                                }

                                // 2.5.2.3 Appel à l'API de création d'utilisateur
                                apiCreerUtilisateur(id, mdp, function(err, data) {
                                    // 2.5.2.4 Fermeture et message de succès
                                    // ⚠️ ATTENTION : Ne gère pas les erreurs (ex : identifiant déjà pris) en mode démo
                                    $$("fenetre_inscription").close();// Ferme la fenêtre d'inscription
                                    webix.message({ type: "success", text: "Compte créé !" });// Affiche un message de succès
                                });
                            }
                        }
                    ]
                }
            ]
        }
    }).show();  // Affiche la fenêtre d'inscription
}
