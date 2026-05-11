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
                    {},
                    {
                        view: "icon", icon: "mdi mdi-menu",
                        popup: {
                            view: "contextmenu",
                            data: [
                                { value: "Mesures" },
                                { value: "Photos" },
                                { value: "Journal de bord" },
                                { value: "Modules" },
                            ]
                        }
                    }
                ]
            }
        ]
    });
});