import _               from 'underscore';
import { Collection }  from 'backbone';
import NoteModel       from '../models/note';
import { notesToJSON } from '../utility';

function findOffset($context) {
  const $moreNotes = $context.find('.more_notes_link');

  if(!_.isEmpty($moreNotes)) {
    return $moreNotes.attr('onclick').match(/\?from_c=\d+/)[0];
  }
}

export default Collection.extend({
  model: NoteModel,

  initialize: function(models, { data }) {
    _.bindAll(this);

    this.count     = 0;
    this.postURL   = data.postURL;
    this.notesHTML = data.notesHTML;

    this.add(notesToJSON(this.notesHTML));
  },

  url: function() {
    return this.postURL + findOffset(this.notesHTML);
  },

  parse: function(response) {
    let json;

    let endStr  = ' NOTES -->';
    let htmlStr = response.split('<!-- START' + endStr)[1]
                          .split('<!-- END'   + endStr)[0];

    this.notesHTML.html(htmlStr);

    json = notesToJSON(this.notesHTML);

    this.count += json.length;

    return json;
  },

  canFetchMore: function() {
    const correctLength = this.count < 5;
    const endOfNotes    = findOffset(this.notesHTML) != null;

    return correctLength && endOfNotes;
  }
});
