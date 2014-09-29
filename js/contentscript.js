(function(win, doc) {
  'use strict';

  var moreNotes, notes, notesStr, noteUrl, urlStr;

  notes = doc.querySelector('ol.notes');

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
}).call(this, window, document);
