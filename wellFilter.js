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
        'jimu/BaseWidget'],
function(declare, on, lang, Deferred, dom, domAttr, Select, Button, map, Query, QueryTask, FeatureLayer,webMercatorUtils, Extent,
         SpatialReference, executeAll,BaseWidget) {


    var wellFilter={};
    wellFilter.init_wellFilter= function() {
      well_filter_layerList();
      well_filter_DropdownList();
    },

    well_filter_layerList = function(){

      var selectedwellsPrimary_layer = new FeatureLayer("https://geomonitor.co.in/server/rest/services/agakhan_experiment/selected_wells_primary/FeatureServer/0")
      var selectedwellsWL_layer = new FeatureLayer("https://geomonitor.co.in/server/rest/services/agakhan_experiment/selected_wells_water_level/FeatureServer/0",
      {outFields:["latitude","longitude","month","objectid","observation_count_in_month","water_level_mbgl","water_status","year","date_time"]})
      var selectedwellsWQ_layer = new FeatureLayer("https://geomonitor.co.in/server/rest/services/agakhan_experiment/selected_wells_water_quality/FeatureServer/0",
        {outFields:["season","latitude","longitude","objectid","month","year","date_time"]})
      window.selectedwellsPrimary_layer = selectedwellsPrimary_layer;
      window.selectedwellsWL_layer = selectedwellsWL_layer;
      window.selectedwellsWQ_layer = selectedwellsWQ_layer;
      // akah_Tool.map.addLayer(selectedwellsPrimary_layer);
      // akah_Tool.map.addLayer(selectedwellsWL_layer);
      // akah_Tool.map.addLayer(selectedwellsWQ_layer);
    };

    well_filter_DropdownList= function(){
      new Select({
        name:'select_layer',
        id:'layerWellFilter'
      }, akah_Tool.wellfilter_layer).startup();
    
      new Select({
        name:'select_state',
        id:'stateWellFilter'
      }, akah_Tool.wellfilter_state).startup();
    
      new Select({
        name:'select_district',
        id:'distrWellFilter'
      }, akah_Tool.wellfilter_district).startup();
    
      new Select({
        name:'select_block',
        id:'blockWellFilter'
      }, akah_Tool.wellfilter_block).startup();
    
      new Select({
        name:'select_village',
        id:'villageWellFilter'
      }, akah_Tool.wellfilter_village).startup();
    
      /*Assign name to each dropdown in Well Filter widget*/
      var wf_layer = dijit.byId('layerWellFilter');window.wf_layer = wf_layer;
      var wf_state = dijit.byId('stateWellFilter');window.wf_state = wf_state;
      var wf_district = dijit.byId('distrWellFilter');window.wf_district = wf_district;
      var wf_block = dijit.byId('blockWellFilter');window.wf_block = wf_block;
      var wf_village = dijit.byId('villageWellFilter');window.wf_village = wf_village;
      window.wf_layers_arr = ['Select Layer', 'AKAH - Selected wells layer'/*, 'AKAH Observation wells', 'AKAH Survey wells', 'CGWB Water level wells', 'CGWB Water Quality Wells'*/];
      var map_layer_wf = wf_layers_arr.map(function (record) {
        return dojo.create("option", {
          label: record,
          value: record
        })
      })
      wf_layer.options.length = 0
      wf_layer.addOption(map_layer_wf)
      wf_layer.attr('value', wf_layers_arr[0]);

      window.wellfilter_query = new Query();
      wellfilter_query.where = "1=1"
      wellfilter_query.returnGeometry = false
      wellfilter_query.returnDistinctValues = true

      /*on change event for well filter layer selection dropdown*/
      akah_Tool.own(on(wf_layer, 'change', lang.hitch(akah_Tool, function (evt) {
        akah_Tool.wellfilter_layer = evt;
        window.selectedLayer = evt;
        if (selectedLayer.includes('AKAH - Selected wells layer')) {
            /*Query statement for well filter tool*/
            wellfilter_query.outFields = ['state']
            /*Query for Selected wells to get the states and push them as input for state dropdown*/
            new QueryTask(selectedwellsPrimary_layer.url).execute(wellfilter_query, function(filterFeature, wf_ind){
                window.wf_state_arr = []
                filterFeature.features.forEach(function(wf_stateName, wf_stateIndex){
                  wf_state_arr.push(wf_stateName.attributes.state)
                  window.wf_state_arr = wf_state_arr.sort();
                })
                window.wf_state_arr = ['Select State'].concat(wf_state_arr.sort());
                var map_state_wf = wf_state_arr.map(function (record) {
                  return dojo.create("option", {
                    label: record,
                    value: record
                  })
                })

                wf_state.options.length = 0
                wf_state.addOption(map_state_wf)
                wf_state.attr('value', wf_state_arr[0]);

                // akah_Tool.own(on(wf_state, 'change', lang.hitch(akah_Tool, function (evt) {
                //   akah_Tool.wellfilter_state = evt;
                //   window.selectedState = evt;
                //   wellfilter_query.where = "state like" +" "+"\'"+ akah_Tool.wellfilter_state+"\'"
                //   // while (wf_distr_arr.length > 0) {
                //   //   wf_distr_arr.pop();
                //   // }
                //   wellfilter_query.outFields = ["district"]
                //   wellfilter_query.returnGeometry = false
                //   wellfilter_query.returnDistinctValues = true
                //   //Querying wellFilter_selectedwells_layer service url and getting all districts and push them as input for district dropdown
                //   new QueryTask(selectedwellsPrimary_layer.url).execute(wellfilter_query, function retrieve(wf_districts) {
                //     window.wf_districts = wf_districts;
                //     window.wf_distr_arr = [];
                //     window.wf_districts.features.forEach(function (wf_distr_feature) {
                //       if (wf_distr_feature.attributes.district!=null) {
                //         dist_val = wf_distr_feature.attributes.district;
                //         wf_distr_arr.push(dist_val);
                //       }
                //     });
                //     window.wf_distr_arr = ['Select District'].concat(wf_distr_arr.sort());
                //     var map_distr_wf = wf_distr_arr.map(function (record) {
                //       return dojo.create("option", {
                //         label: record,
                //         value: record
                //       })
                //     })
                //     wf_district.options.length = 0
                //     wf_district.addOption(map_distr_wf)
                //     wf_district.attr('value', wf_distr_arr[0])
                //   });
                // })));
            });
        }
      })));
      wf_distr_arr =[];window.wf_distr_arr =wf_distr_arr;
      wf_block_arr = [];window.wf_block_arr=wf_block_arr;
      wf_village_arr=[];window.wf_village_arr=wf_village_arr;
      akah_Tool.own(on(wf_state, 'change', lang.hitch(this, function (evt) {
        dijit.byId("akah_dist").disabled = true;
        st_val.attr('value', evt);//change location in all tabs
        st_valdv.attr('value', evt);
            window.wellfilter_state = evt;
            wf_district.set('value', '');
            for (var i = 0; i<wf_distr_arr.length ; i++) {
              wf_district.removeOption(lang.clone(wf_distr_arr[i]));
              wf_district.store = null;
              wf_district._setDisplay("");
            }
    
            if(wellfilter_state!="Select State"){
            var wellfilter_query = new Query();
            wellfilter_query.where = "state like '" +wellfilter_state+"'"
            while (wf_distr_arr.length > 0) {
              wf_distr_arr.pop();
            }
            wf_distr_arr.push("Select District");
            wellfilter_query.outFields = ["district"]
            wellfilter_query.returnGeometry = false
            wellfilter_query.returnDistinctValues = true
            wellfilter_query.orderByFields = ["district ASC"];
            //querying displacement service url and getting all wf_distr_arr data
            new QueryTask(akah_selectedwells_layer.url).execute(wellfilter_query, function retrieve(selectedstateresponse) {
              window.selectedstateresponse = selectedstateresponse;
              selectedstateresponse.features.forEach(function (feature) {
                dist_val = feature.attributes.district;
                // wf_distr_arr.push("Select District")
                wf_distr_arr.push(dist_val);
                var map_d = wf_distr_arr.map(function (record) {
                  return dojo.create("option", {
                    label: record,
                    value: record
                  })
                })
                wf_district.options.length = 0
                wf_district.addOption("Select District")
                wf_district.addOption(map_d)
                wf_district.attr('value', wf_distr_arr[0])
                dijit.byId("akah_dist").disabled = false;
              });
            });
            }
      })));
      /*on change event for district selection in well filter widget*/
      akah_Tool.own(on(wf_district, 'change', lang.hitch(this, function (evt) {
        dijit.byId("akah_block").disabled = true;
        ds_val1.attr('value', evt);//change location in all tabs
        ds_val1dv.attr('value', evt);
        window.wellfilter_district = evt;
        window.selectedDistrict=evt;
        wf_block.set('value', '');
        for (var i = 0; i<wf_block_arr.length ; i++) {
          wf_block.removeOption(lang.clone(wf_block_arr[i]));
          wf_block.store = null;
          wf_block._setDisplay("");
        }
    
        if(wellfilter_district!="Select District"){
        wellfilter_query.where = "state like '"+wellfilter_state+"' and district like '" +wellfilter_district+"'"
        while (wf_block_arr.length > 0) {
          wf_block_arr.pop();
        }
        wf_block_arr.push("Select Block");
        wellfilter_query.outFields = ["block"]
        wellfilter_query.returnGeometry = false
        wellfilter_query.returnDistinctValues = true
        wellfilter_query.orderByFields = ["block ASC"];
    
        //querying displacement service url and getting all districts data
        new QueryTask(akah_selectedwells_layer.url).execute(wellfilter_query, function retrieve(selectedblockresponse) {
          window.selectedblockresponse = selectedblockresponse;
          //console.log(selectedblockresponse);
          selectedblockresponse.features.forEach(function (feature) {
            wf_block_val = feature.attributes.block;
            // districts.push("Select District")
            wf_block_arr.push(wf_block_val);
            var map_b = wf_block_arr.map(function (record) {
              return dojo.create("option", {
                label: record,
                value: record
              })
            })
            wf_block.options.length = 0
            wf_block.addOption("Select Block")
            wf_block.addOption(map_b)
            wf_block.attr('value', wf_block_arr[0])
            dijit.byId("akah_block").disabled = false;
          });
        });
      }
      })));
      akah_Tool.own(on(wf_block, 'change', lang.hitch(this, function (evt) {
        dijit.byId("akah_vill").disabled = true;
        st_val1.attr('value', evt); //change location in all tabs
        st_val1dv.attr('value', evt);
        window.wellfilter_block = evt;
        wf_village.set('value', '');
        for (var i = 0; i<wf_village_arr.length ; i++) {
          wf_village.removeOption(lang.clone(wf_village_arr[i]));
          wf_village.store = null;
          wf_village._setDisplay("");
        }
        if(wellfilter_block!="Select Block"){
        wellfilter_query.where = "state like '"+wellfilter_state+"' and district like '" +wellfilter_district+"'"+" and block like '" +wellfilter_block+"'"
        while (wf_village_arr.length > 0) {
          wf_village_arr.pop();
        }
        wf_village_arr.push("Select Village");
        wellfilter_query.outFields = ["village_name"]
        wellfilter_query.returnGeometry = false
        wellfilter_query.returnDistinctValues = true
        wellfilter_query.orderByFields = ["village_name ASC"];
        //querying displacement service url and getting all districts data
        new QueryTask(akah_selectedwells_layer.url).execute(wellfilter_query, function retrieve(selectedblockresponse) {
          window.selectedblockresponse = selectedblockresponse;
          selectedblockresponse.features.forEach(function (feature) {
            village_val = feature.attributes.village_name;
            // districts.push("Select District")
            wf_village_arr.push(village_val);
            var map_v = wf_village_arr.map(function (record) {
              return dojo.create("option", {
                label: record,
                value: record
              })
            })
            wf_village.options.length = 0
            wf_village.addOption("Select Village")
            wf_village.addOption(map_v)
            wf_village.attr('value', wf_village_arr[0])
            dijit.byId("akah_vill").disabled = false;
          });
        });
      }
      })));
      akah_Tool.own(on(wf_village, 'change', lang.hitch(this, function (evt) {
        window.wellfilter_village = evt;
      })));
    },
    wellFilter.downloadWL= function(evt){
      domAttr.set('downloadAlertwl','innerHTML','');
          wellfilter_query.outFields=["*"]
          // wellfilter_query.where = "state like '"+akahstate+"' and district like '"+akahdistrict+"' and block like '"+akahblock+"' and village_name like '"+akahvillage+"'";
          if(evt.includes("State") === true){
            wellfilter_query.where = "state like '"+akahstate+"'";
            dialogwaterlevels.domNode.getElementsByTagName("img")[1].style.display = "block"
          }
          else if(evt.includes("District") === true){
            wellfilter_query.where = "district like '"+akahdistrict+"'";
            dialogwaterlevels.domNode.getElementsByTagName("img")[3].style.display = "block"
          }
          else if(evt.includes("Block") === true){
            wellfilter_query.where = "block like '"+akahblock+"'";
            dialogwaterlevels.domNode.getElementsByTagName("img")[5].style.display = "block"
          }
          else if(evt.includes("Village") === true){
            wellfilter_query.where = "village_name like '"+akahvillage+"'";
            dialogwaterlevels.domNode.getElementsByTagName("img")[7].style.display = "block"
          }
          var waterlevelsArr = [];window.waterlevelsArr=waterlevelsArr;
          var queriesWL=[];window.queriesWL=queriesWL;
          new QueryTask(selectedwellsPrimary_layer.url).execute(wellfilter_query, function retrieve(response) {
            wellResponse = response;
            window.wellResponse = wellResponse;
            var queryWL = new Query();
            queryWL.returnGeometry = false
            queryWL.outFields = ["latitude","longitude","unique_well_id_fk","objectid","date_time","observation_count_in_month","water_level_mbgl","water_status"]      
            queryWL.orderBy=["objectid ASC"]    
            wellResponse.features.forEach(function(feature, featureindex){
                queryWL.where = "unique_id_fk like '" +feature.attributes.unique_id+"'"
                queriesWL.push(new QueryTask(selectedwellsWL_layer.url).execute(queryWL));
            })
              executeAll(queriesWL).then(function(results){
                for(var a = 0;a<results.length; a++){
                  for(var b = 0; b< results[a].features.length; b++){
                    results[a].fields.forEach(function(fieldname){
                      if(results[a].features[b].attributes[fieldname.name] == null){results[a].features[b].attributes[fieldname.name]="";}
                     });
                     results[a].features[b].attributes.state = akahstate
                     results[a].features[b].attributes.district = akahdistrict
                     results[a].features[b].attributes.block = akahblock
                     results[a].features[b].attributes.village = akahvillage
                     results[a].features[b].attributes.owner_name  = wellResponse.features[a].attributes.owner_name 
                     results[a].features[b].attributes.surveyor_name  = wellResponse.features[a].attributes.surveyor_name 
                      waterlevelsArr.push(results[a].features[b])
                  }
                }
                // waterlevelsArr.forEach(function(waterlevelfeature){
                //   waterlevelfeature.attributes.state = akahstate;
                //   waterlevelfeature.attributes.district = akahdistrict;
                //   waterlevelfeature.attributes.block = akahblock;
                //   waterlevelfeature.attributes.village = akahvillage;
                // });
                var data = waterlevelsArr;
                if(waterlevelsArr.length > 0){
                var csv = convertArrayOfObjectsToCSV({
                  data: data 
                });
                if (!csv.match(/^data:text\/csv/i)) {
                    csv = 'data:text/csv;charset=utf-8,' + csv;
                }
                  var encodedUri = encodeURI(csv);
                  var link = document.createElement('a');
                  link.setAttribute('href', encodedUri);
                  var lname="WaterLevels";
                  var atname=lname + "_Exportdata.csv";
                  link.setAttribute('download',atname);
                  link.click();
              }
              else{
              domAttr.set('downloadAlertwl','innerHTML','<p><b>Note:</b> Water levels data is not available for the selected location</p>');
              }
              dialogwaterlevels.domNode.getElementsByTagName("img")[1].style.display = "none"
              dialogwaterlevels.domNode.getElementsByTagName("img")[3].style.display = "none"
              dialogwaterlevels.domNode.getElementsByTagName("img")[5].style.display = "none"
              dialogwaterlevels.domNode.getElementsByTagName("img")[7].style.display = "none"
              });
          });
    };
    wellFilter.downloadWQ=function(evt){
      domAttr.set('downloadAlertwq','innerHTML','');
      wellfilter_query.outFields=["*"]
      if(evt.includes("State") === true){
        wellfilter_query.where = "state like '"+akahstate+"'";
        dialogwaterquality.domNode.getElementsByTagName("img")[1].style.display = "block"
      }
      else if(evt.includes("District") === true){
        wellfilter_query.where = "district like '"+akahdistrict+"'";
        dialogwaterquality.domNode.getElementsByTagName("img")[3].style.display = "block"
      }
      else if(evt.includes("Block") === true){
        wellfilter_query.where = "block like '"+akahblock+"'";
        dialogwaterquality.domNode.getElementsByTagName("img")[5].style.display = "block"
      }
      else if(evt.includes("Village") === true){
        wellfilter_query.where = "village_name like '"+akahvillage+"'";
        dialogwaterquality.domNode.getElementsByTagName("img")[7].style.display = "block"
      }
      var queriesWQ=[];window.queriesWQ=queriesWQ;
      var waterqualityArr = [];window.waterqualityArr=waterqualityArr;
      new QueryTask(selectedwellsPrimary_layer.url).execute(wellfilter_query, function retrieve(response) {
        wellResponse = response;
        window.wellResponse = wellResponse;
        var queryWQ = new Query();
        queryWQ.returnGeometry = false
        queryWQ.outFields = ["season","unique_well_id_fk","latitude","longitude","objectid","date_time"]  
        queryWQ.orderBy=["objectid ASC"]    
        wellResponse.features.forEach(function(feature, featureindex){
            queryWQ.where = "unique_id_fk like '" +feature.attributes.unique_id+"'"
            queriesWQ.push(new QueryTask(selectedwellsWQ_layer.url).execute(queryWQ));
        })
          executeAll(queriesWQ).then(function(results){
            for(var a = 0;a<results.length; a++){
              for(var b = 0; b< results[a].features.length; b++){
                  results[a].fields.forEach(function(fieldname){
                   if(results[a].features[b].attributes[fieldname.name] == null){results[a].features[b].attributes[fieldname.name]="";}
                  });
                  results[a].features[b].attributes.state = akahstate
                  results[a].features[b].attributes.district = akahdistrict
                  results[a].features[b].attributes.block = akahblock
                  results[a].features[b].attributes.village = akahvillage
                  results[a].features[b].attributes.owner_name  = wellResponse.features[a].attributes.owner_name 
                  results[a].features[b].attributes.surveyor_name  = wellResponse.features[a].attributes.surveyor_name 
                waterqualityArr.push(results[a].features[b]);
               }
            }
            // waterqualityArr.forEach(function(waterqualityfeature){
            //       waterqualityfeature.attributes.state = akahstate;
            //       waterqualityfeature.attributes.district = akahdistrict;
            //       waterqualityfeature.attributes.block = akahblock;
            //       waterqualityfeature.attributes.village = akahvillage;
            //     });
            var data = waterqualityArr;
            if(waterqualityArr.length > 0){
                  var csv = convertArrayOfObjectsToCSV({
                    data: data 
                   });
                    if (!csv.match(/^data:text\/csv/i)) {
                      csv = 'data:text/csv;charset=utf-8,' + csv;
                    }
                    var encodedUri = encodeURI(csv);
                    var link = document.createElement('a');
                    link.setAttribute('href', encodedUri);
                    var lname="WaterQuality";
                    var atname=lname + "_Exportdata.csv";
                    link.setAttribute('download',atname);
                    link.click();
            }
            else{
              domAttr.set('downloadAlertwq','innerHTML','<p><b>Note:</b> Water quality data is not available for the selected location</p>');
            }
            dialogwaterquality.domNode.getElementsByTagName("img")[1].style.display = "none"
            dialogwaterquality.domNode.getElementsByTagName("img")[3].style.display = "none"
            dialogwaterquality.domNode.getElementsByTagName("img")[5].style.display = "none"
            dialogwaterquality.domNode.getElementsByTagName("img")[7].style.display = "none"
          });
      });
    };
    convertArrayOfObjectsToCSV=function(value){
      var result, ctr, keys, columnDelimiter, lineDelimiter, data;
            data = Array.from(new Set(value.data)).filter(d => d).map(d => d.attributes) || null;
            if (!data || !data.length) {
                return null;
            }
            columnDelimiter = value.columnDelimiter || ',';
            lineDelimiter = value.lineDelimiter || '\n';
            if(data.length == 1){
              keys = Object.keys(data[0]);
              }
              else{
              keys = Object.keys(data[1]);
              }
            result = '';
            result += keys.join(columnDelimiter);
            result += lineDelimiter;
            data.forEach(function(item) {
                ctr = 0;
                keys.forEach(function(key) {
                    if (ctr > 0) 
                        result += columnDelimiter;
                        result += item[key];
                        ctr++;
                });
                result += lineDelimiter;
            });
            return result;
    };
  return wellFilter;
});
