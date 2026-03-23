webix.ready(function(){
  webix.ui({
    view: "scrollview",
    scroll: "y",
    body: {
      rows:[
        { template:"Loading with URL", type:"header" },
        {
          view:"datatable",
          columns:[
            { id:"package", header:"Name", fillspace:true },
            { id:"section", header:"Section", width:120 },
            { id:"size", header:"Size" , width:80  },
            { id:"architecture", header:"PC", width:60  }
          ],
          // loading url
          url:function(params){
            return webix.ajax("//docs.webix.com/samples/server/packages");
          },
          scrollX: false
        },
        { template:"Loading with proxy", type:"header" },
        {
          view:"datatable",
          columns:[
            { id:"package", header:"Name", fillspace:true },
            { id:"section", header:"Section", width:120 },
            { id:"size", header:"Size", width:80  },
            { id:"architecture", header:"PC", width:60  }
          ],
          // loading proxy
          url:{
            $proxy:true,
            load:function(view, params){
              return webix.ajax("//docs.webix.com/samples/server/packages");
            }
          },
          scrollX: false
        }
      ]
    }
  });
});
