// aquariums.js - Vue/gestion des aquariums

function getVueAquariums() {
  return {
    id: "vue_aquariums",
    rows: [
      {
        view: "toolbar",
        elements: [
          { view: "label", label: "Mes aquariums" },
        ]
      },
      {
        view: "scrollview",
        scroll: "y",
        body: {
          rows: [
            {
              // affiche les aquariums et leurs données de l'API dans une datatable
              view: "datatable",
              id: "aquaTable",
              columns: [
                { id: "media_id", header: "Image", width: 70, template: "<img src='//aquatrackapi.ir.lan/med/#media_id#/fch' width='55' height='55'>" },
                { id: "id", header: "Id", width: 50 },
                { id: "nom", header: "Nom", fillspace: true },
                { id: "user_id", header: "Propriétaire", width: 90 },
                { id: "acces", header: "Accès", width: 90 },
                { id: "volume", header: "Volume", width: 90 },
                { id: "date", header: "Date de creation", width: 160 }
              ],
              url: "https://aquatrackapi.ir.lan/aqr",
              select: "row",
              scrollX: false
            },
          ]
        }
      },
      {
        view: "toolbar",
        cols: [
          {
            // redirige vers la page de mesures de l'aquarium sélectionné
            view: "button", value: "Voir", css: "webix_secondary", height: 50, click: function () {
              var selected = $$("aquaTable").getSelectedId(true).join();
              if (selected) {
                webix.storage.local.put("aquarium_id", selected);
                naviguer("parametres");
                recupParametres();
                $$("retour").show();
                $$("menu_lateral").show();
                $$("menu_lateral").select("parametres");
              }
              else {
                webix.alert("Veuillez sélectionner un aquarium");
              }
            }
          },
          // bouton pour ajouter (fonctionne pas)
          {
            view: "button", value: "Ajouter", css: "webix_primary", height: 50, click: function () {
              webix.prompt({
                text: "Rentrez le nom du nouvel aquarium",
                width: 275,
                ok: "Confirmer",
                cancel: "Annuler",
                input: {
                  required: true,
                },
              });

            }
          },
          // bouton pour supprimer (rafraichir pour voir resultat)
          {
            view: "button", value: "Supprimer", css: "webix_danger", height: 50, click: function () {
              var selected = $$("aquaTable").getSelectedId(true).join();
              if (selected) {
                webix.confirm({
                  text: "Voulez vous vraiment supprimer cet aquarium ? : " + selected,
                  ok: "Oui",
                  cancel: "Non"
                })
                  .then(function () {
                    webix.ajax()
                      .del("https://aquatrackapi.ir.lan/aqr/" + selected );
                  })
              }
              else {
                webix.alert("Veuillez sélectionner un aquarium ");
              }
            }
          },
          // bouton pour modifier (fonctionne pas)
          {
            view: "button", value: "Modifier", css: "webix_transparent", height: 50, click: function () {
              var selected = $$("aquaTable").getSelectedId(true).join();
              if (selected) {
                webix.confirm({
                  text: "Voulez vous vraiment modifier cet aquarium ? : " + selected,
                  ok: "Oui",
                  cancel: "Non"
                });
              }
              else {
                webix.alert("Veuillez sélectionner un aquarium");
              }
            }
          }
        ]
      }
    ]
  }
};