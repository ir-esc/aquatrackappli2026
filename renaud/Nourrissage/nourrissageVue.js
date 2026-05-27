webix.ready(function () {
    // Récupère l'ID de l'aquarium depuis l'URL
    var urlParams = new URLSearchParams(window.location.search);
    var aquariumId = urlParams.get('id');

    webix.ui({
        rows: [
            // Barre de navigation avec un bouton de retour et un menu
            {
                view: "toolbar",
                elements: [
                    {
                        view: "button", type: "icon", icon: "mdi mdi-arrow-left", css: "webix_danger", inputWidth: 50, click: function () {
                            window.location.href = "../Aqua/aqua.html";
                        }
                    },
                    { template: "Nourrissage", type: "header", borderless: true },
                    {
                        view: "icon", icon: "mdi mdi-menu",
                        popup: {
                            view: "contextmenu",
                            data: [
                                { value: "Mesures" },
                                { value: "Photos" },
                                { value: "Journal de bord" },
                                { value: "Modules" },
                                //{ value: "Nourrissage" }
                            ],
                            on: {
                                onItemClick: function (id) {
                                    var item = this.getItem(id);
                                    if (item.value == "Mesures") {
                                        window.location.href = "../Mesures/mesures.html?id=" + aquariumId;
                                    }
                                    else if (item.value == "Photos") {
                                        window.location.href = "../Photos/photos.html?id=" + aquariumId;
                                    }
                                    else if (item.value == "Journal de bord") {
                                        window.location.href = "../Journal/journal.html?id=" + aquariumId;
                                    }
                                    else if (item.value == "Modules") {
                                        window.location.href = "../Modules/modules.html?id=" + aquariumId;
                                    }
                                }
                            }
                        }
                    }
                ]
            },
            // Sélection des jours de la semaine pour le nourrissage
            {
                view: "datatable",
                id: "nourrissageTable",
                height: 295,
                columns: [
                    { id: "jour", header: "Jours de la semaine", fillspace: true },
                ],
                data: [
                    { id: 1, jour: "Lundi" },
                    { id: 2, jour: "Mardi" },
                    { id: 3, jour: "Mercredi" },
                    { id: 4, jour: "Jeudi" },
                    { id: 5, jour: "Vendredi" },
                    { id: 6, jour: "Samedi" },
                    { id: 7, jour: "Dimanche" }
                ],
                select: "row",
                multiselect: "touch",
                scrollX: false
            },
            // Sélection de l'heure ou de l'intervalle de nourrissage
            {
                view: "timeboard",
                id: "tBoard",
                height: 150,
                value: "12:30",
                borderless: true,
                twelve: false
            },
            // Bouton pour ajouter ou enlever une deuxieme heure de nourrissage
            {
                view: "button",
                id: "toggleTBoard2",
                value: "Ajouter une heure de nourrissage",
                css: "webix_secondary",
                align: "center",
                width: 300,
                disabled: true,
                click: function () {
                    let tb2 = $$("tBoard2");
                    if (tb2.isVisible()) {
                        tb2.hide();
                        this.setValue("Ajouter une heure de nourrissage");
                    } else {
                        tb2.show();
                        this.setValue("Enlever une heure de nourrissage");
                    }
                }
            },
            // Deuxième selection de l'heure de nourrissage
            {
                view: "timeboard",
                id: "tBoard2",
                height: 150,
                value: "00:00",
                borderless: true,
                twelve: false,
                hidden: true
            },
            // Bouton pour valider les choix de jours et d'heures de nourrissage
            {
                view: "button", value: "Valider les choix", css: "webix_primary", align: "center", height: 55, click: function () {
                    // Récupère les jours sélectionnés
                    var selected = $$("nourrissageTable").getSelectedId(true).join()
                    // Récupère la première heure sélectionnée
                    var tBoard1Value = $$("tBoard").getValue()
                    var heures1 = tBoard1Value.getHours()
                    var minutes1 = tBoard1Value.getMinutes()
                    // Récupère la deuxième heure sélectionnée
                    var tBoard2Value = $$("tBoard2").getValue()
                    var heures2 = tBoard2Value.getHours()
                    var minutes2 = tBoard2Value.getMinutes()

                    // Affiche les choix de jours et d'heures de nourrissage dans un message
                    if (selected) {
                        let tb2 = $$("tBoard2");
                        if (tb2.isVisible()) {
                            webix.message("Id jour(s) sélectionné(s) : " + selected + "<br> Première heure : " + heures1 + "h" + minutes1
                                + "<br> Deuxième heure : " + heures2 + "h" + minutes2
                            );
                        }
                        else {
                            webix.message("Id jour(s) sélectionné(s) : " + selected + "<br> Heure de nourrissage : " + heures1 + "h" + minutes1);
                        }
                    }
                    else {
                        webix.message("Intervalle de nourrissage : " + heures1 + "h" + minutes1);
                    }
                }
            },
            {
                template: "Pour créer un intervalle de nourrissage : ne pas sélectionner de jours.", borderless: true
            }
        ]
    });

    // Modifie le titre du slider du timeboard de Hours en Heures
    let tSliders = $$("tBoard").queryView({ view: "slider" }, "all");
    tSliders[0].define("title", "Heures");
    tSliders[0].refresh();
    let tSliders2 = $$("tBoard2").queryView({ view: "slider" }, "all");
    tSliders2[0].define("title", "Heures");
    tSliders2[0].refresh();
});