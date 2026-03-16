// app.js - Point d'entrée de l'application Aquatrack
// SPA (Single Page Application) avec Webix

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
                        label: "🐠 Aquatrack",
                        css: { "color": "white", "font-size": "18px", "font-weight": "bold" }
                    },
                    { view: "spacer" },
                    {
                        view: "button",
                        value: "Déconnexion",
                        width: 130,
                        click: function() {
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
                            { id: "aquariums",    value: "🐟 Aquariums" },
                            { id: "parametres",   value: "📊 Paramètres" },
                            { id: "observations", value: "📝 Observations" },
                            { id: "modules",      value: "🔌 Modules" },
                            { id: "photos",       value: "📷 Photos" },
                            { id: "utilisateurs", value: "👥 Utilisateurs" }
                        ],
                        on: {
                            onAfterSelect: function(id) {
                                naviguer(id);
                            }
                        }
                    },
                    // Zone des vues
                    {
                        view: "multiview",
                        id: "zone_principale",
                        cells: [
                            getVueAquariums(),
                            getVueParametres(),
                            getVueObservations(),
                            getVueModules(),
                            getVuePhotos(),
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

    // Charger les données de la vue
    if (vue === "aquariums") {
        chargerAquariums();
    }
    else if (vue === "parametres") {
        chargerAquariumsPuisAppeler(remplirSelectAquariumsPPC);
    }
    else if (vue === "observations") {
        chargerAquariumsPuisAppeler(remplirSelectAquariumsObs);
    }
    else if (vue === "modules") {
        chargerAquariumsPuisAppeler(remplirSelectAquariumsMod);
    }
    else if (vue === "photos") {
        chargerAquariumsPuisAppeler(remplirSelectAquariumsPhoto);
    }
    else if (vue === "utilisateurs") {
        chargerUtilisateurs();
    }
}

// Récupère les aquariums et appelle une fonction avec la liste
function chargerAquariumsPuisAppeler(callback) {
    apiGetAquariums(function(err, data) {
        if (err || !data) {
            data = [
                { id: 1, nom: "Aquarium tropical",  volume: 200 },
                { id: 2, nom: "Aquarium eau douce",  volume: 100 },
                { id: 3, nom: "Nano reef",            volume:  50 }
            ];
        }
        aquariumsData = data;
        callback(data);
    });
}

// Démarrage de l'application
webix.ready(function() {
    // Si déjà connecté, afficher l'app directement
    if (getSession() || localStorage.getItem("user_id")) {
        afficherApp();
    } else {
        afficherLogin();
    }
});
