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
    'click .back-to-notes': 'backToNotes',
    'click #response-button': 'toggleResponses'
  },

  initialize: function(options) {
    _.bindAll(this, 'render');

    router = options.router;
  },

  render: function() {
    var html = this.template(this.model.toJSON());

    this.$el.html(html);

    return this;
  },

  show: function() {
    utility.swapClass(this.$el, 'hide', 'show');
  },

  hide: function() {
    utility.swapClass(this.$el, 'show', 'hide');
  },

  backToNotes: function(event) {
    event.preventDefault();
    router.navigate('index', { trigger: true });
  },

  toggleResponses: function() {
    var $button, $responses, visiblity;

    $button    = this.$el.find('#response-button');
    $responses = this.$el.find('ol.responses');
    visiblity  = $responses.hasClass('hide') ? 'Hide' : 'Show';

    $button.html(visiblity + ' Responses');

    utility.toggleVisiblity($responses);
  }
});
