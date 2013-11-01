define('collections/notes', ['backbone', 'models/note'],

function(Backbone, NoteModel) {
  'use strict';

  return Backbone.Collection.extend({
    model: NoteModel
  });
});
