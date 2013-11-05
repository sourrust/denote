define('views/note',

[ 'underscore'
, 'backbone'
, 'template/note'
],

function(_, Backbone, noteTemplate) {
  'use strict';

  return Backbone.View.extend({
    tagName: 'li',

    template: noteTemplate,

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
