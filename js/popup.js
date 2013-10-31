(function() {
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
    underscore: 'lib/lodash'
  }
});

require([ 'underscore'
        , 'jquery'
        , 'backbone'
        , 'utility'
        , 'text!../templates/notes.html'
        ],
  'use strict';

  var display, doc, denote, errorToHtml, loader, win;

  win = window;
  doc = win.document;

  display = doc.querySelector('.notes');
  loader  = doc.querySelector('#loader');

  denote = {
    noteOffset: '',
    request: new XMLHttpRequest(),
    url: null,
    _html: doc.createElement('ol'),

    toggleLoaderVisiblity: function() {
      if(loader.className === 'show') {
        loader.className = 'hide';
      } else if(loader.className === 'hide') {
        loader.className = 'show';
      }
    },

    canRequestMoreNotes: function() {
      var endOfNotes = this._html.querySelector('.original_post');

      return (endOfNotes == null) && this.noteOffset != null;
    },

    requestNotes: function(callback) {
      var newURL, req;

      if(!this.canRequestMoreNotes()) return;

      req    = this.request;
      newURL = this.url + this.noteOffset;

      req.open('GET', newURL, true);
      req.onload = callback.bind(this);
      req.send();
    },

    loadMoreNotes: function(e) {
      var endstr, notes;

      if(!this.canRequestMoreNotes()) return;

      endstr = ' NOTES -->';
      notes = e.target.responseText
               .split('<!-- START' + endstr)[1]
               .split('<!-- END'   + endstr)[0];

      this._html.innerHTML += notes;
    },

    fixTargetLinks: function(html) {
      var anchors = _.toArray(html.querySelectorAll('a'));

      _.forEach(anchors, function(anchor) {
        anchor.target = '_blank';
      });
    },

    addMoreNotesButton: function(noteHTML) {
      var moreNotes = "<li class=\"note more_comments\">" +
                      "More +" +
                      "<div class\"clear\"></div>" +
                      "</li>";

      if(this.canRequestMoreNotes()) {
        noteHTML.innerHTML += moreNotes;
      }
    },

    displayNotes: function(initNotes) {
      var notes, moreloop;

      this._html.innerHTML = initNotes;

      notes = this._html;

      if(!this.canRequestMoreNotes()) {
        this.filterForComments(notes);

        this.fixTargetLinks(notes);
        this.toggleLoaderVisiblity();

        display.innerHTML += notes.innerHTML;

        this.removeNotesFromCache(notes);

        return;
      }

      this.noteOffset = this.getNextOffset();

      this.filterForComments(notes);

      moreloop = function(e) {
        this.loadMoreNotes(e);
        this.noteOffset = this.getNextOffset();
        this.filterForComments(notes);

        if(this._html.children.length < 5 &&
           this.canRequestMoreNotes()) {
          this.requestNotes(moreloop);
        } else {
          this.fixTargetLinks(notes);
          this.toggleLoaderVisiblity();
          this.addMoreNotesButton(notes);

          display.innerHTML += notes.innerHTML;

          this.removeNotesFromCache(notes);

          this.setClickEvent(
            display.querySelector('.more_comments'),
            moreloop);
        }
      };

      this.requestNotes(moreloop);
    },

    setClickEvent: function(moreButton, moreloop) {
      if(moreButton != null) {
        // Needs to be 'onclick' and not 'addEventListener' to be able to
        // remove the element first and then request more note.
        display.querySelector('.more_comments')
               .onclick = function() {
          this.remove();
          denote.toggleLoaderVisiblity();
          denote.requestNotes.call(denote, function(e) {
            moreloop.call(this, e);
          });
        };
      }
    },

    removeNotesFromCache: function(notes) {
      _.forEach(_.toArray(notes.children), function(note) {
        note.remove();
      });
    },

    filterForComments: function(notes) {
      // Needs to be a real array in order to traverse through each note
      // element properly.
      var notes_ = _.toArray(notes.children);

      _.forEach(notes_, function(note) {
        var haveCommentary =
          _.contains(note.className.split(' '), 'with_commentary');

        if(!haveCommentary) {
          note.remove();
        }
      });
    },

    getNextOffset: function() {
      var offset, str;

      str    = this._html.querySelector('.more_notes_link_container');

      if(str != null) {
        offset = str.innerHTML.match(/\?from_c=\d+/)[0];
      }

      return offset;
    }
  };

  errorToHtml = function(message) {
    return '<li class="error">' + message + '</li>';
  };

  doc.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {}, function(response) {
        if(response != null) {
          if(response.url != null && response.notes != null) {
            denote.url = response.url;
            denote.displayNotes(response.notes);
          }
        } else {
          denote.toggleLoaderVisiblity();
          display.innerHTML = errorToHtml(
            'Couldn\'t find notes on this page'
            );
        }
      });
    });
  });
}).call(this);
