DistanceCalculator = {};

var  calculateDistance = function(positionsArray, callback){

    var google = Meteor.require('googlemaps'),
        util = Npm.require('util'),

        calulatedDistanceMap = {},
        origins = "",
        currentPosition,
        currentIndex = 0,
        i;

    for(i = 0; i < positionsArray.length; i++){
        if(i > 0) origins += '|';
        origins += positionsArray[i].lat + ',' +  positionsArray[i].lon;
    }

    // Start the distance calculation
    currentPosition = positionsArray[currentIndex];
    lookUpDistance(currentPosition.lat, currentPosition.lon);


    function lookUpDistance(lat, lon){
        var origin = lat + ',' + lon;
        console.log("lookUpDistance: ", origin);
        google.distance(origin, origins, onDistance, false, "walking");
    }

    // On response from Google maps. Parse the data into
    function onDistance(err, data) {
        var row, element, i, rowPosId;

        console.log("onDistance");

        if(err){
            console.log("Error when requesting distances: %o", err);
            return;
        }else if(!_.isEmpty(data.error_message)) {
            console.log("Google maps api failed with status: %s and error: %s", data.status, data.error_message);
            return;
        }else{
            console.dir(data);

            row = data.rows[0];
            if(row && row.elements && row.elements.length != 0)
            {
                var currentPosId = currentPosition.lat +","+ currentPosition.lon;

                calulatedDistanceMap[currentPosId] = {};

                for(i = 0; i < row.elements.length; i++){

                    element = row.elements[i];
                    if(element.status == "ZERO_RESULTS") continue;


                    rowPosId = positionsArray[i].lat + "," + positionsArray[i].lon ;
                    calulatedDistanceMap[currentPosId][rowPosId] = {};
                    calulatedDistanceMap[currentPosId][rowPosId].id = rowPosId;
                    calulatedDistanceMap[currentPosId][rowPosId].distance = element.distance.value;
                    calulatedDistanceMap[currentPosId][rowPosId].duration = element.duration.value;
                    calulatedDistanceMap[currentPosId][rowPosId].lat = positionsArray[i].lat;
                    calulatedDistanceMap[currentPosId][rowPosId].lon = positionsArray[i].lon;
                }
            }
        }

        currentIndex++;

        if(currentIndex < 2){
       // if(currentIndex < positionsArray.length){
            setTimeout(function() {
                currentPosition = positionsArray[currentIndex];
                lookUpDistance(currentPosition.lat, currentPosition.lon);
            }, 5000);
        }else{
            console.dir(calulatedDistanceMap);
            callback(calulatedDistanceMap);
        }

    }

};

DistanceCalculator.calculateDistance = calculateDistance;

Meteor.methods({
    calculateDistances: calculateDistance
});



