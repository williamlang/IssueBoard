package IssueBoard::Controller::Scheduler;
use Moose;
use namespace::autoclean;
use strict;
 
BEGIN { extends 'Catalyst::Controller'; }

=head1 NAME

IssueBoard::Controller::Scheduler - Catalyst Controller

=head1 DESCRIPTION

Catalyst Controller.

=head1 METHODS

=cut


=head2 index

=cut

sub index :Local {
    my ( $self, $c ) = @_;

    $c->stash({
        title => 'Scheduler'
    });

    $c->forward('View::Mason');
}

=head1 AUTHOR

William Lang,,,

=head1 LICENSE

This library is free software. You can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

__PACKAGE__->meta->make_immutable;

1;

