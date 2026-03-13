// ===== DONNÉES SIMULÉES (mock data) =====
// En production, ces données viendraient de l'API REST

var utilisateurs = [
    { id: "admin", mdp: "1234", niveau: "admin" },
    { id: "user1", mdp: "pass1", niveau: "user" }
];

var aquariums = [
    { id: 1, nom: "Bac tropical", acces: "prive", volume: 200, proprietaire: "admin" },
    { id: 2, nom: "Bac marin", acces: "public", volume: 100, proprietaire: "user1" }
];

var parametres = [
    { id: 1, aquariumId: 1, type: "pH", valeur: 7.2, date: "2026-03-13T08:00" },
    { id: 2, aquariumId: 1, type: "Température", valeur: 25.5, date: "2026-03-13T08:10" },
    { id: 3, aquariumId: 1, type: "NO2", valeur: 0.05, date: "2026-03-13T08:20" }
];

var observations = [
    { id: 1, aquariumId: 1, texte: "Les poissons semblent actifs, eau claire.", date: "2026-03-12T19:00" },
    { id: 2, aquariumId: 1, texte: "Changement de 30% de l'eau effectué.", date: "2026-03-11T10:00" }
];

var modules = [
    { id: "MOD-001", aquariumId: 1, type: "Capteur pH", status: "appairé" },
    { id: "CAM-001", aquariumId: 1, type: "Module caméra (ESP32-CAM)", status: "appairé" },
    { id: "NOU-001", aquariumId: 1, type: "Module nourrissage", status: "en attente" }
];

var programmes_nourrissage = [
    { id: 1, aquariumId: 1, type: "intervalle", detail: "Toutes les 24 heures" },
    { id: 2, aquariumId: 1, type: "fixe", detail: "Lundi, Mercredi, Vendredi à 07:00 et 17:00" }
];

// Variables globales
var utilisateurConnecte = null;
var aquariumActuel = null;
var compteurAqr = 3;
var compteurParam = 4;
var compteurObs = 3;
var compteurMod = 4;
var compteurNour = 3;

// ===== CONNEXION =====
function seConnecter() {
    var id = document.getElementById("login-id").value.trim();
    var mdp = document.getElementById("login-mdp").value;

    // Vérification côté client (en prod : appel API /log avec JWT)
    var trouve = null;
    for (var i = 0; i < utilisateurs.length; i++) {
        if (utilisateurs[i].id === id && utilisateurs[i].mdp === mdp) {
            trouve = utilisateurs[i];
        }
    }

    if (trouve !== null) {
        utilisateurConnecte = trouve;
        document.getElementById("page-login").style.display = "none";
        document.getElementById("app").style.display = "block";
        document.getElementById("bienvenue").textContent = "Bonjour " + utilisateurConnecte.id + " !";
        afficherPage("aquariums");
    } else {
        document.getElementById("login-erreur").textContent = "Identifiant ou mot de passe incorrect.";
    }
}

// ===== DÉCONNEXION =====
function seDeconnecter() {
    utilisateurConnecte = null;
    aquariumActuel = null;
    document.getElementById("app").style.display = "none";
    document.getElementById("page-login").style.display = "flex";
    document.getElementById("login-id").value = "";
    document.getElementById("login-mdp").value = "";
    document.getElementById("login-erreur").textContent = "";
}

// ===== NAVIGATION =====
function afficherPage(nomPage) {
    var pages = document.querySelectorAll(".page");
    for (var i = 0; i < pages.length; i++) {
        pages[i].style.display = "none";
    }
    document.getElementById("page-" + nomPage).style.display = "block";

    if (nomPage === "aquariums") afficherListeAquariums();
    if (nomPage === "parametres") afficherParametres();
    if (nomPage === "observations") afficherObservations();
    if (nomPage === "modules") afficherModules();
    if (nomPage === "nourrissage") afficherNourrissage();
    if (nomPage === "photos") mettreAJourNomAquarium();
}

function cacherFormulaire(idForm) {
    document.getElementById(idForm).style.display = "none";
}

// ===== AQUARIUMS =====
function afficherFormulaireAquarium() {
    document.getElementById("form-aquarium").style.display = "block";
}

function ajouterAquarium() {
    var nom = document.getElementById("aqr-nom").value.trim();
    var acces = document.getElementById("aqr-acces").value;
    var volume = document.getElementById("aqr-volume").value;

    if (nom === "") {
        alert("Le nom est obligatoire !");
        return;
    }

    aquariums.push({ id: compteurAqr, nom: nom, acces: acces, volume: volume, proprietaire: utilisateurConnecte.id });
    compteurAqr++;

    document.getElementById("aqr-nom").value = "";
    document.getElementById("aqr-volume").value = "";
    cacherFormulaire("form-aquarium");
    afficherListeAquariums();
}

