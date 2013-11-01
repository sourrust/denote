define('models/note', ['backbone'],

function(Backbone) {
  'use strict';

  return Backbone.Model.extend({
    defaults: {
      'preview_text': '',
      'permalink': '',
      'classes': [],
      'blogs': []
    }
  });
});
