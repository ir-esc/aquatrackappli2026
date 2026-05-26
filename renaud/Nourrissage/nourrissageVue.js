webix.ready(function () {
    webix.ui({
        rows: [
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
                                    if (item && item.value === "Mesures") {
                                        window.location.href = "../Mesures/mesures.html?id=" + aquariumId;
                                    }
                                    else if (item && item.value === "Photos") {
                                        window.location.href = "../Photos/photos.html?id=" + aquariumId;
                                    }
                                    else if (item && item.value === "Journal de bord") {
                                        window.location.href = "../Journal/journal.html?id=" + aquariumId;
                                    }
                                    else if (item && item.value === "Modules") {
                                        window.location.href = "../Modules/modules.html?id=" + aquariumId;
                                    }
                                }
                            }
                        }
                    }
                ]
            },
            {
                view: "datatable",
                id: "nourrissageTable",
                height: 295,
                columns: [
                    { id: "jour", header: "Jours de la semaine", align: "center", fillspace: true },
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
            {
                view: "timeboard",
                value: "6:45",
                twelve: false
            }
        ]
    });

    // Récupère l'ID de l'aquarium depuis l'URL
    var urlParams = new URLSearchParams(window.location.search);
    var aquariumId = urlParams.get('id');
});