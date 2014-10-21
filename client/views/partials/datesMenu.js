Template.datesMenu.helpers({
    dates: function(){
        var festival = Festivals.findOne();

        if(festival == void 0) return false;

        var dates = [],
            time = moment(festival.start),
            end = moment(festival.end),
            diff = end.diff(time, 'days');

        for(var i=0; i<diff; i++){
            dates.push({
                date: time.format('YYYY-MM-DD'),
                dateText: time.format('MMM D'),
                timestamp: time.valueOf(),
                model: this
            });

            time.add(1, 'days');

        }
        //	console.log(dates);

        AmplifiedSession.set('maxDate', lodash.max(dates, 'timestamp').timestamp);
        AmplifiedSession.set('minDate', lodash.min(dates, 'timestamp').timestamp);

        return dates;
    }
});

Template.datesMenu.rendered = function(){
    $('#simple-menu, .menuTrigger').sidr({
        name: 'sidr'
    });
};