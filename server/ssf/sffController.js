SFF = {};

Fiber = Npm.require('fibers');

var config = {
    apiKey: process.env.SSF_API_KEY,
    rootURI: "http://api.stockholmfilmfestival.se/v1/",
    festivalId: "25"
};


var ssfApiRequest = function (type, id, callback) {

    var url = config.rootURI;

    if (type == "allEvents") {
        url += "events/festival_list/festival_id/" + config.festivalId;
    }
    else if (type == "eventById") {
        url += "events/event/event_id/" + id;
    }
    else if (type == "eventsSince") {
        url += "events/festival_list/festival_id/" + config.festivalId + '/since/' + id;
    }
    else if (type == "filmById") {
        url += "films/film/film_id/" + id;
    }
    else if (type == "filmByfestival") {
        url += "films/festival_list/festival_id/" + config.festivalId;
    }
    else if (type == "filmsSince") {
        url += "films/festival_list/festival_id/" + config.festivalId + '/since/' + id;;
    }
    else if (type == "sectionByfestival") {
        url += "sections/list/festival_id/" + config.festivalId;
    }
    else if (type == "venues") {
        url += "venues/list";
    }

    url += "/format/json/API-Key/" + config.apiKey;

    console.log(url);


    (function(type){
        Meteor.http.get(url, function (error, result) {
            if (error) {
                console.log("An Error occurred when trying to fetch data with %s: %O", type, error);
            } else {
                console.log("Completed Fetching %s", type);
                callback(result.content);
            }

        });
    })(type);

};

var parseEventList = function (list) {
    var filmList = JSON.parse(list);
    var events = [];
    var films = [];

    _.each(filmList, function (item) {
        var event = {
            id: item.eventId,
            number: item.eventNumber,
            name_sv: item.eventName_sv,
            name_en: item.eventName_en,
            timestamp: item.eventTimestamp,
            ticketStatus: item.eventTicketStatus,
            modifiedTimestamp: item.eventModifiedTimestamp,
            filmId: item.filmId,
            venueId: item.venueId,
            hasFaceToFace: item.hasFaceToFace? item.hasFaceToFace : false
        };
        events.push(event);
        upsertObj(event, Events);

        if(!_.contains(films, event.filmId)){
            films.push(event.filmId);
            fetchFilmById(event.filmId);
        }
    });

};



var parseFilm = function (itemString) {
    var item = JSON.parse(itemString)

    var film = {
        id: item.filmId,
        events: [],
        name: item.filmName,
        name_en: item.filmName_en,
        cast: item.filmCast,
        cinematography: item.filmCinematography,
        country_sv: item.filmCountry_sv,
        country_en: item.filmCountry_en,
        description_en: item.filmDescription_en,
        description_sv: item.filmDescription_sv,
        director: item.filmDirector,
        imdbId: item.filmIMDBId,
        infoURL: item.filmInfoURL,
        internationalRights: item.filmInternationalRights,
        iphoneTrailer: item.filmIphoneTrailer,
        language: item.filmLanguage,
        length: item.filmLength,
        mobileDownloadTrailer: item.filmMobileDownloadTrailer,
        mobileTrailer: item.filmMobileTrailer,
        modifiedTimestamp: item.filmModifiedTimestamp,
        music: item.filmMusic,
        officialHomesite: item.filmOfficialHomesite,
        originalLanguageName: item.filmOriginalLanguageName,
        posterImage: item.filmPosterImage,
        previewImage: item.filmPreviewImage,
        producer: item.filmProducer,
        productionCompany: item.filmProductionCompany,
        productionYear: item.filmProductionYear,
        script: item.filmScript,
        status_en: item.filmStatus_en,
        status_sv: item.filmStatus_sv,
        subtitle_en: item.filmSubtitle_en,
        subtitle_sv: item.filmSubtitle_sv,
        swedishDistribution: item.filmSwedishDistribution,
        youtubeId: item.filmYoutubeId,
        sectionId: item.sectionId,
        sectionName: item.sectionName
    };

    item.events.forEach(function(event){
        film.events.push(event.eventId);
    });


    upsertObj(film, Films);
};

var parseVenueList = function (list) {
    var venueList = JSON.parse(list),
        venues = [],
        positionsArray = [],
        positionIds = [];

    _.each(venueList, function (item) {
        var venue = {
            id: item.venueId,
            name: item.venueName,
            cinema: item.venueCinema,
            type_sv: item.venueType_sv,
            type_en: item.venueType_en,
            lat: item.venueLat,
            lon: item.venueLon,
            descriptionUrl: item.venueDescURL
        };
        venues.push(venue);

        var position = {
            id: item.venueLat + "," + item.venueLon,
            lat: parseFloat(item.venueLat),
            lon: parseFloat(item.venueLon)
        };

        if(!_.contains(positionIds, position.id) && (position.id != "0,0")){
            positionIds.push(position.id);
            positionsArray.push(position);
        }

        upsertObj(venue, Venues);
        upsertObj(position, Positions);
    });

    calculateDistances(positionsArray);
};


