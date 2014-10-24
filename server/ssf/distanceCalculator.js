DistanceCalculator = {};

var  calculateDistance = function(origin, destinations, callback){

    var google = Meteor.require('googlemaps'),   //     util = Npm.require('util'),
        destinationsString = destinations.join('|');


    console.log("lookUpDistance: ", origin);
    google.distance(origin, destinationsString, onDistance, false, "walking");

    // On response from Google maps. Parse the data into
    function onDistance(err, data) {
        var row, element, i, rowPosId, calculatedDistanceMap = {};

        console.log("onDistance");

        if(err){
            console.log("Error when requesting distances: %o", err);
            return;
        }else if(!_.isEmpty(data.error_message)) {
            console.log("Google maps api failed with status: %s and error: %s", data.status, data.error_message);
            callback(calulatedDistanceMap);
            return;
        }else{
            console.dir(data);

            row = data.rows[0];
            if(row && row.elements && row.elements.length != 0)
            {
                for(i = 0; i < row.elements.length; i++){

                    element = row.elements[i];
                    if(element.status == "ZERO_RESULTS") continue;


                    rowPosId = destinations[i];
                    calculatedDistanceMap[rowPosId] = {};
                    calculatedDistanceMap[rowPosId].id = rowPosId;
                    calculatedDistanceMap[rowPosId].distance = element.distance.value;
                    calculatedDistanceMap[rowPosId].duration = element.duration.value;
                    calculatedDistanceMap[rowPosId].lat = destinations[i].split(',')[0];
                    calculatedDistanceMap[rowPosId].lon = destinations[i].split(',')[1];
                }
            }
        }

        console.dir(calculatedDistanceMap);
        callback(calculatedDistanceMap);
    }

};

DistanceCalculator.calculateDistance = calculateDistance;

/*
Meteor.methods({
    calculateDistances: calculateDistance
});*/
