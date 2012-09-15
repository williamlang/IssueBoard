var developers = new observableArray();
var weeks = new observableArray();

developers.onNewItem = function(key) {
    var user_row = $('<tr><td>' + developers.data[key].name + '</td><td>' + developers.data[key].badDays.join(', ') + '</td><td style="background:' + stringToColor(developers.data[key].name) + '">&nbsp;</td></tr>');

    $('#scheduler-users').append(user_row);  
}

$(document).ready(function() {
    $('#add-dev').click(function() {
	$('#add-dev-container').show();
    });

    $('#add-dev-submit').click(function() {
	var name =  $('#add-dev-name').val();
	var bad_days = [];
	var checkboxes = $('input[name=add-dev-bad-days]:checked');

	for (var i = 0; i < checkboxes.length; i++) {
	    bad_days.push(checkboxes[i].value);
	}

	developers.push(new User(name, bad_days));
	$('#add-dev-container').hide();
    });

    $('#generate-schedule').click(function() {
	var numberOfWeeks = developers.size();

	for (var i = 0; i < numberOfWeeks; i++) {
	    var developersToSchedule = $.extend(true, {}, developers); //clone

	    var week = new Week();
	    week.assignWeekend(developersToSchedule.data[i]);
	    delete developersToSchedule.data[i];

	    while (developersToSchedule.size() > 0) {
		var max = -1;
		var maxIndex = -1;

		developersToSchedule.each(function(key){ 
		    if (developersToSchedule.data[key].badDays.size() > max) {
			max = developersToSchedule.data[key].badDays.size();
			maxIndex = key;
		    }
		});

		var toSchedule = developersToSchedule.data[maxIndex];
		week.scheduleDev(toSchedule);
		delete developersToSchedule.data[maxIndex];
	    }

	    $('body').append(week.toObj()); 
	}
    });

    $('#schedule-start').datepicker({});
});