var calculateDistances = function(positionsArray){

  //  console.log(positionsArray);

    var missingIds, positionIds = _.pluck(positionsArray, 'id');
    var currentIndex = 0;

    function fetchNext(){
        if(currentIndex < positionsArray.length){
            fetchDistance(positionsArray[currentIndex]);
        }
    }

    function fetchDistance(position){

        console.log('fetchDistance');

        var existingIds, existingPosition = Positions.findOne({id: position.id });

        if(_.isEmpty(existingPosition)){
            existingPosition = _.clone(position, true);
            existingPosition.distances = [];
        }

        if(!_.isEmpty(existingPosition.distances)){

            console.log('existingPosition.distances');
            console.log(existingPosition.distances);

            existingIds = _.pluck(existingPosition.distances, 'id');

            // If all of the ids in the positionsArray are present in the existing positions array, continue.
            missingIds = _.filter(positionIds, function(id){ return !_.contains(existingIds, id) });
            if(missingIds.length == 0){
                currentIndex++;
                fetchNext();
                return
            }

        }else{
            missingIds = _.clone(positionIds);
        }

        console.log(missingIds);


        DistanceCalculator.calculateDistance(existingPosition.id, missingIds, function(calculatedDistances){

            if(!_.isEmpty(calculatedDistances)){

                var distancesAsArray = _.map(calculatedDistances, function(dist){ return (dist)? dist : false});
                existingPosition.distances = _.union( existingPosition.distances, distancesAsArray)

                _.each(calculatedDistances, function(distance){
                    existingPosition.distances.push(distance);
                });
            }
            existingPosition.modifiedAt = new Date();
            upsertObj(existingPosition, Positions);
        });

        currentIndex++;
        Meteor.setTimeout(fetchNext, 5000);
    }

    fetchNext();

};


var parseSectionList = function (list) {
    var sectionList = JSON.parse(list),
        sections = [];

    _.each(sectionList, function (item) {
        var section = {
            id: item.sectionId,
            name: item.sectionName,
            description_sv: item.festivalSectionDescription_sv,
            description_en: item.festivalSectionDescription_en
        };
        sections.push(section);
        upsertObj(section, Sections);
    });

    console.log(sections.length);
    console.dir(sections[0]);
};


var listEvents = function () {
    console.log("listEvents");
    ssfApiRequest('allEvents', null, parseEventList)
};

var listFilms = function(id){
    fetchFilmById(id);
};

var fetchFilmById = function (filmId) {
    ssfApiRequest('filmById', filmId, parseFilm);
};

var listVenues = function () {
    ssfApiRequest('venues', null, parseVenueList);
};

var listSections = function () {
    ssfApiRequest('sectionByfestival', null, parseSectionList);
};

var listChangedEventsSince = function(since){
    ssfApiRequest('eventsSince', since, function(changeSet){
        console.dir(changeSet);
    });
};

var listChangedFilmsSince = function(since){
    ssfApiRequest('filmsSince', since, function(changeSet){
        console.dir(changeSet);
    });
};


var upsertObj = function(obj, collection){

    Fiber(function(){
        var tmpObj = collection.findOne({id: obj.id});
        if(!tmpObj){
            collection.insert(obj);
        }else{
            //    console.dir(tmpObj);

            var changedSet = {};
            Object.keys(obj).forEach(function(key){
                if(key != "modifiedAt" || key != "createdAt"){
                    if(obj[key] != tmpObj[key]) {
                        changedSet[key] = obj[key];
                    }
                }
            });

            if(!_.isEmpty(changedSet)){
                console.log("The object has changed and is being updated: %O", changedSet);
                collection.update(tmpObj, {$set: changedSet});
            }
        }
    }).run();

};







SFF.listEvents = listEvents;
SFF.listFilms = listFilms;
SFF.listVenues = listVenues;
SFF.listSections = listSections;
SFF.apiRequest = ssfApiRequest;
SFF.listChangedEventsSince = listChangedEventsSince;
SFF.listChangedFilmsSince = listChangedFilmsSince;



Meteor.methods({
    listEvents: listEvents,
    listFilms: listFilms,
    listVenues: listVenues,
    listSections: listSections,
    listChangedEventsSince: listChangedEventsSince,
    listChangedFilmsSince: listChangedFilmsSince
});


