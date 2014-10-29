SFF = {};

SFF.ChangeEntry = new Meteor.Collection('sffchangeentry');
SFF.ChangeLog = new Meteor.Collection('sffchangelog');

Fiber = Npm.require('fibers');

var config = {
    apiKey: process.env.SSF_API_KEY,
    rootURI: "http://api.stockholmfilmfestival.se/v1/",
    festivalId: "26"
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
    else if (type == "festivals") {
        url += "festivals/list";
    }

    url += "/format/json/API-Key/" + config.apiKey;

    console.log(url);


    (function(type){
        Meteor.http.get(url, function (error, result) {
            if (error) {
                try{
                    var isNoEvents = JSON.parse(error.response.content).error == "No events could be found";
                    var isNoFilms = JSON.parse(error.response.content).error == "No films could be found";

                    if(isNoEvents || isNoFilms) return;
                }catch(e){}

                console.log("An Error occurred when trying to fetch data with %s: %O", type, error);
            } else {
                console.log("Completed Fetching %s", type);
                callback(result.content);
            }

        });
    })(type);

};

var parseEventList = function (list, update) {
    var eventList = JSON.parse(list);
    var events = [];
    var films = [];

    _.each(eventList, function (item) {
        var event = {
            id: item.eventId,
            number: item.eventNumber,
            name_sv: item.eventName_sv,
            name_en: item.eventName_en,
            timestamp: item.eventTimestamp,
            date: item.eventDate,
            ticketStatus: item.eventTicketStatus,
            modifiedTimestamp: item.eventModifiedTimestamp,
            filmId: item.filmId,
            venueId: item.venueId,
            hasFaceToFace: item.hasFaceToFace? item.hasFaceToFace : false
        };
        events.push(event);
        upsertObj(event, Events);

        if(!update && !_.contains(films, event.filmId)){
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

    if(!_.isEmpty(item.events)){
        item.events.forEach(function(event){
            film.events.push(event.eventId);
        });
    }




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
            latlon: item.venueLat + "," + item.venueLon,
            descriptionUrl: item.venueDescURL
        };
        venues.push(venue);

        var position = {
            id: venue.latlon,
            lat: parseFloat(item.venueLat),
            lon: parseFloat(item.venueLon)
        };

        if(position.id == '0,0') fixVenuePosition(position, venue);

        if(!_.contains(positionIds, position.id) && (position.id != "0,0")){
            positionIds.push(position.id);
            positionsArray.push(position);

            upsertObj(position, Positions);
        }

        upsertObj(venue, Venues);

    });

  //  calculateDistances(positionsArray);
};

var fixVenuePosition = function(position, venue){
    // 62 tekniska museet 59.3325049,18.1189656
    //30 Dansens hus Latitude : 59.335767 | Longitude : 18.05511
    //35 Kungträdgården Latitude : 59.331365 | Longitude : 18.072476
    //60 Cosmonova Latitude : 59.329323 | Longitude : 18.068581
    //65 Reflexen Latitude : 59.283942 | Longitude : 18.114274
    //58 Historiska museet Latitude : 59.334679 | Longitude : 18.089932
    //63 Historiska Museet Latitude : 59.334679 | Longitude : 18.089932
    //15 Spy bar  Latitude : 59.342075 | Longitude : 18.064819
    //18 Spy bar Latitude : 59.342075 | Longitude : 18.064819
    //41 Ropsten Latitude : 59.901952 | Longitude : 18.569807
    //34 Enskilda galleriet Latitude : 59.335199 | Longitude : 18.034892
    //16 Nordic Light Biografen Latitude : 59.332593 | Longitude : 18.057065
    //59 Stockholms stadsmuseum Latitude : 59.319698 | Longitude : 18.070858
    //64 Stockholms stadsmuseum Latitude : 59.319698 | Longitude : 18.070858

   // var changes, brokenVenues = ['62', '30', '35', '60', '65', '58', '63', '15', '18', '41', '34', '16', '59', '64'];

    var changes = [
        {
            id: '62',
            lat: '59.3325049',
            lon: '18.1189656'
        },
        {
            id: '30',
            lat: '59.335767',
            lon: '18.05511'
        },
        {
            id: '35',
            lat: '59.331365',
            lon: '18.072476'
        },
        {
            id: '60',
            lat: '59.329323',
            lon: '18.068581'
        },
        {
            id: '65',
            lat: '59.283942',
            lon: '18.114274'
        },
        {
            id: '58',
            lat: '59.334679',
            lon: '18.089932'
        },
        {
            id: '63',
            lat: '59.334679',
            lon: '18.089932'
        },
        {
            id: '15',
            lat: '59.342075',
            lon: '18.064819'
        },
        {
            id: '18',
            lat: '59.342075',
            lon: '18.064819'
        },
        {
            id: '41',
            lat: '59.901952',
            lon: '18.569807'
        },
        {
            id: '34',
            lat: '59.335199',
            lon: '18.034892'
        },
        {
            id: '16',
            lat: '59.332593',
            lon: '18.057065'
        },
        {
            id: '59',
            lat: '59.319698',
            lon: '18.070858'
        },
        {
            id: '64',
            lat: '59.319698',
            lon: '18.070858'
        }
    ];

    var change = _.find(changes, {id: venue.id});

    if(change){
        position.lat = change.lat;
        position.lon = change.lon;
        position.id = change.lat + ',' + change.lon;

        venue.lat = change.lat;
        venue.lon = change.lon;
        venue.latlon = change.lat + ',' + change.lon;
    }

    return;
};


