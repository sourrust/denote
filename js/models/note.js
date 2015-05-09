'use strict';

var _        = require('underscore');
var API      = require('../.secret-api');
var Backbone = require('backbone');

function getResponses(trail) {
  return _.map(trail, function(post) {
    var blog, blogName, content, postID;

    content  = post.content;
    blogName = post.blog.name;
    postID   = post.post.id;
    blog     = '<a href="http://' + blogName + '.tumblr.com/post/' +
               postID + '" class="tumblr_blog" target="_blank">'   +
               blogName + '</a>';

    return {
      blog: blog,
      content: content
    };
  });
}

var router;

module.exports = Backbone.Model.extend({
  defaults: {
    blogs: [],
    permalink: ''
  },

  initialize: function(options) {
    _.bindAll(this, 'url');

    router = options.router;
  },

  url: function() {
    var apibase, apikey, base, blogs, permalink, postid;

    apibase   = 'http://api.tumblr.com/v2/blog/';
    apikey    = '&api_key=' + API.key;

    permalink = this.get('permalink');
    blogs     = this.get('blogs');

    postid    = permalink.match(/\d+$/)[0];
    base      = blogs[0].username + '.tumblr.com';

    return apibase + base + '/posts?id=' + postid + apikey;
  },

  parse: function(response, options) {
    var content, post, trail;

    // Parse function in model gets called when the collection fetch
    // method gets called. Simply returns the model that has already been
    // parsed because we are looking for tumblr API responses to parse.
    if(options.dataType) return response;

    post = response.response.posts[0];

    // Trail follow the conversation of reblogs in descending order.
    // Leveraging tumblr's API is far simpler than parsing the full post
    // content and dealing with all the edge cases.
    trail   = post.trail;
    content = _.last(trail).content;

    return { 'full_text': content.trim()
           , 'responses': getResponses(_.initial(trail))
           };
  }
});
