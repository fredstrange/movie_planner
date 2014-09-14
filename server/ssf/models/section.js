
var sectionSchema = new SimpleSchema([BaseSchema, {
   id: {
      type: String,
      optional: false
   },
   name: {
      type: String,
      optional: true
   },
   description_sv: {
      type: String,
      optional: true
   },
   description_en: {
      type: String,
      optional: true
   }

}]);

Sections = new Meteor.Collection('sections', {schema: sectionSchema});