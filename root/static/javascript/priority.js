var Priority = Backbone.Model.extend({
    idAttribute: 'name'
});

var PriorityCollection = Backbone.Collection.extend({
    model: Priority
});