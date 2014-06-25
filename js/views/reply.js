'use strict';

var _             = require('underscore'),
    Backbone      = require('backbone'),
    replyTemplate = require('template/reply');

module.exports = Backbone.View.extend({
  tagName: 'li',

  template: replyTemplate,

  initialize: function() {
    _.bindAll(this, 'render');
  },

  render: function() {
    var html = this.template(this.model.toJSON());

    this.$el.html(html);

    return this;
  }
});
