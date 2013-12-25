'use strict';

var $            = require('jquery'),
    InitialModel = require('models/initial'),
    NotesView    = require('views/notecontainer');

$(function() {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {}, function(response) {
      var notesView, initialModel;

      response = response || {};

      if(response.notes != null) {
        initialModel = new InitialModel({
          post_url: response.url,
          notes_html: $('<ol>').html(response.notes)
        });

        notesView = new NotesView({
          model: initialModel
        });
      }
    });
  });
});
