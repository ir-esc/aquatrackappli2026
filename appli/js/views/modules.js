// modules.js - Vue gestion des modules

function getVueModules() {
  return {
    id: "vue_modules",
    rows: [
      {
        view: "toolbar",
        cols: [
          { template: "Mes modules", type: "header", borderless: true },
        ]
      },
      {
        view: "scrollview",
        scroll: "y",
        body: {
          rows: [
            {
              // affiche les modules et leurs données de l'API dans une datatable
              view: "datatable",
              id: "modTable",
              columns: [
                { id: "aquarium_id", header: "Image", width: 70 },
                { id: "id", header: "Id", width: 50 },
                { id: "type", header: "Type", width: 90 },
                { id: "statut", header: "Statut", width: 90 },
                { id: "date_installation", header: "Date d'installation", width: 160 }
              ],
              // récupère les données de l'API avec l'URL spécifiée

              url: function (params) {
                chargerModules();
              },
              select: "row",
              scrollX: false
            },
          ]
        }
      },

      {
        view: "toolbar",
        cols: [
          // bouton pour appairer (fonctionne pas)
          {
            view: "button", value: "Appairer", css: "webix_primary", height: 50, click: function () {
              webix.prompt({
                text: "Adresse MAC du module",
                width: 275,
                ok: "Confirmer",
                cancel: "Annuler",
                input: {
                  required: true,
                },
              });
            }
          },

          // bouton pour modifier (fonctionne pas)
          {
            view: "button", value: "Modifier la configuration", css: "webix_transparent", height: 50, click: function () {
              var selected = $$("modTable").getSelectedId(true).join();
              if (selected) {
                webix.confirm({
                  text: "Voulez vous vraiment modifier ce module ? : " + selected,
                  ok: "Oui",
                  cancel: "Non"
                }).then(function () {
                  webix.ui({
                    view: "window",
                    modal: true,
                    width: 300,
                    position: "center",
                    head: "Modifier le module",
                    body: {
                      rows: [
                        {
                          view: "radio",
                          id: "configType",
                          label: "Type de configuration",
                          labelPosition: "top",
                          options: [
                            { id: "config1", value: "Intervalle régulier" },
                            { id: "config2", value: "Heure/jour" }
                          ]
                        },
                        {
                          view: "button",
                          value: "Enregistrer les modifications",
                          css: "webix_primary",
                          click: function () {
                            this.getTopParentView().close();
                          }
                        },
                        {
                          view: "button",
                          value: "annuler",
                          css: "webix_danger",
                          click: function () {
                            this.getTopParentView().close();
                          }
                        }
                      ]
                    }
                  }).show();
                });
              }
              else {
                webix.alert("Veuillez sélectionner un module");
              }
            }
          }
        ]
      }
    ]
  };
}

function chargerModules() {
    var aquariumId = webix.storage.local.get("aquarium_id");
    if (!aquariumId) return;

    $$("modTable").clearAll();
    webix.ajax("https://aquatrackapi.ir.lan/aqr/" + aquariumId + "/mod")
        .then(function(data) {
            $$("modTable").parse(data.json());
        });
}