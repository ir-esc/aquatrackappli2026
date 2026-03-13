import { currentAquarium, modulesData } from "../app.js";

const modulesView = {
  rows:[
    { view:"toolbar", cols:[
      { view:"label", id:"modTitle", label:"Modules (aucun aquarium)" },
      { view:"button", value:"+ Module", width:110, click:()=>$$("modWin").show() }
    ]},
    {
      view:"datatable",
      id:"modTable",
      columns:[
        { id:"id",    header:"Id module", width:120 },
        { id:"type",  header:"Type",      fillspace:true },
        { id:"status",header:"Statut",    width:100 }
      ]
    },
    {
      view:"window",
      id:"modWin",
      position:"center",
      modal:true,
      width:320,
      head:"Nouveau module",
      body:{
        view:"form",
        id:"modForm",
        elements:[
          { view:"text", name:"id",   label:"Id" },
          { view:"combo", name:"type", label:"Type", options:[
            "Capteur pH","Capteur température","Module caméra","Module nourrissage"
          ]},
          {
            cols:[
              { view:"button", value:"Enregistrer", click:saveModule },
              { view:"button", value:"Annuler", click:()=>$$("modWin").hide() }
            ]
          }
        ]
      }
    }
  ]
};

function loadModules(){
  if(!currentAquarium){
    $$("modTitle").setValue("Modules (aucun aquarium)");
    $$("modTable").clearAll();
    return;
  }
  $$("modTitle").setValue("Modules - " + currentAquarium.nom);
  const data = [];
  for(let i=0;i<modulesData.length;i++){
    const m = modulesData[i];
    if(m.aquariumId === currentAquarium.id){
      data.push(m);
    }
  }
  $$("modTable").clearAll();
  $$("modTable").parse(data);
}

function saveModule(){
  if(!currentAquarium){
    webix.message("Sélectionne un aquarium d'abord");
    return;
  }
  const v = $$("modForm").getValues();
  if(!v.id || !v.type){
    webix.message("Champs obligatoires");
    return;
  }
  modulesData.push({
    id:v.id,
    aquariumId:currentAquarium.id,
    type:v.type,
    status:"en attente"
  });
  $$("modWin").hide();
  loadModules();
}

modulesView.init = loadModules;

export default modulesView;