var calculateDistances = function(positionsArray){

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

        if(!existingPosition){
            existingPosition = _.clone(position, true);
            existingPosition.distances = [];
        }

        if(!_.isEmpty(existingPosition.distances)){

            console.log('existingPosition.distances');
     //       console.log(existingPosition.distances);

            existingIds = [];
            _.each(existingPosition.distances, function(distance){
                if(distance && distance.hasOwnProperty('id')) {
                    if(!_.contains(existingIds, distance.id)) existingIds.push(distance.id);
                }
            });

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

    //    console.log(missingIds);


        DistanceCalculator.calculateDistance(existingPosition.id, missingIds, function(calculatedDistances){

            if(!_.isEmpty(calculatedDistances)){

                var distancesAsArray = _.map(calculatedDistances, function(dist){ return (dist)? dist : false});
                existingPosition.distances = _.union( existingPosition.distances, distancesAsArray);

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

var parseFestivals = function(list){
    var festivalList = JSON.parse(list);
    var festivals = [];

    _.each(festivalList, function (item) {
        var festival = {
            id: item.festivalId,
            name: item.festivalName,
            start: moment(parseInt(item.festivalBegin) * 1000).toJSON(),
            end: moment(parseInt(item.festivalEnd) * 1000).toJSON(),
            isCurrent: item.festivalIsCurrent
        };
        festivals.push(festival);
        upsertObj(festival, Festivals);
    });

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

var listFestivals = function () {
    ssfApiRequest('festivals', null, parseFestivals);
};

var listChangedEventsSince = function(since){
    if(!since){
        var lastChange = SFF.ChangeLog.findOne({ $query: {model:'events'}, $orderby: {timestamp: -1}});
        since = (lastChange)? lastChange.timestamp : 1413316695;
    }
    ssfApiRequest('eventsSince', since, updateEvents);
};

var listChangedFilmsSince = function(since){
    if(!since){
        var lastChange = SFF.ChangeLog.findOne({ $query: {model:'films'}, $orderby: {timestamp: -1}});
       // since = lastChange.timestamp;
        since = (lastChange)? lastChange.timestamp : 1413316695;
    }
    ssfApiRequest('filmsSince', since, updateFilms);
};

var updateFilms = function(changeSet){
    //console.dir(changeSet);

    try{
        var updatedFilms = JSON.parse(changeSet);
        var filmIds = [];
        _.each(updatedFilms, function(item){
            if(item && item.filmId) {
                filmIds.push(item.filmId);
            }
        });

        console.log(filmIds);

        _.each(filmIds, function(id){
            fetchFilmById(id);
        });

        SFF.ChangeLog.insert({model: 'films', timestamp: moment().unix()})

    }catch(e){
        console.log("listChangedFilmsSince failed");
        console.log(e);
    }
};

var updateEvents = function(changeSet){
  //  console.dir(changeSet);

    try{
        var updatedEvents = JSON.parse(changeSet);
        var eventIds = _.map(updatedEvents, function(item){return item.eventId});

        console.log(eventIds);

        parseEventList(changeSet, true);

        SFF.ChangeLog.insert({model: 'events', timestamp: moment().unix()})

    }catch(e){
        console.log("listChangedEventsSince failed");
        console.log(e);
    }
};


var upsertObj = function(obj, collection){

    Fiber(function(){
        var tmpObj = collection.findOne({id: obj.id});
        if(!tmpObj){
            console.log("InsertNew");
       //     collection.insert(obj);
        }else{
            //    console.dir(tmpObj);

            var changedSet = {};
            Object.keys(obj).forEach(function(key){
                if(key != "modifiedAt" || key != "createdAt"){
                    var hasChanged = false;

                    if(_.isArray(obj[key])){
                        if(_.difference(obj[key], tmpObj[key]).length != 0) hasChanged = true;
                    }else{
                        hasChanged = obj[key] != tmpObj[key];
                    }

                    if(hasChanged) {
                        changedSet[key] = obj[key];
                    }
                }
            });

            if(!_.isEmpty(changedSet)){
                console.log("The object has changed and is being updated: %O", changedSet);
           //     collection.update(tmpObj, {$set: changedSet});

                var changeEntry = {
                    id: obj.id,
                    createdAt: new Date(),
                    model: collection._name,
                    consumed: false,
                    changes: changedSet
                };

                SFF.ChangeEntry.insert(changeEntry);
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



/*

Meteor.methods({
    listEvents: listEvents,
    listFilms: listFilms,
    listVenues: listVenues,
    listSections: listSections,
    listFestivals: listFestivals,
    listChangedEventsSince: listChangedEventsSince,
    listChangedFilmsSince: listChangedFilmsSince
});
*/



