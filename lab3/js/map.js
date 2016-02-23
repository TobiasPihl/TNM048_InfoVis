function map(data) {

    var zoom = d3.behavior.zoom()
            .scaleExtent([0.3, 8])
            .on("zoom", move);

    var mapDiv = $("#map");

    var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = mapDiv.width() - margin.right - margin.left,
            height = mapDiv.height() - margin.top - margin.bottom;

    var curr_mag = 4;

    var format = d3.time.format.utc("%Y-%m-%dT%H:%M:%S.%LZ");

    var timeExt = d3.extent(data.map(function (d) {
        return format.parse(d.time);
    }));

    var filterMagData = data;
    var filterTimeData = data;

    //Sets the colormap
    var colors = colorbrewer.Set3[10];

    //Assings the svg canvas to the map div
    var svg = d3.select("#map").append("svg")
            .attr("width", width)
            .attr("height", height)
            .call(zoom);

    var g = svg.append("g");

    //Sets the map projection
    var projection = d3.geo.mercator()
            .center([8.25, 56.8])
            .scale(700);

    //Creates a new geographic path generator and assing the projection        
    var path = d3.geo.path().projection(projection);

    //Formats the data in a feature collection through geoFormat()
    var geoData = {type: "FeatureCollection", features: geoFormat(data)};
    

    
    //Loads geo data
    d3.json("data/world-topo.json", function (error, world) {
        var countries = topojson.feature(world, world.objects.countries).features;
        draw(countries);
    });

    //Calls the filtering function 
    d3.select("#slider").on("input", function () {
        filterMag(this.value, data);
    });

    //Formats the data in a feature collection
    function geoFormat(array) {
        var data = [];
		
        array.map(function (d, i) {
            //Complete the code
			
			data.push (
				{
					type: "Feature", 
					geometry: { 
						type : "Point", 
						coordinates: [(d.lon), (d.lat)]
					},
					properties: _.clone(d),
				}
			);
        });
        return data;
    }

    //Draws the map and the points
    function draw(countries)
    {
        //draw map
        var country = g.selectAll(".country").data(countries);
        country.enter().insert("path")
                .attr("class", "country")
                .attr("d", path)
                .style('stroke-width', 1)
                .style("fill", "lightgray")
                .style("stroke", "white");

		//draw point
		var point = g.append("path")
			.attr("class", "point")
			.datum(geoData)
			.attr("d", path);
    };

    //Filters data points according to the specified magnitude
    function filterMag(value) {

        filterMagData = filterMagData.filter(function(d){
                if(d.mag > value) return 1;
            return 0;
        });

        geoData = {type: "FeatureCollection", features: geoFormat(filterTimeData.filter(function(d){
                if(d.mag > value) return 1;
            return 0;
        }))};

        //draw point
        g.selectAll(".point").remove();
        var point = g.append("path")
            .attr("class", "point")
            .datum(geoData)
            .attr("d", path);
    }
    
    //Filters data points according to the specified time window
    this.filterTime = function (value) {

        filterTimeData = filterTimeData.filter(function(d){
            var temp = format.parse(d.time);
                if(temp > value[0] && temp < value[1]) return 1;
            return 0;
        });

        geoData = {type: "FeatureCollection", features: geoFormat(filterMagData.filter(function(d){
            var temp = format.parse(d.time);
                if(temp > value[0] && temp < value[1]) return 1;
            return 0;
        }))};
        
        //draw point
        g.selectAll(".point").remove();
        var point = g.append("path")
            .attr("class", "point")
            .datum(geoData)
            .attr("d", path);
    };

    //Calls k-means function and changes the color of the points  
    this.cluster = function () {
        //Complete the code
    };

    //Zoom and panning method
    function move() {

        var t = d3.event.translate;
        var s = d3.event.scale;

        zoom.translate(t);
        g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
    }

    //Prints features attributes
    function printInfo(value) {
        var elem = document.getElementById('info');
        elem.innerHTML = "Place: " + value["place"] + " / Depth: " + value["depth"] + " / Magnitude: " + value["mag"] + "&nbsp;";
    }

}
