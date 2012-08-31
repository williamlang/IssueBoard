var alphabet = "abcdefghijklmnopqrstuvwxyz";

function stringToColor(str) {
    while (str.length < 6) {
		str += str;
    }

    var normalizer = "a".charCodeAt(0);

    var r = ((str.charCodeAt(0) - normalizer) % 16).toString(16)[0] + ((str.charCodeAt(1) - normalizer) % 16).toString(16)[0];
    var g = ((str.charCodeAt(2) - normalizer) % 16).toString(16)[0] + ((str.charCodeAt(3) - normalizer) % 16).toString(16)[0];
    var b = ((str.charCodeAt(4) - normalizer) % 16).toString(16)[0] + ((str.charCodeAt(5) - normalizer) % 16).toString(16)[0];

    var color = r + g + b;

    return "#" + color;
}

function convertJIRAStatus(jiraStatus) {
    return jiraStatus.toLowerCase().replace(/\s/, "_");
}

function releaseClass(releaseVersion) {
	if (!releaseVersion) {
		return "";
	}

	return releaseVersion.replace(new RegExp("\\.|\\s", "g"), "_");
}

var ticket_array = new observableArray();
var assignee_array = new observableArray();
var priority_array = new observableArray();
var releases_array = new observableArray();

// Manually add these for now
// TODO: move to config file
priority_array.push("Blocker", 0);
priority_array.push("Critical", 1);
priority_array.push("Major", 2);
priority_array.push("Minor", 3);
priority_array.push("Trivial", 4);

function ticketPrioritySort(a, b) {
	return priority_array.data[a.priority] - priority_array.data[b.priority];
}

assignee_array.onNewItem = function(key){
    $('#legend table').append('<tr class="legend_user legend_' + key + '"><td valign="bottom" id="legend_' + key + '">' + key + ' <div class="user_color ' + key + '">&nbsp;</div></td></tr>');

    $('.legend_' + key + ' *').click(function() {
		for (var id in ticket_array.data) {
			if ($('#' + id + '_assignees').hasClass(key)) { 
				$('#' + id).show();
	    	} else {
				$('#' + id).hide();
	    	}
		}
    });
};

releases_array.onNewItem = function(key) {
	$('#release_version').append('<option value="' + key + '">' + key + '</option>');
}

function assigneeColourize() {
	assignee_array.each(function(key) {
		if ($('.' + key))
	    	$('.' + key).css('background-color', stringToColor(key));
	});
}

$(document).ready(function(){

	$('#release_version').change(function(){
		if ($(this).val().length > 0) {
			$('.ticket_block').hide();
			$('.' + releaseClass($(this).val())).show();
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
		$('#password').val('');
    });
    
	$("#legend table tbody").on("hover", "td",
		function(event) {
			if(event.type == 'mouseleave') {
				$(this).parent().removeClass("highlight");
			}
			else {
				$(this).parent().addClass("highlight");
			}
		}
  	);

    $('#toggle_all').click(function(){
		for (var t in ticket_array.data) {
		    ticket_toggle(t);
		}

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
				ticket_array.flush();
				assignee_array.flush();
	    	}
		});

		$('#legend table tr.legend_user').remove();
    });

    $('.issue_section').droppable({
        drop: function( event, ui ) {
			var ticket_id = ui.draggable.attr('id');
			var section = $(this).attr('id');
			var title = $('#' + ticket_id + '_title').html();
			var assignee = $('#' + ticket_id + '_assignees').html();
			var priority = $('#' + ticket_id + '_priority').html();
			var type = $('#' + ticket_id + '_type').html();
			var release = $('#' + ticket_id + '_release').html();
			if (release == "Not scheduled for release")
				release = "";

			ticket_array.data[ticket_id].section = section;
			ticket_array.data[ticket_id].title = title;
			ticket_array.data[ticket_id].assignees = new observableArray(assignee.split(','));
			ticket_array.data[ticket_id].priority = priority;
			ticket_array.data[ticket_id].type = type;
			ticket_array.data[ticket_id].release = release;
			ticket_array.data[ticket_id].update();

			ui.draggable.remove();
			ui.draggable.removeAttr('style');
			if ($(this).find('.ticket_block').first().length > 0) {
				$(this).find('.ticket_block').first().before(ui.draggable);
			}
			else {
				$(this).append(ui.draggable);
			}

			// Re-init draggable
			$('.ticket_block').draggable();
		}
    });

    $.get('get_issues', function(data) {
		if (data.json_data.errors) {
			alert(data.json_data.errors);
		}
		else {
			var assignees = new Array();
			for (var i = 0; i < data.json_data.tickets.length; i++) {
				var ticket_data = data.json_data.tickets[i];
				ticket_array.push(ticket_data.id, new ticket(ticket_data.id, ticket_data.section, ticket_data.title, ticket_data.assignee, ticket_data.priority, ticket_data.type, ticket_data.release));

				if (ticket_data.assignee.indexOf(',') != -1) {
					var ticketAssignees = ticket_data.assignee.split(',');

					for (var a = 0; a < ticketAssignees.length; a++) 
						assignees.push(ticketAssignees[a]);
				}
				else {
					assignees.push(ticket_data.assignee);
				}

				if (ticket_data.release && ticket_data.release != "null" && !releases_array.data[ticket_data.release]) {
					releases_array.push(ticket_data.release, 1);
				}

				//$('#' + ticket_data.section).append(ticket_array.data[ticket_data.id].toObj()); 
			}
			
			assignees.sort();
			
			for (var i = 0; i < assignees.length; i++) {
				assignee_array.push(assignees[i], 1)
			}

			ticket_array.sort(ticketPrioritySort);
			ticket_array.each(function(ticket) {
				$('#' + ticket.section).append(ticket.toObj());
			}, true);			
			assigneeColourize();
		}
    });
});

