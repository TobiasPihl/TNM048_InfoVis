    /**
    * k means algorithm
    * @param data
    * @param k
    * @return {Object}
    */
   
    function kmeans(data, k) {

        // 1: Initial Step: Randomize k-lines and initiate lists
		//====================================================
		
		//holds the k:s or centroids
		var kList = {};

		//Used to extract dimension names for multidimensional datasets
		var keys = d3.keys(data[0]).filter(function(dim) {
            if(dim != "id" && dim != "place" && dim != "time")
            return (d3.scale.linear().domain(d3.extent(data, function(p) { 
           		return +p[dim];
            })));
        else
        	return false;
        });
		//holds lists containg lines closest to current k
		var trackList = [];
		
		//holds indexes which are used to set color
		var colorIndexList = {};
		
		
		var format = d3.time.format.utc("%Y-%m-%dT%H:%M:%S.%LZ");
		
		for(var i=0; i<k; i++) {
			//get random line as initial k
			
			kList[i] = [];
			var tempPoint = data[Math.floor(Math.random() * data.length)];
			keys.forEach(function(dim){
				kList[i][dim] = tempPoint[dim];
			});
			
			//initiate k nr lists
			trackList[i] = [];
		}


		// 2: Iterative process: calculate new average K or centroids
		//====================================================
		
		//Store quality measure from last iteration
		var lastQualityMeasure = null;
		console.log(kList);
		//TEST : DO 15 TIMES MAX, this is aborted if quality is sufficient
		for (var l = 0; l < 15; l++) {

			// Empty trackList before filling it with new lines for every k
			for(var i = 0; i < k; i++) {
				trackList[i].length = 0;
			}
			//do for each line
			data.forEach(function(d, i){
				var distance = {};
				var smallestDistIndex = 0;
				
				for(var j = 0; j < k; j++){		
					//calculate distance to every centroid.
					distance[j] = 0;
					
					keys.forEach(function(dim){
						distance[j] += Math.pow(( kList[j][dim] - d[dim] ), 2);
					});
					distance[j] =  Math.sqrt(distance[j]);
					
					// If distance to this centroid is shorter than to the last , remember new index
					if(distance[j] < distance[smallestDistIndex])
						smallestDistIndex = j;
				}
				
				// Put line in list nr [smallestDistIndex]
				trackList[smallestDistIndex].push(d);
				
				//store closest k index in array which is used to assign colors
				colorIndexList[i] = smallestDistIndex;

			});
			
			// A temp var that holds avg ABC for each k
			var tempAvg = [];
			
			for(var i=0; i<k; i++) {
			
				// Sum all A,B,C from the trackinglist
				for(var j = 0; j < trackList[i].length; j++) {
					//use parsefloat to prevent tracklist from being read as strings
					keys.forEach(function(dim){
						//Instantiate if needed
						if(tempAvg[dim] == null)
							tempAvg[dim] = 0;
						tempAvg[dim] += parseFloat( trackList[i][j][dim] );
					});
				}
				// divide by tracklist length to get avg
				keys.forEach(function(dim) {
					tempAvg[dim]  /= parseFloat( trackList[i].length );
				});
			
				// replace the old kList value with the new average
				// and reset tempAvg for next iteration
				keys.forEach(function(dim){
					kList[i][dim] = tempAvg[dim];
					tempAvg[dim]  = 0;
				});		
			}
			
			
			//use for quality measure
			var quality = 0;
			
			// Calculate the quality to determine if main loop should stop
			for(var n = 0; n < k; n++) {
				for(var m = 0; m < trackList[n].length; m++) {
					
					var qualityDiff = 0;
					keys.forEach(function(dim) {
						qualityDiff += Math.pow( parseFloat( trackList[n][m][dim] ) - kList[n][dim], 2);
					});
					
					quality += qualityDiff;
				}
			}
			
			
			//test quality
			if ( lastQualityMeasure != null) {
				
				//if quality compared to last iteration is below a threshold, stop looping
				if(lastQualityMeasure / quality < 1.01) {
					break;
				}
			}
			
			//set new quality measure as lastQualityMeasure for next iteration
			lastQualityMeasure = quality;
			
		}
		
		return colorIndexList;
      };
    