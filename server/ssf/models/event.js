

var eventSchema = new SimpleSchema([BaseSchema, {
   id: {
      type: String,
      optional: false
   },
   number: {
      type: String,
      optional: false
   },
   timestamp: {
      type: Number,
      optional: false
   },
   hasFaceToFace: {
      type: Boolean,
      optional: true
   },
   length: {
      type: Number,
       decimal: true,
      optional: true
   },
   status_sv: {
      type: String,
      optional: true
   },
   status_en: {
      type: String,
      optional: true
   },
   ticketStatus: {
      type: String,
      optional: true
   },
    modifiedTimestamp: {
      type: String,
      optional: true
   },
   shortFilmId: {
      type: String,
      optional: true
   },
   shortFilmName_sv: {
      type: String,
      optional: true
   },
   shortFilmName_en: {
      type: String,
      optional: true
   },
   name_sv: {
      type: String,
      optional: true
   },
   name_en: {
      type: String,
      optional: true
   },
   faceGuest: {
      type: String,
      optional: true
   },
   faceModerator: {
      type: String,
      optional: true
   },
   faceDescription_sv: {
      type: String,
      optional: true
   },
   faceDescription_en: {
      type: String,
      optional: true
   },
   filmId: {
      type: String,
      optional: true
   },
   venueId: {
      type: String,
      optional: true
   }

}]);

Events = new Meteor.Collection('events', {schema: eventSchema});