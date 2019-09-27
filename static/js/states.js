//Width and height of map
var width2 = 960;
var height2 = 500;

var lowColor = '#f9f9f9'
var highColor = '#bc2a66'

// D3 Projection
var projection = d3.geoAlbersUsa()
  .translate([width2 / 2, height2 / 2]) // translate to center of screen
  .scale([1000]); // scale things down so see entire US

// Define path generator
var path = d3.geoPath() // path generator that will convert GeoJSON to SVG paths
  .projection(projection); // tell path generator to use albersUsa projection

//Create SVG element and append map to the SVG
var svg2 = d3.select("#map")
  .append("svg")
  .attr("width", width2)
  .attr("height", height2);

// Load in brewery data
d3.json("/brewery-data", data => {
  console.log(data);

	var ramp = d3.scaleLinear().domain([0,150]).range([lowColor,highColor]).interpolate(d3.interpolateLab);

  // Load GeoJSON data and merge with states data
  d3.json("/brewery-states", json => {
    console.log(json);
      // Loop through each state data value in the .csv file
    for (var i = 0; i < data.length; i++) {

        // Grab State Name
      var breweryState = data[i].brewery_state;
          
        // Grab state count
      var breweryCount = data[i].count;

        // Find the corresponding state inside the GeoJSON
      for (var j = 0; j < json.features.length; j++) {
        var jsonState = json.features[j].properties.abbr;

        if (breweryState == jsonState) {

            // Copy the data value into the JSON
          json.features[j].properties.count = breweryCount;

            // Stop looking through the JSON
          break;
        }
      }
    }    

    // Bind the data to the SVG and create one path per GeoJSON feature
    svg2.selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("stroke", "#fff")
      .style("stroke-width", "1")
      .style("fill", d => { return ramp(d.properties.count)});
    
		// add a legend
		var w = 140, h = 300;

		var key = d3.select("#map")
			.append("svg")
			.attr("width", w)
			.attr("height", h)
			.attr("class", "legend");

		var legend = key.append("defs")
			.append("svg:linearGradient")
			.attr("id", "gradient")
			.attr("x1", "100%")
			.attr("y1", "0%")
			.attr("x2", "100%")
			.attr("y2", "100%")
			.attr("spreadMethod", "pad");

		legend.append("stop")
			.attr("offset", "0%")
			.attr("stop-color", highColor)
			.attr("stop-opacity", 1);
			
		legend.append("stop")
			.attr("offset", "100%")
			.attr("stop-color", lowColor)
			.attr("stop-opacity", 1);

		key.append("rect")
			.attr("width", w - 100)
			.attr("height", h)
			.style("fill", "url(#gradient)")
			.attr("transform", "translate(0,10)");

		var y = d3.scaleLinear()
			.range([h, 0])
			.domain([0, 146]);

		var yAxis = d3.axisRight(y);
 
		key.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(41,10)")
			.call(yAxis)
  });
})