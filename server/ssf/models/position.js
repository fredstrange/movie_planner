
var distanceSchema = new SimpleSchema({
    id: {
        type: String,
        optional: false
    },
    lat: {
        type: Number,
        decimal: true,
        optional: false
    },
    lon: {
        type: Number,
        decimal: true,
        optional: false
    },
    distance: {
        type: Number,
        decimal: true,
        optional: true
    },
    duration: {
        type: Number,
        decimal: true,
        optional: true
    }
});

var positionSchema = new SimpleSchema([BaseSchema, {
    id: {
        type: String,
        optional: false
    },
    lat: {
        type: Number,
        decimal: true,
        optional: false
    },
    lon: {
        type: Number,
        decimal: true,
        optional: false
    },
    distances: {
        type: [distanceSchema],
        optional: true
    }
}]);

Positions = new Meteor.Collection('positions', {schema: positionSchema});