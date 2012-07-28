package IssueBoard::Controller::Board;
use Moose;
use namespace::autoclean;
use strict;

BEGIN { extends 'Catalyst::Controller'; }

=head1 NAME

IssueBoard::Controller::Board - Catalyst Controller

=head1 DESCRIPTION

Catalyst Controller.

=head1 METHODS

=cut


=head2 index

=cut

sub index :Local {
    my ( $self, $c ) = @_;

    $c->stash({	
    	title => 'Board' 
    });

    $c->forward('View::Mason');
}

sub get_issues :Local {
    my ( $self, $c ) = @_;

    my $error = 0;
    my @tickets;
    my @files;

    if (opendir(DIR, "/var/www/issueboard/root/tickets")) {
	@files = readdir(DIR);

	for my $file (@files) {
	    if (open FILE, "<", "/var/www/issueboard/root/tickets/$file") {
		my @lines = <FILE>;

		for my $line (@lines) { chomp $line if $line; }

		push @tickets, {
		    id => $lines[0],
		    title => $lines[1],
		    section => $lines[2]
		} if $lines[0] && $lines[1] && $lines[2];
	    }
	}

	closedir(DIR);
    }

    $c->stash->{json_data} = {
        tickets => \@tickets
    };

    $c->forward('View::JSON');
}

sub update_issue :Local {
    my ( $self, $c ) = @_;

    my $error = 0;
    my @messages = ();
    my $ticket_id;
    my $section;
    my $title;

    if ($c->req->body_params->{id}) {
        $ticket_id = $c->req->body_params->{id};
    }
    else {
	$error = 1;
	push @messages, "No ticket id specified.";
    }

    if ($c->req->body_params->{section}) {
	$section = $c->req->body_params->{section};
    }
    else {
	$error = 1;
	push @messages, "No section specified.";
    }

    if ($c->req->body_params->{title}) {
	$title = $c->req->body_params->{title};
    }
    else {
	$error = 1;
	push @messages, "No title specified.";
    }

    if ($error) {
        $c->stash->{json_data} = {
	    'errors' => \@messages 
	};
    } 
    else {
	my $file_contents = <<END_FILE;
$ticket_id
$title
$section
END_FILE

	# open file for read -- we don't care what's in there, so truncate and overwrite
	if (open FILE, ">", "/var/www/issueboard/root/tickets/${ticket_id}.txt") {
	    print FILE $file_contents;
	    close FILE;

	    $c->stash->{json_data} = {
		'success' => ['Ticket updated']
	    };
	}
	else {
	    $c->stash->{json_data} = {
		'errors' => ['Could not open and/or create file.']
	    }
	}
    }

    $c->forward('View::JSON');
}

sub flush_issues :Local {
    my ( $self, $c ) = @_;

    my $error = 0;
    my @tickets;
    my @files;

    if (opendir(DIR, "/var/www/issueboard/root/tickets")) {
	@files = readdir(DIR);

	for my $file (@files) {
	    unlink("/var/www/issueboard/root/tickets/$file");
	}

	closedir(DIR);
    }

    $c->stash->{json_message} = "Issues flushed.";
    $c->forward('View::JSON');
}

=head1 AUTHOR

William Lang,,,

=head1 LICENSE

This library is free software. You can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

__PACKAGE__->meta->make_immutable;

1;
