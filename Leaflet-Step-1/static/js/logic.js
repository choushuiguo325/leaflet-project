// create a map view
var myMap = L.map("map", {
    center: [45.52, -122.67],
    zoom: 5
});

// create a titlelayer as the background
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
}).addTo(myMap);

// var c = 'green';
// var marker = L.marker([45.52, -122.67], {
//     draggable: true,
//     title: 'title',
//     radius: 5,
//     fillColor: c
// }).addTo(myMap);
// // Binding a pop-up to our marker
// marker.bindPopup("<h1>" + 'title' + "</h1> <hr> <h3>Magnitude: " + 5 + "</h3>").addTo(myMap);


// Store our API endpoint inside queryUrl
var queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// access the data in stored in the API
d3.json(queryUrl).then(function (data) {
    process(data.features);
});

function process(features) {
    console.log(features);
    // function onEachFeature(feature, layer) {
    //     layer.bindPopup(`<h1>${feature.properties.title}<h1><hr><h3> ${feature.geometry.coordinates[2]}</h3>`)
    // };
    // let earthquakes = L.geoJSON(features,
    //     { onEachFeature: onEachFeature })
    features.forEach((feature) => {
        var lon = feature.geometry.coordinates[0];
        var lat = feature.geometry.coordinates[1];
        var depth = feature.geometry.coordinates[2];
        var mag = feature.properties.mag;
        var title = feature.properties.title;
        var c = 'green';
        // console.log(`${lat}, ${lon}, ${depth}, ${mag}, ${title}`);
        var marker = L.circle([lat, lon], {
            draggable: true,
            title: title,
            radius: mag*15000,
            fillColor: c
        }).addTo(myMap);
        // Binding a pop-up to our marker
        marker.bindPopup(`<h3>${title}</h3>`).addTo(myMap);
    });
};