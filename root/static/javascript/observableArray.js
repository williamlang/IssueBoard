function observableArray() {

    this.data = [];
    
    this.push = function(key, obj) {

		if (!obj) {
			obj = key;
			key = 0;
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

    this.onNewItem = function(key) {

    }

    this.onUpdateItem = function(key) {

    }
} 
