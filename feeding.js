import { currentAquarium, feedingPrograms } from "../app.js";

const feedingView = {
  rows:[
    { view:"toolbar", cols:[
      { view:"label", id:"feedTitle", label:"Nourrissage (aucun aquarium)" },
      { view:"button", value:"+ Programme", width:130, click:()=>$$("feedWin").show() },
      { view:"button", value:"Déclencher", width:110, click:triggerFeed }
    ]},
    {
      view:"list",
      id:"feedList",
      template:"#detail#",
      autoheight:false
    },
    {
      view:"window",
      id:"feedWin",
      position:"center",
      modal:true,
      width:350,
      head:"Programme de nourrissage",
      body:{
        view:"form",
        id:"feedForm",
        elements:[
          { view:"combo", name:"type", label:"Type", options:[
            { id:"intervalle", value:"Toutes les X heures" },
            { id:"fixe",       value:"Jours + heure fixe" }
          ]},
          { view:"text", name:"heures", label:"Heures (si intervalle)" },
          { view:"text", name:"jours",  label:"Jours (si fixe)" },
          { view:"text", name:"heure",  label:"Heure (si fixe)" },
          {
            cols:[
              { view:"button", value:"Enregistrer", click:saveFeed },
              { view:"button", value:"Annuler", click:()=>$$("feedWin").hide() }
            ]
          }
        ]
      }
    }
  ]
};

function loadFeeds(){
  if(!currentAquarium){
    $$("feedTitle").setValue("Nourrissage (aucun aquarium)");
    $$("feedList").clearAll();
    return;
  }
  $$("feedTitle").setValue("Nourrissage - " + currentAquarium.nom);
  const data = [];
  for(let i=0;i<feedingPrograms.length;i++){
    const p = feedingPrograms[i];
    if(p.aquariumId === currentAquarium.id){
      data.push(p);
    }
  }
  $$("feedList").clearAll();
  $$("feedList").parse(data);
}

function saveFeed(){
  if(!currentAquarium){
    webix.message("Sélectionne un aquarium d'abord");
    return;
  }
  const v = $$("feedForm").getValues();
  if(!v.type){
    webix.message("Type obligatoire");
    return;
  }
  let detail = "";
  if(v.type === "intervalle"){
    detail = "Toutes les " + (v.heures || "?") + " heures";
  }else{
    detail = (v.jours || "?") + " à " + (v.heure || "?");
  }
  feedingPrograms.push({
    id:feedingPrograms.length+1,
    aquariumId:currentAquarium.id,
    type:v.type,
    detail:detail
  });
  $$("feedWin").hide();
  loadFeeds();
}

function triggerFeed(){
  if(!currentAquarium){
    webix.message("Sélectionne un aquarium d'abord");
    return;
  }
  webix.message("Nourrissage déclenché pour " + currentAquarium.nom);
}

feedingView.init = loadFeeds;

export default feedingView;
