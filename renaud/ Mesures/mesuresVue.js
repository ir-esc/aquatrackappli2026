webix.ui({
  id: "chart",
  view:"chart",
  width:600,
  height:250,
  type:"spline",
  value:"#yValue#",
  cellWidth: 50,
  dynamic: true,
  label: function(obj){
    return parseInt(obj.yValue,10);
  },
  item:{
    borderColor: "#1293f8",
    color: "#ffffff"
  },
  line:{
    color:"#1293f8",
    width:3
  },
  xAxis:{
    template:"#xValue#"
  },
  yAxis:{
    start:0,
    end:100,
    step:10,
    template:function(obj){
      return (obj%20?"":obj)
    }
  },
  series:[
    {
      value:"#yValue#",
      item:{
        borderColor: "#000000",
        color: "#ffffff"
      },
      line:{
        color:"#000000",
        width:2
      },
      tooltip:{
        template:"#yValue#"
      }
    }
  ]
});

var count = 1;
$$("chart").add({xValue: count, yValue: Math.random() * 100});
setInterval(function () {
  if(count < 100){
    count++;
    $$("chart").add({xValue: count, yValue: Math.random() * 100});
  }
}, 1000);
