define('views/post', ['underscore', 'backbone'],

function(_, Backbone) {
  'use strict';

  return Backbone.View.extend({
    el: '#post-container',

    initialize: function() {
      _.bindAll(this, 'render');

      this.model.on('change', this.render);
    },

    render: function() {
      var text = this.model.get('full_text');

      this.$el.html(text);

      return this;
    }
  });
});
