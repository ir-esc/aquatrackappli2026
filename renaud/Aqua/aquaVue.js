webix.ready(function(){
  /* 
  envoie une requête POST à l'API pour se connecter avec les informations d'identification
  mais ne sert à rien pour le moment car tous les aquariums sont deja affichés dans l'API sans besoin de se connecter
  il faudrait ajouter une vérification de connexion pour afficher les données seulement si l'utilisateur est connecté
    webix.ajax()
      .headers({"Content-Type":"application/json"})
      .post("//aquatrackapi.ir.lan/log",JSON.stringify({"email": "Alex@ir.lan","motdepasse": "Alex1234"}));
  */
  webix.ui({
    view: "scrollview",
    scroll: "y",
    body: {
      rows:[
        {
          // affiche les données de l'API dans une datatable
          view:"datatable",
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
          scrollX: false
        }
      ]
    }
  });
});