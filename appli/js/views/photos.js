function getVuePhotos() {
    return {
        id: "vue_photos",
        rows: [
            {
                view: "toolbar",
                elements: [
                    { view: "label", label: "Photos - Aquarium #116" },
                    { view: "button", value: "Rafraichir", width: 110, click: chargerPhotos }
                ]
            },
            {
                view: "scrollview",
                scroll: "y",
                body: {
                    view: "template",
                    id: "zonePhotos",
                    autoheight: true,
                    template: "<p style='padding:15px;'>Chargement...</p>"
                }
            }
        ],
        on: {
            onViewShow: function () {
                chargerPhotos();
            }
        }
    };
}

function chargerPhotos() {

    $$("zonePhotos").define("template", "<p style='padding:15px;'>Chargement des photos...</p>");
    $$("zonePhotos").refresh();

    // GET /aqr/116/obs → retourne les observations avec media_id + date
    fetch("https://aquatrackapi.ir.lan/aqr/116/obs", {
        method: "GET",
        credentials: "include"
    })
        .then(function (r) {
            if (!r.ok) throw new Error("HTTP " + r.status);
            return r.json();
        })
        .then(function (observations) {

            // Garder uniquement les observations qui ont un media_id valide
            var photos = observations.filter(function (obs) {
                return obs.media_id && obs.media_id !== "0" && obs.media_id !== 0;
            });

            if (photos.length === 0) {
                $$("zonePhotos").define("template", "<p style='padding:15px;'>Aucune photo disponible.</p>");
                $$("zonePhotos").refresh();
                return;
            }

            // Trier du plus recent au plus ancien (par date)
            photos.sort(function (a, b) {
                return new Date(b.date) - new Date(a.date);
            });

            var html = "<div style='display:flex;flex-wrap:wrap;gap:12px;padding:15px;'>";

            for (var i = 0; i < photos.length; i++) {
                var obs = photos[i];
                var imgUrl = "https://aquatrackapi.ir.lan/med/" + obs.media_id + "/fch";

                // Formater la date : "2026-05-11 10:30:18" → "11/05/2026 10:30:18"
                var dateAffichee = obs.date;
                if (obs.date) {
                    var d = new Date(obs.date.replace(" ", "T"));
                    if (!isNaN(d)) {
                        dateAffichee = d.toLocaleDateString("fr-FR") + " " + d.toLocaleTimeString("fr-FR");
                    }
                }

                html += "<div style='background:white;border-radius:8px;padding:8px;box-shadow:0 2px 5px rgba(0,0,0,0.15);width:216px;'>";
                html += "<img src='" + imgUrl + "' width='200' height='150' style='object-fit:cover;border-radius:5px;display:block;'>";
                html += "<p style='text-align:center;font-size:12px;color:#333;margin-top:6px;font-weight:bold;'> " + dateAffichee + "</p>";
                html += "</div>";
            }

            html += "</div>";
            $$("zonePhotos").define("template", html);
            $$("zonePhotos").refresh();
        })
        .catch(function (err) {
            $$("zonePhotos").define("template", "<p style='color:red;padding:15px;'>Erreur : " + err.message + "</p>");
            $$("zonePhotos").refresh();
        });
}