function afficherListeAquariums() {
    var div = document.getElementById("liste-aquariums");
    div.innerHTML = "";

    for (var i = 0; i < aquariums.length; i++) {
        var aqr = aquariums[i];
        if (aqr.proprietaire !== utilisateurConnecte.id && aqr.acces === "prive") continue;

        var badgeClass = (aqr.acces === "prive") ? "badge-prive" : "badge-public";
        var badgeTexte = (aqr.acces === "prive") ? "Privé" : "Public";

        div.innerHTML += '<div class="aquarium-card">' +
            '<div><h3>' + aqr.nom + '</h3>' +
            '<p>Volume : ' + (aqr.volume ? aqr.volume + ' L' : 'Non renseigné') + '</p>' +
            '<p>Propriétaire : ' + aqr.proprietaire + '</p></div>' +
            '<div><span class="badge ' + badgeClass + '">' + badgeTexte + '</span><br><br>' +
            '<button onclick="selectionnerAquarium(' + aqr.id + ')">Sélectionner</button></div>' +
            '</div>';
    }

    if (div.innerHTML === "") div.innerHTML = "<p>Aucun aquarium pour l'instant.</p>";
}

function selectionnerAquarium(id) {
    for (var i = 0; i < aquariums.length; i++) {
        if (aquariums[i].id === id) aquariumActuel = aquariums[i];
    }
    alert("Aquarium \"" + aquariumActuel.nom + "\" sélectionné !");
    afficherPage("parametres");
}

function mettreAJourNomAquarium() {
    var nom = aquariumActuel ? aquariumActuel.nom : "aucun";
    var ids = ["aqr-selectionne", "aqr-selectionne-obs", "aqr-selectionne-mod", "aqr-selectionne-photo", "aqr-selectionne-nour"];
    for (var i = 0; i < ids.length; i++) {
        var el = document.getElementById(ids[i]);
        if (el) el.textContent = nom;
    }
}

// ===== PARAMÈTRES PHYSICO-CHIMIQUES =====
function afficherFormParametre() {
    if (!aquariumActuel) { alert("Veuillez d'abord sélectionner un aquarium."); return; }
    document.getElementById("form-parametre").style.display = "block";
}

function ajouterParametre() {
    var type = document.getElementById("param-type").value;
    var valeur = parseFloat(document.getElementById("param-valeur").value);

    if (isNaN(valeur)) { alert("La valeur est obligatoire !"); return; }

    var now = new Date();
    parametres.push({ id: compteurParam, aquariumId: aquariumActuel.id, type: type, valeur: valeur, date: now.toISOString().slice(0, 16) });
    compteurParam++;

    document.getElementById("param-valeur").value = "";
    cacherFormulaire("form-parametre");
    afficherParametres();
}

function afficherParametres() {
    mettreAJourNomAquarium();
    var tbody = document.getElementById("corps-tableau-parametres");
    tbody.innerHTML = "";
    if (!aquariumActuel) return;

    for (var i = 0; i < parametres.length; i++) {
        var p = parametres[i];
        if (p.aquariumId === aquariumActuel.id) {
            tbody.innerHTML += '<tr><td>' + p.date.replace("T", " ") + '</td><td>' + p.type + '</td><td>' + p.valeur + '</td></tr>';
        }
    }
}

// ===== OBSERVATIONS =====
function afficherFormObservation() {
    if (!aquariumActuel) { alert("Veuillez d'abord sélectionner un aquarium."); return; }
    document.getElementById("form-observation").style.display = "block";
    document.getElementById("obs-texte").addEventListener("input", function() {
        document.getElementById("obs-compteur").textContent = this.value.length + " / 1000 caractères";
    });
}

function ajouterObservation() {
    var texte = document.getElementById("obs-texte").value.trim();
    if (texte === "") { alert("Le texte est obligatoire !"); return; }

    var now = new Date();
    observations.push({ id: compteurObs, aquariumId: aquariumActuel.id, texte: texte, date: now.toISOString().slice(0, 16) });
    compteurObs++;

    document.getElementById("obs-texte").value = "";
    document.getElementById("obs-compteur").textContent = "0 / 1000 caractères";
    cacherFormulaire("form-observation");
    afficherObservations();
}

