webix.ready(function(){
  webix.ajax()
    .headers({"Content-Type":"application/json"})
    .post("//aquatrackapi.ir.lan/log",JSON.stringify({"email": "Alex@ir.lan","motdepasse": "Alex1234"}));
  webix.ui({
    view: "scrollview",
    scroll: "y",
    body: {
      rows:[
        {
          // affiche les données de l'API dans une datatable
          view:"datatable",
          columns:[
            { id:"id", header:"ID", fillspace:true },
            { id:"nom", header:"Nom", fillspace:true },
            { id:"volume", header:"Volume", fillspace:true },
            { id:"date", header:"Date de creation", fillspace:true }
          ],
          // récupère les données de l'API avec l'URL spécifiée
          url:function(params){
            return webix.ajax("//aquatrackapi.ir.lan/aqr");
          },
          scrollX: false
        }
      ]
    }
  });
});