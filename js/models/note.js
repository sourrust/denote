import _         from 'underscore';
import { Model } from 'backbone';
import API       from '../.secret-api';

function getResponses(trail) {
  return _.map(trail, function(post) {
    let blog, blogName, content, postID;

    content  = post.content;
    blogName = post.blog.name;
    postID   = post.post.id;
    blog     = `<a href="http://${blogName}.tumblr.com/post/${postID}" ` +
               `class="tumblr_blog" target="_blank">${blogName}</a>`;

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
    let blogs, blogname, permalink, postid;

    permalink = this.get('permalink');
    blogs     = this.get('blogs');

    blogname  = blogs[0].username;
    postid    = permalink.match(/\d+$/)[0];

    return `http://api.tumblr.com/v2/blog/${blogname}.tumblr.com` +
           `/posts?id=${postid}&api_key=${API.key}`;
  },

  parse: function(response, options) {
    let content, post, trail;

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

    return { fullText: content.trim()
           , responses: getResponses(_.initial(trail))
           };
  }
});
