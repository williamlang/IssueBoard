/*
	Ticket Class

	Represents a JIRA ticket	
*/

function ticket(id, section, title, assignee, priority, type, release) {
	// The ticket id ex: PY-1234
	this.id = id;
	// The ticket status / section
	this.section = section;
	// The ticket title, used in the ticket body
	this.title = title;
	// Represents the HTML object of the ticket
	this.obj;
	// Represents who the ticked is assigned to
	this.assignees = new observableArray();
	if (assignee.indexOf(',') != -1) {
		var assigneeArray = assignee.split(',');

		for (i = 0; i < assigneeArray.length; i++) {
			if (this.assignees.indexOf(assigneeArray[i]) == -1) // ensure we never get doubles
				this.assignees.push(assigneeArray[i]);
		}
	}
	else {
		this.assignees.push(assignee);
	}

	// Represents the priority
	this.priority = priority;
	// Represents the type
	this.type = type;
	// Represents the release target
	this.release = (release == "null") ? null : release;
}

ticket.prototype.toObj = function() {
	// Object hasn't been created yet
	if (!this.obj) {
		var ticket_block   = $('<div id="' + this.id + '" class="ticket_block ' + releaseClass(this.release) + '"></div>');
		var ticket_header  = $('<div class="ticket_header"></div>');
		var ticket_heading = $('<h3 class="' + this.assignees.data[0] + ' h3_top">' + this.id + '</h3>');
		var ticket_toggle  = $('<span style="float:right;margin-top:-30px;"><input type="button" value="-" id="' + this.id + '_toggle" onclick="Javacript:ticket_toggle(\'' + this.id + '\');" /></span>');

		ticket_header.append(ticket_heading);
		ticket_header.append(ticket_toggle);
		ticket_block.append(ticket_header);
		ticket_block.append('<p id="' + this.id + '_title" class="ticket_title">' + this.title + '</p>'); // title
		ticket_block.append('<div id="' + this.id + '_assignees" style="display:none;" class="' + this.assignees.join(' ') + '">' + this.assignees.join(',') + '</div>'); // assignees
		ticket_block.append('<p><span id="' + this.id + '_priority">' + this.priority + '</span> <span id="' + this.id + '_type">' + this.type + '</span></p>'); // type
		var release = (this.release) ? this.release : "Not schedule for release";
		ticket_block.append('<p><span id="' + this.id + '_release" class="' + releaseClass(this.release) + '" onclick="Javascript:release_edit(\'' + this.id + '\');">' + release + '</span></p>'); // release		
		ticket_block.append('<h3 id="' + this.id + '_assignee" class="' + this.assignees.data[0] + ' h3_bottom" onclick="Javascript:assignee_edit(\'' + this.id + '\');">' + this.assignees.data[0] + '</h3>');

		ticket_block.draggable();
		this.obj = ticket_block;
	}

	return this.obj;
}

ticket.prototype.assignee_edit_obj = function(assignee_array) {
	var div = $('<div id="' + this.id + '_assignee_edit" class="' + this.assignees.data[0] + ' h3_bottom assignee_edit"></div>');
	var select = $('<select id="' + this.id + '_assignee_edit_select" style="width:99%;"></select>');

	for (var assignee in assignee_array.data) {
		var selected = (assignee == this.assignees.data[0]) ? 'selected="selected"' : '';
		select.append('<option ' + selected + '>' + assignee + '</option>');
	}

	//assignee_array.each.apply(this, [ function(assignee){
	//	var selected = (assignee == this.assignees.data[0]) ? 'selected="selected"' : '';	
	//	select.append('<option ' + selected + '>' + assignee + '</option>');
	//}, true ]);

	div.append(select);
	return div;
}

ticket.prototype.release_edit_obj = function() {
	var div = $('<div id="' + this.id + '_release_edit" class="release_edit"></div>');
	var select = $('#release_version').clone();
	select.attr('id', this.id + '_release_edit_select');
	select.attr('style', 'width:90%;');
	div.append(select);
	return div;
}

ticket.prototype.update = function() {
	$.ajax({
		type: 'POST',
		url: 'update_issue',
		data: {
			id: this.id, 
			section: this.section, 
			title: this.title, 
			assignee: this.assignees.join(','),
			priority: this.priority,
			type: this.type,
			release: this.release
		},
		context: this, // ticket object
		success: function(data) {
			if (data.json_data.errors) {
				alert(data.json_data.errors);
			}
			else {
				// success
				$('#' + this.id + '_assignees').attr('class', this.assignees.join(' '));
				$('#' + this.id + '_assignees').html(this.assignees.join(','));
			}
		}
	});
}

