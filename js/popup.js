require.config({
  shim: {
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    underscore: {
      exports: '_'
    }
  },
  paths: {
    backbone: 'lib/backbone',
    jquery: 'lib/jquery',
    text: 'lib/text',
    underscore: 'lib/lodash',
    template: '../templates'
  }
});

require(['jquery', 'views/notecontainer'],

function($, NotesView) {
  'use strict';

  $(function() {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {}, function(response) {
        var notesView;

        if(response != null) {
          if(response.notes != null) {
            notesView = new NotesView({
              attributes: {
                postURL: response.url,
                tempNotes: $('<ol>').html(response.notes)
              }
            });
          }
        }
      });
    });
  });
});
