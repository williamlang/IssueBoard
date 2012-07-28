use strict;
use warnings;
use Test::More;


use Catalyst::Test 'IssueBoard';
use IssueBoard::Controller::Curl;

ok( request('/curl')->is_success, 'Request should succeed' );
done_testing();
