///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////
define(['dojo/_base/declare',
        'dojo/on',
        'dojo/_base/lang',
        'dojo/Deferred',
        'dojo/dom',
        "dojo/dom-attr",
        "dojo/dom-style",
        "dojo/dom-construct",
        'dijit/form/Select',
        "dijit/TooltipDialog",
        'esri/tasks/query',
        'esri/tasks/QueryTask',
        "esri/dijit/InfoWindow",
        "esri/InfoTemplate",
        "dijit/popup",
        "dijit/form/RadioButton",
        "esri/graphic",
        "esri/layers/FeatureLayer",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol",
        "esri/symbols/PictureFillSymbol",
        "esri/symbols/PictureMarkerSymbol",
        "esri/symbols/CartographicLineSymbol",
        "esri/Color",
        "esri/renderers/SimpleRenderer",
        "esri/lang",
        'jimu/BaseWidget'],
function(declare, on, lang, Deferred, dom, domAttr, domStyle, domConstruct, Select, TooltipDialog, Query, QueryTask,
         InfoWindow, InfoTemplate, dijitPopup, RadioButton, Graphic, FeatureLayer, SimpleMarkerSymbol, 
         SimpleLineSymbol, SimpleFillSymbol, PictureFillSymbol, PictureMarkerSymbol, CartographicLineSymbol,
         Color, SimpleRenderer, esriLang, BaseWidget) {
          var allEvents = {};
         

    allEvents.init_actiavteEvents= function(){
      window.dialog = new TooltipDialog({
        class: "tooltipDialog",
        style: "position: absolute; width: 270px; font: normal normal normal 10pt Helvetica;z-index:100"
      });
      dialog.startup();
      window.popupWindow = new InfoWindow({
        domNode: domConstruct.create("div", null, dom.byId("map"))
      })
      window.villageHighlightSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0]), 3),new Color([125,125,125,0.35]));
      akah_Tool.map.infoWindow.resize(245,125);
      // var mouseEvent=true;window.mouseEvent=mouseEvent;
      // if(evt.srcElement.checked == true){mouseEvent = true;}
      // else{mouseEvent = false;closeDialog();}
      // on(dom.byId("toggleid"),"change",function(evt){
      //  if(evt.srcElement.checked == true){mouseEvent = true;}
      //  else{mouseEvent = false;closeDialog();}
      // });
      akah_states_layer.on('mouse-over', function(evt){
        if(mouseEvent == true){
        akah_Tool.map.graphics.clear();
        dojo.query(".esriPopup").style("display","none")
        var t = "<div style='display:flex;width:100%;justify-content: space-between;'><h3 style='color:#2aaa8a;font-size: 15px;font-family: serif;width:80%;margin-top:0px;'>State Information</h3><button style='float:right;padding: 1px 5px 2px 6px;border-radius: 5px;background-color: #ffffff;border-color: #74efcd;height:27px;' onclick='closeDialog()'>&#9747;</button></div><hr>"
          + "<b>State: </b>${state}<br></div>"
          addGraphic(evt,t);
        }else{closeDialog();}
      });
      akah_dist_layer.on('mouse-over', function(evt){
        if(mouseEvent == true){
        akah_Tool.map.graphics.clear();
        dojo.query(".esriPopup").style("display","none")
        var t = "<div style='display:flex;width:100%;justify-content: space-between;'><h3 style='color:#2aaa8a;font-size: 15px;font-family: serif;width:80%;margin-top:0px;'>District Information</h3><button style='float:right;padding: 1px 5px 2px 6px;border-radius: 5px;background-color: #ffffff;border-color: #74efcd;height:27px;' onclick='closeDialog()'>&#9747;</button></div><hr>"
          + "<div style='line-height:1.5em;'><b>State: </b>${state}<br>"
          + "<b>District: </b>${district}<br></div>"
          addGraphic(evt,t);
        }else{closeDialog();}
      });
      akah_block_layer.on('mouse-over', function(evt){
        if(mouseEvent == true){
        akah_Tool.map.graphics.clear();
        dojo.query(".esriPopup").style("display","none")
        var t = "<div style='display:flex;width:100%;justify-content: space-between;'><h3 style='color:#2aaa8a;font-size: 15px;font-family: serif;width:80%;margin-top:0px;'>Block Information</h3><button style='float:right;padding: 1px 5px 2px 6px;border-radius: 5px;background-color: #ffffff;border-color: #74efcd;height:27px;' onclick='closeDialog()'>&#9747;</button></div><hr>"
          + "<div style='line-height:1.5em;'><b>State: </b>${state}<br>"
          + "<b>District: </b>${district}<br>"
          + "<b>Block: </b>${block}<br></div>"
          addGraphic(evt,t);
        }else{closeDialog();}
      });
      akah_villages_layer.on('mouse-over', function(evt){
        if(mouseEvent == true){
        akah_Tool.map.graphics.clear();
        dojo.query(".esriPopup").style("display","none")
        var t = "<div style='display:flex;width:100%;justify-content: space-between;'><h3 style='color:#2aaa8a;font-size: 15px;font-family: serif;width:80%;margin-top:0px;'>Village Information</h3><button style='float:right;padding: 1px 5px 2px 6px;border-radius: 5px;background-color: #ffffff;border-color: #74efcd;height:27px;' onclick='closeDialog()'>&#9747;</button></div><hr>"
          + "<div style='line-height:1.5em;'><b>District: </b>${district}<br>"
          + "<b>Block: </b>${block}<br>"
          + "<b>Village: </b>${village}<br>"
          + "<b>Aquifer: </b>${aquifer}<br>"
          + "<b>Watershed: </b>${watershed}<br></div>";
          addGraphic(evt,t);
        }else{closeDialog();}
      });
      akah_selectedwells_layer.on('mouse-over', function(evt){
        if(mouseEvent == true){
        dojo.query(".esriPopup").style("display","none")
        var t = "<div style='display:flex;width:100%;justify-content: space-between;'><h3 style='color:#2aaa8a;font-size: 15px;font-family: serif;width:80%;margin-top:0px;'>Longterm Observation Well Information</h3><button style='float:right;padding: 1px 5px 2px 6px;border-radius: 5px;background-color: #ffffff;border-color: #74efcd;height: 27px;' onclick='closeDialog()'>&#9747;</button></div><hr>"
          + "<div style='line-height:1.5em;'><b>Owner name: </b>${owner_name}<br>"
          + "<b>Well Type: </b>${well_type}<br>"
          + "<b>Village: </b>${village_name}<br>"
          + "<b>Block: </b>${block}<br>"
          + "<b>District: </b>${district}<br>"
          + "<b>State: </b>${state}<br></div>";
          addGraphic(evt,t);
        }else{closeDialog();}
      });
      gwm_station_layer.on('mouse-over', function(evt){
        if(mouseEvent == true){
        akah_Tool.map.graphics.clear();
        dojo.query(".esriPopup").style("display","none")
        var t = "<div style='display:flex;width:100%;justify-content: space-between;'><h3 style='color:#2aaa8a;font-size: 15px;font-family: serif;width:80%;margin-top:0px;'>CGWB Water Levels Information</h3><button style='float:right;padding: 1px 5px 2px 6px;border-radius: 5px;background-color: #ffffff;border-color: #74efcd;height:27px;' onclick='closeDialog()'>&#9747;</button></div><hr>"
          + "<div style='line-height:1.5em;'><b>Site Id: </b>${site_id}<br>"
          + "<b>Site Name: </b>${site_name}<br>"
          + "<b>Site Type: </b>${site_type}<br>"
          + "<b>Well Depth(mbgl): </b>${depth}<br>"
          + "<b>Block Name: </b>${block}<br>";
          + "<b>District Name: </b>${district}<br>";
          + "<b>State Name: </b>${state}<br></div>";
          addGraphic(evt,t);
        }else{closeDialog();}
      });
      akah_gwq.on('mouse-over', function(evt){
        if(mouseEvent == true){
        akah_Tool.map.graphics.clear();
        dojo.query(".esriPopup").style("display","none")
        var t = "<div style='display:flex;width:100%;justify-content: space-between;'><h3 style='color:#2aaa8a;font-size: 15px;font-family: serif;width:80%;margin-top:0px;'>CGWB Water Quality Information</h3><button style='float:right;padding: 1px 5px 2px 6px;border-radius: 5px;background-color: #ffffff;border-color: #74efcd;height:27px;' onclick='closeDialog()'>&#9747;</button></div><hr>"
          + "<div style='line-height:1.5em;'><b>Site Id: </b>${site_id}<br>"
          + "<b>Site Name: </b>${site_name}<br>"
          + "<b>Site Type: </b>${site_type}<br>"
          + "<b>Block Name: </b>${block_name}<br>";
          + "<b>District Name: </b>${district_name}<br>";
          + "<b>State Name: </b>${state_name}<br></div>";
          addGraphic(evt,t);
        }else{closeDialog();}
      });
      akah_sw1.on('mouse-over', function(evt){
        if(mouseEvent == true){
        akah_Tool.map.graphics.clear();
        dojo.query(".esriPopup").style("display","none")
        var t = "<div style='display:flex;width:100%;justify-content: space-between;'><h3 style='color:#2aaa8a;font-size: 15px;font-family: serif;width:80%;margin-top:0px;'>Surface Water Bodies Information</h3><button style='float:right;padding: 1px 5px 2px 6px;border-radius: 5px;background-color: #ffffff;border-color: #74efcd;height:27px;' onclick='closeDialog()'>&#9747;</button></div><hr>"
          + "<div style='line-height:1.5em;'><b>Name: </b>${name}<br>"
          + "<b>Area(Ha): </b>${area_ha}<br></div>"
          addGraphic(evt,t);
        }else{closeDialog();}
      });
      hydrogeology_layer.on('mouse-over', function(evt){
        if(mouseEvent == true){
        akah_Tool.map.graphics.clear();
        dojo.query(".esriPopup").style("display","none")
        var t = "<div style='display:flex;width:100%;justify-content: space-between;'><h3 style='color:#2aaa8a;font-size: 15px;font-family: serif;width:80%;margin-top:0px;'>Hydrogeology Information</h3><button style='float:right;padding: 1px 5px 2px 6px;border-radius: 5px;background-color: #ffffff;border-color: #74efcd;height:27px;' onclick='closeDialog()'>&#9747;</button></div><hr>"
        + "<div style='line-height:1.5em;'><b>State: </b>${state}<br>"  
        + "<b>District: </b>${district}<br>"  
        + "<b>Hydrogeology: </b>${hydrogeology}<br></div>"  
          addGraphic(evt,t);
        }else{closeDialog();}
      });
      akah_watershed.on('mouse-over', function(evt){
        if(mouseEvent == true){
        akah_Tool.map.graphics.clear();
        dojo.query(".esriPopup").style("display","none")
        var t = "<div style='display:flex;width:100%;justify-content: space-between;'><h3 style='color:#2aaa8a;font-size: 15px;font-family: serif;width:80%;margin-top:0px;'>Watershed Information</h3><button style='float:right;padding: 1px 5px 2px 6px;border-radius: 5px;background-color: #ffffff;border-color: #74efcd;height:27px;' onclick='closeDialog()'>&#9747;</button></div><hr>"
          + "<div style='line-height:1.5em;'><b>Watershed: </b>${Watershed}<br>"
          + "<b>Sub Basin: </b>${Sub_Basin}<br>"
          + "<b>Basin: </b>${Basin}<br></div>"
          addGraphic(evt,t);
        }else{closeDialog();}
      });
      akah_aqui.on('mouse-over', function(evt){
        if(mouseEvent == true){
        akah_Tool.map.graphics.clear();
        dojo.query(".esriPopup").style("display","none")
        var t = "<div style='display:flex;width:100%;justify-content: space-between;'><h3 style='color:#2aaa8a;font-size: 15px;font-family: serif;width:80%;margin-top:0px;'>Aquifer Information</h3><button style='float:right;padding: 1px 5px 2px 6px;border-radius: 5px;background-color: #ffffff;border-color: #74efcd;height:27px;' onclick='closeDialog()'>&#9747;</button></div><hr>"
          + "<div style='line-height:1.5em;'><b>Principle Aquifer: </b>${aquifer}<br>"
          + "<b>Code major aquifer : </b>${newcode43}<br>"
          + "<b>Major aquifer: </b>${aquifer0}<br>"
          + "<b>Aquifer system: </b>${system}<br>"
          + "<b>Type of aquifer: </b>${aquifers}<br>"
          + "<b>Thickness of weathered zone(m): </b>${zone_m}<br>"
          + "<b>Fractures of encountered(mbgl): </b>${mbgl}<br>"
          + "<b>Decadal average(mbgl) : </b>${avg_mbgl}<br>"
          + "<b>Transmissivity(ft3/day) : </b>${m2_perday}<br>"
          + "<b>Yield : </b>${m3_per_day}<br>"
          + "<b>Specific yield : </b>${yeild__}<br>"
          + "<b>Quality-EC : </b>${per_cm}<br>"
          addGraphic(evt,t);
        }else{closeDialog();}
      });
      // sensors_location_url -> layer name assigned to sensor locations layer on the map.
      sensors_location_url.on('mouse-over', function(evt){
        if(mouseEvent == true){
        akah_Tool.map.graphics.clear();
        dojo.query(".esriPopup").style("display","none")
        var t = "<div style='display:flex;width:100%;justify-content: space-between;'><h3 style='color:#2aaa8a;font-size: 15px;font-family: serif;width:80%;margin-top:0px;'>Sensor Information</h3><button style='float:right;padding: 1px 5px 2px 6px;border-radius: 5px;background-color: #ffffff;border-color: #74efcd;height:27px;' onclick='closeDialog()'>&#9747;</button></div><hr>"
          + "<div style='line-height:1.5em;'>"
          + "<b>Site Name: </b>${site_name}<br>"
          + "<b>Well Owner: </b>${well_owner_name}<br>"
          + "<b>Water Usage: </b>${water_usage}<br>"
          + "<b>Motor Capacity(hp): </b>${motor_capacity_hp}<br>"
          + "<b>Well Depth(m): </b>${depth_m}<br>"
          + "<b>Outlet pie size(inch): </b>${outlet_pipe_size_inch}<br></div>"
          addGraphic(evt,t);
        }else{closeDialog();}
      });
    };
    addGraphic  = function(evt, t){
      var content = esriLang.substitute(evt.graphic.attributes,t);
      var highlightGraphic = new Graphic(evt.graphic.geometry, villageHighlightSymbol);
      // akah_Tool.map.graphics.add(highlightGraphic);
      dialog.setContent(content);
      // domStyle.set(dialog.domNode, "opacity", 0.85);
      dijitPopup.open({
        popup: dialog,
        x: evt.pageX,
        y: evt.pageY
      });
    };
    allEvents.closeDialogFunction =  function(){
      closeDialog();
    };
    closeDialog = function(){
      // akah_Tool.map.graphics.clear();
      dijitPopup.close(dialog);
      dojo.query(".esriPopup").style("display","block")
    };
return allEvents;
});