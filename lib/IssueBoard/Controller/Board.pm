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

    if (opendir(DIR, $c->config->{home} . "/root/tickets/")) {
		@files = readdir(DIR);

		for my $file (@files) {
	    	if (open FILE, "<", $c->config->{home} . "/root/tickets/$file") {
				my @lines = <FILE>;

	        	for my $line (@lines) { chomp $line if $line; }
				push @tickets, {
			        id => $lines[0],
					title => $lines[1],
					section => $lines[2],
					assignee => $lines[3],
					priority => $lines[4],
					type => $lines[5]
				} if $lines[0] && $lines[1] && $lines[2] && $lines[3] && $lines[4] && $lines[5];
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
    my %ticket = ();
    my $file_contents = "";

    for (qw(id title section assignee priority type)) {
		if ($c->req->body_params->{$_}) {
		    $ticket{"$_"} = $c->req->body_params->{$_};
	    	$file_contents .= $ticket{"$_"} . "\n";
		}
		else {
	    	$error = 1;
		    push @messages, "$_ was not specified.";
		}
    }

    if ($error) {
        $c->stash->{json_data} = {
			'errors' => \@messages 
		};
    } 
    else {
	# open file for read -- we don't care what's in there, so truncate and overwrite
        if (open FILE, ">", $c->config->{home} . "/root/tickets/$ticket{id}.txt") {
			print FILE $file_contents;
			close FILE;

			$c->stash->{json_data} = {
				'success' => ['Ticket updated']
	    	};
		}
		else {
			$c->stash->{json_data} = {
			'errors' => ['Could not open and/or create file. ' . $!]
			};
		}
    }

    $c->forward('View::JSON');
}

sub flush_issues :Local {
    my ( $self, $c ) = @_;

    my $error = 0;
    my @tickets;
    my @files;

    if (opendir(DIR, $c->config->{home} . "/root/tickets")) {
		@files = readdir(DIR);

		for my $file (@files) {
			unlink($c->config->{home} . "/root/tickets/$file");
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
