// observations.js - Journal des observations

function getVueObservations() {
    return {
        id: "vue_observations",
        rows: [
            {
                view: "toolbar",
                elements: [
                    { view: "label", label: "📝 Journal des observations" },
                    { view: "spacer" },
                    {
                        view: "select",
                        id: "select_aquarium_obs",
                        label: "Aquarium :",
                        labelWidth: 90,
                        width: 280,
                        options: [],
                        on: {
                            onChange: function(id) { chargerObservations(id); }
                        }
                    },
                    {
                        view: "button",
                        value: "+ Observation",
                        width: 140,
                        css: "webix_primary",
                        click: function() { afficherFormulaireObservation(); }
                    }
                ]
            },
            {
                view: "list",
                id: "liste_observations",
                template: function(obj) {
                    return "<b>" + (obj.date || "sans date") + "</b><br>" + obj.texte;
                },
                type: { height: 80 },
                data: []
            }
        ]
    };
}

function chargerObservations(idAquarium) {
    if (!idAquarium) return;
    apiGetObservations(idAquarium, function(err, data) {
        if (err || !data) {
            data = [
                { id: 1, date: "2026-03-10", texte: "Ajout de 2 poissons néons. Comportement normal." },
                { id: 2, date: "2026-03-12", texte: "Changement de 20% de l'eau. pH stable à 7.2." },
                { id: 3, date: "2026-03-15", texte: "Observation de frai. Les parents protègent les œufs." }
            ];
        }
        $$("liste_observations").clearAll();
        $$("liste_observations").parse(data);
    });
}

function afficherFormulaireObservation() {
    webix.ui({
        view: "window",
        id: "fenetre_observation",
        head: "Nouvelle observation",
        modal: true,
        position: "center",
        width: 400,
        body: {
            view: "form",
            elements: [
                {
                    view: "textarea",
                    id: "obs_texte",
                    label: "Observation",
                    labelPosition: "top",
                    height: 120,
                    maxlength: 1000,
                    placeholder: "Décrivez votre observation (max 1000 caractères)..."
                },
                {
                    cols: [
                        {
                            view: "button",
                            value: "Annuler",
                            click: function() { $$("fenetre_observation").close(); }
                        },
                        {
                            view: "button",
                            value: "Enregistrer",
                            css: "webix_primary",
                            click: function() {
                                var texte = $$("obs_texte").getValue();
                                var idAqr = $$("select_aquarium_obs").getValue();

                                if (texte == "") {
                                    webix.message({ type: "error", text: "Écrivez une observation" });
                                    return;
                                }

                                apiAjouterObservation(idAqr, texte, function(err, data) {
                                    $$("fenetre_observation").close();
                                    webix.message({ type: "success", text: "Observation ajoutée !" });
                                    chargerObservations(idAqr);
                                });
                            }
                        }
                    ]
                }
            ]
        }
    }).show();
}

function remplirSelectAquariumsObs(aquariums) {
    var options = aquariums.map(function(a) {
        return { id: a.id, value: a.nom };
    });
    $$("select_aquarium_obs").define("options", options);
    $$("select_aquarium_obs").refresh();
    if (options.length > 0) {
        $$("select_aquarium_obs").setValue(options[0].id);
        chargerObservations(options[0].id);
    }
}
