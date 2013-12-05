define('collections/notes',

[ 'underscore'
, 'backbone'
, 'models/note'
, 'utility'
],

function(_, Backbone, NoteModel, utility) {
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

    initialize: function() {
      _.bindAll(this, 'storeInitialData', 'url', 'parse'
               , 'canFetchMore');

      this.count = 0;
    },

    storeInitialData: function(model) {
      this.postURL   = model.get('post_url');
      this.notesHTML = model.get('notes_html');

      this.add(utility.notesToJSON(this.notesHTML));
    },

    url: function() {
      return this.postURL + findOffset(this.notesHTML);
    },

    parse: function(response) {
      var endstr, htmlstr, json;

      endstr  = ' NOTES -->';
      htmlstr = response.split('<!-- START' + endstr)[1]
                        .split('<!-- END'   + endstr)[0];

      this.notesHTML.html(htmlstr);

      json = utility.notesToJSON(this.notesHTML);

      this.count += json.length;

      return json;
    },

    canFetchMore: function() {
      var correctLength, endOfNotes;

      correctLength = this.count < 5;
      endOfNotes    = findOffset(this.notesHTML) != null;

      return correctLength && endOfNotes;
    }
  });
});
