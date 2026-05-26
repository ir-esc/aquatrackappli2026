webix.ready(function () {
  // arrondi les valeurs au millième près et les convertit en chaîne de caractères pour enlever les zéros à la fin dans les infobulles
  function formatValeur(value) {
    return parseFloat(parseFloat(value).toFixed(3)).toString();
  }

  webix.ui({
    rows: [
      {
        // barre d'outils en haut de la page avec un bouton de retour et un menu
        view: "toolbar",
        elements: [
          {
            view: "button", type: "icon", icon: "mdi mdi-arrow-left", css: "webix_danger", inputWidth: 50, click: function () {
              window.location.href = "../Aqua/aqua.html";
            }
          },
          { template: "Mesures", type: "header", borderless: true },
          {
            view: "icon", icon: "mdi mdi-menu",
            popup: {
              view: "contextmenu",
              data: [
                //{ value: "Mesures" },
                { value: "Photos" },
                { value: "Journal de bord" },
                { value: "Modules" },
                { value: "Nourrissage" }
              ],
              on: {
                onItemClick: function (id) {
                  var item = this.getItem(id);
                  if (item && item.value === "Photos") {
                    window.location.href = "../Photos/photos.html?id=" + aquariumId;
                  }
                  else if (item && item.value === "Journal de bord") {
                    window.location.href = "../Journal/journal.html?id=" + aquariumId;
                  }
                  else if (item && item.value === "Modules") {
                    window.location.href = "../Modules/modules.html?id=" + aquariumId;
                  }
                  else if (item && item.value === "Nourrissage") {
                    window.location.href = "../Nourrissage/nourrissage.html?id=" + aquariumId;
                  }
                }
              }
            }
          }
        ]
      },
      {
        view: "accordion",
        rows: [
          {
            view: "accordionitem",
            header: "Température",
            headerHeight: 50,
            collapsed: true,
            body: {
              // affiche les données de l'API dans un graphique 
              view: "chart",
              id: "Température_chart",
              height: 400,
              type: "line",
              value: "#valeur#",
              xAxis: {
                template: "#date#",
                title: "Date"
              },
              yAxis: {
                title: "°C",
                start: 5,
                end: 40,
                step: 5,
              },
              // affiche la valeur arrondie dans une infobulle au survol du point avec la souris
              tooltip: {
                template: function (obj) { return formatValeur(obj.valeur); }
              }
            }
          },
          {
            view: "accordionitem",
            header: "Acidité",
            headerHeight: 50,
            collapsed: true,
            body: {
              // affiche les données de l'API dans un graphique
              view: "chart",
              id: "Acidité_chart",
              height: 400,
              type: "line",
              value: "#valeur#",
              xAxis: {
                template: "#date#",
                title: "Date"
              },
              yAxis: {
                title: "pH",
                start: 0,
                end: 14,
                step: 1,
                template: function (obj) {
                  return obj % 7 ? "" : obj;
                }
              },
              // affiche la valeur arrondie dans une infobulle au survol du point avec la souris
              tooltip: {
                template: function (obj) { return formatValeur(obj.valeur); }
              }
            }
          },
          {
            view: "accordionitem",
            header: "Dureté carbonatée",
            headerHeight: 50,
            collapsed: true,
            body: {
              // affiche les données de l'API dans un graphique 
              view: "chart",
              id: "Dureté carbonatée_chart",
              height: 400,
              type: "line",
              value: "#valeur#",
              xAxis: {
                template: "#date#",
                title: "Date"
              },
              yAxis: {
                title: "KH",
                start: 0,
                end: 12,
                step: 2,
                template: function (obj) {
                  return obj % 6 ? "" : obj;
                }
              },
              // affiche la valeur arrondie dans une infobulle au survol du point avec la souris
              tooltip: {
                template: function (obj) { return formatValeur(obj.valeur); }
              }
            }
          },
          {
            view: "accordionitem",
            header: "Dureté totale",
            headerHeight: 50,
            collapsed: true,
            body: {
              // affiche les données de l'API dans un graphique 
              view: "chart",
              id: "Dureté totale_chart",
              height: 400,
              type: "line",
              value: "#valeur#",
              xAxis: {
                template: "#date#",
                title: "Date"
              },
              yAxis: {
                title: "GH",
                start: 0,
                end: 30,
                step: 2.5,
                template: function (obj) {
                  return obj % 5 ? "" : obj;
                }
              },
              // affiche la valeur arrondie dans une infobulle au survol du point avec la souris
              tooltip: {
                template: function (obj) { return formatValeur(obj.valeur); }
              }
            }
          },
          {
            view: "accordionitem",
            header: "Concentration en nitrites",
            headerHeight: 50,
            collapsed: true,
            body: {
              // affiche les données de l'API dans un graphique 
              view: "chart",
              id: "Concentration en nitrites_chart",
              height: 400,
              type: "line",
              value: "#valeur#",
              xAxis: {
                template: "#date#",
                title: "Date"
              },
              yAxis: {
                title: "mg/L",
                start: 0,
                end: 1,
                step: 0.1,
              },
              // affiche la valeur arrondie dans une infobulle au survol du point avec la souris
              tooltip: {
                template: function (obj) { return formatValeur(obj.valeur); }
              }
            }
          },
          {
            view: "accordionitem",
            header: "Concentration en nitrates",
            headerHeight: 50,
            collapsed: true,
            body: {
              // affiche les données de l'API dans un graphique 
              view: "chart",
              id: "Concentration en nitrates_chart",
              height: 400,
              type: "line",
              value: "#valeur#",
              xAxis: {
                template: "#date#",
                title: "Date"
              },
              yAxis: {
                title: "mg/L",
                start: 0,
                end: 50,
                step: 5,
                template: function (obj) {
                  return obj % 10 ? "" : obj;
                }
              },
              // affiche la valeur arrondie dans une infobulle au survol du point avec la souris
              tooltip: {
                template: function (obj) { return formatValeur(obj.valeur); }
              }
            }
          },
          {
            view: "accordionitem",
            header: "Concentration en ammoniac",
            headerHeight: 50,
            collapsed: true,
            body: {
              // affiche les données de l'API dans un graphique 
              view: "chart",
              id: "Concentration en ammoniac_chart",
              height: 400,
              type: "line",
              value: "#valeur#",
              xAxis: {
                template: "#date#",
                title: "Date"
              },
              yAxis: {
                title: "mg/L",
                start: 0,
                end: 0.5,
                step: 0.05,
              },
              // affiche la valeur arrondie dans une infobulle au survol du point avec la souris
              tooltip: {
                template: function (obj) { return formatValeur(obj.valeur); }
              }
            }
          },
          {
            view: "accordionitem",
            header: "Conductivité",
            headerHeight: 50,
            collapsed: true,
            body: {
              // affiche les données de l'API dans un graphique 
              view: "chart",
              id: "Conductivité_chart",
              height: 400,
              type: "line",
              value: "#valeur#",
              xAxis: {
                template: "#date#",
                title: "Date"
              },
              yAxis: {
                title: "uS/cm",
                start: 0,
                end: 2000,
                step: 100,
                template: function (obj) {
                  return obj % 200 ? "" : obj;
                }
              },
              // affiche la valeur arrondie dans une infobulle au survol du point avec la souris
              tooltip: {
                template: function (obj) { return formatValeur(obj.valeur); }
              }
            }
          },
        ]
      },
      {
        view: "toolbar",
        cols: [
          {
            view: "button", value: "Ajouter une mesure", css: "webix_primary", height: 50
          },
          {
            view: "button", value: "Supprimer une mesure", css: "webix_danger", height: 50
          }
        ]
      }
    ]
  });
  
  // Récupère l'ID de l'aquarium depuis l'URL
  var urlParams = new URLSearchParams(window.location.search);
  var aquariumId = urlParams.get('id');

  // récupère les données de l'API avec l'URL spécifiée pour l'aquarium sélectionné
  webix.ajax("https://aquatrackapi.ir.lan/aqr/" + aquariumId + "/ppc").then(function (data) {
    const items = data.json();
    // filtre les mesures avec la date 0
    const filteredItems = items.filter(function (item) { return item.date !== "0000-00-00 00:00:00"; });
    // filtre les données par rapport au type de mesure
    const temperatureItems = filteredItems.filter(function (item) { return item.type_id == 1; });
    const aciditeItems = filteredItems.filter(function (item) { return item.type_id == 2; });
    const dureteCarbonateeItems = filteredItems.filter(function (item) { return item.type_id == 3; });
    const dureteTotaleItems = filteredItems.filter(function (item) { return item.type_id == 4; });
    const nitritesItems = filteredItems.filter(function (item) { return item.type_id == 5; });
    const nitratesItems = filteredItems.filter(function (item) { return item.type_id == 6; });
    const ammoniacItems = filteredItems.filter(function (item) { return item.type_id == 7; });
    const conductiviteItems = filteredItems.filter(function (item) { return item.type_id == 8; });

    // met les données dans les graphiques correspondants (parse) et les trie par date dans l'ordre croissant (sort)
    $$('Température_chart').parse(temperatureItems);
    $$('Température_chart').sort('#date#', 'asc');
    $$('Acidité_chart').parse(aciditeItems);
    $$('Acidité_chart').sort('#date#', 'asc');
    $$('Dureté carbonatée_chart').parse(dureteCarbonateeItems);
    $$('Dureté carbonatée_chart').sort('#date#', 'asc');
    $$('Dureté totale_chart').parse(dureteTotaleItems);
    $$('Dureté totale_chart').sort('#date#', 'asc');
    $$('Concentration en nitrites_chart').parse(nitritesItems);
    $$('Concentration en nitrites_chart').sort('#date#', 'asc');
    $$('Concentration en nitrates_chart').parse(nitratesItems);
    $$('Concentration en nitrates_chart').sort('#date#', 'asc');
    $$('Concentration en ammoniac_chart').parse(ammoniacItems);
    $$('Concentration en ammoniac_chart').sort('#date#', 'asc');
    $$('Conductivité_chart').parse(conductiviteItems);
    $$('Conductivité_chart').sort('#date#', 'asc');
  });
});