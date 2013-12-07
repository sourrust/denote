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

    parse: function(response, options) {
      var body, content, post;

      // Parse function in model gets called when the collection fetch
      // method gets called. Simply returns the model that has already been
      // parsed because we are looking for tumblr api reponses to parse.
      if(options.dataType) return response;

      post    = response.response.posts[0];
      body    = post.body || post.description || post.caption;
      content = _.last(body.split('</blockquote>'));

      return { 'full_text': content.trim() };
    },

    togglePreview: function() {
      var isPreview = this.get('is_preview');

      this.set('is_preview', !isPreview);
    }
  });
});
