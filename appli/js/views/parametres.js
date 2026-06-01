// parametres.js - Vue des paramètres physico-chimiques

function getVueParametres() {
    return {
        id: "vue_parametres",
        rows: [
            {
                // barre d'outils en haut de la page avec un bouton de retour et un menu
                view: "toolbar",
                elements: [
                    { view: "label", label: "Paramètres physico-chimiques" },
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
                    }]
            }]
    }
}