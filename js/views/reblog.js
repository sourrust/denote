'use strict';

var _            = require('underscore'),
    Backbone     = require('backbone'),
    noteTemplate = require('template/note');

module.exports = Backbone.View.extend({
  tagName: 'li',

  template: noteTemplate,

  events: {
    'click .preview-link': function(e) {
      e.preventDefault();

      var model = this.model;

      if(_.isEmpty(model.get('full_text'))) {
        model.fetch({ success: model.togglePreview });
      } else {
        model.togglePreview();
      }

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
