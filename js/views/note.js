define('views/note',

[ 'underscore'
, 'jquery'
, 'backbone'
, 'template/note'
],

function(_, $, Backbone, noteTemplate) {
  'use strict';

  var makeURL = function(base, postid) {
    var apibase, apikey;

    apibase = 'http://api.tumblr.com/v2/blog/';
    apikey  = '&api_key=<api key>';

    return apibase + base + '/posts?id=' + postid + apikey;
  };

  return Backbone.View.extend({
    tagName: 'li',

    template: noteTemplate,

    events: {
      'click': function(e) {
        var blogs, blogurl, permalink, postid, posturl, that;

        e.preventDefault();

        if(!_.isEmpty(this.model.get('full_text'))) {
          this.model.togglePreview();
          return;
        }

        that      = this;
        permalink = this.model.get('permalink');
        blogs     = this.model.get('blogs');
        postid    = permalink.match(/\d+$/)[0];
        blogurl   = blogs[0].username + '.tumblr.com';
        posturl   = makeURL(blogurl, postid);


        $.get(posturl, function(data) {
          var body, content, post;

          post    = data.response.posts[0];
          body    = post.body || post.description || post.caption;
          content = _.last(body.split('</blockquote>'));

          that.model.set('full_text', content.trim());
          console.log(content);

          that.model.togglePreview();
        });
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
});
