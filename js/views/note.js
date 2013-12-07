define('views/note',

[ 'underscore'
, 'jquery'
, 'backbone'
, 'template/note'
],

function(_, $, Backbone, noteTemplate) {
  'use strict';

  return Backbone.View.extend({
    tagName: 'li',

    template: noteTemplate,

    events: {
      'click .preview-link': function(e) {
        e.preventDefault();

        var model = this.model;

        if(_.isEmpty(model.get('full_text'))) {
          model.fetch({ success: model.togglePreview });
        } else {
          model.togglePreview();
        }

      }
    },

    initialize: function() {
      _.bindAll(this, 'render');
    },

    render: function() {
      var html = this.template(this.model.toJSON());

      this.$el.html(html);

      return this;
    }
  });
});
