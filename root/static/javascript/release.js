var Release = Backbone.Model.extend({
    idAttribute: 'name',

    initialize: function() {
        this.set('class', this.cssClass());
    },

    cssClass: function() {
        return this.get('name').replace(new RegExp("\\.|\\s", "g"), "_");
    }
});

var ReleaseCollection = Backbone.Collection.extend({
    model: Release
});