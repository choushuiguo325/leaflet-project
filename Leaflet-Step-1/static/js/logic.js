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
var queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// access the data in stored in the API
d3.json(queryUrl).then(function (data) {
    process(data.features);
});

function process(features) {
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
        marker.bindPopup(`<h3>${title}</h3>${depth}`).addTo(myMap);
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

    // // Adding table to the map: alternative
    // var table = L.control({ position: "bottomright" });
    // table.onAdd = function () {
    //     var table = L.DomUtil.create("table");
    //     var limits = ['− 10-10','10-30','30-50','50-70','70-90','90+']
    //     var colors = ['#80ff00','#bfff00','#ffff00','#ffbf00','#ff8000','#ff4000'];
    //     var rows = [];

    //     // Add min & max
    //     var tableInfo = 
    //         "<table></table>";      

    //     table.innerHTML = tableInfo;

    //     limits.forEach(function (limit, index) {
    //         rows.push("<td style=\"background-color: " + colors[index] + "\"></td><td : " + limit + "\"></td>");
    //     });
    //     console.log("rows" + rows);

    //     table.innerHTML += "<tr>" + rows.join("") + "</tr>";
    //     console.log("table.innerHTML" + table.innerHTML);
    //     return table;
    // };
    // table.addTo(myMap);


    

};

