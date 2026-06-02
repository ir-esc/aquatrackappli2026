// nourrissage.js - Vue gestion du nourrissage

function getVueNourrissage() {
    return {
        id: "vue_nourrissage",
        width: 1720,
        rows: [
            {
                view: "toolbar",
                elements: [
                    { view: "label", label: "Sélection horaire du nourrissage" },
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
                scrollX: false,
                on: {
                    // active/désactive le bouton pour mettre la deuxième heure quand on selectionne/déselectionne un jour
                    onSelectChange: function () {
                        const Selection = this.getSelectedId(true).length > 0;
                        if (Selection) {
                            $$("toggleTBoard2").enable();
                        }
                        else {
                            $$("toggleTBoard2").disable();
                            $$("toggleTBoard2").setValue("Ajouter une heure de nourrissage");
                            $$("tBoard2").hide();
                        }

                    }
                }
            },
            {
                view: "label", label: "Pour créer un intervalle de nourrissage : ne pas sélectionner de jours. Les minutes ne sont pas prisent en compte"
            },
            // Sélection de l'heure ou de l'intervalle de nourrissage
            {
                view: "timeboard",
                id: "tBoard",
                height: 150,
                value: "00:00",
                borderless: true,
                twelve: false
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
                    }
                    else {
                        tb2.show();
                        this.setValue("Enlever une heure de nourrissage");
                    }
                }
            },
            // Bouton pour valider les choix de jours et d'heures de nourrissage
            {
                view: "button", value: "Valider les choix", css: "webix_primary", align: "center", height: 55, click: function () {

                    // Récupère les jours sélectionnés
                    var selected = $$("nourrissageTable").getSelectedId(true).join()

                    // Récupère la première heure sélectionnée et la met dans le bon format
                    var tBoard1Value = $$("tBoard").getValue()
                    var h1 = tBoard1Value.getHours()
                    if (h1 < 10) { h1 = "0" + h1 }

                    // Récupère la deuxième heure sélectionnée et la met dans le bon format
                    var tBoard2Value = $$("tBoard2").getValue()
                    var h2 = tBoard2Value.getHours()
                    if (h2 < 10) { h2 = "0" + h2 }

                    // Affiche les choix de jours et d'heures de nourrissage dans un message
                    if (selected) {
                        let tb2 = $$("tBoard2");
                        // Envoie les jours et les deux horaires
                        if (tb2.isVisible()) {
                            webix.message("Id jour(s) sélectionné(s) : " + selected + "<br> Première heure : " + h1 + "h00 <br> Deuxième heure : " + h2 + "h00"
                            );
                            webix.ajax()
                                .headers({ "Content-Type": "application/json" })
                                .put("https://aquatrackapi.ir.lan/mod/9", JSON.stringify({
                                    "id": "9",
                                    "aquarium_id": "116",
                                    "type": "nourrissage",
                                    "statut": "actif",
                                    "date_installation": "2026-05-26 00:00:00",
                                    "module_uid": "erwan_nourrissage",
                                    "config": "{\"horaires\":[{\"jours\":" + selected + "},{\"heure\":" + h1 + "},{\"heure\":" + h2 + "}]}",
                                    "token_id": null
                                }
                                ));
                        }
                        else {
                            // Envoie les jours et le premier horaire
                            webix.message(
                                "Id jour(s) sélectionné(s) : " + selected + "<br> Heure de nourrissage : " + h1 + "h00"
                            );
                            webix.ajax()
                                .headers({ "Content-Type": "application/json" })
                                .put("https://aquatrackapi.ir.lan/mod/9", JSON.stringify({
                                    "id": "9",
                                    "aquarium_id": "116",
                                    "type": "nourrissage",
                                    "statut": "actif",
                                    "date_installation": "2026-05-26 00:00:00",
                                    "module_uid": "erwan_nourrissage",
                                    "config": "{\"horaires\":[{\"heure\":" + h1 + "}]}",
                                    "token_id": null
                                }
                                ));
                        }
                    }
                    else {
                        // Envoie l'intervalle quand aucun jour est sellectionnés
                        webix.message(
                            "Intervalle de nourrissage : " + h1 + "h00"
                        );
                        webix.ajax()
                            .headers({ "Content-Type": "application/json" })
                            .put("https://aquatrackapi.ir.lan/mod/9", JSON.stringify({
                                "id": "9",
                                "aquarium_id": "116",
                                "type": "nourrissage",
                                "statut": "actif",
                                "date_installation": "2026-05-26 00:00:00",
                                "module_uid": "erwan_nourrissage",
                                "config": "{\"intervalle\":" + h1 + "}",
                                "token_id": null
                            }))
                    }
                }
            }]
    }
};