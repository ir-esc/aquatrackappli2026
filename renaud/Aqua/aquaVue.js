function afficherAquariums() {
  webix.ui({
    rows: [
      {
        view: "toolbar",
        cols: [
          { view: "button", value: "Déconnexion", css: "webix_danger", inputWidth: 110 },
          { template: "Mes aquariums", type: "header", borderless: true },
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
                { id: "media_id", header: "Image", width: 70, template: "<img src='//aquatrackapi.ir.lan/aqr/#media_id#' width='55' height='55'>" },
                { id: "id", header: "Id", width: 50 },
                { id: "nom", header: "Nom", fillspace: true },
                { id: "user_id", header: "Propriétaire", width: 90 },
                { id: "acces", header: "Accès", width: 90 },
                { id: "volume", header: "Volume", width: 90 },
                { id: "date", header: "Date de creation", width: 160 }
              ],
              // récupère les données de l'API avec l'URL spécifiée
              url: function (params) {
                return webix.ajax("https://aquatrackapi.ir.lan/aqr");
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
          {
            // redirige vers la page de mesures de l'aquarium sélectionné
            view: "button", value: "Voir", css: "webix_secondary", height: 50, click: function () {
              var selected = $$("aquaTable").getSelectedId(true).join();
              if (selected) {
                window.location.href = "../Mesures/mesures.html?id=" + selected;
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
          // bouton pour supprimer (fonctionne pas)
          {
            view: "button", value: "Supprimer", css: "webix_danger", height: 50, click: function () {
              var selected = $$("aquaTable").getSelectedId(true).join();
              if (selected) {
                webix.confirm({
                  text: "Voulez vous vraiment supprimer cet aquarium ? : " + selected,
                  ok: "Oui",
                  cancel: "Non"
                });
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
  });
}

webix.ready(function () {
  // autorise les requêtes AJAX à inclure les cookies pour l'authentification
  webix.attachEvent("onBeforeAjax", function (mode, url, data, request) {
    request.withCredentials = true;
  });

  // envoie une requête POST à l'API pour se connecter avec les informations d'identification
  webix.ajax()
    .headers({ "Content-Type": "application/json" })
    .post("https://aquatrackapi.ir.lan/log", JSON.stringify({ "email": "Alex@ir.lan", "motdepasse": "Alex1234" }), afficherAquariums);
  //.post("https://aquatrackapi.ir.lan/log",JSON.stringify({"email": "anna@ir.lan","motdepasse": "Anna1234"}),afficherAquariums);
  //.post("https://aquatrackapi.ir.lan/log",JSON.stringify({"email": "paul@ir.lan","motdepasse": "Paul1234"}),afficherAquariums);
});