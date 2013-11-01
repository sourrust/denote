define('views/morenotesbutton', ['underscore', 'backbone'],

function(_, Backbone) {
  'use strict';

  return Backbone.View.extend({
    tagName: 'li',
    className: 'note more_comments',

    initialize: function() {
      _.bindAll(this, 'render');
    },

    render: function() {
      var html = 'More +';

      html += '<div class="clearfix"></div>';

      this.$el.html(html);

      return this;
    }
  });
});
