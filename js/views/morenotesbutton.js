'use strict';

var _        = require('underscore');
var Backbone = require('backbone');

module.exports = Backbone.View.extend({
  tagName: 'li',
  className: 'note more-comments',

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
