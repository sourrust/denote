'use strict';

var Backbone  = require('backbone'),
    Notes     = require('collections/notes'),
    NotesView = require('views/notecontainer'),
    PostView  = require('views/post'),
    utility   = require('utility');

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
    utility.swapClass(views.notes.$el, 'hide', 'show');
    utility.swapClass(views.fullPost.$el, 'show', 'hide');
  },

  fullPost: function(id) {
    var oldView = views.notes,
        newView = views.fullPost;

    newView.model = collection.get(id);
    newView.render();

    utility.swapClass(oldView.$el, 'show', 'hide');
    utility.swapClass(newView.$el, 'hide', 'show');
  }
});