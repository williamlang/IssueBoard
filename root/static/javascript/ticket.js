/*
	Ticket Class

	Represents a JIRA ticket	
*/

function ticket(id, section, title, assignee, priority, type) {
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

	this.toObj = function() {
		// Object hasn't been created yet
		if (!this.obj) {
			var ticket_block   = $('<div id="' + this.id + '" class="ticket_block"></div>');
			var ticket_header  = $('<div class="ticket_header"></div>');
			var ticket_heading = $('<h3 class="' + this.assignees.data[0] + ' h3_top">' + this.id + '</h3>');
			var ticket_toggle  = $('<span style="float:right;margin-top:-30px;"><input type="button" value="-" id="' + this.id + '_toggle" onclick="Javacript:ticket_toggle(\'' + this.id + '\');" /></span>');

			ticket_header.append(ticket_heading);
			ticket_header.append(ticket_toggle);
			ticket_block.append(ticket_header);
			ticket_block.append('<p id="' + this.id + '_title" class="ticket_title">' + this.title + '</p>');
			ticket_block.append('<div id="' + this.id + '_assignees" style="display:none;" class="' + this.assignees.data.join(' ') + '">' + this.assignees.data.join(',') + '</div>');
			ticket_block.append('<p><span id="' + this.id + '_priority">' + this.priority + '</span> <span id="' + this.id + '_type">' + this.type + '</span></p>');
			ticket_block.append('<h3 id="' + this.id + '_assignee" class="' + this.assignees.data[0] + ' h3_bottom">' + this.assignees.data[0] + '</h3>');

			ticket_block.draggable();
			this.obj = ticket_block;
		}

		return this.obj;
	}
}

function ticket_toggle(ticket_id) {
    $('#' + ticket_id + ' p').toggle();

    if ($('#' + ticket_id + ' p').is(':visible')) {
        $('#' + ticket_id + '_toggle').val('-');
    }
    else {
        $('#' + ticket_id + '_toggle').val('+');
    }
}
