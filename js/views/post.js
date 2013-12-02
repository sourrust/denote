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

    initialize: function() {
      _.bindAll(this, 'render');

      this.model.on('change', this.render);
    },

    render: function() {
      var html = this.template(this.model.toJSON());

      this.$el.html(html);

      return this;
    }
  });
});