function queryIssues() {
    /*
	Authentication
    */
    $('#overlay_container').show();

    var username = $('#username').val();
    var password = $('#password').val();
    var sprint = $('#sprint').val();

    $.post('/curl/get_issues', {
			username: username, 
			password: password, 
			sprint: sprint, 
			project: 'PY' 
		}, function(data) {
			var issues = data.json_data.issues;

			for (var i = 0; i < issues.length; i++) {
				var issue = issues[i];
			
				if (!ticket_array.data[issue.key]) {
					ticket_array.push(issue.key, new ticket(issue.key, convertJIRAStatus(issue.fields.status.name), issue.fields.summary, issue.fields.assignee.name, issue.fields.priority.name, issue.fields.issuetype.name, issue.fields.customfield_10191));
					$('#' + convertJIRAStatus(issue.fields.status.name)).append(ticket_array.data[issue.key].toObj());
					assignee_array.push(issue.fields.assignee.name, 1);
				}
				else {
					$('.' + ticket_array.data[issue.key].assignee).removeClass(ticket_array.data[issue.key].assignee).addClass(issue.fields.assignee.name);
					
					ticket_array.data[issue.key].title = issue.fields.summary;

					// if the ticket has been returned to the original owner
					if (ticket_array.data[issue.key].assignees.size() > 1 && ticket_array.data[issue.key].assignees.data[0] == issue.fields.assignee.name) {
						// remove the history
						ticket_array.data[issue.key].assignees = new observableArray();
						ticket_array.data[issue.key].assignees.push(issue.fields.assignee.name);
						$('#' + issue.key + '_assignees').attr('class', ticket_array.data[issue.key].assignees.data[0]);
						$('#' + issue.key + '_assignees').html(ticket_array.data[issue.key].assignees.data[0]);
					}
					else {
						// This is a new assignee for the ticket
						if (ticket_array.data[issue.key].assignees.indexOf(issue.fields.assignee.name) == -1) {
							ticket_array.data[issue.key].assignees.push(issue.fields.assignee.name);
						}
					}

					ticket_array.data[issue.key].priority = issue.fields.priority.name;
					ticket_array.data[issue.key].type = issue.fields.issuetype.name;
					ticket_array.data[issue.key].release = issue.fields.customfield_10191;

					if (ticket_array.data[issue.key].release && !releases_array.data[ticket_array.data[issue.key].release] && ticket_array.data[issue.key].release.length > 0) {
						releases_array.push(ticket_array.data[issue.key].release, 1);
					}
				}

				ticket_array.data[issue.key].update();
			}

			$('#overlay_container').hide();
			assigneeColourize();
		},
		'json'
    );
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

function assignee_edit(ticket_id) {
	var ticket_obj = ticket_array.data[ticket_id];

	if (ticket_obj) {
		var h3 = $('#' + ticket_id + '_assignee');
		h3.replaceWith(ticket_obj.assignee_edit_obj(assignee_array));

		// Focus on the select
		$('#' + ticket_id + '_assignee_edit_select').focus();

		// If it changes
		$('#' + ticket_id + '_assignee_edit_select').change(function(){
			var assignee = $(this).val();

			ticket_array.data[ticket_id].assignees = new observableArray();
			ticket_array.data[ticket_id].assignees.push(assignee);
			ticket_array.data[ticket_id].obj = null;
			$('#' + ticket_id).replaceWith(ticket_array.data[ticket_id].toObj());
			assigneeColourize();

			ticket_array.data[ticket_id].update();
		});
		
		// No change
		$('#' + ticket_id + '_assignee_edit_select').blur(function(){
			$('#' + ticket_id + '_assignee_edit').replaceWith(h3);
		});
	}
	else {
		alert('Ticket does not exist. Refresh the page.');
	}
}

function release_edit(ticket_id) {
	var ticket_obj = ticket_array.data[ticket_id];

	if (ticket_obj) {
		var div = $('#' + ticket_id + '_release');
		div.replaceWith(ticket_obj.release_edit_obj());
		$('#' + ticket_id + '_release_edit_select').focus();

		$('#' + ticket_id + '_release_edit_select').change(function() {
			var release = $(this).val();
			ticket_array.data[ticket_id].release = release;
			ticket_array.data[ticket_id].obj = null;
			$('#' + ticket_id).replaceWith(ticket_array.data[ticket_id].toObj());
			assigneeColourize();
			ticket_array.data[ticket_id].update();
		});

		$('#' + ticket_id + '_release_edit_select').blur(function(){
			$('#' + ticket_id + '_release_edit').replaceWith(div);
		});
	}
	else {
		alert('Ticket does not exist. Refresh the page');
	}
}

