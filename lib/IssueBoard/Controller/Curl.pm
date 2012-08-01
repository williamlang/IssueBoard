package IssueBoard::Controller::Curl;
use Moose;
use namespace::autoclean;
use WWW::Curl::Easy;
use JSON;
use POSIX qw( ceil );

BEGIN { extends 'Catalyst::Controller'; }

=head1 NAME

IssueBoard::Controller::Curl - Catalyst Controller

=head1 DESCRIPTION

Catalyst Controller.

=head1 METHODS

=cut


=head2 index

=cut

sub index :Path :Args(0) {
    my ( $self, $c ) = @_;   
}

sub get_issues :Local {
    my ($self, $c ) = @_;

    my $username = $c->req->param('username');
    my $password = $c->req->param('password');
	my $project = $c->req->param('project');
    my $fixVersion = $c->req->param('sprint');
    my $page = 0;
    my $pageCount = 1;
    my $perPage = 50;

    my $url = "https://pythian.jira.com/rest/api/2/search?jql=project='PY'+AND+fixVersion='Sprint+$fixVersion'&fields=key,summary,assignee,status,issuetype,priority";
    my $curl = WWW::Curl::Easy->new;
    my $json_response;

    while ($page < $pageCount) {
	my $startAt = $page * $perPage;
	$curl->setopt(CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
	$curl->setopt(CURLOPT_USERPWD, "$username:$password");
	$curl->setopt(CURLOPT_URL, $url . "&startAt=" . $startAt);

	my $response_body = '';
	open(my $fileb, ">",\$response_body);
	$curl->setopt(CURLOPT_WRITEDATA, $fileb);
	my $return_code = $curl->perform;
	close($fileb);

	# I do this because View::JSON inteprets response_body as a string and thus escapes everything
        my $json = JSON->new;
	my $json_text = $json->decode($response_body);

	if (!$json_response) {
	    $json_response = $json_text;
	}
	else {
	    push $json_response->{issues}, @{$json_text->{issues}};
	}

	$page++;
	$pageCount = ceil($json_text->{total} / $perPage);
    }

    $c->stash->{json_data} = $json_response;
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
