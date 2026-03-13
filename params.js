import { currentAquarium, mesures } from "../app.js";

const paramsView = {
  rows:[
    { view:"toolbar", cols:[
      { view:"label", id:"paramsTitle", label:"Paramètres (aucun aquarium)" },
      { view:"button", value:"+ Mesure", width:110, click:()=>$$("paramWin").show() }
    ]},
    {
      view:"datatable",
      id:"paramsTable",
      columns:[
        { id:"date",  header:"Date/heure", width:180 },
        { id:"type",  header:"Type",       width:140 },
        { id:"valeur",header:"Valeur",     fillspace:true }
      ]
    },
    {
      view:"window",
      id:"paramWin",
      position:"center",
      modal:true,
      width:300,
      head:"Nouvelle mesure",
      body:{
        view:"form",
        id:"paramForm",
        elements:[
          { view:"combo", name:"type", label:"Type", options:[
            "pH","Température","NO2","NO3","GH","KH"
          ]},
          { view:"text", name:"valeur", label:"Valeur" },
          {
            cols:[
              { view:"button", value:"Enregistrer", click:saveParam },
              { view:"button", value:"Annuler", click:()=>$$("paramWin").hide() }
            ]
          }
        ]
      }
    }
  ]
};

function loadParams(){
  if(!currentAquarium){
    $$("paramsTitle").setValue("Paramètres (aucun aquarium)");
    $$("paramsTable").clearAll();
    return;
  }
  $$("paramsTitle").setValue("Paramètres - " + currentAquarium.nom);
  const data = [];
  for(let i=0;i<mesures.length;i++){
    const m = mesures[i];
    if(m.aquariumId === currentAquarium.id){
      data.push(m);
    }
  }
  $$("paramsTable").clearAll();
  $$("paramsTable").parse(data);
}

function saveParam(){
  if(!currentAquarium){
    webix.message("Sélectionne un aquarium d'abord");
    return;
  }
  const v = $$("paramForm").getValues();
  if(!v.type || !v.valeur){
    webix.message("Champs obligatoires");
    return;
  }
  const now = new Date();
  mesures.push({
    id:mesures.length+1,
    aquariumId:currentAquarium.id,
    type:v.type,
    valeur:v.valeur,
    date:now.toISOString().slice(0,16).replace("T"," ")
  });
  $$("paramWin").hide();
  loadParams();
}

paramsView.init = loadParams;

export default paramsView;
