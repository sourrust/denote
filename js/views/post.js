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
      'click.back-to-notes': function() {
        this.model.set('is_preview', true);
      }
    },

    initialize: function() {
      _.bindAll(this, 'render');

      this.model.on('change', this.render);
    },

    render: function() {
      var html = this.template(this.model.toJSON());

      this.$el.html(html);

      if(this.model.get('is_preview')) {
        utility.swapClass(this.$el, 'show', 'hide');
      } else {
        utility.swapClass(this.$el, 'hide', 'show');
      }

      return this;
    }
  });
});
