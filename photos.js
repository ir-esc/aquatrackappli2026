import { currentAquarium } from "../app.js";

const photosView = {
  rows:[
    { view:"toolbar", cols:[
      { view:"label", id:"photoTitle", label:"Photos (aucun aquarium)" }
    ]},
    { template:photosTemplate, autoScroll:true }
  ]
};

function photosTemplate(){
  if(!currentAquarium){
    return "Sélectionne un aquarium pour voir les photos.";
  }
  return "Photos automatiques simulées pour : " + currentAquarium.nom +
         "<br><br>📷 13/03/2026 08:00<br>📷 12/03/2026 20:00<br>📷 12/03/2026 08:00";
}

photosView.init = function(){
  if(!currentAquarium){
    $$("photoTitle").setValue("Photos (aucun aquarium)");
  }else{
    $$("photoTitle").setValue("Photos - " + currentAquarium.nom);
  }
};

export default photosView;
