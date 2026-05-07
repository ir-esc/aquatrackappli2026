import { JetView } from "https://cdn.webix.com/site/webixjet/webixjet.js";

export default class AquaView extends JetView {

    config() {
        return {
            rows:[
                {
                    view:"datatable",
                    id:"aquaTable",
                    columns:[
                        {
                            id:"media_id",
                            header:"Image",
                            width:70,
                            template:"<img src='https://aquatrackapi.ir.lan/aqr/#media_id#' width='55'>"
                        },
                        { id:"nom", header:"Nom", fillspace:true },
                        { id:"user_id", header:"Propriétaire", width:120 },
                        { id:"acces", header:"Accès", width:100 },
                        { id:"volume", header:"Volume", width:100 },
                        { id:"date", header:"Date", width:150 }
                    ],
                    select:"row",
                    autoheight:true
                },

                {
                    view:"toolbar",
                    cols:[
                        {
                            view:"button",
                            value:"Voir",
                            css:"webix_primary",

                            click:() => {
                                const table = this.$$("aquaTable");
                                const selected = table.getSelectedItem();

                                if(selected){
                                    this.show(`/mesures?id=${selected.id}`);
                                }
                                else{
                                    webix.alert("Sélectionnez un aquarium");
                                }
                            }
                        }
                    ]
                }
            ]
        };
    }

    init() {

        webix.attachEvent("onBeforeAjax", function(mode, url, data, request){
            request.withCredentials = true;
        });

        webix.ajax()
            .headers({
                "Content-Type":"application/json"
            })
            .post(
                "https://aquatrackapi.ir.lan/log",
                JSON.stringify({
                    email:"Alex@ir.lan",
                    motdepasse:"Alex1234"
                })
            )
            .then(() => {

                this.$$("aquaTable").load(
                    "https://aquatrackapi.ir.lan/aqr"
                );

            });
    }
}