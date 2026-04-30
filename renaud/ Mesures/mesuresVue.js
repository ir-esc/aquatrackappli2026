webix.ready(function(){
  // arrondi les valeurs au millième près et les convertit en chaîne de caractères pour enlever les zéros à la fin dans les infobulles
  function formatValeur(value) {
    return parseFloat(parseFloat(value).toFixed(3)).toString();
  }

  webix.ui({
    // mets les mesures dans un accordéon
    view:"accordion",
    rows:[ 
      {
        view:"accordionitem",
        header:"Température",
        headerHeight:50,
        collapsed: true,
        body:{
          // affiche les données de l'API dans un graphique 
          view:"chart",
          id:"Température_chart",
          height:400,
          type:"line",
          value:"#valeur#",
          xAxis:{
            template:"#date#",
            title:"Date"
          },
          yAxis:{
            title:"°C",
            start:5,
            end:40,
            step:5,
          },
          // affiche la valeur dans une infobulle au survol du point avec la souris
          tooltip:{
            template: function(obj){ return formatValeur(obj.valeur); }
          }
        }
      },
      {
        view:"accordionitem",
        header:"Acidité",
        headerHeight:50,
        collapsed: true,
        body:{
          // affiche les données de l'API dans un graphique
          view:"chart",
          id:"Acidité_chart",
          height:400,
          type:"line",
          value:"#valeur#",
          xAxis:{
            template:"#date#",
            title:"Date"
          },
          yAxis:{
            title:"pH",
            start:0,
            end:14,
            step:1,
            template:function(obj){
              return obj%7 ? "" : obj;
            }
          },
          // affiche la valeur dans une infobulle au survol du point avec la souris
          tooltip:{
            template: function(obj){ return formatValeur(obj.valeur); }
          }
        }
      },
      {
        view:"accordionitem",
        header:"Dureté carbonatée",
        headerHeight:50,
        collapsed: true,
        body:{
          // affiche les données de l'API dans un graphique 
          view:"chart",
          id:"Dureté carbonatée_chart",
          height:400,
          type:"line",
          value:"#valeur#",
          xAxis:{
            template:"#date#",
            title:"Date"
          },
          yAxis:{
            title:"KH",
            start:0,
            end:12,
            step:2,
            template:function(obj){
              return obj%6 ? "" : obj;
            }
          },
          // affiche la valeur dans une infobulle au survol du point avec la souris
          tooltip:{
            template: function(obj){ return formatValeur(obj.valeur); }
          }
        }
      },
      {
        view:"accordionitem",
        header:"Dureté totale",
        headerHeight:50,
        collapsed: true,
        body:{
          // affiche les données de l'API dans un graphique 
          view:"chart",
          id:"Dureté totale_chart",
          height:400,
          type:"line",
          value:"#valeur#",
          xAxis:{
            template:"#date#",
            title:"Date"
          },
          yAxis:{
            title:"GH",
            start:0,
            end:18,
            step:3,
            template:function(obj){
              return obj%6 ? "" : obj;
            }
          },
          // affiche la valeur dans une infobulle au survol du point avec la souris
          tooltip:{
            template: function(obj){ return formatValeur(obj.valeur); }
          }
        }
      },
      {
        view:"accordionitem",
        header:"Concentration en nitrites",
        headerHeight:50,
        collapsed: true,
        body:{
          // affiche les données de l'API dans un graphique 
          view:"chart",
          id:"Concentration en nitrites_chart",
          height:400,
          type:"line",
          value:"#valeur#",
          xAxis:{
            template:"#date#",
            title:"Date"
          },
          yAxis:{
            title:"mg/L",
            start:0,
            end:1,
            step:0.1,
          },
          // affiche la valeur dans une infobulle au survol du point avec la souris
          tooltip:{
            template: function(obj){ return formatValeur(obj.valeur); }
          }
        }
      },
      {
        view:"accordionitem",
        header:"Concentration en nitrates",
        headerHeight:50,
        collapsed: true,
        body:{
          // affiche les données de l'API dans un graphique 
          view:"chart",
          id:"Concentration en nitrates_chart",
          height:400,
          type:"line",
          value:"#valeur#",
          xAxis:{
            template:"#date#",
            title:"Date"
          },
          yAxis:{
            title:"mg/L",
            start:0,
            end:50,
            step:5,
            template:function(obj){
              return obj%10 ? "" : obj;
            }
          },
          // affiche la valeur dans une infobulle au survol du point avec la souris
          tooltip:{
            template: function(obj){ return formatValeur(obj.valeur); }
          }
        }
      },
      {
        view:"accordionitem",
        header:"Concentration en ammoniac",
        headerHeight:50,
        collapsed: true,
        body:{
          // affiche les données de l'API dans un graphique 
          view:"chart",
          id:"Concentration en ammoniac_chart",
          height:400,
          type:"line",
          value:"#valeur#",
          xAxis:{
            template:"#date#",
            title:"Date"
          },
          yAxis:{
            title:"mg/L",
            start:0,
            end:0.5,
            step:0.05,
          },
          // affiche la valeur dans une infobulle au survol du point avec la souris
          tooltip:{
            template: function(obj){ return formatValeur(obj.valeur); }
          }
        }
      },
      {
        view:"accordionitem",
        header:"Conductivité",
        headerHeight:50,
        collapsed: true,
        body:{
          // affiche les données de l'API dans un graphique 
          view:"chart",
          id:"Conductivité_chart",
          height:400,
          type:"line",
          value:"#valeur#",
          xAxis:{
            template:"#date#",
            title:"Date"
          },
          yAxis:{
            title:"uS/cm",
            start:0,
            end:2000,
            step:100,
            template:function(obj){
              return obj%200 ? "" : obj;
            }
          },
          // affiche la valeur dans une infobulle au survol du point avec la souris
          tooltip:{
            template: "#valeur#"
          }
        }
      }
    ]
  });

  // récupère les données de l'API avec l'URL spécifiée seulement pour l'aquarium TEST-A (116)
  webix.ajax("https://aquatrackapi.ir.lan/aqr/116/ppc").then(function(data){
    const items = data.json();
    // filtre les données par rapport au type de mesure
    const temperatureItems = items.filter(function(item){ return item.type_id == 1; });
    const aciditeItems = items.filter(function(item){ return item.type_id == 2; });
    const dureteCarbonateeItems = items.filter(function(item){ return item.type_id == 3; });
    const dureteTotaleItems = items.filter(function(item){ return item.type_id == 4; });
    const nitritesItems = items.filter(function(item){ return item.type_id == 5; });
    const nitratesItems = items.filter(function(item){ return item.type_id == 6; });
    const ammoniacItems = items.filter(function(item){ return item.type_id == 7; });
    const conductiviteItems = items.filter(function(item){ return item.type_id == 8; });

    // met les données dans les graphiques correspondants (parse) et les trie par date dans l'ordre croissant (sort)
    $$('Température_chart').parse(temperatureItems);
    $$('Température_chart').sort('#Date#','asc');
    $$('Acidité_chart').parse(aciditeItems);
    $$('Acidité_chart').sort('#Date#','asc');
    $$('Dureté carbonatée_chart').parse(dureteCarbonateeItems);
    $$('Dureté carbonatée_chart').sort('#Date#','asc');
    $$('Dureté totale_chart').parse(dureteTotaleItems);
    $$('Dureté totale_chart').sort('#Date#','asc');
    $$('Concentration en nitrites_chart').parse(nitritesItems);
    $$('Concentration en nitrites_chart').sort('#Date#','asc');
    $$('Concentration en nitrates_chart').parse(nitratesItems);
    $$('Concentration en nitrates_chart').sort('#Date#','asc');
    $$('Concentration en ammoniac_chart').parse(ammoniacItems);
    $$('Concentration en ammoniac_chart').sort('#Date#','asc');
    $$('Conductivité_chart').parse(conductiviteItems);
    $$('Conductivité_chart').sort('#Date#','asc');
  });
});