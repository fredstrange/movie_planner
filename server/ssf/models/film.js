var filmSchema = new SimpleSchema([BaseSchema, {
    id: {
        type: String,
        optional: false
    },
    events: {
        type: [String],
        optional: true
    },
    name: {
        type: String,
        optional: true
    },
    name_en: {
        type: String,
        optional: true
    },
    imdbId: {
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
    },
    length: {
        type: String,
        optional: true
    },
    previewImage: {
        type: String,
        optional: true
    },
    posterImage: {
        type: String,
        optional: true
    },
    officialHomesite: {
        type: String,
        optional: true
    },
    youtubeId: {
        type: String,
        optional: true
    },
    originalLanguageName: {
        type: String,
        optional: true
    },
    director: {
        type: String,
        optional: true
    },
    producer: {
        type: String,
        optional: true
    },
    productionYear: {
        type: String,
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
    cinematography: {
        type: String,
        optional: true
    },
    script: {
        type: String,
        optional: true
    },
    music: {
        type: String,
        optional: true
    },
    cast: {
        type: String,
        optional: true
    },
    country_sv: {
        type: String,
        optional: true
    },
    country_en: {
        type: String,
        optional: true
    },
    language: {
        type: String,
        optional: true
    },
    subtitle_sv: {
        type: String,
        optional: true
    },
    Subtitle_en: {
        type: String,
        optional: true
    },
    productionCompany: {
        type: String,
        optional: true
    },
    internationalRights: {
        type: String,
        optional: true
    },
    swedishDistribution: {
        type: String,
        optional: true
    },
    mobileTrailer: {
        type: String,
        optional: true
    },
    mobileDownloadTrailer: {
        type: String,
        optional: true
    },
    iphoneTrailer: {
        type: String,
        optional: true
    },
    infoURL: {
        type: String,
        optional: true
    },
    sectionId: {
        type: String,
        optional: true
    },
    sectionName: {
        type: String,
        optional: true
    }


}]);

Films = new Meteor.Collection('films', {schema: filmSchema});
