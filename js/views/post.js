'use strict';

var _            = require('underscore'),
    Backbone     = require('backbone'),
    postTemplate = require('template/post'),
    utility      = require('utility');

module.exports = Backbone.View.extend({
  el: '#post-container',

  template: postTemplate,

  events: {
    'click .back-to-notes': function(e) {
      e.preventDefault();
      this.model.togglePreview();
    },
    'click #response-button': function() {
      var $button, $responses;

      $button    = this.$el.find('#response-button');
      $responses = this.$el.find('ol.responses');

      if($responses.hasClass('hide')) {
        $button.html('Hide Responses');
      } else {
        $button.html('Show Responses');
      }

      utility.toggleVisiblity($responses);
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
