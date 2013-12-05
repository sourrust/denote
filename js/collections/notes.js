define('collections/notes', ['backbone', 'models/note'],

function(Backbone, NoteModel) {
  'use strict';

  var findOffset = function(context) {
    var $moreNotes, offset;

    $moreNotes = context.find('.more_notes_link');

    if(!$moreNotes.length) return;

    offset = $moreNotes.attr('onclick').match(/\?from_c=\d+/)[0];

    return offset;
  };

  return Backbone.Collection.extend({
    model: NoteModel
  });
});
