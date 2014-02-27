var Ticket = Backbone.Model.extend({
    url: 'update_issue',

    update: function() {
        $.ajax({
            type: 'POST',
            url: 'update_issue',
            data: {
                id: this.get('id'),
                section: this.get('section'),
                title: this.get('title'),
                assignee: this.get('assignee').name,
                priority: this.get('priority').name,
                type: this.get('type').name,
                release: this.get('release').name
            }
        });
    }
});

var TicketCollection = Backbone.Collection.extend({
    model: Ticket
});

var TicketView = Backbone.View.extend({
    events: {
        "click .assignee" : "assigneeEdit",
        "click .release" : "releaseEdit",
        "change .assignee_edit select" : "assigneeChange",
        "change .release_edit select" : "releaseChange"
    },

    className: "ticket_block",

    initialize: function( options ) {
        this.assignees = options.assignees;
        this.template = _.template( $('#ticket-template').html() );
        this.$el.attr('id', this.model.get('id'));
        this.render();
        this.listenTo( this.model, "change", this.render );

        var that = this;
        $(document).on('click', function( e ) {
            if ( $(e.target).closest(that.$el).length == 0 ) {
                if ( that.$el.find('.assignee_edit select').is(':visible') ) {
                    that.assigneeClose();
                }

                if ( that.$el.find('.release_edit select').is(':visible') ) {
                    that.releaseClose();
                }
            }
        });
    },

    assigneeClose: function() {
        this.$el.find('.assignee').show();
        this.$el.find('.assignee_edit').hide();
    },

    releaseClose: function() {
        this.$el.find('.release').show();
        this.$el.find('.release_edit').hide();
    },

    assigneeEdit: function() {
        this.$el.find('.assignee').hide();
        this.$el.find('.assignee_edit').show();

        this.$el.find('.assignee_edit select option').remove();

        var that = this;
        assignees.each( function( assignee ) {
            var $option = $('<option>');
            $option.html( assignee.get('name') );
            $option.attr('value', assignee.get('name') );
            if ( that.model.get('assignee').name === assignee.get('name') ) {
                $option.attr('selected',  'selected' );
            }
            that.$el.find('.assignee_edit select').append( $option );
        });
    },

    assigneeChange: function() {
        this.model.set('assignee', {
            name: this.$el.find('.assignee_edit select').val()
        });
    },

    releaseEdit: function() {
        this.$el.find('.release').hide();
        this.$el.find('.release_edit').show();

        this.$el.find('.release_edit select option').remove();

        var that = this;
        releases.each( function( release ) {
            var $option = $('<option>');
            $option.html( release.get('name') );
            $option.attr('value', release.get('name') );
            if ( that.model.get('release').name === release.get('name') ) {
                $option.attr('selected',  'selected' );
            }
            that.$el.find('.release_edit select').append( $option );
        });
    },

    releaseChange: function() {
        this.model.set('release', {
            name: this.$el.find('.release_edit select').val()
        });
    },

    render: function() {
        var rendered = Mustache.to_html( this.template(), this.model.toJSON() );
        this.$el.html( rendered );
    }
});