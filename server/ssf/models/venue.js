

var venueSchema = new SimpleSchema([BaseSchema, {
   id: {
      type: String,
      optional: false
   },
   name: {
      type: String,
      optional: true
   },
   cinema: {
      type: String,
      optional: true
   },
   address: {
      type: String,
      optional: true
   },
   type_sv: {
      type: String,
      optional: true
   },
   type_en: {
      type: String,
      optional: true
   },
   lat: {
      type: String,
      optional: true
   },
   lon: {
      type: String,
      optional: true
   },
   descriptionURL: {
      type: String,
      optional: true
   }
}]);

Venues = new Meteor.Collection('venues', {schema: venueSchema});