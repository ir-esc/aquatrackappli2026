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
                    { template: "Nourrissage", borderless: true },
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
                                        window.location.href = "../Mesures/mesures.html";
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        ]
    });
});