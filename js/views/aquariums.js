// aquariums.js - Vue gestion des aquariums

function getVueAquariums() {
    return {
        id: "vue_aquariums",
        rows: [
            {
                view: "toolbar",
                elements: [
                    { view: "label", label: "Mes Aquariums" },
                    { view: "spacer" },
                    {
                        view: "button",
                        value: "+ Ajouter",
                        width: 120,
                        css: "webix_primary",
                        click: function() { afficherFormulaireAquarium(); }
                    }
                ]
            },
            {
                // affiche les données de l'API dans une datatable
                view: "datatable",
                id: "tableau_aquariums",
                autoheight: false,
                scroll: true,
                columns: [
                    { id:"media_id", header:"Image", width:55, template:"<img src='//aquatrackapi.ir.lan/aqr/#media_id#' width='55' height='55'>"},
                    { id:"nom", header:"Nom", fillspace:true },
                    { id:"user_id", header:"Propriétaire", width:90 },
                    { id:"acces", header:"Accès", width:90 },
                    { id:"volume", header:"Volume", width:90 },
                    { id:"date", header:"Date de creation", width:155 },
                ],
                // récupère les données de l'API avec l'URL spécifiée
                url:function(params){
                    return webix.ajax("//aquatrackapi.ir.lan/aqr");
                },
                select:"row",
                scrollX: false
            }
        ]
    };
}

function chargerAquariums() {
    /*
    apiGetAquariums(function(err, data) {
        if (err || !data) {
            // Données de démo
            data = [
                { id: 1, nom: "Aquarium tropical",  volume: 200, date: "2025-01-10" },
                { id: 2, nom: "Aquarium eau douce",  volume: 100, date: "2025-03-05" },
                { id: 3, nom: "Nano reef",            volume:  50, date: "2025-06-20" }
            ];
        }
        $$("tableau_aquariums").clearAll();
        $$("tableau_aquariums").parse(data);
    });
    */
}

function afficherFormulaireAquarium() {
    webix.ui({
        view: "window",
        id: "fenetre_aquarium",
        head: "Nouvel aquarium",
        modal: true,
        position: "center",
        width: 350,
        body: {
            view: "form",
            elements: [
                {
                    view: "text",
                    id: "aqr_nom",
                    label: "Nom",
                    labelPosition: "top",
                    maxlength: 200
                },
                {
                    view: "text",
                    id: "aqr_volume",
                    label: "Volume (litres)",
                    labelPosition: "top"
                },
                {
                    cols: [
                        {
                            view: "button",
                            value: "Annuler",
                            click: function() { $$("fenetre_aquarium").close(); }
                        },
                        {
                            view: "button",
                            value: "Créer",
                            css: "webix_primary",
                            click: function() {
                                var nom    = $$("aqr_nom").getValue();
                                var volume = $$("aqr_volume").getValue();

                                if (nom == "") {
                                    webix.message({ type: "error", text: "Le nom est obligatoire" });
                                    return;
                                }

                                apiCreerAquarium(nom, volume, function(err, data) {
                                    $$("fenetre_aquarium").close();
                                    webix.message({ type: "success", text: "Aquarium créé !" });
                                    chargerAquariums();
                                });
                            }
                        }
                    ]
                }
            ]
        }
    }).show();
}

function supprimerAquarium(id) {
    webix.confirm({
        title: "Supprimer",
        text: "Voulez-vous vraiment supprimer cet aquarium ?",
        callback: function(reponse) {
            if (reponse) {
                apiSupprimerAquarium(id, function(err, data) {
                    webix.message({ type: "success", text: "Aquarium supprimé" });
                    chargerAquariums();
                });
            }
        }
    });
}

function voirAquarium(id) {
    // Ouvre les paramètres de cet aquarium
    localStorage.setItem("aquarium_selectionne", id);
    naviguer("parametres");
}

// autorise les requêtes AJAX à inclure les cookies pour l'authentification
webix.attachEvent("onBeforeAjax", function(mode, url, data, request) 
  {
    request.withCredentials = true;
  });

webix.ready(function(){
  // envoie une requête POST à l'API pour se connecter avec les informations d'identification
  webix.ajax()
    .headers({"Content-Type":"application/json"})
    .post("https://aquatrackapi.ir.lan/log",JSON.stringify({"email": "Alex@ir.lan","motdepasse": "Alex1234"}));
});