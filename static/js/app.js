function buildChart(response) {
    let data = response;
    // console.log(response);

        d3.select("#d3Object").append("svg").attr("width",600).attr("height",600)
            .style("border","1px solid black")
            
        let colorScale = d3.scaleOrdinal()
            .range(["#5EAFC6", "#FE9922", "#93c464", "#75739F"])
        
            let style1= [];
            let style2= [];
            let style3= [];
            let style4= [];
            let style5= [];
            let style6= [];
            let style7= [];
            let style8= [];
            let style9= [];
            let style10= [];
            data.forEach(function (){
              if (data == "American IPA") {
                style1.push(data.beer_name);
            } else if (data == "American Pale Ale") {
                style2.push(data.beer_name);
            } else if (data == 'American Amber / Red Ale') {
                style3.push(data.beer_name);
            } else if (data == 'American Double / Imperial IPA') {
              style4.push(data.beer_name);
            } else if (data == 'American Blonde Ale') {
              style5.push(data.beer_name);
            } else if (data == 'American Pale Wheat Ale') {
              style6.push(data.beer_name);
            } else if (data == 'American Porter') {
              style7.push(data.beer_name);
            } else if (data == 'American Brown Ale') {
              style8.push(data.beer_name);
            } else if (data == 'Fruit / Vegetable Beer') {
              style9.push(data.beer_name);
            } else {
              style10.push(data.beer_name);
            }
            })
        
    let heirarchy = [{
        "style": "American IPA",
        "beers": style1
        },
        {
        "style": "American Pale Ale",
        "beers":style2
        },
        {
        "style":'American Amber / Red Ale',
        "beers": style3
        },
        {
        "style":'American Double / Imperial IPA',
        "beers": style4
        },
        {
        "style":'American Blonde Ale',
        "beers": style5
        },
        {
        "style": 'American Pale Wheat Ale',
        "beers": style6
        },
        {
        "style": 'American Porter',
        "beers": style7
        },
        {
        "style": 'American Brown Ale',
        "beers": style8
        },
        {
        "style": 'Fruit / Vegetable Beer',
        "beers": style9
        },
        {
        "style": 'Hefeweizen',
        "beers": style10
        }];

        // Format the data for hierarchical sorting. Id corresponds to the name of the node, and parentId corresponds to the name of the parent. Feed these the corresponding csv points for each object in the CSV array.
        var nest = d3.nest() // allows elements in an array to be grouped into a hierarchical tree structure
         .key(function(d) { return d.heirarchy.style; }) // levels in the tree are specified by key functions. can have multiple keys
         .key(function(d) { return d.heirarchy.beers; })
        
        var root = d3.hierarchy({data:nest.entries(data)},function(d){return d.data;});
        
        // treemap(root)
        
        // let rootFormat = d3.stratify()
        //         // name
        //         .id(heirarchy[0])
        //         // parent
        //         .parentId(heirarchy[1])
            
        // let root = rootFormat(response)
          
            
        // The size of the chart is a measurement of the radius, drawn out fro the 0,0 of the container like a circle element. Thus our treechart should be smaller.
            
         let treeChart = d3.tree()
            .size([250,250])
         
         // Create a generator
         let treeData = treeChart(root).descendants()
        
         d3.select("svg").append("g").attr("id","treeG")
            .attr("transform",`translate(250,250)`)
            
        
            // We need to create a function that will project our XY coordinates onto a radial coordinate system.
            
            function project(x,y){
               let angle = x / 90 * Math.PI
                let radius = y
                return [radius * Math.cos(angle), radius * Math.sin(angle)];
            }
            
        d3.select("#treeG").selectAll("circle")
            .data(treeData).enter()
            .append("g")
            .attr("class","node")
            .append("circle")
            .attr("r", 10)
            .attr("cx", d => project(d.x, d.y)[0])
            .attr("cy", d => project(d.x, d.y)[1])
            .style("fill", d => colorScale(d.depth))
            
           d3.select("#treeG").selectAll("line")
                .data(treeData.filter(d => d.beer_style)) // Excludes root node
                .enter()
                .insert("line","g")
                    .attr("x1", d => project(d.x, d.y)[0])
                    .attr("x2", d => project(d.beer_style.x, d.beer_style.y)[0])
                    .attr("y1", d => project(d.x, d.y)[1])
                    .attr("y2", d => project(d.beer_style.x, d.beer_style.y)[1])
                    .style("stroke","black")
    }

    d3.json('http://localhost:5000/beer-data', buildChart);