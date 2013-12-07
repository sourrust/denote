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

    url: function() {
      var apibase, apikey, base, blogs, permalink, postid;

      apibase   = 'http://api.tumblr.com/v2/blog/';
      apikey    = '&api_key=<api key>';

      permalink = this.get('permalink');
      blogs     = this.get('blogs');

      postid    = permalink.match(/\d+$/)[0];
      base      = blogs[0].username + '.tumblr.com';

      return apibase + base + '/posts?id=' + postid + apikey;
    },

    togglePreview: function() {
      var isPreview = this.get('is_preview');

      this.set('is_preview', !isPreview);
    }
  });
});
