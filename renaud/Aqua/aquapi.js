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
          view:"datatable",
          columns:[
            { id:"id", header:"ID", fillspace:true },
            { id:"nom", header:"Nom", fillspace:true },
            { id:"volume", header:"Volume", fillspace:true },
            { id:"date", header:"Date de creation", fillspace:true }
          ],
          // loading url
          url:function(params){
            return webix.ajax("//aquatrackapi.ir.lan/aqr");
          },
          scrollX: false
        }
      ]
    }
  });
});