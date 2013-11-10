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
