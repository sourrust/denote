define('models/initial', ['backbone'],

function(Backbone) {
  'use strict';

  return Backbone.Model.extend({
    defaults: {
      'notes_html': '',
      'post_url': ''
    }
  });
});
