package IssueBoard::View::Mason;

use strict;
use warnings;

use base 'Catalyst::View::Mason';

__PACKAGE__->config(
	use_match => 0,
	template_extension => '.html',
);

=head1 NAME

IssueBoard::View::Mason - Mason View Component for IssueBoard

=head1 DESCRIPTION

Mason View Component for IssueBoard

=head1 SEE ALSO

L<IssueBoard>, L<HTML::Mason>

=head1 AUTHOR

William Lang,,,

=head1 LICENSE

This library is free software . You can redistribute it and/or modify it under
the same terms as perl itself.

=cut

1;