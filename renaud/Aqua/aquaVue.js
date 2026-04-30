webix.ready(function(){
  function afficherAquariums() {
    webix.ui({
    view: "scrollview",
    scroll: "y",
    body: {
      rows:[{
          // affiche les aquariums et leurs données de l'API dans une datatable
          view:"datatable",
          columns:[
            { id:"media_id", header:"Image", width:55, template:"<img src='//aquatrackapi.ir.lan/aqr/#media_id#' width='55' height='55'>"},
            { id:"nom", header:"Nom", fillspace:true },
            // mettre oui ou non par rapport à l'id de l'utilisateur connecté (pas fait pour le moment)
            { id:"user_id", header:"Propriétaire", width:90 },
            { id:"acces", header:"Accès", width:90 },
            { id:"volume", header:"Volume", width:90 },
            { id:"date", header:"Date de creation", width:155 }
          ],
          // récupère les données de l'API avec l'URL spécifiée
          url:function(params){
            return webix.ajax("https://aquatrackapi.ir.lan/aqr");
          },
          scrollX: false
        }]
    }
  });
}  
  // autorise les requêtes AJAX à inclure les cookies pour l'authentification
  webix.attachEvent("onBeforeAjax", function(mode, url, data, request) {
    request.withCredentials = true;
  });
  // envoie une requête POST à l'API pour se connecter avec les informations d'identification
  webix.ajax()
    .headers({"Content-Type":"application/json"})
    .post("https://aquatrackapi.ir.lan/log",JSON.stringify({"email": "Alex@ir.lan","motdepasse": "Alex1234"}),afficherAquariums);
});