var Priority = Backbone.Model.extend({
    idAttribute: 'name',

    initialize: function() {
        this.set('image', this.get('name').toLowerCase() );
    }
});

var PriorityCollection = Backbone.Collection.extend({
    model: Priority
});