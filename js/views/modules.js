// modules.js - Gestion des modules connectés

// ------------------------------------------------
// Données de démo (remplacer par l'API plus tard)
// ------------------------------------------------
var listModules = [
    { id: 1, id_module: "ESP32-PH-001",  type: "Capteur pH",         statut: "appaire",    configuration: '{"periode": 600}' },
    { id: 2, id_module: "ESP32-CAM-001", type: "Module photo",        statut: "appaire",    configuration: '{"periode": 3600}' },
    { id: 3, id_module: "FEED-001",      type: "Module nourrissage",  statut: "en_attente", configuration: '{"horaires": ["07:00","17:00"]}' }
];

// ------------------------------------------------
// Construction de la vue Modules
// ------------------------------------------------
function getVueModules() {
    return {
        id: "vue_modules",
        rows: [

            // Barre du haut avec le titre et le sélecteur d'aquarium
            {
                view: "toolbar",
                elements: [
                    { view: "label", label: "🔌 Modules connectés" },
                    { view: "spacer" },
                    {
                        view: "select",
                        id: "select_aquarium_mod",
                        label: "Aquarium :",
                        labelWidth: 90,
                        width: 280,
                        options: [],
                        on: {
                            onChange: function(idAquarium) {
                                chargerModules(idAquarium);
                            }
                        }
                    }
                ]
            },

            // Tableau des modules
            {
                view: "datatable",
                id: "tableau_modules",
                columns: [
                    { id: "id_module",     header: "Identifiant",        fillspace: true },
                    { id: "type",          header: "Type",                width: 180 },
                    { id: "statut",        header: "Statut",              width: 160 },
                    { id: "configuration", header: "Configuration (JSON)", width: 200 },
                    {
                        id: "modifier",
                        header: "Action",
                        width: 110,
                        template: function(ligne) {
                            return "<button onclick=\"ouvrirModifierModule(" + ligne.id + ")\">✏ Modifier</button>";
                        }
                    }
                ],
                data: []
            }

        ]
    };
}

// ------------------------------------------------
// Charger les modules dans le tableau
// ------------------------------------------------
function chargerModules(idAquarium) {
    // On vide le tableau puis on met les données dedans
    $$("tableau_modules").clearAll();
    $$("tableau_modules").parse(listModules);
}

// ------------------------------------------------
// Ouvrir la fenêtre pour modifier un module
// ------------------------------------------------
function ouvrirModifierModule(id) {

    // On récupère les infos du module cliqué
    var module = $$("tableau_modules").getItem(id);

    // On affiche la fenêtre de modification
    webix.ui({
        view: "window",
        id: "fenetre_modifier",
        head: "Modifier le module",
        modal: true,
        position: "center",
        width: 380,
        body: {
            view: "form",
            elements: [

                {
                    view: "text",
                    id: "champ_id_module",
                    label: "Identifiant",
                    labelPosition: "top",
                    value: module.id_module
                },

                {
                    view: "select",
                    id: "champ_type",
                    label: "Type de module",
                    labelPosition: "top",
                    value: module.type,
                    options: [
                        "Capteur pH",
                        "Module photo",
                        "Module nourrissage",
                        "Capteur température"
                    ]
                },

                {
                    view: "select",
                    id: "champ_statut",
                    label: "Statut",
                    labelPosition: "top",
                    value: module.statut,
                    options: [
                        { id: "appaire",    value: "Appairage réalisé" },
                        { id: "en_attente", value: "En attente" }
                    ]
                },

                {
                    view: "select",
                    id: "champ_config",
                    label: "Configuration",
                    labelPosition: "right",
                    value: module.type,
                   options: [
                        "Intervalle",
                        "tout les 5 minutes",
                        "tout les 10 minutes",
                        "tout les 30 minutes",
                        "tout les 60 minutes",
                    ]
                },
                {
                    view: "select",
                    id: "champ_horaires",
                    label: "Horaires",
                    labelPosition: "left",
                    value: module.type,
                    options: [
                        "hebdomadaire",
                        "Lundi",
                        "mardi",
                        "mercredi",
                        "jeudi",
                        "vendredi",
                        "samedi",
                        "dimanche"
                    ],
                    view: "button",
                    value: "Annuler",
                    click: function() {
                    $$("d").close();
                            
                        },
                },

                // Boutons Annuler / Enregistrer
                {
                    cols: [
                        {
                            view: "button",
                            value: "Annuler",
                            click: function() {
                                $$("fenetre_modifier").close();
                            }
                        },
                        {
                            view: "button",
                            value: "Enregistrer",
                            css: "webix_primary",
                            click: function() {

                                // On lit les valeurs du formulaire
                                var nouvelIdentifiant = $$("champ_id_module").getValue();
                                var nouveauType       = $$("champ_type").getValue();
                                var nouveauStatut     = $$("champ_statut").getValue();
                                var nouvelleConfig    = $$("champ_config").getValue();

                                // Vérification simple
                                if (nouvelIdentifiant == "") {
                                    webix.message({ type: "error", text: "L'identifiant est obligatoire !" });
                                    return;
                                }

                                // On met à jour la ligne dans le tableau
                                $$("tableau_modules").updateItem(id, {
                                    id_module:     nouvelIdentifiant,
                                    type:          nouveauType,
                                    statut:        nouveauStatut,
                                    configuration: nouvelleConfig
                                });

                                $$("fenetre_modifier").close();
                                webix.message({ type: "success", text: "Module modifié !" });
                            }
                        }
                    ]
                }

            ]
        }
    }).show();
}

// ------------------------------------------------
// Remplir le sélecteur d'aquariums
// ------------------------------------------------
function remplirSelectAquariumsMod(aquariums) {
    var options = [];

    for (var i = 0; i < aquariums.length; i++) {
        options.push({ id: aquariums[i].id, value: aquariums[i].nom });
    }

    $$("select_aquarium_mod").define("options", options);
    $$("select_aquarium_mod").refresh();

    // On charge les modules du premier aquarium par défaut
    if (options.length > 0) {
        $$("select_aquarium_mod").setValue(options[0].id);
        chargerModules(options[0].id);
    }
}
