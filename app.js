import loginView from "./views/login.js";
import aquariumsView from "./views/aquariums.js";
import paramsView from "./views/params.js";
import observationsView from "./views/observations.js";
import modulesView from "./views/modules.js";
import photosView from "./views/photos.js";
import feedingView from "./views/feeding.js";

export let currentUser = null;
export let currentAquarium = null;

export let users = [
  { id:"admin", mdp:"1234", niveau:"admin" },
  { id:"user1", mdp:"pass1", niveau:"user" }
];

export let aquariums = [
  { id:1, nom:"Bac tropical", acces:"prive",  volume:200, proprietaire:"admin" },
  { id:2, nom:"Bac marin",    acces:"public", volume:100, proprietaire:"user1" }
];

export let mesures = [];
export let observations = [];
export let modulesData = [];
export let feedingPrograms = [];

export function setUser(u){ currentUser = u; }
export function setAquarium(a){ currentAquarium = a; }

export function getMainLayout(){
  return {
    rows:[
      { view:"toolbar", elements:[
        { view:"label", label:"🐠 Aquatrack" },
        { view:"button", value:"Aquariums",  width:120, click:()=>showView("aquariums") },
        { view:"button", value:"Paramètres", width:120, click:()=>showView("params") },
        { view:"button", value:"Observations", width:120, click:()=>showView("observations") },
        { view:"button", value:"Modules", width:110, click:()=>showView("modules") },
        { view:"button", value:"Photos",  width:90,  click:()=>showView("photos") },
        { view:"button", value:"Nourrissage", width:120, click:()=>showView("feeding") },
        {},
        { view:"button", value:"Déconnexion", width:110, click:()=>showLogin() }
      ]},
      { id:"main", rows:[] }
    ]
  };
}

export function showView(name){
  let ui = null;
  if(name === "aquariums")   ui = aquariumsView;
  if(name === "params")      ui = paramsView;
  if(name === "observations")ui = observationsView;
  if(name === "modules")     ui = modulesView;
  if(name === "photos")      ui = photosView;
  if(name === "feeding")     ui = feedingView;
  if(!ui) return;

  $$("main").removeView(0);
  $$("main").addView(ui);

  if(ui.init){ ui.init(); } // pour charger les données
}

export function showLogin(){
  webix.ui(loginView, $$("root"));
}

webix.ready(function(){
  webix.ui({ id:"root", rows:[ loginView ] });
});
