/*
	Ticket Class

	Represents a JIRA ticket	
*/

function ticket(id, title) {
	// The ticket id ex: PY-1234
	this.id = id;
	// The ticket title, used in the ticket body
	this.title = title;
	// Represents the HTML object of the ticket
	this.obj;

	this.toObj = function() {
		// Object hasn't been created yet
		if (!this.obj) {
			var ticket_block = $('<div id="' + this.id + '">');
			ticket_block.attr('id', this.id);
			ticket_block.addClass('ticket_block');
			ticket_block.append('<div class="ticket_header"><h3>' + this.id + '</h3><span style="float:right;margin-top:-30px;"><input type="button" value="-" id="' + this.id + '_toggle" onclick="Javacript:ticket_toggle(\'' + this.id + '\');" /></span></div>');

			ticket_block.append('<p>' + title + '</p>');
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
