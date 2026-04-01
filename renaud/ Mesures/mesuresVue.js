webix.ui({
  view: "scrollview",
  scroll: "y",
  body: {
    // mets les mesures dans un accordéon
    view:"accordion",
    rows:[ 
      {
        view:"accordionitem",
        header:"Température",
        headerHeight:50, 
        body:{
          // affiche les données de l'API dans un graphique 
          view:"chart",
          id:"Température_chart",
          height:300,
          type:"line",
          value:"#valeur#",
          color:"#36abee",
          alpha:0.8,
          xAxis:{
            template:"#date#"
          },
          yAxis:{
            start:0,
            end:35,
            step:5,
            template:function(obj){
              return obj%5 ? "" : obj;
            }
          },
          tooltip:{
            template: "#valeur#"
          }
        }
      },
      {
        view:"accordionitem",
        header:"Acidité",
        headerHeight:50, 
        body:{
          // affiche les données de l'API dans un graphique
          view:"chart",
          id:"Acidité_chart",
          height:300,
          type:"line",
          value:"#valeur#",
          color:"#36abee",
          alpha:0.8,
          xAxis:{
            template:"#date#"
          },
          yAxis:{
            start:0,
            end:14,
            step:1,
            template:function(obj){
              return obj%7 ? "" : obj;
            }
          },
          tooltip:{
            template: "#valeur#"
          }
        }
      }
    ]  
  }
});

// récupère les données de l'API avec l'URL spécifiée seulement pour l'aquarium TEST-A (116)
webix.ajax("http://aquatrackapi.ir.lan/aqr/116/ppc").then(function(data){
   const items = data.json();
   // filtre les données pour par rapport au type de mesure
   const temperatureItems = items.filter(function(item){ return item.type_id == 1; });
   const aciditeItems = items.filter(function(item){ return item.type_id == 2; });

   $$('Température_chart').parse(temperatureItems);
   $$('Acidité_chart').parse(aciditeItems);
});