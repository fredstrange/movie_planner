Template.dateHandle.helpers({

    dates: function(){
        var festival = Festivals.findOne();

        var dates = [],
            time = moment(festival.start),
            end = moment(festival.end),
            diff = end.diff(time, 'days');

        for(var i=0; i<diff; i++){
            dates.push({
                date: time.format('YYYY-MM-DD'),
                dateText: time.format('MMM D'),
                timestamp: time.valueOf()
            });

            time.add(1, 'days');

        }
        //	console.log(dates);

        AmplifiedSession.set('maxDate', lodash.max(dates, 'timestamp').timestamp);
        AmplifiedSession.set('minDate', lodash.min(dates, 'timestamp').timestamp);

        return dates;
    },

    date: function(){
        return  moment(AmplifiedSession.get('selectedDate')).format('MMM D');
    },

    next: function(){
        var max = moment(AmplifiedSession.get('maxDate'));
        var date = moment(AmplifiedSession.get('selectedDate'));

        if(date.isBefore(max)){
            date =  date.add(1, 'days');
            return {
                label: date.format('MMM D'),
                date: date.format('YYYY-MM-DD')
            }
        }
    },

    prev: function(){
        var min = moment(AmplifiedSession.get('minDate'));
        var date = moment(AmplifiedSession.get('selectedDate'));

        if(date.isAfter(min)){
            date =  date.subtract(1, 'days');
            return {
                label: date.format('MMM D'),
                date: date.format('YYYY-MM-DD')
            }
        }
    }
});

