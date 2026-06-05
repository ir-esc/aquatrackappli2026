// app.js - Point d'entrée de l'application Aquatrack
// SPA (Single Page Application) avec Webix

// app.js — UNE seule ligne, avant tout appel API
webix.attachEvent("onBeforeAjax", function (mode, url, data, req) {
    req.withCredentials = true;
});


// Données des aquariums chargées au démarrage
var aquariumsData = [];

// Affiche la vue principale (après connexion)
function afficherApp() {
    webix.ui({
        id: "app_principal",
        rows: [
            // --- BARRE DU HAUT ---
            {
                view: "toolbar",
                height: 50,
                css: { "background-color": "#badeff" },
                elements: [
                    {
                        // Retour sur la vue des aquariums et supprime le stockage local
                        view: "button",
                        id: "retour",
                        type: "icon",
                        icon: "mdi mdi-arrow-left",
                        width: 50,
                        click: function () {
                            webix.storage.local.clear();
                            naviguer("aquariums");
                        }
                    },
                    {
                        view: "label",
                        label: "Aquatrack",
                        align: "center"
                    },
                    {
                        view: "button",
                        value: "Déconnexion",
                        width: 130,
                        css: "webix_danger",
                        click: function () {
                            supprimerSession();
                            $$("app_principal").destructor();
                            webix.storage.local.clear();
                            afficherLogin();
                        }
                    }
                ]
            },
            // --- CONTENU PRINCIPAL (menu + vues) ---
            {
                cols: [
                    // Menu latéral
                    {
                        view: "list",
                        id: "menu_lateral",
                        width: 200,
                        select: true,
                        data: [
                            { id: "parametres", value: "Paramètres" },
                            { id: "modules", value: "Modules" },
                            { id: "photos", value: "Photos" },
                            { id: "nourrissage", value: "Nourrissage" },
                        ],
                        on: {
                            onAfterSelect: function (id) {
                                naviguer(id);
                            }
                        }
                    },
                    // Zone des vues
                    {
                        view: "multiview",
                        id: "zone_principale",
                        cells: [// Les différentes vues de l'application
                            getVueAquariums(),
                            getVueParametres(),
                            getVueModules(),
                            getVuePhotos(),
                            getVueNourrissage(),
                        ]
                    }
                ]
            }
        ]
    });

    // Sélection par défaut
    naviguer("aquariums");
}

// Changement de vue dans l'appli
function naviguer(vue) {
    $$("zone_principale").setValue("vue_" + vue);

    if (vue == "aquariums") {
        $$("menu_lateral").hide();
        $$("retour").hide();
    }
}

// Démarrage de l'application
webix.ready(function () {
    // Si déjà connecté, afficher l'app directement
    if (getSession() || localStorage.getItem("user_id")) {
        afficherApp();
    } else {
        webix.storage.local.clear();
        afficherLogin();
    }
});
