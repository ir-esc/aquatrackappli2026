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
                css: { "background-color": "#0077b6" },
                elements: [
                    {
                        view: "label",
                        label: "Aquatrack",
                        css: { "color": "white", "font-size": "18px", "font-weight": "bold" }
                    },
                    { view: "spacer" },
                    {
                        view: "button",
                        value: "Déconnexion",
                        width: 130,
                        css: "webix_danger",
                        click: function () {
                            supprimerSession();
                            $$("app_principal").destructor();
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
                            { id: "aquariums", value: "Aquariums" },
                            { id: "parametres", value: "Paramètres" },
                            { id: "observations", value: "Observations" },
                            { id: "modules", value: "Modules" },
                            { id: "photos", value: "Photos" },
                            { id: "nourrissage", value: "Nourrissage" },
                            { id: "utilisateurs", value: "Utilisateurs" }
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
                            getVueObservations(),
                            getVueModules(),
                            getVuePhotos(),
                            getVueNourrissage(),
                            getVueUtilisateurs()
                        ]
                    }
                ]
            }
        ]
    });

    // Sélection par défaut
    $$("menu_lateral").select("aquariums");
    naviguer("aquariums");
}

// Changer de vue dans la SPA
function naviguer(vue) {
    $$("zone_principale").setValue("vue_" + vue);
    $$("zone_principale").attachEvent("onViewChange", function (prevID, nextID) {
        if (nextID == "vue_parametres") {
            recupParametres();
        }
    });
}

// Démarrage de l'application
webix.ready(function () {
    // Si déjà connecté, afficher l'app directement
    if (getSession() || localStorage.getItem("user_id")) {
        afficherApp();
    } else {
        afficherLogin();
    }
});
