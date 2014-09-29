'use strict';

var _              = require('underscore');
var Backbone       = require('backbone');
var reblogTemplate = require('template/reblog');

var router;

module.exports = Backbone.View.extend({
  tagName: 'li',

  template: reblogTemplate,

  events: {
    'click .preview-link': function(e) {
      e.preventDefault();

      var model = this.model,
          route = function() {
            return router.navigate('post/' + model.cid, {
              trigger: true
            });
          };

      if(_.isEmpty(model.get('full_text'))) {
        model.fetch({ success: route });
      } else {
        route();
      }
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
