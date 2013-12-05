define('collections/notes',

[ 'backbone'
, 'models/note'
, 'utility'
],

function(Backbone, NoteModel, utility) {
  'use strict';

  var findOffset = function(context) {
    var $moreNotes, offset;

    $moreNotes = context.find('.more_notes_link');

    if(!$moreNotes.length) return;

    offset = $moreNotes.attr('onclick').match(/\?from_c=\d+/)[0];

    return offset;
  };

  return Backbone.Collection.extend({
    model: NoteModel,

    storeInitialData: function(model) {
      this.postURL   = model.get('post_url');
      this.notesHTML = model.get('notes_html');

      this.add(utility.notesToJSON(this.notesHTML));
    },

    url: function() {
      return this.postURL + findOffset(this.notesHTML);
    },

    canFetchMore: function() {
      var correctLength, endOfNotes;

      correctLength = this.count < 5;
      endOfNotes    = findOffset(this.notesHTML) != null;

      return correctLength && endOfNotes;
    }
  });
});
