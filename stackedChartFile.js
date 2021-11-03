define(["dojo/_base/declare", "dojox/charting/plot2d/StackedColumns", "dojox/charting/plot2d/commonStacked", "dojo/_base/lang"], 
function(declare, StackedColumns, commonStacked, lang){


return declare("FixedStackedCOlumns", StackedColumns, {
    getValue: function(value, index, seriesIndex, indexed){
        var y,x;
        if(indexed){
            x = index;
            y = commonStacked.getIndexValue(this.series, seriesIndex, x, lang.hitch( this, "isNullValue" ) );
        }else{
            x = value.x - 1;
            y = commonStacked.getValue(this.series, seriesIndex, value.x);
            y = [  y[0]?y[0].y:null, y[1]?y[1]:null ];
        }
        // in py we return the previous stack value as we need it to position labels on columns
        return { x: x, y: y[0], py: y[1] };
    }
});
});