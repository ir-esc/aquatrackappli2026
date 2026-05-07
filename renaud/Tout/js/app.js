import { JetApp, HashRouter } from "https://cdn.webix.com/site/webixjet/webixjet.js";

import AquaView from "./vues/aqua.js";
import MesuresView from "./vues/mesures.js";

class App extends JetApp {
    constructor() {
        super({
            id: "aquatrack",
            start: "/aqua",
            router: HashRouter
        });
    }
}

const app = new App();

app.use({
    "/aqua": AquaView,
    "/mesures": MesuresView
});

webix.ready(() => {
    app.render(document.body);
});