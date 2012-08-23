function observableArray(initArray) {
    this.data = {};

	if (initArray) {
		for (var i = 0; i < initArray.length; i++) {
			this.push(initArray[i]);
		}
	}
}

observableArray.prototype.onNewItem = function(key) {

}

observableArray.prototype.onUpdateItem = function(key) {

}

observableArray.prototype.size = function() {
	return Object.keys(this.data).length;
}

observableArray.prototype.join = function(separator) {
	var returnString = "";

	this.each(function(obj) {
		returnString += obj + separator;
	}, true);

	return returnString.substr(0, returnString.length - 1); // remove trailing separator
}

observableArray.prototype.sort = function(compareFunc) {
	if (typeof compareFunc == "function") {
		//this.data.sort(compareFunc);
	}
	else {
		this.data.sort();
	}
}

observableArray.prototype.each = function(eachFunc, passObj) {
	if (eachFunc) {
		for (var key in this.data) {
			eachFunc(passObj ? this.data[key] : key);
		}
	}
}

observableArray.prototype.indexOf = function(objToFind) {
	for (var key in this.data) {
		if (this.data[key] == objToFind)
			return key;
	}

	return -1;
}

observableArray.prototype.push = function(key, obj) {
	if (!obj && obj != 0) {
		obj = key;
		key = this.size();
	}

	var exists = this.data[key];
	this.data[key] = obj;

	if (exists) {
		this.onUpdateItem(key);
	}
	else {
		this.onNewItem(key); 
	}
}

observableArray.prototype.flush = function() {
	this.data = {};
}

