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
        'dojo/promise/all',
        'esri/map',
        "esri/arcgis/Portal",
        "esri/dijit/Print",
        "esri/tasks/PrintTemplate",
        "esri/config",
        'dojo/on',
        'dojo/dom',
        'dojo/aspect',
        'dojo/dom-style',
        'dojo/_base/lang',
        'dojo/dom-construct',
        'esri/request',
        'dojo/_base/html',
        'dojo/_base/array',
        'dojo/dom-geometry',
        'dojo/query',
        'esri/tasks/query',
        'esri/tasks/QueryTask',
        'esri/layers/FeatureLayer',
        'esri/dijit/PopupTemplate',
        'esri/dijit/analysis/utils',
        "esri/geometry/Point",
        "esri/graphic",
        "esri/dijit/LayerList",
        "esri/Color",
        "esri/toolbars/draw",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol",
        'dojo/Deferred',
        "dojo/dom-attr",
        "dojo/fx/easing",
        "dojox/charting/Chart",
        "dojox/charting/Chart2D",
        "dojox/charting/axis2d/Default",
        "dojox/charting/plot2d/Pie",
        "dojox/charting/plot2d/Lines",
        "dojox/charting/themes/PlotKit/blue",
        "dojox/charting/themes/PlotKit/green",
        "dojox/charting/action2d/MoveSlice",
        "dojox/charting/action2d/Highlight",
        "dojox/charting/action2d/Tooltip",
        "dojox/charting/plot2d/Columns",
        "dojox/charting/plot2d/ClusteredColumns",
        "dojox/charting/plot2d/StackedColumns",
        "dojox/charting/plot2d/Markers",
        "dojox/charting/themes/Tufte",
        "dojox/charting/themes/Claro",
        "dojox/charting/action2d/Magnify",
        "dojox/charting/action2d/MouseZoomAndPan",
        "dojox/charting/widget/Legend",
        "dojox/charting/themes/Wetland",
        "dojox/charting/themes/CubanShirts",
        "dojox/charting/widget/SelectableLegend",
        'jimu/dijit/Report',
        'dojo/date/locale',
        'jimu/dijit/TabContainer3',
        'dijit/form/Select',
        "esri/geometry/Extent",
        "esri/SpatialReference",
        "esri/dijit/Search",
        "esri/dijit/analysis/InterpolatePoints",
        "esri/geometry/webMercatorUtils",
        "dijit/form/CheckBox",
        'jimu/LayerInfos/LayerInfos',
        'jimu/utils',
        'jimu/portalUtils',
        'jimu/portalUrlUtils',
        'esri/tasks/FeatureSet',
        "dijit/a11yclick",
        'jimu/dijit/FeatureActionPopupMenu',
        'jimu/BaseWidget',
        "dojox/gfx/utils",
        "dojox/math/stats",
        "esri/layers/WMSLayer",
        "esri/tasks/PrintTask",
        "esri/tasks/PrintParameters",
        "esri/renderers/SimpleRenderer",
        "dijit/form/RadioButton",
        // "./ee_api_js"
        // "./privatekey.json"
        // '@google/earthengine',
        "dijit/Dialog"],
function(declare,executeAll, map, arcgisPortal,Print, PrintTemplate, esriConfig, on, dom, aspect,domStyle,lang,domConstruct,esriRequest,html,array,domGeom, query, Query, QueryTask,FeatureLayer,
         PopupTemplate, AnalysisUtils, Point, Graphic, LayerList,Color, Draw, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, Deferred,
         domAttr, easing, Chart, Chart2D, Default, Pie, LinesPlot, blue, green, MoveSlice, Highlight, Tooltip, ColumnsPlot, ClusteredColumns, StackedColumns, Markers,
         Tufte,theme, Magnify, MouseZoomAndPan, Legend,Wetland, CubanShirts, SelectableLegend, reportDijit, locale, TabContainer3,Select,Extent, SpatialReference,Search, InterpolatePoints, webMercatorUtils,
         CheckBox,LayerInfos, jimuUtils, portalUtils, portalUrlUtils, FeatureSet, a11yclick, PopupMenu, BaseWidget,utils, stats,WMSLayer, PrintTask, PrintParameters, SimpleRenderer,RadioButton, Dialog) {
  //To create a widget, you need to derive from BaseWidget.
  // var TOOLLIST_VIEW = 0, ANALYSIS_VIEW = 1, MESSAGE_VIEW = 2;
  var clazz=  declare([BaseWidget], {

    // privilegeUtil: null,
    akah_Tool: null,
    // currentToolSetting: null,
    // currentDijitID: null,
    // analysisMode: 'default',
    baseClass: 'jimu-widget-AKAHSummary',


    postCreate: function() {
      this.inherited(arguments);
    },

    startup: function() {
      // var earth_engine = require('@google/earthengine');
      // import '@google/earthengine';
      esriConfig.defaults.map.panDuration = 150
      esriConfig.defaults.map.zoomDuration = 10
      esriConfig.defaults.map.panRate = 1
      esriConfig.defaults.map.zoomRate = 1
      this.inherited(arguments);
      this.agakhan_layerlist();
      this.initDropdowns();
      this.initRadios();
      this.initGetLayersData();
      this.initLocationChange();
      this.selectByLocation$akah();
      this.initPrintTemplate();
      theme.axis.majorTick.color='black'
      theme.axis.minorTick.color='black'
      Tufte.axis.majorTick.color='black'
      Tufte.axis.minorTick.color='black'
    },

    agakhan_layerlist: function(){
      akah_Tool = this

      //domAttr.set('info_1_image','src', akah_Tool.folderUrl+"images/wsp_flowchart_1_2@4x.png")
      window.image_path =akah_Tool.folderUrl+"images/load.gif"
      window.gw_3dimage =akah_Tool.folderUrl+"images/gw_3dimage.png"
      window.farm_pond_cross_section =akah_Tool.folderUrl+"images/farm_pond_cross_section.png"
      // window.farm_pond_structure =akah_Tool.folderUrl+"images/farm_pond_structure.png"
      // window.privatekey = akah_Tool.folderUrl+'privatekey.json'

      /*map images*/
      window.aqui_and_ws =akah_Tool.folderUrl+"images/aqui_and_ws.jpg"
      window.main_map =akah_Tool.folderUrl+"images/main_map.jpg"
      window.dist_keymap = akah_Tool.folderUrl+"images/Keymaps_district.jpg"
      window.block_keymap = akah_Tool.folderUrl+"images/Keymaps_block.jpg"
      window.villageMap = akah_Tool.folderUrl+"images/village_map.jpg"
      window.watershedMap = akah_Tool.folderUrl+"images/watershed_map.jpg"

      /*rise and fall(arrow) images*/
      window.rise_arrow = akah_Tool.folderUrl+"images/green_arrow.png"
      window.fall_arrow = akah_Tool.folderUrl+"images/red_arrow.png"

      window.gwr_chart_temp = akah_Tool.folderUrl+"images/gwr_chart.jpg"

      dojo.byId("pr_load").setAttribute('src',image_path);
      dojo.byId("rf_load_gif").setAttribute('src',image_path);
      dojo.byId("gwr1_load_gif").setAttribute('src',image_path);
      dojo.byId("gwr2_load_gif").setAttribute('src',image_path);


      agakhan_layer_list = this.map.graphicsLayerIds;
      window.agakhan_layer_list=agakhan_layer_list;
      agakhan_layer_list.forEach(function(agakhan_element){
          // if(agakhan_element.includes("Well_Registration_View_2661")){
          //   akah_main_layer = akah_Tool.map.getLayer(agakhan_element);
          //   window.akah_main_layer = akah_main_layer;
          // }
          // if(akah_Tool.map.getLayer(agakhan_element).geometryType  == "esriGeometryPoint"){
          //   inputLayersforInterpolation.push(akah_Tool.map.getLayer(agakhan_element));
          //   window.inputLayersforInterpolation =  inputLayersforInterpolation;
          // }
          if(agakhan_element.includes("GWM_Stations")){
            gwm_station_layer = akah_Tool.map.getLayer(agakhan_element);
            window.gwm_station_layer = gwm_station_layer;
          }
          else if(agakhan_element.includes("AKAH_Selected_wells")){
            akah_selectedwells_layer = akah_Tool.map.getLayer(agakhan_element);
            window.akah_selectedwells_layer = akah_selectedwells_layer;
            // var legend = new esri.dijit.Legend({
            //   map: akah_Tool.map,
            //   layerInfos:[{layer:akah_selectedwells_layer,title:'Selected Wells'}],
            // }, "legend_sw");
            // legend.startup()
          }
          else if(agakhan_element.includes("states")){
            akah_states_layer = akah_Tool.map.getLayer(agakhan_element);
            window.akah_states_layer = akah_states_layer;
          }
          else if(agakhan_element.includes("Vilages_study_area_7521")){
            window.akah_total_villages = akah_Tool.map.getLayer(agakhan_element);
            //akah_states_layer = akah_states_layer;
          }
          else if(agakhan_element.includes("agakhan_districts")){
            akah_dist_layer = akah_Tool.map.getLayer(agakhan_element);
            window.akah_dist_layer = akah_dist_layer;
          }
          else if(agakhan_element.includes("agakhan_blocks")){
            akah_block_layer = akah_Tool.map.getLayer(agakhan_element);
            window.akah_block_layer = akah_block_layer;
          }
          else if(agakhan_element.includes("agakhan_Villages")){
            akah_villages_layer = akah_Tool.map.getLayer(agakhan_element);
            window.akah_villages_layer = akah_villages_layer;
          }
          else if(agakhan_element.includes("AKAH_Well_Registration")){
            akah_main_layer = akah_Tool.map.getLayer(agakhan_element);
            window.akah_main_layer = akah_main_layer;
          }

          else if(agakhan_element.includes("Aquifers_and_Watershed_7196")){
            akah_aqui = akah_Tool.map.getLayer(agakhan_element);
            window.akah_aqui = akah_aqui;
          }
          else if(agakhan_element.includes("Aquifers_and_Watershed_1950")){
            akah_watershed = akah_Tool.map.getLayer(agakhan_element);
            window.akah_watershed = akah_watershed;
          }
          else if(agakhan_element.includes("SurfaceWater_1946")){
            akah_sw = akah_Tool.map.getLayer(agakhan_element);
            window.akah_sw = akah_sw;
          }
          else if(agakhan_element.includes("Surface_Water_Bodies15122020_429")){
            akah_sw1 = akah_Tool.map.getLayer(agakhan_element);
            window.akah_sw1 = akah_sw1;
          }
          else if(agakhan_element.includes("Ground_Water_Quality_5416")){
            akah_gwq = akah_Tool.map.getLayer(agakhan_element);
            window.akah_gwq = akah_gwq;
          }
          else if(agakhan_element.includes("AKAH_Industries_2219")){
            akah_indus = akah_Tool.map.getLayer(agakhan_element);
            window.akah_indus = akah_indus;
          }
          else if(agakhan_element.includes("Drainage_Patterns_599")){
            akah_drain = akah_Tool.map.getLayer(agakhan_element);
            window.akah_drain = akah_drain;
          }
          else if(agakhan_element.includes("Aquaduct_for_AKAH_1326")){
            window.futureScenario_layer = akah_Tool.map.getLayer(agakhan_element);
            //akah_drain = akah_drain;
          }
          else if(agakhan_element.includes("Aquaduct_for_AKAH_4820")){
            window.baselineannual_layer = akah_Tool.map.getLayer(agakhan_element);
            //akah_drain = akah_drain;
          }
      });
      window.akah_total_villages  = this.map._layers["Vilages_study_area_9502"];

      var app = {}
      window.app = app ;
      app.printUrl ='https://geomonitor.co.in/server/rest/services/a4_printing_tool/GPServer/Export%20Web%20Map';

      // app.printUrl = "https://geomonitor.co.in/server/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task";
      // app.printUrl = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task";
      // var printInfo = esriRequest({
      //   "url": app.printUrl,
      //   "content": { "f": "json" }
      // });
      // printInfo.then(handlePrintInfo, handleError);
      //
      // function handlePrintInfo(resp) {
      // window.adb=resp
      // window.layoutTemplate, window.templateNames, window.mapOnlyIndex, window.templates;
      //   layoutTemplate = array.filter(resp.parameters, function(param, idx) {
      //     return param.name === "Layout_Template";
      //   });
      //   if (layoutTemplate.length === 0 ) {
      //     console.log("print service parameters name for templates must be \"Layout_Template\"");
      //     return;
      //   }
      //   templateNames = layoutTemplate[0].choiceList;
      //     var a3land = templateNames.splice(0, 1); //to append a3 lansdscape at the end of templatelist
      //     templateNames.push(a3land);
      //     var a3port = templateNames.splice(0,1);//to append a3 portrait at the end of templatelist
      //     templateNames.push(a3port);
      //   window.templateNames = templateNames;
      // }
      // function handleError(err) {
      //   console.log("Something broke: ", err);
      // }
    },

    initRadios: function(){
      dojo.query("#akah_ndwiChartModule").style("display","none");
      dojo.query("#akah_ndviChartModule").style("display","none");
      new RadioButton({checked: true,name:"analysisType",value:"lulc_inp"}, "lulc_inp").startup();
      new RadioButton({checked: false,name:"analysisType",value:"ndwi_inp",disabled:false}, "ndwi_inp").startup();
      new RadioButton({checked: false,name:"analysisType",value:"ndvi_inp",disabled:false}, "ndvi_inp").startup();
      var ndwiCheckedArray=[];window.ndwiCheckedArray = ndwiCheckedArray;
      new CheckBox({name: "checkBox",class:"ndwicheck_class",value:"agreed",checked: false,onChange: function(evt){akah_Tool.akah_chartGenerateNDWI();}}, "maxCheckBox_ndwi").startup();
      new CheckBox({name: "checkBox",class:"ndwicheck_class",value:"agreed",checked: true,onChange: function(evt){akah_Tool.akah_chartGenerateNDWI();}}, "meanCheckBox_ndwi").startup();
      new CheckBox({name: "checkBox",class:"ndwicheck_class",value:"agreed",checked: false,onChange: function(evt){akah_Tool.akah_chartGenerateNDWI();}}, "minCheckBox_ndwi").startup();
      new CheckBox({name: "checkBox",class:"ndwicheck_class",value:"agreed",checked: false,onChange: function(evt){akah_Tool.akah_chartGenerateNDWI();}}, "standardCheckBox_ndwi").startup();
      var ndviCheckedArray=[];window.ndviCheckedArray = ndviCheckedArray;
      new CheckBox({name: "checkBox",class:"ndvicheck_class",value:"agreed",checked: false,onChange: function(evt){akah_Tool.akah_chartGenerateNDVI();}}, "maxCheckBox_ndvi").startup();
      new CheckBox({name: "checkBox",class:"ndvicheck_class",value:"agreed",checked: true,onChange: function(evt){akah_Tool.akah_chartGenerateNDVI();}}, "meanCheckBox_ndvi").startup();
      new CheckBox({name: "checkBox",class:"ndvicheck_class",value:"agreed",checked: false,onChange: function(evt){akah_Tool.akah_chartGenerateNDVI();}}, "minCheckBox_ndvi").startup();
      new CheckBox({name: "checkBox",class:"ndvicheck_class",value:"agreed",checked: false,onChange: function(evt){akah_Tool.akah_chartGenerateNDVI();}}, "standardCheckBox_ndvi").startup();
      //onchange of radio buttons
      on(dom.byId("lulc_inp"),"change",function(evt){
        dojo.query("#akah_chartModule").style("display","block");
        dojo.query("#akah_ndwiChartModule").style("display","none");
        dojo.query("#akah_ndviChartModule").style("display","none");
        dojo.query(".LULCCategory").style("display","block");
        dojo.query(".NDWICategory").style("display","none");
        dojo.query(".NDVICategory").style("display","none");
      });
      on(dom.byId("ndwi_inp"),"change",function(evt){
        dojo.query("#akah_ndwiChartModule").style("display","block");
        dojo.query("#akah_ndviChartModule").style("display","none");
        dojo.query("#akah_chartModule").style("display","none");
        dojo.query(".NDWICategory").style("display","block");
        dojo.query(".NDVICategory").style("display","none");
        dojo.query(".LULCCategory").style("display","none");

      });
      on(dom.byId("ndvi_inp"),"change",function(evt){
        dojo.query("#akah_ndviChartModule").style("display","block");
        dojo.query("#akah_ndwiChartModule").style("display","none");
        dojo.query("#akah_chartModule").style("display","none");
        dojo.query(".NDVICategory").style("display","block");
        dojo.query(".NDWICategory").style("display","none");
        dojo.query(".LULCCategory").style("display","none");
      });

    },

    initDropdowns: function(){
      new Select({
        name: "State Chooser",
        id: "state_id"
      }, this.pro_state_id).startup();
      var st_array = ['Select State','Maharashtra','Gujarat'];
      window.st_array = st_array;
      var pl_map = st_array.map(function (record) {
        return dojo.create("option", {
          label: record,
          value: record
        })
      })
      var st_val = dijit.byId('state_id')
      window.st_val = st_val;
      st_val.options.length = 0
      st_val.addOption(pl_map)
      st_val.attr('value', st_array[0]);

      new Select({
        name: "Block Chooser",
        id: "block_id"
      }, this.pro_block_id).startup();
      var st_array0 = [''];

      window.st_array0=st_array0;
      var pl_map0 = st_array0.map(function (record) {
        return dojo.create("option", {
          label: record,
          value: record
        })
      })
      window.pl_map0=pl_map0
      var st_val1 = dijit.byId('block_id')
      window.st_val1=st_val1;
      st_val1.options.length = 0
      st_val1.addOption(pl_map0)
      st_val1.attr('value', st_array0[0]);

      new Select({
        name: "District Chooser",
        id: "district_id"
      }, this.pro_district_id).startup();
      var ds_array0 = [''];

      window.ds_array0=ds_array0;
      var pld_map0 = ds_array0.map(function (record) {
        return dojo.create("option", {
          label: record,
          value: record
        })
      })
      window.pld_map0=pld_map0
      var ds_val1 = dijit.byId('district_id')
      window.ds_val1=ds_val1;
      ds_val1.options.length = 0
      ds_val1.addOption(pld_map0)
      ds_val1.attr('value', ds_array0[0]);

      // Data Visualization Tab
      new Select({
        name: "State Chooser",
        id: "state_iddv"
      }, this.dv_state_id).startup();
      var st_arraydv = ['Select State','Maharashtra','Gujarat'];
      window.st_arraydv = st_arraydv;
      var pl_mapdv = st_arraydv.map(function (record) {
        return dojo.create("option", {
          label: record,
          value: record
        })
      })
      var st_valdv = dijit.byId('state_iddv')
      window.st_valdv  = st_valdv
      st_valdv.options.length = 0
      st_valdv.addOption(pl_mapdv)
      st_valdv.attr('value', st_arraydv[0]);

      new Select({
        name: "Block Chooser",
        id: "block_iddv"
      }, this.dv_block_id).startup();
      var st_array0dv = [''];

      window.st_array0dv=st_array0dv;
      var pl_map0dv = st_array0dv.map(function (record) {
        return dojo.create("option", {
          label: record,
          value: record
        })
      })
      window.pl_map0dv=pl_map0dv
      var st_val1dv = dijit.byId('block_iddv')
      window.st_val1dv=st_val1dv;
      st_val1dv.options.length = 0
      st_val1dv.addOption(pl_map0dv)
      st_val1dv.attr('value', st_array0dv[0]);

      new Select({
        name: "District Chooser",
        id: "district_iddv"
      }, this.dv_district_id).startup();
      var ds_array0dv = [''];

      window.ds_array0dv=ds_array0dv;
      var pld_map0dv = ds_array0dv.map(function (record) {
        return dojo.create("option", {
          label: record,
          value: record
        })
      })
      window.pld_map0dv=pld_map0dv
      var ds_val1dv = dijit.byId('district_iddv')
      window.ds_val1dv=ds_val1dv;
      ds_val1dv.options.length = 0
      ds_val1dv.addOption(pld_map0dv)
      ds_val1dv.attr('value', ds_array0dv[0]);

      //end of Data Visualisation  Tab
      new Select({
        name: "Block State",
        id: "akah_st"
      }, this.locStateId).startup();
      new Select({
        name: "Select District",
        id: "akah_dist"
      }, this.locDistId).startup();
      new Select({
        name: "Select Block",
        id: "akah_block"
      }, this.locBlockId).startup();
      new Select({
        name: "Select Village",
        id: "akah_vill"
      }, this.locVillId).startup();

      new Select({
        name: "agakhan_selMonsoon",
        id: "akah_selectMonsoon"
      }, this.akah_selMonsoon).startup();
      new Select({
        name: "agakhan_selYear",
        id: "akah_selectYear"
      }, this.akah_selYear).startup();

      new Select({name: "agakhan_fromselMonthNDWI",id: "akah_fromselectMonthNDWI"}, this.akah_fromselMonthNDWI).startup();
      new Select({name: "agakhan_fromselYearNDWI",id: "akah_fromselectYearNDWI"}, this.akah_fromselYearNDWI).startup();
      new Select({name: "agakhan_toselMonthNDWI",id: "akah_toselectMonthNDWI"}, this.akah_toselMonthNDWI).startup();
      new Select({name: "agakhan_toselYearNDWI",id: "akah_toselectYearNDWI"}, this.akah_toselYearNDWI).startup();
      new Select({name: "agakhan_fromselMonthNDVI",id: "akah_fromselectMonthNDVI"}, this.akah_fromselMonthNDVI).startup();
      new Select({name: "agakhan_fromselYearNDVI",id: "akah_fromselectYearNDVI"}, this.akah_fromselYearNDVI).startup();
      new Select({name: "agakhan_toselMonthNDVI",id: "akah_toselectMonthNDVI"}, this.akah_toselMonthNDVI).startup();
      new Select({name: "agakhan_toselYearNDVI",id: "akah_toselectYearNDVI"}, this.akah_toselYearNDVI).startup();

      //state
      var loc_st_array = ['Select State','Maharashtra','Gujarat'];
      window.loc_st_array = loc_st_array;
      var st_map = loc_st_array.map(function (record) {
        return dojo.create("option", {
          label: record,
          value: record
        })
      })
      var loc_st_val = dijit.byId('akah_st')
      window.loc_st_val = loc_st_val
      loc_st_val.options.length = 0
      loc_st_val.addOption(st_map)
      loc_st_val.attr('value', loc_st_array[0]);
      //dist
      var distValueakah = dijit.byId('akah_dist')
      window.distValueakah = distValueakah;
      //block
      var blockValueakah = dijit.byId('akah_block')
      window.blockValueakah = blockValueakah;
      //village
      var vill_valakah = dijit.byId('akah_vill')
      window.vill_valakah = vill_valakah
      //Select Monsoon
      var selectMonth_Akah = dijit.byId('akah_selectMonsoon')
      window.selectMonth_Akah = selectMonth_Akah
      //Select Year lulc
      var selectYear_Akah = dijit.byId('akah_selectYear')
      window.selectYear_Akah = selectYear_Akah
      var akah_chartYears = ['Select','2016','2017','2018','2019','2020'];window.akah_chartYears = akah_chartYears;
      // var akah_chartMonths = {'1': "Select", '2': "JAN", '3': "APR", '4': "OCT", '5': 'DEC'};window.akah_chartMonths = akah_chartMonths;
      var akah_chartMonths = {'1': "Select", '2': "Pre-monsoon", '3': "Post-monsoon"};window.akah_chartMonths = akah_chartMonths;
      var akahYear_map = akah_chartYears.map(function(record){
              return dojo.create("option", {
                label: record,
                value: record
           })
      })
      selectYear_Akah.options.length = 0
      selectYear_Akah.addOption(akahYear_map)
      selectYear_Akah.attr('value', akah_chartYears[0])

      var akahMonth_map = Object.entries(akah_chartMonths).map(function(record){
        return dojo.create("option", {
          label: record[1],
          value: record[0]
        })
      })
      selectMonth_Akah.options.length = 0
      selectMonth_Akah.addOption(akahMonth_map)
      selectMonth_Akah.attr('value', Object.keys(akah_chartMonths)[0])
      this.own(on(selectYear_Akah, 'change', lang.hitch(this, function(akah_year){
          window.akah_year = akah_year;
          this.akah_selYear = akah_year;
          if (dijit.byId('searchVillageAKAH').value != "" && dijit.byId('akah_selectMonsoon').value !="1" && dijit.byId('akah_selectYear').value !="Select") {
            akah_Tool.akah_chartGenerte()
        }
        else if (dijit.byId('searchVillageAKAH').value === "" && (akah_Tool.map.graphics.graphics[0].symbol != undefined) && (dijit.byId('akah_selectMonsoon').value !="1" && dijit.byId('akah_selectYear').value !="Select")) {
          new QueryTask(akah_villages_layer.url).execute(queryChart, function(akah_villageResponse){
            window.akah_searchResponse = akah_villageResponse.features[0];
            akah_Tool.akah_chartGenerte()
          });
      }
          else{
            domAttr.set("akahLulc_Chart","innerHTML","");
            domAttr.set("lulc_legend","innerHTML","");
            // domAttr.set("ndvi_legend","innerHTML","");
            // domAttr.set("akahNdvi_Chart","innerHTML","");
          }
      })))

      this.own(on(selectMonth_Akah, 'change', lang.hitch(this, function(akah_month){
          window.akah_month = akah_month;
          this.akah_selMonsoon = akah_Tool.akah_checkMonsoon(akah_month).toLowerCase();
          if (dijit.byId('searchVillageAKAH').value != "" && dijit.byId('akah_selectMonsoon').value !="1" && dijit.byId('akah_selectYear').value !="Select") {
            akah_Tool.akah_chartGenerte()
          }
          else if (dijit.byId('searchVillageAKAH').value === ""  && (akah_Tool.map.graphics.graphics[0].symbol != undefined) && (dijit.byId('akah_selectMonsoon').value !="1" && dijit.byId('akah_selectYear').value !="Select")) {
              new QueryTask(akah_villages_layer.url).execute(queryChart, function(akah_villageResponse){
                window.akah_searchResponse = akah_villageResponse.features[0];
                akah_Tool.akah_chartGenerte()
              });
          }
          else{
            domAttr.set("akahLulc_Chart","innerHTML","");
            domAttr.set("lulc_legend","innerHTML","");
            // domAttr.set("ndvi_legend","innerHTML","");
            // domAttr.set("akahNdvi_Chart","innerHTML","");
          }
      })))


       //for NDWI
       var selectFromMonth_NDWI = dijit.byId('akah_fromselectMonthNDWI')
       window.selectFromMonth_NDWI = selectFromMonth_NDWI
       var selectFromYear_NDWI = dijit.byId('akah_fromselectYearNDWI')
       window.selectFromYear_NDWI = selectFromYear_NDWI
       var selectToMonth_NDWI = dijit.byId('akah_toselectMonthNDWI')
       window.selectToMonth_NDWI = selectToMonth_NDWI
       var selectToYear_NDWI = dijit.byId('akah_toselectYearNDWI')
       window.selectToYear_NDWI = selectToYear_NDWI
       var akah_NDWIchartFromYears = ['Year','2016','2017','2018','2019','2020','2021'];window.akah_NDWIchartFromYears = akah_NDWIchartFromYears;
       var akah_NDWIchartFromMonths = {'0': "Month", '1': "01", '2': "02", '3':"03",'4':"04",'5':"05",'6':"06",'7':"07",'8':"08",'9':"09",'10':"10",'11':"11",'12':"12"};window.akah_NDWIchartFromMonths = akah_NDWIchartFromMonths;
       var akah_NDWIchartToYears = ['Year','2016','2017','2018','2019','2020','2021'];window.akah_NDWIchartToYears = akah_NDWIchartToYears;
       var akah_NDWIchartToMonths = {'0': "Month", '1': "01", '2': "02", '3':"03",'4':"04",'5':"05",'6':"06",'7':"07",'8':"08",'9':"09",'10':"10",'11':"11",'12':"12"};window.akah_NDWIchartToMonths = akah_NDWIchartToMonths;
       var akahFromYearNDWI_map = akah_NDWIchartFromYears.map(function(record){//from year
               return dojo.create("option", {
                 label: record,
                 value: record
            })
       })
       selectFromYear_NDWI.options.length = 0
       selectFromYear_NDWI.addOption(akahFromYearNDWI_map)
       selectFromYear_NDWI.attr('value', akah_NDWIchartFromYears[0])
       var akahToYearNDWI_map = akah_NDWIchartToYears.map(function(record){//to year
         return dojo.create("option", {
           label: record,
           value: record
      })
       })
       selectToYear_NDWI.options.length = 0
       selectToYear_NDWI.addOption(akahToYearNDWI_map)
       selectToYear_NDWI.attr('value', akah_NDWIchartToYears[0])
       var akah_NDWIchartFromMonths = Object.entries(akah_NDWIchartFromMonths).map(function(record){//from month
         return dojo.create("option", {
           label: record[1],
           value: record[0]
         })
       })
       selectFromMonth_NDWI.options.length = 0
       selectFromMonth_NDWI.addOption(akah_NDWIchartFromMonths)
       selectFromMonth_NDWI.attr('value', Object.keys(akah_NDWIchartFromMonths)[0])
       var akah_NDWIchartToMonths = Object.entries(akah_NDWIchartToMonths).map(function(record){//from month
         return dojo.create("option", {
           label: record[1],
           value: record[0]
         })
       })
       selectToMonth_NDWI.options.length = 0
       selectToMonth_NDWI.addOption(akah_NDWIchartToMonths)
       selectToMonth_NDWI.attr('value', Object.keys(akah_NDWIchartToMonths)[0])
       this.own(on(selectFromYear_NDWI, 'change', lang.hitch(this, function(akah_ndwifromyear){
         window.akah_ndwifromyear = akah_ndwifromyear;
         this.akah_ndwifromyear = akah_ndwifromyear;
        this.validateToGenerateNDWIChart();
       })))
       this.own(on(selectFromMonth_NDWI, 'change', lang.hitch(this, function(akah_ndwifrommonth){
         window.akah_ndwifrommonth = akah_ndwifrommonth;
         this.akah_ndwifrommonth = akah_ndwifrommonth;
         this.validateToGenerateNDWIChart();
       })))
       this.own(on(selectToMonth_NDWI, 'change', lang.hitch(this, function(akah_ndwitomonth){
         window.akah_ndwitomonth = akah_ndwitomonth;
         this.akah_ndwitomonth = akah_ndwitomonth;
         this.validateToGenerateNDWIChart();
       })))
       this.own(on(selectToYear_NDWI, 'change', lang.hitch(this, function(akah_ndwitoyear){
         window.akah_ndwitoyear = akah_ndwitoyear;
         this.akah_ndwitoyear = akah_ndwitoyear;
         this.validateToGenerateNDWIChart();
       })))
       //end of NDWI
       //for ndvi
       var selectFromMonth_NDVI = dijit.byId('akah_fromselectMonthNDVI')
       window.selectFromMonth_NDVI = selectFromMonth_NDVI
       var selectFromYear_NDVI = dijit.byId('akah_fromselectYearNDVI')
       window.selectFromYear_NDVI = selectFromYear_NDVI
       var selectToMonth_NDVI = dijit.byId('akah_toselectMonthNDVI')
       window.selectToMonth_NDVI = selectToMonth_NDVI
       var selectToYear_NDVI = dijit.byId('akah_toselectYearNDVI')
       window.selectToYear_NDVI = selectToYear_NDVI
       var akah_NDVIchartFromYears = ['Year','2016','2017','2018','2019','2020','2021'];window.akah_NDVIchartFromYears = akah_NDVIchartFromYears;
       var akah_NDVIchartFromMonths = {'0': "Month", '1': "01", '2': "02", '3':"03",'4':"04",'5':"05",'6':"06",'7':"07",'8':"08",'9':"09",'10':"10",'11':"11",'12':"12"};window.akah_NDVIchartFromMonths = akah_NDVIchartFromMonths;
       var akah_NDVIchartToYears = ['Year','2016','2017','2018','2019','2020','2021'];window.akah_NDVIchartToYears = akah_NDVIchartToYears;
       var akah_NDVIchartToMonths = {'0': "Month", '1': "01", '2': "02", '3':"03",'4':"04",'5':"05",'6':"06",'7':"07",'8':"08",'9':"09",'10':"10",'11':"11",'12':"12"};window.akah_NDVIchartToMonths = akah_NDVIchartToMonths;
       var akahFromYearNDVI_map = akah_NDVIchartFromYears.map(function(record){//from year
               return dojo.create("option", {
                 label: record,
                 value: record
             })
       })
       selectFromYear_NDVI.options.length = 0
       selectFromYear_NDVI.addOption(akahFromYearNDVI_map)
       selectFromYear_NDVI.attr('value', akah_NDVIchartFromYears[0])
       var akahToYearNDVI_map = akah_NDVIchartToYears.map(function(record){//to year
         return dojo.create("option", {
           label: record,
           value: record
       })
       })
       selectToYear_NDVI.options.length = 0
       selectToYear_NDVI.addOption(akahToYearNDVI_map)
       selectToYear_NDVI.attr('value', akah_NDVIchartToYears[0])
       var akah_NDVIchartFromMonths = Object.entries(akah_NDVIchartFromMonths).map(function(record){//from month
         return dojo.create("option", {
           label: record[1],
           value: record[0]
         })
       })
       selectFromMonth_NDVI.options.length = 0
       selectFromMonth_NDVI.addOption(akah_NDVIchartFromMonths)
       selectFromMonth_NDVI.attr('value', Object.keys(akah_NDVIchartFromMonths)[0])
       var akah_NDVIchartToMonths = Object.entries(akah_NDVIchartToMonths).map(function(record){//from month
         return dojo.create("option", {
           label: record[1],
           value: record[0]
         })
       })
       selectToMonth_NDVI.options.length = 0
       selectToMonth_NDVI.addOption(akah_NDVIchartToMonths)
       selectToMonth_NDVI.attr('value', Object.keys(akah_NDVIchartToMonths)[0])
       this.own(on(selectFromYear_NDVI, 'change', lang.hitch(this, function(akah_ndvifromyear){
         window.akah_ndvifromyear = akah_ndvifromyear;
         this.akah_ndvifromyear = akah_ndvifromyear;
         this.validateToGenerateNDVIChart();
       })))
       this.own(on(selectFromMonth_NDVI, 'change', lang.hitch(this, function(akah_ndvifrommonth){
         window.akah_ndvifrommonth = akah_ndvifrommonth;
         this.akah_ndvifrommonth = akah_ndvifrommonth;
         this.validateToGenerateNDVIChart();
       })))
       this.own(on(selectToMonth_NDVI, 'change', lang.hitch(this, function(akah_ndvitomonth){
         window.akah_ndvitomonth = akah_ndvitomonth;
         this.akah_ndvitomonth = akah_ndvitomonth;
         this.validateToGenerateNDVIChart();
       })))
       this.own(on(selectToYear_NDVI, 'change', lang.hitch(this, function(akah_ndvitoyear){
         window.akah_ndvitoyear = akah_ndvitoyear;
         this.akah_ndvitoyear = akah_ndvitoyear;
         this.validateToGenerateNDVIChart();
       })))
     //end of ndvi

      var checkBox = new CheckBox({
        name: "checkBox",
        value: "agreed",
        checked: false,
        onChange: this.goto_village_boundary
      }, "akahvillage_check").startup();


      var dugWellcheckBox = new CheckBox({
        name: "checkBox",
        value: "agreed",
        checked: false,
        onChange: function(evt){
          if (evt === true && dijit.byId('akah_vill')!='Select Village') {
            if(dijit.byId("akahBoreWell_check").checked){
              if(wellFiltering!=''){
                akah_main_layer.setDefinitionExpression("village like" + " " + "\'" + wellFiltering + "\'");
              }
              else{
                akah_main_layer.setDefinitionExpression("1!=1");
              }
            }
            else{
              if(wellFiltering!=''){
                akah_main_layer.setDefinitionExpression("village like" + " " + "\'" + wellFiltering + "\'"+ " " + "AND" + " " + "well_type LIKE 'well'");
              }
              else{
                akah_main_layer.setDefinitionExpression("1!=1");
              }
            }
          }
          else if (evt === false && dijit.byId('akah_vill')!='Select Village') {
            if(dijit.byId("akahBoreWell_check").checked){
              if(wellFiltering!=''){
                akah_main_layer.setDefinitionExpression("village like" + " " + "\'" + wellFiltering + "\'"+ " " + "AND" + " " + "well_type LIKE 'bore_well'");
              }
              else{
                akah_main_layer.setDefinitionExpression("1!=1");
              }
            }
            else{
              if(wellFiltering!=''){
              akah_main_layer.setDefinitionExpression("village like" + " " + "\'" + wellFiltering + "\'");
            }
            else{
              akah_main_layer.setDefinitionExpression("1!=1");
            }
            }
          }
          else{
            console.log('well depth not selected');
          }
        }
      }, "akahDugWell_check").startup();

      var boreWellcheckBox = new CheckBox({
        name: "checkBox",
        value: "agreed",
        checked: false,
        onChange: function(evt){
          if (evt === true && dijit.byId('akah_vill')!='Select Village') {
            if(dijit.byId("akahDugWell_check").checked){
              if(wellFiltering!=''){
                akah_main_layer.setDefinitionExpression("village like" + " " + "\'" + wellFiltering + "\'");
              }
              else{
                akah_main_layer.setDefinitionExpression("1!=1");
              }
            }
            else{
              if(wellFiltering!=''){
                akah_main_layer.setDefinitionExpression("village like" + " " + "\'" + wellFiltering + "\'"+ " " + "AND" + " " + "well_type LIKE 'bore_well'");
              }
              else{
                akah_main_layer.setDefinitionExpression("1!=1");
              }
            }
          }
          else if (evt === false && dijit.byId('akah_vill')!='Select Village') {
            if(dijit.byId("akahDugWell_check").checked){
              if(wellFiltering!=''){
                akah_main_layer.setDefinitionExpression("village like" + " " + "\'" + wellFiltering + "\'"+ " " + "AND" + " " + "well_type LIKE 'well'");
              }
              else{
                akah_main_layer.setDefinitionExpression("1!=1");
              }
            }
            else{
              if(wellFiltering!=''){
                akah_main_layer.setDefinitionExpression("village like" + " " + "\'" + wellFiltering + "\'");
              }
              else{
                akah_main_layer.setDefinitionExpression("1!=1");
              }
            }
          }
          else{
            console.log('well depth not selected');
          }
        }
      }, "akahBoreWell_check").startup();

      //search in akah tab2
      var searchAkah = new Search({
        map: this.map,
        sources: [],
        zoomScale: 5000000
      }, "searchVillageAKAH");
      window.searchAkah = searchAkah;
      searchAkah.on("load", function () {
      var sourcesAKAH = searchAkah.sources;
      sourcesAKAH.push({
        featureLayer: akah_villages_layer,
        placeholder: "Search Village",
        //  enableLabel: true,
        searchFields: ["village"],
        //  displayFields: "Lake_Name" && "Mandal",
        exactMatch: false,
        outFields: ["*"],
         suggestionTemplate: "${village}",
        highlightSymbol : "",
        maxSuggestions: 8,
        maxResults: 8,
        autoNavigate:true,
        autoSelect: true,
      });
      window.sourcesAKAH = sourcesAKAH;
      // searchHmda.set("value", response1_ftl.features[0].attributes.Lake_Name+', '+response1_ftl.features[0].attributes.Mandal);
      // dijit.byId('searchVillageAKAH').enableInfoWindow = false;
      searchAkah.set("sources", sourcesAKAH);
      });
      searchAkah.startup();
      on(searchAkah,'select-result', function(akahsearchResult_response) {
        vill_valakah.attr('value', dijit.byId('searchVillageAKAH').value)
          akah_Tool.map.graphics.clear();
          window.akahsearchResult_response = akahsearchResult_response;
          var akah_searchResponse = akahsearchResult_response.result.feature;window.akah_searchResponse = akah_searchResponse;
          var searchLayerResponse = akahsearchResult_response.source.featureLayer;window.searchLayerResponse = searchLayerResponse;
          var stateName = akah_searchResponse.attributes.state;
          var districtName = akah_searchResponse.attributes.district;
          var blockName = akah_searchResponse.attributes.block;
          (akah_searchResponse.attributes.village === null) ? (villageName = " "):(villageName = akah_searchResponse.attributes.village)
          domAttr.set('akahLocation_info','innerHTML',"<span><span class='akahHeadings'>State: </span><span class='akahNames'>"+stateName+"</span></span>&nbsp;&nbsp;<span><span class='akahHeadings'>District: </span><span class='akahNames'>"+districtName+"</span></span>&nbsp;&nbsp;"+
                      "<span><span class='akahHeadings'>Block: </span><span class='akahNames'>"+blockName+"</span></span>&nbsp;&nbsp;<br><span><span class='akahHeadings'>Village: </span><span class='akahNames'>"+villageName+"</span>");
          dojo.query('#akahLocation_info').style('display','block')
          if (tabsakah.getSelectedTitle() === "Data Analytics") {
              /*status bar value update*/
              document.getElementsByClassName('bar_akah-inner')[0].dataset.percent = "75%"
              document.getElementsByClassName('bar_akah-inner')[0].style.width = "75%"
              /*status bar value update*/
          }
          var searchLayerResponse = akahsearchResult_response.source.featureLayer;window.searchLayerResponse = searchLayerResponse;
          if (akah_Tool.akah_selYear != "Select" && akah_Tool.akah_selMonsoon != "select") {
              akah_Tool.akah_chartGenerte()
          }
          else{
            domAttr.set("akahLulc_Chart","innerHTML","");
            domAttr.set("lulc_legend","innerHTML","");
            // domAttr.set("ndvi_legend","innerHTML","");
            // domAttr.set("akahNdvi_Chart","innerHTML","");
            // domAttr.set('akahLocation_info','innerHTML','');
            // dojo.query('#akahLocation_info').style('display','none')
            // akah_villages_layer.setDefinitionExpression("1=1");
            // akah_villages_layer.setVisibility(false);
          }
      });

      on(searchAkah,'clear-search', function(e) {
        if(map){
          domAttr.set("akahLulc_Chart","innerHTML","");
          domAttr.set("lulc_legend","innerHTML","");
          // domAttr.set("ndvi_legend","innerHTML","");
          // domAttr.set("akahNdvi_Chart","innerHTML","");
          dijit.byId('searchVillageAKAH').set("value", "");
          domAttr.set('akahLocation_info','innerHTML','');
          dojo.query('#akahLocation_info').style('display','none')
          akah_Tool.map.setExtent(init_map_extent)
          akah_villages_layer.setDefinitionExpression("1=1");
          akah_villages_layer.setVisibility(false);

          if(this.map.graphics.graphics[0].attributes != undefined){
            this.map.graphics.clear();
          }
        }
      });

      on(dom.byId("akahClearGraphics_locationtab"), "click", function(){
        akah_Tool.clearGraphicsonMap();
        dijit.byId('searchVillageAKAH').set('value','');
      });
      var akahinfo1_tab = {title: "Summary",content: this.akah_tab_1};
      var akahinfo2_tab = {title: "Village Information",content: this.akah_tab_2};
      var akahinfo3_tab = {title: "Data Analytics",content: this.akah_tab_3};
      var akahinfo4_tab = {title: "Data Visualisation",content: this.akah_tab_4};

      tabsakah = new TabContainer3({
        tabs: [akahinfo1_tab, akahinfo4_tab, akahinfo3_tab, akahinfo2_tab]
      }, this.akah_container);

      (function(document) {
        var akahBars = [].slice.call(document.querySelectorAll('.bar_akah-inner'));
        akahBars.map(function(bar, index) {
          setTimeout(function() {
            bar.style.width = bar.dataset.percent;
          }, index * 1000);
        });
      })(document)

      var akah_rainfall_info = {
        title: "Rainfall",
        content: this.akah_rainfall_info
      };
      var akah_gwr_info = {
        title: "Block-wise GW Resources",
        content: this.akah_gwr_info
      };

      window.wells_container = new TabContainer3({
        tabs: [akah_rainfall_info, akah_gwr_info]
      }, this.akah_dv_info_container);

      on(wells_container.tabItems[0],"click",function(){
          akah_Tool.rainfallChartCreate();
      });
      on(wells_container.tabItems[1],"click",function(){
          akah_Tool.rainfallChartCreate();
      })
      on(tabsakah.tabItems[0], "click",function(){
        if (dijit.byId('block_id').value != 'Select Block' && dijit.byId('block_id').value != "") {
          document.getElementsByClassName('bar_akah-inner')[0].dataset.percent = "25%"
          document.getElementsByClassName('bar_akah-inner')[0].style.width = "25%"
        }
      })
      on(tabsakah.tabItems[1], "click",function(){
        if (dijit.byId('block_iddv').value != 'Select Block' && dijit.byId('block_iddv').value != "") {
          document.getElementsByClassName('bar_akah-inner')[0].dataset.percent = "50%"
          document.getElementsByClassName('bar_akah-inner')[0].style.width = "50%"
          akah_Tool.rainfallChartCreate();
        }
      })
      on(tabsakah.tabItems[2], "click",function(){
        if (dijit.byId('searchVillageAKAH').value != "") {
          document.getElementsByClassName('bar_akah-inner')[0].dataset.percent = "75%"
          document.getElementsByClassName('bar_akah-inner')[0].style.width = "75%"
        }
      })
      on(tabsakah.tabItems[3], "click",function(){
        if (dijit.byId('akah_vill').value != 'Select Village' && dijit.byId('akah_vill').value != "" &&  searchAkah.value != akahvillage) {
          akah_Tool.showAKAHResult();
          document.getElementsByClassName('bar_akah-inner')[0].dataset.percent = "90%"
          document.getElementsByClassName('bar_akah-inner')[0].style.width = "90%"
        }
      })

      var districts1=[];
      window.districts1=districts1;
      var blocks1=[];
      window.blocks1=blocks1;

      //goToPritWellChart
      var vill_array = [];
      window.vill_array = vill_array;


      var districts1dv=[];
      window.districts1dv=districts1dv;
      var blocks1dv=[];
      window.blocks1dv=blocks1dv;


      this.own(on(st_val, 'change', lang.hitch(this, function (evt) {
        dijit.byId("district_id").disabled = true;
        st_valdv.attr('value', evt);
        loc_st_val.attr('value', evt);
        akah_main_layer.setDefinitionExpression("1=1");
        var statename = evt;
        window.statename = statename;

        ds_val1.set('value', '');
        for (var i = 0; i<districts1.length ; i++) {
          ds_val1.removeOption(lang.clone(districts1[i]));
          ds_val1.store = null;
          ds_val1._setDisplay("")
        }

        if(evt != "Select State" && evt !=""){
          var query_dist1 = new Query();
          query_dist1.where = "state like '"+statename+"'"
          while (districts1.length > 0) {
            districts1.pop();
          }
          districts1.push("Select District");
          query_dist1.outFields = ["district"]
          query_dist1.returnGeometry = false
          query_dist1.returnDistinctValues = true
          query_dist1.orderByFields = ["district ASC"];

          //querying displacement service url and getting all districts data
          new QueryTask(akah_selectedwells_layer.url).execute(query_dist1, function retrieve(selecteddistrictresponse1) {
            window.selecteddistrictresponse1 = selecteddistrictresponse1;
            //console.log(selectedblockresponse);
            selecteddistrictresponse1.features.forEach(function (feature) {
              district_val = feature.attributes.district;
              // districts.push("Select District")
              districts1.push(district_val);
              var map_b = districts1.map(function (record) {
                return dojo.create("option", {
                  label: record,
                  value: record
                })
              })
              ds_val1.options.length = 0
              ds_val1.addOption("Select District")
              ds_val1.addOption(map_b)
              ds_val1.attr('value', districts1[0])
              dijit.byId("district_id").disabled = false;
            });
          });
        }
        // if(evt == "Select State"){
        //   dojo.query("#summary_div").style("display","block");
        //   dojo.query("#summary_gujarath").style("display","none");
        //   dojo.query("#summary_maharashtra").style("display","none");
        //   var startExtent = new Extent( 3958208.5105318567, 760284.970007574, 9973586.69772808, 4267827.323956809,
        //     new SpatialReference({ wkid:102100 }));
        //     this.map.setExtent(startExtent);
        //   }
        })
      ));

      //DV graph
      this.own(on(st_valdv, 'change', lang.hitch(this, function (evt) {
        dijit.byId("district_iddv").disabled = true;
        st_val.attr('value', evt);
        loc_st_val.attr('value', evt);
        //akah_main_layer.setDefinitionExpression("1=1");
        var statenamedv = evt;
        window.statenamedv = statenamedv;

        ds_val1dv.set('value', '');
        for (var i = 0; i<districts1dv.length ; i++) {
          ds_val1dv.removeOption(lang.clone(districts1dv[i]));
          ds_val1dv.store = null;
          ds_val1dv._setDisplay("")
        }

        if(evt != "Select State" && evt !=""){
          var query_dist1dv = new Query();
          query_dist1dv.where = "state like '"+statenamedv+"'"
          while (districts1dv.length > 0) {
            districts1dv.pop();
          }
          districts1dv.push("Select District");
          query_dist1dv.outFields = ["district"]
          query_dist1dv.returnGeometry = false
          query_dist1dv.returnDistinctValues = true
          query_dist1dv.orderByFields = ["district ASC"];

          //querying displacement service url and getting all districts data
          new QueryTask(akah_selectedwells_layer.url).execute(query_dist1dv, function retrieve(selecteddistrictresponse1) {
            window.districtresponsedv = selecteddistrictresponse1;
            //console.log(selectedblockresponse);
            selecteddistrictresponse1.features.forEach(function (feature) {
              district_valdv = feature.attributes.district;
              // districts.push("Select District")
              districts1dv.push(district_valdv);
              var map_bdv = districts1dv.map(function (record) {
                return dojo.create("option", {
                  label: record,
                  value: record
                })
              })
              ds_val1dv.options.length = 0
              ds_val1dv.addOption("Select District")
              ds_val1dv.addOption(map_bdv)
              ds_val1dv.attr('value', districts1dv[0])
              dijit.byId("district_iddv").disabled = false;
            });
          });
        }
        // if(evt == "Select State"){
        //   dojo.query("#summary_div").style("display","block");
        //   dojo.query("#summary_gujarath").style("display","none");
        //   dojo.query("#summary_maharashtra").style("display","none");
        //   var startExtent = new Extent( 3958208.5105318567, 760284.970007574, 9973586.69772808, 4267827.323956809,
        //     new SpatialReference({ wkid:102100 }));
        //     this.map.setExtent(startExtent);
        //   }
        })
      ));

      this.own(on(ds_val1, 'change', lang.hitch(this, function (evt) {
        dijit.byId("block_id").disabled = true;
          distValueakah.attr('value', evt);
          //akah_main_layer.setDefinitionExpression("1=1");
          ds_val1dv.attr('value', evt);
          var districtname=evt;
          window.districtname=districtname;
          for (var i = 0; i<blocks1.length ; i++) {
            st_val1.removeOption(lang.clone(blocks1[i]));
            st_val1.store = null;
            st_val1._setDisplay("");
          }
          dojo.query("#summary_gujarath").style("display","none");

          //st_val1.set('value', '');

          if(districtname!="Select District"){
          var query_dist2 = new Query();
          query_dist2.where = "state like '"+statename+"' and district like '"+districtname+"'";
          while (blocks1.length > 0) {
            blocks1.pop();
          }
          blocks1.push("Select Block");
          query_dist2.outFields = ["block"]
          query_dist2.returnGeometry = false
          query_dist2.returnDistinctValues = true
          query_dist2.orderByFields = ["block ASC"];

          //querying displacement service url and getting all districts data
          new QueryTask(akah_selectedwells_layer.url).execute(query_dist2, function retrieve(selectedblockresponse1) {
            window.selectedblockresponse1 = selectedblockresponse1;
            //console.log(selectedblockresponse);
            selectedblockresponse1.features.forEach(function (feature) {
              block_val = feature.attributes.block;
              // districts.push("Select District")
              blocks1.push(block_val);
              var map_b = blocks1.map(function (record) {
                return dojo.create("option", {
                  label: record,
                  value: record
                })
              })
              st_val1.options.length = 0
              st_val1.addOption("Select Block")
              st_val1.addOption(map_b)
              st_val1.attr('value', blocks1[0])
              dijit.byId("block_id").disabled = false;
            });
          });
        }
      })));

      // for DV
      this.own(on(ds_val1dv, 'change', lang.hitch(this, function (evt) {
        dijit.byId("block_iddv").disabled = true;
        ds_val1.attr('value', evt);
        distValueakah.attr('value', evt);
          //akah_main_layer.setDefinitionExpression("1=1");
          var districtnamedv=evt;
          window.districtnamedv=districtnamedv;
          for (var i = 0; i<blocks1dv.length ; i++) {
            st_val1dv.removeOption(lang.clone(blocks1dv[i]));
            st_val1dv.store = null;
            st_val1dv._setDisplay("");
          }
          dojo.query("#dv_info").style("display","none");
          dojo.query("#gwr_info").style("display","none");
          dojo.query('#rainfall_graph').innerHTML('');
          //dojo.query('#gwr_graph').innerHTML('');
          domAttr.set("gwr_category","innerHTML",'');
          domAttr.set("gwr_stage","innerHTML",'');
          dojo.query('#rainfall_legend').style('display','none');
          domAttr.set('gwr_graph1', 'innerHTML', '')
          domAttr.set('gwr_graph2', 'innerHTML', '')
          domAttr.set('barAndStackedBarChartDiv', 'innerHTML', '')
          dojo.query('#barAndStackedBarChartDivlegend').style('display','none');
          dojo.query('#gwr_graph1_legend').style('display','none');
          dojo.query('#gwr_graph2_legend').style('display','none');
          dojo.query('#gwr_graph2_heading').style('display','none');
          window.a =[];
          window.actual_rain = [];
          window.norm_rain = [];
          window.rain_dev = [];
          window.rain_months = [];
          window.rain_tooltip_arr_1 = [];
          //dojo.query("#summary_gujarath").style("display","none");

          //st_val1.set('value', '');

          if(districtnamedv!="Select District"){
          var query_dist2dv = new Query();
          query_dist2dv.where = "state like '"+statenamedv+"' and district like '"+districtnamedv+"'";
          while (blocks1dv.length > 0) {
            blocks1dv.pop();
          }
          blocks1dv.push("Select Block");
          query_dist2dv.outFields = ["block"]
          query_dist2dv.returnGeometry = false
          query_dist2dv.returnDistinctValues = true
          query_dist2dv.orderByFields = ["block ASC"];

          //querying displacement service url and getting all districts data
          new QueryTask(akah_selectedwells_layer.url).execute(query_dist2dv, function retrieve(selectedblockresponse1) {
            window.dvblockresponse1 = selectedblockresponse1;
            //console.log(selectedblockresponse);
            selectedblockresponse1.features.forEach(function (feature) {
              block_valdv = feature.attributes.block;
              // districts.push("Select District")
              blocks1dv.push(block_valdv);
              var map_bdv = blocks1dv.map(function (record) {
                return dojo.create("option", {
                  label: record,
                  value: record
                })
              })
              st_val1dv.options.length = 0
              st_val1dv.addOption("Select Block")
              st_val1dv.addOption(map_bdv)
              st_val1dv.attr('value', blocks1dv[0])
              dijit.byId("block_iddv").disabled = false;
            });
          });
        }
      })));

      //for DV block level
      //for block dropdown in data visulaization
      this.own(on(st_val1dv, 'change', lang.hitch(this, function (evt) {
        //akah_main_layer.setDefinitionExpression("1=1");
        st_val1.attr('value', evt);
        blockValueakah.attr('value', evt);
        var blocknamedv = evt;
        window.blocknamedv = blocknamedv;
            if(evt != "Select Block" && evt != ""){
              //alert('block name exist')
              dojo.query('#gwr1_load_gif').style('display','block');
              dojo.query('#gwr2_load_gif').style('display','block');
              dojo.query('#rf_load_gif').style('display','block');
              window.a =[];
              window.actual_rain = [];
              window.norm_rain = [];
              window.rain_dev = [];
              window.rain_months = [];
              window.rain_tooltip_arr_1 = [];
              dojo.query('#gwr_graph2_heading').style('display','none');
              dojo.query("#dv_info").style("display","block");
              domAttr.set("dv_state","innerHTML",statenamedv);
              domAttr.set("dv_district","innerHTML",districtnamedv);
              domAttr.set("dv_block","innerHTML",blocknamedv);

              document.getElementsByClassName('bar_akah-inner')[0].dataset.percent = "25%"
              document.getElementsByClassName('bar_akah-inner')[0].style.width = "25%"

              var rainfall_values=['jan_2019_actual__mm','jan_2019_normal__mm','jan_2019_deviation__mm','feb_2019_actual__mm','feb_2019_normal__mm','feb_2019_deviation__mm','mar_2019_actual__mm','mar_2019_normal__mm','mar_2019_deviation__mm','apr_2019_actual__mm','apr_2019_normal__mm','apr_2019_deviation__mm','may_2019_actual__mm','may_2019_normal__mm','may_2019_deviation__mm','jun_2019_actual__mm','jun_2019_normal__mm','jun_2019_deviation__mm','jul_2019_actual__mm','jul_2019_normal__mm','jul_2019_deviation__mm','aug_2019_actual__mm','aug_2019_normal__mm','aug_2019_deviation__mm','sep_2019_actual__mm','sep_2019_normal__mm','sep_2019_deviation__mm','oct_2019_actual__mm','oct_2019_normal__mm','oct_2019_deviation__mm','nov_2019_actual__mm','nov_2019_normal__mm','nov_2019_deviation__mm','dec_2019_Actual__mm','dec_2019_normal__mm','dec_2019_deviation__mm','jan_2020_actual__mm','jan_2020_normal__mm','jan_2020_deviation__mm']
              var query_summdv = new Query();
              query_summdv.where ="state like" +" "+"\'"+ statenamedv +"\'"  + " " + "AND" + " " + "district like" +" "+"\'"+ districtnamedv +"\'"+ " " + "AND" + " " + "Block like" + " " + "\'" + blocknamedv + "\'";
              query_summdv.outFields = ["*"]
              query_summdv.returnGeometry = true

              new QueryTask(akah_block_layer.url).execute(query_summdv, function retrieve(summ_selected_records1) {
              window.akahRainfallResponse = summ_selected_records1.features[0];
              dojo.query("#gwr_info").style("display","block");
              akahRainfallResponse.attributes["text"]!= null ? domAttr.set("gwr_category","innerHTML",akahRainfallResponse.attributes["text"]) : domAttr.set("gwr_category","innerHTML","");
              akahRainfallResponse.attributes["gwextactio"] !=null ? domAttr.set("gwr_stage","innerHTML",akahRainfallResponse.attributes["gwextactio"].toFixed(2)+'%') :domAttr.set("gwr_stage","innerHTML","");
              akah_Tool.map.setExtent(akahRainfallResponse.geometry.getExtent().expand(1.5), true);
              /*Rainfall code beginning for generating Rainfall Charts*/
              var i=1;
              rainfall_values.forEach(function(evt, index){
                  var fieldname = evt;
                  a.push(Number(akahRainfallResponse.attributes[fieldname]));//window.a = a;
                  if (fieldname.includes('_actual')) {
                    rain_tooltip_arr_1.push({text: fieldname.slice(0,8).toUpperCase().replace('_', ' '), value: (akahRainfallResponse.attributes[fieldname])*(-1)});//window.rain_tooltip_arr_1 = rain_tooltip_arr_1;
                    actual_rain.push(Number(akahRainfallResponse.attributes[fieldname]));//window.actual_rain = actual_rain;
                  }
                  else if (fieldname.includes('_normal')) {
                    rain_months.push({text: fieldname.slice(0,8).toUpperCase().replace('_', ' '), value: i});//window.rain_months = rain_months;
                    norm_rain.push(Number(akahRainfallResponse.attributes[fieldname]));//window.norm_rain = norm_rain;
                    i++;
                  }
                  else if (fieldname.includes('_deviation')) {
                    rain_dev.push(Number(akahRainfallResponse.attributes[fieldname])); //window.rain_dev = rain_dev;
                  }
              });
              /*call the function to prepare rainfall chart*/
              if(districtnamedv === "Aurangabad"){
                actual_rain=[605.25,592.06,714.71,686.51,438.01,826.43,862.41];
                rain_dev=[-155.65,-168.84,-46.19,-74.39,-322.89,65.53,101.51]
                norm_rain=[760.9,760.9,760.9,760.9,760.9,760.9,760.9];// var rain_dev2=
                rain_tooltip_arr_1 =  rain_months =  [{text:"2014",value:1},{text:"2015",value:2},{text:"2016",value:3},{text:"2017",value:4},{text:"2018",value:5},{text:"2019",value:6},{text:"2020",value:7}]
                // rain_tooltip_arr_1 =  [{text:"2014",value:actual_rain[0]},{text:"2015",value:actual_rain[1]},{text:"2016",value:actual_rain[2]},{text:"2017",value:actual_rain[3]},{text:"2018",value:actual_rain[4]},{text:"2019",value:actual_rain[5]},{text:"2020",value:actual_rain[6]}]
                // rain_months =  [{text:"2014",value:actual_rain[0]},{text:"2015",value:actual_rain[1]},{text:"2016",value:actual_rain[2]},{text:"2017",value:actual_rain[3]},{text:"2018",value:actual_rain[4]},{text:"2019",value:actual_rain[5]},{text:"2020",value:actual_rain[6]}]
              }
              dojo.query('#gwr1_load_gif').style('display','none');
              dojo.query('#gwr2_load_gif').style('display','none');
              dojo.query('#rf_load_gif').style('display','none');

              akah_Tool.rainfallChartCreate()
            });

            }
            else{
              //alert('block else')
              dojo.query("#dv_info").style("display","none");
              dojo.query("#gwr_info").style("display","none");
              dojo.query('#rainfall_graph').innerHTML('');
              //dojo.query('#gwr_graph').innerHTML('');
              domAttr.set("gwr_category","innerHTML",'');
              domAttr.set("gwr_stage","innerHTML",'');
              dojo.query('#rainfall_legend').style('display','none');
              domAttr.set('barAndStackedBarChartDiv', 'innerHTML', '')
              domAttr.set('gwr_graph2', 'innerHTML', '')
              dojo.query('#gwr_graph1_legend').style('display','none');
              dojo.query('#barAndStackedBarChartDivlegend').style('display','none');
              dojo.query('#gwr_graph2_heading').style('display','none');
              window.a =[];
              window.actual_rain = [];
              window.norm_rain = [];
              window.rain_dev = [];
              window.rain_months = [];
              window.rain_tooltip_arr_1 = [];
            }
        })
      ));

      //for block dropdown in summary
      this.own(on(st_val1, 'change', lang.hitch(this, function (evt) {
        st_val1dv.attr('value', evt);
        blockValueakah.attr('value', evt);
        //akah_main_layer.setDefinitionExpression("1=1");
        var blockname = evt;
        window.blockname = blockname;
        if(evt != "Select Block" && evt != ""){
          var sum_var=["sum_vilage_count","sum_wellcount","sum_pop","sum_wq","sum_aqui","sum_ws","sum_premon","sum_postmon"];
          sum_var.forEach(function(j){domAttr.set(j,"innerHTML",'<img src="'+image_path+'" class="load_image" alt="Loading..">');});
          var query_summ = new Query();
          query_summ.where ="state like" +" "+"\'"+ statename +"\'"  + " " + "AND" + " " + "district like" +" "+"\'"+ districtname +"\'"+ " " + "AND" + " " + "block like" + " " + "\'" + blockname + "\'";
          query_summ.outFields = ["*"]
          query_summ.returnGeometry = true
          new QueryTask(akah_selectedwells_layer.url).execute(query_summ, function retrieve(summ_selected_records1) {
            window.summ_selected_records = summ_selected_records1;
            var villagenames=[];
            summ_selected_records1.features.forEach(function (feature) {
              if(feature.attributes.village_name!=null){villagenames.push(feature.attributes.village_name)}
            });


            domAttr.set(sum_var[0],"innerHTML",'<b>'+(new Set(villagenames).size)+'</b>');
            domAttr.set(sum_var[1],"innerHTML",'<b>'+summ_selected_records1.features.length+'</b>');
            //domAttr.set(sum_var[3],"innerHTML",'<b>'+"Suitable"+'</b>');
            var mp=new esri.geometry.Multipoint(summ_selected_records1.features[0].geometry.spatialReference);
            summ_selected_records1.features.forEach(function(f){mp.addPoint(f.geometry)});

            var query_summ1= new Query();
            query_summ1.outFields = ["Total_Population_of_Village"];//, "total_male_population_of_villag", "total_female_population_of_vill"];
            query_summ1.returnGeometry = true;
            query_summ1.geometry=mp;
            window.vilname=new QueryTask(akah_villages_layer.url).execute(query_summ1, function retrieve(summ){
              var t=0;
              var ee=new esri.geometry.Polygon(summ.features[0].geometry.spatialReference);
              window.ee=ee;
              summ.features.forEach(function(f){
              ee.addRing(f.geometry.rings[0]);
              t=t+f.attributes["Total_Population_of_Village"];
              });
            if(t==0){
              domAttr.set(sum_var[2],"innerHTML",'<b>'+'No Data'+'</b>');
            }
            else{
            domAttr.set(sum_var[2],"innerHTML",'<b>'+t+'</b>');
          }

          var query_summ12= new Query();
          query_summ12.outFields=["*"];
          query_summ12.returnGeometry = true;
          query_summ12.where="Block like '"+blockname+"'";
          window.block_result=new QueryTask(akah_block_layer.url).execute(query_summ12, function retrieve(summ1){
            query_summ12.where="1=1";
            query_summ12.returnGeometry = false;
            if(summ1.features.length!=0){
            query_summ12.geometry=summ1.features[0].geometry;
            window.gwq=new QueryTask(akah_gwq.url).execute(query_summ12, function retrieve(summ){
              if(summ.features.length>0){
                var wqpar=["ph", "ec", "carbonate", "bicarbonate", "chloride", "nitrate", "sulphate", "fluoride", "tot_alkalinity", "ca", "mg", "th", "na", "k"];
                window.wqpar_rep_names=["pH","Electrical Conductivity","Carbonate","Bicarbonate","Chloride","Nitrate","Sulphate","Fluoride","Alkalinity","Calcium","Magnesium","Total Hardness","Sodium","Potassium"];
                var wqlimits=[8.5,2000,75,350,1000,45,400,1.5,600,200,100,600,2000,20]; //6.5 base limit of pH
                //var wqlimits=[8.5,10000,10000,10000,1000,45,400,1.5,600,200,100,600,10000,10000]; //6.5 base limit of pH
                var wqjson={};
                window.cgwb_wq=wqjson
                summ.features.forEach(function (feature) {
                  wqpar.forEach(function(f){
                    if(wqjson[f] === undefined){
                      wqjson[f]=[];
                    }
                    wqjson[f].push(feature.attributes[f]);
                  });
                });

                var wqresults=[];
                for(var i=0;i<wqpar.length;i++){
                  var res=[];
                  if(i==0){
                    wqjson[wqpar[i]].forEach(function(p){
                      if(p!=null){
                        if(parseFloat(p)>=6.5){
                          res.push('N');
                        }
                        else{
                          res.push('Y');
                        }
                      }
                    });
                  }

                  wqjson[wqpar[i]].forEach(function(p){
                    if(p!=null){
                      if(parseFloat(p)<=wqlimits[i]){
                        res.push('N');
                      }
                      else{
                        res.push('Y');
                      }
                    }
                  });
                  if(res.includes('Y')){
                  wqresults.push(wqpar[i]);
                }
                }
                window.wqres=wqresults;
                if(wqresults.length>0){
                  var rep1="Unsuitable - "
                  wqresults.forEach(function(v){
                    rep1=rep1+wqpar_rep_names[wqpar.indexOf(v)]+', ';
                  });
                  rep1=rep1.slice(0,rep1.length-2);
                  domAttr.set(sum_var[3],"innerHTML",'<b>'+rep1+'</b>');

                }
                else{
                  domAttr.set(sum_var[3],"innerHTML",'<b>'+"Suitable"+'</b>');
                }
              }
              else{
                domAttr.set(sum_var[3],"innerHTML",'<b>'+"No Data"+'</b>');
              }
            });

            //query_summ12.geometry=sum1.features[0].geometry
            query_summ12.outFields=["may_2014","may_2015","may_2016","may_2017","may_2018","may_2019","nov_2014","nov_2015","nov_2016","nov_2017","nov_2018","nov_2019"];
            new QueryTask(gwm_station_layer.url).execute(query_summ12, function retrieve(summ){
              window.summ_monsoon=summ;
              if(summ.features.length>0){
                var pre=[];
                var pst=[];
                summ.features.forEach(function(f){
                  ["2014","2015","2016","2017","2018","2019"].forEach(function(i){
                  if(f.attributes["may_"+i]!=null){pre.push(f.attributes["may_"+i].toFixed(2));}
                  if(f.attributes["nov_"+i]!=null){pst.push(f.attributes["nov_"+i].toFixed(2));}
                });
              });
              console.log(pre);
              console.log(pst)
              if(pre.length!=0){
                var min_pre=Math.min(...pre);
                var max_pre=Math.max(...pre);
                if(min_pre!=max_pre){domAttr.set(sum_var[6],"innerHTML",'<b>'+min_pre+" - "+max_pre+" m"+'</b>');}
                else{domAttr.set(sum_var[6],"innerHTML",'<b>'+min_pre+" m"+'</b>');}
              }
              else{domAttr.set(sum_var[6],"innerHTML",'<b>'+"No Data"+'</b>');}

              if(pst.length!=0){
                var min_pst=Math.min(...pst);
                var max_pst=Math.max(...pst);
                if(min_pst!=max_pst){domAttr.set(sum_var[7],"innerHTML",'<b>'+min_pst+" - "+max_pst+" m"+'</b>');}
                else{domAttr.set(sum_var[7],"innerHTML",'<b>'+min_pst+" m"+'</b>');}
              }
              else{domAttr.set(sum_var[7],"innerHTML",'<b>'+"No Data"+'</b>');}

            }

              else{
                domAttr.set(sum_var[6],"innerHTML",'<b>'+"No Data"+'</b>');
                domAttr.set(sum_var[7],"innerHTML",'<b>'+"No Data"+'</b>');
              }
            });

            }
            else{
              domAttr.set(sum_var[3],"innerHTML",'<b>'+"No Data"+'</b>');
            }

          });


            query_summ1.outFields=["AQUIFER"];
            query_summ1.geometry=ee;
            query_summ1.where="1=1"
            //console.log(query_summ1);
            window.aqui=new QueryTask(akah_aqui.url).execute(query_summ1, function retrieve(summ){
              if(summ.features.length>0){
                domAttr.set(sum_var[4],"innerHTML",'<b>'+summ.features[0].attributes["aquifer"]+'</b>');
              }
              else{
                domAttr.set(sum_var[4],"innerHTML",'<b>'+"No Data"+'</b>');
              }
            });
            query_summ1.outFields=["BASIN"];
            //console.log(query_summ1);
            window.ws= new QueryTask(akah_watershed.url).execute(query_summ1, function retrieve(summ){
              if(summ.features.length>0){
                domAttr.set(sum_var[5],"innerHTML",'<b>'+summ.features[0].attributes["basin"]+'</b>');
              }
              else{
                domAttr.set(sum_var[5],"innerHTML",'<b>'+"No Data"+'</b>');
              }
            });

            akah_Tool.map.setExtent(ee.getExtent().expand(1.5), true);
            });
          });

            domAttr.set("guj_state","innerHTML",statename);
            domAttr.set("guj_district","innerHTML",districtname);
            domAttr.set("guj_block","innerHTML",blockname);
            // dojo.query("#summary_div").style("display","none");
            dojo.query("#summary_gujarath").style("display","block");
            //dojo.query("#summary_maharashtra").style("display","block");
            akah_states_layer.setDefinitionExpression("state like '"+statename+"'");
            akah_dist_layer.setDefinitionExpression("state like '"+statename+"' and "+"district like '"+districtname+"'");
            akah_block_layer.setDefinitionExpression("state like '"+statename+"' and "+"district like '"+districtname+"' and "+"Block like '"+blockname+"'")
          }
            else{  //(evt == "Select Block")
                  //dojo.query("#summary_div").style("display","block");
                  dojo.query("#summary_gujarath").style("display","none");
                  //dojo.query("#summary_maharashtra").style("display","none");
                  // var startExtent = new Extent( 3958208.5105318567, 760284.970007574, 9973586.69772808, 4267827.323956809,
                  //   new SpatialReference({ wkid:102100 }));
                  //   this.map.setExtent(startExtent);
                    // akah_states_layer.setDefinitionExpression("1=1");
                    // akah_dist_layer.setDefinitionExpression("1=1");
                    // akah_block_layer.setDefinitionExpression("1=1")
                }
        })
      ));

      var queryChart = new Query()
      queryChart.returnGeometry = true
      queryChart.outFields = ["*"]
      queryChart.where = "1=1"
      window.queryChart = queryChart;

      //initialize dialog box
      wqDialog = new Dialog({title: "Water Quality Status",content:'',style: "width: 300px;left: 500px;top: 260px;"});
      maxDialog_ndwi = new Dialog({title: "Maximum ",content:'',style: "width: 300px"});
      meanDialog_ndwi = new Dialog({title: "Mean",content:'',style: "width: 300px"});
      minDialog_ndwi = new Dialog({title: "Minimum",content:'',style: "width: 300px"});
      stdDialog_ndwi = new Dialog({title: "Standard Deviation",content:'',style: "width: 300px"});
      maxDialog_ndvi = new Dialog({title: "Maximum ",content:'',style: "width: 300px"});
      meanDialog_ndvi = new Dialog({title: "Mean",content:'',style: "width: 300px"});
      minDialog_ndvi = new Dialog({title: "Minimum",content:'',style: "width: 300px"});
      stdDialog_ndvi = new Dialog({title: "Standard Deviation",content:'',style: "width: 300px"});
    },

    gcd_two_numbers: function (x, y) {
            if ((typeof x !== 'number') || (typeof y !== 'number'))
              return false;
            x = Math.abs(x);
            y = Math.abs(y);
            while(y) {
              var t = y;
              y = x % y;
              x = t;
            }
            return x;
    },

    selectByLocation$akah: function(){
        akah_DrawToolbar = new Draw(akah_Tool.map);
        window.akah_DrawToolbar = akah_DrawToolbar;
        dojo.query(".tool_akah").on("click", function(evt){
          if(akah_DrawToolbar){
            akah_Tool.map.graphics.clear();
            akah_DrawToolbar.activate(evt.target.id);
          }
        });
        akah_DrawToolbar.on("draw-complete", function(akahDraw_Evt){
            akah_DrawToolbar.deactivate();
            akah_Tool.map.graphics.clear()
            window.akahDraw_Evt = akahDraw_Evt;
            if(akahDraw_Evt.geometry.type != "point"){
              akah_Tool.map.setExtent(akahDraw_Evt.geometry.getExtent().expand(1.2))
            }
            var geometry = akahDraw_Evt.geometry, symbol;
            switch (geometry.type) {
               case "point":
                 symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,0,0]), 1), new Color([0,255,0,0.25]));
                 break;
               case "polyline":
                 symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,0,0]), 1);
                 break;
               case "polygon":
                 symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NONE, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255,0,0]), 2), new Color([255,255,0,0.25]));
                 break;
               default:
                 symbol = new SimpleFillSymbol();
                 break;
            }
            var akahDraw_Graphic = new Graphic(geometry, symbol);
            akah_Tool.map.graphics.add(akahDraw_Graphic)
            queryChart.geometry = akahDraw_Evt.geometry
            new QueryTask(akah_villages_layer.url).execute(queryChart, function(akah_villageResponse){
              akah_searchResponse = akah_villageResponse.features[0];
              window.akah_searchResponse = akah_searchResponse;
              dojo.query('#akahLocation_info').style('display','block')
              var stateName = akah_searchResponse.attributes.state;window.stateName = stateName;
              var districtName = akah_searchResponse.attributes.district;window.districtName = districtName;
              var blockName = akah_searchResponse.attributes.block;window.blockName = blockName;
              akah_searchResponse.attributes.village === null ? (villageName = " "):(villageName = akah_searchResponse.attributes.village)
              dijit.byId('searchVillageAKAH').set("value", akah_searchResponse.attributes.village);
              akah_Tool.getSearchResponseOnDraw("from draw",queryChart);
            });
        });
    },

    getSearchResponseOnDraw: function(param, queryChart){
        dojo.query('#akahLocation_info').style('display','block')
        /*status bar value update*/
        document.getElementsByClassName('bar_akah-inner')[0].dataset.percent = "75%"
        document.getElementsByClassName('bar_akah-inner')[0].style.width = "75%"
        /*status bar value update*/
        if(param == "from draw"){
              domAttr.set('akahLocation_info','innerHTML',"<span><span class='akahHeadings'>State: </span><span class='akahNames'>"+stateName+"</span></span>&nbsp;&nbsp;<span><span class='akahHeadings'>District: </span><span class='akahNames'>"+districtName+"</span></span>&nbsp;&nbsp;"+
              "<span><span class='akahHeadings'>Block: </span><span class='akahNames'>"+blockName+"</span></span>&nbsp;&nbsp;<br><span><span class='akahHeadings'>Village: </span><span class='akahNames'>"+villageName+"</span>");
        }
        else{
              domAttr.set('akahLocation_info','innerHTML',"<span><span class='akahHeadings'>State: </span><span class='akahNames'>"+akahstate+"</span></span>&nbsp;&nbsp;<span><span class='akahHeadings'>District: </span><span class='akahNames'>"+akahdistrict+"</span></span>&nbsp;&nbsp;"+
              "<span><span class='akahHeadings'>Block: </span><span class='akahNames'>"+akahblock+"</span></span>&nbsp;&nbsp;<br><span><span class='akahHeadings'>Village: </span><span class='akahNames'>"+akahvillage+"</span>");
            // if(akah_searchResponse == null || akah_searchResponse == undefined)
            // {
            //     new QueryTask(akah_villages_layer.url).execute(queryChart, function(akah_villageResponse){
            //       akah_searchResponse = akah_villageResponse.features[0];
            //       window.akah_searchResponse = akah_searchResponse;
            //     });  
            // }
          }
        if ((akah_Tool.akah_selYear != "Select" && akah_Tool.akah_selMonsoon != "select")) {
          akah_Tool.akah_chartGenerte()
        }   else{
          domAttr.set("akahLulc_Chart","innerHTML","");
          domAttr.set("lulc_legend","innerHTML","");
          // domAttr.set("ndvi_legend","innerHTML","");
          // domAttr.set("akahNdvi_Chart","innerHTML","");
        }
        if((akah_ndwifrommonth != "Month" && akah_ndwifromyear !="Year" && akah_ndwitoyear !="Year" && akah_ndwitomonth != "Month")){
          akah_Tool.akah_chartGenerateNDWI();
        }
        if((akah_ndvifrommonth != "Month" && akah_ndvifromyear !="Year" && akah_ndvitoyear !="Year" && akah_ndvitomonth != "Month")){
          akah_Tool.akah_chartGenerateNDVI();
        }
    },

    capitalize: function (input) {
        var words = input.split(' ');
        var CapitalizedWords = [];
        words.forEach(element => {
            if (element.length != 0) {
              CapitalizedWords.push(element[0].toUpperCase() + element.slice(1, element.length));
            }
        });
        return CapitalizedWords.join(' ');
    },

    rainfallChartCreate: function(){
      if(typeof(rain_months)!="undefined"){
        if(rain_months.length>0){
          domAttr.set('rainfall_graph', 'innerHTML', '')
          domAttr.set('gwr_graph1', 'innerHTML', '')
          domAttr.set('gwr_graph2', 'innerHTML', '')

          rain_chart = new Chart("rainfall_graph");
          // Set the theme
          rain_chart.setTheme(theme);
          // Add the only/default plot
          rain_chart.addPlot("default", {
              type: LinesPlot,
              // hAxis: "x",
              // vAxis: "y",
              markerSize: 1,
              markers: true,
              tension: "S",
              rotation: 180
          });
          // gwl = gwl.reverse();
          var max_value = (parseInt(Math.max.apply(null, actual_rain)/100)+1)*100
          // var min_value = (parseInt(Math.min.apply(null, actual_rain)/100)-1)*100
          rain_chart.addAxis("x", { fixLower: "major", fixUpper: "major", natural: false, font: "normal normal normal 12px Arial", fontColor: "black", vertical: false, title: "YEAR", titleFontColor: "black", labels: rain_months, rotation: 90, titleOrientation: "away", majorLabels: true,minorTicks:false,majorTicks:true,majorTickStep:1});
          rain_chart.addAxis("y", { min: 0, max: max_value, vertical: true, fixLower: "minor", font: "normal normal normal 7pt Arial", fontColor: "black", fixUpper: "minor", title: "Rainfall(in mm)", titleFontColor: "black",minorTicks:false});
          // gwl.setTransform(chart.rotategAt(rotate, x,y));Math.max.apply(null, a)
          rain_chart.addSeries("Actual Rainfall", actual_rain); //min: 0, max: Math.max.apply(null, a),
          rain_chart.addSeries("Normal Rainfall", norm_rain);
          // rain_chart.addSeries("Deviation", rain_dev);

          var tip = new Tooltip(rain_chart,"default", {
                 text: function(o){
                    return rain_tooltip_arr_1[o.x-1].text + ":"+o.y;
                    // if (o.y == tooltip_arr[o.x-1].value) {
                    //   return tooltip_arr[o.x-1].text + ":"+o.y;
                    // }
                 }
          });//ticks: { max:  Math.min.apply(null, a), min:0,reverse: false}
          var mag = new Magnify(rain_chart,"default");
          var zoom_pan = new MouseZoomAndPan(rain_chart, "default", {axis: "x"});
           //min: Math.min.apply(null, a), max: Math.max.apply(null, a),// var legend = new dojox.charting.widget.Legend({ chart: chart }, "legend");
           rain_chart.title = "Annual Rainfall Graph (2014 to 2020)"
           rain_chart.titleFont= "bold 12pt Arial"
           rain_chart.titlePos = "top"
           rain_chart.titleGap = 10
           rain_chart.render();

          dojo.query('#rainfall_legend').style('display','block');
          window.rain_chart=rain_chart;
          rain_chart.resize(600, 270)
          // var legend_rain = new dojox.charting.widget.Legend({chart: rain_chart}, "rainfall_legend");

          //gwr chart
          // Create the chart within it&#x27;s "holding" node
          // var bar_Chart_1 = new dojox.charting.Chart2D("gwr_graph1", { enablePan: true, enableZoom: true });//Creates an object for displacement chart
          // bar_Chart_1.setTheme(theme); // Set the theme as Tufte
          // bar_Chart_1.addPlot("default", { type: "Columns", gap: 30, width: 20, animate: { duration: 2000, easing: dojo.fx.easing.bounceInOut } });  // Add the only/default plot
          // window.bar_Chart_1 = bar_Chart_1;
          // Create the chart within it&#x27;s "holding" node
          var bar_chart_2 = new dojox.charting.Chart2D("gwr_graph2", { enablePan: true, enableZoom: true });//Creates an object for displacement chart
          bar_chart_2.setTheme(theme); // Set the theme as Tufte
          bar_chart_2.addPlot("default", { type: "Columns", gap: 70, width: 20, animate: { duration: 2000, easing: dojo.fx.easing.bounceInOut } });  // Add the only/default plot
          window.bar_chart_2 = bar_chart_2;

          // var gwr_res = Number(akahRainfallResponse.attributes[`res`].toFixed(2));
          // var gwr_total = Number(akahRainfallResponse.attributes[`total`].toFixed(2));
          // var gwr_draftIrr = Number(akahRainfallResponse.attributes[`draft_irrg`].toFixed(2));
          // var gwr_resDom =Number(akahRainfallResponse.attributes[`res_dom`].toFixed(2));
          // var irrig_draf_2013 = Number(akahRainfallResponse.attributes[`gw_alloc`].toFixed(2));
          // var draft_irrg_2017 = Number(akahRainfallResponse.attributes[`proj_dem`].toFixed(2));
          akahRainfallResponse.attributes[`gw_alloc`]!=null? irrig_draf_2013 = Number(akahRainfallResponse.attributes[`gw_alloc`].toFixed(2)) : irrig_draf_2013 = "";
          akahRainfallResponse.attributes[`proj_dem`]!=null? draft_irrg_2017 = Number(akahRainfallResponse.attributes[`proj_dem`].toFixed(2)) : draft_irrg_2017 = "";


          //FIRST BAR-CHART-(1- NET GROUND WATER AVAILABILITY; 2-PROJECTED DEMAND)
          // var barChartData = [gwr_res, gwr_total, gwr_draftIrr, gwr_resDom];
          // var chartData_1 = [{ y: gwr_res,fill: "blue", tooltip:gwr_res },{ y: gwr_total, fill: "blue", tooltip: gwr_total },{ y: gwr_draftIrr,fill: "orange", tooltip:gwr_draftIrr },{ y:gwr_resDom ,fill: "orange", tooltip:gwr_resDom }];
          // bar_Chart_1.addAxis("x", { fixLower: "minor", fixUpper: "minor", natural: true, vertical: false, title: "", titleFontColor: "black", titleOrientation: "away", labels: [{value: 1,text: 'Net GW Availability', fill:"blue"}, {value: 2,text:'Total GW Extraction', fill:"blue"}, {value: 3, text: 'Irrigation Draft', fill:"orange"}, {value: 4,text:"Domestic Draft", fill:"orange"}] });
          // bar_Chart_1.addAxis("y", {  min: Math.min.apply(null, barChartData), max: Math.max.apply(null, barChartData), vertical: true, fixLower: "major", fixUpper: "major", includeZero: true, title: "Ham", titleFontColor: "black" });
          // bar_Chart_1.addSeries("Series A", chartData_1); //Adds Displacement Data to chart
          // new Highlight(bar_Chart_1, "default");
          // new Tooltip(bar_Chart_1, "default");
          // bar_Chart_1.title = "Estimated Groundwater Resources for 2017"
          // bar_Chart_1.titleFont= "bold 12pt Avenir Light"
          // bar_Chart_1.titlePos = "top"
          // bar_Chart_1.titleGap = 10
          // bar_Chart_1.render();
          // bar_Chart_1.resize(560,300)
          // dojo.query('#gwr_graph1_legend').style('display','block');
          // dojo.query('gwr_graph1').style('display','none');
          // dojo.query('#gwr_graph2_heading').style('display','block');

          var barChartData1=[irrig_draf_2013,draft_irrg_2017];
          var chartData_2 = [{ y: irrig_draf_2013,fill: "green", tooltip: 'Net GW Availability (2025): <b>'+irrig_draf_2013+' ham</b>' },{ y: draft_irrg_2017 ,fill: "blue", tooltip:'Domestic Future Draft: <b>'+draft_irrg_2017+' ham</b>' }];
          bar_chart_2.addAxis("x", { fixLower: "minor", fixUpper: "minor", natural: true, vertical: false, font: "normal normal bold 12px Arial", fontColor: "black", title: "", titleFontColor: "black", titleOrientation: "away", labels: [{value: 1, text:'Net GW Availability (2025)', fill:"blue"}, {value: 2, text:'Domestic Future Draft', fill:"blue"}] });
          bar_chart_2.addAxis("y", { min: Math.min.apply(null, barChartData1), max: Math.max.apply(null, barChartData1),vertical: true, font: "normal normal normal 12px Arial", fontColor: "black", fixLower: "major", fixUpper: "major", includeZero: true, title: "Volume(Ham)", titleFontColor: "black" });
          bar_chart_2.addSeries("Series A", chartData_2); //Adds Displacement Data to chart
          new Highlight(bar_chart_2, "default");
          new Tooltip(bar_chart_2, "default");
          bar_chart_2.title = "Projected Groundwater Resources (for year 2025)"
          bar_chart_2.titleFont= "bold 12pt Arial"
          bar_chart_2.titlePos = "top"
          bar_chart_2.titleGap = 10
          bar_chart_2.render();
          bar_chart_2.resize(560,230)
          dojo.query('#gwr_graph2_legend').style('display','block');

          // Stacked chart Plotting modified from here....
          domAttr.set('barAndStackedBarChartDiv', 'innerHTML', '')
          var c = new dojox.charting.Chart2D("barAndStackedBarChartDiv");
          c.addPlot("stackedColumnsPlot", {type: StackedColumns,gap:40,lines: true,areas: true,markers: true,tension: "2",animate: { duration: 2000, easing: dojo.fx.easing.bounceInOut }});
          c.addAxis("x", {dropLabels: false,labelSizeChange: true,majorTicks:true,majorTickStep:1,minorTicks:false,font: "normal normal bold 12px Arial", fontColor: "black",
            labels: [{"value":1,"text":"Net GW Availability"},{"value":2,"text":"Net Utilization"},{"value":3,"text":"GW for future Use"}]});
          c.addAxis("y", {title:"Volume(Ham)",fixLower: "major",fixUpper: "major", includeZero: true,majorTickStep:2500,minorTickStep:500,max: 15000,vertical: true});
          c.addSeries("Net GW Availability",[akahRainfallResponse.attributes.res, null, null], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF",},fill: "blue"});
          c.addSeries("Irrigation Draft", [null, 8602.38, null], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF"},fill: "#078807"});
          c.addSeries("Domestic Draft", [null, 487.65, null], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF"},fill: "rgb(251, 208, 10)"});
          c.addSeries("GW for future Use", [null, null, akahRainfallResponse.attributes.res - akahRainfallResponse.attributes.total], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF"},fill: "maroon"});
          new Tooltip(c, "stackedColumnsPlot",{
              text: function (chartItem) {
                  console.debug(chartItem);
                  return chartItem.run.name +": <b>"+ chartItem.run.data[chartItem.index]+" ham</b>";
              }
          });
          // Stacked chart Plotting modified till here....
          c.title = "Estimated Groundwater Resources (Baseline Year - 2017)"
          c.titleFont= "bold 12pt Arial"
          c.titlePos = "top"
          c.titleGap = 10
          c.render();
          c.resize(560,230);
          dojo.query('#barAndStackedBarChartDivlegend').style('display','block');
        }
      }
    },

    akah_chartGenerte: function(){
        domAttr.set("akahLulc_Chart","innerHTML","");
        domAttr.set("lulc_legend","innerHTML","");
        // domAttr.set("ndvi_legend","innerHTML","");
        // domAttr.set("akahNdvi_Chart","innerHTML","");
        var stateName = akah_searchResponse.attributes.state;
        var districtName = akah_searchResponse.attributes.district;
        var blockName = akah_searchResponse.attributes.block;
        (akah_searchResponse.attributes.village === null) ? (villageName = " "):(villageName = akah_searchResponse.attributes.village)
        //akah_villages_layer.setDefinitionExpression("VILLNAME_1 like" +" "+"\'"+ villageName +"\'");
        akah_villages_layer.setVisibility(true);
        // akah_villages_layer.setDefinitionExpression("VNAME like "+villageName)
        // var akah_monYear = akah_Tool.akah_selMonth+akah_Tool.akah_selYear
        var akah_monYear = akah_Tool.akah_selYear.substr(2,) + akah_Tool.akah_selMonsoon

        if (akah_searchResponse.attributes['al_'+akah_monYear] != null) {var lulcAL_val = akah_searchResponse.attributes['al_'+akah_monYear]}else{var lulcAL_val = 0}
        if (akah_searchResponse.attributes['bl_'+akah_monYear] != null) {var lulcBL_val = akah_searchResponse.attributes['bl_'+akah_monYear]}else{var lulcBL_val = 0}
        if (akah_searchResponse.attributes['bu_'+akah_monYear] != null) {var lulcBU_val = akah_searchResponse.attributes['bu_'+akah_monYear]}else{var lulcBU_val = 0}
        if (akah_searchResponse.attributes['ga_'+akah_monYear] != null) {var lulcFR_val = akah_searchResponse.attributes['ga_'+akah_monYear]}else{var lulcFR_val = 0}
        if (akah_searchResponse.attributes['wb_'+akah_monYear] != null) {var lulcWB_val = akah_searchResponse.attributes['wb_'+akah_monYear]}else{var lulcWB_val = 0}

        dojo.query('#akahLocation_info').style('display','block')
        domAttr.set('akahLocation_info','innerHTML',"<span><span class='akahHeadings'>State: </span><span class='akahNames'>"+stateName+"</span></span>&nbsp;&nbsp;<span><span class='akahHeadings'>District: </span><span class='akahNames'>"+districtName+"</span></span>&nbsp;&nbsp;"+
        "<span><span class='akahHeadings'>Block: </span><span class='akahNames'>"+blockName+"</span></span>&nbsp;&nbsp;<br><span><span class='akahHeadings'>Village: </span><span class='akahNames'>"+villageName+"</span>");

        //Lulc chart for agakhan summary widget
        sumForPercntg = Number(lulcAL_val) + Number(lulcBL_val) + Number(lulcFR_val) + Number(lulcBU_val) + Number(lulcWB_val)
        akah_LULCchart = new dojox.charting.Chart2D("akahLulc_Chart", { type: Pie , font: "normal normal normal 14px TimesnewRoman", fontColor: "black", radius: 100, stroke: {width: 0}, labels:false, htmlLabels:false});
        var akahLulc_Data = [{ y: lulcAL_val, tooltip:"Agriculture Land <br><b>" + Number(lulcAL_val.toFixed(2)) +" ha </b><br><b>( "+ ( Number(lulcAL_val)/sumForPercntg).toFixed(2)+"% )</b>",fill:"#5adf5a"},
                         { y: lulcBL_val, tooltip:"Barren Land <br><b>"+Number(lulcBL_val.toFixed(2)) +" ha </b><br><b>( "+ ( Number(lulcBL_val)/sumForPercntg).toFixed(2)+"% )</b>", fill:"#edd8c0", stroke: {color: "#edd8c0", width: 4}},
                         { y: lulcFR_val, tooltip:"Grass Area <br><b>"+Number(lulcFR_val.toFixed(2)) +" ha </b><br><b>( "+ ( Number(lulcFR_val)/sumForPercntg).toFixed(2)+"% )</b>", fill:"#047d04"},
                         { y: lulcBU_val, tooltip:"Built Up <br><b>"+Number(lulcBU_val.toFixed(2)) +" ha </b><br><b>( "+ ( Number(lulcBU_val)/sumForPercntg).toFixed(2)+"% )</b>", fill:"#bd3c11",stroke: {color: "#bd3c11", width: 4}},
                         { y: lulcWB_val, tooltip:"Water Bodies <br><b>"+Number(lulcWB_val.toFixed(2)) +" ha </b><br><b>( "+ ( Number(lulcWB_val)/sumForPercntg).toFixed(2)+"% )</b>", fill:"#2f92a3", stroke: {color: "#2f92a3", width: 2}}];
        akah_LULCchart.addPlot("default", { type: Pie , font: "normal normal bold 12px TimesnewRoman", fontColor: "black", radius: 180, stroke: {width: 1}, labelOffset: -20, labels: false, labelStyle: "default",htmlLabels: false});
        akah_LULCchart.addSeries("Series A", akahLulc_Data); //Adds Displacement Data to chart
        var mag1 = new dojox.charting.action2d.MoveSlice(akah_LULCchart, "default");
        new Highlight(akah_LULCchart, "default");
        new Tooltip(akah_LULCchart, "default");
        akah_LULCchart.title = "Land Use Land Cover"
        akah_LULCchart.titleFont= "bold 12pt Avenir Light"
        akah_LULCchart.titlePos = "top"
        akah_LULCchart.titleGap = 0
        akah_LULCchart.margins.t = 0
        akah_LULCchart.margins.b = 0
        akah_LULCchart.node.clientHeight= 190;
        akah_LULCchart.render();
        akah_LULCchart.resize(295,295);

        domAttr.set("lulc_legend","innerHTML","<div style='line-height: 2em;padding-top: 50%;'>"+
                    "<span style='padding: 0px 8px 0px 6px;color:#047d04;background-color:#047d04;font-size: 13px;margin-left:44px;border-radius:3px;'>.</span><span>&nbsp;Grass Area - "+Number(lulcFR_val.toFixed(2))+" ha</span><br>"+
                    "<span style='padding: 0px 8px 0px 6px;color:#5adf5a;background-color:#5adf5a;font-size: 13px;margin-left:44px;border-radius:3px;'>.</span><span>&nbsp;Agriculture Land - "+Number(lulcAL_val.toFixed(2))+" ha</span><br>"+
                    "<span style='padding: 0px 8px 0px 6px;color:#edd8c0;background-color:#edd8c0;font-size: 13px;margin-left:44px;border-radius:3px;'>.</span><span>&nbsp;Barren Land - "+Number(lulcBL_val.toFixed(2))+" ha</span><br>"+
                    "<span style='padding: 0px 8px 0px 6px;color:#2f92a3;border-radius:3px;background-color:#2f92a3;font-size: 13px;margin-left:44px'>.</span><span>&nbsp;Water Bodies - "+Number(lulcWB_val.toFixed(2))+" ha</span><br>"+
                    "<span style='padding: 0px 8px 0px 6px;color:#bd3c11;background-color:#bd3c11;font-size: 13px;margin-left:44px;border-radius:3px;'>.</span><span>&nbsp;Built Up - "+Number(lulcBU_val.toFixed(2))+" ha</span></div>")

        // //Ndvi chart for agakhan summary widget
        // if (akah_searchResponse.attributes['ndvi_al_'+akah_monYear] != null) {var ndviAL_val = akah_searchResponse.attributes['ndvi_al_'+akah_monYear]}else{var ndviAL_val = 0}
        // if (akah_searchResponse.attributes['ndvi_bl_'+akah_monYear] != null) {var ndviBL_val = akah_searchResponse.attributes['ndvi_bl_'+akah_monYear]}else{var ndviBL_val = 0}
        // if (akah_searchResponse.attributes['ndvi_bu_'+akah_monYear] != null) {var ndviBU_val = akah_searchResponse.attributes['ndvi_bu_'+akah_monYear]}else{var ndviBU_val = 0}
        // if (akah_searchResponse.attributes['ndvi_fr_'+akah_monYear] != null) {var ndviFR_val = akah_searchResponse.attributes['ndvi_fr_'+akah_monYear]}else{var ndviFR_val = 0}
        // if (akah_searchResponse.attributes['ndvi_wb_'+akah_monYear] != null) {var ndviWB_val = akah_searchResponse.attributes['ndvi_wb_'+akah_monYear]}else{var ndviWB_val = 0}

        // akah_NDVIchart = new dojox.charting.Chart2D("akahNdvi_Chart", { type: Pie , font: "normal normal normal 14px TimesnewRoman", fontColor: "black", radius: 100, stroke: {width: 0}, labelOffset: -16, labels: true, labelStyle: "default",htmlLabels: true});
        // var akahLulc_Data = [{ y: ndviAL_val, tooltip:"Agriculture Land <b>: " + Number(ndviAL_val.toFixed(2)) +"</b>",fill:"#5adf5a"},
        //                  { y: ndviBL_val, tooltip:"Barren Land <b>: "+Number(ndviBL_val.toFixed(2)) +"</b>", fill:"#edd8c0"},
        //                  { y: ndviFR_val, tooltip:"Forest Area <b>: "+Number(ndviFR_val.toFixed(2)) +"</b>", fill:"#047d04"},
        //                  { y: ndviBU_val, tooltip:"Built Up <b>: "+Number(ndviBU_val.toFixed(2)) +"</b>", fill:"#bd3c11"},
        //                  { y: ndviWB_val, tooltip:"Water Bodies <b>: "+Number(ndviWB_val.toFixed(2)) +"</b>", fill:"#2f92a3"}];
        // akah_NDVIchart.addPlot("default", { type: Pie , font: "normal normal bold 12px TimesnewRoman", fontColor: "black", radius: 180, stroke: {width: 1}, labelOffset: -16, labels: true, labelStyle: "default",htmlLabels: true});
        // akah_NDVIchart.addSeries("Series A", akahLulc_Data);
        // var mag1 = new dojox.charting.action2d.MoveSlice(akah_NDVIchart, "default");
        // new Highlight(akah_NDVIchart, "default");
        // new Tooltip(akah_NDVIchart, "default");
        // akah_NDVIchart.title = "Normalized Difference Vegetation Index"
        // akah_NDVIchart.titleFont= "bold 12pt Avenir Light"
        // akah_NDVIchart.titlePos = "bottom"
        // akah_NDVIchart.titleGap = 10
        // akah_NDVIchart.render();
        // akah_NDVIchart.resize(350,300);

        // domAttr.set("ndvi_legend","innerHTML","<div style='line-height: 1.5em;'>"+
        //             "<span style='padding: 0px 8px 0px 6px;color:#047d04;background-color:#047d04;font-size: 12px;margin-left:44px;border-radius:3px;'>.</span><span>&nbsp;Forest Area</span><br>"+
        //             "<span style='padding: 0px 8px 0px 6px;color:#5adf5a;background-color:#5adf5a;font-size: 12px;margin-left:44px;border-radius:3px;'>.</span><span>&nbsp;Agriculture Land</span><br>"+
        //             "<span style='padding: 0px 8px 0px 6px;color:#edd8c0;background-color:#edd8c0;font-size: 12px;margin-left:44px;border-radius:3px;'>.</span><span>&nbsp;Barren Land</span><br>"+
        //             "<span style='padding: 0px 8px 0px 6px;color:#2f92a3;border-radius:3px;background-color:#2f92a3;font-size: 12px;margin-left:44px'>.</span><span>&nbsp;Water Bodies</span><br>"+
        //             "<span style='padding: 0px 8px 0px 6px;color:#bd3c11;background-color:#bd3c11;font-size: 12px;margin-left:44px;border-radius:3px;'>.</span><span>&nbsp;Built Up</span></div>")
    },

    validateToGenerateNDWIChart: function(){
      if (dijit.byId('searchVillageAKAH').value != "" && akah_ndwifrommonth !="Month" && akah_ndwifromyear !="Year" && akah_ndwitomonth !="Month" && akah_ndwitoyear != "Year") {
        akah_Tool.akah_chartGenerateNDWI()
      }
      else if (dijit.byId('searchVillageAKAH').value === "" && (akah_Tool.map.graphics.graphics[0].symbol != undefined) && (akah_ndwifrommonth !="Month" && akah_ndwifromyear !="Year" && akah_ndwitomonth !="Month" && akah_ndwitoyear != "Year")) {
          new QueryTask(akah_villages_layer.url).execute(queryChart, function(akah_villageResponse){
            window.akah_searchResponse = akah_villageResponse.features[0];
            akah_Tool.akah_chartGenerateNDWI()
          });
      }
      else{
        domAttr.set("ndwiLineCharts_info","innerHTML","");
        domAttr.set("ndwi_legend","innerHTML","");
      }
    },

    validateToGenerateNDVIChart: function(){
      if (dijit.byId('searchVillageAKAH').value != "" && akah_ndvifrommonth !="Month" && akah_ndvifromyear !="Year" && akah_ndvitomonth !="Month" && akah_ndvitoyear != "Year") {
        akah_Tool.akah_chartGenerateNDVI()
      }
      else if (dijit.byId('searchVillageAKAH').value === "" && (akah_Tool.map.graphics.graphics[0].symbol != undefined) && (akah_ndvifrommonth !="Month" && akah_ndvifromyear !="Year" && akah_ndvitomonth !="Month" && akah_ndvitoyear != "Year")) {
          new QueryTask(akah_villages_layer.url).execute(queryChart, function(akah_villageResponse){
            window.akah_searchResponse = akah_villageResponse.features[0];
            akah_Tool.akah_chartGenerateNDVI()
          });
      }
      else{
        domAttr.set("ndviLineCharts_info","innerHTML","");
        domAttr.set("ndvi_legend","innerHTML","");
      }
    },
    akah_chartGenerateNDWI: function(){
      var ndwi_response = "";
      window.ndwi_response = ndwi_response;
      ndwidateLabels=[];ndwi_minarray=[];ndwi_maxarray=[];ndwi_meanarray=[];ndwi_sdarray=[];
      window.ndwidateLabels=ndwidateLabels;window.ndwi_minarray=ndwi_minarray;window.ndwi_maxarray=ndwi_maxarray;window.ndwi_meanarray=ndwi_meanarray;window.ndwi_sdarray=ndwi_sdarray;
      // ndwi_minarray.length = 0;ndwi_maxarray.length=0;ndwi_meanarray.length =0;ndwi_sdarray.length=0;
      akah_villages_layer.setVisibility(true);
      var akah_NDWI_from = akah_Tool.akah_ndwifromyear +"-"+ akah_Tool.akah_ndwifrommonth+"-01"
      var akah_NDWI_to = akah_Tool.akah_ndwitoyear +"-"+ akah_Tool.akah_ndwitomonth+"-01"
      var queryNDWI = new Query()
      queryNDWI.where="ndwi_date between '"+akah_NDWI_from+"' and '"+akah_NDWI_to+"' and vid like "+akah_searchResponse.attributes.OBJECTID;
      // queryNDWI.where = "ndwi_date between '2016-01-01' and '2017-3-01' and vid like 49"
      queryNDWI.returnDistinctValues=false;
      queryNDWI.returnGeometry=true;
      queryNDWI.outFields=["vid","date_string","ndwi_min","ndwi_max","ndwi_mean","ndwi_stddev"]

      domAttr.set("ndwiLineCharts_info","innerHTML",'<img src="'+image_path+'" class="load_image" alt="Loading.." style="margin-top:24%;">');
      dijit.byId("maxCheckBox_ndwi").disabled = true
      dijit.byId("meanCheckBox_ndwi").disabled = true
      dijit.byId("minCheckBox_ndwi").disabled = true
      dijit.byId("standardCheckBox_ndwi").disabled = true
      dojo.query("#maxCheckBox_ndwi").style({"cursor":"wait"});
      dojo.query("#meanCheckBox_ndwi").style("cursor", "wait");
      dojo.query("#minCheckBox_ndwi").style("cursor", "wait");
      dojo.query("#standardCheckBox_ndwi").style("cursor", "wait");
      new QueryTask("https://geomonitor.co.in/server/rest/services/agakhan_experiment/ndwi_akah/FeatureServer/0").execute(queryNDWI, function(ndwi_response){
              ndwi_response.features.forEach(function(ndwi_resp, ndwi_index){
                  ndwi_response.fields.forEach(function(evt, index){
                    var fieldname = evt.name;
                    if (fieldname.includes("date_string") || fieldname.includes("ndwi_min")||fieldname.includes("ndwi_max")||fieldname.includes("ndwi_mean")||fieldname.includes("ndwi_stddev")){
                      if(fieldname.includes("date_string") && ndwi_resp.attributes[fieldname] != null)
                      {ndwidateLabels.push( {text:ndwi_resp.attributes[fieldname].split("-")[1] + "-"+ndwi_resp.attributes[fieldname].substr(0,4), value: ndwi_index+1});}
                      else if(fieldname.includes("ndwi_min") && ndwi_resp.attributes[fieldname] != null)
                      {ndwi_minarray.push(ndwi_resp.attributes[fieldname]);}
                      else if(fieldname.includes("ndwi_max") && ndwi_resp.attributes[fieldname] != null)
                      {ndwi_maxarray.push(ndwi_resp.attributes[fieldname]);}
                      else if(fieldname.includes("ndwi_mean") && ndwi_resp.attributes[fieldname] != null)
                      {ndwi_meanarray.push(ndwi_resp.attributes[fieldname]);}
                      else if(fieldname.includes("ndwi_stddev") && ndwi_resp.attributes[fieldname] != null)
                      {ndwi_sdarray.push(ndwi_resp.attributes[fieldname]);}
                    }
              });
              });
              dojo.setAttr('ndwiLineCharts_info', 'innerHTML', '')
              dijit.byId("maxCheckBox_ndwi").disabled = false
              dijit.byId("meanCheckBox_ndwi").disabled = false
              dijit.byId("minCheckBox_ndwi").disabled = false
              dijit.byId("standardCheckBox_ndwi").disabled = false
              dojo.query("#maxCheckBox_ndwi").style("cursor", "default");
              dojo.query("#meanCheckBox_ndwi").style("cursor", "default");
              dojo.query("#minCheckBox_ndwi").style("cursor", "default");
              dojo.query("#standardCheckBox_ndwi").style("cursor", "default");

              var ndwichart = new Chart("ndwiLineCharts_info");
                //ndwi chart includes all lines
                // ndwichart.setTheme(green);
                ndwichart.addPlot("default", {type: LinesPlot,markers: true,tension: "S",marker: "m-3,0 c0,-4 6,-4 6,0 m-6,0 c0,4 6,4 6,0" });
                ndwichart.addAxis("x", { includeZero: false, fixLower: "major", fixUpper: "major", natural: false, vertical: false, rotation: 90, title: "Time", titleFontColor: "black",
                labels: ndwidateLabels, titleOrientation: "away", majorLabels: true,majorTicks:true,majorTickStep:1,minorTicks:false});
                ndwichart.addAxis("y", { min : -1, max:1,vertical: true, fixLower: "minor", fixUpper: "minor", title: "Water Index", titleFontColor: "black",minorTicks:true});

                if(dijit.byId("maxCheckBox_ndwi").checked ===true){
                  ndwichart.addSeries("Max", ndwi_maxarray,{plot: "default", stroke: {color:"#007E11", width:2},markers:true,marker: "m-3,0 c0,-4 6,-4 6,0 m-6,0 c0,4 6,4 6,0" }); //min:
                }
                if(dijit.byId("meanCheckBox_ndwi").checked ===true){
                  ndwichart.addSeries("Mean", ndwi_meanarray,{plot: "default", stroke: {color:"#00AA17", width:2}}); //min:
                }
                if(dijit.byId("minCheckBox_ndwi").checked===true){
                ndwichart.addSeries("Min", ndwi_minarray,{plot: "default", stroke: {color:"#00E21F", width:2}}); //min: 0, max: Math.max.apply(null, a),
                  }
                if(dijit.byId("standardCheckBox_ndwi").checked===true){
                  ndwichart.addSeries("Sd", ndwi_sdarray,{plot: "default", stroke: {color:"#C4E300", width:2} }); //min:
                }
                  new Tooltip(ndwichart, "default", {
                    text: function(o){
                      return "Element at index: "+o.index;
                    }
                });
                ndwichart.title = "Normalized Difference Water Index"
                ndwichart.titleFont= "bold 12pt Avenir Light"
                ndwichart.titlePos = "top"
                ndwichart.titleGap = 10
                  ndwichart.render();
                  ndwichart.resize(450,230);
                dojo.query("#pr_load").style("display","none");

                  var zoom_pan = new MouseZoomAndPan(ndwichart, "default", {axis: "x"});
                    var mag = new Magnify(ndwichart,"default");
                    // var tool = new Tooltip(ndwichart, "default"); 
                      var tip = new Tooltip(ndwichart,"default", {
                                    text: function(o){return "<b>"+ndwidateLabels[o.x-1].text + "</b> : "+ (o.y).toFixed(6);}
                              });
                    domAttr.set("ndwi_legend","innerHTML",'<table style="line-height: 2em;padding-top: 40%;padding-left:5%;">'+
                    '<tr><td><span style="padding: 0px 8px 0px 6px;color:#007E11;background-color:#007E11;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Maximum</td></tr>'+
                    '<tr><td><span style="padding: 0px 8px 0px 6px;color:#00AA17;background-color:#00AA17;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Mean</td></tr>'+
                    '<tr><td><span style="padding: 0px 8px 0px 6px;color:#00E21F;background-color:#00E21F;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Minimum</td></tr>'+
                    '<tr><td><span style="padding: 0px 8px 0px 6px;color:#C4E300;background-color:#C4E300;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Standard_deviation</td></tr></table>')
                    dojo.query("#ndwi_checkboxtable").style("display","block");

          });
    },
    akah_chartGenerateNDVI: function(){
      var ndvi_response = "";
      window.ndvi_response = ndvi_response;
      ndvidateLabels=[];ndvi_minarray=[];ndvi_maxarray=[];ndvi_meanarray=[];ndvi_sdarray=[];
      window.ndvidateLabels=ndvidateLabels;window.ndvi_minarray=ndvi_minarray;window.ndvi_maxarray=ndvi_maxarray;window.ndvi_meanarray=ndvi_meanarray;window.ndvi_sdarray=ndvi_sdarray;
      akah_villages_layer.setVisibility(true);
      var akah_NDVI_from = akah_Tool.akah_ndvifromyear +"-"+ akah_Tool.akah_ndvifrommonth+"-01"
      var akah_NDVI_to = akah_Tool.akah_ndvitoyear +"-"+ akah_Tool.akah_ndvitomonth+"-01"
      var queryNDVI = new Query()
      queryNDVI.where="ndvi_date between '"+akah_NDVI_from+"' and '"+akah_NDVI_to+"' and vid like "+akah_searchResponse.attributes.OBJECTID;
      // queryNDVI.where = "ndvi_date between '2016-01-01' and '2017-3-01' and vid like 49"
      queryNDVI.returnDistinctValues=false;
      queryNDVI.returnGeometry=true;
      queryNDVI.outFields=["vid","date_string","ndvi_min","ndvi_max","ndvi_mean","ndvi_stddev"]
      domAttr.set("ndviLineCharts_info","innerHTML",'<img src="'+image_path+'" class="load_image" alt="Loading.." style="margin-top:24%;">');

      dijit.byId("maxCheckBox_ndvi").disabled = true
      dijit.byId("meanCheckBox_ndvi").disabled = true
      dijit.byId("minCheckBox_ndvi").disabled = true
      dijit.byId("standardCheckBox_ndvi").disabled = true
      dojo.query("#maxCheckBox_ndvi").style("cursor", "wait");
      dojo.query("#meanCheckBox_ndvi").style("cursor", "wait");
      dojo.query("#minCheckBox_ndvi").style("cursor", "wait");
      dojo.query("#standardCheckBox_ndvi").style("cursor", "wait");

        new QueryTask("https://geomonitor.co.in/server/rest/services/agakhan_experiment/ndvi/FeatureServer/0").execute(queryNDVI, function(ndvi_response){
        ndvi_response.features.forEach(function(ndvi_resp, ndvi_index){
            ndvi_response.fields.forEach(function(evt, index){
              var fieldname = evt.name;
              if (fieldname.includes("date_string") || fieldname.includes("ndvi_min")||fieldname.includes("ndvi_max")||fieldname.includes("ndvi_mean")||fieldname.includes("ndvi_stddev")){
                if(fieldname.includes("date_string") && ndvi_resp.attributes[fieldname] != null)
                {ndvidateLabels.push( {text:ndvi_resp.attributes[fieldname].split("-")[1] + "-"+ndvi_resp.attributes[fieldname].substr(0,4), value: ndvi_index+1});}
                else if(fieldname.includes("ndvi_min") && ndvi_resp.attributes[fieldname] != null)
                {ndvi_minarray.push(ndvi_resp.attributes[fieldname]);}
                else if(fieldname.includes("ndvi_max") && ndvi_resp.attributes[fieldname] != null)
                {ndvi_maxarray.push(ndvi_resp.attributes[fieldname]);}
                else if(fieldname.includes("ndvi_mean") && ndvi_resp.attributes[fieldname] != null)
                {ndvi_meanarray.push(ndvi_resp.attributes[fieldname]);}
                else if(fieldname.includes("ndvi_stddev") && ndvi_resp.attributes[fieldname] != null)
                {ndvi_sdarray.push(ndvi_resp.attributes[fieldname]);}
              }
            });

        });
          //ndvi chart includes all lines

          dojo.setAttr('ndviLineCharts_info', 'innerHTML', '')
          dijit.byId("maxCheckBox_ndvi").disabled = false
          dijit.byId("meanCheckBox_ndvi").disabled = false
          dijit.byId("minCheckBox_ndvi").disabled = false
          dijit.byId("standardCheckBox_ndvi").disabled = false
          dojo.query("#maxCheckBox_ndvi").style("cursor", "default");
          dojo.query("#meanCheckBox_ndvi").style("cursor", "default");
          dojo.query("#minCheckBox_ndvi").style("cursor", "default");
          dojo.query("#standardCheckBox_ndvi").style("cursor", "default");

          var ndvichart = new Chart("ndviLineCharts_info");
          // ndvichart.setTheme(green);
          ndvichart.addPlot("default", {type: LinesPlot,markers: true,tension: "S",marker: "m-3,0 c0,-4 6,-4 6,0 m-6,0 c0,4 6,4 6,0" });
          ndvichart.addAxis("x", { includeZero: false, fixLower: "major", fixUpper: "major", natural: false, vertical: false, rotation: 90, title: "Time", titleFontColor: "black",
          labels: ndvidateLabels, titleOrientation: "away", majorLabels: true,majorTicks:true,majorTickStep:1,minorTicks:false});
          ndvichart.addAxis("y", { min : -1, max:1,vertical: true, fixLower: "minor", fixUpper: "minor", title: "Vegetation Index", titleFontColor: "black",minorTicks:true});
           if(dijit.byId("maxCheckBox_ndvi").checked){
            ndvichart.addSeries("Max", ndvi_maxarray,{plot: "default", stroke: {color:"#007E11", width:2},markers:true,marker: "m-3,0 c0,-4 6,-4 6,0 m-6,0 c0,4 6,4 6,0" }); //min:
           }
           if(dijit.byId("meanCheckBox_ndvi").checked){
            ndvichart.addSeries("Mean", ndvi_meanarray,{plot: "default", stroke: {color:"#00AA17", width:2}}); //min:
           }
           if(dijit.byId("minCheckBox_ndvi").checked){
           ndvichart.addSeries("Min", ndvi_minarray,{plot: "default", stroke: {color:"#00E21F", width:2}}); //min: 0, max: Math.max.apply(null, a),
            }
           if(dijit.byId("standardCheckBox_ndvi").checked){
            ndvichart.addSeries("Sd", ndvi_sdarray,{plot: "default", stroke: {color:"#C4E300", width:2} }); //min:
           }
            new Tooltip(ndvichart, "default", {
              text: function(o){
                 return "Element at index: "+o.index;
              }
           });
           ndvichart.title = "Normalized Difference Vegetation Index"
        ndvichart.titleFont= "bold 12pt Avenir Light"
        ndvichart.titlePos = "top"
        ndvichart.titleGap = 10
            ndvichart.render();
            ndvichart.resize(450,230);
             var zoom_pan = new MouseZoomAndPan(ndvichart, "default", {axis: "x"});
              var mag = new Magnify(ndvichart,"default");
              // var tool = new Tooltip(ndvichart, "default"); 
                var tip = new Tooltip(ndvichart,"default", {
                               text: function(o){return "<b>"+ndvidateLabels[o.x-1].text + "</b> : "+ (o.y).toFixed(6);}
                        });
              domAttr.set("ndvi_legend","innerHTML",'<table style="line-height: 2em;padding-top: 40%;padding-left:5%;">'+
              '<tr><td><span style="padding: 0px 8px 0px 6px;color:#007E11;background-color:#007E11;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Maximum</td></tr>'+
              '<tr><td><span style="padding: 0px 8px 0px 6px;color:#00AA17;background-color:#00AA17;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Mean</td></tr>'+
              '<tr><td><span style="padding: 0px 8px 0px 6px;color:#00E21F;background-color:#00E21F;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Minimum</td></tr>'+
              '<tr><td><span style="padding: 0px 8px 0px 6px;color:#C4E300;background-color:#C4E300;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Standard_deviation</td></tr></table>')
              dojo.query("#ndvi_checkboxtable").style("display","block");
            });
    },
    akah_checkMonth: function(value1){
      var month = "";
      switch(value1){
        case "1":  month = "Select";
        break;
        case "2":  month = "JAN";
        break;
        case "3":  month = "APR";
        break;
        case "4":  month = "OCT";
        break;
        case "5":  month = "DEC";
        break;
        default: console.log("give a valid input");
      }
      return month
    },
    akah_checkMonsoon: function(value){
      var monsoon = "";
      switch(value){
        case "1":  monsoon = "Select";
        break;
        case "2":  monsoon = "pre";
        break;
        case "3":  monsoon = "pst";
        break;
        default: console.log("give a valid input");
      }
      return monsoon
    },

    initGetLayersData(){
      init_map_extent = this.map.extent;
      window.init_map_extent = init_map_extent
      var querydist = new Query()
      querydist.returnGeometry = true
      querydist.outFields = ["*"]
      // querydist.returnDistinctValues = true
      querydist.where = "state LIKE 'Maharashtra'"
      new QueryTask(akah_dist_layer.url).execute(querydist, function(dist1_response){
          window.dist1_response = dist1_response;``
      });

      querydist.returnGeometry = false;
      querydist.returnDistinctValues = true;
      querydist.outFields=['block'];
      new QueryTask(akah_selectedwells_layer.url).execute(querydist, function(block1_response){
        window.block1_response = block1_response;
      });

      querydist.outFields = ["village"];
      new QueryTask(akah_selectedwells_layer.url).execute(querydist, function(village1_response){
        window.village1_response = village1_response;
      });

      querydist.returnGeometry = true;
      querydist.returnDistinctValues = false;
      querydist.outFields = ["*"]
      querydist.where = "state LIKE 'Gujarat'"
      new QueryTask(akah_dist_layer.url).execute(querydist, function(dist2_response){
        window.dist2_response = dist2_response;
      });
      querydist.returnGeometry = false;
      querydist.returnDistinctValues = true;
      querydist.outFields=['block'];
      new QueryTask(akah_selectedwells_layer.url).execute(querydist, function(block2_response){
        window.block2_response = block2_response;
      });


      querydist.outFields = ["village"];
      new QueryTask(akah_selectedwells_layer.url).execute(querydist, function(village2_response){
        window.village2_response = village2_response;
      });
    },

    initLocationChange: function(){
        akah_Tool = this;
        var districts = []; window.districts = districts;
        var blocks = [];window.blocks = blocks;
        var villages = []; window.villages=villages;
        dojo.query('#akahwellInventory_Report').style('display','block')
        dojo.query('#akahVillageLevel_WellInfo').style('display','block')
        this.own(on(loc_st_val, 'change', lang.hitch(this, function (evt) {
        dijit.byId("akah_dist").disabled = true;
          st_val.attr('value', evt);//change location in all tabs
          st_valdv.attr('value', evt);
          // dojo.query('#akahvillage_check_box').style("display",'none');
          var sum_var=["vs_well_count","vs_wq","vs_pop","vs_pop_ratio" ,"vs_maj_crop","vs_sw_irr","vs_gw_irr","vs_avail_gw","vs_pre_mon","vs_post_mon","vs_aqui","vs_ws"]
          sum_var.forEach(function(j){domAttr.set(j,"innerHTML",'<b>'+""+'</b>');});
              window.akahstate = evt;
              distValueakah.set('value', '');
              for (var i = 0; i<districts.length ; i++) {
                distValueakah.removeOption(lang.clone(districts[i]));
                distValueakah.store = null;
                distValueakah._setDisplay("");
              }

              if(akahstate!="Select State"){
              var query_state = new Query();
              query_state.where = "state like '" +akahstate+"'"
              while (districts.length > 0) {
                districts.pop();
              }
              districts.push("Select District");
              query_state.outFields = ["district"]
              query_state.returnGeometry = false
              query_state.returnDistinctValues = true
              query_state.orderByFields = ["district ASC"];
              //querying displacement service url and getting all districts data
              new QueryTask(akah_selectedwells_layer.url).execute(query_state, function retrieve(selectedstateresponse) {
                window.selectedstateresponse = selectedstateresponse;
                selectedstateresponse.features.forEach(function (feature) {
                  dist_val = feature.attributes.district;
                  // districts.push("Select District")
                  districts.push(dist_val);
                  var map_d = districts.map(function (record) {
                    return dojo.create("option", {
                      label: record,
                      value: record
                    })
                  })
                  distValueakah.options.length = 0
                  distValueakah.addOption("Select District")
                  distValueakah.addOption(map_d)
                  distValueakah.attr('value', districts[0])
                  dijit.byId("akah_dist").disabled = false;
                });
              });
            }
        })));
        this.own(on(distValueakah, 'change', lang.hitch(this, function (evt) {
          dijit.byId("akah_block").disabled = true;
          ds_val1.attr('value', evt);//change location in all tabs
          ds_val1dv.attr('value', evt);
          // dojo.query('#akahvillage_check_box').style("display",'none');
          var sum_var=["vs_well_count","vs_wq","vs_pop","vs_pop_ratio" ,"vs_maj_crop","vs_sw_irr","vs_gw_irr","vs_avail_gw","vs_pre_mon","vs_post_mon","vs_aqui","vs_ws"]
          sum_var.forEach(function(j){domAttr.set(j,"innerHTML",'<b>'+""+'</b>');});
          window.akahdistrict = evt;
          blockValueakah.set('value', '');
          for (var i = 0; i<blocks.length ; i++) {
            blockValueakah.removeOption(lang.clone(blocks[i]));
            blockValueakah.store = null;
            blockValueakah._setDisplay("");
          }

          if(akahdistrict!="Select District"){
          var query_dist = new Query();
          query_dist.where = "state like '"+akahstate+"' and district like '" +akahdistrict+"'"
          while (blocks.length > 0) {
            blocks.pop();
          }
          blocks.push("Select Block");
          query_dist.outFields = ["block"]
          query_dist.returnGeometry = false
          query_dist.returnDistinctValues = true
          query_dist.orderByFields = ["block ASC"];

          //querying displacement service url and getting all districts data
          new QueryTask(akah_selectedwells_layer.url).execute(query_dist, function retrieve(selectedblockresponse) {
            window.selectedblockresponse = selectedblockresponse;
            //console.log(selectedblockresponse);
            selectedblockresponse.features.forEach(function (feature) {
              block_val = feature.attributes.block;
              // districts.push("Select District")
              blocks.push(block_val);
              var map_b = blocks.map(function (record) {
                return dojo.create("option", {
                  label: record,
                  value: record
                })
              })
              blockValueakah.options.length = 0
              blockValueakah.addOption("Select Block")
              blockValueakah.addOption(map_b)
              blockValueakah.attr('value', blocks[0])
              dijit.byId("akah_block").disabled = false;
            });
          });
        }
        })));
        this.own(on(blockValueakah, 'change', lang.hitch(this, function (evt) {
          dijit.byId("akah_vill").disabled = true;
          st_val1.attr('value', evt); //change location in all tabs
          st_val1dv.attr('value', evt);
          window.akahblock = evt;
          var sum_var=["vs_well_count","vs_wq","vs_pop","vs_pop_ratio" ,"vs_maj_crop","vs_sw_irr","vs_gw_irr","vs_avail_gw","vs_pre_mon","vs_post_mon","vs_aqui","vs_ws"]
          sum_var.forEach(function(j){domAttr.set(j,"innerHTML",'<b>'+""+'</b>');});
          vill_valakah.set('value', '');
          for (var i = 0; i<villages.length ; i++) {
            vill_valakah.removeOption(lang.clone(villages[i]));
            vill_valakah.store = null;
            vill_valakah._setDisplay("");
          }
          if(akahblock!="Select Block"){
          var query_vill = new Query();
          query_vill.where = "state like '"+akahstate+"' and district like '" +akahdistrict+"'"+" and block like '" +akahblock+"'"
          while (villages.length > 0) {
            villages.pop();
          }
          villages.push("Select Village");
          query_vill.outFields = ["village_name"]
          query_vill.returnGeometry = false
          query_vill.returnDistinctValues = true
          query_vill.orderByFields = ["village_name ASC"];
          //querying displacement service url and getting all districts data
          new QueryTask(akah_selectedwells_layer.url).execute(query_vill, function retrieve(selectedblockresponse) {
            window.selectedblockresponse = selectedblockresponse;
            selectedblockresponse.features.forEach(function (feature) {
              village_val = feature.attributes.village_name;
              // districts.push("Select District")
              villages.push(village_val);
              var map_v = villages.map(function (record) {
                return dojo.create("option", {
                  label: record,
                  value: record
                })
              })
              vill_valakah.options.length = 0
              vill_valakah.addOption("Select Village")
              vill_valakah.addOption(map_v)
              vill_valakah.attr('value', villages[0])
              dijit.byId("akah_vill").disabled = false;
            });
          });
        }
        })));
        var highlightVillGraphic = "";
        window.highlightVillGraphic=highlightVillGraphic;
        this.own(on(vill_valakah, 'change', lang.hitch(this, function (evt) {
          window.akahvillage = evt;
          // var highlightVillGraphic;
          akah_Tool.map.graphics.remove(highlightVillGraphic);
          var sum_var=["vs_well_count","vs_wq","vs_pop","vs_pop_ratio" ,"vs_maj_crop","vs_sw_irr","vs_gw_irr","vs_avail_gw","vs_pre_mon","vs_post_mon","vs_aqui","vs_ws"]
          sum_var.forEach(function(j){domAttr.set(j,"innerHTML",'<b>'+""+'</b>');});
              if(evt != "Select Village"){
                   searchAkah.set("value", akahvillage);
                    var getVillGeometry =  new Query();
                    getVillGeometry.outFields = ["*"]
                    getVillGeometry.where  = "village_name like '"+evt+"'"
                    getVillGeometry.returnGeometry = true
                    var villHighlightSymbol = new SimpleFillSymbol(
                      SimpleFillSymbol.STYLE_SOLID,
                      new SimpleLineSymbol(
                        SimpleLineSymbol.STYLE_SOLID,
                        new Color([215,0,0]), 3
                      ),
                      new Color([255,255,255,0.25])
                    );
                    window.villHighlightSymbol = villHighlightSymbol;
                    new QueryTask(akah_villages_layer.url).execute(getVillGeometry, function retrieve(akah_searchResponseresult) {
                      akah_searchResponse = akah_searchResponseresult.features[0];
                      window.akah_searchResponse = akah_searchResponse
                      akah_Tool.map.graphics.remove(highlightVillGraphic);
                      highlightVillGraphic = new Graphic(akah_searchResponse.geometry, villHighlightSymbol);
                      akah_Tool.map.setExtent(akah_searchResponse.geometry.getExtent().expand(1.5))
                      akah_Tool.map.graphics.add(highlightVillGraphic);
                      //get village map image url for print
                      var BlockPrintTask = new PrintTask(app.printUrl);
                      window.BlockPrintTask = BlockPrintTask;
                      window.printing_tool_exe = BlockPrintTask.execute(blockMapParams, function (evt){
                          villageMap=evt.url;
                      });
                      //search village through village information tab
                      queryChart.geometry =akah_searchResponse.geometry
                      akah_Tool.getSearchResponseOnDraw("",queryChart);
                    });
            }
        })));
    },

    goto_village_boundary: function(evt){
      if (evt == true) {
        akah_villages_layer.setVisibility(true)
      }
      else{
        akah_villages_layer.setVisibility(false)
      }
    },

    goto_selectedwell:function(evt){
      if (evt == true) {
        akah_selectedwells_layer.setVisibility(true)
      }
      else{
        akah_selectedwells_layer.setVisibility(false)
      }
    },

    // goToPritWellChart: function(){
    //     //debugger;
    //     // Create the chart within it&#x27;s "holding" node     
    //     // domAttr.set("wellCountChart_Gujarat","innerHTML"," ");
    //     // domAttr.set("wellCountChart_Maharashtra","innerHTML"," ");
    //     // var bar_Chart_1 = new dojox.charting.Chart2D("wellCountChart_Maharashtra", { enablePan: true, enableZoom: true });
    //     //Creates an object for displacement chart           
    //     bar_Chart_1.setTheme(theme);
    //     // Set the theme as Tufte     
    //     bar_Chart_1.addPlot("default", { type: "Columns", gap: 30, width: 5, animate: { duration: 2000, easing: dojo.fx.easing.bounceInOut } });
    //     // Add the only/default plot              
    //     window.bar_Chart_1 = bar_Chart_1;
    //     //feature = block_response.features[0];              
    //     /*var net_gw_ava_2011 = Number(feature.attributes[`net_gw_ava_2011`].toFixed(2));             
    //     var net_gwr_2013 = Number(feature.attributes[`net_gwr_2013`].toFixed(2));             
    //     var proj_dem_2017 = Number(feature.attributes[`proj_dem_2017`].toFixed(2));                             
    //     var gw_dft_irr_2011 = Number(feature.attributes[`gw_dft_irr_2011`].toFixed(2));              var irrig_draf_2013 = Number(feature.attributes[`irrig_draf_2013`].toFixed(2));              var draft_irrg_2017 = Number(feature.attributes[`draft_irrg_2017`].toFixed(2));               var gw_dft_dom_2011 = Number(feature.attributes[`gw_dft_dom_2011`].toFixed(2));
    //     var dom_and_in_2013 = Number(feature.attributes[`dom_and_in_2013`].toFixed(2));             
    //     var ind_dom_2017 = Number(feature.attributes[`ind_dom_2017`].toFixed(2)); */
    //     //FIRST BAR-CHART-(1- NET GROUND WATER AVAILABILITY; 2-PROJECTED DEMAND)             
    //     var chartData_1 = [{ y: Number(gangapur_response), fill: "rgb(115, 235, 193)", tooltip:Number(gangapur_response) },{ y: Number(Number(ganga_response1)+Number(ganga_response2)), fill: "rgb(80, 161, 132)", tooltip: Number(Number(ganga_response1)+Number(ganga_response2))}];
    //     bar_Chart_1.addAxis("x", { fixLower: "minor", fixUpper: "minor", natural: true, vertical: false, title: "Gangapur", titleFontColor: "black", titleOrientation: "away", labels: [{value: 1, text: "Observation Wells", fill:"rgb(115, 235, 193)"}, {value: 2, text: "Survey Wells", fill:"rgb(80, 161, 132)"}] });
    //     bar_Chart_1.addAxis("y", { vertical: true ,fixLower: "major", minorTicks:false, microTicks: false,fixUpper: "major", includeZero: true, title: "Wells", titleFontColor: "black" });
    //     bar_Chart_1.addSeries("Series A", chartData_1);
    //     //bar_Chart_1.addAxis("y", { vertical: true, fixLower: "major", fixUpper: "major", includeZero: true, title: "HAM", titleFontColor: "yellow" });
    //      //Adds Displacement Data to chart             
    //     new Highlight(bar_Chart_1, "default");             
    //     new Tooltip(bar_Chart_1, "default");                            
    //     //bar_Chart_1.render();
    //     /*var month_result = monthArray_values.reduce((unique, o) => {
    //       if(!unique.some(obj => obj.value === o.value)) {
    //         unique.push(o);              }             
    //         return unique;         
    //       },[]);         
    //       var monthArray = month_result.reduce((obj, item, index) => Object.assign(obj, { [index]: item.value }), {});
    //       window.monthArray = monthArray;         
    //       let yearUniqueValues = yearArray_values.filter((item, index, ar) => ar.indexOf(item) === index);
    //       window.yearUniqueValues = yearUniqueValues;
    //
    //
    //     /* domAttr.set("wellcount_chart","innerHTML","");
    //     well_chart = new dojox.charting.Chart2D("wellcount_chart", { type: Pie , radius: 100, stroke: {width: 0}, font: "normal normal bold 14px TimesnewRoman", fontColor: "black", /*labelOffset: -4, labels: true, labelStyle: "default",htmlLabels: true});
    //     var well_chartData = [{ y: Number(Number(ganga_response1)+Number(ganga_response2)), text: Number(Number(ganga_response1)+Number(ganga_response2)), fill:"#73ebc1", tooltip:"Gangapur Total Wells:<b> " +Number(Number(ganga_response1)+Number(ganga_response2)) + "</b>" },
    //                    { y:Number(Number(chit_response1)+Number(chit_response2)), text: Number(Number(chit_response1)+Number(chit_response2)), fill:"#50a184", tooltip:"Chitravad Total wells: <b>"+ Number(Number(chit_response1) + Number(chit_response2))+"</b>" }];
    //     // akah_main_layer.setDefinitionExpression("1=1");
    //     // well_chart.setTheme(blue); // Set the theme as Tufte
    //     well_chart.addPlot("default", { type: Pie , radius: 100});
    //     well_chart.addSeries("Series A", well_chartData); //Adds Displacement Data to chart
    //     // well_chart.title = "Well Registration Chart";
    //     var mag1 = new dojox.charting.action2d.MoveSlice(well_chart, "default");
    //     // new MouseZoomAndPan(well_chart, "default", { axis: "x" });
    //
    //     new Highlight(well_chart, "default");
    //     new Tooltip(well_chart, "default"); */
    //     bar_Chart_1.title= "Maharashtra";
    //     bar_Chart_1.titleFont= "bold 12pt Arial";
    //     // well_chart.titleFontWeight= "bold";
    //     bar_Chart_1.render();
    //     bar_Chart_1.resize(300,220);
    //     domAttr.set("well_legend_M","innerHTML","<div style='display:flex;'><span style='padding: 0px 8px 0px 6px;color:#73ebc1;background-color:#73ebc1;font-size: 12px;border-radius:3px;'>.</span>&nbsp;Observation Wells<br><span style='padding: 0px 8px 0px 6px;color:#50a184;border-radius:3px;background-color:#50a184;font-size: 12px;margin-left:14px'>.</span>&nbsp;Survey Wells</div>")
    //
    //
    //
    //
    //     var bar_Chart_2 = new dojox.charting.Chart2D("wellCountChart_Gujarat", { enablePan: true, enableZoom: true });
    //     bar_Chart_2.setTheme(theme);
    //     bar_Chart_2.addPlot("default", { type: "Columns", gap: 30, width: 5, animate: { duration: 2000, easing: dojo.fx.easing.bounceInOut } });
    //
    //     window.bar_Chart_2 = bar_Chart_2;
    //     var chartData_2 = [{ y: Number(chitravad_response), fill: "rgb(115, 235, 193)", tooltip:Number(chitravad_response) },{ y: Number(Number(chit_response1)+Number(chit_response2)), fill: "rgb(80, 161, 132)", tooltip: Number(Number(chit_response1)+Number(chit_response2))}];
    //     bar_Chart_2.addAxis("x", { fixLower: "minor", fixUpper: "minor", natural: true, vertical: false, title: "Chitravad", titleFontColor: "black", titleOrientation: "away", labels: [{value: 1, text: "Observation Wells", fill:"rgb(115, 235, 193)"}, {value: 2, text: "Survey Wells", fill:"rgb(80, 161, 132)"}] });
    //     bar_Chart_2.addAxis("y", { vertical: true, fixLower: "major",microTicks: false ,minorTicks:false, fixUpper: "major", includeZero: true, title: "Wells", titleFontColor: "black" });
    //     bar_Chart_2.addSeries("Series A", chartData_2);
    //     new Highlight(bar_Chart_2, "default");             
    //     new Tooltip(bar_Chart_2, "default");                            
    //     bar_Chart_2.title= "Gujarat";
    //     bar_Chart_2.titleFont= "bold 12pt Arial";
    //     bar_Chart_2.render();
    //     bar_Chart_2.resize(300,220);
    //     domAttr.set("well_legend_G","innerHTML","<div style='display:flex;'><span style='padding: 0px 8px 0px 6px;color:#73ebc1;background-color:#73ebc1;font-size: 12px;border-radius:3px;'>.</span>&nbsp;Observation Wells<br><span style='padding: 0px 8px 0px 6px;color:#50a184;border-radius:3px;background-color:#50a184;font-size: 12px;margin-left:14px'>.</span>&nbsp;Survey Wells</div>")
    //
    //
    //     //domAttr.set("sum1_well","innerHTML","<b>" + Number(Number(ganga_response1)+Number(ganga_response2)) + "</b>");
    //     //domAttr.set("sum2_well","innerHTML","<b>" + Number(Number(chit_response1)+Number(chit_response2)) + "</b>");
    //     // domAttr.set("sum_wellcount_mhr","innerHTML","<b>" + Number(Number(ganga_response1)+Number(ganga_response2)) + "</b>");
    //     //domAttr.set("sum_wellcount_gt","innerHTML","<b>" + Number(Number(chit_response1)+Number(chit_response2)) + "</b>");
    // },

    // getChartCGWB: function(){
    //   //domAttr.set("cgwbcount_chart","innerHTML","");
    //   cgwb_chart = new dojox.charting.Chart2D("cgwbcount_chart", { type: Pie , radius: 100, stroke: {width: 0}, font: "normal normal bold 14px TimesnewRoman", fontColor: "black", /*labelOffset: -4,*/ labels: true, labelStyle: "default",htmlLabels: true});
    //   var chartData = [{ y: gwm_response1, text: gwm_response1, tooltip:"Aurangabad <b>: " + gwm_response1 +"</b>",fill:"#73ebc1"},
    //                    { y: gwm_response2, text: gwm_response2, tooltip:"Junagadh <b>: "+gwm_response2 +"</b>", fill:"#50a184"}];
    //   // cgwb_chart.setTheme(blue); // Set the theme as Tufte
    //   cgwb_chart.addPlot("default", { type: Pie , radius: 100});
    //   cgwb_chart.addSeries("Series A", chartData); //Adds Displacement Data to chart
    //   // cgwb_chart.title = "CGWB GWM Stations";
    //   // cgwb_chart.titleFont = "10px bold";
    //   // new MouseZoomAndPan(cgwb_chart, "default", { axis: "x" });
    //   var mag1 = new dojox.charting.action2d.MoveSlice(cgwb_chart, "default");
    //   new Highlight(cgwb_chart, "default");
    //   new Tooltip(cgwb_chart, "default");
    //   cgwb_chart.title = "CGWB GWM Stations"
    //   cgwb_chart.titleFont= "bold 12pt Arial"
    //   cgwb_chart.render();
    //   cgwb_chart.resize(250,250)
    //   //domAttr.set("cgwb_legend","innerHTML","<div style='display:flex;'><span style='padding: 0px 8px 0px 6px;color:#73ebc1;background-color:#73ebc1;font-size: 12px;margin-left:44px;border-radius:3px;'>.</span>&nbsp;Maharashtra<br><span style='padding: 0px 8px 0px 6px;color:#50a184;border-radius:3px;background-color:#50a184;font-size: 12px;margin-left:14px'>.</span>&nbsp;Gujarat</div>")
    //   //domAttr.set("sum_guj","innerHTML","<b>"+gwm_response2+"</b>")
    //   // domAttr.set("sum_maha","innerHTML","<b>"+gwm_response1+"</b>")
    //   //domAttr.set("sum_gwmstations_gt","innerHTML","<b>"+gwm_response2+"</b>")
    //   // domAttr.set("sum_gwmstations_mhr","innerHTML","<b>"+gwm_response1+"</b>")
    //   // domAttr.set("sum_observationWell_mhr", "innerHTML", "<b>"+gangapur_response+"</b>")
    // },

    showAKAHResult: function(){
          init_map = this.map
          akah_Tool = this;
          
          document.getElementsByClassName('bar_akah-inner')[0].dataset.percent = "90%"
          document.getElementsByClassName('bar_akah-inner')[0].style.width = "90%"

          dojo.query('#village_level_info').style('display', 'block');

          var query_selectedInp = new Query()
          query_selectedInp.where = "1=1"
          query_selectedInp.outFields = ["*"]
          query_selectedInp.returnGeometry = true
          query_selectedInp.returnDistinctValues = false
          if (akahstate !="Select State" && akahdistrict === "Select District" && akahblock === "Select Block" && akahvillage === "Select Village") {
            query_selectedInp.where = "state like" +" "+"\'"+ akahstate +"\'" ;
            // new QueryTask(akah_villages_layer.url).execute(query_selectedInp, function retrieve(response) {
            //       window.akah_state_point_response = response;
            // });
            new QueryTask(akah_states_layer.url).execute(query_selectedInp, function retrieve(response) {
              //quering and pushing all gps datat to an array
                  window.akah_state_response = response;
                  akahState_extent = new Extent(response.features[0].geometry.getExtent())
                  // var ext_change=new Extent();
                  akahState_extent.xmin = akahState_extent.xmin-800000;
                  // ext_change.ymin = newExtent.ymin-100000;
                  // ext_change.xmax = newExtent.xmax-400000;
                  // ext_change.ymax = newExtent.ymax+100000;
                  // ext_change.spatialReference = akah_Tool.map.spatialReference;
                  akah_Tool.map.setExtent(akahState_extent);
                  // domAttr.set('text_highlight', 'innerHTML', "State: "+selectedstate+"");
                  // domAttr.set('text_highlight_1', 'innerHTML', "State: "+selectedstate+"");
            });
            akah_villages_layer.setDefinitionExpression("state like" +" "+"\'"+ akahstate +"\'");
            akah_states_layer.setDefinitionExpression("state like" +" "+"\'"+ akahstate +"\'");
            akah_dist_layer.setVisibility(false);
            akah_block_layer.setVisibility(true);
            // abhy_vill_bound.setVisibility(false);
          }
          else if (akahstate !="Select State" && akahdistrict != "Select District" && akahblock === "Select Block" && akahvillage === "Select Village") {
            query_selectedInp.where = "state like" +" "+"\'"+ akahstate +"\'"  + " " + "AND" + " " + "district like" +" "+"\'"+ akahdistrict +"\'" ;
            // new QueryTask(akah_villages_layer.url).execute(query_selectedInp, function retrieve(response) {
            //       window.akah_district_point_response = response;
            // });
            new QueryTask(akah_dist_layer.url).execute(query_selectedInp, function retrieve(response) {
                    //quering and pushing all gps datat to an array
                        window.akah_dist_response = response;
                        akahDistrict_extent = new Extent(response.features[0].geometry.getExtent())
                        // var ext_change=new Extent();
                        akahDistrict_extent.xmin = akahDistrict_extent.xmin-3;
                        // ext_change.ymin = newExtent.ymin-700000;
                        // ext_change.xmax = newExtent.xmax-700000;
                        // ext_change.ymax = newExtent.ymax+700000;
                        // ext_change.spatialReference = akah_Tool.map.spatialReference;
                        akah_Tool.map.setExtent(akahDistrict_extent);
                        // domAttr.set('text_highlight', 'innerHTML', "State: "+selectedstate+", District: "+selecteddist);
                        // domAttr.set('text_highlight_1', 'innerHTML', "State: "+selectedstate+", District: "+selecteddist);
                        // map.setExtent(newExtent);
            });
            akah_villages_layer.setDefinitionExpression("state like" +" "+"\'"+ akahstate +"\'"  + " " + "AND" + " " + "district like" +" "+"\'"+ akahdistrict +"\'");
            akah_states_layer.setDefinitionExpression("state like" +" "+"\'"+ akahstate +"\'");
            akah_dist_layer.setDefinitionExpression("district like" +" "+"\'"+ akahdistrict +"\'");
            akah_dist_layer.setVisibility(true);
            akah_block_layer.setVisibility(true);
            akah_villages_layer.setVisibility(true);
          }
          else if (akahstate!="Select State" && akahdistrict != "Select District" && akahblock != "Select Block" && akahvillage === "Select Village") {
             query_selectedInp.where = "state like" +" "+"\'"+ akahstate +"\'"  + " " + "AND" + " " + "district like" +" "+"\'"+ akahdistrict +"\'"+ " " + "AND" + " " + "block like" + " " + "\'" + akahblock + "\'";
             // new QueryTask(akah_villages_layer.url).execute(query_selectedInp, function retrieve(response) {
             //      window.akah_block_point_response = response;
             // });
             new QueryTask(akah_block_layer.url).execute(query_selectedInp, function retrieve(response) {
                   window.akah_block_response = response;
                  akahBlock_extent = new Extent(response.features[0].geometry.getExtent())
                  // response.features[0].geometry.getExtent().xmin = response.features[0].geometry.getExtent().xmin+900000
                  akahBlock_extent.xmin = akahBlock_extent.xmin-100000;
                  akahBlock_extent.ymin = akahBlock_extent.ymin+20000;
                  akahBlock_extent.xmax = akahBlock_extent.xmax+20000;
                  akahBlock_extent.ymax = akahBlock_extent.ymax-10000;
                  // var ext_change=new Extent();
                  // ext_change.xmin = (webMercatorUtils.lngLatToXY(newExtent.xmin)[0])+10000;
                  // ext_change.ymin = (webMercatorUtils.lngLatToXY(newExtent.ymin)[0])-80000;
                  // ext_change.xmax = (webMercatorUtils.lngLatToXY(newExtent.xmax)[0])-10000;
                  // ext_change.ymax = (webMercatorUtils.lngLatToXY(newExtent.ymax)[0])+300000;
                  // ext_change.spatialReference = map.spatialReference;
                  // akah_Tool.map.setExtent(response.features[0].geometry.getExtent().expand(5));
                  akah_Tool.map.setExtent(akahBlock_extent);
                  // domAttr.set('text_highlight', 'innerHTML', "State: "+selectedstate+", District: "+selecteddist+", Block: "+selectedblock);
                  // domAttr.set('text_highlight_1', 'innerHTML', "State: "+selectedstate+", District: "+selecteddist+", Block: "+selectedblock);
              });
              akah_villages_layer.setDefinitionExpression("state like" +" "+"\'"+ akahstate +"\'"  + " " + "AND" + " " + "district like" +" "+"\'"+ akahdistrict +"\'"+ " " + "AND" + " " + "block like" + " " + "\'" + akahblock + "\'"/*+ "AND" + " " + "village_name like" + " " + "\'" + akahvillage + "\'"*/);
              // akah_main_layer.setDefinitionExpression("state like  '"+ akahstate +"' AND district like '"+ akahdistrict +"' AND block like '" + akahblock + "'");
              akah_states_layer.setDefinitionExpression("state like" +" "+"\'"+ akahstate +"\'");
              akah_dist_layer.setDefinitionExpression("district like" +" "+"\'"+ akahdistrict +"\'");
              akah_block_layer.setDefinitionExpression("block like" +" "+"\'"+ akahblock +"\'");
              //akah_villages_layer.setDefinitionExpression("state like" +" "+"\'"+ akahstate +"\'"  + " " + "AND" + " " + "district like" +" "+"\'"+ akahdistrict +"\'"+ " " + "AND" + " " + "block like" + " " + "\'" + akahblock + "\'"/*+ "AND" + " " + "VNAME like" + " " + "\'" + akahvillage + "\'"*/);
              akah_dist_layer.setVisibility(true);
              akah_block_layer.setVisibility(true);
              // akah_villages_layer.setVisibility(true);
              // if(akahvillage != "Select Village"){
              // akah_main_layer.setDefinitionExpression("state like" +" "+"\'"+ akahstate +"\'"  + " " + "AND" + " " + "district like" +" "+"\'"+ akahdistrict +"\'"+ " " + "AND" + " " + "block like" + " " + "\'" + akahblock + "\'"+ "AND" + " " + "village like" + " " + "\'" + akahvillage + "\'");
              // }
          }
          else if (akahstate!="Select State" && akahdistrict != "Select District" && akahblock != "Select Block" && akahvillage != "Select Village") {
              query_selectedInp.where = "state like" +" "+"\'"+ akahstate +"\'"  + " " + "AND" + " " + "district like" +" "+"\'"+ akahdistrict +"\'"+ " " + "AND" + " " + "block like" + " " + "\'" + akahblock + "\'" + "AND" + " " + "village_name like" + " " + "\'" + akahvillage + "\'";
              //query_selectedInp.where = "state_12 like" +" "+"\'"+ akahstate +"\'"  + " " + "AND" + " " + "district_12 like" +" "+"\'"+ akahdistrict +"\'"+ " " + "AND" + " " + "block_12 like" + " " + "\'" + akahblock + "\'" + "AND" + " " + "VILLNAME_1 like" + " " + "\'" + akahvillage + "\'";
              //window.query_selectedInp=query_selectedInp;
              var query_cgwbWells = new Query()
              query_cgwbWells.where = "state like" +" "+"\'"+ akahstate +"\'"  + " " + "AND" + " " + "district like" +" "+"\'"+ akahdistrict +"\'"+ " " + "AND" + " " + "block like" + " " + "\'" + akahblock + "\'" + " AND may_2015 is not null AND may_2016 is not null AND may_2017 is not null AND may_2018 is not null AND may_2019 is not null AND nov_2015 is not null AND nov_2016 is not null AND nov_2017 is not null AND nov_2018 is not null AND nov_2019 is not null"
              query_cgwbWells.outFields = ['state','site_name', 'may_2015', 'may_2016', 'may_2017', 'may_2018', 'may_2019', 'nov_2015', 'nov_2016', 'nov_2017', 'nov_2018', 'nov_2019']
              query_cgwbWells.returnGeometry = true
              new QueryTask(gwm_station_layer.url).execute(query_cgwbWells, function(cgwbWell_feature, cg_index){
                window.res_head='<div><p style="font-weight: 600;font-size: 20px;margin: 40px 0px 0px 2px;text-align: center;color: darkblue;">Water Level Trend charts for CGWB Well Sites </p></div><br>';
                window.rainfall_arr = [];window.res1 = '';
                cgwbWell_feature.features.forEach(function(site_well, s_ind){
                    window.premonsoon_arr=[];window.postmonsoon_arr=[];
                    if (site_well.attributes['state'] === 'Maharashtra') {
                      window.rainfall_arr = [592.06, 714.71, 686.51, 438.01, 826.43, 862.41]
                    }
                    else if (site_well.attributes['state'] === 'Gujarat') {
                      window.rainfall_arr = [750.88,948.82,885.38,904.71,1322.86,1553.63]
                    }
                    cgwbWell_feature.fields.forEach(function(cgwb_well){
                      if (cgwb_well.name.includes('may')) {
                          window.premonsoon_arr.push(-site_well.attributes[cgwb_well.name])
                      }
                      else if (cgwb_well.name.includes('nov')) {
                          window.postmonsoon_arr.push(-site_well.attributes[cgwb_well.name])
                      }
                    })
                    window.res1 = res1 + akah_Tool.generateMultiPlotChart( [{text:"2015",value: 1}, {text:"2016", value: 2}, {text: "2017", value: 3}, {text:"2018", value: 4}, {text: "2019", value: 5}, {text: "2020", value: 6}],
                      rainfall_arr, premonsoon_arr, postmonsoon_arr, site_well.attributes['site_name']);
                    window.res1 = res1 + akah_Tool.generateMultiPlotChart1( [{text:"2015",value: 1}, {text:"2016", value: 2}, {text: "2017", value: 3}, {text:"2018", value: 4}, {text: "2019", value: 5}, {text: "2020", value: 6}],
                      rainfall_arr, premonsoon_arr, postmonsoon_arr, site_well.attributes['site_name']);
                })
                window.res1 = res_head+res1;
              })
              akah_indus.setVisibility(false);
              akah_sw1.setVisibility(true);
              akah_drain.setVisibility(true);
              akah_states_layer.setVisibility(false);
              gwm_station_layer.setVisibility(false)
              akah_selectedwells_layer.setVisibility(false);
              // akah_block_layer.setVisibility(true);
              akah_dist_layer.setVisibility(false);

              window.rv={};
              var sum_var=["vs_well_count","vs_wq","vs_pop","vs_pop_ratio" ,"vs_maj_crop","vs_sw_irr","vs_gw_irr","vs_avail_gw","vs_pre_mon","vs_post_mon","vs_aqui","vs_ws"]
              sum_var.forEach(function(j){domAttr.set(j,"innerHTML",'<img src="'+image_path+'" class="load_image" alt="Loading..">');});
              dojo.byId("akahwellInventory_Report").setAttribute('disabled',true);
              dojo.query("#pr_load").style("display","block");
              window.rep_vil1='';window.rep_vil2='';window.rep_vil3='';window.rep_vil4='';window.rep_vil5='';window.rep_vil6='';window.rep_vil7='';window.rep_vil8='';
              window.rep_vil9='';window.rep_vil10='';window.rep_vil11='';window.rep_vil12='';window.rep_vil7_1='';
              window.rep_val1='';window.rep_val2='';window.rep_val3='';window.rep_val4='';window.rep_val5='';window.rep_val6='';window.rep_val7='';window.rep_val8='';window.rep_val5_1='';window.rep_val6_1='';
              window.rep_charts='';window.rep_header_text='';
              window.selected_result=new QueryTask(akah_selectedwells_layer.url).execute(query_selectedInp, function retrieve(summ_selected_records1) {
                window.akah_village_selectedwell_response = summ_selected_records1;
                // mbgl start
                window.well_data_info = {'Well_id': ''};
                well_data_info['Well_id'] = 'Well ID';well_data_info['uid']=[];well_data_info['Latitude']=[];
                well_data_info['Longitude']=[];well_data_info['Owner_Name'] = [];well_data_info['Well_Depth']=[];
                well_data_info['waterDepth_1'] = [];well_data_info['waterDepth_2'] = [];
                if(summ_selected_records1.features.length>0){
                  rep_header_text='<div style="display: block;text-align: center;font-size: large;padding: 2px;font-weight: 600;background-color: #f9f8f8;border-radius: 10px 10px 0px 0px;margin: 0px 30px 0px 10px;margin-top: 16px;position: sticky;"> <span> <span>State: </span> <span style=" color: #50a184; ">'+akahstate+
                  '</span> </span>&nbsp;&nbsp; <span> <span>District: </span> <span style=" color: #50a184; ">'+akahdistrict+'</span> </span>&nbsp;&nbsp; <span> <span >Block: </span> <span style=" color: #50a184; ">'+akahblock+'</span> </span>&nbsp;&nbsp;</div>'+
                  '<div style="display: block;text-align: center;font-size: large;padding: 2px;font-weight: 600;background-color: #f9f8f8;border-radius: 0px 0px 10px 10px;position: sticky;margin: 0px 30px 0px 10px;"> <span> <span>Village: </span> <span style=" color: #50a184; ">'+akahvillage+'</span> </span></div>';
                  // <span> <span>Village: </span> <span style=" color: #50a184; ">'+akahvillage+'</span> </span>
                  var pre=[];
                  var pst=[];
                  //var sets1={"station1":[2.135,3.35,3.04,null,5.1816],"station2":[1.22,1.21,3.04,null,7.62]};
                  //var sets2={"station1":[null,null,null,null,null],"station2":[null,null,null,7.5,15.69]}
                  window.wltb_text='';
                  var incr=0;
                  summ_selected_records1.features.forEach(function(f, f_index){
                    incr=incr+1;
                    ["_1","_2"].forEach(function(i){
                      if(f.attributes["feb_2021"+i]!=null && f.attributes["feb_2021"+i]!="<Null>"){
                          if(typeof(f.attributes["feb_2021"+i])=="string"){
                            if(f.attributes["feb_2021"+i].includes(">") || f.attributes["feb_2021"+i].includes("<")){
                              pre.push(parseFloat(f.attributes["feb_2021"+i].replace(">",'').replace("<",'').toFixed(2)));
                            }
                            else{
                            pre.push(parseFloat(f.attributes["feb_2021"+i]).toFixed(2));
                            }
                          }
                          else{
                            pre.push(parseFloat(f.attributes["feb_2021"+i]).toFixed(2));
                          }
                      }

                      if(f.attributes["mar_2021"+i]!=null && f.attributes["mar_2021"+i]!="<Null>"){
                          if(typeof(f.attributes["mar_2021"+i])=="string"){
                              if(f.attributes["mar_2021"+i].includes(">") || f.attributes["mar_2021"+i].includes("<")){
                                pre.push(parseFloat(f.attributes["mar_2021"+i].replace(">",'').replace("<",'').toFixed(2)));
                              }
                              else{
                              pre.push(parseFloat(f.attributes["mar_2021"+i]).toFixed(2));
                            }
                          }
                          else{
                            pre.push(parseFloat(f.attributes["mar_2021"+i]).toFixed(2));
                          }
                      }

                      if(f.attributes["oct_2020"+i]!=null && f.attributes["oct_2020"+i]!="<Null>"){
                        if(typeof(f.attributes["oct_2020"+i])=="string"){
                            if(f.attributes["oct_2020"+i].includes(">") || f.attributes["oct_2020"+i].includes("<")){
                              pst.push(parseFloat(f.attributes["oct_2020"+i].replace(">",'').replace("<",'').toFixed(2)));
                            }
                            else{
                            pst.push(parseFloat(f.attributes["oct_2020"+i]).toFixed(2));
                          }
                        }
                        else{
                          pst.push(parseFloat(f.attributes["oct_2020"+i]).toFixed(2));
                        }
                      }
                    });

                    function computeMonthYear(fromMonth, fromYear, toMonth, toYear){
                        var months=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
                        var c1=fromMonth; var a=fromYear;
                        var d1=toMonth;var b=toYear;
                        var dif=b-a;
                        var c=[]; var d=[];

                        function p(a,c1,d1){
                          //GLOBAL $months,$c,$d;
                          var year=a;
                          var x=months.indexOf(c1);
                          var xb=months.indexOf(d1);
                          for (var x0=x; x0<=xb;x0++){
                          c.push(months[x0]+'_'+year);
                          //c.push(months[x0]+'_'+year);
                          d.push(months[x0].toUpperCase()+'_'+year+'_1');
                          d.push(months[x0].toUpperCase()+'_'+year+'_2');
                          }
                        }

                        if (dif==0){ p(a,c1,d1); }
                        else if(dif>0){ p(a,c1,'dec');
                        for (var x1=a+1;x1<=b-1; x1++){
                        p(x1,'jan','dec');
                        }
                        p(b,'jan',d1); }
                        return {"attributes_names":c,"Labels":d}
                    }

                    var months=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
                    window.my_val=computeMonthYear("oct",2020, months[new Date().getMonth()-1] , new Date().getFullYear());//months[new Date().getMonth()-1]
                    //console.log(my_val);
                    var set1=[]
                    var set2=[]
                    my_val.attributes_names.forEach(function(h){
                        if(f.attributes[h+'_2']!=null && f.attributes[h+'_2']!="<Null>"){
                              if(typeof(f.attributes[h+'_2'])=="string"){
                                  if(f.attributes[h+'_2'].includes(">") || f.attributes[h+'_2'].includes("<")){
                                    set2.push(parseFloat(f.attributes[h+'_2'].replace(">",'').replace("<",'').toFixed(2)));
                                  }
                                  else{
                                  set2.push(parseFloat(f.attributes[h+'_2']).toFixed(2));
                                }
                              }
                              else{
                                set2.push(parseFloat(f.attributes[h+'_2']).toFixed(2));
                              }
                        }
                        else{
                          set2.push(null);
                        }

                        if(f.attributes[h+'_1']!=null && f.attributes[h+'_1']!="<Null>"){
                              if(typeof(f.attributes[h+'_1'])=="string"){
                                  if(f.attributes[h+'_1'].includes(">") || f.attributes[h+'_1'].includes("<")){
                                    set1.push(parseFloat(f.attributes[h+'_1'].replace(">",'').replace("<",'').toFixed(2)));
                                  }
                                  else{
                                  set1.push(parseFloat(f.attributes[h+'_1']).toFixed(2));
                                }
                              }
                              else{
                                set1.push(parseFloat(f.attributes[h+'_1']).toFixed(2));
                              }
                        }
                        else{
                          set1.push(null);
                        }
                    });
                    // console.log(set1)
                    // console.log(set2)
                    well_data_info['no_months'] = set1.length;
                    window.final=[];
                    //set1=[2.135,]//pimpri
                    //set2=[]//pimpri
                    //console.log(set1);
                    //console.log(set2);
                    // for(var i=0;i<set1.length;i++){
                    //   if(set1[i]!=null){
                    //     if(set2[i]!=null){
                    //       final.push(Math.max(set1[i],set2[i]));
                    //       console.log(final)
                    //     }
                    //     else{
                    //       final.push(set1[i])
                    //     }
                    //   }
                    //   else{
                    //     final.push(null)
                    //   }
                    // }
                    // set1=sets1["station"+incr];
                    // set2=sets2["station"+incr];
                    for(var i=0;i<set1.length;i++){
                      if(set1[i]!=null){
                        final.push(set1[i]);
                      }
                      else{
                        final.push(null)
                      }

                      if(set2[i]!=null){
                        final.push(set2[i])
                      }
                      else{
                        final.push(null)
                      }
                    }
                    well_data_info['uid'].push(f.attributes.uid)
                    well_data_info['Latitude'].push(f.attributes.y)
                    well_data_info['Longitude'].push(f.attributes.x);
                    if (f.attributes.owner_name===null) {
                      well_data_info['Owner_Name'].push('')
                    }
                    else{
                      well_data_info['Owner_Name'].push(akah_Tool.capitalize(f.attributes.owner_name))
                    }
                    if (f.attributes.well_depth_meters===null) {
                      well_data_info['Well_Depth'].push('')
                    }
                    else{
                      well_data_info['Well_Depth'].push(f.attributes.well_depth_meters.toFixed(2))
                    }
                    // ((f.attributes.owner_name===null)?(well_data_info['Owner Name'].push('')):(well_data_info['Owner Name'].push(akah_Tool.capitalize(f.attributes.owner_name))))
                    // ((f.attributes.well_depth_meters===null)?(well_data_info['Well Depth'].push('')):(well_data_info['Well Depth'].push(f.attributes.well_depth_meters.toFixed(2))))
                    well_data_info['waterDepth_1'].push(set1)
                    well_data_info['waterDepth_2'].push(set2)
                    wl_row="<tr>";
                    wl_row=wl_row+
                    "<td>"+'OW'+f.attributes.uid+"</td>"+
                    "<td>"+f.attributes.y.toFixed(2)+"</td>"+
                    "<td>"+f.attributes.x.toFixed(2)+"</td>"+
                    "<td>"+(f.attributes.owner_name==null?'':akah_Tool.capitalize(f.attributes.owner_name))+"</td>"+
                    "<td>"+(f.attributes.well_depth_meters==null?'':f.attributes.well_depth_meters.toFixed(2))+"</td>";
                    //"<td>"+(f.attributes.water_depth_meters==null?'':f.attributes.water_depth_meters)+"</td>";
                    for(var ml=0;ml<final.length;ml++){
                      if(final[ml]==null){
                        wl_row=wl_row+"<td>"+''+"</td>"
                      }
                      else{
                        wl_row=wl_row+"<td>"+final[ml]+"</td>"
                      }
                    }
                    wl_row=wl_row+"</tr>";
                    wltb_text=wltb_text+wl_row

                    const mean = (...numbers) => numbers.reduce((acc, val) => acc + val, 0) / numbers.length;
                    var vd=[];
                    var vl=[];
                    var dl=[];
                    var vd1=[];
                    window.vl=vl
                    for(var i=0;i<final.length;i++){
                      if (final[i]!=null){
                        vl.push(parseFloat(final[i]));
                        dl.push(my_val.Labels[i]);
                      }
                    }
                    if (vl.length!=0){
                        for(var i=0;i<dl.length;i++){
                          vd.push(i+1);
                        }
                        for(var i=0;i<dl.length+4;i++){
                          vd1.push(i+1);
                        }
                        var xx=[];
                        var xy=[];
                        for(var i=0;i<vd.length;i++){
                          xx.push(vd[i]*vd[i]);
                          xy.push(vd[i]*vl[i]);
                        }

                        var m=((mean(...vd)*mean(...vl)-mean(...xy))/(mean(...vd)*mean(...vd)-mean(...xx))).toFixed(2);

                        var b=(mean(...vl)-mean(...vd)*m).toFixed(2);
                        window.rl=[];
                        for(var i=0;i<vd1.length;i++){
                          rl.push(m*vd1[i]+parseFloat(b));
                        }
                        var rm=[];
                        for(var i=0;i<vl.length;i++){
                          rm.push((parseFloat(vl[i])-parseFloat(rl[i]))*(parseFloat(vl[i])-parseFloat(rl[i])));
                        }
                        var rmse1=Math.sqrt(mean(...rm)).toFixed(4);
                        //dl=lables, vl= values line, rl=regression line
                        dl.push('MAY_2021_1','MAY_2021_1','JUN_2021_1','JUN_2021_2')
                        var reportPollutionIndexArr=[];
                        dl.forEach(function(v,index){reportPollutionIndexArr.push({text: v, value: index+1});
                        });
                        dojo.query('#mbgl_chart').innerHTML('');
                        //domAttr.set('mbgl_chart', 'innerHTML', '');
                        dojo.query('#chartModule_new').style('display', 'block');
                        // Create the chart within it&#x27;s "holding" node
                        var chart = new Chart("mbgl_chart");
                        // Set the theme
                        chart.setTheme(theme);
                        // Add the only/default plot
                        chart.addPlot("default", {
                                      type: LinesPlot,
                                      markers: true,
                                      tension: "S"
                                      // rotate: "RTL"
                                    });
                        chart.addPlot("plot_markers", {
                                      type: LinesPlot,
                                      markers: false,
                                      tension: "S"
                                      // rotate: "RTL"
                                    });
                        var vl1=[];
                        var rl1=[];
                        if(rl[rl.length-5] - rl[0] < 0){
                          window.rise_fall = "<tr><td><div style='display:inline-flex'><b>Rate of rise<b></td><td>"+Number(rl[rl.length-5] - rl[0]).toFixed(2)+"&nbsp;<span><img src='"+rise_arrow+"' style='width: 10px;height: 14px;' alt='rise_image'/></span></div></td></tr>"
                        }
                        else{
                          window.rise_fall = "<tr><td><div style='display:inline-flex'><b>Rate of fall<b></td><td>"+Number(rl[rl.length-5] - rl[0]).toFixed(2)+"&nbsp;<span><img src='"+fall_arrow+"' style='width: 10px;height: 14px;' alt='fall_image'/></span></div></td></tr>"
                        }
                        vl.forEach(function(k){
                          vl1.push(k*-1);
                        });
                        rl.forEach(function(k){
                          rl1.push(k*-1);
                        });
                        chart.addAxis("x", { exportEnabled: true, beginAtZero:true,leftBottom: false,fixLower: "major", fixUpper: "major", natural: false, vertical: false, title: "TIME", titleFontColor: "#005fa2",rotation: 90, labels: reportPollutionIndexArr, majorLabels: true, minorLabels: false, majorTicks:true, microTicks: false,minorTicks:false,majorTickStep:1});
                        chart.addAxis("y", { min: Math.min.apply(null, vl1.concat(rl1))-1, max: 0, leftBottom: true, includeZero: true, vertical: true, fixLower: "major", fixUpper: "major", title: "MBGL", titleFontColor: "#005fa2", majorLabels: true, minorLabels: false, majorTicks:true,microTicks: false,minorTicks:false,majorTickStep:1});
                        chart.addSeries("Groundwater Observation Levels",vl1, { plot: "default" , stroke: { color: "gold" }, marker: "m-3,0 c0,-4 6,-4 6,0 m-6,0 c0,4 6,4 6,0" }); //min: 0, max: Math.max.apply(null, a),
                        chart.addSeries("Trend Line",rl1, { plot: "plot_markers" , stroke: { color: "#0c72f7",width: 2.5 } }); //min: 0, max: Math.max.apply(null, a),

                        //var tip = new Tooltip(hmda_PI_chart_new,"default");
                        //var zoom_pan = new MouseZoomAndPan(hmda_PI_chart_new, "default", {axis: "x"});
                        //var mag = new Magnify(hmda_PI_chart_new,"default");
                        chart.render();
                        chart.resize(450,300);
                        window.chart=chart;
                        rep_charts=rep_charts+'<div style="display:inline-grid"><div style="padding-left: 10px;font-size: 13px;"><b>Block name</b> – <span style="color: #049061;">Gangapur</span>, <b>Village name</b> - <span style="color: #049061;">Katepimpalgaon</span></div>'+'<div style="display:inline-flex"><div>'+dojo.query('#chartModule_new').innerHTML()+'</div>'+
                        "<div style='width: 260px;padding-left:60px;text-align:center;padding-top:110px;'>"+
                        "<table class='akahReportTable1'><tr><td style='width:50%'><b>Well ID</b></td><td>"+'OW'+f.attributes.uid+"</td></tr>"+
                        "<tr><td><b>Owner Name</b></td><td>"+(f.attributes.owner_name==null?'':akah_Tool.capitalize(f.attributes.owner_name))+"</td></tr>"+"<tr><td><b>Well Depth</b></td><td>"+(f.attributes.well_depth_meters==null?'':f.attributes.well_depth_meters.toFixed(2))+" m</td></tr>"+
                        //"<tr><td><b>Water Depth</b></td><td>"+(f.attributes.water_depth_meters==null?'':f.attributes.water_depth_meters.toFixed(2))+" mbgl</td></tr>"+
                        "<tr><td><b>Deviation<b></td><td>"+rmse1+"</td></tr>"+rise_fall+
                        "</table></div>"+"</div>"+
                        "<div style='display:inline-flex;'>"+

                        "<div style='display:inline-flex;'>"+
                        "<div style='width:17px;height:16px;border:1.6px solid white;background-color:gold;border-radius: 4px;'></div>"+
                        "<span style='padding-left:5px;'>Water Depth</span></div>"+

                        "<div style='display:inline-flex;padding-left:10px;'>"+
                        "<div style='width:17px;height:16px;border:1.6px solid white;background-color:#0c72f7;border-radius: 4px'></div>"+
                        "<span style='padding-left:5px;'>TrendLine</span></div>"+

                        "</div></div>"+'<br><br>';
                        dojo.query('#chartModule_new').style('display', 'none');
                    }
                  });

                  window.well_table_hdng = "<tr><td colspan=2 class='ReportTable_subHdngs1'>"+well_data_info.Well_id+"</td>";
                  window.well_lat = "<tr><td colspan=2 class='ReportTable_subHdngs1'>Latitude</td>";
                  window.well_long = "<tr><td colspan=2 class='ReportTable_subHdngs1'>Longitude</td>";
                  window.well_owner = "<tr><td colspan=2 class='ReportTable_subHdngs1'>Owner Name</td>";
                  window.well_depth_mbgl = "<tr><td colspan=2 class='ReportTable_subHdngs1'>Well Depth(m)</td>";
                  window.well_row = "<tr><td colspan="+(Number(well_data_info.uid.length)+2)+" class='ReportTable_subHdngs1' style='font-size: 15px;background-color: #e0e0e0;'>Water Depths(m)</td></tr>"
                  window.waterDepth_json = {};
                  for (var i = 0; i < well_data_info.uid.length; i++) {
                    well_table_hdng = well_table_hdng+"<td>"+(well_data_info.uid[i] == null ? '' : "OW"+well_data_info.uid[i])+"</td>";
                    well_lat = well_lat+"<td>"+(well_data_info.Latitude[i] == null ? '' : well_data_info.Latitude[i])+"</td>";
                    well_long = well_long+"<td>"+(well_data_info.Longitude[i] == null ? '' : well_data_info.Longitude[i])+"</td>";
                    well_owner = well_owner+"<td>"+(well_data_info.Owner_Name[i] == null ? '' : well_data_info.Owner_Name[i])+"</td>";
                    well_depth_mbgl = well_depth_mbgl+"<td>"+(well_data_info.Well_Depth[i] == null ? '' : well_data_info.Well_Depth[i])+"</td>";
                    for (var wdepth = 0; wdepth < well_data_info.no_months; wdepth++) {
                      if (waterDepth_json['month1'+wdepth] === undefined) {
                        waterDepth_json['month1'+wdepth] = "<tr><td class='ReportTable_subHdngs1' rowspan=2>"+my_val['Labels'][wdepth*2].slice(0, my_val['Labels'][wdepth*2].length-2)+"<td class='ReportTable_subHdngs1'>1</td></td>"
                      }
                      if (waterDepth_json['month2'+wdepth] === undefined) {
                        waterDepth_json['month2'+wdepth] = "<tr>"+"<td class='ReportTable_subHdngs1'>2</td>"
                      }
                      waterDepth_json['month1'+wdepth] = waterDepth_json['month1'+wdepth]+"<td>"+(well_data_info.waterDepth_1[i][wdepth] == null ? '' : well_data_info.waterDepth_1[i][wdepth])+"</td>";
                      waterDepth_json['month2'+wdepth] = waterDepth_json['month2'+wdepth]+"<td>"+(well_data_info.waterDepth_2[i][wdepth] == null ? '' : well_data_info.waterDepth_2[i][wdepth])+"</td>";
                    }
                  }
                  well_table_hdng = well_table_hdng+"</tr>";
                  well_lat = well_lat+"</tr>";
                  well_long = well_long+"</tr>";
                  well_owner = well_owner+"</tr>";
                  well_depth_mbgl = well_depth_mbgl+"</tr>";
                  window.well_table = well_table_hdng+well_lat+well_long+well_owner+well_depth_mbgl+well_row;
                  Object.keys(waterDepth_json).forEach(function(key){
                    well_table = well_table + waterDepth_json[key]+"</tr>";
                  })


                  // pre=[5.18,7.62,15.69];
                  // pst=[2.13,1.22];
                  if(pre.length!=0){
                      var min_pre=Math.min(...pre);
                      var max_pre=Math.max(...pre);
                      if(min_pre!=max_pre){
                        domAttr.set(sum_var[8],"innerHTML",'<b>'+min_pre+" - "+max_pre+" m"+'</b>');
                        rep_vil9=min_pre+" - "+max_pre+" m";
                      }
                      else{
                        domAttr.set(sum_var[8],"innerHTML",'<b>'+min_pre+" m"+'</b>');
                        rep_vil9=min_pre+" m";
                      }
                  }
                  else{
                      domAttr.set(sum_var[8],"innerHTML",'<b>'+"No Data"+'</b>');
                      rep_vil9='';
                  }

                  if(pst.length!=0){
                      var min_pst=Math.min(...pst);
                      var max_pst=Math.max(...pst);
                      if(min_pst!=max_pst){
                        domAttr.set(sum_var[9],"innerHTML",'<b>'+min_pst+" - "+max_pst+" m"+'</b>');
                        rep_vil10=min_pst+" - "+max_pst+" m"
                      }
                      else{
                        domAttr.set(sum_var[9],"innerHTML",'<b>'+min_pst+" m"+'</b>');
                        rep_vil10=min_pst+" m"
                      }
                  }
                  else{
                      domAttr.set(sum_var[9],"innerHTML",'<b>'+"No Data"+'</b>');
                      rep_vil10='';
                  }
                }
                else{
                  domAttr.set(sum_var[8],"innerHTML",'<b>'+"No Data"+'</b>');
                  domAttr.set(sum_var[9],"innerHTML",'<b>'+"No Data"+'</b>');
                  rep_vil9='';
                  rep_vil10='';
                }
                //m ends here


                var wqpar=["ph", "ec", "tds", "co3", "hco3", "cl", "no3", "so4", "f", "alkalinity", "ca", "mg", "th", "k"];
                window.wqpar_blck=["pH","Electrical Conductivity","Total Dissolved Solids","Carbonate","Bicarbonate","Chloride","Nitrate","Sulphate","Fluoride","Alkalinity","Calcium","Magnesium","Total Hardness","Potassium"];
                window.parameter_lables=["pH","Electrical Conductivity (micro S/cm)","Total Dissolved Solids (mg/Litre)","Carbonate (mg/Litre)","Bicarbonate (mg/Litre)","Chloride (mg/Litre)","Nitrate (mg/Litre)","Sulphate (mg/Litre)","Fluoride (mg/Litre)","Alkalinity (mg/Litre)","Calcium (mg/Litre)","Magnesium (mg/Litre)","Total Hardness (mg/Litre)","Potassium (mg/Litre)"];
                window.wq_tbl1_headings='';window.wq_tbl2_headings='';window.wq_tbl3_headings='';window.wq_tbl4_headings='';window.wq_tbl5_headings='';window.wq_tbl6_headings='';
                window.wq_tbl1_body='<tr>';window.wq_tbl2_body='<tr>';window.wq_tbl3_body='<tr>';window.wq_tbl4_body='<tr>';window.wq_tbl5_body='<tr>';window.wq_tbl6_body='<tr>';window.wq_tbl2_body1='<tr>';window.wq_restbl=''
                var t1row2='';var t2row2='';var t3row2='';var t4row2='';var t5row2='';var t6row2='';
                window.wq_header_text='';
                window.wqtbl='';
                for (var g=0;g<wqpar_blck.length;g++){
                  if(g<=0){
                    wq_tbl1_headings=wq_tbl1_headings+"<td class='ReportTable_subHdngs1' colspan='3'>"+wqpar_blck[g]+"</td>";
                    t1row2=t1row2+"<td class='ReportTable_subHdngs1'>Pre Monsoon</td>"+"<td class='ReportTable_subHdngs1'>During Monsoon</td>"+
                    "<td class='ReportTable_subHdngs1'>Post Monsoon</td>";
                  }
                  else if(g>0 && g<=3){
                    wq_tbl2_headings=wq_tbl2_headings+"<td class='ReportTable_subHdngs1' colspan='3'>"+wqpar_blck[g]+"</td>";
                    t2row2=t2row2+"<td class='ReportTable_subHdngs1'>Pre Monsoon</td>"+"<td class='ReportTable_subHdngs1'>During Monsoon</td>"+
                    "<td class='ReportTable_subHdngs1'>Post Monsoon</td>";
                  }
                  else if(g>3 && g<=6){
                    wq_tbl3_headings=wq_tbl3_headings+"<td class='ReportTable_subHdngs1' colspan='3'>"+wqpar_blck[g]+"</td>";
                    t3row2=t3row2+"<td class='ReportTable_subHdngs1'>Pre Monsoon</td>"+"<td class='ReportTable_subHdngs1'>During Monsoon</td>"+
                    "<td class='ReportTable_subHdngs1'>Post Monsoon</td>";
                  }
                  else if(g>6 && g<=9){
                    wq_tbl4_headings=wq_tbl4_headings+"<td class='ReportTable_subHdngs1' colspan='3'>"+wqpar_blck[g]+"</td>";
                    t4row2=t4row2+"<td class='ReportTable_subHdngs1'>Pre Monsoon</td>"+"<td class='ReportTable_subHdngs1'>During Monsoon</td>"+
                    "<td class='ReportTable_subHdngs1'>Post Monsoon</td>";
                  }
                  else if(g>9 && g<=12){
                    wq_tbl5_headings=wq_tbl5_headings+"<td class='ReportTable_subHdngs1' colspan='3'>"+wqpar_blck[g]+"</td>";
                    t5row2=t5row2+"<td class='ReportTable_subHdngs1'>Pre Monsoon</td>"+"<td class='ReportTable_subHdngs1'>During Monsoon</td>"+
                    "<td class='ReportTable_subHdngs1'>Post Monsoon</td>";
                  }
                  else{
                    wq_tbl6_headings=wq_tbl6_headings+"<td class='ReportTable_subHdngs1' colspan='3'>"+wqpar_blck[g]+"</td>";
                    t6row2=t6row2+"<td class='ReportTable_subHdngs1'>Pre Monsoon</td>"+"<td class='ReportTable_subHdngs1'>During Monsoon</td>"+
                    "<td class='ReportTable_subHdngs1'>Post Monsoon</td>";
                  }
                }
                t6row2=t6row2+"<td class='ReportTable_subHdngs1'>Pre Monsoon</td>"+"<td class='ReportTable_subHdngs1'>During Monsoon</td>"+
                "<td class='ReportTable_subHdngs1'>Post Monsoon</td>";

                wq_tbl1_headings=wq_tbl1_headings+"</tr><tr>"+t1row2+"</tr>";
                wq_tbl2_headings=wq_tbl2_headings+"</tr><tr>"+t2row2+"</tr>";
                wq_tbl3_headings=wq_tbl3_headings+"</tr><tr>"+t3row2+"</tr>";
                wq_tbl4_headings=wq_tbl4_headings+"</tr><tr>"+t4row2+"</tr>";
                wq_tbl5_headings=wq_tbl5_headings+"</tr><tr>"+t5row2+"</tr>";
                // wq_tbl6_headings=wq_tbl6_headings+"<td class='ReportTable_subHdngs1' colspan='3'>Suitable for Drinking or Irrigation use/Unsuitable</td>"+"</tr>"+
                // "<tr>"+t6row2+"</tr>";
                var wqlimits=[8.5,2000,2000,75,350,1000,45,400,1.5,600,200,100,600,20]; //6.5 base limit of pH, Na 200 Mg/l, EC-500,hco3 - 125
                var wqlimits_table=["No relaxation","2000","2000","75","125 - 350","1000","No relaxation","400","1.5","600","200","100","600","20"]; //6.5 base limit of pH, Na 200 Mg/l, EC-500,hco3 - 125
                //window.wqpar_blck=["pH","Electrical Conductivity","Total Dissolved Solids","Carbonate","Bicarbonate","Chloride","Nitrate","Sulphate","Fluoride","Alkalinity","Calcium","Magnesium","Total Hardness","Potassium"];

                var wq_acclimits_table=["6.5 - 8.5","500","500","75","125 - 350","250","45","200","1","200","75","30","200","20"]; //6.5 base limit of pH, Na 200 Mg/l, EC-500,hco3 - 125
                var wqjson={};
                var villagenames=[];
                var each_well_wq1=[];
                var each_well_wq2=[];
                var each_well_wq3=[];
                var tablecount=1;
                summ_selected_records1.features.forEach(function (feature,sv) {
                  if(feature.attributes.village_name!=null){villagenames.push(feature.attributes.village_name)}
                  var wqjson_rep1={};
                  var wqjson_rep2={};
                  var wqjson_rep3={};
                  wqpar.forEach(function(f){
                    if(wqjson[f] === undefined ){
                      wqjson[f]=[];
                    }
                    if(wqjson_rep1[f] === undefined ){
                      wqjson_rep1[f]=[];
                    }
                    if(wqjson_rep2[f] === undefined ){
                      wqjson_rep2[f]=[];
                    }
                    if(wqjson_rep3[f] === undefined ){
                      wqjson_rep3[f]=[];
                    }
                    wqjson[f].push(feature.attributes[f+"_pre_m"],feature.attributes[f+"_during_m"],feature.attributes[f+"_post_m"]);
                    wqjson_rep1[f].push(feature.attributes[f+"_pre_m"]);
                    wqjson_rep2[f].push(feature.attributes[f+"_during_m"]);
                    wqjson_rep3[f].push(feature.attributes[f+"_post_m"]);
                    //console.log([feature.attributes[f+"_pre_m"],feature.attributes[f+"_during_m"],feature.attributes[f+"_post_m"]]);
                  });

                  var wqresults3=[];
                  var c3=0;
                  for(var i=0;i<wqpar.length;i++){
                    var res=[]
                    if(i==0){
                      wqjson_rep3[wqpar[i]].forEach(function(p){
                        if(p!=null){
                          if(parseFloat(p)>=6.5){
                            res.push('N');
                          }
                          else{
                            res.push('Y');
                          }
                        }
                      });
                    }
                    wqjson_rep3[wqpar[i]].forEach(function(p){
                      if(p!=null){
                        if(parseFloat(p)<=wqlimits[i]){
                          res.push('N');
                        }
                        else{
                          res.push('Y');
                        }
                      }
                      else{
                        c3=c3+1;
                      }
                    });
                    if(res.includes('Y')){
                    wqresults3.push(wqpar[i]);
                  }
                  }
                  //console.log(wqresults1);
                  var rep_each_well;
                  if(wqresults3.length>0){
                    rep_each_well="Unsuitable - "
                    wqresults3.forEach(function(v){
                      rep_each_well=rep_each_well+wqpar_blck[wqpar.indexOf(v)]+', ';
                    });
                    rep_each_well=rep_each_well.slice(0,rep_each_well.length-2);
                    each_well_wq3.push(rep_each_well);
                  }
                  else{
                    if(c3!=14){rep_each_well="Suitable";
                    each_well_wq3.push(rep_each_well);}
                    else{
                        each_well_wq3.push("No Data");
                    }
                  }


                  var wqresults1=[];
                  var c1=0;
                  for(var i=0;i<wqpar.length;i++){
                    var res=[]
                    if(i==0){
                      wqjson_rep1[wqpar[i]].forEach(function(p){
                        if(p!=null){
                          if(parseFloat(p)>=6.5){
                            res.push('N');
                          }
                          else{
                            res.push('Y');
                          }
                        }
                      });
                    }
                    wqjson_rep1[wqpar[i]].forEach(function(p){
                      if(p!=null){
                        if(parseFloat(p)<=wqlimits[i]){
                          res.push('N');
                        }
                        else{
                          res.push('Y');
                        }
                      }
                      else{
                        c1=c1+1;
                      }
                    });
                    if(res.includes('Y')){
                    wqresults1.push(wqpar[i]);
                  }
                  }
                  //console.log(wqresults1);
                  var rep_each_well;
                  if(wqresults1.length>0){
                    rep_each_well="";
                    wqresults1.forEach(function(v){
                      rep_each_well=rep_each_well+wqpar_blck[wqpar.indexOf(v)]+', ';
                    });
                    rep_each_well=rep_each_well.slice(0,rep_each_well.length-2)+(wqresults1.length>1?' are ':' is ' )+'<b>NOT</b> within the Permissible Limits.';
                    each_well_wq1.push(rep_each_well);
                  }
                  else{
                    if(c1!=14){
                    rep_each_well="<b>Suitable</b> for Drinking or Irrigation use.";
                    each_well_wq1.push(rep_each_well);
                  }
                  else{
                    each_well_wq1.push('No Data');
                  }
                  }


                  var wqresults2=[];
                  var c2=0;
                  for(var i=0;i<wqpar.length;i++){
                    var res=[]
                    if(i==0){
                      wqjson_rep2[wqpar[i]].forEach(function(p){
                        if(p!=null){
                          if(parseFloat(p)>=6.5){
                            res.push('N');
                          }
                          else{
                            res.push('Y');
                          }
                        }
                      });
                    }
                    wqjson_rep2[wqpar[i]].forEach(function(p){
                      if(p!=null){
                        if(parseFloat(p)<=wqlimits[i]){
                          res.push('N');
                        }
                        else{
                          res.push('Y');
                        }
                      }
                      else{
                        c2=c2+1;
                      }
                    });
                    if(res.includes('Y')){
                    wqresults2.push(wqpar[i]);
                  }
                  }
                  // console.log(wqresults1);
                  var rep_each_well;
                  if(wqresults2.length>0){
                    rep_each_well="Unsuitable - "
                    wqresults2.forEach(function(v){
                      rep_each_well=rep_each_well+wqpar_blck[wqpar.indexOf(v)]+', ';
                    });
                    rep_each_well=rep_each_well.slice(0,rep_each_well.length-2);
                    each_well_wq2.push(rep_each_well);
                  }
                  else{
                    if(c2!=14){rep_each_well="Suitable";
                    each_well_wq2.push(rep_each_well);}
                    else{
                      each_well_wq2.push("No Data");
                    }
                  }
                  //alert(c1);
                  if(c1<13){
                    if(tablecount==1){
                    wq_header_text=wq_header_text+"<td style='font-size: 16px;'>"+'<div style="padding-top: 5px;text-align: center;"><span><b>Owner Name: </b></span>'+"<span>"+(feature.attributes["owner_name"]==null?'':akah_Tool.capitalize(feature.attributes["owner_name"]))+"</span>"+
                    '<span style="padding-left: 16px;"><b>Latitude: </b></span>'+"<span>"+(feature.attributes["y"]==null?'':feature.attributes["y"])+"</span>"+
                    '<span style="padding-left: 16px;"><b>Longitude: </b></span>'+'<span>'+(feature.attributes["x"]==null?'':feature.attributes["x"])+"</span></div>"+
                    '<div style="text-align: center;padding-top: 7px;"><span><b>Well Depth: </b></span>'+"<span>"+(feature.attributes["well_depth_meters"]==null?'':feature.attributes["well_depth_meters"].toFixed(2)+' m')+"</span>"+
                    '<span style="padding-left: 16px;"><b>Well ID: </b></span>'+"<span>"+(feature.attributes["uid"]==null?'':'OW'+feature.attributes["uid"])+"</span></div>";
                    wqpar.forEach(function(f,index){
                      if(wqresults1.includes(f)){
                        wq_tbl2_body1=wq_tbl2_body1+"<tr><td>"+(index+1)+"</td><td>"+parameter_lables[index]+"</td><td style='color:red'>"+(feature.attributes[f+"_pre_m"]==null?'':feature.attributes[f+"_pre_m"])+"</td><td>"+wq_acclimits_table[index]+"</td><td>"+wqlimits_table[index]+"</td></tr>";
                      }
                      else{
                        wq_tbl2_body1=wq_tbl2_body1+"<tr><td>"+(index+1)+"</td><td>"+parameter_lables[index]+"</td><td>"+(feature.attributes[f+"_pre_m"]==null?'':feature.attributes[f+"_pre_m"])+"</td><td>"+wq_acclimits_table[index]+"</td><td>"+wqlimits_table[index]+"</td></tr>";
                    }
                    });
                    wq_restbl='<div style="font-size: 14px;text-align:center;padding-top:2px;padding-bottom:2px"><span><b>Water Quality Status: </b><span>'+each_well_wq1[sv]+'<span></div>';
                    }
                    else if(tablecount==2){
                      wqtbl='<br><table class="akahReportTable"><tr>'+
                      "<td style='font-size: 16px;'>"+'<div style="padding-top: 5px;text-align: center;"><span><b>Owner Name: </b></span>'+"<span>"+(feature.attributes["owner_name"]==null?'':akah_Tool.capitalize(feature.attributes["owner_name"]))+"</span>"+
                      '<span style="padding-left: 16px;"><b>Latitude: </b></span>'+"<span>"+(feature.attributes["y"]==null?'':feature.attributes["y"])+"</span>"+
                      '<span style="padding-left: 16px;"><b>Longitude: </b></span>'+'<span>'+(feature.attributes["x"]==null?'':feature.attributes["x"])+"</span></div>"+
                      '<div style="text-align: center;padding-top: 7px;"><span><b>Well Depth: </b></span>'+"<span>"+(feature.attributes["well_depth_meters"]==null?'':feature.attributes["well_depth_meters"].toFixed(2)+' m')+"</span>"+
                      '<span style="padding-left: 16px;"><b>Well ID: </b></span>'+"<span>"+(feature.attributes["uid"]==null?'':'OW'+feature.attributes["uid"])+"</span></div>"+'</tr></table>'+
                      "<table class='akahReportTable2'>" +
                      "<tr><td class='ReportTable_subHdngs1' rowspan='2'>S.No</td>"+
                      "<td class='ReportTable_subHdngs1' rowspan='2'>Water Quality Parameter</td><td class='ReportTable_subHdngs1'>Reading</td>"+
                      "<td class='ReportTable_subHdngs1' rowspan='2'>Acceptable Limit <sup>1</sup></td>"+
                      "<td class='ReportTable_subHdngs1' rowspan='2'>Permissible Limit <sup>1</sup></td>"+
                      "<tr><td class='ReportTable_subHdngs1'>Pre-Monsoon</td></tr>";
                      wqpar.forEach(function(f,index){
                        if(wqresults1.includes(f)){
                        wqtbl=wqtbl+"<tr><td>"+(index+1)+"</td><td>"+parameter_lables[index]+"</td><td style='color:red'>"+(feature.attributes[f+"_pre_m"]==null?'':feature.attributes[f+"_pre_m"])+"</td><td>"+wq_acclimits_table[index]+"</td><td>"+wqlimits_table[index]+"</td></tr>";
                        }
                        else{
                        wqtbl=wqtbl+"<tr><td>"+(index+1)+"</td><td>"+parameter_lables[index]+"</td><td>"+(feature.attributes[f+"_pre_m"]==null?'':feature.attributes[f+"_pre_m"])+"</td><td>"+wq_acclimits_table[index]+"</td><td>"+wqlimits_table[index]+"</td></tr>";
                        }
                      });
                      wqtbl=wqtbl+"</table>"+
                      '<table class="akahReportTable" style="margin-bottom: 10px;"><tr><td>'+
                      '<div style="font-size: 14px;text-align:center;padding-top:2px;padding-bottom:2px"><span><b>Water Quality Status: </b><span>'+each_well_wq1[sv]+'<span></div>'+
                      '</td></tr></table>'+'<span>'+
                      '<span style="font-weight: 600;">Data Sources:</span>'+'<span style="padding-left: 12px;margin-top: 12px;"><b>1. </b> Bureau of Indian Standards</span>'+'</span>'+
                      '<br><br>';
                    }
                    tablecount=tablecount+1;
                  }
                  if (akahvillage === "Katepimpalgaon") {
                    window.waterQualityKt = '<div><div><h3 class="akahReportTableheadings">5. Ground Water Quality</h3></div> <table class="akahReportTable"><tbody><tr><td style="font-size: 13px;"><div style="padding-top: 5px;text-align: center;"><span><b>Owner Name: </b></span><span>Ram Sonoba Pawar</span><span style="padding-left: 16px;"><b>Latitude: </b></span><span>19.850537</span><span style="padding-left: 16px;"><b>Longitude: </b></span><span>74.9237892</span><span style="margin-left: 16px; "><b>Well Depth: </b></span><span>23.47 m</span><span style="padding-left: 16px;"><b>Well ID: </b></span><span>OW119</span> </div> <div style="padding-top: 5px;text-align: center;"><span><b>Owner Name: </b></span><span>Ashok Sugand Dhanad</span><span style="padding-left: 16px;"><b>Latitude: </b></span><span>19.8402513</span><span style="padding-left: 16px;"><b>Longitude: </b></span><span>74.9072416</span><span><b style="margin-left: 14px; ">Well Depth: </b></span><span>17.07 m</span><span style="padding-left: 16px;"><b>Well ID: </b></span><span>OW81</span></div></td></tr></tbody></table><table class="akahReportTable2"><tbody><tr><td class="ReportTable_subHdngs1" rowspan="2">S.No</td><td class="ReportTable_subHdngs1" rowspan="2">Water Quality Parameter</td><td class="ReportTable_subHdngs1" colspan="2">Readings (Pre-Monsoon)</td><td class="ReportTable_subHdngs1" rowspan="2">Acceptable Limit <sup>1</sup></td><td class="ReportTable_subHdngs1" rowspan="2">Permissible Limit <sup>1</sup></td></tr><tr><td class="ReportTable_subHdngs1">OW119</td> <td class="ReportTable_subHdngs1">OW81</td></tr><tr></tr><tr><td>1</td><td>pH</td><td>8.15</td><td>8.30</td><td>6.5 - 8.5</td><td>No relaxation</td></tr><tr><td>2</td><td>Electrical Conductivity (micro S/cm)</td><td>900</td><td>833</td><td>500</td><td>2000</td></tr><tr><td>3</td><td>Total Dissolved Solids (mg/Litre)</td><td>450</td><td>416</td><td>500</td><td>2000</td></tr><tr><td>4</td><td>Carbonate (mg/Litre)</td><td>25.00</td><td>0</td><td>75</td><td>75</td></tr><tr><td>5</td><td>Bicarbonate (mg/Litre)</td><td>300.00</td><td>300</td><td>125 - 350</td><td>125 - 350</td></tr><tr><td>6</td><td>Chloride (mg/Litre)</td><td>99.26</td><td>85.08</td><td>250</td><td>1000</td></tr><tr><td>7</td><td>Nitrate (mg/Litre)</td><td style="color:red">74.00</td><td style="color:red">77.80</td><td>45</td><td>No relaxation</td></tr><tr><td>8</td><td>Sulphate (mg/Litre)</td><td>14.80</td><td>37.20</td><td>200</td><td>400</td></tr><tr><td>9</td><td>Fluoride (mg/Litre)</td><td>0.75</td><td>0.83</td><td>1</td><td>1.5</td></tr><tr><td>10</td><td>Alkalinity (mg/Litre)</td><td>300.00</td><td>300.00</td><td>200</td><td>600</td></tr><tr><td>11</td><td>Calcium (mg/Litre)</td><td>83.33</td><td>83.33</td><td>75</td><td>200</td></tr><tr><td>12</td><td>Magnesium (mg/Litre)</td><td>35.00</td><td>30.00</td><td>30</td><td>100</td></tr><tr><td>13</td><td>Total Hardness (mg/Litre)</td><td>425.00</td><td>350.00</td><td>200</td><td>600</td></tr><tr><td>14</td><td>Potassium (mg/Litre)</td><td>8.60</td><td style="color: red; ">22.52</td><td>20</td><td>20</td></tr></tbody></table><table class="akahReportTable" style="margin-bottom: 10px;"><tbody><tr><td><div style="font-size: 14px;text-align:center;padding-top:2px;padding-bottom:2px"><span><b>Water Quality Status for OW119: </b><span>Nitrate is <b>NOT</b> within the Permissible Limits.<span></span></span></span></div><div style="font-size: 14px;text-align:center;padding-top:2px;padding-bottom:2px"><span><b>Water Quality Status for OW81: </b><span>Nitrate, Potassium are <b>NOT</b> within the Permissible Limits.<span></span></span></span></div> <div style="text-align: center; color: #9e3f07; "><b>*All the above water quality  limits are considered to verify the suitability of water for Drinking purposes.</b></div></td></tr></tbody></table><span><span style="font-weight: 600;">Data Sources:</span><span style="padding-left: 12px;margin-top: 12px;"><b>1. </b> Bureau of Indian Standards</span></span><br><br></div>'
                  }
                });


                var wqresults=[];
                for(var i=0;i<wqpar.length;i++){
                  var res=[]
                  if(i==0){
                    wqjson[wqpar[i]].forEach(function(p){
                      if(p!=null){
                        if(parseFloat(p)>=6.5){
                          res.push('N');
                        }
                        else{
                          res.push('Y');
                        }
                      }
                    });
                  }
                  wqjson[wqpar[i]].forEach(function(p){
                    if(p!=null){
                      if(parseFloat(p)<=wqlimits[i]){
                        res.push('N');
                      }
                      else{
                        res.push('Y');
                      }
                    }
                  });
                  if(res.includes('Y')){
                  wqresults.push(wqpar[i]);
                }
                }
                window.wqres=wqresults;
                if(wqresults.length>0){
                  rep_vil2="Unsuitable - "
                  wqresults.forEach(function(v){
                    rep_vil2=rep_vil2+wqpar_blck[wqpar.indexOf(v)]+', ';
                  });
                  rep_vil2=rep_vil2.slice(0,rep_vil2.length-2);
                  domAttr.set(sum_var[1],"innerHTML",'<b>'+rep_vil2+'</b>');

                }
                else{
                  domAttr.set(sum_var[1],"innerHTML",'<b>'+"Suitable"+'</b>');
                  rep_vil2="Suitable";
                }

                //domAttr.set(sum_var[0],"innerHTML",'<b>'+(new Set(villagenames).size)+'</b>');
                domAttr.set(sum_var[0],"innerHTML",'<b>'+summ_selected_records1.features.length+'</b>');
                rep_vil1=summ_selected_records1.features.length;
                var mp=new esri.geometry.Multipoint(summ_selected_records1.features[0].geometry.spatialReference);
                summ_selected_records1.features.forEach(function(f){mp.addPoint(f.geometry)});
                var query_summ1= new Query();
                query_summ1.outFields = ["OBJECTID","Total_Population_of_Village", "total_male_population_of_villag", "total_female_population_of_vill",
                "area_irrigated_by_source__in_he","wells_tube_wells_area__in_hecta",'al_dec2020','bl_dec2020','bu_dec2020','gl_dec2020','wb_dec2020',
                'Shape__Area','Major_Crops','area_irrigated_by_source__in_he','canals_area__in_hectares_','wells_tube_wells_area__in_hecta', 'annual_pet',
                'rnfl_mon', 'nonmon', 'oth_mon', 'oth_nonmon'];
                query_summ1.returnGeometry = true;
                query_summ1.geometry=mp;
                window.village_result=new QueryTask(akah_villages_layer.url).execute(query_summ1, function retrieve(summ){
                  window.village_def="1=1";
                  if(summ.features.length!=0){
                    village_def="OBJECTID ="+summ.features[0].attributes["OBJECTID"];
                    if(summ.features[0].attributes["area_irrigated_by_source__in_he"]!=0 && summ.features[0].attributes["area_irrigated_by_source__in_he"]!=null && summ.features[0].attributes['canals_area__in_hectares_']!=null){
                      domAttr.set(sum_var[5],"innerHTML",'<b>'+summ.features[0].attributes["area_irrigated_by_source__in_he"]+' ha'+'</b>');
                      rep_vil6=summ.features[0].attributes["area_irrigated_by_source__in_he"]+' ha';
                      rv['village_areairr_sw']=summ.features[0].attributes['canals_area__in_hectares_']+summ.features[0].attributes['area_irrigated_by_source__in_he']
                    }
                    else{
                      domAttr.set(sum_var[5],"innerHTML",'<b>'+"No Data"+'</b>');
                      rep_vil6=''
                      rv['village_areairr_sw']=''
                    }
                    if(summ.features[0].attributes["wells_tube_wells_area__in_hecta"]!=0 && summ.features[0].attributes["wells_tube_wells_area__in_hecta"]!=null){
                      domAttr.set(sum_var[6],"innerHTML",'<b>'+summ.features[0].attributes["wells_tube_wells_area__in_hecta"]+' ha'+'</b>');
                      rep_vil7=summ.features[0].attributes["wells_tube_wells_area__in_hecta"]+' ha';
                      rv['village_areairr_gw']=summ.features[0].attributes['wells_tube_wells_area__in_hecta'];
                    }
                    else{
                      domAttr.set(sum_var[6],"innerHTML",'<b>'+"No Data"+'</b>');
                      rep_vil7='';
                      rv['village_areairr_gw']='';
                    }
                    if(summ.features[0].attributes["Shape__Area"]!=0){
                      //domAttr.set(sum_var[6],"innerHTML",'<b>'+summ.features[0].attributes["Shape__Area"]+' ha'+'</b>');
                      rep_vil7_1=(summ.features[0].attributes["Shape__Area"]/10000).toFixed(2);
                    }
                    else{
                      //domAttr.set(sum_var[6],"innerHTML",'<b>'+"No Data"+'</b>');
                      rep_vil7_1='';
                    }
                    if(summ.features[0].attributes["Major_Crops"]!=null){
                      //domAttr.set(sum_var[6],"innerHTML",'<b>'+summ.features[0].attributes["Shape__Area"]+' ha'+'</b>');
                      rep_vil5=summ.features[0].attributes["Major_Crops"].split(',');
                      var e='';
                      if(rep_vil5.length<=5){
                        var maxlength=rep_vil5.length;
                      }
                      else{
                        var maxlength=5
                      }
                      for(var i=0;i<maxlength;i++){e=e+rep_vil5[i]+', ';}
                      rep_vil5=e.slice(0,e.length-2);
                      domAttr.set(sum_var[4],"innerHTML",'<b>'+rep_vil5+'</b>');
                    }
                    else{
                      domAttr.set(sum_var[4],"innerHTML",'<b>'+"No Data"+'</b>');
                      rep_vil5='';
                    }
                    if (summ.features[0].attributes["rnfl_mon"]!=null) {
                      rv['rainfall_monsoon_val'] = Number(summ.features[0].attributes["rnfl_mon"])
                    }
                    else{
                      rv['rainfall_monsoon_val'] = ''
                    }
                    if (summ.features[0].attributes["nonmon"]!=null) {
                      rv['rainfall_nonmonsoon_val'] = Number(summ.features[0].attributes["nonmon"])
                    }
                    else{
                      rv['rainfall_nonmonsoon_val'] = ''
                    }
                    if (summ.features[0].attributes["oth_mon"]!=null) {
                      rv['other_monsoon_val'] = Number(summ.features[0].attributes["oth_mon"])
                    }
                    else{
                      rv['other_monsoon_val'] = ''
                    }
                    if (summ.features[0].attributes["oth_nonmon"]!=null) {
                      rv['other_nonmonsoon_val'] = Number(summ.features[0].attributes["oth_nonmon"])
                    }
                    else{
                      rv['other_nonmonsoon_val'] = ''
                    }
                    rv['recharge_rainfall'] = Number(rv['rainfall_monsoon_val'] + rv['rainfall_nonmonsoon_val'])
                    rv['recharge_other'] = Number(rv['other_monsoon_val'] + rv['other_nonmonsoon_val'])
                    rv['total_gnd_wtr'] = Number(rv['recharge_rainfall'] + rv['recharge_other']).toFixed(2);

                  }
                  else{
                    domAttr.set(sum_var[5],"innerHTML",'<b>'+"No Data"+'</b>');
                    domAttr.set(sum_var[6],"innerHTML",'<b>'+"No Data"+'</b>');
                    rep_vil6='';
                    rep_vil7='';
                    rep_vil7_1='';
                  }
                  window.pop_Result=summ.features
                  var t=0;
                  var ma=0;
                  var fe=0;
                  var ee1=new esri.geometry.Polygon(summ.features[0].geometry.spatialReference);
                  window.ee1=ee1;
                  summ.features.forEach(function(f){
                  ee1.addRing(f.geometry.rings[0]);
                  t=t+f.attributes["Total_Population_of_Village"];
                  ma=ma+f.attributes["total_male_population_of_villag"];
                  fe=fe+f.attributes["total_female_population_of_vill"];
                  });
                  // var akahVillage_extent = new Extent(ee1.getExtent());
                  // akah_Tool.map.setExtent(akahVillage_extent);
                  //akah_villages_layer.setDefinitionExpression(village_def);
                if(t==0){
                  domAttr.set(sum_var[2],"innerHTML",'<b>'+'No Data'+'</b>');
                  rep_vil3='';
                }
                else{
                  domAttr.set(sum_var[2],"innerHTML",'<b>'+t+'</b>');
                  rep_vil3=t;
                }

                if(ma!=0 && fe!=0){
                  rv["village_population_male"]=ma;
                  rv["village_population_female"]=fe;
                  var divi=Math.round(fe*1000/ma);

                  domAttr.set(sum_var[3],"innerHTML",'<b>'+divi+":"+1000+'</b>');
                  rep_vil4=divi+":"+1000;
                }
                else{
                  rv["village_population_male"]='';
                  rv["village_population_female"]='';
                  domAttr.set(sum_var[3],"innerHTML",'<b>'+'No Data'+'</b>');
                  rep_vil4='';
                }


                query_summ1.outFields=["*"];
                query_summ1.geometry=summ.features[0].geometry;
                query_summ1.returnGeometry = false;
                //console.log(query_summ1);
                window.aqui=new QueryTask(akah_aqui.url).execute(query_summ1, function retrieve(summ){
                  window.aqui_response = summ;
                  if(summ.features.length>0){
                    domAttr.set(sum_var[10],"innerHTML",'<b>'+summ.features[0].attributes["aquifer"]+'</b>');
                    rep_vil11=summ.features[0].attributes["aquifer"];
                  }
                  else{
                    domAttr.set(sum_var[10],"innerHTML",'<b>'+"No Data"+'</b>');
                    rep_vil11='';
                  }
                });
                query_summ1.outFields=["BASIN"];
                //console.log(query_summ1);
                window.ws= new QueryTask(akah_watershed.url).execute(query_summ1, function retrieve(summ){
                  if(summ.features.length>0){
                    domAttr.set(sum_var[11],"innerHTML",'<b>'+summ.features[0].attributes["basin"]+'</b>');
                    rep_vil12=summ.features[0].attributes["basin"];
                  }
                  else{
                    domAttr.set(sum_var[11],"innerHTML",'<b>'+"No Data"+'</b>');
                    rep_vil12='';
                  }
                });
                // function results1(r){
                //   console.log(r[0]);
                //   console.log(r[1]);
                // }
                // var promisee=executeAll([aqui,ws]);
                // promisee.then(results1);
                query_summ1.outFields=["area_ha"];
                window.surWat=new QueryTask(akah_sw1.url).execute(query_summ1, function retrieve(summ){
                  if(summ.features.length>0){
                    var area_sw=0;
                    // rv["surface_water_bodies_count"]=summ.features.length;
                    summ.features.forEach(function(f){
                      if(f.attributes["area_ha"]!=null)
                        {area_sw=area_sw+f.attributes["area_ha"];}
                    });
                    if(akahvillage === 'Amrapur Gir'){area_sw = 217.01}
                    if(area_sw==0){
                      rv['sw_storage_volume_village'] = 'Not Applicable';
                      rv['sw_available_village'] = 'Not Applicable';
                      // domAttr.set(sum_var[7],"innerHTML",'<b>'+"N.A."+'</b>');
                      // rep_vil8="N.A."
                    }
                    else{
                      rv["surface_water_bodies_count"] = area_sw.toFixed(2);
                      rv['sw_storage_volume_village'] = (area_sw*1.5).toFixed(2);
                      rv['sw_available_village'] = area_sw*3-(rep_vil7_1*0.001*rep_vil7_1*summ.features[0].attributes['annual_pet']/rv['block_area_abs']);
                      // domAttr.set(sum_var[7],"innerHTML",'<b>'+area_sw+" ha m"+'</b>');
                      // rep_vil8=area_sw+" ha m"
                    }
                  }
                  else{
                    // domAttr.set(sum_var[7],"innerHTML",'<b>'+"N.A."+'</b>');
                    // rep_vil8="N.A."
                    rv['surface_water_bodies_count'] = "No Surface water bodies available";
                    rv['sw_storage_volume_village'] = 'Not Applicable';
                    rv['sw_available_village'] = 'Not Applicable';
                  }
                });
                // domAttr.set(sum_var[7],"innerHTML",'<b>'+"N.A."+'</b>');
                // rep_vil8="N.A.";
                var query_total_village=new Query()
                query_total_village.outFields=["VILLNAME","Shape_Area"]
                query_total_village.returnGeometry=false
                query_total_village.where = "state_1 like" +" "+"\'"+ akahstate +"\'"  + " " + "AND" + " " + "district_1 like" +" "+"\'"+ akahdistrict +"\'"+ " " + "AND" + " " + "Block_1 like" + " " + "\'" + akahblock + "\'"
                window.total_village_query=new QueryTask(akah_total_villages.url+"/0").execute(query_total_village, function retrieve(village_response) {
                  if(village_response.features.length>0){
                  var vill_area=[]
                  village_response.features.forEach(function(j){
                    vill_area.push(j.attributes["Shape_Area"])
                  })
                  rv['Largest_village']=village_response.features[vill_area.indexOf(Math.max(...vill_area))].attributes["VILLNAME"]
                  rv['Smallest_village']=village_response.features[vill_area.indexOf(Math.min(...vill_area))].attributes["VILLNAME"]
                  rv['Total_villages_in_block']=village_response.features.length
                }
                else{
                  rv['Largest_village']=''
                  rv['Smallest_village']=''
                  rv['Total_villages_in_block']=''
                }
                });


                query_summ1.outFields=["state","district","block","village","well_type"];
                window.wr=new QueryTask(akah_main_layer.url).execute(query_summ1, function retrieve(response) {
                      window.akah_wellRegistration_response = response;
                      if(response.features.length!=0){
                      var a=[];
                      akah_wellRegistration_response.features.forEach(function(i){a.push(i.attributes.village)});
                      var b=new Set(a);
                      var fin={};var f=[];var g=[];
                      b.forEach(function(l){fin[l]=0});
                      a.forEach(function(j){b.forEach(function(k){if(j==k){fin[k]=fin[k]+1}})});
                      b.forEach(function(q){f.push(fin[q]);g.push(q);});
                      window.wellFiltering =g[f.indexOf(Math.max(...f))];
                      akah_main_layer.setDefinitionExpression("state like" +" "+"\'"+ akah_wellRegistration_response.features[0].attributes.state +"\'"  + " " + "AND" + " " + "district like" +" "+"\'"+ akah_wellRegistration_response.features[0].attributes.district +"\'"+ " " + "AND" + " " + "block like" + " " + "\'" + akah_wellRegistration_response.features[0].attributes.block + "\'" + "AND" + " " + "village like" + " " + "\'" + g[f.indexOf(Math.max(...f))] + "\'");
                      akah_main_layer.setVisibility(false);
                    }
                    else{
                      window.wellFiltering ='';
                      akah_main_layer.setDefinitionExpression("1!=1");
                      akah_main_layer.setVisibility(false);
                    }

                    var dugWell_count = 0;var boreWell_count = 0;var villageBorewells = [];var villageDugwells = [];var total_well_count=0;
                    response.features.forEach(function(villagePointResponse){
                      if(villagePointResponse.attributes.village==wellFiltering){
                        if (villagePointResponse.attributes.well_type == "bore_well") {
                          boreWell_count = boreWell_count+1;
                          villageBorewells.push(villagePointResponse.attributes.village);window.villageBorewells = villageBorewells;
                        }
                        if (villagePointResponse.attributes.well_type == "well") {
                          dugWell_count = dugWell_count+1;
                          villageDugwells.push(villagePointResponse.attributes.village);window.villageDugwells = villageDugwells;
                        }
                        total_well_count=total_well_count+1;
                      }
                    })

                    window.dugWell_count = dugWell_count;window.boreWell_count = boreWell_count

                    });

                    window.rep_bar_chart='';window.rep_sown_piechart='';window.rep_irrig_piechart='';window.rep_village_irrig_piechart = '';window.rep_rainfall_chart='';
                    //rainfall block query
                    var queryrf=new Query();
                    queryrf.where="state like" +" "+"\'"+ akahstate +"\'"  + " " + "AND" + " " + "district like" +" "+"\'"+ akahdistrict +"\'"+ " " + "AND" + " " + "Block like" + " " + "\'" + akahblock + "\'";
                    queryrf.returnDistinctValues=false;
                    queryrf.returnGeometry=true;
                    //queryrf.outFields=["rnfl_mon","oth_mon","nonmon","oth_nonmon", "total","proj_dem","gw_alloc"];
                    queryrf.outFields=["*"];

                    window.rf_chart_query=new QueryTask(akah_block_layer.url).execute(queryrf,function(rf_response1){
                      window.rf_response1 = rf_response1;
                      rv['block_area_abs'] = rf_response1.features[0].attributes['block_area_ha']
                      query_summ13=new Query();
                      query_summ13.returnGeometry=false;
                      query_summ13.geometry=rf_response1.features[0].geometry;
                      //block layer extent for print map
                      // window.akahBlock_extent = new Extent(rf_response1.features[0].geometry.getExtent());
                      // akah_Tool.map.setExtent(akahBlock_extent);

                      window.block_wr=new QueryTask(akah_main_layer.url).execute(query_summ13, function retrieve(response) {
                        if(response.features.length!=0){
                          rv['block_wr_count']=response.features.length
                        }
                        else{
                          rv['block_wr_count']=''
                        }
                      });

                      if(rf_response1.features.length!=0){
                      window.rf_response = rf_response1.features[0];

                      //stacked bar chart code begins here.....
                      dojo.query('#gw_bar_chart').innerHTML('');
                      dojo.query('#barchartModule_new').style('display', 'block');

                      var bar_Chart_rep = new dojox.charting.Chart2D("gw_bar_chart", { enablePan: true, enableZoom: true });//Creates an object for displacement chart
                      // bar_Chart_rep.setTheme(theme); // Set the theme as Tufte
                      // bar_Chart_rep.addPlot("default", { type: "Columns", gap: 30, width: 20, labels:true, labelStyle:'outside', font: "normal bold bold 14px TimesnewRoman"  });  // Add the only/default plot
                      window.bar_Chart_rep = '';
                      var natural_discharge = 670.68//Number(rf_response.attributes['res'].toFixed(2));
                      var gwr_res = Number(rf_response.attributes['res']);
                      var gwr_total = Number(rf_response.attributes['gw_alloc']);
                      var gwr_draftIrr = Number(rf_response.attributes['draft_irrg']);
                      var gwr_resDom =Number(rf_response.attributes['res_dom']);

                      bar_Chart_rep.addPlot("stackedColumnsPlot", {
                          type: StackedColumns,
                          gap:30,
                          lines: true,
                          areas: true,
                          markers: true,
                          labels: true,
                          labelStyle:"outside",
                          /* maxBarSize: 35, */
                          tension: "2"
                      });
                      bar_Chart_rep.addAxis("x", {
                                            dropLabels: false,
                                            labelSizeChange: true,
                                            // rotation:-20,
                                            majorTicks:true,
                                            majorTickStep:1,
                                            minorTicks:false,
                                            font: "normal normal bold 12px Tahoma",
                                            fontColor: "black",
                                            labels: [{"value":1,"text":"Net GW Availability"},{"value":2,"text":"Net Utilization"},{"value":3,"text":"GW for future Use"}]
                      });
                      bar_Chart_rep.addAxis("y", {title:"Volume(Ham)",
                        fixLower: "major",
                        fixUpper: "major",
                        includeZero: true,
                        majorTickStep:2500,
                        minorTickStep:500,
                        max: 15000,
                        vertical: true
                      });
                      bar_Chart_rep.addSeries("gw",[12743, null, null] ,
                       {

                          plot: "stackedColumnsPlot",
                          stroke: {
                              color: "#FFFFFF" ,

                          },
                          fill: "blue"
                      });
                      bar_Chart_rep.addSeries("domestic", [null, 8602.38, null], {
                          plot: "stackedColumnsPlot",
                          stroke: {
                              color: "#FFFFFF"
                          },
                          fill: "#078807"
                      });
                      bar_Chart_rep.addSeries("irrigation", [null, 487.65, null], {
                          plot: "stackedColumnsPlot",
                          stroke: {
                              color: "#FFFFFF"
                          },
                          fill: "rgb(251, 208, 10)"
                      });
                      bar_Chart_rep.addSeries("futureUse", [null, null, 3653], {
                          plot: "stackedColumnsPlot",
                          stroke: {
                              color: "#FFFFFF"
                          },
                          fill: "maroon"
                      });
                      new Tooltip(bar_Chart_rep, "stackedColumnsPlot");
                      // var barChartData = [natural_discharge, gwr_res, gwr_total, gwr_draftIrr, gwr_resDom];
                      // var chartData_1 = [{ y: gwr_res,fill: "blue", tooltip:gwr_res },{ y: natural_discharge,fill: "blue", tooltip:natural_discharge },{ y: gwr_total, fill: "blue", tooltip: gwr_total },{ y: gwr_draftIrr,fill: "orange", tooltip:gwr_draftIrr },{ y:gwr_resDom ,fill: "orange", tooltip:gwr_resDom }];
                      // bar_Chart_rep.addAxis("x", { fixLower: "minor", fixUpper: "minor", natural: true, vertical: false, title: "", titleFontColor: "black", titleOrientation: "away",font:"normal normal bold 7pt Arial", fontColor:"black", labels: [{value: 1,text: '*Net GW Availability', fill:"green"}, {value: 2,text: 'Natural Discharge', fill:"green"}, {value: 3,text:'Future GW Availability', fill:"blue"}, {value: 4, text: 'Irrigation Draft', fill:"blue"}, {value: 5,text:"Domestic Draft", fill:"blue"}] });
                      // bar_Chart_rep.addAxis("y", {  min: Math.min.apply(null, barChartData), max: Math.max.apply(null, barChartData), vertical: true, fixLower: "major", fixUpper: "major", includeZero: true, title: "Ham", titleFontColor: "black",font:"normal normal bold 7pt Arial",fontColor:"black" });
                      // bar_Chart_rep.addSeries("Series A", chartData_1); //Adds Displacement Data to chart

                      //new Highlight(bar_Chart_rep, "default");
                      //new Tooltip(bar_Chart_rep, "default");
                      bar_Chart_rep.render();
                      // bar_Chart_rep.resize(750,250);

                      rep_bar_chart=rep_bar_chart+'<div style="display:inline-flex;padding-left:50px"><div>'+dojo.query('#barchartModule_new').innerHTML()+'</div>'+
                      "</div><br>"+
                      '<div style="display:inline-flex;padding-left:50px;padding-top:7px">'+
                      '<div style="display:inline-flex;"><div style="width:17px;height:16px;border:1.6px solid white;background-color:blue;border-radius: 4px;"></div><span style="padding-left:5px;">*Net GW Availability</span></div>'+
                      '<div style="display:inline-flex;padding-left:10px;"><div style="width:17px;height:16px;border:1.6px solid white;background-color:orange;border-radius: 4px;"></div><span style="padding-left:5px;">Domestic Draft</span></div>'+
                      '<div style="display:inline-flex;padding-left:10px;"><div style="width:17px;height:16px;border:1.6px solid white;background-color: #078807;border-radius: 4px;"></div><span style="padding-left:5px;">Irrigation Draft</span></div>'+
                      '<div style="display:inline-flex;padding-left:10px;"><div style="width:17px;height:16px;border:1.6px solid white;background-color: maroon;border-radius: 4px;"></div><span style="padding-left:5px;">GW for future use</span></div></div>'+
                      '<br><br>';
                      dojo.query('#barchartModule_new').style('display', 'none');
                      //stacked bar chart code ends here..... along with integrating legend...

                      dojo.query('#rainfall_chart').innerHTML('');
                      dojo.query('#line_rainfall_chart').style('display', 'block');
                      /*Rainfall code beginning for generating Rainfall Charts*/
                      var i=1;
                      a1 =[];
                      actual_rain1 = [];
                      norm_rain1 = [];
                      rain_dev1 = [];
                      rain_months1 = [];
                      rain_tooltip_arr_11 = [];
                      var rainfall_values=['jan_2019_actual__mm','jan_2019_normal__mm','jan_2019_deviation__mm','feb_2019_actual__mm','feb_2019_normal__mm','feb_2019_deviation__mm','mar_2019_actual__mm','mar_2019_normal__mm','mar_2019_deviation__mm','apr_2019_actual__mm','apr_2019_normal__mm','apr_2019_deviation__mm','may_2019_actual__mm','may_2019_normal__mm','may_2019_deviation__mm','jun_2019_actual__mm','jun_2019_normal__mm','jun_2019_deviation__mm','jul_2019_actual__mm','jul_2019_normal__mm','jul_2019_deviation__mm','aug_2019_actual__mm','aug_2019_normal__mm','aug_2019_deviation__mm','sep_2019_actual__mm','sep_2019_normal__mm','sep_2019_deviation__mm','oct_2019_actual__mm','oct_2019_normal__mm','oct_2019_deviation__mm','nov_2019_actual__mm','nov_2019_normal__mm','nov_2019_deviation__mm','dec_2019_Actual__mm','dec_2019_normal__mm','dec_2019_deviation__mm','jan_2020_actual__mm','jan_2020_normal__mm','jan_2020_deviation__mm'];
                      rainfall_values.forEach(function(evt, index){
                          var fieldname = evt;
                          a1.push(Number(rf_response.attributes[fieldname]));//window.a = a;
                          if (fieldname.includes('_actual')) {
                            rain_tooltip_arr_11.push({text: fieldname.slice(0,8).toUpperCase(), value: (rf_response.attributes[fieldname])*(-1)});//window.rain_tooltip_arr_1 = rain_tooltip_arr_1;
                            actual_rain1.push(Number(rf_response.attributes[fieldname]));//window.actual_rain = actual_rain;
                          }
                          else if (fieldname.includes('_normal')) {
                            rain_months1.push({text: fieldname.slice(0,8).toUpperCase(), value: i});//window.rain_months = rain_months;
                            norm_rain1.push(Number(rf_response.attributes[fieldname]));//window.norm_rain = norm_rain;
                            i++;
                          }
                          else if (fieldname.includes('_deviation')) {
                            rain_dev1.push(Number(rf_response.attributes[fieldname])); //window.rain_dev = rain_dev;
                          }
                      });

                      if (akahdistrict === 'Aurangabad') {
                        actual_rain1=[605.25,592.06,714.71,686.51,438.01,826.43,862.41];
                        rain_dev1=[-155.65,-168.84,-46.19,-74.39,-322.89,65.53,101.51]
                        norm_rain1=[760.9,760.9,760.9,760.9,760.9,760.9,760.9];// var rain_dev2=
                      }
                      else if (akahdistrict === 'Junagadh') {
                        actual_rain1=[970.37,750.88,948.82,885.38,904.71,1322.86,1553.63];
                        rain_dev1=[-155.65,-168.84,-46.19,-74.39,-322.89,65.53,101.51]
                        norm_rain1=[835,835,835,835,835,835,835];
                      }


                      /*call the function to prepare rainfall chart*/
                      if(rain_months1.length>0){
                        rain_chart1 = new Chart("rainfall_chart");
                        // Set the theme
                        rain_chart1.setTheme(theme);
                        // Add the only/default plot
                        rain_chart1.addPlot("default", {
                            type: LinesPlot,
                            // hAxis: "x",
                            // vAxis: "y",
                            markerSize: 1,
                            markers: true,
                            tension: "S",
                            rotation: 180
                        });
                        // gwl = gwl.reverse();
                        rain_chart1.addAxis("x", {fixLower: "major", fixUpper: "major", natural: false, vertical: false, title: "YEAR", titleFontColor: "darkblue", labels: [{text:"2014",value:1},{text:"2015",value:2},{text:"2016",value:3},{text:"2017",value:4},{text:"2018",value:5},{text:"2019",value:6},{text:"2020",value:7}], rotation: 90, titleOrientation: "away", majorLabels: true,majorTicks:true,majorTickStep:1,font:"normal normal bold 7pt Arial",
                        fontColor:"black"});
                        rain_chart1.addAxis("y", { min: 0, max: 1000/*Math.max.apply(null, actual_rain1)*/,vertical: true, fixLower: "minor", fixUpper: "minor", title: "Rainfall(in mm)", titleFontColor: "darkblue",font:"normal normal bold 7pt Arial",
                        fontColor:"black"});
                        // gwl.setTransform(chart.rotategAt(rotate, x,y));Math.max.apply(null, a)
                        rain_chart1.addSeries("Actual Rainfall", actual_rain1); //min: 0, max: Math.max.apply(null, a),
                        rain_chart1.addSeries("Normal Rainfall", norm_rain1);
                        // rain_chart1.addSeries("Deviation", rain_dev1);

                        // var tip = new Tooltip(rain_chart1,"default", {
                        //        text: function(o){
                        //           return rain_tooltip_arr_11[o.x-1].text + ":"+o.y;
                        //           // if (o.y == tooltip_arr[o.x-1].value) {
                        //           //   return tooltip_arr[o.x-1].text + ":"+o.y;
                        //           // }
                        //        }
                        // });//ticks: { max:  Math.min.apply(null, a), min:0,reverse: false}
                        //var mag = new Magnify(rain_chart1,"default");
                         //min: Math.min.apply(null, a), max: Math.max.apply(null, a),// var legend = new dojox.charting.widget.Legend({ chart: chart }, "legend");
                        rain_chart1.render();
                        rain_chart1.resize(600,250);
                      }

                      rep_rainfall_chart=rep_rainfall_chart+'<div style="display:inline-flex;padding-left:90px"><div>'+dojo.query('#line_rainfall_chart').innerHTML()+'</div>'+
                      "</div><br>"+

                      "<div style='display:inline-flex;padding-left: 125px;padding-top:7px'>"+
                      "<div style='display:inline-flex;'>"+
                      "<div style='width:17px;height:16px;border:1.6px solid white;background-color:#613e04;border-radius: 4px;'></div>"+
                      "<span style='padding-left:5px;'>Normal Rainfall</span></div>"+

                      "<div style='display:inline-flex;padding-left:10px;'>"+
                      "<div style='width:17px;height:16px;border:1.6px solid white;background-color:#2a6ead;border-radius: 4px'></div>"+
                      "<span style='padding-left:5px;'>Actual Rainfall</span></div>"+

                      // "<div style='display:inline-flex;padding-left:10px;'>"+
                      // "<div style='width:17px;height:16px;border:1.6px solid white;background-color:#0e3961;border-radius: 4px'></div>"+
                      // "<span style='padding-left:5px;'>Deviation</span></div>"+
                      "</div>";

                      dojo.query('#line_rainfall_chart').style('display', 'none');



                      // var promisee=executeAll([aqui,ws]);
                      var query_summ1=new Query();
                      query_summ1.geometry=rf_response1.features[0].geometry;
                      query_summ1.outFields=["area_ha"];
                      window.surWat1=new QueryTask(akah_sw1.url).execute(query_summ1, function retrieve(summ){
                        if(summ.features.length>0){
                          var area_sw=0;
                          // rv["surface_water_bodies_count_block"]=summ.features.length;
                          summ.features.forEach(function(f){
                            if(f.attributes["area_ha"]!=null)
                              {area_sw=area_sw+f.attributes["area_ha"];}
                          });
                          if(akahblock === 'Malia'){area_sw = 914.24;}
                          if(area_sw==0){
                            // domAttr.set(sum_var[7],"innerHTML",'<b>'+"N.A."+'</b>');
                            // rep_vil8="N.A."
                            rv["surface_water_bodies_volume"]='Not Applicable'
                            rv["storage_water_available_block"]='Not Applicable'
                            rv["surface_water_bodies_count_block"]='No Surface water bodies available'
                          }
                          else{
                            // domAttr.set(sum_var[7],"innerHTML",'<b>'+area_sw+" ha m"+'</b>');
                            // rep_vil8=area_sw+" ha m"
                            rv["surface_water_bodies_count_block"]=area_sw;
                            rv["surface_water_bodies_volume"]=(area_sw*1.5).toFixed(2)
                            rv["storage_water_available_block"]=((rv["surface_water_bodies_volume"]*3)-(0.001*rf_response.attributes["block_area_ha"]*(rf_response.attributes["pet_jan_2020"]+rf_response.attributes["pet_feb_2020"]+rf_response.attributes["pet_mar_2020"]+
                            rf_response.attributes["pet_apr_2020"]+rf_response.attributes["pet_jun_2020"]+rf_response.attributes["pet_jul_2020"]+rf_response.attributes["pet_aug_2020"]+rf_response.attributes["pet_sep_2020"]+
                            rf_response.attributes["pet_oct_2020"]+rf_response.attributes["pet_nov_2020"]+rf_response.attributes["pet_dec_2020"]))).toFixed(2)
                          }
                        }
                        else{
                          // domAttr.set(sum_var[7],"innerHTML",'<b>'+"N.A."+'</b>');
                          // rep_vil8="N.A."
                          rv["surface_water_bodies_volume"]='Not Applicable'
                          rv["storage_water_available_block"]='Not Applicable'
                          rv["surface_water_bodies_count_block"]='No Surface water bodies available'
                        }
                      });

                      /*
                      .reporttablestyle_aqui tr td{
                      padding: 5px !important;
                        border: 0.1px solid #CDD4DF !important;
                        border-collapse: collapse !important;
                      } */



                        var queryfutureScenario= new esri.tasks.Query();
                        window.queryfutureScenario = queryfutureScenario;
                        queryfutureScenario.where = "1=1"
                        queryfutureScenario.geometry = rf_response1.features[0].geometry.getCentroid()
                        queryfutureScenario.returnGeometry = true
                        queryfutureScenario.outFields = ["ws2024tl","ws3024tl","ws4024tl","ws2028tl","ws3028tl","ws4028tl","ws2038tl","ws3038tl","ws4038tl","ws2024cl","ws3024cl","ws4024cl","ws2028cl","ws3028cl","ws4028cl","ws2038cl","ws3038cl","ws4038cl","ut2024tl","ut3024tl","ut4024tl","ut2028tl","ut3028tl","ut4028tl","ut2038tl","ut3038tl","ut4038tl","ut2024cl"    ,"ut3024cl","ut4024cl","ut2028cl","ut3028cl","ut4028cl","ut2038cl","ut3038cl","ut4038cl","bt2024tl","bt3024tl","bt4024tl","bt2028tl","bt3028tl","bt4028tl","bt2038tl","bt3038tl","bt4038tl","bt2024cl","bt3024cl","bt4024cl","bt2028cl","bt3028cl","bt4028cl","bt2038cl","bt3038cl","bt4038cl","bt2024ul","bt3024ul","bt4024ul","bt2028ul","bt3028ul","bt4028ul","bt2038ul","bt3038ul","bt4038ul","sv2024tl","sv3024tl","sv4024tl","sv2028tl","sv3028tl","sv4028tl","sv2038tl","sv3038tl","sv4038tl","sv2024cl","sv3024cl","sv4024cl","sv2028cl","sv3028cl","sv4028cl","sv2038cl","sv3038cl","sv4038cl","sv2024ul","sv3024ul","sv4024ul","sv2028ul","sv3028ul","sv4028ul","sv2038ul","sv3038ul","sv4038ul"]
                        window.querytask_futureScenario=new QueryTask(futureScenario_layer.url).execute(queryfutureScenario, function retrieve(futureScenarionResponse){
                        window.futureScenarionResponse = futureScenarionResponse;


                        window.futureScenario_checklist ={ title: "",type: "html",data: ""}

                        futureScenario_checklist.data = futureScenario_checklist.data+ "<h2>2. Future Scenario(Aquaduct 3.0)</h2>" + "<h3 class='noteClassReport'>a. Future</h3>"+
                        "<table style='width:100%;margin-top: 1.5%;border-collapse:collapse;font-family:Calibri;font-size:1.19em' class='reporttablestyle_aqui summary'><tr style='background-color: aliceblue;'><td colspan='2'></td><td><b>Optimistic</b></td><td><b>Business As Usual</b></td><td><b>Pessimistic</b></td></tr>"+
                        "<tr><td rowspan='3' style='background-color:aliceblue;'><b>Water Stress</b></td><td>2020</td><td>"+futureScenarionResponse.features[0].attributes.ws2024tl+"</td><td>"+futureScenarionResponse.features[0].attributes.ws2028tl+"</td><td>"+futureScenarionResponse.features[0].attributes.ws2038tl+"</td></tr>"+
                        "<tr><td>2030</td><td>"+futureScenarionResponse.features[0].attributes.ws3024tl+"</td><td>"+futureScenarionResponse.features[0].attributes.ws3028tl+"</td><td>"+futureScenarionResponse.features[0].attributes.ws3038tl+"</td></tr>"+
                        "<tr><td>2040</td><td>"+futureScenarionResponse.features[0].attributes.ws4024tl+"</td><td>"+futureScenarionResponse.features[0].attributes.ws4028tl+"</td><td>"+futureScenarionResponse.features[0].attributes.ws4038tl+"</td></tr>"+
                        "<tr><td rowspan='3' style='background-color:aliceblue;'><b>Seasonal Variability</b></td><td>2020</td><td>"+futureScenarionResponse.features[0].attributes.sv2024tl+"</td><td>"+futureScenarionResponse.features[0].attributes.sv2028tl+"</td><td>"+futureScenarionResponse.features[0].attributes.sv2038tl+"</td></tr>"+
                        "<tr><td>2030</td><td>"+futureScenarionResponse.features[0].attributes.sv3024tl+"</td><td>"+futureScenarionResponse.features[0].attributes.sv3028tl+"</td><td>"+futureScenarionResponse.features[0].attributes.sv3038tl+"</td></tr>"+
                        "<tr><td>2040</td><td>"+futureScenarionResponse.features[0].attributes.sv3024tl+"</td><td>"+futureScenarionResponse.features[0].attributes.sv3028tl+"</td><td>"+futureScenarionResponse.features[0].attributes.sv3038tl+"</td></tr>"+
                        "<tr><td rowspan='3' style='background-color:aliceblue;'><b>Water Demand</b></td><td>2020</td><td>"+futureScenarionResponse.features[0].attributes.ut2024tl+"</td><td>"+futureScenarionResponse.features[0].attributes.ut2028tl+"</td><td>"+futureScenarionResponse.features[0].attributes.ut2038tl+"</td></tr>"+
                        "<tr><td>2030</td><td>"+futureScenarionResponse.features[0].attributes.ut3024tl+"</td><td>"+futureScenarionResponse.features[0].attributes.ut3028tl+"</td><td>"+futureScenarionResponse.features[0].attributes.ut3038tl+"</td></tr>"+
                        "<tr><td>2040</td><td>"+futureScenarionResponse.features[0].attributes.ut4024tl+"</td><td>"+futureScenarionResponse.features[0].attributes.ut4028tl+"</td><td>"+futureScenarionResponse.features[0].attributes.ut4038tl+"</td></tr>"+
                        "<tr><td rowspan='3' style='background-color:aliceblue;'><b>Water Supply</b></td><td>2020</td><td>"+futureScenarionResponse.features[0].attributes.bt2024tl+"</td><td>"+futureScenarionResponse.features[0].attributes.bt2028tl+"</td><td>"+futureScenarionResponse.features[0].attributes.bt2038tl+"</td></tr>"+
                        "<tr><td>2030</td><td>"+futureScenarionResponse.features[0].attributes.bt3024tl+"</td><td>"+futureScenarionResponse.features[0].attributes.bt3028tl+"</td><td>"+futureScenarionResponse.features[0].attributes.bt3038tl+"</td></tr>"+
                        "<tr><td>2040</td><td>"+futureScenarionResponse.features[0].attributes.bt4024tl+"</td><td>"+futureScenarionResponse.features[0].attributes.bt4028tl+"</td><td>"+futureScenarionResponse.features[0].attributes.bt4038tl+"</td></tr>"+
                        "</table>"+ "<h3 class='noteClassReport'>b. Change from Baseline</h3>"+
                        "<table style='width:100%;margin-top: 1.5%;border-collapse:collapse;font-family:Calibri;font-size:1.19em' class='reporttablestyle_aqui summary'><tr style='background-color: aliceblue;'><td colspan='2'></td><td><b>Optimistic</b></td><td><b>Business As Usual</b></td><td><b>Pessimistic</b></td></tr>"+
                        "<tr><td rowspan='3' style='background-color:aliceblue;'><b>Water Stress</b></td><td>2020</td><td>"+futureScenarionResponse.features[0].attributes.ws2024cl+"</td><td>"+futureScenarionResponse.features[0].attributes.ws2028cl+"</td><td>"+futureScenarionResponse.features[0].attributes.ws2038cl+"</td></tr>"+
                        "<tr><td>2030</td><td>"+futureScenarionResponse.features[0].attributes.ws3024cl+"</td><td>"+futureScenarionResponse.features[0].attributes.ws3028cl+"</td><td>"+futureScenarionResponse.features[0].attributes.ws3038cl+"</td></tr>"+
                        "<tr><td>2040</td><td>"+futureScenarionResponse.features[0].attributes.ws4024cl+"</td><td>"+futureScenarionResponse.features[0].attributes.ws4028cl+"</td><td>"+futureScenarionResponse.features[0].attributes.ws4038cl+"</td></tr>"+
                        "<tr><td rowspan='3' style='background-color:aliceblue;'><b>Seasonal Variability</b></td><td>2020</td><td>"+futureScenarionResponse.features[0].attributes.sv2024cl+"</td><td>"+futureScenarionResponse.features[0].attributes.sv2028cl+"</td><td>"+futureScenarionResponse.features[0].attributes.sv2038cl+"</td></tr>"+
                        "<tr><td>2030</td><td>"+futureScenarionResponse.features[0].attributes.sv3024cl+"</td><td>"+futureScenarionResponse.features[0].attributes.sv3028cl+"</td><td>"+futureScenarionResponse.features[0].attributes.sv3038cl+"</td></tr>"+
                        "<tr><td>2040</td><td>"+futureScenarionResponse.features[0].attributes.sv4024cl+"</td><td>"+futureScenarionResponse.features[0].attributes.sv4028cl+"</td><td>"+futureScenarionResponse.features[0].attributes.sv4038cl+"</td></tr>"+
                        "<tr><td rowspan='3' style='background-color:aliceblue;'><b>Water Demand</b></td><td>2020</td><td>"+futureScenarionResponse.features[0].attributes.ut2024cl+"</td><td>"+futureScenarionResponse.features[0].attributes.ut2028cl+"</td><td>"+futureScenarionResponse.features[0].attributes.ut2038cl+"</td></tr>"+
                        "<tr><td>2030</td><td>"+futureScenarionResponse.features[0].attributes.ut3024cl+"</td><td>"+futureScenarionResponse.features[0].attributes.ut3028cl+"</td><td>"+futureScenarionResponse.features[0].attributes.ut3038cl+"</td></tr>"+
                        "<tr><td>2040</td><td>"+futureScenarionResponse.features[0].attributes.ut4024cl+"</td><td>"+futureScenarionResponse.features[0].attributes.ut4028cl+"</td><td>"+futureScenarionResponse.features[0].attributes.ut4038cl+"</td></tr>"+
                        "<tr><td rowspan='3' style='background-color:aliceblue;'><b>Water Supply</b></td><td>2020</td><td>"+futureScenarionResponse.features[0].attributes.bt2024cl+"</td><td>"+futureScenarionResponse.features[0].attributes.bt2028cl+"</td><td>"+futureScenarionResponse.features[0].attributes.bt2038cl+"</td></tr>"+
                        "<tr><td>2030</td><td>"+futureScenarionResponse.features[0].attributes.bt3024cl+"</td><td>"+futureScenarionResponse.features[0].attributes.bt3028cl+"</td><td>"+futureScenarionResponse.features[0].attributes.bt3038cl+"</td></tr>"+
                        "<tr><td>2040</td><td>"+futureScenarionResponse.features[0].attributes.bt4024cl+"</td><td>"+futureScenarionResponse.features[0].attributes.bt4028cl+"</td><td>"+futureScenarionResponse.features[0].attributes.bt4038cl+"</td></tr>"+
                        "</table>"+ "<h3 class='noteClassReport'>c. Uncertainity</h3>"+
                        "<table style='width:100%;margin-top: 1.5%;border-collapse:collapse;font-family:Calibri;font-size:1.19em' class='reporttablestyle_aqui summary'><tr style='background-color: aliceblue;'><td colspan='2'></td><td><b>Optimistic</b></td><td><b>Business As Usual</b></td><td><b>Pessimistic</b></td></tr>"+
                        "<tr><td rowspan='3' style='background-color:aliceblue;'><b>Seasonal Variability</b></td><td>2020</td><td>"+futureScenarionResponse.features[0].attributes.sv2024ul+"</td><td>"+futureScenarionResponse.features[0].attributes.sv2028ul+"</td><td>"+futureScenarionResponse.features[0].attributes.sv2038ul+"</td></tr>"+
                        "<tr><td>2030</td><td>"+futureScenarionResponse.features[0].attributes.sv3024ul+"</td><td>"+futureScenarionResponse.features[0].attributes.sv3028ul+"</td><td>"+futureScenarionResponse.features[0].attributes.sv3038ul+"</td></tr>"+
                        "<tr><td>2040</td><td>"+futureScenarionResponse.features[0].attributes.sv4024ul+"</td><td>"+futureScenarionResponse.features[0].attributes.sv4028ul+"</td><td>"+futureScenarionResponse.features[0].attributes.sv4038ul+"</td></tr>"+
                        "<tr><td rowspan='3' style='background-color:aliceblue;'><b>Water Supply</b></td><td>2020</td><td>"+futureScenarionResponse.features[0].attributes.bt2024ul+"</td><td>"+futureScenarionResponse.features[0].attributes.bt2028ul+"</td><td>"+futureScenarionResponse.features[0].attributes.bt2038ul+"</td></tr>"+
                        "<tr><td>2030</td><td>"+futureScenarionResponse.features[0].attributes.bt3024ul+"</td><td>"+futureScenarionResponse.features[0].attributes.bt3028ul+"</td><td>"+futureScenarionResponse.features[0].attributes.bt3038ul+"</td></tr>"+
                        "<tr><td>2040</td><td>"+futureScenarionResponse.features[0].attributes.bt4024ul+"</td><td>"+futureScenarionResponse.features[0].attributes.bt4028ul+"</td><td>"+futureScenarionResponse.features[0].attributes.bt4038ul+"</td></tr>"+
                        "</table><p class='sourceStyle'><i><b>Source: </b> Aquaduct 3.0</i></p>";
                        //dataForReport.push(futureScenario_checklist);
                        });




                      var querybaselineannualLayer= new esri.tasks.Query(); window.querybaselineannualLayer = querybaselineannualLayer;
                      querybaselineannualLayer.where = "1=1"
                      querybaselineannualLayer.geometry = rf_response1.features[0].geometry.getCentroid()
                      querybaselineannualLayer.returnGeometry = false

                      querybaselineannualLayer.outFields = ["bws_label","bwd_label","iav_label","sev_label","gtd_label","rfr_label","cfr_label","drr_label","ucw_label","cep_label","udw_label","usa_label","rri_label"]
                      window.querytask_baseline= new QueryTask(baselineannual_layer.url).execute(querybaselineannualLayer, function(baseline_response){
                      window.baseline_response = baseline_response


                    window.baselinannual_checklist = {
                      title: "",
                    type: "html",
                    data: ""
                  }

                  baselinannual_checklist.data = baselinannual_checklist.data+"<h2>1. Baseline Annual (Aquaduct 3.0): </h2>"+"<table style='width:73%;margin-top: 1.5%;border-collapse:collapse;font-family:Calibri;font-size:1.2em' class='reporttablestyle_aqui summary'>"+
                  "<tr><td style='background-color:aliceblue;'><b>Baseline water stress</b></td><td>"+baseline_response.features[0].attributes.bws_label+"</td>"+
                  "<tr><td style='background-color:aliceblue;'><b>Baseline water depletion</b></td><td>"+baseline_response.features[0].attributes.bwd_label+"</td>"+
                  "<tr><td style='background-color:aliceblue;'><b>Inter Annual Variability</b></td><td>"+baseline_response.features[0].attributes.iav_label+"</td>"+
                  "<tr><td style='background-color:aliceblue;'><b>Seasonal Variability</b></td><td>"+baseline_response.features[0].attributes.sev_label+"</td>"+
                  "<tr><td style='background-color:aliceblue;'><b>Groundwater table decline </b></td><td>"+baseline_response.features[0].attributes.gtd_label+"</td>"+
                  "<tr><td style='background-color:aliceblue;'><b>Riverine flood risk</b></td><td>"+baseline_response.features[0].attributes.rfr_label+"</td>"+
                  "<tr><td style='background-color:aliceblue;'><b>Coastal flood risk</b></td><td>"+baseline_response.features[0].attributes.cfr_label+"</td>"+
                  "<tr><td style='background-color:aliceblue;'><b>Drought risk</b></td><td>"+baseline_response.features[0].attributes.drr_label+"</td>"+
                  "<tr><td style='background-color:aliceblue;'><b>Untreated connected wastewater</b></td><td>"+baseline_response.features[0].attributes.ucw_label+"</td>"+
                  "<tr><td style='background-color:aliceblue;'><b>Coastal eutrophication potential</b></td><td>"+baseline_response.features[0].attributes.cep_label+"</td>"+
                  "<tr><td style='background-color:aliceblue;'><b>Unimproved/ no drinking water</b></td><td>"+baseline_response.features[0].attributes.udw_label+"</td>"+
                  "<tr><td style='background-color:aliceblue;'><b>Unimproved/ no sanitation</b></td><td>"+baseline_response.features[0].attributes.usa_label+"</td>"+
                  "<tr><td style='background-color:aliceblue;'><b>Peak reprisk country ESG risk index</b></td><td>"+baseline_response.features[0].attributes.rri_label+"</td>"+
                  "</table>"
                  //dataForReport.push(baselinannual_checklist);
                  });




                      }});


                      var query_summ2 = new Query();
                      query_summ2.where ="state like" +" "+"\'"+ akahstate +"\'"  + " " + "AND" + " " + "district like" +" "+"\'"+ akahdistrict +"\'"+ " " + "AND" + " " + "block like" + " " + "\'" + akahblock + "\'";
                      query_summ2.outFields = ["*"]
                      query_summ2.returnGeometry = true
                      window.rep_sel=new QueryTask(akah_selectedwells_layer.url).execute(query_summ2, function retrieve(summ_selected_records1) {
                        window.rep_selected_records = summ_selected_records1;
                        var villagenames=[];
                        summ_selected_records1.features.forEach(function (feature) {
                          if(feature.attributes.village_name!=null){villagenames.push(feature.attributes.village_name)}
                        });
                        window.rep_val1='';window.rep_val2='';window.rep_val3='';window.rep_val4='';window.rep_val5='';window.rep_val6='';window.rep_val7='';window.rep_val8='';
                        rep_val1=(new Set(villagenames).size);
                        rep_val2=summ_selected_records1.features.length;
                        //rep_val4="Suitable";
                        var mp=new esri.geometry.Multipoint(rep_selected_records.features[0].geometry.spatialReference);
                        summ_selected_records1.features.forEach(function(f){mp.addPoint(f.geometry)});

                        var query_summ1= new Query();
                        query_summ1.outFields = ["Total_Population_of_Village", "total_male_population_of_villag", "total_female_population_of_vill","canals_area__in_hectares_","wells_tube_wells_area__in_hecta","area_irrigated_by_source__in_he","Shape__Area",
                                                'bu_dec2020', 'wb_dec2020', 'gl_dec2020', 'al_dec2020', 'bl_dec2020'];
                        query_summ1.returnGeometry = true;
                        query_summ1.geometry=mp;
                        window.rep_village=new QueryTask(akah_villages_layer.url).execute(query_summ1, function retrieve(summ){
                          var t=0;
                          var m=0;
                          var fem=0;
                          var aiw=0;
                          var aic=0;
                          var blockarea=0;
                          var ee12=new esri.geometry.Polygon(summ.features[0].geometry.spatialReference);
                          window.ee12=ee12;
                          window.block_lulc_bu = 0;window.block_lulc_wb = 0;window.block_lulc_gl = 0;window.block_lulc_al = 0;window.block_lulc_bl = 0;
                          summ.features.forEach(function(f){
                              ee12.addRing(f.geometry.rings[0]);
                              t=t+f.attributes["Total_Population_of_Village"];
                              m=m+f.attributes["total_male_population_of_villag"];
                              fem=fem+f.attributes["total_female_population_of_vill"];
                              aiw=aiw+f.attributes["wells_tube_wells_area__in_hecta"];
                              aic=aic+f.attributes["canals_area__in_hectares_"]+f.attributes["area_irrigated_by_source__in_he"];
                              blockarea=blockarea+f.attributes["Shape__Area"];
                              if (f.attributes['bu_dec2020'] != null) {window.block_lulc_bu = block_lulc_bu + Number(f.attributes['bu_dec2020'])}
                              if (f.attributes['wb_dec2020'] != null) {window.block_lulc_wb = block_lulc_wb + Number(f.attributes['wb_dec2020'])}
                              if (f.attributes['gl_dec2020'] != null) {window.block_lulc_gl = block_lulc_gl + Number(f.attributes['gl_dec2020'])}
                              if (f.attributes['al_dec2020'] != null) {window.block_lulc_al = block_lulc_al + Number(f.attributes['al_dec2020'])}
                              if (f.attributes['bl_dec2020'] != null) {window.block_lulc_bl = block_lulc_bl + Number(f.attributes['bl_dec2020'])}
                              // block_lulc_bu = block_lulc_bu + f.attributes['bu_dec2020'];
                              // block_lulc_wb = block_lulc_wb + f.attributes['wb_dec2020'];
                              // block_lulc_gl = block_lulc_gl + f.attributes['gl_dec2020'];
                              // block_lulc_al = block_lulc_al + f.attributes['al_dec2020'];
                              // block_lulc_bl = block_lulc_bl + f.attributes['bl_dec2020'];
                          });
                          // console.log(block_lulc_bu);
                          // console.log(block_lulc_wb);
                          // console.log(block_lulc_gl);
                          // console.log(block_lulc_al);
                          // console.log(block_lulc_bl);
                          rv["block_area_summ"]=blockarea/10000;
                          if(t==0){
                            rep_val3='';
                            rv["block_male_pop"]=''
                            rv["block_female_pop"]=''
                          }
                          else{
                            rep_val3=t;
                          }

                          if(m==0){
                            rv["block_male_pop"]=''
                          }
                          else{
                            rv["block_male_pop"]=m
                          }

                          if(fem==0){
                            rv["block_female_pop"]=''
                          }
                          else{

                            rv["block_female_pop"]=fem;
                          }

                          if(m==0 && fem==0){
                            rv["block_fm_ratio"]=''
                          }
                          else{
                            var divi=Math.round(fem*1000/m);
                            rv["block_fm_ratio"]=divi+":"+1000;
                          }
                          if(aiw==0){
                            rv["block_areairr_wells"]=''
                          }
                          else{
                            // aiw=1659.6
                            rv["block_areairr_wells"]=Number(Number(aiw).toFixed(2));
                          }
                          if(aic==0){
                            rv["block_areairr_canals"]=''
                          }
                          else{
                            // aic=19895.43
                            rv["block_areairr_canals"]=Number(Number(aic).toFixed(2));
                          }

                          //Code for LULC Chart in Report **(modified from here)
                          domAttr.set('block_akahLulc_Chart','innerHTML','');
                          //Lulc chart for agakhan summary widget
                          window.block_lulc_al_per = Number(Number(block_lulc_al/(block_lulc_al+block_lulc_bl+block_lulc_gl+block_lulc_bu+block_lulc_wb))*100).toFixed(2)
                          window.block_lulc_bl_per = Number(Number(block_lulc_bl/(block_lulc_al+block_lulc_bl+block_lulc_gl+block_lulc_bu+block_lulc_wb))*100).toFixed(2)
                          window.block_lulc_gl_per = Number(Number(block_lulc_gl/(block_lulc_al+block_lulc_bl+block_lulc_gl+block_lulc_bu+block_lulc_wb))*100).toFixed(2)
                          window.block_lulc_bu_per = Number(Number(block_lulc_bu/(block_lulc_al+block_lulc_bl+block_lulc_gl+block_lulc_bu+block_lulc_wb))*100).toFixed(2)
                          window.block_lulc_wb_per = Number(Number(block_lulc_wb/(block_lulc_al+block_lulc_bl+block_lulc_gl+block_lulc_bu+block_lulc_wb))*100).toFixed(2)

                          akah_BlockLULCchart = new dojox.charting.Chart2D("block_akahLulc_Chart", { type: Pie , font: "normal normal normal 14px TimesnewRoman", fontColor: "black", radius: 180, stroke: {width: 0}, labelOffset: -16, labels: true, labelStyle: "default",htmlLabels: true});
                          var akahLulc_DataNew = [
                                           { y: block_lulc_al, /*text: lulcBU_valNew+"ha",*/ tooltip:"Agriculture Land <b>: "+Number(block_lulc_al) +"</b>", fill:"#5adf5a"},
                                           { y: block_lulc_bl, /*text: lulcWB_valNew+"ha",*/ tooltip:"Barren Land <b>: "+Number(block_lulc_bl) +"</b>", fill:"#edd8c0", stroke: {color: "#edd8c0", width: 2}},
                                           { y: block_lulc_gl, /*text: lulcFR_valNew+"ha",*/ tooltip:"Grass Land <b>: "+Number(block_lulc_gl) +"</b>", fill:"#047d04"},
                                           { y: block_lulc_bu, /*text: lulcAL_valNew+"ha",*/ tooltip:"Built Up <b>: " + Number(block_lulc_bu) +"</b>",fill:"#bd3c11", stroke: {color: "#bd3c11", width: 4}},
                                           { y: block_lulc_wb, /*text: lulcBL_valNew+"ha"*/ tooltip:"Water Bodies <b>: "+Number(block_lulc_wb) +"</b>", fill:"#2f92a3"}
                                           ];
                          akah_BlockLULCchart.addPlot("default", { type: Pie , font: "normal normal bold 12px TimesnewRoman", fontColor: "black", radius: 250, stroke: {width: 1}, labelOffset: -20, labels: false, labelStyle: "default",htmlLabels: false});
                          akah_BlockLULCchart.addSeries("Series A", akahLulc_DataNew); //Adds Displacement Data to chart
                          var mag1 = new dojox.charting.action2d.MoveSlice(akah_BlockLULCchart, "default");
                          new Highlight(akah_BlockLULCchart, "default");
                          new Tooltip(akah_BlockLULCchart, "default");
                          akah_BlockLULCchart.title = "DEC 2020"
                          akah_BlockLULCchart.titleFont= "bold 15px TimesnewRoman"
                          akah_BlockLULCchart.titlePos = "bottom"
                          akah_BlockLULCchart.titleGap = 10

                          akah_BlockLULCchart.render();
                          // akah_VillageLULCchart.resize(450,450)

                          domAttr.set("block_lulc_legend","innerHTML",'<div style="line-height: 2em;padding-top: 25%;padding-left: 30px;">'+
                          '<span style="padding: 0px 8px 0px 6px;color:#5adf5a;background-color:#5adf5a;font-size: 13px;margin-left: 44px;border-radius:3px;"></span><span>&nbsp;Agriculture Land</span><span style="padding-left: 14px;">- &nbsp;&nbsp;'+block_lulc_al.toFixed(2)+' ha ('+block_lulc_al_per+'%)</span><br>'+
                          '<span style="padding: 0px 8px 0px 6px;color:#edd8c0;background-color:#edd8c0;font-size: 13px;margin-left:44px;border-radius:3px;">.</span><span>&nbsp;Barren Land</span><span style="padding-left: 34px;">- &nbsp;&nbsp;'+block_lulc_bl.toFixed(2)+' ha ('+block_lulc_bl_per+'%)</span><br>'+
                          '<span style="padding: 0px 8px 0px 6px;color:#047d04;background-color:#047d04;font-size: 13px;margin-left:44px;border-radius:3px;"></span><span>&nbsp;Grass Land</span><span style="padding-left: 40px;">- &nbsp;&nbsp;'+block_lulc_gl.toFixed(2)+' ha ('+block_lulc_gl_per+'%)</span><br>'+
                          '<span style="padding: 0px 8px 0px 6px;color:#bd3c11;background-color:#bd3c11;font-size: 13px;margin-left:44px;border-radius:3px;">.</span><span>&nbsp;Built Up</span><span style="padding-left: 62px;">- &nbsp;&nbsp;'+block_lulc_bu.toFixed(2)+' ha ('+block_lulc_bu_per+'%)</span><br>'+
                          '<span style="padding: 0px 8px 0px 6px;color:#2f92a3;border-radius:3px;background-color:#2f92a3;font-size: 13px;margin-left:44px">.</span><span>&nbsp;Water Bodies</span><span style="padding-left: 29px;">- &nbsp;&nbsp;'+block_lulc_wb.toFixed(2)+' ha ('+block_lulc_wb_per+'%)</span></div>')
                          //Code for LULC Chart in Report **(modified till here)

                          dojo.query('#areaIrrig').innerHTML('');
                          dojo.query('#pieChartareaIrrig').style('display', 'block');
                          //Source of Irrigation block level chart for agakhan summary widget
                          akah_areaIrrigChart = new dojox.charting.Chart2D("areaIrrig", { type: Pie , font: "normal normal normal 14px TimesnewRoman", fontColor: "black", radius: 100, stroke: {width: 0}, labelOffset: -16, labels: true, labelStyle: "default",htmlLabels: true});
                          var akahAreairr_Data = [{ y: rv["block_areairr_canals"], text: "<p>"+Number((rv["block_areairr_canals"]/(rv["block_areairr_canals"]+rv["block_areairr_wells"]))*100).toFixed(2)+"%<br>("+rv["block_areairr_canals"]+" ha)</p>", fill:"#2840ec",stroke: {color: "white", width: 1}},
                                           { y: rv["block_areairr_wells"], text: "<p>"+Number((rv["block_areairr_wells"]/(rv["block_areairr_canals"]+rv["block_areairr_wells"]))*100).toFixed(2)+"%<br>("+rv["block_areairr_wells"]+" ha)</p>", fill:"#edd8c0",stroke: {color: "white", width: 1}}];
                          akah_areaIrrigChart.addPlot("default", { type: Pie , font: "normal normal bold 12px TimesnewRoman", fontColor: "black", radius: 250, stroke: {width: 1}, labelOffset: -28, labels: true, labelStyle: "default",htmlLabels: true});
                          akah_areaIrrigChart.addSeries("Series A", akahAreairr_Data); //Adds Displacement Data to chart
                          // var mag1 = new dojox.charting.action2d.MoveSlice(akah_areaIrrigChart, "default");
                          //new Highlight(akah_areaIrrigChart, "default");
                          //new Tooltip(akah_areaIrrigChart, "default");
                          akah_areaIrrigChart.title = "Sources of Irrigation"
                          akah_areaIrrigChart.titleFont= "bold 14pt Avenir Light"
                          akah_areaIrrigChart.titlePos = "top"
                          akah_areaIrrigChart.titleGap = 1
                          akah_areaIrrigChart.render();
                          akah_areaIrrigChart.resize(480,325);

                          rep_irrig_piechart=rep_irrig_piechart+'<div style="display:inline-flex;"><div>'+dojo.query('#pieChartareaIrrig').innerHTML()+'</div>'+
                          "</div>";
                          dojo.query('#pieChartareaIrrig').style('display', 'none');

                          /*irrigation pie chart for village*/
                          dojo.query('#village_areaIrrig').innerHTML('');
                          dojo.query('#village_pieChartareaIrrig').style('display', 'block');
                          //Lulc chart for agakhan summary widget
                          akah_village_IrrigChart = new dojox.charting.Chart2D("village_areaIrrig", { type: Pie , font: "normal normal normal 14px TimesnewRoman", fontColor: "black", radius: 100, stroke: {width: 0}, labelOffset: -16, labels: true, labelStyle: "default",htmlLabels: true});
                          var akahVillage_irr_Data = [{ y: rv['village_areairr_sw'], text: "<p>"+Number((rv['village_areairr_sw']/(rv['village_areairr_sw']+rv['village_areairr_gw']))*100).toFixed(2)+"%<br>(19895.43 ha)</p>", fill:"#2840ec",stroke: {color: "white", width: 1}},
                                           { y: rv['village_areairr_gw'], text: "<p>"+Number((rv['village_areairr_gw']/(rv['village_areairr_sw']+rv['village_areairr_gw']))*100).toFixed(2)+"%<br>(1659.6 ha)</p>", fill:"#edd8c0",stroke: {color: "white", width: 1}}];
                          akah_village_IrrigChart.addPlot("default", { type: Pie , font: "normal normal bold 12px TimesnewRoman", fontColor: "black", radius: 250, stroke: {width: 1}, labelOffset: -28, labels: true, labelStyle: "default",htmlLabels: true});
                          akah_village_IrrigChart.addSeries("Series A", akahVillage_irr_Data); //Adds Displacement Data to chart
                          // var mag1 = new dojox.charting.action2d.MoveSlice(akah_village_IrrigChart, "default");
                          akah_village_IrrigChart.title = "Sources of Irrigation"
                          akah_village_IrrigChart.titleFont= "bold 14pt Avenir Light"
                          akah_village_IrrigChart.titlePos = "top"
                          // akah_village_IrrigChart.titleGap = 0
                          akah_village_IrrigChart.render();
                          akah_village_IrrigChart.resize(480,325);

                          rep_village_irrig_piechart=rep_village_irrig_piechart+'<div style="display:inline-flex;"><div>'+dojo.query('#village_pieChartareaIrrig').innerHTML()+'</div>'+
                          "<div style='padding-left: 50px;padding-top: 170px;'>"+

                          "<div style='display:inline-flex;'>"+
                          "<div style='width:17px;height:16px;border:1.6px solid white;background-color:#2840ec;border-radius: 4px;'></div>"+
                          "<span style='padding-left:5px;'>Area Irrigated by Surface Water</span></div>"+

                          "<div style='display:inline-flex;padding-top:10px;'>"+
                          "<div style='width:17px;height:16px;border:1.6px solid white;background-color:#edd8c0;border-radius: 4px'></div>"+
                          "<span style='padding-left:5px;'>Area Irrigated by Ground Water</span></div>"+

                          "</div></div>";
                          dojo.query('#village_pieChartareaIrrig').style('display', 'none');
                          /*irrigation pie chart for village*/

                          //Agriculture Status chart for agakhan summary widget
                          dojo.query('#blockarea').innerHTML('');
                          dojo.query('#pieBlockarea').style('display', 'block');
                          akah_Blockarea = new dojox.charting.Chart2D("blockarea", { type: Pie , font: "normal normal normal 14px TimesnewRoman", fontColor: "black", radius: 100, stroke: {width: 0}, labelOffset: -16, labels: true, labelStyle: "default",htmlLabels: true});
                          var akahBlockarea_Data = [{ y: 21555.03  , tooltip:"Net Sown Area <b>: " + 21555.03 +"</b>",fill:"#5adf5a"},
                                           { y: Number(rv["block_area_summ"].toFixed(2)), tooltip:"Unsown Area <b>: "+ Number(rv["block_area_summ"].toFixed(2)) +"</b>", fill:"#edd8c0"}];
                          akah_Blockarea.addPlot("default", { type: Pie , font: "normal normal bold 12px TimesnewRoman", fontColor: "black", radius: 180, stroke: {width: 1}, labelOffset: -20, labels: true, labelStyle: "default",htmlLabels: true});
                          akah_Blockarea.addSeries("Series A", akahBlockarea_Data); //Adds Displacement Data to chart
                          var mag1 = new dojox.charting.action2d.MoveSlice(akah_Blockarea, "default");
                          //new Highlight(akah_areaIrrigChart, "default");
                          //new Tooltip(akah_areaIrrigChart, "default");
                          akah_Blockarea.title = "Agriculture Status"
                          akah_Blockarea.titleFont= "bold 12pt Avenir Light"
                          akah_Blockarea.titlePos = "top"
                          akah_Blockarea.titleGap = 10
                          akah_Blockarea.render();
                          akah_Blockarea.resize(295,295);

                          rep_sown_piechart=rep_sown_piechart+'<div style="display:inline-flex;"><div>'+dojo.query('#pieBlockarea').innerHTML()+'</div>'+
                          "</div>"+
                          "<div style='display:inline-grid'>"+

                          "<div style='display:inline-flex;'>"+
                          "<div style='width:17px;height:16px;border:1.6px solid white;background-color:#5adf5a;border-radius: 4px;'></div>"+
                          "<span style='padding-left:5px;'>Area Irrigated by Surface Water</span></div>"+

                          "<div style='display:inline-flex;padding-top:10px;'>"+
                          "<div style='width:17px;height:16px;border:1.6px solid white;background-color:#edd8c0;border-radius: 4px'></div>"+
                          "<span style='padding-left:5px;'>Area Irrigated by Ground Water</span></div>"+

                          "</div>";
                          dojo.query('#pieBlockarea').style('display', 'none');


                          var query_22 = new Query();
                          query_22.where ="state like" +" "+"\'"+ akahstate +"\'"  + " " + "AND" + " " + "district like" +" "+"\'"+ akahdistrict +"\'";
                          query_22.outFields = ["objectid"]
                          query_22.returnGeometry = true
                          window.rep_selected_wells=new QueryTask(akah_selectedwells_layer.url).execute(query_22, function retrieve(select_count) {
                            rv["block_obswells_count"]=select_count.features.length;
                          });

                        query_summ1.outFields=["AQUIFER",'aquifer0'];
                        query_summ1.geometry=ee12;
                        //console.log(query_summ1);
                        window.rep_aqui=new QueryTask(akah_aqui.url).execute(query_summ1, function retrieve(summ){
                          if(summ.features.length>0){
                            rep_val5=summ.features[0].attributes["aquifer"];
                            rep_val5_1=summ.features[0].attributes["aquifer0"];
                          }
                          else{
                            rep_val5='';
                            rep_val5_1='';
                          }
                        });

                        query_summ1.outFields=["*"];
                        //console.log(query_summ1);
                        window.rep_ws= new QueryTask(akah_watershed.url).execute(query_summ1, function retrieve(summ){
                          if(summ.features.length>0){
                            var basin=[];
                            var sub_basin=[];
                            var watershed=[];
                            rv['block_ws_area'] = 0.0;
                            summ.features.forEach(function(summ_response){
                              basin.push(summ_response.attributes["basin"]);
                              sub_basin.push(summ_response.attributes["sub_basin"]);
                              watershed.push(summ_response.attributes["watershed"]);
                              rv['block_ws_area'] = rv['block_ws_area']+summ_response.attributes["area_ha"]
                            });
                            var basin_temp = new Set(basin);
                            var sub_basin_temp = new Set(sub_basin);
                            var watershed_temp = new Set(watershed);
                            rv["block_ws_basin"] = '';rv["block_ws_sub_basin"] = '';rep_val6 = '';
                            basin_temp.forEach(function(basin_var){
                              rv["block_ws_basin"] = rv["block_ws_basin"]+basin_var+', ';
                            });
                            sub_basin_temp.forEach(function(sub_basin_var){
                              rv["block_ws_sub_basin"] = rv["block_ws_sub_basin"]+sub_basin_var+', ';
                            });
                            watershed_temp.forEach(function(watershed_var){
                              rep_val6 = rep_val6+watershed_var+', ';
                            });
                            rv["block_ws_basin"] = rv["block_ws_basin"].slice(0, rv["block_ws_basin"].length-2)
                            rv["block_ws_sub_basin"] = rv["block_ws_sub_basin"].slice(0, rv["block_ws_sub_basin"].length-2)
                            rep_val6 = rep_val6.slice(0, rep_val6.length-2)
                            // rv["block_ws_sub_basin"]=summ.features[0].attributes["sub_basin"];
                            // rep_val6=summ.features[0].attributes["watershed"];
                          }
                          else{
                            rep_val6='';
                            rv["block_ws_basin"]='';
                            rv["block_ws_sub_basin"]='';
                            rv['block_ws_area'] = '';
                          }
                        });
                        var query_summ_cgwb =  new Query()
                        query_summ_cgwb.where = "state like" +" "+"\'"+ akahstate +"\'"  + " " + "AND" + " " + "district like" +" "+"\'"+ akahdistrict +"\'"+ " " + "AND" + " " + "block like" + " " + "\'" + akahblock + "\'";
                        query_summ_cgwb.outFields=["may_2014","may_2015","may_2016","may_2017","may_2018","may_2019","nov_2014","nov_2015","nov_2016","nov_2017","nov_2018","nov_2019"];
                        query_summ_cgwb.returnGeometry = false;
                        window.block_rf=new QueryTask(gwm_station_layer.url).execute(query_summ_cgwb, function retrieve(summ){
                          window.summ_monsoon=summ;
                          if(summ.features.length>0){
                            var pre=[];
                            var pst=[];
                            summ.features.forEach(function(f){
                              ["2014","2015","2016","2017","2018","2019"].forEach(function(i){
                              if(f.attributes["may_"+i]!=null){pre.push(f.attributes["may_"+i].toFixed(2));}
                              if(f.attributes["nov_"+i]!=null){pst.push(f.attributes["nov_"+i].toFixed(2));}
                            });
                          });

                          if(pre.length!=0){
                            var min_pre=Math.min(...pre);
                            var max_pre=Math.max(...pre);
                            if(min_pre!=max_pre){rep_val7=min_pre+" - "+max_pre+" m";}
                            else{rep_val7=min_pre+" m";}
                          }
                          else{rep_val7=''}

                          if(pst.length!=0){
                            var min_pst=Math.min(...pst);
                            var max_pst=Math.max(...pst);
                            if(min_pst!=max_pst){rep_val8=min_pst+" - "+max_pst+" m";}
                            else{rep_val8=min_pst+" m";}
                          }
                          else{rep_val8='';}

                        }

                          else{
                            rep_val7='';rep_val8='';
                          }
                        });

                        // var query_districtKey = new Query()
                        // query_districtKey.where = "state like" +" "+"\'"+ akahstate +"\'";  + " " + "AND" + " " + "district like" +" "+"\'"+ akahdistrict +"\'"
                        // query_districtKey.outFields = ["state"]
                        // query_districtKey.returnGeometry = true
                        // new QueryTask(akah_villages_layer.url).execute(query_selectedInp, function retrieve(response) {
                        //       window.akah_district_point_response = response;
                        // });
                        // function printMaps11(){
                        //     akah_Tool.map.setExtent(akahStateExtent)
                        //     setTimeout(function(){
                        //         /*block level district--keymap*/
                        //         var template_districtKeymap=new PrintTemplate();
                        //         // temple.layout='A4 Portrait';
                        //         template_districtKeymap.layout='district_keymap';
                        //         template_districtKeymap.exportOptions = {
                        //           dpi: 300
                        //         };
                        //         // temple.format='JPG';
                        //         template_districtKeymap.format = "JPG";
                        //         template_districtKeymap.preserveScale = false;
                        //         template_districtKeymap.showAttribution = true;
                        //         template_districtKeymap.layoutOptions={
                        //           scalebarUnit:"Kilometers",
                        //           // legendLayers :[legendLayer],
                        //         }

                        //         var params_districtKeymap = new PrintParameters();
                        //         params_districtKeymap.map = akah_Tool.map;
                        //         params_districtKeymap.template=template_districtKeymap;

                        //         var districtPrintTask = new PrintTask(app.printUrl);
                        //         /*block level district--keymap*/
                        //         window.printDistrictKeyMap = districtPrintTask.execute(params_districtKeymap, function (evt){
                        //             rv['district_keyMapUrl'] = evt.url;
                        //             akah_Tool.map.setExtent(akahDistrictExtent)
                        //             setTimeout(function(){
                        //                 /*block level block--keymap*/
                        //                 var template_blockKeymap=new PrintTemplate();
                        //                 // temple.layout='A4 Portrait';
                        //                 template_blockKeymap.layout='block_keymap';
                        //                 template_blockKeymap.exportOptions = {
                        //                   dpi: 300
                        //                 };
                        //                 // temple.format='JPG';
                        //                 template_blockKeymap.format = "JPG";
                        //                 template_blockKeymap.preserveScale = false;
                        //                 template_blockKeymap.showAttribution = true;
                        //                 template_blockKeymap.layoutOptions={
                        //                   scalebarUnit:"Kilometers",
                        //                   // legendLayers :[legendLayer],
                        //                 }

                        //                 var params_blockKeymap = new PrintParameters();
                        //                 params_blockKeymap.map = akah_Tool.map;
                        //                 params_blockKeymap.template = template_blockKeymap;

                        //                 var blockKeymap_PrintTask = new PrintTask(app.printUrl);
                        //                 /*block level block--keymap*/

                        //                 window.printBlockKeyMap = blockKeymap_PrintTask.execute(params_blockKeymap, function (evt){
                        //                     rv['block_keyMapUrl'] = evt.url;
                        //                     akah_Tool.map.setExtent(akahBlockExtent)
                        //                     //list of all the selected layers to be visible on the main map
                        //                     akah_selectedwells_layer.setDefinitionExpression("state like" +" "+"\'"+ akahstate +"\'"  + " " + "AND" + " " + "district like" +" "+"\'"+ akahdistrict +"\'"+ " " + "AND" + " " + "block like" + " " + "\'" + akahblock + "\'" + "AND" + " " + "village_name like" + " " + "\'" +akahvillage+ "\'");
                        //                     akah_villages_layer.setDefinitionExpression("state like" +" "+"\'"+ akahstate +"\'"  + " " + "AND" + " " + "district like" +" "+"\'"+ akahdistrict +"\'"+ " " + "AND" + " " + "block like" + " " + "\'" + akahblock + "\'" + "AND" + " " + "village like" + " " + "\'" +akahvillage+ "\'");
                        //                     var villageSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,255,255,0.35]),1), new Color([125,125,125,0.35]));

                        //                     akah_total_villages.setDefinitionExpression("state_1 like" +" "+"\'"+ akahstate +"\'"  + " " + "AND" + " " + "district_1 like" +" "+"\'"+ akahdistrict +"\'"+ " " + "AND" + " " + "block_1 like" + " " + "\'" + akahblock + "\'");
                        //                     gwm_station_layer.setDefinitionExpression("state like" +" "+"\'"+ akahstate +"\'"  + " " + "AND" + " " + "district like" +" "+"\'"+ akahdistrict +"\'"+ " " + "AND" + " " + "block like" + " " + "\'" + akahblock + "\'" + " AND may_2018 is not null AND may_2015 is not null AND may_2016 is not null AND may_2017 is not null AND nov_2015 is not null AND nov_2016 is not null AND nov_2017 is not null AND nov_2018 is not null AND nov_2019 is not null AND may_2019 is not null");
                        //                     akah_selectedwells_layer.setVisibility(true);
                        //                     gwm_station_layer.setVisibility(true)
                        //                     akah_villages_layer.setVisibility(true)
                        //                     akah_total_villages.setVisibility(true)
                        //                     akah_block_layer.setVisibility(true)
                        //                 });
                        //             }, 3000);
                        //         });
                        //     }, 2000);
                        // }
                        // window.printDistrictMap = new QueryTask(akah_states_layer.url).execute(query_districtKey, function retrieve(response) {
                        //     window.akah_state_response = response;
                        //     //state extent to be used for district map
                        //     window.akahStateExtent = new Extent(response.features[0].geometry.getExtent())
                        //     query_districtKey.where = "state like" +" "+"\'"+ akahstate +"\'"  + " " + "AND" + " " + "district like" +" "+"\'"+ akahdistrict +"\'" ;
                        //     query_districtKey.outFields = ["district"]
                        //     window.districtMapExtent = new QueryTask(akah_dist_layer.url).execute(query_districtKey, function(districtVar){
                        //         //district extent to be used for block map
                        //         window.akahDistrictExtent = new Extent(districtVar.features[0].geometry.getExtent())
                        //         query_districtKey.where = "state like" +" "+"\'"+ akahstate +"\'"  + " " + "AND" + " " + "district like" +" "+"\'"+ akahdistrict +"\'"+" AND Block like '"+akahblock+"'" ;
                        //         query_districtKey.outFields = ["Block"]
                        //         window.blockMapExtent = new QueryTask(akah_block_layer.url).execute(query_districtKey, function(blockVar){
                        //             //block extent to be used for main map
                        //             window.akahBlockExtent = new Extent(blockVar.features[0].geometry.getExtent())
                        //             printMaps11()
                        //         });
                        //     });
                        // });
                        var query_districtKey = new Query()
                        query_districtKey.where = "state like" +" "+"\'"+ akahstate +"\'" + " " + "AND" + " " + "district like" +" "+"\'"+ akahdistrict +"\'"+"AND Block like '"+akahblock+"'"
                        query_districtKey.outFields = ["Block"]
                        query_districtKey.returnGeometry = true
                        window.blockMapExtent = new QueryTask(akah_block_layer.url).execute(query_districtKey, function(blockVar){
                            //block extent to be used for main map
                            window.akahBlockExtent = new Extent(blockVar.features[0].geometry.getExtent())
                            akah_Tool.map.setExtent(akahBlockExtent)
                        });

                        var query_summ12= new Query();
                        query_summ12.outFields=["*"];
                        query_summ12.returnGeometry = true;
                        query_summ12.where="Block like '"+akahblock+"'";
                        window.rep_block_result=new QueryTask(akah_block_layer.url).execute(query_summ12, function retrieve(summ1){
                          query_summ12.where="1=1";
                          query_summ12.returnGeometry = false;
                          if(summ1.features.length>0){
                          rep_val6_1=summ1.features[0].attributes["area"];
                          query_summ12.geometry=summ1.features[0].geometry;
                          window.rep_gwq=new QueryTask(akah_gwq.url).execute(query_summ12, function retrieve(summ){
                            if(summ.features.length>0){
                              var wqpar=["ph", "ec", "carbonate", "bicarbonate", "chloride", "nitrate", "sulphate", "fluoride", "tot_alkalinity", "ca", "mg", "th", "na", "k"];
                              window.wqpar_rep_names=["pH","Electrical Conductivity","Carbonate","Bicarbonate","Chloride","Nitrate","Sulphate","Fluoride","Alkalinity","Calcium","Magnesium","Total Hardness","Sodium","Potassium"];

                              var wqlimits=[8.5,2000,75,350,1000,45,400,1.5,600,200,100,600,2000,20]; //6.5 base limit of pH
                              var wqjson={};
                              window.cgwb_wq=wqjson
                              summ.features.forEach(function (feature) {
                                wqpar.forEach(function(f){
                                  if(wqjson[f] === undefined){
                                    wqjson[f]=[];
                                  }
                                  wqjson[f].push(feature.attributes[f]);
                                });
                              });

                              var wqresults=[];
                              for(var i=0;i<wqpar.length;i++){
                                var res=[];
                                if(i==0){
                                  wqjson[wqpar[i]].forEach(function(p){
                                    if(p!=null){
                                      if(parseFloat(p)>=6.5){
                                        res.push('N');
                                      }
                                      else{
                                        res.push('Y');
                                      }
                                    }
                                  });
                                }

                                wqjson[wqpar[i]].forEach(function(p){
                                  if(p!=null){
                                    if(parseFloat(p)<=wqlimits[i]){
                                      res.push('N');
                                    }
                                    else{
                                      res.push('Y');
                                    }
                                  }
                                });
                                if(res.includes('Y')){
                                wqresults.push(wqpar[i]);
                              }
                              }
                              window.wqres=wqresults;
                              if(wqresults.length>0){
                                var rep1="Unsuitable - "
                                wqresults.forEach(function(v){
                                  rep1=rep1+wqpar_rep_names[wqpar.indexOf(v)]+', ';
                                });
                                rep_val4=rep1.slice(0,rep1.length-2);
                                //domAttr.set(sum_var[3],"innerHTML",'<b>'+rep1+'</b>');

                              }
                              else{
                                //domAttr.set(sum_var[3],"innerHTML",'<b>'+"Suitable"+'</b>');
                                rep_val4="Suitable";
                              }
                            }
                          });
                          function results1(r){
                            //alert('print report is ready');
                          dojo.byId("akahwellInventory_Report").removeAttribute('disabled');
                          dojo.query("#pr_load").style("display","none");
                          // setTimeout(function(){

                          // }, 16000);

                         }
                         var promisee=executeAll([total_village_query,block_wr,wr,rep_ws,rep_block_result,rep_selected_wells,rep_aqui,block_rf,rep_gwq,rf_chart_query/*, printDistrictMap*/]);
                         promisee.then(results1);
                        }

                        else{
                            rep_val4='';
                            function results1(r){
                              //alert('print report is ready');
                              dojo.byId("akahwellInventory_Report").removeAttribute('disabled');
                              dojo.query("#pr_load").style("display","none");
                              // setTimeout(function(){

                              // }, 16000);
                            }
                            var promisee=executeAll([total_village_query,block_wr,wr,rep_ws,rep_block_result,rep_selected_wells,rep_aqui,block_rf/*, printDistrictMap*/]);
                            promisee.then(results1);
                        }
                        });

                        });
                      });



                    //Code for LULC Chart in Report  **(modified from here)
                    domAttr.set('Village_akahLulc_Chart','innerHTML','');
                    if (summ.features[0].attributes['al_dec2020'] != null) {window.lulcAL_valNew = Number(summ.features[0].attributes['al_dec2020'])}else{window.lulcAL_valNew = 0}
                    if (summ.features[0].attributes['bl_dec2020'] != null) {window.lulcBL_valNew = Number(summ.features[0].attributes['bl_dec2020'])}else{window.lulcBL_valNew = 0}
                    if (summ.features[0].attributes['bu_dec2020'] != null) {window.lulcBU_valNew = Number(summ.features[0].attributes['bu_dec2020'])}else{window.lulcBU_valNew = 0}
                    if (summ.features[0].attributes['gl_dec2020'] != null) {window.lulcFR_valNew = Number(summ.features[0].attributes['gl_dec2020'])}else{window.lulcFR_valNew = 0}
                    if (summ.features[0].attributes['wb_dec2020'] != null) {window.lulcWB_valNew = Number(summ.features[0].attributes['wb_dec2020'])}else{window.lulcWB_valNew = 0}
                    window.lulcAL_valNew_per = Number(Number(lulcAL_valNew/(lulcAL_valNew+lulcBL_valNew+lulcFR_valNew+lulcBU_valNew+lulcWB_valNew))*100).toFixed(2)
                    window.lulcBL_valNew_per = Number(Number(lulcBL_valNew/(lulcAL_valNew+lulcBL_valNew+lulcFR_valNew+lulcBU_valNew+lulcWB_valNew))*100).toFixed(2)
                    window.lulcFR_valNew_per = Number(Number(lulcFR_valNew/(lulcAL_valNew+lulcBL_valNew+lulcFR_valNew+lulcBU_valNew+lulcWB_valNew))*100).toFixed(2)
                    window.lulcBU_valNew_per = Number(Number(lulcBU_valNew/(lulcAL_valNew+lulcBL_valNew+lulcFR_valNew+lulcBU_valNew+lulcWB_valNew))*100).toFixed(2)
                    window.lulcWB_valNew_per = Number(Number(lulcWB_valNew/(lulcAL_valNew+lulcBL_valNew+lulcFR_valNew+lulcBU_valNew+lulcWB_valNew))*100).toFixed(2)
                    //Lulc chart for agakhan summary widget
                    akah_VillageLULCchart = new dojox.charting.Chart2D("Village_akahLulc_Chart", { type: Pie , font: "normal normal normal 14px TimesnewRoman", fontColor: "black", radius: 180, stroke: {width: 0}, labelOffset: -16, labels: true, labelStyle: "default",htmlLabels: true});
                    var akahLulc_DataNew = [{ y: lulcAL_valNew, /*text: lulcAL_valNew+"ha",*/ tooltip:"Agriculture Land <b>: " + Number(lulcAL_valNew) +"</b>",fill:"#5adf5a"},
                                     { y: lulcBL_valNew, /*text: lulcBL_valNew+"ha"*/ tooltip:"Barren Land <b>: "+Number(lulcBL_valNew) +"</b>", fill:"#edd8c0", stroke: {color: "#edd8c0", width: 4}},
                                     { y: lulcFR_valNew, /*text: lulcFR_valNew+"ha",*/ tooltip:"Forest Area <b>: "+Number(lulcFR_valNew) +"</b>", fill:"#047d04"},
                                     { y: lulcBU_valNew, /*text: lulcBU_valNew+"ha",*/ tooltip:"Built Up <b>: "+Number(lulcBU_valNew) +"</b>", fill:"#bd3c11",stroke: {color: "#bd3c11", width: 4}},
                                     { y: lulcWB_valNew, /*text: lulcWB_valNew+"ha",*/ tooltip:"Water Bodies <b>: "+Number(lulcWB_valNew) +"</b>", fill:"#2f92a3", stroke: {color: "#2f92a3", width: 2}}];
                    akah_VillageLULCchart.addPlot("default", { type: Pie , font: "normal normal bold 12px TimesnewRoman", fontColor: "black", radius: 250, stroke: {width: 1}, labelOffset: -20, labels: false, labelStyle: "default",htmlLabels: false});
                    akah_VillageLULCchart.addSeries("Series A", akahLulc_DataNew); //Adds Displacement Data to chart
                    var mag1 = new dojox.charting.action2d.MoveSlice(akah_VillageLULCchart, "default");
                    new Highlight(akah_VillageLULCchart, "default");
                    new Tooltip(akah_VillageLULCchart, "default");
                    akah_VillageLULCchart.title = "DEC 2020"
                    akah_VillageLULCchart.titleFont= "bold 15px TimesnewRoman"
                    akah_VillageLULCchart.titlePos = "bottom"
                    akah_VillageLULCchart.titleGap = 10 

                    akah_VillageLULCchart.render();
                    // akah_VillageLULCchart.resize(450,450)

                    domAttr.set("Village_lulc_legend","innerHTML",'<div style="line-height: 2em;padding-top: 25%;padding-left: 30px;">'+
                    '<span style="padding: 0px 8px 0px 6px;color:#047d04;background-color:#047d04;font-size: 13px;margin-left:44px;border-radius:3px;"></span><span>&nbsp;Forest Area</span><span style="padding-left: 40px;">- &nbsp;&nbsp;'+lulcFR_valNew.toFixed(2)+' ha ('+lulcAL_valNew_per+'%)</span><br>'+
                    '<span style="padding: 0px 8px 0px 6px;color:#5adf5a;background-color:#5adf5a;font-size: 13px;margin-left: 44px;border-radius:3px;"></span><span>&nbsp;Agriculture Land</span><span style="padding-left: 14px;">- &nbsp;&nbsp;'+lulcAL_valNew.toFixed(2)+' ha ('+lulcBL_valNew_per+'%)</span><br>'+
                    '<span style="padding: 0px 8px 0px 6px;color:#edd8c0;background-color:#edd8c0;font-size: 13px;margin-left:44px;border-radius:3px;">.</span><span>&nbsp;Barren Land</span><span style="padding-left: 34px;">- &nbsp;&nbsp;'+lulcBL_valNew.toFixed(2)+' ha ('+lulcFR_valNew_per+'%)</span><br>'+
                    '<span style="padding: 0px 8px 0px 6px;color:#2f92a3;border-radius:3px;background-color:#2f92a3;font-size: 13px;margin-left:44px">.</span><span>&nbsp;Water Bodies</span><span style="padding-left: 29px;">- &nbsp;&nbsp;'+lulcWB_valNew.toFixed(2)+' ha ('+lulcBU_valNew_per+'%)</span><br>'+
                    '<span style="padding: 0px 8px 0px 6px;color:#bd3c11;background-color:#bd3c11;font-size: 13px;margin-left:44px;border-radius:3px;">.</span><span>&nbsp;Built Up</span><span style="padding-left: 62px;">- &nbsp;&nbsp;'+lulcBU_valNew.toFixed(2)+' ha ('+lulcWB_valNew_per+'%)</span></div>')
                   //code for LULC  chart in reports ends **(modified till here)

                // query_summ1.outFields=["may_2014","may_2015","may_2016","may_2017","may_2018","may_2019","nov_2014","nov_2015","nov_2016","nov_2017","nov_2018","nov_2019"];
                // new QueryTask(gwm_station_layer.url).execute(query_summ1, function retrieve(summ){
                //   window.summ_monsoon=summ;
                //
                // });
                // akah_states_layer.setDefinitionExpression("state like" +" "+"\'"+ akahstate +"\'");
                // akah_dist_layer.setDefinitionExpression("district like" +" "+"\'"+ akahdistrict +"\'");
                // akah_block_layer.setDefinitionExpression("block like" +" "+"\'"+ akahblock +"\'");
                // akah_dist_layer.setVisibility(true);
                // akah_block_layer.setVisibility(true);

                });
              });

              //function call to generate map extents
              // akah_Tool.generateMapExtents()
          }
    },


    generateMultiPlotChart: function(gl1,gl2,gl3,gl4,gl5){
        // <!--<div style="width: 700px;height: 300px;display: none;">
        //   <div id="column_lineChart" style="width: 700px;height: 300px;"></div>
        // </div> -->
        domAttr.set("column_lineChart","innerHTML","")
        dojo.query('#wl_rainfall_chart').style('display','block')

        // dojo.query('#rf_wl_legend').style('display','block')
        // dojo.query('#rf_wl1_legend').style('display','block')
        window.multiplot_yearArr = gl1//[{text:"2014", value: 1}, {text:"2015",value: 2}, {text:"2016", value: 3}, {text: "2017", value: 4}, {text:"2018", value: 5}, {text: "2019", value: 6}, {text: "2020", value: 7}];
        window.rainfallDataArr = gl2//[605.25, 592.06, 714.71, 686.51, 438.01, 826.43, 862.41];
        window.preMonsoonDataArr = gl3//[-13.2265625, -10.296875, -14, -12.5, -11.5, -8.1484375];
        window.postMonsoonDataArr = gl4//[-5.30078125, -5.3984375, -4.75, -2.06054688, -4, -0.79980469];
        window.index_arr = [];
        postMonsoonDataArr.forEach(function(value, index){
          index_arr.push(postMonsoonDataArr.indexOf(value));window.index_arr = index_arr.sort((a,b)=>a-b);
        });
        // preMonsoonSeries = [];postMonsoonSeries = [];rainfallSeries = [];

        // for (var i = 0; i < multiplot_yearArr.length; i++) {
        //   rainfallSeries.push({x: multiplot_yearArr[i].text, y: rainfallDataArr[i]});window.rainfallSeries = rainfallSeries;
        //   if (multiplot_yearArr[i].text != "2020") {
        //     preMonsoonSeries.push({x: multiplot_yearArr[i].text, y: preMonsoonDataArr[i]});window.preMonsoonSeries = preMonsoonSeries;
        //     postMonsoonSeries.push({x: multiplot_yearArr[i].text, y: postMonsoonDataArr[i]});window.postMonsoonSeries = postMonsoonSeries;
        //   }
        // }

        //code for plotting regression line/ trendline for pre monsoon
        var array_xy_pre = [];       // creating x * y array
        var array_xx_pre = [];
        var error_pre = [];      // creating x * x array
        for(var i = 0; i<preMonsoonDataArr.length; i++){
          array_xy_pre.push(preMonsoonDataArr[i] * index_arr[i]);
          array_xx_pre.push(index_arr[i] * index_arr[i]);
          // error.push((a1[i]-a[i])**2);
        }
       //created new arrays x*y and x*x
       //m. b values formulea
        m =  (((dojox.math.stats.mean(index_arr) * dojox.math.stats.mean(preMonsoonDataArr)) - dojox.math.stats.mean(array_xy_pre)) /
          ((dojox.math.stats.mean(index_arr) * dojox.math.stats.mean(index_arr)) - dojox.math.stats.mean(array_xx_pre)));
        b=(dojox.math.stats.mean(preMonsoonDataArr) - dojox.math.stats.mean(index_arr)*m);

        window.reg_line_pre = [];
        for(var x = 0; x<index_arr.length; x++){
         reg_line_pre.push((m*index_arr[x]) + b);
         // gwl[x].text +": " +
        }
        // console.log(reg_line_pre);
        var rise_change_pre = reg_line_pre[reg_line_pre.length-1] - reg_line_pre[0]
        if(rise_change_pre>0){
          window.change_text_pre = Number(rise_change_pre).toFixed(2)+" m (rise)&nbsp;<span><img src='"+rise_arrow+"' style='width: 10px;height: 14px;' alt='rise_image'/></span>";
        }
        else if(rise_change_pre===0){
          window.change_text_pre = "Stable";
        }
        else{
          window.change_text_pre = Number(rise_change_pre).toFixed(2)+" m (fall)&nbsp;<span><img src='"+fall_arrow+"' style='width: 10px;height: 14px;' alt='rise_image'/></span>";
        }


        var rise_change_pre_f = preMonsoonDataArr[preMonsoonDataArr.length-1] - preMonsoonDataArr[preMonsoonDataArr.length-2]
        if(rise_change_pre_f>0){
          window.change_text_pre_fluc = Number(rise_change_pre_f).toFixed(2)+" m (rise)&nbsp;<span><img src='"+rise_arrow+"' style='width: 10px;height: 14px;' alt='rise_image'/></span>";
        }
        else if(rise_change_pre_f===0){
          window.change_text_pre_fluc = "Stable";
        }
        else{
          window.change_text_pre_fluc = Number(rise_change_pre_f).toFixed(2)+" m (fall)&nbsp;<span><img src='"+fall_arrow+"' style='width: 10px;height: 14px;' alt='rise_image'/></span>";
        }

        for(var w = 0; w<reg_line_pre.length; w++){
          error_pre.push((preMonsoonDataArr[w]-reg_line_pre[w]));
        }
        error_pre = error_pre.map(x => x ** 2);
        error_mean_pre = dojox.math.stats.mean(error_pre)
        err_sq_pre = Math.abs(Math.sqrt(Math.round(error_mean_pre)).toFixed(2));


        //code for plotting regression line/ trendline for post monsoon
        var array_xy_post = [];       // creating x * y array
        var array_xx_post = [];
        var error_post = [];      // creating x * x array
        for(var i = 0; i<postMonsoonDataArr.length; i++){
          array_xy_post.push(postMonsoonDataArr[i] * index_arr[i]);
          array_xx_post.push(index_arr[i] * index_arr[i]);
          // error.push((a1[i]-a[i])**2);
        }
       //created new arrays x*y and x*x
       //m. b values formulea
        m =  (((dojox.math.stats.mean(index_arr) * dojox.math.stats.mean(postMonsoonDataArr)) - dojox.math.stats.mean(array_xy_post)) /
          ((dojox.math.stats.mean(index_arr) * dojox.math.stats.mean(index_arr)) - dojox.math.stats.mean(array_xx_pre)));
        b=(dojox.math.stats.mean(postMonsoonDataArr) - dojox.math.stats.mean(index_arr)*m);

        window.reg_line_post = [];
        for(var x = 0; x<index_arr.length; x++){
         reg_line_post.push((m*index_arr[x]) + b);
         // gwl[x].text +": " +
        }
        // console.log(reg_line_post);
        var rise_change_post = reg_line_post[reg_line_post.length-1] - reg_line_post[0]
        if(rise_change_post>0){
          window.change_text_post = Number(rise_change_post).toFixed(2)+" (rise)&nbsp;<span><img src='"+rise_arrow+"' style='width: 10px;height: 14px;' alt='rise_image'/></span>";
        }
        else if(rise_change_post===0){
          window.change_text_post = "Stable";
        }
        else{
          window.change_text_post = Number(rise_change_post).toFixed(2)+" (fall)&nbsp;<span><img src='"+fall_arrow+"' style='width: 10px;height: 14px;' alt='rise_image'/></span>";
        }

        for(var w = 0; w<reg_line_post.length; w++){
          error_post.push((postMonsoonDataArr[w]-reg_line_post[w]));
        }
        error_post = error_post.map(x => x ** 2);
        error_mean_post = dojox.math.stats.mean(error_post)
        err_sq_post = Math.abs(Math.sqrt(Math.round(error_mean_post)).toFixed(2));



        var myChart = new Chart("column_lineChart");
        myChart.setTheme(theme);

        //Add plot for LHS axis
        myChart.addPlot("default", {
            type: LinesPlot,
            markers: true,
            hAxis: "x",
            vAxis: "y",
            tension: "S"
        });
        //plot for trendline
        myChart.addPlot("trendline_plot", {
            type: LinesPlot,
            markers: false,
            hAxis: "x",
            vAxis: "y",
            tension: "S"
        });

        //Add additional plot for RHS axis
        myChart.addPlot("other", {
            type: LinesPlot,
            markers: true,
            hAxis: "x",
            vAxis: "other y",
            tension: "S"
            // animate: { duration: 1000, easing: easing.linear}
        });

        //Add axis
        myChart.addAxis("x", {
            fixUpper: "major",
            fixLower:"minor",
            leftBottom: false,
            labels: multiplot_yearArr,
            font:"normal normal bold 7pt Arial",
            fontColor:"black",
            minorTicks:false,
        });
        a = [Math.max.apply(null, preMonsoonDataArr), Math.max.apply(null, reg_line_pre)]
        myChart.addAxis("y", {
            title: "Water Level (in meters)",
            vertical: true,
            max : Math.min.apply(null, a),
            fixUpper: "major",
            fixLower:"minor",
            font:"normal normal bold 7pt Arial",
            fontColor:"black",
            majorTickStep:5,
            // minorTickStep:0,
            beginAtZero: true,
            includeZero: true
        });

        myChart.addAxis("other y", {
            title: "Rainfall (mm)",
            vertical: true,
            leftBottom: false,
            // min : 0,
            fixUpper: "major",
            fixLower:"minor",
            font:"normal normal bold 7pt Arial",
            fontColor:"black"
        });
        //Add the data
        myChart.addSeries('test1',preMonsoonDataArr, {plot: "default", stroke: {color:"#ad7b2a", width:2}});
        myChart.addSeries('pre_trendline',reg_line_pre, {plot: "trendline_plot", stroke: {color:"#684a1a", width:2}});
        // myChart.addSeries('post_trendline',reg_line_post, {plot: "trendline_plot", stroke: {color:"#684a1a", width:2}});
        /*myChart.addSeries('test1',[{x:"2014",y:605.25},{x:"2015",y:592.06},{x:"2016",y:714.71}, {x:"2017",y:686.51}, {x:"2018",y:438.01}, {x:"2019",y:826.43}, {x:"2020",y:862.41}])*//*preMonsoonSeries*/
        // myChart.addSeries('test2',postMonsoonDataArr);
        /*myChart.addSeries('test2',[{x:2014,y:3},{x:2015,y:1},{x:2016,y:3},{x:2017,y:3}])*//*preMonsoonSeries*/
        myChart.addSeries('test3',rainfallDataArr, {plot: "other", stroke: {color:"#008CBA", width:3}, marker: "m-3,0 c0,-4 6,-4 6,0 m-6,0 c0,4 6,4 6,0" });
        // myChart.addSeries('test3',rainfallDataArr/*[{x:"2014",y:5},{x:"2015",y:9},{x:"2016",y:11},{x:"2017",y:4},{x:"2018",y:9},{x:"2019",y:11},{x:"2020",y:4}]*/, {plot: "other", stroke: {color:"black", width:0}, shadow: {dx:0 , dy: 0}});/*rainfallSeries*/
        myChart.render();
        // myChart.resize(400,250);
        /*style.css code
          #column_lineChart rect{
              fill: transparent !important;
              stroke: none !important;
          }
        */
        // var legend='<div style="display: block;text-align: center;" id="rf_wl_legend"> <div style="display:inline-flex;"> <div style="width:17px;height:16px;border:1.6px solid white;background-color:#55aafa;border-radius: 4px;"></div> <span style="padding-left:5px;">Pre-monsoon WL CGWB</span></div> <div style="display:inline-flex;padding-left:10px;"> <div style="width:17px;height:16px;border:1.6px solid white;background-color: #ad7b2a;border-radius: 4px;"></div> <span style="padding-left:5px;">Post-monsoon WL CGWB</span></div> <div style="display:inline-flex;padding-left:10px;"> <div style="width:17px;height:16px;border:1.6px solid white;background-color:#008cba;border-radius: 4px;"></div> <span style="padding-left:5px;">Annual Rainfall</span></div> </div>'+
        // '<div style="display: block;text-align: center;" id="rf_wl1_legend"> <div style="display:inline-flex;"> <div style="width:17px;height:16px;border:1.6px solid white;background-color:#254868;border-radius: 4px;"></div> <span style="padding-left:5px;">Pre-monsoon WL Trend Line</span></div> <div style="display:inline-flex;padding-left:10px;"> <div style="width:17px;height:16px;border:1.6px solid white;background-color: #684a1a;border-radius: 4px;"></div> <span style="padding-left:5px;">Post-monsoon WL Trend Line</span></div> </div>';
        var legend='<div style="display: inline-flex;" id="rf_wl_legend"> <div style="display:inline-flex;padding-left: 30px;font-size: 11px;"> <div style="width: 12px;height: 11px;border:1.6px solid white;background-color: #ad7b2a;border-radius: 4px;"></div> <span style="padding-left:5px;">Pre-monsoon WL CGWB</span></div> <div style="display:inline-flex;padding-left:10px;font-size: 11px;"> <div style="width: 12px;height: 11px;border:1.6px solid white;background-color: #684a1a;border-radius: 4px;"></div> <span style="padding-left:5px;">Pre-monsoon WL Trend Line</span></div> <div style="display:inline-flex;padding-left:10px;font-size: 11px;"> <div style="width: 12px;height: 11px;border:1.6px solid white;background-color:#008cba;border-radius: 4px;"></div> <span style="padding-left:5px;">Annual Rainfall</span></div> </div>';
        // '<div style="display: block;text-align: center;" id="rf_wl1_legend"> </div>';

        var temp = '<div style="display:inline-grid;"><p style="font-size:15px;font-weight: 600;text-align: center;">Well Site - '+gl5+' (Pre-monsoon) </p>'+
        '<div style="display: flex;"><p style="font-weight: 600;margin: 0px;">Rate of rise/fall (5-year Trend - 2015-19):</p><span style="padding-left:5px;">'+change_text_pre+'</span><span style="padding-left:45px;"><b>Fluctuation in actual water level 2018-19:</b> '+change_text_pre_fluc+'</span></div>'+
        '<div style="padding-left:0px">'+dojo.query('#wl_rainfall_chart').innerHTML()+'</div>'+legend+"</div>";

        dojo.query('#wl_rainfall_chart').style('display','none')
        return temp;
    },

    generateMultiPlotChart1: function(gl1,gl2,gl3,gl4,gl5){
        // <!--<div style="width: 700px;height: 300px;display: none;">
        //   <div id="column_lineChart" style="width: 700px;height: 300px;"></div>
        // </div> -->
        domAttr.set("column_lineChart","innerHTML","")
        dojo.query('#wl_rainfall_chart').style('display','block')

        // dojo.query('#rf_wl_legend').style('display','block')
        // dojo.query('#rf_wl1_legend').style('display','block')
        window.multiplot_yearArr = gl1//[{text:"2014", value: 1}, {text:"2015",value: 2}, {text:"2016", value: 3}, {text: "2017", value: 4}, {text:"2018", value: 5}, {text: "2019", value: 6}, {text: "2020", value: 7}];
        window.rainfallDataArr = gl2//[605.25, 592.06, 714.71, 686.51, 438.01, 826.43, 862.41];
        window.preMonsoonDataArr = gl3//[-13.2265625, -10.296875, -14, -12.5, -11.5, -8.1484375];
        window.postMonsoonDataArr = gl4//[-5.30078125, -5.3984375, -4.75, -2.06054688, -4, -0.79980469];
        window.index_arr = [];
        postMonsoonDataArr.forEach(function(value, index){
          index_arr.push(postMonsoonDataArr.indexOf(value));window.index_arr = index_arr.sort((a,b)=>a-b);
        });
        // preMonsoonSeries = [];postMonsoonSeries = [];rainfallSeries = [];

        // for (var i = 0; i < multiplot_yearArr.length; i++) {
        //   rainfallSeries.push({x: multiplot_yearArr[i].text, y: rainfallDataArr[i]});window.rainfallSeries = rainfallSeries;
        //   if (multiplot_yearArr[i].text != "2020") {
        //     preMonsoonSeries.push({x: multiplot_yearArr[i].text, y: preMonsoonDataArr[i]});window.preMonsoonSeries = preMonsoonSeries;
        //     postMonsoonSeries.push({x: multiplot_yearArr[i].text, y: postMonsoonDataArr[i]});window.postMonsoonSeries = postMonsoonSeries;
        //   }
        // }

        //code for plotting regression line/ trendline for pre monsoon
        var array_xy_pre = [];       // creating x * y array
        var array_xx_pre = [];
        var error_pre = [];      // creating x * x array
        for(var i = 0; i<preMonsoonDataArr.length; i++){
          array_xy_pre.push(preMonsoonDataArr[i] * index_arr[i]);
          array_xx_pre.push(index_arr[i] * index_arr[i]);
          // error.push((a1[i]-a[i])**2);
        }
       //created new arrays x*y and x*x
       //m. b values formulea
        m =  (((dojox.math.stats.mean(index_arr) * dojox.math.stats.mean(preMonsoonDataArr)) - dojox.math.stats.mean(array_xy_pre)) /
          ((dojox.math.stats.mean(index_arr) * dojox.math.stats.mean(index_arr)) - dojox.math.stats.mean(array_xx_pre)));
        b=(dojox.math.stats.mean(preMonsoonDataArr) - dojox.math.stats.mean(index_arr)*m);

        window.reg_line_pre = [];
        for(var x = 0; x<index_arr.length; x++){
         reg_line_pre.push((m*index_arr[x]) + b);
         // gwl[x].text +": " +
        }
        // console.log(reg_line_pre);
        var rise_change_pre = reg_line_pre[reg_line_pre.length-1] - reg_line_pre[0]
        if(rise_change_pre>0){
          window.change_text_pre = Number(rise_change_pre).toFixed(2)+" m (rise)&nbsp;<span><img src='"+rise_arrow+"' style='width: 10px;height: 14px;' alt='rise_image'/></span>";
        }
        else if(rise_change_pre===0){
          window.change_text_pre = "Stable";
        }
        else{
          window.change_text_pre = Number(rise_change_pre).toFixed(2)+" m (fall)&nbsp;<span><img src='"+fall_arrow+"' style='width: 10px;height: 14px;' alt='rise_image'/></span>";
        }

        for(var w = 0; w<reg_line_pre.length; w++){
          error_pre.push((preMonsoonDataArr[w]-reg_line_pre[w]));
        }
        error_pre = error_pre.map(x => x ** 2);
        error_mean_pre = dojox.math.stats.mean(error_pre)
        err_sq_pre = Math.abs(Math.sqrt(Math.round(error_mean_pre)).toFixed(2));


        //code for plotting regression line/ trendline for post monsoon
        var array_xy_post = [];       // creating x * y array
        var array_xx_post = [];
        var error_post = [];      // creating x * x array
        for(var i = 0; i<postMonsoonDataArr.length; i++){
          array_xy_post.push(postMonsoonDataArr[i] * index_arr[i]);
          array_xx_post.push(index_arr[i] * index_arr[i]);
          // error.push((a1[i]-a[i])**2);
        }
       //created new arrays x*y and x*x
       //m. b values formulea
        m =  (((dojox.math.stats.mean(index_arr) * dojox.math.stats.mean(postMonsoonDataArr)) - dojox.math.stats.mean(array_xy_post)) /
          ((dojox.math.stats.mean(index_arr) * dojox.math.stats.mean(index_arr)) - dojox.math.stats.mean(array_xx_pre)));
        b=(dojox.math.stats.mean(postMonsoonDataArr) - dojox.math.stats.mean(index_arr)*m);

        window.reg_line_post = [];
        for(var x = 0; x<index_arr.length; x++){
         reg_line_post.push((m*index_arr[x]) + b);
         // gwl[x].text +": " +
        }
        // console.log(reg_line_post);
        var rise_change_post = reg_line_post[reg_line_post.length-1] - reg_line_post[0]
        if(rise_change_post>0){
          window.change_text_post = Number(rise_change_post).toFixed(2)+" (rise)&nbsp;<span><img src='"+rise_arrow+"' style='width: 10px;height: 14px;' alt='rise_image'/></span>";
        }
        else if(rise_change_post===0){
          window.change_text_post = "Stable";
        }
        else{
          window.change_text_post = Number(rise_change_post).toFixed(2)+" (fall)&nbsp;<span><img src='"+fall_arrow+"' style='width: 10px;height: 14px;' alt='rise_image'/></span>";
        }


        var rise_change_post_f = postMonsoonDataArr[postMonsoonDataArr.length-1] - postMonsoonDataArr[postMonsoonDataArr.length-2]
        if(rise_change_post_f>0){
          window.change_text_post_fluc = Number(rise_change_post_f).toFixed(2)+" m (rise)&nbsp;<span><img src='"+rise_arrow+"' style='width: 10px;height: 14px;' alt='rise_image'/></span>";
        }
        else if(rise_change_post_f===0){
          window.change_text_post_fluc = "Stable";
        }
        else{
          window.change_text_post_fluc = Number(rise_change_post_f).toFixed(2)+" m (fall)&nbsp;<span><img src='"+fall_arrow+"' style='width: 10px;height: 14px;' alt='rise_image'/></span>";
        }

        for(var w = 0; w<reg_line_post.length; w++){
          error_post.push((postMonsoonDataArr[w]-reg_line_post[w]));
        }
        error_post = error_post.map(x => x ** 2);
        error_mean_post = dojox.math.stats.mean(error_post)
        err_sq_post = Math.abs(Math.sqrt(Math.round(error_mean_post)).toFixed(2));



        var myChart = new Chart("column_lineChart");
        myChart.setTheme(theme);

        //Add plot for LHS axis
        myChart.addPlot("default", {
            type: LinesPlot,
            markers: true,
            hAxis: "x",
            vAxis: "y",
            tension: "S"
        });
        //plot for trendline
        myChart.addPlot("trendline_plot", {
            type: LinesPlot,
            markers: false,
            hAxis: "x",
            vAxis: "y",
            tension: "S"
        });

        //Add additional plot for RHS axis
        myChart.addPlot("other", {
            type: LinesPlot,
            markers: true,
            hAxis: "x",
            vAxis: "other y",
            tension: "S"
            // animate: { duration: 1000, easing: easing.linear}
        });

        //Add axis
        myChart.addAxis("x", {
            fixUpper: "major",
            fixLower:"minor",
            // max : Math.max.apply(null, postMonsoonDataArr),
            leftBottom: false,
            labels: multiplot_yearArr,
            font:"normal normal bold 7pt Arial",
            fontColor:"black",
            minorTicks:false,
        });
        a = [Math.max.apply(null, postMonsoonDataArr), Math.max.apply(null, reg_line_post)]
        myChart.addAxis("y", {
            title: "Water Level (in meters)",
            vertical: true,
            max : Math.min.apply(null, a),
            fixUpper: "major",
            fixLower:"minor",
            font:"normal normal bold 7pt Arial",
            fontColor:"black",
            majorTickStep:5,
            // minorTickStep:0,
            beginAtZero: true,
            includeZero: true
        });

        myChart.addAxis("other y", {
            title: "Rainfall (mm)",
            vertical: true,
            leftBottom: false,
            // min : 0,
            fixUpper: "major",
            fixLower:"minor",
            font:"normal normal bold 7pt Arial",
            fontColor:"black"
        });
        //Add the data
        // myChart.addSeries('test1',preMonsoonDataArr);
        // myChart.addSeries('pre_trendline',reg_line_pre, {plot: "trendline_plot", stroke: {color:"#254868", width:2}});
        myChart.addSeries('post_trendline',reg_line_post, {plot: "trendline_plot", stroke: {color:"#684a1a", width:2}});
        /*myChart.addSeries('test1',[{x:"2014",y:605.25},{x:"2015",y:592.06},{x:"2016",y:714.71}, {x:"2017",y:686.51}, {x:"2018",y:438.01}, {x:"2019",y:826.43}, {x:"2020",y:862.41}])*//*preMonsoonSeries*/
        myChart.addSeries('test2',postMonsoonDataArr, {plot: "default", stroke: {color:"#ad7b2a", width:2}});
        /*myChart.addSeries('test2',[{x:2014,y:3},{x:2015,y:1},{x:2016,y:3},{x:2017,y:3}])*//*preMonsoonSeries*/
        myChart.addSeries('test3',rainfallDataArr, {plot: "other", stroke: {color:"#008CBA", width:3}, marker: "m-3,0 c0,-4 6,-4 6,0 m-6,0 c0,4 6,4 6,0" });
        // myChart.addSeries('test3',rainfallDataArr/*[{x:"2014",y:5},{x:"2015",y:9},{x:"2016",y:11},{x:"2017",y:4},{x:"2018",y:9},{x:"2019",y:11},{x:"2020",y:4}]*/, {plot: "other", stroke: {color:"black", width:0}, shadow: {dx:0 , dy: 0}});/*rainfallSeries*/
        myChart.render();
        // myChart.resize(400,250);
        /*style.css code
          #column_lineChart rect{
              fill: transparent !important;
              stroke: none !important;
          }
        */
        // var legend='<div style="display: block;text-align: center;" id="rf_wl_legend"> <div style="display:inline-flex;"> <div style="width:17px;height:16px;border:1.6px solid white;background-color:#55aafa;border-radius: 4px;"></div> <span style="padding-left:5px;">Pre-monsoon WL CGWB</span></div> <div style="display:inline-flex;padding-left:10px;"> <div style="width:17px;height:16px;border:1.6px solid white;background-color: #ad7b2a;border-radius: 4px;"></div> <span style="padding-left:5px;">Post-monsoon WL CGWB</span></div> <div style="display:inline-flex;padding-left:10px;"> <div style="width:17px;height:16px;border:1.6px solid white;background-color:#008cba;border-radius: 4px;"></div> <span style="padding-left:5px;">Annual Rainfall</span></div> </div>'+
        // '<div style="display: block;text-align: center;" id="rf_wl1_legend"> <div style="display:inline-flex;"> <div style="width:17px;height:16px;border:1.6px solid white;background-color:#254868;border-radius: 4px;"></div> <span style="padding-left:5px;">Pre-monsoon WL Trend Line</span></div> <div style="display:inline-flex;padding-left:10px;"> <div style="width:17px;height:16px;border:1.6px solid white;background-color: #684a1a;border-radius: 4px;"></div> <span style="padding-left:5px;">Post-monsoon WL Trend Line</span></div> </div>';

        var legend='<div style="display: inline-flex;" id="rf_wl_legend"> <div style="display:inline-flex;padding-left: 30px;font-size: 11px;"> <div style="width: 12px;height: 11px;border:1.6px solid white;background-color: #ad7b2a;border-radius: 4px;"></div> <span style="padding-left:5px;">Post-monsoon WL CGWB</span></div> <div style="display:inline-flex;padding-left:10px;font-size: 11px;"> <div style="width: 12px;height: 11px;border:1.6px solid white;background-color: #684a1a;border-radius: 4px;"></div> <span style="padding-left:5px;">Post-monsoon WL Trend Line</span></div> <div style="display:inline-flex;padding-left:10px;font-size: 11px;"> <div style="width: 12px;height: 11px;border:1.6px solid white;background-color:#008cba;border-radius: 4px;"></div> <span style="padding-left:5px;">Annual Rainfall</span></div> </div>';
        // '<div style="display: block;text-align: center;" id="rf_wl1_legend"> </div>';

        var temp = '<div style="display:inline-grid;padding-left: 35px;"><p style="font-size:15px;font-weight: 600;text-align: center;">Well Site - '+gl5+' (Post-monsoon)</p>'+
        '<div style="display: flex;"><p style="font-weight: 600;margin: 0px;">Rate of rise/fall (5-year Trend - 2015-19):</p><span style="padding-left:5px;">'+change_text_post+'</span><span style="padding-left: 45px;"><b>Fluctuation in actual water level 2018-19</b>: '+change_text_post_fluc+'</span></div>'+
        '<div style="padding-left:0px">'+dojo.query('#wl_rainfall_chart').innerHTML()+'</div>'+legend+"</div>";

        dojo.query('#wl_rainfall_chart').style('display','none')
        return temp;
    },
    initPrintTemplate: function(){
       /*block level main_map defining template at once*/
       var template_BlockMap=new PrintTemplate();
       // temple.layout='A4 Portrait';
       template_BlockMap.layout='Layout_blockmap';
       template_BlockMap.exportOptions = {
         dpi: 300
       };
       // temple.format='JPG';
       template_BlockMap.format = "JPG";
       template_BlockMap.preserveScale = false;
       template_BlockMap.showAttribution = true;
       template_BlockMap.layoutOptions={
         scalebarUnit:"Kilometers",
         // legendLayers :[legendLayer],
       }
       window.template_BlockMap= template_BlockMap;
       var blockMapParams = new PrintParameters();
       blockMapParams.map = akah_Tool.map;
       blockMapParams.template = template_BlockMap;
       window.blockMapParams=blockMapParams;
       var BlockPrintTask = new PrintTask(app.printUrl);
       window.BlockPrintTask = BlockPrintTask;
       /*block level main_map*/
    },
    generateMapExtents: function(){
      dojo.query("#pr_load").style("display","block");
      // /query for extents/
      var query_extents = new Query();
      query_extents.where = "state like" +" "+"\'"+ akahstate +"\'"
      query_extents.outFields = ['state']
      query_extents.returnGeometry = true
      // /json variable to store extent value/
      window.map_extent = {};
      map_extent['state'] = {};map_extent['district'] = {};
      map_extent['block'] = {};map_extent['village'] = {};map_extent['watershed'] = {};

      // /to get state extent/
      window.get_stateExtent = new QueryTask(akah_states_layer.url).execute(query_extents, function(queryState){
          map_extent['state'] = new Extent(queryState.features[0].geometry.getExtent().expand(0.5))
      })
      // /to get district extent/
      query_extents.where = "state like" +" "+"\'"+ akahstate +"\'"  + " " + "AND" + " " + "district like" +" "+"\'"+ akahdistrict +"\'" ;
      query_extents.outFields = ['district']
      window.get_distExtent = new QueryTask(akah_dist_layer.url).execute(query_extents, function(queryDist){
          map_extent['district'] = new Extent(queryDist.features[0].geometry.getExtent().expand(0.5))
      })
      // /to get block extent/
      query_extents.where = "state like" +" "+"\'"+ akahstate +"\'" + " " + "AND" + " " + "district like" +" "+"\'"+ akahdistrict +"\'"+"AND Block like '"+akahblock+"'"
      query_extents.outFields = ['Block']
      window.get_blockExtent = new QueryTask(akah_block_layer.url).execute(query_extents, function(queryBlock){
          map_extent['block'] = new Extent(queryBlock.features[0].geometry.getExtent())
      })
      // /to get village extent/
      query_extents.where = "state like" +" "+"\'"+ akahstate +"\'"  + " " + "AND" + " " + "district like" +" "+"\'"+ akahdistrict +"\'"+ " " + "AND" + " " + "block like" + " " + "\'" + akahblock + "\'"+ " " + "AND" + " " + "village like" + " " + "\'" + akahvillage + "\'"
      query_extents.outFields = ['village']
      window.get_villageExtent = new QueryTask(akah_villages_layer.url).execute(query_extents, function(queryVillage){
          map_extent['village'] = new Extent(queryVillage.features[0].geometry.getExtent())
      })

            // /final result of all the map extents/
            var promisee=executeAll([get_stateExtent, get_distExtent, get_blockExtent, get_villageExtent]);
            promisee.then(function getWatershedExtent(r){
                    // /to get watershed extent merged with block boundaries/
                    var query_extents = new Query();
                    query_extents.returnGeometry = true;
                    query_extents.geometry=map_extent['block'];
                    window.get_watershedExtent = new QueryTask(akah_watershed.url).execute(query_extents, function(queryWatershed){
                      map_extent['watershed']=new esri.geometry.Polygon(queryWatershed.features[0].geometry.spatialReference);
                      queryWatershed.features.forEach(function(f){
                      map_extent['watershed'].addRing(f.geometry.rings[0]);
                    });
                    map_extent['watershed']=new Extent(map_extent['watershed'].getExtent());
                    });
               }).then(function output_for_maps(r){
                        akah_Tool.gotoStateExtent();
                    });
            
            // var promise_for_maps=executeAll([get_watershedExtent]);
            // promise_for_maps.then(output_for_maps);
            
    },
    gotoStateExtent: function(){
      akah_villages_layer.setVisibility(false);
      akah_Tool.map._layers.Vilages_study_area_9502.setVisibility(false)
      akah_dist_layer.setDefinitionExpression("state like '"+akahstate+"'")
      akah_dist_layer.setVisibility(true);
      akah_Tool.map.setExtent(map_extent['state']);
      template_BlockMap.layout='district_keymap';
      var BlockPrintTask = new PrintTask(app.printUrl);
      window.BlockPrintTask = BlockPrintTask;
      window.printing_tool_exe = BlockPrintTask.execute(blockMapParams, function (evt){
          window.dist_keymap=evt.url;
          akah_Tool.gotoDistrictExtent();
      });
    },
    gotoDistrictExtent: function(){
      akah_block_layer.setDefinitionExpression("district like '"+akahdistrict+"'")
      akah_dist_layer.setVisibility(false);
      akah_Tool.map.setExtent(map_extent['district']);
      template_BlockMap.layout='block_keymap';
      var BlockPrintTask = new PrintTask(app.printUrl);
        window.BlockPrintTask = BlockPrintTask;
      window.printing_tool_exe = BlockPrintTask.execute(blockMapParams, function (evt){
          window.block_keymap=evt.url;
          akah_Tool.gotoBlockExtent();
      });
    },
    gotoBlockExtent: function(){
        akah_dist_layer.setVisibility(false);
        akah_villages_layer.setVisibility(false);
        akah_Tool.map._layers.Vilages_study_area_9502.setVisibleLayers([0]);
        akah_Tool.map._layers.Vilages_study_area_9502.setVisibility(true)
        akah_Tool.map.setExtent(map_extent['block']);
        template_BlockMap.layout='Layout_blockmap';
        var BlockPrintTask = new PrintTask(app.printUrl);
        window.BlockPrintTask = BlockPrintTask;
        akah_Tool.map._layers["Vilages_study_area_9502"].setLayerDefinitions(["Block_1 like '"+akahblock+"'"])
        window.printing_tool_exe = BlockPrintTask.execute(blockMapParams, function (evt){
            window.printres=evt.url;
            // akah_Tool.gotoVillageExtent();  as we are getting the village image url at the time of on change event of village, we'r not calling this method again.
            akah_Tool.print_AKAHInventory_Report();
        });
    },
    // gotoVillageExtent: function(){
    //   akah_Tool.map.setExtent(map_extent['village']);
    //   var BlockPrintTask = new PrintTask(app.printUrl);
    //     window.BlockPrintTask = BlockPrintTask;
    //     window.printing_tool_exe = BlockPrintTask.execute(blockMapParams, function (evt){
    //         villageMap=evt.url;
    //         akah_Tool.print_AKAHInventory_Report();
    //     });
    // },
    print_AKAHInventory_Report: function(){
       var data, dataForReport, aoiText, printMap, tableText,rep_head;
      var preData = []; var pre_fields= []; var i=1;
      dataForReport = [];
      preData.length = 0;
      pre_fields.length = 0;
        // printMap = {
      //   addPageBreak: true,
      //   type: "map",
      //   map: akah_Tool.map
      //   // printTemplate: templates
      // };
      rep_head={
        title:"",
        type:"html",
        data:rep_header_text
      }
      aoiText = {
        title: "",
        type: "html",
        data:  "<div class='esrCTAOIInfoDiv'>" +
        // Title
        "<div>" +
        "<input tabindex='0' style='width:100%;border:none;' type='text'" +
        "role='textbox' aria-label='Area of Interest (AOI) Information'>" +
        "</div>" +
        // Date
        "<div>" +
        "<input type='text' tabindex='0' style='width:100%;border:none;' value='" + akah_Tool._getDate() + "'" +
        "role='textbox' aria-label='" + akah_Tool._getDate() + "'>" +
        "</div>" +
        // "<input type='text' tabindex='0' style='width:100%;border:none;' value='" + this._getDate() + "'" +
        // "role='textbox' aria-label='" + this._getDate() + "'>" +
        // "</div>"+
        "</div>"
      };
      if (akah_wellRegistration_response != " ") {
          var akahVillageResponse = akah_village_selectedwell_response.features[0];window.akahVillageResponse = akahVillageResponse;
      }
      else{
          alert("Please give a valid input");
      }
  
      //start>> code for Aquifer table report
  
      // var aqui_headings=["Principle Aquifer","Major Aquifer", "Aquifer System", "Aquifer Type","Thickness of Weathered Zone (in meters)", "Decadal average-m", "Transmissivity", "Yield (%)","Specific Yield", "Quality(EC in Micromhos/cm)"]
      // //var aqui_names=["AQUIFER","AQUIFER0", "SYSTEM", "AQUIFERS", "ZONE_M", "AVG_m", "M2_PERDAY", "M3_PER_DAY", "YEILD__", "PER_CM"];
      // var aqui_tab="<table class='akahReportTable'>";
      // for(var aq_index=0;aq_index<aqui_headings.length;aq_index++){
      //   aqui_tab=aqui_tab+"<tr><td class='ReportTable_subHdngs tablesLeftColumn'>"+aqui_headings[aq_index] +"</td><td class='tablesRightColumn'>"+Object.values(aqui_response.features[0].attributes)[aq_index] +"</td></tr>";
      // }
      // aqui_tab=aqui_tab+"</table>";
  
      //end>> code for Aquifer table report
  
  
      //start>> code for groundwater resource extraction
      //
      // var gwre_headings=["Groundwater Extraction (Ha.m)","Projected Demand  (Ha.m)","Groundwater Allocation (Ha.m)"]
      // var gwre_names=["total","proj_dem","gw_alloc"]
      // var gwre_tab="<table class='akahReportTable'>";
      // for(var gwre_index=0;gwre_index<gwre_headings.length;gwre_index++){
      //   gwre_tab=gwre_tab+"<tr><td class='ReportTable_subHdngs tablesLeftColumn'>"+gwre_headings[gwre_index] +"</td><td class='tablesRightColumn'>"+rf_response.features[0].attributes[gwre_names[gwre_index]] +"</td></tr>";
      // }
      // gwre_tab=gwre_tab+"</table>";
  
      //end>> code for groundwater resource extraction
  
      // if(document.getElementById("rfchartR")){
      //       document.getElementById("rfchartR").remove();
      //     }
      //
      //     var rfchartDiv = document.createElement("DIV");
      //     rfchartDiv.id="rfchartR";
      //     rfchartDiv.style.display="none";
      //
      //     document.getElementById("akah_LocationStyles").append(rfchartDiv);
      //     rfchart_chart = new dojox.charting.Chart2D("rfchartR", { type: Pie , radius: 100, stroke: {width: 0}, font: "normal normal bold 14px TimesnewRoman", fontColor: "black", /*labelOffset: -4,*/ labels: false, labelStyle: "default",htmlLabels: true});
      //     var rfchartData = [{ y: rf_response.features[0].attributes["rnfl_mon"]+rf_response.features[0].attributes["oth_mon"], /*tooltip:" <b>: " + (rf_response.features[0].attributes["rnfl_mon"]+rf_response.features[0].attributes["oth_mon"]) +"</b>",*/ fill:"#8094b7"},
      //                            { y: rf_response.features[0].attributes["nonmon"]+rf_response.features[0].attributes["oth_nonmon"], /*tooltip:"Junagadh <b>: "+"NonMon" +"</b>",*/ fill:"#6098ef"}];
      //     rfchart_chart.addPlot("default", { type: Pie , radius:100});
      //     rfchart_chart.addSeries("Series A", rfchartData);
      //     rfchart_chart.render();
      //
      //     var rfchart=document.getElementById("rfchartR").innerHTML;
      //
      //
      //
      //     if(!document.getElementById("block_rf_legend")){
      //     var rflegendDiv = document.createElement("DIV");
      //     rflegendDiv.id="block_rf_legend";
      //     rflegendDiv.style.display="none"
      //     document.getElementById("akah_LocationStyles").append(rflegendDiv);
      //     domAttr.set("block_rf_legend","innerHTML","<div style='line-height: 2em;top: 113px;position: relative;right: 92px;'>"+
      //                                   "<span style='padding: 0px 8px 0px 6px;color:#8094b7;background-color:#8094b7;font-size: 13px;margin-left:44px;border-radius:3px;'>.</span><span>&nbsp;Monsoon</span><br>"+
      //                                   "<span style='padding: 0px 8px 0px 6px;color:#6098ef;background-color:#6098ef;font-size: 13px;margin-left:44px;border-radius:3px;'>.</span><span>&nbsp;Nonmonsoon</span><br>"+"</div>");
      //     }
      //
      //
      //
      //     var rf_table="<table class='akahReportTable' style='top: 100px;position: relative;'>"+
      //     "<tr><td class='ReportTable_subHdngs tablesLeftColumn' style='width: 60%;'>"+"Monsoon (mm)" +"</td><td class='tablesRightColumn'>"+
      //     (rf_response.features[0].attributes["rnfl_mon"]+rf_response.features[0].attributes["oth_mon"]).toFixed(2)+
      //     "</td></tr>"+
      //     "<tr><td class='ReportTable_subHdngs tablesLeftColumn' style='width: 60%;'>"+"Nonmonsoon (mm)" +"</td><td class='tablesRightColumn'>"+
      //     (rf_response.features[0].attributes["nonmon"]+rf_response.features[0].attributes["oth_nonmon"]).toFixed(2)+
      //     "</td></tr>"+
      //     "<tr><td class='ReportTable_subHdngs tablesLeftColumn' style='width: 60%;'>"+"Total Rainfalls (mm)" +"</td><td class='tablesRightColumn'>"+
      //     (rf_response.features[0].attributes["rnfl_mon"]+rf_response.features[0].attributes["oth_mon"]+rf_response.features[0].attributes["nonmon"]+rf_response.features[0].attributes["oth_nonmon"]).toFixed(2)+
      //     "</td></tr>"+
      //     "</table>";
  
       
          document.getElementsByClassName('bar_akah-inner')[0].dataset.percent = "100%"
          document.getElementsByClassName('bar_akah-inner')[0].style.width = "100%"
          var info_statement='';
          // window.printres=main_map;
          window.printres1=aqui_and_ws;
          if (akahstate === "Maharashtra") {
            info_statement = '<div><p style="font-size: 19px;font-weight: 600;color: darkblue;">Regional Hydrogeology</p>'+
            '<p style="text-align: justify;font-size: 14px;">The ground water is isolated in alluvial pockets of Godavari, Shivna, Purna and their tributaries occur under semi-confined conditions. The saturated thickness comprises of silty clay, sand & gravel from 1-7 meters. The potential aquifer zone is isolated in soft rock strata underlies between 15 to 26 m bgl with discharge rate of 4.5 lps. The dugwells are generally down to 20 m depth and yields varying between 0.5 and 0.8 lps. The ground water occurs under water table and semi confined to confined conditions in Deccan Trap Basalt. The storage of ground water in compact massive unit totally depends upon the presence of joints and their nature, distribution and interconnection. The average depth range of dugwells is 12.00 m to 15.00 m and that of borewells is 50.00 to 60.00 m in hard rock areas, whereas the yield ranges from 0.60 to 3.10 lps.</p></div>';
          }
          else{
            info_statement = '<div><p style="font-size: 19px;font-weight: 600;color: darkblue;">Regional Hydrogeology</p>'+
            '<p style="text-align: justify;font-size: 14px;">The area is concealed with hard rock terrains, mainly basalts and some soft rock formations entailed with limestone and alluvium.'+
            'The concerned aquifer systems present here are unconfined to semi-confined zones with secondary porosity access.'+
            'The permeability of the aquifers system is exaggerated by joints and fractures in formations that have generated stratified aquifer systems.'+
            'This platform can be used to keep a check on water level fluctuations in the region.</p></div>';
          }
          tableText = {
            type: "html",
            data:
            // '<br><div style="display:inline-flex;margin-top: 40px;"><div style="display:inline-grid;"><p class="mapHdngSizes">District Boundaries</p><img src="'+rv['district_keyMapUrl']+'" style="width: 85%;margin-top: 20px;margin-bottom: 30px;" alt="district_map"></div>'+
            // '<div style="display:inline-grid;"><p class="mapHdngSizes">Block Boundaries</p><img src="'+rv['block_keyMapUrl']+'" style="width: 85%;margin-top: 20px;margin-bottom: 30px;" alt="block_keymap"></div></div>'+
            '<br><div style="display:inline-flex;margin-top: 19px;"><div><span style="font-weight:bold;padding-left: 25%;font-size: 18px;">District Boundaries</span><img src="'+dist_keymap+'" style="width: 100%;margin-top: 20px;margin-bottom: 30px;" alt="district_map"></div>'+
            '<div><span style="font-weight:bold;padding-left: 25%;font-size: 18px;">Block Boundaries</span><img src="'+block_keymap+'" style="width: 100%;margin-top: 20px;margin-bottom: 30px;" alt="block_keymap"></div></div>'+
            '<div style="text-align:center"><img src="'+printres+'" style="width: 100%;margin-bottom: 30px;" alt="block_map"></div>'
            // "<div style='text-align:center'>"+printMap.map+"</div>"
          }
          window.tableText2 = {type:"html", data:
            "<h2 class='akahReportTableheadings'>1. Block Profile</h2>" +
            "<table class='akahReportTable1' style='margin-bottom: 10px;'>" +
            "<tr><td colspan=3 class='th_head'>A. Socio-Economic profile</td><tr>"+
            "<tr style='font-weight:600;text-align:left'><td>S.no.</td><td colspan=2>Parameters</td></tr>"+
            // "<tr><td>1.</td><td class='ReportTable_subHdngs'>State</td><td style='width: 45%;'>"+akahVillageResponse.attributes.state +"</td></tr>" +
            // "<tr><td>2.</td><td class='ReportTable_subHdngs'>District</td><td>"+akahVillageResponse.attributes.district+"</td></tr>" +
            // "<tr><td>3.</td><td class='ReportTable_subHdngs'>Block</td><td>"+akahVillageResponse.attributes.block+"</td></tr>" +
            "<tr><td>1.</td><td class='ReportTable_subHdngs' style='width: 40%;'>Block area (in ha)</td><td>"+rv["block_area_summ"].toFixed(2)+"</td></tr>" +
            "<tr><td>2.</td><td class='ReportTable_subHdngs'>Block population</td><td>"+rep_val3+"</td></tr>" +
            // "<tr><td>6.</td><td class='ReportTable_subHdngs'>Male population</td><td>"+rv["block_male_pop"]+"</td></tr>" +
            // "<tr><td>7.</td><td class='ReportTable_subHdngs'>Female population</td><td>"+rv["block_female_pop"]+"</td></tr>" +
            "<tr><td>3.</td><td class='ReportTable_subHdngs'>Sex ratio (F:M)</td><td>"+rv["block_fm_ratio"]+"</td></tr>" +
            "<tr><td>4.</td><td class='ReportTable_subHdngs'>Total no. of villages</td><td>"+rv['Total_villages_in_block']+"</td></tr>" +
            // "<tr><td>5.</td><td class='ReportTable_subHdngs'>Largest village</td><td>"+rv['Largest_village']+"</td></tr>" +
            // "<tr><td>6.</td><td class='ReportTable_subHdngs'>Smallest village</td><td>"+rv['Smallest_village']+"</td></tr>" +
  
  
            // "<tr><td>9.</td><td class='ReportTable_subHdngs'>Livestock population</td><td>"+''+"</td></tr>" +
  
  
            // "<tr><td colspan=3 class='th_head'>C. Field Data Collection</td><tr>"+
            // "<tr><td>1.</td><td class='ReportTable_subHdngs'>AKAH survey wells</td><td>"+rv['block_wr_count']+"</td></tr>" +
            // "<tr><td>2.</td><td class='ReportTable_subHdngs'>AKAH long term observation wells</td><td>"+rep_val2+"</td></tr>" +
            "<tr><td colspan=3 class='th_head'>B. Basin and Watershed information</td><tr>"+
            // "<tr><td>1.</td><td class='ReportTable_subHdngs'>CGWB Observation wells</td><td>"+34+"</td></tr>" +
            "<tr><td>1.</td><td class='ReportTable_subHdngs'>River basin</td><td>"+rv['block_ws_basin']+"</td></tr>" +
            "<tr><td>2.</td><td class='ReportTable_subHdngs'>Sub-basin</td><td>"+rv['block_ws_sub_basin']+"</td></tr>" +
            "<tr><td>3.</td><td class='ReportTable_subHdngs'>Watershed name</td><td>"+rep_val6+"</td></tr>" +
            "<tr><td>4.</td><td class='ReportTable_subHdngs'>Watershed area (in ha)</td><td>"+rv['block_ws_area'].toFixed(2)+"</td></tr>" +
  
            "<tr><td colspan=3 class='th_head'>C. Groundwater resources scenario</td><tr>"+
            "<tr><td>1.</td><td class='ReportTable_subHdngs'>Principle aquifer</td><td>"+rep_val5+"</td></tr>" +
            "<tr><td>2.</td><td class='ReportTable_subHdngs'>Minor aquifer</td><td>"+rep_val5_1+"</td></tr>" +
            //"<tr><td>7.</td><td class='ReportTable_subHdngs'>Average annual rainfall in the district (mm)</td><td>"+876.60+"</td></tr>" +
            "<tr><td>3.</td><td class='ReportTable_subHdngs'>2020 Pre-Monsoon water levels (CGWB)</td><td>"+rep_val7+"</td></tr>" +
            "<tr><td>4.</td><td class='ReportTable_subHdngs'>2020 Post-Monsoon water levels (CGWB)</td><td>"+rep_val8+"</td></tr>" +
            "<tr><td>5.</td><td class='ReportTable_subHdngs'>CGWB Water Quality status</td><td>"+rep_val4+"</td></tr>" +
            "</table>"+'<div style="text-align: center; color: #9e3f07;margin-bottom:20px;"><b>*Water Quality Status is computed based on drinking water quality standards by Bureau Of Indian Standards.</b></div>'+
            "<table class='akahReportTable1' style='margin-bottom:10px;'>"+
            "<tr><td colspan=3 class='th_head'>D. Surface water resources scenario</td><tr>"+
            "<tr><td>1.</td><td class='ReportTable_subHdngs'>Surface water bodies area (in ha)<br>(like farm ponds, tanks, etc)</td><td>"+rv["surface_water_bodies_count_block"].toFixed(2)+"</td></tr>" +
            "<tr><td>2.</td><td class='ReportTable_subHdngs'>Estimated storage capacity (in ha meter)</td><td>"+rv["surface_water_bodies_volume"]+"</td></tr>" +
            "<tr><td>3.</td><td class='ReportTable_subHdngs'>Surface water available to use in 2020 (in ha meter)</td><td>"+rv["storage_water_available_block"]+"</td></tr>" +
            "</table>"+
            '<div style="display:inline-flex"><div>'+
            '<span style="font-size:19px;color: #9e3f07;padding-right: 26px;font-weight: 600;margin:0px">'+
            '*Assumptions based on CGWB field reports: Depth of water bodies= 1.5 m</span>'+
            '<span style="font-size:14px;padding-right: 26px;color: #9e3f07;font-weight: 600;margin:0px">'+
            '<br>*No. of fillings = 3 (2 in monsoon + 1 in non-monsoon)'+
            '<br>*Surface water available to use (ha m) = (Estimated storage capacity x No. of fillings in a year) - Evapotranspiration losses'+
            '<br>*Evapotranspiration losses (ha m) = Block area x evaportranspiration value x0.001'+
            '<br>*Block level Evapotranspiration losses taken from IWRIS data</span>'+
            '</div>'+
            '<div style="text-align: center;margin-bottom: 200px;">'+'<img src="'+farm_pond_cross_section+'" style="width:350px" alt="farm_pond_cross_section">'+'</div></div>',
          addPageBreak:true
           };
          map_tableText = {
          type: "html",
          data:
            // '<div><div style="text-align: center;margin-top: 20px;margin-bottom: 200px;">'+'<img src="'+farm_pond_cross_section+'" style="width:450px" alt="farm_pond_cross_section">'+'<div style="text-align:center;font-weight:600;margin-top: 10px;">Figure: Farm pond cross section</div></div>'+
            '<p style="font-weight: 600;font-size: 20px;text-align: center;margin: 0px;">District Level Hydrogeology map - '+akahdistrict+'</p><div style="text-align:center"><img src="'+printres1+'" style="width: 87%;" alt="hydroGeomap"></div>'+info_statement+
            '<p style="font-weight: 600;font-size: 20px;text-align: center;margin: 0px;">Block Level Watershed map - '+akahblock+'</p><div style="text-align:center"><img src="'+watershedMap+'" style="width: 87%;" alt="watershedmap"></div>'+
             res1+
  
            // "<div style='display:flex'><div style='flex:1;text-align:center'>"+rep_sown_piechart+"</div><div style='flex:1;text-align:center'>"+
            // rep_irrig_piechart+"</div></div>"+
            "<div style='display:inline-flex;width:100%'>"+
            "<div style='display:inline-flex;width:100%;margin-top: 30px;'>"+
            // "<div style='flex:2;padding-top: 100px;'>"+
            // "<table class='akahReportTable1' style='margin-bottom: 10px;'>" +
            // "<tr><td colspan=3 class='th_head'>D. Irrigated Area</td><tr>"+
            // "<tr><td>1.</td><td class='ReportTable_subHdngs'>Net Sown area (in ha)</td><td>"+(rv["block_areairr_canals"]+rv["block_areairr_wells"])+"</td></tr>" +
            // //"<tr><td>2.</td><td class='ReportTable_subHdngs'>Total Irrigated Area (in ha) </td><td>"+(rv["block_areairr_canals"]+rv["block_areairr_wells"])+"</td></tr>" +
            // "<tr><td>2.</td><td class='ReportTable_subHdngs'>Area Irrigated by Surface Water (in ha)</td><td>"+rv["block_areairr_canals"]+"</td></tr>" +
            // "<tr><td>3.</td><td class='ReportTable_subHdngs'>Area Irrigated by Ground Water (in ha)</td><td>"+rv["block_areairr_wells"]+"</td></tr>" +
            // "</table>"+
            // "</div>"+
  
            "<div>"+
            rep_irrig_piechart+
            "</div>"+
            "<div style='padding-top: 195px;'>"+
  
            "<div style='display:inline-flex;'>"+
            "<div style='width:17px;height:16px;border:1.6px solid white;background-color:#2840ec;border-radius: 4px;'></div>"+
            "<span style='padding-left:5px;'>Area Irrigated by Surface Water</span></div>"+
  
            "<div style='display:inline-flex;padding-top:10px;'>"+
            "<div style='width:17px;height:16px;border:1.6px solid white;background-color:#edd8c0;border-radius: 4px'></div>"+
            "<span style='padding-left:5px;'>Area Irrigated by Ground Water</span></div>"+
  
            "</div>"+
            "</div></div>"+"<p class='ReportTable_subHdngs' style='font-size: larger;padding-left: 60px;margin:2px;'>Net Sown area (in ha) = "+(rv["block_areairr_canals"]+rv["block_areairr_wells"])+"</p>"+
            '<p style="font-weight: 600;color: #9e3f07;padding: 0px;margin: 1px 0px 0px 55px;">*Sources: Block-level Irrigation Data taken from Census 2011</p>',
            addPageBreak: true
          };
          tableText1 = {
            type: "html",
            data:
            // "<table class='akahReportTable1' style='margin-bottom: 10px;'>" +
            // "<tr><td colspan=3 class='th_head'>D. Surface Water Scenario</td><tr>"+
            //
            // "</table>"+
  
            // '<span>'+
            // '<span style="font-weight: 600;">Data Sources:</span>'+'<span style="padding-left: 12px;margin-top: 12px;"><b>1. </b> AKAH Observation Wells Data</span>'+
            // '<span style="padding-left: 21px;"> <b>2. </b>Census 2011</span>'+'<span style="padding-left: 21px;"><b>3.</b> Central Ground Water Board <p></p></span>'+'</span>'+
            "<h2 class='akahReportTableheadings'>2. Groundwater resources at block level</h2>" +
            "<p style='padding-left: 30px;font-size: 18px;font-weight: 600;'>a. Annual Rainfall Graph (2014 to 2020)</p>"+
            rep_rainfall_chart+"<p style='font-weight: 600;padding: 0px;color: #9e3f07;margin: 1px 0px 0px 55px;'>*Normal rainfall is a long period average of 30 years to 50 years rainfall.</p>"+
            "<p style='padding-left: 30px;font-size: 18px;font-weight: 600;'>b. Estimated Groundwater Resources (Baseline Year - 2017)</p>"+
            '<div style="text-align:center;">'+rep_bar_chart+'</div>'+'<p style="font-size: 16px;padding-left: 62px;font-weight: 600;color: darkblue;">CGWB Categorization of Groundwater Resources (Block-level): Semi-critical </p>'+
            '<p style="font-weight: 600;color: #9e3f07;padding: 0px;margin: 1px 0px 0px 55px;">*Source: CGWB Groundwater Resources Report (2017)</p>'+
  
            '<div style="display:flex;"><div style="flex:3;margin-top:95px"><p style="padding-left: 30px;color:#9e3f07;font-weight: 600;">*Net GW Availability = (Recharge from rainfall in monsoon &amp; non-monsoon + Recharge from other sources in monsoon &amp; non-monsoon) – Losses through natural discharges</p>'+
            '<p style="padding-left: 30px;color:#9e3f07;font-weight: 600;">*Future GW Availability = Net GW availibility - total extraction for domestic &amp; Irrigations demand</p>'+'</div>'+
            '<div style="flex:6;">'+'<img src="'+gw_3dimage+'" style="width: 90%;" alt="gw_3dimage">'+'</div></div>'+
            "<div><h2 class='akahReportTableheadings' style='text-align:center;'>Land Use Land Cover </h2></div>"+
            '<div style="padding-left:2%;font-size: larger;background-color: #f9f8f8;margin: 0px 60px 0px 30px;padding: 8px;border-radius: 10px;"><span class="ReportTable_subHdngs"> State: &nbsp;</span>'+
            '<span style="color: #50a184;font-weight: 600;">'+akahstate+'</span>&nbsp;&nbsp;<span class="ReportTable_subHdngs"> District: &nbsp;</span>'+
            '<span style="color: #50a184;font-weight: 600;">'+akahdistrict+'</span>&nbsp;&nbsp;<span class="ReportTable_subHdngs"> Block: &nbsp;</span>'+
            '<span style="font-weight: 600;color: #50a184;font-weight: 600;">'+akahblock+'</span>&nbsp;&nbsp;</div>'+
            "<div style='display:inline-flex !important;'>"+dom.byId('blockLULC').innerHTML+"</div>"+
            '<div style="text-align: center;color:#9e3f07;padding-top: 11px;"><b>Data Source:</b> Sentinel-2 satellite imageries.</div>',
            addPageBreak:true
          };
          village_tableText = {
            type: "html",
            data:
            //+baselinannual_checklist.data+futureScenario_checklist.data+
            "<h2 style='text-align:center;margin:2px;line-height:1em;' class='akahReportTableheadings'>Village Profile: "+akahvillage+"</h2>" +
            '<div style="text-align:center"><img src="'+villageMap+'" style="width: 80%;" alt="village map"></div>'+
            "<table class='akahReportTable1' style='margin-bottom: 10px;'>" +
            "<tr><td colspan=5 class='village_th_head'>A. Socio-Economic profile</td><tr>"+
            "<tr><td>1.</td><td class='ReportTable_subHdngs'>Village</td><td colspan=3 style='width: 45%;'>"+akahVillageResponse.attributes.village_name+"</td></tr>" +
            "<tr><td colspan=2 class='th_head_temp'></td><td class='th_head_temp' style='width: 20%;'>Actual Value</td><td colspan=2 class='th_head_temp'>Block Proportion(%)</td></tr>"+
            "<tr><td>2.</td><td class='ReportTable_subHdngs'>Village area(in ha)</td><td>"+rep_vil7_1+"</td><td colspan=2>"+Number(Number(rep_vil7_1)/rv['block_area_abs']*100).toFixed(2)+"  % of Block area</td></tr>" +
            "<tr><td>3.</td><td class='ReportTable_subHdngs'>Village population</td><td>"+rep_vil3+"</td><td colspan=2>"+Number(Number(rep_vil3)/rv['block_area_abs']*100).toFixed(2)+"  % of Block population</td></tr>" +
            // "<tr><td>4.</td><td class='ReportTable_subHdngs'>Male population</td><td>"+rv['village_population_male']+"</td></tr>" +
            // "<tr><td>5.</td><td class='ReportTable_subHdngs'>Female population</td><td>"+rv["village_population_female"]+"</td></tr>" +
            "<tr><td>4.</td><td class='ReportTable_subHdngs'>Sex ratio (F:M)</td><td colspan=3>"+rep_vil4+"</td></tr>" +
            // "<tr><td>7.</td><td class='ReportTable_subHdngs'>Livestock population</td><td>"+''+"</td></tr>" +
            "<tr><td colspan=5 class='village_th_head'>B. Irrigated Area</td><tr>"+
            "<tr><td colspan=2 class='th_head_temp'></td><td class='th_head_temp'>Actual Value</td><td class='th_head_temp'>Village Proportion(%)</td><td class='th_head_temp'>Block Proportion(%)</td></tr>"+
            "<tr><td>1.</td><td class='ReportTable_subHdngs'>Net Sown area (in ha)</td><td>"+(rv['village_areairr_gw']+rv['village_areairr_sw'])+"</td><td>"+
            Number(Number((rv['village_areairr_gw']+rv['village_areairr_sw'])/Number(rep_vil7_1))*100).toFixed(2)+"</td><td>"+
            Number(Number((rv['village_areairr_gw']+rv['village_areairr_sw'])/rv['block_area_abs'])*100).toFixed(2)+"</td></tr>" +
            // "<tr><td>2.</td><td class='ReportTable_subHdngs'>Total Irrigated Area (in ha)</td><td>"+(rv['village_areairr_gw']+rv['village_areairr_sw'])+"</td></tr>" +
            "<tr><td>2.</td><td class='ReportTable_subHdngs'>Area Irrigated by wells (in ha)</td><td>"+rv['village_areairr_gw']+"</td><td>"+
            Number((rv['village_areairr_gw']/Number(rep_vil7_1))*100).toFixed(2)+"</td><td>"+
            Number((rv['village_areairr_gw']/rv['block_area_abs'])*100).toFixed(2)+"</td></tr>" +
            "<tr><td>3.</td><td class='ReportTable_subHdngs'>Area Irrigated by Canals/surface water bodies (in ha)</td><td>"+rv['village_areairr_sw']+"</td><td>"+
            Number((rv['village_areairr_sw']/Number(rep_vil7_1))*100).toFixed(2)+"</td><td>"+
            Number((rv['village_areairr_sw']/rv['block_area_abs'])*100).toFixed(2)+"</td></tr>" +
            // "<tr><td colspan=3 class='th_head'>C. Field Data Collection</td><tr>"+
            // "<tr><td>1.</td><td class='ReportTable_subHdngs'>AKAH survey wells</td><td>"+(dugWell_count+boreWell_count)+"</td></tr>" +
            // "<tr><td>2.</td><td class='ReportTable_subHdngs'>AKAH long term observation wells</td><td>"+rep_vil1+"</td></tr>" +
            // "<tr><td class='ReportTable_subHdngs'>DugWells</td><td>"+dugWell_count+"</td></tr>" +
            // "<tr><td class='ReportTable_subHdngs'>BoreWells</td><td>"+boreWell_count+"</td></tr>" +
  
            //"<tr><td class='ReportTable_subHdngs'>Water Quality <sup>1</sup></td><td>"+rep_vil2+"</td></tr>" +
  
            //"<tr><td class='ReportTable_subHdngs'>Area irrigated by surface water sources <sup>2</sup></td><td>"+rep_vil6+"</td></tr>" +
            //"<tr><td class='ReportTable_subHdngs'>Major crops grown <sup>1</sup></td><td>"+rep_vil5+"</td></tr>" +
            //"<tr><td class='ReportTable_subHdngs'>Area irrigated by ground water sources <sup>2</sup></td><td>"+rep_vil7+"</td></tr>" +
            //"<tr><td class='ReportTable_subHdngs'>Available surface water</td><td>"+rep_vil8+"</td></tr>" +
            //"<tr><td class='ReportTable_subHdngs'>Pre-Monsoon water levels <sup>1</sup></td><td>"+rep_vil9+"</td></tr>" +
            //"<tr><td class='ReportTable_subHdngs'>Post-Monsoon water levels <sup>1</sup></td><td>"+rep_vil10+"</td></tr>" +
            // "<tr><td class='ReportTable_subHdngs'>Aquifer <sup>3</sup></td><td>"+rep_vil11+"</td></tr>" +
            // "<tr><td class='ReportTable_subHdngs'>Watershed <sup>3</sup></td><td>"+rep_vil12+"</td></tr>" +
            "</table>"+rep_village_irrig_piechart+'<p style="font-weight: 600;color:#9e3f07;padding: 0px;margin: 1px 0px 0px 55px;">*Sources: Village-level Irrigation Data taken from Census 2011</p>',
            // '<span>'+
            // '<span style="font-weight: 600;">Data Sources:</span>'+'<span style="padding-left: 12px;margin-top: 12px;"><b>1. </b> AKAH Observation Wells Data</span>'+
            // '<span style="padding-left: 21px;"> <b>2. </b>Census 2011</span>'+'<span style="padding-left: 21px;"><b>3.</b> Central Ground Water Board <p></p></span>'+'</span>'+
            addPageBreak:true
          };
  
          village_tableText1 = {
            type: "html",
            data:
            "<h2 class='akahReportTableheadings' style='line-height: 1.3em;font-size: 28px;'>4. Groundwater & Surface water resources at village level</h2>" +
            "<div style='padding-top: 10px;'><h3 class='akahReportTableSide_headings'>a. Dynamic groundwater resources</h3></div>"+
            "<table class='akahReportTable1'>" +
            "<tr><td class='ReportTable_subHdngs' colspan='2' style='text-align:center'>Total Groundwater Available (Ground Water Resource Assessment Report (2017) )</td></tr>"+
            "<tr><td class='ReportTable_subHdngs'>Recharge from rainfall (ha.m)</td> <td style='width:45%'>"+Number(rv['recharge_rainfall']).toFixed(2)+"</td></tr>"+
            "<tr><td class='ReportTable_subHdngs'>Recharge from other sources (ha.m)</td><td>"+Number(rv['recharge_other']).toFixed(2)+"</td></tr>"+
            "<tr><td class='ReportTable_subHdngs'>Total Groundwater Available (ha.m)</td><td>"+rv['total_gnd_wtr']+"</td></tr>"+
            "</table>"+
            '<p style="font-size: 11px;font-weight: 600;color:#9e3f07;line-height: 1em;">*Block level values are downscaled to village level using the below equation:<br>'+
            '<span style="padding-left: 4px;color:#9e3f07;">Downscaled Value = Block level resources * (Village area/Block area)</span></p>'+
  
            "<div><h3 class='akahReportTableSide_headings'>b. Surface water resources</h3></div>"+
            "<table class='akahReportTable1'>" +
            "<tr><td>1.</td><td class='ReportTable_subHdngs'>Surface water bodies area (in ha)<br>(like farm ponds, tanks, etc)</td><td style='width:45%'>"+rv["surface_water_bodies_count"]+"</td></tr>"+
            "<tr><td>2.</td><td class='ReportTable_subHdngs'>Storage capacity (ha.m)</td><td>"+rv['sw_storage_volume_village']+"</td></tr>"+
            "<tr><td>3.</td><td class='ReportTable_subHdngs'>Surface water available to use (ha.m)</td><td>10.95</td></tr>"+
            "</table>"+
            '<p style="font-size: 11px;color:#9e3f07;font-weight: 600;">*Source: Manually mapped Surface water bodies i.e. farm ponds, lakes, reservoirs</p>'
            // "<table style='padding-top: 20px;' class='akahReportTable'>"+"<tr><td colspan="+(Number(well_data_info.uid.length)+2)+" class='village_th_head'>c. Long term Observation Wells Data</td><tr>"+
            // well_table +
            // "</table><br>"+'<div style="padding-left: 20px;color:#9e3f07;margin-bottom:150px"><b>* All Depth values are measured in Meters below ground level (mbgl)</b></div>',
            // "<div style='padding-top: 20px;'><h3 class='akahReportTableSide_headings'>c. Real-time Groundwater level monitoring</h3></div>"+
            // rep_charts+
            // '<div style="color:black;display:inline-flex;"><div> <span><b style="font-size:14px;color: #005fa2;"><u>Formula for Trendline&nbsp;</u></b><br><br> is given by: <span style="font-size:14px">Y = mx + c</span></span><br> <span style="font-size:14px">c (intercept) = (∑y ∑x<sup>2</sup> -  ∑x ∑xy) / (n (∑x<sup>2</sup>) – (∑x)<sup>2</sup>) </span><br> <span style="font-size:14px">m (slope) = (n ∑xy  -  (∑x)  (∑y)) / (n (∑x<sup>2</sup>) – (∑x)<sup>2</sup>)</span><br> <span>Where,</span><br> <span>X and y are two variables on the regression line.</span><br> <span>M = slope of the line,</span><br> <span>C = y- intercept of the line,</span><br> <span>X = Values of dates,</span><br> <span>Y = values of Predicted Groundwater Levels.</span><br> </div> <div style="padding-left:90px"> <span><b style="font-size:14px;color: #005fa2;"><u>Formula for Deviation</u></b></span><br><br> <span style="font-size:14px;">Deviation = √(∑_(i=1)^N (Predicted<sub>(i)</sub> - Actual<sub>(i)</sub>)<sup>2</sup>/N)</span> </div> </div><br><br>'+
  
            // "<div style='padding-top: 20px;'><h3 class='akahReportTableSide_headings'>d. Observation Wells Data</h3></div>"+
            // addPageBreak: true
          };
          // village_tableText1 = {
          //   type: "html",
          //   data: "<table style='padding-top: 20px;' class='akahReportTable'>"+"<tr><td colspan="+(Number(well_data_info.uid.length)+2)+" class='village_th_head'>c. Long term Observation Wells Data</td><tr>"+
          //   well_table +
          //   "</table><br>"+'<div style="padding-left: 20px;color:#9e3f07;margin-bottom:150px"><b>* All Depth values are measured in Meters below ground level (mbgl)</b></div>',
          //   addPageBreak: true
          // };
  
          if (akahvillage === 'Katepimpalgaon') {
              waterQuality_tableText = {
                type: "html",
                data: waterQualityKt,
                addPageBreak: true
              };
          }
          else{
              waterQuality_tableText = {
                type: "html",
                data:
                "<div><h3 class='akahReportTableheadings'>5. Ground Water Quality</h3></div>" +
                '<table class="akahReportTable"><tr>'+wq_header_text+'</tr></table>'+
  
                "<table class='akahReportTable2'>" +
                "<tr><td class='ReportTable_subHdngs1' rowspan='2'>S.No</td>"+
                "<td class='ReportTable_subHdngs1' rowspan='2'>Water Quality Parameter</td><td class='ReportTable_subHdngs1'>Reading</td>"+
                "<td class='ReportTable_subHdngs1' rowspan='2'>Acceptable Limit <sup>1</sup></td>"+
                "<td class='ReportTable_subHdngs1' rowspan='2'>Permissible Limit <sup>1</sup></td>"+
                "<tr><td class='ReportTable_subHdngs1'>Pre-Monsoon</td>"+
                wq_tbl2_body1+
                "</table>"+
                '<table class="akahReportTable" style="margin-bottom: 10px;"><tr><td>'+wq_restbl+'</td></tr></table>'+'<span>'+
                '<span style="font-weight: 600;color:#9e3f07;">Data Sources:</span>'+'<span style="padding-left: 12px;margin-top: 12px;"><b>1. </b> Bureau of Indian Standards</span>'+'</span><br><br>'+
                wqtbl,
                addPageBreak: true
              };
          }
  
          lulc_tableText = {
            type: "html",
            data:
            // "<div><h3 class='akahReportTableSide_headings'>5. Delineated potential ‘Recharge zones’ suitable for constructing water conservation structures</h3></div>"+
            "<div><h2 class='akahReportTableheadings'>5. Land Use Land Cover </h2></div>"+
            '<div style="padding-left:2%;font-size: larger;background-color: #f9f8f8;margin: 0px 30px 0px 30px;padding: 8px;border-radius: 10px;"><span class="ReportTable_subHdngs"> State: &nbsp;</span>'+
            '<span style="color: #50a184;font-weight: 600;">'+akahstate+'</span>&nbsp;&nbsp;<span class="ReportTable_subHdngs"> District: &nbsp;</span>'+
            '<span style="color: #50a184;font-weight: 600;">'+akahdistrict+'</span>&nbsp;&nbsp;<span class="ReportTable_subHdngs"> Block: &nbsp;</span>'+
            '<span style="font-weight: 600;color: #50a184;font-weight: 600;">'+akahblock+'</span>&nbsp;&nbsp;<span class="ReportTable_subHdngs"> Village: &nbsp;</span>'+
            '<span style="color: #50a184;font-weight: 600;">'+akahvillage+'</span>&nbsp;&nbsp;</div>'+
            "<div style='display:inline-flex !important;'>"+dom.byId('villageLULC').innerHTML+"</div>"+
            '<div style="text-align: center;color:#9e3f07;padding-top: 11px;"><b>Data Source:</b> Sentinel-2 satellite imageries.</div>'
            // "<table class='akahReportTable'>"+
          };
          dataForReport.push(aoiText);
          dataForReport.push(rep_head);
          dataForReport.push(tableText);
          dataForReport.push(tableText2);
          dataForReport.push(map_tableText);
          dataForReport.push(tableText1);
          dataForReport.push(village_tableText);
          dataForReport.push(village_tableText1);
          // dataForReport.push(waterQuality_tableText);
          dataForReport.push(lulc_tableText);
          dataForReport.push({
              "type": "note",
              "addPageBreak": false
          });
          akah_Tool.reportDijitmethod();
          dojo.query("#pr_load").style("display","none");
          akah_Tool.reportDijit.print("Water Governance Management Report", dataForReport);
          preData.length = 0;
          pre_fields.length = 0;
          //domAttr.set("FTLLineChartsReportInfo_dash","innerHTML","")
       
    },
    gotosummary: function(){
      tabsakah.selectTab("Summary")
      if (dijit.byId('block_id').value != 'Select Block' && dijit.byId('block_id').value != "") {
        document.getElementsByClassName('bar_akah-inner')[0].dataset.percent = "25%"
        document.getElementsByClassName('bar_akah-inner')[0].style.width = "25%"
      }
    },
    gotoblock_gwr: function(){
      wells_container.selectTab('Block-wise GW Resources')
      akah_Tool.rainfallChartCreate();
    },
    gotorainfall: function(){
      wells_container.selectTab("Rainfall")
      akah_Tool.rainfallChartCreate();
    },
    waterquality: function(val,limits){
      var out=[];
      for(var i=0;i<val.length;i++){
        if(val[i]<=limits[i]){
          out.push('N');
        }
        else{
          out.push('Y');
        }
      }
      return out;
    },
    gotoakahAnalytics: function(){
      tabsakah.selectTab("Data Analytics")
      if (dijit.byId('searchVillageAKAH').value != "") {
        document.getElementsByClassName('bar_akah-inner')[0].dataset.percent = "75%"
        document.getElementsByClassName('bar_akah-inner')[0].style.width = "75%"
      }
    },
    gotoakahlocation: function(){
      tabsakah.selectTab("Village Information")
      if (dijit.byId('akah_vill').value != 'Select Village' && dijit.byId('akah_vill').value != "" &&  searchAkah.value != akahvillage) {
        document.getElementsByClassName('bar_akah-inner')[0].dataset.percent = "90%"
        document.getElementsByClassName('bar_akah-inner')[0].style.width = "90%"
        akah_Tool.showAKAHResult();
      }
    },

    gotoakahVisualization: function(){
      tabsakah.selectTab("Data Visualisation")
      akah_Tool.rainfallChartCreate();
      if (dijit.byId('block_iddv').value != 'Select Block' && dijit.byId('block_iddv').value != "") {
        document.getElementsByClassName('bar_akah-inner')[0].dataset.percent = "50%"
        document.getElementsByClassName('bar_akah-inner')[0].style.width = "50%"
      }
    },

    resetAkah: function(){
      akah_Tool = this
      var loc_st_val = dijit.byId('akah_st')
      var distValueakah = dijit.byId('akah_dist')
      var blockValueakah = dijit.byId('akah_block')
      var vill_valakah = dijit.byId('akah_vill')
      akah_Tool.map.setExtent(init_map_extent)
      akah_selectedwells_layer.setDefinitionExpression("1=1");
      akah_main_layer.setDefinitionExpression("1=1")
      akah_states_layer.setDefinitionExpression("1=1");
      akah_dist_layer.setDefinitionExpression("1=1");
      akah_block_layer.setDefinitionExpression("1=1");
      akah_villages_layer.setDefinitionExpression("1=1");

      akah_selectedwells_layer.setVisibility(true);
      akah_main_layer.setVisibility(true);
      akah_states_layer.setVisibility(true);
      akah_dist_layer.setVisibility(true);
      akah_block_layer.setVisibility(true);
      akah_villages_layer.setVisibility(false);

      akah_Tool.map.graphics.remove(highlightVillGraphic);

      loc_st_val.attr('value', akahstate[0]);
      for (var i = 0; i<=districts.length ; i++) {
        distValueakah.removeOption(lang.clone(districts[i]));
        distValueakah.store = null;
        distValueakah._setDisplay("")
      }
      distValueakah.set('value', '');
      for (var i = 0; i<=blocks.length ; i++) {
        blockValueakah.removeOption(lang.clone(blocks[i]));
        blockValueakah.store = null;
        blockValueakah._setDisplay("")
      }
      blockValueakah.set('value', '');
      for (var i = 0; i<=villages.length ; i++) {
        vill_valakah.removeOption(lang.clone(villages[i]));
        vill_valakah.store = null;
        vill_valakah._setDisplay("")
      }
      vill_valakah.set('value', '');
      //dojo.query('#akahVillageLevel_WellInfo').style('display','none')
      var sum_var=["vs_well_count","vs_wq","vs_pop","vs_pop_ratio" ,"vs_maj_crop","vs_sw_irr","vs_gw_irr","vs_avail_gw","vs_pre_mon","vs_post_mon","vs_aqui","vs_ws"]
      sum_var.forEach(function(j){domAttr.set(j,"innerHTML",'<b>'+""+'</b>');});
    },

    // print_AKAHInventory_Report: function(){
    //     dojo.query("#pr_load").style("display","block");
    //     // window.tableFieldsArray = [];
    //     // templates = array.map(templateNames, function(ch) {
    //     //     var myprinttemplate = new PrintTemplate();
    //     //     myprinttemplate.layout = myprinttemplate.label = ch;
    //     //     myprinttemplate.format = "PDF";
    //     //     myprinttemplate.preserveScale = false;
    //     //     myprinttemplate.showAttribution = true;
    //     //     myprinttemplate.layoutOptions = {
    //     //       "authorText": "Made by:  Esri's JS API Team",
    //     //       "copyrightText": "<copyright info here>",
    //     //       // "legendLayers": [],
    //     //       "titleText": "Water Security Plan",
    //     //       "scalebarUnit": "Miles",
    //     //       "customTextElements": [{
    //     //         Date: Date.now()
    //     //       }],
    //     //       "data" : ""
    //     //     };
    //     //     return myprinttemplate;
    //     // });
    //     // window.templates = templates
    //     //data pushing ...for report
    //     var data, dataForReport, aoiText, printMap, tableText,rep_head;
    //     var preData = []; var pre_fields= []; var i=1;
    //     dataForReport = [];
    //     preData.length = 0;
    //     pre_fields.length = 0;
    //     akah_villages_layer.setVisibility(false);
    //     akah_Tool.map._layers.Vilages_study_area_9502.setVisibleLayers([0]);
    //     akah_Tool.map._layers.Vilages_study_area_9502.setVisibility(true)
    //     akah_Tool.map._layers["Vilages_study_area_9502"].setLayerDefinitions(["Block_1 like '"+akahblock+"'"])
    //     // printMap = {
    //     //   addPageBreak: true,
    //     //   type: "map",
    //     //   map: akah_Tool.map
    //     //   // printTemplate: templates
    //     // };
    //     // printMap = {
    //     //   addPageBreak: true,
    //     //   type: "map",
    //     //   map: akah_Tool.map
    //     //   // printTemplate: templates
    //     // };
    //     rep_head={
    //       title:"",
    //       type:"html",
    //       data:rep_header_text
    //     }
    //     aoiText = {
    //       title: "",
    //       type: "html",
    //       data:  "<div class='esrCTAOIInfoDiv'>" +
    //       // Title
    //       "<div>" +
    //       "<input tabindex='0' style='width:100%;border:none;' type='text'" +
    //       "role='textbox' aria-label='Area of Interest (AOI) Information'>" +
    //       "</div>" +
    //       // Date
    //       "<div>" +
    //       "<input type='text' tabindex='0' style='width:100%;border:none;' value='" + akah_Tool._getDate() + "'" +
    //       "role='textbox' aria-label='" + akah_Tool._getDate() + "'>" +
    //       "</div>" +
    //       // "<input type='text' tabindex='0' style='width:100%;border:none;' value='" + this._getDate() + "'" +
    //       // "role='textbox' aria-label='" + this._getDate() + "'>" +
    //       // "</div>"+
    //       "</div>"
    //     };
    //     if (akah_wellRegistration_response != " ") {
    //         var akahVillageResponse = akah_village_selectedwell_response.features[0];window.akahVillageResponse = akahVillageResponse;
    //     }
    //     else{
    //         alert("Please give a valid input");
    //     }

    //     //start>> code for Aquifer table report

    //     // var aqui_headings=["Principle Aquifer","Major Aquifer", "Aquifer System", "Aquifer Type","Thickness of Weathered Zone (in meters)", "Decadal average-m", "Transmissivity", "Yield (%)","Specific Yield", "Quality(EC in Micromhos/cm)"]
    //     // //var aqui_names=["AQUIFER","AQUIFER0", "SYSTEM", "AQUIFERS", "ZONE_M", "AVG_m", "M2_PERDAY", "M3_PER_DAY", "YEILD__", "PER_CM"];
    //     // var aqui_tab="<table class='akahReportTable'>";
    //     // for(var aq_index=0;aq_index<aqui_headings.length;aq_index++){
    //     //   aqui_tab=aqui_tab+"<tr><td class='ReportTable_subHdngs tablesLeftColumn'>"+aqui_headings[aq_index] +"</td><td class='tablesRightColumn'>"+Object.values(aqui_response.features[0].attributes)[aq_index] +"</td></tr>";
    //     // }
    //     // aqui_tab=aqui_tab+"</table>";

    //     //end>> code for Aquifer table report


    //     //start>> code for groundwater resource extraction
    //     //
    //     // var gwre_headings=["Groundwater Extraction (Ha.m)","Projected Demand  (Ha.m)","Groundwater Allocation (Ha.m)"]
    //     // var gwre_names=["total","proj_dem","gw_alloc"]
    //     // var gwre_tab="<table class='akahReportTable'>";
    //     // for(var gwre_index=0;gwre_index<gwre_headings.length;gwre_index++){
    //     //   gwre_tab=gwre_tab+"<tr><td class='ReportTable_subHdngs tablesLeftColumn'>"+gwre_headings[gwre_index] +"</td><td class='tablesRightColumn'>"+rf_response.features[0].attributes[gwre_names[gwre_index]] +"</td></tr>";
    //     // }
    //     // gwre_tab=gwre_tab+"</table>";

    //     //end>> code for groundwater resource extraction

    //     // if(document.getElementById("rfchartR")){
    //     //       document.getElementById("rfchartR").remove();
    //     //     }
    //     //
    //     //     var rfchartDiv = document.createElement("DIV");
    //     //     rfchartDiv.id="rfchartR";
    //     //     rfchartDiv.style.display="none";
    //     //
    //     //     document.getElementById("akah_LocationStyles").append(rfchartDiv);
    //     //     rfchart_chart = new dojox.charting.Chart2D("rfchartR", { type: Pie , radius: 100, stroke: {width: 0}, font: "normal normal bold 14px TimesnewRoman", fontColor: "black", /*labelOffset: -4,*/ labels: false, labelStyle: "default",htmlLabels: true});
    //     //     var rfchartData = [{ y: rf_response.features[0].attributes["rnfl_mon"]+rf_response.features[0].attributes["oth_mon"], /*tooltip:" <b>: " + (rf_response.features[0].attributes["rnfl_mon"]+rf_response.features[0].attributes["oth_mon"]) +"</b>",*/ fill:"#8094b7"},
    //     //                            { y: rf_response.features[0].attributes["nonmon"]+rf_response.features[0].attributes["oth_nonmon"], /*tooltip:"Junagadh <b>: "+"NonMon" +"</b>",*/ fill:"#6098ef"}];
    //     //     rfchart_chart.addPlot("default", { type: Pie , radius:100});
    //     //     rfchart_chart.addSeries("Series A", rfchartData);
    //     //     rfchart_chart.render();
    //     //
    //     //     var rfchart=document.getElementById("rfchartR").innerHTML;
    //     //
    //     //
    //     //
    //     //     if(!document.getElementById("block_rf_legend")){
    //     //     var rflegendDiv = document.createElement("DIV");
    //     //     rflegendDiv.id="block_rf_legend";
    //     //     rflegendDiv.style.display="none"
    //     //     document.getElementById("akah_LocationStyles").append(rflegendDiv);
    //     //     domAttr.set("block_rf_legend","innerHTML","<div style='line-height: 2em;top: 113px;position: relative;right: 92px;'>"+
    //     //                                   "<span style='padding: 0px 8px 0px 6px;color:#8094b7;background-color:#8094b7;font-size: 13px;margin-left:44px;border-radius:3px;'>.</span><span>&nbsp;Monsoon</span><br>"+
    //     //                                   "<span style='padding: 0px 8px 0px 6px;color:#6098ef;background-color:#6098ef;font-size: 13px;margin-left:44px;border-radius:3px;'>.</span><span>&nbsp;Nonmonsoon</span><br>"+"</div>");
    //     //     }
    //     //
    //     //
    //     //
    //     //     var rf_table="<table class='akahReportTable' style='top: 100px;position: relative;'>"+
    //     //     "<tr><td class='ReportTable_subHdngs tablesLeftColumn' style='width: 60%;'>"+"Monsoon (mm)" +"</td><td class='tablesRightColumn'>"+
    //     //     (rf_response.features[0].attributes["rnfl_mon"]+rf_response.features[0].attributes["oth_mon"]).toFixed(2)+
    //     //     "</td></tr>"+
    //     //     "<tr><td class='ReportTable_subHdngs tablesLeftColumn' style='width: 60%;'>"+"Nonmonsoon (mm)" +"</td><td class='tablesRightColumn'>"+
    //     //     (rf_response.features[0].attributes["nonmon"]+rf_response.features[0].attributes["oth_nonmon"]).toFixed(2)+
    //     //     "</td></tr>"+
    //     //     "<tr><td class='ReportTable_subHdngs tablesLeftColumn' style='width: 60%;'>"+"Total Rainfalls (mm)" +"</td><td class='tablesRightColumn'>"+
    //     //     (rf_response.features[0].attributes["rnfl_mon"]+rf_response.features[0].attributes["oth_mon"]+rf_response.features[0].attributes["nonmon"]+rf_response.features[0].attributes["oth_nonmon"]).toFixed(2)+
    //     //     "</td></tr>"+
    //     //     "</table>";

    //     /*block level main_map*/
    //     var template_BlockMap=new PrintTemplate();
    //     // temple.layout='A4 Portrait';
    //     template_BlockMap.layout='Layout_blockmap';
    //     template_BlockMap.exportOptions = {
    //       dpi: 300
    //     };
    //     // temple.format='JPG';
    //     template_BlockMap.format = "JPG";
    //     template_BlockMap.preserveScale = false;
    //     template_BlockMap.showAttribution = true;
    //     template_BlockMap.layoutOptions={
    //       scalebarUnit:"Kilometers",
    //       // legendLayers :[legendLayer],
    //     }

    //     var blockMapParams = new PrintParameters();
    //     blockMapParams.map = akah_Tool.map;
    //     blockMapParams.template = template_BlockMap;

    //     var BlockPrintTask = new PrintTask(app.printUrl);
    //     /*block level main_map*/

    //     window.printing_tool_exe = BlockPrintTask.execute(blockMapParams, function (evt){
    //       window.printres=evt.url;
    //       window.printing_tool_exe = BlockPrintTask.execute(blockMapParams, function (evt){
    //         dist_keymap=evt.url;
    //         document.getElementsByClassName('bar_akah-inner')[0].dataset.percent = "100%"
    //         document.getElementsByClassName('bar_akah-inner')[0].style.width = "100%"
    //         var info_statement='';
    //         // window.printres=main_map;
    //         window.printres1=aqui_and_ws;
    //         if (akahstate === "Maharashtra") {
    //           info_statement = '<div><p style="font-size: 19px;font-weight: 600;color: darkblue;">Regional Hydrogeology</p>'+
    //           '<p style="text-align: justify;font-size: 14px;">The ground water is isolated in alluvial pockets of Godavari, Shivna, Purna and their tributaries occur under semi-confined conditions. The saturated thickness comprises of silty clay, sand & gravel from 1-7 meters. The potential aquifer zone is isolated in soft rock strata underlies between 15 to 26 m bgl with discharge rate of 4.5 lps. The dugwells are generally down to 20 m depth and yields varying between 0.5 and 0.8 lps. The ground water occurs under water table and semi confined to confined conditions in Deccan Trap Basalt. The storage of ground water in compact massive unit totally depends upon the presence of joints and their nature, distribution and interconnection. The average depth range of dugwells is 12.00 m to 15.00 m and that of borewells is 50.00 to 60.00 m in hard rock areas, whereas the yield ranges from 0.60 to 3.10 lps.</p></div>';
    //         }
    //         else{
    //           info_statement = '<div><p style="font-size: 19px;font-weight: 600;color: darkblue;">Regional Hydrogeology</p>'+
    //           '<p style="text-align: justify;font-size: 14px;">The area is concealed with hard rock terrains, mainly basalts and some soft rock formations entailed with limestone and alluvium.'+
    //           'The concerned aquifer systems present here are unconfined to semi-confined zones with secondary porosity access.'+
    //           'The permeability of the aquifers system is exaggerated by joints and fractures in formations that have generated stratified aquifer systems.'+
    //           'This platform can be used to keep a check on water level fluctuations in the region.</p></div>';
    //         }
    //         tableText = {
    //           type: "html",
    //           data:
    //           // '<br><div style="display:inline-flex;margin-top: 40px;"><div style="display:inline-grid;"><p class="mapHdngSizes">District Boundaries</p><img src="'+rv['district_keyMapUrl']+'" style="width: 85%;margin-top: 20px;margin-bottom: 30px;" alt="district_map"></div>'+
    //           // '<div style="display:inline-grid;"><p class="mapHdngSizes">Block Boundaries</p><img src="'+rv['block_keyMapUrl']+'" style="width: 85%;margin-top: 20px;margin-bottom: 30px;" alt="block_keymap"></div></div>'+
    //           '<br><div style="display:inline-flex;margin-top: 19px;"><div><img src="'+dist_keymap+'" style="width: 100%;margin-top: 20px;margin-bottom: 30px;" alt="district_map"></div>'+
    //           '<div><img src="'+block_keymap+'" style="width: 100%;margin-top: 20px;margin-bottom: 30px;" alt="block_keymap"></div></div>'+
    //           '<div style="text-align:center"><img src="'+printres+'" style="width: 100%;margin-bottom: 30px;" alt="block_map"></div>'
    //           // "<div style='text-align:center'>"+printMap.map+"</div>"
    //         }
    //         window.tableText2 = {type:"html", data:
    //           "<h2 class='akahReportTableheadings'>1. Block Profile</h2>" +
    //           "<table class='akahReportTable1' style='margin-bottom: 10px;'>" +
    //           "<tr><td colspan=3 class='th_head'>A. Socio-Economic profile</td><tr>"+
    //           "<tr style='font-weight:600;text-align:left'><td>S.no.</td><td colspan=2>Parameters</td></tr>"+
    //           // "<tr><td>1.</td><td class='ReportTable_subHdngs'>State</td><td style='width: 45%;'>"+akahVillageResponse.attributes.state +"</td></tr>" +
    //           // "<tr><td>2.</td><td class='ReportTable_subHdngs'>District</td><td>"+akahVillageResponse.attributes.district+"</td></tr>" +
    //           // "<tr><td>3.</td><td class='ReportTable_subHdngs'>Block</td><td>"+akahVillageResponse.attributes.block+"</td></tr>" +
    //           "<tr><td>1.</td><td class='ReportTable_subHdngs' style='width: 40%;'>Block area (in ha)</td><td>"+rv["block_area_summ"].toFixed(2)+"</td></tr>" +
    //           "<tr><td>2.</td><td class='ReportTable_subHdngs'>Block population</td><td>"+rep_val3+"</td></tr>" +
    //           // "<tr><td>6.</td><td class='ReportTable_subHdngs'>Male population</td><td>"+rv["block_male_pop"]+"</td></tr>" +
    //           // "<tr><td>7.</td><td class='ReportTable_subHdngs'>Female population</td><td>"+rv["block_female_pop"]+"</td></tr>" +
    //           "<tr><td>3.</td><td class='ReportTable_subHdngs'>Sex ratio (F:M)</td><td>"+rv["block_fm_ratio"]+"</td></tr>" +
    //           "<tr><td>4.</td><td class='ReportTable_subHdngs'>Total no. of villages</td><td>"+rv['Total_villages_in_block']+"</td></tr>" +
    //           // "<tr><td>5.</td><td class='ReportTable_subHdngs'>Largest village</td><td>"+rv['Largest_village']+"</td></tr>" +
    //           // "<tr><td>6.</td><td class='ReportTable_subHdngs'>Smallest village</td><td>"+rv['Smallest_village']+"</td></tr>" +


    //           // "<tr><td>9.</td><td class='ReportTable_subHdngs'>Livestock population</td><td>"+''+"</td></tr>" +


    //           // "<tr><td colspan=3 class='th_head'>C. Field Data Collection</td><tr>"+
    //           // "<tr><td>1.</td><td class='ReportTable_subHdngs'>AKAH survey wells</td><td>"+rv['block_wr_count']+"</td></tr>" +
    //           // "<tr><td>2.</td><td class='ReportTable_subHdngs'>AKAH long term observation wells</td><td>"+rep_val2+"</td></tr>" +
    //           "<tr><td colspan=3 class='th_head'>B. Basin and Watershed information</td><tr>"+
    //           // "<tr><td>1.</td><td class='ReportTable_subHdngs'>CGWB Observation wells</td><td>"+34+"</td></tr>" +
    //           "<tr><td>1.</td><td class='ReportTable_subHdngs'>River basin</td><td>"+rv['block_ws_basin']+"</td></tr>" +
    //           "<tr><td>2.</td><td class='ReportTable_subHdngs'>Sub-basin</td><td>"+rv['block_ws_sub_basin']+"</td></tr>" +
    //           "<tr><td>3.</td><td class='ReportTable_subHdngs'>Watershed name</td><td>"+rep_val6+"</td></tr>" +
    //           "<tr><td>4.</td><td class='ReportTable_subHdngs'>Watershed area (in ha)</td><td>"+rv['block_ws_area'].toFixed(2)+"</td></tr>" +

    //           "<tr><td colspan=3 class='th_head'>C. Groundwater resources scenario</td><tr>"+
    //           "<tr><td>1.</td><td class='ReportTable_subHdngs'>Principle aquifer</td><td>"+rep_val5+"</td></tr>" +
    //           "<tr><td>2.</td><td class='ReportTable_subHdngs'>Minor aquifer</td><td>"+rep_val5_1+"</td></tr>" +
    //           //"<tr><td>7.</td><td class='ReportTable_subHdngs'>Average annual rainfall in the district (mm)</td><td>"+876.60+"</td></tr>" +
    //           "<tr><td>3.</td><td class='ReportTable_subHdngs'>2020 Pre-Monsoon water levels (CGWB)</td><td>"+rep_val7+"</td></tr>" +
    //           "<tr><td>4.</td><td class='ReportTable_subHdngs'>2020 Post-Monsoon water levels (CGWB)</td><td>"+rep_val8+"</td></tr>" +
    //           "<tr><td>5.</td><td class='ReportTable_subHdngs'>CGWB Water Quality status</td><td>"+rep_val4+"</td></tr>" +
    //           "</table>"+'<div style="text-align: center; color: #9e3f07;margin-bottom:20px;"><b>*Water Quality Status is computed based on drinking water quality standards by Bureau Of Indian Standards.</b></div>'+
    //           "<table class='akahReportTable1' style='margin-bottom:10px;'>"+
    //           "<tr><td colspan=3 class='th_head'>D. Surface water resources scenario</td><tr>"+
    //           "<tr><td>1.</td><td class='ReportTable_subHdngs'>Surface water bodies area (in ha)<br>(like farm ponds, tanks, etc)</td><td>"+rv["surface_water_bodies_count_block"].toFixed(2)+"</td></tr>" +
    //           "<tr><td>2.</td><td class='ReportTable_subHdngs'>Estimated storage capacity (in ha meter)</td><td>"+rv["surface_water_bodies_volume"]+"</td></tr>" +
    //           "<tr><td>3.</td><td class='ReportTable_subHdngs'>Surface water available to use in 2020 (in ha meter)</td><td>"+rv["storage_water_available_block"]+"</td></tr>" +
    //           "</table>"+
    //           '<div style="display:inline-flex"><div>'+
    //           '<span style="font-size:19px;color: #9e3f07;padding-right: 26px;font-weight: 600;margin:0px">'+
    //           '*Assumptions based on CGWB field reports: Depth of water bodies= 1.5 m</span>'+
    //           '<span style="font-size:14px;padding-right: 26px;color: #9e3f07;font-weight: 600;margin:0px">'+
    //           '<br>*No. of fillings = 3 (2 in monsoon + 1 in non-monsoon)'+
    //           '<br>*Surface water available to use (ha m) = (Estimated storage capacity x No. of fillings in a year) - Evapotranspiration losses'+
    //           '<br>*Evapotranspiration losses (ha m) = Block area x evaportranspiration value x0.001'+
    //           '<br>*Block level Evapotranspiration losses taken from IWRIS data</span>'+
    //           '</div>'+
    //           '<div style="text-align: center;margin-bottom: 200px;">'+'<img src="'+farm_pond_cross_section+'" style="width:350px" alt="farm_pond_cross_section">'+'</div></div>',
    //         addPageBreak:true
    //          };
    //         map_tableText = {
    //         type: "html",
    //         data:
    //           // '<div><div style="text-align: center;margin-top: 20px;margin-bottom: 200px;">'+'<img src="'+farm_pond_cross_section+'" style="width:450px" alt="farm_pond_cross_section">'+'<div style="text-align:center;font-weight:600;margin-top: 10px;">Figure: Farm pond cross section</div></div>'+
    //           '<p style="font-weight: 600;font-size: 20px;text-align: center;margin: 0px;">District Level Hydrogeology map - '+akahdistrict+'</p><div style="text-align:center"><img src="'+printres1+'" style="width: 87%;" alt="hydroGeomap"></div>'+info_statement+
    //           '<p style="font-weight: 600;font-size: 20px;text-align: center;margin: 0px;">Block Level Watershed map - '+akahblock+'</p><div style="text-align:center"><img src="'+watershedMap+'" style="width: 87%;" alt="watershedmap"></div>'+
    //            res1+

    //           // "<div style='display:flex'><div style='flex:1;text-align:center'>"+rep_sown_piechart+"</div><div style='flex:1;text-align:center'>"+
    //           // rep_irrig_piechart+"</div></div>"+
    //           "<div style='display:inline-flex;width:100%'>"+
    //           "<div style='display:inline-flex;width:100%;margin-top: 30px;'>"+
    //           // "<div style='flex:2;padding-top: 100px;'>"+
    //           // "<table class='akahReportTable1' style='margin-bottom: 10px;'>" +
    //           // "<tr><td colspan=3 class='th_head'>D. Irrigated Area</td><tr>"+
    //           // "<tr><td>1.</td><td class='ReportTable_subHdngs'>Net Sown area (in ha)</td><td>"+(rv["block_areairr_canals"]+rv["block_areairr_wells"])+"</td></tr>" +
    //           // //"<tr><td>2.</td><td class='ReportTable_subHdngs'>Total Irrigated Area (in ha) </td><td>"+(rv["block_areairr_canals"]+rv["block_areairr_wells"])+"</td></tr>" +
    //           // "<tr><td>2.</td><td class='ReportTable_subHdngs'>Area Irrigated by Surface Water (in ha)</td><td>"+rv["block_areairr_canals"]+"</td></tr>" +
    //           // "<tr><td>3.</td><td class='ReportTable_subHdngs'>Area Irrigated by Ground Water (in ha)</td><td>"+rv["block_areairr_wells"]+"</td></tr>" +
    //           // "</table>"+
    //           // "</div>"+

    //           "<div>"+
    //           rep_irrig_piechart+
    //           "</div>"+
    //           "<div style='padding-top: 195px;'>"+

    //           "<div style='display:inline-flex;'>"+
    //           "<div style='width:17px;height:16px;border:1.6px solid white;background-color:#2840ec;border-radius: 4px;'></div>"+
    //           "<span style='padding-left:5px;'>Area Irrigated by Surface Water</span></div>"+

    //           "<div style='display:inline-flex;padding-top:10px;'>"+
    //           "<div style='width:17px;height:16px;border:1.6px solid white;background-color:#edd8c0;border-radius: 4px'></div>"+
    //           "<span style='padding-left:5px;'>Area Irrigated by Ground Water</span></div>"+

    //           "</div>"+
    //           "</div></div>"+"<p class='ReportTable_subHdngs' style='font-size: larger;padding-left: 60px;margin:2px;'>Net Sown area (in ha) = "+(rv["block_areairr_canals"]+rv["block_areairr_wells"])+"</p>"+
    //           '<p style="font-weight: 600;color: #9e3f07;padding: 0px;margin: 1px 0px 0px 55px;">*Sources: Block-level Irrigation Data taken from Census 2011</p>',
    //           addPageBreak: true
    //         };
    //         tableText1 = {
    //           type: "html",
    //           data:
    //           // "<table class='akahReportTable1' style='margin-bottom: 10px;'>" +
    //           // "<tr><td colspan=3 class='th_head'>D. Surface Water Scenario</td><tr>"+
    //           //
    //           // "</table>"+

    //           // '<span>'+
    //           // '<span style="font-weight: 600;">Data Sources:</span>'+'<span style="padding-left: 12px;margin-top: 12px;"><b>1. </b> AKAH Observation Wells Data</span>'+
    //           // '<span style="padding-left: 21px;"> <b>2. </b>Census 2011</span>'+'<span style="padding-left: 21px;"><b>3.</b> Central Ground Water Board <p></p></span>'+'</span>'+
    //           "<h2 class='akahReportTableheadings'>2. Groundwater resources at block level</h2>" +
    //           "<p style='padding-left: 30px;font-size: 18px;font-weight: 600;'>a. Annual Rainfall Graph (2014 to 2020)</p>"+
    //           rep_rainfall_chart+"<p style='font-weight: 600;padding: 0px;color: #9e3f07;margin: 1px 0px 0px 55px;'>*Normal rainfall is a long period average of 30 years to 50 years rainfall.</p>"+
    //           "<p style='padding-left: 30px;font-size: 18px;font-weight: 600;'>b. Estimated Groundwater Resources (Baseline Year - 2017)</p>"+
    //           '<div style="text-align:center;">'+rep_bar_chart+'</div>'+'<p style="font-size: 16px;padding-left: 62px;font-weight: 600;color: darkblue;">CGWB Categorization of Groundwater Resources (Block-level): Semi-critical </p>'+
    //           '<p style="font-weight: 600;color: #9e3f07;padding: 0px;margin: 1px 0px 0px 55px;">*Source: CGWB Groundwater Resources Report (2017)</p>'+

    //           '<div style="display:flex;"><div style="flex:3;margin-top:95px"><p style="padding-left: 30px;color:#9e3f07;font-weight: 600;">*Net GW Availability = (Recharge from rainfall in monsoon &amp; non-monsoon + Recharge from other sources in monsoon &amp; non-monsoon) – Losses through natural discharges</p>'+
    //           '<p style="padding-left: 30px;color:#9e3f07;font-weight: 600;">*Future GW Availability = Net GW availibility - total extraction for domestic &amp; Irrigations demand</p>'+'</div>'+
    //           '<div style="flex:6;">'+'<img src="'+gw_3dimage+'" style="width: 90%;" alt="gw_3dimage">'+'</div></div>'+
    //           "<div><h2 class='akahReportTableheadings' style='text-align:center;'>Land Use Land Cover </h2></div>"+
    //           '<div style="padding-left:2%;font-size: larger;background-color: #f9f8f8;margin: 0px 60px 0px 30px;padding: 8px;border-radius: 10px;"><span class="ReportTable_subHdngs"> State: &nbsp;</span>'+
    //           '<span style="color: #50a184;font-weight: 600;">'+akahstate+'</span>&nbsp;&nbsp;<span class="ReportTable_subHdngs"> District: &nbsp;</span>'+
    //           '<span style="color: #50a184;font-weight: 600;">'+akahdistrict+'</span>&nbsp;&nbsp;<span class="ReportTable_subHdngs"> Block: &nbsp;</span>'+
    //           '<span style="font-weight: 600;color: #50a184;font-weight: 600;">'+akahblock+'</span>&nbsp;&nbsp;</div>'+
    //           "<div style='display:inline-flex !important;'>"+dom.byId('blockLULC').innerHTML+"</div>"+
    //           '<div style="text-align: center;color:#9e3f07;padding-top: 11px;"><b>Data Source:</b> Sentinel-2 satellite imageries.</div>',
    //           addPageBreak:true
    //         };
    //         village_tableText = {
    //           type: "html",
    //           data:
    //           //+baselinannual_checklist.data+futureScenario_checklist.data+
    //           "<h2 style='text-align:center;margin:2px;line-height:1em;' class='akahReportTableheadings'>Village Profile: "+akahvillage+"</h2>" +
    //           '<div style="text-align:center"><img src="'+villageMap+'" style="width: 80%;" alt="village map"></div>'+
    //           "<table class='akahReportTable1' style='margin-bottom: 10px;'>" +
    //           "<tr><td colspan=5 class='village_th_head'>A. Socio-Economic profile</td><tr>"+
    //           "<tr><td>1.</td><td class='ReportTable_subHdngs'>Village</td><td colspan=3 style='width: 45%;'>"+akahVillageResponse.attributes.village_name+"</td></tr>" +
    //           "<tr><td colspan=2 class='th_head_temp'></td><td class='th_head_temp' style='width: 20%;'>Actual Value</td><td colspan=2 class='th_head_temp'>Block Proportion(%)</td></tr>"+
    //           "<tr><td>2.</td><td class='ReportTable_subHdngs'>Village area(in ha)</td><td>"+rep_vil7_1+"</td><td colspan=2>"+Number(Number(rep_vil7_1)/rv['block_area_abs']*100).toFixed(2)+"  % of Block area</td></tr>" +
    //           "<tr><td>3.</td><td class='ReportTable_subHdngs'>Village population</td><td>"+rep_vil3+"</td><td colspan=2>"+Number(Number(rep_vil3)/rv['block_area_abs']*100).toFixed(2)+"  % of Block population</td></tr>" +
    //           // "<tr><td>4.</td><td class='ReportTable_subHdngs'>Male population</td><td>"+rv['village_population_male']+"</td></tr>" +
    //           // "<tr><td>5.</td><td class='ReportTable_subHdngs'>Female population</td><td>"+rv["village_population_female"]+"</td></tr>" +
    //           "<tr><td>4.</td><td class='ReportTable_subHdngs'>Sex ratio (F:M)</td><td colspan=3>"+rep_vil4+"</td></tr>" +
    //           // "<tr><td>7.</td><td class='ReportTable_subHdngs'>Livestock population</td><td>"+''+"</td></tr>" +
    //           "<tr><td colspan=5 class='village_th_head'>B. Irrigated Area</td><tr>"+
    //           "<tr><td colspan=2 class='th_head_temp'></td><td class='th_head_temp'>Actual Value</td><td class='th_head_temp'>Village Proportion(%)</td><td class='th_head_temp'>Block Proportion(%)</td></tr>"+
    //           "<tr><td>1.</td><td class='ReportTable_subHdngs'>Net Sown area (in ha)</td><td>"+(rv['village_areairr_gw']+rv['village_areairr_sw'])+"</td><td>"+
    //           Number(Number((rv['village_areairr_gw']+rv['village_areairr_sw'])/Number(rep_vil7_1))*100).toFixed(2)+"</td><td>"+
    //           Number(Number((rv['village_areairr_gw']+rv['village_areairr_sw'])/rv['block_area_abs'])*100).toFixed(2)+"</td></tr>" +
    //           // "<tr><td>2.</td><td class='ReportTable_subHdngs'>Total Irrigated Area (in ha)</td><td>"+(rv['village_areairr_gw']+rv['village_areairr_sw'])+"</td></tr>" +
    //           "<tr><td>2.</td><td class='ReportTable_subHdngs'>Area Irrigated by wells (in ha)</td><td>"+rv['village_areairr_gw']+"</td><td>"+
    //           Number((rv['village_areairr_gw']/Number(rep_vil7_1))*100).toFixed(2)+"</td><td>"+
    //           Number((rv['village_areairr_gw']/rv['block_area_abs'])*100).toFixed(2)+"</td></tr>" +
    //           "<tr><td>3.</td><td class='ReportTable_subHdngs'>Area Irrigated by Canals/surface water bodies (in ha)</td><td>"+rv['village_areairr_sw']+"</td><td>"+
    //           Number((rv['village_areairr_sw']/Number(rep_vil7_1))*100).toFixed(2)+"</td><td>"+
    //           Number((rv['village_areairr_sw']/rv['block_area_abs'])*100).toFixed(2)+"</td></tr>" +
    //           // "<tr><td colspan=3 class='th_head'>C. Field Data Collection</td><tr>"+
    //           // "<tr><td>1.</td><td class='ReportTable_subHdngs'>AKAH survey wells</td><td>"+(dugWell_count+boreWell_count)+"</td></tr>" +
    //           // "<tr><td>2.</td><td class='ReportTable_subHdngs'>AKAH long term observation wells</td><td>"+rep_vil1+"</td></tr>" +
    //           // "<tr><td class='ReportTable_subHdngs'>DugWells</td><td>"+dugWell_count+"</td></tr>" +
    //           // "<tr><td class='ReportTable_subHdngs'>BoreWells</td><td>"+boreWell_count+"</td></tr>" +

    //           //"<tr><td class='ReportTable_subHdngs'>Water Quality <sup>1</sup></td><td>"+rep_vil2+"</td></tr>" +

    //           //"<tr><td class='ReportTable_subHdngs'>Area irrigated by surface water sources <sup>2</sup></td><td>"+rep_vil6+"</td></tr>" +
    //           //"<tr><td class='ReportTable_subHdngs'>Major crops grown <sup>1</sup></td><td>"+rep_vil5+"</td></tr>" +
    //           //"<tr><td class='ReportTable_subHdngs'>Area irrigated by ground water sources <sup>2</sup></td><td>"+rep_vil7+"</td></tr>" +
    //           //"<tr><td class='ReportTable_subHdngs'>Available surface water</td><td>"+rep_vil8+"</td></tr>" +
    //           //"<tr><td class='ReportTable_subHdngs'>Pre-Monsoon water levels <sup>1</sup></td><td>"+rep_vil9+"</td></tr>" +
    //           //"<tr><td class='ReportTable_subHdngs'>Post-Monsoon water levels <sup>1</sup></td><td>"+rep_vil10+"</td></tr>" +
    //           // "<tr><td class='ReportTable_subHdngs'>Aquifer <sup>3</sup></td><td>"+rep_vil11+"</td></tr>" +
    //           // "<tr><td class='ReportTable_subHdngs'>Watershed <sup>3</sup></td><td>"+rep_vil12+"</td></tr>" +
    //           "</table>"+rep_village_irrig_piechart+'<p style="font-weight: 600;color:#9e3f07;padding: 0px;margin: 1px 0px 0px 55px;">*Sources: Village-level Irrigation Data taken from Census 2011</p>',
    //           // '<span>'+
    //           // '<span style="font-weight: 600;">Data Sources:</span>'+'<span style="padding-left: 12px;margin-top: 12px;"><b>1. </b> AKAH Observation Wells Data</span>'+
    //           // '<span style="padding-left: 21px;"> <b>2. </b>Census 2011</span>'+'<span style="padding-left: 21px;"><b>3.</b> Central Ground Water Board <p></p></span>'+'</span>'+
    //           addPageBreak:true
    //         };

    //         village_tableText1 = {
    //           type: "html",
    //           data:
    //           "<h2 class='akahReportTableheadings' style='line-height: 1.3em;font-size: 28px;'>4. Groundwater & Surface water resources at village level</h2>" +
    //           "<div style='padding-top: 10px;'><h3 class='akahReportTableSide_headings'>a. Dynamic groundwater resources</h3></div>"+
    //           "<table class='akahReportTable1'>" +
    //           "<tr><td class='ReportTable_subHdngs' colspan='2' style='text-align:center'>Total Groundwater Available (Ground Water Resource Assessment Report (2017) )</td></tr>"+
    //           "<tr><td class='ReportTable_subHdngs'>Recharge from rainfall (ha.m)</td> <td style='width:45%'>"+Number(rv['recharge_rainfall']).toFixed(2)+"</td></tr>"+
    //           "<tr><td class='ReportTable_subHdngs'>Recharge from other sources (ha.m)</td><td>"+Number(rv['recharge_other']).toFixed(2)+"</td></tr>"+
    //           "<tr><td class='ReportTable_subHdngs'>Total Groundwater Available (ha.m)</td><td>"+rv['total_gnd_wtr']+"</td></tr>"+
    //           "</table>"+
    //           '<p style="font-size: 11px;font-weight: 600;color:#9e3f07;line-height: 1em;">*Block level values are downscaled to village level using the below equation:<br>'+
    //           '<span style="padding-left: 4px;color:#9e3f07;">Downscaled Value = Block level resources * (Village area/Block area)</span></p>'+

    //           "<div><h3 class='akahReportTableSide_headings'>b. Surface water resources</h3></div>"+
    //           "<table class='akahReportTable1'>" +
    //           "<tr><td>1.</td><td class='ReportTable_subHdngs'>Surface water bodies area (in ha)<br>(like farm ponds, tanks, etc)</td><td style='width:45%'>"+rv["surface_water_bodies_count"]+"</td></tr>"+
    //           "<tr><td>2.</td><td class='ReportTable_subHdngs'>Storage capacity (ha.m)</td><td>"+rv['sw_storage_volume_village']+"</td></tr>"+
    //           "<tr><td>3.</td><td class='ReportTable_subHdngs'>Surface water available to use (ha.m)</td><td>10.95</td></tr>"+
    //           "</table>"+
    //           '<p style="font-size: 11px;color:#9e3f07;font-weight: 600;">*Source: Manually mapped Surface water bodies i.e. farm ponds, lakes, reservoirs</p>'
    //           // "<table style='padding-top: 20px;' class='akahReportTable'>"+"<tr><td colspan="+(Number(well_data_info.uid.length)+2)+" class='village_th_head'>c. Long term Observation Wells Data</td><tr>"+
    //           // well_table +
    //           // "</table><br>"+'<div style="padding-left: 20px;color:#9e3f07;margin-bottom:150px"><b>* All Depth values are measured in Meters below ground level (mbgl)</b></div>',
    //           // "<div style='padding-top: 20px;'><h3 class='akahReportTableSide_headings'>c. Real-time Groundwater level monitoring</h3></div>"+
    //           // rep_charts+
    //           // '<div style="color:black;display:inline-flex;"><div> <span><b style="font-size:14px;color: #005fa2;"><u>Formula for Trendline&nbsp;</u></b><br><br> is given by: <span style="font-size:14px">Y = mx + c</span></span><br> <span style="font-size:14px">c (intercept) = (∑y ∑x<sup>2</sup> -  ∑x ∑xy) / (n (∑x<sup>2</sup>) – (∑x)<sup>2</sup>) </span><br> <span style="font-size:14px">m (slope) = (n ∑xy  -  (∑x)  (∑y)) / (n (∑x<sup>2</sup>) – (∑x)<sup>2</sup>)</span><br> <span>Where,</span><br> <span>X and y are two variables on the regression line.</span><br> <span>M = slope of the line,</span><br> <span>C = y- intercept of the line,</span><br> <span>X = Values of dates,</span><br> <span>Y = values of Predicted Groundwater Levels.</span><br> </div> <div style="padding-left:90px"> <span><b style="font-size:14px;color: #005fa2;"><u>Formula for Deviation</u></b></span><br><br> <span style="font-size:14px;">Deviation = √(∑_(i=1)^N (Predicted<sub>(i)</sub> - Actual<sub>(i)</sub>)<sup>2</sup>/N)</span> </div> </div><br><br>'+

    //           // "<div style='padding-top: 20px;'><h3 class='akahReportTableSide_headings'>d. Observation Wells Data</h3></div>"+
    //           // addPageBreak: true
    //         };
    //         // village_tableText1 = {
    //         //   type: "html",
    //         //   data: "<table style='padding-top: 20px;' class='akahReportTable'>"+"<tr><td colspan="+(Number(well_data_info.uid.length)+2)+" class='village_th_head'>c. Long term Observation Wells Data</td><tr>"+
    //         //   well_table +
    //         //   "</table><br>"+'<div style="padding-left: 20px;color:#9e3f07;margin-bottom:150px"><b>* All Depth values are measured in Meters below ground level (mbgl)</b></div>',
    //         //   addPageBreak: true
    //         // };

    //         if (akahvillage === 'Katepimpalgaon') {
    //             waterQuality_tableText = {
    //               type: "html",
    //               data: waterQualityKt,
    //               addPageBreak: true
    //             };
    //         }
    //         else{
    //             waterQuality_tableText = {
    //               type: "html",
    //               data:
    //               "<div><h3 class='akahReportTableheadings'>5. Ground Water Quality</h3></div>" +
    //               '<table class="akahReportTable"><tr>'+wq_header_text+'</tr></table>'+

    //               "<table class='akahReportTable2'>" +
    //               "<tr><td class='ReportTable_subHdngs1' rowspan='2'>S.No</td>"+
    //               "<td class='ReportTable_subHdngs1' rowspan='2'>Water Quality Parameter</td><td class='ReportTable_subHdngs1'>Reading</td>"+
    //               "<td class='ReportTable_subHdngs1' rowspan='2'>Acceptable Limit <sup>1</sup></td>"+
    //               "<td class='ReportTable_subHdngs1' rowspan='2'>Permissible Limit <sup>1</sup></td>"+
    //               "<tr><td class='ReportTable_subHdngs1'>Pre-Monsoon</td>"+
    //               wq_tbl2_body1+
    //               "</table>"+
    //               '<table class="akahReportTable" style="margin-bottom: 10px;"><tr><td>'+wq_restbl+'</td></tr></table>'+'<span>'+
    //               '<span style="font-weight: 600;color:#9e3f07;">Data Sources:</span>'+'<span style="padding-left: 12px;margin-top: 12px;"><b>1. </b> Bureau of Indian Standards</span>'+'</span><br><br>'+
    //               wqtbl,
    //               addPageBreak: true
    //             };
    //         }

    //         lulc_tableText = {
    //           type: "html",
    //           data:
    //           // "<div><h3 class='akahReportTableSide_headings'>5. Delineated potential ‘Recharge zones’ suitable for constructing water conservation structures</h3></div>"+
    //           "<div><h2 class='akahReportTableheadings'>5. Land Use Land Cover </h2></div>"+
    //           '<div style="padding-left:2%;font-size: larger;background-color: #f9f8f8;margin: 0px 30px 0px 30px;padding: 8px;border-radius: 10px;"><span class="ReportTable_subHdngs"> State: &nbsp;</span>'+
    //           '<span style="color: #50a184;font-weight: 600;">'+akahstate+'</span>&nbsp;&nbsp;<span class="ReportTable_subHdngs"> District: &nbsp;</span>'+
    //           '<span style="color: #50a184;font-weight: 600;">'+akahdistrict+'</span>&nbsp;&nbsp;<span class="ReportTable_subHdngs"> Block: &nbsp;</span>'+
    //           '<span style="font-weight: 600;color: #50a184;font-weight: 600;">'+akahblock+'</span>&nbsp;&nbsp;<span class="ReportTable_subHdngs"> Village: &nbsp;</span>'+
    //           '<span style="color: #50a184;font-weight: 600;">'+akahvillage+'</span>&nbsp;&nbsp;</div>'+
    //           "<div style='display:inline-flex !important;'>"+dom.byId('villageLULC').innerHTML+"</div>"+
    //           '<div style="text-align: center;color:#9e3f07;padding-top: 11px;"><b>Data Source:</b> Sentinel-2 satellite imageries.</div>'
    //           // "<table class='akahReportTable'>"+
    //         };
    //         dataForReport.push(aoiText);
    //         dataForReport.push(rep_head);
    //         dataForReport.push(tableText);
    //         dataForReport.push(tableText2);
    //         dataForReport.push(map_tableText);
    //         dataForReport.push(tableText1);
    //         dataForReport.push(village_tableText);
    //         dataForReport.push(village_tableText1);
    //         // dataForReport.push(waterQuality_tableText);
    //         dataForReport.push(lulc_tableText);
    //         dataForReport.push({
    //             "type": "note",
    //             "addPageBreak": false
    //         });
    //         akah_Tool.reportDijitmethod();
    //         dojo.query("#pr_load").style("display","none");
    //         akah_Tool.reportDijit.print("Water Governance Management Report", dataForReport);
    //         preData.length = 0;
    //         pre_fields.length = 0;
    //         //domAttr.set("FTLLineChartsReportInfo_dash","innerHTML","")
    //       });
    //   });
    // },

    //modifying print method
   

    reportDijitmethod : function(){
        akah_Tool = this
        var logo, AKAH_ReportStylesheet;
        AKAH_ReportStylesheet = this.folderUrl + "css/AKAHReportStyles.css";
        logo = this.folderUrl + "/images/akah_logo.jpeg";
        // logo = this.folderUrl + "/images/Gcrs_logo.png";
        akah_Tool.reportDijit = new reportDijit({
          reportLogo:  logo,
          appConfig: this.appConfig,
          // footNotes: this.config.reportSettings.footnote,
          printTaskUrl: app.printUrl,
          // reportLayout: {
          //   "pageSize": PageUtils.PageSizes.Letter,
          //   "orientation": PageUtils.Orientation.Portrait
          // },
          styleSheets: [AKAH_ReportStylesheet],
          // styleText: this._getStyleTextForReport(),
          "maxNoOfCols": 5,
          Date: true
        });
    },

    _getDate: function () {
        var dateValue;
        dateValue = locale.format(new Date(), {
          selector: "date",
          formatLength: "short",
          datePattern: "MMM d yyyy H:mm:ss z"
        });
        return dateValue;
    },

    displayWQInfo: function(){
      on(dom.byId("infobtn_WQ"),"click", function(evt){
          wqDialog.set("content",'Water quality status is based on Water Quality standards of Bureau of Indian Standards');
          wqDialog.set("style","font-size:14px");wqDialog.show();
      });
      // on(dom.byId("infobtn_maxCheckBox_ndwi"),"click", function(evt){
      //   maxDialog_ndwi.set("content",'infobtn_maxCheckBox_ndwi resides here!!!');
      //   maxDialog_ndwi.set("style","font-size:14px");wqDialog.show();
      // });
      // on(dom.byId("infobtn_WQ"),"click", function(evt){
      //   maxDialog_ndwi.set("content",'Water quality information resides here!!!');
      //   maxDialog_ndwi.set("style","font-size:14px");wqDialog.show();
      // });
    },

    clearGraphicsonMap: function(){
      akah_Tool.map.graphics.clear();
      domAttr.set("akahLulc_Chart","innerHTML","");
      domAttr.set("lulc_legend","innerHTML","");
      domAttr.set("ndwiLineCharts_info","innerHTML","");
      domAttr.set("ndwi_legend","innerHTML","");
      domAttr.set("ndwi_checkboxtable","innerHTML","");
      domAttr.set("ndviLineCharts_info","innerHTML","");
      domAttr.set("ndvi_legend","innerHTML","");
      domAttr.set("ndvi_checkboxtable","innerHTML","");
      // domAttr.set("ndvi_legend","innerHTML","");
      // domAttr.set("akahNdvi_Chart","innerHTML","");
      domAttr.set('akahLocation_info','innerHTML','');
      dojo.query('#akahLocation_info').style('display','none')
    },

    onOpen: function(){
      var panel = this.getPanel();
      panel.position.width = 650;
      panel.position.height = 580;
      panel.setPosition(panel.position);
      panel.panelManager.normalizePanel(panel);
    },

    onClose: function(){
      console.log('onClose');
    },

    onMinimize: function(){
      console.log('onMinimize');
    },

    onMaximize: function(){
      console.log('onMaximize');
    },

    onSignIn: function(credential){
      /* jshint unused:false*/
      console.log('onSignIn');
    },

    onSignOut: function(){
      console.log('onSignOut');
    },

    showVertexCount: function(count){
      this.vertexCount.innerHTML = 'The vertex count is: ' + count;
    }
  });
  // clazz.extend(a11y);//for a11y
  return clazz;
});
