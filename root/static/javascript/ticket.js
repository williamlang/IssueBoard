/*
	Ticket Class

	Represents a JIRA ticket	
*/

function ticket(id, title, assignee) {
	// The ticket id ex: PY-1234
	this.id = id;
	// The ticket title, used in the ticket body
	this.title = title;
	// Represents the HTML object of the ticket
	this.obj;
	// Represents who the ticked is assigned to
	this.assignee = assignee;

	this.toObj = function() {
		// Object hasn't been created yet
		if (!this.obj) {
			var ticket_block = $('<div id="' + this.id + '" class="ticket_block">');
			var ticket_header = $('<div class="ticket_header">');
			var ticket_heading = $('<h3 class="' + this.assignee + ' h3_top">' + this.id + '</h3>');
			var ticket_toggle = $('<span style="float:right;margin-top:-30px;"><input type="button" value="-" id="' + this.id + '_toggle" onclick="Javacript:ticket_toggle(\'' + this.id + '\');" /></span>');

			ticket_header.append(ticket_heading);
			ticket_header.append(ticket_toggle);
			ticket_block.append(ticket_header);
			ticket_block.append('<p id="' + this.id + '_title">' + title + '</p>');
			ticket_block.append('<h3 id="' + this.id + '_assignee" class="' + this.assignee + ' h3_bottom">' + this.assignee + '</h3>');

			ticket_block.draggable();
			this.obj = ticket_block;
		}

		return this.obj;
	}

	this.getId = function() {
		return this.id;
	}

	this.getTitle = function() {
		return this.title;
	}

	this.getAssignee = function() {
		return this.assignee;
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
