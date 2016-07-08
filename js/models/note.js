import _         from 'underscore';
import { Model } from 'backbone';
import API       from '../.secret-api';

function getResponses(trail) {
  return _.map(trail, function(post) {
    const content = post.content;
    const blog    = {
      name: post.blog.name,
      postID: post.post.id
    };

    return { blog, content };
  });
}

let router;

export default Model.extend({
  defaults: {
    blogs: [],
    permalink: ''
  },

  initialize: function(options) {
    _.bindAll(this, 'url');

    router = options.router;
  },

  url: function() {
    const permalink = this.get('permalink');
    const blogs     = this.get('blogs');

    const blogName  = blogs[0].username;
    const postID    = permalink.match(/\d+$/)[0];

    return `http://api.tumblr.com/v2/blog/${blogName}.tumblr.com` +
           `/posts?id=${postID}&api_key=${API.key}`;
  },

  parse: function(response, options) {
    // Parse function in model gets called when the collection fetch method
    // gets called. Simply returns the model that has already been parsed
    // because we are looking for tumblr API responses to parse.
    if(options.dataType) return response;

    const post = response.response.posts[0];

    // Trail follow the conversation of reblogs in descending order.
    // Leveraging tumblr's API is far simpler than parsing the full post
    // content and dealing with all the edge cases.
    const trail   = post.trail;
    const content = _.last(trail).content;

    return { fullText: content.trim()
           , responses: getResponses(_.initial(trail))
           };
  }
});
