'use strict';

var _        = require('underscore'),
    $        = require('jquery'),
    Backbone = require('backbone');

function getResponses($blogs, $contents) {
  var contentsLen, reponses;

  contentsLen = $contents.length - 1;

  reponses = _.map($contents, function(content, i) {
    var children, html, result;

    result   = {};
    children = content.children;

    html = (i === contentsLen) ? children
                               : _.drop(children, 2);

    // check if there is a blog name present
    if($blogs && $blogs[i]) {
      result.blog = $blogs[i].outerHTML;
    }

    result.content = _.foldl(html, function(x, y) {
      return x + y.outerHTML;
    }, '');

    return result;
  });

  return reponses.reverse();
}

module.exports = Backbone.Model.extend({
  defaults: {
    'blogs': [],
    'is_preview': true,
    'permalink': ''
  },

  initialize: function() {
    _.bindAll(this, 'url', 'togglePreview');
  },

  url: function() {
    var apibase, apikey, base, blogs, permalink, postid;

    apibase   = 'http://api.tumblr.com/v2/blog/';
    apikey    = '&api_key=<%= apikey %>';

    permalink = this.get('permalink');
    blogs     = this.get('blogs');

    postid    = permalink.match(/\d+$/)[0];
    base      = blogs[0].username + '.tumblr.com';

    return apibase + base + '/posts?id=' + postid + apikey;
  },

  parse: function(response, options) {
    var $blogs, $content, $body, body, content, post;

    // Parse function in model gets called when the collection fetch
    // method gets called. Simply returns the model that has already been
    // parsed because we are looking for tumblr api reponses to parse.
    if(options.dataType) return response;

    post = response.response.posts[0];
    body = post.body || post.description || post.caption;

    // Appending a container onto the body of the post contents allows
    // jQuery to find top level tags. This is mainly for finding blockquote
    // tags because when there is only one response, and one top level
    // blockquote, jQuery couldn't find that tag.
    $body    = $('<div></div>').append(body);
    content  = _.last(body.split('</blockquote>'));
    $blogs   = $body.find('.tumblr_blog');
    $content = $body.find('p + blockquote');

    return { 'full_text': content.trim()
           , 'responses': getResponses($blogs, $content)
           };
  },

  togglePreview: function() {
    var isPreview = this.get('is_preview');

    this.set('is_preview', !isPreview);
  }
});
