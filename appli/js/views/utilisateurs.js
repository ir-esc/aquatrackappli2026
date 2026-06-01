// utilisateurs_simple.js - Gestion des utilisateurs SANS API

// 1) Tableau local qui contient les utilisateurs
//    - id : identifiant numérique unique
//    - identifiant : login
//    - admin : booléen (true = administrateur)
var utilisateurs = [
    { id: 1, identifiant: "admin", admin: true },
    { id: 2, identifiant: "alice", admin: false },
    { id: 3, identifiant: "bob",   admin: false }
];

// 2) Vue principale "Gestion des utilisateurs"
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
                data: utilisateurs   // <== on utilise directement le tableau local
            }
        ]
    };
}

// 3) Recharge le datatable depuis le tableau local
function chargerUtilisateurs() {
    var table = $$("tableau_utilisateurs");
    if (!table) return;
    table.clearAll();
    table.parse(utilisateurs);
}

// 4) Fenêtre "Nouvel utilisateur"
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
                                var admin       = $$("utl_admin").getValue(); // true / false

                                // 4.1 Vérification simple des champs
                                if (identifiant == "" || mdp == "") {
                                    webix.message({ type: "error", text: "Remplissez tous les champs" });
                                    return;
                                }

                                
                                // 4.2 Ajout dans l'API
                               webix.ajax.post("https://aquatrackapi.ir.lan/utl", {
                                                 email: identifiant,
	                                             motdepasse : mdp
                               });



                                // 4.4 Fermeture + message + refresh du tableau
                                $$("fenetre_utilisateur").close();
                                webix.message({ type: "success", text: "Utilisateur créé !" });
                                chargerUtilisateurs();
                            }
                        }
                    ]
                }
            ]
        }
    }).show();
}

// 5) Suppression d'un utilisateur (dans le tableau local)
function supprimerUtilisateur(id) {
    webix.confirm({
        title: "Supprimer",
        text: "Supprimer cet utilisateur ?",
        callback: function(reponse) {
            if (reponse) {

webix.ajax().del("https://aquatrackapi.ir.lan/log", { id: id }, function(text, data, request) {
                        console.log(text);


                });









                // 5.1 On filtre le tableau pour enlever l'utilisateur
                utilisateurs = utilisateurs.filter(function(u) {
                    return u.id !== id;
                });

                // 5.2 On met à jour l'affichage
                chargerUtilisateurs();

                webix.message({ type: "success", text: "Utilisateur supprimé" });
            }
        }
    });
}