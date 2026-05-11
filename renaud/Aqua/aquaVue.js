function afficherAquariums() {
  webix.ui({
    view: "scrollview",
    scroll: "y",
    body: {
      rows:[
        {
          view:"toolbar",
          cols:[
            {
              view:"button", value:"Déconnexion", css:"webix_danger", inputWidth:110
            }
          ]
        },
        {
          // affiche les aquariums et leurs données de l'API dans une datatable
          view:"datatable",
          id:"aquaTable",
          columns:[
            { id:"media_id", header:"Image", width:55, template:"<img src='//aquatrackapi.ir.lan/aqr/#media_id#' width='55' height='55'>"},
            { id:"nom", header:"Nom", fillspace:true },
            { id:"user_id", header:"Propriétaire", width:90 },
            { id:"acces", header:"Accès", width:90 },
            { id:"volume", header:"Volume", width:90 },
            { id:"date", header:"Date de creation", width:155 }
          ],
          // récupère les données de l'API avec l'URL spécifiée
          url:function(params){
            return webix.ajax("https://aquatrackapi.ir.lan/aqr");
          },
          select:"row",
          scrollX: false
        },
        {
          view:"toolbar",
          cols:[
            {
              // redirige vers la page de mesures de l'aquarium sélectionné
              view:"button", value:"Voir", css:"webix_secondary", height:50, click:function(){
                var selected = $$("aquaTable").getSelectedItem()
                if(selected && selected.id) {
                  window.location.href = "../Mesures/mesures.html?id=" + selected.id;
                }
                else {
                  webix.alert("Veuillez sélectionner un aquarium");
                }
              }
            },
            {
              view:"button", value:"Ajouter", css:"webix_primary", height:50
            },
            {
              view:"button", value:"Supprimer", css:"webix_danger", height:50
            },
            {
              view:"button", value:"Modifier", css:"webix_transparent", height:50
            }
          ]
        }
      ]
    }
  });
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
    .post("https://aquatrackapi.ir.lan/log",JSON.stringify({"email": "Alex@ir.lan","motdepasse": "Alex1234"}),afficherAquariums);
    //.post("https://aquatrackapi.ir.lan/log",JSON.stringify({"email": "anna@ir.lan","motdepasse": "Anna1234"}),afficherAquariums);
    //.post("https://aquatrackapi.ir.lan/log",JSON.stringify({"email": "paul@ir.lan","motdepasse": "Paul1234"}),afficherAquariums);
});