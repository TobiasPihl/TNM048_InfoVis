    /**
    * k means algorithm
    * @param data
    * @param k
    * @return {Object}
    */
   
    function kmeans(data, k) {

		// 1: Initial Step: Randomize k-lines and initiate lists
		//====================================================
		
		//Create an array contining data of each column for a line
		//Use keys.forEach to loop through A,B,C and so on
		//keys = d3.keys(data[0]);
		
		//holds the k:s or centroids
		var kList = {};
		
		//an array which holds data of each column for an item
		var keys = [];
		
		//holds lists containg lines closest to current k
		var trackList = [];
		
		//holds indexes which are used to set color
		var colorIndexList = {};
		
		
		//data[Math.random() * ]
		
		
		for(var i=0; i<k; i++) {
			//get random line as initial k
			//kList[i] = data[Math.floor(Math.random() * data.length) + 0];
			kList[i] = [ data[Math.floor(Math.random() * data.length) + 0].A,
							data[Math.floor(Math.random() * data.length) + 0].B,
							data[Math.floor(Math.random() * data.length) + 0].C ]
			
			
			//initiate k nr lists
			trackList[i] = [];
		}
		
		// Test
		//console.log("First kList = " + kList);
		//___________________________________________________________
		
		// 2: Iterative process: calculate new average K or centroids
		//====================================================
		
		//Store quality measure from last iteration
		var lastQualityMeasure = null;
		
		//TEST : DO 15 TIMES MAX, this is aborted if quality is sufficient
		for (var l = 0; l < 15; l++) {
			
			// Empty trackList before filling it witch new lines for every k
			for(var i = 0; i < k; i++) {
				while( trackList[i].length > 0 ) {
					trackList[i].pop();
				}
			}
			
			//do for each line
			data.forEach(function(d, i){
				
				var distance = {};
				var smallestDistIndex = 0;
				
				for(var j = 0; j < k; j++){		
				//calculate distance to every centroid.				
					distance[j] =  Math.sqrt( Math.pow(( kList[j][0] - d.A ) , 2) +
														Math.pow(( kList[j][1] - d.B ) , 2) +
														Math.pow(( kList[j][2] - d.C ) , 2) );
														
					// If distance to this centroid is shorter than to the last , remember new index
					if(distance[j] < distance[smallestDistIndex])
						smallestDistIndex = j;
				}
				
				// Put line in list nr [smallestDistIndex]
				trackList[smallestDistIndex].push(d);
				
				//store closest k index in array which is used to assign colors
				// colorIndexList[nrLines] = smallestDistIndex;
				colorIndexList[i] = smallestDistIndex;
			})
			
			// A temp var that holds avg ABC for each k
			var tempAvg = [0,0,0];
			
			for(var i=0; i<k; i++) {
			
				// Sum all A,B,C from the trackinglist
				for(var j = 0; j < trackList[i].length; j++) {
				
					//use parsefloat to prevent tracklist from being read as strings
					tempAvg[0] += parseFloat( trackList[i][j].A );
					tempAvg[1] += parseFloat( trackList[i][j].B );
					tempAvg[2] += parseFloat( trackList[i][j].C );
				}
				
				// divide by tracklist length to get avg
				tempAvg[0]  /= parseFloat( trackList[i].length );
				tempAvg[1]  /= parseFloat( trackList[i].length );
				tempAvg[2]  /= parseFloat( trackList[i].length );

				// now replace the old kList value with the new average
				kList[i] = tempAvg;
				
				//reset the temp variable
				tempAvg = [0,0,0];
			}
			
			//use for quality measure
			var quality = 0;
			
			// Calculate the quality to determine if main loop should stop
			for(var n = 0; n < k; n++) {
				for(var m = 0; m < trackList[n].length; m++) {
					
					var qualityDiff = ( 	Math.pow( parseFloat( trackList[n][m].A ) - kList[n][0] , 2) +
												Math.pow( parseFloat( trackList[n][m].B ) - kList[n][1] , 2) +
												Math.pow( parseFloat( trackList[n][m].C ) - kList[n][2] , 2)
									);
					
					quality += qualityDiff;
				}
			}
			
			console.log("Iteration " + l);
			
			//test quality
			if ( lastQualityMeasure != null) {
				console.log("Quality: " + quality );
				console.log( "Old / New: " +  lastQualityMeasure / quality);
				
				//if quality compared to last iteration is below a threshold, stop looping
				if(lastQualityMeasure / quality < 1.01) {
					console.log("quality diff less than 1.01, stop looping");
					break;
				}
			}
			
			//set new quality measure as lastQualityMeasure for next iteration
			lastQualityMeasure = quality;
		}
		//___________________________________________________________
		
		return colorIndexList;
    };