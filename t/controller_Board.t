use strict;
use warnings;
use Test::More;


use Catalyst::Test 'IssueBoard';
use IssueBoard::Controller::Board;

ok( request('/board')->is_success, 'Request should succeed' );
done_testing();
