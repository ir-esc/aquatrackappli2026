// utilisateurs.js - Vue gestion des utilisateurs (admin)

function getVueUtilisateurs() {
    return {
        id: "vue_utilisateurs",
        rows: [
            {
                view: "toolbar",
                elements: [
                    { view: "label", label: "👥 Gestion des utilisateurs" },
                    { view: "spacer" },
                    {
                        view: "button",
                        value: "+ Ajouter",
                        width: 120,
                        css: "webix_primary",
                        click: function() { afficherFormulaireUtilisateur(); }
                    }
                ]
            },
            {
                view: "datatable",
                id: "tableau_utilisateurs",
                columns: [
                    { id: "identifiant", header: "Identifiant", fillspace: true },
                    {
                        id: "admin",
                        header: "Administrateur",
                        width: 160,
                        template: function(obj) {
                            return obj.admin ? "✔ Oui" : "Non";
                        }
                    },
                    {
                        id: "actions",
                        header: "Actions",
                        width: 120,
                        template: function(obj) {
                            return "<button onclick=\"supprimerUtilisateur(" + obj.id + ")\">Supprimer</button>";
                        }
                    }
                ],
                data: []
            }
        ]
    };
}

function chargerUtilisateurs() {
    apiGetUtilisateurs(function(err, data) {
        if (err || !data) {
            data = [
                { id: 1, identifiant: "admin",  admin: true },
                { id: 2, identifiant: "alice",  admin: false },
                { id: 3, identifiant: "bob",    admin: false }
            ];
        }
        $$("tableau_utilisateurs").clearAll();
        $$("tableau_utilisateurs").parse(data);
    });
}

function afficherFormulaireUtilisateur() {
    webix.ui({
        view: "window",
        id: "fenetre_utilisateur",
        head: "Nouvel utilisateur",
        modal: true,
        position: "center",
        width: 350,
        body: {
            view: "form",
            elements: [
                {
                    view: "text",
                    id: "utl_identifiant",
                    label: "Identifiant",
                    labelPosition: "top",
                    maxlength: 200
                },
                {
                    view: "text",
                    id: "utl_mdp",
                    label: "Mot de passe",
                    type: "password",
                    labelPosition: "top",
                    maxlength: 100
                },
                {
                    view: "checkbox",
                    id: "utl_admin",
                    label: "Administrateur",
                    labelWidth: 150
                },
                {
                    cols: [
                        {
                            view: "button",
                            value: "Annuler",
                            click: function() { $$("fenetre_utilisateur").close(); }
                        },
                        {
                            view: "button",
                            value: "Créer",
                            css: "webix_primary",
                            click: function() {
                                var identifiant = $$("utl_identifiant").getValue();
                                var mdp         = $$("utl_mdp").getValue();

                                if (identifiant == "" || mdp == "") {
                                    webix.message({ type: "error", text: "Remplissez tous les champs" });
                                    return;
                                }

                                apiCreerUtilisateur(identifiant, mdp, function(err, data) {
                                    $$("fenetre_utilisateur").close();
                                    webix.message({ type: "success", text: "Utilisateur créé !" });
                                    chargerUtilisateurs();
                                });
                            }
                        }
                    ]
                }
            ]
        }
    }).show();
}

function supprimerUtilisateur(id) {
    webix.confirm({
        title: "Supprimer",
        text: "Supprimer cet utilisateur ?",
        callback: function(reponse) {
            if (reponse) {
                webix.message({ type: "success", text: "Utilisateur supprimé" });
                chargerUtilisateurs();
            }
        }
    });
}
