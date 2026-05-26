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
                weekHeader: true,
                view: "calendar",
                events: webix.Date.isHoliday,
                timepicker: true,
                icons: true
            }
        ]
    });
    // Récupère l'ID de l'aquarium depuis l'URL
    var urlParams = new URLSearchParams(window.location.search);
    var aquariumId = urlParams.get('id');
});