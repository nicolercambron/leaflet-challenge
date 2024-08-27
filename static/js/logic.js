// Step 1: Initialize the map
let map = L.map("map").setView([37.7749, -122.4194], 5); // Centered on San Francisco, zoom level 5

// Step 2: Add a tile layer (the base map)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Step 3: Fetch the earthquake data from USGS
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(data => {

  // Function to set marker size based on magnitude
  function markerSize(magnitude) {
    return magnitude * 4;
  }

  // Function to set marker color based on depth
  function markerColor(depth) {
    return depth > 90 ? "#FF5F65" :
           depth > 70 ? "#FCA35D" :
           depth > 50 ? "#FDB72A" :
           depth > 30 ? "#F7DB11" :
           depth > 10 ? "#DCF400" :
                        "#A3F600";
  }

  // Step 4: Create a marker for each earthquake
  L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]} km</p>`);
    }
  }).addTo(map);

  // Step 5: Create a legend for the map
  let legend = L.control({ position: "bottomright" });

  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend"),
        depths = [0, 10, 30, 50, 70, 90],
        labels = [];

    // Loop through the intervals and generate a label with a colored square for each interval
    for (let i = 0; i < depths.length; i++) {
      div.innerHTML +=
        '<i style="background:' + markerColor(depths[i] + 1) + '"></i> ' +
        depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
    }

    return div;
  };

  legend.addTo(map);
});
