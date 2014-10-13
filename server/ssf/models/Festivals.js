
var festivalSchema = new SimpleSchema([BaseSchema, {
    id: {
        type: String,
        optional: false
    },
    name: {
        type: String,
        optional: true
    },
    start: {
        type: String,
        optional: true
    },
    end: {
        type: String,
        optional: true
    },
    isCurrent: {
        type: Boolean,
        optional: true
    }

}]);

Festivals = new Meteor.Collection('festivals', {schema: festivalSchema});
