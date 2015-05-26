var FetchCalendars = function (date,callback) {
    $.post('/calendars',{}, function (data) {
        callback(data)
    });
};




