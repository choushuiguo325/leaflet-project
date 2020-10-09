

// create a titlelayer as the background
var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "satellite-v9",
    accessToken: API_KEY
});

var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
});

var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "outdoors-v9",
    accessToken: API_KEY
});

// create a map view
var myMap = L.map("map", {
    center: [45.52, -122.67],
    zoom: 4,
    layers: [satellite]
});

var baseMaps = {
    "Satellite": satellite,
    "Grayscale": grayscale,
    "Outdoors": outdoors
  };

var earthquakes = L.layerGroup();
var tectonic = L.layerGroup();
var overlayMaps = {
Earthquakes: earthquakes
};

L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

function chooseColor(depth) {
    var color;
    if (depth < 10 && depth > -10) {
        color = '#80ff00';
        return color;
    } else if (depth < 30 && depth >= 10) {
        color = '#bfff00';
        return color;
    } else if (depth < 50 && depth >= 30) {
        color = '#ffff00';
        return color;
    } else if (depth < 70 && depth >= 50) {
        color = '#ffbf00';
        return color;
    } else if (depth < 90 && depth >= 70) {
        color = '#ff8000';
        return color;
    } else if (depth >= 90) {
        color = '#ff4000';
        return color;
    };
};

// Store our API endpoint inside queryUrl
var queryUrl_1 = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
var queryUrl_2 = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json';
var queryUrl_3 = 'static/data/PB2002_plates.json';


// access the data in stored in the earthquakesAPI
d3.json(queryUrl_1).then(function(data) {
    earthquakeProcess(data.features);
});

// access the data in stored in the tectonic plates API
d3.json(queryUrl_3).then(function(data) {
    console.log("tectonic" + data);
    // L.geoJSON(data, {
    //     onEachFeature: popUpMsg
    //   }).addTo(earthquakes);
});

// function polygon(feature, layer) {
//     layer.bindPopup("<h3>" + feature.properties.place +
//       "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
//   }



// L.polygon([
// [45.54, -122.68],
// [45.55, -122.68],
// [45.55, -122.66]
// ], {
// color: "purple",
// fillColor: "purple",
// fillOpacity: 0.75
// }).addTo(tectonic);


function earthquakeProcess(features) {
    console.log(features);
    features.forEach((feature) => {
        feature.properties.mag = +feature.properties.mag;
        var lon = feature.geometry.coordinates[0];
        var lat = feature.geometry.coordinates[1];
        var depth = +feature.geometry.coordinates[2];
        var mag = feature.properties.mag;
        var title = feature.properties.title;
        var c = chooseColor(depth);
        // chooseColor(depth);
        // console.log(`${lat}, ${lon},${depth}, ${depth}, ${mag}, ${title}, ${c}`);
        var marker = L.circle([lat, lon], {
            draggable: true,
            title: title,
            radius: mag * 15000,
            fillColor: c,
            fillOpacity: 1,
            color: 'black',
            weight: 1
        }).addTo(myMap);
        // Binding a pop-up to our marker
        marker.bindPopup(`<h3>${title}</h3>${depth}`).addTo(earthquakes);
    });


    // Set up the legend

    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");
        var limits = ['− 10-10','10-30','30-50','50-70','70-90','90+']
        var colors = ['#80ff00','#bfff00','#ffff00','#ffbf00','#ff8000','#ff4000'];
        var labels = [];

        // Add min & max
        var legendInfo = 
            "<div class=\"labels\">" + "</div>";         

        div.innerHTML = legendInfo;

        limits.forEach(function (limit, index) {
            labels.push("<li style=\"background-color: " + colors[index] + "\"></li><li>"+ limit + "</li></br>");
            // labels.push(`<li style="background-color:" ${colors[index]} \></li> <li>${limit}</li></br>`);
        });
        console.log(labels);
        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        console.log(div.innerHTML);
        return div;
    };

    // Adding legend to the map
    legend.addTo(myMap);

};

