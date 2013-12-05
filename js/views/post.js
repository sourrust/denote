define('views/post',

[ 'underscore'
, 'backbone'
, 'utility'
, 'template/post'
],

function(_, Backbone, utility, postTemplate) {
  'use strict';

  return Backbone.View.extend({
    el: '#post-container',

    template: postTemplate,

    events: {
      'click .back-to-notes': function(e) {
        e.preventDefault();
        this.model.togglePreview();
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
