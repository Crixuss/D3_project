var svgWidth = 960;
var svgHeight = 500;
var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};
console.log(svgHeight);
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
var svg = d3.select("#plot")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  let clickCount = 1;

function position (data) {
    var num_to_return = 0;
    // console.log(`position function: ${data}`);
    if (data == "American IPA") {
        num_to_return = 1;
    } else if (data == "American Pale Ale") {
        num_to_return = 2;
    } else if (data == 'American Amber / Red Ale') {
        num_to_return = 3;
    } else if (data == 'American Double / Imperial IPA') {
        num_to_return = 4;
    } else if (data == 'American Blonde Ale') {
        num_to_return = 5;
    } else if (data == 'American Pale Wheat Ale') {
        num_to_return = 6;
    } else if (data == 'American Porter') {
        num_to_return = 7;
    } else if (data == 'American Brown Ale') {
        num_to_return = 8;
    } else if (data == 'Fruit / Vegetable Beer') {
        num_to_return = 9;
    } else {
        num_to_return = 10;
    }
    return num_to_return;
};

function drawCircles(data) {
    svg.selectAll('g').remove();
    var chartGroup = svg.append("g")
                        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    var xLinearScale= d3.scaleLinear()
        .range([0, width])
        .domain([0,10]);
    var yLinearScale = d3.scaleLinear()
        .range([height, 0])
        .domain(d3.extent(data, d => d.beer_abv));
    var yLinearScale2 =  d3.scaleLinear()
        .range([height, 0])
        .domain(d3.extent(data, d => d.beer_ibu));
    var bottomAxis = d3.axisBottom(xLinearScale)
        .tickValues([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        .tickFormat(function(d){
          if (d == 1){
            return 'American IPA'
          } else if (d == 2){
            return 'American Pale Ale'
          } else if (d == 3) {
            return 'American Amber / Red Ale'
          } else if (d == 4) {
            return 'American Double / Imperial IPA'
          } else if (d == 5) {
            return 'American Blonde Ale'
          } else if (d == 6) {
            return 'American Pale Wheat Ale'
          } else if (d == 7) {
            return 'American Porter'
          } else if (d == 8) {
            return 'American Brown Ale'
          } else if (d == 9) {
            return 'Fruit / Vegetable Beer'
          } else if (d == 10) {
            return 'Hefeweizen'
          } else {
            return ''
          };
        });

    if (clickCount % 2 != 0) {
        var leftAxis = d3.axisLeft(yLinearScale);
    } else {
        leftAxis = d3.axisLeft(yLinearScale2);
    }

    chartGroup.append('g')
                 .call(leftAxis);
    let abvAxis = 'Alcohol Content'
    let ibuAxis = 'International Bittering Units'
    chartGroup.append('g')
                .attr('transform', `translate(0, ${height})`)
                .call(bottomAxis).selectAll("text")
                .attr("transform", "rotate(45)")
                .style("text-anchor", "start");

    let circles = chartGroup.selectAll('circle');
    if (clickCount % 2 != 0) {
        circles.data(data)
                .enter()
                .append('circle')
                .attr('cx', d => xLinearScale(position(d.beer_style)))
                .attr('cy', d => yLinearScale(d.beer_abv))
                .attr('r', '15')
                .attr('fill', 'green')
                .attr('opacity', '.5');
        chartGroup.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x", 0 - (height / 2))
                .attr("dy", "1em")
                .classed("axis-text", true)
                .text("Alcohol Content");

    } else { 
        circles.data(data)
                .enter()
                .append('circle')
                .attr('cx', d => xLinearScale(position(d.beer_style)))
                .attr('cy', d => yLinearScale2(d.beer_ibu))
                .attr('r', '15')
                .attr('fill', 'black')
                .attr('opacity', '.5');
        chartGroup.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x", 0 - (height / 2))
                .attr("dy", "1em")
                .classed("axis-text", true)
                .text("International Bittering Units");
    }    
    circles = chartGroup.selectAll('circle');
    circles.exit().remove();

    svg.on('click', function(){
        clickCount=clickCount+1;
        drawCircles(data);
    });
}

function createChart(response) {
    let data = response;
    // console.log(data);
    drawCircles(data);
}

d3.json('http://localhost:5000/beer-data-plot', createChart);