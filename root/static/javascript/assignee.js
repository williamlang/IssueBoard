var Assignee = Backbone.Model.extend({
    alphabet: "abcdefghijklmnopqrstuvwxyz",
    idAttribute: 'name',

    initialize: function() {
        this.set('colour', this.colour() );
    },

    colour: function (){
        var str = this.get('name');

        if (!str || str.length == 0)
        return '';

        while (str.length < 6) {
            str += str;
        }

        var normalizer = "a".charCodeAt(0);

        var r = ((str.charCodeAt(0) - normalizer) % 16).toString(16)[0] + ((str.charCodeAt(1) - normalizer) % 16).toString(16)[0];
        var g = ((str.charCodeAt(2) - normalizer) % 16).toString(16)[0] + ((str.charCodeAt(3) - normalizer) % 16).toString(16)[0];
        var b = ((str.charCodeAt(4) - normalizer) % 16).toString(16)[0] + ((str.charCodeAt(5) - normalizer) % 16).toString(16)[0];

        var colour = r + g + b;

        return "#" + colour;
    }
});

var AssigneeView = Backbone.View.extend({
    tagName: 'tr',

    events: {
        "click .legend_user" : "userClick"
    },

    initialize: function() {
        this.template = _.template( $('#assignee-template').html() );
        this.render();
    },

    render: function() {
        var rendered = Mustache.to_html( this.template(), this.model.toJSON() );
        this.$el.html( rendered );
    },

    userClick: function() {
        this.trigger('userChangeEvent');
    }
});

var AssigneeCollection = Backbone.Collection.extend({
    model: Assignee
});
