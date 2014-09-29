(function() {
  'use strict';

  var doc, moreNotes, notes, notesStr, noteUrl, urlStr, win;

  win = window;
  doc = win.document;

  notes   = doc.querySelector('ol.notes');
  noteUrl = null;
  urlStr  = null;

  // Grab the notes url
  if(notes) {
    moreNotes = doc.querySelector('.more_notes_link_container');

    if(moreNotes) {
      noteUrl = moreNotes.innerHTML.match(/\/notes\/\d+\/\w+\???/)[0];

      // Concat the base blog url with note url
      urlStr  = win.location.origin + noteUrl;
    }

    notesStr  = notes.innerHTML;
  }

  chrome.runtime.onMessage.addListener(
    function(res, sender, sendMessage) {
      sendMessage({
        url: urlStr,
        notes: notesStr
      });
    });
}).call(this);
