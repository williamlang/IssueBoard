var alphabet = "abcdefghijklmnopqrstuvwxyz";

function convertJIRAStatus(jiraStatus) {
    return jiraStatus.toLowerCase().replace(/\s/, "_");
}

var tickets = new TicketCollection();
var assignees = new AssigneeCollection();
assignees.comparator = 'name';
var priorities = new PriorityCollection();
var releases = new ReleaseCollection();
var types = new TypeCollection();

assignees.on('add', function( assignee ) {
    var view = new AssigneeView({
        model: assignee
    });

    $('#legend table').append( view.$el );
    assignee.$el = view.$el;

    view.on('userChangeEvent', function() {
        tickets.each( function( ticket ) {
            $('#' + ticket.get('id')).toggle( ticket.get('assignee').name == assignee.get('name') );
        });
    });
});

assignees.on('remove', function( assignee ) {
    assignee.$el.remove();
});

releases.on('add', function( release ) {
    $('#release_version').append('<option value="' + release.get('name') + '">' + release.get('name') + '</option>');
});

tickets.on('add', function( ticket ) {
    var view = new TicketView({
        model: ticket,
        assignees: assignees,
        releases: releases
    });

    ticket.$el = view.$el;

    $('#' + ticket.get('section') ).append( view.$el );
    view.$el.draggable();
});

tickets.on('change', function( ticket ) {
    if ( ticket.changed.section ) {
        ticket.$el.remove();
        ticket.$el.removeAttr('style');

        $('#' + ticket.get('section') ).prepend( ticket.$el );

        ticket.$el.draggable();
    }

    var assignee = assignees.findWhere( ticket.get('assignee') );
    $('.' + assignee.get('name') ).css('background-color', assignee.colour() );
    ticket.update();
});

tickets.on('remove', function( ticket ) {
    ticket.$el.remove();
});

$(document).ready(function(){
    assignees.add({ name: 'unassigned' });

	$('#release_version').change(function(){
		if ($(this).val().length > 0) {
			$('.ticket_block').hide();

            var release_name = $(this).val();
            var release = releases.findWhere({ name: release_name });
            $('.' + release.cssClass()).show();
		}
		else {
			$('.ticket_block').show();
		}
	});

    $('#legend_all').click(function(){
		$('.ticket_block').show();
    });

    $('#update').click(function() {
		queryIssues();
    });

    $('#toggle_all').click(function(){
        tickets.each(function( ticket ) {
            ticket_toggle( ticket );
        });

		if ($(this).val() == "Minimize All") {
	    	$(this).val("Maximize All");
		}
		else {
	    	$(this).val("Minimize All");
		}
    });

    $('#flush').click(function(){
		$.get('flush_issues', function(data){
	    	if (data.json_message == "Issues flushed.") {
				$('.issue_section').html('');
				tickets.reset();
				assignees.reset();
                releases.reset();
	    	}
		});

		$('#legend table tr.legend_user').remove();
    });

    $('.issue_section').droppable({
        drop: function( event, ui ) {
			var ticket_id = ui.draggable.attr('id');
			var section = $(this).attr('id');

            var ticket = tickets.findWhere({ id: ticket_id });
            ticket.set('section', section );
		}
    });

    $.blockUI();

    $.get('/curl/get_fix_versions', function(data) {
        if (data.json_data.errors) {
            alert(data.json_data.errors);
        }
        else {
            var fix_versions = data.json_data.fix_versions;

            for (var i = fix_versions.length - 1; i >= 0; i--) {
                $('#fix_version').append('<option value="' + fix_versions[i].name + '">' + fix_versions[i].name + '</option>');
            }
        }
    });

    $.get('get_issues', function(data) {
		if (data.json_data.errors) {
			alert(data.json_data.errors);
		}
		else {
			for (var i = 0; i < data.json_data.tickets.length; i++) {
				var ticket_data = data.json_data.tickets[i];

                if (ticket_data.section == "sql_review") {
                    ticket_data.section = "review";
                }

				if (ticket_data.assignee.indexOf(',') != -1) {
					var ticketAssignees = ticket_data.assignee.split(',');

					for (var a = 0; a < ticketAssignees.length; a++) {
						assignees.add(new Assignee({ name: ticketAssignees[a] }));
                    }
				}
				else {
                    var assignee = new Assignee({ name: ticket_data.assignee });
					assignees.add( assignee );
                    ticket_data.assignee = assignee.toJSON();
				}

				if ( ticket_data.release && ticket_data.release != "null" ) {
                    var release = new Release({ name: ticket_data.release })
                    releases.add( release );
                    ticket_data.release = release.toJSON();
				}

                if ( ticket_data.priority && ticket_data.priority != "null" ) {
                    var priority = new Priority({ name: ticket_data.priority, image: ticket_data.priority.toLowerCase() });
                    priorities.add( priority );
                    ticket_data.priority = priority.toJSON();
                }

                if ( ticket_data.type && ticket_data.type != "null" ) {
                    var type = new Type({ name: ticket_data.type });
                    types.add( type );
                    ticket_data.type = type.toJSON();
                }

                tickets.add(new Ticket(ticket_data));
			}
		}

        $.unblockUI();
    });
});

function queryIssues() {
    /*
	Authentication
    */
    $.blockUI();

    $.post('/curl/get_issues', {
			fix_version: $('#fix_version').val(),
		},
		function(data) {
			var issues = data.json_data.issues;

			for (var i = 0; i < issues.length; i++) {
				var issue = issues[i];

                if (!issue.fields.assignee) {
                    issue.fields.assignee = {
                        name: 'unassigned'
                    };
                }

                var ticket = tickets.findWhere({ key: issue.key });

                var assignee = new Assignee( issue.fields.assignee );
                assignees.add( assignee );

                var priority = new Priority({ name: issue.fields.issuetype.name });
                priorities.add( priority );

                var release = new Release({ name: issue.fields.customfield_10191 || "TBD" });
                releases.add( release );

                var type = new Type({ name: issue.fields.issuetype });
                types.add( type );

                if ( ticket ) {
                    ticket.set({
                        id: issue.key,
                        title: issue.fields.summary,
                        assignee: assignee.toJSON(),
                        priority: priority.toJSON(),
                        type: type.toJSON(),
                        release: release.toJSON()
                    });
                }
                else {
                    ticket = new Ticket();

                    ticket.set({
                        id: issue.key,
                        section: convertJIRAStatus(issue.fields.status.name),
                        title: issue.fields.summary,
                        assignee: assignee.toJSON(),
                        priority: priority.toJSON(),
                        type: type.toJSON(),
                        release: release.toJSON()
                    });
                }

                // If the ticket was in testing, but is now in System Testing do the move automatically
                if ( ticket.get('section') == "test" && issue.fields.status.name == "System Test" ) {
                    ticket.set('section', 'system_test');
                }

                if ( ticket.get('section') == "sql_review" || issue.fields.status.name == "SQL Review" ) {
                    ticket.set('section', 'review');
                }

			}

			$.unblockUI();
		},
		'json'
    );
}

function ticket_toggle( ticket ) {
    $('#' + ticket.get('id') + ' p').toggle();

    if ($('#' + ticket.get('id') + ' p').is(':visible')) {
        $('#' + ticket.get('id') + '_toggle').val('-');
    }
    else {
        $('#' + ticket.get('id') + '_toggle').val('+');
    }
}
