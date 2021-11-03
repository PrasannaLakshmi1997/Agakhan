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
        'dijit/form/Select',
        "dijit/form/Button",
        'esri/map',
        'esri/tasks/query',
        'esri/tasks/QueryTask',
        'esri/layers/FeatureLayer',
        "esri/geometry/webMercatorUtils",
        "esri/geometry/Extent",
        "esri/SpatialReference",
        'dojo/promise/all',
        "dojox/charting/Chart",
        "dojox/charting/plot2d/Pie",
        "dojox/charting/themes/Claro",
        "dojox/charting/themes/Wetland",
        "dojox/charting/themes/MiamiNice",
        "dojox/charting/themes/PlotKit/blue",
        "dojox/charting/themes/PlotKit/green",
        "dojox/charting/plot2d/Lines",
        "dojox/charting/action2d/Tooltip",
        "dojox/charting/action2d/MoveSlice",
        "dojox/charting/plot2d/Markers",
        "dojox/charting/action2d/Magnify",
        "dojox/charting/widget/Legend",
        "dojox/charting/axis2d/Default",
        "dojox/charting/plot2d/Bars",
        "dojox/charting/Chart2D",
        "dojox/charting/themes/Tufte",
        "dojox/charting/SimpleTheme",
        "dojox/charting/plot2d/Columns",
        "dojox/charting/plot2d/ClusteredColumns",
        "dojox/charting/action2d/Highlight",
        "dojox/gfx/utils",
        "dojox/math/stats",
        'jimu/BaseWidget'],
