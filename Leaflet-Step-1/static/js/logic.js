var queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

d3.json(queryUrl,function(data) {
    console.log(data.features);
  });

function createFeatures(features) {
    var 
};