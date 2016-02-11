function sp(){

    var self = this; // for internal d3 functions

    var spDiv = $("#sp");

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = spDiv.width() - margin.right - margin.left,
        height = spDiv.height() - margin.top - margin.bottom;
	
	
    //initialize color scale
    //...
	var color = d3.scale.category20();
	
    //initialize tooltip
    //...
	
	// Ex1: Simply add a small text beside over point
	//var tooltip = d3.select("body")
		// .append("div")
		// .style("position", "absolute")
		// .style("z-index", "10")
		// .style("visibility", "hidden")
		// .text( "Test" );
		
	// Ex2: A tooltip which has a window
	var div = d3.select("body").append("div")	
		.attr("class", "tooltip")				
		//.style("opacity", 0);
		.style("visability", false);

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#sp").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	
	var xMax, yMax, xString, yString;
    //Load data
    d3.csv("data/OECD-better-life-index-hi.csv", function(error, data) {
        self.data = data;
        
        //define the domain of the scatter plot axes
        //...
		xString = "Household income";
		yString = "Employment rate";
		
		x.domain(d3.extent(self.data, function(d) {return d[xString]}) /*[0, xMax]*/);
		xAxis.ticks(5);
		y.domain(d3.extent(self.data, function(d) {return d[yString]})   /*[0, yMax]*/);
		
        draw();

    });

    function draw()
    {
		//initialize a color country object	
        var cc = {};
		
		self.data.forEach(function(d){
			cc[d["Country"]] = color(d["Country"]);
		})
	
        // Add x axis and title.
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
			.attr("text-anchor", "end")
            .attr("x", width)
            .style("font-size", "15px")
			.attr("y", -6)
			.text(xString);
            
        // Add y axis and title.
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label").text(yString)
            .attr("transform", "rotate(-90)")
			.attr("text-anchor", "end")
			.style("font-size", "15px")
            .attr("y", -40)
            .attr("dy", ".71em");
            
		//Get min and max on the x & y scale
		xMax = d3.max(self.data, function(d) { return +d[xString]; });
		xMin = d3.min(self.data, function(d) { return +d[xString]; });
		yMax = d3.max(self.data, function(d) { return +d[yString]; });
		yMin = d3.min(self.data, function(d) { return +d[yString]; });
		
        // Add the scatter dots.
        svg.selectAll(".dot")
            .data(self.data)
            .enter().append("circle")
            .attr("class", "dot")
            //Define the x and y coordinate data values for the dots
            //...
			.style("fill", function(d){	return cc[d.Country]})
			.attr("cx", function(d) { return (width/(xMax-xMin))*(d[xString]-xMin); })
			.attr("cy", function(d) { return height-(height/(yMax-yMin))*(d[yString]-yMin); })
			.attr("r", 4)
			
            // Ex1: tooltip mouse functions
			// .on("mouseover", function(){/*###*/ console.log(self.data.County); return tooltip.style("visibility", "visible");})
			// .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
			// .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
			
			// Ex2: tooltip mouse funtions
			.on("mouseover", function(d) {		
            
				div.transition()		
					.duration(1)		
					//.style("opacity", .9);
					.style("visability", true);
					
				div	.html( function(d2){
					return (
						d.Country //+ '<br>'
						
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
					.style("visability", true);					
			})
			
			
            .on("click",  function(d) {
                //... 
                // svg.selectAll(".dot").style("fill", function(d2) {
				    // if(d.Country == d2.Country)
				    	// return color(d["Country"]);
				    // return d3.rgb(255,255,255);
				// });  
                //pc1.selectLine(d);
				
				sp1.selectDot(d);
				selFeature(d);
            });
    }

    //method for selecting the dot from other components
    this.selectDot = function(value){
        //...
        
        svg.selectAll(".dot").style("fill", function(d) {
            for(var i in value)
            	if(d.Country == value[i])
            		return color(d["Country"]);
            return d3.rgb(255,255,255);
    	});
    };
    
    //method for selecting features of other components
    function selFeature(value){
        //...
		pc1.selectLine(value);
    }

}




