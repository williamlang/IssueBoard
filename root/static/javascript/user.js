function User(name, badDays) {
    // the user's name
    this.name = name;

    // the days this user CANNOT be on call
    this.badDays = new observableArray();

    if (badDays) {
	for (var i = 0; i < badDays.length; i++) {
	    this.badDays.push(badDays[i]);
	}
    }
}

