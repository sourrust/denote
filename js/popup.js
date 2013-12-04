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

require(['jquery', 'models/initial', 'views/notecontainer'],

function($, InitialModel, NotesView) {
  'use strict';

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
});