function afficherObservations() {
    mettreAJourNomAquarium();
    var div = document.getElementById("liste-observations");
    div.innerHTML = "";
    if (!aquariumActuel) return;

    for (var i = 0; i < observations.length; i++) {
        var obs = observations[i];
        if (obs.aquariumId === aquariumActuel.id) {
            div.innerHTML += '<div class="obs-card"><div class="obs-date">📅 ' + obs.date.replace("T", " à ") + '</div><p>' + obs.texte + '</p></div>';
        }
    }
    if (div.innerHTML === "") div.innerHTML = "<p>Aucune observation pour cet aquarium.</p>";
}

// ===== MODULES =====
function afficherFormModule() {
    if (!aquariumActuel) { alert("Veuillez d'abord sélectionner un aquarium."); return; }
    document.getElementById("form-module").style.display = "block";
}

function ajouterModule() {
    var id = document.getElementById("mod-id").value.trim();
    var type = document.getElementById("mod-type").value;
    if (id === "") { alert("L'identifiant est obligatoire !"); return; }

    modules.push({ id: id, aquariumId: aquariumActuel.id, type: type, status: "en attente" });
    document.getElementById("mod-id").value = "";
    cacherFormulaire("form-module");
    afficherModules();
}

function afficherModules() {
    mettreAJourNomAquarium();
    var div = document.getElementById("liste-modules");
    div.innerHTML = "";
    if (!aquariumActuel) return;

    for (var i = 0; i < modules.length; i++) {
        var mod = modules[i];
        if (mod.aquariumId === aquariumActuel.id) {
            var statusClass = (mod.status === "appairé") ? "status-ok" : "status-attente";
            div.innerHTML += '<div class="module-card"><div><strong>' + mod.id + '</strong><p>' + mod.type + '</p></div><span class="' + statusClass + '">' + mod.status + '</span></div>';
        }
    }
    if (div.innerHTML === "") div.innerHTML = "<p>Aucun module associé à cet aquarium.</p>";
}

// ===== NOURRISSAGE =====
function afficherFormNourrissage() {
    if (!aquariumActuel) { alert("Veuillez d'abord sélectionner un aquarium."); return; }
    document.getElementById("form-nourrissage").style.display = "block";
}

function changerTypeNour() {
    var type = document.getElementById("nour-type").value;
    if (type === "intervalle") {
        document.getElementById("nour-intervalle").style.display = "block";
        document.getElementById("nour-fixe").style.display = "none";
    } else {
        document.getElementById("nour-intervalle").style.display = "none";
        document.getElementById("nour-fixe").style.display = "block";
    }
}

function programmerNourrissage() {
    var type = document.getElementById("nour-type").value;
    var detail = "";

    if (type === "intervalle") {
        var heures = document.getElementById("nour-heures").value;
        if (!heures) { alert("Veuillez saisir un intervalle."); return; }
        detail = "Toutes les " + heures + " heure(s)";
    } else {
        var heure = document.getElementById("nour-heure").value;
        var cases = document.querySelectorAll("#nour-fixe input[type=checkbox]:checked");
        var jours = [];
        for (var i = 0; i < cases.length; i++) { jours.push(cases[i].value); }
        if (!heure || jours.length === 0) { alert("Veuillez remplir tous les champs."); return; }
        detail = jours.join(", ") + " à " + heure;
    }

    programmes_nourrissage.push({ id: compteurNour, aquariumId: aquariumActuel.id, type: type, detail: detail });
    compteurNour++;
    cacherFormulaire("form-nourrissage");
    afficherNourrissage();
}

function declencherNourrissage() {
    if (!aquariumActuel) { alert("Veuillez d'abord sélectionner un aquarium."); return; }
    alert("🍽️ Nourrissage déclenché pour " + aquariumActuel.nom + " !");
}

function afficherNourrissage() {
    mettreAJourNomAquarium();
    var div = document.getElementById("liste-nourrissage");
    div.innerHTML = "";
    if (!aquariumActuel) return;

    for (var i = 0; i < programmes_nourrissage.length; i++) {
        var prog = programmes_nourrissage[i];
        if (prog.aquariumId === aquariumActuel.id) {
            div.innerHTML += '<div class="nour-card"><strong>Programme #' + prog.id + '</strong><p>' + prog.detail + '</p></div>';
        }
    }
    if (div.innerHTML === "") div.innerHTML = "<p>Aucun programme de nourrissage.</p>";
}

// ===== TOUCHE ENTRÉE SUR LA PAGE DE CONNEXION =====
document.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        var loginPage = document.getElementById("page-login");
        if (loginPage.style.display !== "none") seConnecter();
    }
});