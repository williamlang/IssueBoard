use strict;
use warnings;

use IssueBoard;

my $app = IssueBoard->apply_default_middlewares(IssueBoard->psgi_app);
$app;

