import { users, setUser, getMainLayout, showView } from "../app.js";

const loginView = {
  rows:[
    {},
    {
      cols:[
        {},
        {
          view:"form",
          id:"loginForm",
          width:320,
          elements:[
            { template:"<h2>Aquatrack</h2>", type:"clean", height:60 },
            { view:"text", label:"Identifiant", name:"id" },
            { view:"text", type:"password", label:"Mot de passe", name:"mdp" },
            { view:"button", value:"Se connecter", click:doLogin },
            { view:"label", id:"loginError", label:"", css:"error-label" }
          ]
        },
        {}
      ]
    },
    {}
  ]
};

function doLogin(){
  const values = $$("loginForm").getValues();
  let found = null;
  for(let i=0;i<users.length;i++){
    if(users[i].id === values.id && users[i].mdp === values.mdp){
      found = users[i];
    }
  }
  if(found){
    setUser(found);
    webix.ui(getMainLayout(), $$("root"));
    showView("aquariums");
  }else{
    $$("loginError").setValue("Identifiant ou mot de passe incorrect");
  }
}

export default loginView;
