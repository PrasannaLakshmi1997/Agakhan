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
        "esri/geometry/Polyline",
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
        "dojox/charting/plot2d/commonStacked",
        "dojox/charting/plot2d/Markers",
        "dojox/charting/themes/Tufte",
        "dojox/charting/themes/Claro",
        "dojox/charting/action2d/Magnify",
        "dojox/charting/action2d/MouseIndicator",
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
        "esri/layers/WebTiledLayer",
        "esri/geometry/normalizeUtils",
        "esri/tasks/GeometryService",
        "esri/tasks/BufferParameters",
        // "./ee_api_js"
        // "./privatekey.json"
        // '@google/earthengine',
        "dijit/Dialog",
        './mouseOverEvents',
        './wellFilter',
        './waterSecurityPlan'
      ],
function(declare,executeAll, map, arcgisPortal,Print, PrintTemplate, esriConfig, on, dom, aspect,domStyle,lang,domConstruct,esriRequest,html,array,domGeom, query, Query, QueryTask,FeatureLayer,
         PopupTemplate, AnalysisUtils, Point,Polyline, Graphic, LayerList,Color, Draw, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, Deferred,
         domAttr, easing, Chart, Chart2D, Default, Pie, LinesPlot, blue, green, MoveSlice, Highlight, Tooltip, ColumnsPlot, ClusteredColumns, StackedColumns, commonStacked,Markers,
         Tufte,theme, Magnify,  MouseIndicator,MouseZoomAndPan,Legend,Wetland, CubanShirts, SelectableLegend, reportDijit, locale, TabContainer3,Select,Extent, SpatialReference,Search, InterpolatePoints, webMercatorUtils,
         CheckBox,LayerInfos, jimuUtils, portalUtils, portalUrlUtils, FeatureSet, a11yclick, PopupMenu, BaseWidget,utils, stats,WMSLayer, PrintTask, PrintParameters, SimpleRenderer, RadioButton,WebTiledLayer,
         normalizeUtils, GeometryService,BufferParameters, Dialog,mouseOverEvents,wellFilter,waterSecurityPlan) {
    //To create a widget, you need to derive from BaseWidget.
    // var TOOLLIST_VIEW = 0, ANALYSIS_VIEW = 1, MESSAGE_VIEW = 2;
    // var clazz=  declare([BaseWidget], {
    return declare([BaseWidget], {

    // privilegeUtil: null,
    akah_Tool: null,
    mouseOverEvents:null,
    wellFilter:null,
    info_statement:null,
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
      this.initTabsAndDropdownsSWQ();
      this.initRadios();
      this.initGetLayersData();
      this.initLocationChange();
      this.selectByLocation$akah();
      this.initPrintTemplate();
      this.initRainfallDropdowns();
      //lines of code to change the color of graph(chart) axes to black.
      theme.axis.majorTick.color='black'
      theme.axis.minorTick.color='black'
      Tufte.axis.majorTick.color='black'
      Tufte.axis.minorTick.color='black'
      //added for GEE
      this.visualize_layerlist();
      this.viz_dropdowns();
      this.viz_radioSelection();
      var imageURLs = [akah_Tool.folderUrl+"images/GroundTruth/dashboard1.png",akah_Tool.folderUrl+"images/GroundTruth/dashboard2.png",akah_Tool.folderUrl+"images/GroundTruth/dashboard3.png",akah_Tool.folderUrl+"images/GroundTruth/dashboard4.png"];
      var currentImg = getimage();
      function getimage(){
        var randomIndex = Math.floor(Math.random() * imageURLs.length);
        imgsrc = imageURLs[randomIndex];
        return imgsrc;
      }
      dojo.byId("dashboardImg").setAttribute('src',currentImg);
    },
    getValue: function(value, index, seriesIndex, indexed){
      var y,x;
      if(indexed){
          x = index;
          y = commonStacked.getIndexValue(akah_Tool.series, seriesIndex, x, lang.hitch( akah_Tool, "isNullValue" ) );
      }else{
          x = value.x - 1;
          y = commonStacked.getValue(akah_Tool.series, seriesIndex, value.x);
          y = [  y[0]?y[0].y:null, y[1]?y[1]:null ];
      }
      // in py we return the previous stack value as we need it to position labels on columns
      return { x: x, y: y[0], py: y[1] };
    },
    agakhan_layerlist: function(){
      akah_Tool = this;
      //json created for storing varibles needed for wsp module in water governance report
      window.wsprv = {};
      //domAttr.set('info_1_image','src', akah_Tool.folderUrl+"images/wsp_flowchart_1_2@4x.png")
      window.image_path =akah_Tool.folderUrl+"images/load.gif"
      window.gw_3dimage =akah_Tool.folderUrl+"images/gw_3dimage.png"
      window.farm_pond_cross_section =akah_Tool.folderUrl+"images/farm_pond_cross_section.png"
      // window.farm_pond_structure =akah_Tool.folderUrl+"images/farm_pond_structure.png"
      // window.privatekey = akah_Tool.folderUrl+'privatekey.json'

      /*removed map images from the folder also*/
      /*rise and fall(arrow) images*/
      window.rise_arrow = akah_Tool.folderUrl+"images/green_arrow.png"
      window.fall_arrow = akah_Tool.folderUrl+"images/red_arrow.png"

      window.ndvi_plants = akah_Tool.folderUrl+"images/plants.jpg"
      window.ndvi_index_img = akah_Tool.folderUrl+"images/VegetationIndex.png"
      window.ndvi_index2_img = akah_Tool.folderUrl+"images/VegetationIndex2.png"
      window.ndwi_index_img = akah_Tool.folderUrl+"images/WaterIndex.png"

      /*modified image url's for code feasibility wherever required.*/
      window.ndvi_vegetation = akah_Tool.folderUrl+"images/Vegetation.png"
      window.surface_waterImg = akah_Tool.folderUrl+"images/Water.png"
      window.rainfall_img=akah_Tool.folderUrl+"images/rainfall.png";
      window.coverpage_img=akah_Tool.folderUrl+"images/CoverPage.png";
      window.rightarrow_img=akah_Tool.folderUrl+"images/green_arrow.png";
      window.downarrow_img=akah_Tool.folderUrl+"images/DownArrow.png";
      dojo.byId("infobtn_vegetation").setAttribute('src', ndvi_vegetation);
      dojo.byId("infobtn_water").setAttribute('src', surface_waterImg);
      dojo.byId("infobtn_rainfall").setAttribute('src', rainfall_img);

      window.download_wtrLevel = akah_Tool.folderUrl+"images/Download_Water_level.png"
      window.download_wtrQty = akah_Tool.folderUrl+"images/Download_Water_Quality.png"
      dojo.byId("wl").setAttribute('src', download_wtrLevel);
      dojo.byId("wq").setAttribute('src', download_wtrQty);
      /*modified image url's for code feasibility wherever required.*/

      /*modified info icon url's for code feasibility wherever required - summary, data analytics, village information
      no need to mention in Widget.html*/
      window.akah_info_icon = akah_Tool.folderUrl+"images/info.png";
      var id_arr = ["infobtn_villageSurvey", "infobtn_obsWell", "infobtn_totalPopltn", "infobtn_wlPremon", "infobtn_wlPostmon", "infobtn_aquifer", "infobtn_watershedBasin",
                    "infobtn_waterQualitycgwb", "infobtn_obsWells", "infobtn_premonWaterLevel", "infobtn_wq", "infobtn_majorCrops", "infobtn_irrArea", "infobtn_area_irrGndwater",
                    "infobtn_villPop", "infobtn_sexRatio", "infobtn_villAquifer", "infobtn_villWatershed", "infobtn_lulc", "infobtn_ndwi", "infobtn_ndvi",
                    "infobtn_maxCheckBox_ndwi", "infobtn_meanCheckBox_ndwi", "infobtn_minCheckBox_ndwi", "infobtn_standardCheckBox_ndwi", "infobtn_maxCheckBox_ndwi",
                    "infobtn_standardCheckBox_ndvi", "infobtn_standardCheckBox_ndvi", "infobtn_standardCheckBox_ndvi", "infobtn_standardCheckBox_ndvi",
                    "infobtn_standardCheckBox_ndvi", "infobtn_standardCheckBox_ndvi", "infobtn_standardCheckBox_ndvi"]
      id_arr.forEach((id_var, i) => {
          dojo.byId(id_var).setAttribute('src', akah_info_icon);
      });
      /*modified info icon url's for code feasibility wherever required - summary, data analytics, village information*/

      dojo.byId("pr_load").setAttribute('src',image_path);
      dojo.byId("pr_go_load").setAttribute('src', image_path);
      dojo.byId("rf_load_gif").setAttribute('src',image_path);
      dojo.byId("gwr1_load_gif").setAttribute('src',image_path);
      dojo.byId("gwr2_load_gif").setAttribute('src',image_path);

      // layer list for dashboard widget
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
          if(agakhan_element.includes("CGWB_Water_Level_Wells")){
            gwm_station_layer = akah_Tool.map.getLayer(agakhan_element);
            window.gwm_station_layer = gwm_station_layer;
          }
          else if(agakhan_element.includes("selected_wells_primary")){
            akah_selectedwells_layer = akah_Tool.map.getLayer(agakhan_element);
            window.akah_selectedwells_layer = akah_selectedwells_layer;
            // var legend = new esri.dijit.Legend({
            //   map: akah_Tool.map,
            //   layerInfos:[{layer:akah_selectedwells_layer,title:'Selected Wells'}],
            // }, "legend_sw");
            // legend.startup()
          }
          else if(agakhan_element.includes("State_Boundaries")){
            akah_states_layer = akah_Tool.map.getLayer(agakhan_element);
            window.akah_states_layer = akah_states_layer;
          }
          else if(agakhan_element.includes("Villages_Study_Area_684")){
            window.akah_total_villages = akah_Tool.map.getLayer(agakhan_element);
            //akah_states_layer = akah_states_layer;
          }
          else if(agakhan_element.includes("District_Boundaries")){
            akah_dist_layer = akah_Tool.map.getLayer(agakhan_element);
            window.akah_dist_layer = akah_dist_layer;
          }
          else if(agakhan_element.includes("Block_Boundaries")){
            akah_block_layer = akah_Tool.map.getLayer(agakhan_element);
            window.akah_block_layer = akah_block_layer;
          }
          else if(agakhan_element.includes("Village_Boundaries")){
            akah_villages_layer = akah_Tool.map.getLayer(agakhan_element);
            window.akah_villages_layer = akah_villages_layer;
          }
          else if(agakhan_element.includes("AKAH_Well_Registration")){
            akah_main_layer = akah_Tool.map.getLayer(agakhan_element);
            window.akah_main_layer = akah_main_layer;
          }

          else if(agakhan_element.includes("Aquifer_System")){
            akah_aqui = akah_Tool.map.getLayer(agakhan_element);
            window.akah_aqui = akah_aqui;
          }
          else if(agakhan_element.includes("Watershed")){
            akah_watershed = akah_Tool.map.getLayer(agakhan_element);
            window.akah_watershed = akah_watershed;
          }
          else if(agakhan_element.includes("SurfaceWater_1946")){
            akah_sw = akah_Tool.map.getLayer(agakhan_element);
            window.akah_sw = akah_sw;
          }
          else if(agakhan_element.includes("Surface_Water_Bodies_6152")){
            akah_sw1 = akah_Tool.map.getLayer(agakhan_element);
            window.akah_sw1 = akah_sw1;
          }
          else if(agakhan_element.includes("CGWB_Water_Quality_Wells")){
            akah_gwq = akah_Tool.map.getLayer(agakhan_element);
            window.akah_gwq = akah_gwq;
          }
          // else if(agakhan_element.includes("AKAH_Industries_2219")){
          //   akah_indus = akah_Tool.map.getLayer(agakhan_element);
          //   window.akah_indus = akah_indus;
          // }
          else if(agakhan_element.includes("Drainage_Patterns")){
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
          else if(agakhan_element.includes("Hydrogeology")){
            window.hydrogeology_layer = akah_Tool.map.getLayer(agakhan_element);
          }
          //layers for keymaps of the report
          else if(agakhan_element.includes("Districts_Boundaries")){
            window.district_keymap_layer = akah_Tool.map.getLayer(agakhan_element);
          }
          // else if(agakhan_element.includes("Blocks_Boundaries")){
          //   window.block_keymap_layer = akah_Tool.map.getLayer(agakhan_element);
          // }
          else if (agakhan_element.includes("sensor_locations")) {
            //sensors_location layer to be visible only for required maps (not visible for keymaps) in water governance report.
            window.sensors_location_url = akah_Tool.map.getLayer(agakhan_element);
          }
          else if(agakhan_element.includes("RF_IMD_Stations")){
            window.rainfallStations_layer = akah_Tool.map.getLayer(agakhan_element);
          }
      });
      window.block_keymap_layer = new FeatureLayer("https://geomonitor.co.in/server/rest/services/Hosted/blocks_keymaps/FeatureServer/0");


      window.akah_total_villages  = this.map._layers["Villages_Study_Area_684"];
      window.akah_drain  = this.map._layers["Drainage_Patterns_2223"];
      window.akah_swb  = this.map._layers["Surface_Water_Quality_19_20_21_2522"];
      // //defining well experimental layers(primary, water levels, water quality)

      // window.akah_village_url='https://geomonitor.co.in/server/rest/services/Hosted/akah_vilagesnew_13062021/FeatureServer/0';
      window.lulc_village_url="https://geomonitor.co.in/server/rest/services/agakhan_experiment/lulc_village/FeatureServer/0";
      window.akah_block_url=akah_block_layer.url;
      // https://geomonitor.co.in/server/rest/services/Hosted/akah_blocks_14062021/FeatureServer/0
      // window.selected_wells_wl_url ="https://geomonitor.co.in/server/rest/services/agakhan_experiment/selected_wells_water_level/FeatureServer/0";
      window.selected_wells_wl_url ="https://geomonitor.co.in/server/rest/services/agakhan_experiment/selected_well_temporal/MapServer/0";
      window.selected_wells_wq_url ="https://geomonitor.co.in/server/rest/services/agakhan_experiment/selected_wells_water_quality/FeatureServer/0";
      window.district_rainfall_url="https://geomonitor.co.in/server/rest/services/agakhan_experiment/annual_rainfall_district/FeatureServer/0"
      window.ndvi_statistics_url = "https://geomonitor.co.in/server/rest/services/agakhan_experiment/ndvi_statistics/FeatureServer/0"
      window.ndwi_statistics_url = "https://geomonitor.co.in/server/rest/services/agakhan_experiment/ndwi_statistics/FeatureServer/0"
      window.ndvi_seasonal_trendUrl = "https://geomonitor.co.in/server/rest/services/agakhan_experiment/ndvi_seasonal_village_spatial/MapServer/0"
      window.ndwi_seasonal_trendUrl = "https://geomonitor.co.in/server/rest/services/agakhan_experiment/ndwi_seasonal_village/MapServer/0"
      window.rainfallData_layer =  "https://geomonitor.co.in/server/rest/services/agakhan/Ranifall_IMD_data/FeatureServer/0";
      window.cgwl_spatial_layer =  "https://geomonitor.co.in/server/rest/services/agakhan_experiment/cgwl_wl_village_spatial/MapServer/0";
      // window.adaptive_spatial_layer =  "https://geomonitor.co.in/server/rest/services/agakhan_experiment/cgwl_wl_village_spatial/MapServer/0";
     
      // var selectedwellsPrimary_layer = new FeatureLayer("https://geomonitor.co.in/server/rest/services/agakhan_experiment/selected_wells_primary/FeatureServer/0")
      // var selectedwellsWL_layer = new FeatureLayer("https://geomonitor.co.in/server/rest/services/agakhan_experiment/selected_wells_water_level/FeatureServer/0")
      // var selectedwellsWQ_layer = new FeatureLayer("https://geomonitor.co.in/server/rest/services/agakhan_experiment/selected_wells_water_quality/FeatureServer/0")
      // window.selectedwellsPrimary_layer = selectedwellsPrimary_layer;
      // window.selectedwellsWL_layer = selectedwellsWL_layer;
      // window.selectedwellsWQ_layer = selectedwellsWQ_layer;
      // akah_Tool.map.addLayer(selectedwellsPrimary_layer);
      // akah_Tool.map.addLayer(selectedwellsWL_layer);
      // akah_Tool.map.addLayer(selectedwellsWQ_layer);
      
      // var query_adaptiveLayer = new Query();
      // query_adaptiveLayer.where = "1=1";
      // query_adaptiveLayer.outFields = ["*"]
      // window.query_adaptiveLayer=query_adaptiveLayer;
      // new QueryTask(adaptive_spatial_layer.url).execute(query_adaptiveLayer, function(akah_adaptiveResponse){
      //   window.akah_adaptiveResponse = akah_adaptiveResponse
      //   window.filteredAdaptive  = akah_adaptiveResponse.features.filter(a =>{
      //     if((a.attributes.rf == rf_final.split(',')[0]) && (a.attributes.gwl == gwl_final.split(',')[0])&& (a.attributes.swa == swa_final.split(',')[0]) && (a.attributes.ndvi == ndvi_final.split(',')[0])){
      //         return a;
      //     }
      //   })
      // });

    
      // var rep_queryCGWL = new Query();
      // rep_queryCGWL.where = "state like" +" "+"\'"+ akahstate +"\'"  + " " + "AND" + " " + "district like" +" "+"\'"+ akahdistrict +"\'"+ " " + "AND" + " " + "block like" + " " + "\'" + akahblock + "\'"+ " " + "AND" + " " + "village like" + " " + "\'" + akahvillage + "\'";
      // rep_queryCGWL.outFields = ["*"]
      // window.rep_queryCGWL=rep_queryCGWL;
      // window.cgwl_spatialReport = new QueryTask(cgwl_spatial_layer).execute(rep_queryCGWL, function(rep_cgwl_response){
      //     window.rep_cgwl_response= rep_cgwl_response;  
      //     //ndwi data analysis chart
      //     cgwl_PreArray=[];window.cgwl_PreArray=cgwl_PreArray;cgwl_PostArray=[];window.cgwl_PostArray=cgwl_PostArray;
      //     cgwl_Array = rep_cgwl_response.features.filter(a => {if(! a.attributes.year.includes("2020")== true){return a;}})
      //     window.cgwl_Array=cgwl_Array;
      //     cgwl_Array.forEach(elem => {
      //       if(elem.attributes.season.includes("Pre")) cgwl_PreArray.push(elem.attributes.avg_water_area_sw)
      //       else if(elem.attributes.season.includes("Post")) cgwl_PostArray.push(elem.attributes.avg_water_area_sw)
      //     })
      // })

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
      mouseOverEvents.init_actiavteEvents();
      akah_Tool.setMouseEventsIcon();
      wellFilter.init_wellFilter();
      var ndvichart="";window.ndvichart = ndvichart
      var ndwichart="";window.ndwichart = ndwichart
      var bar_chart_2="";window.bar_chart_2 = bar_chart_2
      var akah_LULCchart="";window.akah_LULCchart = akah_LULCchart
      var rain_chart="";window.rain_chart=rain_chart;
      var stackedChart="";window.stackedChart=stackedChart;
      vegetationDialog = new Dialog({title: "Vegetation",content:'',style: "width: 350px"});
      rainfallDialog = new Dialog({title: "Rainfall",content:'',id:"rainfallDialogId",style: "width: 816px;height:750px;",
      onHide: function() {
        document.getElementById("rfYearlyChartModule").style.display = "none"
      }});
      waterDialog = new Dialog({title: "Water",content:'',style: "width: 350px"});
      dialogwaterlevels = new Dialog({title: "Water Levels",content:'',style: "width: 194px;height:145px;"});
      dialogwaterquality= new Dialog({title: "Water Quality",content:'',style: "width: 194px;height:145px;"});
      dojo.query("#akah_ndwiChartModule").style("display","none");
      dojo.query("#akah_ndviChartModule").style("display","none");
      new RadioButton({checked: true,name:"analysisType",value:"lulc_inp"}, "lulc_inp").startup();
      new RadioButton({checked: false,name:"analysisType",value:"ndwi_inp",disabled:false}, "ndwi_inp").startup();
      new RadioButton({checked: false,name:"analysisType",value:"ndvi_inp",disabled:false}, "ndvi_inp").startup();
      new RadioButton({checked: true,name:"diType",value:"WQ_DI"}, "WQ_DI_inp").startup(); //radios for swb
      new RadioButton({checked: false,name:"diType",value:"Attri_DI"}, "Attri_DI_inp").startup();
      on(document.getElementById("toggleIndicatorRF"), 'change',function(evt){
        if(evt.srcElement.checked == true){
          akah_Tool.addIndicatorRF();
        }
        else{
          // rfChart_mon.removePlot("mouseIndicatorRainfall Data");
          // rfChart_mon.destroy();
          akah_Tool.getRainfallDataByCategory();
        }
      });
      new RadioButton({checked: false,name:"RFType",value:"yrf_inp",onChange: function(evt){
        if(evt == true){ dojo.query(".RainfallCategory").style("display","none");
        domAttr.set("distVilltoRF","innerHTML",'');
        akah_Tool.getRainfallDataByCategory();}}}, "yrf_inp").startup();//radios for rainfall}
      new RadioButton({checked: true,name:"RFType",value:"mrf_inp",onChange: function(evt){
        if(evt == true) {dojo.query(".RainfallCategory").style("display","none");
        domAttr.set("distVilltoRF","innerHTML",'');
        akah_Tool.getRainfallDataByCategory();}}}, "mrf_inp").startup();
      new RadioButton({checked: false,name:"RFType",value:"wrf_inp",onChange: function(evt){
        if(evt == true)
               {
                domAttr.set('rfMonthlyChart', "innerHTML","");
                domAttr.set('rfMonthlyChartWithInd', "innerHTML","");
                domAttr.set("distVilltoRF","innerHTML",'');
                 dojo.query(".RainfallCategory").style("display","block");
                dojo.query("#fromRFMonth_id").style("display","none")
                dojo.query("#toRFMonth_id").style("display","none")
              }
                // akah_Tool.getRainfallDataByCategory();
              }}, "wrf_inp").startup();
      new RadioButton({checked: false,name:"RFType",value:"drf_inp",onChange: function(evt){
        if(evt == true){  
                domAttr.set('rfMonthlyChart', "innerHTML","");
                domAttr.set('rfMonthlyChartWithInd', "innerHTML","");
                domAttr.set("distVilltoRF","innerHTML",'')
                dojo.query(".RainfallCategory").style("display","block");
                dojo.query("#fromRFMonth_id").style("display","inline-table")
                // dojo.query("#fromRFMonth_id").style("display","inline-flex")
                dojo.query("#toRFMonth_id").style("display","inline-table")
                // dojo.query("#toRFMonth_id").style("display","inline-flex")
               }
                // akah_Tool.getRainfallDataByCategory();
              }}, "drf_inp").startup();
      new CheckBox({name: "checkBox",class:"ndwicheck_class",value:"agreed",checked: false,onChange: function(evt){akah_Tool.akah_chartGenerateNDWI("index");}}, "maxCheckBox_ndwi").startup();
      new CheckBox({name: "checkBox",class:"ndwicheck_class",value:"agreed",checked: true,onChange: function(evt){akah_Tool.akah_chartGenerateNDWI("index");}}, "meanCheckBox_ndwi").startup();
      new CheckBox({name: "checkBox",class:"ndwicheck_class",value:"agreed",checked: false,onChange: function(evt){akah_Tool.akah_chartGenerateNDWI("index");}}, "minCheckBox_ndwi").startup();
      new CheckBox({name: "checkBox",class:"ndwicheck_class",value:"agreed",checked: false,onChange: function(evt){akah_Tool.akah_chartGenerateNDWI("index");}}, "standardCheckBox_ndwi").startup();
      new CheckBox({name: "checkBox",class:"ndwicheck_class",value:"agreed",checked: true,onChange: function(evt){akah_Tool.akah_chartGenerateNDWI("area");}}, "waterCheckBox_ndwi").startup();
      // new CheckBox({name: "checkBox",class:"ndwicheck_class",value:"agreed",checked: true,onChange: function(evt){akah_Tool.akah_chartGenerateNDWI("area");}}, "swaterCheckBox_ndwi").startup();

      new CheckBox({name: "checkBox",class:"ndvicheck_class",value:"agreed",checked: false,onChange: function(evt){akah_Tool.akah_chartGenerateNDVI("index");}}, "maxCheckBox_ndvi").startup();
      new CheckBox({name: "checkBox",class:"ndvicheck_class",value:"agreed",checked: true,onChange: function(evt){akah_Tool.akah_chartGenerateNDVI("index");}}, "meanCheckBox_ndvi").startup();
      new CheckBox({name: "checkBox",class:"ndvicheck_class",value:"agreed",checked: false,onChange: function(evt){akah_Tool.akah_chartGenerateNDVI("index");}}, "minCheckBox_ndvi").startup();
      new CheckBox({name: "checkBox",class:"ndvicheck_class",value:"agreed",checked: false,onChange: function(evt){akah_Tool.akah_chartGenerateNDVI("index");}}, "standardCheckBox_ndvi").startup();
      new CheckBox({name: "checkBox",class:"ndvicheck_class",value:"agreed",checked: true,onChange: function(evt){akah_Tool.akah_chartGenerateNDVI("area");}}, "denseCheckBox_ndvi").startup();
      new CheckBox({name: "checkBox",class:"ndvicheck_class",value:"agreed",checked: true,onChange: function(evt){akah_Tool.akah_chartGenerateNDVI("area");}}, "sparseCheckBox_ndvi").startup();
      new CheckBox({name: "checkBox",class:"ndvicheck_class",value:"agreed",checked: true,onChange: function(evt){akah_Tool.akah_chartGenerateNDVI("area");}}, "lowCheckBox_ndvi").startup();
      // lulc
      lulc_map_season= "";window.lulc_map_season= lulc_map_season;

      new CheckBox({name: "checkBox",class:"lulxcheck_class",value:"agreed",checked: false,onChange: function(evt){
      if(evt ==  true){
                if(lulc_map_season == "Pre"){
                    // dojo.query("#lulc5yearPreM_agri").style("display","block")
                    // dojo.query("#lulc5yearPreM_lulc").style("display","block")
                    dojo.query(".lulc5yearPreM_Styles").style("display","block")
                    dojo.query(".lulc5yearPostM_Styles").style("display","none")
                }
                else{
                    // dojo.query("#lulc5yearPostM_agri").style("display","block")
                    // dojo.query("#lulc5yearPostM_lulc").style("display","block")}
                    dojo.query(".lulc5yearPostM_Styles").style("display","block")
                    dojo.query(".lulc5yearPreM_Styles").style("display","none")
                  }
                  akah_Tool.getLULCDefaultCharts("toUI",lulc_map_season);
                  
            }
            else{
                  dojo.query(".lulc5yearPreM_Styles").style("display","none")
                  dojo.query(".lulc5yearPostM_Styles").style("display","none")
            // if(lulc_map_season == "Post"){
            //       // dojo.query("#lulc5yearPreM_lulc").style("display","none")
            //       // dojo.query("#lulc5yearPreM_agri").style("display","none")}
            //       dojo.query(".lulc5yearPreM_Styles").style("display","none")
            //       dojo.query(".lulc5yearPostM_Styles").style("display","none")
            //   }
            // else{
            //     // dojo.query("#lulc5yearPostM_lulc").style("display","none")
            //     // dojo.query("#lulc5yearPostM_agri").style("display","none")}
            //     dojo.query(".lulc5yearPostM_Styles").style("display","block")
            //     dojo.query(".lulc5yearPreM_Styles").style("display","none")}
            }  
      }}, "show5yearCheckbox_LULC").startup();
      
      //onchange of radio buttons
      on(dom.byId("lulc_inp"),"change",function(evt){
        dojo.query("#akah_chartModule").style("display","block");
        dojo.query("#akah_ndwiChartModule").style("display","none");
        dojo.query("#akah_ndviChartModule").style("display","none");
        dojo.query(".LULCCategory").style("display","block");
        dojo.query(".NDWICategory").style("display","none");
        dojo.query(".NDVICategory").style("display","none");
        if (akah_Tool.akah_selYear != "Select" && akah_Tool.akah_selMonsoon != "select" && searchAkah.value != "") {
          akah_Tool.akah_chartGenerte();
       }
      });
      on(dom.byId("ndwi_inp"),"change",function(evt){
        dojo.query("#akah_ndwiChartModule").style("display","block");
        dojo.query("#akah_ndviChartModule").style("display","none");
        dojo.query("#akah_chartModule").style("display","none");
        dojo.query(".NDWICategory").style("display","block");
        dojo.query(".NDVICategory").style("display","none");
        dojo.query(".LULCCategory").style("display","none");
        if(akah_ndwifrommonth != "0" && akah_ndwifromyear !="Year" && akah_ndwitoyear !="Year" && akah_ndwitomonth != "0" && searchAkah.value != ""){
          akah_Tool.akah_chartGenerateNDWI("all");
        }
      });
      on(dom.byId("ndvi_inp"),"change",function(evt){
        dojo.query("#akah_ndviChartModule").style("display","block");
        dojo.query("#akah_ndwiChartModule").style("display","none");
        dojo.query("#akah_chartModule").style("display","none");
        dojo.query(".NDVICategory").style("display","block");
        dojo.query(".NDWICategory").style("display","none");
        dojo.query(".LULCCategory").style("display","none");
        if(akah_ndvifrommonth != "0" && akah_ndvifromyear !="Year" && akah_ndvitoyear !="Year" && akah_ndvitomonth != "0" && searchAkah.value != ""){
          akah_Tool.akah_chartGenerateNDVI("all");
        }
      });
      on(dom.byId("WQ_DI_inp"),"change",function(evt){
        dojo.query("#waterqualityDI").style("display","block");
        dojo.query("#attributebasedDI").style("display","none");
        akah_Tool.doSWBQuery();
      });
      on(dom.byId("Attri_DI_inp"),"change",function(evt){
        dojo.query("#attributebasedDI").style("display","block");
        dojo.query("#waterqualityDI").style("display","none");
        akah_Tool.doSWBQuery();
      });

    },

    setMouseEventsIcon: function(){
      cursorPath = akah_Tool.folderUrl+"/css/images/Cursor_1.png";
          document.getElementsByClassName("map")[0].lastElementChild.innerHTML = document.getElementsByClassName("map")[0].lastElementChild.innerHTML + "<div style='position:absolute;top:285px;left: 7px;'><button id='cursorpathImage' class='cursorpathImageClass' style='font-size:20px;padding:0px;background-color: #555;border-radius: 5px;padding:0px;height:32px;width:32px;border: 1px solid #999;' onclick='onMouseEventBtnClick()'><img src='"+cursorPath+"' title='Info Viewer' style='height: 27px;width: 27px;padding: 4px 3px 4px 5px;'></button></div>"
          var mouseEvent=false;window.mouseEvent=mouseEvent;
          onMouseEventBtnClick = function(){
            if(mouseEvent == false){
              mouseEvent = true;
              window.mouseEvent=mouseEvent;
              dojo.query("#cursorpathImage").style("background-color","black")
            }
            else if(mouseEvent == true){
              mouseEvent = false;
              window.mouseEvent=mouseEvent;
              mouseOverEvents.closeDialogFunction();
              dojo.query("#cursorpathImage").style("background-color","#555")
            }
          }
          on(dom.byId("cursorpathImage"),"mouseover",function(){
            dojo.query("#cursorpathImage").style("background-color","black")
            // if(mouseEvent == true){dojo.query("#cursorpathImage").style("background-color","black")}
            // else{dojo.query("#cursorpathImage").style("background-color","#555")}
          })
          on(dom.byId("cursorpathImage"),"mouseout",function(){
            dojo.query("#cursorpathImage").style("background-color","#555")
            if(mouseEvent == true){dojo.query("#cursorpathImage").style("background-color","black")}
            else{dojo.query("#cursorpathImage").style("background-color","#555")}
          })
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
      else if(akah_Tool.map.graphics.graphics.length > 0){
           if (dijit.byId('searchVillageAKAH').value === "" && (akah_Tool.map.graphics.graphics[0].symbol != undefined) && (dijit.byId('akah_selectMonsoon').value !="1" && dijit.byId('akah_selectYear').value !="Select")) {
              new QueryTask(akah_villages_layer.url).execute(queryChart, function(akah_villageResponse){
                window.akah_searchResponse = akah_villageResponse.features[0];
                akah_Tool.akah_chartGenerte()
              });
          }
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
      else if(akah_Tool.map.graphics.graphics.length > 0){
           if (dijit.byId('searchVillageAKAH').value === ""  && (akah_Tool.map.graphics.graphics[0].symbol != undefined) && (dijit.byId('akah_selectMonsoon').value !="1" && dijit.byId('akah_selectYear').value !="Select")) {
              new QueryTask(akah_villages_layer.url).execute(queryChart, function(akah_villageResponse){
                window.akah_searchResponse = akah_villageResponse.features[0];
                akah_Tool.akah_chartGenerte()
              });
          }
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
       var akah_NDWIchartFromMonths = {'0': "Month", '1': "Jan", '2': "Feb", '3':"Mar",'4':"Apr",'5':"May",'6':"June",'7':"July",'8':"Aug",'9':"Sep",'10':"Oct",'11':"Nov",'12':"Dec"};window.akah_NDWIchartFromMonths = akah_NDWIchartFromMonths;
       var akah_NDWIchartToYears = ['Year','2016','2017','2018','2019','2020','2021'];window.akah_NDWIchartToYears = akah_NDWIchartToYears;
       var akah_NDWIchartToMonths = {'0': "Month", '1': "Jan", '2': "Feb", '3':"Mar",'4':"Apr",'5':"May",'6':"June",'7':"July",'8':"Aug",'9':"Sep",'10':"Oct",'11':"Nov",'12':"Dec"};window.akah_NDWIchartToMonths = akah_NDWIchartToMonths;
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
         selectFromYear_NDVI.attr('value',akah_ndwifromyear)
        this.validateToGenerateNDWIChart();
       })))
       this.own(on(selectFromMonth_NDWI, 'change', lang.hitch(this, function(akah_ndwifrommonth){
         window.akah_ndwifrommonth = akah_ndwifrommonth;
         this.akah_ndwifrommonth = akah_ndwifrommonth;
         selectFromMonth_NDVI.attr('value',akah_ndwifrommonth)
         this.validateToGenerateNDWIChart();
       })))
       this.own(on(selectToMonth_NDWI, 'change', lang.hitch(this, function(akah_ndwitomonth){
         window.akah_ndwitomonth = akah_ndwitomonth;
         this.akah_ndwitomonth = akah_ndwitomonth;
         selectToMonth_NDVI.attr('value',akah_ndwitomonth)
         this.validateToGenerateNDWIChart();
       })))
       this.own(on(selectToYear_NDWI, 'change', lang.hitch(this, function(akah_ndwitoyear){
         window.akah_ndwitoyear = akah_ndwitoyear;
         this.akah_ndwitoyear = akah_ndwitoyear;
         selectToYear_NDVI.attr('value',akah_ndwitoyear)
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
       var akah_NDVIchartFromMonths = {'0': "Month", '1': "Jan", '2': "Feb", '3':"Mar",'4':"Apr",'5':"May",'6':"June",'7':"July",'8':"Aug",'9':"Sep",'10':"Oct",'11':"Nov",'12':"Dec"};window.akah_NDVIchartFromMonths = akah_NDVIchartFromMonths;
       var akah_NDVIchartToYears = ['Year','2016','2017','2018','2019','2020','2021'];window.akah_NDVIchartToYears = akah_NDVIchartToYears;
       var akah_NDVIchartToMonths = {'0': "Month", '1': "Jan", '2': "Feb", '3':"Mar",'4':"Apr",'5':"May",'6':"June",'7':"July",'8':"Aug",'9':"Sep",'10':"Oct",'11':"Nov",'12':"Dec"};window.akah_NDVIchartToMonths = akah_NDVIchartToMonths;
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
         selectFromYear_NDWI.attr('value', akah_ndvifromyear)
         this.validateToGenerateNDVIChart();
       })))
       this.own(on(selectFromMonth_NDVI, 'change', lang.hitch(this, function(akah_ndvifrommonth){
         window.akah_ndvifrommonth = akah_ndvifrommonth;
         this.akah_ndvifrommonth = akah_ndvifrommonth;
         selectFromMonth_NDWI.attr('value', akah_ndvifrommonth)
         this.validateToGenerateNDVIChart();
       })))
       this.own(on(selectToMonth_NDVI, 'change', lang.hitch(this, function(akah_ndvitomonth){
         window.akah_ndvitomonth = akah_ndvitomonth;
         this.akah_ndvitomonth = akah_ndvitomonth;
         selectToMonth_NDWI.attr('value', akah_ndvitomonth)
         this.validateToGenerateNDVIChart();
       })))
       this.own(on(selectToYear_NDVI, 'change', lang.hitch(this, function(akah_ndvitoyear){
         window.akah_ndvitoyear = akah_ndvitoyear;
         this.akah_ndvitoyear = akah_ndvitoyear;
         selectToYear_NDWI.attr('value', akah_ndvitoyear)
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
        map: akah_Tool.map,
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
          // akah_Tool.map.graphics.clear();
          window.akahsearchResult_response = akahsearchResult_response;
          var akah_searchResponse = akahsearchResult_response.result.feature;window.akah_searchResponse = akah_searchResponse;
          var searchLayerResponse = akahsearchResult_response.source.featureLayer;window.searchLayerResponse = searchLayerResponse;
          var stateName = akah_searchResponse.attributes.state;
          var districtName = akah_searchResponse.attributes.district;
          var blockName = akah_searchResponse.attributes.block;
          (akah_searchResponse.attributes.village === null) ? (villageName = " "):(villageName = akah_searchResponse.attributes.village)
          // code to display highlight graphic on searching a village in data analytics module
          var villHighlightSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NULL,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([215,0,0]), 2))
          window.villHighlightSymbol = villHighlightSymbol;
          window.highlightVillGraphic = new Graphic(akah_searchResponse.geometry,villHighlightSymbol)
          akah_Tool.map.graphics.add(highlightVillGraphic);
          // code to display highlight graphic on searching a village in data analytics module

          // domAttr.set('akahLocation_info','innerHTML',"<span><span class='akahHeadings'>State: </span><span class='akahNames'>"+stateName+"</span></span>&nbsp;&nbsp;<span><span class='akahHeadings'>District: </span><span class='akahNames'>"+districtName+"</span></span>&nbsp;&nbsp;"+
                      // "<span><span class='akahHeadings'>Block: </span><span class='akahNames'>"+blockName+"</span></span>&nbsp;&nbsp;<br><span><span class='akahHeadings'>Village: </span><span class='akahNames'>"+villageName+"</span>");
          dojo.query('#akahLocation_info').style('display','block')
          domAttr.set("tab3_village","innerHTML",villageName);
          domAttr.set("tab3_state","innerHTML",stateName);
          domAttr.set("tab3_district","innerHTML",districtName);
          domAttr.set("tab3_block","innerHTML",blockName);
          if (tabsakah.getSelectedTitle() === "Data Analytics") {
              /*status bar value update*/
              document.getElementsByClassName('bar_akah-inner')[0].dataset.percent = "75%"
              document.getElementsByClassName('bar_akah-inner')[0].style.width = "75%"
              /*status bar value update*/
          }
          var searchLayerResponse = akahsearchResult_response.source.featureLayer;window.searchLayerResponse = searchLayerResponse;
          akah_Tool.createBufferRainfall();
          if (akah_Tool.akah_selYear != "Select" && akah_Tool.akah_selMonsoon != "select") {
              akah_Tool.akah_chartGenerte()
          }
          if (akah_ndvifrommonth != "0" && akah_ndvifromyear != "Year" && akah_ndvitomonth != "0" && akah_ndvitoyear != "Year") {
            akah_Tool.akah_chartGenerateNDVI("all")
           }
          if (akah_ndwifrommonth != "0" && akah_ndwifromyear != "Year" && akah_ndwitomonth != "0" && akah_ndwitoyear != "Year") {
            akah_Tool.akah_chartGenerateNDWI("all")
          }
          else{
            domAttr.set("akahLulc_Chart","innerHTML","");
            domAttr.set("lulc_legend","innerHTML","");
            domAttr.set("ndvi_legend","innerHTML","");
            domAttr.set("ndwi_legend","innerHTML","");
            dojo.setAttr('ndviLineCharts_info', 'innerHTML', '')
            dojo.setAttr('ndwiLineCharts_info', 'innerHTML', '')
            dojo.setAttr('ndviareaLineCharts_info', 'innerHTML', '')
            dojo.setAttr('ndwiareaLineCharts_info', 'innerHTML', '')
            domAttr.set("ndviarea_legend","innerHTML","");
            domAttr.set("ndwiarea_legend","innerHTML","");
            // domAttr.set("akahNdvi_Chart","innerHTML","");
            // domAttr.set('akahLocation_info','innerHTML','');
            dojo.query('#ndvi_checkboxtable').style('display','none')
            dojo.query('#ndwi_checkboxtable').style('display','none')
            dojo.query('#ndviarea_checkboxtable').style('display','none')
            dojo.query('#ndwiarea_checkboxtable').style('display','none')
            // akah_villages_layer.setDefinitionExpression("1=1");
            // akah_villages_layer.setVisibility(false);
          }
          akah_Tool.gotoFilterSurfWatBodies();
      });

      on(searchAkah,'clear-search', function(e) {
        if(akah_Tool.map){
          akah_Tool.clearGraphicsonMap();
          // dijit.byId('searchVillageAKAH').set('value','');
          domAttr.set("akahLulc_Chart","innerHTML","");
          domAttr.set("lulc_legend","innerHTML","");
          domAttr.set("ndwiLineCharts_info","innerHTML","");
          domAttr.set("ndviLineCharts_info","innerHTML","");
          dojo.setAttr('ndviareaLineCharts_info', 'innerHTML', '')
          dojo.setAttr('ndwiareaLineCharts_info', 'innerHTML', '')
          // domAttr.set('akahLocation_info','innerHTML','');
          // dojo.query('#akahLocation_info').style('display','none')
          domAttr.set("tab3_village","innerHTML","");
          dojo.query('#ndwi_checkboxtable').style('display','none')
          dojo.query('#ndvi_checkboxtable').style('display','none')
          dojo.query('#ndviarea_checkboxtable').style('display','none')
          dojo.query('#ndwiarea_checkboxtable').style('display','none')
          dojo.query('#ndwi_legend').style('display','none')
          dojo.query('#ndvi_legend').style('display','none')
          domAttr.set("ndviarea_legend","innerHTML","");
          domAttr.set("ndwiarea_legend","innerHTML","");
          dojo.query('#rfMonthlyChartLegend').style('display','none')
          domAttr.set("rfMonthlyChart","innerHTML","");
          // akah_Tool.map.setExtent(init_map_extent)
          if(akahstate == "Select State" && akahdistrict == "Select District" && akahblock == "Select Block"){
            akah_villages_layer.setDefinitionExpression("1=1");
            akah_villages_layer.setVisibility(false);
          }
          if(akahstate != "Select State" && akahdistrict != "Select District" && akahblock != "Select Block"){
            akah_villages_layer.setDefinitionExpression("state like '"+akahstate+"' and district like '"+akahdistrict+"' and block like '"+akahblock+"'");
            akah_villages_layer.setVisibility(false);
          }
          // if(akah_Tool.map.graphics.graphics[0].attributes != undefined){
          //   akah_Tool.map.graphics.clear();
          // }
          dijit.byId('searchVillageAKAH').set("value", "");

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
      // var akahinfo5_tab = {title: "Well Filter",content: this.akah_tab_5};

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
      on(tabsakah.tabItems[0], "click", function(){
          tabs_da.selectTab('Statistical Analysis')
          if (dijit.byId('block_id').value != 'Select Block' && dijit.byId('block_id').value != "") {
            // lines of code for GEE Visualization to make layers active when active in data analytics tab only
            if (tiles_layerlist!={}) {
              Object.keys(tiles_layerlist).forEach(function(tile_key){
                tiles_layerlist[tile_key].setVisibility(false)
              })
              if (vegetation_trend_layerlist!={}) {
                Object.keys(vegetation_trend_layerlist).forEach(function(tile_key){
                  vegetation_trend_layerlist[tile_key].setVisibility(false)
                })
              }
              if (vegetation_trend_layerlist!={}) {
                Object.keys(water_trend_layerlist).forEach(function(tile_key){
                  water_trend_layerlist[tile_key].setVisibility(false)
                })
              }
            }
            // lines of code for GEE Visualization to make layers active when active in data analytics tab only
            document.getElementsByClassName('bar_akah-inner')[0].dataset.percent = "25%"
            document.getElementsByClassName('bar_akah-inner')[0].style.width = "25%"
          }
      })
      on(tabsakah.tabItems[1], "click", function(){
          tabs_da.selectTab('Statistical Analysis')
          if (dijit.byId('block_iddv').value != 'Select Block' && dijit.byId('block_iddv').value != "") {
            // lines of code for GEE Visualization to make layers active when active in data analytics tab only
            if (tiles_layerlist!={}) {
              Object.keys(tiles_layerlist).forEach(function(tile_key){
                tiles_layerlist[tile_key].setVisibility(false)
              })
              Object.keys(vegetation_trend_layerlist).forEach(function(tile_key){
                vegetation_trend_layerlist[tile_key].setVisibility(false)
              })
              Object.keys(water_trend_layerlist).forEach(function(tile_key){
                water_trend_layerlist[tile_key].setVisibility(false)
              })
            }
            // lines of code for GEE Visualization to make layers active when active in data analytics tab only
            document.getElementsByClassName('bar_akah-inner')[0].dataset.percent = "50%"
            document.getElementsByClassName('bar_akah-inner')[0].style.width = "50%"
            akah_Tool.rainfallChartCreate();
          }
      })
      on(tabsakah.tabItems[2], "click", function(){
          tabs_da.selectTab('Statistical Analysis')
          if (dijit.byId('searchVillageAKAH').value != "") {
            // lines of code for GEE Visualization to make layers active when active in data analytics tab only
            Object.keys(tiles_layerlist).forEach(function(tile_key){
              tiles_layerlist[tile_key].setVisibility(false)
            })
            Object.keys(vegetation_trend_layerlist).forEach(function(tile_key){
              vegetation_trend_layerlist[tile_key].setVisibility(false)
            })
            Object.keys(water_trend_layerlist).forEach(function(tile_key){
              water_trend_layerlist[tile_key].setVisibility(false)
            })
            // lines of code for GEE Visualization to make layers active when active in data analytics tab only
            document.getElementsByClassName('bar_akah-inner')[0].dataset.percent = "75%"
            document.getElementsByClassName('bar_akah-inner')[0].style.width = "75%"
            akah_Tool.getSearchResponseOnDraw("",queryChart);
          }
      })
      on(tabsakah.tabItems[3], "click", function(){
          tabs_da.selectTab('Statistical Analysis')
          if (searchAkah.value != "") {
            // lines of code for GEE Visualization to make layers active when active in data analytics tab only
            if (tiles_layerlist!={}) {
              Object.keys(tiles_layerlist).forEach(function(tile_key){
                tiles_layerlist[tile_key].setVisibility(false)
              })
              Object.keys(vegetation_trend_layerlist).forEach(function(tile_key){
                vegetation_trend_layerlist[tile_key].setVisibility(false)
              })
              Object.keys(water_trend_layerlist).forEach(function(tile_key){
                water_trend_layerlist[tile_key].setVisibility(false)
              })
            }
            // lines of code for GEE Visualization to make layers active when active in data analytics tab only
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
          //modified akah_selectedwells layer to akah_village layer for enhancing the count of villages
          new QueryTask(akah_villages_layer.url).execute(query_dist1, function retrieve(selecteddistrictresponse1) {
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
          //modified akah_selectedwells layer to akah_village layer for enhancing the count of villages
          new QueryTask(akah_villages_layer.url).execute(query_dist1dv, function retrieve(selecteddistrictresponse1) {
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
          //modified akah_selectedwells layer to akah_village layer for enhancing the count of villages
          new QueryTask(akah_villages_layer.url).execute(query_dist2, function retrieve(selectedblockresponse1) {
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
          //modified akah_selectedwells layer to akah_village layer for enhancing the count of villages
          new QueryTask(akah_villages_layer.url).execute(query_dist2dv, function retrieve(selectedblockresponse1) {
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
        if(evt != "Select State"){akah_villages_layer.setDefinitionExpression("block like '"+evt+"' and selected_wells like 'Yes'")}
        else{akah_villages_layer.setDefinitionExpression("1=1");}
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

              // var rainfall_values=['jan_2019_actual__mm','jan_2019_normal__mm','jan_2019_deviation__mm','feb_2019_actual__mm','feb_2019_normal__mm','feb_2019_deviation__mm','mar_2019_actual__mm','mar_2019_normal__mm','mar_2019_deviation__mm','apr_2019_actual__mm','apr_2019_normal__mm','apr_2019_deviation__mm','may_2019_actual__mm','may_2019_normal__mm','may_2019_deviation__mm','jun_2019_actual__mm','jun_2019_normal__mm','jun_2019_deviation__mm','jul_2019_actual__mm','jul_2019_normal__mm','jul_2019_deviation__mm','aug_2019_actual__mm','aug_2019_normal__mm','aug_2019_deviation__mm','sep_2019_actual__mm','sep_2019_normal__mm','sep_2019_deviation__mm','oct_2019_actual__mm','oct_2019_normal__mm','oct_2019_deviation__mm','nov_2019_actual__mm','nov_2019_normal__mm','nov_2019_deviation__mm','dec_2019_Actual__mm','dec_2019_normal__mm','dec_2019_deviation__mm','jan_2020_actual__mm','jan_2020_normal__mm','jan_2020_deviation__mm']
              var query_summdv = new Query();
              query_summdv.where ="state like" +" "+"\'"+ statenamedv +"\'"  + " " + "AND" + " " + "district like" +" "+"\'"+ akahdistrict +"\'"+ " " + "AND" + " " + "block like" + " " + "\'" + blocknamedv + "\'";
              query_summdv.outFields = ["*"]
              query_summdv.returnGeometry = true
              window.gwr_graph_query=new QueryTask(akah_block_url).execute(query_summdv, function retrieve(summ_selected_records1) {
              window.akahRainfallResponse = summ_selected_records1.features[0];
              dojo.query("#gwr_info").style("display","block");
              akahRainfallResponse.attributes["gw_stage_category"]!= null ? domAttr.set("gwr_category","innerHTML",akahRainfallResponse.attributes["gw_stage_category"]) : domAttr.set("gwr_category","innerHTML","");
              akahRainfallResponse.attributes["gw_extraction_percentage"] !=null ? domAttr.set("gwr_stage","innerHTML",akahRainfallResponse.attributes["gw_extraction_percentage"].toFixed(2)+'%') :domAttr.set("gwr_stage","innerHTML","");
              akah_Tool.map.setExtent(akahRainfallResponse.geometry.getExtent().expand(1.5), true);
              /*Rainfall code beginning for generating Rainfall Charts*/
              var i=1;
              var queryrain = new Query()
              queryrain.where = "state like" +" "+"\'"+ statenamedv +"\'"  + " " + "AND" + " " + "district like" +" "+"\'"+ akahdistrict +"\'"
              queryrain.outFields = ["*"]
              queryrain.returnGeometry = true
              new QueryTask(akah_dist_layer.url).execute(queryrain, function(rain_districtResponse){
                window.rain_districtResponse = rain_districtResponse;
                if (rain_districtResponse.features[0].attributes.hydrogeology_description != null) {
                  info_statement = '<div>'+
                                  '<p class="info_styles">'+
                                  rain_districtResponse.features[0].attributes.hydrogeology_description+'</p></div>';
                }
                else{
                  info_statement = '<div>'+'<p style="text-align: justify;font-size: 14px;margin-right: 30px;line-height: 1.5em;">Resources Not Available</p>'+'</div>';
                }
                window.rain_from=2011
                window.rain_to=2020
                queryrain.where = "year >= "+rain_from+" AND year <= "+rain_to+" AND district_id = "+rain_districtResponse.features[0].attributes['district_pk']
                queryrain.outFields = ["*"]
                new QueryTask(district_rainfall_url).execute(queryrain, function(ann_rainfallResponse){
                  window.ann_rainfallResponse = ann_rainfallResponse;
                  //wsprv['rainfall_pet_values'] for water availability module
                  // wsprv['rainfall_pet_values'] = ann_rainfallResponse;
                  ann_rainfallResponse.features.forEach(function(evt1,index1){
                      ann_rainfallResponse.fields.forEach( function(evt, index){
                          var fieldname = evt.name;
                          a.push(Number(ann_rainfallResponse.features[index1].attributes[fieldname]));//window.a = a;
                          if (fieldname.includes('_actual')) {
                            rain_tooltip_arr_1.push({text: 'Actual Rainfall '+rain_from+' ', value: (evt1.attributes[fieldname])*(-1)});//window.rain_tooltip_arr_1 = rain_tooltip_arr_1;
                            actual_rain.push(Number(ann_rainfallResponse.features[index1].attributes[fieldname]));//window.actual_rain = actual_rain;
                          }
                          else if (fieldname.includes('_normal')) {
                            norm_rain.push(Number(ann_rainfallResponse.features[index1].attributes[fieldname]));//window.norm_rain = norm_rain;
                          }
                          else if (fieldname.includes('_deviation')) {
                            rain_dev.push(Number(ann_rainfallResponse.features[index1].attributes[fieldname])); //window.rain_dev = rain_dev;
                          }
                      });
                      rain_months.push({text:ann_rainfallResponse.features[index1].attributes.year , value: i});
                      // rain_from++;
                      i++;
                });
                dojo.query('#gwr1_load_gif').style('display','none');
                dojo.query('#gwr2_load_gif').style('display','none');
                dojo.query('#rf_load_gif').style('display','none');
                akah_Tool.rainfallChartCreate()
              });
            });
              // rainfall_values.forEach(function(evt, index){
              //     var fieldname = evt;
              //     a.push(Number(akahRainfallResponse.attributes[fieldname]));//window.a = a;
              //     if (fieldname.includes('_actual')) {
              //       rain_tooltip_arr_1.push({text: fieldname.slice(0,8).toUpperCase().replace('_', ' '), value: (akahRainfallResponse.attributes[fieldname])*(-1)});//window.rain_tooltip_arr_1 = rain_tooltip_arr_1;
              //       actual_rain.push(Number(akahRainfallResponse.attributes[fieldname]));//window.actual_rain = actual_rain;
              //     }
              //     else if (fieldname.includes('_normal')) {
              //       rain_months.push({text: fieldname.slice(0,8).toUpperCase().replace('_', ' '), value: i});//window.rain_months = rain_months;
              //       norm_rain.push(Number(akahRainfallResponse.attributes[fieldname]));//window.norm_rain = norm_rain;
              //       i++;
              //     }
              //     else if (fieldname.includes('_deviation')) {
              //       rain_dev.push(Number(akahRainfallResponse.attributes[fieldname])); //window.rain_dev = rain_dev;
              //     }
              // });
              /*call the function to prepare rainfall chart*/
              // if(districtnamedv === "Aurangabad"){
              //   actual_rain=[605.25,592.06,714.71,686.51,438.01,826.43,862.41];
              //   rain_dev=[-155.65,-168.84,-46.19,-74.39,-322.89,65.53,101.51]
              //   norm_rain=[760.9,760.9,760.9,760.9,760.9,760.9,760.9];// var rain_dev2=
              //   rain_tooltip_arr_1 =  rain_months =  [{text:"2014",value:1},{text:"2015",value:2},{text:"2016",value:3},{text:"2017",value:4},{text:"2018",value:5},{text:"2019",value:6},{text:"2020",value:7}]
              //   // rain_tooltip_arr_1 =  [{text:"2014",value:actual_rain[0]},{text:"2015",value:actual_rain[1]},{text:"2016",value:actual_rain[2]},{text:"2017",value:actual_rain[3]},{text:"2018",value:actual_rain[4]},{text:"2019",value:actual_rain[5]},{text:"2020",value:actual_rain[6]}]
              //   // rain_months =  [{text:"2014",value:actual_rain[0]},{text:"2015",value:actual_rain[1]},{text:"2016",value:actual_rain[2]},{text:"2017",value:actual_rain[3]},{text:"2018",value:actual_rain[4]},{text:"2019",value:actual_rain[5]},{text:"2020",value:actual_rain[6]}]
              // }
              // dojo.query('#gwr1_load_gif').style('display','none');
              // dojo.query('#gwr2_load_gif').style('display','none');
              // dojo.query('#rf_load_gif').style('display','none');

              // akah_Tool.rainfallChartCreate()
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
        dojo.query("#dashboardImgDiv").style("display","none");
        st_val1dv.attr('value', evt);
        blockValueakah.attr('value', evt);
        akah_villages_layer.setDefinitionExpression("block like '"+evt+"' and selected_wells like 'Yes'")
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
          //need to write a condition in akah_selected wells layer for filtering of
          //villages which are not available in akah_selected wells layer && present in akah_villages_ layer
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
            query_summ1.outFields = ["total_population_census_2011"];//, "male_population_census_2011", "female_population_census_2011"];
            query_summ1.returnGeometry = true;
            query_summ1.geometry=mp;
            window.vilname=new QueryTask(akah_villages_layer.url).execute(query_summ1, function retrieve(summ){
              var t=0;
              var ee=new esri.geometry.Polygon(summ.features[0].geometry.spatialReference);
              window.ee=ee;
              summ.features.forEach(function(f){
              ee.addRing(f.geometry.rings[0]);
              t=t+f.attributes["total_population_census_2011"];
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
          query_summ12.where="block like '"+blockname+"'";
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
            query_summ1.outFields=["Basin"];
            //console.log(query_summ1);
            window.ws= new QueryTask(akah_watershed.url).execute(query_summ1, function retrieve(summ){
              if(summ.features.length>0){
                domAttr.set(sum_var[5],"innerHTML",'<b>'+summ.features[0].attributes["Basin"]+'</b>');
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
            domAttr.set("tab3_state","innerHTML",statename);
            domAttr.set("tab3_district","innerHTML",districtname);
            domAttr.set("tab3_block","innerHTML",blockname);
            // dojo.query("#summary_div").style("display","none");
            dojo.query("#summary_gujarath").style("display","block");
            dojo.query("#akahLocation_info").style("display","block");
            //dojo.query("#summary_maharashtra").style("display","block");
            akah_states_layer.setDefinitionExpression("state like '"+statename+"'");
            akah_dist_layer.setDefinitionExpression("state like '"+statename+"' and "+"district like '"+districtname+"'");
            akah_block_layer.setDefinitionExpression("state like '"+statename+"' and "+"district like '"+districtname+"' and "+"block like '"+blockname+"'")
          }
            else{  //(evt == "Select Block")
                  //dojo.query("#summary_div").style("display","block");
                  dojo.query("#summary_gujarath").style("display","none");
                  dojo.query("#akahLocation_info").style("display","none");
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

    initTabsAndDropdownsSWQ: function(){
      var da_tab1 = {title: "Statistical Analysis",content: this.akah_da_tab1};
      var da_tab2 = {title: "Surface Water DI",content: this.akah_da_tab2};
      var da_tab3 = {title: "Visual Analysis",content: this.akah_da_tab3};
      var da_tab4 = {title: "Rainfall",content: this.akah_da_tab4};
      tabs_da = new TabContainer3({
        tabs: [da_tab1, da_tab2, da_tab3,da_tab4]
      }, this.tabs_da_container);
      document.getElementsByClassName('tab-item-td')[7].title = "Surface Water Degardation Index";
      new CheckBox({name: "checkBox",class:"swbcheck_class",value:"agreed",checked: true,onChange: function(evt){akah_Tool.akah_chartGenerateSWB();}}, "ecCheckBox_swb").startup();
      new CheckBox({name: "checkBox",class:"swbcheck_class",value:"agreed",checked: false,onChange: function(evt){akah_Tool.akah_chartGenerateSWB();}}, "cdomCheckBox_swb").startup();
      new CheckBox({name: "checkBox",class:"swbcheck_class",value:"agreed",checked: false,onChange: function(evt){akah_Tool.akah_chartGenerateSWB();}}, "grviCheckBox_swb").startup();
      new CheckBox({name: "checkBox",class:"swbcheck_class",value:"agreed",checked: false,onChange: function(evt){akah_Tool.akah_chartGenerateSWB();}}, "diCheckBox_swb").startup();
      new Select({
        name: "Surface Water Body Chooser",
        id: "swb_id"
      }, this.akah_swbDropdown).startup();
      var swb_array = ['Select'];
      window.swb_array=swb_array;
      var swb_map = swb_array.map(function (record) {
        return dojo.create("option", {
          label: record,
          value: record
        })
      })
      window.swb_map=swb_map
      var swb_val = dijit.byId('swb_id')
      window.swb_val=swb_val;
      swb_val.options.length = 0
      swb_val.addOption(swb_map)
      swb_val.attr('value', swb_array[0]);

      new Select({name: "agakhan_fromselMonthSWB",id: "akah_fromselectMonthSWB"}, this.akah_fromselMonthSWB).startup();
      new Select({name: "agakhan_fromselYearSWB",id: "akah_fromselectYearSWB"}, this.akah_fromselYearSWB).startup();
      new Select({name: "agakhan_toselMonthSWB",id: "akah_toselectMonthSWB"}, this.akah_toselMonthSWB).startup();
      new Select({name: "agakhan_toselYearSWB",id: "akah_toselectYearSWB"}, this.akah_toselYearSWB).startup();
      new Select({name: "agakhan_fromselYearABSWB",id: "akah_fromselectYearABSWB"}, this.akah_fromselYearABSWB).startup(); //for attribute based DI
      new Select({name: "agakhan_toselYearABSWB",id: "akah_toselectYearABSWB"}, this.akah_toselYearABSWB).startup();

      //for SWB
      var selectFromMonth_SWB = dijit.byId('akah_fromselectMonthSWB')
      window.selectFromMonth_SWB = selectFromMonth_SWB
      var selectFromYear_SWB = dijit.byId('akah_fromselectYearSWB')
      window.selectFromYear_SWB = selectFromYear_SWB
      var selectToMonth_SWB = dijit.byId('akah_toselectMonthSWB')
      window.selectToMonth_SWB = selectToMonth_SWB
      var selectToYear_SWB = dijit.byId('akah_toselectYearSWB')
      window.selectToYear_SWB = selectToYear_SWB
      var selectFromYear_ABSWB = dijit.byId('akah_fromselectYearABSWB')
      window.selectFromYear_ABSWB = selectFromYear_ABSWB
      var selectToYear_ABSWB = dijit.byId('akah_toselectYearABSWB')
      window.selectToYear_ABSWB = selectToYear_ABSWB
      var akah_SWBchartFromYears = ['Year','2019','2020','2021'];window.akah_SWBchartFromYears = akah_SWBchartFromYears;
      var akah_SWBchartFromMonths = {'0': "Month", '1': "Jan", '2': "Feb", '3':"Mar",'4':"Apr",'5':"May",'6':"June",'7':"July",'8':"Aug",'9':"Sep",'10':"Oct",'11':"Nov",'12':"Dec"};window.akah_SWBchartFromMonths = akah_SWBchartFromMonths;
      var akah_SWBchartToYears = ['Year','2019','2020','2021'];window.akah_SWBchartToYears = akah_SWBchartToYears;
      var akah_SWBchartToMonths = {'0': "Month", '1': "Jan", '2': "Feb", '3':"Mar",'4':"Apr",'5':"May",'6':"June",'7':"July",'8':"Aug",'9':"Sep",'10':"Oct",'11':"Nov",'12':"Dec"};window.akah_SWBchartToMonths = akah_SWBchartToMonths;
      var akah_ABSWBchartFromYears = ['Year','2016','2017','2018','2019','2020'];window.akah_ABSWBchartFromYears = akah_ABSWBchartFromYears;
      var akah_ABSWBchartToYears = ['Year','2016','2017','2018','2019','2020'];window.akah_ABSWBchartToYears = akah_ABSWBchartToYears;
     
      //attribute based from year and month
      var akahFromYearABSWB_map = akah_ABSWBchartFromYears.map(function(record){//from year
              return dojo.create("option", {
                label: record,
                value: record
            })
      })
      selectFromYear_ABSWB.options.length = 0
      selectFromYear_ABSWB.addOption(akahFromYearABSWB_map)
      selectFromYear_ABSWB.attr('value', akah_ABSWBchartFromYears[0])
      var akahToYearABSWB_map = akah_ABSWBchartToYears.map(function(record){//to year
        return dojo.create("option", {
          label: record,
          value: record
      })
      })
      selectToYear_ABSWB.options.length = 0
      selectToYear_ABSWB.addOption(akahToYearABSWB_map)
      selectToYear_ABSWB.attr('value', akah_ABSWBchartToYears[0]) //end of attribue based DI years mapping
      var akahFromYearSWB_map = akah_SWBchartFromYears.map(function(record){//from year
              return dojo.create("option", {
                label: record,
                value: record
            })
      })
      selectFromYear_SWB.options.length = 0
      selectFromYear_SWB.addOption(akahFromYearSWB_map)
      selectFromYear_SWB.attr('value', akah_SWBchartFromYears[0])
      var akahToYearSWB_map = akah_SWBchartToYears.map(function(record){//to year
        return dojo.create("option", {
          label: record,
          value: record
      })
      })
      selectToYear_SWB.options.length = 0
      selectToYear_SWB.addOption(akahToYearSWB_map)
      selectToYear_SWB.attr('value', akah_SWBchartToYears[0])
      var akah_SWBchartFromMonths = Object.entries(akah_SWBchartFromMonths).map(function(record){//from month
        return dojo.create("option", {
          label: record[1],
          value: record[0]
        })
      })
      selectFromMonth_SWB.options.length = 0
      selectFromMonth_SWB.addOption(akah_SWBchartFromMonths)
      selectFromMonth_SWB.attr('value', Object.keys(akah_SWBchartFromMonths)[0])
      var akah_SWBchartToMonths = Object.entries(akah_SWBchartToMonths).map(function(record){//from month
        return dojo.create("option", {
          label: record[1],
          value: record[0]
        })
      })
      selectToMonth_SWB.options.length = 0
      selectToMonth_SWB.addOption(akah_SWBchartToMonths)
      selectToMonth_SWB.attr('value', Object.keys(akah_SWBchartToMonths)[0])
      window.akah_swbfromyear ="";window.akah_swbtoyear ="";window.akah_swbfrommonth="";window.akah_swbtomonth="";window.akah_abswbtoyear="";window.akah_abswbfromyear="";
      this.own(on(selectFromYear_SWB, 'change', lang.hitch(this, function(akah_swbfromyear){
        window.akah_swbfromyear = akah_swbfromyear;
        this.akah_swbfromyear = akah_swbfromyear;
        if(akah_swbfromyear != "Year"){
            if((Number(akah_swbtoyear) < Number(akah_swbfromyear) )||((Number(akah_swbtoyear) == Number(akah_swbfromyear)  ) && (Number(akah_swbfrommonth) > Number(akah_swbtomonth))) || ((Number(akah_swbfrommonth) == Number(akah_swbtomonth)) && (Number(akah_swbfromyear) > Number(akah_swbtoyear))) || ((Number(akah_swbfrommonth) === Number(akah_swbtomonth)) && (Number(akah_swbfromyear) === Number(akah_swbtoyear)))){
              domAttr.set("yearrangewarning_swb","innerHTML",'<p style="letter-spacing:0.5px;color: darkorange;font-size: 13px;line-height:2em;"><b>Note:</b>From year&month should be less than To year&month</p>')
              dojo.setAttr('ecLineCharts_info', 'innerHTML', '');
              dojo.setAttr('cdomLineCharts_info', 'innerHTML', '');
              dojo.setAttr('grviLineCharts_info', 'innerHTML', '');
              dojo.setAttr('diLineCharts_info', 'innerHTML', '');
              dojo.query('#ec_legend').style('display','none')
              dojo.query('#cdom_legend').style('display','none')
              dojo.query('#grvi_legend').style('display','none')
              dojo.query('#di_legend').style('display','none')
            }
            else{
              domAttr.set("yearrangewarning_swb","innerHTML",'')
              // this.akah_chartGenerateSWB();
        this.doSWBQuery();
            }
         }
         else if(akah_swbtoyear=="Year" && akah_swbfromyear=="Year" && akah_swbfrommonth == "0" && akah_swbtomonth == "0"){
          dojo.setAttr('ecLineCharts_info', 'innerHTML', '');
          dojo.setAttr('cdomLineCharts_info', 'innerHTML', '');
          dojo.setAttr('grviLineCharts_info', 'innerHTML', '');
          dojo.setAttr('diLineCharts_info', 'innerHTML', '');
          dojo.query('#ec_legend').style('display','none')
          dojo.query('#cdom_legend').style('display','none')
          dojo.query('#grvi_legend').style('display','none')
          dojo.query('#di_legend').style('display','none')
         }
      })))
      this.own(on(selectFromMonth_SWB, 'change', lang.hitch(this, function(akah_swbfrommonth){
        window.akah_swbfrommonth = akah_swbfrommonth;
        this.akah_swbfrommonth = akah_swbfrommonth;
        if(akah_swbfrommonth != "0"){
          if( (Number(akah_swbtoyear) < Number(akah_swbfromyear) )|| ((Number(akah_swbtoyear) == Number(akah_swbfromyear)) && (Number(akah_swbfrommonth) > Number(akah_swbtomonth))) || ((Number(akah_swbfrommonth) == Number(akah_swbtomonth)) && (Number(akah_swbfromyear) > Number(akah_swbtoyear))) || ((Number(akah_swbfrommonth) === Number(akah_swbtomonth)) && (Number(akah_swbfromyear) === Number(akah_swbtoyear)))){
            domAttr.set("yearrangewarning_swb","innerHTML",'<p style="letter-spacing:0.5px;color: darkorange;font-size: 13px;line-height:2em;"><b>Note:</b>From year&month should be less than To year&month</p>')
            dojo.setAttr('ecLineCharts_info', 'innerHTML', '');
            dojo.setAttr('cdomLineCharts_info', 'innerHTML', '');
            dojo.setAttr('grviLineCharts_info', 'innerHTML', '');
            dojo.setAttr('diLineCharts_info', 'innerHTML', '');
            dojo.query('#ec_legend').style('display','none')
            dojo.query('#cdom_legend').style('display','none')
            dojo.query('#grvi_legend').style('display','none')
            dojo.query('#di_legend').style('display','none')
          }
          else{
            domAttr.set("yearrangewarning_swb","innerHTML",'')
            // this.akah_chartGenerateSWB();
             this.doSWBQuery();
          }
        }
        else if(akah_swbtoyear=="Year" && akah_swbfromyear=="Year" && akah_swbfrommonth == "0" && akah_swbtomonth == "0"){
          dojo.setAttr('ecLineCharts_info', 'innerHTML', '');
          dojo.setAttr('cdomLineCharts_info', 'innerHTML', '');
          dojo.setAttr('grviLineCharts_info', 'innerHTML', '');
          dojo.setAttr('diLineCharts_info', 'innerHTML', '');
          dojo.query('#ec_legend').style('display','none')
          dojo.query('#cdom_legend').style('display','none')
          dojo.query('#grvi_legend').style('display','none')
          dojo.query('#di_legend').style('display','none')
         }
      })))
     
      this.own(on(selectToMonth_SWB, 'change', lang.hitch(this, function(akah_swbtomonth){
        window.akah_swbtomonth = akah_swbtomonth;
        this.akah_swbtomonth = akah_swbtomonth;
        if(akah_swbtomonth != "0"){
          if( (Number(akah_swbtoyear) < Number(akah_swbfromyear) )|| ((Number(akah_swbtoyear) == Number(akah_swbfromyear)) && (Number(akah_swbfrommonth) > Number(akah_swbtomonth))) || ((Number(akah_swbfrommonth) == Number(akah_swbtomonth)) && (Number(akah_swbfromyear) > Number(akah_swbtoyear))) || ((Number(akah_swbfrommonth) === Number(akah_swbtomonth)) && (Number(akah_swbfromyear) === Number(akah_swbtoyear)))){
            domAttr.set("yearrangewarning_swb","innerHTML",'<p style="letter-spacing:0.5px;color: darkorange;font-size: 13px;line-height:2em;"><b>Note:</b>From year&month should be less than To year&month</p>')
            dojo.setAttr('ecLineCharts_info', 'innerHTML', '');
            dojo.setAttr('cdomLineCharts_info', 'innerHTML', '');
            dojo.setAttr('grviLineCharts_info', 'innerHTML', '');
            dojo.setAttr('diLineCharts_info', 'innerHTML', '');
            dojo.query('#ec_legend').style('display','none')
            dojo.query('#cdom_legend').style('display','none')
            dojo.query('#grvi_legend').style('display','none')
            dojo.query('#di_legend').style('display','none')
          }
          else{
            domAttr.set("yearrangewarning_swb","innerHTML",'')
            this.doSWBQuery();
        // this.akah_chartGenerateSWB();
          }
        }
        else if(akah_swbtoyear=="Year" && akah_swbfromyear=="Year" && akah_swbfrommonth == "0" && akah_swbtomonth == "0"){
          dojo.setAttr('ecLineCharts_info', 'innerHTML', '');
          dojo.setAttr('cdomLineCharts_info', 'innerHTML', '');
          dojo.setAttr('grviLineCharts_info', 'innerHTML', '');
          dojo.setAttr('diLineCharts_info', 'innerHTML', '');
          dojo.query('#ec_legend').style('display','none')
          dojo.query('#cdom_legend').style('display','none')
          dojo.query('#grvi_legend').style('display','none')
          dojo.query('#di_legend').style('display','none')
         }
      })))
      this.own(on(selectToYear_SWB, 'change', lang.hitch(this, function(akah_swbtoyear){
        window.akah_swbtoyear = akah_swbtoyear;
        this.akah_swbtoyear = akah_swbtoyear;
        if(akah_swbtoyear != "Year"){
          if((Number(akah_swbtoyear) < Number(akah_swbfromyear) )||((Number(akah_swbtoyear) == Number(akah_swbfromyear)  ) && (Number(akah_swbfrommonth) > Number(akah_swbtomonth))) || ((Number(akah_swbfrommonth) == Number(akah_swbtomonth)) && (Number(akah_swbfromyear) > Number(akah_swbtoyear))) || ((Number(akah_swbfrommonth) === Number(akah_swbtomonth)) && (Number(akah_swbfromyear) === Number(akah_swbtoyear)))){
            domAttr.set("yearrangewarning_swb","innerHTML",'<p style="letter-spacing:0.5px;color: darkorange;font-size: 13px;line-height:2em;"><b>Note:</b>From year&month should be less than To year&month</p>')
            dojo.setAttr('ecLineCharts_info', 'innerHTML', '');
            dojo.setAttr('cdomLineCharts_info', 'innerHTML', '');
            dojo.setAttr('grviLineCharts_info', 'innerHTML', '');
            dojo.setAttr('diLineCharts_info', 'innerHTML', '');
            dojo.query('#ec_legend').style('display','none')
            dojo.query('#cdom_legend').style('display','none')
            dojo.query('#grvi_legend').style('display','none')
            dojo.query('#di_legend').style('display','none')
          }
          else{
            domAttr.set("yearrangewarning_swb","innerHTML",'')
            // this.akah_chartGenerateSWB();
            this.doSWBQuery();
          }
        }
        else if(akah_swbtoyear=="Year" && akah_swbfromyear=="Year" && akah_swbfrommonth == "0" && akah_swbtomonth == "0"){
          dojo.setAttr('ecLineCharts_info', 'innerHTML', '');
          dojo.setAttr('cdomLineCharts_info', 'innerHTML', '');
          dojo.setAttr('grviLineCharts_info', 'innerHTML', '');
          dojo.setAttr('diLineCharts_info', 'innerHTML', '');
          dojo.query('#ec_legend').style('display','none')
          dojo.query('#cdom_legend').style('display','none')
          dojo.query('#grvi_legend').style('display','none')
          dojo.query('#di_legend').style('display','none')
         }
      })))
      this.own(on(selectFromYear_ABSWB, 'change', lang.hitch(this, function(akah_abswbfromyear){
        window.akah_abswbfromyear = akah_abswbfromyear;
        this.akah_abswbfromyear = akah_abswbfromyear;
        if(akah_abswbfromyear != "Year"){
            if(Number(akah_abswbtoyear) < Number(akah_abswbfromyear)){
              domAttr.set("yearrangewarning_swb","innerHTML",'<p style="letter-spacing:0.5px;color: darkorange;font-size: 13px;line-height:2em;"><b>Note:</b>From year should be less than To year</p>')
              dojo.setAttr('attribasedDILineCharts_info', 'innerHTML', '');
              dojo.query('#attribasedDI_legend').style('display','none')
              domAttr.set("phy_rec_potential_swb","innerHTML",'')
            }
            else{
              domAttr.set("yearrangewarning_abswb","innerHTML",'')
              this.doSWBQuery();
            }
         }
         else if(akah_abswbtoyear=="Year" && akah_abswbfromyear=="Year"){
          dojo.setAttr('attribasedDILineCharts_info', 'innerHTML', '');
          domAttr.set("phy_rec_potential_swb","innerHTML",'');
          dojo.query('#attribasedDI_legend').style('display','none')
         }
      })))
      this.own(on(selectToYear_ABSWB, 'change', lang.hitch(this, function(akah_abswbtoyear){
        window.akah_abswbtoyear = akah_abswbtoyear;
        this.akah_abswbtoyear = akah_abswbtoyear;
        if(akah_abswbtoyear != "Year"){
            if(Number(akah_abswbtoyear) < Number(akah_abswbfromyear)){
              domAttr.set("yearrangewarning_swb","innerHTML",'<p style="letter-spacing:0.5px;color: darkorange;font-size: 13px;line-height:2em;"><b>Note:</b>From year should be less than To year</p>')
              dojo.setAttr('attribasedDILineCharts_info', 'innerHTML', '');
              dojo.query('#attribasedDI_legend').style('display','none')
              domAttr.set("phy_rec_potential_swb","innerHTML",'');
            }
            else{
              domAttr.set("yearrangewarning_abswb","innerHTML",'')
              this.doSWBQuery();
            }
         }
         else if(akah_abswbtoyear=="Year" && akah_abswbfromyear=="Year"){
          dojo.setAttr('attribasedDILineCharts_info', 'innerHTML', '');
          domAttr.set("phy_rec_potential_swb","innerHTML",'');
          dojo.query('#attribasedDI_legend').style('display','none')
         }
      })))
      on(tabs_da.tabItems[0], "click", function(e){
        akah_swb.setVisibility(false)
        akah_sw1.setVisibility(true)
        // lines of code for GEE Visualization to make layers active when active in data analytics tab only
        if (tiles_layerlist!={}) {
            Object.keys(tiles_layerlist).forEach(function(tile_key){
              tiles_layerlist[tile_key].setVisibility(false)
            })
            if (vegetation_trend_layerlist!={}) {
              Object.keys(vegetation_trend_layerlist).forEach(function(tile_key){
                vegetation_trend_layerlist[tile_key].setVisibility(false)
              })
            }
            if (vegetation_trend_layerlist!={}) {
              Object.keys(water_trend_layerlist).forEach(function(tile_key){
                water_trend_layerlist[tile_key].setVisibility(false)
              })
            }
        }
        // lines of code for GEE Visualization to make layers active when active in data analytics tab only
      })
      on(tabs_da.tabItems[1], "click",function(e){
        akah_swb.setVisibility(true)
        akah_sw1.setVisibility(false)
        // lines of code for GEE Visualization to make layers active when active in data analytics tab only
        if (tiles_layerlist!={}) {
            Object.keys(tiles_layerlist).forEach(function(tile_key){
              tiles_layerlist[tile_key].setVisibility(false)
            })
            if (vegetation_trend_layerlist!={}) {
              Object.keys(vegetation_trend_layerlist).forEach(function(tile_key){
                vegetation_trend_layerlist[tile_key].setVisibility(false)
              })
            }
            if (vegetation_trend_layerlist!={}) {
              Object.keys(water_trend_layerlist).forEach(function(tile_key){
                water_trend_layerlist[tile_key].setVisibility(false)
              })
            }
        }
        // lines of code for GEE Visualization to make layers active when active in data analytics tab only
      })
      on(tabs_da.tabItems[2], "click", function(e){
        akah_swb.setVisibility(false)
        akah_sw1.setVisibility(true)
        //condition to check whether village is chosen in data analytics module and also in village information module.
        //using the response variable - akah_searchResponse and search module id(searchAkah)
        if(akah_searchResponse != undefined && searchAkah.value != ""){
          akah_Tool.map.setExtent(akah_searchResponse.geometry.getExtent().expand(1.5))
          akah_Tool.map.graphics.add(new Graphic(akah_searchResponse.geometry, new SimpleFillSymbol(SimpleFillSymbol.STYLE_NULL,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([215,0,0]), 2))));
          // lines of code for GEE Visualization to make selected layers active when active in visual analysis tab.
          if (classification.getSelectedTitle() === 'Vegetation') {
              if (tiles_layerlist!={}) {
                // Object.keys(tiles_layerlist).forEach(function(tile_key){
                //   if (tile_key.includes('Vegetation')) {
                //     tiles_layerlist[tile_key].setVisibility(true)
                //   }
                //   else{
                //     tiles_layerlist[tile_key].setVisibility(false)
                //   }
                // })
                if (vegetation_trend_layerlist!={}) {
                  Object.keys(vegetation_trend_layerlist).forEach(function(tile_key){
                    vegetation_trend_layerlist[tile_key].setVisibility(false)
                  })
                }
                if (water_trend_layerlist!={}) {
                  Object.keys(water_trend_layerlist).forEach(function(tile_key){
                    water_trend_layerlist[tile_key].setVisibility(false)
                  })
                }
              }
              /*when vegetation tab is selected, monthly analysis should be selected by default*/
              dijit.byId('month_classify_v').setChecked(true)
              dijit.byId('classify_1year_v').setChecked(false)
              dijit.byId('classify_5year_v').setChecked(false)
              /*surface water related radiobuttons should be unchecked*/
              dijit.byId('month_classify_w').setChecked(false)
              dijit.byId('classify_1year_w').setChecked(false)
              dijit.byId('classify_5year_w').setChecked(false)
              /*criteria to be enabled when monthly radio button is checked in vegetation*/
              dojo.query("#vegetation_monthlyInfo").style("display","block");
              dojo.query(".monthly_change").style("display","block");
              //the below 1year & 5year related dropdowns ->> display none
              dojo.query(".yearly_change").style("display","none");
              dojo.query(".five_year_change").style("display","none");
              //below are layer information
              dojo.query("#vegetation_1yearInfo").style("display","none");
              dojo.query("#vegetation_5yearInfo").style("display","none");
              dojo.query("#water_monthlyInfo").style("display","none");
              dojo.query("#water_1yearInfo").style("display","none");
              dojo.query("#water_5yearInfo").style("display","none");
              /*since monthly radio button is selected by default, layers related to monthly need to be switched on...*/
              akah_Tool._listSelected_layers_visibility('month_classify_v')
          }
          if (classification.getSelectedTitle() === 'Surface Water') {
              if (tiles_layerlist!={}) {
                // Object.keys(tiles_layerlist).forEach(function(tile_key){
                //   if (tile_key.includes('Water')) {
                //     tiles_layerlist[tile_key].setVisibility(true)
                //   }
                //   else{
                //     tiles_layerlist[tile_key].setVisibility(false)
                //   }
                // })
                if (vegetation_trend_layerlist!={}) {
                  Object.keys(vegetation_trend_layerlist).forEach(function(tile_key){
                    vegetation_trend_layerlist[tile_key].setVisibility(false)
                  })
                }
                if (water_trend_layerlist!={}) {
                  Object.keys(water_trend_layerlist).forEach(function(tile_key){
                    water_trend_layerlist[tile_key].setVisibility(false)
                  })
                }
              }
              /*when surface water tab is selected, monthly analysis should be selected by default*/
              dijit.byId('month_classify_w').setChecked(true)
              dijit.byId('classify_1year_w').setChecked(false)
              dijit.byId('classify_5year_w').setChecked(false)
              /*vegetation related radiobuttons should be unchecked*/
              dijit.byId('month_classify_v').setChecked(false)
              dijit.byId('classify_1year_v').setChecked(false)
              dijit.byId('classify_5year_v').setChecked(false)
              /*criteria to be enabled when monthly radio button is checked in surface water*/
              dojo.query("#water_monthlyInfo").style("display","block");
              dojo.query(".monthly_change").style("display","block");
              //the below 1year & 5year related dropdowns ->> display none
              dojo.query(".yearly_change").style("display","none");
              dojo.query(".five_year_change").style("display","none");
              //below are layer information
              dojo.query("#vegetation_monthlyInfo").style("display","none");
              dojo.query("#vegetation_1yearInfo").style("display","none");
              dojo.query("#vegetation_5yearInfo").style("display","none");
              dojo.query("#water_1yearInfo").style("display","none");
              dojo.query("#water_5yearInfo").style("display","none");
              /*since monthly radio button is selected by default, layers related to monthly need to be switched on...*/
              akah_Tool._listSelected_layers_visibility('month_classify_w')
          }
          // lines of code for GEE Visualization to make layers active when active in data analytics tab only
        }
        else if(akahsearchResult_response != undefined && searchAkah.value != "") {
          akah_Tool.map.setExtent(akah_searchResponseresult.features[0].geometry.getExtent().expand(1.5))
          akah_Tool.map.graphics.add(new Graphic(akah_searchResponseresult.features[0].geometry,new SimpleFillSymbol(SimpleFillSymbol.STYLE_NULL,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([215,0,0]), 2))));
        }
        else{}
        //condition to check whether village is chosen in data analytics module and also in village information module.
        //using the response variable - akah_searchResponse and search module id(searchAkah)
      })
      on(tabs_da.tabItems[3],"click",function(e){
        if(akah_searchResponse != undefined && searchAkah.value != "") akah_Tool.getRainfallDataByCategory();
      });
      on(dom.byId("akahClearGraphics_analyticstab"), "click", function(){
        akah_Tool.map.graphics.clear();
        dojo.setAttr('ecLineCharts_info', 'innerHTML', '')
        dojo.setAttr('cdomLineCharts_info', 'innerHTML', '')
        dojo.setAttr('grviLineCharts_info', 'innerHTML', '')
        dojo.query('#ec_legend').style('display','none')
        dojo.query('#cdom_legend').style('display','none')
        dojo.query('#grvi_legend').style('display','none')
        dojo.setAttr('attribasedDILineCharts_info', 'innerHTML', '')
        dojo.query('#attribasedDI_legend').style('display','none')
        domAttr.set("phy_rec_potential_swb","innerHTML",'')
        domAttr.set("yearrangewarning_abswb","innerHTML",'')

        highlightVillGraphic = new Graphic(akah_searchResponse.geometry, villHighlightSymbol);
        akah_Tool.map.graphics.add(highlightVillGraphic);
        akah_Tool.map.setExtent(akah_searchResponse.geometry.getExtent())
      });

      var swbGeometryQuery  = new Query();
      swbGeometryQuery.returnGeometry = true;
      swbGeometryQuery.outFields = ["*"];
      window.swbGeometryQuery=swbGeometryQuery;
    },
    initRainfallDropdowns: function(){
    akah_rffromyear=""; akah_rftoyear="";akah_rffrommonth="";akah_rftomonth="";
    window.akah_rffromyear=akah_rffromyear;window.akah_rftoyear=akah_rftoyear;window.akah_rffrommonth=akah_rffrommonth;window.akah_rftomonth=akah_rftomonth;
            //Dropdowns Rainfall
            new Select({  //from rainfall Year
              name: "From Chooser",
              id: "fromRFYear_id"
            }, this.fromRFYear).startup();
            var fromRfYear_array = ['Year','2008','2009','2010','2011','2012','2013','2014','2015','2016','2017','2018','2019','2020'];
            window.fromRfYear_array = fromRfYear_array;
            var fromRFYear_map = fromRfYear_array.map(function (record) {
              return dojo.create("option", {
                label: record,
                value: record
              })
            })
            var fromRFYear_val = dijit.byId('fromRFYear_id')
            window.fromRFYear_val = fromRFYear_val;
            fromRFYear_val.options.length = 0
            fromRFYear_val.addOption(fromRFYear_map)
            fromRFYear_val.attr('value', fromRfYear_array[0]);
            new Select({  //to rainfall Year
              name: "To Chooser",
              id: "toRFYear_id"
            }, this.toRFYear).startup();
            var toRfYear_array = ['Year','2008','2009','2010','2011','2012','2013','2014','2015','2016','2017','2018','2019','2020'];
            window.toRfYear_array = toRfYear_array;
            var toRFYear_map = toRfYear_array.map(function (record) {
              return dojo.create("option", {
                label: record,
                value: record
              })
            })
            var toRFYear_val = dijit.byId('toRFYear_id')
            window.toRFYear_val = toRFYear_val;
            toRFYear_val.options.length = 0
            toRFYear_val.addOption(toRFYear_map)
            toRFYear_val.attr('value', toRfYear_array[0]);
            new Select({  //from rainfall daily
              name: "From Chooser",
              id: "fromRFMonth_id"
            }, this.fromRFMonth).startup();
            var fromRfmonth_array = {'0': "Month", '1': "Jan", '2': "Feb", '3':"Mar",'4':"Apr",'5':"May",'6':"June",'7':"July",'8':"Aug",'9':"Sep",'10':"Oct",'11':"Nov",'12':"Dec"};
            window.fromRfmonth_array = fromRfmonth_array;
            var fromRFmonth_map = Object.entries(fromRfmonth_array).map(function (record) {
              return dojo.create("option", {
                label: record[1],
                value: record[0]
              })
            })
            var fromRFmonth_val = dijit.byId('fromRFMonth_id')
            window.fromRFmonth_val = fromRFmonth_val;
            fromRFmonth_val.options.length = 0
            fromRFmonth_val.addOption(fromRFmonth_map)
            fromRFmonth_val.attr('value', fromRfmonth_array[0]);
            new Select({  //to rainfall daily
              name: "To Chooser",
              id: "toRFMonth_id"
            }, this.toRFMonth).startup();
            var toRfmonth_array = {'0': "Month", '1': "Jan", '2': "Feb", '3':"Mar",'4':"Apr",'5':"May",'6':"June",'7':"July",'8':"Aug",'9':"Sep",'10':"Oct",'11':"Nov",'12':"Dec"};
            window.toRfmonth_array = toRfmonth_array;
            var toRFmonth_map =Object.entries(toRfmonth_array).map(function (record) {
              return dojo.create("option", {
                label: record[1],
                value: record[0]
              })
            })
            var toRFmonth_val = dijit.byId('toRFMonth_id')
            window.toRFmonth_val = toRFmonth_val
            toRFmonth_val.options.length = 0
            toRFmonth_val.addOption(toRFmonth_map)
            toRFmonth_val.attr('value', toRfmonth_array[0]);
            //onchange events of rainfall dropdowns
            this.own(on(fromRFYear_val, 'change', lang.hitch(this, function(akah_rffromyear){
              window.akah_rffromyear = akah_rffromyear;
              this.akah_rffromyear = akah_rffromyear;
              if(akah_rffromyear != "Year"){
                  if(Number(akah_rftoyear) < Number(akah_rffromyear)){
                    domAttr.set("yearrangewarning_rf","innerHTML",'<p style="letter-spacing:0.5px;color: darkorange;font-size: 13px;line-height:2em;"><b>Note:</b>From year should be less than To year</p>')
                  }
                  else{
                    domAttr.set("yearrangewarning_rf","innerHTML",'');
                    // akah_Tool.getRainfallDataByCategory();
                  }
               }
            })))
            this.own(on(toRFYear_val, 'change', lang.hitch(this, function(akah_rftoyear){
              window.akah_rftoyear = akah_rftoyear;
              this.akah_rftoyear = akah_rftoyear;
              if(akah_rftoyear != "Year"){
                  if(Number(akah_rftoyear) < Number(akah_rffromyear)){
                    domAttr.set("yearrangewarning_rf","innerHTML",'<p style="letter-spacing:0.5px;color: darkorange;font-size: 13px;line-height:2em;"><b>Note:</b>From year should be less than To year</p>')
                  }
                  else{
                    domAttr.set("yearrangewarning_rf","innerHTML",'');
                    // akah_Tool.getRainfallDataByCategory();
                  }
               }
            })))
            this.own(on(fromRFmonth_val, 'change', lang.hitch(this, function(akah_rffrommonth){
              window.akah_rffrommonth = akah_rffrommonth;
              this.akah_rffrommonth = akah_rffrommonth;
              if(akah_rffrommonth != "Month"){
                  if(Number(akah_rftoyear) < Number(akah_rffromyear)){
                    domAttr.set("yearrangewarning_rf","innerHTML",'<p style="letter-spacing:0.5px;color: darkorange;font-size: 13px;line-height:2em;"><b>Note:</b>From year should be less than To year</p>')
                  }
                  else{
                    domAttr.set("yearrangewarning_rf","innerHTML",'');
                    // akah_Tool.getRainfallDataByCategory();
                  }
               }
            })))
            this.own(on(toRFmonth_val, 'change', lang.hitch(this, function(akah_rftomonth){
              window.akah_rftomonth = akah_rftomonth;
              this.akah_rftomonth = akah_rftomonth;
              if(akah_rftomonth != "Month"){
                  if(Number(akah_rftoyear) < Number(akah_rffromyear)){
                    domAttr.set("yearrangewarning_rf","innerHTML",'<p style="letter-spacing:0.5px;color: darkorange;font-size: 13px;line-height:2em;"><b>Note:</b>From year should be less than To year</p>')
                  }
                  else{
                    domAttr.set("yearrangewarning_rf","innerHTML",'');
                    // akah_Tool.getRainfallDataByCategory();
                  }
               }
            })))
    },
    gotoFilterSurfWatBodies: function(){

      swbItems  = [];window.swbItems = swbItems;
      var swbQuery  = new Query();
      if(akah_searchResponse != undefined)
      swbQuery.geometry = akah_searchResponse.geometry;
      else
      swbQuery.geometry = akahsearchResult_response.result.feature.geometry
      // swbQuery.geometry = akahDraw_Evt.geometry;
      // swbQuery.geometry =
      swbQuery.returnGeometry = false;
      swbQuery.outFields =["ORIG_FID","uid_swb"]
      new QueryTask(akah_swb.url+"/0").execute(swbQuery, function retrieve(swbResponse){
        window.swbResponse= swbResponse;
        swb_array.length = 0;
        swb_array.push("Select")
        swbResponse.features.forEach(function(feature){
          swb_array.push(feature.attributes.ORIG_FID);
          swbItems.push(feature.attributes.ORIG_FID+"_"+feature.attributes.uid_swb)
          var swb_map = swb_array.map(function (record) {
            return dojo.create("option", {
              label: record,
              value: record
            })
          })
          window.swb_map=swb_map
          var swb_val = dijit.byId('swb_id')
          window.swb_val=swb_val;
          swb_val.options.length = 0
          swb_val.addOption(swb_map)
          swb_val.attr('value', swb_array[0]);
        });
      });
      window.akahswb ="";
      cdom_array=[];window.cdom_array=cdom_array;grvi_array=[];window.grvi_array=grvi_array;ec_array=[];window.ec_array=ec_array;di_array=[];window.di_array=di_array;swbdataLabels=[];window.swbdataLabels=swbdataLabels;
      this.own(on(swb_val, 'change', lang.hitch(this, function (evt) {
        swb_array.length = 0;
        window.akahswb = evt;
        akah_Tool.doSWBQuery();
      })));
    },

    doSWBQuery: function(){
      if(akahswb != "Select"){
        swbuid = swbItems.filter(item => item.includes(akahswb));
        swbGeometryQuery.where = "uid_swb like '"+swbuid[0].split("_")[1]+"'";
      }
      else{
        swbGeometryQuery.geometry = akahDraw_Evt.geometry
      }
      new QueryTask(akah_swb.url+"/0").execute(swbGeometryQuery, function retrieve(response){
        swbGeoResponse= response;
        window.swbGeoResponse= swbGeoResponse;
        akah_Tool.map.setExtent(swbGeoResponse.features[0].geometry.getExtent().expand(1.5))
        akah_Tool.akah_chartGenerateSWB();
      });
    },

    akah_chartGenerateSWB: function(){
      if(dom.byId("WQ_DI_inp").checked == true){
        if(akah_swbfrommonth != "0" && akah_swbfromyear != "Year" && akah_swbtomonth != "0" && akah_swbtoyear != "Year"){
        dojo.setAttr('ecLineCharts_info', 'innerHTML', '<img src="'+image_path+'" class="load_image" alt="Loading.." style="margin-top:24%;width:100px;">')
      final_filterFromYearFields = [];final_filterToYearFields = [];
      window.final_filterFromYearFields = [];window.final_filterToYearFields = [];window.final_filterMiddleYearFields=[]
      cdom_reglineInpArray = [];ec_reglineInpArray=[];grvi_reglineInpArray=[];di_reglineInpArray=[];
      cdomdataLabels=[];grvidataLabels=[];ecdataLabels=[];didataLabels=[];
      var cdom_array=[];window.cdom_array=cdom_array;var grvi_array=[];window.grvi_array=grvi_array;var ec_array=[]; window.ec_array=ec_array;var di_array = [];window.di_array= di_array;var swbdataLabels=[]; window.swbdataLabels=swbdataLabels;
      filterFromYearFields=[];window.filterFromYearFields=filterFromYearFields;
      filterToYearFields=[];window.filterToYearFields=filterToYearFields;
      swb_resp =  swbGeoResponse.features[0]
      if(akah_swbfromyear === akah_swbtoyear){
        // filterFromYearFields  = swbGeoResponse.fields.filter(resp => resp.name.includes(akah_swbfromyear)).filter(resp => ((akah_Tool.computeMonth(resp.name.split("_")[2]) >= akah_swbfrommonth) && (akah_Tool.computeMonth(resp.name.split("_")[2]) <= akah_swbtomonth)));
        filterToYearFields  = swbGeoResponse.fields.filter(resp => resp.name.includes(akah_swbtoyear)).filter(resp => ((akah_Tool.computeMonth(resp.name.split("_")[2]) >= akah_swbfrommonth) && (akah_Tool.computeMonth(resp.name.split("_")[2]) <= akah_swbtomonth)));
      }
      else{
        filterFromYearFields  = swbGeoResponse.fields.filter(resp => resp.name.includes(akah_swbfromyear)).filter(resp => (akah_Tool.computeMonth(resp.name.split("_")[2]) >= akah_swbfrommonth));
        filterToYearFields  = swbGeoResponse.fields.filter(resp => resp.name.includes(akah_swbtoyear)).filter(resp => (akah_Tool.computeMonth(resp.name.split("_")[2]) <= akah_swbtomonth));
        filterMiddleYearFields=[];window.filterMiddleYearFields=filterMiddleYearFields;
        f= Number(akah_swbfromyear); t = Number(akah_swbtoyear);
         if((t-f) > 0){
            for(m = f+1;m<t;m++){
                  filterMiddleYearFields = swbGeoResponse.fields.filter(resp => resp.name.includes(m));
            }
         }
      }
          // filterFromYearFields  = swbGeoResponse.fields.filter(resp => resp.name.includes(akah_swbfromyear)).filter(resp => (akah_Tool.computeMonth(resp.name.split("_")[2]) >= akah_swbfrommonth));
          // final_filterFromYearFields  = filterFromYearFields.filter(resp => (akah_Tool.computeMonth(resp.name.split("_")[2]) > akah_swbfrommonth));
          // filterToYearFields  = swbGeoResponse.fields.filter(resp => resp.name.includes(akah_swbtoyear)).filter(resp => (akah_Tool.computeMonth(resp.name.split("_")[2]) <= akah_swbtomonth));
          // final_filterToYearFields  = filterToYearFields.filter(resp => (akah_Tool.computeMonth(resp.name.split("_")[2]) > akah_swbtomonth));
          // final_filterFromYearFields  = swbGeoResponse.fields.filter(resp => (akah_Tool.computeMonth(resp.name.split("_")[2]) > akah_swbfrommonth));
          // filtertoYearFields  = swbGeoResponse.fields.filter(resp => resp.name.includes(akah_swbtoyear));
          // filterFromYearFields.forEach(function(fname){
          //     if(akah_swbfrommonth >=akah_Tool.computeMonth(fname.name.split("_")[2])){
          //       final_filterFromYearFields.push(fname.name);
          //     }
          // })
          filterFromYearFields.forEach(function(item){
            a=item.name.replace(item.name.split("_")[2], akah_Tool.computeMonth(item.name.split("_")[2]));
            final_filterFromYearFields.push(a);
          })
          filterToYearFields.forEach(function(item){
            a=item.name.replace(item.name.split("_")[2], akah_Tool.computeMonth(item.name.split("_")[2]));
            final_filterToYearFields.push(a);
          })
          filterMiddleYearFields.forEach(function(item){
            a=item.name.replace(item.name.split("_")[2], akah_Tool.computeMonth(item.name.split("_")[2]));
            final_filterMiddleYearFields.push(a);
          })
          const alphaNumericSort1 = (final_filterFromYearFields = []) => {
            const sorter = (a, b) => {
              const isNumber = (v) => (+v).toString() === v;
              const aPart = a.match(/\d+|\D+/g);
              const bPart = b.match(/\d+|\D+/g);
              let i = 0; let len = Math.min(aPart.length, bPart.length);
              while (i < len && aPart[i] === bPart[i]) { i++; };
                  if (i === len) {return aPart.length - bPart.length;};
              if (isNumber(aPart[i]) && isNumber(bPart[i])) {return aPart[i] - bPart[i];};
              return aPart[i].localeCompare(bPart[i]);};
              final_filterFromYearFields.sort(sorter);
            };
          alphaNumericSort1(final_filterFromYearFields);
            const alphaNumericSort2 = (final_filterToYearFields = []) => {
              const sorter = (a, b) => {
                const isNumber = (v) => (+v).toString() === v;
                const aPart = a.match(/\d+|\D+/g);
                const bPart = b.match(/\d+|\D+/g);
                let i = 0; let len = Math.min(aPart.length, bPart.length);
                while (i < len && aPart[i] === bPart[i]) { i++; };
                    if (i === len) {return aPart.length - bPart.length;};
                if (isNumber(aPart[i]) && isNumber(bPart[i])) {return aPart[i] - bPart[i];};
                return aPart[i].localeCompare(bPart[i]);};
                final_filterToYearFields.sort(sorter);
              };
          alphaNumericSort2(final_filterToYearFields);
          const alphaNumericSort3 = (final_filterMiddleYearFields = []) => {
            const sorter = (a, b) => {
              const isNumber = (v) => (+v).toString() === v;
              const aPart = a.match(/\d+|\D+/g);
              const bPart = b.match(/\d+|\D+/g);
              let i = 0; let len = Math.min(aPart.length, bPart.length);
              while (i < len && aPart[i] === bPart[i]) { i++; };
                  if (i === len) {return aPart.length - bPart.length;};
              if (isNumber(aPart[i]) && isNumber(bPart[i])) {return aPart[i] - bPart[i];};
              return aPart[i].localeCompare(bPart[i]);};
              final_filterMiddleYearFields.sort(sorter);
            };
        alphaNumericSort3(final_filterMiddleYearFields);
          ind1 = 1;ind2= 1;ind3=1;ind4=1;
          final_filterFromYearFields.concat(final_filterMiddleYearFields).concat(final_filterToYearFields).forEach(function(evt, index){
            // var fieldname = evt.name;
            // var fieldname = evt;
            // month = month.charAt(0).toUpperCase() + month.slice(1)
            fieldname=evt.replace(evt.split("_")[2], (akah_Tool.month_function(Number(evt.split("_")[2])).charAt(0).toLowerCase() +  akah_Tool.month_function(Number(evt.split("_")[2])).slice(1)));
            if (fieldname.includes("cdom_mean")||fieldname.includes("grvi_mean")||fieldname.includes("ec_mean")||fieldname.includes("di_mean")){
              if(fieldname.includes("cdom_mean") && swb_resp.attributes[fieldname] != null)
              {cdom_array.push(swb_resp.attributes[fieldname]);
                cdom_reglineInpArray.push(ind1+1);
              cdomdataLabels.push({text:fieldname.split("_")[2] +"_"+ fieldname.split("_")[3], value: ind1});
            ind1++;
              }
              else if(fieldname.includes("grvi_mean") && swb_resp.attributes[fieldname] != null)
              {grvi_array.push(swb_resp.attributes[fieldname]);
                grvi_reglineInpArray.push(ind2+1);
              grvidataLabels.push({text:fieldname.split("_")[2] +"_"+ fieldname.split("_")[3], value: ind2});ind2++;
              }
              else if(fieldname.includes("ec_mean") && swb_resp.attributes[fieldname] != null)
              {ec_array.push(swb_resp.attributes[fieldname]);
                ec_reglineInpArray.push(ind3+1);
              ecdataLabels.push({text:fieldname.split("_")[2] +"_"+ fieldname.split("_")[3], value: ind3});
              ind3++;
              }
              else if(fieldname.includes("di_mean") && swb_resp.attributes[fieldname] != null)
              {di_array.push(swb_resp.attributes[fieldname]);
                di_reglineInpArray.push(ind4+1);
                didataLabels.push({text:fieldname.split("_")[2] +"_"+ fieldname.split("_")[3], value: ind4});
                ind4++;
              }
            }
          });
          if(dijit.byId("ecCheckBox_swb").checked){
            if(ec_array.length >0){
            dojo.query('#ecLineCharts_info').style('display', 'block');
            dojo.setAttr('ecLineCharts_info', 'innerHTML', '')
            var ecchart = new Chart("ecLineCharts_info");
            // ecchart.setTheme(green);
            ecchart.addPlot("default", {type: LinesPlot,markers: true,tension: "S",marker: "m-3,0 c0,-4 6,-4 6,0 m-6,0 c0,4 6,4 6,0" });
            ecchart.addAxis("x", { includeZero: false, fixLower: "major", fixUpper: "major", natural: false, vertical: false, rotation: 90, title: "Date", titleFontColor: "black",
            labels: ecdataLabels, titleOrientation: "away", majorLabels: true,majorTicks:true,majorTickStep:1,minorTicks:false});
            ecchart.addAxis("y", { min : 0, max:1,vertical: true, fixLower: "minor", fixUpper: "minor", title: "WQ_EC", titleFontColor: "black",minorTicks:true});
            new Tooltip(ecchart, "default", {
                text: function(o){
                   return "Element at index: "+o.index;
                }
             });
               var zoom_pan = new MouseZoomAndPan(ecchart, "default", {axis: "x"});
                var mag = new Magnify(ecchart,"default");
                  var tip = new Tooltip(ecchart,"default", {
                                 text: function(o){return "<b>"+ecdataLabels[o.x-1].text + "</b> : "+ (o.y).toFixed(6);}
                          });
                           //code for plotting regression line/ trendline for ndwi_report for selected location
                           var array_xy_ec = [];       // creating x * y array
                           var array_xx_ec = [];
                           for(var i = 0; i<ec_array.length; i++){
                             array_xy_ec.push(ec_array[i] * ec_reglineInpArray[i]);
                             array_xx_ec.push(ec_reglineInpArray[i] * ec_reglineInpArray[i]);
                           }
                           m =  (((dojox.math.stats.mean(ec_reglineInpArray) * dojox.math.stats.mean(ec_array)) - dojox.math.stats.mean(array_xy_ec)) /
                             ((dojox.math.stats.mean(ec_reglineInpArray) * dojox.math.stats.mean(ec_reglineInpArray)) - dojox.math.stats.mean(array_xx_ec)));
                           b=(dojox.math.stats.mean(ec_array) - dojox.math.stats.mean(ec_reglineInpArray)*m);

                           window.reg_line_ec = [];
                           for(var x = 0; x<ec_reglineInpArray.length; x++){
                           reg_line_ec.push((m*ec_reglineInpArray[x]) + b);
                           }
                          ecchart.addSeries("ec",ec_array ,{plot: "default", stroke: {color:"#335A8D", width:2.5}}); //min:
                          ecchart.addSeries("Trend", reg_line_ec,{plot: "Trend", stroke: {color:"#784B4B", width:2.5}}); //min:
                          ecchart.title = "EC"
                          ecchart.titleFont= "bold 12pt Avenir Light"
                          ecchart.titlePos = "top"
                          ecchart.titleGap = 10
                          ecchart.render();
                          ecchart.resize(450,230);
                          window.ecchart = ecchart
                          domAttr.set("ec_legend","innerHTML",'<table style="line-height: 2em;padding-top: 40%;padding-left:5%;">'+
                          '<tr><td><span style="padding: 0px 8px 0px 6px;color:#335A8D;background-color:#335A8D;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">EC</td></tr><tr><td><span style="padding: 0px 8px 0px 6px;color:#784B4B;background-color:#784B4B;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Trendline</td></tr></table>')
                          // dojo.query("#ndvi_checkboxtable").style("display","block");
                          dojo.query('#ec_legend').style('display','block')
                        }
                        else{
                          document.getElementById("ecLineCharts_info").style.height = "0px"
                          dojo.setAttr('ecLineCharts_info', 'innerHTML', '<p style="letter-spacing:0.5px;color: darkorange;font-size: 13px;line-height:2em;"><b>Note:</b>Data not available for EC</p>')
                          dojo.query('#ecLineCharts_info').style('display', 'block');
                          dojo.query('#ec_legend').style('display','none')
                          }
          }
          else{
            dojo.query('#ecLineCharts_info').style('display', 'none');
            dojo.query('#ec_legend').style('display','none')
          }
          if(dijit.byId("cdomCheckBox_swb").checked){
                  if(cdom_array.length > 0){
            dojo.query('#cdomLineCharts_info').style('display', 'block');
            dojo.setAttr('cdomLineCharts_info', 'innerHTML', '')
            var cdomchart = new Chart("cdomLineCharts_info");
            // cdomchart.setTheme(green);
            cdomchart.addPlot("default", {type: LinesPlot,markers: true,tension: "S",marker: "m-3,0 c0,-4 6,-4 6,0 m-6,0 c0,4 6,4 6,0" });
            cdomchart.addAxis("x", { includeZero: false, fixLower: "major", fixUpper: "major", natural: false, vertical: false, rotation: 90, title: "Date", titleFontColor: "black",
            labels: cdomdataLabels, titleOrientation: "away", majorLabels: true,majorTicks:true,majorTickStep:1,minorTicks:false});
            cdomchart.addAxis("y", { min : 0, max:1,vertical: true, fixLower: "minor", fixUpper: "minor", title: "WQ_CDOM", titleFontColor: "black",minorTicks:true});
            new Tooltip(cdomchart, "default", {
                text: function(o){
                   return "Element at index: "+o.index;
                }
             });
               var zoom_pan = new MouseZoomAndPan(cdomchart, "default", {axis: "x"});
                var mag = new Magnify(cdomchart,"default");
                  var tip = new Tooltip(cdomchart,"default", {
                                 text: function(o){return "<b>"+cdomdataLabels[o.x-1].text + "</b> : "+ (o.y).toFixed(6);}
                          });
                           //code for plotting regression line/ trendline for ndwi_report for selected location
                           var array_xy_cdom = [];       // creating x * y array
                           var array_xx_cdom = [];
                           for(var i = 0; i<cdom_array.length; i++){
                             array_xy_cdom.push(cdom_array[i] * cdom_reglineInpArray[i]);
                             array_xx_cdom.push(cdom_reglineInpArray[i] * cdom_reglineInpArray[i]);
                           }
                           m =  (((dojox.math.stats.mean(cdom_reglineInpArray) * dojox.math.stats.mean(cdom_array)) - dojox.math.stats.mean(array_xy_cdom)) /
                             ((dojox.math.stats.mean(cdom_reglineInpArray) * dojox.math.stats.mean(cdom_reglineInpArray)) - dojox.math.stats.mean(array_xx_cdom)));
                           b=(dojox.math.stats.mean(cdom_array) - dojox.math.stats.mean(cdom_reglineInpArray)*m);

                           window.reg_line_cdom = [];
                           for(var x = 0; x<cdom_reglineInpArray.length; x++){
                           reg_line_cdom.push((m*cdom_reglineInpArray[x]) + b);
                           }
                          cdomchart.addSeries("CDOM",cdom_array ,{plot: "default", stroke: {color:"#335A8D", width:2.5}}); //min:
                          cdomchart.addSeries("Trend", reg_line_cdom,{plot: "Trend", stroke: {color:"#784B4B", width:2.5}}); //min:
                          cdomchart.title = "CDOM"
                          cdomchart.titleFont= "bold 12pt Avenir Light"
                          cdomchart.titlePos = "top"
                          cdomchart.titleGap = 10
                          cdomchart.render();
                          cdomchart.resize(450,230);
                          window.cdomchart = cdomchart
                          domAttr.set("cdom_legend","innerHTML",'<table style="line-height: 2em;padding-top: 40%;padding-left:5%;">'+
                          '<tr><td><span style="padding: 0px 8px 0px 6px;color:#335A8D;background-color:#335A8D;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">CDOM</td></tr><tr><td><span style="padding: 0px 8px 0px 6px;color:#784B4B;background-color:#784B4B;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Trendline</td></tr></table>')
                          // dojo.query("#ndvi_checkboxtable").style("display","block");
                          dojo.query('#cdom_legend').style('display','block')

                  }
                  else{
                  document.getElementById("cdomLineCharts_info").style.height = "0px"
                  dojo.setAttr('cdomLineCharts_info', 'innerHTML', '<p style="letter-spacing:0.5px;color: darkorange;font-size: 13px;line-height:2em;"><b>Note:</b>Data not available for CDOM</p>')
                  dojo.query('#cdomLineCharts_info').style('display', 'block');
                  dojo.query('#cdom_legend').style('display','none')
                  }
          }
          else{
            dojo.query('#cdomLineCharts_info').style('display', 'none');
            dojo.query('#cdom_legend').style('display','none')

          }
          if(dijit.byId("grviCheckBox_swb").checked){
            if(grvi_array.length >0){
            dojo.query('#grviLineCharts_info').style('display', 'block');
            dojo.setAttr('grviLineCharts_info', 'innerHTML', '')
            var grvichart = new Chart("grviLineCharts_info");
            // grvichart.setTheme(green);
            grvichart.addPlot("default", {type: LinesPlot,markers: true,tension: "S",marker: "m-3,0 c0,-4 6,-4 6,0 m-6,0 c0,4 6,4 6,0" });
            grvichart.addAxis("x", { includeZero: false, fixLower: "major", fixUpper: "major", natural: false, vertical: false, rotation: 90, title: "Date", titleFontColor: "black",
            labels: grvidataLabels, titleOrientation: "away", majorLabels: true,majorTicks:true,majorTickStep:1,minorTicks:false});
            grvichart.addAxis("y", { min : 0, max:1,vertical: true, fixLower: "minor", fixUpper: "minor", title: "WQ_GRVI", titleFontColor: "black",minorTicks:true});
            new Tooltip(grvichart, "default", {
                text: function(o){
                   return "Element at index: "+o.index;
                }
             });
               var zoom_pan = new MouseZoomAndPan(grvichart, "default", {axis: "x"});
                var mag = new Magnify(grvichart,"default");
                  var tip = new Tooltip(grvichart,"default", {
                                 text: function(o){return "<b>"+grvidataLabels[o.x-1].text + "</b> : "+ (o.y).toFixed(6);}
                          });
                           //code for plotting regression line/ trendline for ndwi_report for selected location
                           var array_xy_grvi = [];       // creating x * y array
                           var array_xx_grvi = [];
                           for(var i = 0; i<grvi_array.length; i++){
                             array_xy_grvi.push(grvi_array[i] * grvi_reglineInpArray[i]);
                             array_xx_grvi.push(grvi_reglineInpArray[i] * grvi_reglineInpArray[i]);
                           }
                           m =  (((dojox.math.stats.mean(grvi_reglineInpArray) * dojox.math.stats.mean(grvi_array)) - dojox.math.stats.mean(array_xy_grvi)) /
                             ((dojox.math.stats.mean(grvi_reglineInpArray) * dojox.math.stats.mean(grvi_reglineInpArray)) - dojox.math.stats.mean(array_xx_grvi)));
                           b=(dojox.math.stats.mean(grvi_array) - dojox.math.stats.mean(grvi_reglineInpArray)*m);

                           window.reg_line_grvi = [];
                           for(var x = 0; x<grvi_reglineInpArray.length; x++){
                           reg_line_grvi.push((m*grvi_reglineInpArray[x]) + b);
                           }
                          grvichart.addSeries("grvi",grvi_array ,{plot: "default", stroke: {color:"#335A8D", width:2.5}}); //min:
                          grvichart.addSeries("Trend", reg_line_grvi,{plot: "Trend", stroke: {color:"#784B4B", width:2.5}}); //min:
                          grvichart.title = "GRVI"
                          grvichart.titleFont= "bold 12pt Avenir Light"
                          grvichart.titlePos = "top"
                          grvichart.titleGap = 10
                          grvichart.render();
                          grvichart.resize(450,230);
                          window.grvichart = grvichart
                          domAttr.set("grvi_legend","innerHTML",'<table style="line-height: 2em;padding-top: 40%;padding-left:5%;">'+
                          '<tr><td><span style="padding: 0px 8px 0px 6px;color:#335A8D;background-color:#335A8D;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">GRVI</td></tr><tr><td><span style="padding: 0px 8px 0px 6px;color:#784B4B;background-color:#784B4B;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">TrendLine</td></tr></table>')
                          // dojo.query("#ndvi_checkboxtable").style("display","block");
                          dojo.query('#grvi_legend').style('display','block')
                        }
                        else{
                          document.getElementById("grviLineCharts_info").style.height = "0px"
                          dojo.setAttr('grviLineCharts_info', 'innerHTML', '<p style="letter-spacing:0.5px;color: darkorange;font-size: 13px;line-height:2em;"><b>Note:</b>Data not available for GRVI</p>')
                          dojo.query('#grviLineCharts_info').style('display', 'block');
                          dojo.query('#grvi_legend').style('display','none')
                          }
          }
          else{
            dojo.query('#grviLineCharts_info').style('display', 'none');
            dojo.query('#grvi_legend').style('display','none')

          }
          if(dijit.byId("diCheckBox_swb").checked){
            if(di_array.length >0){
            dojo.query('#diLineCharts_info').style('display', 'block');
            dojo.setAttr('diLineCharts_info', 'innerHTML', '')
            var dichart = new Chart("diLineCharts_info");
            // dichart.setTheme(green);
            dichart.addPlot("default", {type: LinesPlot,markers: true,tension: "S",marker: "m-3,0 c0,-4 6,-4 6,0 m-6,0 c0,4 6,4 6,0" });
            dichart.addAxis("x", { includeZero: false, fixLower: "major", fixUpper: "major", natural: false, vertical: false, rotation: 90, title: "Date", titleFontColor: "black",
            labels: didataLabels, titleOrientation: "away", majorLabels: true,majorTicks:true,majorTickStep:1,minorTicks:false});
            dichart.addAxis("y", { min : 0, max:1,vertical: true, fixLower: "minor", fixUpper: "minor", title: "WQ_DI", titleFontColor: "black",minorTicks:true});
            new Tooltip(dichart, "default", {
                text: function(o){
                   return "Element at index: "+o.index;
                }
             });
               var zoom_pan = new MouseZoomAndPan(dichart, "default", {axis: "x"});
                var mag = new Magnify(dichart,"default");
                  var tip = new Tooltip(dichart,"default", {
                                 text: function(o){return "<b>"+didataLabels[o.x-1].text + "</b> : "+ (o.y).toFixed(6);}
                          });
                           //code for plotting regression line/ trendline for ndwi_report for selected location
                           var array_xy_di = [];       // creating x * y array
                           var array_xx_di = [];
                           for(var i = 0; i<di_array.length; i++){
                             array_xy_di.push(di_array[i] * di_reglineInpArray[i]);
                             array_xx_di.push(di_reglineInpArray[i] * di_reglineInpArray[i]);
                           }
                           m =  (((dojox.math.stats.mean(di_reglineInpArray) * dojox.math.stats.mean(di_array)) - dojox.math.stats.mean(array_xy_di)) /
                             ((dojox.math.stats.mean(di_reglineInpArray) * dojox.math.stats.mean(di_reglineInpArray)) - dojox.math.stats.mean(array_xx_di)));
                           b=(dojox.math.stats.mean(di_array) - dojox.math.stats.mean(di_reglineInpArray)*m);

                           window.reg_line_di = [];
                           for(var x = 0; x<di_reglineInpArray.length; x++){
                           reg_line_di.push((m*di_reglineInpArray[x]) + b);
                           }
                          dichart.addSeries("di",di_array ,{plot: "default", stroke: {color:"#335A8D", width:2.5}}); //min:
                          dichart.addSeries("Trend", reg_line_di,{plot: "Trend", stroke: {color:"#784B4B", width:2.5}}); //min:
                          dichart.title = "DI"
                          dichart.titleFont= "bold 12pt Avenir Light"
                          dichart.titlePos = "top"
                          dichart.titleGap = 10
                          dichart.render();
                          dichart.resize(450,230);
                          window.dichart = dichart
                          domAttr.set("di_legend","innerHTML",'<table style="line-height: 2em;padding-top: 40%;padding-left:5%;">'+
                          '<tr><td><span style="padding: 0px 8px 0px 6px;color:#335A8D;background-color:#335A8D;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">DI</td></tr><tr><td><span style="padding: 0px 8px 0px 6px;color:#784B4B;background-color:#784B4B;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">TrendLine</td></tr></table>')
                          // dojo.query("#ndvi_checkboxtable").style("display","block");
                          dojo.query('#di_legend').style('display','block')
                        }
                        else{
                          document.getElementById("diLineCharts_info").style.height = "0px"
                          dojo.setAttr('diLineCharts_info', 'innerHTML', '<p style="letter-spacing:0.5px;color: darkorange;font-size: 13px;line-height:2em;"><b>Note:</b>Data not available for DI</p>')
                          dojo.query('#diLineCharts_info').style('display', 'block');
                          dojo.query('#di_legend').style('display','none')
                          }
          }
          else{
            dojo.query('#diLineCharts_info').style('display', 'none');
            dojo.query('#di_legend').style('display','none')

          }
        }
      }
      else if(dom.byId("Attri_DI_inp").checked == true){
           filterabdiFields=[];window.filterabdiFields = filterabdiFields;
           abdidataLabels=[];abdi_reglineInpArray=[];var abdi_array=[];window.abdi_array=abdi_array;
           swb_resp =  swbGeoResponse.features[0];ind5=1;
           if(akah_abswbfromyear === akah_abswbtoyear){
             filterabdiFields  = swbGeoResponse.fields.filter(resp => resp.name.split("_")[2].includes(akah_abswbtoyear));
           }
           else{
             filterabdiFields  = swbGeoResponse.fields.filter(resp => (resp.name.split("_")[2] >= Number(akah_abswbfromyear) && resp.name.split("_")[2] <= Number(akah_abswbtoyear)));
           }
           filterabdiFields.forEach(function(evt,index){
             if(evt.name.includes("phy_DI") && swb_resp.attributes[evt.name] != null)
                 {abdi_array.push(swb_resp.attributes[evt.name]);
                   abdi_reglineInpArray.push(ind5+1);
                   abdidataLabels.push({text:evt.name.split("_")[2], value: ind5});
                   ind5++;
                 }
           });
           if(akah_abswbfromyear !="Year" && akah_abswbtoyear!="Year"){
               if(abdi_array.length >0){
                     dojo.query('#attribasedDILineCharts_info').style('display', 'block');
                     dojo.setAttr('attribasedDILineCharts_info', 'innerHTML', '')
                     var abdichart = new Chart("attribasedDILineCharts_info");
                     // abdichart.setTheme(green);
                     abdichart.addPlot("default", {type: LinesPlot,markers: true,tension: "S",marker: "m-3,0 c0,-4 6,-4 6,0 m-6,0 c0,4 6,4 6,0" });
                     abdichart.addAxis("x", { includeZero: false, fixLower: "major", fixUpper: "major", natural: false, vertical: false, rotation: 90, title: "Date", titleFontColor: "black",
                     labels: abdidataLabels, titleOrientation: "away", majorLabels: true,majorTicks:true,majorTickStep:1,minorTicks:false});
                     abdichart.addAxis("y", { min: Math.min.apply(null, abdi_array)-0.5, max: Math.max.apply(null, abdi_array)+0.5, vertical: true, fixLower: "minor", fixUpper: "minor", title: "WQ_DI", titleFontColor: "black",minorTicks:true});
                     new Tooltip(abdichart, "default", {
                         text: function(o){
                           return "Element at index: "+o.index;
                         }
                     });
                     var zoom_pan = new MouseZoomAndPan(abdichart, "default", {axis: "x"});
                     var mag = new Magnify(abdichart,"default");
                     var tip = new Tooltip(abdichart,"default", {
                           text: function(o){return "<b>"+abdidataLabels[o.x-1].text + "</b> : "+ (o.y).toFixed(6);}
                     });
                     //code for plotting regression line/ trendline for ndwi_report for selected location
                     var array_xy_di = [];       // creating x * y array
                     var array_xx_di = [];
                     for(var i = 0; i<abdi_array.length; i++){
                       array_xy_di.push(abdi_array[i] * abdi_reglineInpArray[i]);
                       array_xx_di.push(abdi_reglineInpArray[i] * abdi_reglineInpArray[i]);
                     }
                     m =  (((dojox.math.stats.mean(abdi_reglineInpArray) * dojox.math.stats.mean(abdi_array)) - dojox.math.stats.mean(array_xy_di)) /
                       ((dojox.math.stats.mean(abdi_reglineInpArray) * dojox.math.stats.mean(abdi_reglineInpArray)) - dojox.math.stats.mean(array_xx_di)));
                     b=(dojox.math.stats.mean(abdi_array) - dojox.math.stats.mean(abdi_reglineInpArray)*m);

                     window.reg_line_abdi = [];
                     for(var x = 0; x<abdi_reglineInpArray.length; x++){
                     reg_line_abdi.push((m*abdi_reglineInpArray[x]) + b);
                     }
                     abdichart.addSeries("di",abdi_array ,{plot: "default", stroke: {color:"#335A8D", width:2.5}}); //min:
                     abdichart.addSeries("Trend", reg_line_abdi,{plot: "Trend", stroke: {color:"#784B4B", width:2.5}}); //min:
                     abdichart.title = "Attribute based Water Quality DI"
                     abdichart.titleFont= "bold 12pt Avenir Light"
                     abdichart.titlePos = "top"
                     abdichart.titleGap = 10
                     abdichart.render();
                     abdichart.resize(450,230);
                     window.abdichart = abdichart
                     domAttr.set("attribasedDI_legend","innerHTML",'<table style="line-height: 2em;padding-top: 40%;padding-left:5%;">'+
                     '<tr><td><span style="padding: 0px 8px 0px 6px;color:#335A8D;background-color:#335A8D;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">DI</td></tr><tr><td><span style="padding: 0px 8px 0px 6px;color:#784B4B;background-color:#784B4B;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">TrendLine</td></tr></table>')
                     // dojo.query("#ndvi_checkboxtable").style("display","block");
                     domAttr.set("phy_rec_potential_swb","innerHTML",'<p><b>Surface water body recovery potential : <b style="color:darkorange;">'+swbGeoResponse.features[0].attributes.phy_recovery_potential+'</b></b></p>')
                     // dojo.query("#ndvi_checkboxtable").style("display","block");
                     dojo.query('#attribasedDI_legend').style('display','block')
               }
               else{
                 document.getElementById("attribasedDILineCharts_info").style.height = "0px"
                 dojo.setAttr('attribasedDILineCharts_info', 'innerHTML', '<p style="letter-spacing:0.5px;color: darkorange;font-size: 13px;line-height:2em;"><b>Note:</b>Data not available for DI</p>')
                 dojo.query('#attribasedDILineCharts_info').style('display', 'block');
                 dojo.query('#attribasedDI_legend').style('display','none')
               }
           }
      }
    },

    computeMonth: function(month){
      var monthNum = "";
      month = month.charAt(0).toUpperCase() + month.slice(1)
          switch(month){
            case "Jan":  monthNum = 1;break;
            case "Feb":  monthNum = 2;break;
            case "Mar":  monthNum = 3;break;
            case "Apr":  monthNum = 4;break;
            case "May":  monthNum = 5;break;
            case "June":  monthNum = 6;break;
            case "July":  monthNum = 7;break;
            case "Aug":  monthNum = 8;break;
            case "Sep":  monthNum = 9;break;
            case "Oct":  monthNum = 10;break;
            case "Nov":  monthNum = 11;break;
            case "Dec":  monthNum = 12;break;
            default: console.log("no valid input");
          }
          return monthNum
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
                 symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NULL, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,0,0]), 2));
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
              vill_valakah.attr('value', akah_searchResponse.attributes.village);
              akah_Tool.getSearchResponseOnDraw("from draw",queryChart);
              // swbGeometryQuery.geometry = akahDraw_Evt.geometry
            akah_Tool.gotoFilterSurfWatBodies();
            });
            akah_Tool.doSWBQuery(swbGeometryQuery);
        });
    },

    getSearchResponseOnDraw: function(param, queryChart){
        dojo.query('#akahLocation_info').style('display','block')
        /*status bar value update*/
        document.getElementsByClassName('bar_akah-inner')[0].dataset.percent = "75%"
        document.getElementsByClassName('bar_akah-inner')[0].style.width = "75%"
        /*status bar value update*/
        if(param == "from draw"){
              // domAttr.set('akahLocation_info','innerHTML',"<span><span class='akahHeadings'>State: </span><span class='akahNames'>"+stateName+"</span></span>&nbsp;&nbsp;<span><span class='akahHeadings'>District: </span><span class='akahNames'>"+districtName+"</span></span>&nbsp;&nbsp;"+
              // "<span><span class='akahHeadings'>Block: </span><span class='akahNames'>"+blockName+"</span></span>&nbsp;&nbsp;<br><span><span class='akahHeadings'>Village: </span><span class='akahNames'>"+villageName+"</span>");
              domAttr.set("tab3_village","innerHTML",villageName);

            }
        else{
              // domAttr.set('akahLocation_info','innerHTML',"<span><span class='akahHeadings'>State: </span><span class='akahNames'>"+akahstate+"</span></span>&nbsp;&nbsp;<span><span class='akahHeadings'>District: </span><span class='akahNames'>"+akahdistrict+"</span></span>&nbsp;&nbsp;"+
              // "<span><span class='akahHeadings'>Block: </span><span class='akahNames'>"+akahblock+"</span></span>&nbsp;&nbsp;<br><span><span class='akahHeadings'>Village: </span><span class='akahNames'>"+akahvillage+"</span>");
              domAttr.set("tab3_village","innerHTML",akahvillage);

              // if(akah_searchResponse == null || akah_searchResponse == undefined)
            // {
            //     new QueryTask(akah_villages_layer.url).execute(queryChart, function(akah_villageResponse){
            //       akah_searchResponse = akah_villageResponse.features[0];
            //       window.akah_searchResponse = akah_searchResponse;
            //     });
            // }
          }
          akah_Tool.getRainfallDataByCategory();
        if ((akah_Tool.akah_selYear != "Select" && akah_Tool.akah_selMonsoon != "select")) {
          akah_Tool.akah_chartGenerte()
        }
         else{
          domAttr.set("akahLulc_Chart","innerHTML","");
          domAttr.set("lulc_legend","innerHTML","");
          // domAttr.set("ndvi_legend","innerHTML","");
          // domAttr.set("akahNdvi_Chart","innerHTML","");
        }
        if(akah_ndwifrommonth != "0" && akah_ndwifromyear !="Year" && akah_ndwitoyear !="Year" && akah_ndwitomonth != "0"){
          akah_Tool.akah_chartGenerateNDWI("all");
        }
        if(akah_ndvifrommonth != "0" && akah_ndvifromyear !="Year" && akah_ndvitoyear !="Year" && akah_ndvitomonth != "0"){
          akah_Tool.akah_chartGenerateNDVI("all");
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
          var rain_from=2011
          var rain_to=2020
          domAttr.set('rainfall_graph', 'innerHTML', '')
          domAttr.set('gwr_graph1', 'innerHTML', '')
          domAttr.set('gwr_graph2', 'innerHTML', '')

          rain_chart = new Chart("rainfall_graph");
          window.rain_chart=rain_chart
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
          rain_chart.addAxis("x", { includeZero:false, fixLower: "major", fixUpper: "major", natural: false, font: "normal normal normal 12px Arial", fontColor: "black", vertical: false, title: "Year", titleFontColor: "black", labels: rain_months, rotation: 90, titleOrientation: "away", majorLabels: true,minorTicks:false,majorTicks:true,majorTickStep:1});
          rain_chart.addAxis("y", { min: 0, max: max_value, vertical: true, fixLower: "minor", font: "normal normal normal 7pt Arial", fontColor: "black", fixUpper: "minor", title: "Rainfall (mm)", titleFontColor: "black",minorTicks:false});
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
           rain_chart.title = "Annual Rainfall Graph ("+rain_from+" to "+rain_to+") for "+akahdistrict 
           rain_chart.titleFont= "bold 12pt Arial"
           rain_chart.titlePos = "top"
           rain_chart.titleGap = 10
           rain_chart.render();

          dojo.query('#rainfall_legend').style('display','block');
          window.rain_chart=rain_chart;
          rain_chart.resize(520, 270)
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
          bar_chart_2.addPlot("default", { type: "Columns", gap: 65, width: 20, animate: { duration: 2000, easing: dojo.fx.easing.bounceInOut } });  // Add the only/default plot
          window.bar_chart_2 = bar_chart_2;

          // var gwr_res = Number(akahRainfallResponse.attributes[`res`].toFixed(2));
          // var gwr_total = Number(akahRainfallResponse.attributes[`total`].toFixed(2));
          // var gwr_draftIrr = Number(akahRainfallResponse.attributes[`draft_irrg`].toFixed(2));
          // var gwr_resDom =Number(akahRainfallResponse.attributes[`res_dom`].toFixed(2));
          // var irrig_draf_2013 = Number(akahRainfallResponse.attributes[`gw_alloc`].toFixed(2));
          // var draft_irrg_2017 = Number(akahRainfallResponse.attributes[`proj_dem`].toFixed(2));
          akahRainfallResponse.attributes[`net_gw_availability_future`]!=null? irrig_draf_2013 = Number(akahRainfallResponse.attributes[`net_gw_availability_future`].toFixed(2)) : irrig_draf_2013 = "";
          akahRainfallResponse.attributes[`gw_allocation_domestic_2025`]!=null? draft_irrg_2017 = Number(akahRainfallResponse.attributes[`gw_allocation_domestic_2025`].toFixed(2)) : draft_irrg_2017 = "";


          //FIRST BAR-CHART-(1- NET GROUND WATER AVAILABILITY; 2-PROJECTED DEMAND)
          // var barChartData = [gwr_res, gwr_total, gwr_draftIrr, gwr_resDom];
          // var chartData_1 = [{ y: gwr_res,fill: "blue", tooltip:gwr_res },{ y: gwr_total, fill: "blue", tooltip: gwr_total },{ y: gwr_draftIrr,fill: "orange", tooltip:gwr_draftIrr },{ y:gwr_resDom ,fill: "orange", tooltip:gwr_resDom }];
          // bar_Chart_1.addAxis("x", { fixLower: "minor", fixUpper: "minor", natural: true, vertical: false, title: "", titleFontColor: "black", titleOrientation: "away", labels: [{value: 1,text: 'Net GW Availability', fill:"blue"}, {value: 2,text:'Total GW Extraction', fill:"blue"}, {value: 3, text: 'Irrigation Draft', fill:"orange"}, {value: 4,text:"Domestic Draft", fill:"orange"}] });
          // bar_Chart_1.addAxis("y", {  min: Math.min.apply(null, barChartData), max: Math.max.apply(null, barChartData), vertical: true, fixLower: "major", fixUpper: "major", includeZero: true, title: "ha m", titleFontColor: "black" });
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
          window.barChartData1=barChartData1;
          var chartData_2 = [{ y: irrig_draf_2013,fill: "green", tooltip: 'Net GW Availability (2025): <b>'+irrig_draf_2013+' ha m</b>' },{ y: draft_irrg_2017 ,fill: "blue", tooltip:'Domestic Future Draft: <b>'+draft_irrg_2017+' ha m</b>' }];
          bar_chart_2.addAxis("x", { fixLower: "minor", fixUpper: "minor", natural: true, vertical: false, font: "normal normal bold 12px Arial", fontColor: "black", title: "", titleFontColor: "black", titleOrientation: "away", labels: [{value: 1, text:'Net GW Availability (2025)', fill:"blue"}, {value: 2, text:'Domestic Future Draft', fill:"blue"}] });
          bar_chart_2.addAxis("y", { min: Math.min.apply(null, barChartData1), max: Math.max.apply(null, barChartData1),vertical: true, font: "normal normal normal 12px Arial", fontColor: "black", fixLower: "major", fixUpper: "major", includeZero: true, title: "Volume (ha m)", titleFontColor: "black" });
          bar_chart_2.addSeries("Series A", chartData_2); //Adds Displacement Data to chart
          new Highlight(bar_chart_2, "default");
          new Tooltip(bar_chart_2, "default");
          bar_chart_2.title = "Projected Groundwater Resources (year 2025)"
          bar_chart_2.titleFont= "bold 12pt Arial"
          bar_chart_2.titlePos = "top"
          bar_chart_2.titleGap = 10
          bar_chart_2.render();
          // bar_chart_2.resize(560,230)
          // dojo.query('#gwr_graph2_legend').style('display','block');


          domAttr.set("gwr_graph2_report","innerHTML","");
          dojo.query("gwr_graph2_module").style("display","block");

          var bar_chart_2_report = new dojox.charting.Chart2D("gwr_graph2_report");//Creates an object for displacement chart
          bar_chart_2_report.addPlot("default", { type: "Columns", gap:10, width: 10});  // Add the only/default plot
          window.bar_chart_2_report = bar_chart_2_report;
          bar_chart_2_report.addAxis("x", {  natural: true, vertical: false, font: "normal normal bold 12px Arial", fontColor: "black", title: "", titleFontColor: "black", titleOrientation: "away", labels: [{value: 1, text:['Net GW Availability'], fill:"blue"}, {value: 2, text:['Future Draft'], fill:"blue"}] });
          bar_chart_2_report.addAxis("y", { min: Math.min.apply(null, barChartData1), max: Math.max.apply(null, barChartData1),vertical: true, font: "normal normal normal 12px Arial", fontColor: "black", enableCache: true,fixLower: "minor", fixUpper: "minor", includeZero: true, title: "Volume (ha m)", titleFontColor: "black" });
          bar_chart_2_report.addSeries("Series A", chartData_2);
          // bar_chart_2_report.title = "Projected Ground Water Resources (year 2025)"
          // bar_chart_2_report.titleFont= "bold 12pt Arial"
          // bar_chart_2_report.titlePos = "top"
          // bar_chart_2_report.titleGap = 10
          bar_chart_2_report.render();
          // bar_chart_2_report.resize(540,230);


          // dojo.query("gwr_graph2_module").style("display","none");

          if(irrig_draf_2013 != "" && draft_irrg_2017 != ""){
            bar_chart_2.render();
            bar_chart_2.resize(540,230)
            dojo.query('#gwr_graph2_legend').style('display','block');
          }
         else{
          // dojo.query('#nodataalert').style('display','block');
          //  domAttr.set("nodataalert","innerHTML","<p>No data available!!</p>")
          domAttr.set('gwr_graph2', 'innerHTML', "<p style='font-size:12pt;font-weight:bold;margin-top:10px;'>Note : No data available for Projected Groundwater Resources (year 2025)</p>");
         }

          // Stacked chart Plotting modified from here....
          domAttr.set('barAndStackedBarChartDiv', 'innerHTML', '')
          var c = new dojox.charting.Chart2D("barAndStackedBarChartDiv");
          c.addPlot("stackedColumnsPlot", {type: StackedColumns,gap:40,lines: true,areas: true,markers: true,tension: "2",animate: { duration: 2000, easing: dojo.fx.easing.bounceInOut }});
          c.addAxis("x", {dropLabels: false,labelSizeChange: true,majorTicks:true,majorTickStep:1,minorTicks:false,font: "normal normal bold 12px Arial", fontColor: "black",
            labels: [{"value":1,"text":"Net GW Availability"},{"value":2,"text":"Net Draft"},{"value":3,"text":"GW for future Use"}]});
          c.addAxis("y", {title:"Volume (ha m)",fixLower: "major",fixUpper: "major", includeZero: true,majorTickStep:2500,minorTickStep:500,max: 15000,vertical: true});
          c.addSeries("Net GW Availability",[akahRainfallResponse.attributes['net_total_recharge'], null, null], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF",},fill: "#021C51"});
          c.addSeries("Irrigation Draft", [null, akahRainfallResponse.attributes['irrigation_draft'], null], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF"},fill: "#00833f"});
          c.addSeries("Domestic Draft", [null, akahRainfallResponse.attributes['industrial_domestic_draft'], null], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF"},fill: "maroon"});
          c.addSeries("GW for future Use", [null, null, akahRainfallResponse.attributes['net_total_recharge'] - akahRainfallResponse.attributes['total_draft']], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF"},fill: "rgb(251, 208, 10)"});
          new Tooltip(c, "stackedColumnsPlot",{
              text: function (chartItem) {
                  console.debug(chartItem);
                  return chartItem.run.name +": <b>"+ chartItem.run.data[chartItem.index]+" ha m</b>";
              }
          });
        stackedChart= c;
        window.stackedChart=stackedChart;
          // Stacked chart Plotting modified till here....
          c.title = "Estimated Ground Water Resources (Baseline Year - 2017)"
          c.titleFont= "bold 12pt Arial"
          c.titlePos = "top"
          c.titleGap = 10
          c.render();
          c.resize(540,230);
          dojo.query('#barAndStackedBarChartDivlegend').style('display','block');
        }
      }
    },
    validateRainfallDates: function(){
      if(dijit.byId("drf_inp").checked == true){
        if(   akah_rftoyear=="Year" || akah_rffromyear == "Year" || akah_rffrommonth == "0" || akah_rftomonth == "0" ||  (Number(akah_rftoyear) < Number(akah_rffromyear) )|| ((Number(akah_rftoyear) == Number(akah_rffromyear)) && (Number(akah_rffrommonth) > Number(akah_rftomonth))) || ((Number(akah_rffrommonth) == Number(akah_rftomonth)) && (Number(akah_rffromyear) > Number(akah_rftoyear))) || ((Number(akah_rffrommonth) === Number(akah_rftomonth)) && (Number(akah_rffromyear) === Number(akah_rftoyear)))){
          domAttr.set("yearrangewarning_rf","innerHTML",'<p style="letter-spacing:0.5px;color: darkorange;font-size: 13px;line-height:2em;"><b>Note:</b>Please enter valid input.From year&month should be less than To year&month</p>')
          return false;
         }
        else{
          akah_Tool.getRainfallDataByCategory();
        }
      }
      if(dijit.byId("wrf_inp").checked == true){
        if(akah_rftoyear=="Year" || akah_rffromyear == "Year" ||  (Number(akah_rftoyear) < Number(akah_rffromyear))){
          domAttr.set("yearrangewarning_rf","innerHTML",'<p style="letter-spacing:0.5px;color: darkorange;font-size: 13px;line-height:2em;"><b>Note:</b>Please enter valid input.From year should be less than To year</p>')
          return false;
        }
        else{
          akah_Tool.getRainfallDataByCategory();
        }
      }
    },
    getRainfallDataByCategory: function(){
      var Todate = "1,1,1";
      window.Todate=Todate;
      dojo.query("#rfMonthlyChartLegend").style("display","none")
      domAttr.set("distVilltoRF","innerHTML",'');
      on(document.getElementById("toggleIndicatorRF"), 'change',function(evt){
        if(evt.srcElement.checked == true){
          akah_Tool.addIndicatorRF();
        }
        else{
          akah_Tool.getRainfallDataByCategory();
        }
      });
      if(dijit.byId("yrf_inp").checked === true){selectedRFCat = "yearly"}
      else if(dijit.byId("mrf_inp").checked === true){selectedRFCat = "monthly"}
      else if(dijit.byId("wrf_inp").checked === true){selectedRFCat = "weekly";
      }
      else if(dijit.byId("drf_inp").checked === true){selectedRFCat = "daily"}
      window.selectedRFCat=selectedRFCat;
            //Querying  rainfall location layer to get daily rainfall data 
            if(document.getElementById("toggleIndicatorRF").checked == false){
                  dojo.query('#rfMonthlyChartModule').style('display', 'block');
                  dojo.query('#rfMonthlyChartModuleWithInd').style('display', 'none');
                  domAttr.set("rfMonthlyChart","innerHTML",'<img src="'+image_path+'" class="load_image" alt="Loading.." style="margin-left:35%;width:100px;">');
             } 
             else{
              dojo.query('#rfMonthlyChartModuleWithInd').style('display', 'block');
              dojo.query('#rfMonthlyChartModule').style('display', 'none');
              domAttr.set("rfMonthlyChartWithInd","innerHTML",'<img src="'+image_path+'" class="load_image" alt="Loading.." style="margin-left:35%;width:100px;">');
            } 
            var query_rfStations = new Query()
            query_rfStations.where = "1=1"
            query_rfStations.outFields = ["*"]
            query_rfStations.returnGeometry = true
            // query_rfStations.geometry = villageBuffer[0];
            window.query_rfStations=query_rfStations;
            window.getrfresp = new QueryTask(rainfallStations_layer.url).execute(query_rfStations, function retrieve(rfStationsResponse){
            window.rfStationsResponse=rfStationsResponse;
            if(rfStationsResponse.features.length > 0){
                      minDistance = esri.geometry.getLength(rfStationsResponse.features[0].geometry, villGeometry);
                      nearestRainfall = rfStationsResponse.features[0];
                      window.nearestRainfall=nearestRainfall;
                      rfStationsResponse.features.forEach(element => {
                        a = esri.geometry.getLength(element.geometry, villGeometry)
                        if(a <  minDistance){
                            minDistance = a;
                            nearestRainfall = element
                        }
                      });
                    
                      domAttr.set("distVilltoRF","innerHTML",'<p style="letter-spacing:0.5px;color: darkorange;font-size: 13px;line-height:2em;"><b>**Note:Nearest rainfall found with the distance of '+(minDistance/1000).toFixed(2)+'KM from the selected village.</b></p>');
                      var rfArray=[];var rfLabelsArray= [];var regLineValsRainfall=[]; window.rfArray=rfArray;window.rfLabelsArray=rfLabelsArray;window.regLineValsRainfall=regLineValsRainfall;
                      if(akah_rftomonth != "0" && akah_rftoyear != "Year") 
                      Todate = (akah_Tool._getMonth(akah_rftomonth,akah_rftoyear)).split(",")[2];
                      var rfInp = {uid :nearestRainfall.attributes.unique_id, fromYear: "2008", toYear: "2020", fromMonth:akah_rffrommonth, toMonth: akah_rftomonth, toDate:Todate}
                      // var rainfallURL = "http://localhost:3002/rainfall/"+ selectedRFCat + "/";
                      var rainfallURL = "https://geomonitor.co.in/rainfallakah/rainfall/"+ selectedRFCat + "/";
                      rep_rfMonthlyChart="";rfChart_monWithInd="";
                      window.rep_rfMonthlyChart=rep_rfMonthlyChart;
                      window.rfChart_monWithInd=rfChart_monWithInd;
                      fetch(rainfallURL, {method: "POST",body:JSON.stringify(rfInp)}).then(function(res){
                        console.log(res)
                          return res.json();
                      }).then(function(resp){
                                window.rfresp = resp;
                                rInd = 1;
                                //mapping dropdowns of rainfall
                                // fy = [...new Set(rfresp.result[0].map(event => new Date(event.date_time).getFullYear()))];
                                // ty = [...new Set(rfresp.result[rfresp.result.length-1].map(event => new Date(event.date_time).getFullYear()))];
                                // for(i = fy; i<=ty;i++){
                                //   fromRfYear_array.push(i);
                                //   toRfYear_array.push(i);
                                // }
                                //end of mapping
                                rfresp.result.forEach(table => {
                                    table.forEach(element => {
                                      rfArray.push(element.rainfall_mm);
                                    if(selectedRFCat == "yearly"){rfLabelsArray.push({text:element.date_time.split("-")[0], value: rInd});}
                                    else if(selectedRFCat == "monthly"){rfLabelsArray.push({text:akah_Tool.month_function(Number(element.date_time.split("T")[0].substr(0,7).split("-")[1]))+"-"+ element.date_time.split("T")[0].substr(0,7).split("-")[0], value: rInd});}
                                    else if(selectedRFCat == "weekly"){rfLabelsArray.push({text:element.date_time.split("T")[0].substr(8,)+"-"+akah_Tool.month_function(Number(element.date_time.split("T")[0].substr(0,7).split("-")[1]))+"-"+ element.date_time.split("T")[0].substr(0,7).split("-")[0], value: rInd});}
                                    else if(selectedRFCat == "daily"){rfLabelsArray.push({text:element.date_time.split("T")[0].substr(8,)+"-"+akah_Tool.month_function(Number(element.date_time.split("T")[0].substr(0,7).split("-")[1]))+"-"+ element.date_time.split("T")[0].substr(0,7).split("-")[0], value: rInd});}
                                      regLineValsRainfall.push(rInd);
                                      rInd++;
                                    });
                                })
                                //code for plotting regression line/ trendline      
                                var array_xy = [];       // creating x * y array
                                var array_xx = [];  
                                for(var i = 0; i<rfArray.length; i++){
                                  array_xy.push(rfArray[i] * regLineValsRainfall[i]);
                                  array_xx.push(regLineValsRainfall[i] * regLineValsRainfall[i]);
                                }
                                m =  (((dojox.math.stats.mean(regLineValsRainfall) * dojox.math.stats.mean(rfArray)) - dojox.math.stats.mean(array_xy)) /
                                  ((dojox.math.stats.mean(regLineValsRainfall) * dojox.math.stats.mean(regLineValsRainfall)) - dojox.math.stats.mean(array_xx)));
                                b=(dojox.math.stats.mean(rfArray)- dojox.math.stats.mean(regLineValsRainfall)*m);
                                var reg_line_rf = [];   window.reg_line_rf=reg_line_rf;    
                                for(var x = 0; x<regLineValsRainfall.length; x++){
                                  reg_line_rf.push((m*regLineValsRainfall[x]) + b);
                                } //end of regression line
                                domAttr.set('rfMonthlyChart', "innerHTML","");
                                domAttr.set('rfMonthlyChartWithInd', "innerHTML","");
                              //  if(document.getElementById("toggleIndicatorRF").checked == false){
                                      rfChart_mon = new Chart("rfMonthlyChart");
                                      rfChart_mon.addPlot("default", {type: LinesPlot,tension: "S",mouseOver: true});
                                      rfChart_mon.addPlot("plot_markers", {type: LinesPlot,markers: false,tension: "S"}); 
                                      if(selectedRFCat != "yearly"){rfChart_mon.addAxis("x", { includeZero: false, fixLower: "major", fixUpper: "major", natural: false,rotation:90, vertical: false, title: "Date", titleFontColor: "#00833f",titleOrientation: "away",
                                      labels: rfLabelsArray, enableCache: true, majorLabels: true,majorTicks:false, majorTickStep: 3,minorTicks:false});}
                                      else{
                                        rfChart_mon.addAxis("x", { includeZero: false, fixLower: "major", fixUpper: "major", natural: false,rotation:90, vertical: false, title: "Date", titleFontColor: "#00833f",titleOrientation: "away",
                                        labels: rfLabelsArray, enableCache: true, majorLabels: true,majorTicks:false, majorTickStep: 1,minorTicks:false});
                                      }
                                      rfChart_mon.addAxis("y", { min: Math.min.apply(null,rfArray) - 1, max:Math.max.apply(null,rfArray)+1,vertical: true, enableCache: true,fixLower: "minor", fixUpper: "minor", title: "Rainfall (mm)", titleFontColor: "#00833f",minorTicks:true});
                                      rfChart_mon.addSeries("Rainfall Data", rfArray,{plot: "default", stroke: {color:"#0088BF", width:2},marker: "m-1.5,0 c0,-2 3,-2 3,0 m-3,0 c0,2 3,2 3,0" }); //min: 
                                      rfChart_mon.addSeries("Trend", reg_line_rf,{ plot: "plot_markers" , stroke: { color: "#6B3809",width: 2.5 } }); //min: 
                                      window.rfChart_mon=rfChart_mon;
                                      if(dijit.byId("wrf_inp").checked == true)
                                      rfChart_mon.title="Rainfall "+selectedRFCat+" Data("+akah_rffromyear+"-"+akah_rftoyear+")" 
                                      else if(dijit.byId("drf_inp").checked == true)
                                      rfChart_mon.title="Rainfall "+selectedRFCat+" Data("+akah_Tool.month_function(Number(akah_rffrommonth))+" "+akah_rffromyear+"-"+akah_Tool.month_function(Number(akah_rftomonth))+" "+akah_rftoyear+")" 
                                      else rfChart_mon.title="Rainfall "+selectedRFCat+" Data(2008-2020)" 
                                      rfChart_mon.titleFont= "bold 12pt Avenir Light"
                                      rfChart_mon.titlePos = "top"
                                      rfChart_mon.titleGap = 10
                                      // else{
                                      //   new Tooltip(rfChart_mon,"default", {
                                      //     text: function(o){return "<b>"+rfLabelsArray[o.x-1].text + "</b> : "+ (o.y).toFixed(6);}
                                      //   });
                                      // }
                                      //  akah_Tool.addIndicatorRF();
                                      new MouseZoomAndPan(rfChart_mon, "default", {axis: "x"});
                                      // new Highlight(rfChart_mon,"default");
                                      rfChart_mon.render();
                                      // dojo.query('#rfMonthlyChartModule').style('display', 'block');
                                      // dojo.query('#rfMonthlyChartModuleWithInd').style('display', 'block');
                                    // }
                                    //withindicator
                                    // else{
                                    rfChart_monWithInd = new Chart("rfMonthlyChartWithInd");
                                    rfChart_monWithInd.addPlot("default", {type: LinesPlot,tension: "S",mouseOver: true});
                                    rfChart_monWithInd.addPlot("plot_markers", {type: LinesPlot,markers: false,tension: "S"}); 
                                    if(selectedRFCat != "yearly"){rfChart_monWithInd.addAxis("x", { includeZero: false, fixLower: "major", fixUpper: "major", natural: false,rotation:90, vertical: false, title: "Date", titleFontColor: "#00833f",titleOrientation: "away",
                                    labels: rfLabelsArray, enableCache: true, majorLabels: true,majorTicks:false, majorTickStep: 3,minorTicks:false});}
                                    else{
                                      rfChart_monWithInd.addAxis("x", { includeZero: false, fixLower: "major", fixUpper: "major", natural: false,rotation:90, vertical: false, title: "Date", titleFontColor: "#00833f",titleOrientation: "away",
                                      labels: rfLabelsArray, enableCache: true, majorLabels: true,majorTicks:false, majorTickStep: 1,minorTicks:false});
                                    }
                                    rfChart_monWithInd.addAxis("y", { min: Math.min.apply(null,rfArray) - 1, max:Math.max.apply(null,rfArray)+1,vertical: true, enableCache: true,fixLower: "minor", fixUpper: "minor", title: "Rainfall (mm)", titleFontColor: "#00833f",minorTicks:true});
                                    rfChart_monWithInd.addSeries("Rainfall Data", rfArray,{plot: "default", stroke: {color:"#0088BF", width:2},marker: "m-1.5,0 c0,-2 3,-2 3,0 m-3,0 c0,2 3,2 3,0" }); //min: 
                                    rfChart_monWithInd.addSeries("Trend", reg_line_rf,{ plot: "plot_markers" , stroke: { color: "#6B3809",width: 2.5 } }); //min: 
                                    window.rfChart_monWithInd=rfChart_monWithInd;
                                    rfChart_monWithInd.title="Rainfall "+selectedRFCat+" Data("+akah_rffromyear+"-"+akah_rftoyear+")" 
                                    rfChart_monWithInd.titleFont= "bold 12pt Avenir Light"
                                    rfChart_monWithInd.titlePos = "top"
                                    rfChart_monWithInd.titleGap = 10
                                    akah_Tool.addIndicatorRF();
                                    new MouseZoomAndPan(rfChart_monWithInd, "default", {axis: "x"});
                                    // new Highlight(rfChart_mon,"default");
                                    rfChart_monWithInd.render();
                              if(document.getElementById("toggleIndicatorRF").checked == false){dojo.query('#rfMonthlyChartModule').style('display', 'block'); dojo.query('#rfMonthlyChartModuleWithInd').style('display', 'none');}
                                else {dojo.query('#rfMonthlyChartModuleWithInd').style('display', 'block');dojo.query('#rfMonthlyChartModule').style('display', 'none');}
                              // }
                                // domAttr.set("akahRFIndicateBtn","innerHTML",'<span style="font-size: 14px;font-family: Arial;color: #000000;"><b>Show Indicator on chart</b></span>'+
                                // '<label class="switch" style="margin-left: 10px;"><input type="checkbox" id="toggleIndicatorRF"><span class="slider round"></span></label>');
                                domAttr.set("rfMonthlyChartLegend","innerHTML","<div style='display:inline-flex;'><div style='display:inline-flex;'>"+
                              "<div style='width:19px;height:14px;border:1.6px solid black;border-radius:4px;background-color:#0088BF;'></div>"+
                              "<span style='padding-left:5px;'>Rainfall Data</span></div>"+
                              "<div style='display:inline-flex;padding-left:5px;'><div style='width:19px;height:14px;border:1.6px solid black;border-radius:4px;background-color:#6B3809;'></div>"+
                              "<span style='padding-left:5px;'>TrendLine</span></div></div>")
                              domAttr.set("rfMonthlyChartLegendWithInd","innerHTML","<div style='display:inline-flex;'><div style='display:inline-flex;'>"+
                              "<div style='width:19px;height:14px;border:1.6px solid black;border-radius:4px;background-color:#0088BF;'></div>"+
                              "<span style='padding-left:5px;'>Rainfall Data</span></div>"+
                              "<div style='display:inline-flex;padding-left:5px;'><div style='width:19px;height:14px;border:1.6px solid black;border-radius:4px;background-color:#6B3809;'></div>"+
                              "<span style='padding-left:5px;'>TrendLine</span></div></div>")
                                dojo.query("#rfMonthlyChartLegend").style("display","block");
                                dojo.query("#akahRFIndicateBtn").style("display","block");
                                rep_rfMonthlyChart=rep_rfMonthlyChart+'<div style="display:inline-flex;"><div>'+dojo.query('#rfMonthlyChartModule').innerHTML()+'</div>'+
                                "</div><br>";
                                // dojo.query("#rfMonthlyChartModule").style("display","none");
                                // rfLabelsArray.length = 0;
                                // rainfallStations_layer.setVisibility(true);
                                //add pllyline between village centrid and rainfall station
                                // var singlePathPolyline = new Polyline([[villGeometry.x, villGeometry.y], [nearestRainfall.geometry.x,nearestRainfall.geometry.y]]);
                                // new Polyline(new esri.SpatialReference({wkid:4326}));

                                // var polylineJson = {
                                //   "paths":[[villGeometry.x, villGeometry.y], [nearestRainfall.geometry.x,nearestRainfall.geometry.y]],
                                //   "spatialReference":{"wkid":4326}
                                // };
                                // var polyline = new esri.geometry.Polyline(polylineJson);
                                // symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([215,0,0]), 2);
                                // geometryPl = new Graphic(polyline,symbol);
                                // akah_Tool.map.graphics.add(geometryPl);
                      });
                      var rainfallYearlyURL = "https://geomonitor.co.in/rainfallakah/rainfall/yearly/";
                      rep_rfYearlyChart="";window.rep_rfYearlyChart=rep_rfYearlyChart;
                      dataAnalysis_obj1="";window.dataAnalysis_obj1=dataAnalysis_obj1;
                      fetch(rainfallYearlyURL, {method: "POST",body:JSON.stringify(rfInp)}).then(function(res){
                          return res.json()
                      }).then(function(res){
                        window.yearlyRFResp = res;
                        dojo.query("#infobtn_rainfall").style("display","block");
                        ind = 1;
                        regLineValsRainfallY=[];rfLabelsArrayY=[];window.rfLabelsArrayY=rfLabelsArrayY;rfYArray=[];rfchart2array = [];window.rfYArray=rfYArray;
                        yearlyRFResp.result.forEach(table => {
                          table.forEach(element => {
                            // rfYArray.push(element.rainfall_mm/12); //yearly average
                            rfYArray.push(element.rainfall_mm); 
                            rfchart2array.push(element.rainfall_mm);
                            rfLabelsArrayY.push({text:element.date_time.split("-")[0], value: ind});
                            regLineValsRainfallY.push(ind);
                            ind++;
                          })
                        })
                        annDec = 0;rfYArray.forEach(item =>{annDec+=item;})
                        window.annDec = annDec;
                        // annchart2Sum = 0;rfchart2array.forEach(item =>{annchart2Sum+=item;})
                        domAttr.set('rfYearlyChart', "innerHTML","");
                        domAttr.set('rfAnnDecChart', "innerHTML","");
                        // domAttr.set('rfYearlyChartLegend', "innerHTML","");
                        var rfChart_yearly = new Chart("rfYearlyChart");
                        rfChart_yearly.addPlot("default", {type: "Columns", gap: 2, width: 15, plotarea: { fill: "lightgrey" }});
                        rfChart_yearly.addPlot("plot_markers", {type: LinesPlot,markers: false,tension: "S"}); 
                        rfChart_yearly.addAxis("x", { includeZero: false, natural: false,rotation:90, vertical: false, title: "Years", titleFontColor: "#00833f",titleOrientation: "away",titleFont: "bold 10pt Avenir Light",
                              labels: rfLabelsArrayY});
                        rfChart_yearly.addAxis("y", { min: Math.min.apply(null,rfYArray) - 1, max:Math.max.apply(null,rfYArray)+1,vertical: true, enableCache: true,fixLower: "minor", fixUpper: "minor", title: "Rainfall (mm)", titleFontColor: "#00833f",titleFont: "bold 10pt Avenir Light",minorTicks:true});
                        rfChart_yearly.addSeries("Yearly Rainfall Data", rfYArray,{plot: "default",color:"#2E86C1",stroke: { color: "#2E86C1",width: 1}}); //min: 
                        rfChart_yearly.addSeries("Average (2008-2020)",[annDec/13,annDec/13,annDec/13,annDec/13,annDec/13,annDec/13,annDec/13,annDec/13,annDec/13,annDec/13,annDec/13,annDec/13,annDec/13],{ plot: "plot_markers" , stroke: { color: "#6B3809",width: 2} }); //min: 
                        window.rfChart_yearly=rfChart_yearly;
                        // var legend = new Legend({ chart: rfChart_yearly }, "rfYearlyChartLegend");
                        rfChart_yearly.render();
                        // rfChart_yearly.resize(350,220);
                        //get annual rainfall for 2020 year
                        var annDec_Chart = new Chart("rfAnnDecChart");
                        var annDec_Data = [{ y: rfYArray[rfYArray.length-1],fill:"#2E86C1"},{ y:annDec/13, fill:"#2E86C1"}];
                        annDec_Chart.addPlot("default", {type: "Columns", gap: 20,labels:true, labelStyle:'outside', width: 10, plotarea: { fill: "lightgrey" } });
                        annDec_Chart.addAxis("x", { natural: true, vertical: false, font: "normal normal bold 8pt Arial", fontColor: "black", title: "", titleFontColor: "black",
                                  labels: [{value: 1, text:['Annual Rainfall(2020)']}, {value: 2, text:['Decadal Average Rainfall(2008-2020)']}] });
                        annDec_Chart.addAxis("y", { min: Math.min.apply(null,rfYArray) - 1, max:Math.max.apply(null,rfYArray)+1,vertical: true, enableCache: true,fixLower: "minor", fixUpper: "minor", title: "Rainfall (mm)", titleFontColor: "#00833f",titleFont: "bold 8pt Avenir Light",minorTicks:true});
                        annDec_Chart.addSeries("Rainfall Average Decadal Data", annDec_Data,{plot: "default",color:"#2E86C1",stroke: { color: "#2E86C1",width: 1}}); //min: 
                        window.annDec_Chart=annDec_Chart;
                        annDec_Chart.render();
                        rep_rfYearlyChart = dom.byId("rfYearlyChartModule").innerHTML;
                        // domAttr.set("rfAnnualChartLegend","innerHTML","<div style='margin-top:19%;margin-left:2%;font-weight:bold;font-size:12px;'><ul><li>Average annual Rainfall 2020 : "+(rfYArray[rfYArray.length-1]).toFixed(2)+" mm</li><li> Average Rainfall of 2008-2020 : "+(annDec/13).toFixed(2)+" mm</li></ul><div>")
                        
                       
                        
                        var legend = new Legend({ chart: rfChart_yearly }, "rfYearlyChartLegend");
                      
                      
                      });
                      // var queryRainfallDataLayer = new Query()
                      // queryRainfallDataLayer.where = "unique_id_fk = '" + nearestRainfall.attributes.unique_id+"'"
                      // queryRainfallDataLayer.orderByFields  = ["objectid ASC"]
                      // queryRainfallDataLayer.outFields = ["date_time","rainfall_mm"]   
                      // queryRainfallDataLayer.returnGeometry = false;  
                      // aggregatedRF=[];window.aggregatedRF = aggregatedRF;
                      // new QueryTask(rainfallData_layer).execute(queryRainfallDataLayer, function retrieve(response) {     
                      //     rainfallDataResponse = response
                      //     window.rainfallDataResponse = rainfallDataResponse;
                      //     var yearsAvail = [...new Set(rainfallDataResponse.features.map(event => new Date(event.attributes.date_time).getFullYear()))];
                        //   yearsAvail.forEach(year => {
                        //       a = rainfallDataResponse.features.filter(a=> Number(new Date(a.attributes.date_time).getFullYear()) == year)
                        //       var collection = a.map(feature => 
                        //         ({ ...feature, day: new Date(feature.attributes.date_time).getFullYear()+"-"+ Number(new Date(feature.attributes.date_time).getMonth() +1)+"-"+new Date(feature.attributes.date_time).getDate(),value: Number(feature.attributes.rainfall_mm)}));
                        //       var mapDayToMonth = collection.map(x => ({...x, day: new Date(x.day).getMonth()+1}));
                        //       var sumPerMonth = mapDayToMonth.reduce((acc, cur,index) => {
                        //             // acc[cur.day] = acc[cur.day] + cur.value || cur.value;
                        //             // acc["year"]=year;
                        //             if(index == 0) acc[cur.day] = ({"day": cur.day+"_"+year, value: cur.value})
                        //             else  acc[cur.day] = ({"day": cur.day+"_"+year, value: acc[cur.day-1].value + cur.value || cur.value})
                        //             return acc;
                        //       }, {});
                        //       aggregatedRF.push(sumPerMonth);
                        //       a.length = 0;
                        //     // });
                        // });
                      // });
            }
          });
          //rainfall code ends here
          
    },
    addIndicatorRF: function(){
      if(rfChart_monWithInd.series.length > 0){
        var mouindicator = new MouseIndicator(rfChart_monWithInd, "default", { 
          series : "Rainfall Data", 
          mouseOver: true,
          labelFunc: function(o){return rfLabelsArray[o.x-1].text + ": "+ (o.y).toFixed(6);},
          fillFunc: function(v){return '#fcfcfc';},
          fontColor:'black',stroke: {width: 2, color: 'white'},lineStroke: {width: 2, color: 'green'},dualIndicator: true});
          rfChart_monWithInd.render();
          rfChart_monWithInd.resize(600,310);
          dojo.query('#rfMonthlyChartModule').style('display', 'none');
          dojo.query('#rfMonthlyChartModuleWithInd').style('display', 'block');
      }
    },
    akah_chartGenerte: function(){
        domAttr.set("akahLulc_Chart","innerHTML",'<img src="'+image_path+'" class="load_image" alt="Loading.." style="margin-top:20%;width:100px;">');
        domAttr.set("lulc_legend","innerHTML","");
        var stateName = akah_searchResponse.attributes.state;
        var districtName = akah_searchResponse.attributes.district;
        var blockName = akah_searchResponse.attributes.block;
        (akah_searchResponse.attributes.village === null) ? (villageName = " "):(villageName = akah_searchResponse.attributes.village)
        //akah_villages_layer.setDefinitionExpression("VILLNAME_1 like" +" "+"\'"+ villageName +"\'");
        akah_villages_layer.setVisibility(true);
        // akah_villages_layer.setDefinitionExpression("VNAME like "+villageName)
        // var akah_monYear = akah_Tool.akah_selMonth+akah_Tool.akah_selYear
              var akah_monYear = akah_Tool.akah_selYear
              var lulc_map_year=akah_Tool.akah_selYear
              lulc_map_season= akah_Tool.akah_selMonsoon[0].toLocaleUpperCase()+akah_Tool.akah_selMonsoon.slice(1,akah_Tool.akah_selMonsoon.length);
              var queryLulcMap = new Query()
              // queryLulcMap.where="year="+lulc_map_year+" and season='"+lulc_map_season+"' and village_pk="+akah_searchResponse.attributes.OBJECTID;
              queryLulcMap.where="year="+lulc_map_year+" and season='"+lulc_map_season+"' and village_pk="+akah_searchResponse.attributes.village_pk;
              queryLulcMap.returnDistinctValues=false;
              // queryLulcMap.returnGeometry=true;
              queryLulcMap.outFields=["*"]
              window.lulc_map_result=new QueryTask(lulc_village_url).execute(queryLulcMap, function(akah_lulc_villageResponse1){
                window.akah_lulc_villageResponse=akah_lulc_villageResponse1.features[0];
              if (akah_lulc_villageResponse.attributes['agriculture_ha'] != null) {var lulcAL_val = akah_lulc_villageResponse.attributes['agriculture_ha']}else{var lulcAL_val = 0}
              if (akah_lulc_villageResponse.attributes['barren_land_ha'] != null) {var lulcBL_val = akah_lulc_villageResponse.attributes['barren_land_ha']}else{var lulcBL_val = 0}
              if (akah_lulc_villageResponse.attributes['builtup_ha'] != null) {var lulcBU_val = akah_lulc_villageResponse.attributes['builtup_ha']}else{var lulcBU_val = 0}
              if (akah_lulc_villageResponse.attributes['grasslands_ha'] != null) {var lulcFR_val = akah_lulc_villageResponse.attributes['grasslands_ha']}else{var lulcFR_val = 0}
              if (akah_lulc_villageResponse.attributes['water_bodies_ha'] != null) {var lulcWB_val = akah_lulc_villageResponse.attributes['water_bodies_ha']}else{var lulcWB_val = 0}
              domAttr.set("akahLulc_Chart","innerHTML",'');
              dojo.query('#akahLocation_info').style('display','block')
              // domAttr.set('akahLocation_info','innerHTML',"<span><span class='akahHeadings'>State: </span><span class='akahNames'>"+stateName+"</span></span>&nbsp;&nbsp;<span><span class='akahHeadings'>District: </span><span class='akahNames'>"+districtName+"</span></span>&nbsp;&nbsp;"+
              // "<span><span class='akahHeadings'>Block: </span><span class='akahNames'>"+blockName+"</span></span>&nbsp;&nbsp;<br><span><span class='akahHeadings'>Village: </span><span class='akahNames'>"+villageName+"</span>");
              //Lulc chart for agakhan summary widget
              domAttr.set("tab3_village","innerHTML",villageName);

              sumForPercntg = Number(lulcAL_val) + Number(lulcBL_val) + Number(lulcFR_val) + Number(lulcBU_val) + Number(lulcWB_val)
              akah_LULCchart = new dojox.charting.Chart2D("akahLulc_Chart", { enablePan: true, enableZoom: true});
              akah_LULCchart.addPlot("default", { type: "Columns" , gap: 10, width: 22,animate: { duration: 2000, easing: dojo.fx.easing.bounceInOut }});
              var akahLulc_Data = [{ y: ((Number(lulcAL_val)/sumForPercntg)*100).toFixed(2), tooltip:"Agriculture Land <br><b>" + Number(lulcAL_val.toFixed(2)) +" ha </b><br><b>("+ ((Number(lulcAL_val)/sumForPercntg)*100).toFixed(2)+"%)</b>",fill:"#5adf5a",stroke: {color: "#5adf5a", width: 4}},
                                  { y: ((Number(lulcBL_val)/sumForPercntg)*100).toFixed(2), tooltip:"Barren Land <br><b>"+Number(lulcBL_val.toFixed(2)) +" ha </b><br><b>("+ ((Number(lulcBL_val)/sumForPercntg)*100).toFixed(2)+"%)</b>", fill:"#edd8c0", stroke: {color: "#edd8c0", width: 4}},
                                  { y: ((Number(lulcFR_val)/sumForPercntg)*100).toFixed(2), tooltip:"Forest Land <br><b>"+Number(lulcFR_val.toFixed(2)) +" ha </b><br><b>("+ (( Number(lulcFR_val)/sumForPercntg)*100).toFixed(2)+"%)</b>", fill:"#047d04",stroke: {color: "#047d04", width: 4}},
                                  { y: ((Number(lulcBU_val)/sumForPercntg)*100).toFixed(2), tooltip:"Built Up <br><b>"+Number(lulcBU_val.toFixed(2)) +" ha </b><br><b>("+ (( Number(lulcBU_val)/sumForPercntg)*100).toFixed(2)+"%)</b>", fill:"#bd3c11",stroke: {color: "#bd3c11", width: 4}},
                                  { y: ((Number(lulcWB_val)/sumForPercntg)*100).toFixed(2), tooltip:"Water Bodies <br><b>"+Number(lulcWB_val.toFixed(2)) +" ha </b><br><b>("+ ((Number(lulcWB_val)/sumForPercntg)*100).toFixed(2)+"%)</b>", fill:"#2f92a3", stroke: {color: "#2f92a3", width: 4}}];
              akah_LULCchart.addAxis("x", { fixLower: "minor", fixUpper: "minor", natural: true, vertical: false, font: "normal normal bold 9px Arial", fontColor: "black", title: "", titleFontColor: "black", titleOrientation: "away", 
                          labels: [{value: 1, text:'Agriculture Land'}, 
                          {value: 2, text:'Barren Land'},
                          {value: 3, text:'Forest Land'},
                          {value: 4, text:'Built Up'},
                          {value: 5, text:'Water Bodies'},
                        ] });
              akah_LULCchart.addAxis("y", { vertical: true, font: "normal normal normal 11px Arial", fontColor: "black", fixLower: "major", fixUpper: "major", includeZero: false, title: "Area(%)", titleFontColor: "black" });
              akah_LULCchart.addSeries("default", akahLulc_Data); //Adds Displacement Data to chart
              var mag1 = new dojox.charting.action2d.MoveSlice(akah_LULCchart, "default");
              new Highlight(akah_LULCchart, "default");
              new Tooltip(akah_LULCchart, "default");
              // akah_LULCchart.title = "Land Use Land Cover"
              akah_LULCchart.title = "Land Use Land Cover ("+lulc_map_season + "monsoon-"+lulc_map_year+")";
              akah_LULCchart.titleFont= "bold 12pt Arial"
              akah_LULCchart.titlePos = "top"
              akah_LULCchart.titleGap = 0
              akah_LULCchart.margins.t = 0
              akah_LULCchart.margins.b = 0
              akah_LULCchart.node.clientHeight= 190;
              akah_LULCchart.render();
              akah_LULCchart.resize(570,250);

              // var akah_LULCchart = new dojox.charting.Chart2D("akahLulc_Chart", { enablePan: true, enableZoom: true });//Creates an object for displacement chart
              // akah_LULCchart.addPlot("default", { type: "Columns", animate: { duration: 2000, easing: dojo.fx.easing.bounceInOut } });  // Add the only/default plot
              // window.akah_LULCchart = akah_LULCchart;
              // valArray = [lulcAL_val,lulcBL_val, lulcFR_val,lulcBU_val,lulcWB_val]
              // // var akah_LULCchart = [{ y: lulcAL_val,fill: "green", tooltip: 'Net GW Availability (2025): <b>'+irrig_draf_2013+' ha m</b>' },{ y: draft_irrg_2017 ,fill: "blue", tooltip:'Domestic Future Draft: <b>'+draft_irrg_2017+' ha m</b>' }];
              // var akahLulc_Data = [{ y: lulcAL_val, tooltip:"Agriculture Land <br><b>" + Number(lulcAL_val.toFixed(2)) +" ha </b><br><b>("+ ((Number(lulcAL_val)/sumForPercntg)*100).toFixed(2)+"%)</b>",fill:"#5adf5a"},
              // { y: lulcBL_val, tooltip:"Barren Land <br><b>"+Number(lulcBL_val.toFixed(2)) +" ha </b><br><b>("+ ((Number(lulcBL_val)/sumForPercntg)*100).toFixed(2)+"%)</b>", fill:"#edd8c0", stroke: {color: "#edd8c0", width: 4}},
              // { y: lulcFR_val, tooltip:"Forest Land <br><b>"+Number(lulcFR_val.toFixed(2)) +" ha </b><br><b>("+ (( Number(lulcFR_val)/sumForPercntg)*100).toFixed(2)+"%)</b>", fill:"#047d04"},
              // { y: lulcBU_val, tooltip:"Built Up <br><b>"+Number(lulcBU_val.toFixed(2)) +" ha </b><br><b>("+ (( Number(lulcBU_val)/sumForPercntg)*100).toFixed(2)+"%)</b>", fill:"#bd3c11",stroke: {color: "#bd3c11", width: 4}},
              // { y: lulcWB_val, tooltip:"Water Bodies <br><b>"+Number(lulcWB_val.toFixed(2)) +" ha </b><br><b>("+ ((Number(lulcWB_val)/sumForPercntg)*100).toFixed(2)+"%)</b>", fill:"#2f92a3", stroke: {color: "#2f92a3", width: 2}}];
              // akah_LULCchart.addAxis("x", { fixLower: "minor", fixUpper: "minor", natural: true, vertical: false, font: "normal normal bold 12px Arial", fontColor: "black", title: "", titleFontColor: "black", titleOrientation: "away", 
              //             labels: [{value: 1, text:'Agriculture Land'}, 
              //             {value: 2, text:'Barren Land'},
              //             {value: 3, text:'Forest Land'},
              //             {value: 4, text:'Built Up'},
              //             {value: 5, text:'Water Bodies'},
              //           ] });
              // akah_LULCchart.addAxis("y", { vertical: true, font: "normal normal normal 12px Arial", fontColor: "black", fixLower: "major", fixUpper: "major", includeZero: true, title: "Volume (ha m)", titleFontColor: "black" });
              // akah_LULCchart.addSeries("default", akahLulc_Data); //Adds Displacement Data to chart
              // new Highlight(akah_LULCchart, "default");
              // new Tooltip(akah_LULCchart, "default");
              // akah_LULCchart.title = "Land Use Land Cover ("+lulc_map_season + "monsoon-"+lulc_map_year+")"
              // akah_LULCchart.titleFont= "bold 12pt Arial"
              // akah_LULCchart.titlePos = "top"
              // akah_LULCchart.titleGap = 10
              // akah_LULCchart.render()
              // akah_LULCchart.resize(430,250);

              // var akah_LULCchart = new dojox.charting.Chart2D("akahLulc_Chart", { enablePan: true, enableZoom: true });//Creates an object for displacement chart
              // akah_LULCchart.setTheme(theme); // Set the theme as Tufte
              // akah_LULCchart.addPlot("default", { type: "Columns", gap: 65, width: 20, animate: { duration: 2000, easing: dojo.fx.easing.bounceInOut } });  // Add the only/default plot
              // window.akah_LULCchart = akah_LULCchart;
              // akahRainfallResponse.attributes[`net_gw_availability_future`]!=null? irrig_draf_2013 = Number(akahRainfallResponse.attributes[`net_gw_availability_future`].toFixed(2)) : irrig_draf_2013 = "";
              // akahRainfallResponse.attributes[`gw_allocation_domestic_2025`]!=null? draft_irrg_2017 = Number(akahRainfallResponse.attributes[`gw_allocation_domestic_2025`].toFixed(2)) : draft_irrg_2017 = "";
              // var barChartData1=[irrig_draf_2013,draft_irrg_2017];
              // akah_LULCchartdata = [{ y: irrig_draf_2013,fill: "green", tooltip: 'Net GW Availability (2025): <b>'+irrig_draf_2013+' ha m</b>' },{ y: draft_irrg_2017 ,fill: "blue", tooltip:'Domestic Future Draft: <b>'+draft_irrg_2017+' ha m</b>' }];
              // akah_LULCchart.addAxis("x", { fixLower: "minor", fixUpper: "minor", natural: true, vertical: false, font: "normal normal bold 12px Arial", fontColor: "black", title: "", titleFontColor: "black", titleOrientation: "away", labels: [{value: 1, text:'Net GW Availability (2025)', fill:"blue"}, {value: 2, text:'Domestic Future Draft', fill:"blue"}] });
              // akah_LULCchart.addAxis("y", { min: Math.min.apply(null, barChartData1), max: Math.max.apply(null, barChartData1),vertical: true, font: "normal normal normal 12px Arial", fontColor: "black", fixLower: "major", fixUpper: "major", includeZero: true, title: "Volume (ha m)", titleFontColor: "black" });
              // akah_LULCchart.addSeries("Series A", akah_LULCchartdata); //Adds Displacement Data to chart
              // new Highlight(akah_LULCchart, "default");
              // new Tooltip(akah_LULCchart, "default");
              // akah_LULCchart.title = "Projected Groundwater Resources (year 2025)"
              // akah_LULCchart.titleFont= "bold 12pt Arial"
              // akah_LULCchart.titlePos = "top"
              // akah_LULCchart.titleGap = 10
              // akah_LULCchart.render()
              // akah_LULCchart.resize(400,250);



              domAttr.set("lulc_legend","innerHTML","<div style='line-height: 2em;padding-top: 20px;'>"+
                          "<span style='padding: 0px 8px 0px 6px;color:#5adf5a;background-color:#5adf5a;font-size: 13px;margin-left:44px;border-radius:3px;'>.</span><span>&nbsp;Agriculture Land - "+Number(lulcAL_val.toFixed(2))+" ha</span>"+
                          "<span style='padding: 0px 8px 0px 6px;color:#edd8c0;background-color:#edd8c0;font-size: 13px;margin-left:44px;border-radius:3px;'>.</span><span>&nbsp;Barren Land - "+Number(lulcBL_val.toFixed(2))+" ha</span><br>"+
                          "<span style='padding: 0px 8px 0px 6px;color:#047d04;background-color:#047d04;font-size: 13px;margin-left:44px;border-radius:3px;'>.</span><span>&nbsp;Forest Land - "+Number(lulcFR_val.toFixed(2))+" ha</span>"+
                          "<span style='padding: 0px 8px 0px 6px;color:#bd3c11;background-color:#bd3c11;font-size: 13px;margin-left:85px;border-radius:3px;'>.</span><span>&nbsp;Built Up - "+Number(lulcBU_val.toFixed(2))+" ha</span><br>"+
                          "<span style='padding: 0px 8px 0px 6px;color:#2f92a3;border-radius:3px;background-color:#2f92a3;font-size: 13px;margin-left:44px'>.</span><span>&nbsp;Water Bodies - "+Number(lulcWB_val.toFixed(2))+" ha</span></div>")
                           //lulc dynamic chart for report
                           domAttr.set("Lulc_Chart_Report","innerHTML",'');
                           akah_LULCchart_report = new dojox.charting.Chart2D("Lulc_Chart_Report", { enablePan: true, enableZoom: true});
                           akah_LULCchart_report.addPlot("default", { type: "Columns" , gap: 10, width: 22,animate: { duration: 2000, easing: dojo.fx.easing.bounceInOut }});
                          //  akah_LULCchart_report = new dojox.charting.Chart2D("Lulc_Chart_Report", { type: Pie , font: "normal normal normal 14px Arial", fontColor: "black", radius: 100, stroke: {width: 0}, labels:false, htmlLabels:false});
                          //  akah_LULCchart_report.addPlot("default", { type: Pie , font: "normal normal bold 12px Arial", fontColor: "black", radius: 180, stroke: {width: 1}, labelOffset: -20, labels: false, labelStyle: "default",htmlLabels: false});
                           akah_LULCchart_report.addAxis("x", { fixLower: "minor", fixUpper: "minor", natural: true, vertical: false, font: "normal normal bold 9px Arial", fontColor: "black", title: "", titleFontColor: "black", titleOrientation: "away", 
                           labels: [{value: 1, text:'Agriculture Land'}, 
                           {value: 2, text:'Barren Land'},
                           {value: 3, text:'Forest Land'},
                           {value: 4, text:'Built Up'},
                           {value: 5, text:'Water Bodies'},
                               ] });
                               akah_LULCchart_report.addAxis("y", { vertical: true, font: "normal normal normal 11px Arial", fontColor: "black", fixLower: "major", fixUpper: "major", includeZero: false, title: "Area(%)", titleFontColor: "black" });
                           akah_LULCchart_report.addSeries("Series A", akahLulc_Data); //Adds Displacement Data to chart
                           akah_LULCchart_report.title = "Land Use Land Cover ("+lulc_map_season + "monsoon-"+lulc_map_year+")";
                           akah_LULCchart_report.titleFont= "bold 12pt Arial"
                           akah_LULCchart_report.titlePos = "bottom"
                           akah_LULCchart_report.render();
                           domAttr.set("lulc_legend_report","innerHTML","<div style='line-height: 2em;padding-top: 50px;'>"+
                           "<span style='padding: 0px 8px 0px 6px;color:#5adf5a;background-color:#5adf5a;font-size: 13px;margin-left:44px;border-radius:3px;'>.</span><span>&nbsp;Agriculture Land - "+Number(lulcAL_val.toFixed(2))+" ha</span><br>"+
                           "<span style='padding: 0px 8px 0px 6px;color:#edd8c0;background-color:#edd8c0;font-size: 13px;margin-left:44px;border-radius:3px;'>.</span><span>&nbsp;Barren Land - "+Number(lulcBL_val.toFixed(2))+" ha</span><br>"+
                           "<span style='padding: 0px 8px 0px 6px;color:#047d04;background-color:#047d04;font-size: 13px;margin-left:44px;border-radius:3px;'>.</span><span>&nbsp;Forest Land - "+Number(lulcFR_val.toFixed(2))+" ha</span><br>"+
                           "<span style='padding: 0px 8px 0px 6px;color:#bd3c11;background-color:#bd3c11;font-size: 13px;margin-left:44px;border-radius:3px;'>.</span><span>&nbsp;Built Up - "+Number(lulcBU_val.toFixed(2))+" ha</span><br>"+
                           "<span style='padding: 0px 8px 0px 6px;color:#2f92a3;border-radius:3px;background-color:#2f92a3;font-size: 13px;margin-left:44px'>.</span><span>&nbsp;Water Bodies - "+Number(lulcWB_val.toFixed(2))+" ha</span></div>")
                           //get lulc 5 years charts in UI based on selection of monsoons
                           akah_Tool.getLULCDefaultCharts("toUI",lulc_map_season);
                  })

    },
    getLULCDefaultCharts: function(destination, season){
                //Query for Default LULC Village Chart starts here -- Level3
                window.villageLulc_table_inp = {};/*json variable to store all the lulc variable values*/
                var querylulc = new Query();
                /*since we are taking 5-year data of pre and post monsoon for analysis removed year = 2020 AND season = 'Post' from where of the query.*/
                // querylulc.where = "village_pk="+akah_searchResponse.attributes.OBJECTID
                querylulc.where = "village_pk="+akah_searchResponse.attributes.village_pk
                querylulc.outFields = ["*"]
                window.village_lulc_result = new QueryTask(lulc_village_url).execute(querylulc, function(lulc_var){
                    window.lulc_var = lulc_var;
                    window.villageLulc_table_inp['lulc_classes'] = ['grasslands_ha', 'agriculture_ha', 'water_bodies_ha','builtup_ha', 'barren_land_ha']
                    // window.villa ge_lulc_bu = 0;window.village_lulc_wb = 0;window.village_lulc_gl = 0;window.village_lulc_al = 0;window.village_lulc_bl = 0;
                    lulc_var.features.forEach(function(ft){
                      // variables declared for pre and post monsoon lulc charts in village level.
                      if (villageLulc_table_inp['pre_grasslands_ha'] === undefined) {
                        villageLulc_table_inp['pre_grasslands_ha'] = [];
                      }
                      if (villageLulc_table_inp['pre_agriculture_ha'] === undefined) {
                        villageLulc_table_inp['pre_agriculture_ha'] = [];
                      }
                      if (villageLulc_table_inp['pre_water_bodies_ha'] === undefined) {
                        villageLulc_table_inp['pre_water_bodies_ha'] = [];
                      }
                      if (villageLulc_table_inp['pre_builtup_ha'] === undefined) {
                        villageLulc_table_inp['pre_builtup_ha'] = [];
                      }
                      if (villageLulc_table_inp['pre_barren_land_ha'] === undefined) {
                        villageLulc_table_inp['pre_barren_land_ha'] = [];
                      }
                      /*array for post-monsoon lulc classes values*/
                      if (villageLulc_table_inp['post_grasslands_ha'] === undefined) {
                        villageLulc_table_inp['post_grasslands_ha'] = [];
                      }
                      if (villageLulc_table_inp['post_agriculture_ha'] === undefined) {
                        villageLulc_table_inp['post_agriculture_ha'] = [];
                      }
                      if (villageLulc_table_inp['post_water_bodies_ha'] === undefined) {
                        villageLulc_table_inp['post_water_bodies_ha'] = [];
                      }
                      if (villageLulc_table_inp['post_builtup_ha'] === undefined) {
                        villageLulc_table_inp['post_builtup_ha'] = [];
                      }
                      if (villageLulc_table_inp['post_barren_land_ha'] === undefined) {
                        villageLulc_table_inp['post_barren_land_ha'] = [];
                      }
                      if (villageLulc_table_inp['year'] === undefined) {
                        villageLulc_table_inp['year'] = [];
                      }
                      /*array to store years of lulc inputs*/
                      villageLulc_table_inp['year'].push(Number(ft.attributes['year']))
                      /*ft.attributes['season'] contains trailing spaces after 'Pre' so used trim()*/
                      if (ft.attributes['season'].trim() === 'Pre') {
                        villageLulc_table_inp['pre_builtup_ha'].push(Number(ft.attributes['builtup_ha']))
                        villageLulc_table_inp['pre_water_bodies_ha'].push(Number(ft.attributes['water_bodies_ha']))
                        villageLulc_table_inp['pre_grasslands_ha'].push(Number(ft.attributes['grasslands_ha']))
                        villageLulc_table_inp['pre_agriculture_ha'].push(Number(ft.attributes['agriculture_ha']))
                        villageLulc_table_inp['pre_barren_land_ha'].push(Number(ft.attributes['barren_land_ha']))
                      }
                      /*ft.attributes['season'] contains trailing spaces after 'Post' so used trim()*/
                      else if (ft.attributes['season'].trim() === 'Post') {
                        villageLulc_table_inp['post_builtup_ha'].push(Number(ft.attributes['builtup_ha']))
                        villageLulc_table_inp['post_water_bodies_ha'].push(Number(ft.attributes['water_bodies_ha']))
                        villageLulc_table_inp['post_grasslands_ha'].push(Number(ft.attributes['grasslands_ha']))
                        villageLulc_table_inp['post_agriculture_ha'].push(Number(ft.attributes['agriculture_ha']))
                        villageLulc_table_inp['post_barren_land_ha'].push(Number(ft.attributes['barren_land_ha']))
                      }
                    });
                    /*remove the repetitive values from year array.*/
                    villageLulc_table_inp['year'] = villageLulc_table_inp['year'].filter( function( item, index, inputArray ) {
                                                      return inputArray.indexOf(item) == index;
                                                    });
                    /*x-axes input array for lulc charts*/
                    villageLulc_table_inp['year_inputForChart'] = [];
                    for(i=0;i<=villageLulc_table_inp['year'].length-1;i++){
                        villageLulc_table_inp['lulc_preTable_td_'+villageLulc_table_inp['year'][i]] = "<td>"+villageLulc_table_inp['year'][i]+"</td>";
                        villageLulc_table_inp['lulc_postTable_td_'+villageLulc_table_inp['year'][i]] = "<td>"+villageLulc_table_inp['year'][i]+"</td>";
                        villageLulc_table_inp['year_inputForChart'].push({
                          text: villageLulc_table_inp['year'][i],
                          value: i+1
                        });
                    }
                    villageLulc_table_inp['lulc_table_th'] = "<td><b>Year</b></td>"
                    /*function to get values that are displayed as headings in 5-year lulc table*/
                    function getLulcClass(lulc_attribute){
                      switch(lulc_attribute){
                        case 'grasslands_ha': lulc_attribute = 'Forest Land';break;
                        case 'agriculture_ha': lulc_attribute = 'Agriculture Land';break;
                        case 'water_bodies_ha': lulc_attribute = 'Water Bodies';break;
                        case 'builtup_ha': lulc_attribute = 'Built Up';break;
                        case 'barren_land_ha': lulc_attribute = 'Barren Land';break;
                      }
                      return lulc_attribute
                    }
                    for(lulc_class_ind = 0; lulc_class_ind<=villageLulc_table_inp['year'].length-1; lulc_class_ind++){
                        /*name, year for classification in the lulc class*/
                        var lulc_class_name = villageLulc_table_inp['lulc_classes'][lulc_class_ind]
                        var lulc_year = villageLulc_table_inp['year'][lulc_class_ind]
                        /*5-year table inputs(rows)*/
                        villageLulc_table_inp['lulc_table_th'] = villageLulc_table_inp['lulc_table_th']+"<td><b>"+getLulcClass(lulc_class_name)+"</b></td>"
                        for(q = 0; q<=villageLulc_table_inp['lulc_classes'].length-1; q++){
                          var attribute_name = villageLulc_table_inp['lulc_classes'][q];
                          if (villageLulc_table_inp['lulc_pre_'+villageLulc_table_inp['lulc_classes'][q].slice(0,-3)+'_arr'] === undefined) {
                            villageLulc_table_inp['lulc_pre_'+villageLulc_table_inp['lulc_classes'][q].slice(0,-3)+'_arr'] =[]
                          }
                          if (villageLulc_table_inp['lulc_post_'+villageLulc_table_inp['lulc_classes'][q].slice(0,-3)+'_arr'] === undefined) {
                            villageLulc_table_inp['lulc_post_'+villageLulc_table_inp['lulc_classes'][q].slice(0,-3)+'_arr'] =[]
                          }
                          /*pre-monsoon percentage values to be displayed in table*/
                          villageLulc_table_inp['pre_'+attribute_name+'_'+lulc_year+'_per'] = (villageLulc_table_inp['pre_'+attribute_name][lulc_class_ind]/(villageLulc_table_inp['pre_builtup_ha'][lulc_class_ind]+villageLulc_table_inp['pre_water_bodies_ha'][lulc_class_ind]+villageLulc_table_inp['pre_grasslands_ha'][lulc_class_ind]+villageLulc_table_inp['pre_agriculture_ha'][lulc_class_ind]+villageLulc_table_inp['pre_barren_land_ha'][lulc_class_ind]))*100
                          /*post-monsoon percentage values to be displayed in table*/
                          villageLulc_table_inp['post_'+attribute_name+'_'+lulc_year+'_per'] = (villageLulc_table_inp['post_'+attribute_name][lulc_class_ind]/(villageLulc_table_inp['post_builtup_ha'][lulc_class_ind]+villageLulc_table_inp['post_water_bodies_ha'][lulc_class_ind]+villageLulc_table_inp['post_grasslands_ha'][lulc_class_ind]+villageLulc_table_inp['post_agriculture_ha'][lulc_class_ind]+villageLulc_table_inp['post_barren_land_ha'][lulc_class_ind]))*100
                          /*5-year table inputs(rows)*/
                          villageLulc_table_inp['lulc_preTable_td_'+lulc_year] = villageLulc_table_inp['lulc_preTable_td_'+lulc_year] + "<td>"+villageLulc_table_inp['pre_'+attribute_name+'_'+lulc_year+'_per'].toFixed(2)+"</td>"
                          if (villageLulc_table_inp['lulc_classes'][q] === 'agriculture_ha') {
                            villageLulc_table_inp['lulc_pre_'+villageLulc_table_inp['lulc_classes'][q].slice(0,-3)+'_arr'].push({y:Number(villageLulc_table_inp['pre_'+attribute_name+'_'+lulc_year+'_per'].toFixed(2)), fill:"#5adf5a", tooltip:Number(villageLulc_table_inp['pre_'+attribute_name+'_'+lulc_year+'_per'].toFixed(2))})
                          }
                          else{
                            villageLulc_table_inp['lulc_pre_'+villageLulc_table_inp['lulc_classes'][q].slice(0,-3)+'_arr'].push(Number(villageLulc_table_inp['pre_'+attribute_name+'_'+lulc_year+'_per'].toFixed(2)))
                          }                                  
                          villageLulc_table_inp['lulc_postTable_td_'+lulc_year] = villageLulc_table_inp['lulc_postTable_td_'+lulc_year] + "<td>"+villageLulc_table_inp['post_'+attribute_name+'_'+lulc_year+'_per'].toFixed(2)+"</td>"
                          if (villageLulc_table_inp['lulc_classes'][q] === 'agriculture_ha') {
                            villageLulc_table_inp['lulc_post_'+villageLulc_table_inp['lulc_classes'][q].slice(0,-3)+'_arr'].push({y:Number(villageLulc_table_inp['post_'+attribute_name+'_'+lulc_year+'_per'].toFixed(2)), fill:"#5adf5a",tooltip:Number(villageLulc_table_inp['post_'+attribute_name+'_'+lulc_year+'_per'].toFixed(2))})
                          }
                          else{
                            villageLulc_table_inp['lulc_post_'+villageLulc_table_inp['lulc_classes'][q].slice(0,-3)+'_arr'].push(Number(villageLulc_table_inp['post_'+attribute_name+'_'+lulc_year+'_per'].toFixed(2)))
                          }
                        }
                    }
                    dojo.query('#villageLULC').style('display', 'block')
                    domAttr.set('Village_akahLulc_preChart', 'innerHTML', '')
                    domAttr.set('Village_akahLulc_postChart', 'innerHTML', '')
                    /*lulc pre-monsoon chart definition*/
                    window.lulc_preMonsoon_chart = new dojox.charting.Chart2D("Village_akahLulc_preChart");
                    lulc_preMonsoon_chart.addPlot("stackedColumnsPlot", {type: "ClusteredColumns",markers: true,gap:5,maxBarSize: 60, tension: "2",animate: { duration: 2000, easing: dojo.fx.easing.bounceInOut }});
                    lulc_preMonsoon_chart.addAxis("x", {title:"Year",dropLabels: false,titleOrientation: "away", labelSizeChange: true, majorTicks:true, majorTickStep:1, minorTicks:false, font: "normal normal bold 12px Arial", fontColor: "black",
                      labels: villageLulc_table_inp['year_inputForChart']});
                    lulc_preMonsoon_chart.addAxis("y", {title:"Area(%)",fixLower: "major",fixUpper: "major", vertical: true});
                    /*pre-monsoon chart for only vegetation as seperate module*/
                    domAttr.set("Village_akahLulc_preVegChart","innerHTML","");
                    window.lulc_preMonsoonVegt_chart = new dojox.charting.Chart2D("Village_akahLulc_preVegChart");
                    lulc_preMonsoonVegt_chart.addPlot("Pre-Vegetation", {type: "Columns",markers: true,gap:5,maxBarSize: 60, tension: "2",animate: { duration: 2000, easing: dojo.fx.easing.bounceInOut }});
                    lulc_preMonsoonVegt_chart.addAxis("x", {title:"Year",dropLabels: false,titleOrientation: "away", labelSizeChange: true, majorTicks:true, majorTickStep:1, minorTicks:false, font: "normal normal bold 12px Arial", fontColor: "black",
                      labels: villageLulc_table_inp['year_inputForChart']});
                    lulc_preMonsoonVegt_chart.addAxis("y", {title:"Area(%)",fixLower: "major",fixUpper: "major", vertical: true});
                    lulc_preMonsoonVegt_chart.addSeries('agriculture', villageLulc_table_inp['lulc_pre_agriculture_arr'], {plot: "Pre-Vegetation",stroke: {color: "#FFFFFF",},fill: "#5adf5a"});
                    lulc_preMonsoonVegt_chart.title = "Long-term change in agriculture area during pre-monsoon ("+villageLulc_table_inp['year'][0]+"-"+villageLulc_table_inp['year'][villageLulc_table_inp['year'].length-1]+")"
                    lulc_preMonsoonVegt_chart.titleFont = "bold 12pt Arial"
                    lulc_preMonsoonVegt_chart.titlePos = "top"
                    lulc_preMonsoonVegt_chart.render();
                    
                    /*village level lulc table for 5 years*/
                    window.village_level_preTable = "<table class='lulcReportTable' style='width: 97%;margin: 50px 0px 10px 0px;'>"+"<tr><td colspan='"+(villageLulc_table_inp['year'].length+1)+"'>LULC Area (%): Pre-monsoon ("+villageLulc_table_inp['year'][0]+"-"+villageLulc_table_inp['year'][villageLulc_table_inp['year'].length-1]+")</td></tr><tr>"+villageLulc_table_inp['lulc_table_th']+"</tr>";
                    window.village_level_postTable = "<tr><td colspan='"+(villageLulc_table_inp['year'].length+1)+"'>LULC Area (%): Post-monsoon ("+villageLulc_table_inp['year'][0]+"-"+villageLulc_table_inp['year'][villageLulc_table_inp['year'].length-1]+")</td></tr><tr>"+villageLulc_table_inp['lulc_table_th']+"</tr>";
                    for(i=0;i<=villageLulc_table_inp['year'].length-1;i++){
                      village_level_preTable = village_level_preTable+"<tr>"+villageLulc_table_inp['lulc_preTable_td_'+villageLulc_table_inp['year'][i]]+"</tr>"
                      village_level_postTable = village_level_postTable+"<tr>"+villageLulc_table_inp['lulc_postTable_td_'+villageLulc_table_inp['year'][i]]+"</tr>"
                    }
                    /*lulc post-monsoon inputs*/
                    lulc_preMonsoon_chart.addSeries('grasslands', villageLulc_table_inp['lulc_pre_grasslands_arr'], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF",},fill: "#047d04"});
                    // lulc_preMonsoon_chart.addSeries('agriculture', villageLulc_table_inp['lulc_pre_agriculture_arr'], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF",},fill: "#5adf5a"});
                    lulc_preMonsoon_chart.addSeries('water_bodies', villageLulc_table_inp['lulc_pre_water_bodies_arr'], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF",},fill: "#2f92a3"});
                    lulc_preMonsoon_chart.addSeries('builtup', villageLulc_table_inp['lulc_pre_builtup_arr'], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF",},fill: "#bd3c11"});
                    lulc_preMonsoon_chart.addSeries('barren_land', villageLulc_table_inp['lulc_pre_barren_land_arr'], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF",},fill: "#edd8c0"});
                    /*lulc pre-monsoon title*/
                    
                    lulc_preMonsoon_chart.title = "Long-term change in land use pattern during pre-monsoon ("+villageLulc_table_inp['year'][0]+"-"+villageLulc_table_inp['year'][villageLulc_table_inp['year'].length-1]+")"
                    lulc_preMonsoon_chart.titleFont = "bold 12pt Arial"
                    lulc_preMonsoon_chart.titlePos = "top"
                    lulc_preMonsoon_chart.render();
                    // lulc_preMonsoon_chart.resize(700,300);
     
                    /*lulc post-monsoon chart definition*/
                    window.lulc_postMonsoon_chart = new dojox.charting.Chart2D("Village_akahLulc_postChart");
                    lulc_postMonsoon_chart.addPlot("stackedColumnsPlot", {type: "ClusteredColumns",markers: true,gap:5,maxBarSize: 60, tension: "2",animate: { duration: 2000, easing: dojo.fx.easing.bounceInOut }});
                    lulc_postMonsoon_chart.addAxis("x", {title:"Year", dropLabels: false,titleOrientation: "away", labelSizeChange: true, majorTicks:true, majorTickStep:1, minorTicks:false, font: "normal normal bold 12px Arial", fontColor: "black",
                      labels: villageLulc_table_inp['year_inputForChart']});
                    lulc_postMonsoon_chart.addAxis("y", {title:"Area(%)",fixLower: "major",fixUpper: "major", vertical: true});
                    /*lulc post-monsoon chart definition*/
                    domAttr.set("Village_akahLulc_postVegChart","innerHTML","");
                    window.lulc_postMonsoonVegt_chart = new dojox.charting.Chart2D("Village_akahLulc_postVegChart");
                    lulc_postMonsoonVegt_chart.addPlot("Post-Vegetation", {type: "Columns",markers: true,gap:5,maxBarSize: 60, tension: "2",animate: { duration: 2000, easing: dojo.fx.easing.bounceInOut }});
                    lulc_postMonsoonVegt_chart.addAxis("x", {title:"Year", dropLabels: false,titleOrientation: "away", labelSizeChange: true, majorTicks:true, majorTickStep:1, minorTicks:false, font: "normal normal bold 12px Arial", fontColor: "black",
                      labels: villageLulc_table_inp['year_inputForChart']});
                    lulc_postMonsoonVegt_chart.addAxis("y", {title:"Area(%)",fixLower: "major",fixUpper: "major", vertical: true});
                    lulc_postMonsoonVegt_chart.addSeries('agriculture', villageLulc_table_inp['lulc_post_agriculture_arr'], {plot: "Post-Vegetation",stroke: {color: "#FFFFFF",},fill: "#5adf5a"});
                    lulc_postMonsoonVegt_chart.title = "Long-term change in agriculture area during post-monsoon ("+villageLulc_table_inp['year'][0]+"-"+villageLulc_table_inp['year'][villageLulc_table_inp['year'].length-1]+")"
                    lulc_postMonsoonVegt_chart.titleFont = "bold 12pt Arial"
                    lulc_postMonsoonVegt_chart.titlePos = "top"
                    lulc_postMonsoonVegt_chart.render();
                    /*lulc post-monsoon inputs*/
                    lulc_postMonsoon_chart.addSeries('grasslands', villageLulc_table_inp['lulc_post_grasslands_arr'], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF",},fill: "#047d04"});
                    // lulc_postMonsoon_chart.addSeries('agriculture', villageLulc_table_inp['lulc_post_agriculture_arr'], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF",},fill: "#5adf5a"});
                    lulc_postMonsoon_chart.addSeries('water_bodies', villageLulc_table_inp['lulc_post_water_bodies_arr'], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF",},fill: "#2f92a3"});
                    lulc_postMonsoon_chart.addSeries('builtup', villageLulc_table_inp['lulc_post_builtup_arr'], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF",},fill: "#bd3c11"});
                    lulc_postMonsoon_chart.addSeries('barren_land', villageLulc_table_inp['lulc_post_barren_land_arr'], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF",},fill: "#edd8c0"});
                    /*lulc post-monsoon title*/
                    lulc_postMonsoon_chart.title = "Long-term change in land use pattern during post-monsoon ("+villageLulc_table_inp['year'][0]+"-"+villageLulc_table_inp['year'][villageLulc_table_inp['year'].length-1]+")"
                    lulc_postMonsoon_chart.titleFont = "bold 12pt Arial"
                    lulc_postMonsoon_chart.titlePos = "top"
                    lulc_postMonsoon_chart.render();
                    domAttr.set('village_vegtpre_legend', 'innerHTML', '<div style="padding:1% 0% 3% 39%;">'+'<span style="padding: 0px 8px 0px 8px;color:#5adf5a;background-color:#5adf5a;font-size: 13px;border-radius:3px;"></span><span>&nbsp;Agriculture Land</span>'+'<div>')
                    domAttr.set("village_precluster_legend","innerHTML",'<div style="line-height: 2em;text-align:center;padding: 2% 2%;">'+
                    '<span style="padding: 0px 8px 0px 8px;color:#047d04;background-color:#047d04;font-size: 13px;border-radius:3px;"></span><span>&nbsp;Forest Land</span>'+
                    '<span style="padding: 0px 8px 0px 8px;color:#edd8c0;background-color:#edd8c0;font-size: 13px;border-radius:3px;margin-left: 10px;">.</span><span>&nbsp;Barren Land</span>'+
                    '<span style="padding: 0px 8px 0px 8px;color:#2f92a3;border-radius:3px;background-color:#2f92a3;font-size: 13px;margin-left: 10px;">.</span><span>&nbsp;Water Bodies</span>'+
                    '<span style="padding: 0px 8px 0px 8px;color:#bd3c11;background-color:#bd3c11;font-size: 13px;border-radius:3px;margin-left: 10px;">.</span><span>&nbsp;Built Up</span></div>')
                    domAttr.set('village_vegtpost_legend', 'innerHTML', '<div style="padding:1% 0% 3% 39%;">'+'<span style="padding: 0px 8px 0px 8px;color:#5adf5a;background-color:#5adf5a;font-size: 13px;border-radius:3px;"></span><span>&nbsp;Agriculture Land</span>'+'<div>')
                    domAttr.set("village_postcluster_legend","innerHTML",'<div style="line-height: 2em;text-align:center;padding: 1% 1%;">'+
                    '<span style="padding: 0px 8px 0px 8px;color:#047d04;background-color:#047d04;font-size: 13px;border-radius:3px;"></span><span>&nbsp;Forest Land</span>'+
                    '<span style="padding: 0px 8px 0px 8px;color:#edd8c0;background-color:#edd8c0;font-size: 13px;border-radius:3px;margin-left: 10px;">.</span><span>&nbsp;Barren Land</span>'+
                    '<span style="padding: 0px 8px 0px 8px;color:#2f92a3;border-radius:3px;background-color:#2f92a3;font-size: 13px;margin-left: 10px;">.</span><span>&nbsp;Water Bodies</span>'+
                    '<span style="padding: 0px 8px 0px 8px;color:#bd3c11;background-color:#bd3c11;font-size: 13px;border-radius:3px;margin-left: 10px;">.</span><span>&nbsp;Built Up</span></div>')
                    dojo.query('#villageLULC').style('display', 'none');
                    // lulc_postMonsoon_chart.resize(700,300);
                    window.village_level_lulcTable = village_level_preTable+village_level_postTable+"</table>";

                    window.lulc_var = lulc_var;
                    // //Code for LULC Chart in Report  **(modified from here)
                    // domAttr.set('Village_akahLulc_Chart','innerHTML','');

                    // domAttr.set("Village_lulc_legend","innerHTML",'<div style="line-height: 2em;padding-top: 25%;">'+
                    // '<span style="padding: 0px 8px 0px 6px;color:#047d04;background-color:#047d04;font-size: 13px;border-radius:3px;"></span><span>&nbsp;Forest Land</span><span style="padding-left: 40px;">- &nbsp;&nbsp;'+village_lulc_gl.toFixed(2)+' ha ('+villageLulc_table_inp['grasslands_ha_2020_per']+'%)</span><br>'+
                    // '<span style="padding: 0px 8px 0px 6px;color:#5adf5a;background-color:#5adf5a;font-size: 13px;border-radius:3px;"></span><span>&nbsp;Agriculture Land</span><span style="padding-left: 14px;">- &nbsp;&nbsp;'+village_lulc_al.toFixed(2)+' ha ('+villageLulc_table_inp['agriculture_ha_2020_per']+'%)</span><br>'+
                    // '<span style="padding: 0px 8px 0px 6px;color:#edd8c0;background-color:#edd8c0;font-size: 13px;border-radius:3px;">.</span><span>&nbsp;Barren Land</span><span style="padding-left: 34px;">- &nbsp;&nbsp;'+village_lulc_bl.toFixed(2)+' ha ('+villageLulc_table_inp['barren_land_ha_2020_per']+'%)</span><br>'+
                    // '<span style="padding: 0px 8px 0px 6px;color:#2f92a3;border-radius:3px;background-color:#2f92a3;font-size: 13px;">.</span><span>&nbsp;Water Bodies</span><span style="padding-left: 29px;">- &nbsp;&nbsp;'+village_lulc_wb.toFixed(2)+' ha ('+villageLulc_table_inp['water_bodies_ha_2020_per']+'%)</span><br>'+
                    // '<span style="padding: 0px 8px 0px 6px;color:#bd3c11;background-color:#bd3c11;font-size: 13px;border-radius:3px;">.</span><span>&nbsp;Built Up</span><span style="padding-left: 62px;">- &nbsp;&nbsp;'+village_lulc_bu.toFixed(2)+' ha ('+villageLulc_table_inp['builtup_ha_2020_per']+'%)</span></div>')
                    if(destination == "toUI"){
                      domAttr.set("lulc5yearPreM_agri", "innerHTML","")
                      domAttr.set("lulc5yearPreM_lulc", "innerHTML","")
                      domAttr.set("lulc5yearPostM_agri", "innerHTML","")
                      domAttr.set("lulc5yearPostM_lulc", "innerHTML","")
                      if(dijit.byId("show5yearCheckbox_LULC").checked){
                          if(season == "Pre"){
                            domAttr.set("lulc5yearPreM_agri", "innerHTML","")
                            domAttr.set("lulc5yearPreM_lulc", "innerHTML","")
                            dojo.query(".lulc5yearPreM_Styles").style("display","block")
                            dojo.query(".lulc5yearPostM_Styles").style("display","none")
                                      /*lulc pre-monsoon chart definition*/
                                      window.lulc_preMonsoon_chart_ui = new dojox.charting.Chart2D("lulc5yearPreM_lulc");
                                      lulc_preMonsoon_chart_ui.addPlot("stackedColumnsPlot", {type: "ClusteredColumns",markers: true,gap:5,maxBarSize: 60,labels:true, labelStyle:'outside', tension: "2",animate: { duration: 2000, easing: dojo.fx.easing.bounceInOut }});
                                      lulc_preMonsoon_chart_ui.addAxis("x", {title:"Year",dropLabels: true,titleOrientation: "away", labelSizeChange: true, majorTicks:true, majorTickStep:1, minorTicks:false, font: "normal normal bold 12px Arial", fontColor: "black",
                                        labels: villageLulc_table_inp['year_inputForChart']});
                                        lulc_preMonsoon_chart_ui.addAxis("y", {title:"Area(%)",fixLower: "major",fixUpper: "major", vertical: true});
                                      /*pre-monsoon chart for only vegetation as seperate module*/
                                      window.lulc_preMonsoonVegt_chart_ui = new dojox.charting.Chart2D("lulc5yearPreM_agri");
                                      lulc_preMonsoonVegt_chart_ui.addPlot("Pre-Vegetation", {type: "Columns",markers: true,gap:5,maxBarSize: 60, labels:true, labelStyle:'outside',tension: "2",animate: { duration: 2000, easing: dojo.fx.easing.bounceInOut }});
                                      lulc_preMonsoonVegt_chart_ui.addAxis("x", {title:"Year",dropLabels: true,titleOrientation: "away", labelSizeChange: true, majorTicks:true, majorTickStep:1, minorTicks:false, font: "normal normal bold 12px Arial", fontColor: "black",
                                        labels: villageLulc_table_inp['year_inputForChart']});
                                        minValPreAgri = villageLulc_table_inp['lulc_pre_agriculture_arr'][0].y
                                        villageLulc_table_inp['lulc_pre_agriculture_arr'].forEach(item => {
                                          if(item<= minValPreAgri){minValPreAgri= item}else{}
                                        })
                                      lulc_preMonsoonVegt_chart_ui.addAxis("y", {min: minValPreAgri-5, title:"Area(%)",fixLower: "major",fixUpper: "major", vertical: true});
                                      lulc_preMonsoonVegt_chart_ui.addSeries('agriculture', villageLulc_table_inp['lulc_pre_agriculture_arr'], {plot: "Pre-Vegetation",stroke: {color: "#FFFFFF",},fill: "#5adf5a"});
                                      lulc_preMonsoonVegt_chart_ui.title = "Long-term change in agriculture area during pre-monsoon ("+villageLulc_table_inp['year'][0]+"-"+villageLulc_table_inp['year'][villageLulc_table_inp['year'].length-1]+")"
                                      lulc_preMonsoonVegt_chart_ui.titleFont = "bold 12pt Arial"
                                      lulc_preMonsoonVegt_chart_ui.titlePos = "top"
                                      new Tooltip(lulc_preMonsoonVegt_chart_ui, "Pre-Vegetation");
                                      // var tip = new Tooltip(lulc_preMonsoonVegt_chart,"Pre-Vegetation", {
                                      //   // text: function(o){return "<b>"+villageLulc_table_inp['year_inputForChart'][o.x-1].text + "</b> : "+ (o.y).toFixed(6);}
                                      //   text: function(o){return "<b>"+villageLulc_table_inp['lulc_post_agriculture_arr'][o].y + "</b> : ";}
                                        
                                      // });
                                      //   var ttip = new Tooltip(lulc_preMonsoonVegt_chart_ui,"default", {
                                      //     text: function(villageLulc_table_inp, index){return "<b>"+villageLulc_table_inp['lulc_pre_agriculture_arr'][index].tooltip + "</b>"}
                                      // });
                                      // window.ttip = ttip;
                                      //   new Tooltip(lulc_preMonsoonVegt_chart_ui, "default", {
                                      //     text: function(o){
                                      //         return "Element at index: "+villageLulc_table_inp['lulc_pre_agriculture_arr'][o.index][y];
                                      //     }
                                      // });
                                      //   var tip = new Tooltip(lulc_preMonsoonVegt_chart_ui,"default", {
                                      //     text: function(o){return "<b>"+villageLulc_table_inp['lulc_pre_agriculture_arr'][o.x-1].y + "</b> : "+ (o.y).toFixed(6);}
                                      // });
                                      lulc_preMonsoonVegt_chart_ui.render();
                                      lulc_preMonsoonVegt_chart_ui.resize(570,300);
                                      /*village level lulc table for 5 years*/
                                      window.village_level_preTable = "<table class='lulcReportTable' style='width: 97%;margin: 50px 0px 10px 0px;'>"+"<tr><td colspan='"+(villageLulc_table_inp['year'].length+1)+"'>Land Use Land Cover area: Pre-monsoon ("+villageLulc_table_inp['year'][0]+"-"+villageLulc_table_inp['year'][villageLulc_table_inp['year'].length-1]+")</td></tr><tr>"+villageLulc_table_inp['lulc_table_th']+"</tr>";
                                      window.village_level_postTable = "<tr><td colspan='"+(villageLulc_table_inp['year'].length+1)+"'>Land Use Land Cover area: Post-monsoon ("+villageLulc_table_inp['year'][0]+"-"+villageLulc_table_inp['year'][villageLulc_table_inp['year'].length-1]+")</td></tr><tr>"+villageLulc_table_inp['lulc_table_th']+"</tr>";
                                      for(i=0;i<=villageLulc_table_inp['year'].length-1;i++){
                                        village_level_preTable = village_level_preTable+"<tr>"+villageLulc_table_inp['lulc_preTable_td_'+villageLulc_table_inp['year'][i]]+"</tr>"
                                        village_level_postTable = village_level_postTable+"<tr>"+villageLulc_table_inp['lulc_postTable_td_'+villageLulc_table_inp['year'][i]]+"</tr>"
                                      }
                                      /*lulc post-monsoon inputs*/
                                      lulc_preMonsoon_chart_ui.addSeries('grasslands', villageLulc_table_inp['lulc_pre_grasslands_arr'], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF",},fill: "#047d04"});
                                      // lulc_preMonsoon_chart.addSeries('agriculture', villageLulc_table_inp['lulc_pre_agriculture_arr'], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF",},fill: "#5adf5a"});
                                      lulc_preMonsoon_chart_ui.addSeries('water_bodies', villageLulc_table_inp['lulc_pre_water_bodies_arr'], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF",},fill: "#2f92a3"});
                                      lulc_preMonsoon_chart_ui.addSeries('builtup', villageLulc_table_inp['lulc_pre_builtup_arr'], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF",},fill: "#bd3c11"});
                                      lulc_preMonsoon_chart_ui.addSeries('barren_land', villageLulc_table_inp['lulc_pre_barren_land_arr'], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF",},fill: "#edd8c0"});
                                      /*lulc pre-monsoon title*/
                                      lulc_preMonsoon_chart_ui.title = "Long-term change in land use pattern during pre-monsoon ("+villageLulc_table_inp['year'][0]+"-"+villageLulc_table_inp['year'][villageLulc_table_inp['year'].length-1]+")"
                                      lulc_preMonsoon_chart_ui.titleFont = "bold 12pt Arial"
                                      lulc_preMonsoon_chart_ui.titlePos = "top"
                                      // new Tooltip(lulc_preMonsoon_chart_ui, "default");
                                      var tip = new Tooltip(lulc_preMonsoon_chart_ui,"stackedColumnsPlot", {
                                        text: function(o){return "<b>"+villageLulc_table_inp['year_inputForChart'][o.x].text + "</b> : "+ (o.y);}
                                      });
                                      lulc_preMonsoon_chart_ui.render();
                                      lulc_preMonsoon_chart_ui.resize(700,300);
                            // domAttr.set("lulc5yearPreM", "innerHTML",document.getElementById("Village_akahLulc_preChart").innerHTML);
                            dojo.query("#lulc5yearPreM_agri").style("display","block")
                            dojo.query("#lulc5yearPreM_lulc").style("display","block")
                            domAttr.set("lulc5yearPreM_lulc_legend","innerHTML",'<div style="line-height: 2em;">'+
                            '<span style="padding: 0px 8px 0px 8px;color:#047d04;background-color:#047d04;font-size: 13px;border-radius:3px;"></span><span>&nbsp;Forest Land</span>'+
                            '<span style="padding: 0px 8px 0px 8px;color:#edd8c0;background-color:#edd8c0;font-size: 13px;border-radius:3px;margin-left: 10px;">.</span><span>&nbsp;Barren Land</span>'+
                            '<span style="padding: 0px 8px 0px 8px;color:#2f92a3;border-radius:3px;background-color:#2f92a3;font-size: 13px;margin-left: 10px;">.</span><span>&nbsp;Water Bodies</span>'+
                            '<span style="padding: 0px 8px 0px 8px;color:#bd3c11;background-color:#bd3c11;font-size: 13px;border-radius:3px;margin-left: 10px;">.</span><span>&nbsp;Built Up</span></div>')
                            domAttr.set('lulc5yearPreM_agri_legend', 'innerHTML', '<div>'+'<span style="padding: 0px 8px 0px 8px;color:#5adf5a;background-color:#5adf5a;font-size: 13px;border-radius:3px;"></span><span>&nbsp;Agriculture Land</span>'+'<div>')
                          
                          }
                          else if(season == "Post"){
                            domAttr.set("lulc5yearPostM_agri", "innerHTML","")
                            domAttr.set("lulc5yearPostM_lulc", "innerHTML","")
                            dojo.query(".lulc5yearPreM_Styles").style("display","none")
                            dojo.query(".lulc5yearPostM_Styles").style("display","block")
                            /*lulc post-monsoon chart definition*/
                                  window.lulc_postMonsoon_chart_ui = new dojox.charting.Chart2D("lulc5yearPostM_lulc");
                                  lulc_postMonsoon_chart_ui.addPlot("stackedColumnsPlot", {type: "ClusteredColumns",markers: true,gap:5,maxBarSize: 60, labels:true, labelStyle:'outside',tension: "2",animate: { duration: 2000, easing: dojo.fx.easing.bounceInOut }});
                                  lulc_postMonsoon_chart_ui.addAxis("x", {title:"Year", dropLabels: false,titleOrientation: "away", labelSizeChange: true, majorTicks:true, majorTickStep:1, minorTicks:false, font: "normal normal bold 12px Arial", fontColor: "black",
                                    labels: villageLulc_table_inp['year_inputForChart']});
                                  lulc_postMonsoon_chart_ui.addAxis("y", {title:"Area(%)",fixLower: "major",fixUpper: "major", vertical: true});
                                  /*lulc post-monsoon chart definition*/
                                  window.lulc_postMonsoonVegt_chart_ui = new dojox.charting.Chart2D("lulc5yearPostM_agri");
                                  lulc_postMonsoonVegt_chart_ui.addPlot("Post-Vegetation", {type: "Columns",markers: true,gap:5,maxBarSize: 60, labels:true, labelStyle:'outside',tension: "2",animate: { duration: 2000, easing: dojo.fx.easing.bounceInOut }});
                                  lulc_postMonsoonVegt_chart_ui.addAxis("x", {title:"Year", dropLabels: false,titleOrientation: "away", labelSizeChange: true, majorTicks:true, majorTickStep:1, minorTicks:false, font: "normal normal bold 12px Arial", fontColor: "black",
                                    labels: villageLulc_table_inp['year_inputForChart']});
                                    minValPostAgri = villageLulc_table_inp['lulc_post_agriculture_arr'][0].y
                                    villageLulc_table_inp['lulc_post_agriculture_arr'].forEach(item => {
                                      if(item<= minValPostAgri){minValPostAgri= item}else{}
                                    })
                                  lulc_postMonsoonVegt_chart_ui.addAxis("y", {min:minValPostAgri-5,title:"Area(%)",fixLower: "major",fixUpper: "major", vertical: true});
                                  lulc_postMonsoonVegt_chart_ui.addSeries('agriculture', villageLulc_table_inp['lulc_post_agriculture_arr'], {plot: "Post-Vegetation",stroke: {color: "#FFFFFF",},fill: "#5adf5a"});
                                  lulc_postMonsoonVegt_chart_ui.title = "Long-term change in agriculture area during post-monsoon ("+villageLulc_table_inp['year'][0]+"-"+villageLulc_table_inp['year'][villageLulc_table_inp['year'].length-1]+")"
                                  lulc_postMonsoonVegt_chart_ui.titleFont = "bold 12pt Arial"
                                  lulc_postMonsoonVegt_chart_ui.titlePos = "top"
                                  var tip = new Tooltip(lulc_postMonsoonVegt_chart_ui,"Post-Vegetation");
                                  //   text: function(o){return "<b>"+villageLulc_table_inp['year_inputForChart'][o.x-1].text + "</b> : "+ (o.y);}
                                  // });
                                  lulc_postMonsoonVegt_chart_ui.render();
                                  lulc_postMonsoon_chart_ui.resize(570,300);
                                  /*lulc post-monsoon inputs*/
                                  lulc_postMonsoon_chart_ui.addSeries('grasslands', villageLulc_table_inp['lulc_post_grasslands_arr'], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF",},fill: "#047d04"});
                                  // lulc_postMonsoon_chart.addSeries('agriculture', villageLulc_table_inp['lulc_post_agriculture_arr'], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF",},fill: "#5adf5a"});
                                  lulc_postMonsoon_chart_ui.addSeries('water_bodies', villageLulc_table_inp['lulc_post_water_bodies_arr'], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF",},fill: "#2f92a3"});
                                  lulc_postMonsoon_chart_ui.addSeries('builtup', villageLulc_table_inp['lulc_post_builtup_arr'], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF",},fill: "#bd3c11"});
                                  lulc_postMonsoon_chart_ui.addSeries('barren_land', villageLulc_table_inp['lulc_post_barren_land_arr'], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF",},fill: "#edd8c0"});
                                  /*lulc post-monsoon title*/
                                  lulc_postMonsoon_chart_ui.title = "Long-term change in land use pattern during post-monsoon ("+villageLulc_table_inp['year'][0]+"-"+villageLulc_table_inp['year'][villageLulc_table_inp['year'].length-1]+")"
                                  lulc_postMonsoon_chart_ui.titleFont = "bold 12pt Arial"
                                  lulc_postMonsoon_chart_ui.titlePos = "top"
                                  var tip = new Tooltip(lulc_postMonsoon_chart_ui,"stackedColumnsPlot", {
                                    text: function(o){return "<b>"+villageLulc_table_inp['year_inputForChart'][o.x].text + "</b> : "+ (o.y).toFixed(6);}
                              });
                                  lulc_postMonsoon_chart_ui.render();
                                  lulc_postMonsoon_chart_ui.resize(700,300);
                                  dojo.query("#lulc5yearPostM_agri").style("display","block")
                                  dojo.query("#lulc5yearPostM_lulc").style("display","block")
                                  domAttr.set("lulc5yearPostM_lulc_legend","innerHTML",'<div style="line-height: 2em;">'+
                                  '<span style="padding: 0px 8px 0px 8px;color:#047d04;background-color:#047d04;font-size: 13px;border-radius:3px;"></span><span>&nbsp;Forest Land</span>'+
                                  '<span style="padding: 0px 8px 0px 8px;color:#edd8c0;background-color:#edd8c0;font-size: 13px;border-radius:3px;margin-left: 10px;">.</span><span>&nbsp;Barren Land</span>'+
                                  '<span style="padding: 0px 8px 0px 8px;color:#2f92a3;border-radius:3px;background-color:#2f92a3;font-size: 13px;margin-left: 10px;">.</span><span>&nbsp;Water Bodies</span>'+
                                  '<span style="padding: 0px 8px 0px 8px;color:#bd3c11;background-color:#bd3c11;font-size: 13px;border-radius:3px;margin-left: 10px;">.</span><span>&nbsp;Built Up</span></div>')
                                  domAttr.set('lulc5yearPostM_agri_legend', 'innerHTML', '<div>'+'<span style="padding: 0px 8px 0px 8px;color:#5adf5a;background-color:#5adf5a;font-size: 13px;border-radius:3px;"></span><span>&nbsp;Agriculture Land</span>'+'<div>')
                          }
                        }
                    }
                  });
                //Query for Default LULC Village Chart ends here -- Level3
                
    },
    validateToGenerateNDWIChart: function(){
      if (dijit.byId('searchVillageAKAH').value != "" && akah_ndwifrommonth !="0" && akah_ndwifromyear !="Year" && akah_ndwitomonth !="0" && akah_ndwitoyear != "Year") {
        akah_Tool.akah_chartGenerateNDWI("all")
      }
      else if(akah_Tool.map.graphics.graphics.length > 0){
       if (dijit.byId('searchVillageAKAH').value === "" && (akah_Tool.map.graphics.graphics[0].symbol != undefined) && (akah_ndwifrommonth !="0" && akah_ndwifromyear !="Year" && akah_ndwitomonth !="0" && akah_ndwitoyear != "Year")) {
          new QueryTask(akah_villages_layer.url).execute(queryChart, function(akah_villageResponse){
            window.akah_searchResponse = akah_villageResponse.features[0];
            akah_Tool.akah_chartGenerateNDWI("all")
          });
      }
     }
      else{
        domAttr.set("ndwiLineCharts_info","innerHTML","");
        domAttr.set("ndwiareaLineCharts_info","innerHTML","");
        domAttr.set("ndwi_legend","innerHTML","");
        domAttr.set("ndwiarea_legend","innerHTML","");
      }
    },

    validateToGenerateNDVIChart: function(){
      if (dijit.byId('searchVillageAKAH').value != "" && akah_ndvifrommonth !="0" && akah_ndvifromyear !="Year" && akah_ndvitomonth !="0" && akah_ndvitoyear != "Year") {
        akah_Tool.akah_chartGenerateNDVI("all")
      }
      else if(akah_Tool.map.graphics.graphics.length > 0){
       if (dijit.byId('searchVillageAKAH').value === "" && (akah_Tool.map.graphics.graphics[0].symbol != undefined) && (akah_ndvifrommonth !="0" && akah_ndvifromyear !="Year" && akah_ndvitomonth !="0" && akah_ndvitoyear != "Year")) {
          new QueryTask(akah_villages_layer.url).execute(queryChart, function(akah_villageResponse){
            window.akah_searchResponse = akah_villageResponse.features[0];
            akah_Tool.akah_chartGenerateNDVI("all")
          });
      }
    }
      else{
        domAttr.set("ndviLineCharts_info","innerHTML","");
        domAttr.set("ndviareaLineCharts_info","innerHTML","");
        domAttr.set("ndviarea_legend","innerHTML","");
      }
    },

    akah_chartGenerateNDWI: function(category){
      if((Number(akah_ndwitoyear) < Number(akah_ndwifromyear) )|| ((Number(akah_ndwitoyear) == Number(akah_ndwifromyear)) && (Number(akah_ndwifrommonth) > Number(akah_ndwitomonth))) || ((Number(akah_ndwifrommonth) == Number(akah_ndwitomonth)) && (Number(akah_ndwifromyear) > Number(akah_ndwitoyear))) || ((Number(akah_ndwifrommonth) === Number(akah_ndwitomonth)) && (Number(akah_ndwifromyear) === Number(akah_ndwitoyear)))){
        domAttr.set("yearrangewarning_ndwi","innerHTML",'<p style="letter-spacing:0.5px;color: darkorange;font-size: 13px;line-height:0em;"><b>Note:</b>From year&month should be less than To year&month</p>')
       if(dijit.byId("ndwi_inp").checked == true)
        dojo.query(".NDWICategory").style("display","block");
        domAttr.set("ndwiLineCharts_info","innerHTML",'')
        domAttr.set("ndwiareaLineCharts_info","innerHTML",'')
        dojo.query("#ndwi_checkboxtable").style("display","none");
        dojo.query("#ndwiarea_checkboxtable").style("display","none");
        dojo.query('#ndwi_legend').style('display','none')
        dojo.query('#ndwiarea_legend').style('display','none')
      }
      else{
            domAttr.set("yearrangewarning_ndwi","innerHTML",'')
            var ndwi_response = "";
            window.ndwi_response = ndwi_response;
            ndwidateLabels=[];ndwi_minarray=[];ndwi_maxarray=[];ndwi_meanarray=[];ndwi_sdarray=[];ndwi_reglineInpArray=[];
            window.ndwidateLabels=ndwidateLabels;window.ndwi_minarray=ndwi_minarray;window.ndwi_maxarray=ndwi_maxarray;window.ndwi_meanarray=ndwi_meanarray;window.ndwi_sdarray=ndwi_sdarray;window.ndwi_reglineInpArray=ndwi_reglineInpArray;
            ndwi_waterarray=[];ndwi_swaterarray=[];window.ndwi_waterarray=ndwi_waterarray;window.ndwi_swaterarray=ndwi_swaterarray;
            akah_villages_layer.setVisibility(true);
            var queryNDWI = new Query()
            // queryNDWI.where="year between "+akah_ndwifromyear+" and "+akah_ndwitoyear+"and month between "+akah_ndwifrommonth+"and "+akah_ndwitomonth+" and village_pk like "+akah_searchResponse.attributes.village_pk;
            var queryStr = akah_Tool.getQueryStrBtnYears(Number(akah_ndwifromyear),Number(akah_ndwitoyear), Number(akah_ndwifrommonth), Number(akah_ndwitomonth));
            queryNDWI.where= queryStr + " and village like '"+akah_searchResponse.attributes.village+"'";
            queryNDWI.returnDistinctValues=false;
            queryNDWI.returnGeometry=true;
            queryNDWI.orderByFields = ["year ASC"];
            queryNDWI.outFields=["village_pk","month","year","min","max","mean","stddev","water_percent","water_sw_percent"]
            if(category == "index" || category == "all"){
                domAttr.set("ndwiLineCharts_info","innerHTML",'<img src="'+image_path+'" class="load_image" alt="Loading.." style="margin-top:24%;width:100px;">');
                dijit.byId("maxCheckBox_ndwi").disabled = true
                dijit.byId("meanCheckBox_ndwi").disabled = true
                dijit.byId("minCheckBox_ndwi").disabled = true
                dijit.byId("standardCheckBox_ndwi").disabled = true
                dojo.query("#maxCheckBox_ndwi").style({"cursor":"wait"});
                dojo.query("#meanCheckBox_ndwi").style("cursor", "wait");
                dojo.query("#minCheckBox_ndwi").style("cursor", "wait");
                dojo.query("#standardCheckBox_ndwi").style("cursor", "wait");
            }
            if(category == "area" || category == "all"){
                if(category == "area"){
                  domAttr.set("ndwiareaLineCharts_info","innerHTML",'<img src="'+image_path+'" class="load_image" alt="Loading.." style="margin-top:24%;width:100px;">');
                }
                dijit.byId("waterCheckBox_ndwi").disabled = true
                // dijit.byId("swaterCheckBox_ndwi").disabled = true
                dojo.query("#waterCheckBox_ndwi").style("cursor", "wait");
                // dojo.query("#swaterCheckBox_ndwi").style("cursor", "wait");
            }
            new QueryTask(ndwi_statistics_url).execute(queryNDWI, function(ndwi_response){
                ndwi_response.features.forEach(function(ndwi_resp, ndwi_index){
                    ndwi_response.fields.forEach(function(evt, index){
                      var fieldname = evt.name;
                    if (fieldname.includes("year") ||fieldname.includes("month") || fieldname.includes("min")||fieldname.includes("max")||fieldname.includes("mean")||fieldname.includes("stddev") || fieldname.includes("water_percent") || fieldname.includes("water_sw_percent")){
                            if(fieldname.includes("year") || fieldname.includes("month")){
                                if(fieldname.includes("month")&& ndwi_resp.attributes[fieldname] != ""){
                                    ndwidateLabels.push({text:akah_Tool.month_function(ndwi_resp.attributes.month), value:ndwi_index+1})
                                  }
                                  if(fieldname.includes("year")&& ndwi_resp.attributes[fieldname] != ""){
                                    ndwidateLabels[ndwi_index].text = ndwidateLabels[ndwi_index].text + "_"+ndwi_resp.attributes.year
                                  }
                            }
                        else if(fieldname.includes("min") && ndwi_resp.attributes[fieldname] != null)
                        {ndwi_minarray.push(ndwi_resp.attributes[fieldname]);}
                        else if(fieldname.includes("max") && ndwi_resp.attributes[fieldname] != null)
                        {ndwi_maxarray.push(ndwi_resp.attributes[fieldname]);}
                        else if(fieldname.includes("mean") && ndwi_resp.attributes[fieldname] != null)
                        {ndwi_meanarray.push(ndwi_resp.attributes[fieldname]);
                        ndwi_reglineInpArray.push(ndwi_index+1);
                        }
                        else if(fieldname.includes("stddev") && ndwi_resp.attributes[fieldname] != null)
                        {ndwi_sdarray.push(ndwi_resp.attributes[fieldname]);}
                        else if(fieldname.includes("water_percent") && ndwi_resp.attributes[fieldname] != null)
                        {ndwi_waterarray.push(ndwi_resp.attributes[fieldname]);}
                        // else if(fieldname.includes("water_sw_percent") && ndwi_resp.attributes[fieldname] != null)
                        // {ndwi_swaterarray.push(ndwi_resp.attributes[fieldname]);}
                      }
                    });
                });
                if(category == "index" || category == "all"){
                            dojo.setAttr('ndwiLineCharts_info', 'innerHTML', '')
                            dojo.setAttr('ndwiLineCharts_info_reportMean', 'innerHTML', '')
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
                            ndwichart.addAxis("x", { includeZero: false, fixLower: "major", fixUpper: "major", natural: false, vertical: false, rotation: 90, title: "Date", titleFontColor: "black",
                            labels: ndwidateLabels, titleOrientation: "away", majorLabels: true,majorTicks:true,majorTickStep:1,minorTicks:false});
                            ndwichart.addAxis("y", { min : -1, max:1,vertical: true, fixLower: "minor", fixUpper: "minor", title: "Value", titleFontColor: "black",minorTicks:true});
                            if(dijit.byId("meanCheckBox_ndwi").checked ===true){
                                ndwichart.addSeries("Mean", ndwi_meanarray,{plot: "default", stroke: {color:"#0077BB", width:2}}); //min:
                            }
                            if(dijit.byId("maxCheckBox_ndwi").checked ===true){
                                ndwichart.addSeries("Max", ndwi_maxarray,{plot: "default", stroke: {color:"#025482", width:2},markers:true,marker: "m-3,0 c0,-4 6,-4 6,0 m-6,0 c0,4 6,4 6,0" }); //min:
                            }
                            if(dijit.byId("minCheckBox_ndwi").checked===true){
                                ndwichart.addSeries("Min", ndwi_minarray,{plot: "default", stroke: {color:"#09A2F9", width:2}}); //min: 0, max: Math.max.apply(null, a),
                            }
                            if(dijit.byId("standardCheckBox_ndwi").checked===true){
                                ndwichart.addSeries("Sd", ndwi_sdarray,{plot: "default", stroke: {color:"#87D2FC", width:2} }); //min:
                            }
                                new Tooltip(ndwichart, "default", {
                                text: function(o){
                                    return "Element at index: "+o.index;
                                }
                            });
                            ndwichart.title = "Surface Water Index"
                            ndwichart.titleFont= "bold 12pt Arial"
                            ndwichart.titlePos = "top"
                            ndwichart.titleGap = 10
                            ndwichart.render();
                            ndwichart.resize(450,230);
                            window.ndwichart = ndwichart
                            dojo.query("#pr_load").style("display","none");
                                var zoom_pan = new MouseZoomAndPan(ndwichart, "default", {axis: "x"});
                                var mag = new Magnify(ndwichart,"default");
                                // var tool = new Tooltip(ndwichart, "default"); 
                                var tip = new Tooltip(ndwichart,"default", {
                                                text: function(o){return "<b>"+ndwidateLabels[o.x-1].text + "</b> : "+ (o.y).toFixed(6);}
                                            });


                                            //code for plotting regression line/ trendline for ndwi_report for selected location
                                            var array_xy_ndwi_loc = [];       // creating x * y array
                                            var array_xx_ndwi_loc = [];
                                            for(var i = 0; i<ndwi_meanarray.length; i++){
                                            array_xy_ndwi_loc.push(ndwi_meanarray[i] * ndwi_reglineInpArray[i]);
                                            array_xx_ndwi_loc.push(ndwi_reglineInpArray[i] * ndwi_reglineInpArray[i]);
                                            }
                                            m =  (((dojox.math.stats.mean(ndwi_reglineInpArray) * dojox.math.stats.mean(ndwi_meanarray)) - dojox.math.stats.mean(array_xy_ndwi_loc)) /
                                            ((dojox.math.stats.mean(ndwi_reglineInpArray) * dojox.math.stats.mean(ndwi_reglineInpArray)) - dojox.math.stats.mean(array_xx_ndwi_loc)));
                                            b=(dojox.math.stats.mean(ndwi_meanarray) - dojox.math.stats.mean(ndwi_reglineInpArray)*m);

                                            window.reg_line_ndwi_loc = [];
                                            for(var x = 0; x<ndwi_reglineInpArray.length; x++){
                                            reg_line_ndwi_loc.push((m*ndwi_reglineInpArray[x]) + b);
                                            }
                                            var ndwichart_default = new Chart("ndwiLineCharts_info_reportMean");
                                            ndwichart_default.addPlot("default", {type: LinesPlot,markers: true,tension: "S",marker: "m-3,0 c0,-4 6,-4 6,0 m-6,0 c0,4 6,4 6,0" });
                                            ndwichart_default.addPlot("Trend", {type: LinesPlot,markers: false,tension: "S"});
                                            ndwichart_default.addAxis("x", { includeZero: false, fixLower: "major", fixUpper: "major", natural: false, vertical: false, rotation: 90, title: "Date", titleFontColor: "black",
                                            labels: ndwidateLabels, titleOrientation: "away", majorLabels: true,majorTicks:true,majorTickStep:1,minorTicks:false});
                                            ndwichart_default.addAxis("y", { min : -1, max:1,vertical: true, fixLower: "minor", fixUpper: "minor", title: "Value", titleFontColor: "black",minorTicks:true});
                                            ndwichart_default.addSeries("Mean", ndwi_meanarray,{plot: "default", stroke: {color:"#0077BB", width:2}}); //min:
                                            ndwichart_default.addSeries("Trend", reg_line_ndwi_loc,{plot: "Trend", stroke: {color:"#114C6E", width:2}}); //min:
                                            // ndwichart_default.title = "Normalized Difference Water Index"
                                            // ndwichart_default.titleFont= "bold 12pt Avenir Light"
                                            // ndwichart_default.titlePos = "top"
                                            // ndwichart_default.titleGap = 10
                                            ndwichart_default.render();
                                domAttr.set("ndwi_legend","innerHTML",'<table style="line-height: 2em;padding-top: 40%;padding-left:5%;">'+
                                '<tr><td><span style="padding: 0px 8px 0px 6px;color:#025482;background-color:#025482;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Maximum</td></tr>'+
                                '<tr><td><span style="padding: 0px 8px 0px 6px;color:#0077BB;background-color:#0077BB;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Mean</td></tr>'+
                                '<tr><td><span style="padding: 0px 8px 0px 6px;color:#09A2F9;background-color:#09A2F9;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Minimum</td></tr>'+
                                '<tr style="vertical-align:baseline;"><td><span style="padding: 0px 8px 0px 6px;color:#87D2FC;background-color:#87D2FC;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;line-height: 1.4em;">Standard deviation</td></tr></table>')
                                dojo.query("#ndwi_checkboxtable").style("display","block");
                                dojo.query('#ndwi_legend').style('display','block')
                }
                if(category == "area" || category == "all"){
                    dojo.setAttr('ndwiareaLineCharts_info', 'innerHTML', '')
                    dojo.setAttr('ndwiareaLineCharts_info_reportMean', 'innerHTML', '')
                    dijit.byId("waterCheckBox_ndwi").disabled = false
                    // dijit.byId("swaterCheckBox_ndwi").disabled = false
                    dojo.query("#waterCheckBox_ndwi").style("cursor", "default");
                    // dojo.query("#swaterCheckBox_ndwi").style("cursor", "default");

                    var ndwiareachart = new Chart("ndwiareaLineCharts_info");
                    ndwiareachart.addPlot("default", {type: LinesPlot,markers: true,tension: "S",marker: "m-3,0 c0,-4 6,-4 6,0 m-6,0 c0,4 6,4 6,0" });
                    ndwiareachart.addAxis("x", { includeZero: false, fixLower: "major", fixUpper: "major", natural: false, vertical: false, rotation: 90, title: "Date", titleFontColor: "black",
                    labels: ndwidateLabels, titleOrientation: "away", majorLabels: true,majorTicks:true,majorTickStep:1,minorTicks:false});
                    ndwiareachart.addAxis("y", { min : 0, max:Math.max.apply(null,ndwi_waterarray)+1,vertical: true, fixLower: "minor", fixUpper: "minor", title: "Value", titleFontColor: "black",minorTicks:true});
                    if(dijit.byId("waterCheckBox_ndwi").checked ===true){
                        ndwiareachart.addSeries("Water", ndwi_waterarray,{plot: "default", stroke: {color:"#0077BB", width:2}}); //min:
                    }
                    // if(dijit.byId("swaterCheckBox_ndwi").checked ===true){
                    //     ndwiareachart.addSeries("Surface Water", ndwi_swaterarray,{plot: "default", stroke: {color:"#025482", width:2},markers:true,marker: "m-3,0 c0,-4 6,-4 6,0 m-6,0 c0,4 6,4 6,0" }); //min:
                    // }
                        new Tooltip(ndwiareachart, "default", {
                        text: function(o){
                            return "Element at index: "+o.index;
                        }
                    });
                    ndwiareachart.title = "Surface Water Area"
                    ndwiareachart.titleFont= "bold 14px Arial"
                    ndwiareachart.titlePos = "top"
                    ndwiareachart.titleGap = 10
                    ndwiareachart.render();
                    ndwiareachart.resize(450,230);
                    window.ndwiareachart = ndwiareachart
                    dojo.query("#pr_load").style("display","none");
                        var zoom_pan = new MouseZoomAndPan(ndwiareachart, "default", {axis: "x"});
                        var mag = new Magnify(ndwiareachart,"default");
                        var tip = new Tooltip(ndwiareachart,"default", {
                                        text: function(o){return "<b>"+ndwidateLabels[o.x-1].text + "</b> : "+ (o.y).toFixed(6);}
                                    });
                                    //code for plotting regression line/ trendline for ndwi_report for selected location
                                    // var array_xy_ndwi_loc = [];       // creating x * y array
                                    // var array_xx_ndwi_loc = [];
                                    // for(var i = 0; i<ndwi_meanarray.length; i++){
                                    // array_xy_ndwi_loc.push(ndwi_meanarray[i] * ndwi_reglineInpArray[i]);
                                    // array_xx_ndwi_loc.push(ndwi_reglineInpArray[i] * ndwi_reglineInpArray[i]);
                                    // }
                                    // m =  (((dojox.math.stats.mean(ndwi_reglineInpArray) * dojox.math.stats.mean(ndwi_meanarray)) - dojox.math.stats.mean(array_xy_ndwi_loc)) /
                                    // ((dojox.math.stats.mean(ndwi_reglineInpArray) * dojox.math.stats.mean(ndwi_reglineInpArray)) - dojox.math.stats.mean(array_xx_ndwi_loc)));
                                    // b=(dojox.math.stats.mean(ndwi_meanarray) - dojox.math.stats.mean(ndwi_reglineInpArray)*m);

                                    // window.reg_line_ndwi_loc = [];
                                    // for(var x = 0; x<ndwi_reglineInpArray.length; x++){
                                    // reg_line_ndwi_loc.push((m*ndwi_reglineInpArray[x]) + b);
                                    // }
                                    var ndwiareachart_default = new Chart("ndwiareaLineCharts_info_reportMean");
                                    ndwiareachart_default.addPlot("default", {type: LinesPlot,markers: true,tension: "S",marker: "m-3,0 c0,-4 6,-4 6,0 m-6,0 c0,4 6,4 6,0" });
                                    ndwiareachart_default.addPlot("Trend", {type: LinesPlot,markers: false,tension: "S"});
                                    ndwiareachart_default.addAxis("x", { includeZero: false, fixLower: "major", fixUpper: "major", natural: false, vertical: false, rotation: 90, title: "Date", titleFontColor: "black",
                                    labels: ndwidateLabels, titleOrientation: "away", majorLabels: true,majorTicks:true,majorTickStep:1,minorTicks:false});
                                    ndwiareachart_default.addAxis("y", { min : 0, max: (Math.max.apply(null,ndwi_waterarray))+1,vertical: true, fixLower: "minor", fixUpper: "minor", title: "Value", titleFontColor: "black",minorTicks:true});
                                    ndwiareachart_default.addSeries("Water", ndwi_waterarray,{plot: "default", stroke: {color:"#0077BB", width:2}}); //min:
                                    // ndwiareachart_default.addSeries("Surface Water", ndwi_swaterarray,{plot: "default", stroke: {color:"#025482", width:2}}); //min:
                                    // ndwiareachart_default.addSeries("Trend", reg_line_ndwi_loc,{plot: "Trend", stroke: {color:"#114C6E", width:2}}); //min:
                                    ndwiareachart_default.title = "Surface Water Area"
                                    ndwiareachart_default.titleFont= "bold 14px Arial"
                                    ndwiareachart_default.titlePos = "top"
                                    ndwiareachart_default.titleGap = 10
                                    ndwiareachart_default.render();
                                    domAttr.set("ndwiarea_legend","innerHTML",'<table style="line-height: 2em;padding-top: 40%;padding-left:5%;">'+
                                    '<tr><td><span style="padding: 0px 8px 0px 6px;color:#0077BB;background-color:#0077BB;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Water(%)</td></tr></table>')
                                    // '<tr><td><span style="padding: 0px 8px 0px 6px;color:#025482;background-color:#025482;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;width:97px;">Surface Water</td></tr></table>')
                                    dojo.query("#ndwiarea_checkboxtable").style("display","block");
                                    dojo.query('#ndwiarea_legend').style('display','block')
                    }
            });
          }
    },

    akah_chartGenerateNDVI: function(category){
      if((Number(akah_ndvitoyear) < Number(akah_ndvifromyear) )|| ((Number(akah_ndvitoyear) == Number(akah_ndvifromyear)) && (Number(akah_ndvifrommonth) > Number(akah_ndvitomonth))) || ((Number(akah_ndvifrommonth) == Number(akah_ndvitomonth)) && (Number(akah_ndvifromyear) > Number(akah_ndvitoyear))) || ((Number(akah_ndvifrommonth) === Number(akah_ndvitomonth)) && (Number(akah_ndvifromyear) === Number(akah_ndvitoyear)))){
        domAttr.set("yearrangewarning_ndvi","innerHTML",'<p style="letter-spacing:0.5px;color: darkorange;font-size: 13px;line-height:0em;"><b>Note:</b>From year&month should be less than To year&month</p>')
        if(dijit.byId("ndvi_inp").checked == true)
        dojo.query(".NDVICategory").style("display","block");
        domAttr.set("ndviLineCharts_info","innerHTML",'')
        domAttr.set("ndviareaLineCharts_info","innerHTML",'')
        dojo.query("#ndvi_checkboxtable").style("display","none");
        dojo.query("#ndviarea_checkboxtable").style("display","none");
        dojo.query('#ndvi_legend').style('display','none')
        dojo.query('#ndviarea_legend').style('display','none')
      }
      else{
              domAttr.set("yearrangewarning_ndvi","innerHTML",'')
              var ndvi_response = "";
              window.ndvi_response = ndvi_response;
              ndvidateLabels=[];ndvi_minarray=[];ndvi_maxarray=[];ndvi_meanarray=[];ndvi_sdarray=[];ndvi_reglineInpArray=[];
              window.ndvidateLabels=ndvidateLabels;window.ndvi_minarray=ndvi_minarray;window.ndvi_maxarray=ndvi_maxarray;window.ndvi_meanarray=ndvi_meanarray;window.ndvi_sdarray=ndvi_sdarray;window.ndvi_reglineInpArray=ndvi_reglineInpArray;
              ndvi_densearray=[];ndvi_sparsearray=[];ndvi_lowarray=[];window.ndvi_densearray=ndvi_densearray;window.ndvi_lowarray=ndvi_lowarray;window.ndvi_sparsearray=ndvi_sparsearray;
              akah_villages_layer.setVisibility(true);
              var queryNDVI = new Query()
              // queryNDVI.where="year between "+akah_ndvifromyear+" and "+akah_ndvitoyear+"and month between "+akah_ndvifrommonth+"and "+akah_ndvitomonth+" and village_pk like "+akah_searchResponse.attributes.village_pk;
              var queryStr = akah_Tool.getQueryStrBtnYears(Number(akah_ndvifromyear),Number(akah_ndvitoyear), Number(akah_ndvifrommonth), Number(akah_ndvitomonth));
              queryNDVI.where= queryStr + " and village like '"+akah_searchResponse.attributes.village+"'";
              queryNDVI.returnDistinctValues=false;
              queryNDVI.returnGeometry=true;
              queryNDVI.orderByFields = ["year ASC"];
              queryNDVI.outFields=["village_pk","month","year","min","max","mean","stddev","dense_percent","sparse_percent","low_percentage"]
              if(category == "index" || category == "all"){
                domAttr.set("ndviLineCharts_info","innerHTML",'<img src="'+image_path+'" class="load_image" alt="Loading.." style="margin-top:24%;width:100px;">');
                dijit.byId("maxCheckBox_ndvi").disabled = true
                dijit.byId("meanCheckBox_ndvi").disabled = true
                dijit.byId("minCheckBox_ndvi").disabled = true
                dijit.byId("standardCheckBox_ndvi").disabled = true
                dojo.query("#maxCheckBox_ndvi").style("cursor", "wait");
                dojo.query("#meanCheckBox_ndvi").style("cursor", "wait");
                dojo.query("#minCheckBox_ndvi").style("cursor", "wait");
                dojo.query("#standardCheckBox_ndvi").style("cursor", "wait");
              }
              if(category == "area" || category == "all"){
                if(category == "area"){
                  domAttr.set("ndviareaLineCharts_info","innerHTML",'<img src="'+image_path+'" class="load_image" alt="Loading.." style="margin-top:24%;width:100px;">');
                }
                dijit.byId("denseCheckBox_ndvi").disabled = true
                dijit.byId("sparseCheckBox_ndvi").disabled = true
                dijit.byId("lowCheckBox_ndvi").disabled = true
                dojo.query("#denseCheckBox_ndvi").style("cursor", "wait");
                dojo.query("#sparseCheckBox_ndvi").style("cursor", "wait");
                dojo.query("#lowCheckBox_ndvi").style("cursor", "wait");
              }
                window.ndvi_chart_result=new QueryTask(ndvi_statistics_url).execute(queryNDVI, function(ndvi_response){
                  ndvi_response.features.forEach(function(ndvi_resp, ndvi_index){
                      ndvi_response.fields.forEach(function(evt, index){
                        var fieldname = evt.name;
                        if (fieldname.includes("year") ||fieldname.includes("month") || fieldname.includes("min")||fieldname.includes("max")||fieldname.includes("mean")||fieldname.includes("stddev") || fieldname.includes("dense_percent") || fieldname.includes("sparse_percent") || fieldname.includes("low_percentage")){
                          if(fieldname.includes("year") || fieldname.includes("month")){
                              if(fieldname.includes("month")&& ndvi_resp.attributes[fieldname] != ""){
                                  ndvidateLabels.push({text:akah_Tool.month_function(ndvi_resp.attributes.month), value:ndvi_index+1})
                                }
                                if(fieldname.includes("year")&& ndvi_resp.attributes[fieldname] != ""){
                                  ndvidateLabels[ndvi_index].text = ndvidateLabels[ndvi_index].text + "_"+ndvi_resp.attributes.year
                                }
                          }
                          else if(fieldname.includes("min") && ndvi_resp.attributes[fieldname] != null)
                          {ndvi_minarray.push(ndvi_resp.attributes[fieldname]);}
                          else if(fieldname.includes("max") && ndvi_resp.attributes[fieldname] != null)
                          {ndvi_maxarray.push(ndvi_resp.attributes[fieldname]);}
                          else if(fieldname.includes("mean") && ndvi_resp.attributes[fieldname] != null)
                          {ndvi_meanarray.push(ndvi_resp.attributes[fieldname]);
                          ndvi_reglineInpArray.push(ndvi_index+1);
                          }
                          else if(fieldname.includes("stddev") && ndvi_resp.attributes[fieldname] != null)
                          {ndvi_sdarray.push(ndvi_resp.attributes[fieldname]);}
                          else if(fieldname.includes("dense_percent") && ndvi_resp.attributes[fieldname] != null)
                          {ndvi_densearray.push(ndvi_resp.attributes[fieldname]);}
                          else if(fieldname.includes("sparse_percent") && ndvi_resp.attributes[fieldname] != null)
                          {ndvi_sparsearray.push(ndvi_resp.attributes[fieldname]);}
                          else if(fieldname.includes("low_percentage") && ndvi_resp.attributes[fieldname] != null)
                          {ndvi_lowarray.push(ndvi_resp.attributes[fieldname]);}
                        }
                      });
                  });
                  //ndvi chart includes all lines
                  if(category == "index" || category == "all"){
                              dojo.setAttr('ndviLineCharts_info', 'innerHTML', '')
                              dojo.setAttr('ndviLineCharts_info_reportMean', 'innerHTML', '')
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
                              ndvichart.addAxis("x", { includeZero: false, fixLower: "major", fixUpper: "major", natural: false, vertical: false, rotation: 90, title: "Date", titleFontColor: "black",
                              labels: ndvidateLabels, titleOrientation: "away", majorLabels: true,majorTicks:true,majorTickStep:1,minorTicks:false});
                              ndvichart.addAxis("y", { min : -1, max:1,vertical: true, fixLower: "minor", fixUpper: "minor", title: "Value", titleFontColor: "black",minorTicks:true});
                              if(dijit.byId("meanCheckBox_ndvi").checked){
                                ndvichart.addSeries("Mean", ndvi_meanarray,{plot: "default", stroke: {color:"#00AA17", width:2}}); //min:
                              }
                              if(dijit.byId("maxCheckBox_ndvi").checked){
                                ndvichart.addSeries("Max", ndvi_maxarray,{plot: "default", stroke: {color:"#007E11", width:2},markers:true,marker: "m-3,0 c0,-4 6,-4 6,0 m-6,0 c0,4 6,4 6,0" }); //min:
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
                                ndvichart.title = "Vegetation Index"
                                ndvichart.titleFont= "bold 12pt Arial"
                                ndvichart.titlePos = "top"
                                ndvichart.titleGap = 10
                                ndvichart.render();
                                ndvichart.resize(450,230);
                                window.ndvichart = ndvichart
                                var zoom_pan = new MouseZoomAndPan(ndvichart, "default", {axis: "x"});
                                var mag = new Magnify(ndvichart,"default");
                                  // var tool = new Tooltip(ndvichart, "default"); 
                                var tip = new Tooltip(ndvichart,"default", {
                                      text: function(o){return "<b>"+ndvidateLabels[o.x-1].text + "</b> : "+ (o.y).toFixed(6);}
                                });
                                //code for plotting regression line/ trendline for ndwi_report for selected location
                                var array_xy_ndvi_loc = [];       // creating x * y array
                                var array_xx_ndvi_loc = [];
                                for(var i = 0; i<ndvi_meanarray.length; i++){
                                  array_xy_ndvi_loc.push(ndvi_meanarray[i] * ndvi_reglineInpArray[i]);
                                  array_xx_ndvi_loc.push(ndvi_reglineInpArray[i] * ndvi_reglineInpArray[i]);
                                }
                                m =  (((dojox.math.stats.mean(ndvi_reglineInpArray) * dojox.math.stats.mean(ndvi_meanarray)) - dojox.math.stats.mean(array_xy_ndvi_loc)) /
                                  ((dojox.math.stats.mean(ndvi_reglineInpArray) * dojox.math.stats.mean(ndvi_reglineInpArray)) - dojox.math.stats.mean(array_xx_ndvi_loc)));
                                b=(dojox.math.stats.mean(ndvi_meanarray) - dojox.math.stats.mean(ndvi_reglineInpArray)*m);

                                window.reg_line_ndvi_loc = [];
                                for(var x = 0; x<ndvi_reglineInpArray.length; x++){
                                reg_line_ndvi_loc.push((m*ndvi_reglineInpArray[x]) + b);
                                }
                                var ndvichart_default = new Chart("ndviLineCharts_info_reportMean");
                                ndvichart_default.addPlot("default", {type: LinesPlot,markers: true,tension: "S",marker: "m-3,0 c0,-4 6,-4 6,0 m-6,0 c0,4 6,4 6,0" });
                                ndvichart_default.addPlot("Trend", {type: LinesPlot,markers: false,tension: "S"});
                                ndvichart_default.addAxis("x", { includeZero: false, fixLower: "major", fixUpper: "major", natural: false, vertical: false, rotation: -45, title: "Date", titleFontColor: "black",
                                labels: ndvidateLabels, titleOrientation: "away", majorLabels: true,majorTicks:true,majorTickStep:1,minorTicks:false});
                                ndvichart_default.addAxis("y", { min : -1, max:1,vertical: true, fixLower: "minor", fixUpper: "minor", title: "Value", titleFontColor: "black",minorTicks:true});
                                ndvichart_default.addSeries("Mean", ndvi_meanarray,{plot: "default", stroke: {color:"#00AA17", width:2}}); //min:
                                ndvichart_default.addSeries("Trend", reg_line_ndvi_loc,{plot: "Trend", stroke: {color:"#215D2B", width:2}}); //min:
                                // ndvichart_default.title = "Normalized Difference Vegetation Index"
                                // ndvichart_default.titleFont= "bold 12pt Avenir Light"
                                // ndvichart_default.titlePos = "top"
                                // ndvichart_default.titleGap = 10
                                ndvichart_default.render();
                                domAttr.set("ndvi_legend","innerHTML",'<table style="line-height: 2em;padding-top: 40%;padding-left:5%;">'+
                                '<tr><td><span style="padding: 0px 8px 0px 6px;color:#007E11;background-color:#007E11;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Maximum</td></tr>'+
                                '<tr><td><span style="padding: 0px 8px 0px 6px;color:#00AA17;background-color:#00AA17;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Mean</td></tr>'+
                                '<tr><td><span style="padding: 0px 8px 0px 6px;color:#00E21F;background-color:#00E21F;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Minimum</td></tr>'+
                                '<tr style="vertical-align:baseline;"><td><span style="padding: 0px 8px 0px 6px;color:#C4E300;background-color:#C4E300;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;line-height:1.4em;">Standard deviation</td></tr></table>')
                                dojo.query("#ndvi_checkboxtable").style("display","block");
                                dojo.query('#ndvi_legend').style('display','block')
                  }
                  if(category == "area" || category == "all"){
                      //ndvi area chart
                      dojo.setAttr('ndviareaLineCharts_info', 'innerHTML', '')
                      dojo.setAttr('ndviareaLineCharts_info_reportMean', 'innerHTML', '')
                      dijit.byId("denseCheckBox_ndvi").disabled = false
                      dijit.byId("sparseCheckBox_ndvi").disabled = false
                      dijit.byId("lowCheckBox_ndvi").disabled = false
                      dojo.query("#denseCheckBox_ndvi").style("cursor", "default");
                      dojo.query("#sparseCheckBox_ndvi").style("cursor", "default");
                      dojo.query("#lowCheckBox_ndvi").style("cursor", "default");
                      var ndviareachart = new Chart("ndviareaLineCharts_info");
                      // ndviareachart.addPlot("default", {type: LinesPlot,markers: true,tension: "S",marker: "m-3,0 c0,-4 6,-4 6,0 m-6,0 c0,4 6,4 6,0" });
                      // ndviareachart.addAxis("x", { includeZero: false, fixLower: "major", fixUpper: "major", natural: false, vertical: false, rotation: 90, title: "Date", titleFontColor: "black",
                      // labels: ndvidateLabels, titleOrientation: "away", majorLabels: true,majorTicks:true,majorTickStep:1,minorTicks:false});
                      // ndviareachart.addAxis("y", { min : 0,vertical: true, fixLower: "minor", fixUpper: "minor", title: "Vegetation Area", titleFontColor: "black",minorTicks:true});
                      // if(dijit.byId("denseCheckBox_ndvi").checked){
                      //     ndviareachart.addSeries("Dense", ndvi_densearray,{plot: "default", stroke: {color:"#007E11", width:2}}); //min:
                      // }
                      // if(dijit.byId("sparseCheckBox_ndvi").checked){
                      //     ndviareachart.addSeries("Sparse", ndvi_sparsearray,{plot: "default", stroke: {color:"#00AA17", width:2},markers:true,marker: "m-3,0 c0,-4 6,-4 6,0 m-6,0 c0,4 6,4 6,0" }); //min:
                      // }
                      // if(dijit.byId("lowCheckBox_ndvi").checked){
                      //     ndviareachart.addSeries("Low", ndvi_lowarray,{plot: "default", stroke: {color:"#00E21F", width:2}}); //min: 0, max: Math.max.apply(null, a),
                      // }
                       //writing ndvi stacked bar chart here 13-09-2021
                       // ndviareachart_sb.title = "stacked chart";
                       ndviareachart.addPlot("stackedColumnsPlot", {type: StackedColumns,gap:3,lines: true,areas: true,markers: true,labels: false,labelStyle:"outside",tension: "2"});
                       ndviareachart.addAxis("x", {  dropLabels: false,labelSizeChange: true,majorTicks:true,rotation:-45,majorTickStep:1,minorTicks:false, fontColor: "black",titleOrientation:"away",
                                        labels: ndvidateLabels, title:"Date" });
                       ndviareachart.addAxis("y", {title:"Area(%)",fixLower: "major",fixUpper: "major", includeZero: true,vertical: true});
                       ndviareachart.addSeries("Dense",ndvi_densearray ,{plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF" ,},fill: "#007E11"});
                       ndviareachart.addSeries("Sparse", ndvi_sparsearray, {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF"},fill: "#00AA17"});
                       ndviareachart.addSeries("Low", ndvi_lowarray , {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF"},fill: "#00E21F"});
                       //ends here stacked bar chart
                       ndviareachart.render();
                      // new Tooltip(ndviareachart, "default", {
                      //   text: function(chartItem, plot) {
                      //     return "Dense: "+plot.series[0].data[chartItem.index] +
                      //         ", Sparse: "+plot.series[1].data[chartItem.index]+
                      //         ", Low: "+plot.series[2].data[chartItem.index];
                      //   }
                      // });
                        ndviareachart.title = "Vegetation Area"
                        ndviareachart.titleFont= "bold 14px Arial"
                        ndviareachart.titlePos = "top"
                        ndviareachart.titleGap = 10
                      //       new Tooltip(ndviareachart, "default", {
                      //   text: function(chartItem, plot) {
                      //     return "Dense: "+plot.series[0].data[chartItem.index] +
                      //         ", Sparse: "+plot.series[1].data[chartItem.index]+
                      //         ", Low: "+plot.series[2].data[chartItem.index];
                      //   }
                      // });
                        ndviareachart.render();
                        ndviareachart.resize(600,330);
                        window.ndviareachart = ndviareachart
                      //    new Tooltip(ndviareachart, "default", {
                      //   text: function(chartItem, plot) {
                      //     return "Dense: "+plot.series[0].data[chartItem.index] +
                      //         ", Sparse: "+plot.series[1].data[chartItem.index]+
                      //         ", Low: "+plot.series[2].data[chartItem.index];
                      //   }
                      // });
                        // var zoom_pan = new MouseZoomAndPan(ndviareachart, "default", {axis: "x"});
                          // var mag = new Magnify(ndviareachart,"default");
                          // var tool = new Tooltip(ndvichart, "default"); 
                            // var tip = new Tooltip(ndviareachart,"default", {
                            //               text: function(o){return "<b>"+ndvidateLabels[o.x-1].text + "</b> : "+ (o.y).toFixed(6);}
                            //         });
                                  //    var array_xy_ndvi_loc = [];       // creating x * y array
                                  //    var array_xx_ndvi_loc = [];
                                  //    for(var i = 0; i<ndvi_meanarray.length; i++){
                                  //      array_xy_ndvi_loc.push(ndvi_meanarray[i] * ndvi_reglineInpArray[i]);
                                  //      array_xx_ndvi_loc.push(ndvi_reglineInpArray[i] * ndvi_reglineInpArray[i]);
                                  //    }
                                  //    m =  (((dojox.math.stats.mean(ndvi_reglineInpArray) * dojox.math.stats.mean(ndvi_meanarray)) - dojox.math.stats.mean(array_xy_ndvi_loc)) /
                                  //      ((dojox.math.stats.mean(ndvi_reglineInpArray) * dojox.math.stats.mean(ndvi_reglineInpArray)) - dojox.math.stats.mean(array_xx_ndvi_loc)));
                                  //    b=(dojox.math.stats.mean(ndvi_meanarray) - dojox.math.stats.mean(ndvi_reglineInpArray)*m);

                                  //    window.reg_line_ndvi_loc = [];
                                  //    for(var x = 0; x<ndvi_reglineInpArray.length; x++){
                                  //    reg_line_ndvi_loc.push((m*ndvi_reglineInpArray[x]) + b);
                                  //    }
                                    var ndviareachart_default = new Chart("ndviareaLineCharts_info_reportMean");
                                  //   ndviareachart_default.addPlot("default", {type: LinesPlot,markers: true,tension: "S",marker: "m-3,0 c0,-4 6,-4 6,0 m-6,0 c0,4 6,4 6,0" });
                                  // //   ndviareachart_default.addPlot("Trend", {type: LinesPlot,markers: false,tension: "S"});
                                  //   ndviareachart_default.addAxis("x", { includeZero: false, fixLower: "major", fixUpper: "major", natural: false, vertical: false, rotation: 90, title: "Date", titleFontColor: "black",
                                  //   labels: ndvidateLabels, titleOrientation: "away", majorLabels: true,majorTicks:true,majorTickStep:1,minorTicks:false});
                                  //   ndviareachart_default.addAxis("y", { min : 0,vertical: true, fixLower: "minor", fixUpper: "minor", title: "Vegetation Area", titleFontColor: "black",minorTicks:true});
                                  //   ndviareachart_default.addSeries("Dense", ndvi_densearray,{plot: "default", stroke: {color:"#007E11", width:2}}); //min:
                                  //   ndviareachart_default.addSeries("Sparse", ndvi_sparsearray,{plot: "default", stroke: {color:"#00AA17", width:2}}); //min:
                                  //   ndviareachart_default.addSeries("Low", ndvi_lowarray,{plot: "default", stroke: {color:"#00E21F", width:2}}); //min:
                                    // ndviareachart_default.addSeries("Trend", reg_line_ndvi_loc,{plot: "Trend", stroke: {color:"#215D2B", width:2}}); //min:
                                    ndviareachart_default.addPlot("stackedColumnsPlot", {type: StackedColumns,gap:5,lines: true,areas: true,markers: true,labels: false,labelStyle:"outside",tension: "2"});
                                    ndviareachart_default.addAxis("x", {  dropLabels: false,labelSizeChange: true,rotation:-45,majorTicks:true,majorTickStep:1,minorTicks:false, fontColor: "black",titleOrientation:"away",
                                                      labels: ndvidateLabels, title:"Date" });
                                    ndviareachart_default.addAxis("y", {title:"Area(%)",fixLower: "major",fixUpper: "major", includeZero: true,vertical: true});
                                    ndviareachart_default.addSeries("Dense",ndvi_densearray ,{plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF" ,},fill: "#007E11"});
                                    ndviareachart_default.addSeries("Sparse", ndvi_sparsearray, {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF"},fill: "#00AA17"});
                                    ndviareachart_default.addSeries("Low", ndvi_lowarray , {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF"},fill: "#00E21F"});
                                    //ends here stacked bar chart
                                    ndviareachart_default.title = "Vegetation Area"
                                    ndviareachart_default.titleFont= "bold 13px Arial"
                                    ndviareachart_default.titlePos = "top"
                                    ndviareachart_default.titleGap = 10
                                    ndviareachart_default.render();
                          domAttr.set("ndviarea_legend","innerHTML",'<table style="line-height: 2em;padding-top: 40%;padding-left:5%;">'+
                          '<tr style="vertical-align:baseline;line-height:1.6em;"><td><span style="padding: 0px 8px 0px 6px;color:#007E11;background-color:#007E11;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Dense Vegetation</td></tr>'+
                          '<tr style="vertical-align:baseline;line-height:1.6em;"><td><span style="padding: 0px 8px 0px 6px;color:#00AA17;background-color:#00AA17;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Sparse Vegetation</td></tr>'+
                          '<tr style="vertical-align:baseline;line-height:1.6em;"><td><span style="padding: 0px 8px 0px 6px;color:#00E21F;background-color:#00E21F;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Low Vegetation</td></tr></table>')
                          dojo.query("#ndviarea_checkboxtable").style("display","block");
                          dojo.query('#ndviarea_legend').style('display','block')

                          //writing ndvi stacked bar chart here 13-09-2021
                          // var ndviareachart_sb = new Chart("ndviarea_StackedBarChart");
                          // ndviareachart_sb.addPlot("stackedColumnsPlot", {type: StackedColumns,gap:5,lines: true,areas: true,markers: true,labels: false,labelStyle:"outside",tension: "2"});
                          // ndviareachart_sb.addAxis("x", {  dropLabels: false,labelSizeChange: true,rotation:90,majorTicks:true,majorTickStep:1,minorTicks:false,font: "normal bold 8px Arial", fontColor: "black",titleOrientation:"away",
                          //                  labels: ndvidateLabels, title:"Date" });
                          // ndviareachart_sb.addAxis("y", {title:"Area",fixLower: "major",fixUpper: "major", includeZero: true,vertical: true});
                          // ndviareachart_sb.addSeries("Dense",ndvi_densearray ,{plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF" ,},fill: "#007E11"});
                          // ndviareachart_sb.addSeries("Sparse", ndvi_sparsearray, {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF"},fill: "#00AA17"});
                          // ndviareachart_sb.addSeries("Low", ndvi_lowarray , {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF"},fill: "#00E21F"});
                          // //ends here stacked bar chart
                          // ndviareachart_sb.render();
                          // ndviareachart_sb.resize(560,330);
                  }
                });
          }
    },

    getQueryStrBtnYears: function(fy,ty,fm,tm){
      str= "";
      if(fy === ty){
          str = "(year = "+fy+" and month between "+fm+" and "+tm+")"
      }
      else{
              for(i = fy+1;i<ty; i++){
              s = "or (year = "+i+" and month between 1 and 12) ";
              str = str + s;
              }
              str = "((year = "+fy+" and month between "+fm+" and 12) "+str+"or (year = "+ty+" and month between 1 and "+tm+"))";
          }
      return str;
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
        case "2":  monsoon = "Pre";
        break;
        case "3":  monsoon = "Post";
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
          //clear graphics on change of state extent in village information.
          akah_Tool.map.graphics.clear()
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
            //modified akah_selectedwells layer to akah_villages_layer for enhancing the count of villages
            new QueryTask(akah_villages_layer.url).execute(query_state, function retrieve(selectedstateresponse) {
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
          //clear graphics on change of district extent in village information
          akah_Tool.map.graphics.clear()
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
          if(akahdistrict === "Select District" || akahdistrict === ''){
            akah_Tool._removeAllNodesBeforeCreation()
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
          //modified akah_selectedwells layer to akah_villages_layer for enhancing the count of villages
          new QueryTask(akah_villages_layer.url).execute(query_dist, function retrieve(selectedblockresponse) {
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
          //clear graphics on change of block extent in village information
          akah_Tool.map.graphics.clear()
          window.akahblock = evt;
          if(akahblock ==="Select Block" || akahblock === ''){
            akah_Tool._removeAllNodesBeforeCreation()
          }
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
              //modified *village_name* attribute of akah_selectedwells to *village* attribute in akah_villages_layer for attribute_name change
              villages.push("Select Village");
              query_vill.outFields = ["village"]
              query_vill.returnGeometry = false
              query_vill.returnDistinctValues = true
              query_vill.orderByFields = ["village ASC"];
              //querying displacement service url and getting all districts data
              //modified akah_selectedwells layer to akah_villages_layer for enhancing the count of villages
              new QueryTask(akah_villages_layer.url).execute(query_vill, function retrieve(selectedblockresponse) {
                window.selectedblockresponse = selectedblockresponse;
                selectedblockresponse.features.forEach(function (feature) {
                  //modified *village_name* attribute of akah_selectedwells to *village* attribute in akah_villages_layer for attribute_name change
                  village_val = feature.attributes.village;
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
        // var highlightVillGraphic = "";
        // window.highlightVillGraphic = highlightVillGraphic;

        this.own(on(vill_valakah, 'change', lang.hitch(this, function (evt) {
          dojo.query("#arrowGoBtn").style("display","none");
          window.akahvillage = evt;          
          //statement to display the village related information only when a village is chosen.
          dojo.query('#village_level_info').style('display', 'none');

          if(akahvillage === "Select Village" || akahvillage === ''){
            akah_Tool._removeAllNodesBeforeCreation()
          }
          // var highlightVillGraphic;
          // akah_Tool.map.graphics.remove(highlightVillGraphic);
          // akah_Tool.map.graphics.clear();
          var sum_var=["vs_well_count","vs_wq","vs_pop","vs_pop_ratio" ,"vs_maj_crop","vs_sw_irr","vs_gw_irr","vs_avail_gw","vs_pre_mon","vs_post_mon","vs_aqui","vs_ws"]
          sum_var.forEach(function(j){domAttr.set(j,"innerHTML",'<b>'+""+'</b>');});
              if(evt != "Select Village"){
                    //statement to disable the Go button until the villageMap PrintTask completes.
                    document.getElementById('go_toVillage').disabled = true;
                    dojo.query("#pr_go_load").style("display","block");
                    //statement to display the village related information only when a village is chosen.
                    dojo.query('#village_level_info').style('display', 'block');
                    //statement to change the village value in search(data-analytics module)
                    searchAkah.set("value", akahvillage);

                    var getVillGeometry =  new Query();
                    getVillGeometry.outFields = ["*"]
                    getVillGeometry.where  = "village like '"+evt+"'"
                    getVillGeometry.returnGeometry = true

                    var villHighlightSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NULL,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([215,0,0]), 2))
                    window.villHighlightSymbol = villHighlightSymbol;

                    new QueryTask(akah_villages_layer.url).execute(getVillGeometry, function retrieve(akah_searchResponseresult) {
                      akah_searchResponse = akah_searchResponseresult.features[0];
                      window.akah_searchResponse = akah_searchResponse;
                      // akah_Tool.map.graphics.remove(highlightVillGraphic);
                      akah_Tool.map.graphics.clear()

                      akah_selectedwells_layer.setVisibility(true)
                      // akah_villages_layer.setRenderer(village_renderer);
                      window.highlightVillGraphic = new Graphic(akah_searchResponseresult.features[0].geometry,villHighlightSymbol)
                      akah_Tool.map.graphics.add(highlightVillGraphic);

                      akah_Tool.map.setExtent(akah_searchResponseresult.features[0].geometry.getExtent().expand(1.5))
                      akah_villages_layer.setDefinitionExpression("village like '"+akah_searchResponse.attributes.village+"'")
                      akah_villages_layer.setVisibility(true)// to show the rendered village on the map.
                      dojo.byId("akahwellInventory_Report").setAttribute('disabled',true);
                      dojo.query("#wl").style("display","none");
                      dojo.query("#wq").style("display","none");
                      dojo.query("#pr_load").style("display","block");

                      akah_Tool.createBufferRainfall();
                      setTimeout(function(){
                        //get village map image url for print
                        template_BlockMap.layout = 'village_map';
                        var villageMapParams = new PrintParameters();
                        villageMapParams.map = akah_Tool.map;
                        villageMapParams.template = template_BlockMap;
                        window.villageMapParams=villageMapParams;

                        var villagePrintTask = new PrintTask(app.printUrl);
                        window.villagePrintTask = villagePrintTask;
                        window.printing_tool_exe_v = villagePrintTask.execute(villageMapParams, function (evt){
                            villageMap = evt.url;
                            template_BlockMap.layout = 'village_keymap';

                            var village_keyMapParams = new PrintParameters();
                            village_keyMapParams.map = akah_Tool.map;
                            village_keyMapParams.template = template_BlockMap;
                            window.village_keyMapParams=village_keyMapParams;

                            // akah_Tool.map.setExtent(akah_searchResponseresult.features[0].geometry.getExtent().expand(1.5))
                            var villPrintTask1 = new PrintTask(app.printUrl);
                            // new PrintTask("https://geomonitor.co.in/server/rest/services/agakhan/ExportWebMap/GPServer/Export%20Web%20Map");
                            window.printing_tool_exe_vk = villPrintTask1.execute(village_keyMapParams, function (village_keyevt){
                              window.villageMap_1 = village_keyevt.url;
                              document.getElementById('go_toVillage').disabled = false;
                              dojo.query("#pr_go_load").style("display","none");
                              dojo.query("#arrowGoBtn").style("display","block");
                              dojo.query("#go_toVillage").style("cursor","pointer");
                              domAttr.set("arrowGoBtn","innerHTML","<img src='"+rightarrow_img+"' style='height: 25px;margin-right: 8px;' id='arrowblink' alt='rightarrow'>")
                            },akah_Tool.log_query_errors);
                            // setTimeout(function(){
                            //   },3000)
                        },akah_Tool.log_query_errors);
                        //search village through village information tab
                        queryChart.geometry =akah_searchResponse.geometry
                        akah_Tool.getSearchResponseOnDraw("",queryChart);
                        akah_Tool.gotoFilterSurfWatBodies();
                        dojo.byId("akahwellInventory_Report").removeAttribute('disabled');
                        dojo.query("#wl").style("display","block");
                        dojo.query("#wq").style("display","block");
                        dojo.query("#pr_load").style("display","none");
                      },3000)
                    });
            }
        })));
    },
    createBufferRainfall: function(){
                //adding code for village buffer to get rainfall data
                vg = akah_searchResponse.geometry.getCentroid()
                villGeometry = webMercatorUtils.geographicToWebMercator(vg)
                window.villGeometry=villGeometry;
                //creating buffer to the village and passing that to get the required rainfall data points
                var params = new BufferParameters();
                params.distances = ["50"];
                params.outSpatialReference = akah_Tool.map.spatialReference;
                params.unit = GeometryService.UNIT_KILOMETER;
                normalizeUtils.normalizeCentralMeridian([villGeometry]).then(function(normalizedGeometries){
                  var normalizedGeometry = normalizedGeometries[0];
                  if (normalizedGeometry.type === "polygon") {
                    //if geometry is a polygon then simplify polygon.  This will make the user drawn polygon topologically correct.
                    esriConfig.defaults.geometryService.simplify([normalizedGeometry], function(geometries) {
                      params.geometries = geometries;
                      esriConfig.defaults.geometryService.buffer(params, showBuffer);
                    });
                  } else {
                    params.geometries = [normalizedGeometry];
                    esriConfig.defaults.geometryService.buffer(params, showBuffer);
                  }
                }); 
                function showBuffer(bufferedGeometries) {
                      window.villageBuffer = bufferedGeometries;
                      var query_rfStations = new Query()
                      query_rfStations.where = "1=1"
                      query_rfStations.outFields = ["*"]
                      query_rfStations.returnGeometry = true
                      query_rfStations.geometry = villageBuffer[0];
                      window.query_rfStations=query_rfStations;
                      akah_Tool.getRainfallDataByCategory();
                }
                //end of village buffer
    },
    goto_village_boundary: function(evt){
      if (evt == true) {
        akah_villages_layer.setDefinitionExpression("state like" +" "+"\'"+ akahstate +"\'"  + " " + "AND" + " " + "district like" +" "+"\'"+ akahdistrict +"\'"+ " " + "AND" + " " + "block like" + " " + "\'" + akahblock + "\'");
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

    showAKAHResult: function(){
      dojo.query("#arrowGoBtn").style("display","none");
      // dom.setAttr("arrowGoBtn","innerHTML","<img src='"+rightarrow_img+"' style='height: 25px;margin-right: 8px;' id='arrowblink' alt='rightarrow'>")
          init_map = this.map
          akah_Tool = this;

          document.getElementsByClassName('bar_akah-inner')[0].dataset.percent = "90%"
          document.getElementsByClassName('bar_akah-inner')[0].style.width = "90%"

          dojo.query('#village_level_info').style('display', 'block');
          domAttr.set('downloadAlertwl','innerHTML','');
          domAttr.set('downloadAlertwq','innerHTML','');
          
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
            well_table ="";
            window.well_table = well_table   
            query_selectedInp.where = "state like" +" "+"\'"+ akahstate +"\'"  + " " + "AND" + " " + "district like" +" "+"\'"+ akahdistrict +"\'"+ " " + "AND" + " " + "block like" + " " + "\'" + akahblock + "\'" + "AND" + " " + "village_name like" + " " + "\'" + akahvillage + "\'";

              // for Block level CGWB Water Level vs Rainfall graphs in reports starts here -- Level1
              var query_cgwbWells = new Query()
              query_cgwbWells.where = "state like" +" "+"\'"+ akahstate +"\'"  + " " + "AND" + " " + "district like" +" "+"\'"+ akahdistrict +"\'"+ " " + "AND" + " " + "block like" + " " + "\'" + akahblock + "\'" + " AND may_2015 is not null AND may_2016 is not null AND may_2017 is not null AND may_2018 is not null AND may_2019 is not null AND nov_2015 is not null AND nov_2016 is not null AND nov_2017 is not null AND nov_2018 is not null AND nov_2019 is not null"
              query_cgwbWells.outFields = ['state', 'district', 'site_name', 'may_2015', 'may_2016', 'may_2017', 'may_2018', 'may_2019', 'nov_2015', 'nov_2016', 'nov_2017', 'nov_2018', 'nov_2019']
              query_cgwbWells.returnGeometry = true
              window.cgwb_results_village=new QueryTask(gwm_station_layer.url).execute(query_cgwbWells, function(cgwbWell_feature, cg_index){
                  window.rainfall_arr = [];window.res1 = '';

                  // For District ID starts here-- Level2
                  var query_dist_id = new Query()
                  query_dist_id.where = "state like" +" "+"\'"+ akahstate +"\'"  + " " + "AND" + " " + "district like" +" "+"\'"+ akahdistrict +"\'";
                  query_dist_id.outFields = ["district_pk"];
                  window.district_id_cgwb_wl=new QueryTask(akah_dist_layer.url).execute(query_dist_id,function(district_id_res){
                    //For Rainfall graphs in CGWB vs Rainfall graph -- Level3
                    var query_rf_wl = new Query()
                    query_rf_wl.where ="year >= "+2015+" AND year <= "+2019+" AND district_id = "+district_id_res.features[0].attributes['district_pk']
                    query_rf_wl.outFields = ["rainfall_actual","year"]
                    query_rf_wl.orderByFields=["year asc"]
                    window.rainfall_result_cgwb_wl=new QueryTask(district_rainfall_url).execute(query_rf_wl,function(rainfall_wl_resp){
                      rainfall_wl_resp.features.forEach(function(rf_val){
                        rainfall_arr.push(rf_val.attributes['rainfall_actual']);
                      });
                      cgwbWell_feature.features.forEach(function(site_well, s_ind){
                        window.premonsoon_arr=[];window.postmonsoon_arr=[];
                        // if (site_well.attributes['district'] === 'Aurangabad') {
                        //   window.rainfall_arr = [592.06, 714.71, 686.51, 438.01, 826.43, 862.41]
                        // }
                        // else if (site_well.attributes['district'] === 'Yavatmal') {
                        //     window.rainfall_arr=[944.28,1116.57,689.58,922.15,779.48,707.7];
                        //   // window.rainfall_arr = [592.06, 714.71, 686.51, 438.01, 826.43, 862.41]
                        // }
                        // else if (site_well.attributes['state'] === 'Gujarat') {
                        //   window.rainfall_arr = [s750.88,948.82,885.38,904.71,1322.86,1553.63]
                        // }
                        cgwbWell_feature.fields.forEach(function(cgwb_well){
                          if (cgwb_well.name.includes('may')) {
                              window.premonsoon_arr.push(-site_well.attributes[cgwb_well.name])
                          }
                          else if (cgwb_well.name.includes('nov')) {
                              window.postmonsoon_arr.push(-site_well.attributes[cgwb_well.name])
                          }
                        })
                        // window.res_head = '<div>3.7.'+(s_ind+1)+'. Observation Well - '+site_well.attributes['site_name']+'</div>';
                        window.res1 = res1 +'<div style="display:inline-grid;">'+'<div style="font-size: 15px;font-weight: 600;">5.2.2.2.'+(s_ind+1)+'. Observation Well - '+site_well.attributes['site_name']+'</div>' + akah_Tool.generateMultiPlotChart( [{text:"2015",value: 1}, {text:"2016", value: 2}, {text: "2017", value: 3}, {text:"2018", value: 4}, {text: "2019", value: 5}],
                          rainfall_arr, premonsoon_arr, postmonsoon_arr, site_well.attributes['site_name'],s_ind)+'</div>';
                        window.res1 = res1 + akah_Tool.generateMultiPlotChart1( [{text:"2015",value: 1}, {text:"2016", value: 2}, {text: "2017", value: 3}, {text:"2018", value: 4}, {text: "2019", value: 5}],
                          rainfall_arr, premonsoon_arr, postmonsoon_arr, site_well.attributes['site_name'],s_ind);
                    })})
                    //For Rainfall graphs in CGWB vs Rainfall graph -- Level3

                  });
                  // For District ID starts ends here-- Level2
                  window.res1 = res1;
              });
              // for Block level CGWB Water Level vs Rainfall graphs in reports ends here

            //   akah_indus.setVisibility(false);
              akah_sw1.setVisibility(true);
              akah_drain.setVisibility(true);
              akah_states_layer.setVisibility(false);
              gwm_station_layer.setVisibility(false)
              akah_selectedwells_layer.setVisibility(true);
              akah_dist_layer.setVisibility(false);

              window.rv={};
              var sum_var=["vs_well_count","vs_wq","vs_pop","vs_pop_ratio" ,"vs_maj_crop","vs_sw_irr","vs_gw_irr","vs_avail_gw","vs_pre_mon","vs_post_mon","vs_aqui","vs_ws"]
              sum_var.forEach(function(j){domAttr.set(j,"innerHTML",'<img src="'+image_path+'" class="load_image" alt="Loading..">');});
              dojo.byId("akahwellInventory_Report").setAttribute('disabled',true);
              dojo.query("#wl").style("display","none");
              dojo.query("#wq").style("display","none");
              dojo.query("#pr_load").style("display","block");
              window.rep_vil1='';window.rep_vil2='';window.rep_vil3='';window.rep_vil4='';window.rep_vil5='';window.rep_vil6='';window.rep_vil7='';window.rep_vil8='';
              window.rep_vil9='';window.rep_vil10='';window.rep_vil11='';window.rep_vil12='';window.rep_vil7_1='';
              window.rep_val1='';window.rep_val2='';window.rep_val3='';window.rep_val4='';window.rep_val5='';window.rep_val6='';window.rep_val7='';window.rep_val8='';window.rep_val5_1='';window.rep_val6_1='';
              window.rep_charts='';window.rep_header_text='';


              // Main query (Parent Query) Level1
              window.selected_result=new QueryTask(akah_selectedwells_layer.url).execute(query_selectedInp, function retrieve(summ_selected_records1) {
                window.akah_village_selectedwell_response = summ_selected_records1;

                // dashboard mbgl calculation starts here
                window.well_data_info = {'Well_id': ''};
                well_data_info['Well_id'] = 'Well ID';well_data_info['uid']=[];well_data_info['Latitude']=[];
                well_data_info['Longitude']=[];well_data_info['Owner_Name'] = [];well_data_info['Well_Depth']=[];
                well_data_info['waterDepth_1'] = [];well_data_info['waterDepth_2'] = [];
                if(summ_selected_records1.features.length>0){
                  rep_header_text='<div><div style="display: block;text-align: center;font-size: large;padding: 2px;background-color: #f9f8f8;border-radius: 10px 10px 0px 0px;margin: 0px 30px 0px 10px;margin-top: 4%;position: sticky;"> <span> <span style="font-weight: 600;">State: </span> <span style="color: #0473d4;">'+akahstate+'</span> </span>&nbsp;&nbsp; '+
                  '<span> <span style="font-weight: 600;">District: </span> <span style="color: #0473d4;">'+akahdistrict+'</span> </span>&nbsp;&nbsp; <span> <span style="font-weight: 600;">Block: </span> <span style="color: #0473d4;">'+akahblock+'</span> </span>&nbsp;&nbsp;</div><div style="text-align: center;font-size: large;padding: 2px;background-color: #f9f8f8;border-radius: 0px 0px 10px 10px;position:sticky;margin: 0px 30px 0px 10px;"><span><span style="font-weight: 600;">Village: </span> <span style="color: #0473d4;">'+akahvillage+'</span> </span></div></div>';
                  // <span> <span>Village: </span> <span style=" color: #50a184; ">'+akahvillage+'</span> </span>
                  var pre=[];
                  var pst=[];
                  wl_requests=[];
                  //var sets1={"station1":[2.135,3.35,3.04,null,5.1816],"station2":[1.22,1.21,3.04,null,7.62]};
                  //var sets2={"station1":[null,null,null,null,null],"station2":[null,null,null,7.5,15.69]}
                  window.wltb_text='';
                  var incr=0;

                  function computeMonthYear(fromMonth, fromYear, toMonth, toYear){
                      var months=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
                      var c1=fromMonth; var a=fromYear;
                      var d1=toMonth;var b=toYear;
                      var dif=b-a;
                      var c=[]; var d=[];
                      var total_time_list=[];
                      function p(a,c1,d1){
                        //GLOBAL $months,$c,$d;
                        var year=a;
                        var x=months.indexOf(c1);
                        var xb=months.indexOf(d1);
                        for (var x0=x; x0<=xb;x0++){
                        c.push(months[x0]+'_'+year);
                        total_time_list.push({year:year,month:x0+1,count:1});
                        total_time_list.push({year:year,month:x0+1,count:2});
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
                      return {"attributes_names":c,"Labels":d,"total_time_list":total_time_list}
                  }
                  summ_selected_records1.features.forEach(function(f, f_index){
                    var set1=[]
                    var set2=[]
                    incr=incr+1;

                    var query_selected_well_temporal = new Query();
                    query_selected_well_temporal.where = "unique_well_id_fk like "+"'OWUID"+f.attributes["uid"]+"'";
                    query_selected_well_temporal.outFields = ['unique_well_id_fk','water_level_mbgl','year','month','water_status','observation_count_in_month','objectid','date_time']
                    query_selected_well_temporal.orderByFields=["year asc","month asc","date_time asc"];
                    query_selected_well_temporal.returnGeometry=false;
                      window.wl_req_temp=new QueryTask(selected_wells_wl_url).execute(query_selected_well_temporal,function(temporal_wl_response){
                        var start_month=temporal_wl_response.features[0].attributes['month'];
                        var start_year=temporal_wl_response.features[0].attributes['year'];
                        var end_month=temporal_wl_response.features[temporal_wl_response.features.length-1].attributes['month'];
                        var end_year=temporal_wl_response.features[temporal_wl_response.features.length-1].attributes['year'];
                        temporal_wl_response.features.forEach(function(wl){
                              if(wl.attributes['month']==3 || wl.attributes['month']==4 || wl.attributes['month']==5){
                                if(wl.attributes['water_level_mbgl']!=null){
                                  pre.push(wl.attributes['water_level_mbgl']);
                                }
                              }
                              else if(wl.attributes['month']==10 || wl.attributes['month']==11 || wl.attributes['month']==12){
                                if(wl.attributes['water_level_mbgl']!=null){
                                  pst.push(wl.attributes['water_level_mbgl']);
                                }
                              }
                              else{
                                  //during monsoon if required
                              }
                            });
                        var months=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
                        window.my_val=computeMonthYear(months[start_month-1],start_year, months[new Date().getMonth()-1] , new Date().getFullYear());//months[new Date().getMonth()-1]

                    for(var i=0;i<my_val.total_time_list.length/2;i++){
                      var count=0;
                      var count_set1=0;
                      var count_set2=0
                      temporal_wl_response.features.forEach(function(wl){
                        if(count<2){
                          if(new Date(wl.attributes['date_time']).getFullYear()==my_val['total_time_list'][i*2]['year'] && new Date(wl.attributes['date_time']).getMonth()+1==my_val['total_time_list'][i*2]['month'])
                          {
                          count=count+1
                          if(new Date(wl.attributes['date_time']).getDate() <=15){
                                if(count_set1<1){
                                  count_set1=count_set1+1
                                  if(wl.attributes['water_level_mbgl']!=null){
                                    set1.push(wl.attributes['water_level_mbgl'])
                                  }
                                  else if(wl.attributes['water_level_mbgl']==null){
                                    set1.push('Dry Well');
                                  }
                                  else{
                                    set1.push(null);
                                  }
                                }
                              }
                          else if(new Date(wl.attributes['date_time']).getDate() >15){
                            if(count_set2<1){
                              count_set2=count_set2+1
                              if(wl.attributes['water_level_mbgl']!=null){
                                      set2.push(wl.attributes['water_level_mbgl']);
                                    }
                                    else if(wl.attributes['water_level_mbgl']==null){
                                      set2.push('Dry Well');
                                    }
                                    else{
                                      set2.push(null);
                                    }
                                  }
                                }
                          }
                        }
                      });

                      if(count==0){
                          set1.push(null);
                          set2.push(null);
                      }
                      else if(count==1){
                        if (set1.length>set2.length){
                          set2.push(null)
                        }
                        else if(set2.length>set1.length){
                          set1.push(null)
                        }
                      }
                    }

                        //console.log(my_val);

                        console.log(set1)
                        console.log(set2)
                        well_data_info['no_months'] = set1.length;

                        window.final=[];
                        for(var i=0;i<set1.length;i++){
                          if(set1[i]!=null){
                            final.push(set1[i]);
                          }
                          else if(set1[i]=='Dry Well'){
                            final.push(null)
                          }
                          else{
                            final.push(null)
                          }

                          if(set2[i]!=null){
                            final.push(set2[i])
                          }
                          else if(set2[i]=='Dry Well'){
                            final.push(null)
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
                          if (final[i]!=null && final[i]!='Dry Well'){
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
                            var date12=new Date()
                            if(date12.getMonth()==12){
                              dl.push(...[(months[11].toLocaleUpperCase()+'_'+(date12.getFullYear())+'_2'), (months[11].toLocaleUpperCase()+'_'+(date12.getFullYear())+'_2'),
                              (months[0].toLocaleUpperCase()+'_'+(date12.getFullYear()+1)+'_1'),(months[0].toLocaleUpperCase()+'_'+(date12.getFullYear()+1)+'_2')])
                            }
                            else{
                              dl.push(...[(months[date12.getMonth()].toLocaleUpperCase()+'_'+(date12.getFullYear()+1)+'_1'),(months[date12.getMonth()].toLocaleUpperCase()+'_'+(date12.getFullYear()+1)+'_2'),
                              (months[date12.getMonth()+1].toLocaleUpperCase()+'_'+(date12.getFullYear())+'_1'),(months[date12.getMonth()+1].toLocaleUpperCase()+'_'+(date12.getFullYear())+'_2')])
                            }
                            window.dl=dl

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
                            chart.addAxis("x", { exportEnabled: true, beginAtZero:true,leftBottom: false,fixLower: "major", fixUpper: "major", natural: false, vertical: false, title: "Date", titleFontColor: "#000",rotation: 90, labels: reportPollutionIndexArr, majorLabels: true, minorLabels: false, majorTicks:true, microTicks: false,minorTicks:false,majorTickStep:1});
                            chart.addAxis("y", { min: Math.min.apply(null, vl1.concat(rl1))-1, max: 0, leftBottom: true, includeZero: true, vertical: true, fixLower: "major", fixUpper: "major", title: "GWL (mbgl)", titleFontColor: "#000", majorLabels: true, minorLabels: false, majorTicks:true,microTicks: false,minorTicks:false,majorTickStep:1});
                            chart.addSeries("Groundwater Observation Levels",vl1, { plot: "default" , stroke: { color: "gold" }, marker: "m-3,0 c0,-4 6,-4 6,0 m-6,0 c0,4 6,4 6,0" }); //min: 0, max: Math.max.apply(null, a),
                            chart.addSeries("Trend Line",rl1, { plot: "plot_markers" , stroke: { color: "#0c72f7",width: 2.5 } }); //min: 0, max: Math.max.apply(null, a),

                            //var tip = new Tooltip(hmda_PI_chart_new,"default");
                            //var zoom_pan = new MouseZoomAndPan(hmda_PI_chart_new, "default", {axis: "x"});
                            //var mag = new Magnify(hmda_PI_chart_new,"default");
                            chart.render();
                            chart.resize(450,300);
                            window.chart=chart;
                            rep_charts=rep_charts+'<div style="display:inline-grid">'+
                            // '<div style="padding-left: 10px;font-size: 13px;"><b>Block name</b> – <span style="color: #0473d4;">'+akahblock+'</span>, <b>Village name</b> - <span style="color: #0473d4;">'+akahvillage+'</span></div>'
                            '<div style="display:inline-flex"><div>'+dojo.query('#chartModule_new').innerHTML()+'</div>'+
                            "<div style='width: 260px;padding-left:50px;text-align:center;padding-top:110px;'>"+
                            "<table class='akahReportTable1'><tr><td style='width:50%'><b>Well ID</b></td><td>"+'OW'+f.attributes.uid+"</td></tr>"+
                            "<tr><td><b>Owner Name</b></td><td>"+(f.attributes.owner_name==null?'':akah_Tool.capitalize(f.attributes.owner_name))+"</td></tr>"+"<tr><td><b>Well Depth</b></td><td>"+(f.attributes.well_depth_meters==null?'':f.attributes.well_depth_meters.toFixed(2))+" m</td></tr>"+
                            //"<tr><td><b>Water Depth</b></td><td>"+(f.attributes.water_depth_meters==null?'':f.attributes.water_depth_meters.toFixed(2))+" mbgl</td></tr>"+
                            "<tr><td><b>Deviation<b></td><td>"+rmse1+"</td></tr>"+rise_fall+
                            "</table></div>"+"</div>"+
                            "<div style='display:inline-flex;padding-left:20%;'>"+
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
                      wl_requests.push(wl_req_temp);
                  });

                  function final_execute_waterlevel(r){
                  window.all_station_results=r
                  window.well_table_hdng = "<tr><td colspan=2 class='ReportTable_subHdngs1'>"+well_data_info.Well_id+"</td>";
                  window.well_lat = "<tr><td colspan=2 class='ReportTable_subHdngs1'>Latitude</td>";
                  window.well_long = "<tr><td colspan=2 class='ReportTable_subHdngs1'>Longitude</td>";
                  window.well_owner = "<tr><td colspan=2 class='ReportTable_subHdngs1'>Owner Name</td>";
                  window.well_depth_mbgl = "<tr><td colspan=2 class='ReportTable_subHdngs1'>Well Depth(m)</td>";
                  window.well_row = "<tr><td colspan="+(Number(well_data_info.uid.length)+2)+" class='ReportTable_subHdngs1' style='font-size: 15px;background-color: #e0e0e0;'>Water Depth (mbgl)</td></tr>"
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
                  well_table = well_table_hdng+well_lat+well_long+well_owner+well_depth_mbgl+well_row;
                  Object.keys(waterDepth_json).forEach(function(key){
                    well_table = well_table + waterDepth_json[key]+"</tr>";
                  });

                  // pre=[5.18,7.62,15.69];
                  // pst=[2.13,1.22];
                  console.log(pst)
                  console.log(pre);
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
                  var promisee=executeAll(wl_requests);
                  promisee.then(final_execute_waterlevel);


                                  //water quality for village level starts here
                                  var wqpar=["ph", "ec", "tds", "co3", "hco3", "cl", "no3", "so4", "f", "alkalinity", "ca", "mg", "th", "k",'fe'];
                                  window.wqpar_blck=["pH","Electrical Conductivity","Total Dissolved Solids","Carbonate","Bicarbonate","Chloride","Nitrate","Sulphate","Fluoride","Alkalinity","Calcium","Magnesium","Total Hardness","Potassium","Iron"];
                                  window.parameter_lables=["pH","Electrical Conductivity (micro S/cm)","Total Dissolved Solids (mg/Litre)","Carbonate (mg/Litre)","Bicarbonate (mg/Litre)","Chloride (mg/Litre)","Nitrate (mg/Litre)","Sulphate (mg/Litre)","Fluoride (mg/Litre)","Alkalinity (mg/Litre)","Calcium (mg/Litre)","Magnesium (mg/Litre)","Total Hardness (mg/Litre)","Potassium (mg/Litre)","Iron (mg/Litre)"];
                                  window.wq_tbl1_headings='';window.wq_tbl2_headings='';window.wq_tbl3_headings='';window.wq_tbl4_headings='';window.wq_tbl5_headings='';window.wq_tbl6_headings='';
                                  window.wq_tbl1_body='<tr>';window.wq_tbl2_body='<tr>';window.wq_tbl3_body='<tr>';window.wq_tbl4_body='<tr>';window.wq_tbl5_body='<tr>';window.wq_tbl6_body='<tr>';window.wq_tbl2_body1='<tr>';window.wq_restbl=''
                                  window.wb_tbl2_monsoon_heading='';window.wb_reading_colspan=0
                                  var t1row2='';var t2row2='';var t3row2='';var t4row2='';var t5row2='';var t6row2='';
                                  window.wq_header_text='';
                                  window.wqtbl='';
                                  // for (var g=0;g<wqpar_blck.length;g++){
                                  //   if(g<=0){
                                  //     wq_tbl1_headings=wq_tbl1_headings+"<td class='ReportTable_subHdngs1' colspan='3'>"+wqpar_blck[g]+"</td>";
                                  //     t1row2=t1row2+"<td class='ReportTable_subHdngs1'>Pre Monsoon</td>"+"<td class='ReportTable_subHdngs1'>During Monsoon</td>"+
                                  //     "<td class='ReportTable_subHdngs1'>Post Monsoon</td>";
                                  //   }
                                  //   else if(g>0 && g<=3){
                                  //     wq_tbl2_headings=wq_tbl2_headings+"<td class='ReportTable_subHdngs1' colspan='3'>"+wqpar_blck[g]+"</td>";
                                  //     t2row2=t2row2+"<td class='ReportTable_subHdngs1'>Pre Monsoon</td>"+"<td class='ReportTable_subHdngs1'>During Monsoon</td>"+
                                  //     "<td class='ReportTable_subHdngs1'>Post Monsoon</td>";
                                  //   }
                                  //   else if(g>3 && g<=6){
                                  //     wq_tbl3_headings=wq_tbl3_headings+"<td class='ReportTable_subHdngs1' colspan='3'>"+wqpar_blck[g]+"</td>";
                                  //     t3row2=t3row2+"<td class='ReportTable_subHdngs1'>Pre Monsoon</td>"+"<td class='ReportTable_subHdngs1'>During Monsoon</td>"+
                                  //     "<td class='ReportTable_subHdngs1'>Post Monsoon</td>";
                                  //   }
                                  //   else if(g>6 && g<=9){
                                  //     wq_tbl4_headings=wq_tbl4_headings+"<td class='ReportTable_subHdngs1' colspan='3'>"+wqpar_blck[g]+"</td>";
                                  //     t4row2=t4row2+"<td class='ReportTable_subHdngs1'>Pre Monsoon</td>"+"<td class='ReportTable_subHdngs1'>During Monsoon</td>"+
                                  //     "<td class='ReportTable_subHdngs1'>Post Monsoon</td>";
                                  //   }
                                  //   else if(g>9 && g<=12){
                                  //     wq_tbl5_headings=wq_tbl5_headings+"<td class='ReportTable_subHdngs1' colspan='3'>"+wqpar_blck[g]+"</td>";
                                  //     t5row2=t5row2+"<td class='ReportTable_subHdngs1'>Pre Monsoon</td>"+"<td class='ReportTable_subHdngs1'>During Monsoon</td>"+
                                  //     "<td class='ReportTable_subHdngs1'>Post Monsoon</td>";
                                  //   }
                                  //   else{
                                  //     wq_tbl6_headings=wq_tbl6_headings+"<td class='ReportTable_subHdngs1' colspan='3'>"+wqpar_blck[g]+"</td>";
                                  //     t6row2=t6row2+"<td class='ReportTable_subHdngs1'>Pre Monsoon</td>"+"<td class='ReportTable_subHdngs1'>During Monsoon</td>"+
                                  //     "<td class='ReportTable_subHdngs1'>Post Monsoon</td>";
                                  //   }
                                  // }
                                  // t6row2=t6row2+"<td class='ReportTable_subHdngs1'>Pre Monsoon</td>"+"<td class='ReportTable_subHdngs1'>During Monsoon</td>"+
                                  // "<td class='ReportTable_subHdngs1'>Post Monsoon</td>";

                                  // wq_tbl1_headings=wq_tbl1_headings+"</tr><tr>"+t1row2+"</tr>";
                                  // wq_tbl2_headings=wq_tbl2_headings+"</tr><tr>"+t2row2+"</tr>";
                                  // wq_tbl3_headings=wq_tbl3_headings+"</tr><tr>"+t3row2+"</tr>";
                                  // wq_tbl4_headings=wq_tbl4_headings+"</tr><tr>"+t4row2+"</tr>";
                                  // wq_tbl5_headings=wq_tbl5_headings+"</tr><tr>"+t5row2+"</tr>";
                                  // wq_tbl6_headings=wq_tbl6_headings+"<td class='ReportTable_subHdngs1' colspan='3'>Suitable for Drinking or Irrigation use/Unsuitable</td>"+"</tr>"+
                                  // "<tr>"+t6row2+"</tr>";
                                  var wqlimits=[8.5,2000,2000,75,350,1000,45,400,1.5,600,200,100,600,20,0.3]; //6.5 base limit of pH, Na 200 Mg/l, EC-500,hco3 - 125
                                  var wqlimits_table=["No relaxation","2000","2000","75","125 - 350","1000","No relaxation","400","1.5","600","200","100","600","20","0.3"]; //6.5 base limit of pH, Na 200 Mg/l, EC-500,hco3 - 125
                                  //window.wqpar_blck=["pH","Electrical Conductivity","Total Dissolved Solids","Carbonate","Bicarbonate","Chloride","Nitrate","Sulphate","Fluoride","Alkalinity","Calcium","Magnesium","Total Hardness","Potassium"];

                                  var wq_acclimits_table=["6.5 - 8.5","500","500","75","125 - 350","250","45","200","1","200","75","30","200","20","0.3"]; //6.5 base limit of pH, Na 200 Mg/l, EC-500,hco3 - 125
                                  var wqjson={};
                                  var villagenames=[];
                                  var each_well_wq1=[];
                                  var each_well_wq2=[];
                                  var each_well_wq3=[];
                                  window.tablecount=1;
                                  summ_selected_records1.features.forEach(function (feature,sv) {
                                    if(feature.attributes.village_name!=null){villagenames.push(feature.attributes.village_name)}
                                    var query_forwq_pre=new Query();
                                    query_forwq_pre.where="season='Pre' and year=2021 and unique_well_id_fk='OWUID"+feature.attributes['uid']+"'";
                                    query_forwq_pre.outFields=['wq_parameter_name','wq_parameter_value'];
                                    var wq_pre_querytask=new QueryTask(selected_wells_wq_url).execute(query_forwq_pre);

                                    var query_forwq_during=new Query();
                                    query_forwq_during.where="season='During' and year=2021 and unique_well_id_fk='OWUID"+feature.attributes['uid']+"'";
                                    query_forwq_during.outFields=['wq_parameter_name','wq_parameter_value'];
                                    var wq_during_querytask=new QueryTask(selected_wells_wq_url).execute(query_forwq_during);

                                    var query_forwq_post=new Query();
                                    query_forwq_post.where="season='Post' and year=2021 and unique_well_id_fk='OWUID"+feature.attributes['uid']+"'";
                                    query_forwq_post.outFields=['wq_parameter_name','wq_parameter_value'];
                                    var wq_post_querytask=new QueryTask(selected_wells_wq_url).execute(query_forwq_post);


                                function wq_query_execute(r){
                                  console.log(r);
                                  var r1=r[0];
                                  var r2=r[1];
                                  var r3=r[2];
                                    var wqjson_rep1={};
                                    var wqjson_rep2={};
                                    var wqjson_rep3={};
                                    wq_pre_value={};
                                    wq_during_value={};
                                    wq_post_value={};
                                    wqpar.forEach(function(f){
                                      wq_pre_value[f]=null
                                      for(var i=0;i<r1.features.length;i++){
                                        if(r1.features[i].attributes['wq_parameter_name']==f && r1.features[i].attributes['wq_parameter_value']!=null){
                                          wq_pre_value[f]=r1.features[i].attributes['wq_parameter_value'].replace('>','').replace('<','');
                                          break;
                                        }
                                      }

                                      wq_during_value[f]=null
                                      for(var i=0;i<r2.features.length;i++){
                                        if(r2.features[i].attributes['wq_parameter_name']==f && r2.features[i].attributes['wq_parameter_value']!=null){
                                          wq_during_value[f]=r2.features[i].attributes['wq_parameter_value'].replace('>','').replace('<','');
                                          break;
                                        }
                                      }

                                      wq_post_value[f]=null
                                      for(var i=0;i<r3.features.length;i++){
                                        if(r3.features[i].attributes['wq_parameter_name']==f && r3.features[i].attributes['wq_parameter_value']!=null){
                                          wq_post_value[f]=r3.features[i].attributes['wq_parameter_value'].replace('>','').replace('<','');
                                          break;
                                        }
                                      }
                                    });

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
                                      wqjson[f].push(wq_pre_value[f],wq_during_value[f],wq_post_value[f]);
                                      wqjson_rep1[f].push(wq_pre_value[f]);
                                      wqjson_rep2[f].push(wq_during_value[f]);
                                      wqjson_rep3[f].push(wq_post_value[f]);
                                      //console.log([feature.attributes[f+"_pre_m"],feature.attributes[f+"_during_m"],feature.attributes[f+"_post_m"]]);
                                    });
                                    console.log(wqjson_rep1);
                                    console.log(wqjson_rep2);
                                    console.log(wqjson_rep3);
                                    var wqresults1=[];
                                    var wqresults_exceed1 = {};
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
                                      wqresults_exceed1[wqpar[i]]=((parseFloat(wqjson_rep1[wqpar[i]][0])-wqlimits[i])/wqlimits[i]*100).toFixed(2);
                                      }
                                    }
                                    console.log(wqresults_exceed1);
                                    //console.log(wqresults1);
                                    var rep_each_well1;
                                    if(wqresults1.length>0){
                                      rep_each_well1="";
                                      wqresults1.forEach(function(v){
                                        rep_each_well1=rep_each_well1+wqpar_blck[wqpar.indexOf(v)]+', ';
                                      });
                                      rep_each_well1=rep_each_well1.slice(0,rep_each_well1.length-2)+(wqresults1.length>1?' are ':' is ' )+'<b>NOT</b> within the Permissible Limits.';
                                      each_well_wq1.push(rep_each_well1);
                                    }
                                    else{
                                      if(c1!=14){
                                      rep_each_well1="<b>Suitable</b> for Drinking or Irrigation use.";
                                      each_well_wq1.push(rep_each_well1);
                                    }
                                    else{
                                      each_well_wq1.push('No Data');
                                    }
                                    }


                                    var wqresults2=[];
                                    var wqresults_exceed2={};
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
                                      wqresults_exceed2[wqpar[i]]=((parseFloat(wqjson_rep2[wqpar[i]][0])-wqlimits[i])/wqlimits[i]*100).toFixed(2);
                                    }
                                    }
                                    console.log(wqresults_exceed2);
                                    //console.log(wqresults1);
                                    var rep_each_well2;
                                    if(wqresults2.length>0){
                                      rep_each_well2="";
                                      wqresults2.forEach(function(v){
                                        rep_each_well2=rep_each_well2+wqpar_blck[wqpar.indexOf(v)]+', ';
                                      });
                                      rep_each_well2=rep_each_well2.slice(0,rep_each_well2.length-2)+(wqresults2.length>1?' are ':' is ' )+'<b>NOT</b> within the Permissible Limits.';
                                      each_well_wq2.push(rep_each_well2);
                                    }
                                    else{
                                      if(c1!=14){
                                      rep_each_well2="<b>Suitable</b> for Drinking or Irrigation use.";
                                      each_well_wq2.push(rep_each_well2);
                                    }
                                    else{
                                      each_well_wq2.push('No Data');
                                    }
                                    }

                                    var wqresults3=[];
                                    var wqresults_exceed3={};
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
                                      wqresults_exceed3[wqpar[i]]=((parseFloat(wqjson_rep3[wqpar[i]][0])-wqlimits[i])/wqlimits[i]*100).toFixed(2);
                                    }
                                    }
                                    console.log(wqresults_exceed3);
                                    //console.log(wqresults1);
                                    var rep_each_well3;
                                    if(wqresults3.length>0){
                                      rep_each_well3="";
                                      wqresults3.forEach(function(v){
                                        rep_each_well3=rep_each_well3+wqpar_blck[wqpar.indexOf(v)]+', ';
                                      });
                                      rep_each_well3=rep_each_well3.slice(0,rep_each_well3.length-2)+(wqresults3.length>1?' are ':' is ' )+'<b>NOT</b> within the Permissible Limits.';
                                      each_well_wq3.push(rep_each_well3);
                                    }
                                    else{
                                      if(c1!=14){
                                      rep_each_well3="<b>Suitable</b> for Drinking or Irrigation use.";
                                      each_well_wq3.push(rep_each_well3);
                                    }
                                    else{
                                      each_well_wq3.push('No Data');
                                    }
                                    }

                                    var monsoon_status={};
                                    monsoon_status['pre']=false;
                                    monsoon_status['during']=false;
                                    monsoon_status['post']=false;
                                    if(c1<13){
                                      monsoon_status['pre']=true;
                                    }
                                    if(c2<13){
                                      monsoon_status['during']=true;
                                    }
                                    if(c3<13){
                                      monsoon_status['post']=true;
                                    }

                                    if(monsoon_status['pre'] || monsoon_status['during'] || monsoon_status['post']){
                                      if(tablecount==1){
                                          wq_header_text=wq_header_text+"<td style='font-size: 14px;'>"+'<div style="padding-top: 5px;text-align: center;"><span><b>Owner Name: </b></span>'+"<span>"+(feature.attributes["owner_name"]==null?'':akah_Tool.capitalize(feature.attributes["owner_name"]))+"</span>"+
                                          '<span style="padding-left: 16px;"><b>Well Depth: </b></span>'+"<span>"+(feature.attributes["well_depth_meters"]==null?'':feature.attributes["well_depth_meters"].toFixed(2)+' m')+"</span>"+
                                          '<span style="padding-left: 16px;"><b>Well ID: </b></span>'+"<span>"+(feature.attributes["uid"]==null?'':'OW'+feature.attributes["uid"])+"</span>"+
                                          "</div>"+
                                          '<div style="text-align: center;padding-top: 7px;display:none;">'+
                                          '<span><b>Latitude: </b></span>'+"<span>"+(feature.attributes["y"]==null?'':feature.attributes["y"])+"</span>"+
                                          '<span style="padding-left: 16px;"><b>Longitude: </b></span>'+'<span>'+(feature.attributes["x"]==null?'':feature.attributes["x"])+"</span>"+
                                          "</div>";

                                          //for monsoon headings of the tables
                                          wb_tbl2_monsoon_heading=wb_tbl2_monsoon_heading+"<tr>"
                                          if(monsoon_status.pre){
                                            wb_reading_colspan=wb_reading_colspan+1;
                                            wb_tbl2_monsoon_heading=wb_tbl2_monsoon_heading+"<td class='ReportTable_subHdngs1'>Pre-monsoon</td>";
                                          }
                                          if(monsoon_status.during){
                                            wb_reading_colspan=wb_reading_colspan+1;
                                            wb_tbl2_monsoon_heading=wb_tbl2_monsoon_heading+"<td class='ReportTable_subHdngs1'>During-monsoon</td>";
                                          }
                                          if(monsoon_status.post){
                                            wb_reading_colspan=wb_reading_colspan+1;
                                            wb_tbl2_monsoon_heading=wb_tbl2_monsoon_heading+"<td class='ReportTable_subHdngs1'>Post-monsoon</td>";
                                          }
                                          wb_tbl2_monsoon_heading=wb_tbl2_monsoon_heading+"</tr>"
                                          //for adding the values in to the table body
                                          wqpar.forEach(function(f,index){
                                            wq_tbl2_body1=wq_tbl2_body1+"<tr>"+"<td>"+(index+1)+"</td>"+"<td>"+parameter_lables[index]+"</td>";
                                            if(monsoon_status.pre){
                                              if(wqresults1.includes(f)){
                                                wq_tbl2_body1=wq_tbl2_body1+"<td style='color:red'>"+(wq_pre_value[f]==null?'':wq_pre_value[f])+" ("+wqresults_exceed1[f]+"%)"+"</td>";
                                              }
                                              else{
                                                wq_tbl2_body1=wq_tbl2_body1+"<td>"+(wq_pre_value[f]==null?'':wq_pre_value[f])+"</td>";
                                              }
                                            }

                                            if(monsoon_status.during){
                                              if(wqresults2.includes(f)){
                                                wq_tbl2_body1=wq_tbl2_body1+"<td style='color:red'>"+(wq_during_value[f]==null?'':wq_during_value[f])+" ("+wqresults_exceed2[f]+"%)"+"</td>";
                                              }
                                              else{
                                                wq_tbl2_body1=wq_tbl2_body1+"<td>"+(wq_during_value[f]==null?'':wq_during_value[f])+"</td>";
                                              }
                                            }

                                            if(monsoon_status.post){
                                              if(wqresults3.includes(f)){
                                                wq_tbl2_body1=wq_tbl2_body1+"<td style='color:red'>"+(wq_post_value[f]==null?'':wq_post_value[f])+" ("+wqresults_exceed3[f]+"%)"+"</td>";
                                              }
                                              else{
                                                wq_tbl2_body1=wq_tbl2_body1+"<td>"+(wq_post_value[f]==null?'':wq_post_value[f])+"</td>";
                                              }
                                            }
                                            wq_tbl2_body1=wq_tbl2_body1+"<td>"+wq_acclimits_table[index]+"</td><td>"+wqlimits_table[index]+"</td>"+"</tr>";
                                          });

                                          if(monsoon_status.pre){
                                            wq_restbl=wq_restbl+'<div style="font-size: 14px;padding-top:2px;padding-bottom:2px;line-height: 1.6em;"><span><b>Water Quality Status Pre-monsoon: </b><span>'+each_well_wq1[sv]+'<span></div>';
                                          }
                                          if(monsoon_status.during){
                                            wq_restbl=wq_restbl+'<div style="font-size: 14px;padding-top:2px;padding-bottom:2px;line-height: 1.6em;"><span><b>Water Quality Status During-monsoon: </b><span>'+each_well_wq2[sv]+'<span></div>';
                                          }
                                          if(monsoon_status.post){
                                            wq_restbl=wq_restbl+'<div style="font-size: 14px;padding-top:2px;padding-bottom:2px;line-height: 2.5em;"><span><b>Water Quality Status Post-monsoon: </b><span>'+each_well_wq3[sv]+'<span></div>';
                                          }
                                          wq_restbl=wq_restbl+'<div style="line-height: 2.5em;font-size: 14px;"><b>*All the above water quality  limits are considered to verify the suitability of water for Drinking purpose.</b></div>';
                                          wq_restbl=wq_restbl+'<div style="line-height: 1.5em;font-size: 14px;"><b>*Percentage(%) value indicates the level of voilation from the standard limits.</b></div>';
                                      }
                                      else if(tablecount==2){
                                          wqtbl="<div style='display:inline-grid;width: 100%;'>"+'<table style="margin-top:15px" class="akahReportTable"><tr>'+
                                          "<td style='font-size: 14px;'>"+'<div style="padding-top: 5px;text-align: center;"><span><b>Owner Name: </b></span>'+"<span>"+(feature.attributes["owner_name"]==null?'':akah_Tool.capitalize(feature.attributes["owner_name"]))+"</span>"+
                                          '<span style="padding-left: 16px;"><b>Well Depth: </b></span>'+"<span>"+(feature.attributes["well_depth_meters"]==null?'':feature.attributes["well_depth_meters"].toFixed(2)+' m')+"</span>"+
                                          '<span style="padding-left: 16px;"><b>Well ID: </b></span>'+"<span>"+(feature.attributes["uid"]==null?'':'OW'+feature.attributes["uid"])+"</span>"+
                                          "</div>"+
                                          '<div style="text-align: center;padding-top: 7px;display:none;">'+
                                          '<span><b>Latitude: </b></span>'+"<span>"+(feature.attributes["y"]==null?'':feature.attributes["y"])+"</span>"+
                                          '<span style="padding-left: 16px;"><b>Longitude: </b></span>'+'<span>'+(feature.attributes["x"]==null?'':feature.attributes["x"])+"</span>"+
                                          "</div>"+'</tr></table>';

                                          wb1_reading_colspan=0
                                          wb_tbl1_monsoon_heading="<tr>"
                                          if(monsoon_status.pre){
                                            wb1_reading_colspan=wb1_reading_colspan+1;
                                            wb_tbl1_monsoon_heading=wb_tbl1_monsoon_heading+"<td class='ReportTable_subHdngs1'>Pre-monsoon</td>";
                                          }
                                          if(monsoon_status.during){
                                            wb1_reading_colspan=wb1_reading_colspan+1;
                                            wb_tbl1_monsoon_heading=wb_tbl1_monsoon_heading+"<td class='ReportTable_subHdngs1'>During-monsoon</td>";
                                          }
                                          if(monsoon_status.post){
                                            wb1_reading_colspan=wb1_reading_colspan+1;
                                            wb_tbl1_monsoon_heading=wb_tbl1_monsoon_heading+"<td class='ReportTable_subHdngs1'>Post-monsoon</td>";
                                          }
                                          wb_tbl1_monsoon_heading=wb_tbl1_monsoon_heading+"</tr>"

                                          wqtbl=wqtbl+"<table class='akahReportTable2'>" +
                                          "<tr><td class='ReportTable_subHdngs1' rowspan='2'>S.No</td>"+
                                          "<td class='ReportTable_subHdngs1' rowspan='2'>Water Quality Parameter</td><td class='ReportTable_subHdngs1' colspan='"+wb1_reading_colspan+"'>Reading (2021)</td>"+
                                          "<td class='ReportTable_subHdngs1' rowspan='2'>Acceptable Limit <sup>1</sup></td>"+
                                          "<td class='ReportTable_subHdngs1' rowspan='2'>Permissible Limit <sup>1</sup></td>"+
                                          wb_tbl1_monsoon_heading;
                                          wqpar.forEach(function(f,index){
                                            wqtbl=wqtbl+"<tr>"+"<td>"+(index+1)+"</td>"+"<td>"+parameter_lables[index]+"</td>";
                                            if(monsoon_status.pre){
                                              if(wqresults1.includes(f)){
                                                wqtbl=wqtbl+"<td style='color:red'>"+(wq_pre_value[f]==null?'':wq_pre_value[f])+" ("+wqresults_exceed1[f]+"%)"+"</td>";
                                              }
                                              else{
                                                wqtbl=wqtbl+"<td>"+(wq_pre_value[f]==null?'':wq_pre_value[f])+"</td>";
                                              }
                                            }

                                            if(monsoon_status.during){
                                              if(wqresults2.includes(f)){
                                                wqtbl=wqtbl+"<td style='color:red'>"+(wq_during_value[f]==null?'':wq_during_value[f])+" ("+wqresults_exceed2[f]+"%)"+"</td>";
                                              }
                                              else{
                                                wqtbl=wqtbl+"<td>"+(wq_during_value[f]==null?'':wq_during_value[f])+"</td>";
                                              }
                                            }

                                            if(monsoon_status.post){
                                              if(wqresults3.includes(f)){
                                                wqtbl=wqtbl+"<td style='color:red'>"+(wq_post_value[f]==null?'':wq_post_value[f])+" ("+wqresults_exceed3[f]+"%)"+"</td>";
                                              }
                                              else{
                                                wqtbl=wqtbl+"<td>"+(wq_post_value[f]==null?'':wq_post_value[f])+"</td>";
                                              }
                                            }
                                            wqtbl=wqtbl+"<td>"+wq_acclimits_table[index]+"</td><td>"+wqlimits_table[index]+"</td>"+"</tr>";
                                          });
                                          wqtbl=wqtbl+"</table>"+
                                          '<table class="akahReportTable" style="margin-bottom: 10px;"><tr><td>';
                                          if(monsoon_status.pre){
                                            wqtbl=wqtbl+'<div style="font-size: 14px;padding-top:2px;line-height: 1.6em;padding-bottom:2px"><span><b>Water Quality Status Pre-monsoon: </b><span>'+each_well_wq1[sv]+'<span></div>';
                                          }
                                          if(monsoon_status.during){
                                            wqtbl=wqtbl+'<div style="font-size: 14px;padding-top:2px;line-height: 1.6em;padding-bottom:2px"><span><b>Water Quality Status During-monsoon: </b><span>'+each_well_wq2[sv]+'<span></div>';
                                          }
                                          if(monsoon_status.post){
                                            wqtbl=wqtbl+'<div style="font-size: 14px;padding-top:2px;line-height: 1.6em;padding-bottom:2px"><span><b>Water Quality Status Post-monsoon: </b><span>'+each_well_wq3[sv]+'<span></div>';
                                          }
                                          wqtbl=wqtbl+'<div><b>*All the above water quality  limits are considered to verify the suitability of water for Drinking purpose.</b></div>'+
                                          '<div><b>*Percentage(%) indicates the level of voilation from the standard limits.</b></div>'+
                                          '</td></tr></table></div>'+'<div>'+
                                          '<span style="color: #717070;padding-top: 12px;">*Source:</span>'+'<span style="padding-left: 5px;margin-top: 12px;">Bureau of Indian Standards</span>'+'</div>'
                                      }
                                      tablecount=tablecount+1;
                                      // alert(tablecount);
                                    }
                                    if (akahvillage === "Katepimpalgaona") {
                                      window.waterQualityKt = '<div><div class="akah_level2_content"><div><p class="akah_level3_heading">4.4.4. Ground Water Quality</p></div><table class="akahReportTable"><tbody><tr><td style="font-size: 13px;"><div style="padding-top: 5px;text-align: center;"><span><b>Owner Name: </b></span><span>Ram Sonoba Pawar</span><span style="padding-left: 16px;"><b>Latitude: </b></span><span>19.850537</span><span style="padding-left: 16px;"><b>Longitude: </b></span><span>74.9237892</span><span style="margin-left: 16px; "><b>Well Depth: </b></span><span>23.47 m</span><span style="padding-left: 16px;"><b>Well ID: </b></span><span>OW119</span> </div> <div style="padding-top: 5px;text-align: center;"><span><b>Owner Name: </b></span><span>Ashok Sugand Dhanad</span><span style="padding-left: 16px;"><b>Latitude: </b></span><span>19.8402513</span><span style="padding-left: 16px;"><b>Longitude: </b></span><span>74.9072416</span><span><b style="margin-left: 14px; ">Well Depth: </b></span><span>17.07 m</span><span style="padding-left: 16px;"><b>Well ID: </b></span><span>OW81</span></div></td></tr></tbody></table><table class="akahReportTable2"><tbody><tr><td class="ReportTable_subHdngs1" rowspan="2">S.No</td><td class="ReportTable_subHdngs1" rowspan="2">Water Quality Parameter</td><td class="ReportTable_subHdngs1" colspan="2">Readings (Pre-monsoon)</td><td class="ReportTable_subHdngs1" rowspan="2">Acceptable Limit <sup>1</sup></td><td class="ReportTable_subHdngs1" rowspan="2">Permissible Limit <sup>1</sup></td></tr><tr><td class="ReportTable_subHdngs1">OW119</td> <td class="ReportTable_subHdngs1">OW81</td></tr><tr></tr><tr><td>1</td><td>pH</td><td>8.15</td><td>8.30</td><td>6.5 - 8.5</td><td>No relaxation</td></tr><tr><td>2</td><td>Electrical Conductivity (micro S/cm)</td><td>900</td><td>833</td><td>500</td><td>2000</td></tr><tr><td>3</td><td>Total Dissolved Solids (mg/Litre)</td><td>450</td><td>416</td><td>500</td><td>2000</td></tr><tr><td>4</td><td>Carbonate (mg/Litre)</td><td>25.00</td><td>0</td><td>75</td><td>75</td></tr><tr><td>5</td><td>Bicarbonate (mg/Litre)</td><td>300.00</td><td>300</td><td>125 - 350</td><td>125 - 350</td></tr><tr><td>6</td><td>Chloride (mg/Litre)</td><td>99.26</td><td>85.08</td><td>250</td><td>1000</td></tr><tr><td>7</td><td>Nitrate (mg/Litre)</td><td style="color:red">74.00</td><td style="color:red">77.80</td><td>45</td><td>No relaxation</td></tr><tr><td>8</td><td>Sulphate (mg/Litre)</td><td>14.80</td><td>37.20</td><td>200</td><td>400</td></tr><tr><td>9</td><td>Fluoride (mg/Litre)</td><td>0.75</td><td>0.83</td><td>1</td><td>1.5</td></tr><tr><td>10</td><td>Alkalinity (mg/Litre)</td><td>300.00</td><td>300.00</td><td>200</td><td>600</td></tr><tr><td>11</td><td>Calcium (mg/Litre)</td><td>83.33</td><td>83.33</td><td>75</td><td>200</td></tr><tr><td>12</td><td>Magnesium (mg/Litre)</td><td>35.00</td><td>30.00</td><td>30</td><td>100</td></tr><tr><td>13</td><td>Total Hardness (mg/Litre)</td><td>425.00</td><td>350.00</td><td>200</td><td>600</td></tr><tr><td>14</td><td>Potassium (mg/Litre)</td><td>8.60</td><td style="color: red; ">22.52</td><td>20</td><td>20</td></tr></tbody></table><table class="akahReportTable" style="margin-bottom: 10px;"><tbody><tr><td><div style="font-size: 14px;padding-top:2px;padding-bottom:2px"><span><b>Water Quality Status for OW119: </b><span>Nitrate is <b>NOT</b> within the Permissible Limits.<span></span></span></span></div><div style="font-size: 14px;text-align:center;padding-top:2px;padding-bottom:2px"><span><b>Water Quality Status for OW81: </b><span>Nitrate, Potassium are <b>NOT</b> within the Permissible Limits.<span></span></span></span></div> <div style="text-align: center; color: #9e3f07; "><b>*All the above water quality  limits are considered to verify the suitability of water for Drinking purpose.</b></div></td></tr></tbody></table><span><span style="color: #717070;padding-top: 12px;">*Source:</span><span style="padding-left: 5px;margin-top: 12px;">Bureau of Indian Standards</span></span><br><br></div></div>'
                                    }
                                    else if (akahvillage === "Amrapur Gira") {
                                      window.waterQualityAg = '<div><div class="akah_level2_content"><div><p class="akah_level3_heading">4.4.4. Ground Water Quality</p></div><table class="akahReportTable"><tbody><tr><td style="font-size: 12px;"> <div style="padding-top: 5px;text-align: center;"><span><b>Owner Name: </b></span><span>Dhirubhai Gokalbhai Pathar</span><span style="padding-left: 15px;"><b>Latitude: </b></span><span>21.178292</span><span style="padding-left: 7px;"><b>Longitude: </b></span><span>70.44173</span><span><b style="margin-left: 14px; ">Well Depth: </b></span><span>16.76 m</span><span style="padding-left: 16px;"><b>Well ID: </b></span><span>OW32</span></div><div style="padding-top: 5px;text-align: center;"><span><b>Owner Name: </b></span><span>Kadar Ali Kanjibhai Vegdani</span><span style="padding-left: 12px;"><b>Latitude: </b></span><span>21.1680037</span><span style="padding-left: 5px;"><b>Longitude: </b></span><span>70.4273084</span><span style="margin-left: 6px;"><b>Well Depth: </b></span><span>21.34 m</span><span style="padding-left: 9px;"><b>Well ID: </b></span><span>OW31</span> </div></td></tr></tbody></table><table class="akahReportTable2"><tbody><tr><td class="ReportTable_subHdngs1" rowspan="2">S.No</td><td class="ReportTable_subHdngs1" rowspan="2">Water Quality Parameter</td><td class="ReportTable_subHdngs1" colspan="2">Readings (Pre-monsoon)</td><td class="ReportTable_subHdngs1" rowspan="2">Acceptable Limit <sup>1</sup></td><td class="ReportTable_subHdngs1" rowspan="2">Permissible Limit <sup>1</sup></td></tr><tr><td class="ReportTable_subHdngs1">OW32</td> <td class="ReportTable_subHdngs1">OW31</td></tr><tr></tr><tr><td>1</td><td>pH</td><td>7.00</td> <td>8.47</td><td>6.5 - 8.5</td><td>No relaxation</td></tr><tr><td>2</td><td>Electrical Conductivity (micro S/cm)</td><td>82</td> <td>315</td><td>500</td><td>2000</td></tr><tr><td>3</td><td>Total Dissolved Solids (mg/Litre)</td><td>295</td> <td>157</td><td>500</td><td>2000</td></tr><tr><td>4</td><td>Carbonate (mg/Litre)</td> <td>75.00</td><td>75.00</td><td>75</td><td>75</td></tr><tr><td>5</td><td>Bicarbonate (mg/Litre)</td><td>200.00</td> <td>175.00</td><td>125 - 350</td><td>125 - 350</td></tr><tr><td>6</td><td>Chloride (mg/Litre)</td><td>212.70</td> <td>198.52</td><td>250</td><td>1000</td></tr><tr><td>7</td><td>Nitrate (mg/Litre)</td><td>17.20</td> <td>39.80</td><td>45</td><td>No relaxation</td></tr><tr><td>8</td><td>Sulphate (mg/Litre)</td><td>7.84</td> <td>3.88</td><td>200</td><td>400</td></tr><tr><td>9</td><td>Fluoride (mg/Litre)</td> <td>0.00</td><td>0.00</td><td>1</td><td>1.5</td></tr><tr><td>10</td><td>Alkalinity (mg/Litre)</td><td>600.00</td> <td>500.00</td><td>200</td><td>600</td></tr><tr><td>11</td><td>Calcium (mg/Litre)</td><td>66.67</td> <td>83.33</td><td>75</td><td>200</td></tr><tr><td>12</td><td>Magnesium (mg/Litre)</td><td>30.00</td> <td>10.00</td><td>30</td><td>100</td></tr><tr><td>13</td><td>Total Hardness (mg/Litre)</td> <td></td><td></td><td>200</td><td>600</td></tr><tr><td>14</td><td>Potassium (mg/Litre)</td><td>0.00</td> <td>0.60</td><td>20</td><td>20</td></tr></tbody></table><table class="akahReportTable" style="margin-bottom: 10px;"><tbody><tr><td><div style="font-size: 13px;padding-top:2px;padding-bottom:2px;"><span><b>Water Quality Status for OW32: </b><span><b>Suitable</b> - All parameters are within the permissible limits.<span></span></span></span></div><div style="font-size: 13px;text-align:center;padding-top:2px;padding-bottom:2px;"><span><b>Water Quality Status for OW31: </b><span><b>Suitable</b> - All parameters are within the permissible limits.</span></span></div> <div style="text-align: center; color: #9e3f07; "><b>*All the above water quality  limits are considered to verify the suitability of water for Drinking purpose.</b></div></td></tr></tbody></table><span><span style="color: #717070;"><span style="color: #717070;padding-top: 12px;">*Source:</span><span style="padding-left: 5px;margin-top: 12px;">Bureau of Indian Standards</span></span><br><br></span></div></div>'
                                    }

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
                                    // village level Water quality calculation ends here
                                  }
                                  window.wq_promisee=executeAll([wq_pre_querytask,wq_during_querytask,wq_post_querytask]);
                                  wq_promisee.then(wq_query_execute);
                                  });

              }
                else{
                  domAttr.set(sum_var[8],"innerHTML",'<b>'+"No Data"+'</b>');
                  domAttr.set(sum_var[9],"innerHTML",'<b>'+"No Data"+'</b>');
                  domAttr.set(sum_var[1],"innerHTML",'<b>'+"No Data"+'</b>');
                  rep_vil2="No Data";
                  rep_vil9='';
                  rep_vil10='';
                }
                //water levels mbgl calculation ends here


                //for calculating no of AKAH stations starts here
                domAttr.set(sum_var[0],"innerHTML",'<b>'+summ_selected_records1.features.length+'</b>');
                rep_vil1=summ_selected_records1.features.length;
                //for calculating no of AKAH stations ends here

                //Village Layer Query for the Dashboard
                // var mp=new esri.geometry.Multipoint(summ_selected_records1.features[0].geometry.spatialReference);
                // summ_selected_records1.features.forEach(function(f){mp.addPoint(f.geometry)});
                var query_summ1= new Query();
                //All the outfields are needed for water availability module
                query_summ1.where="state like" +" "+"\'"+ akahstate +"\'"  + " " + "AND" + " " + "district like" +" "+"\'"+ akahdistrict +"\'"+ " " + "AND" + " " + "block like" + " " + "\'" + akahblock + "\'"+ "AND" + " " + "village like" + " " + "\'" + akahvillage + "\'";;
                query_summ1.outFields = ["*"]
                query_summ1.returnGeometry = true;
                // query_summ1.geometry=mp;
                window.village_result=new QueryTask(akah_villages_layer.url).execute(query_summ1, function retrieve(summ){
                  window.village_def="1=1";
                  if(summ.features.length!=0){
                    //function to generate ndwi, ndvi charts in report
                    akah_Tool.generateIndicesCharts$report(summ.features[0].attributes["village_pk"])
                    //wsprv['village_response'] for surface water available, utilization module
                    wsprv['village_response'] = summ;
                    village_def="village_pk ="+summ.features[0].attributes["village_pk"];
                    if(summ.features[0].attributes["area_irrig_allsources_ha"]!=0 && summ.features[0].attributes["area_irrig_allsources_ha"]!=null && summ.features[0].attributes['area_irrig_canals_ha']!=null){
                      domAttr.set(sum_var[5],"innerHTML",'<b>'+summ.features[0].attributes["area_irrig_allsources_ha"].toFixed(2)+' ha'+'</b>');
                      rep_vil6=summ.features[0].attributes["area_irrig_allsources_ha"].toFixed(2)+' ha';
                      rv['village_areairr_sw']=summ.features[0].attributes['area_irrig_canals_ha']//+summ.features[0].attributes['area_irrig_allsources_ha']
                    }
                    else{
                      domAttr.set(sum_var[5],"innerHTML",'<b>'+"No Data"+'</b>');
                      rep_vil6=''
                      rv['village_areairr_sw']=''
                    }
                    if(summ.features[0].attributes["area_irrig_tubewells_ha"]!=0 && summ.features[0].attributes["area_irrig_tubewells_ha"]!=null){
                      domAttr.set(sum_var[6],"innerHTML",'<b>'+summ.features[0].attributes["area_irrig_tubewells_ha"]+' ha'+'</b>');
                      rep_vil7=summ.features[0].attributes["area_irrig_tubewells_ha"]+' ha';
                      rv['village_areairr_gw']=summ.features[0].attributes['area_irrig_tubewells_ha'];
                      rv['village_area_unirr']=430.45;
                    }
                    else{
                      domAttr.set(sum_var[6],"innerHTML",'<b>'+"No Data"+'</b>');
                      rep_vil7='';
                      rv['village_areairr_gw']='';
                      rv['village_area_unirr']='';
                    }
                    if(summ.features[0].attributes["village_area_ha"]!=0){
                      //domAttr.set(sum_var[6],"innerHTML",'<b>'+summ.features[0].attributes["village_area_ha"]+' ha'+'</b>');
                      rep_vil7_1=(summ.features[0].attributes["village_area_ha"]).toFixed(2);
                    }
                    else{
                      //domAttr.set(sum_var[6],"innerHTML",'<b>'+"No Data"+'</b>');
                      rep_vil7_1='';
                    }
                    if(summ.features[0].attributes["Major_Crops"]!=null){
                      //domAttr.set(sum_var[6],"innerHTML",'<b>'+summ.features[0].attributes["village_area_ha"]+' ha'+'</b>');
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
                    if (summ.features[0].attributes["recharge_rainfall_monsoon"]!=null) {
                      rv['rainfall_monsoon_val'] = Number(summ.features[0].attributes["recharge_rainfall_monsoon"])
                    }
                    else{
                      rv['rainfall_monsoon_val'] = ''
                    }
                    if (summ.features[0].attributes['recharge_rainfall_non_monsoon']!=null) {
                      rv['rainfall_nonmonsoon_val'] = Number(summ.features[0].attributes['recharge_rainfall_non_monsoon'])
                    }
                    else{
                      rv['rainfall_nonmonsoon_val'] = ''
                    }
                    if (summ.features[0].attributes['recharge_other_monsoon']!=null) {
                      rv['other_monsoon_val'] = Number(summ.features[0].attributes['recharge_other_monsoon'])
                    }
                    else{
                      rv['other_monsoon_val'] = ''
                    }
                    if (summ.features[0].attributes["recharge_other_non_monsoon"]!=null) {
                      rv['other_nonmonsoon_val'] = Number(summ.features[0].attributes["recharge_other_non_monsoon"])
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
                  t=t+f.attributes["total_population_census_2011"];
                  ma=ma+f.attributes["male_population_census_2011"];
                  fe=fe+f.attributes["female_population_census_2011"];
                  });


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
                  // if(akahblock=='Malia'){
                  //   rep_vil4=952+":"+1000;
                  // }

                }
                else{
                  rv["village_population_male"]='';
                  rv["village_population_female"]='';
                  domAttr.set(sum_var[3],"innerHTML",'<b>'+'No Data'+'</b>');
                  rep_vil4='';
                }


                // Aquifer Query for Village Dashboard starts here
                var query_summ1= new Query();
                query_summ1.outFields=["*"];
                query_summ1.geometry=summ.features[0].geometry;
                query_summ1.returnGeometry = false;
                window.aqui_village_dashboard=new QueryTask(akah_aqui.url).execute(query_summ1, function retrieve(summ){
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
                // Aquifer Query for Village Dashboard ends here

                // Watershed Query for Village Dashboard starts here
                var query_summ1= new Query();
                query_summ1.outFields=["Basin"];
                query_summ1.geometry=summ.features[0].geometry;
                query_summ1.returnGeometry = false;
                window.ws= new QueryTask(akah_watershed.url).execute(query_summ1, function retrieve(summ){
                  if(summ.features.length>0){
                    domAttr.set(sum_var[11],"innerHTML",'<b>'+summ.features[0].attributes["Basin"]+'</b>');
                    rep_vil12=summ.features[0].attributes["Basin"];
                  }
                  else{
                    domAttr.set(sum_var[11],"innerHTML",'<b>'+"No Data"+'</b>');
                    rep_vil12='';
                  }
                });
                // Watershed Query for Village Dashboard starts here

                // Surface Water Query Definition for Village Report starts here
                window.surwat_query_def=new Query();
                surwat_query_def.geometry = summ.features[0].geometry;
                surwat_query_def.outFields=["area_ha","capacity_ham"];
                // domAttr.set(sum_var[7],"innerHTML",'<b>'+"N.A."+'</b>');
                // rep_vil8="N.A.";
                // Surface Water Query Definition for Village Report ends here
                window.rep_bar_chart='';window.rep_sown_piechart='';window.rep_irrig_piechart='';window.rep_village_irrig_piechart = '';window.rep_rainfall_chart='';

                    // For creating the intersection geometry of the wells within the block starts here
                      var query_summ2 = new Query();
                      query_summ2.where ="state like" +" "+"\'"+ akahstate +"\'"  + " " + "AND" + " " + "district like" +" "+"\'"+ akahdistrict +"\'"+ " " + "AND" + " " + "block like" + " " + "\'" + akahblock + "\'";
                      query_summ2.outFields = ["*"]
                      query_summ2.returnGeometry = true
                      //need to write a condition in akah_selected wells layer for filtering of
                      //villages which are not available in akah_selected wells layer && present in akah_villages_ layer
                      window.rep_sel=new QueryTask(akah_selectedwells_layer.url).execute(query_summ2, function retrieve(summ_selected_records1) {
                        window.rep_selected_records = summ_selected_records1;
                        var villagenames=[];
                        summ_selected_records1.features.forEach(function (feature) {
                          if(feature.attributes.village_name!=null){villagenames.push(feature.attributes.village_name)}
                        });
                        window.rep_val1='';window.rep_val2='';window.rep_val3='';window.rep_val4='';window.rep_val5='';
                        window.rep_val6='';window.rep_val7='';window.rep_val8='';
                        rep_val1=(new Set(villagenames).size);
                        rep_val2=summ_selected_records1.features.length;
                        //rep_val4="Suitable";
                        var mp=new esri.geometry.Multipoint(rep_selected_records.features[0].geometry.spatialReference);
                        summ_selected_records1.features.forEach(function(f){mp.addPoint(f.geometry)});

                        // for selecting all the villages that are in study and aggregation - Level2 starts here
                        var query_summ1= new Query();
                        query_summ1.where ="state like" +" "+"\'"+ akahstate +"\'"  + " " + "AND" + " " + "district like" +" "+"\'"+ akahdistrict +"\'"+ " " + "AND" + " " + "block like" + " " + "\'" + akahblock + "\'";
                        query_summ1.outFields = ["total_population_census_2011", "male_population_census_2011", "female_population_census_2011","area_irrig_canals_ha","area_irrig_tubewells_ha","area_irrig_allsources_ha","village_area_ha","village_pk"];
                        query_summ1.returnGeometry = true;
                        // query_summ1.geometry=mp;

                        window.rep_village=new QueryTask(akah_villages_layer.url).execute(query_summ1, function retrieve(summ){
                          var t=0;
                          var m=0;
                          var fem=0;
                          var aiw=0;
                          var aic=0;
                          var blockarea=0;
                          var ee12=new esri.geometry.Polygon(summ.features[0].geometry.spatialReference);
                          window.ee12=ee12;
                          window.block_lulc_qs="("
                          window.block_lulc_bu = 0;window.block_lulc_wb = 0;window.block_lulc_gl = 0;window.block_lulc_al = 0;window.block_lulc_bl = 0;
                          summ.features.forEach(function(f){
                              block_lulc_qs=block_lulc_qs+f.attributes['village_pk']+","
                              ee12.addRing(f.geometry.rings[0]);
                              t=t+f.attributes["total_population_census_2011"];
                              m=m+f.attributes["male_population_census_2011"];
                              fem=fem+f.attributes["female_population_census_2011"];
                              aiw=aiw+f.attributes["area_irrig_tubewells_ha"];
                              aic=aic+f.attributes["area_irrig_canals_ha"]+f.attributes["area_irrig_allsources_ha"];
                              blockarea=blockarea+f.attributes["village_area_ha"];
                          });
                          block_lulc_qs=block_lulc_qs.slice(0,block_lulc_qs.length-1)+")";



                        // For LULC Charts Block level in report starts here --  Level3
                        //Code for LULC Chart in Report **(modified from here)
                        var query_lulc_block = new Query();
                        var monsoon = 'Post';
                        window.lulc_table_inp = {};
                        query_lulc_block.where = "village_pk in "+block_lulc_qs; // for getting values into table this query is taken
                        // query_lulc_block.where = "village_pk = "+akah_searchResponse.attributes.village_pk; // for getting values into table this query is taken
                        //block_lulc_qs == block LULC Query String - defined in the Level2 Village results above
                        query_lulc_block.outFields = ["*"];
                        window.lulc_block_results=new QueryTask(lulc_village_url).execute(query_lulc_block, function(lulc_block_result){
                          window.lulc_block_result = lulc_block_result;
                          window.lulc_table_inp['lulc_classes'] = ['grasslands_ha', 'agriculture_ha', 'water_bodies_ha','builtup_ha', 'barren_land_ha']
                          lulc_block_result.features.forEach(function(ft){
                              if (lulc_table_inp['pre_builtup_ha_'+ft.attributes['year']] === undefined) {
                                lulc_table_inp['pre_builtup_ha_'+ft.attributes['year']] = 0;
                              }
                              if (lulc_table_inp['pre_water_bodies_ha_'+ft.attributes['year']] === undefined) {
                                lulc_table_inp['pre_water_bodies_ha_'+ft.attributes['year']] = 0;
                              }
                              if (lulc_table_inp['pre_grasslands_ha_'+ft.attributes['year']] === undefined) {
                                lulc_table_inp['pre_grasslands_ha_'+ft.attributes['year']] = 0;
                              }
                              if (lulc_table_inp['pre_agriculture_ha_'+ft.attributes['year']] === undefined) {
                                lulc_table_inp['pre_agriculture_ha_'+ft.attributes['year']] = 0;
                              }
                              if (lulc_table_inp['pre_barren_land_ha_'+ft.attributes['year']] === undefined) {
                                lulc_table_inp['pre_barren_land_ha_'+ft.attributes['year']] = 0;
                              }
                              if (lulc_table_inp['post_builtup_ha_'+ft.attributes['year']] === undefined) {
                                lulc_table_inp['post_builtup_ha_'+ft.attributes['year']] = 0;
                              }
                              if (lulc_table_inp['post_water_bodies_ha_'+ft.attributes['year']] === undefined) {
                                lulc_table_inp['post_water_bodies_ha_'+ft.attributes['year']] = 0;
                              }
                              if (lulc_table_inp['post_grasslands_ha_'+ft.attributes['year']] === undefined) {
                                lulc_table_inp['post_grasslands_ha_'+ft.attributes['year']] = 0;
                              }
                              if (lulc_table_inp['post_agriculture_ha_'+ft.attributes['year']] === undefined) {
                                lulc_table_inp['post_agriculture_ha_'+ft.attributes['year']] = 0;
                              }
                              if (lulc_table_inp['post_barren_land_ha_'+ft.attributes['year']] === undefined) {
                                lulc_table_inp['post_barren_land_ha_'+ft.attributes['year']] = 0;
                              }
                              if (lulc_table_inp['year'] === undefined) {
                                lulc_table_inp['year'] = [];
                              }
                              /*array to store years of lulc inputs*/
                              lulc_table_inp['year'].push(Number(ft.attributes['year']))
                              /*ft.attributes['season'] contains trailing spaces after 'Pre' so used trim()*/
                              if (ft.attributes['season'].trim() === 'Pre') {
                                  lulc_table_inp['pre_builtup_ha_'+ft.attributes['year']] = lulc_table_inp['pre_builtup_ha_'+ft.attributes['year']]+ft.attributes['builtup_ha']
                                  lulc_table_inp['pre_water_bodies_ha_'+ft.attributes['year']] = lulc_table_inp['pre_water_bodies_ha_'+ft.attributes['year']]+ft.attributes['water_bodies_ha']
                                  lulc_table_inp['pre_grasslands_ha_'+ft.attributes['year']] = lulc_table_inp['pre_grasslands_ha_'+ft.attributes['year']]+ft.attributes['grasslands_ha']
                                  lulc_table_inp['pre_agriculture_ha_'+ft.attributes['year']] = lulc_table_inp['pre_agriculture_ha_'+ft.attributes['year']]+ft.attributes['agriculture_ha']
                                  lulc_table_inp['pre_barren_land_ha_'+ft.attributes['year']] = lulc_table_inp['pre_barren_land_ha_'+ft.attributes['year']]+ft.attributes['barren_land_ha']
                              }
                              /*ft.attributes['season'] contains trailing spaces after 'Post' so used trim()*/
                              else if (ft.attributes['season'].trim() === 'Post') {
                                  lulc_table_inp['post_builtup_ha_'+ft.attributes['year']] = lulc_table_inp['post_builtup_ha_'+ft.attributes['year']]+ft.attributes['builtup_ha']
                                  lulc_table_inp['post_water_bodies_ha_'+ft.attributes['year']] = lulc_table_inp['post_water_bodies_ha_'+ft.attributes['year']]+ft.attributes['water_bodies_ha']
                                  lulc_table_inp['post_grasslands_ha_'+ft.attributes['year']] = lulc_table_inp['post_grasslands_ha_'+ft.attributes['year']]+ft.attributes['grasslands_ha']
                                  lulc_table_inp['post_agriculture_ha_'+ft.attributes['year']] = lulc_table_inp['post_agriculture_ha_'+ft.attributes['year']]+ft.attributes['agriculture_ha']
                                  lulc_table_inp['post_barren_land_ha_'+ft.attributes['year']] = lulc_table_inp['post_barren_land_ha_'+ft.attributes['year']]+ft.attributes['barren_land_ha']
                              }
                              /*block-level pre-monsoon Lulc Table values*/
                              lulc_table_inp['pre_agriculture_ha_'+ft.attributes['year']+'_per'] = Number(Number(lulc_table_inp['pre_agriculture_ha_'+ft.attributes['year']]/(lulc_table_inp['pre_agriculture_ha_'+ft.attributes['year']]+lulc_table_inp['pre_barren_land_ha_'+ft.attributes['year']]+lulc_table_inp['pre_grasslands_ha_'+ft.attributes['year']]+lulc_table_inp['pre_builtup_ha_'+ft.attributes['year']]+lulc_table_inp['pre_water_bodies_ha_'+ft.attributes['year']]))*100).toFixed(2)
                              lulc_table_inp['pre_barren_land_ha_'+ft.attributes['year']+'_per'] = Number(Number(lulc_table_inp['pre_barren_land_ha_'+ft.attributes['year']]/(lulc_table_inp['pre_agriculture_ha_'+ft.attributes['year']]+lulc_table_inp['pre_barren_land_ha_'+ft.attributes['year']]+lulc_table_inp['pre_grasslands_ha_'+ft.attributes['year']]+lulc_table_inp['pre_builtup_ha_'+ft.attributes['year']]+lulc_table_inp['pre_water_bodies_ha_'+ft.attributes['year']]))*100).toFixed(2)
                              lulc_table_inp['pre_grasslands_ha_'+ft.attributes['year']+'_per'] = Number(Number(lulc_table_inp['pre_grasslands_ha_'+ft.attributes['year']]/(lulc_table_inp['pre_agriculture_ha_'+ft.attributes['year']]+lulc_table_inp['pre_barren_land_ha_'+ft.attributes['year']]+lulc_table_inp['pre_grasslands_ha_'+ft.attributes['year']]+lulc_table_inp['pre_builtup_ha_'+ft.attributes['year']]+lulc_table_inp['pre_water_bodies_ha_'+ft.attributes['year']]))*100).toFixed(2)
                              lulc_table_inp['pre_builtup_ha_'+ft.attributes['year']+'_per'] = Number(Number(lulc_table_inp['pre_builtup_ha_'+ft.attributes['year']]/(lulc_table_inp['pre_agriculture_ha_'+ft.attributes['year']]+lulc_table_inp['pre_barren_land_ha_'+ft.attributes['year']]+lulc_table_inp['pre_grasslands_ha_'+ft.attributes['year']]+lulc_table_inp['pre_builtup_ha_'+ft.attributes['year']]+lulc_table_inp['pre_water_bodies_ha_'+ft.attributes['year']]))*100).toFixed(2)
                              lulc_table_inp['pre_water_bodies_ha_'+ft.attributes['year']+'_per'] = Number(Number(lulc_table_inp['pre_water_bodies_ha_'+ft.attributes['year']]/(lulc_table_inp['pre_agriculture_ha_'+ft.attributes['year']]+lulc_table_inp['pre_barren_land_ha_'+ft.attributes['year']]+lulc_table_inp['pre_grasslands_ha_'+ft.attributes['year']]+lulc_table_inp['pre_builtup_ha_'+ft.attributes['year']]+lulc_table_inp['pre_water_bodies_ha_'+ft.attributes['year']]))*100).toFixed(2)
                              
                              /*block-level post-monsoon Lulc Table values*/
                              lulc_table_inp['post_agriculture_ha_'+ft.attributes['year']+'_per'] = Number(Number(lulc_table_inp['post_agriculture_ha_'+ft.attributes['year']]/(lulc_table_inp['post_agriculture_ha_'+ft.attributes['year']]+lulc_table_inp['post_barren_land_ha_'+ft.attributes['year']]+lulc_table_inp['post_grasslands_ha_'+ft.attributes['year']]+lulc_table_inp['post_builtup_ha_'+ft.attributes['year']]+lulc_table_inp['post_water_bodies_ha_'+ft.attributes['year']]))*100).toFixed(2)
                              lulc_table_inp['post_barren_land_ha_'+ft.attributes['year']+'_per'] = Number(Number(lulc_table_inp['post_barren_land_ha_'+ft.attributes['year']]/(lulc_table_inp['post_agriculture_ha_'+ft.attributes['year']]+lulc_table_inp['post_barren_land_ha_'+ft.attributes['year']]+lulc_table_inp['post_grasslands_ha_'+ft.attributes['year']]+lulc_table_inp['post_builtup_ha_'+ft.attributes['year']]+lulc_table_inp['post_water_bodies_ha_'+ft.attributes['year']]))*100).toFixed(2)
                              lulc_table_inp['post_grasslands_ha_'+ft.attributes['year']+'_per'] = Number(Number(lulc_table_inp['post_grasslands_ha_'+ft.attributes['year']]/(lulc_table_inp['post_agriculture_ha_'+ft.attributes['year']]+lulc_table_inp['post_barren_land_ha_'+ft.attributes['year']]+lulc_table_inp['post_grasslands_ha_'+ft.attributes['year']]+lulc_table_inp['post_builtup_ha_'+ft.attributes['year']]+lulc_table_inp['post_water_bodies_ha_'+ft.attributes['year']]))*100).toFixed(2)
                              lulc_table_inp['post_builtup_ha_'+ft.attributes['year']+'_per'] = Number(Number(lulc_table_inp['post_builtup_ha_'+ft.attributes['year']]/(lulc_table_inp['post_agriculture_ha_'+ft.attributes['year']]+lulc_table_inp['post_barren_land_ha_'+ft.attributes['year']]+lulc_table_inp['post_grasslands_ha_'+ft.attributes['year']]+lulc_table_inp['post_builtup_ha_'+ft.attributes['year']]+lulc_table_inp['post_water_bodies_ha_'+ft.attributes['year']]))*100).toFixed(2)
                              lulc_table_inp['post_water_bodies_ha_'+ft.attributes['year']+'_per'] = Number(Number(lulc_table_inp['post_water_bodies_ha_'+ft.attributes['year']]/(lulc_table_inp['post_agriculture_ha_'+ft.attributes['year']]+lulc_table_inp['post_barren_land_ha_'+ft.attributes['year']]+lulc_table_inp['post_grasslands_ha_'+ft.attributes['year']]+lulc_table_inp['post_builtup_ha_'+ft.attributes['year']]+lulc_table_inp['post_water_bodies_ha_'+ft.attributes['year']]))*100).toFixed(2)
                          });
                          /*remove the repetitive values from year array.*/
                          lulc_table_inp['year'] = lulc_table_inp['year'].filter( function( item, index, inputArray ) {
                                                            return inputArray.indexOf(item) == index;
                                                          });
                          /*x-axes input array for lulc charts*/
                          lulc_table_inp['year_inputForChart'] = [];
                          /*function to get values that are displayed as headings in 5-year lulc table*/
                          function getLulcClass(lulc_attribute){
                            switch(lulc_attribute){
                              case 'grasslands_ha': lulc_attribute = 'Forest Land';break;
                              case 'agriculture_ha': lulc_attribute = 'Agriculture Land';break;
                              case 'water_bodies_ha': lulc_attribute = 'Water Bodies';break;
                              case 'builtup_ha': lulc_attribute = 'Built Up';break;
                              case 'barren_land_ha': lulc_attribute = 'Barren Land';break;
                            }
                            return lulc_attribute
                          }
                          /*for loop to push block-level lulc values, pre and post monsoon table values*/
                          lulc_table_inp['lulc_table_th'] = "<td><b>Year</b></td>"
                          for(i=0;i<=lulc_table_inp['year'].length-1;i++){
                            lulc_table_inp['lulc_table_th'] = lulc_table_inp['lulc_table_th']+"<td><b>"+getLulcClass(lulc_table_inp['lulc_classes'][i])+"</b></td>"
                            lulc_table_inp['lulc_preTable_td'+lulc_table_inp['year'][i]] = "<td>"+lulc_table_inp['year'][i]+"</td>"
                            lulc_table_inp['lulc_postTable_td'+lulc_table_inp['year'][i]] = "<td>"+lulc_table_inp['year'][i]+"</td>"
                            for(j=0;j<=lulc_table_inp['lulc_classes'].length-1;j++){
                              if (lulc_table_inp['lulc_pre_'+lulc_table_inp['lulc_classes'][j].slice(0,-3)+'_arr'] === undefined) {
                                lulc_table_inp['lulc_pre_'+lulc_table_inp['lulc_classes'][j].slice(0,-3)+'_arr'] = []
                              }
                              if (lulc_table_inp['lulc_post_'+lulc_table_inp['lulc_classes'][j].slice(0,-3)+'_arr'] === undefined) {
                                lulc_table_inp['lulc_post_'+lulc_table_inp['lulc_classes'][j].slice(0,-3)+'_arr'] = []
                              }
                              /*assigning colors to each lulc-class bar*/
                              lulc_table_inp['lulc_preTable_td'+lulc_table_inp['year'][i]] = lulc_table_inp['lulc_preTable_td'+lulc_table_inp['year'][i]]+"<td>"+lulc_table_inp['pre_'+lulc_table_inp['lulc_classes'][j]+'_'+lulc_table_inp['year'][i]+'_per']+"</td>"
                              lulc_table_inp['lulc_postTable_td'+lulc_table_inp['year'][i]] = lulc_table_inp['lulc_postTable_td'+lulc_table_inp['year'][i]]+"<td>"+lulc_table_inp['post_'+lulc_table_inp['lulc_classes'][j]+'_'+lulc_table_inp['year'][i]+'_per']+"</td>"
                              
                              if (lulc_table_inp['lulc_classes'][j] === 'agriculture_ha') {
                                lulc_table_inp['lulc_pre_'+lulc_table_inp['lulc_classes'][j].slice(0,-3)+'_arr'].push({y:Number(lulc_table_inp['pre_'+lulc_table_inp['lulc_classes'][j]+'_'+lulc_table_inp['year'][i]+'_per']), fill:"#5adf5a", tooltip:Number(lulc_table_inp['pre_'+lulc_table_inp['lulc_classes'][j]+'_'+lulc_table_inp['year'][i]+'_per'])})
                              }
                              else{
                                lulc_table_inp['lulc_pre_'+lulc_table_inp['lulc_classes'][j].slice(0,-3)+'_arr'].push(Number(lulc_table_inp['pre_'+lulc_table_inp['lulc_classes'][j]+'_'+lulc_table_inp['year'][i]+'_per']))
                              }                              
                              if (lulc_table_inp['lulc_classes'][j] === 'agriculture_ha') {
                                lulc_table_inp['lulc_post_'+lulc_table_inp['lulc_classes'][j].slice(0,-3)+'_arr'].push({y:Number(lulc_table_inp['post_'+lulc_table_inp['lulc_classes'][j]+'_'+lulc_table_inp['year'][i]+'_per']), fill:"#5adf5a", tooltip:Number(lulc_table_inp['post_'+lulc_table_inp['lulc_classes'][j]+'_'+lulc_table_inp['year'][i]+'_per'])})
                              }
                              else{
                                lulc_table_inp['lulc_post_'+lulc_table_inp['lulc_classes'][j].slice(0,-3)+'_arr'].push(Number(lulc_table_inp['post_'+lulc_table_inp['lulc_classes'][j]+'_'+lulc_table_inp['year'][i]+'_per']))
                              }
                              // lulc_table_inp['lulc_post_'+lulc_table_inp['lulc_classes'][j].slice(0,-3)+'_arr'].push(Number(lulc_table_inp['post_'+lulc_table_inp['lulc_classes'][j]+'_'+lulc_table_inp['year'][i]+'_per']))
                            }
                            lulc_table_inp['year_inputForChart'].push({
                              text: lulc_table_inp['year'][i],
                              value: i+1
                            });
                          }
                          dojo.query('#blockLULC').style('display', 'block');
                          /*pre-monsoon and post monsoon charts for block level lulc*/
                          domAttr.set('block_akahLulc_preChart', 'innerHTML', '')
                          domAttr.set('block_akahLulc_postChart', 'innerHTML', '')
                          /*lulc pre-monsoon chart definition*/
                          window.blocklulc_preMonsoon_chart = new dojox.charting.Chart2D("block_akahLulc_preChart");
                          blocklulc_preMonsoon_chart.addPlot("blockLulc pre-monsoon", {type: "ClusteredColumns",gap:5,markers: true,tension: "2",animate: { duration: 2000, easing: dojo.fx.easing.bounceInOut }});
                          blocklulc_preMonsoon_chart.addAxis("x", {title:"Year",titleOrientation: "away",dropLabels: false, labelSizeChange: true, majorTicks:true, majorTickStep:1, minorTicks:false, font: "normal normal bold 12px Arial", fontColor: "black",
                            labels: lulc_table_inp['year_inputForChart']});
                          blocklulc_preMonsoon_chart.addAxis("y", {title:"Area(%)",fixLower: "major",fixUpper: "major", vertical: true});
                          /*lulc post-monsoon chart definition*/
                          window.blocklulc_postMonsoon_chart = new dojox.charting.Chart2D("block_akahLulc_postChart");
                          blocklulc_postMonsoon_chart.addPlot("blockLulc post-monsoon", {type: "ClusteredColumns",markers: true,gap:5,tension: "2",animate: { duration: 2000, easing: dojo.fx.easing.bounceInOut }});
                          blocklulc_postMonsoon_chart.addAxis("x", {title:"Year",titleOrientation: "away",dropLabels: false, labelSizeChange: true, majorTicks:true, majorTickStep:1, minorTicks:false, font: "normal normal bold 12px Arial", fontColor: "black",
                            labels: lulc_table_inp['year_inputForChart']});
                          blocklulc_postMonsoon_chart.addAxis("y", {title:"Area(%)",fixLower: "major",fixUpper: "major", vertical: true});
                          /*village level lulc table for 5 years*/
                          window.block_level_preTable = "<table class='lulcReportTable' style='width: 97%;margin: 50px 0px 10px 0px;'>"+"<tr><td colspan='"+(lulc_table_inp['year'].length+1)+"'>LULC Area (%): Pre-monsoon ("+lulc_table_inp['year'][0]+"-"+lulc_table_inp['year'][lulc_table_inp['year'].length-1]+")</td></tr><tr>"+lulc_table_inp['lulc_table_th']+"</tr>";
                          window.block_level_postTable = "<tr><td colspan='"+(lulc_table_inp['year'].length+1)+"'>LULC Area (%): Post-monsoon ("+lulc_table_inp['year'][0]+"-"+lulc_table_inp['year'][lulc_table_inp['year'].length-1]+")</td></tr><tr>"+lulc_table_inp['lulc_table_th']+"</tr>";
                          for(i=0;i<=lulc_table_inp['year'].length-1;i++){
                            block_level_preTable = block_level_preTable+"<tr>"+lulc_table_inp['lulc_preTable_td'+lulc_table_inp['year'][i]]+"</tr>"
                            block_level_postTable = block_level_postTable+"<tr>"+lulc_table_inp['lulc_postTable_td'+lulc_table_inp['year'][i]]+"</tr>"
                          }
                          /*lulc post-monsoon chart definition*/
                          domAttr.set('block_akahLulc_preVegChart', 'innerHTML', '')
                          window.blocklulc_preMonsoonVegt_chart = new dojox.charting.Chart2D("block_akahLulc_preVegChart");
                          blocklulc_preMonsoonVegt_chart.addPlot("Pre-Vegetation", {type: "Columns",markers: true,gap:5,maxBarSize: 60, tension: "2",animate: { duration: 2000, easing: dojo.fx.easing.bounceInOut }});
                          blocklulc_preMonsoonVegt_chart.addAxis("x", {title:"Year", dropLabels: false,titleOrientation: "away", labelSizeChange: true, majorTicks:true, majorTickStep:1, minorTicks:false, font: "normal normal bold 12px Arial", fontColor: "black",
                            labels: lulc_table_inp['year_inputForChart']});
                          blocklulc_preMonsoonVegt_chart.addAxis("y", {title:"Area(%)",fixLower: "major",fixUpper: "major", vertical: true});
                          blocklulc_preMonsoonVegt_chart.addSeries('agriculture', lulc_table_inp['lulc_pre_agriculture_arr'], {plot: "Pre-Vegetation",stroke: {color: "#FFFFFF",},fill: "#5adf5a"});
                          blocklulc_preMonsoonVegt_chart.title = "Long-term change in agriculture area during pre-monsoon ("+lulc_table_inp['year'][0]+"-"+lulc_table_inp['year'][lulc_table_inp['year'].length-1]+")"
                          blocklulc_preMonsoonVegt_chart.titleFont = "bold 12pt Arial"
                          blocklulc_preMonsoonVegt_chart.titlePos = "top"
                          blocklulc_preMonsoonVegt_chart.render();
                          /*lulc post-monsoon inputs*/
                          blocklulc_preMonsoon_chart.addSeries('grasslands', lulc_table_inp['lulc_pre_grasslands_arr'], {plot: "blockLulc pre-monsoon",fill: "#047d04"});
                          // blocklulc_preMonsoon_chart.addSeries('agriculture', lulc_table_inp['lulc_pre_agriculture_arr'], {plot: "blockLulc pre-monsoon",fill: "#5adf5a"});
                          blocklulc_preMonsoon_chart.addSeries('water_bodies', lulc_table_inp['lulc_pre_water_bodies_arr'], {plot: "blockLulc pre-monsoon",fill: "#2f92a3"});
                          blocklulc_preMonsoon_chart.addSeries('builtup', lulc_table_inp['lulc_pre_builtup_arr'], {plot: "blockLulc pre-monsoon",fill: "#bd3c11"});
                          blocklulc_preMonsoon_chart.addSeries('barren_land', lulc_table_inp['lulc_pre_barren_land_arr'], {plot: "blockLulc pre-monsoon",fill: "#edd8c0"});
                          /*lulc pre-monsoon title*/
                          blocklulc_preMonsoon_chart.title = "Long-term change in land use pattern during pre-monsoon ("+lulc_table_inp['year'][0]+"-"+lulc_table_inp['year'][lulc_table_inp['year'].length-1]+")"
                          blocklulc_preMonsoon_chart.titleFont = "bold 12pt Arial"
                          blocklulc_preMonsoon_chart.titlePos = "top"
                          blocklulc_preMonsoon_chart.render();
                          /*lulc post-monsoon chart definition*/
                          domAttr.set("block_akahLulc_postVegChart","innerHTML","");
                          window.blocklulc_postMonsoonVegt_chart = new dojox.charting.Chart2D("block_akahLulc_postVegChart");
                          blocklulc_postMonsoonVegt_chart.addPlot("Post-Vegetation", {type: "Columns",markers: true,gap:5,maxBarSize: 60, tension: "2",animate: { duration: 2000, easing: dojo.fx.easing.bounceInOut }});
                          blocklulc_postMonsoonVegt_chart.addAxis("x", {title:"Year", dropLabels: false,titleOrientation: "away", labelSizeChange: true, majorTicks:true, majorTickStep:1, minorTicks:false, font: "normal normal bold 12px Arial", fontColor: "black",
                            labels: lulc_table_inp['year_inputForChart']});
                          blocklulc_postMonsoonVegt_chart.addAxis("y", {title:"Area(%)",fixLower: "major",fixUpper: "major", vertical: true});
                          blocklulc_postMonsoonVegt_chart.addSeries('agriculture', lulc_table_inp['lulc_post_agriculture_arr'], {plot: "Post-Vegetation",stroke: {color: "#FFFFFF",},fill: "#5adf5a"});
                          blocklulc_postMonsoonVegt_chart.title = "Long-term change in agriculture area during post-monsoon ("+lulc_table_inp['year'][0]+"-"+lulc_table_inp['year'][lulc_table_inp['year'].length-1]+")"
                          blocklulc_postMonsoonVegt_chart.titleFont = "bold 12pt Arial"
                          blocklulc_postMonsoonVegt_chart.titlePos = "top"
                          blocklulc_postMonsoonVegt_chart.render();
                          /*lulc post-monsoon inputs*/
                          blocklulc_postMonsoon_chart.addSeries('grasslands', lulc_table_inp['lulc_post_grasslands_arr'], {plot: "blockLulc post-monsoon",fill: "#047d04"});
                          // blocklulc_postMonsoon_chart.addSeries('agriculture', lulc_table_inp['lulc_post_agriculture_arr'], {plot: "blockLulc post-monsoon",fill: "#5adf5a"});
                          blocklulc_postMonsoon_chart.addSeries('water_bodies', lulc_table_inp['lulc_post_water_bodies_arr'], {plot: "blockLulc post-monsoon",fill: "#2f92a3"});
                          blocklulc_postMonsoon_chart.addSeries('builtup', lulc_table_inp['lulc_post_builtup_arr'], {plot: "blockLulc post-monsoon",fill: "#bd3c11"});
                          blocklulc_postMonsoon_chart.addSeries('barren_land', lulc_table_inp['lulc_post_barren_land_arr'], {plot: "blockLulc post-monsoon",fill: "#edd8c0"});
                          /*lulc post-monsoon title*/
                          blocklulc_postMonsoon_chart.title = "Long-term change in land use pattern during post-monsoon ("+lulc_table_inp['year'][0]+"-"+lulc_table_inp['year'][lulc_table_inp['year'].length-1]+")"
                          blocklulc_postMonsoon_chart.titleFont = "bold 12pt Arial"
                          blocklulc_postMonsoon_chart.titlePos = "top"
                          blocklulc_postMonsoon_chart.render();
                          
                          domAttr.set('block_vegtpre_legend', 'innerHTML', '<div style="padding-left:39%;">'+'<span style="padding: 0px 8px 0px 8px;color:#5adf5a;background-color:#5adf5a;font-size: 13px;border-radius:3px;"></span><span>&nbsp;Agriculture Land</span>'+'<div>')
                          domAttr.set("block_precluster_legend","innerHTML",'<div style="line-height: 2em;text-align:center;">'+
                          '<span style="padding: 0px 8px 0px 8px;color:#047d04;background-color:#047d04;font-size: 13px;border-radius:3px;"></span><span>&nbsp;Forest Land</span>'+
                          '<span style="padding: 0px 8px 0px 8px;color:#edd8c0;background-color:#edd8c0;font-size: 13px;border-radius:3px;margin-left: 10px;">.</span><span>&nbsp;Barren Land</span>'+
                          '<span style="padding: 0px 8px 0px 8px;color:#2f92a3;border-radius:3px;background-color:#2f92a3;font-size: 13px;margin-left: 10px;">.</span><span>&nbsp;Water Bodies</span>'+
                          '<span style="padding: 0px 8px 0px 8px;color:#bd3c11;background-color:#bd3c11;font-size: 13px;border-radius:3px;margin-left: 10px;">.</span><span>&nbsp;Built Up</span></div>')
                          domAttr.set('block_vegtpost_legend', 'innerHTML', '<div style="padding-left:39%;">'+'<span style="padding: 0px 8px 0px 8px;color:#5adf5a;background-color:#5adf5a;font-size: 13px;border-radius:3px;"></span><span>&nbsp;Agriculture Land</span>'+'<div>')
                          domAttr.set("block_postcluster_legend","innerHTML",'<div style="line-height: 2em;text-align:center;">'+
                          '<span style="padding: 0px 8px 0px 8px;color:#047d04;background-color:#047d04;font-size: 13px;border-radius:3px;"></span><span>&nbsp;Forest Land</span>'+
                          '<span style="padding: 0px 8px 0px 8px;color:#edd8c0;background-color:#edd8c0;font-size: 13px;border-radius:3px;margin-left: 10px;">.</span><span>&nbsp;Barren Land</span>'+
                          '<span style="padding: 0px 8px 0px 8px;color:#2f92a3;border-radius:3px;background-color:#2f92a3;font-size: 13px;margin-left: 10px;">.</span><span>&nbsp;Water Bodies</span>'+
                          '<span style="padding: 0px 8px 0px 8px;color:#bd3c11;background-color:#bd3c11;font-size: 13px;border-radius:3px;margin-left: 10px;">.</span><span>&nbsp;Built Up</span></div><br><br><br><br>')
                          
                          dojo.query('#blockLULC').style('display', 'none');
                          window.block_level_lulcTable = block_level_preTable + block_level_postTable+"</table>";
                        });
                        // For LULC Charts Block level in report ends here --  Level3

                        // For CGWB Groundwater Level status in report starts here --  Level3
                        var query_summ_cgwb =  new Query()
                        query_summ_cgwb.where = "state like" +" "+"\'"+ akahstate +"\'"  + " " + "AND" + " " + "district like" +" "+"\'"+ akahdistrict +"\'"+ " " + "AND" + " " + "block like" + " " + "\'" + akahblock + "\'";
                        query_summ_cgwb.outFields=["may_2014","may_2015","may_2016","may_2017","may_2018","may_2019","nov_2014","nov_2015","nov_2016","nov_2017","nov_2018","nov_2019"];
                        query_summ_cgwb.returnGeometry = false;
                        
                        window.block_cgwb_wl_query=new QueryTask(gwm_station_layer.url).execute(query_summ_cgwb, function retrieve(summ){
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
                        // For CGWB Groundwater Level status in report ends here --  Level3

                        // Extent for fitting Main Block Map starts here -- Level3
                        var query_districtKey = new Query()
                        query_districtKey.where = "state like" +" "+"\'"+ akahstate +"\'" + " " + "AND" + " " + "district like" +" "+"\'"+ akahdistrict +"\'"+"AND block like '"+akahblock+"'"
                        query_districtKey.outFields = ["block"]
                        query_districtKey.returnGeometry = true
                        window.blockMapExtent = new QueryTask(akah_block_layer.url).execute(query_districtKey, function(blockVar){
                            //block extent to be used for main map
                            window.akahBlockExtent = new Extent(blockVar.features[0].geometry.getExtent())
                            // akah_Tool.map.setExtent(akahBlockExtent)
                        });
                        // Extent for fitting Main Block Map ends here -- Level3

                        // For Block level Census data in Report starts here  -- Level3
                        var query_summ12= new Query();
                        query_summ12.outFields=["*"];
                        query_summ12.returnGeometry = true;
                        query_summ12.where="block like '"+akahblock+"'";
                        window.rep_block_result=new QueryTask(akah_block_url).execute(query_summ12, function(summ1){
                          window.block_query_results=summ1
                          if(summ1.features.length>0){
                            // code for new block layer values
                            rep_val6_1=summ1.features[0].attributes["block_area_ha"];
                            rv["block_area_ha"]=summ1.features[0].attributes["block_area_ha"];
                            var t=summ1.features[0].attributes['total_population_census_2011'];
                            var ma=summ1.features[0].attributes['male_population_census_2011'];
                            var fe=summ1.features[0].attributes['female_population_census_2011']
                            if(t==0 || t==null){
                              rep_val3='';
                              rv["block_male_pop"]=''
                              rv["block_female_pop"]=''
                            }
                            else{
                              rep_val3=t;
                            }

                            if(ma==0 || ma==null){
                              rv["block_male_pop"]=''
                            }
                            else{
                              rv["block_male_pop"]=ma
                            }

                            if(fe==0 || fe==null){
                              rv["block_female_pop"]=''
                            }
                            else{
                              rv["block_female_pop"]=fe;
                            }

                            if(fe==null || ma==null || fe==0 || ma==0){
                              rv["block_fm_ratio"]=''
                            }
                            else{
                              var divi=Math.round(fe*1000/ma);
                              rv["block_fm_ratio"]=divi+":"+1000;
                            }
                            var aiw=summ1.features[0].attributes['area_irrig_tubewells_ha'];
                            var aic=summ1.features[0].attributes['area_irrig_canals_ha']+summ1.features[0].attributes['area_irrig_tanks_lakes_ha']+summ1.features[0].attributes['area_irrig_waterfalls_ha']+summ1.features[0].attributes['area_irrig_othersources_ha'];
                            var unirr=summ1.features[0].attributes['total_unirrig_land_ha'];
                            var nsa=summ1.features[0].attributes['net_area_sown_ha']
                            if (unirr==0 || unirr==null) {
                              rv["unirrigated_land_block"]=''
                            }
                            else{
                              rv["unirrigated_land_block"]=unirr.toFixed(2);
                            }
                            if (nsa==0 || nsa==null) {
                              rv["net_sown_area_block"]=''
                            }
                            else{
                              rv["net_sown_area_block"]=nsa;
                            }
                            if(aiw==0 || aiw==null){
                              rv["block_areairr_wells"]=''
                            }
                            else{
                              rv["block_areairr_wells"]=Number(Number(aiw).toFixed(2));
                            }
                            if(aic==0 || aic==null){
                              rv["block_areairr_canals"]=''
                            }
                            else{
                              rv["block_areairr_canals"]=Number(Number(aic).toFixed(2));
                            }

                            //Code for Irrigation Charts in Report block level**(modified till here)
                             dojo.query('#areaIrrig').innerHTML('');
                             dojo.query('#pieChartareaIrrig').style('display', 'block');
                             if (rv["block_areairr_canals"] != "" && rv["block_areairr_wells"] != "") {
                               //Source of Irrigation block level chart for agakhan summary widget
                               akah_areaIrrigChart = new dojox.charting.Chart2D("areaIrrig", { type: Pie , font: "normal normal normal 14px TimesnewRoman", fontColor: "black", radius: 100, stroke: {width: 0}, labelOffset: -16, labels: true, labelStyle: "default",htmlLabels: true});
                               var akahAreairr_Data = [{ y: rv["block_areairr_canals"], text: "<p>"+Number((rv["block_areairr_canals"]/(rv["block_areairr_canals"]+rv["block_areairr_wells"]))*100).toFixed(2)+"%<br>("+rv["block_areairr_canals"].toFixed(2)+" ha)</p>", fill:"green",stroke: {color: "white", width: 1}},
                                                { y: rv["block_areairr_wells"], text: "<p>"+Number((rv["block_areairr_wells"]/(rv["block_areairr_canals"]+rv["block_areairr_wells"]))*100).toFixed(2)+"%<br>("+rv["block_areairr_wells"]+" ha)</p>", fill:"darkseagreen",stroke: {color: "white", width: 1}}];
                               akah_areaIrrigChart.addPlot("default", { type: Pie , font: "normal normal bold 12px TimesnewRoman", fontColor: "black", radius: 250, stroke: {width: 1}, labelOffset: -28, labels: true, labelStyle: "default",htmlLabels: true});
                               akah_areaIrrigChart.addSeries("Series A", akahAreairr_Data); //Adds Displacement Data to chart
                               akah_areaIrrigChart.render();
                               akah_areaIrrigChart.resize(480,325);

                               rep_irrig_piechart=rep_irrig_piechart+'<div style="display:inline-flex;"><div>'+dojo.query('#pieChartareaIrrig').innerHTML()+'</div>'+
                               "</div>";
                               dojo.query('#pieChartareaIrrig').style('display', 'none');
                               // code ends for irrigation pie chart block level
                             }
                             else{
                               rep_irrig_piechart=rep_irrig_piechart+'<div>'+'Data is not available for this village in the Census 2011 records'+'</div>'
                             }


                            if (rv['village_areairr_sw']!="" || rv['village_areairr_gw']!="") {
                              /*irrigation pie chart for village*/
                             dojo.query('#village_areaIrrig').innerHTML('');
                             dojo.query('#village_pieChartareaIrrig').style('display', 'block');
                             akah_village_IrrigChart = new dojox.charting.Chart2D("village_areaIrrig", { type: Pie , font: "normal normal normal 14px TimesnewRoman", fontColor: "white",troke: {width: 0},  labels: true, labelStyle: "default",htmlLabels: true});
                             var akahVillage_irr_Data = [{ y: rv['village_areairr_sw'], text: "<p>"+Number((rv['village_areairr_sw']/(rv['village_areairr_sw']+rv['village_areairr_gw']))*100).toFixed(2)+"%<br>("+rv['village_areairr_sw'].toFixed(2)+"ha)</p>", fill: "#0092CD", stroke: {color: "white", width: 1}},
                                              { y: rv['village_areairr_gw'], text: "<p>"+Number((rv['village_areairr_gw']/(rv['village_areairr_sw']+rv['village_areairr_gw']))*100).toFixed(2)+"%<br>("+(rv['village_areairr_gw'])+" ha)</p>", fill:"#00833f",stroke: {color: "white", width: 1}}];
                             akah_village_IrrigChart.addPlot("default", { type: Pie , font: "normal normal bold 15px TimesnewRoman", fontColor: "white",stroke: {width: 1}, labels: true, labelStyle: "default",htmlLabels: true});
                             akah_village_IrrigChart.addSeries("Series A", akahVillage_irr_Data);
                             akah_village_IrrigChart.title = "Sources of Irrigation"
                             akah_village_IrrigChart.titleFont= "bold 12pt Arial"
                             akah_village_IrrigChart.titlePos = "top"
                             // akah_village_IrrigChart.titleGap = 0
                             akah_village_IrrigChart.render();
                            //  akah_village_IrrigChart.resize(480,325);

                             rep_village_irrig_piechart=rep_village_irrig_piechart+'<div style="display:inline-flex;"><div>'+dojo.query('#village_pieChartareaIrrig').innerHTML()+'</div>'+
                             "<div style='padding-top: 170px;margin-left:-100px;'>"+
                             '<div><span style="width:17px;height:16px;border:1.6px solid white;background-color:#0092CD;border-radius: 4px;color:#0092CD;padding: 0px 5px 0px 8px;">.</span><span style="padding-left:5px;"><b>Surface Water</b></span></div>'+
                             '<div style="padding-top:10px;"><span style="width:17px;height:16px;border:1.6px solid white;background-color: #00833f;color:#00833f;border-radius: 4px;padding: 0px 5px 0px 8px;">.</span><span style="padding-left:5px;"><b>Ground Water</b></span></div>'+
                             "</div></div>";
                             dojo.query('#village_pieChartareaIrrig').style('display', 'none');
                             /*irrigation pie chart for village*/
                           }
                           else{
                             rep_village_irrig_piechart='<div>'+'Data is not available for this village in the Census 2011 records'+'</div>';
                           }
                        }
                        // else{
                        //     rep_val4='';
                        //     function results1(r){
                        //       dojo.byId("akahwellInventory_Report").removeAttribute('disabled');
                        //       dojo.query("#pr_load").style("display","none");
                        //     }
                        //     var promisee=executeAll([village_lulc_result,lulc_block_results,total_village_query,block_wr,wr,rep_block_result,rep_selected_wells,block_cgwb_wl_query,rf_chart_query]);
                        //     promisee.then(results1);
                        //   }
                        });
                        // For Block level Census data in Report starts here  -- Level3


                        // For Village Level Surface Water in Report starts here  -- Level3
                        window.surWat=new QueryTask(akah_sw1.url).execute(surwat_query_def, function retrieve(summ_sw1){
                          //wsprv['surf_wtr_response_wsp'] for surface water available module
                          window.wsprv['surf_wtr_response_wsp'] = summ_sw1;
                          if(summ_sw1.features.length>0){
                            var area_sw=0;
                            // rv["surface_water_bodies_count"]=summ.features.length;
                            summ_sw1.features.forEach(function(f){
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
                              // rv['sw_available_village'] = area_sw*3-(rep_vil7_1*0.001*rep_vil7_1*summ.features[0].attributes['annual_pet_mm']/rv['block_area_abs']);
                              rv['sw_available_village'] = (area_sw*3-(area_sw*summ.features[0].attributes['annual_pet_mm']*0.001)).toFixed(2);
                              // domAttr.set(sum_var[7],"innerHTML",'<b>'+area_sw+" ha m"+'</b>');
                              // rep_vil8=area_sw+" ha m"
                            }
                          }
                          else{
                            // domAttr.set(sum_var[7],"innerHTML",'<b>'+"N.A."+'</b>');
                            // rep_vil8="N.A."
                            rv['surface_water_bodies_count'] = "No Surface water bodies available";
                            rv['sw_storage_volume_village'] = 'Not Applicable';
                            // rv['sw_available_village'] = 'Not Applicable';
                            if(akahvillage === 'Amrapur Gir'){var area_sw = 217.01}
                            if(area_sw==0){
                              rv['sw_storage_volume_village'] = 'Not Applicable';
                              rv['sw_available_village'] = 'Not Applicable';
                              // domAttr.set(sum_var[7],"innerHTML",'<b>'+"N.A."+'</b>');
                              // rep_vil8="N.A."
                            }
                            else{
                              if (area_sw==null) {
                                rv['surface_water_bodies_count'] = "No Surface water bodies available";
                              }
                              else{
                                rv["surface_water_bodies_count"] = area_sw;
                              }
                              rv['sw_storage_volume_village'] = (area_sw*1.5).toFixed(2);
                              // rv['sw_available_village'] = area_sw*3-(rep_vil7_1*0.001*rep_vil7_1*summ.features[0].attributes['annual_pet_mm']/rv['block_area_abs']);
                              rv['sw_available_village'] = Number(area_sw*3-(area_sw*summ.features[0].attributes['annual_pet_mm']*0.001)).toFixed(2);
                              // domAttr.set(sum_var[7],"innerHTML",'<b>'+area_sw+" ha m"+'</b>');
                              // rep_vil8=area_sw+" ha m"
                            }
                          }
                          //to access water availability, utilization, balance, budget modules

                        });
                        // For Village Level Surface Water in Report ends here  -- Level3

                        // Total Villages Count and Area Query Definition for Village Report ends here
                        window.query_total_village = new Query()
                        query_total_village.outFields = ["village","Shape_Area"]
                        query_total_village.returnGeometry = false
                        query_total_village.where = "state like" +" "+"\'"+ akahstate +"\'"  + " " + "AND" + " " + "district like" +" "+"\'"+ akahdistrict +"\'"+ " " + "AND" + " " + "Block like" + " " + "\'" + akahblock + "\'";
                        
                        // Total Villages Count and Area Query Definition for Village Report ends here
                        // For Block level Total villages count and Area in Report starts here  -- Level3

                        // akah_total_villages_layer => akah_study_villages layer for retrieving the count of villages.
                        window.akah_total_villages_layer = "https://geomonitor.co.in/server/rest/services/agakhan/Vilages_study_area/FeatureServer/0"
                        
                        window.total_village_query=new QueryTask(akah_total_villages_layer).execute(query_total_village, function retrieve(village_response) {
                          // alert('total no.of villages'+village_response.features.length);
                          if(village_response.features.length>0){
                            
                            /*To show the total villages in a block, in the water governance report.*/
                            rv['Total_villages_in_block'] = village_response.features.length;

                            /*commented below lines as of now... since largest village and smallest village in area comparision is not in use now.*/
                            // var vill_area=[]
                            // village_response.features.forEach(function(j){
                            //   if (j.attributes["village"] != null) {
                            //     vill_area.push(j.attributes["Shape_Area"]);
                            //   }
                            // })
                            // rv['Largest_village']=village_response.features[vill_area.indexOf(Math.max(...vill_area))].attributes["VILLNAME"]
                            // rv['Smallest_village']=village_response.features[vill_area.indexOf(Math.min(...vill_area))].attributes["VILLNAME"]
                            // if (akahblock === 'Yeotmal') {
                            //   rv['Total_villages_in_block'] = 157
                            // }
                            // if (akahvillage === 'Amrapur Gir') {
                            //   rv['Total_villages_in_block'] = 67
                            // }
                          }
                          else{
                            // rv['Largest_village']=''
                            // rv['Smallest_village']=''

                            /*To show the total villages in a block, in the water governance report.*/
                            rv['Total_villages_in_block']=''
                            
                            // if (akahvillage === 'Amrapur Gir') {
                            //   rv['Total_villages_in_block'] = 67
                            // }
                            // if (akahblock === 'Yeotmal') {
                            //   rv['Total_villages_in_block'] = 157
                            // }
                          }
                        });
                        // For Block level Total villages count and Area in Report ends here  -- Level3

                        akah_Tool.getLULCDefaultCharts("toReport","Pre&Post");
                        // //Query for Default LULC Village Chart starts here -- Level3
                        // window.villageLulc_table_inp = {};/*json variable to store all the lulc variable values*/
                        // var querylulc = new Query();
                        // /*since we are taking 5-year data of pre and post monsoon for analysis removed year = 2020 AND season = 'Post' from where of the query.*/
                        // // querylulc.where = "village_pk="+akah_searchResponse.attributes.OBJECTID
                        // querylulc.where = "village_pk="+akah_searchResponse.attributes.village_pk
                        // querylulc.outFields = ["*"]
                        // window.village_lulc_result = new QueryTask(lulc_village_url).execute(querylulc, function(lulc_var){
                        //     window.lulc_var = lulc_var;
                        //     window.villageLulc_table_inp['lulc_classes'] = ['grasslands_ha', 'agriculture_ha', 'water_bodies_ha','builtup_ha', 'barren_land_ha']
                        //     // window.villa ge_lulc_bu = 0;window.village_lulc_wb = 0;window.village_lulc_gl = 0;window.village_lulc_al = 0;window.village_lulc_bl = 0;
                        //     lulc_var.features.forEach(function(ft){
                        //       // variables declared for pre and post monsoon lulc charts in village level.
                        //       if (villageLulc_table_inp['pre_grasslands_ha'] === undefined) {
                        //         villageLulc_table_inp['pre_grasslands_ha'] = [];
                        //       }
                        //       if (villageLulc_table_inp['pre_agriculture_ha'] === undefined) {
                        //         villageLulc_table_inp['pre_agriculture_ha'] = [];
                        //       }
                        //       if (villageLulc_table_inp['pre_water_bodies_ha'] === undefined) {
                        //         villageLulc_table_inp['pre_water_bodies_ha'] = [];
                        //       }
                        //       if (villageLulc_table_inp['pre_builtup_ha'] === undefined) {
                        //         villageLulc_table_inp['pre_builtup_ha'] = [];
                        //       }
                        //       if (villageLulc_table_inp['pre_barren_land_ha'] === undefined) {
                        //         villageLulc_table_inp['pre_barren_land_ha'] = [];
                        //       }
                        //       /*array for post-monsoon lulc classes values*/
                        //       if (villageLulc_table_inp['post_grasslands_ha'] === undefined) {
                        //         villageLulc_table_inp['post_grasslands_ha'] = [];
                        //       }
                        //       if (villageLulc_table_inp['post_agriculture_ha'] === undefined) {
                        //         villageLulc_table_inp['post_agriculture_ha'] = [];
                        //       }
                        //       if (villageLulc_table_inp['post_water_bodies_ha'] === undefined) {
                        //         villageLulc_table_inp['post_water_bodies_ha'] = [];
                        //       }
                        //       if (villageLulc_table_inp['post_builtup_ha'] === undefined) {
                        //         villageLulc_table_inp['post_builtup_ha'] = [];
                        //       }
                        //       if (villageLulc_table_inp['post_barren_land_ha'] === undefined) {
                        //         villageLulc_table_inp['post_barren_land_ha'] = [];
                        //       }
                        //       if (villageLulc_table_inp['year'] === undefined) {
                        //         villageLulc_table_inp['year'] = [];
                        //       }
                        //       /*array to store years of lulc inputs*/
                        //       villageLulc_table_inp['year'].push(Number(ft.attributes['year']))
                        //       /*ft.attributes['season'] contains trailing spaces after 'Pre' so used trim()*/
                        //       if (ft.attributes['season'].trim() === 'Pre') {
                        //         villageLulc_table_inp['pre_builtup_ha'].push(Number(ft.attributes['builtup_ha']))
                        //         villageLulc_table_inp['pre_water_bodies_ha'].push(Number(ft.attributes['water_bodies_ha']))
                        //         villageLulc_table_inp['pre_grasslands_ha'].push(Number(ft.attributes['grasslands_ha']))
                        //         villageLulc_table_inp['pre_agriculture_ha'].push(Number(ft.attributes['agriculture_ha']))
                        //         villageLulc_table_inp['pre_barren_land_ha'].push(Number(ft.attributes['barren_land_ha']))
                        //       }
                        //       /*ft.attributes['season'] contains trailing spaces after 'Post' so used trim()*/
                        //       else if (ft.attributes['season'].trim() === 'Post') {
                        //         villageLulc_table_inp['post_builtup_ha'].push(Number(ft.attributes['builtup_ha']))
                        //         villageLulc_table_inp['post_water_bodies_ha'].push(Number(ft.attributes['water_bodies_ha']))
                        //         villageLulc_table_inp['post_grasslands_ha'].push(Number(ft.attributes['grasslands_ha']))
                        //         villageLulc_table_inp['post_agriculture_ha'].push(Number(ft.attributes['agriculture_ha']))
                        //         villageLulc_table_inp['post_barren_land_ha'].push(Number(ft.attributes['barren_land_ha']))
                        //       }
                        //     });
                        //     /*remove the repetitive values from year array.*/
                        //     villageLulc_table_inp['year'] = villageLulc_table_inp['year'].filter( function( item, index, inputArray ) {
                        //                                       return inputArray.indexOf(item) == index;
                        //                                     });
                        //     /*x-axes input array for lulc charts*/
                        //     villageLulc_table_inp['year_inputForChart'] = [];
                        //     for(i=0;i<=villageLulc_table_inp['year'].length-1;i++){
                        //         villageLulc_table_inp['lulc_preTable_td_'+villageLulc_table_inp['year'][i]] = "<td>"+villageLulc_table_inp['year'][i]+"</td>";
                        //         villageLulc_table_inp['lulc_postTable_td_'+villageLulc_table_inp['year'][i]] = "<td>"+villageLulc_table_inp['year'][i]+"</td>";
                        //         villageLulc_table_inp['year_inputForChart'].push({
                        //           text: villageLulc_table_inp['year'][i],
                        //           value: i+1
                        //         });
                        //     }
                        //     villageLulc_table_inp['lulc_table_th'] = "<td><b>Year</b></td>"
                        //     /*function to get values that are displayed as headings in 5-year lulc table*/
                        //     function getLulcClass(lulc_attribute){
                        //       switch(lulc_attribute){
                        //         case 'grasslands_ha': lulc_attribute = 'Forest Land';break;
                        //         case 'agriculture_ha': lulc_attribute = 'Agriculture Land';break;
                        //         case 'water_bodies_ha': lulc_attribute = 'Water Bodies';break;
                        //         case 'builtup_ha': lulc_attribute = 'Built Up';break;
                        //         case 'barren_land_ha': lulc_attribute = 'Barren Land';break;
                        //       }
                        //       return lulc_attribute
                        //     }
                        //     for(lulc_class_ind = 0; lulc_class_ind<=villageLulc_table_inp['year'].length-1; lulc_class_ind++){
                        //         /*name, year for classification in the lulc class*/
                        //         var lulc_class_name = villageLulc_table_inp['lulc_classes'][lulc_class_ind]
                        //         var lulc_year = villageLulc_table_inp['year'][lulc_class_ind]
                        //         /*5-year table inputs(rows)*/
                        //         villageLulc_table_inp['lulc_table_th'] = villageLulc_table_inp['lulc_table_th']+"<td><b>"+getLulcClass(lulc_class_name)+"</b></td>"
                        //         for(q = 0; q<=villageLulc_table_inp['lulc_classes'].length-1; q++){
                        //           var attribute_name = villageLulc_table_inp['lulc_classes'][q];
                        //           if (villageLulc_table_inp['lulc_pre_'+villageLulc_table_inp['lulc_classes'][q].slice(0,-3)+'_arr'] === undefined) {
                        //             villageLulc_table_inp['lulc_pre_'+villageLulc_table_inp['lulc_classes'][q].slice(0,-3)+'_arr'] =[]
                        //           }
                        //           if (villageLulc_table_inp['lulc_post_'+villageLulc_table_inp['lulc_classes'][q].slice(0,-3)+'_arr'] === undefined) {
                        //             villageLulc_table_inp['lulc_post_'+villageLulc_table_inp['lulc_classes'][q].slice(0,-3)+'_arr'] =[]
                        //           }
                        //           /*pre-monsoon percentage values to be displayed in table*/
                        //           villageLulc_table_inp['pre_'+attribute_name+'_'+lulc_year+'_per'] = (villageLulc_table_inp['pre_'+attribute_name][lulc_class_ind]/(villageLulc_table_inp['pre_builtup_ha'][lulc_class_ind]+villageLulc_table_inp['pre_water_bodies_ha'][lulc_class_ind]+villageLulc_table_inp['pre_grasslands_ha'][lulc_class_ind]+villageLulc_table_inp['pre_agriculture_ha'][lulc_class_ind]+villageLulc_table_inp['pre_barren_land_ha'][lulc_class_ind]))*100
                        //           /*post-monsoon percentage values to be displayed in table*/
                        //           villageLulc_table_inp['post_'+attribute_name+'_'+lulc_year+'_per'] = (villageLulc_table_inp['post_'+attribute_name][lulc_class_ind]/(villageLulc_table_inp['post_builtup_ha'][lulc_class_ind]+villageLulc_table_inp['post_water_bodies_ha'][lulc_class_ind]+villageLulc_table_inp['post_grasslands_ha'][lulc_class_ind]+villageLulc_table_inp['post_agriculture_ha'][lulc_class_ind]+villageLulc_table_inp['post_barren_land_ha'][lulc_class_ind]))*100
                        //           /*5-year table inputs(rows)*/
                        //           villageLulc_table_inp['lulc_preTable_td_'+lulc_year] = villageLulc_table_inp['lulc_preTable_td_'+lulc_year] + "<td>"+villageLulc_table_inp['pre_'+attribute_name+'_'+lulc_year+'_per'].toFixed(2)+"</td>"
                        //           if (villageLulc_table_inp['lulc_classes'][q] === 'agriculture_ha') {
                        //             villageLulc_table_inp['lulc_pre_'+villageLulc_table_inp['lulc_classes'][q].slice(0,-3)+'_arr'].push({y:Number(villageLulc_table_inp['pre_'+attribute_name+'_'+lulc_year+'_per'].toFixed(2)), fill:"#5adf5a"})
                        //           }
                        //           else{
                        //             villageLulc_table_inp['lulc_pre_'+villageLulc_table_inp['lulc_classes'][q].slice(0,-3)+'_arr'].push(Number(villageLulc_table_inp['pre_'+attribute_name+'_'+lulc_year+'_per'].toFixed(2)))
                        //           }                                  
                        //           villageLulc_table_inp['lulc_postTable_td_'+lulc_year] = villageLulc_table_inp['lulc_postTable_td_'+lulc_year] + "<td>"+villageLulc_table_inp['post_'+attribute_name+'_'+lulc_year+'_per'].toFixed(2)+"</td>"
                        //           if (villageLulc_table_inp['lulc_classes'][q] === 'agriculture_ha') {
                        //             villageLulc_table_inp['lulc_post_'+villageLulc_table_inp['lulc_classes'][q].slice(0,-3)+'_arr'].push({y:Number(villageLulc_table_inp['post_'+attribute_name+'_'+lulc_year+'_per'].toFixed(2)), fill:"#5adf5a"})
                        //           }
                        //           else{
                        //             villageLulc_table_inp['lulc_post_'+villageLulc_table_inp['lulc_classes'][q].slice(0,-3)+'_arr'].push(Number(villageLulc_table_inp['post_'+attribute_name+'_'+lulc_year+'_per'].toFixed(2)))
                        //           }
                        //         }
                        //     }
                        //     dojo.query('#villageLULC').style('display', 'block')
                        //     domAttr.set('Village_akahLulc_preChart', 'innerHTML', '')
                        //     domAttr.set('Village_akahLulc_postChart', 'innerHTML', '')
                        //     /*lulc pre-monsoon chart definition*/
                        //     window.lulc_preMonsoon_chart = new dojox.charting.Chart2D("Village_akahLulc_preChart");
                        //     lulc_preMonsoon_chart.addPlot("stackedColumnsPlot", {type: "ClusteredColumns",markers: true,gap:5,maxBarSize: 60, tension: "2",animate: { duration: 2000, easing: dojo.fx.easing.bounceInOut }});
                        //     lulc_preMonsoon_chart.addAxis("x", {title:"Year",dropLabels: false,titleOrientation: "away", labelSizeChange: true, majorTicks:true, majorTickStep:1, minorTicks:false, font: "normal normal bold 12px Arial", fontColor: "black",
                        //       labels: villageLulc_table_inp['year_inputForChart']});
                        //     lulc_preMonsoon_chart.addAxis("y", {title:"Area(%)",fixLower: "major",fixUpper: "major", vertical: true});
                        //     /*pre-monsoon chart for only vegetation as seperate module*/
                        //     window.lulc_preMonsoonVegt_chart = new dojox.charting.Chart2D("Village_akahLulc_preVegChart");
                        //     lulc_preMonsoonVegt_chart.addPlot("Pre-Vegetation", {type: "Columns",markers: true,gap:5,maxBarSize: 60, tension: "2",animate: { duration: 2000, easing: dojo.fx.easing.bounceInOut }});
                        //     lulc_preMonsoonVegt_chart.addAxis("x", {title:"Year",dropLabels: false,titleOrientation: "away", labelSizeChange: true, majorTicks:true, majorTickStep:1, minorTicks:false, font: "normal normal bold 12px Arial", fontColor: "black",
                        //       labels: villageLulc_table_inp['year_inputForChart']});
                        //     lulc_preMonsoonVegt_chart.addAxis("y", {title:"Area(%)",fixLower: "major",fixUpper: "major", vertical: true});
                        //     lulc_preMonsoonVegt_chart.addSeries('agriculture', villageLulc_table_inp['lulc_pre_agriculture_arr'], {plot: "Pre-Vegetation",stroke: {color: "#FFFFFF",},fill: "#5adf5a"});
                        //     lulc_preMonsoonVegt_chart.title = "Long-term change in agriculture area during pre-monsoon ("+villageLulc_table_inp['year'][0]+"-"+villageLulc_table_inp['year'][villageLulc_table_inp['year'].length-1]+")"
                        //     lulc_preMonsoonVegt_chart.titleFont = "bold 12pt Arial"
                        //     lulc_preMonsoonVegt_chart.titlePos = "top"
                        //     lulc_preMonsoonVegt_chart.render();
                        //     /*lulc post-monsoon chart definition*/
                        //     window.lulc_postMonsoon_chart = new dojox.charting.Chart2D("Village_akahLulc_postChart");
                        //     lulc_postMonsoon_chart.addPlot("stackedColumnsPlot", {type: "ClusteredColumns",markers: true,gap:5,maxBarSize: 60, tension: "2",animate: { duration: 2000, easing: dojo.fx.easing.bounceInOut }});
                        //     lulc_postMonsoon_chart.addAxis("x", {title:"Year", dropLabels: false,titleOrientation: "away", labelSizeChange: true, majorTicks:true, majorTickStep:1, minorTicks:false, font: "normal normal bold 12px Arial", fontColor: "black",
                        //       labels: villageLulc_table_inp['year_inputForChart']});
                        //     lulc_postMonsoon_chart.addAxis("y", {title:"Area(%)",fixLower: "major",fixUpper: "major", vertical: true});
                        //     /*lulc post-monsoon chart definition*/
                        //     window.lulc_postMonsoonVegt_chart = new dojox.charting.Chart2D("Village_akahLulc_postVegChart");
                        //     lulc_postMonsoonVegt_chart.addPlot("Post-Vegetation", {type: "Columns",markers: true,gap:5,maxBarSize: 60, tension: "2",animate: { duration: 2000, easing: dojo.fx.easing.bounceInOut }});
                        //     lulc_postMonsoonVegt_chart.addAxis("x", {title:"Year", dropLabels: false,titleOrientation: "away", labelSizeChange: true, majorTicks:true, majorTickStep:1, minorTicks:false, font: "normal normal bold 12px Arial", fontColor: "black",
                        //       labels: villageLulc_table_inp['year_inputForChart']});
                        //     lulc_postMonsoonVegt_chart.addAxis("y", {title:"Area(%)",fixLower: "major",fixUpper: "major", vertical: true});
                        //     lulc_postMonsoonVegt_chart.addSeries('agriculture', villageLulc_table_inp['lulc_post_agriculture_arr'], {plot: "Post-Vegetation",stroke: {color: "#FFFFFF",},fill: "#5adf5a"});
                        //     lulc_postMonsoonVegt_chart.title = "Long-term change in agriculture area during post-monsoon ("+villageLulc_table_inp['year'][0]+"-"+villageLulc_table_inp['year'][villageLulc_table_inp['year'].length-1]+")"
                        //     lulc_postMonsoonVegt_chart.titleFont = "bold 12pt Arial"
                        //     lulc_postMonsoonVegt_chart.titlePos = "top"
                        //     lulc_postMonsoonVegt_chart.render();
                        //     /*village level lulc table for 5 years*/
                        //     window.village_level_preTable = "<table class='lulcReportTable' style='width: 97%;margin: 50px 0px 10px 0px;'>"+"<tr><td colspan='"+(villageLulc_table_inp['year'].length+1)+"'>Land Use Land Cover area: Pre-monsoon ("+villageLulc_table_inp['year'][0]+"-"+villageLulc_table_inp['year'][villageLulc_table_inp['year'].length-1]+")</td></tr><tr>"+villageLulc_table_inp['lulc_table_th']+"</tr>";
                        //     window.village_level_postTable = "<tr><td colspan='"+(villageLulc_table_inp['year'].length+1)+"'>Land Use Land Cover area: Post-monsoon ("+villageLulc_table_inp['year'][0]+"-"+villageLulc_table_inp['year'][villageLulc_table_inp['year'].length-1]+")</td></tr><tr>"+villageLulc_table_inp['lulc_table_th']+"</tr>";
                        //     for(i=0;i<=villageLulc_table_inp['year'].length-1;i++){
                        //       village_level_preTable = village_level_preTable+"<tr>"+villageLulc_table_inp['lulc_preTable_td_'+villageLulc_table_inp['year'][i]]+"</tr>"
                        //       village_level_postTable = village_level_postTable+"<tr>"+villageLulc_table_inp['lulc_postTable_td_'+villageLulc_table_inp['year'][i]]+"</tr>"
                        //     }
                        //     /*lulc post-monsoon inputs*/
                        //     lulc_preMonsoon_chart.addSeries('grasslands', villageLulc_table_inp['lulc_pre_grasslands_arr'], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF",},fill: "#047d04"});
                        //     // lulc_preMonsoon_chart.addSeries('agriculture', villageLulc_table_inp['lulc_pre_agriculture_arr'], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF",},fill: "#5adf5a"});
                        //     lulc_preMonsoon_chart.addSeries('water_bodies', villageLulc_table_inp['lulc_pre_water_bodies_arr'], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF",},fill: "#2f92a3"});
                        //     lulc_preMonsoon_chart.addSeries('builtup', villageLulc_table_inp['lulc_pre_builtup_arr'], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF",},fill: "#bd3c11"});
                        //     lulc_preMonsoon_chart.addSeries('barren_land', villageLulc_table_inp['lulc_pre_barren_land_arr'], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF",},fill: "#edd8c0"});
                        //     /*lulc pre-monsoon title*/
                            
                        //     lulc_preMonsoon_chart.title = "Long-term change in land use pattern during pre-monsoon ("+villageLulc_table_inp['year'][0]+"-"+villageLulc_table_inp['year'][villageLulc_table_inp['year'].length-1]+")"
                        //     lulc_preMonsoon_chart.titleFont = "bold 12pt Arial"
                        //     lulc_preMonsoon_chart.titlePos = "top"
                        //     lulc_preMonsoon_chart.render();
                        //     // lulc_preMonsoon_chart.resize(700,300);
                        //     /*lulc post-monsoon inputs*/
                        //     lulc_postMonsoon_chart.addSeries('grasslands', villageLulc_table_inp['lulc_post_grasslands_arr'], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF",},fill: "#047d04"});
                        //     // lulc_postMonsoon_chart.addSeries('agriculture', villageLulc_table_inp['lulc_post_agriculture_arr'], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF",},fill: "#5adf5a"});
                        //     lulc_postMonsoon_chart.addSeries('water_bodies', villageLulc_table_inp['lulc_post_water_bodies_arr'], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF",},fill: "#2f92a3"});
                        //     lulc_postMonsoon_chart.addSeries('builtup', villageLulc_table_inp['lulc_post_builtup_arr'], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF",},fill: "#bd3c11"});
                        //     lulc_postMonsoon_chart.addSeries('barren_land', villageLulc_table_inp['lulc_post_barren_land_arr'], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF",},fill: "#edd8c0"});
                        //     /*lulc post-monsoon title*/
                        //     lulc_postMonsoon_chart.title = "Long-term change in land use pattern during post-monsoon ("+villageLulc_table_inp['year'][0]+"-"+villageLulc_table_inp['year'][villageLulc_table_inp['year'].length-1]+")"
                        //     lulc_postMonsoon_chart.titleFont = "bold 12pt Arial"
                        //     lulc_postMonsoon_chart.titlePos = "top"
                        //     lulc_postMonsoon_chart.render();
                        //     domAttr.set('village_vegtpre_legend', 'innerHTML', '<div>'+'<span style="padding: 0px 8px 0px 8px;color:#5adf5a;background-color:#5adf5a;font-size: 13px;border-radius:3px;"></span><span>&nbsp;Agriculture Land</span>'+'<div>')
                        //     domAttr.set("village_precluster_legend","innerHTML",'<div style="line-height: 2em;">'+
                        //     '<span style="padding: 0px 8px 0px 8px;color:#047d04;background-color:#047d04;font-size: 13px;border-radius:3px;"></span><span>&nbsp;Forest Land</span>'+
                        //     '<span style="padding: 0px 8px 0px 8px;color:#edd8c0;background-color:#edd8c0;font-size: 13px;border-radius:3px;margin-left: 10px;">.</span><span>&nbsp;Barren Land</span>'+
                        //     '<span style="padding: 0px 8px 0px 8px;color:#2f92a3;border-radius:3px;background-color:#2f92a3;font-size: 13px;margin-left: 10px;">.</span><span>&nbsp;Water Bodies</span>'+
                        //     '<span style="padding: 0px 8px 0px 8px;color:#bd3c11;background-color:#bd3c11;font-size: 13px;border-radius:3px;margin-left: 10px;">.</span><span>&nbsp;Built Up</span></div>')
                        //     domAttr.set('village_vegtpost_legend', 'innerHTML', '<div>'+'<span style="padding: 0px 8px 0px 8px;color:#5adf5a;background-color:#5adf5a;font-size: 13px;border-radius:3px;"></span><span>&nbsp;Agriculture Land</span>'+'<div>')
                        //     domAttr.set("village_postcluster_legend","innerHTML",'<div style="line-height: 2em;">'+
                        //     '<span style="padding: 0px 8px 0px 8px;color:#047d04;background-color:#047d04;font-size: 13px;border-radius:3px;"></span><span>&nbsp;Forest Land</span>'+
                        //     '<span style="padding: 0px 8px 0px 8px;color:#edd8c0;background-color:#edd8c0;font-size: 13px;border-radius:3px;margin-left: 10px;">.</span><span>&nbsp;Barren Land</span>'+
                        //     '<span style="padding: 0px 8px 0px 8px;color:#2f92a3;border-radius:3px;background-color:#2f92a3;font-size: 13px;margin-left: 10px;">.</span><span>&nbsp;Water Bodies</span>'+
                        //     '<span style="padding: 0px 8px 0px 8px;color:#bd3c11;background-color:#bd3c11;font-size: 13px;border-radius:3px;margin-left: 10px;">.</span><span>&nbsp;Built Up</span></div>')
                        //     dojo.query('#villageLULC').style('display', 'none');
                        //     // lulc_postMonsoon_chart.resize(700,300);
                        //     window.village_level_lulcTable = village_level_preTable+village_level_postTable+"</table>";

                        //     window.lulc_var = lulc_var;
                        //     // //Code for LULC Chart in Report  **(modified from here)
                        //     // domAttr.set('Village_akahLulc_Chart','innerHTML','');

                        //     // domAttr.set("Village_lulc_legend","innerHTML",'<div style="line-height: 2em;padding-top: 25%;">'+
                        //     // '<span style="padding: 0px 8px 0px 6px;color:#047d04;background-color:#047d04;font-size: 13px;border-radius:3px;"></span><span>&nbsp;Forest Land</span><span style="padding-left: 40px;">- &nbsp;&nbsp;'+village_lulc_gl.toFixed(2)+' ha ('+villageLulc_table_inp['grasslands_ha_2020_per']+'%)</span><br>'+
                        //     // '<span style="padding: 0px 8px 0px 6px;color:#5adf5a;background-color:#5adf5a;font-size: 13px;border-radius:3px;"></span><span>&nbsp;Agriculture Land</span><span style="padding-left: 14px;">- &nbsp;&nbsp;'+village_lulc_al.toFixed(2)+' ha ('+villageLulc_table_inp['agriculture_ha_2020_per']+'%)</span><br>'+
                        //     // '<span style="padding: 0px 8px 0px 6px;color:#edd8c0;background-color:#edd8c0;font-size: 13px;border-radius:3px;">.</span><span>&nbsp;Barren Land</span><span style="padding-left: 34px;">- &nbsp;&nbsp;'+village_lulc_bl.toFixed(2)+' ha ('+villageLulc_table_inp['barren_land_ha_2020_per']+'%)</span><br>'+
                        //     // '<span style="padding: 0px 8px 0px 6px;color:#2f92a3;border-radius:3px;background-color:#2f92a3;font-size: 13px;">.</span><span>&nbsp;Water Bodies</span><span style="padding-left: 29px;">- &nbsp;&nbsp;'+village_lulc_wb.toFixed(2)+' ha ('+villageLulc_table_inp['water_bodies_ha_2020_per']+'%)</span><br>'+
                        //     // '<span style="padding: 0px 8px 0px 6px;color:#bd3c11;background-color:#bd3c11;font-size: 13px;border-radius:3px;">.</span><span>&nbsp;Built Up</span><span style="padding-left: 62px;">- &nbsp;&nbsp;'+village_lulc_bu.toFixed(2)+' ha ('+villageLulc_table_inp['builtup_ha_2020_per']+'%)</span></div>')
                        // });
                        // //Query for Default LULC Village Chart ends here -- Level3


                        //Query and Chart plotting for Rainfall in Report starts here -- Level3
                        dojo.query('#rainfall_chart').innerHTML('');
                        /*Rainfall code beginning for generating Rainfall Charts*/
                        
                        a1 =[];
                        actual_rain1 = [];
                        norm_rain1 = [];
                        rain_dev1 = [];
                        rain_months1 = [];
                        rain_tooltip_arr_11 = [];
                        var queryrain = new Query()
                        queryrain.where = "state like" +" "+"\'"+ statenamedv +"\'"  + " " + "AND" + " " + "district like" +" "+"\'"+ akahdistrict +"\'"
                        queryrain.outFields = ["*"]
                        queryrain.returnGeometry = true
                        window.report_rainfall_query=new QueryTask(akah_dist_layer.url).execute(queryrain, function(rain_districtResponse_report){
                          window.rain_districtResponse_report = rain_districtResponse_report;
                          var rain_from=2011
                          var rain_to=2020
                          window.year_arr = [];
                          for(ry=2011;ry<=2020;ry++){
                            window.year_arr.push(ry)
                          }
                          queryrain.where = "year >= "+rain_from+" AND year <= "+rain_to+" AND district_id = "+rain_districtResponse_report.features[0].attributes['district_pk']
                          queryrain.outFields = ["*"]
                          window.rainfall_for_village_tab=new QueryTask(district_rainfall_url).execute(queryrain, function(ann_rainfallResponse1){
                            window.ann_rainfallResponse1 = ann_rainfallResponse1;
                            var i=1;
                            ann_rainfallResponse1.features.forEach(function(evt1,index1){
                                ann_rainfallResponse1.fields.forEach(function(evt, index){
                                    var fieldname = evt.name;
                                    a1.push(Number(ann_rainfallResponse1.features[index1].attributes[fieldname]));//window.a = a;
                                    if (fieldname.includes('_actual')) {
                                      // rain_tooltip_arr_11.push({text: fieldname.slice(0,8).toUpperCase().replace('_', ' '), value: (ann_rainfallResponse1.attributes[fieldname])*(-1)});//window.rain_tooltip_arr_1 = rain_tooltip_arr_1;
                                      actual_rain1.push(Number(ann_rainfallResponse1.features[index1].attributes[fieldname]));//window.actual_rain = actual_rain;
                                    }
                                    else if (fieldname.includes('_normal')) {
                                      norm_rain1.push(Number(ann_rainfallResponse1.features[index1].attributes[fieldname]));//window.norm_rain = norm_rain;
                                    }
                                    else if (fieldname.includes('_deviation')) {
                                      rain_dev1.push(Number(ann_rainfallResponse1.features[index1].attributes[fieldname])); //window.rain_dev = rain_dev;
                                    }
                                });
                                rain_months1.push({text:rain_from , value: i});
                                rain_from++;
                                i++;
                            });
                            var deviation_per = [];deviation_rainfall_wd=[];window.deviation_rainfall_wd=deviation_rainfall_wd;var deviation_year = [];
                            for(i=0;i<=norm_rain1.length-1;i++){
                              var deviation = ((actual_rain1[i] - norm_rain1[i]) / norm_rain1[i])*100;
                              if (Math.sign(deviation) === -1) {
                                deviation_year.push("<td><div style='display:inline-flex'><b>"+year_arr[i]+"<b>&nbsp;<span><img src='"+fall_arrow+"' style='width: 10px;height: 14px;' alt='rise_image'/></span></div></td>")
                              }
                              else if (Math.sign(deviation) === 1) {
                                deviation_year.push("<td><div style='display:inline-flex'><b>"+year_arr[i]+"<b>&nbsp;<span><img src='"+rise_arrow+"' style='width: 10px;height: 14px;' alt='rise_image'/></span></div></td>")
                              }
                              else if (Math.sign(deviation) === 0) {
                                deviation_year.push("<td><div><b>"+year_arr[i]+"<b></div></td>")
                              }
                              deviation_per.push("<td>"+(deviation).toFixed(2)+"</td>")
                              deviation_rainfall_wd.push((deviation).toFixed(2));
                            }
                            window.deviation_table = "<table class='akahReportTable' style='width: 85%;margin: 10px 0px 10px 60px;'>";
                            window.deviation_values = '';window.deviation_years = '';
                            for(i=0;i<=deviation_per.length-1;i++){
                              window.deviation_values = deviation_values + deviation_per[i]
                              window.deviation_years = deviation_years + deviation_year[i]
                            }
                            window.deviation_table = deviation_table +"<tr>"+'<td><b>Year</b></td>'+deviation_years+"</tr>"+"<tr>"+'<td style="width:15%;"><b>Percentage of deviation</b></td>'+deviation_values+"</tr>"+ "</table>";
                            dojo.query('#line_rainfall_chart').style('display', 'block')
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
                                  tension: "S"
                              });
                              rain_chart1.addPlot("normal", {
                                  type: LinesPlot,
                                  // hAxis: "x",
                                  // vAxis: "y",
                                  markerSize: 1,
                                  markers: true,
                                  tension: "S"
                              });
                              // gwl = gwl.reverse();
                              var max_value = (parseInt(Math.max.apply(null, actual_rain1)/100)+1)*100
                              max_value = (parseInt(max_value/250)+1)*250
                              rain_chart1.addAxis("x", {fixLower: "major", fixUpper: "major", natural: true, vertical: false, title: "Year", titleFontColor: "black", labels: rain_months1, titleOrientation: "away", majorLabels: true, majorTicks:true, font:"normal normal bold 7pt Arial",
                              fontColor:"black"});
                              rain_chart1.addAxis("y", { min: 0, max: max_value,/*Math.max.apply(null, actual_rain1)*/vertical: true, fixLower: "minor", fixUpper: "minor", title: "Rainfall (mm)", titleFontColor: "black",font:"normal normal bold 7pt Arial",
                              majorTickStep:250, fontColor:"black"});
                              // gwl.setTransform(chart.rotategAt(rotate, x,y));Math.max.apply(null, a)
                              rain_chart1.addSeries("Actual Rainfall", actual_rain1, {plot: "default", stroke: {color:"#9ea26b"}}); //min: 0, max: Math.max.apply(null, a),
                              rain_chart1.addSeries("Normal Rainfall", norm_rain1, {plot: "normal", stroke: {color:"#2a6ead"}});
                              // rain_chart1.addSeries("Deviation", rain_dev1);
                              rain_chart1.render();
                              rain_chart1.resize(600,300);
                            }

                            rep_rainfall_chart=rep_rainfall_chart+'<div style="display:inline-flex;padding-left:60px"><div>'+dojo.query('#line_rainfall_chart').innerHTML()+'</div>'+
                            "</div><br>"+

                            "<div style='padding-top:7px;text-align:center;'>"+
                            '<div style="display:inline-flex;"><div style="width:17px;height:16px;border:1.6px solid white;background-color: #2a6ead;border-radius: 4px;"></div><span style="padding-left:5px;">Normal Rainfall</span></div>'+
                            '<div style="display:inline-flex;padding-left:10px;"><div style="width:17px;height:16px;border:1.6px solid white;background-color: #9ea26b;border-radius: 4px;"></div><span style="padding-left:5px;">Annual Rainfall</span></div>'+
                            "</div>";

                            dojo.query('#line_rainfall_chart').style('display', 'none');

                            //taking inputs for water dynamics and advisories
                            // debugger;
                            // i = deviation_rainfall_wd[deviation_rainfall_wd.length-2]
                            // gwl_oval = -(cgwl_PostArray[cgwl_PostArray.length-1])
                            // gwl_dev = -(cgwl_PostArray[cgwl_PostArray.length-1]) - (-cgwl_PostArray[cgwl_PostArray.length-2])
                            // swa_oval = Number(surfWater_PostArray[surfWater_PostArray.length-1])
                            // swa_dev = surfWater_PostArray[surfWater_PostArray.length-1] - surfWater_PostArray[surfWater_PostArray.length-2]
                
                            // ndvi_oval = Number(ndvi_PostArray[ndvi_PostArray.length-1])
                            // ndvi_dev = ndvi_PostArray_abs[ndvi_PostArray_abs.length-1] - ndvi_PostArray_abs[ndvi_PostArray_abs.length-2]
                
                            // window.rf_final = akah_Tool.gotoGetScore(Number(i),"","rainfall")
                            // window.gwl_final = akah_Tool.gotoGetScore(Number(gwl_dev),Number(gwl_oval),"gwl")
                            // window.swa_final = akah_Tool.gotoGetScore(Number(swa_dev),Number(swa_oval),"swa")
                            // window.ndvi_final = akah_Tool.gotoGetScore(Number(ndvi_dev),Number(ndvi_oval),"ndvi")
                            // window.weightedavgScoreAndClass= akah_Tool.getWeightedAverageClass((Number(rf_final.split(' ')[1])*0.25) + (Number(gwl_final.split(' ')[1])*0.25) + (Number(swa_final.split(' ')[1])*0.25) + (Number(ndvi_final.split(' ')[1])*0.25));
                            // var Inp = {rainfall :rf_final.split(' ')[0].toLowerCase(), gwl: gwl_final.split(' ')[0].toLowerCase(), swa: swa_final.split(' ')[0].toLowerCase(), ndvi:ndvi_final.split(' ')[0].toLowerCase()}
                            // // var advisoryURL = "https://geomonitor.co.in/rainfallakah/advisory/";
                            // var advisoryURL = "http://localhost:3002/rainfall/advisory/";
                            // fetch(advisoryURL, {method: "POST",body:JSON.stringify(Inp)}).then(function(res){
                            //     return res.json()
                            // }).then(function(res){
                            //   window.advisoryResp = res;
                            // });
                            // finalClassCondition = akah_Tool.gotoGetCondition(rf_final.split(' ')[0],gwl_final.split(' ')[0],swa_final.split(' ')[0],ndvi_final.split(' ')[0])
                            // window.finalClassCondition=finalClassCondition
                            //ending of advisories
                          });
                        });
                        //Query and Chart plotting for Rainfall in Report ends here -- Level3

                        
                        function results1(r){
                          console.log(r);
                          akah_Tool.block_level_queries_report();
                        }
                        
                        window.check_promisee=executeAll(
                           [lulc_block_results,block_cgwb_wl_query,blockMapExtent,rep_block_result,
                             /*surWat,*/total_village_query,village_lulc_result, report_rainfall_query,
                             cgwb_results_village,selected_result,village_result]
                           );
                           // [villageMap,villageMap_1,dist_keymap,block_keymap,printresvill,watershedMap,hydrogeologyMap,watershedMap_1]
                         check_promisee.then(results1);
                        });
                        // for selecting all the villages that are in study and aggregation - Level2 ends here

                      });
                      // For creating the intersection geometry of the wells within the block ends here
                    });

              });

              //  //da chart 1 code
              // dataAnalysis_obj1= "";window.dataAnalysis_obj1=dataAnalysis_obj1;
              // var da_chart1 = new Chart("da_chart1");
              // da_chart1.addPlot("plot_markers", {type: LinesPlot,markers: false, hAxis: "x",vAxis: "y",tension: "S"}); 
              // da_chart1.addPlot("other", {type: LinesPlot,markers: false, hAxis: "x",vAxis: "y",tension: "S"}); 
              // da_chart1.addPlot("default", {type: "Columns", gap: 2, width: 15, hAxis: "x",vAxis: "other y",tension: "S", plotarea: { fill: "lightgrey" }});
              // da_chart1.addAxis("x", { includeZero: false, hAxis: "x",vAxis: "other y", natural: false,rotation:90, vertical: false, title: "Years", titleFontColor: "#00833f",titleOrientation: "away",titleFont: "bold 10pt Avenir Light",
              //       labels: [rfLabelsArrayY[8],rfLabelsArrayY[9],rfLabelsArrayY[10],rfLabelsArrayY[11]]});
              // da_chart1.addAxis("y", { vertical: true, enableCache: true,fixLower: "minor", fixUpper: "minor", title: "Rainfall (mm)", titleFontColor: "#00833f",titleFont: "bold 10pt Avenir Light",minorTicks:true});
              // da_chart1.addAxis("other y", {title: "Rainfall (mm)",vertical: true,leftBottom: false,fixUpper: "major",fixLower:"minor",font:"normal normal bold 7pt Arial",fontColor:"black"});
              // da_chart1.addSeries("Yearly Rainfall Data", [rfYArray[8],rfYArray[9],rfYArray[10],rfYArray[11]],{plot: "default",color:"#2E86C1",stroke: { color: "#2E86C1",width: 1}}); //min: 
              // da_chart1.addSeries("Premonsoon (2008-2020)",surfWater_PreArray,{ plot: "plot_markers" , color:"#2E86C1",stroke: { color: "#6B3809",width: 2} }); //min: 
              // da_chart1.addSeries("Postmosoon (2008-2020)",surfWater_PostArray,{ plot: "other" , color:"#2E86C1",stroke: { color: "#6B3809",width: 2} }); //min: 
              // // surfWater_PreArray
              // window.da_chart1=da_chart1;
              // da_chart1.render();
              // dataAnalysis_obj1 += dom.byId("dataAnalysis1").innerHTML;
              // //da chart 2 code
              // dataAnalysis_obj2= "";window.dataAnalysis_obj2=dataAnalysis_obj2;
              // dataAnalysis_obj2 += dom.byId("dataAnalysis2").innerHTML;
              // dataAnalysis_obj3= "";window.dataAnalysis_obj3=dataAnalysis_obj3;
              // dataAnalysis_obj3 += dom.byId("dataAnalysis3").innerHTML;
          }
    },

    block_level_queries_report: function(){

          // Block query to obtain Block Geometry and Sub queries are Aquifer and Watershed,CGWB WQ starts here -- Level1
          var queryrf=new Query();
          queryrf.where="state like" +" "+"\'"+ akahstate +"\'"  + " " + "AND" + " " + "district like" +" "+"\'"+ akahdistrict +"\'"+ " " + "AND" + " " + "block like" + " " + "\'" + akahblock + "\'";
          queryrf.returnDistinctValues=false;
          queryrf.returnGeometry=true;
          queryrf.outFields=["*"];
          window.rf_chart_query=new QueryTask(akah_block_url).execute(queryrf,function(rf_response1){
            window.rf_response1 = rf_response1;
            rv['block_area_abs'] = rf_response1.features[0].attributes['block_area_ha']

            //Query for CGWB Water Quality Block level starts here -- Level2
            var query_summ12=new Query();
            query_summ12.where="1=1";
            query_summ12.returnGeometry = false;
            query_summ12.geometry=rf_response1.features[0].geometry;
            window.block_cgwb_wq_query=new QueryTask(akah_gwq.url).execute(query_summ12, function retrieve(summ){
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
            //Query for CGWB Water Quality Block level ends here -- Level2


            // Query for Block level Aquifer in Report starts here -- Level2
            var query_summ1 = new Query()
            query_summ1.outFields=["AQUIFER",'aquifer0'];
            query_summ1.geometry=rf_response1.features[0].geometry;
            window.rep_aqui=new QueryTask(akah_aqui.url).execute(query_summ1, function retrieve(summ){
              if(summ.features.length>0){
                // rep_val5=summ.features[0].attributes["aquifer"];
                // rep_val5_1=summ.features[0].attributes["aquifer0"];
                var aquifer=[];
                var aquifer0=[];
                summ.features.forEach(function(summ_response){
                  aquifer.push(summ_response.attributes["aquifer"]);
                  aquifer0.push(summ_response.attributes["aquifer0"]);
                });
                var aquifer_temp = new Set(aquifer);
                var aquifer0_temp = new Set(aquifer0);
                rep_val5 = '';rep_val5_1 = '';
                aquifer_temp.forEach(function(aqui_var){
                  rep_val5 = rep_val5+aqui_var+', ';
                });
                aquifer0_temp.forEach(function(aqui0_var){
                  rep_val5_1 = rep_val5_1+aqui0_var+', ';
                });
                rep_val5 = rep_val5.slice(0, rep_val5.length-2)
                rep_val5_1 = rep_val5_1.slice(0, rep_val5_1.length-2)
                // rep_val6 = rep_val6.slice(0, rep_val6.length-2)
              }
              else{
                rep_val5='';
                rep_val5_1='';
              }
            });
            // Query for Block level Aquifer in Report ends here -- Level2

            // Query for Block level watershed in Report starts here -- Level2
            var query_summ1 = new Query()
            query_summ1.outFields=["*"];
            query_summ1.geometry=rf_response1.features[0].geometry;
            window.rep_ws= new QueryTask(akah_watershed.url).execute(query_summ1, function retrieve(summ){
                if(summ.features.length>0){
                  var basin=[];
                  var sub_basin=[];
                  var watershed=[];
                  rv['block_ws_area'] = 0.0;
                  summ.features.forEach(function(summ_response){
                    basin.push(summ_response.attributes["Basin"]);
                    sub_basin.push(summ_response.attributes["Sub_Basin"]);
                    watershed.push(summ_response.attributes["Watershed"]);
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
            // Query for Block level watershed in Report ends here -- Level2


            //code for Surface Water Bodies at Block Level starts here -- Level2
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
                // if(akahblock === 'Malia'){area_sw = 914.24;}
                if(akahblock === 'Malia'){area_sw =  1168.75;}
                if(area_sw==0){
                  // domAttr.set(sum_var[7],"innerHTML",'<b>'+"N.A."+'</b>');
                  // rep_vil8="N.A."
                  rv["surface_water_bodies_volume"] = 'Not Applicable'
                  rv["storage_water_available_block"] = 'Not Applicable'
                  rv["surface_water_bodies_count_block"] = 'No Surface water bodies available'
                }
                else{
                  // domAttr.set(sum_var[7],"innerHTML",'<b>'+area_sw+" ha m"+'</b>');
                  // rep_vil8=area_sw+" ha m"
                  rv["surface_water_bodies_count_block"]=area_sw;
                  rv["surface_water_bodies_volume"]=(area_sw*1.5).toFixed(2)
                  rv["storage_water_available_block"]=((rv["surface_water_bodies_volume"]*3)-(0.001*area_sw*(rf_response.attributes["pet_jan_2020"]+rf_response.attributes["pet_feb_2020"]+rf_response.attributes["pet_mar_2020"]+
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
            //code for Surface Water Bodies at Block level ends here -- Level2


            //bar chart plotting starts here
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
            var gwr_res = Number(rf_response.attributes['net_total_recharge']);
            var gwr_total = Number(rf_response.attributes['net_gw_availability_future']);
            var gwr_draftIrr = Number(rf_response.attributes['irrigation_draft']);
            var gwr_resDom =Number(rf_response.attributes['industrial_domestic_draft']);

            bar_Chart_rep.addPlot("stackedColumnsPlot", {
                type: StackedColumns,
                gap:30,
                lines: true,
                areas: true,
                markers: true,
                labels: false,
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
                                  labels: [{"value":1,"text":"Net GW Availability"},{"value":2,"text":"Net Draft"},{"value":3,"text":"GW for future Use"}]
            });
            bar_Chart_rep.addAxis("y", {title:"Volume (ha m)",
              fixLower: "major",
              fixUpper: "major",
              includeZero: true,
              majorTickStep:2500,
              minorTickStep:500,
              max: 15000,
              vertical: true
            });
            bar_Chart_rep.addSeries("gw",[akahRainfallResponse.attributes['net_total_recharge'], null, null] ,
             {

                plot: "stackedColumnsPlot",
                stroke: {
                    color: "#FFFFFF" ,

                },
                fill: "#021C51"
            });
            bar_Chart_rep.addSeries("irrigation", [null, akahRainfallResponse.attributes['irrigation_draft'], null], {
                plot: "stackedColumnsPlot",
                stroke: {
                    color: "#FFFFFF"
                },
                fill: "#00833f"
            });
            bar_Chart_rep.addSeries("domestic", [null, akahRainfallResponse.attributes['industrial_domestic_draft'], null], {
                plot: "stackedColumnsPlot",
                stroke: {
                    color: "#FFFFFF"
                },
                fill: "grey"
            });
            bar_Chart_rep.addSeries("futureUse", [null, null, akahRainfallResponse.attributes['net_total_recharge'] - akahRainfallResponse.attributes['irrigation_draft'] - akahRainfallResponse.attributes['industrial_domestic_draft']], {
                plot: "stackedColumnsPlot",
                stroke: {
                    color: "#FFFFFF"
                },
                fill: "rgb(251, 208, 10)"
            });
            new Tooltip(bar_Chart_rep, "stackedColumnsPlot");
            bar_Chart_rep.render();
            // bar_Chart_rep.resize(750,250);

            rep_bar_chart=rep_bar_chart+'<div style="display:inline-flex;padding-left:60px"><div>'+dojo.query('#barchartModule_new').innerHTML()+'</div>'+
            "</div><br>"+
            '<table style="margin-left: 110px;"><tr>'+
            '<td><div style="display:inline-flex;"><div style="width:17px;height:16px;border:1.6px solid white;background-color: #021C51;border-radius: 4px;"></div><span style="padding-left:5px;">Net GW Availability ('+akahRainfallResponse.attributes['net_total_recharge']+' ha m)</span></div></td>'+
            '<td style="text-align: left;"><div style="display:inline-flex;padding-left:10px;"><div style="width:17px;height:16px;border:1.6px solid white;background-color: #00833f;border-radius: 4px;"></div><span style="padding-left:5px;">Domestic Draft ('+akahRainfallResponse.attributes['industrial_domestic_draft']+' ha m)</span></div></td></tr>'+
            '<tr><td style="text-align: left;"><div style="display:inline-flex;"><div style="width:17px;height:16px;border:1.6px solid white;background-color:grey;border-radius: 4px;"></div><span style="padding-left:5px;">Irrigation Draft ('+akahRainfallResponse.attributes['irrigation_draft']+' ha m)</span></div></td>'+
            '<td style="text-align: left;"><div style="display:inline-flex;padding-left:10px;"><div style="width:17px;height:16px;border:1.6px solid white;background-color: rgb(251, 208, 10);border-radius: 4px;"></div><span style="padding-left:5px;">GW for future use ('+Number(akahRainfallResponse.attributes['net_total_recharge'] - akahRainfallResponse.attributes['industrial_domestic_draft'] - akahRainfallResponse.attributes['irrigation_draft']).toFixed(2)+' ha m)</span></div></td></tr>'+
            '</table>'

            dojo.query('#barchartModule_new').style('display', 'none');
            //stacked bar chart code ends here..... along with integrating legend...

          }
           //sensor chart code starts here
           rep_sensor_chart="";
           window.rep_sensor_chart=rep_sensor_chart;
           var sensordata_layer =  new FeatureLayer("https://geomonitor.co.in/server/rest/services/agakhan_experiment/well_sensors_data/FeatureServer/0");
           var querySensorLoc = new Query();
           window.querySensorLoc=querySensorLoc;
           querySensorLoc.returnGeometry = false
           querySensorLoc.outFields = ["*"]      
           querySensorLoc.geometry = akah_searchResponse.geometry;
           querySensorLoc.spatialRelationship = "esriSpatialRelIntersects"
           // querySensorLoc.distance = 1000;
           // querySensorLoc.units = "esriMeters";
           new QueryTask(sensors_location_url.url).execute(querySensorLoc, function retrieve(response) {      
             sensorLocResponse = response;window.sensorLocResponse=sensorLocResponse;
             if(sensorLocResponse.features.length > 0){
               var querySensordata = new Query()
                 
                   querySensordata.where = "sensor_id = '" + (sensorLocResponse.features[0].attributes.sensor_id).split(" ")[0]+"' and created_datetime <= TIMESTAMP '"+new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+(new Date().getDate()+1)+"'";
                   querySensordata.orderByFields  = ["objectid DESC"]
                 
                
                   querySensordata.outFields = ["water_depth_m","created_datetime"]   
                   querySensordata.returnGeometry = false;  
                   sensorWLArray=[];window.sensorWLArray=sensorWLArray; 
                   sensorLabelsArray=[];window.sensorLabelsArray=sensorLabelsArray;
                   regLineValsSensor=[];window.regLineValsSensor=regLineValsSensor;
                   new QueryTask(sensordata_layer.url).execute(querySensordata, function retrieve(response) {     
                     sensorWLArray.length = 0;sensorLabelsArray.length = 0;
                       sensorDataResponse = response
                       window.sensorDataResponse = sensorDataResponse;
                       i =1;
                       // if(document.getElementById("from_date").value == "" || document.getElementById("to_date").value == ""){
                         sensorDataResponse.features=sensorDataResponse.features.reverse()
                       // }
                       sensorDataResponse.features.forEach(function(item, index){
                         var date_l = new Date((item.attributes.created_datetime) - 19800000)
                         // if( date_l.getDate() >=27 && date_l.getHours() >= 10 && date_l.getMinutes() >= 0)
                           // sensorDataResponseFea_new.push(item);
                           var date_str = date_l.getDate() +"-"+ Number(date_l.getMonth()+1) +"-"+ date_l.getFullYear() +" "+ date_l.getHours() +":"+ date_l.getMinutes()+":"+ date_l.getSeconds()
                           sensorWLArray.push(-Number(item.attributes.water_depth_m.toFixed(3)));
                           sensorLabelsArray.push({text:date_str, value: i});
                           regLineValsSensor.push(i);
                           i++;
                         })
                           
                         filterSensorData = hampelFilter(sensorWLArray,5,3);
                         function hampelFilter(data, half_window, threshold) {
                           if (typeof threshold === 'undefined') {
                             threshold = 3;
                           }
                           var n = data.length;
                           var data_copy = data;
                           var ind = [];
                           var L = 1.4826;
                           for (var i = half_window + 1; i < n - half_window; i++) {
                             var med = getMedian(data.slice(i - half_window, i + half_window));
                             var MAD = L * getMedian(data.slice(i - half_window, i + half_window).map(function(e) { return Math.abs(e - med) }));
                             if (Math.abs(data[i] - med) / MAD > threshold) {
                               data_copy[i] = med;
                               ind = ind.concat(i);
                             }
                           }
                           return {
                             data: data_copy,
                             outliers: ind
                           };
                         }
                         function getMedian(data) {
                           const values = [...data];
                           const v   = values.sort( (a, b) => a - b);
                           const mid = Math.floor( v.length / 2);
                           const median = (v.length % 2 !== 0) ? v[mid] : (v[mid - 1] + v[mid]) / 2; 
                           return median;
                       }
                       filterSensorData.outliers.forEach(function(element, index){
                           sensorWLArray.pop(sensorWLArray[element]);
                           sensorLabelsArray.pop(sensorLabelsArray[index]);
                           // regLineValsSensor.push(index+1);
                           regLineValsSensor.pop(regLineValsSensor[index]);
                       })
                         //code for plotting regression line/ trendline      
                         var array_xy = [];       // creating x * y array
                         var array_xx = [];  
                         for(var i = 0; i<sensorWLArray.length; i++){
                           array_xy.push(sensorWLArray[i] * regLineValsSensor[i]);
                           array_xx.push(regLineValsSensor[i] * regLineValsSensor[i]);
                         }
                         m =  (((dojox.math.stats.mean(regLineValsSensor) * dojox.math.stats.mean(sensorWLArray)) - dojox.math.stats.mean(array_xy)) /
                           ((dojox.math.stats.mean(regLineValsSensor) * dojox.math.stats.mean(regLineValsSensor)) - dojox.math.stats.mean(array_xx)));
                         b=(dojox.math.stats.mean(sensorWLArray)- dojox.math.stats.mean(regLineValsSensor)*m);
                         var reg_line_sensor = [];   window.reg_line_sensor=reg_line_sensor;    
                         for(var x = 0; x<regLineValsSensor.length; x++){
                           reg_line_sensor.push((m*regLineValsSensor[x]) + b);
                         }
                     dojo.query('#sensorChartModule').style('display', 'block');
                     domAttr.set('sensorChart', "innerHTML","");
                     sensorchartDash = new Chart("sensorChart");
                     sensorchartDash.addPlot("default", {type: LinesPlot,markers: false,tension: "S",mouseOver: true});
                     sensorchartDash.addPlot("plot_markers", {type: LinesPlot,markers: false,tension: "S"}); 
                     sensorchartDash.addAxis("x", { includeZero: false, leftBottom: false,fixLower: "major", fixUpper: "major", natural: false, vertical: false, rotation: 90, title: "Date", titleFontColor: "#00833f",
                     labels: sensorLabelsArray, titleOrientation: "axis",enableCache: true, majorLabels: true,majorTicks:false, majorTickStep: 5,minorTicks:false});
                     sensorchartDash.addAxis("y", { min: Math.min.apply(null,sensorWLArray) - 1, max:Math.max.apply(null,sensorWLArray)+1,vertical: true, enableCache: true,leftBottom: true,fixLower: "minor", fixUpper: "minor", title: "Water level (mbgl)", titleFontColor: "#00833f",minorTicks:true});
                     sensorchartDash.addSeries("Sensor Data", sensorWLArray,{plot: "default", stroke: {color:"#0088BF", width:2} }); //min: 
                     sensorchartDash.addSeries("Trend", reg_line_sensor,{ plot: "plot_markers" , stroke: { color: "#6B3809",width: 2.5 } }); //min: 
                     // sensorchartDash.title="Realtime Borewell Data Interpretation" 
                     // sensorchartDash.titleFont= "bold 12pt Avenir Light"
                     // sensorchartDash.titlePos = "top"
                     // sensorchartDash.titleGap = 10
                     window.sensorchartDash=sensorchartDash;
                     sensorchartDash.render();
                    
                     rep_sensor_chart=rep_sensor_chart+'<div style="display:inline-flex;"><div>'+dojo.query('#sensorChartModule').innerHTML()+'</div>'+
                     "</div><br>"+
                     "<div style='display:inline-flex;'><div style='display:inline-flex;'>"+
                     "<div style='width:19px;height:14px;border:1.6px solid black;border-radius:4px;background-color:#0088BF;'></div>"+
                     "<span style='padding-left:5px;'>Sensor Data<b>"+"</b></span></div>"+
                     "<div style='display:inline-flex;padding-left:5px;'><div style='width:19px;height:14px;border:1.6px solid black;border-radius:4px;background-color:#6B3809;'></div>"+
                     "<span style='padding-left:5px;'>TrendLine <b>"+"</b></span></div></div>"+
                     "<div style='font-weight: bold;font-size: 14px;line-height:2em;font-family:Arial;'>Sensor Information:</div>"+
                     "<div style='display:inline-flex;line-height:1.9em;width:100%;margin-bottom:10px;'><div style='flex:2'><span><span class='akahlongtermwellsHeadings'>Well Owner: </span><span class='akahlongtermwellsNames'>"+sensorLocResponse.features[0].attributes.well_owner_name+"</span></span>"+
                     "<br><span><span class='akahlongtermwellsHeadings'>Well Depth(m): </span><span class='akahlongtermwellsNames'>"+sensorLocResponse.features[0].attributes.depth_m+"</span></span>"+
                     "<br><span><span class='akahlongtermwellsHeadings'>Site name: </span><span class='akahlongtermwellsNames'>"+sensorLocResponse.features[0].attributes.site_name+"</span></span>"+
                     "<br><span><span class='akahlongtermwellsHeadings'>Water Usage: </span><span class='akahlongtermwellsNames'>"+sensorLocResponse.features[0].attributes.water_usage+"</span></span>"+
                     "</div><div style='flex:2'><span><span class='akahlongtermwellsHeadings'>Motor capacity(hp): </span><span class='akahlongtermwellsNames'>"+sensorLocResponse.features[0].attributes.motor_capacity_hp+"</span></span>"+
                     "<br><span><span class='akahlongtermwellsHeadings'>Outlet pipe size(inch): </span><span class='akahlongtermwellsNames'>"+sensorLocResponse.features[0].attributes.outlet_pipe_size_inch+"</span></span>"+
                     "<br><span><span class='akahlongtermwellsHeadings'>Cable length: </span><span class='akahlongtermwellsNames'>"+sensorLocResponse.features[0].attributes.cable_length+"m</span></span>"+
                     "<br><span><span class='akahlongtermwellsHeadings'>Borehole diameter(inch): </span><span class='akahlongtermwellsNames'>"+sensorLocResponse.features[0].attributes.borehole_dia_inch+"</span></span></div></div>"

         
                     dojo.query('#sensorChartModule').style('display', 'none');
                     // domAttr.set('akahsensor_info','innerHTML',"<div style='font-weight: bold;font-size: 14px;line-height:2em;font-family:Arial;'>Sensor Information:</div>"+
                     // "<div style='display:inline-flex;'><div><span><span class='akahlongtermwellsHeadings'>Well Owner: </span><span class='akahlongtermwellsNames'>"+sensorLocResponse.features[0].attributes.well_owner_name+"</span></span>"+
                     // "<br><span><span class='akahlongtermwellsHeadings'>Well Depth(m): </span><span class='akahlongtermwellsNames'>"+sensorLocResponse.features[0].attributes.depth_m+"</span></span>"+
                     // "<br><span><span class='akahlongtermwellsHeadings'>Site name: </span><span class='akahlongtermwellsNames'>"+sensorLocResponse.features[0].attributes.site_name+"</span></span>"+
                     // "<br><span><span class='akahlongtermwellsHeadings'>Water Usage: </span><span class='akahlongtermwellsNames'>"+sensorLocResponse.features[0].attributes.water_usage+"</span></span>"+
                     // "</div><div><span><span class='akahlongtermwellsHeadings'>Motor capacity(hp): </span><span class='akahlongtermwellsNames'>"+sensorLocResponse.features[0].attributes.motor_capacity_hp+"</span></span>"+
                     // "<br><span><span class='akahlongtermwellsHeadings'>Outlet pipe size(inch): </span><span class='akahlongtermwellsNames'>"+sensorLocResponse.features[0].attributes.outlet_pipe_size_inch+"</span></span>"+
                     // "<br><span><span class='akahlongtermwellsHeadings'>Cable length: </span><span class='akahlongtermwellsNames'>"+sensorLocResponse.features[0].attributes.cable_length+"m</span></span></div></div>");
                     // domAttr.set('akahsensorlegend','innerHTML',"<div style='display:inline-flex;'><div style='display:inline-flex;'>"+
                     // "<div style='width:19px;height:14px;border:1.6px solid black;border-radius:4px;background-color:#0088BF;'></div>"+
                     // "<span style='padding-left:5px;'>Sensor Data<b>"+"</b></span></div>"+
                     // "<div style='display:inline-flex;padding-left:5px;'><div style='width:19px;height:14px;border:1.6px solid black;border-radius:4px;background-color:#6B3809;'></div>"+
                     // "<span style='padding-left:5px;'>TrendLine <b>"+"</b></span></div></div>")
                     // sensorchart.resize(570,330);
                     });
             }
             else{
               // domAttr.set('sensor_chart_loader',"innerHTML",'<p style="margin-left: 12%;margin-top:60px;margin-bottom:60px;font-size: 20px;font-weight: 600;color: #00833f;">Please select point with proper zoom extent...</p>');
               // dojo.query('#akahsensorIndicateBtn').style("display","none");
               dojo.query('#akahsensortrend').style("display","none");
             }
           });
           //sensor chart code ends here
            //bar chart plotting ends here
            function results2(r1){
              debugger
              dojo.byId("akahwellInventory_Report").removeAttribute('disabled');
              dojo.query("#wl").style("display","block");
              dojo.query("#wq").style("display","block");
              dojo.query("#pr_load").style("display","none");
              // [lulc_block_results,block_cgwb_wl_query,blockMapExtent,rep_block_result,
                // surWat,total_village_query,village_lulc_result, report_rainfall_query,
                // cgwb_results_village,selected_result,village_result]
              akah_Tool.wsp_after_execution(r1[3],r1[5]);
              //r1[5] -> rainfall response for wsp module calculations,
              // r1[6] -> surface water response for wsp module calculations
              waterSecurityPlan._init_wsp(r1[5], r1[6]);
            }
            //promise calls for all the block queries starts here
            window.block_rep_promisecall=executeAll([block_cgwb_wq_query,rep_aqui,rep_ws, rep_block_result, surWat1, rainfall_for_village_tab, surWat]);
            block_rep_promisecall.then(results2)
            //promise calls for all the block queries ends here
        });
          // Block query to obtain Block Geometry and Sub queries are Aquifer and Watershed,CGWB WQ  ends here -- Level1

    },

    wsp_after_execution:function(summ1, pet_resp){
      if(summ1.features.length>0){
          //using block response instead for calculating surface water bodies
          wsprv['block_area_ha'] = summ1.features[0].attributes['block_area_ha'].toFixed(2)
          //B.Groundwater module calculations and responses
          wsprv['block_rainfall_monsoon'] = summ1.features[0].attributes['recharge_rainfall_monsoon'].toFixed(2)
          wsprv['block_rainfall_nonmonsoon'] = summ1.features[0].attributes['recharge_rainfall_non_monsoon'].toFixed(2)
          wsprv['block_rainfall_total'] = Number(Number(wsprv['vill_rainfall_monsoon']) + Number(wsprv['vill_rainfall_nonmonsoon'])).toFixed(2)
          wsprv['block_other_monsoon'] = summ1.features[0].attributes['recharge_other_monsoon'].toFixed(2)
          wsprv['block_other_nonmonsoon'] = summ1.features[0].attributes['recharge_other_non_monsoon'].toFixed(2)
          wsprv['block_other_total'] = Number(Number(wsprv['vill_other_monsoon']) + Number(wsprv['vill_other_nonmonsoon'])).toFixed(2)
          wsprv['block_lossdue2_naturalDischarge'] = Number(Number(summ1.features[0].attributes['total_recharge_all_sources']) - Number(summ1.features[0].attributes['net_total_recharge'])).toFixed(2)
          wsprv['block_total_gnd_water'] = Number(summ1.features[0].attributes['net_total_recharge']).toFixed(2)

          pet_resp.features.forEach(function(act_pet_response){
            if(act_pet_response.attributes.year === 2020){
              wsprv['block_actual_rainfall_val'] = Number(act_pet_response.attributes.rainfall_actual*0.001);
              wsprv['block_pet_evapo_val'] = Number(act_pet_response.attributes.pet_annual*0.001);
              wsprv['block_volume_rainfall_val'] = Number(Number(wsprv['block_area_ha']) * (wsprv['block_actual_rainfall_val'])).toFixed(2);
              wsprv['block_evapo_losses_val'] = Number(Number(wsprv['block_area_ha']) * (wsprv['block_pet_evapo_val'])).toFixed(2);
              wsprv['block_tot_wtr_available'] = Number(Number(Number(wsprv['block_volume_rainfall_val'])-Number(wsprv['block_evapo_losses_val']))).toFixed(2)
            }
          })
          // wsprv['block_surface_wtr_avail'] = Number(wsprv['block_tot_wtr_available']) - Number(wsprv['block_total_gnd_water'])

          if (summ1.features[0].attributes.swb_area_ha < (5000/10000)) {
            wsprv['block_storage_capacity'] = (summ1.features[0].attributes.swb_area_ha*1)
          }
          else if (summ1.features[0].attributes.swb_area_ha > (5000/10000) && summ1.features[0].attributes.swb_area_ha >= (10000/10000)) {
            wsprv['block_storage_capacity'] = (summ1.features[0].attributes.swb_area_ha*2)
          }
          else if (summ1.features[0].attributes.swb_area_ha > (10000/10000) && summ1.features[0].attributes.swb_area_ha >= (50000/10000)) {
            wsprv['block_storage_capacity'] = (summ1.features[0].attributes.swb_area_ha*3)
          }
          else if (summ1.features[0].attributes.swb_area_ha > (50000/10000) && summ1.features[0].attributes.swb_area_ha >= (100000/10000)) {
            wsprv['block_storage_capacity'] = (summ1.features[0].attributes.swb_area_ha*4)
          }
          else if (summ1.features[0].attributes.swb_area_ha < (100000/10000)) {
            wsprv['block_storage_capacity'] = (summ1.features[0].attributes.swb_area_ha*5)
          }
          wsprv['block_storage_capacity_org'] = Number(summ1.features[0].attributes.swb_capacity_ham).toFixed(2)
          // Volume*(1-pet/actual)
          wsprv['block_surface_wtr_avail'] = (Number(wsprv['block_storage_capacity'])*(1-Number(wsprv['block_pet_evapo_val'])/Number(wsprv['block_actual_rainfall_val']))).toFixed(2)
          // formulae finalised by surya....
      }
    },

    generateIndicesCharts$report: function(obj_id){
      window.obj_id = obj_id;
      var rep_queryIndices = new Query()
      rep_queryIndices.where="year like 2020 and village_pk like "+obj_id;
      // queryNDWI.where = "ndwi_date between '2016-01-01' and '2017-3-01' and vid like 49"
      rep_queryIndices.returnDistinctValues=false;
      rep_queryIndices.returnGeometry=true;
      rep_queryIndices.orderByFields = ["year ASC"];
      rep_queryIndices.outFields=["village_pk","month","year","min","max","mean","stddev","water_percent","water_sw_percent"]
      new QueryTask(ndwi_statistics_url).execute(rep_queryIndices, function(rep_ndwi_response){
          rep_ndwidateLabels=[];window.rep_ndwidateLabels=rep_ndwidateLabels;
          rep_ndwi_minarray=[];window.rep_ndwi_minarray=rep_ndwi_minarray;
          rep_ndwi_maxarray=[];window.rep_ndwi_maxarray=rep_ndwi_maxarray;
          rep_ndwi_meanarray=[];window.rep_ndwi_meanarray=rep_ndwi_meanarray;
          rep_ndwi_sdarray=[];window.rep_ndwi_sdarray=rep_ndwi_sdarray;
          rep_ndwi_waterarray=[];window.rep_ndwi_waterarray=rep_ndwi_waterarray;
          rep_ndwi_swaterarray=[];window.rep_ndwi_swaterarray=rep_ndwi_swaterarray;

          rep_ndwi_response.features.forEach(function(rep_ndwi_resp, rep_ndwi_index){
              rep_ndwi_response.fields.forEach(function(evt, index){
                var fieldname = evt.name;
                if (fieldname.includes("year") ||fieldname.includes("month")|| fieldname.includes("min")||fieldname.includes("max")||fieldname.includes("mean")||fieldname.includes("stddev")||fieldname.includes("water_percent")||fieldname.includes("water_sw_percent")){
                  if(fieldname.includes("year") || fieldname.includes("month")){
                    if(fieldname.includes("month")&& rep_ndwi_resp.attributes[fieldname] != ""){
                      rep_ndwidateLabels.push({text:akah_Tool.month_function(rep_ndwi_resp.attributes.month), value:rep_ndwi_index+1})
                      }
                      if(fieldname.includes("year")&& rep_ndwi_resp.attributes[fieldname] != ""){
                        rep_ndwidateLabels[rep_ndwi_index].text = rep_ndwidateLabels[rep_ndwi_index].text + "_"+rep_ndwi_resp.attributes.year
                      }
                  }
                  else if(fieldname.includes("min") && rep_ndwi_resp.attributes[fieldname] != null)
                  {rep_ndwi_minarray.push(rep_ndwi_resp.attributes[fieldname]);}
                  else if(fieldname.includes("max") && rep_ndwi_resp.attributes[fieldname] != null)
                  {rep_ndwi_maxarray.push(rep_ndwi_resp.attributes[fieldname]);}
                  else if(fieldname.includes("mean") && rep_ndwi_resp.attributes[fieldname] != null)
                  {rep_ndwi_meanarray.push(rep_ndwi_resp.attributes[fieldname]);}
                  else if(fieldname.includes("stddev") && rep_ndwi_resp.attributes[fieldname] != null)
                  {rep_ndwi_sdarray.push(rep_ndwi_resp.attributes[fieldname]);}
                  else if(fieldname.includes("water_percent") && rep_ndwi_resp.attributes[fieldname] != null)
                  {rep_ndwi_waterarray.push(rep_ndwi_resp.attributes[fieldname]);}
                  // else if(fieldname.includes("water_sw_percent") && rep_ndwi_resp.attributes[fieldname] != null)
                  // {rep_ndwi_swaterarray.push(rep_ndwi_resp.attributes[fieldname]);}
                }
              });
          });
      }).then(function(evt){
          rep_queryIndices.where="year like 2020 and village_pk like "+obj_id;
          rep_queryIndices.orderByFields = ["year ASC"];
          rep_queryIndices.outFields=["village_pk","month","year","min","max","mean","stddev","dense_percent","sparse_percent","low_percentage"]
          new QueryTask(ndvi_statistics_url).execute(rep_queryIndices, function(rep_ndvi_response){
              rep_ndvidateLabels=[];window.rep_ndvidateLabels=rep_ndvidateLabels;
              rep_ndvi_minarray=[];window.rep_ndvi_minarray=rep_ndvi_minarray;
              rep_ndvi_maxarray=[];window.rep_ndvi_maxarray=rep_ndvi_maxarray;
              rep_ndvi_meanarray=[];window.rep_ndvi_meanarray=rep_ndvi_meanarray;
              rep_ndvi_sdarray=[];window.rep_ndvi_sdarray=rep_ndvi_sdarray;
              rep_ndvi_densearray=[];window.rep_ndvi_densearray=rep_ndvi_densearray;
              rep_ndvi_sparsearray=[];window.rep_ndvi_sparsearray=rep_ndvi_sparsearray;
              rep_ndvi_lowarray=[];window.rep_ndvi_lowarray=rep_ndvi_lowarray;
              rep_ndvi_response.features.forEach(function(rep_ndvi_resp, rep_ndvi_index){
                  rep_ndvi_response.fields.forEach(function(evt, index){
                    var fieldname = evt.name;
                    if (fieldname.includes("year") ||fieldname.includes("month")|| fieldname.includes("min")||fieldname.includes("max")||fieldname.includes("mean")||fieldname.includes("stddev")||fieldname.includes("dense_percent")||fieldname.includes("sparse_percent")||fieldname.includes("low_percentage")){
                      if(fieldname.includes("year") || fieldname.includes("month")){
                        if(fieldname.includes("month")&& rep_ndvi_resp.attributes[fieldname] != ""){
                          rep_ndvidateLabels.push({text:akah_Tool.month_function(rep_ndvi_resp.attributes.month), value:rep_ndvi_index+1})
                          }
                          if(fieldname.includes("year")&& rep_ndvi_resp.attributes[fieldname] != ""){
                            rep_ndvidateLabels[rep_ndvi_index].text = rep_ndvidateLabels[rep_ndvi_index].text + "_"+rep_ndvi_resp.attributes.year
                          }
                      }
                      else if(fieldname.includes("min") && rep_ndvi_resp.attributes[fieldname] != null)
                      {rep_ndvi_minarray.push(rep_ndvi_resp.attributes[fieldname]);}
                      else if(fieldname.includes("max") && rep_ndvi_resp.attributes[fieldname] != null)
                      {rep_ndvi_maxarray.push(rep_ndvi_resp.attributes[fieldname]);}
                      else if(fieldname.includes("mean") && rep_ndvi_resp.attributes[fieldname] != null)
                      {rep_ndvi_meanarray.push(rep_ndvi_resp.attributes[fieldname]);}
                      else if(fieldname.includes("stddev") && rep_ndvi_resp.attributes[fieldname] != null)
                      {rep_ndvi_sdarray.push(rep_ndvi_resp.attributes[fieldname]);}
                      else if(fieldname.includes("dense_percent") && rep_ndvi_resp.attributes[fieldname] != null)
                      {rep_ndvi_densearray.push(rep_ndvi_resp.attributes[fieldname]);}
                      else if(fieldname.includes("sparse_percent") && rep_ndvi_resp.attributes[fieldname] != null)
                      {rep_ndvi_sparsearray.push(rep_ndvi_resp.attributes[fieldname]);}
                      else if(fieldname.includes("low_percentage") && rep_ndvi_resp.attributes[fieldname] != null)
                      {rep_ndvi_lowarray.push(rep_ndvi_resp.attributes[fieldname]);}
                    }
                  });
              });
          }).then(function(evt){
            //code for plotting regression line/ trendline for ndvi
            window.ndvi_index_arr = [];
            window.ndwi_index_arr = [];
            rep_ndvi_meanarray.forEach(function(value, index){
              ndvi_index_arr.push(rep_ndvi_meanarray.indexOf(value));window.ndvi_index_arr = ndvi_index_arr.sort((a,b)=>a-b);
            });
            rep_ndwi_meanarray.forEach(function(value, index){
              ndwi_index_arr.push(rep_ndwi_meanarray.indexOf(value));window.ndwi_index_arr = ndwi_index_arr.sort((a,b)=>a-b);
            });
            var array_xy_ndvi = [];       // creating x * y array
            var array_xx_ndvi = [];
            var ndvi_error_pre = [];      // creating x * x array
            for(var i = 0; i<rep_ndvi_meanarray.length; i++){
              array_xy_ndvi.push(rep_ndvi_meanarray[i] * ndvi_index_arr[i]);
              array_xx_ndvi.push(ndvi_index_arr[i] * ndvi_index_arr[i]);
              // error.push((a1[i]-a[i])**2);
            }
           //created new arrays x*y and x*x
           //m. b values formulea
            m =  (((dojox.math.stats.mean(ndvi_index_arr) * dojox.math.stats.mean(rep_ndvi_meanarray)) - dojox.math.stats.mean(array_xy_ndvi)) /
              ((dojox.math.stats.mean(ndvi_index_arr) * dojox.math.stats.mean(ndvi_index_arr)) - dojox.math.stats.mean(array_xx_ndvi)));
            b=(dojox.math.stats.mean(rep_ndvi_meanarray) - dojox.math.stats.mean(ndvi_index_arr)*m);

            window.reg_line_ndvi = [];
            for(var x = 0; x<ndvi_index_arr.length; x++){
             reg_line_ndvi.push((m*ndvi_index_arr[x]) + b);
             // gwl[x].text +": " +
            }

            for(var w = 0; w<reg_line_ndvi.length; w++){
              ndvi_error_pre.push((rep_ndvi_meanarray[w]-reg_line_ndvi[w]));
            }
            ndvi_error_pre = ndvi_error_pre.map(x => x ** 2);
            var ndvi_error_mean_pre = dojox.math.stats.mean(ndvi_error_pre)
            var ndvi_err_sq_pre = Math.abs(Math.sqrt(Math.round(ndvi_error_mean_pre)).toFixed(2));

            //code for plotting regression line/ trendline for ndwi
            var array_xy_ndwi = [];       // creating x * y array
            var array_xx_ndwi = [];
            var ndwi_error_pre = [];      // creating x * x array
            for(var i = 0; i<rep_ndwi_meanarray.length; i++){
              array_xy_ndwi.push(rep_ndwi_meanarray[i] * ndwi_index_arr[i]);
              array_xx_ndwi.push(ndwi_index_arr[i] * ndwi_index_arr[i]);
              // error.push((a1[i]-a[i])**2);
            }
           //created new arrays x*y and x*x
           //m. b values formulea
            m =  (((dojox.math.stats.mean(ndwi_index_arr) * dojox.math.stats.mean(rep_ndwi_meanarray)) - dojox.math.stats.mean(array_xy_ndwi)) /
              ((dojox.math.stats.mean(ndwi_index_arr) * dojox.math.stats.mean(ndwi_index_arr)) - dojox.math.stats.mean(array_xx_ndwi)));
            b=(dojox.math.stats.mean(rep_ndwi_meanarray) - dojox.math.stats.mean(ndwi_index_arr)*m);

            window.reg_line_ndwi = [];
            for(var x = 0; x<ndwi_index_arr.length; x++){
             reg_line_ndwi.push((m*ndwi_index_arr[x]) + b);
             // gwl[x].text +": " +
            }

            for(var w = 0; w<reg_line_ndwi.length; w++){
              ndwi_error_pre.push((rep_ndwi_meanarray[w]-reg_line_ndwi[w]));
            }
            ndwi_error_pre = ndwi_error_pre.map(x => x ** 2);
            var ndwi_error_mean_pre = dojox.math.stats.mean(ndwi_error_pre)
            var ndwi_err_sq_pre = Math.abs(Math.sqrt(Math.round(ndwi_error_mean_pre)).toFixed(2));

            //code for NDWI  chart in reports **(modified from here)
            domAttr.set('ndwiChart_report','innerHTML','');
            dojo.query('#ndwi_chart_dash').style('display', 'block');
            var rep_ndwichart = new Chart("ndwiChart_report");
            rep_ndwichart.addPlot("default", {type: LinesPlot,markers: true,tension: "S",marker: "m-3,0 c0,-4 6,-4 6,0 m-6,0 c0,4 6,4 6,0" });
            rep_ndwichart.addPlot("trendline", {type: LinesPlot,markers: false,tension: "S"});
            rep_ndwichart.addAxis("x", { includeZero: false, fixLower: "major", fixUpper: "major", natural: false, vertical: false, rotation: -45, title: "Date", titleFontColor: "black",
            labels: rep_ndwidateLabels, titleOrientation: "away", majorLabels: true,majorTicks:true,majorTickStep:1,minorTicks:false});
            rep_ndwichart.addAxis("y", { min : -1, max:1, majorTickStep:0.1,vertical: true, fixLower: "minor", fixUpper: "minor", title: "Value", titleFontColor: "black",minorTicks:true});
            // rep_ndwichart.addSeries("Max", rep_ndwi_maxarray,{plot: "default", stroke: {color:"#007E11", width:2},markers:true,marker: "m-3,0 c0,-4 6,-4 6,0 m-6,0 c0,4 6,4 6,0" }); //min:
            rep_ndwichart.addSeries("Mean", rep_ndwi_meanarray,{plot: "default", stroke: {color:"#0077BB", width:2}}); //min:
            rep_ndwichart.addSeries("trendline", reg_line_ndwi,{plot: "trendline", stroke: {color:"#114C6E", width:2} }); //min:

            // rep_ndwichart.addSeries("Min", rep_ndwi_minarray,{plot: "default", stroke: {color:"#00E21F", width:2}}); //min: 0, max: Math.max.apply(null, a),
            // rep_ndwichart.addSeries("Sd", rep_ndwi_sdarray,{plot: "default", stroke: {color:"#C4E300", width:2} }); //min:
            new Tooltip(rep_ndwichart, "default", {
                text: function(o){
                  return "Element at index: "+o.index;
                }
            });
            rep_ndwichart.title = "Surface Water Index"
            rep_ndwichart.titleFont= "bold 14px Arial"
            rep_ndwichart.titlePos = "top"
            rep_ndwichart.titleGap = 10
            rep_ndwichart.render();
            domAttr.set("ndwi_legend_report","innerHTML",'<table style="line-height: 2em;padding-left: 41%;"><tbody style="display:inline-flex;">'+
            // '<tr><td><span style="padding: 0px 8px 0px 6px;color:#007E11;background-color:#007E11;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Maximum</td></tr>'+
            '<tr><td><span style="padding: 0px 8px 0px 6px;color:#0077BB;background-color:#0077BB;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Mean</td></tr>'+
            '<tr><td><span style="padding: 0px 8px 0px 6px;color:#114C6E;background-color:#114C6E;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Trend line</td></tr></tbody></table>')
            // '<tr><td><span style="padding: 0px 8px 0px 6px;color:#00E21F;background-color:#00E21F;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Minimum</td></tr>'+
            // '<tr><td><span style="padding: 0px 8px 0px 6px;color:#C4E300;background-color:#C4E300;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Standard_deviation</td></tr></table>'
            //code for NDWI  chart in reports ends **(modified till here)
            //NDWI area chart
            domAttr.set('ndwiareaChart_report','innerHTML','');
            dojo.query('#ndwiarea_chart_dash').style('display', 'block');
            var rep_ndwiareachart = new Chart("ndwiareaChart_report");
            // rep_ndwiareachart.addPlot("default", {type: LinesPlot,markers: true,tension: "S",marker: "m-3,0 c0,-4 6,-4 6,0 m-6,0 c0,4 6,4 6,0" });
            // // rep_ndwiareachart.addPlot("trendline", {type: LinesPlot,markers: false,tension: "S"});
            // rep_ndwiareachart.addAxis("x", { includeZero: false, fixLower: "major", fixUpper: "major", natural: false, vertical: false, rotation: 90, title: "Date", titleFontColor: "black",
            // labels: rep_ndwidateLabels, titleOrientation: "away", majorLabels: true,majorTicks:true,majorTickStep:1,minorTicks:false});
            // rep_ndwiareachart.addAxis("y", { min : 0,max:Math.max.apply(null,rep_ndwi_waterarray)+1,vertical: true, fixLower: "minor", fixUpper: "minor", title: "Surface Water Area (%)", titleFontColor: "black",minorTicks:true});
            // // rep_ndwichart.addSeries("Max", rep_ndwi_maxarray,{plot: "default", stroke: {color:"#007E11", width:2},markers:true,marker: "m-3,0 c0,-4 6,-4 6,0 m-6,0 c0,4 6,4 6,0" }); //min:
            // rep_ndwiareachart.addSeries("Water %", rep_ndwi_waterarray,{plot: "default", stroke: {color:"#0077BB", width:2}}); //min:
            // rep_ndwiareachart.addSeries("Surface Water %", rep_ndwi_swaterarray,{plot: "default", stroke: {color:"#025482", width:2}}); //min:
            // rep_ndwichart.addSeries("Min", rep_ndwi_minarray,{plot: "default", stroke: {color:"#00E21F", width:2}}); //min: 0, max: Math.max.apply(null, a),
            // rep_ndwichart.addSeries("Sd", rep_ndwi_sdarray,{plot: "default", stroke: {color:"#C4E300", width:2} }); //min:
         
            rep_ndwiareachart.addPlot("default", {type: "Columns", gap: 2, width: 15, plotarea: { fill: "#0077BB" }});
            rep_ndwiareachart.addAxis("x", { includeZero: false, natural: false,rotation:-45, vertical: false, title: "Date",titleOrientation: "away",
                  labels: rep_ndwidateLabels});
            // rep_ndwiareachart.addAxis("y", { min: Math.min.apply(null,rep_ndwi_waterarray) - 1, max:Math.max.apply(null,rep_ndwi_waterarray)+1,vertical: true, enableCache: true,fixLower: "minor", fixUpper: "minor", title: "Rainfall (mm)",minorTicks:true});
            rep_ndwiareachart.addAxis("y", {vertical: true, enableCache: true,fixLower: "minor", fixUpper: "minor", title: "Area(%)",minorTicks:true});
            rep_ndwiareachart.addSeries("Water %", rep_ndwi_waterarray,{plot: "default",color:"#2E86C1",stroke: { color: "#2E86C1",width: 1}}); //min: 
            window.rep_ndwiareachart=rep_ndwiareachart;
            rep_ndwiareachart.title = "Surface Water Area"
            rep_ndwiareachart.titleFont= "bold 14px Arial"
            rep_ndwiareachart.titlePos = "top"
            rep_ndwiareachart.titleGap = 10
            rep_ndwiareachart.render();

          


            // domAttr.set("ndwiarea_legend_report","innerHTML",'<table style="line-height: 2em;padding-left: 60px;">'+
            // '<tr><td><span style="padding: 0px 8px 0px 6px;color:#0077BB;background-color:#0077BB;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Water (%)</td></tr></table>')
            // '<tr><td><span style="padding: 0px 8px 0px 6px;color:#025482;background-color:#025482;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Surface Water</td></tr></table>')
           //NDVI from here
            domAttr.set('ndviChart_report','innerHTML','');
            dojo.query('#ndvi_chart_dash').style('display', 'block');
            var rep_ndvichart = new Chart("ndviChart_report");
            rep_ndvichart.addPlot("default", {type: LinesPlot,markers: true,tension: "S",marker: "m-3,0 c0,-4 6,-4 6,0 m-6,0 c0,4 6,4 6,0" });
            rep_ndvichart.addPlot("trendline", {type: LinesPlot,markers: false,tension: "S"});
            rep_ndvichart.addAxis("x", { includeZero: false, fixLower: "major", fixUpper: "major", natural: false, vertical: false, rotation: -45, title: "Date", titleFontColor: "black",
            labels: rep_ndvidateLabels, titleOrientation: "away", majorLabels: true,majorTicks:true,majorTickStep:1,minorTicks:false});
            rep_ndvichart.addAxis("y", { min : -1, max:1, majorTickStep:0.1, vertical: true, fixLower: "minor", fixUpper: "minor", title: "Value", titleFontColor: "black",minorTicks:true});
            // rep_ndvichart.addSeries("Max", rep_ndvi_maxarray,{plot: "default", stroke: {color:"#007E11", width:2},markers:true,marker: "m-3,0 c0,-4 6,-4 6,0 m-6,0 c0,4 6,4 6,0" }); //min:
            rep_ndvichart.addSeries("Mean", rep_ndvi_meanarray,{plot: "default", stroke: {color:"#00E21F", width:2}}); //min:
            rep_ndvichart.addSeries("trendline", reg_line_ndvi,{plot: "trendline", stroke: {color:"#007E11", width:2} }); //min:
            // rep_ndvichart.addSeries("Min", rep_ndvi_minarray,{plot: "default", stroke: {color:"#00E21F", width:2}}); //min: 0, max: Math.max.apply(null, a),
            // rep_ndvichart.addSeries("Sd", rep_ndvi_sdarray,{plot: "default", stroke: {color:"#C4E300", width:2} }); //min:
            rep_ndwiareachart.title = "Vegetation Index"
            rep_ndwiareachart.titleFont= "bold 14px Arial"
            rep_ndwiareachart.titlePos = "top"
            rep_ndwiareachart.titleGap = 10
            rep_ndvichart.render();

            domAttr.set("ndvi_legend_report","innerHTML",'<table style="line-height: 2em;padding-left: 40%;"><tbody style="display:inline-flex;">'+
            // '<tr><td><span style="padding: 0px 8px 0px 6px;color:#007E11;background-color:#007E11;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Maximum</td></tr>'+
            '<tr><td><span style="padding: 0px 8px 0px 6px;color:#00E21F;background-color:#00E21F;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Mean</td></tr>'+
            '<tr><td><span style="padding: 0px 8px 0px 6px;color:#007E11;background-color:#007E11;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Trend line</td></tr></tbody></table>')
            // '<tr><td><span style="padding: 0px 8px 0px 6px;color:#00E21F;background-color:#00E21F;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Minimum</td></tr>'+
            // '<tr><td><span style="padding: 0px 8px 0px 6px;color:#C4E300;background-color:#C4E300;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Standard_deviation</td></tr></table>')
            //code for NDVI  chart in reports ends **(modified till here)
            //NDVI area chart
            domAttr.set('ndviareaChart_report','innerHTML','');
            dojo.query('#ndviarea_chart_dash').style('display', 'block');
            var rep_ndviareachart = new Chart("ndviareaChart_report");
            // rep_ndviareachart.addPlot("default", {type: LinesPlot,markers: true,tension: "S",marker: "m-3,0 c0,-4 6,-4 6,0 m-6,0 c0,4 6,4 6,0" });
            // // rep_ndviareachart.addPlot("trendline", {type: LinesPlot,markers: false,tension: "S"});
            // rep_ndviareachart.addAxis("x", { includeZero: false, fixLower: "major", fixUpper: "major", natural: false, vertical: false, rotation: 90, title: "Date", titleFontColor: "black",
            // labels: rep_ndvidateLabels, titleOrientation: "away", majorLabels: true,majorTicks:true,majorTickStep:1,minorTicks:false});
            // rep_ndviareachart.addAxis("y", { min : 0, vertical: true, fixLower: "minor", fixUpper: "minor", title: "Vegetation Area", titleFontColor: "black",minorTicks:true});
            // rep_ndviareachart.addSeries("Dense", rep_ndvi_densearray,{plot: "default", stroke: {color:"#007E11", width:2}});
            // rep_ndviareachart.addSeries("Sparse", rep_ndvi_sparsearray,{plot: "default", stroke: {color:"#00AA17", width:2}});
            // rep_ndviareachart.addSeries("Low", rep_ndvi_lowarray,{plot: "default", stroke: {color:"#00E21F", width:2}});
            rep_ndviareachart.addPlot("stackedColumnsPlot", {type: StackedColumns,gap:5,lines: true,areas: true,markers: true,labels: false,labelStyle:"outside",tension: "2"});
            rep_ndviareachart.addAxis("x", {  dropLabels: false,labelSizeChange: true,majorTicks:true,rotation:-45,majorTickStep:1,minorTicks:false,fontColor: "black",titleOrientation:"away",
                             labels: rep_ndvidateLabels, title:"Date" });
            rep_ndviareachart.addAxis("y", {title:"Area(%)",fixLower: "major",fixUpper: "major", includeZero: true,vertical: true});
            rep_ndviareachart.addSeries("Dense",rep_ndvi_densearray ,{plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF" ,},fill: "#007E11"});
            rep_ndviareachart.addSeries("Sparse", rep_ndvi_sparsearray, {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF"},fill: "#00AA17"});
            rep_ndviareachart.addSeries("Low", rep_ndvi_lowarray , {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF"},fill: "#00E21F"});
            rep_ndviareachart.title = "Vegetation Area"
            rep_ndviareachart.titleFont= "bold 14px Arial"
            rep_ndviareachart.titlePos = "top"
            rep_ndviareachart.titleGap = 10
            rep_ndviareachart.render();
            domAttr.set("ndviarea_legend_report","innerHTML",'<table style="line-height: 2em;padding-left:30%;"><tbody style="display:inline-flex;">'+
            '<tr style="vertical-align:baseline;line-height:1.6em;"><td><span style="padding: 0px 8px 0px 6px;color:#007E11;background-color:#007E11;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Dense</td></tr>'+
            '<tr style="vertical-align:baseline;line-height:1.6em;"><td><span style="padding: 0px 8px 0px 6px;color:#00AA17;background-color:#00AA17;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Sparse</td></tr>'+
            '<tr style="vertical-align:baseline;line-height:1.6em;"><td><span style="padding: 0px 8px 0px 6px;color:#00E21F;background-color:#00E21F;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Low</td></tr></tbody></table>')
            dojo.query('#ndwi_chart_dash').style('display', 'none');
            dojo.query('#ndvi_chart_dash').style('display', 'none');
            dojo.query('#ndwiarea_chart_dash').style('display', 'none');
            dojo.query('#ndviarea_chart_dash').style('display', 'none');
          }).then(function(evt){
            window.vegetationIndex_inp = {};
            /*ndvi_seasonal_url query*/
            rep_queryIndices.where = "village_pk like "+obj_id;
            rep_queryIndices.outFields = ["*"]
            window.seasonal_ndviReport = new QueryTask(ndvi_seasonal_trendUrl).execute(rep_queryIndices, function(rep_ndviTrend_response){
              window.rep_ndviTrend_response = rep_ndviTrend_response;
              vegetationIndex_inp['ndvi_classes'] = ['dense_agg_percent', 'sparse_agg_percent', 'low_agg_percent']
              vegetationIndex_inp['trend_current_year'] = (new Date().getFullYear());
              vegetationIndex_inp['trend_init_year'] = (new Date().getFullYear())-5;
              pre_denseArr=[];pre_sparseArr=[];pre_lowArr=[];post_denseArr=[];post_sparseArr=[];post_lowArr=[];
              window.pre_denseArr=pre_denseArr;window.pre_sparseArr=pre_sparseArr;window.pre_lowArr=pre_lowArr;window.post_denseArr=post_denseArr;window.post_sparseArr=post_sparseArr;window.post_lowArr=post_lowArr;
              rep_ndviTrend_response.features.forEach(function(ft){
                /*condition to generate inputs for only 5-year vegetation index trend till current year.*/
                if (ft.attributes.year >= vegetationIndex_inp['trend_init_year'] && ft.attributes.year < vegetationIndex_inp['trend_current_year']) {
                    // variables declared for pre and post monsoon ndvi charts in village level.
                    if (vegetationIndex_inp['pre_dense_agg_percent'] === undefined) {
                      vegetationIndex_inp['pre_dense_agg_percent'] = [];
                    }
                    if (vegetationIndex_inp['pre_sparse_agg_percent'] === undefined) {
                      vegetationIndex_inp['pre_sparse_agg_percent'] = [];
                    }
                    if (vegetationIndex_inp['pre_low_agg_percent'] === undefined) {
                      vegetationIndex_inp['pre_low_agg_percent'] = [];
                    }
                    if (vegetationIndex_inp['post_dense_agg_percent'] === undefined) {
                      vegetationIndex_inp['post_dense_agg_percent'] = [];
                    }
                    if (vegetationIndex_inp['post_sparse_agg_percent'] === undefined) {
                      vegetationIndex_inp['post_sparse_agg_percent'] = [];
                    }
                    if (vegetationIndex_inp['post_low_agg_percent'] === undefined) {
                      vegetationIndex_inp['post_low_agg_percent'] = [];
                    }
                    if (vegetationIndex_inp['year'] === undefined) {
                      vegetationIndex_inp['year'] = [];
                    }
                    /*array to store years of ndvi inputs*/
                    vegetationIndex_inp['year'].push(Number(ft.attributes['year']))
                    /*ft.attributes['season'] contains trailing spaces after 'Pre' so used trim()*/
                    if (ft.attributes['season'].trim() === 'Pre') {
                      // vegetationIndex_inp['pre_dense_agg_percent'].push({y: Number(ft.attributes['dense_agg_percent']), fill:"#007E11"})
                      // vegetationIndex_inp['pre_sparse_agg_percent'].push({y: Number(ft.attributes['sparse_agg_percent']), fill:"#00AA17"})
                      // vegetationIndex_inp['pre_low_agg_percent'].push({y: Number(ft.attributes['low_agg_percent']), fill:"#00E21F"})
                      vegetationIndex_inp['pre_dense_agg_percent'].push(Number(ft.attributes['dense_agg_percent']))
                      vegetationIndex_inp['pre_sparse_agg_percent'].push( Number(ft.attributes['sparse_agg_percent']))
                      vegetationIndex_inp['pre_low_agg_percent'].push(Number(ft.attributes['low_agg_percent']))
                      pre_denseArr.push(Number(ft.attributes['dense_agg_percent']))
                      pre_sparseArr.push(Number(ft.attributes['sparse_agg_percent']))
                      pre_lowArr.push(Number(ft.attributes['low_agg_percent']))
                    }
                    /*ft.attributes['season'] contains trailing spaces after 'Post' so used trim()*/
                    else if (ft.attributes['season'].trim() === 'Post') {
                      // vegetationIndex_inp['post_dense_agg_percent'].push({y: Number(ft.attributes['dense_agg_percent']), fill:"#007E11"})
                      // vegetationIndex_inp['post_sparse_agg_percent'].push({y: Number(ft.attributes['sparse_agg_percent']), fill:"#00AA17"})
                      // vegetationIndex_inp['post_low_agg_percent'].push({y: Number(ft.attributes['low_agg_percent']), fill:"#00E21F"})
                      vegetationIndex_inp['post_dense_agg_percent'].push(Number(ft.attributes['dense_agg_percent']))
                      vegetationIndex_inp['post_sparse_agg_percent'].push(Number(ft.attributes['sparse_agg_percent']))
                      vegetationIndex_inp['post_low_agg_percent'].push(Number(ft.attributes['low_agg_percent']))
                      post_denseArr.push(Number(ft.attributes['dense_agg_percent']))
                      post_sparseArr.push(Number(ft.attributes['sparse_agg_percent']))
                      post_lowArr.push(Number(ft.attributes['low_agg_percent']))
                    }
                }
              });
              /*remove the repetitive values from year array.*/
              vegetationIndex_inp['year'] = vegetationIndex_inp['year'].filter( function( item, index, inputArray ) {
                                                return inputArray.indexOf(item) == index;
                                              });
              /*x-axes input array for vegetation charts*/
              vegetationIndex_inp['year_inputForChart'] = [];
              for(i=0;i<=vegetationIndex_inp['year'].length-1;i++){
                  vegetationIndex_inp['year_inputForChart'].push({
                    text: vegetationIndex_inp['year'][i],
                    value: i+1
                  });
              }
              /*function to get values that are displayed as headings in 5-year lulc table*/
              function getVegtClass(vegt_attribute){
                switch(vegt_attribute){
                  case 'dense_agg_percent': vegt_attribute = 'Dense';break;
                  case 'sparse_agg_percent': vegt_attribute = 'Sparse';break;
                  case 'low_agg_percent': vegt_attribute = 'Low';break;
                }
                return vegt_attribute
              }
              dojo.query('#vegetationIndices_chart').style('display', 'block')
              domAttr.set('vegetation_pre_chart', 'innerHTML', '')
              domAttr.set('vegetation_post_chart', 'innerHTML', '')
              for(i=0;i<=vegetationIndex_inp['ndvi_classes'].length-1;i++){
                /*create div's dynamically for all the post and pre charts*/
                vegetationIndex_inp['pre_'+vegetationIndex_inp['ndvi_classes'][i]+'_div'] = dojo.create("div", {id: "vegt_pre_"+vegetationIndex_inp['ndvi_classes'][i]+"Chart"});
                vegetationIndex_inp['post_'+vegetationIndex_inp['ndvi_classes'][i]+'_div'] = dojo.create("div", {id: "vegt_post_"+vegetationIndex_inp['ndvi_classes'][i]+"Chart"});
                vegetationIndex_inp['pre_'+vegetationIndex_inp['ndvi_classes'][i]+'_div'].className = "vegt_chartsResize";
                vegetationIndex_inp['post_'+vegetationIndex_inp['ndvi_classes'][i]+'_div'].className = "vegt_chartsResize";
                
                if (i === 0){
                  dojo.place(vegetationIndex_inp['pre_'+vegetationIndex_inp['ndvi_classes'][i]+'_div'], "vegetation_pre_chart", "first");
                  // dojo.place(vegetationIndex_inp['post_'+vegetationIndex_inp['ndvi_classes'][i]+'_div'], "vegetation_post_chart", "first");
                }
                else{
                  var prev_className = vegetationIndex_inp['ndvi_classes'][i-1]
                  dojo.place(vegetationIndex_inp['pre_'+vegetationIndex_inp['ndvi_classes'][i]+'_div'], vegetationIndex_inp['pre_'+prev_className+'_div'], "after");
                  dojo.place(vegetationIndex_inp['post_'+vegetationIndex_inp['ndvi_classes'][i]+'_div'], vegetationIndex_inp['post_'+prev_className+'_div'], "after");
               }
                                
                /*lulc pre-monsoon chart definition*/
                // window.vegetationIndex_inp['pre_'+vegetationIndex_inp['ndvi_classes'][i]+'_chart'] = new dojox.charting.Chart2D(vegetationIndex_inp['pre_'+vegetationIndex_inp['ndvi_classes'][i]+'_div']);
                // vegetationIndex_inp['pre_'+vegetationIndex_inp['ndvi_classes'][i]+'_chart'].addPlot('pre-monsoon', {type: "Columns",markers: true,gap:5,maxBarSize: 60, tension: "2",animate: { duration: 2000, easing: dojo.fx.easing.bounceInOut }});
                // vegetationIndex_inp['pre_'+vegetationIndex_inp['ndvi_classes'][i]+'_chart'].addAxis("x", {title:"Year",dropLabels: false,titleOrientation: "away", labelSizeChange: true, majorTicks:true, majorTickStep:1, minorTicks:false, font: "normal normal bold 12px Arial", fontColor: "black",
                //   labels: vegetationIndex_inp['year_inputForChart']});
                // vegetationIndex_inp['pre_'+vegetationIndex_inp['ndvi_classes'][i]+'_chart'].addAxis("y", {title:"Area(%)",fixLower: "major",fixUpper: "major", vertical: true});
                // /*lulc post-monsoon inputs*/
                // vegetationIndex_inp['pre_'+vegetationIndex_inp['ndvi_classes'][i]+'_chart'].addSeries('pre_monsoon', vegetationIndex_inp['pre_'+vegetationIndex_inp['ndvi_classes'][i]], {plot: "pre-monsoon"});
                // vegetationIndex_inp['pre_'+vegetationIndex_inp['ndvi_classes'][i]+'_chart'].title = getVegtClass(vegetationIndex_inp['ndvi_classes'][i])+": Pre-monsoon ("+vegetationIndex_inp['year'][0]+"-"+vegetationIndex_inp['year'][vegetationIndex_inp['year'].length-1]+")"
                // vegetationIndex_inp['pre_'+vegetationIndex_inp['ndvi_classes'][i]+'_chart'].titleFont = "bold 14px Arial"
                // vegetationIndex_inp['pre_'+vegetationIndex_inp['ndvi_classes'][i]+'_chart'].titlePos = "top"
                // vegetationIndex_inp['pre_'+vegetationIndex_inp['ndvi_classes'][i]+'_chart'].render();
                // vegetationIndex_inp['pre_'+vegetationIndex_inp['ndvi_classes'][i]+'_chart'].resize(350,250);

                window.vegetationIndex_inp['pre_'+vegetationIndex_inp['ndvi_classes'][i]+'_chart'] = new dojox.charting.Chart2D(vegetationIndex_inp['pre_'+vegetationIndex_inp['ndvi_classes'][i]+'_div']);
                vegetationIndex_inp['pre_'+vegetationIndex_inp['ndvi_classes'][i]+'_chart'].addPlot('stackedColumnsPlot', {type: StackedColumns,markers: true,gap:5,lines: true,areas: true,markers: true,labels: true,labelStyle:"outside",tension: "2"});
                vegetationIndex_inp['pre_'+vegetationIndex_inp['ndvi_classes'][i]+'_chart'].addAxis("x",  {  dropLabels: false,labelSizeChange: true,majorTicks:true,majorTickStep:1,minorTicks:false,titleOrientation:"away",
                  labels: vegetationIndex_inp['year_inputForChart'],title:"Year" });
                vegetationIndex_inp['pre_'+vegetationIndex_inp['ndvi_classes'][i]+'_chart'].addAxis("y", {title:"Area(%)",fixLower: "major",fixUpper: "major", vertical: true});
                /*lulc post-monsoon inputs*/
              if(vegetationIndex_inp['ndvi_classes'][i].includes("dense")){
                vegetationIndex_inp['pre_'+vegetationIndex_inp['ndvi_classes'][i]+'_chart'].addSeries('Pre', vegetationIndex_inp['pre_'+vegetationIndex_inp['ndvi_classes'][i]], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF" ,},fill: "#A3A334"});
                vegetationIndex_inp['pre_'+vegetationIndex_inp['ndvi_classes'][i]+'_chart'].addSeries('Post', vegetationIndex_inp['post_'+vegetationIndex_inp['ndvi_classes'][i]], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF"},fill: "#007E11"});
              }
              else if(vegetationIndex_inp['ndvi_classes'][i].includes("sparse")){
                vegetationIndex_inp['pre_'+vegetationIndex_inp['ndvi_classes'][i]+'_chart'].addSeries('Pre', vegetationIndex_inp['pre_'+vegetationIndex_inp['ndvi_classes'][i]], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF" ,},fill: "#A3A334"});
                vegetationIndex_inp['pre_'+vegetationIndex_inp['ndvi_classes'][i]+'_chart'].addSeries('Post', vegetationIndex_inp['post_'+vegetationIndex_inp['ndvi_classes'][i]], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF"},fill: "#00AA17"});
              }
              else if(vegetationIndex_inp['ndvi_classes'][i].includes("low")){
                vegetationIndex_inp['pre_'+vegetationIndex_inp['ndvi_classes'][i]+'_chart'].addSeries('Pre', vegetationIndex_inp['pre_'+vegetationIndex_inp['ndvi_classes'][i]], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF" ,},fill: "#A3A334"});
                vegetationIndex_inp['pre_'+vegetationIndex_inp['ndvi_classes'][i]+'_chart'].addSeries('Post', vegetationIndex_inp['post_'+vegetationIndex_inp['ndvi_classes'][i]], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF"},fill: "#00E21F"});
              }
                vegetationIndex_inp['pre_'+vegetationIndex_inp['ndvi_classes'][i]+'_chart'].title = getVegtClass(vegetationIndex_inp['ndvi_classes'][i])+" Vegetation ("+vegetationIndex_inp['year'][0]+"-"+vegetationIndex_inp['year'][vegetationIndex_inp['year'].length-1]+")"
                vegetationIndex_inp['pre_'+vegetationIndex_inp['ndvi_classes'][i]+'_chart'].titleFont = "bold 14px Arial"
                vegetationIndex_inp['pre_'+vegetationIndex_inp['ndvi_classes'][i]+'_chart'].titlePos = "top"
                vegetationIndex_inp['pre_'+vegetationIndex_inp['ndvi_classes'][i]+'_chart'].render();
                vegetationIndex_inp['pre_'+vegetationIndex_inp['ndvi_classes'][i]+'_chart'].resize(350,250);

                /*lulc post-monsoon chart definition*/
                // window.vegetationIndex_inp['post_'+vegetationIndex_inp['ndvi_classes'][i]+'_chart'] = new dojox.charting.Chart2D(vegetationIndex_inp['post_'+vegetationIndex_inp['ndvi_classes'][i]+'_div']);
                // vegetationIndex_inp['post_'+vegetationIndex_inp['ndvi_classes'][i]+'_chart'].addPlot('post-monsoon', {type: "Columns",markers: true,gap:5,maxBarSize: 60, tension: "2",animate: { duration: 2000, easing: dojo.fx.easing.bounceInOut }});
                // vegetationIndex_inp['post_'+vegetationIndex_inp['ndvi_classes'][i]+'_chart'].addAxis("x", {title:"Year", dropLabels: false,titleOrientation: "away", labelSizeChange: true, majorTicks:true, majorTickStep:1, minorTicks:false, font: "normal normal bold 12px Arial", fontColor: "black",
                //   labels: vegetationIndex_inp['year_inputForChart']});
                // vegetationIndex_inp['post_'+vegetationIndex_inp['ndvi_classes'][i]+'_chart'].addAxis("y", {title:"Area(%)",fixLower: "major",fixUpper: "major", vertical: true});
                // vegetationIndex_inp['post_'+vegetationIndex_inp['ndvi_classes'][i]+'_chart'].addSeries('post_monsoon', vegetationIndex_inp['post_'+vegetationIndex_inp['ndvi_classes'][i]], {plot: "post-monsoon"});
                // vegetationIndex_inp['post_'+vegetationIndex_inp['ndvi_classes'][i]+'_chart'].title = getVegtClass(vegetationIndex_inp['ndvi_classes'][i])+": Post-monsoon ("+vegetationIndex_inp['year'][0]+"-"+vegetationIndex_inp['year'][vegetationIndex_inp['year'].length-1]+")"
                // vegetationIndex_inp['post_'+vegetationIndex_inp['ndvi_classes'][i]+'_chart'].titleFont = "bold 14px Arial"
                // vegetationIndex_inp['post_'+vegetationIndex_inp['ndvi_classes'][i]+'_chart'].titlePos = "top"
                // vegetationIndex_inp['post_'+vegetationIndex_inp['ndvi_classes'][i]+'_chart'].render();
                // vegetationIndex_inp['post_'+vegetationIndex_inp['ndvi_classes'][i]+'_chart'].resize(350,250);
              }
              dojo.query('#vegetationIndices_chart').style('display', 'none');
              /*ndwi_seasonal_url query*/
              window.surfacewaterIndex_inp = {};
              rep_queryIndices.where = "state like" +" "+"\'"+ akahstate +"\'"  + " " + "AND" + " " + "district like" +" "+"\'"+ akahdistrict +"\'"+ " " + "AND" + " " + "block like" + " " + "\'" + akahblock + "\'"+ " " + "AND" + " " + "village like" + " " + "\'" + akahvillage + "\'";
              rep_queryIndices.outFields = ["*"]
              window.seasonal_ndwiReport = new QueryTask(ndwi_seasonal_trendUrl).execute(rep_queryIndices, function(rep_ndwiTrend_response){
                  window.rep_ndwiTrend_response = rep_ndwiTrend_response;
                  surfacewaterIndex_inp['ndwi_classes'] = ['aggregate_percent']
                  surfacewaterIndex_inp['trend_current_year'] = (new Date().getFullYear());
                  surfacewaterIndex_inp['trend_init_year'] = (new Date().getFullYear())-5;
                  rep_ndwiTrend_response.features.forEach(function(ft){
                    /*condition to generate inputs for only 5-year vegetation index trend till current year.*/
                    if (ft.attributes.year >= surfacewaterIndex_inp['trend_init_year'] && ft.attributes.year < surfacewaterIndex_inp['trend_current_year']) {
                        // variables declared for pre and post monsoon ndvi charts in village level.
                        if (surfacewaterIndex_inp['pre_aggregate_percent'] === undefined) {
                          surfacewaterIndex_inp['pre_aggregate_percent'] = [];
                        }
                        if (surfacewaterIndex_inp['post_aggregate_percent'] === undefined) {
                          surfacewaterIndex_inp['post_aggregate_percent'] = [];
                        }
                        if (surfacewaterIndex_inp['year'] === undefined) {
                          surfacewaterIndex_inp['year'] = [];
                        }
                        /*array to store years of ndvi inputs*/
                        surfacewaterIndex_inp['year'].push(Number(ft.attributes['year']))
                        /*ft.attributes['season'] contains trailing spaces after 'Pre' so used trim()*/
                        if (ft.attributes['season'].trim() === 'Pre') {
                          surfacewaterIndex_inp['pre_aggregate_percent'].push({y: Number(ft.attributes['aggregate_percent']), fill:"#00e21f"})
                        }
                        /*ft.attributes['season'] contains trailing spaces after 'Post' so used trim()*/
                        else if (ft.attributes['season'].trim() === 'Post') {
                          surfacewaterIndex_inp['post_aggregate_percent'].push({y: Number(ft.attributes['aggregate_percent']), fill:"#0077bb"})
                        }
                    }
                  });
                  /*remove the repetitive values from year array.*/
                  surfacewaterIndex_inp['year'] = surfacewaterIndex_inp['year'].filter( function( item, index, inputArray ) {
                                                    return inputArray.indexOf(item) == index;
                                                  });
                  /*x-axes input array for vegetation charts*/
                  surfacewaterIndex_inp['year_inputForChart'] = [];
                  for(i=0;i<=surfacewaterIndex_inp['year'].length-1;i++){
                      surfacewaterIndex_inp['year_inputForChart'].push({
                        text: surfacewaterIndex_inp['year'][i],
                        value: i+1
                      });
                  }
                  dojo.query('#waterIndices_chart').style('display', 'block')
                  domAttr.set('water_pre_chart', 'innerHTML', '')
                  domAttr.set('water_post_chart', 'innerHTML', '')
                  for(i=0;i<=surfacewaterIndex_inp['ndwi_classes'].length-1;i++){
                    /*create div's dynamically for all the post and pre charts*/
                    surfacewaterIndex_inp['pre_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_div'] = dojo.create("div", {id: "water_pre_"+surfacewaterIndex_inp['ndwi_classes'][i]+"Chart"});
                    surfacewaterIndex_inp['post_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_div'] = dojo.create("div", {id: "water_post_"+surfacewaterIndex_inp['ndwi_classes'][i]+"Chart"});
                    surfacewaterIndex_inp['pre_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_div'].className = "vegt_chartsResize";
                    surfacewaterIndex_inp['post_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_div'].className = "vegt_chartsResize";
                    
                    // if (i === 0){
                      dojo.place(surfacewaterIndex_inp['pre_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_div'], "water_pre_chart", "first");
                      // dojo.place(surfacewaterIndex_inp['post_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_div'], "water_post_chart", "first");
                    // }
                    // else{
                    //   var prev_className = surfacewaterIndex_inp['ndwi_classes'][i-1]
                    //   dojo.place(surfacewaterIndex_inp['pre_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_div'], surfacewaterIndex_inp['pre_'+prev_className.slice(0,-3)+'_div'], "after");
                    //   dojo.place(surfacewaterIndex_inp['post_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_div'], surfacewaterIndex_inp['post_'+prev_className.slice(0,-3)+'_div'], "after");
                    // }
                    /*lulc pre-monsoon chart definition*/
                    // window.surfacewaterIndex_inp['pre_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_chart'] = new dojox.charting.Chart2D(surfacewaterIndex_inp['pre_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_div']);
                    // surfacewaterIndex_inp['pre_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_chart'].addPlot('pre-monsoon', {type: "Columns",markers: true,gap:5,maxBarSize: 60, tension: "2",animate: { duration: 2000, easing: dojo.fx.easing.bounceInOut }});
                    // surfacewaterIndex_inp['pre_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_chart'].addAxis("x", {title:"Year",dropLabels: false,titleOrientation: "away", labelSizeChange: true, majorTicks:true, majorTickStep:1, minorTicks:false, font: "normal normal bold 12px Arial", fontColor: "black",
                    //   labels: surfacewaterIndex_inp['year_inputForChart']});
                    // surfacewaterIndex_inp['pre_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_chart'].addAxis("y", {title:"Area(%)",fixLower: "major",fixUpper: "major", vertical: true});
                    // /*lulc post-monsoon inputs*/
                    // surfacewaterIndex_inp['pre_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_chart'].addSeries('pre_monsoon', surfacewaterIndex_inp['pre_'+surfacewaterIndex_inp['ndwi_classes'][i]], {plot: "pre-monsoon"});
                    // surfacewaterIndex_inp['pre_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_chart'].title = "Surface water: Pre-monsoon ("+surfacewaterIndex_inp['year'][0]+"-"+surfacewaterIndex_inp['year'][surfacewaterIndex_inp['year'].length-1]+")"
                    // surfacewaterIndex_inp['pre_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_chart'].titleFont = "bold 14px Arial"
                    // surfacewaterIndex_inp['pre_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_chart'].titlePos = "top"
                    // surfacewaterIndex_inp['pre_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_chart'].render();
                    // surfacewaterIndex_inp['pre_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_chart'].resize(350,250);


                    // stacked column chart for ndwi starts here
                    window.surfacewaterIndex_inp['pre_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_chart'] = new dojox.charting.Chart2D(surfacewaterIndex_inp['pre_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_div']);
                    surfacewaterIndex_inp['pre_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_chart'].addPlot('stackedColumnsPlot', {type: StackedColumns,markers: true,gap:5,lines: true,areas: true,markers: true,labels: true,labelStyle:"outside",tension: "2"});
                    surfacewaterIndex_inp['pre_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_chart'].addAxis("x",  {  dropLabels: false,labelSizeChange: true,majorTicks:true,majorTickStep:1,minorTicks:false,titleOrientation:"away",
                      labels: surfacewaterIndex_inp['year_inputForChart'],title:"Year" });
                      surfacewaterIndex_inp['pre_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_chart'].addAxis("y", {title:"Area(%)",fixLower: "major",fixUpper: "major", vertical: true});
                    /*lulc post-monsoon inputs*/
                    // if(surfacewaterIndex_inp['ndwi_classes'][i].includes("dense")){
                    // surfacewaterIndex_inp['pre_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_chart'].addSeries('Pre', surfacewaterIndex_inp['pre_'+surfacewaterIndex_inp['ndwi_classes'][i]], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF" ,},fill: "#A3A334"});
                    // surfacewaterIndex_inp['pre_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_chart'].addSeries('Post', surfacewaterIndex_inp['post_'+surfacewaterIndex_inp['ndwi_classes'][i]], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF"},fill: "#007E11"});
                    // }
                    // else if(surfacewaterIndex_inp['ndwi_classes'][i].includes("sparse")){
                    // surfacewaterIndex_inp['pre_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_chart'].addSeries('Pre', surfacewaterIndex_inp['pre_'+surfacewaterIndex_inp['ndwi_classes'][i]], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF" ,},fill: "#A3A334"});
                    // surfacewaterIndex_inp['pre_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_chart'].addSeries('Post', surfacewaterIndex_inp['post_'+surfacewaterIndex_inp['ndwi_classes'][i]], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF"},fill: "#00AA17"});
                    // }
                    // else if(surfacewaterIndex_inp['ndwi_classes'][i].includes("low")){
                    // surfacewaterIndex_inp['pre_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_chart'].addSeries('Pre', surfacewaterIndex_inp['pre_'+surfacewaterIndex_inp['ndwi_classes'][i]], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF" ,},fill: "#A3A334"});
                    // surfacewaterIndex_inp['pre_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_chart'].addSeries('Post', surfacewaterIndex_inp['post_'+surfacewaterIndex_inp['ndwi_classes'][i]], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF"},fill: "#00E21F"});
                    // }
                    surfacewaterIndex_inp['pre_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_chart'].addSeries('Pre', surfacewaterIndex_inp['pre_'+surfacewaterIndex_inp['ndwi_classes'][i]], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF" ,},fill: "#00e21f"});
                    surfacewaterIndex_inp['pre_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_chart'].addSeries('Post', surfacewaterIndex_inp['post_'+surfacewaterIndex_inp['ndwi_classes'][i]], {plot: "stackedColumnsPlot",stroke: {color: "#FFFFFF"},fill: "#0077bb"});
                    surfacewaterIndex_inp['pre_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_chart'].title = "Surface Water ("+surfacewaterIndex_inp['year'][0]+"-"+surfacewaterIndex_inp['year'][surfacewaterIndex_inp['year'].length-1]+")"
                    surfacewaterIndex_inp['pre_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_chart'].titleFont = "bold 14px Arial"
                    surfacewaterIndex_inp['pre_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_chart'].titlePos = "top"
                    surfacewaterIndex_inp['pre_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_chart'].render();
                    surfacewaterIndex_inp['pre_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_chart'].resize(400,270);
                    //stacked column chart ends here

                    /*lulc post-monsoon chart definition*/
                    // window.surfacewaterIndex_inp['post_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_chart'] = new dojox.charting.Chart2D(surfacewaterIndex_inp['post_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_div']);
                    // surfacewaterIndex_inp['post_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_chart'].addPlot('post-monsoon', {type: "Columns",markers: true,gap:5,maxBarSize: 60, tension: "2",animate: { duration: 2000, easing: dojo.fx.easing.bounceInOut }});
                    // surfacewaterIndex_inp['post_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_chart'].addAxis("x", {title:"Year", dropLabels: false,titleOrientation: "away", labelSizeChange: true, majorTicks:true, majorTickStep:1, minorTicks:false, font: "normal normal bold 12px Arial", fontColor: "black",
                    //   labels: surfacewaterIndex_inp['year_inputForChart']});
                    // surfacewaterIndex_inp['post_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_chart'].addAxis("y", {title:"Area(%)",fixLower: "major",fixUpper: "major", vertical: true});
                    // surfacewaterIndex_inp['post_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_chart'].addSeries('post_monsoon', surfacewaterIndex_inp['post_'+surfacewaterIndex_inp['ndwi_classes'][i]], {plot: "post-monsoon"});
                    // surfacewaterIndex_inp['post_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_chart'].title = "Surface water: Post-monsoon ("+surfacewaterIndex_inp['year'][0]+"-"+surfacewaterIndex_inp['year'][surfacewaterIndex_inp['year'].length-1]+")"
                    // surfacewaterIndex_inp['post_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_chart'].titleFont = "bold 14px Arial"
                    // surfacewaterIndex_inp['post_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_chart'].titlePos = "top"
                    // surfacewaterIndex_inp['post_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_chart'].render();
                    // surfacewaterIndex_inp['post_'+surfacewaterIndex_inp['ndwi_classes'][i]+'_chart'].resize(350,250);
                  }
                  dojo.query('#waterIndices_chart').style('display', 'none');
                  //ndwi data analysis chart
                  surfWater_PreArray=[];window.surfWater_PreArray=surfWater_PreArray;surfWater_PostArray=[];window.surfWater_PostArray=surfWater_PostArray;
                  window.swa_inc_year = "";window.swa_dec_year = "";
                  surfWater_Array = rep_ndwiTrend_response.features.filter(a => {if(a.attributes.year == 2016 || a.attributes.year == 2017 || a.attributes.year == 2018 ||a.attributes.year == 2019){return a;}})
                  // window.surfWater_Array=surfWater_Array;
                  surfWater_Array.forEach((elem,index) => {
                    if(elem.attributes.season.includes("Pre")){ 
                      surfWater_PreArray.push(elem.attributes.avg_water_area_sw)
                      // if(elem.attributes.avg_water_area_sw > Math.max.apply(null,surfWater_PreArray)){swa_inc_year = elem.attributes.year}
                    }
                    else if(elem.attributes.season.includes("Post")) surfWater_PostArray.push(elem.attributes.avg_water_area_sw)
                  })
                  //ndvi data analysis chart
                  ndvi_PreArray=[];window.ndvi_PreArray=ndvi_PreArray;ndvi_PostArray=[];window.ndvi_PostArray=ndvi_PostArray;ndvi_PreArray_abs=[];window.ndvi_PreArray_abs=ndvi_PreArray_abs;ndvi_PostArray_abs=[];window.ndvi_PostArray_abs=ndvi_PostArray_abs;
                  ndvi_Array = rep_ndviTrend_response.features.filter(a => {if(a.attributes.year == 2016 || a.attributes.year == 2017 || a.attributes.year == 2018 ||a.attributes.year == 2019){return a;}})
                  window.ndvi_Array=ndvi_Array;
                  ndvi_Array.forEach(elem => {
                    if(elem.attributes.season.includes("Pre")){
                       ndvi_PreArray_abs.push(((elem.attributes.dense_agg_percent*3)/6)+ ((elem.attributes.sparse_agg_percent*2)/6) + ((elem.attributes.low_agg_percent*1)/6)) 
                       ndvi_PreArray.push(elem.attributes.dense_agg_percent+ elem.attributes.sparse_agg_percent + elem.attributes.low_agg_percent) 
                      }
                    else if(elem.attributes.season.includes("Post")){
                       ndvi_PostArray_abs.push(((elem.attributes.dense_agg_percent*3)/6)+ ((elem.attributes.sparse_agg_percent*2)/6) + ((elem.attributes.low_agg_percent*1)/6))
                       ndvi_PostArray.push(elem.attributes.dense_agg_percent + elem.attributes.sparse_agg_percent + elem.attributes.low_agg_percent)
                    }
                  })
              })
              var rep_queryCGWL = new Query();
              rep_queryCGWL.where = "state like" +" "+"\'"+ akahstate +"\'"  + " " + "AND" + " " + "district like" +" "+"\'"+ akahdistrict +"\'"+ " " + "AND" + " " + "block like" + " " + "\'" + akahblock + "\'"+ " " + "AND" + " " + "village like" + " " + "\'" + akahvillage + "\'";
              rep_queryCGWL.outFields = ["*"]
              window.rep_queryCGWL=rep_queryCGWL;
              window.cgwl_spatialReport = new QueryTask(cgwl_spatial_layer).execute(rep_queryCGWL, function(rep_cgwl_response){
                  window.rep_cgwl_response= rep_cgwl_response;  
                  //ndwi data analysis chart
                  cgwl_PreArray=[];window.cgwl_PreArray=cgwl_PreArray;cgwl_PostArray=[];window.cgwl_PostArray=cgwl_PostArray;
                  cgwl_Array = rep_cgwl_response.features.filter(a => {if(a.attributes.year == 2016 || a.attributes.year == 2017 || a.attributes.year == 2018 ||a.attributes.year == 2019 ){return a;}})
                  window.cgwl_Array=cgwl_Array;
                  cgwl_Array.forEach(elem => {
                    if(elem.attributes.season == "Pre") if(elem.attributes.water_level != 0) cgwl_PreArray.push(-elem.attributes.water_level); else cgwl_PreArray.push(elem.attributes.water_level)
                    else if(elem.attributes.season == "Post") if(elem.attributes.water_level != 0) cgwl_PostArray.push(-elem.attributes.water_level); else cgwl_PostArray.push(elem.attributes.water_level)
                  })
              })




            })
          })
         
      })
    },

    month_function(ind_mon){
      var month = '';
      switch(ind_mon){
        case 1 : month = 'Jan';break;
        case 2 : month = 'Feb';break;
        case 3 : month = 'Mar';break;
        case 4 : month = 'Apr';break;
        case 5 : month = 'May';break;
        case 6 : month = 'Jun';break;
        case 7 : month = 'Jul';break;
        case 8 : month = 'Aug';break;
        case 9 : month = 'Sep';break;
        case 10 : month = 'Oct';break;
        case 11 : month = 'Nov';break;
        case 12 : month = 'Dec';break;
        case "default" : month = 'select month';break;
      }
      return month
    },

    generateMultiPlotChart: function(gl1,gl2,gl3,gl4,gl5,gl6){
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
            title: "Water Level (mbgl)",
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
        myChart.addSeries('test1',preMonsoonDataArr, {plot: "default", stroke: {color:"#ffa500", width:2}});
        myChart.addSeries('pre_trendline',reg_line_pre, {plot: "trendline_plot", stroke: {color:"#40a9cb", width:2}});
        // myChart.addSeries('post_trendline',reg_line_post, {plot: "trendline_plot", stroke: {color:"#684a1a", width:2}});
        /*myChart.addSeries('test1',[{x:"2014",y:605.25},{x:"2015",y:592.06},{x:"2016",y:714.71}, {x:"2017",y:686.51}, {x:"2018",y:438.01}, {x:"2019",y:826.43}, {x:"2020",y:862.41}])*//*preMonsoonSeries*/
        // myChart.addSeries('test2',postMonsoonDataArr);
        /*myChart.addSeries('test2',[{x:2014,y:3},{x:2015,y:1},{x:2016,y:3},{x:2017,y:3}])*//*preMonsoonSeries*/
        myChart.addSeries('test3',rainfallDataArr, {plot: "other", stroke: {color:"#9ea26b", width:3}, marker: "m-3,0 c0,-4 6,-4 6,0 m-6,0 c0,4 6,4 6,0" });
        // myChart.addSeries('test3',rainfallDataArr/*[{x:"2014",y:5},{x:"2015",y:9},{x:"2016",y:11},{x:"2017",y:4},{x:"2018",y:9},{x:"2019",y:11},{x:"2020",y:4}]*/, {plot: "other", stroke: {color:"black", width:0}, shadow: {dx:0 , dy: 0}});/*rainfallSeries*/
        myChart.render();
        myChart.resize(600,230);
        /*style.css code
          #column_lineChart rect{
              fill: transparent !important;
              stroke: none !important;
          }
        */
        // var legend='<div style="display: block;text-align: center;" id="rf_wl_legend"> <div style="display:inline-flex;"> <div style="width:17px;height:16px;border:1.6px solid white;background-color:#55aafa;border-radius: 4px;"></div> <span style="padding-left:5px;">Pre-monsoon WL CGWB</span></div> <div style="display:inline-flex;padding-left:10px;"> <div style="width:17px;height:16px;border:1.6px solid white;background-color: #ad7b2a;border-radius: 4px;"></div> <span style="padding-left:5px;">Post-monsoon WL CGWB</span></div> <div style="display:inline-flex;padding-left:10px;"> <div style="width:17px;height:16px;border:1.6px solid white;background-color:#008cba;border-radius: 4px;"></div> <span style="padding-left:5px;">Annual Rainfall</span></div> </div>'+
        // '<div style="display: block;text-align: center;" id="rf_wl1_legend"> <div style="display:inline-flex;"> <div style="width:17px;height:16px;border:1.6px solid white;background-color:#254868;border-radius: 4px;"></div> <span style="padding-left:5px;">Pre-monsoon WL Trend Line</span></div> <div style="display:inline-flex;padding-left:10px;"> <div style="width:17px;height:16px;border:1.6px solid white;background-color: #684a1a;border-radius: 4px;"></div> <span style="padding-left:5px;">Post-monsoon WL Trend Line</span></div> </div>';
        var legend='<div style="display: inline-flex;justify-content:center;" id="rf_wl_legend"> <div style="display:inline-flex;font-size: 11px;"> <div style="width: 12px;height: 11px;border:1.6px solid white;background-color: #ffa500;border-radius: 4px;"></div> <span style="padding-left:5px;">Pre-monsoon WL CGWB</span></div> <div style="display:inline-flex;padding-left:10px;font-size: 11px;"> <div style="width: 12px;height: 11px;border:1.6px solid white;background-color: #008cba;border-radius: 4px;"></div> <span style="padding-left:5px;">Pre-monsoon WL Trend Line</span></div> <div style="display:inline-flex;padding-left:10px;font-size: 11px;"> <div style="width: 12px;height: 11px;border:1.6px solid white;background-color: #9ea26b;border-radius: 4px;"></div> <span style="padding-left:5px;">Annual Rainfall</span></div> </div>';
        // '<div style="display: block;text-align: center;" id="rf_wl1_legend"> </div>';

        var temp = '<div style="display:inline-grid;margin-bottom: 10px;"><p style="font-size:15px;font-weight: 600;">(a)Pre-monsoon Trend </p>'+
        '<div style="display: inline-grid;padding-left: 20px;"><span style="padding-left:5px;"><b>Rate of rise/fall (5-year Trend - 2015-19):</b>'+change_text_pre+'</span><span style="padding-left:5px;"><b>Fluctuation in actual water level 2018-19:</b> '+change_text_pre_fluc+'</span></div>'+
        '<div style="padding-left:0px">'+dojo.query('#wl_rainfall_chart').innerHTML()+'</div>'+legend+"</div>";

        dojo.query('#wl_rainfall_chart').style('display','none')
        return temp;
    },

    generateMultiPlotChart1: function(gl1,gl2,gl3,gl4,gl5,gl6){
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
            title: "Water Level (mbgl)",
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
        myChart.addSeries('post_trendline',reg_line_post, {plot: "trendline_plot", stroke: {color:"#008cba", width:2}});
        /*myChart.addSeries('test1',[{x:"2014",y:605.25},{x:"2015",y:592.06},{x:"2016",y:714.71}, {x:"2017",y:686.51}, {x:"2018",y:438.01}, {x:"2019",y:826.43}, {x:"2020",y:862.41}])*//*preMonsoonSeries*/
        myChart.addSeries('test2',postMonsoonDataArr, {plot: "default", stroke: {color:"#ffa500", width:2}});
        /*myChart.addSeries('test2',[{x:2014,y:3},{x:2015,y:1},{x:2016,y:3},{x:2017,y:3}])*//*preMonsoonSeries*/
        myChart.addSeries('test3',rainfallDataArr, {plot: "other", stroke: {color:"#9ea26b", width:3}, marker: "m-3,0 c0,-4 6,-4 6,0 m-6,0 c0,4 6,4 6,0" });
        // myChart.addSeries('test3',rainfallDataArr/*[{x:"2014",y:5},{x:"2015",y:9},{x:"2016",y:11},{x:"2017",y:4},{x:"2018",y:9},{x:"2019",y:11},{x:"2020",y:4}]*/, {plot: "other", stroke: {color:"black", width:0}, shadow: {dx:0 , dy: 0}});/*rainfallSeries*/
        myChart.render();
        myChart.resize(600,230);
        /*style.css code
          #column_lineChart rect{
              fill: transparent !important;
              stroke: none !important;
          }
        */
        // var legend='<div style="display: block;text-align: center;" id="rf_wl_legend"> <div style="display:inline-flex;"> <div style="width:17px;height:16px;border:1.6px solid white;background-color:#55aafa;border-radius: 4px;"></div> <span style="padding-left:5px;">Pre-monsoon WL CGWB</span></div> <div style="display:inline-flex;padding-left:10px;"> <div style="width:17px;height:16px;border:1.6px solid white;background-color: #ad7b2a;border-radius: 4px;"></div> <span style="padding-left:5px;">Post-monsoon WL CGWB</span></div> <div style="display:inline-flex;padding-left:10px;"> <div style="width:17px;height:16px;border:1.6px solid white;background-color:#008cba;border-radius: 4px;"></div> <span style="padding-left:5px;">Annual Rainfall</span></div> </div>'+
        // '<div style="display: block;text-align: center;" id="rf_wl1_legend"> <div style="display:inline-flex;"> <div style="width:17px;height:16px;border:1.6px solid white;background-color:#254868;border-radius: 4px;"></div> <span style="padding-left:5px;">Pre-monsoon WL Trend Line</span></div> <div style="display:inline-flex;padding-left:10px;"> <div style="width:17px;height:16px;border:1.6px solid white;background-color: #684a1a;border-radius: 4px;"></div> <span style="padding-left:5px;">Post-monsoon WL Trend Line</span></div> </div>';

        var legend='<div style="display: inline-flex;justify-content:center;" id="rf_wl_legend"> <div style="display:inline-flex;font-size: 11px;"> <div style="width: 12px;height: 11px;border:1.6px solid white;background-color: #ffa500;border-radius: 4px;"></div> <span style="padding-left:5px;">Post-monsoon WL CGWB</span></div> <div style="display:inline-flex;padding-left:10px;font-size: 11px;"> <div style="width: 12px;height: 11px;border:1.6px solid white;background-color: #008cba;border-radius: 4px;"></div> <span style="padding-left:5px;">Post-monsoon WL Trend Line</span></div> <div style="display:inline-flex;padding-left:10px;font-size: 11px;"> <div style="width: 12px;height: 11px;border:1.6px solid white;background-color: #9ea26b;border-radius: 4px;"></div> <span style="padding-left:5px;">Annual Rainfall</span></div> </div>';
        // '<div style="display: block;text-align: center;" id="rf_wl1_legend"> </div>';

        var temp = '<div style="display:inline-grid;margin-bottom: 10px;"><p style="font-size:15px;font-weight: 600;">(b)Post-monsoon Trend</p>'+
        '<div style="display: inline-grid;padding-left: 20px;"><span style="padding-left:5px;"><b>Rate of rise/fall (5-year Trend - 2015-19):</b>'+change_text_post+'</span><span style="padding-left: 5px;"><b>Fluctuation in actual water level 2018-19</b>: '+change_text_post_fluc+'</span></div>'+
        '<div style="padding-left:0px">'+dojo.query('#wl_rainfall_chart').innerHTML()+'</div>'+legend+"</div>";

        dojo.query('#wl_rainfall_chart').style('display','none')
        return temp;
    },

    initPrintTemplate: function(){
       /*block level main_map defining template at once*/
       var template_BlockMap=new PrintTemplate();
       // temple.layout='A4 Portrait';
       template_BlockMap.layout='blockmap_layout';
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
       window.template_BlockMap = template_BlockMap;
       //print parameters for template
       var blockMapParams = new PrintParameters();
       blockMapParams.map = akah_Tool.map;
       blockMapParams.template = template_BlockMap;
       window.blockMapParams=blockMapParams;
       //print task
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
      map_extent['block_geometry'] = {};

      // /to get state extent/
      window.get_stateExtent = new QueryTask(akah_states_layer.url).execute(query_extents, function(queryState){
          map_extent['state'] = new Extent(queryState.features[0].geometry.getExtent())
      })
      // /to get district extent/
      query_extents.where = "state like" +" "+"\'"+ akahstate +"\'"  + " " + "AND" + " " + "district like" +" "+"\'"+ akahdistrict +"\'" ;
      query_extents.outFields = ['district']
      window.get_distExtent = new QueryTask(district_keymap_layer.url).execute(query_extents, function(queryDist){
          window.districtHighlightSymbol = new SimpleFillSymbol(
            SimpleFillSymbol.STYLE_NULL,
            new SimpleLineSymbol(
              SimpleLineSymbol.STYLE_SOLID,
              new Color([215,0,0]), 2
            )
          );
          window.district_graphic = new Graphic(queryDist.features[0].geometry, districtHighlightSymbol);
          map_extent['district'] = new Extent(queryDist.features[0].geometry.getExtent())
      })
      // /to get block extent/
      query_extents.where = "state like" +" "+"\'"+ akahstate +"\'" + " " + "AND" + " " + "district like" +" "+"\'"+ akahdistrict +"\'"+"AND block like '"+akahblock+"'"
      query_extents.outFields = ['block']
      window.get_blockExtent = new QueryTask(block_keymap_layer.url).execute(query_extents, function(queryBlock){
          window.blockHighlightSymbol = new SimpleFillSymbol(
            SimpleFillSymbol.STYLE_NULL,
            new SimpleLineSymbol(
              SimpleLineSymbol.STYLE_SOLID,
              new Color([215,0,0]), 2
            )
          );
          window.block_graphic = new Graphic(queryBlock.features[0].geometry, blockHighlightSymbol);
          map_extent['block'] = new Extent(queryBlock.features[0].geometry.getExtent())
          map_extent['block_geometry'] = queryBlock.features[0].geometry;
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
          query_extents.geometry = map_extent['block_geometry'];//***here geometry should be given as input not the extent of block
          query_extents.outFields = ["Watershed"]
          window.watershedHighlightSymbol = new SimpleFillSymbol(
            SimpleFillSymbol.STYLE_NULL,
            new SimpleLineSymbol(
              SimpleLineSymbol.STYLE_SOLID,
              new Color([215,0,0]), 2
            )
          );

          window.get_watershedExtent = new QueryTask(akah_watershed.url).execute(query_extents, function(queryWatershed){
              map_extent['watershed_1'] = new esri.geometry.Polygon(queryWatershed.features[0].geometry.spatialReference);
              queryWatershed.features.forEach(function(f){
                map_extent['watershed_1'].addRing(f.geometry.rings[0]);
              });
              // console.log('watershed map extent before getting extent');
              // map_extent['watershed'].rings.forEach(function(ring,r_index){
              //   map_extent['watershed'+r_index] = new Graphic(ring, watershedHighlightSymbol);
              //   console.log(map_extent['watershed'+r_index]);
              // })
              map_extent['watershed'] = new Extent(map_extent['watershed_1'].getExtent());
                //trail
         
          akah_Tool.gotoStateExtent();

        //ends here
          });
      });
            // var promise_for_maps=executeAll([get_watershedExtent]);
            // promise_for_maps.then(output_for_maps);
    },

    gotoStateExtent: function(){

      debugger;
      i = deviation_rainfall_wd[deviation_rainfall_wd.length-2]
      gwl_oval = -(cgwl_PostArray[cgwl_PostArray.length-1])
      gwl_dev = -(cgwl_PostArray[cgwl_PostArray.length-1]) - (-cgwl_PostArray[cgwl_PostArray.length-2])
      swa_oval = Number(surfWater_PostArray[surfWater_PostArray.length-1])
      swa_dev = surfWater_PostArray[surfWater_PostArray.length-1] - surfWater_PostArray[surfWater_PostArray.length-2]

      ndvi_oval = Number(ndvi_PostArray[ndvi_PostArray.length-1])
      ndvi_dev = ndvi_PostArray_abs[ndvi_PostArray_abs.length-1] - ndvi_PostArray_abs[ndvi_PostArray_abs.length-2]

      window.rf_final = akah_Tool.gotoGetScore(Number(i),"","rainfall")
      window.gwl_final = akah_Tool.gotoGetScore(Number(gwl_dev),Number(gwl_oval),"gwl")
      window.swa_final = akah_Tool.gotoGetScore(Number(swa_dev),Number(swa_oval),"swa")
      window.ndvi_final = akah_Tool.gotoGetScore(Number(ndvi_dev),Number(ndvi_oval),"ndvi")
      window.weightedavgScoreAndClass= akah_Tool.getWeightedAverageClass((Number(rf_final.split(' ')[1])*0.25) + (Number(gwl_final.split(' ')[1])*0.25) + (Number(swa_final.split(' ')[1])*0.25) + (Number(ndvi_final.split(' ')[1])*0.25));
      var Inp = {rainfall :rf_final.split(' ')[0].toLowerCase(), gwl: gwl_final.split(' ')[0].toLowerCase(), swa: swa_final.split(' ')[0].toLowerCase(), ndvi:ndvi_final.split(' ')[0].toLowerCase()}
      var advisoryURL = "https://geomonitor.co.in/rainfallakah/rainfall/advisory/";
      // var advisoryURL = "http://localhost:3002/rainfall/advisory/";
      fetch(advisoryURL, {method: "POST",body:JSON.stringify(Inp)}).then(function(res){
          return res.json()
      }).then(function(res){
        window.advisoryResp = res;
        
        akah_villages_layer.setVisibility(false);
        akah_Tool.map._layers.Villages_Study_Area_684.setVisibility(false)
        //visibility disabled for all keymaps.
        akah_drain.setVisibility(true);
        sensors_location_url.setVisibility(false);
        // akah_Tool.map.getLayer(akah_Tool.map.graphicsLayerIds[37]).setVisibility(true)
        akah_selectedwells_layer.setVisibility(false)
        window.districtoutlineSymbol = new SimpleFillSymbol(
          SimpleFillSymbol.STYLE_NULL,
          new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_SOLID,
            new Color([0,0,0]), 1
          )
        );
  
        var renderer = new SimpleRenderer(districtoutlineSymbol);
        district_keymap_layer.setRenderer(renderer);
        district_keymap_layer.setDefinitionExpression("state like '"+akahstate+"'")
        district_keymap_layer.setVisibility(true);
        akah_Tool.map.graphics.add(district_graphic);
  
        akah_Tool.map.setExtent(map_extent['state']);
        template_BlockMap.layout = 'district_keymap';
        //print parameters
        var distr_keyMapParams = new PrintParameters();
        distr_keyMapParams.map = akah_Tool.map;
        distr_keyMapParams.template = template_BlockMap;
        window.distr_keyMapParams=distr_keyMapParams;
        //print task
        var districtPrintTask = new PrintTask(app.printUrl);
        window.districtPrintTask = districtPrintTask;
        window.printing_tool_exe_district_keymap = districtPrintTask.execute(distr_keyMapParams, function (evt){
            window.dist_keymap=evt.url;
            akah_Tool.gotoDistrictExtent();
        },akah_Tool.log_query_errors);




      });

    },

    gotoDistrictExtent: function(){
      block_keymap_layer.setDefinitionExpression("district like '"+akahdistrict+"'")
      district_keymap_layer.setVisibility(false);
      window.blockoutlineSymbol = new SimpleFillSymbol(
        SimpleFillSymbol.STYLE_NULL,
        new SimpleLineSymbol(
          SimpleLineSymbol.STYLE_SHORTDASH,
          new Color([0,0,0]), 0.5
        )
      );
      var renderer = new SimpleRenderer(blockoutlineSymbol);
      block_keymap_layer.setRenderer(renderer);
      // akah_Tool.map.getLayer(akah_Tool.map.graphicsLayerIds[37]).setVisibility(true);
      block_keymap_layer.setVisibility(true);

      akah_Tool.map.graphics.remove(district_graphic)
      akah_Tool.map.graphics.add(block_graphic);

      akah_Tool.map.setExtent(map_extent['district']);
      template_BlockMap.layout='block_keymap';
      //print parameters
      var block_keyMapParams = new PrintParameters();
      block_keyMapParams.map = akah_Tool.map;
      block_keyMapParams.template = template_BlockMap;
      window.block_keyMapParams=block_keyMapParams;
      //print task
      var blockPrintTask = new PrintTask(app.printUrl);
      window.blockPrintTask = blockPrintTask;

      window.printing_tool_exe_blockkeymap = blockPrintTask.execute(block_keyMapParams, function (evt){
          window.block_keymap = evt.url;
          akah_Tool.gotoBlockExtent();
      },akah_Tool.log_query_errors);
    },

    gotoBlockExtent: function(){
        akah_block_layer.setVisibility(true);
        district_keymap_layer.setVisibility(false);
        akah_villages_layer.setVisibility(false);
        akah_selectedwells_layer.setVisibility(true);
        //visibility enabled only for block main map, hydrogeology map, watershed main map, village main map.
        sensors_location_url.setVisibility(true);

        akah_Tool.map.graphics.remove(block_graphic)
        akah_Tool.map._layers.Villages_Study_Area_684.setVisibleLayers([0]);
        akah_Tool.map._layers.Villages_Study_Area_684.setVisibility(true)
        // akah_Tool.map.getLayer(akah_Tool.map.graphicsLayerIds[37]).setVisibility(true)
        gwm_station_layer.setDefinitionExpression("state like" +" "+"\'"+ akahstate +"\'"  + " " + "AND" + " " + "district like" +" "+"\'"+ akahdistrict +"\'"+ " " + "AND" + " " + "block like" + " " + "\'" + akahblock + "\'" + " AND may_2018 is not null AND may_2015 is not null AND may_2016 is not null AND may_2017 is not null AND nov_2015 is not null AND nov_2016 is not null AND nov_2017 is not null AND nov_2018 is not null AND nov_2019 is not null AND may_2019 is not null");
        gwm_station_layer.setVisibility(true)

        // highlightVillGraphic = new Graphic(akah_searchResponse.geometry, villHighlightSymbol);
        akah_Tool.map.graphics.add(highlightVillGraphic);

        akah_Tool.map.setExtent(map_extent['block']);
        setTimeout(function(){
          template_BlockMap.layout='blockmap_layout';
          //print parameters
          var block_mainMapParams = new PrintParameters();
          block_mainMapParams.map = akah_Tool.map;
          block_mainMapParams.template = template_BlockMap;
          window.block_mainMapParams=block_mainMapParams;
          //print task
          var mainBlock_PrintTask = new PrintTask(app.printUrl);
          window.mainBlock_PrintTask = mainBlock_PrintTask;
          akah_Tool.map._layers["Villages_Study_Area_684"].setLayerDefinitions(["Block like '"+akahblock+"'"])

          window.printing_tool_exe_blockmap = mainBlock_PrintTask.execute(block_mainMapParams, function (evt){
              window.printresvill=evt.url;
              gwm_station_layer.setVisibility(false)
              akah_selectedwells_layer.setVisibility(false);
              // akah_Tool.gotoVillageExtent();  as we are getting the village image url at the time of on change event of village, we'r not calling this method again.
              akah_Tool.gotoWatershedExtent();
          },akah_Tool.log_query_errors);
        },5000)
    },

    gotoWatershedExtent: function(){
      rainfallStations_layer.setVisibility(false);
      akah_Tool.map._layers.Villages_Study_Area_684.setVisibility(false)
      block_keymap_layer.setDefinitionExpression("district like '"+akahdistrict+"'")
      district_keymap_layer.setVisibility(false);
      // akah_watershed.setDefinitionExpression("district like '"+akahdistrict+"'");
      akah_watershed.setVisibility(true);
      akah_Tool.map.graphics.add(highlightVillGraphic);

      akah_Tool.map.setExtent(map_extent['watershed']);
      setTimeout(function(){
          template_BlockMap.layout='watershed_map';
          var watershedPrintTask = new PrintTask(app.printUrl);
          window.watershedPrintTask = watershedPrintTask;
          window.printing_tool_exe_w = watershedPrintTask.execute(blockMapParams, function (evt){
              //visibility disabled for all keymaps.
              sensors_location_url.setVisibility(false);

              window.watershedMap = evt.url;
              template_BlockMap.layout = 'block_keymap';
              var watershedPrintTask1 = new PrintTask(app.printUrl);
              window.printing_tool_exe_w1 = watershedPrintTask1.execute(blockMapParams, function (evt){
                window.watershedMap_1 = evt.url;
                akah_watershed.setVisibility(false);
                akah_Tool.gotoHydrogeologyExtent();
              },akah_Tool.log_query_errors);
          },akah_Tool.log_query_errors);
      },5000)
    },

 
    gotoHydrogeologyExtent: function(){
      // hydrogeology_layer.setDefinitionExpression("district like '"+akahdistrict+"'");
      hydrogeology_layer.setVisibility(true);
      akah_dist_layer.setVisibility(true);
      akah_dist_layer.setDefinitionExpression("district like '"+akahdistrict+"'")
      //visibility enabled only for block main map, hydrogeology map, watershed main map, village main map.
      sensors_location_url.setVisibility(true);
      akah_Tool.map.setExtent(map_extent['district']);
      // setTimeout(function(){ optional
          // template_BlockMap.layout='Layout_blockmap';
          template_BlockMap.layout = 'hydrogeology_map';
          var hydroPrintTask = new PrintTask(app.printUrl);
          window.hydroPrintTask = hydroPrintTask;
          window.printing_tool_exe_hg = hydroPrintTask.execute(blockMapParams, function (evt){
          window.hydrogeologyMap = evt.url;
          hydrogeology_layer.setVisibility(false);
            // akah_Tool.gotoAquiferExtent();
            akah_Tool.print_AKAHInventory_Report();
          },akah_Tool.log_query_errors);
      // },5000)
    },
    gotoAquiferExtent: function(){
      // hydrogeology_layer.setDefinitionExpression("district like '"+akahdistrict+"'");
      hydrogeology_layer.setVisibility(false);
       akah_aqui.setVisibility(true);
      //visibility enabled only for block main map, hydrogeology map, watershed main map, village main map.
      sensors_location_url.setVisibility(true);
      akah_Tool.map.setExtent(map_extent['district']);
      // setTimeout(function(){ optional
          // template_BlockMap.layout='Layout_blockmap';
          template_BlockMap.layout = 'hydrogeology_map';
          var quiPrintTask = new PrintTask(app.printUrl);
          window.quiPrintTask = quiPrintTask;
          window.printing_tool_exe_aqui = quiPrintTask.execute(blockMapParams, function (evt){
          window.aquiferMap = evt.url;
          akah_aqui.setVisibility(false);
            // akah_Tool.print_AKAHInventory_Report();
          },akah_Tool.log_query_errors);
      // },5000)
    },
    log_query_errors: function(err){
      alert("An error ocured while printing report!");
      console.log(err);
      document.getElementById('go_toVillage').disabled = false;
      dojo.query("#pr_go_load").style("display","none");
      dojo.query("#pr_load").style("display","none");
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
      var data, aoiText, printMap, tableText, rep_head;
      var preData = []; var pre_fields= []; var i=1;
      window.dataForReport = [];
      preData.length = 0;
      pre_fields.length = 0;
        // printMap = {
      //   addPageBreak: true,
      //   type: "map",
      //   map: akah_Tool.map
      //   // printTemplate: templates
      // };
      coverpage_logo = this.folderUrl + "/images/akah_logo.jpeg";
      coverpage_div = { type:"html", data:"<div style='text-align:center;'><img src="+coverpage_logo+" style='align:center;height:220px;width:220px;'><h1>Aga Khan Agency for Habitat</h1></div><div style='font-size:37px;'><h2 id='coverpage_id'>Water Governance <br>Report of <br>"+akahvillage+"</p></div><div style='display:flex;align-items: center;justify-content: center;margin-top: 8%;'><div class='coverpagehead'>"+akahstate+"</div><img src='"+rightarrow_img+"' style='height: 27px;' alt='rightarrow'><div class='coverpagehead'>"+akahdistrict+"</div><img src='"+rightarrow_img+"' style='height: 27px;' alt='rightarrow'><div class='coverpagehead'>"+akahblock+"</div><img src='"+rightarrow_img+"' style='height: 27px;' alt='rightarrow'><div class='coverpagehead'>"+akahvillage+"</div></div><div style='padding:2% 2%;justify-content: center;align-items: center;margin-top: 39%;border-radius: 0.9em;'><span style='font-size:10pt;font-weight: bold;margin-left: 21%;font-style: italic;'>Designed and Developed by Geo Climate Risk Solutions Pvt. Ltd.</span></div>",addPageBreak:true}
      rep_header_text='<div><div style="display: block;text-align: center;font-size: large;padding: 2px;background-color: #f9f8f8;border-radius: 10px 10px 0px 0px;margin: 0px 30px 0px 10px;margin-top: 5px;position: sticky;"> <span> <span style="font-weight: 600;">State: </span> <span style="color: #0473d4;">'+akahstate+'</span> </span>&nbsp;&nbsp; '+
      '<span> <span style="font-weight: 600;">District: </span> <span style="color: #0473d4;">'+akahdistrict+'</span> </span>&nbsp;&nbsp; <span> <span style="font-weight: 600;">Block: </span> <span style="color: #0473d4;">'+akahblock+'</span> </span>&nbsp;&nbsp;</div><div style="text-align: center;font-size: large;padding: 2px;background-color: #f9f8f8;border-radius: 0px 0px 10px 10px;position:sticky;margin: 0px 30px 0px 10px;"><span><span style="font-weight: 600;">Village: </span> <span style="color: #0473d4;">'+akahvillage+'</span> </span></div></div>';
      rep_head={
        title:"",
        type:"html",
        data:rep_header_text
      };

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
        "<br><div>" +
        "<input type='text' tabindex='0' style='width:100%;border:none;' value='" + akah_Tool._getDate() + "'" +
        "role='textbox' aria-label='" + akah_Tool._getDate() + "'>" +
        "</div>" +
        // "<input type='text' tabindex='0' style='width:100%;border:none;' value='" + this._getDate() + "'" +
        // "role='textbox' aria-label='" + this._getDate() + "'>" +
        // "</div>"+
        "</div>"
        // addPageBreak:true
      };

      dojo.query('#villageLULC').style('display', 'block');
      dojo.query('#blockLULC').style('display', 'block');
      dojo.query('#vegetationIndices_chart').style('display', 'block');
      dojo.query('#waterIndices_chart').style('display', 'block');
          var akahVillageResponse = akah_village_selectedwell_response.features[0];window.akahVillageResponse = akahVillageResponse;
          document.getElementsByClassName('bar_akah-inner')[0].dataset.percent = "100%"
          document.getElementsByClassName('bar_akah-inner')[0].style.width = "100%"
          introduction_text1 = {type:"html",data:
          '<div class="akah_level1_heading">1. About the region</div>'+
          "<div style='text-align: justify;font-size: 15px;margin-right: 30px;line-height: 1.6em;'>"+akahvillage+" village is located in "+akahblock+" block of "+akahdistrict+" district in "+akahstate+", India. </div>"+
          '<div class="akah_level1_heading">2. Outcomes</div>'+
          "<div style='text-align: justify;font-size: 15px;margin-right: 30px;line-height: 1.6em;'>With the increase in hydrologic variability in the recent past, assessment of water resources becomes an important pre-requisite condition for addressing socio-economic needs at large. Water resources assessment includes the process of measuring, collecting and analysing relevant parameters on the quantity and quality of water resources. This report serves the purpose of better development and governance of water resources at a village level using a variety of components such as rainfall distribution analysis, ground water level exploration, water budgeting, water quantity and quality assessment. The findings from water resource evaluation can help in adopting smart water governance practices to create a village that is water-sustainable.</div>"+
          '<div class="akah_level1_heading">3. Methodology</div>'+
          "<div style='text-align: justify;font-size: 15px;margin-right: 30px;line-height: 1.6em;'>The webGIS technology platform is utilized to generate Water Governance Report at village level. The report captures surface water and ground water resources for quality and quantity through data triangulation from primary  and secondary sources. The tool uses static and near real-time spatial and non-spatial data like geology, hydrology, hydrogeology, socio-economic, remote sensing and other sources as data input. The status on water availability, depth fluctuation and quality will develop the understanding of the need of the various available water conservation methods and the harmful effects of bad water quality on health & agriculture.</div>",
          addPageBreak:true
          }
          introduction_text2 = {
            type: "html",
            data:
            // '<br><div style="display:inline-flex;margin-top: 40px;"><div style="display:inline-grid;"><p class="mapHdngSizes">District Boundaries</p><img src="'+rv['district_keyMapUrl']+'" style="width: 85%;margin-top: 20px;margin-bottom: 30px;" alt="district_map"></div>'+
            // '<div style="display:inline-grid;"><p class="mapHdngSizes">Block Boundaries</p><img src="'+rv['block_keyMapUrl']+'" style="width: 85%;margin-top: 20px;margin-bottom: 30px;" alt="block_keymap"></div></div>'+
           
            '<div class="akah_level1_heading">4. Study Area</div>'+
            // '<div style="display:inline-flex;"><div><span style="padding-left: 25%;font-size: 18px;display:none;">District Boundaries</span><img src="'+dist_keymap_gj+'" style="width: 95%;" alt="district_map"></div>'+
            // '<div><span style="padding-left: 25%;font-size: 18px;display:none;">Block Boundaries</span><img src="'+block_keymap_gj+'" style="width: 95%;" alt="block_keymap"></div></div>'+
            // '<div style="text-align:center"><img src="'+printres+'" style="width: 90%;margin-bottom: 30px;" alt="block_map"></div>'+

            // '<div style="display:inline-flex;text-align:center"><div><span style="padding-left: 25%;font-size: 18px;display:none;">District Boundaries</span><img src="'+village_keymap_gj+'" style="width: 91%;" alt="district_map"></div>'+
            // '<div><span style="padding-left: 25%;font-size: 18px;display:none;">Block Boundaries</span><img src="'+watershed_keymap_gj+'" style="width: 91%;margin-bottom: 20px;" alt="block_keymap"></div></div>'
            // "<div style='text-align:center'>"+printMap.map+"</div>"
            '<div style="display:inline-flex;"><div><span style="text-align:center;font-weight:bold;font-size: 18px;display:block;padding-bottom: 10px;">'+akahdistrict+' District in '+akahstate+'</span><img src="'+dist_keymap+'" style="width: 350px;margin-left: 10px;" alt="district_map"></div>'+
            "<img src='"+rightarrow_img+"' style='height: 40px;margin-top: 120px;margin-left: 10px;' alt='rightarrow'>"+
            '<div style="margin-left:10px;"><span style="text-align:center;font-weight:bold;font-size: 18px;display:block;padding-bottom: 10px;">'+akahblock+' Block in '+akahdistrict+'</span><img src="'+block_keymap+'" style="width: 350px;padding-left:5px;" alt="block_keymap"></div></div>'+
            "<img src='"+rightarrow_img+"' style='height: 40px;transform: rotate(90deg);margin-top: 15px;margin-left:67%;' alt='rightarrow'>"+

            // '<div style="display:inline-flex;text-align:center"><div><span style="padding-left: 25%;font-size: 18px;display:none;">Village Boundaries</span><img src="'+villageMap_1+'" style="width: 85%;" alt="district_map"></div>'+
            '<div><span style="text-align:center;font-weight:bold;font-size: 18px;display:block;padding-bottom: 10px;">'+akahvillage+' Village in '+akahblock+'</span><img src="'+villageMap_1+'" style="width: 45%;padding-left: 29%;" alt="village_map"></div>'+
            '<div style="margin-top:20px;padding-left: 236px;"><span style="padding-left: 14%;font-weight:bold;font-size: 18px;">Wells in '+akahblock+' Block</span><img src="'+printresvill+'" style="width: 451px;" alt="block_map"></div>'+
            "<p style='color: #717070;margin-bottom: 5px;'>*Note: The drainage system follows a top-down approach where rivers of the first order are indicated by '1' and consequently the others follow up.</p>"+
            "<div style='color: #717070;margin-bottom: 5px;display:flex;'><div>*Note:</div><div style='width: 3%;height: 12px;border: 2px solid red;'></div><div style='padding-left: 1%;'>The boundary map is of the selected village.</div>",
           addPageBreak:true
            // '<div><span style="padding-left: 16%;font-weight:bold;font-size: 18px;display:block;">Watershed Boundaries</span><img src="'+watershedMap_1+'" style="width: 83%;margin-bottom: 20px;" alt="block_keymap"></div></div>'

            // '<div style="display:inline-flex;text-align:center"><img src="'+villageMap_1+'" style="width: 46%;padding-left: 11px;height: 282px;" alt="district_map">'+
            // '<div><span style="padding-left: 25%;font-size: 18px;display:none;">Watershed Boundaries</span><img src="'+watershedMap_1+'" style="width: 83%;margin-bottom: 20px;" alt="block_keymap"></div></div>'
          };
          block_profile_text = {
            type:"html",
            data:
            "<p class='akah_level1_heading'>5. Block Profile - "+akahblock+"</p>" +
            '<div class="akah_level1_content">'+
            "<p class='akah_level1_heading'>5.1. Salient Features</p>" +
              "<table class='akahReportTable1' style='margin-bottom: 5px;'>" +
              
              // "<tr><td colspan=3 class='th_head'>5.2. Socio-Economic profile</td><tr>"+
              "<tr style='font-weight:600;text-align:left'><td style='width: 5%;'>S.No.</td><td>Parameters</td><td>Actual Values</td></tr>"+
              // "<tr><td>1.</td><td class='ReportTable_subHdngs'>State</td><td style='width: 45%;'>"+akahVillageResponse.attributes.state +"</td></tr>" +
              // "<tr><td>2.</td><td class='ReportTable_subHdngs'>District</td><td>"+akahVillageResponse.attributes.district+"</td></tr>" +
              // "<tr><td>3.</td><td class='ReportTable_subHdngs'>Block</td><td>"+akahVillageResponse.attributes.block+"</td></tr>" +
              "<tr><td>1.</td><td class='ReportTable_subHdngs' style='width: 40%;'>Block area (ha)</td><td>"+rv["block_area_abs"].toFixed(2)+"</td></tr>" +
              "<tr><td>2.</td><td class='ReportTable_subHdngs'>Block population</td><td>"+rep_val3+"</td></tr>" +
              // "<tr><td>6.</td><td class='ReportTable_subHdngs'>Male population</td><td>"+rv["block_male_pop"]+"</td></tr>" +
              // "<tr><td>7.</td><td class='ReportTable_subHdngs'>Female population</td><td>"+rv["block_female_pop"]+"</td></tr>" +
              "<tr><td>3.</td><td class='ReportTable_subHdngs'>Sex ratio (F:M)</td><td>"+rv["block_fm_ratio"]+"</td></tr>" +
              "<tr><td>4.</td><td class='ReportTable_subHdngs'>Total no. of villages</td><td>"+rv['Total_villages_in_block']+"</td></tr>" +
              "</table>"+'<div style="color: #717070;margin-bottom: 5px;">*Source: Census data 2011</div>'+
              // "<div style='color: #717070;margin-bottom: 5px;display:flex;'><div>*Note:</div><div style='width: 3%;height: 12px;border: 2px solid red;'></div><div style='padding-left: 1%;'>The boundary map is of the selected village.</div></div>"+
              // "<tr><td>5.</td><td class='ReportTable_subHdngs'>Largest village</td><td>"+rv['Largest_village']+"</td></tr>" +
              // "<tr><td>6.</td><td class='ReportTable_subHdngs'>Smallest village</td><td>"+rv['Smallest_village']+"</td></tr>" +
              // "<tr><td>9.</td><td class='ReportTable_subHdngs'>Livestock population</td><td>"+''+"</td></tr>" +
              // "<tr><td colspan=3 class='th_head'>C. Field Data Collection</td><tr>"+
              // "<tr><td>1.</td><td class='ReportTable_subHdngs'>AKAH survey wells</td><td>"+rv['block_wr_count']+"</td></tr>" +
              // "<tr><td>2.</td><td class='ReportTable_subHdngs'>AKAH long term observation wells</td><td>"+rep_val2+"</td></tr>" +
              '<div class="akah_level1_heading">5.2. Physiographic Conditions</div>'+
              '<div class="akah_level1_heading">5.2.1 Surface Hydrology</div>'+
              "<div style='text-align: justify;font-size: 15px;margin-right: 30px;line-height: 1.6em;'>It is the movement and distribution of water on the land surface. Watershed, rainfall distribution and pattern and surface water resources make up this component.</div>"+
            '</div>'
            // addPageBreak:true
          };
          watershed_text  = {
            type:"html",
            data: 
            '<div class="akah_level1_content">'+
            '<div class="akah_level1_heading">5.2.1.1 Watershed</div>'+
            "<table class='akahReportTable1' style='margin: 1% 0% 1% 0%;'>" +
            // "<tr><td colspan=3 class='th_head'>5.2.1.1. Watershed</td><tr>"+
          //  '<div><span style="padding-left: 16%;font-weight:bold;font-size: 18px;display:block;">Watershed Boundaries</span><img src="'+watershedMap_1+'" style="width: 83%;margin-bottom: 20px;" alt="block_keymap"></div></div>'+
           '<div class="akah_level2_content">'+
           // '<div style="text-align:center"><img src="'+watershedMap_gj+'" style="width: 87%;" alt="watershedmap"></div>'+
           '<div style="text-align:center"><img src="'+watershedMap+'" style="width: 90%;" alt="watershedmap"></div>'+

           '</div>'+
           // "<tr><td>1.</td><td class='ReportTable_subHdngs'>CGWB Observation wells</td><td>"+34+"</td></tr>" +
            "<tr><td>1.</td><td class='ReportTable_subHdngs' style='width: 40%;'>River basin</td><td>"+rv['block_ws_basin']+"</td></tr>" +
            "<tr><td>2.</td><td class='ReportTable_subHdngs'>Sub-basin</td><td>"+rv['block_ws_sub_basin']+"</td></tr>" +
            // "<tr><td>3.</td><td class='ReportTable_subHdngs'>Watershed ID</td><td>"+rep_val6+"</td></tr>" +
            "<tr><td>4.</td><td class='ReportTable_subHdngs'>Watershed area (ha)</td><td>"+rv['block_ws_area'].toFixed(2)+"</td></tr>" +
            "</table>"+'<div style="color: #717070;">*Source: India-WRIS</div>'+
            "<div style='color: #717070;margin-bottom: 5px;padding-top:5px;'>*Note: The drainage system follows a top-down approach where rivers of the first order are indicated by '1' and consequently the others follow up.</div>"+
            "<h3>Concluding Statement: </h3><ul style='font-size: 14px;margin-right: 30px;line-height: 1.5em;'><li>The block falls under "+rv['block_ws_basin']+" river basin and "+rv['block_ws_sub_basin']+" sub-basin which covering a total watershed area of "+rv['block_ws_area'].toFixed(2)+" ha</li></ul>"+
            "<p class='akah_level1_heading'>5.2.1.2. Rainfall Distribution and Pattern (2011 to 2020) - "+akahdistrict+"</p>"+
            rep_rainfall_chart+deviation_table+'<p style="padding: 0px;color: #717070;margin: 1px 0px 0px 55px;">*Source: India Meterological Department</br>*Normal rainfall is a long term average of 30 to 50 years. </p>'+
            '</div>'+
            "<h3>Concluding Statement: </h3><ul style='font-size: 14px;margin-right: 30px;line-height: 1.5em;'><li>According to the long-term rainfall distribution and pattern from 2011 to 2020, the block has a declining tendency from 2011 to 2018 and an increasing trend in 2019-2020.</li></ul>"+
            // "<table class='akahReportTable1' style='margin-bottom: 5px;'>" +
  
            "<p class='akah_level1_heading'>5.2.1.3. Surface Water Resources</p>"+
            "<table class='akahReportTable1' style='margin-bottom:5px;'>"+
            // "<tr><td colspan=3 class='th_head'>5.2.1.3. Surface water resources</td><tr>"+
            // "<tr><td style='width: 6%;'>1.</td><td class='ReportTable_subHdngs' style='width: 40%;'>Total Water Available(in ha meter)</td><td>"+wsprv['block_tot_wtr_available']+"</td></tr>" +
            // "<tr><td>2.</td><td class='ReportTable_subHdngs'>Total Groundwater(in ha meter)</td><td>"+wsprv['block_total_gnd_water']+"</td></tr>" +
            // "<tr><td>3.</td><td class='ReportTable_subHdngs'>Total Surface water(in ha meter)</td><td>"+wsprv['block_surface_wtr_avail']+"</td></tr>" +
            // "<tr><td style='width: 6%;'>1.</td><td class='ReportTable_subHdngs' style='width: 40%;'>Surface water bodies area (in ha)<br>(like farm ponds, tanks, etc)</td><td>"+rv["surface_water_bodies_count_block"].toFixed(2)+"</td></tr>" +
            "<tr><td style='width: 5%;'>1.</td><td class='ReportTable_subHdngs' style='width: 41%;'>Total Surface Water bodies</td><td>"+wsprv['surf_wtr_response_wsp'].features.length/*rv["surface_water_bodies_volume"]*/+"</td></tr>" +
            "<tr><td>2.</td><td class='ReportTable_subHdngs'>Estimated storage capacity (ha m)</td><td>"+wsprv['block_storage_capacity_org']/*rv["surface_water_bodies_volume"]*/+"</td></tr>" +
            "<tr><td>3.</td><td class='ReportTable_subHdngs'>Surface water available to use in 2020 (ha m)</td><td>"+wsprv['block_surface_wtr_avail']/*rv["storage_water_available_block"]*/+"</td></tr>" +
            "</table>"+
            '<div style="display:inline-flex">'+
            '<div style="line-height:1.5em;"><span style="font-size: 13px;color: #717070;padding-right: 26px;margin:0px;">*Assumptions based on CGWB field reports: </span><span style="font-size: 12px;padding-right: 26px;color: #717070;margin:0px;">'+
            //modified as per instructions given ....
            // '<br>*No. of fillings = 3 (2 in monsoon + 1 in non-monsoon)'+
            // '<br>*Surface water available to use (ha m) = (Estimated storage capacity x No. of fillings in a year) - Evapotranspiration losses'+
            '<br>*Surface water available to use (ha m) = Estimated storage capacity - Evapotranspiration losses'+
            '<br>*Evapotranspiration losses (ha m) = Estimated storage capacity x (Potential evapotranspiration/Actual rainfall)<br>*Block level Potential Evapotranspiration and Actual Rainfall taken from India-WRIS data'+
            '<br>*Surface Water Bodies Source: Automatic Water Extension Index(AWEI) of Sentinel-2 Satellite Images'+
            '</span></div>'+
            '</div>'+
               "<h3>Concluding Statement: </h3><ul style='font-size: 14px;margin-right: 30px;line-height: 1.5em;'><li>The block consists of "+wsprv['surf_wtr_response_wsp'].features.length+" surface water bodies with an estimated storage capacity of "+wsprv['block_storage_capacity_org']+" ha m. </li><li>The total surface water available for use in 2020 was "+wsprv['block_surface_wtr_avail']+" ha m.</li></ul>",
          addPageBreak:true
          };
         
          geology_watershed_text = {
            type: "html",
            data:
            '<div class="akah_level1_heading">5.2.2. Hydrogeology - '+akahdistrict+'</div>'+
            // '<div><div style="text-align: center;margin-top: 20px;margin-bottom: 200px;">'+'<img src="'+farm_pond_cross_section+'" style="width:450px" alt="farm_pond_cross_section">'+'<div style="text-align:center;font-weight:600;margin-top: 10px;">Figure: Farm pond cross section</div></div>'+
            // '<table class="akahReportTable1" style="width: 93.5%;margin: 10px 0px 10px 0px;"><tbody><tr colspan="3"><td class="th_head">5.2.2. Hydrogeology - '+akahdistrict+'</td></tr></tbody></table>'+
            // '<p class="akah_level2_heading">3.5. District Level Hydrogeology map - '+akahdistrict+'</p>'+
            '<div class="akah_level2_content">'+
            "<div style='text-align: justify;font-size: 15px;margin-right: 30px;line-height: 1.6em;margin-left:40px;'></div>"+
              // info_statement+
              '<div><p style="text-align: justify;font-size: 14px;margin-right: 30px;line-height: 1.5em;">It is movement and distribution of water on the underground surface. Ground water resources make up this component.'+
              '<div style="text-align:center"><img src="'+hydrogeologyMap+'" style="width: 87%;" alt="hydroGeomap"></div>'+

              "<p style='color: #717070;margin-bottom: 5px;'>*Note: The drainage system follows a top-down approach where rivers of the first order are indicated by '1' and consequently the others follow up.</p>"+
              "<div style='color: #717070;margin-bottom: 5px;display:flex;'><div>*Note:</div><div style='width: 3%;height: 12px;border: 2px solid red;'></div><div style='padding-left: 1%;'>The boundary map is of the selected village.</div></div>"+


              "<h3>Concluding Statement: </h3><ul style='font-size: 14px;margin-right: 30px;line-height: 1.5em;'><li>The hydrogeology of the district is characterised under hard rock aquifer, soft rock aquifer and hilly area. </li><li>Ground water occurs under unconfined to semi confined formations of Godavari, Shivana, Purna river basins. </li><li>Basalt (hard rock) and Alluvium (soft rock) are the main formations constituting principal aquifers in the district. </li><li>Two aquifer systems in basalt and one in alluvium (consisting of clay, silt, sand and gravel), are discovered to predominate, with basalt accounting for the bulk. The aquifer units found in each of the formation are given below :</li>"+

              // "<p style='font-size: 18px;font-weight: 600;'>5.2.2.1. Ground Water Overview</p>"+
            '</div>'+
            // "<table style='width:98%;border-collapse:collapse;border:1px solid grey;' id='hydroGeology_styles'><tr><td><b>S.No</b></td><td></td><td colspan='2' style='padding-left: 18%;'><b>Basalt</b></td><td style='padding-left: 6%;'><b>Alluvium</b></td></tr><tr><td>1</td><td><b>Components</b></td><td>Aquifer I</td><td>Aquifer II</td><td>Aquifer I</td></tr><tr><td>2</td><td><b>Formation</b></td><td>Weathered/Fractured Basalt</td><td>Joined/Fractured Basalt</td><td>Alluvium-sand / silt & clay admixture</td></tr><tr><td>3</td><td><b>Depth Range(Depth to the water table)</b></td><td>up to 30 mbgl</td><td>up to 178 mbgl</td><td>tp to 28 mbgl</td></tr><tr><td>4</td><td><b>Water Levels</b></td><td>0.3 to 27.1 mbgl</td><td>0.8 to 70 mbgl</td><td>8 to 20 mbgl</td></tr><tr><td>5</td><td><b>Yield (Water Production Capacity)</b></td><td>1 to 3%</td><td>1 to 3%</td><td>5 to 18%</td></tr><tr><td>6</td><td><b>Rainfall Infiltration (Water on the ground surface enters the soil)</b></td><td>4 to 10% of the normal rainfall</td><td>10 to 15% of normal rainfall</td><td>10 to 25% normal rainfall</td></tr></table>"+
              //interpolation map
            '<div class="akah_level1_heading">5.2.2.1. Ground Water Overview</div>'+
              "<table class='akahReportTable1' style='width: 93.5%;margin: 10px 0px 10px 0px;'>"+
              "<tr><td style='width:5%;'>1.</td><td class='ReportTable_subHdngs' style='width: 41%;'>Principle aquifer</td><td>"+rep_val5+"</td></tr>" +
              "<tr><td>2.</td><td class='ReportTable_subHdngs'>Minor aquifer</td><td>"+rep_val5_1+"</td></tr>" +
              //"<tr><td>7.</td><td class='ReportTable_subHdngs'>Average annual rainfall in the district (mm)</td><td>"+876.60+"</td></tr>" +
              "<tr><td>3.</td><td class='ReportTable_subHdngs'>2019 Pre-monsoon water levels (CGWB)</td><td>"+rep_val7+"</td></tr>" +
              "<tr><td>4.</td><td class='ReportTable_subHdngs'>2019 Post-monsoon water levels (CGWB)</td><td>"+rep_val8+"</td></tr>" +
              "<tr><td>5.</td><td class='ReportTable_subHdngs'>CGWB Water Quality status</td><td>"+rep_val4+"</td></tr>" +
              "</table>"+'<div style="color: #717070;margin-bottom: 5px;">*Source: Water Quality Status is computed based on drinking water quality standards by Bureau of Indian Standards.</div>',
           
            //  '<table class="akahReportTable1" style="width: 93.5%;margin: 10px 0px 10px 0px;"><tbody><tr colspan="3"><td class="th_head">3.6. Block Level Watershed - '+akahblock+'</td></tr></tbody></table>'+
            // '<p class="akah_level2_heading">3.6. Block Level Watershed map - '+akahblock+'</p>'+
              // "<h3>Concluding Statement: </h3><p></p>"+

            // '<div class="akah_level2_content">'+
            //   '<div style="text-align:center"><img src="'+watershedMap+'" style="width: 87%;" alt="watershedmap"></div>'+
            // '</div>'+
            // '<table class="akahReportTable1" style="width: 93.5%;margin: 10px 0px 10px 0px;"><tbody><tr colspan="3"><td class="th_head">3.7. Aquifer map</td></tr></tbody></table>'+
            // // '<p class="akah_level2_heading">3.6. Block Level Watershed map - '+akahblock+'</p>'+
            // '<div class="akah_level2_content">'+
            //   '<div style="text-align:center"><img src="'+aquiferMap+'" style="width: 87%;" alt="aquifermap"></div>'+
            // '</div>',
            addPageBreak:true
          };
         
          if(rep_vil1>0){
            observation_wells_text = {
            type: "html",
            data:
            '<div class="akah_level1_heading">5.2.2.2. Ground Water Level Trend and Rainfall</div>'+
            // '<table class="akahReportTable1" style="width: 93.5%;margin: 10px 0px 10px 0px;"><tbody><tr colspan="3"><td class="th_head">5.2.2.2. Groundwater Level Trend and Rainfall</td></tr></tbody></table>'+
            '<p class="akah_level2_hdng">Locations of CGWB observation wells are shown in the ("Wells in '+akahblock+' Block Map")</p>'+
            // '<p class="akah_level2_heading">3.7. Groundwater Observation wells (CGWB)</p>'+
            '<div class="akah_level2_content" style="padding-left:60px;">'+
              res1+
            '</div>',
            // "<h3>Concluding Statement: </h3><ul style='font-size: 14px;margin-right: 30px;line-height: 1.5em;'><li>According to the long-term GWL distribution and pattern, the block has the most negative impact of GWL in 2018.</li><li>Pre-monsoon : During the pre-monsoon period, the rate of rise (5-year Trend - 2015-19) is 2.72 m and the fluctuation in actual water level 2018-19 is rising by 3.35 m. </li><li>Post-monsoon : During the post-monsoon period, the rate of rise (5-year Trend - 2015-19) is 3.98 m and the fluctuation in actual water level 2018-19 is rising by 3.20 m.</li></ul>",
            // //sources of irrigation starts here
            // '<table class="akahReportTable1" style="width: 93.5%;margin: 10px 0px 10px 0px;"><tbody><tr colspan="3"><td class="th_head">3.8. Sources Of Irrigation</td></tr></tbody></table>'+
            // // '<p class="akah_level2_heading">3.8. Sources Of Irrigation</p>'+
            // '<div class="akah_level2_content">'+
            //     // "<div style='display:flex'><div style='flex:1;text-align:center'>"+rep_sown_piechart+"</div><div style='flex:1;text-align:center'>"+
            //     // rep_irrig_piechart+"</div></div>"+
            //     "<div style='display:inline-flex;width:100%'>"+
            //     "<div style='display:inline-flex;width:100%;'>"+
            //     // "<div style='flex:2;padding-top: 100px;'>"+
            //     // "<table class='akahReportTable1' style='margin-bottom: 10px;'>" +
            //     // "<tr><td colspan=3 class='th_head'>D. Irrigated Area</td><tr>"+
            //     // "<tr><td>1.</td><td class='ReportTable_subHdngs'>Net Sown area (in ha)</td><td>"+(rv["block_areairr_canals"]+rv["block_areairr_wells"])+"</td></tr>" +
            //     // //"<tr><td>2.</td><td class='ReportTable_subHdngs'>Total Irrigated Area (in ha) </td><td>"+(rv["block_areairr_canals"]+rv["block_areairr_wells"])+"</td></tr>" +
            //     // "<tr><td>2.</td><td class='ReportTable_subHdngs'>Area Irrigated by Surface Water (in ha)</td><td>"+rv["block_areairr_canals"]+"</td></tr>" +
            //     // "<tr><td>3.</td><td class='ReportTable_subHdngs'>Area Irrigated by Ground Water (in ha)</td><td>"+rv["block_areairr_wells"]+"</td></tr>" +
            //     // "</table>"+
            //     // "</div>"+

            //     "<div>"+
            //     rep_irrig_piechart+
            //     "</div>"+
            //     "<div style='padding-top: 195px;'>"+

            //     '<div style="display:inline-flex;"><div style="width:17px;height:16px;border:1.6px solid white;background-color: #008000;border-radius: 4px;"></div><span style="padding-left:5px;">Area Irrigated by Surface Water</span></div>'+
            //     '<div style="display:inline-flex;padding-top:10px;"><div style="width:17px;height:16px;border:1.6px solid white;background-color: #8fbc8f;border-radius: 4px;"></div><span style="padding-left:5px;">Area Irrigated by Ground Water</span></div>'+

            //     "</div>"+
            //     "</div></div>"+"<p class='ReportTable_subHdngs' style='font-size: larger;padding-left: 60px;margin-top: 20px;margin-bottom: 0px;'>Net Sown area (in ha) = "+rv['net_sown_area_block'].toFixed(2)+"</p>"+
            //     "<p class='ReportTable_subHdngs' style='font-size: larger;padding-left: 60px;margin-top: 6px;'>Total Unirrgated Land area (in ha) = "+rv["unirrigated_land_block"]+"</p>"+
            //     '<p style="color: #717070;padding: 0px;margin: 1px 0px 0px 55px;">*Sources: Block-level Irrigation Data taken from Census 2011</p>'+
            //     '</div>'+
            // '</div>',
            //sources of irrigation ends here
            addPageBreak: true
          };}
          else{
            observation_wells_text = {
          type: "html",
          data:''
            }
          }

          gnd_water_text = {
            type: "html",
            data:
            // "<table class='akahReportTable1' style='margin-bottom: 10px;'>" +
            // "<tr><td colspan=3 class='th_head'>D. Surface Water Scenario</td><tr>"+
            //
            // "</table>"+

            // '<span>'+
            // '<span style="font-weight: 600;">*Source:</span>'+'<span style="padding-left: 12px;margin-top: 12px;"><b>1. </b> AKAH Observation Wells Data</span>'+
            // '<span style="padding-left: 21px;"> <b>2. </b>Census 2011</span>'+'<span style="padding-left: 21px;"><b>3.</b> Central Ground Water Board <p></p></span>'+'</span>'+
            '<table class="akahReportTable1" style="width: 93.5%;margin: 10px 0px 10px 0px;"><tbody><tr colspan="3">'+
            // "<td class="th_head">3.9. Groundwater Resources</td></tr></tbody></table>'+
            // "<p class='akah_level2_heading'>3.9. Groundwater Resources</p>" +
            '<div class="akah_level2_content">'+
              // "<p style='font-size: 18px;font-weight: 600;'>3.9.1. Annual Rainfall Graph (2011 to 2020)</p>"+
              // rep_rainfall_chart+deviation_table+'<p style="padding: 0px;color: #717070;margin: 1px 0px 0px 55px;">**Normal rainfall is a long period average of 30 years to 50 years rainfall.</p>'+
              "<p class='akah_level1_heading'>5.2.2.3. Estimated Ground Water Resources (Baseline Year - 2017)</p>"+
              '<div>'+rep_bar_chart+'</div>'+'<p style="font-size: 13px;padding-left: 120px;font-weight: 600;margin: 4px;">CGWB Categorization of Ground Water Resources (Block-level): Semi-critical </p>'+
              // '<p style="color: #717070;padding: 0px;margin: 1px 0px 0px 55px;text-align: center;">*Source: CGWB Groundwater Resources Report (2017)</p>'+

              '<div style="display:flex;align-items:center;width:100%;padding-left:9%;"><div style="flex:3;font-size:12px;"><p style="color:#717070;">*Net GW Availability = (Recharge from rainfall in monsoon &amp; non-monsoon + Recharge from other sources in monsoon &amp; non-monsoon) – Losses through natural discharges</p>'+
              '<p style="color:#717070;">*Future GW Availability = Net GW availibility - total extraction for domestic &amp; Irrigations demand.</p><p style="color: #717070;">*Source: CGWB Ground water Resources Report (2017)</p>'+'</div>'+
              '<div style="flex:6;">'+'<img src="'+gw_3dimage+'" style="width: 82%;" alt="gw_3dimage">'+'</div></div>'+
            '</div>'+
            "<p class='akah_level1_heading'>5.2.2.4. Projected Ground Water Resources (Year - 2025)</p>"+
            "<div style='padding-left:10%;display:flex;'><div>"+dom.byId('gwr_graph2_module').innerHTML+"</div>"+
            "<div>"+
            '<table style="margin-left: -175px;margin-top:100px;"><tr>'+
            '<td><div style="display:inline-flex;"><div style="width:18px;height:16px;border:1.6px solid white;background-color: green;border-radius: 4px;"></div><span style="padding-left:5px;">Net GW Availability ('+Number(akahRainfallResponse.attributes[`net_gw_availability_future`].toFixed(2))+' ha m)</span></div></td>'+
            '<tr><td style="text-align: left;"><div style="display:inline-flex;"><div style="width:17px;height:16px;border:1.6px solid white;background-color:blue;border-radius: 4px;"></div><span style="padding-left:5px;">Future Draft ('+Number(akahRainfallResponse.attributes[`gw_allocation_domestic_2025`].toFixed(2))+' ha m)</span></div></td></tr>'+
            '</table>'+
            "</div></div>",
            addPageBreak:true
          };
          lulcBlockLevel = {type:"html",data:
          '<div class="akah_level1_heading">5.2.3. Land Use Land Cover (LULC)</div>'+
          // '<table class="akahReportTable1" style="width: 93%;margin-left: 29px;"><tbody><tr colspan="3"><td class="th_head">3.10. Land Use Land Cover </td></tr></tbody></table>'+
          // "<div style='margin-top: 70px;'><p class='akah_level2_heading'>3.10. Land Use Land Cover </p></div>"+
          '<div class="akah_level2_content">'+
            // '<div style="padding-left:2%;font-size: larger;background-color: #f9f8f8;margin: 0px 60px 0px 30px;padding: 8px;border-radius: 10px;text-align: center;"><span class="ReportTable_subHdngs"> State: &nbsp;</span><span style="color: #0473d4;">'+akahstate+'</span>&nbsp;&nbsp;<span class="ReportTable_subHdngs"> District: &nbsp;</span><span style="color: #0473d4;">'+akahdistrict+'</span>&nbsp;&nbsp;<span class="ReportTable_subHdngs"> Block: &nbsp;</span><span style="color: #0473d4;">'+akahblock+'</span>&nbsp;&nbsp;</div>'+
            "<div style='display:grid !important;padding-left: 60px;'>"+dom.byId('blockLULC').innerHTML+"</div>"+
          '</div>',addPageBreak:true
        }
         lulcBlockLevel_table= {type:"html",data:
         "<div>"+block_level_lulcTable+"</div>"+
         '<div style="color: #717070;padding-left: 22px;">*Source: Sentinel-2 satellite imageries.</div>'+
         "<h3>Concluding Statement: </h3><ul style='font-size: 14px;margin-right: 30px;line-height: 1.5em;'><li>Agricultural land takes up the most space in the village both during pre-monsoon and post-monsoon seasons.</li><li> Grassland, water bodies, built-up and barren land are some of the other important land uses in the region.</li></ul>"
         }
          village_profile_text = {
            type: "html",
            data:
            //+baselinannual_checklist.data+futureScenario_checklist.data+
            "<p class='akah_level1_heading'>6. Village Profile - "+akahvillage+"</p>" +
            '<div style="text-align:center"><img src="'+villageMap+'" style="width: 77%;" alt="village map"></div>'+
            "<div style='color: #717070;margin-bottom: 5px;display:flex;'><div>*Note:</div><div style='width: 3%;height: 12px;border: 2px solid red;'></div><div style='padding-left: 1%;'>The boundary map is of the selected village.</div></div>"+

            "<p class='akah_level1_heading'>6.1. Salient Features</p>" +
            '<div class="akah_level1_content">'+
              "<table class='akahReportTable1'>" +
              // "<tr><td colspan=5 class='th_head'>4.1. Socio-Economic profile</td><tr>"+
              "<tr><td>1.</td><td class='ReportTable_subHdngs'>Village</td><td colspan=3 style='width: 50%;'>"+akahvillage+"</td></tr>" +
              "<tr><td rowspan=2>2.</td><td rowspan=2 class='ReportTable_subHdngs'>Village area (ha)</td><td class='th_head_temp' style='width: 20%;'>Actual Value</td><td colspan=2 class='th_head_temp'>Block Proportion (%)</td></tr>"+
              "<tr><td>"+rep_vil7_1+"</td><td colspan=2>"+Number(Number(rep_vil7_1)/rv['block_area_abs']*100).toFixed(2)+"  % of Block area</td></tr>" +
              "<tr><td>3.</td><td class='ReportTable_subHdngs'>Village population</td><td>"+rep_vil3+"</td><td colspan=2>"+Number(Number(rep_vil3)/rv['block_area_abs']*100).toFixed(2)+"  % of Block population</td></tr>" +
              // "<tr><td>4.</td><td class='ReportTable_subHdngs'>Male population</td><td>"+rv['village_population_male']+"</td></tr>" +
              // "<tr><td>5.</td><td class='ReportTable_subHdngs'>Female population</td><td>"+rv["village_population_female"]+"</td></tr>" +
              "<tr><td>4.</td><td class='ReportTable_subHdngs'>Sex ratio (F:M)</td><td colspan=3>"+rep_vil4+"</td></tr>" +
              "</table>"+'<div style="color: #717070;margin-bottom: 5px;">*Source: Census data 2011</div>'+
              "<p class='akah_level1_heading' atyle='padding-top:4%;'>6.2. Agricultural Conditions</p>" +
                rep_village_irrig_piechart+
              "<table class='akahReportTable1'>" +
              // "<tr><td>7.</td><td class='ReportTable_subHdngs'>Livestock population</td><td>"+''+"</td></tr>" +
              "<tr><td class='th_head_temp'>S.No.</td><td class='th_head_temp'>Components</td><td class='th_head_temp'>Actual Value</td><td class='th_head_temp'>Village Proportion (%)</td><td class='th_head_temp'>Block Proportion (%)</td></tr>"+
              "<tr><td>1.</td><td class='ReportTable_subHdngs'>Net Sown area (ha)</td><td>"+/*994.90*/Number(rv['village_areairr_gw']+rv['village_areairr_sw']).toFixed(2)+"</td><td>"+
              Number(Number(/*994.90*/(rv['village_areairr_gw']+rv['village_areairr_sw'])/Number(rep_vil7_1))*100).toFixed(2)+"</td><td>"+
              Number(Number(/*994.90*/(rv['village_areairr_gw']+rv['village_areairr_sw'])/rv['block_area_abs'])*100).toFixed(2)+"</td></tr>" +
              // "<tr><td>2.</td><td class='ReportTable_subHdngs'>Total Irrigated Area (in ha)</td><td>"+(rv['village_areairr_gw']+rv['village_areairr_sw'])+"</td></tr>" +

              "<tr><td>2.</td><td class='ReportTable_subHdngs'>Total Unirrigated Land area (ha)</td><td>"+rv['village_area_unirr']+"</td><td>"+
              Number((rv['village_area_unirr']/Number(rep_vil7_1))*100).toFixed(2)+"</td><td>"+
              Number((rv['village_area_unirr']/rv['block_area_abs'])*100).toFixed(2)+"</td></tr>" +


              "<tr><td>3.</td><td class='ReportTable_subHdngs'>Area Irrigated by wells (ha)</td><td>"+(rv['village_areairr_gw']===''?'No data':rv['village_areairr_gw'])+"</td><td>"+
              Number((rv['village_areairr_gw']/Number(rep_vil7_1))*100).toFixed(2)+"</td><td>"+
              Number((rv['village_areairr_gw']/rv['block_area_abs'])*100).toFixed(2)+"</td></tr>" +
              "<tr><td>4.</td><td class='ReportTable_subHdngs' style='width:50%;'>Area Irrigated by canals/surface water bodies (ha)</td><td>"+rv['village_areairr_sw']+"</td><td>"+
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
              //"<tr><td class='ReportTable_subHdngs'>Pre-monsoon water levels <sup>1</sup></td><td>"+rep_vil9+"</td></tr>" +
              //"<tr><td class='ReportTable_subHdngs'>Post-monsoon water levels <sup>1</sup></td><td>"+rep_vil10+"</td></tr>" +
              // "<tr><td class='ReportTable_subHdngs'>Aquifer <sup>3</sup></td><td>"+rep_vil11+"</td></tr>" +
              // "<tr><td class='ReportTable_subHdngs'>Watershed <sup>3</sup></td><td>"+rep_vil12+"</td></tr>" +
              "</table>"+'<p style="color: #717070;padding: 0px;margin: 19px 0px 0px 0px;">*Source: Census data 2011</p>'+
           
              '</div>',
            // '<span>'+
            // '<span style="font-weight: 600;">*Source:</span>'+'<span style="padding-left: 12px;margin-top: 12px;"><b>1. </b> AKAH Observation Wells Data</span>'+
            // '<span style="padding-left: 21px;"> <b>2. </b>Census 2011</span>'+'<span style="padding-left: 21px;"><b>3.</b> Central Ground Water Board <p></p></span>'+'</span>'+
            addPageBreak:true
          };
          
         if(rep_rfMonthlyChart !=undefined){
           if(rep_rfMonthlyChart !=""){
              rf_data = { type: "html",
              data: "<div style='padding-top: 20px;'><p class='akah_level1_heading'>4.4.4. Rainfall monthly data (2008-2020)</p></div>"+
              '<div class="akah_level2_content">'+
              rep_rfMonthlyChart+
                  '<div style="color:#717070;display:inline-flex;"><div> <span><b style="font-size:13px;color: #717070;">*Formula for Trendline&nbsp;</b><br><br> is given by: <span style="font-size:13px">Y = mx + c</span></span><br> <span style="font-size:13px">c (intercept) = (∑y ∑x<sup>2</sup> -  ∑x ∑xy) / (n (∑x<sup>2</sup>) – (∑x)<sup>2</sup>) </span><br> <span style="font-size:13px">m (slope) = (n ∑xy  -  (∑x)  (∑y)) / (n (∑x<sup>2</sup>) – (∑x)<sup>2</sup>)</span><br> <span>Where,</span><br> <span>X and y are two variables on the regression line.</span><br> <span>M = slope of the line,</span><br> <span>C = y- intercept of the line,</span><br> <span>X = Values of dates,</span><br> <span>Y = values of Predicted Groundwater Levels.</span><br> </div> <div style="padding-left:90px"> <span><b style="font-size:13px;color: #717070;">*Formula for Deviation</b></span><br><br> <span style="font-size:13px;">Deviation = √(∑_(i=1)^N (Predicted<sub>(i)</sub> - Actual<sub>(i)</sub>)<sup>2</sup>/N)</span> </div> </div><br><br>'+
              '</div>'
           }
         }
        }
         else{
          rf_data = { type: "html",
          data: "<div style='padding-left: 60px;'><p class='akah_level1_heading'>4.4.4. Rainfall monthly data</p></div>"+
          "<p class='akah_level2_heading' style='padding-left: 60px;'>Note: Rainfall data not available for the selected village</p>"
          }
         }
        
         document.getElementById("rfYearlyChartModule").style.display = "block"
         if(rep_rfYearlyChart != ""){
          path = "widgets//Agakhan//images//Rainfall.png";
          var compare;
          if(rfYArray[rfYArray.length-1] > annDec/13){compare = "more";}else{compare = "less";}
              rf_yearly_data = { type: "html",
              data: 
              "<p class='akah_level1_heading'>6.3 Physiographic Conditions</p>"+
              "<div><p class='akah_level1_heading'>6.3.1. Rainfall</p></div>"+
              '<div style="padding-left:2%;font-size: larger;background-color: #f9f8f8;margin: 0px 30px 0px 30px;padding: 8px;border-radius: 10px;text-align: center;"><span class="ReportTable_subHdngs"> State: &nbsp;</span><span style="color: #0473d4;">'+akahstate+'</span>&nbsp;&nbsp;'+
              '<span class="ReportTable_subHdngs"> District: &nbsp;</span><span style="color: #0473d4;">'+akahdistrict+'</span>&nbsp;&nbsp;<span class="ReportTable_subHdngs"> Block: &nbsp;</span><span style="color: #0473d4;">'+akahblock+'</span>&nbsp;&nbsp;'+
              '<span class="ReportTable_subHdngs"> Village: &nbsp;</span><span style="color: #0473d4;">'+akahvillage+'</span>&nbsp;&nbsp;</div>'+
              // "<div><ul></ul><li>Average annual Rainfall 2020 : "+(rfYArray[rfYArray.length-1]).toFixed(2)+" mm</li><li> Average Rainfall of 2008-2020 : "+(annDec/13).toFixed(2)+" mm</li><div>"+
              "<div>"+rep_rfYearlyChart+"</div><div style='background-color: #00833f;font-family: Arial;color:#ffffff;padding-top:5px;padding-bottom:5px;font-size:16px;width: 805px;line-height: 1.6em;'><ul><li>The above represented rainfall data is for the rainfall gridded station which is near to the selected village.</li>"+
              "<li>Concluding Statement: The Average Annual Rainfall (2020) in the area is "+(rfYArray[rfYArray.length-1]).toFixed(2)+" mm which is "+compare+" than the Decadal Rainfall ("+(annDec/13).toFixed(2)+" mm) of 2008-2020. </li></ul><div>"+
              "</div></div><p style='color: #717070;padding: 0px;margin: 19px 0px 0px 0px;'>*Source: India Metrological Department</p>",
             
              addPageBreak:true
              }
         }
         else{
              rf_yearly_data = { type: "html",
              data: "<p class='akah_level1_heading'>6.3 Physiographic Conditions</p>"+
              "<div><p class='akah_level1_heading'>6.3.1. Rainfall</p></div>"+
              '<div style="padding-left:2%;font-size: larger;background-color: #f9f8f8;margin: 0px 30px 0px 30px;padding: 8px;border-radius: 10px;text-align: center;"><span class="ReportTable_subHdngs"> State: &nbsp;</span><span style="color: #0473d4;">'+akahstate+'</span>&nbsp;&nbsp;'+
              '<span class="ReportTable_subHdngs"> District: &nbsp;</span><span style="color: #0473d4;">'+akahdistrict+'</span>&nbsp;&nbsp;<span class="ReportTable_subHdngs"> Block: &nbsp;</span><span style="color: #0473d4;">'+akahblock+'</span>&nbsp;&nbsp;'+
              '<span class="ReportTable_subHdngs"> Village: &nbsp;</span><span style="color: #0473d4;">'+akahvillage+'</span>&nbsp;&nbsp;</div>'+
              "<p class='akah_level2_heading' style='padding-left: 60px;'>Note: Rainfall data not available for the selected village</p>",
              addPageBreak:true
              }
          }
          // modified village module by integrating water availability, utilization, balance, budget modules...
          village_resources_text = {
            type: "html",
            data:
            // '<table class="akahReportTable1" style="width: 93.5%;margin: 10px 0px 10px 0px;"><tbody><tr colspan="3"><td class="th_head">4.3. Water Composite</td></tr></tbody></table>'+
            "<p class='akah_level1_heading'>6.6. Water Composite</p>" +
            '<div class="akah_level2_heading">'+
              // "<div style='padding-top: 10px;'><p class='akah_level3_heading'>4.3.1. Dynamic groundwater resources</p></div>"+
              wsprv['wsp_module1'].data +
              // "<table class='akahReportTable1'>" +
              // "<tr><td class='ReportTable_subHdngs' colspan='2' style='text-align:center'>Total Groundwater Available (Ground Water Resource Assessment Report (2017) )</td></tr>"+
              // "<tr><td class='ReportTable_subHdngs'>Recharge from rainfall (ha.m)</td> <td style='width:45%'>"+Number(rv['recharge_rainfall']).toFixed(2)+"</td></tr>"+
              // "<tr><td class='ReportTable_subHdngs'>Recharge from other sources (ha.m)</td><td>"+Number(rv['recharge_other']).toFixed(2)+"</td></tr>"+
              // "<tr><td class='ReportTable_subHdngs'>Total Groundwater Available (ha.m)</td><td>"+rv['total_gnd_wtr']+"</td></tr>"+
              // "</table>"+
              '<p style="font-size: 12px;color: #717070;line-height: 1em;">*Source: CGWB - GWR 2017<br>*Block level values are downscaled to calculate village level groundwater resources using the below equation:<br><span style="padding-left: 4px;color: #717070;">Downscaled Value = Block level resources * (Village area/Block area)</span></p>'+

              // "<div><p class='akah_level3_heading'>4.3.2. Surface water resources</p></div>"+
              // "<table class='akahReportTable1'>" +
              // "<tr><td>1.</td><td class='ReportTable_subHdngs'>Surface water bodies area (in ha)<br>(like farm ponds, tanks, etc)</td><td style='width:45%'>"+rv["surface_water_bodies_count"]+"</td></tr>"+
              // "<tr><td>2.</td><td class='ReportTable_subHdngs'>Storage capacity (ha.m)</td><td>"+rv['sw_storage_volume_village']+"</td></tr>"+
              // "<tr><td>3.</td><td class='ReportTable_subHdngs'>Surface water available to use (ha.m)</td><td>"+rv['sw_available_village']+"</td></tr>"+//10.95
              // "</table>"+
              '<p style="font-size: 12px;color: #717070;">*Source: Automatic Water Extension Index(AWEI) of Sentinel-2 Satellite Images <br>(No.of Storage structures, storage capacity is calculated from AWEI.)</p>'+
            '</div>'+'<div class="akah_level2_content">'+wsprv['wsp_module2'].data+'</div>',
            addPageBreak:true
          };
          village_resources_text1 = {
            type: "html",
            data: '<div class="akah_level2_heading">'+wsprv['wsp_module3'].data+'</div>',
            addPageBreak:true
          };
          village_resources_text2 = 
          {
            type: "html",
            data: '<div class="akah_level2_heading">'+wsprv['wsp_module3_2'].data+'</div>',
            addPageBreak:true
          };
          if(well_table == ""){
            village_gnd_wtr_data = { type: "html",
            data:
            "<p class='akah_level1_heading'>6.5.1.  Real time Ground Water Levels (2020)</p>" +
            '<div style="padding-left:2%;font-size: larger;background-color: #f9f8f8;margin: 0px 30px 0px 30px;padding: 8px;border-radius: 10px;text-align: center;"><span class="ReportTable_subHdngs"> State: &nbsp;</span><span style="color: #0473d4;">'+akahstate+'</span>&nbsp;&nbsp;'+
            '<span class="ReportTable_subHdngs"> District: &nbsp;</span><span style="color: #0473d4;">'+akahdistrict+'</span>&nbsp;&nbsp;<span class="ReportTable_subHdngs"> Block: &nbsp;</span><span style="color: #0473d4;">'+akahblock+'</span>&nbsp;&nbsp;'+
            '<span class="ReportTable_subHdngs"> Village: &nbsp;</span><span style="color: #0473d4;">'+akahvillage+'</span>&nbsp;&nbsp;</div>'+
            // '<table class="akahReportTable1" style="width: 93.5%;margin: 10px 0px 10px 0px;"><tbody><tr colspan="3"><td class="th_head">4.4. Real-time Groundwater Monitoring data</td></tr></tbody></table>'+
            // "<div><p style='font-size: 18px;font-weight: 600;'>4.4.1. Long term Observation Wells Data</p></div>"+
            "<p class='akah_level2_heading'>Note: Longterm Obervation wells are not available for the selected village</p>" +
            "<div><p class='akah_level1_heading'>4.4.2. Real-time Ground Water level monitoring</p></div>"+
            "<p class='akah_level2_heading'>Note: Real-time groundwater levels are not found for the selected village</p>",
            addPageBreak:true
           
          }
      }
      else{
          village_gnd_wtr_data = {
            type: "html",
            data:
            "<p class='akah_level1_heading'>6.5.1.  Real time Ground Water Levels (2020)</p>" +
            '<div style="padding-left:2%;font-size: larger;background-color: #f9f8f8;margin: 0px 30px 0px 30px;padding: 8px;border-radius: 10px;text-align: center;"><span class="ReportTable_subHdngs"> State: &nbsp;</span><span style="color: #0473d4;">'+akahstate+'</span>&nbsp;&nbsp;'+
            '<span class="ReportTable_subHdngs"> District: &nbsp;</span><span style="color: #0473d4;">'+akahdistrict+'</span>&nbsp;&nbsp;<span class="ReportTable_subHdngs"> Block: &nbsp;</span><span style="color: #0473d4;">'+akahblock+'</span>&nbsp;&nbsp;'+
            '<span class="ReportTable_subHdngs"> Village: &nbsp;</span><span style="color: #0473d4;">'+akahvillage+'</span>&nbsp;&nbsp;</div>'+
            // "<p class='akah_level2_heading'>6.6.1. Long term Observation Wells Data</p>" +
            
            // '<table class="akahReportTable1" style="width: 93.5%;margin: 10px 0px 10px 0px;"><tbody><tr colspan="3"><td class="th_head">4.4. Real-time Groundwater Monitoring data</td></tr></tbody></table>'+
            // "<p class='akah_level2_heading'>4.4. Real-time Groundwater Monitoring data</p>" +
            '<div class="akah_level2_content">'+
              "<table style='padding-top: 20px;' class='akahReportTable'>"+
              // "<tr><td colspan="+(Number(well_data_info.uid.length)+2)+" class='ReportTable_subHdngs' style='font-size: 14px;'></td><tr>"+
              well_table +
              "</table><br>"+'<div style="padding-left: 20px;color: #717070;"><p style="margin: 0px;">* All Depth values are measured in meters below ground level (mbgl)</p></div>'+
            '</div>'+
            "<div style='padding-top: 20px;'><p class='akah_level1_heading'>6.5.2. Real time Ground Water Level Monitoring</p></div>"+
            '<div style="padding-left:2%;font-size: larger;background-color: #f9f8f8;margin: 0px 30px 0px 30px;padding: 8px;border-radius: 10px;text-align: center;"><span class="ReportTable_subHdngs"> State: &nbsp;</span><span style="color: #0473d4;">'+akahstate+'</span>&nbsp;&nbsp;'+
            '<span class="ReportTable_subHdngs"> District: &nbsp;</span><span style="color: #0473d4;">'+akahdistrict+'</span>&nbsp;&nbsp;<span class="ReportTable_subHdngs"> Block: &nbsp;</span><span style="color: #0473d4;">'+akahblock+'</span>&nbsp;&nbsp;'+
            '<span class="ReportTable_subHdngs"> Village: &nbsp;</span><span style="color: #0473d4;">'+akahvillage+'</span>&nbsp;&nbsp;</div>'+
            '<div class="akah_level2_content">'+
                rep_charts+
                '<div style="color:#717070;display:inline-flex;"><div> <span><b style="font-size:13px;color:#717070;"><u>Formula for Trendline&nbsp;</u></b><br><br> is given by: <span style="font-size:13px">Y = mx + c</span></span><br> <span style="font-size:13px">c (intercept) = (∑y ∑x<sup>2</sup> -  ∑x ∑xy) / (n (∑x<sup>2</sup>) – (∑x)<sup>2</sup>) </span><br> <span style="font-size:13px">m (slope) = (n ∑xy  -  (∑x)  (∑y)) / (n (∑x<sup>2</sup>) – (∑x)<sup>2</sup>)</span><br> <span>Where,</span><br> <span>X and y are two variables on the regression line.</span><br> <span>M = slope of the line,</span><br> <span>C = y- intercept of the line,</span><br> <span>X = Values of dates,</span><br> <span>Y = values of Predicted Groundwater Levels.</span><br> </div> <div style="padding-left:90px"> <span><b style="font-size:13px;color: #717070;"><u>Formula for Deviation</u></b></span><br><br> <span style="font-size:13px;">Deviation = √(∑_(i=1)^N (Predicted<sub>(i)</sub> - Actual<sub>(i)</sub>)<sup>2</sup>/N)</span> </div> </div><br><br>'+
            '</div>',
            // "<h3>Concluding Statement: </h3><p style='font-size: 14px;line-height: 1.5em;'>Real time GWLs in the village show a downward trend (9.54%) from pre-monsoon to post-monsoon timeframe.</p>",

            // "<div style='padding-top: 20px;'><h3 class='akahReportTableSide_headings'>d. Observation Wells Data</h3></div>"+
            addPageBreak: true
          };
        }
        if(rep_sensor_chart != ""){
          sensor_data = { type: "html",
          data: "<div style='padding-top: 20px;'><p class='akah_level1_heading'>6.5.5. Real time borewell data interpretation</p></div>"+
          '<div style="padding-left:2%;font-size: larger;background-color: #f9f8f8;margin: 0px 30px 0px 30px;padding: 8px;border-radius: 10px;text-align: center;"><span class="ReportTable_subHdngs"> State: &nbsp;</span><span style="color: #0473d4;">'+akahstate+'</span>&nbsp;&nbsp;'+
          '<span class="ReportTable_subHdngs"> District: &nbsp;</span><span style="color: #0473d4;">'+akahdistrict+'</span>&nbsp;&nbsp;<span class="ReportTable_subHdngs"> Block: &nbsp;</span><span style="color: #0473d4;">'+akahblock+'</span>&nbsp;&nbsp;'+
          '<span class="ReportTable_subHdngs"> Village: &nbsp;</span><span style="color: #0473d4;">'+akahvillage+'</span>&nbsp;&nbsp;</div>'+
          '<div class="akah_level2_content">'+
              rep_sensor_chart+
              '<div style="color:black;display:inline-flex;"><div> <span><b style="font-size:13px;color: #717070;"><u>Formula for Trendline&nbsp;</u></b><br><br> is given by: <span style="font-size:13px">Y = mx + c</span></span><br> <span style="font-size:13px">c (intercept) = (∑y ∑x<sup>2</sup> -  ∑x ∑xy) / (n (∑x<sup>2</sup>) – (∑x)<sup>2</sup>) </span><br> <span style="font-size:13px">m (slope) = (n ∑xy  -  (∑x)  (∑y)) / (n (∑x<sup>2</sup>) – (∑x)<sup>2</sup>)</span><br> <span>Where,</span><br> <span>X and y are two variables on the regression line.</span><br> <span>M = slope of the line,</span><br> <span>C = y- intercept of the line,</span><br> <span>X = Values of dates,</span><br> <span>Y = values of Predicted Groundwater Levels.</span><br> </div> <div style="padding-left:90px"> <span><b style="font-size:13px;color: #717070;"><u>Formula for Deviation</u></b></span><br><br> <span style="font-size:13px;">Deviation = √(∑_(i=1)^N (Predicted<sub>(i)</sub> - Actual<sub>(i)</sub>)<sup>2</sup>/N)</span> </div> </div><br><br>'+
          '</div>',
          addPageBreak:true
          }
         }
         else{
          sensor_data = { type: "html",
          data: "<div><p class='akah_level1_heading'>6.5.5. Real time borewell data interpretation</p></div>"+
          '<div style="padding-left:2%;font-size: larger;background-color: #f9f8f8;margin: 0px 30px 0px 30px;padding: 8px;border-radius: 10px;text-align: center;"><span class="ReportTable_subHdngs"> State: &nbsp;</span><span style="color: #0473d4;">'+akahstate+'</span>&nbsp;&nbsp;'+
          '<span class="ReportTable_subHdngs"> District: &nbsp;</span><span style="color: #0473d4;">'+akahdistrict+'</span>&nbsp;&nbsp;<span class="ReportTable_subHdngs"> Block: &nbsp;</span><span style="color: #0473d4;">'+akahblock+'</span>&nbsp;&nbsp;'+
          '<span class="ReportTable_subHdngs"> Village: &nbsp;</span><span style="color: #0473d4;">'+akahvillage+'</span>&nbsp;&nbsp;</div>'+
          "<p class='akah_level2_heading'>Note: Sensors not found for the selected village</p>"
          }
         }
       
        
          // village_tableText1 = {
          //   type: "html",
          //   data: "<table style='padding-top: 20px;' class='akahReportTable'>"+"<tr><td colspan="+(Number(well_data_info.uid.length)+2)+" class='village_th_head'>c. Long term Observation Wells Data</td><tr>"+
          //   well_table +
          //   "</table><br>"+'<div style="padding-left: 20px;color:#9e3f07;margin-bottom:150px"><b>* All Depth values are measured in Meters below ground level (mbgl)</b></div>',
          //   addPageBreak: true
          // };

          if (akahvillage === 'Katepimpalgaona') {
              waterQuality_tableText = {
                type: "html",
                data: waterQualityKt, 
                addPageBreak:true
              };
          }
          else if (akahvillage === 'Amrapur Gira') {
              waterQuality_tableText = {
                type: "html",
                data: waterQualityAg, 
                addPageBreak:true
              };
          }
          else{
              if(rep_vil1>0){
                waterQuality_tableText = {
                type: "html",
                data:
                '<div class="akah_level2_content" style="margin-top:10px;">'+
                  "<div><p class='akah_level1_heading'>6.5.3 Real Time Ground Water Quality</p></div>" +
                  '<div style="padding-left:2%;font-size: larger;background-color: #f9f8f8;margin: 0px 30px 0px 30px;padding: 8px;border-radius: 10px;text-align: center;"><span class="ReportTable_subHdngs"> State: &nbsp;</span><span style="color: #0473d4;">'+akahstate+'</span>&nbsp;&nbsp;'+
                  '<span class="ReportTable_subHdngs"> District: &nbsp;</span><span style="color: #0473d4;">'+akahdistrict+'</span>&nbsp;&nbsp;<span class="ReportTable_subHdngs"> Block: &nbsp;</span><span style="color: #0473d4;">'+akahblock+'</span>&nbsp;&nbsp;'+
                  '<span class="ReportTable_subHdngs"> Village: &nbsp;</span><span style="color: #0473d4;">'+akahvillage+'</span>&nbsp;&nbsp;</div>'+
                  '<table class="akahReportTable"><tr>'+wq_header_text+'</tr></table>'+
                  "<table class='akahReportTable2' style='font-size: 12px;'>" +
                  "<tr><td class='ReportTable_subHdngs1' rowspan='2'>S.No</td>"+
                  "<td class='ReportTable_subHdngs1' rowspan='2'>Water Quality Parameter</td><td class='ReportTable_subHdngs1' colspan='"+wb_reading_colspan+"'>Reading (2021)</td>"+
                  "<td class='ReportTable_subHdngs1' rowspan='2'>Acceptable Limit <sup>1</sup></td>"+
                  "<td class='ReportTable_subHdngs1' rowspan='2'>Permissible Limit <sup>1</sup></td>"+
                  wb_tbl2_monsoon_heading+
                  wq_tbl2_body1+
                  "</table>"+
                  '<table class="akahReportTable" style="margin-bottom: 10px;"><tr><td>'+wq_restbl+'</td></tr></table>'+
                  '<span style="color: #717070;font-size:12px;">*Source: </span><span style="padding-left: 5px;margin-top: 12px;color: #717070;">Bureau of Indian Standards</span>'+
                  wqtbl+
                //  "<h3>Concluding Statement: </h3><p style='font-size: 14px;line-height: 1.5em;'>The nitrate concentration in the village is above the accpetable and permissible limit both during the pre-monsoon and post-monsoon seasons, with a violation of 72.89%.</p><p style='font-size: 14px;line-height: 1.5em;'>The potassium concentration in the village is also above the acceptable and permissible limit during the pre-monsoon season, with a violation of 22.52%.</p>"+
                '</div>', 
                addPageBreak:true
              };
            }
            else{
              waterQuality_tableText = {
              type: "html",
              data:''
            }
          }
          }
          if(selectYear_Akah.value == "Select" || selectMonth_Akah.value == "0")
          {
            lulc_tableText = {
              type: "html",
              data:
              "<p class='akah_level1_heading'>6.3.2. Land Use Land Cover (LULC) </p>" +
              // "<div><h3 class='akahReportTableSide_headings'>5. Delineated potential ‘Recharge zones’ suitable for constructing water conservation structures</h3></div>"+
              // '<table class="akahReportTable1" style="width: 93.5%;margin: 10px 0px 10px 0px;"><tbody><tr colspan="3"><td class="th_head">6.3.2. Land Use Land Cover (LULC)</td></tr></tbody></table>'+
              // "<div><p class='akah_level2_heading'>4.5. Land Use Land Cover </p></div>"+
              '<div class="akah_level2_content">'+
                '<div style="padding-left:2%;font-size: larger;background-color: #f9f8f8;margin: 0px 30px 0px 30px;padding: 8px;border-radius: 10px;text-align: center;"><span class="ReportTable_subHdngs"> State: &nbsp;</span><span style="color: #0473d4;">'+akahstate+'</span>&nbsp;&nbsp;'+
                '<span class="ReportTable_subHdngs"> District: &nbsp;</span><span style="color: #0473d4;">'+akahdistrict+'</span>&nbsp;&nbsp;<span class="ReportTable_subHdngs"> Block: &nbsp;</span><span style="color: #0473d4;">'+akahblock+'</span>&nbsp;&nbsp;'+
                '<span class="ReportTable_subHdngs"> Village: &nbsp;</span><span style="color: #0473d4;">'+akahvillage+'</span>&nbsp;&nbsp;</div>'+
                "<div style='display:grid !important;padding-left:60px;'>"+dom.byId('villageLULC').innerHTML+"</div>"+"<div>"+village_level_lulcTable+"</div>"+
                '<div style="color: #717070;padding-top: 12px;">*Source: Sentinel-2 satellite imageries.</div>'+
              '</div>'+
            "<h3>Concluding Statement: </h3><ul style='font-size: 14px;margin-right: 30px;line-height: 1.5em;'><li>Agricultural land takes up the most space in the village both during pre-monsoon and post-monsoon seasons.</li><li> Grassland, water bodies, built-up and barren land are some of the other important land uses in the region.</li></ul>",
              addPageBreak:true
            };
          }
          else {
            lulc_tableText = {
              type: "html",
              data:
              "<p class='akah_level1_heading'>6.3.2. Land Use Land Cover (LULC) </p>" +
              // '<table class="akahReportTable1" style="width: 93.5%;margin: 10px 0px 10px 0px;"><tbody><tr colspan="3"><td class="th_head">6.3.2. Land Use Land Cover </td></tr></tbody></table>'+
              // "<div><p class='akah_level2_heading'>4.5. Land Use Land Cover </p></div>"+
              '<div class="akah_level2_content">'+
                '<div style="padding-left:2%;font-size: larger;background-color: #f9f8f8;margin: 0px 30px 0px 30px;padding: 8px;border-radius: 10px;text-align: center;"><span class="ReportTable_subHdngs"> State: &nbsp;</span><span style="color: #0473d4;">'+akahstate+'</span>&nbsp;&nbsp;'+
                '<span class="ReportTable_subHdngs"> District: &nbsp;</span><span style="color: #0473d4;">'+akahdistrict+'</span>&nbsp;&nbsp;<span class="ReportTable_subHdngs"> Block: &nbsp;</span><span style="color: #0473d4;">'+akahblock+'</span>&nbsp;&nbsp;'+
                '<span class="ReportTable_subHdngs"> Village: &nbsp;</span><span style="color: #0473d4;">'+akahvillage+'</span>&nbsp;&nbsp;</div>'+
                "<div style='display:grid !important;padding-left:60px;'>"+dom.byId('villageLULC').innerHTML+"</div>"+"<div>"+village_level_lulcTable+"</div>"+
                '<div style="color: #717070;padding-top: 12px;">*Source: Sentinel-2 satellite imageries.</div>'+
              '</div>'+
              // "<div><h3 class='akahReportTableSide_headings'>5. Delineated potential ‘Recharge zones’ suitable for constructing water conservation structures</h3></div>"+
              // "<div><p class='akah_level2_heading'>4.5. Land Use Land Cover </p></div>"+
              '<div class="akah_level2_content">'+
                // "<div style='display:inline-flex !important;'>"+dojo.query("#akahLulc_Chart").innerHTML() + dojo.query("#lulc_legend").innerHTML()+"</div>"+
                "<div style='display:inline-flex !important;'>"+dojo.query("#akahLulc_Chart_report").innerHTML()+"</div>"+
                '<div style="color: #717070;padding-top: 12px;">*Source: Sentinel-2 satellite imageries.</div>'+
              '</div>'+
              "<h3>Concluding Statement: </h3><ul style='font-size: 14px;margin-right: 30px;line-height: 1.5em;'><li>Land use land cover for vegetation is higher during the post-monsoon period ascompared to the pre-monsoon season.</li>"+
              "<li>Most of the built-up land in the region is seen for the year 2019 during the pre-monsoon period.</li><li>Other major land uses in the region include built-up and grassland</li><ul>",
              addPageBreak:true
            };
          }
          // ndvichart.series.splice(0,1);
          //ndvi to get the minimum in ()in pre monsoon
          lessVal_pre = "";highVal_post="";
          a = Math.min.apply(null,pre_denseArr)
          b = Math.min.apply(null,pre_sparseArr)
          c = Math.min.apply(null,pre_lowArr)
          if(a <= b && a <= c) lessVal_pre = "dense"
          if(b <= a && b <= c) lessVal_pre = "sparse"
          if(c <= b && c <= a) lessVal_pre = "low"
          //ndvi getting the maximum in(dense, psarse,low) in post monsoon
          a1 = Math.min.apply(null,post_denseArr)
          b1 = Math.min.apply(null,post_sparseArr)
          c1 = Math.min.apply(null,post_lowArr)
          if(a1 >= b1 && a1 >= c1) highVal_post = "dense"
          if(b1 >= a1 && b1 >= c1) highVal_post = "sparse"
          if(c1 >= b1 && c1 >= a1) highVal_post = "low"
          //get min and max for vegeration area chart
          lessVal_ndvi_area = "";highVal_ndvi_area="";
          sum1=0;sum2=0;sum3=0;
          for(var n = 0;n<rep_ndvi_densearray.length;n++){sum1+=rep_ndvi_densearray[n]}
          for(var n = 0;n<rep_ndvi_sparsearray.length;n++){sum2+=rep_ndvi_sparsearray[n]}
          for(var n = 0;n<rep_ndvi_lowarray.length;n++){sum3+=rep_ndvi_lowarray[n]}
          if(sum1 <= sum2 && sum1 <= sum3) lessVal_ndvi_area = "dense";
          if(sum2 <= sum1 && sum2 <= sum3) lessVal_ndvi_area = "sparse"
          if(sum3 <= sum2 && sum3 <= sum1) lessVal_ndvi_area = "low"
          if(sum1 >= sum2 && sum1 >= sum3) highVal_ndvi_area = "dense"
          if(sum2 >= sum1 && sum2 >= sum3) highVal_ndvi_area = "sparse"
          if(sum3 >= sum2 && sum3 >= sum1) highVal_ndvi_area = "low"
          getMaxForNDVI_Ind = rep_ndvidateLabels[rep_ndvi_meanarray.indexOf(Math.max.apply(null,rep_ndvi_meanarray))].text.split("_")[0]
          getMinForNDVI_Ind = rep_ndvidateLabels[rep_ndvi_meanarray.indexOf(Math.min.apply(null,rep_ndvi_meanarray))].text.split("_")[0]
          midValNDVI = (Math.max.apply(null,rep_ndvi_meanarray) + Math.min.apply(null,rep_ndvi_meanarray))/2
          catNDVI = "";
          if(midValNDVI > -1 && midValNDVI <= -0.5){catNDVI = "Water"}
          if(midValNDVI > -0.5 && midValNDVI <= 0){catNDVI = "Barren areas of Rock, sand or Snow"}
          if(midValNDVI > 0 && midValNDVI <= 0.5){catNDVI = "Sparse Vegetation/ Shrubs and Grasslands"}
          if(midValNDVI > 0.5 && midValNDVI <= 1){catNDVI = "Dense Vegetation/ Forests"}
          if(akah_ndvifrommonth != "0" && akah_ndvifromyear!= "Year" && akah_ndvitomonth != "0" && akah_ndvitoyear != "Year"){
            indices_tableText_ndvi = {
              type: "html",
              data:
            "<p class='akah_level1_heading'>6.3.3 Vegetation Index (Normalised Difference Vegetation Index/ NDVI) </p>" +
              // '<table class="akahReportTable1" style="width: 93.5%;margin-left: 29px;margin-top: 15px;"><tbody><tr colspan="3"><td class="th_head">4.6. Vegetation Index </td></tr></tbody></table>'+
              // "<div><p class='akah_level2_heading'>4.6. Normalized Difference Vegetation Index </p></div>"+
              '<div class="akah_level2_content">'+
              '<div style="padding-left:2%;font-size: larger;background-color: #f9f8f8;margin: 0px 30px 0px 30px;padding: 8px;border-radius: 10px;text-align: center;"><span class="ReportTable_subHdngs"> State: &nbsp;</span><span style="color: #0473d4;">'+akahstate+'</span>&nbsp;&nbsp;'+
                '<span class="ReportTable_subHdngs"> District: &nbsp;</span><span style="color: #0473d4;">'+akahdistrict+'</span>&nbsp;&nbsp;<span class="ReportTable_subHdngs"> Block: &nbsp;</span><span style="color: #0473d4;">'+akahblock+'</span>&nbsp;&nbsp;'+
                '<span class="ReportTable_subHdngs"> Village: &nbsp;</span><span style="color: #0473d4;">'+akahvillage+'</span>&nbsp;&nbsp;</div>'+
                "<div style='text-align: justify;font-size: 14px;margin-right: 30px;line-height: 1.8em;'>NDVI is a ratio value that can help in interpreting the vegetation quality of the region. In the below graph,'Mean' shows the average of NDVI values that exists within the region. NDVI values range from +1 to -1. High NDVI values (0.6 to +1) correspond to dense vegetation such as that found in temperate and tropical forests or crops at their peak growth stage. Sparse vegetation such as shrubs and grasslands or senescing crops may result in moderate NDVI values (0.2 to 0.5). Areas of barren rock, sand, or snow usually show very low NDVI values (0.1 or less) and negative values (approaching -1) correspond to water.</div>"+
                
                '<div style="display:inline-flex;margin-bottom:4%;"><div>'+dojo.query("#ndviLineCharts_info_reportMean").innerHTML()+
                '<table style="line-height: 2em;padding-left: 60px;">'+
                '<tr><td><span style="padding: 0px 8px 0px 6px;color:#00AA17;background-color:#00AA17;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Mean</td></tr>'+
                '<tr><td><span style="padding: 0px 8px 0px 6px;color:#215D2B;background-color:#215D2B;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Trend line</td></tr></table>'+
                "</div>"+
                "<div><img style='width: 310px;height: 303px;margin-top: 15px;margin-left: 25px;' src='"+ndvi_index_img+"'/></div>"+
                // "<div style='padding-left: 40px;font-size: 12px;color: #717070;'>Figure: NDVI correlation with Vegetation Health</div></div>"+
                "</div>"+
                "<h3>Concluding Statement:</h3><ul style='padding-left:1%;font-size:14px;line-height:1.6em;'><li>Most of the area in the village falls between "+Math.min.apply(null,rep_ndvi_meanarray)+" ("+getMinForNDVI_Ind+") to "+Math.max.apply(null,rep_ndvi_meanarray)+ " ("+getMaxForNDVI_Ind+") which falls under the category <b>"+catNDVI+"</b>.</li></ul>"+

                "<div style='flex;'><div>"+dojo.query("#ndviareaLineCharts_info_reportMean").innerHTML()+"</div>"+
                "<div><img style='width: 310px;height: 303px;margin-top: 15px;margin-left: 25px;' src='"+ndvi_index2_img+"'/></div></div>"+
                "<h3>Concluding Statement:</h3><ul style='padding-left:1%;font-size:14px;line-height:1.6em;'><li>Out of total vegetation area in the village, "+highVal_ndvi_area+" vegetation is higher and "+lessVal_ndvi_area+" vegetation is lower.</li></ul>"+

                "<div style='display:inline-flex;'>"+dojo.query("#vegetationIndices_chart").innerHTML()+
                // "</div>"+
                "<div style='display:grid;width: 400px;'>"+
                '<table style="line-height: 2em;padding-left:20%;padding-top:30%;"><tbody style="display:inline-flex;">'+
                '<tr style="vertical-align:baseline;line-height:1.6em;"><td><span style="padding: 0px 8px 0px 6px;color:#a3a334;background-color:#a3a334;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Pre Monsoon</td></tr>'+
                '<tr style="vertical-align:baseline;line-height:1.6em;"><td><span style="padding: 0px 8px 0px 6px;color:#007e11;background-color:#007e11;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Post Monsoon</td></tr></tbody></table>'+
                '<table style="line-height: 2em;padding-left:20%;padding-top:22%;"><tbody style="display:inline-flex;">'+
                '<tr style="vertical-align:baseline;line-height:1.6em;"><td><span style="padding: 0px 8px 0px 6px;color:#a3a334;background-color:#a3a334;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Pre Monsoon</td></tr>'+
                '<tr style="vertical-align:baseline;line-height:1.6em;"><td><span style="padding: 0px 8px 0px 6px;color:#00aa17;background-color:#00aa17;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Post Monsoon</td></tr></tbody></table>'+
                '<table style="line-height: 2em;padding-left:20%;padding-top:25%;"><tbody style="display:inline-flex;">'+
                '<tr style="vertical-align:baseline;line-height:1.6em;"><td><span style="padding: 0px 8px 0px 6px;color:#a3a334;background-color:#a3a334;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Pre Monsoon</td></tr>'+
                '<tr style="vertical-align:baseline;line-height:1.6em;"><td><span style="padding: 0px 8px 0px 6px;color:#00e21f;background-color:#00e21f;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Post Monsoon</td></tr></tbody></table>'+
                "</div>"+
                '<div style="color: #717070;padding-top: 12px;">*Source: Sentinel-2 satellite imageries.</div>'+
                '<div style="color: #717070;padding-top: 5px;">*Formula for NDVI : (Near Infrared Band - Red Band)/ (Near Infrared Band - Red Band)</div>'+
                '</div>'+
              "<h3>Concluding Statement:</h3><ul style='font-size: 14px;margin-right: 30px;line-height: 1.5em;'><li>During 2016-2020 for pre-monsoon the area under "+lessVal_pre+" vegetation is very low as compared to sparse and low vegetation whereas during post-monsoon there is an increase in the "+highVal_post+" vegetation category.</li></ul>",
                addPageBreak:true
              }
          }
          else{
            dojo.query('#ndvi_chart_dash').style('display', 'block');
            dojo.query('#ndviarea_chart_dash').style('display', 'block');
            indices_tableText_ndvi = {
              type: "html",
              data:
            "<p class='akah_level1_heading'>6.3.3 Vegetation Index (Normalised Difference Vegetation Index/ NDVI) </p>" +
              // '<table class="akahReportTable1" style="width: 93.5%;margin: 15px 0px 10px 29px;"><tbody><tr colspan="3"><td class="th_head">4.6. Vegetation Index </td></tr></tbody></table>'+
              // "<div><p class='akah_level2_heading'>4.6. Normalized Difference Vegetation Index </p></div>"+
              '<div class="akah_level2_content">'+
              '<div style="padding-left:2%;font-size: larger;background-color: #f9f8f8;margin: 0px 30px 0px 30px;padding: 8px;border-radius: 10px;text-align: center;"><span class="ReportTable_subHdngs"> State: &nbsp;</span><span style="color: #0473d4;">'+akahstate+'</span>&nbsp;&nbsp;'+
                '<span class="ReportTable_subHdngs"> District: &nbsp;</span><span style="color: #0473d4;">'+akahdistrict+'</span>&nbsp;&nbsp;<span class="ReportTable_subHdngs"> Block: &nbsp;</span><span style="color: #0473d4;">'+akahblock+'</span>&nbsp;&nbsp;'+
                '<span class="ReportTable_subHdngs"> Village: &nbsp;</span><span style="color: #0473d4;">'+akahvillage+'</span>&nbsp;&nbsp;</div>'+
                "<div style='text-align: justify;font-size: 14px;margin-right: 30px;line-height: 1.8em;'>"+
                "NDVI is a ratio value that can help in interpreting the vegetation quality of the region. In the below graph,'Mean' shows the average of NDVI values that exists within the region. NDVI values range from +1 to -1. High NDVI values (0.6 to +1) correspond to dense vegetation such as that found in temperate and tropical forests or crops at their peak growth stage. Sparse vegetation such as shrubs and grasslands or senescing crops may result in moderate NDVI values (0.2 to 0.5). Areas of barren rock, sand, or snow usually show very low NDVI values (0.1 or less) and negative values (approaching -1) correspond to water."+
                "</div>"+
                '<div style="display:inline-flex;margin-bottom:4%;"><div>'+dom.byId('ndvi_chart_dash').innerHTML+"</div>"+
                "<div><img style='width: 310px;height: 303px;margin-top: 15px;margin-left: 25px;' src='"+ndvi_index_img+"'/></div>"+
                "</div>"+
                "<h3>Concluding Statement:</h3><ul style='padding-left:1%;font-size:14px;line-height:1.6em;'><li>Most of the area in the village falls between "+Math.min.apply(null,rep_ndvi_meanarray)+" ("+getMinForNDVI_Ind+") to "+Math.max.apply(null,rep_ndvi_meanarray)+ " ("+getMaxForNDVI_Ind+") which falls under the category <b>"+catNDVI+"</b>.</li></ul>"+

                // "<div style='padding-left: 40px;font-size: 12px;color: #717070;'>Figure: NDVI correlation with Vegetation Health</div></div></div>"+
                "<div style='display:flex;'><div>"+dom.byId('ndviarea_chart_dash').innerHTML+"</div>"+
                "<div><img style='width: 310px;height: 303px;margin-top: 15px;margin-left: 25px;' src='"+ndvi_index2_img+"'/></div></div>"+
                "<h3>Concluding Statement:</h3><ul style='padding-left:1%;font-size:14px;line-height:1.6em;'><li>Out of total vegetation area in the village, "+highVal_ndvi_area+" vegetation is higher and "+lessVal_ndvi_area+" vegetation is lower.</li></ul>"+

                "<div style='display:inline-flex;'>"+dojo.query("#vegetationIndices_chart").innerHTML()+
                "<div style='display:grid;width: 400px;'>"+
                '<table style="line-height: 2em;padding-left:20%;padding-top:30%;"><tbody style="display:inline-flex;">'+
                '<tr style="vertical-align:baseline;line-height:1.6em;"><td><span style="padding: 0px 8px 0px 6px;color:#a3a334;background-color:#a3a334;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Pre Monsoon</td></tr>'+
                '<tr style="vertical-align:baseline;line-height:1.6em;"><td><span style="padding: 0px 8px 0px 6px;color:#007e11;background-color:#007e11;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Post Monsoon</td></tr></tbody></table>'+
                '<table style="line-height: 2em;padding-left:20%;padding-top:22%;"><tbody style="display:inline-flex;">'+
                '<tr style="vertical-align:baseline;line-height:1.6em;"><td><span style="padding: 0px 8px 0px 6px;color:#a3a334;background-color:#a3a334;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Pre Monsoon</td></tr>'+
                '<tr style="vertical-align:baseline;line-height:1.6em;"><td><span style="padding: 0px 8px 0px 6px;color:#00aa17;background-color:#00aa17;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Post Monsoon</td></tr></tbody></table>'+
                '<table style="line-height: 2em;padding-left:20%;padding-top:25%;"><tbody style="display:inline-flex;">'+
                '<tr style="vertical-align:baseline;line-height:1.6em;"><td><span style="padding: 0px 8px 0px 6px;color:#a3a334;background-color:#a3a334;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Pre Monsoon</td></tr>'+
                '<tr style="vertical-align:baseline;line-height:1.6em;"><td><span style="padding: 0px 8px 0px 6px;color:#00e21f;background-color:#00e21f;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Post Monsoon</td></tr></tbody></table>'+
                "</div>"+

                "</div>"+
                // "</div>"+
                

                '<div style="color: #717070;padding-top: 12px;">*Source: Sentinel-2 satellite imageries.</div>'+
                '<div style="color: #717070;padding-top: 5px;">*Formula for NDVI : (Near Infrared Band - Red Band)/ (Near Infrared Band - Red Band)</div>'+
              '</div>'+
              "<h3>Concluding Statement:</h3><ul style='font-size: 14px;margin-right: 30px;line-height: 1.5em;'><li>During 2016-2020 for pre-monsoon the area under "+lessVal_pre+" vegetation is very low as compared to sparse and low vegetation whereas during post-monsoon there is an increase in the "+highVal_post+" vegetation category.</li></ul>",
             
              addPageBreak:true
            }
          }
          // ndwichart.series.splice(0,1);
          getMaxForNDWI_Ind = rep_ndwidateLabels[rep_ndwi_meanarray.indexOf( Math.max.apply(null,rep_ndwi_meanarray))].text.split("_")[0]
          getMinForNDWI_Ind = rep_ndwidateLabels[rep_ndwi_meanarray.indexOf( Math.min.apply(null,rep_ndwi_meanarray))].text.split("_")[0]
          midValNDWI = (Math.max.apply(null,rep_ndwi_meanarray) + Math.min.apply(null,rep_ndwi_meanarray))/2
          //get min and max for surfacw water area chart
          getMaxForNDWI_area = rep_ndwidateLabels[rep_ndwi_waterarray.indexOf( Math.max.apply(null,rep_ndwi_waterarray))].text.split("_")[0]
          getMinForNDWI_area = rep_ndwidateLabels[rep_ndwi_waterarray.indexOf( Math.min.apply(null,rep_ndwi_waterarray))].text.split("_")[0]
          //get conclude statement for ndwi pre and post monsoon stacked chart
          pre_sum_ndwi = surfWater_PreArray[0]+surfWater_PreArray[2]+surfWater_PreArray[2]+surfWater_PreArray[3]+surfWater_PreArray[4]
          post_sum_ndwi = surfWater_PostArray[0]+surfWater_PostArray[2]+surfWater_PostArray[2]+surfWater_PostArray[3]+surfWater_PostArray[4]
          if(pre_sum_ndwi >post_sum_ndwi){ndwi_high_cat = "Pre Monsoon";ndwi_low_cat = "Post Monsoon"} else{ndwi_high_cat = "Post Monsoon";ndwi_low_cat = "Pre Monsoon"}
          catNDWI="";
          if(midValNDWI > -1 && midValNDWI <= 0){catNDWI = "Built-up"}
          if(midValNDWI > 0 && midValNDWI <= 0.5){catNDWI = "Vegetation"}
          if(midValNDWI > 0.5 && midValNDWI <= 1){catNDWI = "Water"}
          if(akah_ndwifrommonth != "0" && akah_ndwifromyear!= "Year" && akah_ndwitomonth != "0" && akah_ndwitoyear != "Year"){
            indices_tableText_ndwi = {
              type: "html",
              data:
            "<p class='akah_level1_heading'>6.3.4 Surface Water Index (Normalised Difference Water Index/ NDWI)  </p>" +
            // '<table class="akahReportTable1" style="width: 93.5%;margin-left: 29px;margin-top: 15px;"><tbody><tr colspan="3"><td class="th_head">4.7. Surface Water Index </td></tr></tbody></table>'+
            // "<div><p class='akah_level2_heading'>4.7. Normalized Difference Water Index </p></div>"+
            '<div class="akah_level2_content">'+
            '<div style="padding-left:2%;font-size: larger;background-color: #f9f8f8;margin: 0px 30px 0px 30px;padding: 8px;border-radius: 10px;text-align: center;"><span class="ReportTable_subHdngs"> State: &nbsp;</span><span style="color: #0473d4;">'+akahstate+'</span>&nbsp;&nbsp;'+
            '<span class="ReportTable_subHdngs"> District: &nbsp;</span><span style="color: #0473d4;">'+akahdistrict+'</span>&nbsp;&nbsp;<span class="ReportTable_subHdngs"> Block: &nbsp;</span><span style="color: #0473d4;">'+akahblock+'</span>&nbsp;&nbsp;'+
            '<span class="ReportTable_subHdngs"> Village: &nbsp;</span><span style="color: #0473d4;">'+akahvillage+'</span>&nbsp;&nbsp;</div>'+
              "<div style='text-align: justify;font-size: 14px;margin-right: 30px;line-height: 1.8em;'>NDWI is used to monitor changes in water bodies. It varies between -1 to +1, depending on the water content. Index values greater than 0.5 usually correspond to water, vegetation usually corresponds to much smaller values and built-up areas to values between 0 and 0.2. Drought and water stress are not the only factors that can cause a decrease of NDWI values/anomalies. Change in land covers can also be responsible for such variation of the signal.</div>"+
              
              // "<div>"+dojo.query("#ndwiLineCharts_info_reportMean").innerHTML()+

              '<div style="display:inline-flex;margin-bottom:4%;"><div>'+dom.byId('ndwiLineCharts_info_reportMean').innerHTML+"</div>"+
              "<div><img style='width: 310px;height: 303px;margin-top: 15px;margin-left: 25px;' src='"+ndwi_index_img+"'/></div>"+
              "</div>"+
              '<table style="line-height: 2em;padding-left: 60px;">'+
              '<tr><td><span style="padding: 0px 8px 0px 6px;color:#0077BB;background-color:#0077BB;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Mean</td></tr>'+
              '<tr><td><span style="padding: 0px 8px 0px 6px;color:#114C6E;background-color:#114C6E;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Trend line</td></tr></table></div>'+
              "<h3>Concluding Statement:</h3><ul style='padding-left:1%;font-size:14px;line-height:1.6em;'><li>Most of the area in the village falls between "+Math.min.apply(null,rep_ndwi_meanarray)+" ("+getMinForNDWI_Ind +") to "+Math.max.apply(null,rep_ndwi_meanarray)+" ("+getMaxForNDWI_Ind+") which falls under the category <b>"+catNDWI+"</b>.</li></ul>"+
              "<div style='display:inline-flex;'>"+dom.byId('ndwiareaLineCharts_info_reportMean').innerHTML+"</div>"+
              // "<div><img style='width: 310px;height: 303px;margin-top: 15px;margin-left: 25px;' src='"+ndvi_index2+"'/></div>"+
              "<div style='display:inline-flex;'>"+dojo.query("#waterIndices_chart").innerHTML()+
              "<div style='width: 400px;margin-top:-13px;'>"+
                '<table style="line-height: 2em;padding-left:29%;"><tbody style="display:inline-flex;">'+
                '<tr style="vertical-align:baseline;line-height:1.6em;"><td><span style="padding: 0px 8px 0px 6px;color:#00e21f;background-color:#00e21f;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Pre Monsoon</td></tr>'+
                '<tr style="vertical-align:baseline;line-height:1.6em;"><td><span style="padding: 0px 8px 0px 6px;color:#0077bb;background-color:#0077bb;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Post Monsoon</td></tr></tbody></table>'+
              "</div>"+
              "</div>"+
              // '<table style="line-height: 2em;padding-left:5%;">'+
              // '<tr><td><span style="padding: 0px 8px 0px 6px;color:#0077BB;background-color:#0077BB;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Water (%)</td></tr></table>'+
              "</div>"+
              "<h3>Concluding Statement:</h3><ul style='padding-left:1%;font-size:14px;line-height:1.6em;'><li>Most of the surface water area increased in the month of "+getMaxForNDWI_area+" and decreased in the month of "+getMinForNDWI_area+" for the year 2020.</li><li>Surface water area is higher for "+ndwi_high_cat+" and lower for  "+ndwi_low_cat+" during 2016 to 2020.</li></ul>"+
              '<div style="color: #717070;padding-top: 12px;">*Source: Sentinel-2 satellite imageries.</div>'+
              '<div style="color: #717070;padding-top: 5px;">*Formula for NDWI : (Green Band - Near Infrared Band)/ (Green Band + Near Infrared Band)</div>'+
            '</div>',addPageBreak:true
            }
          }
          else{
            dojo.query('#ndwi_chart_dash').style('display', 'block');
            dojo.query('#ndwiarea_chart_dash').style('display', 'block');
            indices_tableText_ndwi = {
              type: "html",
              data:
            "<p class='akah_level1_heading'>6.3.4 Surface Water Index (Normalised Difference Water Index/ NDWI)  </p>" +
              // '<table class="akahReportTable1" style="width: 93.5%;margin: 15px 0px 10px 29px;"><tbody><tr colspan="3"><td class="th_head">4.7. Surface Water Index </td></tr></tbody></table>'+
            // "<div><p class='akah_level2_heading'>4.7. Normalized Difference Water Index </p></div>"+
            '<div class="akah_level2_content">'+
            '<div style="padding-left:2%;font-size: larger;background-color: #f9f8f8;margin: 0px 30px 0px 30px;padding: 8px;border-radius: 10px;text-align: center;"><span class="ReportTable_subHdngs"> State: &nbsp;</span><span style="color: #0473d4;">'+akahstate+'</span>&nbsp;&nbsp;'+
              '<span class="ReportTable_subHdngs"> District: &nbsp;</span><span style="color: #0473d4;">'+akahdistrict+'</span>&nbsp;&nbsp;<span class="ReportTable_subHdngs"> Block: &nbsp;</span><span style="color: #0473d4;">'+akahblock+'</span>&nbsp;&nbsp;'+
              '<span class="ReportTable_subHdngs"> Village: &nbsp;</span><span style="color: #0473d4;">'+akahvillage+'</span>&nbsp;&nbsp;</div>'+
              "<div style='text-align: justify;font-size: 14px;margin-right: 30px;line-height: 1.8em;'>NDWI is used to monitor changes in water bodies. It varies between -1 to +1, depending on the water content. Index values greater than 0.5 usually correspond to water, vegetation usually corresponds to much smaller values and built-up areas to values between 0 and 0.2. Drought and water stress are not the only factors that can cause a decrease of NDWI values/anomalies. Change in land covers can also be responsible for such variation of the signal.</div>"+
              
              // "<div>"+dom.byId('ndwi_chart_dash').innerHTML+dom.byId('ndwiarea_chart_dash').innerHTML+
              '<div style="display:inline-flex;margin-bottom:4%;"><div>'+dom.byId('ndwi_chart_dash').innerHTML+"</div>"+
                  "<div><img style='width: 310px;height: 303px;margin-top: 15px;margin-left: 58px;' src='"+ndwi_index_img+"'/></div>"+
              "</div>"+
              "<h3>Concluding Statement:</h3><ul style='padding-left:1%;font-size:14px;line-height:1.6em;'><li>Most of the area in the village falls between "+Math.min.apply(null,rep_ndwi_meanarray)+" ("+getMinForNDWI_Ind +") to "+Math.max.apply(null,rep_ndwi_meanarray)+" ("+getMaxForNDWI_Ind+") which falls under the category <b>"+catNDWI+"</b>.</li></ul>"+

              "<div style='display:inline-flex;'><div>"+dom.byId('ndwiarea_chart_dash').innerHTML+"</div><div>"+ dojo.query("#waterIndices_chart").innerHTML()+
                    "<div style='width: 400px;margin-top:-9px;'>"+
                      '<table style="line-height: 2em;padding-left:29%;"><tbody style="display:inline-flex;">'+
                      '<tr style="vertical-align:baseline;line-height:1.6em;"><td><span style="padding: 0px 8px 0px 6px;color:#00e21f;background-color:#00e21f;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Pre Monsoon</td></tr>'+
                      '<tr style="vertical-align:baseline;line-height:1.6em;"><td><span style="padding: 0px 8px 0px 6px;color:#0077bb;background-color:#0077bb;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Post Monsoon</td></tr></tbody></table>'+
                    "</div></div>"+
              "</div>"+

              // "</div>"+

              // '<table style="line-height: 2em;padding-left: 60px;">'+
              // '<tr><td><span style="padding: 0px 8px 0px 6px;color:#0077BB;background-color:#0077BB;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Mean</td></tr>'+
              // '<tr><td><span style="padding: 0px 8px 0px 6px;color:#114C6E;background-color:#114C6E;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Trend line</td></tr></table></div>'+

              // "<div style='display:inline-flex;'><div>"+dom.byId('ndwiareaLineCharts_info_reportMean').innerHTML+"</div>"+
              // // "<div><img style='width: 310px;height: 303px;margin-top: 15px;margin-left: 25px;' src='"+ndvi_index2+"'/></div>"+
              // "</div>"+
              // "<div style='display:inline-flex;'>"+dojo.query("#waterIndices_chart").innerHTML()+
              // "<div style='width: 240px;'>"+
              //   '<table style="line-height: 2em;padding-left:7%;padding-top:53%;"><tbody style="display:inline-flex;">'+
              //   '<tr style="vertical-align:baseline;line-height:1.6em;"><td><span style="padding: 0px 8px 0px 6px;color:#00e21f;background-color:#00e21f;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Pre Monsoon</td></tr>'+
              //   '<tr style="vertical-align:baseline;line-height:1.6em;"><td><span style="padding: 0px 8px 0px 6px;color:#0077bb;background-color:#0077bb;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Post Monsoon</td></tr></tbody></table>'+
              // "</div>"+
              "</div>"+
              "<h3>Concluding Statement:</h3><ul style='padding-left:1%;font-size:14px;line-height:1.6em;'><li>Most of the surface water area increased in the month of "+getMaxForNDWI_area+" and decreased in the month of "+getMinForNDWI_area+" for the year 2020.</li><li>Surface water area is higher for "+ndwi_high_cat+" and lower for  "+ndwi_low_cat+" during 2016 to 2020.</li></ul>"+
              '<div style="color: #717070;padding-top: 12px;">*Source: Sentinel-2 satellite imageries.</div>'+
              '<div style="color: #717070;padding-top: 5px;">*Formulae for NDWI : (Green Band - Near Infrared Band)/ (Green Band + Near Infrared Band)</div>'+
            '</div>',addPageBreak:true
            };
          }
          surf_grd_watr_avail = {
            type: "html",
            data:
            "<p class='akah_level1_heading'>6.4 Surface Water Availability and 6.5 Ground Water Availability</p>"+
            '<div style="padding-left:2%;font-size: larger;background-color: #f9f8f8;margin: 0px 30px 0px 30px;padding: 8px;border-radius: 10px;text-align: center;"><span class="ReportTable_subHdngs"> State: &nbsp;</span><span style="color: #0473d4;">'+akahstate+'</span>&nbsp;&nbsp;'+
            '<span class="ReportTable_subHdngs"> District: &nbsp;</span><span style="color: #0473d4;">'+akahdistrict+'</span>&nbsp;&nbsp;<span class="ReportTable_subHdngs"> Block: &nbsp;</span><span style="color: #0473d4;">'+akahblock+'</span>&nbsp;&nbsp;'+
            '<span class="ReportTable_subHdngs"> Village: &nbsp;</span><span style="color: #0473d4;">'+akahvillage+'</span>&nbsp;&nbsp;</div>'
            +wsprv['wsp_module4'].data        
            }
            //da chart 1 code
            dataAnalysis_obj1= "";window.dataAnalysis_obj1=dataAnalysis_obj1;
            dataAnalysis_obj2= "";window.dataAnalysis_obj2=dataAnalysis_obj2;
            dataAnalysis_obj3= "";window.dataAnalysis_obj3=dataAnalysis_obj3;
            rfMinYear = rfLabelsArrayY[rfYArray.indexOf(Math.min.apply(null,[rfYArray[8],rfYArray[9],rfYArray[10],rfYArray[11]]),0)].text
            rfMaxYear = rfLabelsArrayY[rfYArray.indexOf(Math.max.apply(null,[rfYArray[8],rfYArray[9],rfYArray[10],rfYArray[11]]),0)].text
            daLabelsArray = [];window.daLabelsArray=daLabelsArray;i = 1;for(var n = 8;n<=11;n++){daLabelsArray.push({text:rfLabelsArrayY[n].text, value:i});i++}
           domAttr.set('da_chart1','innerHTML','');
           domAttr.set('da_chart2','innerHTML','');
           domAttr.set('da_chart3','innerHTML','');
            var da_chart1 = new Chart("da_chart1");
            da_chart1.addPlot("plot_markers", {type: LinesPlot,markers: true, hAxis: "x",vAxis: "y",tension: "S",marker:"m-6,0 c0,-8 12,-8 12,0, m-12,0 c0,8 12,8 12,0"}); 
            da_chart1.addPlot("other", {type: LinesPlot,markers: true, hAxis: "x",vAxis: "other y",tension: "S",marker:"m-6,0 c0,-8 12,-8 12,0, m-12,0 c0,8 12,8 12,0"});   
            da_chart1.addPlot("default", {type: "Columns", gap: 2, width: 15, hAxis: "x",vAxis: "y",tension: "S", plotarea: { fill: "lightgrey" }});
            da_chart1.addAxis("x", { includeZero: false,natural: false, vertical: false, title: "Years", titleOrientation: "away",titleFont: "bold 10pt Avenir Light",font:"bold 8pt Arial",fontColor:"black",labels: daLabelsArray});
            da_chart1.addAxis("y", { vertical: true, enableCache: true,fixLower: "minor", fixUpper: "minor", title: "Annual Rainfall (mm)", titleFont: "bold 10pt Avenir Light",font:"bold 8pt Arial",fontColor:"black",minorTicks:true});
            da_chart1.addAxis("other y", {title: "SWA (ha m)",vertical: true,leftBottom: false,fixUpper: "major",fixLower:"minor",titleFont: "bold 10pt Avenir Light",font:"bold 8pt Arial",fontColor:"black"});
            da_chart1.addSeries("Yearly Rainfall Data", [rfYArray[8],rfYArray[9],rfYArray[10],rfYArray[11]],{plot: "default",color:"#1A5276",stroke: { color: "#1A5276",width: 1}}); //min: 
            da_chart1.addSeries("Premonsoon (2016-2019)",surfWater_PreArray,{ plot: "plot_markers" , color:"#2ebd09",stroke: { color: "#fcd322",width: 4} ,fill:"#fff"}); //min: 
            da_chart1.addSeries("Postmosoon (2016-2019)",surfWater_PostArray,{ plot: "other" , color:"#2ebd09",stroke: { color: "#2ebd09",width: 4},fill:"#fff" }); //min: 
            window.da_chart1=da_chart1;
            da_chart1.render();

            var da_chart2 = new Chart("da_chart2");
            da_chart2.addPlot("plot_markers", {type: LinesPlot,markers: true, hAxis: "x",vAxis: "y",tension: "S",marker:"m-6,0 c0,-8 12,-8 12,0, m-12,0 c0,8 12,8 12,0"}); 
            da_chart2.addPlot("other", {type: LinesPlot,markers: true, hAxis: "x",vAxis: "other y",tension: "S",marker:"m-6,0 c0,-8 12,-8 12,0, m-12,0 c0,8 12,8 12,0"}); 
            da_chart2.addPlot("default", {type: "Columns", gap: 2, width: 15, hAxis: "x",vAxis: "y",tension: "S", plotarea: { fill: "lightgrey" }});
            da_chart2.addAxis("x", { includeZero: false,natural: false,vertical: false, title: "Years", titleOrientation: "away",titleFont: "bold 10pt Avenir Light",font:"bold 8pt Arial",fontColor:"black",labels: daLabelsArray});
            da_chart2.addAxis("y", { vertical: true, enableCache: true,fixLower: "minor", fixUpper: "minor", title: "Annual Rainfall (mm)", titleFont: "bold 10pt Avenir Light",font:"bold 8pt Arial",fontColor:"black",minorTicks:true});
            da_chart2.addAxis("other y", {title: "Vegetation (%)",vertical: true,leftBottom: false,fixUpper: "major",fixLower:"minor",titleFont: "bold 10pt Avenir Light",font:"bold 8pt Arial",fontColor:"black"});
            da_chart2.addSeries("Yearly Rainfall Data", [rfYArray[8],rfYArray[9],rfYArray[10],rfYArray[11]],{plot: "default",color:"#1A5276",stroke: { color: "#1A5276",width: 1}}); //min: 
            da_chart2.addSeries("Premonsoon (2016-2019)",ndvi_PreArray,{ plot: "plot_markers" , color:"#fcd322",stroke: { color: "#fcd322",width: 4},fill:"#fff" }); //min: 
            da_chart2.addSeries("Postmosoon (2016-2019)",ndvi_PostArray,{ plot: "other" , color:"#2ebd09",stroke: { color: "#2ebd09",width: 4} ,fill:"#fff"}); //min: 
            // surfWater_PreArray
            window.da_chart2=da_chart2;
            da_chart2.render();
            // leftBottom: false, 
            var da_chart3 = new Chart("da_chart3");
            da_chart3.addPlot("plot_markers", {type: LinesPlot,markers: true, hAxis: "x",vAxis: "other y",tension: "S",marker: "m-6,0 c0,-8 12,-8 12,0, m-12,0 c0,8 12,8 12,0" }); 
            da_chart3.addPlot("other", {type: LinesPlot,markers: true, hAxis: "x",vAxis: "other y",tension: "S",marker: "m-6,0 c0,-8 12,-8 12,0, m-12,0 c0,8 12,8 12,0" }); 
            da_chart3.addPlot("default", {type: "Columns", gap: 2, width: 15, hAxis: "x",vAxis: "y",tension: "S", plotarea: { fill: "lightgrey" }});
            da_chart3.addAxis("x", {leftBottom: false,includeZero: false,natural: false,vertical: false, title: "Years", titleFont: "bold 10pt Avenir Light",font:"bold 8pt Arial",fontColor:"black",labels: daLabelsArray});
            da_chart3.addAxis("y", { vertical: true, fixLower: "minor", fixUpper: "major", title: "Annual Rainfall (mm)", titleFont: "bold 10pt Avenir Light",font:"bold 8pt Arial",fontColor:"black",minorTicks:true});
            da_chart3.addAxis("other y", {title: "GWL (mbgl)",vertical: true,leftBottom: false,fixUpper: "major",fixLower:"minor",titleFont: "bold 10pt Avenir Light",font:"bold 8pt Arial",fontColor:"black"});
            da_chart3.addSeries("Yearly Rainfall Data", [rfYArray[8],rfYArray[9],rfYArray[10],rfYArray[11]],{min: Number(Math.min.apply(null,[rfYArray[8],rfYArray[9],rfYArray[10],rfYArray[11]])) -100, plot: "default",color:"#1A5276",stroke: { color: "#1A5276",width: 1}}); //min: 
            da_chart3.addSeries("Premonsoon (2016-2019)", cgwl_PreArray,{plot: "plot_markers" , color:"#fcd322",stroke: { color: "#fcd322",width: 4},fill:"#fff" }); //min: 
            da_chart3.addSeries("Postmosoon (2016-2019)", cgwl_PostArray,{plot: "other" , color:"#2ebd09",stroke: { color: "#2ebd09",width: 4},fill:"#fff" }); //min: 
            window.da_chart3=da_chart3;
            da_chart3.render();

            // dataAnalysis_obj1 += dom.byId("dataAnalysis1").innerHTML;
            // dataAnalysis_obj2 += dom.byId("dataAnalysis2").innerHTML;
            // dataAnalysis_obj3 += dom.byId("dataAnalysis3").innerHTML;
            domAttr.set("da_chart1_legend","innerHTML",'<span style="width: 10px;height: 10px;border-radius:2em;background-color: #1A5276;color:#1A5276;padding:0px 12px 0px 0px;">.</span><b>&nbsp;Annual Rainfall</b><br><span style="width: 10px;height: 10px;border-radius:2em;background-color: #fcd322;color: #fcd322;padding:0px 12px 0px 0px;">.</span><b>&nbsp;SWA (Pre-monsoon)</b><br><span style="width: 10px;height: 10px;border-radius:2em;background-color: #2ebd09;color: #2ebd09;padding:0px 12px 0px 0px;">.</span><b>&nbsp;SWA (Post-monsoon)</b>')
            domAttr.set("da_chart2_legend","innerHTML",'<span style="width: 10px;height: 10px;border-radius:2em;background-color: #1A5276;color: #1A5276;padding:0px 12px 0px 0px;">.</span><b>&nbsp;Annual Rainfall</b><br><span style="width: 10px;height: 10px;border-radius:2em;background-color: #fcd322;color: #fcd322;padding:0px 12px 0px 0px;">.</span><b>&nbsp;NDVI (Pre-monsoon)</b><br><span style="width: 10px;height: 10px;border-radius:2em;background-color: #2ebd09;color: #2ebd09;padding:0px 12px 0px 0px;">.</span><b>&nbsp;NDVI(Post-monsoon)</b>')
            domAttr.set("da_chart3_legend","innerHTML",'<span style="width: 10px;height: 10px;border-radius:2em;background-color: #1A5276;color:#1A5276;padding:0px 12px 0px 0px;">.</span><b>&nbsp;Annual Rainfall</b><br><span style="width: 10px;height: 10px;border-radius:2em;background-color: #fcd322;color: #fcd322;padding:0px 12px 0px 0px;">.</span><b>&nbsp;GWL (Pre-monsoon)</b><br><span style="width: 10px;height: 10px;border-radius:2em;background-color: #2ebd09;color: #2ebd09;padding:0px 12px 0px 0px;">.</span><b>&nbsp;GWL (Post-monsoon)</b>')
            dataAnalysis_obj1 += dom.byId("dataAnalysis1").innerHTML;
            dataAnalysis_obj2 += dom.byId("dataAnalysis2").innerHTML;
            dataAnalysis_obj3 += dom.byId("dataAnalysis3").innerHTML;
            //rainfall
            // i = deviation_rainfall_wd[deviation_rainfall_wd.length-2]
            // gwl_oval = -(cgwl_PostArray[cgwl_PostArray.length-1])
            // gwl_dev = -(cgwl_PostArray[cgwl_PostArray.length-1]) - (-cgwl_PostArray[cgwl_PostArray.length-2])
            // swa_oval = Number(surfWater_PostArray[surfWater_PostArray.length-1])
            // swa_dev = surfWater_PostArray[surfWater_PostArray.length-1] - surfWater_PostArray[surfWater_PostArray.length-2]

            // ndvi_oval = Number(ndvi_PostArray[ndvi_PostArray.length-1])
            // ndvi_dev = ndvi_PostArray_abs[ndvi_PostArray_abs.length-1] - ndvi_PostArray_abs[ndvi_PostArray_abs.length-2]

            // window.rf_final = akah_Tool.gotoGetScore(Number(i),"","rainfall")
            // window.gwl_final = akah_Tool.gotoGetScore(Number(gwl_dev),Number(gwl_oval),"gwl")
            // window.swa_final = akah_Tool.gotoGetScore(Number(swa_dev),Number(swa_oval),"swa")
            // window.ndvi_final = akah_Tool.gotoGetScore(Number(ndvi_dev),Number(ndvi_oval),"ndvi")
            // window.weightedavgScoreAndClass= akah_Tool.getWeightedAverageClass((Number(rf_final.split(' ')[1])*0.25) + (Number(gwl_final.split(' ')[1])*0.25) + (Number(swa_final.split(' ')[1])*0.25) + (Number(ndvi_final.split(' ')[1])*0.25));
            // finalClassCondition = akah_Tool.gotoGetCondition(rf_final.split(' ')[0],gwl_final.split(' ')[0],swa_final.split(' ')[0],ndvi_final.split(' ')[0])
            // window.finalClassCondition=finalClassCondition
            assessment_water_res = {
            type: "html",
            data:
            "<p class='akah_level1_heading'>6.7 Assessment of Water Resources</p>"+
            "<p class='akah_level1_heading'>6.7.1 Surface Water Resources</p>"+
            "<div style='text-align: justify;font-size: 14px;margin-right: 30px;line-height: 1.5em;'>Rainfall, surface water availability/volume, vegetation, topography, climate, and other factors all have an impact on surface water resources. The following is an example of one of the relationships:</div>"+
            "<p class='akah_level1_heading'>6.7.1.1 Surface Water Availability (SWA) and Rainfall (2016-2019)</p>"+
            "<div style='display:inline-flex;'><div>"+dataAnalysis_obj1+
            // '<div style="padding-left:4%;padding-top:10px;font-size:11px;"><div style="width: 10px;height: 10px;border-radius:2em;background-color: #1A5276;"></div><b>&Annual Rainfall</b><div style="width: 10px;height: 10px;border-radius:2em;background-color: #fcd322;"></div><b>&nbsp;Surface Water Availability(Pre-monsoon)</b></div><div style="width: 10px;height: 10px;border-radius:2em;background-color: #2ebd09;"></div><b>&nbsp;Surface Water Availability(Post-monsoon)</b></div>'+
            // '<div style="padding-left:4%;padding-top:10px;font-size:11px;"><div style="width: 10px;height: 10px;border-radius:2em;background-color: #1A5276;"></div><b>&Annual Rainfall</b><div style="width: 10px;height: 10px;border-radius:2em;background-color: #fcd322;"></div><b>&nbsp;Surface Water Availability(Pre-monsoon)</b><div style="width: 10px;height: 10px;border-radius:2em;background-color: #2ebd09;"></div><b>&nbsp;Surface Water Availability(Post-monsoon)</b></div>'+
            // "</div><div style='margin-left:40px;'><img src='"+akah_Tool.folderUrl+"images/DataAnalysis_1.png' class='da_img_styles'></div><div style='width:350px;'><p class='da_p_styles'>Rainfall is a significant component in determining a region's surface water conditions.</p><p class='da_p_styles'>SWA and Rainfall are occasionally positively connected. SWA increases with an increase in rainfall in certain cases, and vice versa in others.</p><p class='da_p_styles'>The graph shows that the village has a declining tendency of SWA due to low rainfall in "+ (Math.min.apply(null,rfYArray)).toFixed(2)+" mm and an increasing trend in "+ (Math.max.apply(null,rfYArray)).toFixed(2)+" mm due to high rainfall.</p><p class='da_p_styles'>Also, compared to the pre-monsoon trend, post-monsoon SWA levels are greater due to increase in the growth of surface water by the contribution of rainfall.</p></div></div>"+
            "</div><div style='margin-left:40px;'><img src='"+akah_Tool.folderUrl+"images/DataAnalysis_3.png' class='da_img_styles'></div><div style='width:350px;'><p class='da_p_styles'>Rainfall is a significant component in determining a region's surface water conditions.</p><p class='da_p_styles'>SWA and Rainfall are occasionally positively connected. SWA increases with an increase in rainfall in certain cases, and vice versa in others.</p><p class='da_p_styles'>The graph shows that the village has a declining tendency of SWA due to low rainfall in "+rfMinYear+" and an increasing trend in "+ rfMaxYear+" due to high rainfall.</p><p class='da_p_styles'>Also, compared to the pre-monsoon trend, post-monsoon SWA levels are greater due to increase in the growth of surface water by the contribution of rainfall.</p></div></div>"+

            "<p class='akah_level1_heading'>6.7.1.2 Rainfall and Vegetation (2016-2019)</p>"+
            "<div style='display:inline-flex;'><div>"+dataAnalysis_obj2+
            // '<div style="padding-left:4%;padding-top:10px;font-size:11px;"><div style="width: 10px;height: 10px;border-radius:2em;background-color: #1A5276;"></div><b>&Annual Rainfall</b><div style="width: 10px;height: 10px;border-radius:2em;background-color: #fcd322;"></div><b>&nbsp;NDVI (Pre-monsoon)</b><div style="width: 10px;height: 10px;border-radius:2em;background-color: #2ebd09;"></div><b>&nbsp;NDVI(Post-monsoon)</b></div>'+
            // "</div><div style='margin-left:40px;'><img src='"+akah_Tool.folderUrl+"images/DataAnalysis_2.png' class='da_img_styles'></div><div style='width:350px;'><p class='da_p_styles'>Rainfall is a significant component in determining a region's vegetation(NDVI) conditions.</p><p class='da_p_styles'>Rainfall and NDVI are occasionally positively connected. NDVI increases with an increase in rainfall in certain cases, and vice versa in others.</p><p class='da_p_styles'>The graph shows that the village has a declining tendency of NDVI due to low rainfall in "+ (Math.min.apply(null,rfYArray)).toFixed(2)+" mm and an increasing trend in "+ (Math.max.apply(null,rfYArray)).toFixed(2)+" mm due to a lot of rain. </p><p class='da_p_styles'>Also, compared to the pre-monsoon trend, post-monsoon NDVI levels are greater due to increase in the growth of vegetation by the contribution of rainfall.</p></div></div>"+
            "</div><div style='margin-left:40px;'><img src='"+akah_Tool.folderUrl+"images/DataAnalysis_3.png' class='da_img_styles'></div><div style='width:350px;'><p class='da_p_styles'>Rainfall is a significant component in determining a region's vegetation(NDVI) conditions.</p><p class='da_p_styles'>Rainfall and NDVI are occasionally positively connected. NDVI increases with an increase in rainfall in certain cases, and vice versa in others.</p><p class='da_p_styles'>The graph shows that the village has a declining tendency of NDVI due to low rainfall in "+ rfMinYear+" and an increasing trend in "+ rfMaxYear+" due to a lot of rain. </p><p class='da_p_styles'>Also, compared to the pre-monsoon trend, post-monsoon NDVI levels are greater due to increase in the growth of vegetation by the contribution of rainfall.</p></div></div>",
           addPageBreak:true
          }
          assessment_water_res1 = {type:"html",data:
          "<p class='akah_level1_heading'>6.7.2 Ground Water Resources</p>"+
          "<div style='text-align: justify;font-size: 14px;margin-right: 30px;line-height: 1.5em;'>Ground water levels (GWL), Rainfall, water utilisation, climate all have an impact on ground water resources. The following is an example of one of the relationship:</div>"+
          "<p class='akah_level1_heading'>6.7.2.1 Ground Water Level (GWL)</p>"+
          "<div style='display:inline-flex;'><div>"+dataAnalysis_obj3+
          // '<div style="padding-left:4%;padding-top:10px;font-size:11px;"><div style="width: 10px;height: 10px;border-radius:2em;background-color: #1A5276;"></div><b>&Annual Rainfall</b><div style="width: 10px;height: 10px;border-radius:2em;background-color: #fcd322;"></div><b>&nbsp;GWL (Pre-monsoon)</b></div><div style="width: 10px;height: 10px;border-radius:2em;background-color: #2ebd09;"></div><b>&nbsp;GWL(Post-monsoon)</b></div>'+
          // '<div style="padding-left:4%;padding-top:10px;font-size:11px;"><div style="width: 10px;height: 10px;border-radius:2em;background-color: #1A5276;"></div><b>&Annual Rainfall</b><div style="width: 10px;height: 10px;border-radius:2em;background-color: #fcd322;"></div><b>&nbsp;GWL (Pre-monsoon)</b><div style="width: 10px;height: 10px;border-radius:2em;background-color: #2ebd09;"></div><b>&nbsp;GWL (Post-monsoon)</b></div>'+
          // "</div><div style='margin-left:40px;'><img src='"+akah_Tool.folderUrl+"images/DataAnalysis_3.png' class='da_img_styles'></div><div style='width:350px;'><p class='da_p_styles'>Rainfall is a significant component in determining a region's GWL conditions.</p><p class='da_p_styles'>GWL and Rainfall are occasionally positively connected. GWL increases with an increase in rainfall in certain cases, and vice versa in others.</p><p class='da_p_styles'>The graph indicates that the village's GWL is decreasing owing to insufficient rainfall in "+ (Math.min.apply(null,rfYArray)).toFixed(2)+" mm and increasing due to recharge from rainfall in "+ (Math.max.apply(null,rfYArray)).toFixed(2)+" mm.</p><p class='da_p_styles'> Also, compared to the pre-monsoon trend, post-monsoon water levels are greater due to increase in the natural replenishment of ground water resources.</p></div></div>",
          "</div><div style='margin-left:40px;'><img src='"+akah_Tool.folderUrl+"images/DataAnalysis_3.png' class='da_img_styles'></div><div style='width:350px;'><p class='da_p_styles'>Rainfall is a significant component in determining a region's GWL conditions.</p><p class='da_p_styles'>GWL and Rainfall are occasionally positively connected. GWL increases with an increase in rainfall in certain cases, and vice versa in others.</p><p class='da_p_styles'>The graph indicates that the village's GWL is decreasing owing to insufficient rainfall in "+rfMinYear+" and increasing due to recharge from rainfall in "+ rfMaxYear+".</p><p class='da_p_styles'> Also, compared to the pre-monsoon trend, post-monsoon water levels are greater due to increase in the natural replenishment of ground water resources.</p></div></div>",
          addPageBreak:true
        }
          waterDynamics = {
            type:"html",
            data:"<p class='akah_level1_heading'>6.8 Water Dynamics on "+akahvillage+" Village</p>"+
             "<img src='"+akah_Tool.folderUrl+"images/WaterFactors_wd.png' style='margin-left:24%;'>"+
            "<h2 style='text-align:center;font-size:17px;'>Weighted Average Score</h2>"+
             "<img src='"+akah_Tool.folderUrl+"images/RiskScale.png' style='margin-left:10%;'>"+
             "<h3 style='color:white;background-color:#323232;padding:10px;text-align:center;margin-left: 40%;border-radius: 1em;width: 100px;'>"+weightedavgScoreAndClass.split(",")[0]+" : "+weightedavgScoreAndClass.split(",")[1]+"</h3>"+
            //  "<h3 style='color:white;background-color:#323232;padding:10px;text-align:center;margin-left: 40%;border-radius: 1em;width: 100px;'>Fair : </h3>"+
             "<div style='display:inline-flex;'><div id='Rainfall_wd'><p style='text-align: center;margin-top: 33%;'>"+rf_final+"</p></div><div id='Groundwaterlevel_wd'><p style='text-align: center;margin-top: 33%;'>"+gwl_final+"</p></div><div id='Surfacewateravailability_wd'><p style='text-align: center;margin-top: 33%;'>"+swa_final+"</p></div><div id='Vegetation_wd'><p style='text-align: center;margin-top: 33%;'>"+ndvi_final+"</p></div></div>"+
             "<ul style='font-size: 15px;line-height: 1.8em;'><li>Weighted Average Method has been used to analyse the water conditions in the region. </li><li>It takes into account the relative importance and frequency of major water factors in a region such as rainfall, GWL, surface water availability and vegetation (NDVI). </li><li>Each factor is assigned a test score and weight based on its rate of deviation and importance to get the factor specific weighted value and the total weighted average score.</li><li>In this region Weighted Average Score for Rainfall is "+rf_final.split(' ')[1]+", GWL is "+gwl_final.split(' ')[1]+", Surface Water Availability is "+swa_final.split(' ')[1]+" and Vegetation (NDVI) is "+ndvi_final.split(' ')[1]+".</li><li>The overall weighted average score for these four components was "+weightedavgScoreAndClass.split(",")[1]+", indicating that the location has "+weightedavgScoreAndClass.split(',')[0]+" water conditions and is located in a "+advisoryResp.result[0].condition+" climate zone.</li></ul>",
            //  "<ul style='font-size: 15px;line-height: 1.8em;'><li>Each component of weighted average score necessitates a particular set of actions to be taken at the ground level.</li><li>Based on the weighted score of Rainfall, GWL, Surface Water Availability and Vegetation (NDVI) and the classifications it belongs to, the village communities can adopt the following management practices/actions.</li><li>Since there is an indication of a potential water supply problem to meet socio-economic and ecosystem needs. The following adaptive management actions can be taken :<ul><li>Water budgeting</li><li>Necessary conservation and management through construction of rainwater harvesting structures like deep continuous contour trenches, check dams, rooftop harvesting structures and percolation tanks</li><li>Plantation for soil and water conservation </li><li>Sprinkler and drip Irrigation </li><li>Conservation tillage for soil conservation and Regulatory actions on reductions in water draft for upto 30%.</li></li></ul>"
              addPageBreak:true
          }
          ad_statement="";
          for(var a =1;a<advisoryResp.result[0].statement.split('$').length;a++){
            ad_statement += "<p>"+advisoryResp.result[0].statement.split('$')[a]+"</p>";
          }
          adaptiveManagement = {
              type:"html",
            data:"<p class='akah_level1_heading'>6.9 Adaptive Management Actions for "+akahvillage+" Village</p>"+
           "<ul style='font-size: 15px;line-height: 1.7em;padding-top:10px;'><li>Each component of weighted average score necessitates a particular set of actions to be taken at the ground level.</li><li>Based on the weighted score of Rainfall, GWL, Surface Water Availability & Vegetation (NDVI) and the classifications it belongs to, the village communities can adopt the following management practices/actions.</li><li>"+advisoryResp.result[0].statement.split('$')[0]+ad_statement+"</li></ul>",
           addPageBreak:true
          }
          waterLinkage = {
            type:"html",
            data:"<p class='akah_level1_heading'>6.10 Water Linkages on "+akahvillage+" Village</p>"+
           "<img src='"+akah_Tool.folderUrl+"images/WaterLinkage.png' style='margin-left:8%;'>"+
           "<ul style='font-size: 15px;line-height: 1.7em;padding-top:10px;'><li>Understanding the relationship between hydrology, hydrogeology, surface water resources, ground water resources and vegetation can help explain the intricate interactions between climate change and the water cycle. </li><li>The village, which covers around "+rep_vil7_1+" hectares, is primarily made up of "+rep_val5+" with poor ground water production potential.</li><li>The water balance of the region is influenced by water availability, storage, draft and vegetation coverage, both in terms of quantity and quality. In "+rfMinYear+", the area received much less rainfall than the long-term average, impacting surface water resources, ground water resources and vegetation.</li><li>This distribution of water highlights the region's water challenges faced by its community. Meeting these challenges requires: integrated policies and adaptive management actions, national leadership, improved support for decision-making, a more strategic focus on planning for a sustainable future and new, reliable sources of financing.</li></ul>"+
           "<div style='padding:2% 2%;justify-content: center;align-items: center;margin-top: 38%;border-radius: 0.9em;'><span style='font-size:10pt;font-weight: bold;margin-left: 20%;font-style: italic;'>Designed and Developed by Geo Climate Risk Solutions Pvt. Ltd.</span></div>",
          }
          dataForReport.push(aoiText);
          dataForReport.push(coverpage_div);
          // dataForReport.push(rep_head);
          dataForReport.push(introduction_text1);
          dataForReport.push(introduction_text2);
          dataForReport.push(block_profile_text);
          dataForReport.push(watershed_text);
          // dataForReport.push(swr_text);
          dataForReport.push(geology_watershed_text);
          dataForReport.push(observation_wells_text);
          dataForReport.push(gnd_water_text);
          dataForReport.push(lulcBlockLevel);
          dataForReport.push(lulcBlockLevel_table);
          dataForReport.push(village_profile_text);
          dataForReport.push(rf_yearly_data);
          dataForReport.push(lulc_tableText);
          dataForReport.push(indices_tableText_ndvi);
          dataForReport.push(indices_tableText_ndwi);
          dataForReport.push(surf_grd_watr_avail);
          dataForReport.push(village_gnd_wtr_data);
          dataForReport.push(waterQuality_tableText);
          dataForReport.push(sensor_data);
          dataForReport.push(village_resources_text);
          dataForReport.push(village_resources_text1);
          dataForReport.push(village_resources_text2);
          dataForReport.push(assessment_water_res);
          dataForReport.push(assessment_water_res1);
          dataForReport.push(waterDynamics);
          dataForReport.push(adaptiveManagement);
          dataForReport.push(waterLinkage);
          // dataForReport.push(village_gnd_wtr_data);
          // dataForReport.push(rf_data);
          // dataForReport.push(waterQuality_tableText);
         
          dataForReport.push({
              "type": "note",
              "addPageBreak": false
          });

        //   on(document.getElementById("printButton"),"click", function(evt){
        //   alert();
        // });
          akah_Tool.reportDijitmethod();
          dojo.query("#pr_load").style("display","none");
          dojo.query("#pr_go_load").style("display","none");
          akah_Tool.reportDijit.print("", dataForReport);
          // akah_Tool.reportDijit.print("Water Governance Management Report", dataForReport);
          preData.length = 0;
          pre_fields.length = 0;
          //domAttr.set("FTLLineChartsReportInfo_dash","innerHTML","")
          dojo.query('#ndvi_chart_dash').style('display', 'none');
          dojo.query('#ndwi_chart_dash').style('display', 'none');
          dojo.query('#ndviarea_chart_dash').style('display', 'none');
          dojo.query('#ndwiarea_chart_dash').style('display', 'none');
          dojo.query('#villageLULC').style('display', 'none');
          dojo.query('#blockLULC').style('display', 'none');
          dojo.query('#vegetationIndices_chart').style('display', 'none');
          dojo.query('#waterIndices_chart').style('display', 'none');
          dojo.query('#gwr_graph2_module').style('display', 'none');
          dojo.query('#rfYearlyChartModule').style('display', 'none');

          //set map to the initial extent it was before generating the water governance report.
          akah_Tool.map.setExtent(akah_searchResponse.geometry.getExtent().expand(1.5))
    },
    gotoGetScore: function(dev,oval,cat){
      var final; var wdclass;
      switch(cat){
        case "rainfall" : 
              if(dev<0){
                if(dev<-45) final=0.25
                else final=(50+dev)/10
              }
              else{
                if(dev>30)final=10
                else final=dev*5/30+5
              }
              if(final<=0.25)final=0.25
              else final=final;
               wdclass = akah_Tool.getWDClass(Math.floor(final));
              return wdclass+ " "+Math.floor(final);
              break;
        case "gwl" : 
              if(oval>2.5){
                  if(dev<0){
                      if(dev<-6) final=0.25
                      else final=(6+dev)/6*5
                  }
                  else{
                      if(dev>6) final=10
                      else final=dev*5/6+5
                  }
                  if(final<=0.25) final=0.25
                  else final=final
                }
              else final=10
              wdclass = akah_Tool.getWDClass(Math.floor(final));
              return wdclass+ " "+Math.floor(final);
              break;
        case "swa" : 
              if(oval<=35){
                  if(dev<0){
                      if(dev<-50)final=0.25
                      else final=(50+dev)/10
                  }
                  else{
                      if(dev>50) final=10
                      else final=dev*5/50+5
                  }
                  if(final<=0.25) final=0.25
                  else final=final
                }
              else final=10
              wdclass = akah_Tool.getWDClass(Math.floor(final));
              return wdclass+ " "+Math.floor(final);
              break;
        case "ndvi":
              if(oval<=95){
                  if(dev<0){
                      if(dev<-300) final=0.25
                      else final=(300+dev)/60
                      }
                  else{
                    if(dev>300) final=10
                    else final=(dev*5/400)+5
                  }
                if(final<=0.25) final=0.25
                else final=final
              }
              else final=10
              wdclass = akah_Tool.getWDClass(Math.floor(final));
              return wdclass+ " "+Math.floor(final);
              break;
      }
    },
    getWDClass: function(final){
      var finalClass;
      switch(final){
        case 1:
        case 2:
        case 3:
              finalClass = "Low";return finalClass;break;
        case 4:
        case 5:
        case 6:
        case 7:
              finalClass = "Medium";return finalClass;break;
        case 8:
        case 9:
        case 10:
               finalClass = "High";return finalClass;break;
      }
    },
    getWeightedAverageClass: function(final){
      var finalClass;
      switch(Math.floor(final)){
        case 1:
        case 2:
              finalClass = "very Bad";return finalClass+","+final;break;
        case 3:
        case 4:
              finalClass = "Bad";return finalClass+","+final;break;
        case 5:
        case 6:
              finalClass = "Fair";return finalClass+","+final;break;
        case 7:
        case 8:
              finalClass = "Good";return finalClass+","+final;break;
        case 9:
        case 10:
              finalClass = "Very Good";return finalClass+","+final;break;
      }
    }, 
    gotoGetCondition: function(c1,c2,c3,c4){
      var finalClass;var SupPractices;
      if((c1 == "High" && c2 == "High"&& c3 == "High"&& c4 == "High")|| (c1 == "High" && c2 == "High"&& c3 == "High"&& c4 == "Medium")){
        finalClass = "Normal";
        SupPractices = "<li>Since there is sufficient water to meet human and ecosystem needs. The following support practices can be adopted: <p>1. Water budgeting</p><p>2. Supply to other places and</p><p>3. Water Intensive Crops can be grown</p></li>"
      }
      else if((c1 == "High" && c2 == "High"&& c3 == "Medium"&& c4 == "Medium")|| (c1 == "High" && c2 == "Medium"&& c3 == "Medium"&& c4 == "Medium")|| (c1 == "Medium" && c2 == "Medium"&& c3 == "Medium"&& c4 == "Medium")|| (c1 == "Medium" && c2 == "Medium"&& c3 == "Medium"&& c4 == "Low")|| (c1 == "Medium" && c2 == "Medium"&& c3 == "Low"&& c4 == "Low")|| (c1 == "Low" && c2 == "High"&& c3 == "High"&& c4 == "High")){
        finalClass = "Dry";
        SupPractices = "<li>Since there is an indication of a potential water supply problem to meet socioeconomic and ecosystem needs. The following support practices can be adopted: <p>1. Water budgeting</p><p>2.  Necessary conservation and management through construction of rainwater harvesting structures like deep continuous contour trenches, check dams, rooftop harvesting structures and percolation tanks</p><p>3. Plantation for soil and water conservation</p><p> 4. Sprinkler and drip Irrigation </p><p>5. Conservation tillage for soil conservation and </p><p>6. Regulatory actions on reductions in water draft for upto 30%</p></li>";
      }
      else if((c1 == "Low" && c2 == "Low"&& c3 == "High"&& c4 == "High")|| (c1 == "Medium" && c2 == "Low"&& c3 == "Low"&& c4 == "Low")){
        finalClass = "Very Dry";
        SupPractices = "<li>Since it is a potentially critical ecosystem and socio-economic impacts are possible, people can adopt the following practices: <p>1. Water budgeting</p><p>2.  Necessary conservation and management through construction of rainwater harvesting structures like deep continuous contour trenches, check dams, rooftop harvesting structures and percolation tanks</p><p>3. Plantation for soil and water conservation</p><p> 4. Sprinkler and drip Irrigation </p><p>5. Conservation tillage for soil conservation </p><p>6. Dry farming practices</p><p>7. Mixed Cropping System</p><p>8. Regulatory actions for maximum reductions in water draft</p></li>";
      }
      else if((c1 == "Low" && c2 == "Low"&& c3 == "Low"&& c4 == "Low")|| (c1 == "Low" && c2 == "Low"&& c3 == "Low"&& c4 == "High")){
        finalClass = "Extremely Dry";
        SupPractices = "<li>Since it is a very critical ecosystem with the potential for a complete loss of water supplies and socio-economic implications. The following support practices can be adopted: <p>1.Emergency Response to ensure health and safety</p><p>2. Water budgeting </p><p>3. Necessary conservation and management through construction of rainwater harvesting structures like deep continuous contour trenches, check dams, rooftop harvesting structures and percolation tanks</p><p>4. Plantation for soil and water conservation</p><p>5. Sprinkler and drip Irrigation </p><p>6. Conservation tillage for soil conservation </p><p>7. Dry farming practices</p><p>8. Mixed Cropping System</p><p>9. Regulatory actions for maximum reductions in water draft</p></li>";
      }
      return finalClass + "," + SupPractices;
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
      // if (dijit.byId('akah_vill').value != 'Select Village' && dijit.byId('akah_vill').value != "" &&  searchAkah.value != akahvillage) {
        if ( searchAkah.value != null) {
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
      dojo.query("#dashboardImgDiv").style("display","block");
      document.getElementsByClassName('bar_akah-inner')[0].dataset.percent = "0%"
          document.getElementsByClassName('bar_akah-inner')[0].style.width = "0%"
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
      akah_main_layer.setVisibility(false);
      akah_states_layer.setVisibility(true);
      akah_dist_layer.setVisibility(true);
      akah_block_layer.setVisibility(true);
      akah_villages_layer.setVisibility(false);
      akah_Tool.map._layers["Villages_Study_Area_684"].setLayerDefinitions(["1=1"])
      akah_total_villages.setVisibility(false);

      akah_Tool.map.graphics.clear()
      // domAttr.set("akahLocation_info","innerHTML",'')
      dojo.query('#akahLocation_info').style('display','none')
      domAttr.set("akahLulc_Chart","innerHTML","");
      if(bar_chart_2!= "")bar_chart_2.resize(0,0)
      if(ndwichart!= "")ndwichart.resize(0,0)
      if(ndvichart!= "")ndvichart.resize(0,0)
      if(akah_LULCchart!= "") akah_LULCchart.resize(0,0)
      if(rain_chart!= "") rain_chart.resize(0,0)
      if(stackedChart!="") stackedChart.resize(0,0)
      domAttr.set("lulc_legend","innerHTML","");
      dojo.setAttr('ndviLineCharts_info', 'innerHTML', '')
      dojo.setAttr('ndviareaLineCharts_info', 'innerHTML', '')
      dojo.setAttr('ndwiLineCharts_info', 'innerHTML', '')
      dojo.setAttr('ndwiareaLineCharts_info', 'innerHTML', '')
      dojo.setAttr('ecLineCharts_info', 'innerHTML', '')
      dojo.setAttr('cdomLineCharts_info', 'innerHTML', '')
      dojo.setAttr('grviLineCharts_info', 'innerHTML', '')
      dojo.setAttr('diLineCharts_info', 'innerHTML', '')
      domAttr.set("ndvi_legend","innerHTML",'')
      domAttr.set("ndwi_legend","innerHTML",'')
      domAttr.set("ec_legend","innerHTML",'')
      domAttr.set("grvi_legend","innerHTML",'')
      domAttr.set("cdom_legend","innerHTML",'')
      domAttr.set("di_legend","innerHTML",'')
      selectToMonth_SWB.attr('value', "Month")
      selectToYear_SWB.attr('value', "Year")
      selectMonth_Akah.attr('value', "Select")
      selectYear_Akah.attr('value', "Select")
      selectFromMonth_NDWI.attr('value', "Month")
      selectFromYear_NDWI.attr('value', "Year")
      selectToMonth_NDWI.attr('value', "Month")
      selectToYear_NDWI.attr('value', "Year")
      selectFromMonth_NDVI.attr('value', "Month")
      selectFromYear_NDVI.attr('value', "Year")
      selectToMonth_NDVI.attr('value', "Month")
      selectToYear_NDVI.attr('value', "Year")
      selectFromMonth_SWB.attr('value', "Month")
      selectFromYear_SWB.attr('value', "Year")
      selectToMonth_SWB.attr('value', "Month")
      selectToYear_SWB.attr('value', "Year")
      dojo.query('#ndwi_checkboxtable').style('display','none')
      dojo.query('#ndvi_checkboxtable').style('display','none')
      dojo.query('#village_level_info').style('display','none')
      domAttr.set('downloadAlertwl','innerHTML','');
      domAttr.set('downloadAlertwq','innerHTML','');
      domAttr.set("yearrangewarning_ndwi","innerHTML",'')
      domAttr.set("yearrangewarning_ndvi","innerHTML",'')
      domAttr.set("yearrangewarning_swb","innerHTML",'')
      dojo.setAttr('attribasedDILineCharts_info', 'innerHTML', '');
      dojo.query('#attribasedDI_legend').style('display','none')
      domAttr.set("phy_rec_potential_swb","innerHTML",'');
      domAttr.set("yearrangewarning_abswb","innerHTML",'')
      domAttr.set("lulc5yearPostM_agri", "innerHTML","")
      domAttr.set("lulc5yearPostM_lulc", "innerHTML","")
      domAttr.set("lulc5yearPreM_agri", "innerHTML","")
      domAttr.set("lulc5yearPreM_lulc", "innerHTML","")
      selectFromYear_ABSWB.attr('value', "Year")
      selectToYear_ABSWB.attr('value', "Year")
      dojo.query('#rfMonthlyChartLegend').style('display','none')
      dojo.query('#rfMonthlyChartLegendWithInd').style('display','none')
      domAttr.set("rfMonthlyChart","innerHTML","");
      domAttr.set("rfMonthlyChartWithInd","innerHTML","");
      domAttr.set("distVilltoRF","innerHTML",'');
      fromRFmonth_val.attr('value', "Month")
      fromRFYear_val.attr('value', "Year")
      toRFmonth_val.attr('value', "Month")
      toRFYear_val.attr('value', "Year")
      domAttr.set("yearrangewarning_rf","innerHTML",'')
      dijit.byId("show5yearCheckbox_LULC").setAttribute("checked",false)
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
      akah_Tool.resetAllLayers();
      dijit.byId('searchVillageAKAH').set('value','')
    },


    reportDijitmethod : function(){
        akah_Tool = this
        var logo, AKAH_ReportStylesheet;
        AKAH_ReportStylesheet = this.folderUrl + "css/AKAHReportStyles.css";
        logo = this.folderUrl + "/images/akah_logo.jpeg";
        window.logo = logo;
        // logo = this.folderUrl + "/images/Gcrs_logo.png";
        akah_Tool.reportDijit = new reportDijit({
          // reportLogo:  logo,
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

    downloadWL: function(){
     wellFilter.downloadWL();
    },

    downloadWQ: function(){
      wellFilter.downloadWQ();
    },

    clearGraphicsonMap: function(){
      akah_Tool.map.graphics.clear();
      domAttr.set("akahLulc_Chart","innerHTML","");
      domAttr.set("lulc_legend","innerHTML","");
      domAttr.set("ndwiLineCharts_info","innerHTML","");
      domAttr.set("ndwi_legend","innerHTML","");
      // domAttr.set("ndwi_checkboxtable","innerHTML","");
      // domAttr.set("ndviLineCharts_info","innerHTML","");
      dojo.query('#ndvi_checkboxtable').style('display','none')
      dojo.query('#ndwi_checkboxtable').style('display','none')
      domAttr.set("ndvi_legend","innerHTML","");
      domAttr.set("ndvi_checkboxtable","innerHTML","");
      // domAttr.set("ndvi_legend","innerHTML","");
      // domAttr.set("akahNdvi_Chart","innerHTML","");
      // domAttr.set('akahLocation_info','innerHTML','');
      dojo.query('#rfMonthlyChartLegend').style('display','none')
      dojo.query('#rfMonthlyChartLegendWithInd').style('display','none')
      domAttr.set("rfMonthlyChart","innerHTML","");
      domAttr.set("rfMonthlyChartWithInd","innerHTML","");
      domAttr.set("distVilltoRF","innerHTML","");
    },


    //GEE code from here
    visualize_layerlist: function(){
      window.akah_Tool = this;
      viz_layer_list = this.map.graphicsLayerIds;
      window.viz_layer_list = viz_layer_list;
      viz_init_map_extent = this.map.extent;
      window.viz_init_map_extent = viz_init_map_extent

      window.viz_loader = akah_Tool.folderUrl+'images/load.gif';
      window.viz_ndvi_monthly = akah_Tool.folderUrl+'images/ndvi_monthly_legend.png';
      window.viz_ndvi_5year = akah_Tool.folderUrl+'images/ndvi_5year_legend.png'
      window.viz_ndviwater_5year = akah_Tool.folderUrl + "images/5YearTrend_water_legend.png"
      dojo.byId('veg_monthly_legend').setAttribute('src', viz_ndvi_monthly)
      dojo.byId('veg_yearly_legend').setAttribute('src', viz_ndvi_5year)
      dojo.byId('veg_5year_legend').setAttribute('src', viz_ndvi_5year)
      dojo.byId("viz_loader").setAttribute('src', viz_loader);
      dojo.byId("viz_loader_1").setAttribute('src', viz_loader);
      dojo.byId("viz_loader_5").setAttribute('src', viz_loader);
      dojo.byId("viz_loader_w").setAttribute('src', viz_loader);
      dojo.byId("viz_loader_1w").setAttribute('src', viz_loader);
      dojo.byId("viz_loader_5w").setAttribute('src', viz_loader);
      dojo.byId("water_5year_legend").setAttribute('src', viz_ndviwater_5year);
      domAttr.set('water_monthly_legend', 'innerHTML', "<div style='width:19px;height:14px;border:1.6px solid black;border-radius:4px;background-color:blue;'></div>"+
      "<span style='padding-left:5px;'>Water<b>"+"</b></span></div>");
      domAttr.set('water_yearly_legend', 'innerHTML', "<div style='width:19px;height:14px;border:1.6px solid black;border-radius:4px;background-color:blue;'></div>"+
      "<span style='padding-left:5px;'>Water Change<b>"+"</b></span></div>");


       viz_layer_list.forEach(function(visualize_element){
          if(visualize_element.includes("CGWB_Water_Level_Wells")){
            gwm_station_layer = akah_Tool.map.getLayer(visualize_element);
            window.gwm_station_layer = gwm_station_layer;
          }
          else if(visualize_element.includes("selected_wells_primary")){
            akah_selectedwells_layer = akah_Tool.map.getLayer(visualize_element);
            window.akah_selectedwells_layer = akah_selectedwells_layer;
          }
          else if(visualize_element.includes("State_Boundaries")){
            akah_states_layer = akah_Tool.map.getLayer(visualize_element);
            window.akah_states_layer = akah_states_layer;
          }
          else if(visualize_element.includes("agakhan_districts")){
            viz_dist_layer = akah_Tool.map.getLayer(visualize_element);
            window.viz_dist_layer = viz_dist_layer;
          }
          else if(visualize_element.includes("agakhan_blocks")){
            viz_block_layer = akah_Tool.map.getLayer(visualize_element);
            window.viz_block_layer = viz_block_layer;
          }
          else if(visualize_element.includes("agakhan_Villages")){
            akah_villages_layer = akah_Tool.map.getLayer(visualize_element);
            window.akah_villages_layer = akah_villages_layer;
          }
          else if(visualize_element.includes("AKAH_Well_Registration")){
            viz_main_layer = akah_Tool.map.getLayer(visualize_element);
            window.viz_main_layer = viz_main_layer;
          }
      });
    },

    viz_dropdowns: function(){
      new Select({
        name: "Select Month",
        id: "month_selection"
      }, this.month_selct).startup();
      new Select({
        name: "Select Year",
        id: "year_selection"
      }, this.year_selct).startup();
      new Select({
        name: "Select Month",
        id: "month_selct1"
      }, this.year_month_selct).startup();
      new Select({
        name: "Select Year",
        id: "year_selection1"
      }, this.one_year_selct1).startup();

      new Select({
        name: "Select Year",
        id: "fiveYear_selection1"
      }, this.fiveYear_month).startup();
      new Select({
        name: "Select Year",
        id: "fiveYear_selection2"
      }, this.fiveYear_selct2).startup();

      //surface water-dropdowns for GEE visualization
      new Select({
        name: "Select Month",
        id: "month_selection_w"
      }, this.month_selct_w).startup();
      new Select({
        name: "Select Year",
        id: "year_selection_w"
      }, this.year_selct_w).startup();
      new Select({
        name: "Select Month",
        id: "month_selct1_w"
      }, this.year_month_selct_w).startup();
      new Select({
        name: "Select Year",
        id: "year_selection1_w"
      }, this.one_year_selct1_w).startup();

      new Select({
        name: "Select Year",
        id: "fiveYear_selection1_w"
      }, this.fiveYear_month_w).startup();
      new Select({
        name: "Select Year",
        id: "fiveYear_selection2_w"
      }, this.fiveYear_selct2_w).startup();

      /*vegetation dropdowns*/

      //month dropdown
      var viz_month = dijit.byId('month_selection')
      window.viz_month = viz_month;
      //year dropdown
      var viz_year = dijit.byId('year_selection')
      window.viz_year = viz_year;

      //1 year vegetation change month dropdown
      var viz_month_1year = dijit.byId('month_selct1')
      window.viz_month_1year = viz_month_1year;
      //1 year vegetation change previous year dropdown
      var viz_year1 = dijit.byId('year_selection1')
      window.viz_year1 = viz_year1;

      //5 year vegetation change previous year dropdown
      var viz_5year_month = dijit.byId('fiveYear_selection1')
      window.viz_5year_month = viz_5year_month;
      //5 year vegetation change current year dropdown
      var viz_5year2 = dijit.byId('fiveYear_selection2')
      window.viz_5year2 = viz_5year2;
      /*surface water dropdowns*/
      //month dropdown
      var viz_month_w = dijit.byId('month_selection_w')
      window.viz_month_w = viz_month_w;
      //year dropdown
      var viz_year_w = dijit.byId('year_selection_w')
      window.viz_year_w = viz_year_w;

      //1 year vegetation change month dropdown
      var viz_month_1year_w = dijit.byId('month_selct1_w')
      window.viz_month_1year_w = viz_month_1year_w;
      //1 year vegetation change previous year dropdown
      var viz_year1_w = dijit.byId('year_selection1_w')
      window.viz_year1_w = viz_year1_w;

      //5 year vegetation change previous year dropdown
      var viz_5year_month_w = dijit.byId('fiveYear_selection1_w')
      window.viz_5year_month_w = viz_5year_month_w;
      //5 year vegetation change current year dropdown
      var viz_5year2_w = dijit.byId('fiveYear_selection2_w')
      window.viz_5year2_w = viz_5year2_w;

      var districts = []; window.districts = districts;
      var blocks = [];window.blocks = blocks;
      var villages = []; window.villages=villages;

      var curr_date = new Date()
      if((curr_date.getMonth()==0)){curr_date.setMonth(11);curr_date.setYear(curr_date.getFullYear()-1)}
      else{curr_date.setMonth(curr_date.getMonth()-1)}
      window.current_year_month=curr_date.toLocaleString('default', { month: 'short' }).toLocaleUpperCase()
      window.current_year = curr_date.getFullYear()

      var viz_years = ['Select','2016'];window.viz_years = viz_years;
      for (var i = Number(viz_years[1])+1; i <= current_year; i++) {
        viz_years.push(i.toString())
      }
      var vizYear_map = viz_years.map(function(record){
              return dojo.create("option", {
                label: record,
                value: record
           })
      })
      var viz_1yearlist = ['Select'];window.viz_1yearlist = viz_1yearlist;
      for (var i = Number(viz_years[1]); i <= current_year-1; i++) {
        viz_1yearlist.push(i.toString()+'-'+(i+1).toString())
      }
      var viz1Year_map = viz_1yearlist.map(function(record){
              return dojo.create("option", {
                label: record,
                value: record
           })
      })
      var viz_5yearlist = ['Select'];window.viz_5yearlist = viz_5yearlist;
      for (var i = Number(viz_years[1]); i <= current_year-4; i++) {
        viz_5yearlist.push(i.toString()+'-'+(i+4).toString())
      }
      var viz5Year_map = viz_5yearlist.map(function(record){
              return dojo.create("option", {
                label: record,
                value: record
           })
      })

      viz_year.options.length = 0
      viz_year.addOption(vizYear_map)
      viz_year.attr('value', viz_years[0])
      viz_year1.options.length = 0
      viz_year1.addOption(viz1Year_map)
      viz_year1.attr('value', viz_1yearlist[0])
      viz_5year2.options.length = 0
      viz_5year2.addOption(viz5Year_map)
      viz_5year2.attr('value', viz_5yearlist[0])

      viz_year_w.options.length = 0
      viz_year_w.addOption(vizYear_map)
      viz_year_w.attr('value', viz_years[0])
      viz_year1_w.options.length = 0
      viz_year1_w.addOption(viz1Year_map)
      viz_year1_w.attr('value', viz_1yearlist[0])
      viz_5year2_w.options.length = 0
      viz_5year2_w.addOption(viz5Year_map)
      viz_5year2_w.attr('value', viz_5yearlist[0])

      var viz_months_list = {'0': "Select", '1': "Jan", '2': "Feb", '3': "Mar", '4': 'Apr', '5': "May", '6': "Jun", '7': "Jul", '8': 'Aug', '9': "Sep", '10': "Oct", '11': "Nov", '12': 'Dec'};window.viz_months_list = viz_months_list;
      var vizMonth_map = Object.entries(viz_months_list).map(function(record){
        return dojo.create("option", {
          label: record[1],
          value: record[0]
        })
      })
      viz_month.options.length = 0
      viz_month.addOption(vizMonth_map)
      viz_month.attr('value', Object.keys(viz_months_list)[0])
      viz_month_1year.options.length = 0
      viz_month_1year.addOption(vizMonth_map)
      viz_month_1year.attr('value', Object.keys(viz_months_list)[0])
      viz_5year_month.options.length = 0
      viz_5year_month.addOption(vizMonth_map)
      viz_5year_month.attr('value', Object.keys(viz_months_list)[0])

      viz_month_w.options.length = 0
      viz_month_w.addOption(vizMonth_map)
      viz_month_w.attr('value', Object.keys(viz_months_list)[0])
      viz_month_1year_w.options.length = 0
      viz_month_1year_w.addOption(vizMonth_map)
      viz_month_1year_w.attr('value', Object.keys(viz_months_list)[0])
      viz_5year_month_w.options.length = 0
      viz_5year_month_w.addOption(vizMonth_map)
      viz_5year_month_w.attr('value', Object.keys(viz_months_list)[0])

      // if(evt === "Select Village" || evt === ''){
      //   visualize_Tool._removeAllNodesBeforeCreation()
      // }

      var viz_vegetation = {
        title: "Vegetation",
        content: this.vegetation
      };

      var viz_water = {
        title: "Surface Water",
        content: this.water
      };

      window.classification = new TabContainer3({
        tabs: [viz_vegetation, viz_water]
      }, this.veg_water_cover);

      on(classification.tabItems[0], "click",function(){
          if (akah_sw1.visible === false) {
            akah_sw1.setVisibility(true)
          }
          //hide all vegetation & surfacewater layers  added
          Object.keys(tiles_layerlist).forEach(function(tile_key){
            if (tile_key.includes('Vegetation')) {
              tiles_layerlist[tile_key].setVisibility(true)
            }
            else if (tile_key.includes('Vegetation Change_')) {
              tiles_layerlist[tile_key].setVisibility(false)
            }
            else{
              tiles_layerlist[tile_key].setVisibility(false)
            }
          })
          Object.keys(vegetation_trend_layerlist).forEach(function(tile_key){
            vegetation_trend_layerlist[tile_key].setVisibility(false)
          })
          Object.keys(water_trend_layerlist).forEach(function(tile_key){
            water_trend_layerlist[tile_key].setVisibility(false)
          })

          /*criteria to be enabled when monthly radio button is checked in vegetation*/
          dojo.query("#vegetation_monthlyInfo").style("display","block");
          dojo.query(".monthly_change").style("display","block");
          //the below 1year & 5year related dropdowns ->> display none
          dojo.query(".yearly_change").style("display","none");
          dojo.query(".five_year_change").style("display","none");
          //below are layer information
          dojo.query("#vegetation_1yearInfo").style("display","none");
          dojo.query("#vegetation_5yearInfo").style("display","none");
          dojo.query("#water_monthlyInfo").style("display","none");
          dojo.query("#water_1yearInfo").style("display","none");
          dojo.query("#water_5yearInfo").style("display","none");

          /*when vegetation tab is selected, monthly analysis should be selected by default*/
          dijit.byId('month_classify_v').setChecked(true)
          dijit.byId('classify_1year_v').setChecked(false)
          dijit.byId('classify_5year_v').setChecked(false)

          /*surface water related radiobuttons should be unchecked*/
          dijit.byId('month_classify_w').setChecked(false)
          dijit.byId('classify_1year_w').setChecked(false)
          dijit.byId('classify_5year_w').setChecked(false)

          /*since monthly radio button is selected, layers related to monthly need to be switched on...*/
          akah_Tool._listSelected_layers_visibility('month_classify_v')
      })
      on(classification.tabItems[1], "click",function(){
          //hide all vegetation & surfacewater layers  added
          if (akah_sw1.visible === true) {
            akah_sw1.setVisibility(false)
          }
          Object.keys(tiles_layerlist).forEach(function(tile_key){
            if (tile_key.includes('Water')) {
              tiles_layerlist[tile_key].setVisibility(true)
            }
            else if (tile_key.includes('Water Change_')) {
              tiles_layerlist[tile_key].setVisibility(false)
            }
            else{
              tiles_layerlist[tile_key].setVisibility(false)
            }
          })
          Object.keys(vegetation_trend_layerlist).forEach(function(tile_key){
            vegetation_trend_layerlist[tile_key].setVisibility(false)
          })
          Object.keys(water_trend_layerlist).forEach(function(tile_key){
            water_trend_layerlist[tile_key].setVisibility(false)
          })
          /*when surface water tab is selected, monthly analysis should be selected by default*/
          dijit.byId('month_classify_w').setChecked(true)
          dijit.byId('classify_1year_w').setChecked(false)
          dijit.byId('classify_5year_w').setChecked(false)

          /*vegetation related radiobuttons should be unchecked*/
          dijit.byId('month_classify_v').setChecked(false)
          dijit.byId('classify_1year_v').setChecked(false)
          dijit.byId('classify_5year_v').setChecked(false)

          /*criteria to be enabled when monthly radio button is checked in surface water*/
          dojo.query("#water_monthlyInfo").style("display","block");
          dojo.query(".monthly_change").style("display","block");
          //the below 1year & 5year related dropdowns ->> display none
          dojo.query(".yearly_change").style("display","none");
          dojo.query(".five_year_change").style("display","none");
          //below are layer information
          dojo.query("#vegetation_monthlyInfo").style("display","none");
          dojo.query("#vegetation_1yearInfo").style("display","none");
          dojo.query("#vegetation_5yearInfo").style("display","none");
          dojo.query("#water_1yearInfo").style("display","none");
          dojo.query("#water_5yearInfo").style("display","none");

          /*since monthly radio button is selected, layers related to monthly need to be switched on...*/
          akah_Tool._listSelected_layers_visibility('month_classify_w')
      })
    },

    viz_radioSelection:function(){

      window.vegetation_input = {'monthly_layerArr_v':'', 'oneYear_layerArr_v':'', 'fiveYear_layerArr_v':'', 'fiveYearWater_layerArr_v':'', 'trend_array': ''};
      vegetation_input.monthly_layerArr_v = [];vegetation_input.oneYear_layerArr_v = [];vegetation_input.fiveYear_layerArr_v = [];
      vegetation_input.trend_array = [];

      window.water_input = {'monthly_layerArr_w':'', 'oneYear_layerArr_w':'', 'fiveYear_layerArr_w':'', 'trend_array': ''};
      water_input.monthly_layerArr_w = [];water_input.oneYear_layerArr_w = [];water_input.fiveYear_layerArr_w = [];
      water_input.trend_array = [];

      window.query_input = {'date_from': '', 'date_to': '', 'month_ndvi5': '', 'cloud_cover': 5, 'village_name': '', 'layerid': '', 'fullExtent': '', 'layerid_water': ''};
      window.tiles_layerlist = {};window.vegetation_trend_layerlist = {};window.water_trend_layerlist = {};

      window.outer_div = '';window.inner_div1 = '';window.inner_div2 = '';window.layer_nm = '';
      window.temp_var = '';window.api_url = '';window.inp_layer = '';
      window.classifyListNodes = ['vegetation_monthLayerlist', 'vegetation_1yearLayerlist', 'vegetation_5yearLayerlist',
                                  'water_monthLayerlist', 'water_1yearLayerlist', 'water_5yearLayerlist']
      window.trend_query = new Query();window.trend_whereVar = '';
      /*information dialog box to display 5-year trend analysis charts*/
      window.trendAnalysis_InfoDialog = new Dialog({
          id: 'trendAnalysis_DialogBox',
          title: "Trend Analysis",
          style: "width: 483px;height: 465px;background-color: #fff"
      });

      new RadioButton({checked: true, name:"classification_index_v", value:"Monthly"}, "month_classify_v").startup();
      new RadioButton({checked: false, name:"classification_index_v", value:"1year", disabled:false}, "classify_1year_v").startup();
      new RadioButton({checked: false, name:"classification_index_v", value:"5year", disabled:false}, "classify_5year_v").startup();
      new RadioButton({checked: false, name:"classification_index_w", value:"Monthly"}, "month_classify_w").startup();
      new RadioButton({checked: false, name:"classification_index_w", value:"1year", disabled:false}, "classify_1year_w").startup();
      new RadioButton({checked: false, name:"classification_index_w", value:"5year", disabled:false}, "classify_5year_w").startup();

      //below statements should appear on clicking add button for appropriate checkbox
      //change will be computed for last 1 year from the baseline year
      //change will be computed for last 5 years from the baseline year

      on(dom.byId("month_classify_v"),"change",function(evt){
        dojo.query("#vegetation_monthlyInfo").style("display","block");
        dojo.query(".monthly_change").style("display","block");
        //the below 1year & 5year related dropdowns ->> display none
        dojo.query(".yearly_change").style("display","none");
        dojo.query(".five_year_change").style("display","none");
        //below are layer information
        dojo.query("#vegetation_1yearInfo").style("display","none");
        dojo.query("#vegetation_5yearInfo").style("display","none");
        dojo.query("#water_monthlyInfo").style("display","none");
        dojo.query("#water_1yearInfo").style("display","none");
        dojo.query("#water_5yearInfo").style("display","none");
        if (tiles_layerlist!={}) {
          if (dijit.byId('month_selection').value != "Select" && dijit.byId('year_selection').value != "Select") {
            akah_Tool._listSelected_layers_visibility('month_classify_v')
          }
          else{
            Object.keys(tiles_layerlist).forEach(function(tile_layer){
              tiles_layerlist[tile_layer].setVisibility(false)
            })
          }
        }
      });
      on(dom.byId("classify_1year_v"),"change",function(evt){
        dojo.query("#vegetation_1yearInfo").style("display","block");
        dojo.query(".yearly_change").style("display","block");
        //the below monthly & 5year related dropdowns ->> display none
        dojo.query(".monthly_change").style("display","none");
        dojo.query(".five_year_change").style("display","none");
        //below are layer information
        dojo.query("#vegetation_monthlyInfo").style("display","none");
        dojo.query("#vegetation_5yearInfo").style("display","none");
        dojo.query("#water_monthlyInfo").style("display","none");
        dojo.query("#water_1yearInfo").style("display","none");
        dojo.query("#water_5yearInfo").style("display","none");
        if (tiles_layerlist!={}) {
          if (dijit.byId('month_selct1').value != "Select" && dijit.byId('year_selection1').value != "Select") {
            akah_Tool._listSelected_layers_visibility('classify_1year_v')
          }
          else{
            Object.keys(tiles_layerlist).forEach(function(tile_layer){
              tiles_layerlist[tile_layer].setVisibility(false)
            })
          }
        }
      });
      on(dom.byId("classify_5year_v"),"change",function(evt){
        dojo.query("#vegetation_5yearInfo").style("display","block");
        dojo.query(".five_year_change").style("display","block");
        //the below monthly & 1year related dropdowns ->> display none
        dojo.query(".monthly_change").style("display","none");
        dojo.query(".yearly_change").style("display","none");
        //below are layer information
        dojo.query("#vegetation_monthlyInfo").style("display","none");
        dojo.query("#vegetation_1yearInfo").style("display","none");
        dojo.query("#water_monthlyInfo").style("display","none");
        dojo.query("#water_1yearInfo").style("display","none");
        dojo.query("#water_5yearInfo").style("display","none");
        if (tiles_layerlist!={}) {
          if (dijit.byId('fiveYear_selection1').value != "Select" && dijit.byId('fiveYear_selection2').value != "Select") {
            akah_Tool._listSelected_layers_visibility('classify_5year_v')
          }
          else{
            Object.keys(tiles_layerlist).forEach(function(tile_layer){
              tiles_layerlist[tile_layer].setVisibility(false)
            })
          }
        }
      });
      on(dom.byId("month_classify_w"),"change",function(evt){
        dojo.query("#water_monthlyInfo").style("display","block");
        dojo.query(".monthly_change").style("display","block");
        //the below 1year & 5year related dropdowns ->> display none
        dojo.query(".yearly_change").style("display","none");
        dojo.query(".five_year_change").style("display","none");
        //below are layer information
        dojo.query("#vegetation_monthlyInfo").style("display","none");
        dojo.query("#vegetation_1yearInfo").style("display","none");
        dojo.query("#vegetation_5yearInfo").style("display","none");
        dojo.query("#water_1yearInfo").style("display","none");
        dojo.query("#water_5yearInfo").style("display","none");
        if (tiles_layerlist!={}) {
          if (dijit.byId('month_selection_w').value != "Select" && dijit.byId('year_selection_w').value != "Select") {
            akah_Tool._listSelected_layers_visibility('month_classify_w')
          }
          else{
            Object.keys(tiles_layerlist).forEach(function(tile_layer){
              tiles_layerlist[tile_layer].setVisibility(false)
            })
          }
        }
      });
      on(dom.byId("classify_1year_w"),"change",function(evt){
        dojo.query("#water_1yearInfo").style("display","block");
        dojo.query(".yearly_change").style("display","block");
        //the below monthly & 5year related dropdowns ->> display none
        dojo.query(".monthly_change").style("display","none");
        dojo.query(".five_year_change").style("display","none");
        //below are layer information
        dojo.query("#vegetation_monthlyInfo").style("display","none");
        dojo.query("#vegetation_1yearInfo").style("display","none");
        dojo.query("#vegetation_5yearInfo").style("display","none");
        dojo.query("#water_monthlyInfo").style("display","none");
        dojo.query("#water_5yearInfo").style("display","none");
        if (tiles_layerlist!={}) {
          if (dijit.byId('month_selct1_w').value != "Select" && dijit.byId('year_selection1_w').value != "Select") {
            akah_Tool._listSelected_layers_visibility('classify_1year_w')
          }
          else{
            Object.keys(tiles_layerlist).forEach(function(tile_layer){
              tiles_layerlist[tile_layer].setVisibility(false)
            })
          }
        }
      });
      on(dom.byId("classify_5year_w"),"change",function(evt){
        dojo.query("#water_5yearInfo").style("display","block");
        dojo.query(".five_year_change").style("display","block");
        //the below monthly & 1year related dropdowns ->> display none
        dojo.query(".monthly_change").style("display","none");
        dojo.query(".yearly_change").style("display","none");
        //below are layer information
        dojo.query("#vegetation_monthlyInfo").style("display","none");
        dojo.query("#vegetation_1yearInfo").style("display","none");
        dojo.query("#vegetation_5yearInfo").style("display","none");
        dojo.query("#water_monthlyInfo").style("display","none");
        dojo.query("#water_1yearInfo").style("display","none");
        if (tiles_layerlist!={}) {
          if (dijit.byId('fiveYear_selection1_w').value != "Select" && dijit.byId('fiveYear_selection2_w').value != "Select") {
            akah_Tool._listSelected_layers_visibility('classify_5year_w')
          }
          else{
            Object.keys(tiles_layerlist).forEach(function(tile_layer){
              tiles_layerlist[tile_layer].setVisibility(false)
            })
          }
        }
      });

      window.viz_dialog = new Dialog({
        title: "Information",
        style: "width:400px;"
      });
    },

    _listSelected_layers_visibility: function(check_param){
        if (tiles_layerlist!={}) {
          Object.keys(tiles_layerlist).forEach(function(key_layer){
              // if (key_layer.includes('Vegetation') && classification.getSelectedTitle() === "Surface Water") {
              //   tiles_layerlist[key_layer].setVisibility(false)
              // }
              // if (key_layer.includes('Water') && classification.getSelectedTitle() === "Vegetation"){
              //   tiles_layerlist[key_layer].setVisibility(false)
              // }
              if (key_layer.includes('Vegetation') && classification.getSelectedTitle() === "Vegetation") {
                if (dijit.byId('month_classify_v').checked === true) {
                    if (key_layer.slice(key_layer.length-5).includes('-')) {
                      var q = key_layer.slice(key_layer.length-5).split('-')
                      if(Number(q[1])-Number(q[0]) === 1){
                        tiles_layerlist[key_layer].setVisibility(false)
                      }
                      if(Number(q[1])-Number(q[0]) === 4){
                        tiles_layerlist[key_layer].setVisibility(false)
                        var new_keylayer = key_layer.replace('Vegetation Change_', 'Surface Water - ')
                        tiles_layerlist[new_keylayer].setVisibility(false)
                      }
                    }
                    else{
                      tiles_layerlist[key_layer].setVisibility(true)
                    }
                }
                if (dijit.byId('classify_1year_v').checked === true) {
                    if (key_layer.slice(key_layer.length-5).includes('-')) {
                      var q = key_layer.slice(key_layer.length-5).split('-')
                      if(Number(q[1])-Number(q[0]) === 1){
                        tiles_layerlist[key_layer].setVisibility(true)
                      }
                      // if(Number(q[1])-Number(q[0]) === 4)
                      else{
                        tiles_layerlist[key_layer].setVisibility(false)
                        var new_keylayer = key_layer.replace('Vegetation Change_', 'Surface Water - ')
                        tiles_layerlist[new_keylayer].setVisibility(false)
                      }
                    }
                    else{
                      tiles_layerlist[key_layer].setVisibility(false)
                    }
                }
                if (dijit.byId('classify_5year_v').checked === true) {
                    if (key_layer.slice(key_layer.length-5).includes('-')) {
                      var q = key_layer.slice(key_layer.length-5).split('-')
                      if(Number(q[1])-Number(q[0]) === 4){
                        tiles_layerlist[key_layer].setVisibility(true)
                        var new_keylayer = key_layer.replace('Vegetation Change_', 'Surface Water - ')
                        tiles_layerlist[new_keylayer].setVisibility(true)
                      }
                      // if(Number(q[1])-Number(q[0]) === 1)
                      else{
                        tiles_layerlist[key_layer].setVisibility(false)
                      }
                    }
                    else{
                      tiles_layerlist[key_layer].setVisibility(false)
                    }
                }
              }
              if (key_layer.includes('Water') && classification.getSelectedTitle() === "Surface Water"){
                if (dijit.byId('month_classify_w').checked === true) {
                    if (key_layer.slice(key_layer.length-5).includes('-')) {
                      var q = key_layer.slice(key_layer.length-5).split('-')
                      if(Number(q[1])-Number(q[0]) === 1){
                        tiles_layerlist[key_layer].setVisibility(false)
                      }
                      if(Number(q[1])-Number(q[0]) === 4){
                        tiles_layerlist[key_layer].setVisibility(false)
                      }
                    }
                    else{
                      tiles_layerlist[key_layer].setVisibility(true)
                    }
                }
                if (dijit.byId('classify_1year_w').checked === true) {
                    if (key_layer.slice(key_layer.length-5).includes('-')) {
                      var q = key_layer.slice(key_layer.length-5).split('-')
                      if(Number(q[1])-Number(q[0]) === 1){
                        tiles_layerlist[key_layer].setVisibility(true)
                      }
                      // if(Number(q[1])-Number(q[0]) === 4)
                      else{
                        tiles_layerlist[key_layer].setVisibility(false)
                      }
                    }
                    else{
                      tiles_layerlist[key_layer].setVisibility(false)
                    }
                }
                if (dijit.byId('classify_5year_w').checked === true) {
                    if (key_layer.slice(key_layer.length-5).includes('-')) {
                      var q = key_layer.slice(key_layer.length-5).split('-')
                      if(Number(q[1])-Number(q[0]) === 4){
                        tiles_layerlist[key_layer].setVisibility(true)
                      }
                      // if(Number(q[1])-Number(q[0]) === 1)
                      else{
                        tiles_layerlist[key_layer].setVisibility(false)
                      }
                    }
                    else{
                      tiles_layerlist[key_layer].setVisibility(false)
                    }
                }
              }
          })
        }
    },

    addLayertoMap: function(){
      if ((akahstate != 'Select State' && akahdistrict != 'Select District' && akahblock != 'Select Block' && akahvillage != 'Select Village')||
        (akah_searchResponse.attributes.state != '' && akah_searchResponse.attributes.district != '' && akah_searchResponse.attributes.block != '' && akah_searchResponse.attributes.village != '')) {
          domAttr.set('viz_dropdown_alert', 'innerHTML', '');
          if (dijit.byId('month_classify_v').checked === true && classification.getSelectedTitle() === "Vegetation") {
            dojo.query('#viz_loader').style('display','block');
            if (dijit.byId('month_selection').value != "Select" && dijit.byId('year_selection').value != "Select") {
              temp_var = akah_Tool._getMonth(dijit.byId('month_selection').value, dijit.byId('year_selection').value).split(',')
              if (vegetation_input.monthly_layerArr_v.includes('Vegetation - '+temp_var[0]+' - '+dijit.byId('year_selection').value)) {
                domAttr.set('viz_dropdown_alert', 'innerHTML', '<p style="text-align:center;color:red;font-size:11px;">Image for '+'Vegetation - '+temp_var[0]+' - '+dijit.byId('year_selection').value+' is already added.</p>');
                dojo.query('#viz_loader').style('display','none');
              }
              else{
                domAttr.set('viz_dropdown_alert', 'innerHTML', '');
                vegetation_input.monthly_layerArr_v.push('Vegetation - '+temp_var[0]+' - '+dijit.byId('year_selection').value);//monthly
                query_input.date_from = dijit.byId('year_selection').value+'-'+dijit.byId('month_selection').value+'-'+temp_var[1];
                query_input.date_to = dijit.byId('year_selection').value+'-'+dijit.byId('month_selection').value+'-'+temp_var[2];
                query_input.village_name = akah_searchResponse.attributes.village
                query_input.layerid = 'Vegetation - '+temp_var[0]+' - '+dijit.byId('year_selection').value
                api_url = 'https://geomonitor.co.in/gee/api/ndvi/monthly';
                akah_Tool._getUrlfromGEE(query_input, api_url, vegetation_input.monthly_layerArr_v, 'month_vegetation', 'month_vegtId', 'vegetation_monthLayerlist');
              }
            }
            else{}
          }
          if (dijit.byId('classify_1year_v').checked === true && classification.getSelectedTitle() === "Vegetation") {
            dojo.query('#viz_loader_1').style('display','block');
            if (dijit.byId('month_selct1').value != "Select" && dijit.byId('year_selection1').value != "Select") {
              temp_var = akah_Tool._getMonth(dijit.byId('month_selct1').value, dijit.byId('year_selection1').value.replace('-',',')).split(',')
              if (vegetation_input.oneYear_layerArr_v.includes('Vegetation - '+temp_var[0]+' - '+temp_var[2]+'-'+temp_var[3].slice(temp_var.length-2))) {
                domAttr.set('viz_dropdown_alert', 'innerHTML', '<p style="text-align:center;color:red;font-size:11px;">Image for '+'Vegetation - '+temp_var[0]+' - '+temp_var[2]+'-'+temp_var[3].slice(temp_var.length-2)+' is already added.</p>');
                dojo.query('#viz_loader_1').style('display','none');
              }
              else{
                domAttr.set('viz_dropdown_alert', 'innerHTML', '');
                vegetation_input.oneYear_layerArr_v.push('Vegetation - '+temp_var[0]+' - '+temp_var[2]+'-'+temp_var[3].slice(temp_var.length-2));//1-year
                query_input.date_from = temp_var[2];
                query_input.date_to = temp_var[3];
                query_input.village_name = akah_searchResponse.attributes.village
                query_input.layerid = 'Vegetation - '+temp_var[0]+' - '+temp_var[2]+'-'+temp_var[3].slice(temp_var.length-2)
                api_url = 'https://geomonitor.co.in/gee/api/ndvi/monthly';
                akah_Tool._getUrlfromGEE(query_input, api_url, vegetation_input.oneYear_layerArr_v, 'oneYear_vegetation', 'oneYear_vegtId', 'vegetation_1yearLayerlist');
              }
            }
            else{}
          }
          if (dijit.byId('classify_5year_v').checked === true && classification.getSelectedTitle() === "Vegetation") {
            dojo.query('#viz_loader_5').style('display','block');
            if (dijit.byId('fiveYear_selection1').value != "Select" && dijit.byId('fiveYear_selection2').value != "Select") {
              temp_var = akah_Tool._getMonth(dijit.byId('fiveYear_selection1').value, dijit.byId('fiveYear_selection2').value.replace('-',',')).split(',')
              if (vegetation_input.oneYear_layerArr_v.includes('Vegetation - '+temp_var[0]+' - '+temp_var[2]+'-'+temp_var[3].slice(temp_var.length-2))) {
                domAttr.set('viz_dropdown_alert', 'innerHTML', '<p style="text-align:center;color:red;font-size:11px;">Image for '+'Vegetation - '+temp_var[0]+' - '+temp_var[2]+'-'+temp_var[3].slice(temp_var.length-2)+' is already added.</p>');
                dojo.query('#viz_loader_5').style('display','none');
              }
              else{
                domAttr.set('viz_dropdown_alert', 'innerHTML', '');
                vegetation_input.fiveYear_layerArr_v.push('Vegetation Change_'+temp_var[0]+' - '+temp_var[2]+'-'+temp_var[3].slice(temp_var.length-2));//5-year
                query_input.date_from = temp_var[2];
                query_input.date_to = temp_var[3];
                query_input.village_name = akah_searchResponse.attributes.village
                query_input.month_ndvi5 = temp_var[0]
                query_input.layerid = 'Vegetation Change_'+temp_var[0]+' - '+temp_var[2]+'-'+temp_var[3].slice(temp_var.length-2)
                query_input.layerid_water = 'Surface Water - '+temp_var[0]+' - '+temp_var[2]+'-'+temp_var[3].slice(temp_var.length-2)
                api_url = 'https://geomonitor.co.in/gee/api/ndvi/trend/5';
                akah_Tool._getUrlfromGEE(query_input, api_url, vegetation_input.fiveYear_layerArr_v, 'fiveYear_vegetation', 'fiveYear_vegtId', 'vegetation_5yearLayerlist');
              }
            }
            else{}
          }
          if (dijit.byId('month_classify_w').checked === true && classification.getSelectedTitle() === "Surface Water") {
            dojo.query('#viz_loader_w').style('display','block');
            if (dijit.byId('month_selection_w').value != "Select" && dijit.byId('year_selection_w').value != "Select") {
              temp_var = akah_Tool._getMonth(dijit.byId('month_selection_w').value, dijit.byId('year_selection_w').value).split(',')
              if (water_input.monthly_layerArr_w.includes('Water - '+temp_var[0]+' - '+dijit.byId('year_selection_w').value)) {
                domAttr.set('viz_dropdown_alert', 'innerHTML', '<p style="text-align:center;color:red;font-size:11px;">Image for '+'Water - '+temp_var[0]+' - '+dijit.byId('year_selection').value+' is already added.</p>');
                dojo.query('#viz_loader_w').style('display','none');
              }
              else{
                domAttr.set('viz_dropdown_alert', 'innerHTML', '');
                water_input.monthly_layerArr_w.push('Water - '+temp_var[0]+' - '+dijit.byId('year_selection_w').value);//monthly
                query_input.date_from = dijit.byId('year_selection_w').value+'-'+dijit.byId('month_selection_w').value+'-'+temp_var[1];
                query_input.date_to = dijit.byId('year_selection_w').value+'-'+dijit.byId('month_selection_w').value+'-'+temp_var[2];
                query_input.village_name = akah_searchResponse.attributes.village
                query_input.layerid = 'Water - '+temp_var[0]+' - '+dijit.byId('year_selection_w').value
                api_url = 'https://geomonitor.co.in/gee/api/awei/monthly';
                akah_Tool._getUrlfromGEE(query_input, api_url, water_input.monthly_layerArr_w, 'month_water', 'month_waterId', 'water_monthLayerlist');
              }
              // water_input.monthly_layerArr_w.push('Water - '+akah_Tool._getMonth(dijit.byId('month_selection').value, dijit.byId('year_selection').value)+' - '+dijit.byId('year_selection').value);//monthly
              // akah_Tool._createCheckList_forLayers(water_input.monthly_layerArr_w, 'month_water', 'month_waterId', 'water_monthLayerlist')
            }
            else{}
          }
          if (dijit.byId('classify_1year_w').checked === true && classification.getSelectedTitle() === "Surface Water") {
            dojo.query('#viz_loader_1w').style('display','block');
            if (dijit.byId('month_selct1_w').value != "Select" && dijit.byId('year_selection1_w').value != "Select") {
              temp_var = akah_Tool._getMonth(dijit.byId('month_selct1_w').value, dijit.byId('year_selection1_w').value.replace('-',',')).split(',')
              if (water_input.oneYear_layerArr_w.includes('Water Change_'+temp_var[0]+' - '+temp_var[2]+'-'+temp_var[3].slice(temp_var.length-2))) {
                domAttr.set('viz_dropdown_alert', 'innerHTML', '<p style="text-align:center;color:red;font-size:11px;">Image for '+'Water Change_'+temp_var[0]+' - '+temp_var[2]+'-'+temp_var[3].slice(temp_var.length-2)+' is already added.</p>');
                dojo.query('#viz_loader_1w').style('display','none');
              }
              else{
                domAttr.set('viz_dropdown_alert', 'innerHTML', '');
                water_input.oneYear_layerArr_w.push('Water Change_'+temp_var[0]+' - '+temp_var[2]+'-'+temp_var[3].slice(temp_var.length-2));//1-year
                query_input.date_from = temp_var[2];
                query_input.date_to = temp_var[3];
                query_input.village_name = akah_searchResponse.attributes.village
                query_input.layerid = 'Water Change_'+temp_var[0]+' - '+temp_var[2]+'-'+temp_var[3].slice(temp_var.length-2)
                api_url = 'https://geomonitor.co.in/gee/api/awei/monthly';
                akah_Tool._getUrlfromGEE(query_input, api_url, water_input.oneYear_layerArr_w, 'oneYear_water', 'oneYear_waterId', 'water_1yearLayerlist');
              }
            }
            else{}
            // water_input.oneYear_layerArr_w.push('Water Change_'+akah_Tool._getMonth(dijit.byId('month_selct1').value)+'_'+dijit.byId('year_selection1').value+'-'+dijit.byId('year_selection2').value.slice(dijit.byId('year_selection2').value.length-2));//1-year
            // akah_Tool._createCheckList_forLayers(water_input.oneYear_layerArr_w, 'oneYear_water', 'oneYear_waterId', 'water_1yearLayerlist')
          }
          if (dijit.byId('classify_5year_w').checked === true && classification.getSelectedTitle() === "Surface Water") {
            dojo.query('#viz_loader_5w').style('display','block');
            if (dijit.byId('fiveYear_selection1_w').value != "Select" && dijit.byId('fiveYear_selection2_w').value != "Select") {
              temp_var = akah_Tool._getMonth(dijit.byId('fiveYear_selection1_w').value, dijit.byId('fiveYear_selection2_w').value.replace('-',',')).split(',')
              if (water_input.fiveYear_layerArr_w.includes('Water Change_'+temp_var[0]+' - '+temp_var[2]+'-'+temp_var[3].slice(temp_var.length-2))) {
                domAttr.set('viz_dropdown_alert', 'innerHTML', '<p style="text-align:center;color:red;font-size:11px;">Image for '+'Water Change_'+temp_var[0]+' - '+temp_var[2]+'-'+temp_var[3].slice(temp_var.length-2)+' is already added.</p>');
                dojo.query('#viz_loader_5w').style('display','none');
              }
              else{
                domAttr.set('viz_dropdown_alert', 'innerHTML', '');
                water_input.fiveYear_layerArr_w.push('Water Change_'+temp_var[0]+' - '+temp_var[2]+'-'+temp_var[3].slice(temp_var.length-2));//5-year
                query_input.date_from = temp_var[2];
                query_input.date_to = temp_var[3];
                query_input.village_name = akah_searchResponse.attributes.village
                query_input.month_ndvi5 = temp_var[0]
                query_input.layerid = 'Water Change_'+temp_var[0]+' - '+temp_var[2]+'-'+temp_var[3].slice(temp_var.length-2)
                // query_input.layerid_water = 'Surface Water - '+temp_var[0]+' - '+temp_var[2]+'-'+temp_var[3].slice(temp_var.length-2)
                api_url = 'https://geomonitor.co.in/gee/api/awei/trend/5';
                akah_Tool._getUrlfromGEE(query_input, api_url, water_input.fiveYear_layerArr_w, 'fiveYear_water', 'fiveYear_waterId', 'water_5yearLayerlist');
              }
              // water_input.fiveYear_layerArr_w.push('Water Change_'+dijit.byId('fiveYear_selection1').value+'-'+dijit.byId('fiveYear_selection2').value.slice(dijit.byId('fiveYear_selection2').value.length-2));//5-year
              // akah_Tool._createCheckList_forLayers(water_input.fiveYear_layerArr_w, 'fiveYear_water', 'fiveYear_waterId', 'water_5yearLayerlist')
            }
            else{}
          }
          //set the layer visible when set to active(no opacity must be applied/opacity-1)
          //play animation-> recent year to current year
          //in a span of 2, 2+1 milli sec opacity should increase from 0-1
      }
      else{
        domAttr.set('viz_dropdown_alert', 'innerHTML', '<p style="text-align:center;color:red;font-size:11px;">please select appropriate location....</p>')
      }
    },

    _getUrlfromGEE: function(query_inp, apiUrl, inputlayerArr, out_divId, inner_divId, showLayerDiv_id){
        if (dijit.byId('classify_5year_v').checked === true || dijit.byId('classify_5year_w').checked === true) {
          query = {
              date_from: query_inp.date_from,
              date_to: query_inp.date_to,
              month_ndvi5: query_inp.month_ndvi5.toLowerCase(),
              cloud_cover: query_inp.cloud_cover,
              village_name: query_inp.village_name,
          };
        }
        else{
          query = {
              date_from: query_inp.date_from,
              date_to: query_inp.date_to,
              cloud_cover: query_inp.cloud_cover,
              village_name: query_inp.village_name,
          };
        }
        var url = apiUrl;
        url+='?';
        Object.keys(query).forEach(function(f){
          url+=(f+'='+query[f]+'&');
        });
        window.final_url=url.slice(0,url.length-1);
        fetch(final_url).then(function(res){
            return res.json();
        }).then(function(resp){
            window.resp = resp;
            if (resp.url != null || resp.url != undefined) {
                resp.url = resp.url.replace('{x}','{col}');
                resp.url = resp.url.replace('{y}','{row}');
                resp.url = resp.url.replace('{z}','{level}');
                tiles_layerlist[query_inp.layerid] = new esri.layers.WebTiledLayer(resp.url, {
                    fullExtent: query_input.fullExtent,
                    id: query_inp.layerid,
                    visible: true
                });
                akah_Tool.map.addLayer(tiles_layerlist[query_inp.layerid]);
                //for addition of surfacewater layer but it should not be visible in the vegetation layers list
                if (dijit.byId('classify_5year_v').checked === true) {
                    resp.url_sw = resp.url_sw.replace('{x}','{col}');
                    resp.url_sw = resp.url_sw.replace('{y}','{row}');
                    resp.url_sw = resp.url_sw.replace('{z}','{level}');
                    tiles_layerlist[query_inp.layerid_water] = new esri.layers.WebTiledLayer(resp.url_sw, {
                        fullExtent: query_input.fullExtent,
                        id: query_inp.layerid_water,
                        visible: true
                    });
                    akah_Tool.map.addLayer(tiles_layerlist[query_inp.layerid_water]);
                    akah_Tool._getLayers_5yearTrend(resp.url_timelapse, showLayerDiv_id)
                }
                if (dijit.byId('classify_5year_w').checked === true) {
                  akah_Tool._getLayers_5yearTrend(resp.url_timelapse, showLayerDiv_id)
                }

                akah_Tool._createCheckList_forLayers(inputlayerArr, out_divId, inner_divId, showLayerDiv_id)
            }
            else{
                viz_dialog.set("content", "<div><p style='font-size: 16px;font-weight: 600;'>Cloud free Images are not available for this in selected time period.</p>"+"</div>");
                viz_dialog.show();
                dojo.query('#viz_loader').style('display','none');
                dojo.query('#viz_loader_1').style('display','none');
                dojo.query('#viz_loader_5').style('display','none');
                dojo.query('#viz_loader_w').style('display','none');
                dojo.query('#viz_loader_1w').style('display','none');
                dojo.query('#viz_loader_5w').style('display','none');
                akah_Tool._regenerateCheckList_forLayers(out_divId, query_inp.layerid)
            }
        });
    },

    _getLayers_5yearTrend: function(timelapse_url_list, showLayerDiv_id){
      Object.keys(timelapse_url_list).forEach(function(key){
        timelapse_url_list[key] = timelapse_url_list[key].replace('{x}','{col}');
        timelapse_url_list[key] = timelapse_url_list[key].replace('{y}','{row}');
        timelapse_url_list[key] = timelapse_url_list[key].replace('{z}','{level}');
        if (showLayerDiv_id.includes('vegetation')) {
          vegetation_trend_layerlist['Vegetation_Timelapse_'+query_input.month_ndvi5+key] = new esri.layers.WebTiledLayer(timelapse_url_list[key], {
              fullExtent: query_input.fullExtent,
              id: 'Vegetation_Timelapse_'+query_input.month_ndvi5+key,
              visible: false
          });
          akah_Tool.map.addLayer(vegetation_trend_layerlist['Vegetation_Timelapse_'+query_input.month_ndvi5+key]);
        }
        else if (showLayerDiv_id.includes('water')){
          water_trend_layerlist['Water_Timelapse_'+query_input.month_ndvi5+key] = new esri.layers.WebTiledLayer(timelapse_url_list[key], {
              fullExtent: query_input.fullExtent,
              id: 'Water_Timelapse_'+query_input.month_ndvi5+key,
              visible: false
          });
          akah_Tool.map.addLayer(water_trend_layerlist['Water_Timelapse_'+query_input.month_ndvi5+key]);
        }
      })
    },

    _getMonth: function(month_val, year_val){
        if (year_val.length === 4) {
          function getYear(year){
            if (year%4===0) {
              return 29
            }
            else{
              return 28
            }
          }
          switch(month_val){
              case "1": return "Jan,1,31";break;
              case "2": return "Feb,1," + getYear(Number(year_val));break;
              case "3": return "Mar,1,31";break;
              case "4": return "Apr,1,30";break;
              case "5": return "May,1,31";break;
              case "6": return "Jun,1,30";break;
              case "7": return "Jul,1,31";break;
              case "8": return "Aug,1,31";break;
              case "9": return "Sep,1,30";break;
              case "10": return "Oct,1,31";break;
              case "11": return "Nov,1,30";break;
              case "12": return "Dec,1,31";break;
          }
        }
        else{
          switch(month_val){
              case "1": return "Jan,1,"+year_val;break;
              case "2": return "Feb,1,"+year_val;break;
              case "3": return "Mar,1,"+year_val;break;
              case "4": return "Apr,1,"+year_val;break;
              case "5": return "May,1,"+year_val;break;
              case "6": return "Jun,1,"+year_val;break;
              case "7": return "Jul,1,"+year_val;break;
              case "8": return "Aug,1,"+year_val;break;
              case "9": return "Sep,1,"+year_val;break;
              case "10": return "Oct,1,"+year_val;break;
              case "11": return "Nov,1,"+year_val;break;
              case "12": return "Dec,1,"+year_val;break;
          }
        }
    },

    _createCheckList_forLayers: function(inputlayerArr, out_divId, inner_divId, showLayerDiv_id){
      if (inputlayerArr.length!=0) {
          window.inputlayerArr = inputlayerArr;window.out_divId = out_divId;
          window.inner_divId = inner_divId;window.showLayerDiv_id = showLayerDiv_id;

          if(outer_div != "" || outer_div != ''){
            akah_Tool._clearNodeBeforeCreation('#'+showLayerDiv_id)
          }
          for (var i = 0; i < inputlayerArr.length; i++) {
              var role = inputlayerArr[i];
              outer_div = dojo.create("div",{id:out_divId+i,'class':'layer_operate'});
              inner_div1 = dojo.create("div",{innerHTML:'<input id="'+inner_divId+i+'" title="Layer On/Off" value="'+role+'" dojoType="dijit.form.CheckBox" type="checkbox" checked style="width: 15px;height: 15px;" /> <label for="'+inner_divId+i+'" style="vertical-align: top;">'+role+'</label>'}, outer_div);
              if (dijit.byId('month_classify_v').checked === true || dijit.byId('month_classify_w').checked === true) {
                inner_div1.className = "innerdiv1";
                inner_div2 = dojo.create("div",{innerHTML:'<input id="'+inner_divId+'_slider_'+i+'" title="Slider" type="range" min="0" max="10" value="10" step="1" class="custom-range" style="margin-left: 7px;" />'+
                  '<img id="'+inner_divId+i+'_remove" class="layer_remove" title="Remove layer" src="'+akah_Tool.folderUrl+"images/close_icon_gee.png"+'" >'+
                  '<img id="'+inner_divId+i+'_info" class="layer_information" title="Layer Info" src="https://geomonitor.co.in/images/info.jpg" >'});
                inner_div2.className = "innerdiv2"
              }
              else if (dijit.byId('classify_5year_v').checked === true || dijit.byId('classify_5year_w').checked === true) {
                inner_div1.className = "innerdiv1_5"
                inner_div2 = dojo.create("div",{innerHTML:'<input id="'+inner_divId+'_slider_'+i+'" title="Slider" type="range" min="0" max="10" value="10" step="1" class="custom-range" style="margin-left: 7px;" />'+
                  '<img id="'+inner_divId+i+'_remove" class="layer_remove" title="Remove layer" src="'+akah_Tool.folderUrl+"images/close_icon_gee.png"+'" style="width:18px;height:18px;" >'+
                  '<img id="'+inner_divId+i+'_play" class="layer_play" title="play/pause" src="'+akah_Tool.folderUrl+"images/layer_timelapse.png"+'" style="width:18px;height:18px;" >'+
                  '<img id="'+inner_divId+i+'_info" class="layer_information" title="Layer Info" src="https://geomonitor.co.in/images/info.jpg" style="width:18px;height:18px;margin-bottom: 1px;" >'+
                  '<img id="'+inner_divId+i+'_Trendcharts"  class="layer_play" title="Show Trend Analysis Chart" src="'+akah_Tool.folderUrl+"images/trendChartIcon.png"+'" style="width:18px;height:18px;margin-bottom: 1px;" >'});
                inner_div2.className = "innerdiv2"
                if(dijit.byId('classify_5year_v').checked === true){vegetation_input.trend_array.push(inputlayerArr[i])}
                if(dijit.byId('classify_5year_w').checked === true){water_input.trend_array.push(inputlayerArr[i])}
              }
              else{
                inner_div1.className = "innerdiv1";
                inner_div2 = dojo.create("div",{innerHTML:'<input id="'+inner_divId+'_slider_'+i+'" title="Slider" type="range" min="0" max="10" value="10" step="1" class="custom-range" style="margin-left: 7px;" />'+
                  '<img id="'+inner_divId+i+'_remove" class="layer_remove" title="Remove layer" src="'+akah_Tool.folderUrl+"images/close_icon_gee.png"+'" >'+
                  '<img id="'+inner_divId+i+'_info" class="layer_information" title="Layer Info" src="https://geomonitor.co.in/images/info.jpg" >'});
                inner_div2.className = "innerdiv2"
              }
              dojo.place(inner_div2, inner_div1, "after");
              if(i == 0){
                dojo.place(outer_div, showLayerDiv_id, "first");
              }
              else{
                dojo.place(outer_div, out_divId+(i-1), "before");
              }
              on(dom.byId(inner_divId+"_slider_"+i), "input",function(evt){
                layer_nm = evt.path[0].id.split('_');
                layer_nm = layer_nm[0]+"_"+layer_nm[1]+layer_nm[3]
                akah_Tool._onSliderChange(layer_nm, dom.byId(evt.path[0].id).value)
              });
              on(dom.byId(inner_divId+i), "click", function(evt){
                if (dom.byId(evt.path[0].id).checked === true) {
                  akah_Tool._onLayerChecked(evt.path[0].id, true)
                }
                else{
                  akah_Tool._onLayerChecked(evt.path[0].id, false)
                }
              });
              on(dom.byId(inner_divId+i+"_remove"),"click",function(evt){
                akah_Tool._removeLayer(evt.path[0].id)
              });
              on(dom.byId(inner_divId+i+"_info"),"click",function(evt){
                akah_Tool._provideLayerInformation(evt)
              });
              if (dijit.byId('classify_5year_v').checked === true || dijit.byId('classify_5year_w').checked === true) {
                on(dom.byId(inner_divId+i+"_play"), "click",function(evt){
                  layer_nm = evt.path[0].id.split('_');
                  layer_nm = layer_nm[0]+"_"+layer_nm[1]
                  var fiveYear_month = document.getElementById(layer_nm).value.slice(document.getElementById(layer_nm).value.length-13,document.getElementById(layer_nm).value.length-10)
                  window.trend_month = akah_Tool._getMonthIndex(document.getElementById(layer_nm).value.slice(document.getElementById(layer_nm).value.length-13,document.getElementById(layer_nm).value.length-10))
                  window.trend_year1 = document.getElementById(layer_nm).value.slice(document.getElementById(layer_nm).value.length-7).split('-')[0]
                  window.trend_year2 = "20"+document.getElementById(layer_nm).value.slice(document.getElementById(layer_nm).value.length-7).split('-')[1]
                  if (dijit.byId('classify_5year_v').checked && classification.getSelectedTitle() === "Vegetation") {
                    window.vegetation_temp_list = {};
                    Object.keys(vegetation_trend_layerlist).forEach(function(v_layer){
                      if (v_layer.includes(fiveYear_month)) {
                        vegetation_temp_list[v_layer] = vegetation_trend_layerlist[v_layer]
                      }
                    })
                    akah_Tool._trendCharts_for5yearVegetationInfo(Number(trend_year1),Number(trend_year2),Number(trend_month), "play_5yearTrend", layer_nm, vegetation_temp_list);
                  }
                  else if (dijit.byId('classify_5year_w').checked && classification.getSelectedTitle() === "Surface Water") {
                    window.water_temp_list = {};
                    Object.keys(water_trend_layerlist).forEach(function(w_layer){
                      if (w_layer.includes(fiveYear_month)) {
                        water_temp_list[w_layer] = water_trend_layerlist[w_layer]
                      }
                    })
                    akah_Tool._trendCharts_for5yearSurfaceWaterInfo(Number(trend_year1),Number(trend_year2),Number(trend_month), "play_5yearTrend", layer_nm, water_temp_list)
                  }
                });
                on(dom.byId(inner_divId+i+"_Trendcharts"),"click",function(evt){
                  layer_nm = evt.path[0].id.split('_');
                  layer_nm = layer_nm[0]+"_"+layer_nm[1]
                  var fiveYear_month = document.getElementById(layer_nm).value.slice(document.getElementById(layer_nm).value.length-13,document.getElementById(layer_nm).value.length-10)
                  window.trend_month = akah_Tool._getMonthIndex(document.getElementById(layer_nm).value.slice(document.getElementById(layer_nm).value.length-13,document.getElementById(layer_nm).value.length-10))
                  window.trend_year1 = document.getElementById(layer_nm).value.slice(document.getElementById(layer_nm).value.length-7).split('-')[0]
                  window.trend_year2 = "20"+document.getElementById(layer_nm).value.slice(document.getElementById(layer_nm).value.length-7).split('-')[1]
                  if (dijit.byId('classify_5year_v').checked && classification.getSelectedTitle() === "Vegetation") {
                    window.vegetation_temp_list = {};
                    Object.keys(vegetation_trend_layerlist).forEach(function(v_layer){
                      if (v_layer.includes(fiveYear_month)) {
                        vegetation_temp_list[v_layer] = vegetation_trend_layerlist[v_layer]
                      }
                    })
                    akah_Tool._trendCharts_for5yearVegetationInfo(Number(trend_year1),Number(trend_year2),Number(trend_month), "show_Trendchart", layer_nm, vegetation_temp_list);
                  }
                  else if (dijit.byId('classify_5year_w').checked && classification.getSelectedTitle() === "Surface Water") {
                    window.water_temp_list = {};
                    Object.keys(water_trend_layerlist).forEach(function(w_layer){
                      if (w_layer.includes(fiveYear_month)) {
                        water_temp_list[w_layer] = water_trend_layerlist[w_layer]
                      }
                    })
                    akah_Tool._trendCharts_for5yearSurfaceWaterInfo(Number(trend_year1),Number(trend_year2),Number(trend_month), "show_Trendchart", layer_nm, water_temp_list)
                  }
                });
              }
          }
          dojo.query('#viz_loader').style('display','none');
          dojo.query('#viz_loader_1').style('display','none');
          dojo.query('#viz_loader_5').style('display','none');
          dojo.query('#viz_loader_w').style('display','none');
          dojo.query('#viz_loader_1w').style('display','none');
          dojo.query('#viz_loader_5w').style('display','none');
      }
      else if (inputlayerArr.length===0){
        if(outer_div != "" || outer_div != ''){
          akah_Tool._clearNodeBeforeCreation('#'+showLayerDiv_id)
        }
      }
    },

    _getMonthIndex: function(month_name){
        switch(month_name){
            case "Jan": return "1";break;
            case "Feb": return "2";break;
            case "Mar": return "3";break;
            case "Apr": return "4";break;
            case "May": return "5";break;
            case "Jun": return "6";break;
            case "Jul": return "7";break;
            case "Aug": return "8";break;
            case "Sep": return "9";break;
            case "Oct": return "10";break;
            case "Nov": return "11";break;
            case "Dec": return "12";break;
        }
    },

    _trendCharts_for5yearVegetationInfo: function(fromYear_5yt, toYear_5yt, month_5yt, play_5yearVar, trendYearId, temp_layerList){
        trend_query.where = ""
        // trend_whereVar = akah_Tool.getQueryStrBtnYears(Number(fromYear_5yt),Number(toYear_5yt), Number(month_5yt), Number(month_5yt));
        trend_query.where = "village like '"+akah_searchResponse.attributes.village+"' AND month="+month_5yt+" AND year between "+fromYear_5yt+" AND "+toYear_5yt;
        trend_query.returnDistinctValues = false;
        trend_query.returnGeometry = true;
        trend_query.orderByFields = ["year ASC"];
        trend_query.outFields = ["village_pk","month","year","dense_percent","sparse_percent","low_percentage"]

        new QueryTask(ndvi_statistics_url).execute(trend_query, function(ndvi_trend_response){
            trendInfo_ndvidateLabels=[];window.trendInfo_ndvidateLabels=trendInfo_ndvidateLabels;
            trendInfo_ndvi_densearray=[];window.trendInfo_ndvi_densearray=trendInfo_ndvi_densearray;
            trendInfo_ndvi_sparsearray=[];window.trendInfo_ndvi_sparsearray=trendInfo_ndvi_sparsearray;
            trendInfo_ndvi_lowarray=[];window.trendInfo_ndvi_lowarray=trendInfo_ndvi_lowarray;
            ndvi_trend_response.features.forEach(function(trendInfo_ndvi_resp, trendInfo_ndvi_index){
                ndvi_trend_response.fields.forEach(function(evt, index){
                  var fieldname = evt.name;
                  if (fieldname.includes("year") ||fieldname.includes("month")|| fieldname.includes("min")||fieldname.includes("max")||fieldname.includes("mean")||fieldname.includes("stddev")||fieldname.includes("dense_percent")||fieldname.includes("sparse_percent")||fieldname.includes("low_percentage")){
                    if(fieldname.includes("year") || fieldname.includes("month")){
                      if(fieldname.includes("month")&& trendInfo_ndvi_resp.attributes[fieldname] != ""){
                        trendInfo_ndvidateLabels.push({text:akah_Tool.month_function(trendInfo_ndvi_resp.attributes.month), value:trendInfo_ndvi_index+1})
                      }
                      if(fieldname.includes("year")&& trendInfo_ndvi_resp.attributes[fieldname] != ""){
                        trendInfo_ndvidateLabels[trendInfo_ndvi_index].text = trendInfo_ndvidateLabels[trendInfo_ndvi_index].text + "_"+trendInfo_ndvi_resp.attributes.year
                      }
                    }
                    else if(fieldname.includes("dense_percent") && trendInfo_ndvi_resp.attributes[fieldname] != null)
                    {trendInfo_ndvi_densearray.push(trendInfo_ndvi_resp.attributes[fieldname]);}
                    else if(fieldname.includes("sparse_percent") && trendInfo_ndvi_resp.attributes[fieldname] != null)
                    {trendInfo_ndvi_sparsearray.push(trendInfo_ndvi_resp.attributes[fieldname]);}
                    else if(fieldname.includes("low_percentage") && trendInfo_ndvi_resp.attributes[fieldname] != null)
                    {trendInfo_ndvi_lowarray.push(trendInfo_ndvi_resp.attributes[fieldname]);}
                  }
                });
            });

            window.temp_array = [];
            temp_array.push(trendInfo_ndvi_densearray);
            temp_array.push(trendInfo_ndvi_sparsearray);
            temp_array.push(trendInfo_ndvi_lowarray);

            if (Math.sign(Number(trendInfo_ndvi_densearray[trendInfo_ndvi_densearray.length-1]) - Number(trendInfo_ndvi_densearray[0])) === -1) {
              window.densePer_info = '<div class="akah_wellRegistration" style="flex: 1;padding-left: 15px;padding-right: 20px;margin-top: 8px;white-space: nowrap;font-size: 14px;">'+
                          '<div><span><b>'+(Number(trendInfo_ndvi_densearray[trendInfo_ndvi_densearray.length-1]) - Number(trendInfo_ndvi_densearray[0])).toFixed(2)+'</b>'+
                          '&nbsp;<span><img src="'+fall_arrow+'" style="width: 10px;height: 14px;" alt=fall_image"/></span>'+
                          '</span>'+
                          '</div></div>';
            }
            else if (Math.sign(Number(trendInfo_ndvi_densearray[trendInfo_ndvi_densearray.length-1]) - Number(trendInfo_ndvi_densearray[0])) === 1) {
              window.densePer_info = '<div class="akah_wellRegistration" style="flex: 1;padding-left: 15px;padding-right: 20px;margin-top: 8px;white-space: nowrap;font-size: 14px;">'+
                          '<div><span><b>'+(Number(trendInfo_ndvi_densearray[trendInfo_ndvi_densearray.length-1]) - Number(trendInfo_ndvi_densearray[0])).toFixed(2)+'</b>'+
                          '&nbsp;<span><img src="'+rise_arrow+'" style="width: 10px;height: 14px;" alt="rise_image"/></span>'+
                          '</span>'+
                          '</div></div>';
            }
            if (Math.sign(Number(trendInfo_ndvi_sparsearray[trendInfo_ndvi_sparsearray.length-1]) - Number(trendInfo_ndvi_sparsearray[0])) === -1) {
              window.sparsePer_info = '<div class="akah_wellRegistration" style="flex: 1;padding-left: 70px;margin-top: 8px;white-space: nowrap;font-size: 14px;">'+
                          '<div><span><b>'+(Number(trendInfo_ndvi_sparsearray[trendInfo_ndvi_sparsearray.length-1]) - Number(trendInfo_ndvi_sparsearray[0])).toFixed(2)+'</b>'+
                          '&nbsp;<span><img src="'+fall_arrow+'" style="width: 10px;height: 14px;" alt=fall_image"/></span>'+
                          '</span>'+
                          '</div></div>';
            }
            else if (Math.sign(Number(trendInfo_ndvi_sparsearray[trendInfo_ndvi_sparsearray.length-1]) - Number(trendInfo_ndvi_sparsearray[0])) === 1) {
              window.sparsePer_info = '<div class="akah_wellRegistration" style="flex: 1;padding-left: 70px;margin-top: 8px;white-space: nowrap;font-size: 14px;">'+
                          '<div><span><b>'+(Number(trendInfo_ndvi_sparsearray[trendInfo_ndvi_sparsearray.length-1]) - Number(trendInfo_ndvi_sparsearray[0])).toFixed(2)+'</b>'+
                          '&nbsp;<span><img src="'+rise_arrow+'" style="width: 10px;height: 14px;" alt="rise_image"/></span>'+
                          '</span>'+
                          '</div></div>';
            }
            if (Math.sign(trendInfo_ndvi_lowarray[trendInfo_ndvi_lowarray.length-1] - trendInfo_ndvi_lowarray[0]) === -1) {
              window.lowPer_info = '<div class="akah_wellRegistration" style="flex: 1;margin-left: 100px;margin-top: 8px;white-space: nowrap;font-size: 14px;">'+
                          '<div><span><b>'+(Number(trendInfo_ndvi_lowarray[trendInfo_ndvi_lowarray.length-1]) - Number(trendInfo_ndvi_lowarray[0])).toFixed(2)+'</b>'+
                          '&nbsp;<span><img src="'+fall_arrow+'" style="width: 10px;height: 14px;" alt=fall_image"/></span>'+
                          '</span>'+
                          '</div></div>';
            }
            else if (Math.sign(trendInfo_ndvi_lowarray[trendInfo_ndvi_lowarray.length-1] - trendInfo_ndvi_lowarray[0]) === 1) {
              window.lowPer_info = '<div class="akah_wellRegistration" style="flex: 1;margin-left: 100px;margin-top: 8px;white-space: nowrap;font-size: 14px;">'+
                          '<div><span><b>'+(Number(trendInfo_ndvi_lowarray[trendInfo_ndvi_lowarray.length-1]) - Number(trendInfo_ndvi_lowarray[0])).toFixed(2)+'</b>'+
                          '&nbsp;<span><img src="'+rise_arrow+'" style="width: 10px;height: 14px;" alt="rise_image"/></span>'+
                          '</span>'+
                          '</div></div>';
            }

            domAttr.set('ndvi_trend_chart','innerHTML','');
            dojo.query('#ndvi_trendInfo').style('display', 'block');

            window.trend_ndvichart = new Chart("ndvi_trend_chart");
            trend_ndvichart.addPlot("default", {type: LinesPlot,markers: true,tension: "S",marker: "m-3,0 c0,-4 6,-4 6,0 m-6,0 c0,4 6,4 6,0" });
            trend_ndvichart.addPlot("trendline", {type: LinesPlot,markers: false,tension: "S"});
            trend_ndvichart.addAxis("x", { includeZero: false, fixLower: "major", fixUpper: "major", natural: false, vertical: false, rotation: 0, title: "Date", titleFontColor: "black",
            labels: trendInfo_ndvidateLabels, titleOrientation: "away", majorLabels: true,majorTicks:true,majorTickStep:1,minorTicks:false});
            trend_ndvichart.addAxis("y", { min : 0, max : 100, vertical: true, fixLower: "minor", fixUpper: "minor", title: "Index", titleFontColor: "black",minorTicks:true});
            trend_ndvichart.addSeries("Dense", trendInfo_ndvi_densearray,{plot: "default", stroke: {color:"#007E11", width:2}});
            trend_ndvichart.addSeries("Sparse", trendInfo_ndvi_sparsearray,{plot: "default", stroke: {color:"#00AA17", width:2}});
            trend_ndvichart.addSeries("Low", trendInfo_ndvi_lowarray,{plot: "default", stroke: {color:"#00E21F", width:2}});
            trend_ndvichart.title = "Vegetation cover change for "+akah_Tool.month_function(Number(dijit.byId('fiveYear_selection1').value))+" ("+fromYear_5yt+"-"+toYear_5yt+")"
            trend_ndvichart.titleFont = "bold 14px Arial"
            trend_ndvichart.titlePos = "top"
            trend_ndvichart.titleGap = 10
            trend_ndvichart.render();
            new Tooltip(trend_ndvichart, "default");

            domAttr.set("ndvi_trend_legend","innerHTML",
                    '<table style="width: 100%;">'+
                    '<tr>'+
                    '<td><span style="padding: 0px 8px 0px 6px;color:#007E11;background-color:#007E11;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Dense Vegetation</td>'+
                    '<td><span style="padding: 0px 8px 0px 6px;color:#00AA17;background-color:#00AA17;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Sparse Vegetation</td>'+
                    '<td><span style="padding: 0px 8px 0px 6px;color:#00E21F;background-color:#00E21F;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Low Vegetation</td>'+
                    '</tr></table>')
            // trendYearId+"_trend_year"-> id used for displaying trend year
            if (play_5yearVar === "play_5yearTrend") {
              trendAnalysis_InfoDialog.set("content", "<div class='trend_dialog_parentdiv'>"+
                "<div id='"+trendYearId+"_trend_div' class='trend_dialog_child1' style='text-align: center;position: absolute;right: 10px;font-family: sans-serif;'><div><b>Timelapse year</b></div><div id='"+trendYearId+"_trend_year' style='font-size: 25px;font-weight: 600;color: #00833f;'>2016</div></div>"+
                "<div class='trend_dialog_child2'>"+dom.byId('ndvi_trendInfo').innerHTML+"</div>"+
                "<div class='trend_dialog_child3' style='display:inline-flex'>"+"<div style='flex: 1;padding-right: 8px;margin-top: 8px;white-space: nowrap;font-weight: 700;'>Overall Change: </div>"+densePer_info+sparsePer_info+lowPer_info+"</div>"+
                "<div style='display: flex;'><div style='flex: 6.5;'><p style='color:#717070;font-size:12px;'>**Data-Source: Sentinel 2 satellite imageries.</p>"+
                "<p style='color:#717070;font-size:12px;'>*Temporal gaps in the graphs is due to the cloud cover in satellite imageries.</p></div>"+
                "<div style='margin: auto;flex: 3.5;text-align: right;'>"+
                "<button id='"+trendYearId+"_replayTrend' style='background-color: #fff;color: #313149;border: 2px solid #00833f;border-radius: 8px;height: 24px;font-size: 13px;line-height: 0px;box-shadow: 0 0 6px #fff;'>&nbsp;Replay&nbsp;</button>"+
                "<button style='background-color: #fff;color: #313149;margin-left:15px;border: 2px solid #ff6262;border-radius: 8px;height: 24px;font-size: 13px;line-height: 0px;box-shadow: 0 0 6px #fff;' onclick=trendAnalysis_InfoDialog.hide()>&nbsp;Close&nbsp;</button>"+
                "</div></div>"+
                "</div>")
              on(dom.byId(trendYearId+"_replayTrend"), "click",function(evt){
                akah_Tool._trendAnalysis_for5year(trendYearId, trendYearId+"_trend_year", vegetation_input.trend_array, temp_layerList)
              });
              trendAnalysis_InfoDialog.show();
              akah_Tool._trendAnalysis_for5year(trendYearId, trendYearId+"_trend_year", vegetation_input.trend_array, temp_layerList)
            }
            else if (play_5yearVar === "show_Trendchart") {
              trendAnalysis_InfoDialog.set("content", "<div class='trend_dialog_parentdiv'>"+
                "<div class='trend_dialog_child1'>"+dom.byId('ndvi_trendInfo').innerHTML+"</div>"+
                "<div class='trend_dialog_child2' style='display:inline-flex'>"+"<div style='flex: 1;padding-right: 8px;margin-top: 8px;white-space: nowrap;font-weight: 700;'>Overall Change: </div>"+densePer_info+sparsePer_info+lowPer_info+"</div>"+
                "<div style='display: flex;'><div style='flex: 6.5;'><p style='color:#717070;font-size:12px;'>**Data-Source: Sentinel 2 satellite imageries.</p>"+
                "<p style='color:#717070;font-size:12px;'>*Temporal gaps in the graphs is due to the cloud cover in satellite imageries.</p></div>"+
                "<div style='margin: auto;flex: 3.5;text-align: right;'><button style='background-color: #fff;color: #313149;border: 2px solid #ff6262;border-radius: 8px;height: 24px;font-size: 13px;line-height: 0px;box-shadow: 0 0 6px #fff;' onclick=trendAnalysis_InfoDialog.hide()>&nbsp;Close&nbsp;</button></div></div>"+
                "</div>")
              trendAnalysis_InfoDialog.show();
            }
            // dojo.query('#ndvi_trendInfo').style('display', 'none');
        });
    },

    _trendCharts_for5yearSurfaceWaterInfo: function(fromYear_5yt, toYear_5yt, month_5yt, play_5yearVar, trendYearId, temp_layerList){
        trend_query.where = ""
        // trend_whereVar = akah_Tool.getQueryStrBtnYears(Number(fromYear_5yt),Number(toYear_5yt), Number(month_5yt), Number(month_5yt));
        trend_query.where = "village like '"+akah_searchResponse.attributes.village+"' AND month="+month_5yt+" AND year between "+fromYear_5yt+" AND "+toYear_5yt;
        trend_query.returnDistinctValues = false;
        trend_query.returnGeometry = true;
        trend_query.orderByFields = ["year ASC"];
        trend_query.outFields=["village_pk","month","year","water_percent"]

        new QueryTask(ndwi_statistics_url).execute(trend_query, function(trendInfo_ndwi_response){

            trendInfo_ndwidateLabels=[];window.trendInfo_ndwidateLabels=trendInfo_ndwidateLabels;
            trendInfo_ndwi_waterarray=[];window.trendInfo_ndwi_waterarray=trendInfo_ndwi_waterarray;

            trendInfo_ndwi_response.features.forEach(function(trendInfo_ndwi_resp, trendInfo_ndwi_index){
                trendInfo_ndwi_response.fields.forEach(function(evt, index){
                  var fieldname = evt.name;
                  if (fieldname.includes("year") ||fieldname.includes("month")|| fieldname.includes("min")||fieldname.includes("max")||fieldname.includes("mean")||fieldname.includes("stddev")||fieldname.includes("water_percent")||fieldname.includes("water_sw_percent")){
                    if(fieldname.includes("year") || fieldname.includes("month")){
                      if(fieldname.includes("month")&& trendInfo_ndwi_resp.attributes[fieldname] != ""){
                        trendInfo_ndwidateLabels.push({text:akah_Tool.month_function(trendInfo_ndwi_resp.attributes.month), value:trendInfo_ndwi_index+1})
                      }
                      if(fieldname.includes("year")&& trendInfo_ndwi_resp.attributes[fieldname] != ""){
                        trendInfo_ndwidateLabels[trendInfo_ndwi_index].text = trendInfo_ndwidateLabels[trendInfo_ndwi_index].text + "_"+trendInfo_ndwi_resp.attributes.year
                      }
                    }
                    else if(fieldname.includes("water_percent") && trendInfo_ndwi_resp.attributes[fieldname] != null)
                    {trendInfo_ndwi_waterarray.push(trendInfo_ndwi_resp.attributes[fieldname]);}
                  }
                });
            });

            window.temp_array = [];
            temp_array.push(trendInfo_ndwi_waterarray);

            if (Math.sign(Number(trendInfo_ndwi_waterarray[trendInfo_ndwi_waterarray.length-1]) - Number(trendInfo_ndwi_waterarray[0])) === -1) {
              window.waterPer_info = '<div class="akah_wellRegistration" style="flex: 1;padding-left: 15px;padding-right: 20px;margin-top: 8px;white-space: nowrap;font-size: 14px;">'+
                          '<div><span><b>'+(Number(trendInfo_ndwi_waterarray[trendInfo_ndwi_waterarray.length-1]) - Number(trendInfo_ndwi_waterarray[0])).toFixed(2)+'</b>'+
                          '&nbsp;<span><img src="'+fall_arrow+'" style="width: 10px;height: 14px;" alt=fall_image"/></span>'+
                          '</span>'+
                          '</div></div>';
            }
            else if (Math.sign(Number(trendInfo_ndwi_waterarray[trendInfo_ndwi_waterarray.length-1]) - Number(trendInfo_ndwi_waterarray[0])) === 1) {
              window.waterPer_info = '<div class="akah_wellRegistration" style="flex: 1;padding-left: 15px;padding-right: 20px;margin-top: 8px;white-space: nowrap;font-size: 14px;">'+
                          '<div><span><b>'+(Number(trendInfo_ndwi_waterarray[trendInfo_ndwi_waterarray.length-1]) - Number(trendInfo_ndwi_waterarray[0])).toFixed(2)+'</b>'+
                          '&nbsp;<span><img src="'+rise_arrow+'" style="width: 10px;height: 14px;" alt="rise_image"/></span>'+
                          '</span>'+
                          '</div></div>';
            }
            else if (Math.sign(Number(trendInfo_ndwi_waterarray[trendInfo_ndwi_waterarray.length-1]) - Number(trendInfo_ndwi_waterarray[0])) === 0) {
              window.waterPer_info = '<div class="akah_wellRegistration" style="flex: 1;padding-left: 15px;padding-right: 20px;margin-top: 8px;white-space: nowrap;font-size: 14px;">'+
                          '<div><span><b>'+(Number(trendInfo_ndwi_waterarray[trendInfo_ndwi_waterarray.length-1]) - Number(trendInfo_ndwi_waterarray[0])).toFixed(2)+'</b>'+
                          '&nbsp;<span></span>'+
                          '</span>'+
                          '</div></div>';
            }

            domAttr.set('ndwi_trend_chart','innerHTML','');
            dojo.query('#ndwi_trendInfo').style('display', 'block');

            window.trend_ndwichart = new Chart("ndwi_trend_chart");
            trend_ndwichart.addPlot("default", {type: LinesPlot,markers: true,tension: "S",marker: "m-3,0 c0,-4 6,-4 6,0 m-6,0 c0,4 6,4 6,0" });
            trend_ndwichart.addPlot("trendline", {type: LinesPlot,markers: false,tension: "S"});
            trend_ndwichart.addAxis("x", { includeZero: false, fixLower: "major", fixUpper: "major", natural: false, vertical: false, rotation: 0, title: "Date", titleFontColor: "black",
            labels: trendInfo_ndwidateLabels, titleOrientation: "away", majorLabels: true,majorTicks:true,majorTickStep:1,minorTicks:false});
            trend_ndwichart.addAxis("y", { min : 0, max : Math.max.apply(null, temp_array[0]), vertical: true, fixLower: "minor", fixUpper: "minor", title: "Value", titleFontColor: "black",minorTicks:true});
            trend_ndwichart.addSeries("Water %", trendInfo_ndwi_waterarray, {plot: "default", stroke: {color:"#0077BB", width:2}}); //min:
            trend_ndwichart.title = "Surface Water Area change for "+akah_Tool.month_function(Number(dijit.byId('fiveYear_selection1').value))+" ("+fromYear_5yt+"-"+toYear_5yt+")"
            trend_ndwichart.titleFont = "bold 14px Arial"
            trend_ndwichart.titlePos = "top"
            trend_ndwichart.titleGap = 10
            trend_ndwichart.render();
            new Tooltip(trend_ndwichart, "default");

            domAttr.set("ndwi_trend_legend","innerHTML",
            '<table style="line-height: 2em;padding-left: 25px;">'+
            '<tr><td><span style="padding: 0px 8px 0px 6px;color:#0077BB;background-color:#0077BB;font-size: 13px;border-radius:3px;">.</span></td><td style="text-align:left;">Water (%)</td></tr></table>')
            // trendYearId+"_trend_year"-> id used for displaying trend year
            if (play_5yearVar === "play_5yearTrend") {
              trendAnalysis_InfoDialog.set("content", "<div class='trend_dialog_parentdiv'>"+
                "<div id='"+trendYearId+"_trend_div' class='trend_dialog_child1' style='text-align: center;position: absolute;right: 10px;font-family: sans-serif;'><div><b>Timelapse year</b></div><div id='"+trendYearId+"_trend_year' style='font-size: 25px;font-weight: 600;color: #00833f;'>2016</div></div>"+
                "<div class='trend_dialog_child2'>"+dom.byId('ndwi_trendInfo').innerHTML+"</div>"+
                "<div class='trend_dialog_child3' style='display:inline-flex'>"+"<div style='flex: 1;padding-right: 8px;margin-top: 8px;white-space: nowrap;font-weight: 700;'>Overall Change: </div>"+waterPer_info+"</div>"+
                "<div style='display: flex;'><div style='flex: 6.5;'><p style='color:#717070;font-size:12px;'>**Data-Source: Sentinel 2 satellite imageries.</p>"+
                "<p style='color:#717070;font-size:12px;'>*Temporal gaps in the graphs is due to the cloud cover in satellite imageries.</p></div>"+
                "<div style='margin: auto;flex: 3.5;text-align: right;'>"+
                "<button id='"+trendYearId+"_replayTrend' style='background-color: #fff;color: #313149;border: 2px solid #00833f;border-radius: 8px;height: 24px;font-size: 13px;line-height: 0px;box-shadow: 0 0 6px #fff;'>&nbsp;Replay&nbsp;</button>"+
                "<button style='background-color: #fff;color: #313149;margin-left:15px;border: 2px solid #ff6262;border-radius: 8px;height: 24px;font-size: 13px;line-height: 0px;box-shadow: 0 0 6px #fff;' onclick=trendAnalysis_InfoDialog.hide()>&nbsp;Close&nbsp;</button>"+
                "</div></div>"+
                "</div>")
              on(dom.byId(trendYearId+"_replayTrend"), "click",function(evt){
                akah_Tool._trendAnalysis_for5year(trendYearId, trendYearId+"_trend_year", water_input.trend_array, temp_layerList)
              });
              trendAnalysis_InfoDialog.show();
              akah_Tool._trendAnalysis_for5year(trendYearId, trendYearId+"_trend_year", water_input.trend_array, temp_layerList)
            }
            else if (play_5yearVar === "show_Trendchart") {
              trendAnalysis_InfoDialog.set("content", "<div class='trend_dialog_parentdiv'>"+
                "<div class='trend_dialog_child1'>"+dom.byId('ndwi_trendInfo').innerHTML+"</div>"+
                "<div class='trend_dialog_child2' style='display:inline-flex'>"+"<div style='flex: 1;padding-right: 8px;margin-top: 8px;white-space: nowrap;font-weight: 700;'>Overall Change: </div>"+waterPer_info+"</div>"+
                "<div style='display: flex;'><div style='flex: 6.5;'><p style='color:#717070;font-size:12px;'>**Data-Source: Sentinel 2 satellite imageries.</p>"+
                "<p style='color:#717070;font-size:12px;'>*Temporal gaps in the graphs is due to the cloud cover in satellite imageries.</p></div>"+
                "<div style='margin: auto;flex: 3.5;text-align: right;'><button style='background-color: #fff;color: #313149;border: 2px solid #ff6262;border-radius: 8px;height: 24px;font-size: 13px;line-height: 0px;box-shadow: 0 0 6px #fff;' onclick=trendAnalysis_InfoDialog.hide()>&nbsp;Close&nbsp;</button></div></div>"+
                "</div>")
              trendAnalysis_InfoDialog.show();
            }
            // dojo.query('#ndvi_trendInfo').style('display', 'none');
        });
    },

    _clearNodeBeforeCreation: function(parentNode){
        const container = document.querySelector(parentNode);
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    },

    _removeAllNodesBeforeCreation: function(){
      //remove all nodes created for layerlist
      classifyListNodes.forEach(function(node){
          if(dojo.byId(node).hasChildNodes()){
            akah_Tool._clearNodeBeforeCreation('#'+node)
          }
      })
      //remove all layers  added
      Object.keys(tiles_layerlist).forEach(function(tile_key){
        akah_Tool.map.removeLayer(tiles_layerlist[tile_key])
        delete tiles_layerlist[tile_key];
      })
    },

    _trendAnalysis_for5year: function(input1, trendYearId, trendyears, layerlist){
      window.input1 = input1;
      window.trendYearId = trendYearId;
      if (input1.includes('vegt')) {
        dojo.query('#'+trendYearId+'_trend_div').style('display', 'block');
        domAttr.set(trendYearId, 'innerHTML', Object.keys(resp.url_timelapse)[0])
      }
      else if (input1.includes('water')) {
        dojo.query('#'+trendYearId+'_trend_div').style('display', 'block');
        domAttr.set(trendYearId, 'innerHTML', Object.keys(resp.url_timelapse)[0])
      }
      layerlist[Object.keys(layerlist)[0]].setVisibility(true)

      window.layer_ind_val = 1;window.layer_opacity_val = 1;

      function displayLayer(index, opacity){
        tiles_layerlist[dom.byId(input1).value].setVisibility(false)
        if (input1.includes('vegt')) {
          tiles_layerlist[dom.byId(input1).value.replace('Vegetation Change_', 'Surface Water - ')].setVisibility(false)
        }

        if(index<=4){
          if (input1.includes('vegt')) {
            layerlist[Object.keys(layerlist)[index]].setVisibility(true)
            domAttr.set(trendYearId, 'innerHTML', Object.keys(resp.url_timelapse)[index])
          }
          else if (input1.includes('water')) {
            if (index!=0) {
              layerlist[Object.keys(layerlist)[index-1]].setVisibility(false)
              layerlist[Object.keys(layerlist)[index]].setVisibility(true)
            }
            domAttr.set(trendYearId, 'innerHTML', Object.keys(resp.url_timelapse)[index])
          }
          setTimeout(function(){
            displayLayer(index+1, 1)
          },2000)
        }

        if(index>4) {
          if (input1.includes('vegt')) {
            // dojo.query('#'+trendYearId+'_trend_div').style('display', 'none');
          }
          else if (input1.includes('water')) {
            dojo.query('#'+trendYearId+'_trend_div').style('display', 'none');
          }

          layerlist[Object.keys(layerlist)[0]].setVisibility(false)
          layerlist[Object.keys(layerlist)[1]].setVisibility(false)
          layerlist[Object.keys(layerlist)[2]].setVisibility(false)
          layerlist[Object.keys(layerlist)[3]].setVisibility(false)
          layerlist[Object.keys(layerlist)[4]].setVisibility(false)

          tiles_layerlist[dom.byId(input1).value].setVisibility(true)
          if (input1.includes('vegt')) {
            dojo.query('#'+trendYearId+'_trend_div').style('display', 'none');
            tiles_layerlist[dom.byId(input1).value.replace('Vegetation Change_', 'Surface Water - ')].setVisibility(true)
            dojo.query('#ndvi_trendInfo').style('display', 'none');
          }
          else if (input1.includes('water')) {
            dojo.query('#ndwi_trendInfo').style('display', 'none');
          }
          dojo.query('#ndvi_trendInfo').style('display','none')
          dojo.query('#ndwi_trendInfo').style('display','none')
        }
        return index;
      }
      setTimeout(function(){
          displayLayer(1, 1)
      },2000)
    },

    _onSliderChange: function(labelid, sliderIndex){
      tiles_layerlist[dom.byId(labelid).value].setOpacity(Number(sliderIndex)/10);
    },

    _onLayerChecked: function(labelid, visibility){
      if (dijit.byId('classify_5year_v').checked === true || dijit.byId('classify_5year_w').checked === true) {
        tiles_layerlist[dom.byId(labelid).value].setVisibility(visibility)
        var new_keylayer = key_layer.replace('Vegetation Change_', 'Surface Water - ')
        tiles_layerlist[new_keylayer].setVisibility(visibility)
      }
      else{
        tiles_layerlist[dom.byId(labelid).value].setVisibility(visibility)
      }
    },

    _removeLayer: function(childname){
      var parentId='';var parentLayer = '';
      var q = childname.split("_");
      // parentId = parentId[0]+"_"+parentId[1]
      parentId = getOuterDiv(q[0]+"_"+q[1].slice(0,q[1].length-1))+q[1].slice(q[1].length-1)
      function getOuterDiv(child){
        switch(child){
          case "month_vegtId" : parentId = 'month_vegetation', parentLayer = vegetation_input.monthly_layerArr_v;break;
          case "oneYear_vegtId" : parentId = 'oneYear_vegetation', parentLayer = vegetation_input.oneYear_layerArr_v;break;
          case "fiveYear_vegtId" : parentId = 'fiveYear_vegetation', parentLayer = vegetation_input.fiveYear_layerArr_v;break;
          case "month_waterId" : parentId = 'month_water', parentLayer = water_input.monthly_layerArr_w;break;
          case "oneYear_waterId" : parentId = 'oneYear_water', parentLayer = water_input.oneYear_layerArr_w;break;
          case "fiveYear_waterId" : parentId = 'fiveYear_water', parentLayer = water_input.fiveYear_layerArr_w;break;
        }
        return parentId
      }
      //for removing the layer and also layer related container
      var child_name = q[0]+"_"+q[1].slice(0,q[1].length-1)+q[1].slice(q[1].length-1)
      var label_name = dom.byId(child_name).value
      if (child_name.includes("fiveYear")) {
        akah_Tool.map.removeLayer(tiles_layerlist[label_name])
        delete tiles_layerlist[label_name]
        if (child_name.includes("vegt")) {
          akah_Tool.map.removeLayer(tiles_layerlist[label_name.replace('Vegetation Change_', 'Surface Water - ')])
          delete tiles_layerlist[label_name.replace('Vegetation Change_', 'Surface Water - ')]
          Object.keys(vegetation_trend_layerlist).forEach(function(layer){
            delete vegetation_trend_layerlist[layer]
          })
        }
        if (child_name.includes("water")) {
          Object.keys(water_trend_layerlist).forEach(function(layer){
            delete water_trend_layerlist[layer]
          })
        }
      }
      else{
        akah_Tool.map.removeLayer(tiles_layerlist[label_name])
        delete tiles_layerlist[label_name]
      }
      akah_Tool._regenerateCheckList_forLayers(parentId, label_name)
      // dojo.byId(parentId).remove()
    },

    _regenerateCheckList_forLayers(parentId, label_name){
      if (parentId.includes("month_vegetation")) {
        vegetation_input.monthly_layerArr_v.splice(vegetation_input.monthly_layerArr_v.indexOf(label_name),1)
        akah_Tool._createCheckList_forLayers(vegetation_input.monthly_layerArr_v,
         'month_vegetation', 'month_vegtId', 'vegetation_monthLayerlist')
      }
      if (parentId.includes("oneYear_vegetation")) {
        vegetation_input.oneYear_layerArr_v.splice(vegetation_input.oneYear_layerArr_v.indexOf(label_name),1)
        akah_Tool._createCheckList_forLayers(vegetation_input.oneYear_layerArr_v,
         'oneYear_vegetation', 'oneYear_vegtId', 'vegetation_1yearLayerlist')
      }
      if (parentId.includes("fiveYear_vegetation")) {
        vegetation_input.fiveYear_layerArr_v.splice(vegetation_input.fiveYear_layerArr_v.indexOf(label_name),1)
        akah_Tool._createCheckList_forLayers(vegetation_input.fiveYear_layerArr_v,
         'fiveYear_vegetation', 'fiveYear_vegtId', 'vegetation_5yearLayerlist')
      }
      if (parentId.includes("month_water")) {
        water_input.monthly_layerArr_w.splice(water_input.monthly_layerArr_w.indexOf(label_name),1)
        akah_Tool._createCheckList_forLayers(water_input.monthly_layerArr_w,
         'month_water', 'month_waterId', 'water_monthLayerlist')
      }
      if (parentId.includes("oneYear_water")) {
        water_input.oneYear_layerArr_w.splice(water_input.oneYear_layerArr_w.indexOf(label_name),1)
        akah_Tool._createCheckList_forLayers(water_input.oneYear_layerArr_w,
         'oneYear_water', 'oneYear_waterId', 'water_1yearLayerlist')
      }
      if (parentId.includes("fiveYear_water")) {
        water_input.fiveYear_layerArr_w.splice(water_input.fiveYear_layerArr_w.indexOf(label_name),1)
        akah_Tool._createCheckList_forLayers(water_input.fiveYear_layerArr_w,
         'fiveYear_water', 'fiveYear_waterId', 'water_5yearLayerlist')
      }
    },

    _provideLayerInformation: function(evt){
      console.log(evt)
    },

    resetAllLayers: function(){
      //reset all dropdowns
      viz_month.attr('value', "Select")
      viz_year.attr('value', "Select")
      viz_month_1year.attr('value', "Select")
      viz_year1.attr('value', "Select")
      viz_5year_month.attr('value', "Select")
      viz_5year2.attr('value', "Select")
      //remove all nodes and respective layers...
      akah_Tool._removeAllNodesBeforeCreation()
      //variable re-creation
      window.vegetation_input = {'monthly_layerArr_v':'', 'oneYear_layerArr_v':'', 'fiveYear_layerArr_v':'', 'trend_array': ''};
      vegetation_input.monthly_layerArr_v = [];vegetation_input.oneYear_layerArr_v = [];vegetation_input.fiveYear_layerArr_v = [];
      vegetation_input.trend_array = [];

      window.water_input = {'monthly_layerArr_w':'', 'oneYear_layerArr_w':'', 'fiveYear_layerArr_w':'', 'trend_array': ''};
      water_input.monthly_layerArr_w = [];water_input.oneYear_layerArr_w = [];water_input.fiveYear_layerArr_w = [];
      water_input.trend_array = [];

      window.query_input = {'date_from': '', 'date_to': '', 'month_ndvi5': '', 'cloud_cover': 5, 'village_name': '', 'layerid': '', 'fullExtent': '', 'layerid_water': ''};
      window.tiles_layerlist = {};window.vegetation_trend_layerlist = {};window.water_trend_layerlist = {};

      window.outer_div = '';window.inner_div1 = '';window.inner_div2 = '';window.layer_nm = '';
      window.temp_var = '';window.api_url = '';window.inp_layer = '';
    },

    displayVegetationInfo: function(){
      on(dom.byId("infobtn_vegetation"),"click", function(evt){
        vegetationDialog.set("title", "Vegetation");
        /*modified vegetation-leaf url for code feasibility when modified at multiple places*/
        vegetationDialog.set("content",'<img style="width:100%" src="'+ndvi_vegetation+'"/>');
        // vegetationDialog.set("content",'<img style="width:100%" src="widgets\\AKAHSummary\\images\\Vegetation.png"/>');
        vegetationDialog.set("style","font-size:14px");
        vegetationDialog.show();
      });
    },

    displayWaterInfo: function(){
      on(dom.byId("infobtn_water"),"click", function(evt){
        waterDialog.set("title", "Water");
        /*modified water-droplet url for code feasibility when modified at multiple places*/
        waterDialog.set("content",'<img style="width:100%" src="'+surface_waterImg+'"/>');
        // waterDialog.set("content",'<img style="width:100%" src="widgets\\AKAHSummary\\images\\Water.png"/>');
        waterDialog.set("style","font-size:14px");
        waterDialog.show();
      });
    },
    displayRainfallInfo: function(){
      on(dom.byId("infobtn_rainfall"),"click", function(evt){
        rainfallDialog.set("title", "Rainfall");
        /*modified vegetation-leaf url for code feasibility when modified at multiple places*/
        document.getElementById("rfYearlyChartModule").style.display = "block"
        // path = "widgets//Agakhan//images//Rainfall.png";
      //  domAttr.set("rfAnnualChartLegend","innerHTML","<div style='margin-top:19%;margin-left:2%;font-weight:bold;font-size:12px;'><ul><li>Average Annual Rainfall 2020 : "+(rfYArray[rfYArray.length-1]).toFixed(2)+" mm</li><li> Average Rainfall of 2008-2020 : "+(annDec/13).toFixed(2)+" mm</li></ul><div>")
        var compare;
        if(rfYArray[rfYArray.length-1] > annDec/13){compare = "more";}else{compare = "less";}
        rainfallDialog.set("content", "")
        rainfallDialog.set("content", "<div><p class='akah_level1_heading'>Rainfall</p></div>"+
        // "<div style='margin-top:14%;'><ul></ul><li>Average annual Rainfall 2020 : "+(rfYArray[rfYArray.length-1]).toFixed(2)+" mm</li><li> Average Rainfall of 2008-2020 : "+(annDec/13).toFixed(2)+" mm</li><div>"+
        "<div>"+rep_rfYearlyChart+"</div><div style='background-color: #00833f;font-family:Arial;color:#ffffff;padding-top:5px;padding-bottom:5px;font-size:14px;width: 805px;line-height: 1.6em;'><ul><li>The above represented rainfall data is for the rainfall gridden station which is near to the selected village.</li>"+
        "<li>Concluding Statement: The Average Annual Rainfall 2020 in the area is "+(rfYArray[rfYArray.length-1]).toFixed(2)+"mm which is "+compare+" than the Decadal rainfall of 2008-2020 is "+(annDec/13).toFixed(2)+" mm). </li></ul><div>");
        rainfallDialog.set("style","font-size:14px");
        rainfallDialog.show();
      
      });
    },
    displaydownloadWLDiv: function(){
      dialogwaterlevels.set("title", "Download Water Levels");
      dialogwaterlevels.set("content", dom.byId('dialogWL').innerHTML);
      dialogwaterlevels.show();
      for(wl=0;wl<4;wl++){
        on(dialogwaterlevels.domNode.getElementsByTagName("p")[wl], "click",function(evt){
          wellFilter.downloadWL(evt.currentTarget.innerHTML);
        });
      }
    },
    
    displaydownloadWQDiv: function(){
      dialogwaterquality.set("title", "Download Water Quality");
      dialogwaterquality.set("content", dom.byId('dialogWQ').innerHTML);
      dialogwaterquality.show();
      for(wq=0;wq<4;wq++){
        on(dialogwaterquality.domNode.getElementsByTagName("p")[wq], "click",function(evt){
          wellFilter.downloadWQ(evt.currentTarget.innerHTML);
        });
      }
    },

    onOpen: function(){
      // var panel = this.getPanel();
      // panel.position.width = 650;
      // panel.position.height = 580;
      // panel.setPosition(panel.position);
      // panel.panelManager.normalizePanel(panel);
    },

    onClose: function(){
      console.log('onClose');
      dialogwaterlevels.hide();
      dialogwaterquality.hide();
    },

    onMinimize: function(){
      console.log('onMinimize');
      dialogwaterlevels.hide();
      dialogwaterquality.hide();
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
  // return clazz;
});
