(function() {
  'use strict';

  var doc, notes, notesStr, noteUrl, urlStr, win;

  win = window;
  doc = win.document;

  notes   = doc.querySelector('.more_notes_link_container');
  noteUrl = null;
  urlStr  = null;

  // Grab the notes url
  if(notes != null)
    noteUrl = notes.innerHTML.match(/\/notes\/\d+\/\w+\???/)[0];

  notesStr = doc.querySelector('ol.notes').innerHTML;

  // Concat the base blog url with note url
  urlStr = win.location.origin + noteUrl;

  chrome.runtime.onMessage.addListener(
    function(res, sender, sendMessage) {
      sendMessage({
        url: urlStr || '',
        notes: notesStr
      });
    });
}).call(this);
