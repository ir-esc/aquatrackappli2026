// photos.js - Vue galerie photos

function getVuePhotos() {
    return {
        id: "vue_photos",
        rows: [
            {
                view: "toolbar",
                elements: [
                    { view: "label", label: "📷 Galerie photos" },
                    { view: "spacer" },
                    {
                        view: "select",
                        id: "select_aquarium_photo",
                        label: "Aquarium :",
                        labelWidth: 90,
                        width: 280,
                        options: [],
                        on: {
                            onChange: function(id) { chargerPhotos(id); }
                        }
                    }
                ]
            },
            {
                view: "dataview",
                id: "galerie_photos",
                itemWidth: 200,
                itemHeight: 180,
                template: function(obj) {
                    if (obj.url_image) {
                        return "<div style='text-align:center; padding:5px;'>" +
                               "<img src='" + obj.url_image + "' width='180' height='130' style='object-fit:cover;' onerror=\"this.src='https://via.placeholder.com/180x130?text=Photo'\">" +
                               "<br><small>" + (obj.date || "") + "</small>" +
                               "</div>";
                    } else {
                        return "<div style='text-align:center; padding:5px; background:#f0f8ff; margin:5px;'>" +
                               "<div style='height:130px; display:flex; align-items:center; justify-content:center; font-size:40px;'>🐠</div>" +
                               "<small>" + (obj.date || "Pas de date") + "</small>" +
                               "</div>";
                    }
                },
                data: []
            }
        ]
    };
}

function chargerPhotos(idAquarium) {
    if (!idAquarium) return;
    apiGetPhotos(idAquarium, function(err, data) {
        if (err || !data) {
            // Photos de démo
            data = [
                { id: 1, date: "2026-03-10 10:00", url_image: "" },
                { id: 2, date: "2026-03-12 10:00", url_image: "" },
                { id: 3, date: "2026-03-14 10:00", url_image: "" },
                { id: 4, date: "2026-03-16 10:00", url_image: "" }
            ];
        }
        $$("galerie_photos").clearAll();
        $$("galerie_photos").parse(data);
    });
}

function remplirSelectAquariumsPhoto(aquariums) {
    var options = aquariums.map(function(a) {
        return { id: a.id, value: a.nom };
    });
    $$("select_aquarium_photo").define("options", options);
    $$("select_aquarium_photo").refresh();
    if (options.length > 0) {
        $$("select_aquarium_photo").setValue(options[0].id);
        chargerPhotos(options[0].id);
    }
}
