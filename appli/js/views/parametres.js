// parametres.js - Vue des paramètres physico-chimiques

function getVueParametres() {
    return {
        id: "vue_parametres",
        rows: [
            {
                view: "toolbar",
                elements: [
                    { view: "label", label: "📊 Paramètres physico-chimiques" },
                    { view: "spacer" },
                    {
                        view: "select",
                        id: "select_aquarium_ppc",
                        label: "Aquarium :",
                        labelWidth: 90,
                        width: 280,
                        options: [],
                        on: {
                            onChange: function(idAquarium) {
                                chargerParametres(idAquarium);
                            }
                        }
                    },
                    {
                        view: "button",
                        value: "+ Mesure",
                        width: 110,
                        css: "webix_primary",
                        click: function() { afficherFormulaireMesure(); }
                    }
                ]
            },
            {
                view: "datatable",
                id: "tableau_parametres",
                columns: [
                    { id: "date",   header: "Date / Heure", width: 180 },
                    { id: "type",   header: "Paramètre",    fillspace: true },
                    { id: "valeur", header: "Valeur",        width: 120 },
                    { id: "unite",  header: "Unité",         width: 80 }
                ],
                data: []
            }
        ]
    };
}

function chargerParametres(idAquarium) {
    if (!idAquarium) return;
    apiGetParametres(idAquarium, function(err, data) {
        if (err || !data) {
            // Données de démo
            data = [
                { id: 1, date: "2026-03-16 08:00", type: "pH",          valeur: "7.2",  unite: "" },
                { id: 2, date: "2026-03-16 08:00", type: "Température", valeur: "25.0", unite: "°C" },
                { id: 3, date: "2026-03-16 08:10", type: "pH",          valeur: "7.3",  unite: "" },
                { id: 4, date: "2026-03-16 08:10", type: "Nitrites",    valeur: "0.05", unite: "mg/L" }
            ];
        }
        $$("tableau_parametres").clearAll();
        $$("tableau_parametres").parse(data);
    });
}

function afficherFormulaireMesure() {
    webix.ui({
        view: "window",
        id: "fenetre_mesure",
        head: "Ajouter une mesure",
        modal: true,
        position: "center",
        width: 350,
        body: {
            view: "form",
            elements: [
                {
                    view: "select",
                    id: "mesure_type",
                    label: "Paramètre",
                    labelPosition: "top",
                    options: [
                        { id: "pH",          value: "pH" },
                        { id: "temperature", value: "Température (°C)" },
                        { id: "nitrites",    value: "Nitrites (mg/L)" },
                        { id: "nitrates",    value: "Nitrates (mg/L)" },
                        { id: "gh",          value: "Dureté totale GH" },
                        { id: "kh",          value: "Dureté carbonatée KH" },
                        { id: "conductivite",value: "Conductivité (S)" },
                        { id: "fer",         value: "Fer Fe (mg/L)" }
                    ]
                },
                {
                    view: "text",
                    id: "mesure_valeur",
                    label: "Valeur",
                    labelPosition: "top",
                    placeholder: "ex: 7.2"
                },
                {
                    cols: [
                        {
                            view: "button",
                            value: "Annuler",
                            click: function() { $$("fenetre_mesure").close(); }
                        },
                        {
                            view: "button",
                            value: "Enregistrer",
                            css: "webix_primary",
                            click: function() {
                                var type   = $$("mesure_type").getValue();
                                var valeur = $$("mesure_valeur").getValue();
                                var idAqr  = $$("select_aquarium_ppc").getValue();

                                if (valeur == "") {
                                    webix.message({ type: "error", text: "Entrez une valeur" });
                                    return;
                                }

                                apiAjouterMesure(idAqr, type, valeur, function(err, data) {
                                    $$("fenetre_mesure").close();
                                    webix.message({ type: "success", text: "Mesure ajoutée !" });
                                    chargerParametres(idAqr);
                                });
                            }
                        }
                    ]
                }
            ]
        }
    }).show();
}

// Remplir le select avec les aquariums disponibles
function remplirSelectAquariumsPPC(aquariums) {
    var options = aquariums.map(function(a) {
        return { id: a.id, value: a.nom };
    });
    $$("select_aquarium_ppc").define("options", options);
    $$("select_aquarium_ppc").refresh();
    if (options.length > 0) {
        $$("select_aquarium_ppc").setValue(options[0].id);
        chargerParametres(options[0].id);
    }
}