function(declare, on, lang, Deferred, dom, domAttr, Select, Button, map, Query, QueryTask, FeatureLayer,webMercatorUtils, Extent,
         SpatialReference, executeAll, Chart, Pie, theme, Wetland, MiamiNice, blue, green, LinesPlot, Tooltip, MoveSlice, Markers,
         Magnify, Legend, Default, Bars, Chart2D, Tufte, SimpleTheme, ColumnsPlot, ClusteredColumns,Highlight, utils, stats, BaseWidget) {


    var waterSecurityPlan={};

    waterSecurityPlan._init_wsp = function(pet_resp, surfaceWtr_resp) {
      waterSecurityPlan._init_layerList();
      waterSecurityPlan._getInputs_forReport(pet_resp, surfaceWtr_resp);
    };

    waterSecurityPlan._init_layerList = function(){
      akahMainLayer = new FeatureLayer("https://geomonitor.co.in/server/rest/services/Hosted/gangapura_villages/FeatureServer/0");
      window.akahMainLayer = akahMainLayer;
      agakhan_layer_list.forEach(function (element) {
        if (element.includes("gangapura_villages")) {
          wsp_census_layer = element;
          window.wsp_census_layer = akah_Tool.map.getLayer(element);
        }
        else if (element.includes("agakhan_Villages")) {
          window.wsp_village_bound = akah_Tool.map.getLayer(element);
        }
        else if (element.includes("Block_Boundaries")) {
          window.wsp_block_bound = akah_Tool.map.getLayer(element);
        }
        else if(element.includes("AKAH_states")){
          window.wsp_state_bound = akah_Tool.map.getLayer(element);
        }
        else if(element.includes("District_Boundaries")){
          window.wsp_dist_bound = akah_Tool.map.getLayer(element);
        }
        else if(element.includes("GWM_STATIONS_17042020_ABHY_Blocks_10yrs_data")){
          window.wsp_layer_invisible = akah_Tool.map.getLayer(element);
        }
        else if(element.includes("GW_Recharge_frm_rainfall_other_sources")){
          window.wsp_rainfall_layer = akah_Tool.map.getLayer(element);
        }/*Surface_Water_Bodies15122020*/
        else if(element.includes("Surface_Water_Bodies")){
          window.wsp_wa_surf_wtr = akah_Tool.map.getLayer(element);
        }
        else if(element.includes("WA_Surface_Water06032021")){
          window.wsp_surface_wtr = akah_Tool.map.getLayer(element);
        }/*layer to save surface water*/
        else if(element.includes("AKAH_WD_Indusry")){
          window.wd_industry_layer = akah_Tool.map.getLayer(element);
        }
        else if(element.includes("WD_Drinking_or_Domestic")){
          window.wd_drink_dom_layer = akah_Tool.map.getLayer(element)
        }
        else if(element.includes("WU_Agriculture_Crops")){
          window.wu_agri_crops = akah_Tool.map.getLayer(element)
        }
        else if(element.includes("AKAH_WD_Others_if_any")){
          window.wd_others_layer = akah_Tool.map.getLayer(element);
        }
         else if(element.includes("WaterUtilization")){
          window.water_utili_layer = akah_Tool.map.getLayer(element);
        }
         else if(element.includes("WaterBalance")){
          window.water_balance_layer = akah_Tool.map.getLayer(element);
        }
        else if(element.includes("WaterBudget")){
          window.water_budget_layer = akah_Tool.map.getLayer(element);
        }
        else if(element.includes("WSP_Demand_for_Report")){
          window.wsp_demand_report = akah_Tool.map.getLayer(element);
        }
        else if(element.includes("AKAH_Well_Registration")){
          window.wsp_akahWellRegistration = akah_Tool.map.getLayer(element)
          wsp_akahWellRegistration.setVisibility(false)
        }
        else if(element.includes("AKAH_Selected_wells")){
          window.wsp_akahSelectedWells = akah_Tool.map.getLayer(element)
          wsp_akahSelectedWells.setVisibility(true)
        }
        else if(element.includes("Aquifers_and_Watershed_1950")){
          wsp_watershed_bound = akah_Tool.map.getLayer(element);
          window.wsp_watershed_bound = wsp_watershed_bound;
        }
        else{
          window.other_layer = akah_Tool.map.getLayer(element);
        }
      });
    };

    waterSecurityPlan._getInputs_forReport = function(pet_resp, surfaceWtr_resp){
        //assign surface water response to json 
        wsprv['surf_wtr_response_wsp'] = surfaceWtr_resp;
        //using village response instead of census response
        wsprv['village_area_ha'] = wsprv['village_response'].features[0].attributes['village_area_ha'].toFixed(2)
        //B.Groundwater module calculations and responses
        wsprv['vill_rainfall_monsoon'] = wsprv['village_response'].features[0].attributes['recharge_rainfall_monsoon'].toFixed(2)
        wsprv['vill_rainfall_nonmonsoon'] = wsprv['village_response'].features[0].attributes['recharge_rainfall_non_monsoon'].toFixed(2)
        wsprv['vill_rainfall_total'] = Number(Number(wsprv['vill_rainfall_monsoon']) + Number(wsprv['vill_rainfall_nonmonsoon'])).toFixed(2)
        wsprv['vill_other_monsoon'] = wsprv['village_response'].features[0].attributes['recharge_other_monsoon'].toFixed(2)
        wsprv['vill_other_nonmonsoon'] = wsprv['village_response'].features[0].attributes['recharge_other_non_monsoon'].toFixed(2)
        wsprv['vill_other_total'] = Number(Number(wsprv['vill_other_monsoon']) + Number(wsprv['vill_other_nonmonsoon'])).toFixed(2)
        wsprv['vill_lossdue2_naturalDischarge'] = Number(Number(wsprv['village_response'].features[0].attributes['total_recharge_all_sources']) - Number(wsprv['village_response'].features[0].attributes['net_total_recharge'])).toFixed(2)
        wsprv['vill_total_gnd_water'] = Number(wsprv['village_response'].features[0].attributes['net_total_recharge']).toFixed(2)

        wsprv['vill_waterbodies_volume'] = 0;
        wsprv['vill_waterbodies_area'] = 0;
        // feature response for storage capacity structures in surface water bodies
        wsprv['vill_surf_wtr_bodies_count'] = wsprv['surf_wtr_response_wsp'].features.length;
        wsprv['surf_wtr_response_wsp'].features.forEach(function(surfaceWaterBody){
          wsprv['vill_waterbodies_area'] = wsprv['vill_waterbodies_area'] + surfaceWaterBody.attributes.area_ha;
          if (surfaceWaterBody.attributes.area_ha < (5000/10000)) {
            wsprv['vill_waterbodies_volume'] = wsprv['vill_waterbodies_volume'] + (surfaceWaterBody.attributes.area_ha*1)
          }
          else if (surfaceWaterBody.attributes.area_ha > (5000/10000) && surfaceWaterBody.attributes.area_ha >= (10000/10000)) {
            wsprv['vill_waterbodies_volume'] = wsprv['vill_waterbodies_volume'] + (surfaceWaterBody.attributes.area_ha*2)
          }
          else if (surfaceWaterBody.attributes.area_ha > (10000/10000) && surfaceWaterBody.attributes.area_ha >= (50000/10000)) {
            wsprv['vill_waterbodies_volume'] = wsprv['vill_waterbodies_volume'] + (surfaceWaterBody.attributes.area_ha*3)
          }
          else if (surfaceWaterBody.attributes.area_ha > (50000/10000) && surfaceWaterBody.attributes.area_ha >= (100000/10000)) {
            wsprv['vill_waterbodies_volume'] = wsprv['vill_waterbodies_volume'] + (surfaceWaterBody.attributes.area_ha*4)
          }
          else if (surfaceWaterBody.attributes.area_ha < (100000/10000)) {
            wsprv['vill_waterbodies_volume'] = wsprv['vill_waterbodies_volume'] + (surfaceWaterBody.attributes.area_ha*5)
          }
          // wsprv['vill_waterbodies_volume'] = wsprv['vill_waterbodies_volume'] + surfaceWaterBody.attributes.volume;
        })

        // district level rainfall and pet values for ann rainfall & evapotranspiration
        // A.Total Available water module calculations and responses
        pet_resp.features.forEach(function(act_pet_response){
          if(act_pet_response.attributes.year === 2020){
            wsprv['actual_rainfall_val'] = Number(act_pet_response.attributes.rainfall_actual*0.001);
            wsprv['pet_evapo_val'] = Number(act_pet_response.attributes.pet_annual*0.001);
            wsprv['volume_rainfall_val'] = Number(Number(wsprv['village_area_ha']) * (wsprv['actual_rainfall_val'])).toFixed(2);
            wsprv['evapo_losses_val'] = Number(Number(wsprv['village_area_ha']) * (wsprv['pet_evapo_val'])).toFixed(2);
            wsprv['sw_evapo_losses_val'] = Number(Number(wsprv['vill_waterbodies_area']) * (wsprv['pet_evapo_val'])).toFixed(2);
            wsprv['tot_wtr_available'] = Number(Number(Number(wsprv['volume_rainfall_val'])-Number(wsprv['evapo_losses_val']))*(60/100)).toFixed(2)
          }
        })
        wsprv['surf_wtr'] = Number(wsprv['tot_wtr_available']) - Number(wsprv['vill_total_gnd_water'])

        // wsprv['vill_waterbodies_area'] = Number(wsprv['vill_waterbodies_area'].toFixed(2))
        wsprv['vill_waterbodies_volume'] = Number(wsprv['vill_waterbodies_volume'].toFixed(2))

        wsprv['vill_storage_capacity'] = Number(wsprv['vill_waterbodies_volume']).toFixed(2);

        // wsprv['vill_surf_wtr_available'] = Number((Number(wsprv['vill_storage_capacity'])) -
        //   Number(wsprv['sw_evapo_losses_val'])).toFixed(2);// formula finalised by priyanka....
        // Volume*(1-pet/actual)
        wsprv['vill_surf_wtr_available'] = (Number(wsprv['vill_storage_capacity'])*(1-Number(wsprv['pet_evapo_val'])/Number(wsprv['actual_rainfall_val']))).toFixed(2)
        // formulae finalised by surya....

        // wsprv['vill_surf_wtr_available'] = (Number(wsprv['vill_storage_capacity'])).toFixed(2);

        // village level water utilization
        wsprv['vill_irrigation_draft'] = Number(wsprv['village_response'].features[0].attributes['irrigation_draft'].toFixed(2))
        wsprv['vill_irr_surf_wtr'] = Number(wsprv['vill_surf_wtr_available'])*(30/100)
        wsprv['vill_dom_ind_draft'] = Number(wsprv['village_response'].features[0].attributes['industrial_domestic_draft'].toFixed(2))
        wsprv['vill_dom_surf_wtr'] = Number(wsprv['vill_irr_surf_wtr'])*(30/100)
        wsprv['vill_balance_draft'] = wsprv['vill_irrigation_draft'] + wsprv['vill_dom_ind_draft']
        wsprv['vill_balance_surfacewtr'] = wsprv['vill_irr_surf_wtr'] + wsprv['vill_dom_surf_wtr']

        // village level water balance
        wsprv['vill_wa_surface_water'] = Number(wsprv['vill_surf_wtr_available'])
        wsprv['vill_wa_gnd_water'] = Number(wsprv['vill_total_gnd_water'])
        wsprv['vill_wu_surface_water'] = Number(wsprv['vill_irr_surf_wtr']) + Number(wsprv['vill_dom_surf_wtr'])
        wsprv['vill_wu_gnd_water'] = Number(wsprv['vill_irrigation_draft']) + Number(wsprv['vill_dom_ind_draft'])
        wsprv['vill_bal_surface_water'] = wsprv['vill_wa_surface_water'] - wsprv['vill_wu_surface_water']
        wsprv['vill_bal_gnd_water'] = wsprv['vill_wa_gnd_water'] - wsprv['vill_wu_gnd_water']

        //for water budget 1st module
        wsprv['dom_total_population'] = Number(wsprv['village_response'].features[0].attributes['total_population_census_2011'])
        wsprv['alloc_per_capita'] = 55;
        wsprv['alloc_proj_pres_pop'] = Number((Number(wsprv['dom_total_population']) * 1.32).toFixed(2))
        wsprv['alloc_wbu_req_2050'] = Number(Number(wsprv['alloc_proj_pres_pop']) * 55 * 365 * Math.pow(10,-7)).toFixed(2)
        wsprv['alloc_wbu_surf_wtr'] = Number(Number(wsprv['alloc_wbu_req_2050']) * 0.3).toFixed(2)
        wsprv['alloc_wbu_gnd_wtr'] = Number(Number(wsprv['alloc_wbu_req_2050']) * 0.7).toFixed(2)
        wsprv['alloc_wbu_total_wtr'] = Number(wsprv['alloc_wbu_gnd_wtr']) + Number(wsprv['alloc_wbu_surf_wtr'])
        //for water budget 2nd module
        wsprv['vill_wbu_surf_wtr'] = Number(wsprv['vill_bal_surface_water'] - Number(wsprv['alloc_wbu_surf_wtr'])).toFixed(2)
        wsprv['vill_wbu_gnd_wtr'] = Number(wsprv['vill_bal_gnd_water'] - Number(wsprv['alloc_wbu_gnd_wtr'])).toFixed(2)
        wsprv['vill_wbu_total_wtr'] = Number(wsprv['vill_bal_surface_water'] + wsprv['vill_bal_gnd_water']).toFixed(2)
        waterSecurityPlan._processdata();
    };

    waterSecurityPlan._processdata = function(){
          dataForReport = [];
          domAttr.set('wsp_chart1', 'innerHTML', '')
          domAttr.set('wsp_chart2', 'innerHTML', '')
          domAttr.set('wsp_chart3', 'innerHTML', '')
          domAttr.set('wsp_chart4', 'innerHTML', '')
          domAttr.set('wsp_chart5', 'innerHTML', '')

          dojo.query('#wsp_chart1').style('display', 'block')
          dojo.query('#wsp_chart2').style('display', 'block')
          dojo.query('#wsp_chart3').style('display', 'block')
          dojo.query('#wsp_chart4').style('display', 'block')

          var chart_wa = new dojox.charting.Chart2D("wsp_chart1", { enablePan: true, enableZoom: true });//Creates an object for report chart
          gw = Number(wsprv['vill_total_gnd_water']);window.gw=gw;
          sw = Number(wsprv['vill_surf_wtr_available']);window.sw=sw;
          var chartData = [{ y: gw, fill: "#00833f"},{ y: sw, fill: "#0092CD"}];
          var chart_wa_theme = dojox.charting.themes.Tufte;
          chart_wa_theme.axis.majorTick.color = "black";
          chart_wa_theme.axis.minorTick.color = "black";
          chart_wa.setTheme(chart_wa_theme); // Set the theme as Tufte
          chart_wa.addPlot("default", { type: "Columns", gap: 35, labels: true, labelStyle: "outside" });  // Add the only/default plot
          chart_wa.addAxis("x", { fixLower: "minor", fixUpper: "minor", natural: true, vertical: false,
                          labels: [{value: 1, text: "Ground Water", fill:"green"}, {value: 2, text: "Surface Water", fill:"blue"}] });
          chart_wa.addAxis("y", { vertical: true, fixLower: "major", fixUpper: "major", includeZero: true, title: "Volume (ha m)" });
          chart_wa.addSeries("Series A", chartData); //Adds Water Availability Data to chart
          new Highlight(chart_wa, "default");
          new Tooltip(chart_wa, "default");
          chart_wa.title="Water Availability"
          chart_wa.titleFont = "bold 14px Arial"
          chart_wa.titlePos = "top"
          chart_wa.render();


          //surface water availability pie chart
          var chart_twa = new dojox.charting.Chart2D("wsp_chart5",{ type: Pie , font: "normal normal normal 14px TimesnewRoman", fontColor: "black",stroke: {width: 0}, labels: true, labelStyle: "default",htmlLabels: true});//Creates an object for report chart
          var chartDataTWA = [{ y: gw, fill: "#00833f"},{ y: sw, fill: "#0092CD"}];
          // var chart_wa_theme = dojox.charting.themes.Tufte;
          chart_twa.setTheme(chart_wa_theme); // Set the theme as Tufte
          chart_twa.addPlot("default", { type: "Pie", font: "normal normal bold 12pt TimesnewRoman", fontColor: "white", radius: 250, stroke: {width: 1}, labels: true, labelStyle: "default",htmlLabels: true});  // Add the only/default plot
          chart_twa.addSeries("Series A", chartDataTWA); //Adds Water Availability Data to chart
          chart_twa.render();
          //end of surface + ground water availability pie chart

          //water utilization chart
          var chart_wutil = new Chart("wsp_chart4");
          var wutil_sw1 = Number(wsprv['vill_irr_surf_wtr'])
          var wutil_gw1 = Number(wsprv['vill_irrigation_draft'])
          var wutil_sw2 = Number(wsprv['vill_dom_surf_wtr'])
          var wutil_gw2 = Number(wsprv['vill_dom_ind_draft'])

          var axesLabels = [{text: "Domestic Purpose", value:1}, {text: "Agriculture", value:2}]
          var chartutilData_gw = [wutil_gw1, wutil_gw2]
          var chartutilData_sw = [wutil_sw1, wutil_sw2]
          var chartutilData = [{ y: wutil_gw1, fill: "#00833f"},{ y: wutil_gw2, fill: "#0092CD"},
                              { y: wutil_sw1, fill: "#00833f"},{ y: wutil_sw2, fill: "#0092CD"}];
          // chart_wutil.setTheme(dojox.charting.themes.Tufte); // Set the theme as Tufte
          chart_wutil.addPlot("stackedColumnsPlot", {
                type: ClusteredColumns/*StackedColumns*/,
                gap:5,
                lines: true,
                areas: true,
                markers: true,
                labels: true,
                labelStyle:"outside",
                maxBarSize: 60,
                tension: "2" });  // Add the only/default plot
          chart_wutil.addAxis("x", { natural: true, vertical: false, labels: axesLabels,  majorTicks: false, minorTicks: false});
          chart_wutil.addAxis("y", { vertical: true, fixLower: "major", fixUpper: "major", includeZero: true, title: "Volume (ha m)" });
          chart_wutil.addSeries("Ground Water", chartutilData_gw, {plot: "stackedColumnsPlot",  fill: "#00833f"}); //Adds ground Water Availability Data to chart
          chart_wutil.addSeries("Surface Water", chartutilData_sw, {plot: "stackedColumnsPlot",  fill: "#0092CD"}); //Adds surface Water Availability Data to chart
          // new Highlight(chart_wutil, "default");
          // new Tooltip(chart_wutil, "default");
          chart_wutil.title="Water Draft"
          chart_wutil.titleFont = "bold 14px Arial"
          chart_wutil.titlePos = "top"
          chart_wutil.render();

          //water balance chart
          var chart_wb = new dojox.charting.Chart2D("wsp_chart2", { enablePan: true, enableZoom: true });
          wb_sw1 = Number(wsprv['vill_wa_surface_water'])
          wb_gw1 = Number(wsprv['vill_wa_gnd_water'])
          wb_sw2 = Number(wsprv['vill_wu_surface_water'])
          wb_gw2 = Number(wsprv['vill_wu_gnd_water'])
          wb_sw3 = Number(wsprv['vill_bal_surface_water'])
          wb_gw3 = Number(wsprv['vill_bal_gnd_water'])
          var axesLabels = [{text: "Availability", value:1}, {text: "Water Draft", value:2}, {text: "Balance", value:3}]
          var chart_wb_Data_gw = [wb_gw1, wb_gw2, wb_gw3]
          var chart_wb_Data_sw = [wb_sw1, wb_sw2, wb_sw3]
          var chartbalanceData = [{ y: wb_gw1, fill: "#00833f"},{ y: wb_sw1, fill: "#0092CD"},{ y: wb_gw2, fill: "#00833f"},{ y: wb_sw2, fill: "#0092CD"},{ y: wb_gw3, fill: "#00833f"},{ y: wb_sw3, fill: "#0092CD"}];
          // chart_wb.setTheme(dojox.charting.themes.Tufte); // Set the theme as Tufte
          chart_wb.addPlot("stackedColumnsPlot", {
                  type: ClusteredColumns/*StackedColumns*/,
                  gap:5,
                  lines: true,
                  areas: true,
                  markers: true,
                  labels: true,
                  labelStyle:"outside",
                  maxBarSize: 60,
                  tension: "2" });  // Add the only/default plot
          chart_wb.addAxis("x", { natural: true, vertical: false, labels: axesLabels, majorTicks: false, minorTicks: false, titleFontColor: "black"});
          chart_wb.addAxis("y", { vertical: true, fixLower: "major", fixUpper: "major", includeZero: true, title: "Volume (ha m)", titleFontColor: "black" });
          chart_wb.addSeries("Ground Water", chart_wb_Data_gw, {plot: "stackedColumnsPlot",  fill: "#00833f"}); //Adds ground Water Availability Data to chart
          chart_wb.addSeries("Surface Water", chart_wb_Data_sw, {plot: "stackedColumnsPlot",  fill: "#0092CD"}); //Adds surface Water Availability Data to chart
          // new Highlight(chart_wb, "default");
          // new Tooltip(chart_wb, "default");
          chart_wb.title="Water Balance"
          chart_wb.titleFont = "bold 14px Arial"
          chart_wb.titlePos = "top"
          chart_wb.render();
          // chart_wb.resize(350,250);
          //water budget chart
          var chart_wbu = new dojox.charting.Chart2D("wsp_chart3", { enablePan: true, enableZoom: true });
          wbu_sw1 = Number(wsprv['alloc_wbu_surf_wtr']);
          wbu_gw1 = Number(wsprv['alloc_wbu_gnd_wtr']);
          wbu_sw2 = Number(wsprv['vill_wbu_surf_wtr']);
          wbu_gw2 = Number(wsprv['vill_wbu_gnd_wtr']);
          var axesLabels = [{text: "Domestic Purpose", value:1}, {text: "Agriculture", value:2}]
          var chart_wbu_Data_gw = [wbu_gw1, wbu_gw2]
          var chart_wbu_Data_sw = [wbu_sw1, wbu_sw2]
          var chartbudgetData = [{ y: wbu_gw1, fill: "#00833f"},{ y: wbu_sw1, fill: "#0092CD"},{ y: wbu_gw2, fill: "#00833f"},{ y: wbu_sw2, fill: "#0092CD"}];
          // chart_wbu.setTheme(dojox.charting.themes.Tufte); // Set the theme as Tufte
          chart_wbu.addPlot("stackedColumnsPlot", {
                  type: ClusteredColumns/*StackedColumns*/,
                  gap:5,
                  lines: true,
                  areas: true,
                  markers: true,
                  labels: true,
                  labelStyle:"outside",
                  maxBarSize: 60,
                  tension: "2" });  // Add the only/default plot
          chart_wbu.addAxis("x", { natural: true, vertical: false, labels: axesLabels,  majorTicks: false, minorTicks: false, titleFontColor: "black"});
          chart_wbu.addAxis("y", { vertical: true, fixLower: "major", fixUpper: "major", includeZero: true, title: "Volume (ha m)", titleFontColor: "black"});
          chart_wbu.addSeries("Ground Water", chart_wbu_Data_gw, {plot: "stackedColumnsPlot",  fill: "#00833f"}); //Adds ground Water Availability Data to chart
          chart_wbu.addSeries("Surface Water", chart_wbu_Data_sw, {plot: "stackedColumnsPlot",  fill: "#0092CD"}); //Adds surface Water Availability Data to chart
          // new Highlight(chart_wbu, "default");
          // new Tooltip(chart_wbu, "default");
          chart_wbu.title="Water Budget"
          chart_wbu.titleFont = "bold 14px Arial"
          chart_wbu.titlePos = "top"
          chart_wbu.render();

          wsprv['wsp_module1'] = {
            title: "",
            type: "html",
            data: "<div><p class='akah_level1_heading'>6.6.1. Water Availability</p>"+
            "<div id='waterAvaildiv'><div class='waterCategoryStyles' style='padding-top: 5%;padding-left: 223px;'>"+wsprv['vill_surf_wtr_available']+" ha m</div><div class='waterCategoryStyles' style='padding-top: 14%;padding-left: 80%;'>"+wsprv['vill_balance_surfacewtr'].toFixed(2)+" ha m</div><div class='waterCategoryStyles' style='line-height:1.5em;padding-top: 298px;padding-left:19%;'>"+wsprv['vill_balance_draft'].toFixed(2)+" ha m</div><div class='waterCategoryStyles' style='line-height:1.5em;padding-top: 5%;padding-left: 70%;'>"+wsprv['vill_total_gnd_water']+" ha m</div></div>"+
                  // "<div><img src='widgets/Agakhan/images/waterComposite.png' alt='water Composite Image' style='width: 750px;background-color: #E6ECE6;margin: 10px 0px 10px 29px;'></div>"+
                  "<div style='display:inline-flex;'><div>" +
                  "<table class='akahReportTable' style='width:100%'>" +
                  "<tr><td colspan='3'><b>GROUND WATER</b></td></tr>" +
                  "<tr><td>(i)</td><td colspan='2'>Recharge from rainfall (ha m)</td></tr>" +
                  "<tr><td></td><td>Monsoon(A)</td><td>"+ wsprv['vill_rainfall_monsoon'] +"</td></tr>" +
                  "<tr><td></td><td>Non-Monsoon(B)</td><td>"+wsprv['vill_rainfall_nonmonsoon']+"</td></tr>" +
                  "<tr style='color:#005ce6;'><td></td><td>Total(A+B)</td><td>"+wsprv['vill_rainfall_total'] +"</td></tr>" +
                  "<tr><td>(ii)</td><td colspan='2'>Recharge from other sources (ha m)</td></tr>" +
                  "<tr><td></td><td>Monsoon(A)</td><td>"+wsprv['vill_other_monsoon']+"</td></tr>" +
                  "<tr><td></td><td>Non-Monsoon(B)</td><td>"+wsprv['vill_other_nonmonsoon']+"</td></tr>" +
                  "<tr style='color:#005ce6;'><td></td><td>Total(A+B)</td><td>"+wsprv['vill_other_total']+"</td></tr>" +
                  "<tr style='color:#005ce6;'><td></td><td>Total Ground Water Availability (ha m)</td><td>"+wsprv['vill_total_gnd_water']+"</td></tr>" +
                  "<tr><td colspan='3'><b>SURFACE WATER</b></td></tr>" +
                  "<tr><td></td><td>No. of surface water storage structures</td><td>"+wsprv['vill_surf_wtr_bodies_count']+"</td></tr>" +
                  "<tr><td></td><td>Total storage capacity of the structures (ha m)</td><td>"+wsprv['vill_storage_capacity']+"</td></tr>" +
                  "<tr style='color:#005ce6;'><td></td><td>Total Surface Water Availability (ha m)</td><td>"+wsprv['vill_surf_wtr_available']+"</td></tr>" +
                  "</table></div>" +

                    // "<div id='image' style='width:300px;height:400px;'></div>"+
                   "<div><div style='display:block;height:250px;width:350px;padding-top:90px;padding-left:10px;'>"+dom.byId("wsp_chart1").innerHTML+"</div><div style='margin-top:-40px;padding-left:26%;font-size:10px;'></div>" +
                   "</div></div></div>"+
                    "<div style='display: flex;padding-left:56%;padding-top:20px;font-size:11px;'><div style='width: 10px;height: 10px;border-radius:2em;background-color: #00833f;'></div><b>&nbsp;Ground Water &nbsp;&nbsp;&nbsp;&nbsp;</b>"+
                  "<div style='width: 10px;height: 10px;border-radius:2em;background-color: #0092CD;'></div><b>&nbsp;Surface Water</b></div>"
          };
          wsprv['wsp_module2'] = {
            title: "",
            type:   "html",
            data:   "<div style='padding-top: 10px;'><p class='akah_level1_heading' style='line-height: 1.6em;'>6.6.2. Water Draft</p><div style='display:inline-flex;'><div>" +
                    "<table class='akahReportTable' style='width: 345px;height: 230px;'>"+
                    "<tr><td>(A)</td><td colspan='2'><b>Domestic Purpose (ha m)</b></td></tr>" +
                    "<tr><td>i)</td><td>Surface Water (A)</td><td style='width: 38px;'>"+wsprv['vill_irr_surf_wtr'].toFixed(2)+"</td></tr>" +
                    "<tr><td>ii)</td><td>Ground Water (B)</td><td>"+wsprv['vill_irrigation_draft']+"</td></tr>" +
                    "<tr style='color:#005ce6;'><td>iii)</td><td>Total (A+B)</td><td>"+Number(Number(wsprv['vill_irr_surf_wtr']) + Number(wsprv['vill_irrigation_draft'])).toFixed(2)+"</td></tr>" +
                    "<tr><td>(B)</td><td colspan='2'><b>Agricultutre (ha m)</b></td></tr>" +
                    "<tr><td>i)</td><td>Surface Water (A)</td><td>"+wsprv['vill_dom_surf_wtr'].toFixed(2)+"</td></tr>" +
                    "<tr><td>ii)</td><td>Ground Water (B)</td><td>"+wsprv['vill_dom_ind_draft'].toFixed(2)+"</td></tr>" +
                    "<tr style='color:#005ce6;'><td>iii)</td><td>Total (A+B)</td><td>"+Number(Number(wsprv['vill_dom_surf_wtr']) + Number(wsprv['vill_dom_ind_draft'])).toFixed(2)+"</td></tr>" +
                    "<tr><td>(C)</td><td colspan='2'><b>Total Draft (ha m)</b></td></tr>" +
                    "<tr><td>i)</td><td>Surface Water (A)</td><td>"+wsprv['vill_balance_surfacewtr'].toFixed(2)+"</td></tr>" +
                    "<tr><td>ii)</td><td>Ground Water (B)</td><td>"+wsprv['vill_balance_draft'].toFixed(2)+"</td></tr>" +
                    "<tr style='color:#005ce6;'><td>iii)</td><td>Total (A+B)</td><td>"+(wsprv['vill_balance_draft']+wsprv['vill_balance_surfacewtr']).toFixed(2)+"</td></tr>" +
                    "</table></div>" +

                    "<div style='display:block;height:230px;width:350px;padding-bottom:90px;padding-left:10px;'><span>"+dom.byId("wsp_chart4").innerHTML+"</span><div style='margin-top:-56px;padding-left:25%;font-size:10px;'>"+
                    "</div>"+
                    "<p><div style='display: flex;padding-left:36%;padding-top:40px;font-size:11px;'><div style='width: 10px;height: 10px;border-radius:2em;background-color: #00833f;'></div><b>&nbsp;Ground Water &nbsp;&nbsp;&nbsp;&nbsp;</b>"+
                    "<div style='width: 10px;height: 10px;border-radius:2em;background-color: #0092CD;'></div><b>&nbsp;Surface Water</b></div>"+
                    "</div></div></div>"+
                    '<p style="font-size: 12px;color: #717070;">*Source: CGWB - GWR 2017 <br>*Surface Water(Total Draft) = Surface Water for Domestic Purpose + Surface Water for Agricultutre<br>*Ground water(Total Draft) = Ground water for Domestic Purpose + Ground water for Agricultutre</p>'+
                   "<h3>Concluding Statement: </h3><ul style='font-size: 14px;margin-right: 30px;line-height: 1.5em;'><li>The region has a total water availability of "+Number(Number(wsprv['vill_total_gnd_water'])+Number(wsprv['vill_surf_wtr_available'])).toFixed(2)+" ha m and a total draft of "+Number((wsprv['vill_balance_draft'])+Number(wsprv['vill_balance_surfacewtr'])).toFixed(2)+" ha m. </li><li>Out of the overall availability "+wsprv['vill_surf_wtr_available']+" ha m is from surface water and "+wsprv['vill_total_gnd_water']+" ha m is from ground water, whereas out of the total daft "+(wsprv['vill_balance_surfacewtr']).toFixed(2)+" ha m is from surface water and "+wsprv['vill_balance_draft']+" ha m is from ground water.</li></ul>"
          };
          wsprv['wsp_module3'] = {
            title: "",
            type: "html",
            data:
                  "<div><p class='akah_level1_heading'>6.6.3. Water Balance</p>"+
                  // <img src='widgets/Agakhan/images/waterBalance.png' alt='water Composite Image' style='width: 750px;background-color: #E6ECE6;margin: 10px 0px 10px 29px;'></img>
                  "<div id='waterbalancediv'><div class='waterCategoryStyles' style='padding-top: 15%;padding-left: 75px;'>"+Number(Number(wsprv['vill_wa_surface_water']) + Number(wsprv['vill_wa_gnd_water'])).toFixed(2)+" ha m</div><div class='waterCategoryStyles' style='padding-top: 14%;padding-left: 74%;'>"+Number(Number(wsprv['vill_wu_surface_water']) + Number(wsprv['vill_wu_gnd_water'])).toFixed(2)+" ha m</div><div class='waterCategoryStyles' style='line-height:1.5em;padding-top: 21%;padding-left: 10%;'>"+Number(Number(wsprv['vill_bal_surface_water']) + Number(wsprv['vill_bal_gnd_water'])).toFixed(2)+" ha m</div></div>"+
                  "<div style='display:inline-flex;'><div>" +
                  "<table class='akahReportTable' style='width: 345px;height:230px;'>" +
                  "<tr><td>(A)</td><td colspan='2'><b>Water Availability (ha m)</b></td></tr>" +
                  "<tr><td>i)</td><td>Surface Water (A)</td><td style='width: 38px;'>"+wsprv['vill_wa_surface_water'].toFixed(2)+"</td></tr>" +
                  "<tr><td>ii)</td><td>Ground Water (B)</td><td>"+wsprv['vill_wa_gnd_water'].toFixed(2)+"</td></tr>" +
                  "<tr style='color:#005ce6;'><td>iii)</td><td>Total Water Availability(A+B)</td><td>"+Number(Number(wsprv['vill_wa_surface_water']) + Number(wsprv['vill_wa_gnd_water'])).toFixed(2)+"</td></tr>" +
                  "<tr><td>(B)</td><td colspan='2'><b>Water Draft (ha m)</b></td></tr>" +
                  "<tr><td>i)</td><td>Surface Water (A)</td><td>"+wsprv['vill_wu_surface_water'].toFixed(2)+"</td></tr>" +
                  "<tr><td>ii)</td><td>Ground Water (B)</td><td>"+wsprv['vill_wu_gnd_water'].toFixed(2)+"</td></tr>" +
                  "<tr style='color:#005ce6;'><td>iii)</td><td>Total Water Draft (A+B)</td><td>"+Number(Number(wsprv['vill_wu_surface_water']) + Number(wsprv['vill_wu_gnd_water'])).toFixed(2)+"</td></tr>" +
                  "<tr><td>(C)</td><td colspan='2'><b>Water Balance [Surplus(+) / Deficit(-)] (ha m)</b></td></tr>" +
                  "<tr><td>i)</td><td>Surface Water (A)</td><td>"+Number(wsprv['vill_bal_surface_water']).toFixed(2)+"</td></tr>" +
                  "<tr><td>ii)</td><td>Ground Water (B)</td><td>"+Number(wsprv['vill_bal_gnd_water']).toFixed(2)+"</td></tr>" +
                  "<tr style='color:#005ce6;'><td>iii)</td><td>Total Water Balance(A+B)</td><td>"+Number(Number(wsprv['vill_bal_surface_water']) + Number(wsprv['vill_bal_gnd_water'])).toFixed(2)+"</td></tr>" +
                  "</table></div>" +

                  "<div style='display:block;height:250px;width:350px;padding-left:10px;'><span>"+dom.byId('wsp_chart2').innerHTML+"</span><div style='margin-top:-56px;padding-left:21%;font-size:10px;'>"+
                  "</div>" +
                  "<p><div style='display: flex;padding-left:36%;padding-top:50px;font-size:11px;'><div style='width: 10px;height: 10px;border-radius:2em;background-color: #00833f;'></div><b>&nbsp;Ground Water &nbsp;&nbsp;&nbsp;&nbsp;</b>"+
                  "<div style='width: 10px;height: 10px;border-radius:2em;background-color: #0092CD;'></div><b>&nbsp;Surface Water</b></div>"+
                  "</div></div><div>"+
                  '<p style="font-size: 12px;color: #717070;">*Source: CGWB - GWR 2017<br>*Surface Water Balance = Surface Water Availability - Surface Water Draft<br>*Ground Water Balance = Ground Water Availability - Ground Water Draft </p>'+
                  "<h3>Concluding Statement: </h3><ul style='font-size: 14px;margin-right: 30px;line-height: 1.5em;'><li>The region has a total water balance of "+Number(Number(wsprv['vill_bal_surface_water']) + Number(wsprv['vill_bal_gnd_water'])).toFixed(2)+" ha m with a total water availability of "+Number(Number(wsprv['vill_wa_surface_water']) + Number(wsprv['vill_wa_gnd_water'])).toFixed(2)+" ha m and total draft of "+Number(Number(wsprv['vill_wu_surface_water']) + Number(wsprv['vill_wu_gnd_water'])).toFixed(2)+" ha m. </li><li>Out of the overall balance "+Number(wsprv['vill_bal_surface_water']).toFixed(2)+" ha m is for surface water and "+Number(wsprv['vill_bal_gnd_water']).toFixed(2)+" ha m is for ground water.</li></ul>"
          };
          wsprv['wsp_module3_2']={
            type:"html",data:
            "</br><p class='akah_level1_heading'>6.6.4. Water Budget</p>"+
            "<div id='waterBudgetdiv'><div class='waterCategoryStyles' style='padding-top: 14%;padding-left: 108px;'>"+Number(wsprv['alloc_wbu_surf_wtr']).toFixed(2)+" ha m</div><div class='waterCategoryStyles' style='padding-top: 14%;padding-left: 80%;'>"+Number(wsprv['vill_wbu_surf_wtr']).toFixed(2)+" ha m</div><div class='waterCategoryStyles' style='line-height:1.5em;padding-top: 20%;padding-left: 8%;'>"+Number(wsprv['alloc_wbu_gnd_wtr']).toFixed(2)+" ha m</div><div class='waterCategoryStyles' style='line-height:1.5em;padding-top: 13%;padding-left: 71%;'>"+Number(wsprv['vill_wbu_gnd_wtr']).toFixed(2)+" ha m</div></div>"+
            // "<div><img src='widgets/Agakhan/images/waterBudget.png' alt='water Composite Image' style='width: 750px;background-color: #E6ECE6;margin: 10px 0px 10px 29px;'></div>"+
            "<div style='display:inline-flex;'><div>" +
            "<table class='akahReportTable' style='width: 345px;'>" +
            "<tr><td>(A)</td><td colspan='2'><b>Water Requirement for Domestic Purpose (ha m)</b></td></tr>" +
            "<tr><td>i)</td><td>Present Population</td><td style='width: 38px;'>"+ Number(wsprv['dom_total_population']).toFixed(2)+"</td></tr>" +
            "<tr><td>ii)</td><td>Projected Population 30 years from date (as in 2050)</td><td>"+Number(wsprv['alloc_proj_pres_pop']).toFixed(2)+"</td></tr>" +
            "<tr><td>iii)</td><td>Per capita requirement(L)</td><td>"+Number(wsprv['alloc_per_capita']).toFixed(2)+"</td></tr>" +
            "<tr><td>iv)</td><td>Allocation for Domestic Purpose in 2050</td><td>"+Number(wsprv['alloc_wbu_req_2050']).toFixed(2)+"</td></tr>" +
            "<tr><td></td><td>From Surface Water(ha m) (A)</td><td>"+Number(wsprv['alloc_wbu_surf_wtr']).toFixed(2)+"</td></tr>" +
            "<tr><td></td><td>From Ground Water(ha m) (B)</td><td>"+Number(wsprv['alloc_wbu_gnd_wtr']).toFixed(2)+"</td></tr>" +
            "<tr style='color:#005ce6;'><td></td><td>Total (A+B)</td><td>"+Number(Number(wsprv['alloc_wbu_surf_wtr']) + Number(wsprv['alloc_wbu_gnd_wtr'])).toFixed(2)+"</td></tr>" +
            "<tr><td>(B)</td><td colspan='2'><b>Water Requirement for Agriculture(ha m)</b></td></tr>" +
            "<tr><td>i)</td><td>Surface Water (A)</td><td>"+Number(wsprv['vill_wbu_surf_wtr']).toFixed(2)+"</td></tr>" +
            "<tr><td>ii)</td><td>Ground Water (B)</td><td>"+Number(wsprv['vill_wbu_gnd_wtr']).toFixed(2)+"</td></tr>" +
            "<tr style='color:#005ce6;'><td>iii)</td><td>Total (A+B)</td><td>"+Number(Number(wsprv['vill_wbu_surf_wtr']) + Number(wsprv['vill_wbu_gnd_wtr'])).toFixed(2)+"</td></tr>" +
            "</table></div>" +

            "<div style='display:block;height:250px;width:350px;padding-top:25px;padding-left:10px;'><span>"+dom.byId('wsp_chart3').innerHTML+"</span><div style='margin-top:-56px;padding-left:25%;font-size:10px;'>"+
            "</div>" +
            "<p><div style='display: flex;padding-left:36%;padding-top:40px;font-size:11px;'><div style='width: 10px;height: 10px;border-radius:2em;background-color: #00833f;'></div><b>&nbsp;Ground Water &nbsp;&nbsp;&nbsp;&nbsp;</b>"+
            "<div style='width: 10px;height: 10px;border-radius:2em;background-color: #0092CD;'></div><b>&nbsp;Surface Water</b></div>"+
            "</div></div>"+'<p style="font-size: 12px;color: #717070;line-height: 1.6em;">*Source: Jal Jeevan Mission Report, National Rural Drinking Water Programme (NRDWP)'+
            '<br>*Project population 30 years from date (as in 2050) = Present population * 1.32<br> *Liters per capita per day value for rural areas = 55 lpcd'+
            '<br>*Water Requirement for Domestic Purpose in 2050 = Projected Population 30 Years from date (as in 2050) * Per Capita Requirement (L) * 365 * 10<sup>-7</sup>'+
            '<br>*Water Requirement for Agriculture in 2050 = Water Availability (surface and ground) -  Water Budget for Domestic Purpose</p>'+
            "<h3>Concluding Statement: </h3><ul style='font-size: 14px;margin-right: 30px;line-height: 1.5em;'><li>The region will require "+Number(Number(wsprv['alloc_wbu_surf_wtr']) + Number(wsprv['alloc_wbu_gnd_wtr'])).toFixed(2)+" ha m for domestic purpose and "+Number(Number(wsprv['vill_wbu_surf_wtr']) + Number(wsprv['vill_wbu_gnd_wtr'])).toFixed(2)+" ha m for agriculture for future use.</li><li>Out of the total domestic purpose requirement "+Number(wsprv['alloc_wbu_surf_wtr'])+" ha m is from surface water and "+Number(wsprv['alloc_wbu_gnd_wtr'])+" ha m is from ground water, whereas out of the total agriculture requirement "+Number(wsprv['vill_wbu_surf_wtr'])+" ha m is from surface water and "+Number(wsprv['vill_wbu_gnd_wtr'])+" ha m is from ground water.</li></ul>"
          }
          wsprv['wsp_module4']={
            type: "html",
            data:
            "<div style='padding-left:15%;display:flex;'>"+dom.byId("wsp_chart5").innerHTML+
            "<div style='font-size:14px;padding-top:19%;'><div><span style='width: 10px;height: 10px;border-radius:2em;background-color: #00833f;padding:0px 5px 0px 8px;'>.</span><b>&nbsp;Ground Water ("+gw+" ha m)</b></div><br>"+
                  "<div><span style='width: 10px;height: 10px;border-radius:2em;background-color: #0092CD;padding:0px 5px 0px 8px;'>.</span><b>&nbsp;Surface Water ("+sw+" ha m)</b></div></div>"+
            "</div>"
          }
          // dataForReport.push(wsp_module1);
          dataForReport.push(wsprv['wsp_module1']);
          dataForReport.push(wsprv['wsp_module2']);
          dataForReport.push(wsprv['wsp_module3']);
          // dataForReport.push(wsp_module5);
          // dataForReport.push(wsp_signatureText);
          dojo.query('#wsp_chart1').style('display', 'none')
          dojo.query('#wsp_chart2').style('display', 'none')
          dojo.query('#wsp_chart3').style('display', 'none')
          dojo.query('#wsp_chart4').style('display', 'none')
          dojo.query('#wsp_chart5').style('display', 'none')

          // dataForReport.push(data111);
          dataForReport.push({
              "type": "note",
              "addPageBreak": false
          });
          // waterSecurityPlan['wsp_report'] = dataForReport
    };

  return waterSecurityPlan;
});
