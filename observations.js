import { currentAquarium, observations } from "../app.js";

const observationsView = {
  rows:[
    { view:"toolbar", cols:[
      { view:"label", id:"obsTitle", label:"Observations (aucun aquarium)" },
      { view:"button", value:"+ Observation", width:130, click:()=>$$("obsWin").show() }
    ]},
    {
      view:"list",
      id:"obsList",
      template:"#date# - #texte#",
      autoheight:false
    },
    {
      view:"window",
      id:"obsWin",
      position:"center",
      modal:true,
      width:400,
      head:"Nouvelle observation",
      body:{
        view:"form",
        id:"obsForm",
        elements:[
          { view:"textarea", name:"texte", label:"Texte", height:120 },
          {
            cols:[
              { view:"button", value:"Enregistrer", click:saveObs },
              { view:"button", value:"Annuler", click:()=>$$("obsWin").hide() }
            ]
          }
        ]
      }
    }
  ]
};

function loadObs(){
  if(!currentAquarium){
    $$("obsTitle").setValue("Observations (aucun aquarium)");
    $$("obsList").clearAll();
    return;
  }
  $$("obsTitle").setValue("Observations - " + currentAquarium.nom);
  const data = [];
  for(let i=0;i<observations.length;i++){
    const o = observations[i];
    if(o.aquariumId === currentAquarium.id){
      data.push(o);
    }
  }
  $$("obsList").clearAll();
  $$("obsList").parse(data);
}

function saveObs(){
  if(!currentAquarium){
    webix.message("Sélectionne un aquarium d'abord");
    return;
  }
  const v = $$("obsForm").getValues();
  if(!v.texte){
    webix.message("Texte obligatoire");
    return;
  }
  const now = new Date();
  let texte = v.texte;
  if(texte.length>1000) texte = texte.substring(0,1000);
  observations.push({
    id:observations.length+1,
    aquariumId:currentAquarium.id,
    texte:texte,
    date:now.toISOString().slice(0,16).replace("T"," ")
  });
  $$("obsWin").hide();
  loadObs();
}

observationsView.init = loadObs;

export default observationsView;
