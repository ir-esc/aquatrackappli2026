import { aquariums, currentUser, setAquarium } from "../app.js";
import { showView } from "../app.js";

const aquariumsView = {
  rows:[
    { view:"toolbar", cols:[
      { view:"label", label:"Mes aquariums" },
      { view:"button", value:"+ Ajouter", width:110, click:()=>$$("aqrWin").show() }
    ]},
    {
      view:"datatable",
      id:"aqrTable",
      select:true,
      columns:[
        { id:"nom",    header:"Nom",       fillspace:true },
        { id:"volume", header:"Volume (L)", width:120 },
        { id:"acces",  header:"Accès",      width:80 }
      ],
      on:{
        onItemDblClick:function(id){
          const aqr = this.getItem(id);
          setAquarium(aqr);
          webix.message("Aquarium sélectionné : " + aqr.nom);
          showView("params");
        }
      }
    },
    {
      view:"window",
      id:"aqrWin",
      position:"center",
      modal:true,
      width:300,
      head:"Nouvel aquarium",
      body:{
        view:"form",
        id:"aqrForm",
        elements:[
          { view:"text", name:"nom",    label:"Nom" },
          { view:"text", name:"volume", label:"Volume (L)" },
          { view:"combo", name:"acces", label:"Accès", options:[
            { id:"prive",  value:"Privé" },
            { id:"public", value:"Public" }
          ]},
          {
            cols:[
              { view:"button", value:"Enregistrer", click:saveAquarium },
              { view:"button", value:"Annuler", click:()=>$$("aqrWin").hide() }
            ]
          }
        ]
      }
    }
  ]
};

function loadAquariums(){
  const data = [];
  for(let i=0;i<aquariums.length;i++){
    const a = aquariums[i];
    if(a.proprietaire === currentUser.id || a.acces === "public"){
      data.push(a);
    }
  }
  $$("aqrTable").clearAll();
  $$("aqrTable").parse(data);
}

function saveAquarium(){
  const values = $$("aqrForm").getValues();
  if(!values.nom){
    webix.message("Nom obligatoire");
    return;
  }
  const id = aquariums.length+1;
  aquariums.push({
    id:id,
    nom:values.nom,
    volume:values.volume,
    acces:values.acces || "prive",
    proprietaire:currentUser.id
  });
  $$("aqrWin").hide();
  loadAquariums();
}

aquariumsView.init = loadAquariums;

export default aquariumsView;
