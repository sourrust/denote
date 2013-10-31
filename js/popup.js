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
        , 'collections/notes'
        , 'models/note'
        , 'utility'
        , 'text!../templates/note.html'
        ],

function(_, $, Backbone, Notes, NoteModel, utility, noteTemplate) {
  'use strict';

  var NoteView, NotesView, $loader, MoreButtonView;

  $loader = $('#loader');

  NoteView = Backbone.View.extend({
    tagName: 'li',

    template: _.template(noteTemplate),

    initialize: function() {
      _.bindAll(this, 'render');
    },

    render: function() {
      var html = this.template(this.model.toJSON());

      this.$el.html(html);

      return this;
    }
  });

  MoreButtonView = Backbone.View.extend({
    tagName: 'li',
    className: 'note more_comments',

    initialize: function() {
      _.bindAll(this, 'render');
    },

    render: function() {
      var html = 'More +';

      html += '<div class="clearfix"></div>';

      this.$el.html(html);

      return this;
    }
  });

  NotesView = Backbone.View.extend({
    el: '.notes',

    initialize: function() {
      _.bindAll(this, 'render', 'renderNote', 'requestMoreNotes'
                    , 'addMoreNotesButton');

      this.notesJSON = utility.notesToJSON(
        this.attributes.tempNotes);

      this.requestMoreNotes(function() {
        this.collection.add(
          _.map(this.notesJSON, function(note) {
            return new NoteModel(note);
          }));

        this.notesJSON = [];

        utility.toggleVisiblity($loader);
        this.addMoreNotesButton();
      }, this);

      this.collection = new Notes();

      this.collection.on('add', this.renderNote);

      this.render();
    },

    render: function() {
      this.collection.each(this.renderNote);

      return this;
    },

    renderNote: function(model) {
      var note = new NoteView({
        model: model,
        className: model.get('classes').join(' ')
      });

      this.$el.append(note.render().el);
    },

    requestMoreNotes: function(callback, context) {
      var offset, notesURL, that;

      offset = utility.findOffset(this.attributes.tempNotes);

      if(offset == null) return;

      notesURL = this.attributes.postURL + offset;

      if(this.notesJSON.length < 5) {
        that = this;
        $.get(notesURL, function(data) {
          var endstr, htmlstr, json;

          endstr  = ' NOTES -->';
          htmlstr = data.split('<!-- START' + endstr)[1]
                        .split('<!-- END'   + endstr)[0];
          that.attributes.tempNotes.html(htmlstr);

          json = utility.notesToJSON(
            that.attributes.tempNotes);

          that.notesJSON = that.notesJSON.concat(json);

          that.requestMoreNotes(callback, context);
        });
      } else {
        callback.call(context);
      }
    },

    addMoreNotesButton: function() {
      var that = this;

      if(utility.findOffset(this.attributes.tempNotes) == null) return;

      if(this.moreNotesView) {
        this.moreNotesView.remove();
      }

      this.moreNotesView = new MoreButtonView({
        events: {
          'click': function() {
            this.$el.addClass('hide');
            utility.toggleVisiblity($loader);
            that.requestMoreNotes(function() {
              this.collection.add(
                _.map(this.notesJSON, function(note) {
                  return new NoteModel(note);
                }));

              this.notesJSON = [];

              utility.toggleVisiblity($loader);
              this.addMoreNotesButton();
            }, that);
          }
        }
      });

      this.$el.append(this.moreNotesView.render().el);
    }
  });

  $(function() {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {}, function(response) {
        var notesView;

        if(response != null) {
          if(response.url != null && response.notes != null) {
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
