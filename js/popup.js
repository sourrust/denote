(function() {
  'use strict';

  var display, doc, denote, loader, win;

  win = window;
  doc = win.document;

  display = doc.querySelector('#note_container');
  loader  = doc.querySelector('#loader');

  denote = {
    noteOffset: '',
    request: new XMLHttpRequest(),
    url: null,
    _html: doc.createElement('div'),

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

      this._html.children[0].innerHTML += notes;
    },

    fixTargetLinks: function(html) {
      var anchors = _.toArray(html.querySelectorAll('a'));

      _.forEach(anchors, function(anchor) {
        anchor.target = '_blank';
      });
    },

    displayNotes: function(initNotes) {
      var notes, noteHTML, moreloop;

      notes = initNotes;
      this._html.innerHTML = notes;

      noteHTML = this._html.children[0];

      if(!this.canRequestMoreNotes()) {
        this.filterForComments(noteHTML);

        this.fixTargetLinks(noteHTML);
        this.toggleLoaderVisiblity();

        display.innerHTML += noteHTML.outerHTML;
        this._html.removeChild(noteHTML);

        return;
      }

      this.noteOffset = this.getNextOffset();

      this.filterForComments(noteHTML);

      moreloop = function(e) {
        this.loadMoreNotes(e);
        this.noteOffset = this.getNextOffset();
        this.filterForComments(noteHTML);

        if(this._html.children[0].children.length < 15 &&
           this.canRequestMoreNotes()) {
          this.requestNotes(moreloop);
        } else {
          this.fixTargetLinks(noteHTML);
          this.toggleLoaderVisiblity();

          display.innerHTML += noteHTML.outerHTML;
          this._html.removeChild(noteHTML);
        }
      };

      this.requestNotes(moreloop);
    },

    filterForComments: function(notes) {
      // Needs to be a real array in order to traverse through each note
      // element properly.
      var notes_ = _.toArray(notes.children);

      _.forEach(notes_, function(x) {
        if(!_.contains(x.className.split(' '), 'with_commentary')) {
          notes.removeChild(x);
        }
      }, this);
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

  doc.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {}, function(response) {
        denote.url = response.url;

        denote.displayNotes(response.notes);
      });
    });
  });
}).call(this);
