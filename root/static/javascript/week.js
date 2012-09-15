function Week(week_start) {

    // Days
    this.monday = '';
    this.tuesday = ''; // considered first day of week
    this.wednesday = '';
    this.thursday = '';
    this.friday = ''; // weekend
    this.saturday = ''; // weekend
    this.sunday = ''; // weekend

}

Week.prototype.scheduleDev = function(user) {
    if (this.monday.length == 0 && user.badDays.indexOf('monday') == -1) {
	this.monday = user.name;
	return true;
    }

    if (this.tuesday.length == 0 && user.badDays.indexOf('tuesday') == -1) {
	this.tuesday = user.name;
	return true;
    }

    if (this.wednesday.length == 0 && user.badDays.indexOf('wednesday') == -1) {
	this.wednesday = user.name;
	return true;
    }

    if (this.thursday.length == 0 && user.badDays.indexOf('thursday') == -1) {
	this.thursday = user.name;
	return true;
    }

    return false;
}

Week.prototype.assignWeekend = function(user) {
    this.friday = user.name;
    this.saturday = user.name;
    this.sunday = user.name;
}

Week.prototype.toObj = function() {
    var table = $('<table id="week-table"></table>');

    var row = $('<tr></tr>');
    row.append('<th>Tuesday</th>');
    row.append('<th>Wednesday</th>');
    row.append('<th>Thursday</th>');
    row.append('<th>Friday</th>');
    row.append('<th>Saturday</th>');
    row.append('<th>Sunday</th>');
    row.append('<th>Monday</th>');
    table.append(row);

    row = $('<tr></tr>');
    row.append('<td style="background:' + stringToColor(this.tuesday) + '">' + this.tuesday + '</td>');
    row.append('<td style="background:' + stringToColor(this.wednesday) + '">' + this.wednesday + '</td>');
    row.append('<td style="background:' + stringToColor(this.thursday) + '">' + this.thursday + '</td>');
    row.append('<td style="background:' + stringToColor(this.friday) + '">' + this.friday + '</td>');
    row.append('<td style="background:' + stringToColor(this.saturday) + '">' + this.saturday + '</td>');
    row.append('<td style="background:' + stringToColor(this.sunday) + '">' + this.sunday + '</td>');
    row.append('<td style="background:' + stringToColor(this.monday) + '">' + this.monday + '</td>');
    table.append(row);

    return table;
}
