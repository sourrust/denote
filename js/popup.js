(function() {
  'use strict';

  var display, doc, denote, loader, win;

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

        if(this._html.children.length < 15 &&
           this.canRequestMoreNotes()) {
          this.requestNotes(moreloop);
        } else {
          this.fixTargetLinks(notes);
          this.toggleLoaderVisiblity();

          display.innerHTML += notes.innerHTML;

          this.removeNotesFromCache(notes);
        }
      };

      this.requestNotes(moreloop);
    },

    removeNotesFromCache: function(notes) {
      _.forEach(_.toArray(notes.children), function(note) {
        this._html.removeChild(note);
      }, this);
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
