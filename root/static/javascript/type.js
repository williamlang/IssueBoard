var Type = Backbone.Model.extend({
    idAttribute: 'name'
});

var TypeCollection = Backbone.Collection.extend({
    model: Type
});