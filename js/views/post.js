'use strict';

var _            = require('underscore');
var Backbone     = require('backbone');
var postTemplate = require('template/post');
var utility      = require('utility');

var router;

module.exports = Backbone.View.extend({
  el: '#post-container',

  template: postTemplate,

  events: {
    'click .back-to-notes': function(e) {
      e.preventDefault();
      router.navigate('index', { trigger: true });
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

  initialize: function(options) {
    _.bindAll(this, 'render');

    router = options.router;
  },

  render: function() {
    var html = this.template(this.model.toJSON());

    this.$el.html(html);

    return this;
  }
});
