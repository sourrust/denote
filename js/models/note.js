define('models/note', ['backbone'],

function(Backbone) {
  'use strict';

  return Backbone.Model.extend({
    defaults: {
      'preview_text': '',
      'full_text': '',
      'permalink': '',
      'classes': [],
      'blogs': [],
      'is_preview': true
    },

    togglePreview: function() {
      var isPreview = this.get('is_preview');

      this.set('is_preview', !isPreview);
    }
  });
});
