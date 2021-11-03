var querygwmStates = new Query()
querygwmStates.where = "state LIKE 'Maharashtra'"
querygwmStates.returnGeometry = false
querygwmStates.outFields = ["*"]
querygwmStates.returnDistinctValues = true
new QueryTask(gwm_station_layer.url).executeForCount(querygwmStates, function(gwm_state_response1){
  window.gwm_state_response1 = gwm_state_response1;
  querygwmStates.where = "state LIKE 'Gujarat'"
    new QueryTask(gwm_station_layer.url).executeForCount(querygwmStates, function(gwm_state_response2){
      window.gwm_state_response2 = gwm_state_response2;
      //akah_Tool.getChartCGWB();
    });
});
var querygwm1 = new Query()
querygwm1.where = "district LIKE 'Aurangabad'"
querygwm1.returnGeometry = false
querygwm1.outFields = ["*"]
querygwm1.returnDistinctValues = true
new QueryTask(gwm_station_layer.url).executeForCount(querygwm1, function(gwm_response1){
  window.gwm_response1 = gwm_response1;
  querygwm1.where = "district LIKE 'Junagadh'"
    new QueryTask(gwm_station_layer.url).executeForCount(querygwm1, function(gwm_response2){
      window.gwm_response2 = gwm_response2;
      //akah_Tool.getChartCGWB();
    });
});



var queryGangapur = new Query()
queryGangapur.where = "project_location LIKE 'Gangapur' OR project_location LIKE 'gangapur'";
queryGangapur.returnGeometry = false
queryGangapur.outFields = ["*"]
// queryGangapur.returnDistinctValues = true
new QueryTask(akah_selectedwells_layer.url).executeForCount(queryGangapur, function(gangapur_response){
  window.gangapur_response = gangapur_response;
  //domAttr.set("sum_gangapur","innerHTML","<b>" + gangapur_response + "</b>");
  queryGangapur.where = "project_location LIKE 'Chitravad' OR project_location LIKE 'chitravad'";
  new QueryTask(akah_selectedwells_layer.url).executeForCount(queryGangapur, function(chitravad_response){
    window.chitravad_response = chitravad_response;
    // domAttr.set("sum_chitravad","innerHTML","<b>" + chitravad_response + "</b>");
    //domAttr.set("sum_observationWell_gt","innerHTML","<b>" + chitravad_response + "</b>");

    var querywell = new Query()
    querywell.returnGeometry = false
    querywell.outFields = ["*"]
    querywell.returnDistinctValues = true
    querywell.where = "project_lo LIKE 'Gangapur' AND well_type LIKE 'well'"
    new QueryTask(akah_main_layer.url).executeForCount(querywell, function(ganga_response1){
      window.ganga_response1 = ganga_response1;
      // domAttr.set("sum1_well","innerHTML","<b>" + well_response1 + "</p>");
      querywell.where = "project_lo LIKE 'Gangapur' AND well_type LIKE 'bore_well'"
        new QueryTask(akah_main_layer.url).executeForCount(querywell, function(ganga_response2){
          window.ganga_response2 = ganga_response2;
          // domAttr.set("sum1_well","innerHTML","<b>" + well_response1 + "</p>");
          querywell.where = "project_lo LIKE 'Chitravad' AND well_type LIKE 'well'"
              new QueryTask(akah_main_layer.url).executeForCount(querywell, function(chit_response1){
                window.chit_response1 = chit_response1;
                querywell.where = "project_lo LIKE 'Chitravad' AND well_type LIKE 'bore_well'"
                  new QueryTask(akah_main_layer.url).executeForCount(querywell, function(chit_response2){
                    window.chit_response2 = chit_response2;
                    //akah_Tool.goToPritWellChart();
                  });
              });
        });
    });


  });
});
