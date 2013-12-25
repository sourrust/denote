'use strict';

var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
  defaults: {
    'notes_html': '',
    'post_url': ''
  }
});
