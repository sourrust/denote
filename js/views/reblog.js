'use strict';

var _              = require('underscore');
var Backbone       = require('backbone');
var reblogTemplate = require('template/reblog');

var router;

module.exports = Backbone.View.extend({
  tagName: 'li',

  template: reblogTemplate,

  events: {
    'click .preview-link': 'showFullPreview'
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

  showFullPreview: function(e) {
    e.preventDefault();

    var model = this.model;

    function route() {
      var url = 'post/' + model.cid;

      return router.navigate(url, { trigger: true });
    }

    if(_.isEmpty(model.get('full_text'))) {
      model.fetch({ success: route });
    } else {
      route();
    }
  }
});
