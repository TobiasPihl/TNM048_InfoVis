function pc(){

    var self = this; // for internal d3 functions

    var pcDiv = $("#pc");

    var margin = [30, 10, 10, 10],
        width = pcDiv.width() - margin[1] - margin[3],
        height = pcDiv.height() - margin[0] - margin[2];

    
    //initialize color scale
    //...
	var color = d3.scale.category20();
    
    //initialize tooltip
    //...
	var tooltip = [];
	
	// Ex2: A tooltip which has a window
	var div = d3.select("body").append("div")	
		.attr("class", "tooltip")				
		//.style("opacity", 0);
		.style("visability", false);
		
    var x = d3.scale.ordinal().rangePoints([0, width], 1),
        y = {};
        

    var line = d3.svg.line(),
        axis = d3.svg.axis().orient("left"),
        background,
        foreground;

    var svg = d3.select("#pc").append("svg:svg")
        .attr("width", width + margin[1] + margin[3])
        .attr("height", height + margin[0] + margin[2])
        .append("svg:g")
        .attr("transform", "translate(" + margin[3] + "," + margin[0] + ")");

    //Load data
    d3.csv("data/OECD-better-life-index-hi.csv", function(data) {

        self.data = data;

        // Extract the list of dimensions and create a scale for each.
        //...
		//console.log(self.data.map(function(d) { return d}));
        x.domain(dimensions = d3.keys(self.data[0]).filter(function(d) {
            
			//console.log("d = " + d);
			if(d != "Country")
				return [(y[d] = d3.scale.linear()
					.domain(d3.extent(self.data, function(d2) {return (+d2[d]);}))
					.range([height, 0]))];
        }));

        draw();
    });

    function draw(){
		
		//Declare tooltip object
		self.data.forEach(function(d) {tooltip.push(d.Country)});
		for(var i = 0; i < tooltip.length; i++)
		
		//initialize a color country object	
        var cc = {};
		
		self.data.forEach(function(d){
			cc[d["Country"]] = color(d["Country"]);
		})
	
        // Add grey background lines for context.
        background = svg.append("svg:g")
            .attr("class", "background")
            .selectAll("path")
            //add the data and append the path 
            //...
			.data(self.data)
			.enter()
			.append("path")
			.attr("d", path)
			
			
			
            .on("mousemove", function(d){})
            .on("mouseout", function(){});

        // Add blue foreground lines for focus.
        foreground = svg.append("svg:g")
            .attr("class", "foreground")
            .selectAll("path")
            //add the data and append the path 
            //...
			.data(self.data)
			.enter()
			.append("path")
			.attr("d",path)
			
			//set color
			.style({stroke: function(d){ return cc[d.Country]}, "stroke-width": "2px"})
			
            //.on("mousemove", function(d){console.log("Whaddupp!?" + d["Country"])})
            //.on("mouseout", function(){});
			
			// Ex2: tooltip mouse funtions
			.on("mouseover", function(d) {		
				div.transition()		
					.duration(200)		
					//.style("opacity", .9);
					.style("visability", true);
				div	.html( function(d2){
					return (
						d.Country 
						// + '<br>'
						// + "Household income: " 				+ d["Household income"] + '<br>' 
						// + "Employment rate: " 				+ d["Employment rate"] + '<br>' 
						// + "Unemployment rate: " 			+ d["Unemployment rate"] + '<br>' 
						// + "Quality of support network: " 	+ d["Quality of support network"] + '<br>' 
						// + "Student skills: " 				+ d["Student skills"] + '<br>' 
						// + "Water quality: " 				+ d["Water quality"] + '<br>' 
						// + "Voter turnout: "					+ d["Voter turnout"] + '<br>' 
						// + "Self-reported health: "			+ d["Self-reported health"] + '<br>' 
						// + "Life satisfaction: "				+ d["Life satisfaction"]
					);
				})	
                .style("left", (d3.event.pageX + 10) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
            })					
			.on("mouseout", function(d) {		
				div.transition()		
					.duration(500)		
					//.style("opacity", 0);
					.style("visability", false);					
			})
			
			.on("click",  function(d) {
                //... 
				pc1.selectLine(d);
				selFeature(d);
            });

        // Add a group element for each dimension.
        var g = svg.selectAll(".dimension")
            .data(dimensions)
            .enter().append("svg:g")
            .attr("class", "dimension")
            .attr("transform", function(d) { return "translate(" + x(d) + ")"; });
            
        // Add an axis and title.
        g.append("svg:g")
            .attr("class", "axis")
            //add scale
			.each(function (d) {
				d3.select(this).call(axis.scale(y[d]).ticks(3));
			})
			
            .append("svg:text")
            .attr("text-anchor", "middle")
            .attr("y", -9)
            .text(String);

        // Add and store a brush for each axis.
        g.append("svg:g")
            .attr("class", "brush")
            .each(function(d) { d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brush", brush)); })
            .selectAll("rect")
            .attr("x", -8)
            .attr("width", 16);
    }

    // Returns the path for a given data point.
    function path(d) {
        return line(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
    }

    // Handles a brush event, toggling the display of foreground lines.
    function brush() {
    	var markedObjects = [];
        var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
            extents = actives.map(function(p) { return y[p].brush.extent(); });
        foreground.style("display", function(d) {
            return actives.every(function(p, i) {
            	if(extents[i][0] <= d[p] && d[p] <= extents[i][1])
            		markedObjects.push(d.Country);
                return extents[i][0] <= d[p] && d[p] <= extents[i][1];
            }) ? null : "none";
        });
        sp1.selectDot(markedObjects);
    }

    //method for selecting the pololyne from other components	
    this.selectLine = function(value){
        //...
        console.log(value);
        foreground.style("display", function(d) { 
        	if (d["Country"] == value["Country"])
        		return null;
        	return "none";
        });
    };
    
    //method for selecting features of other components
    function selFeature(value){
        //...
		 sp1.selectDot(value);
    };

}
