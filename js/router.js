'use strict';

var Backbone  = require('backbone');
var Notes     = require('collections/notes');
var NotesView = require('views/notecontainer');
var PostView  = require('views/post');

var collection, views = {};

module.exports = Backbone.Router.extend({
  routes: {
    'index': 'noteContainer',
    'post/:id': 'fullPost'
  },

  initialize: function(options) {
    collection = new Notes([], { data: options.data });

    views.notes = new NotesView({
      collection: collection,
      router: this
    });

    views.fullPost = new PostView({ router: this });
  },

  noteContainer: function() {
    views.fullPost.hide();
    views.notes.show();
  },

  fullPost: function(id) {
    var oldView = views.notes,
        newView = views.fullPost;

    newView.model = collection.get(id);
    newView.render();

    oldView.hide();
    newView.show();
  }
});
