define('views/notecontainer',

[ 'underscore'
, 'jquery'
, 'backbone'
, 'collections/notes'
, 'models/note'
, 'utility'
, 'views/morenotesbutton'
, 'views/note'
, 'views/post'
],

function
( _, $, Backbone
, Notes, NoteModel
, utility
, MoreButtonView
, NoteView
, PostView
) {
  'use strict';

  var $loader, addToCollection;

  $loader = $('#loader');

  addToCollection = function() {
    this.collection.add(
      _.map(this.notesJSON, function(note) {
        return new NoteModel(note);
      }));

    this.notesJSON = [];

    utility.toggleVisiblity($loader);
    this.addMoreNotesButton();
  };

  return Backbone.View.extend({
    el: '.notes',

    initialize: function() {
      _.bindAll(this, 'render', 'renderNote', 'requestMoreNotes'
                    , 'addMoreNotesButton');

      this.collection = new Notes();
      this.collection.storeInitialData(this.model);

      var that = this;
      this.collection.on({
        'add': this.renderNote,
        'change:is_preview': function(model) {
          if(model.get('is_preview')) {
            utility.swapClass(that.$el, 'hide', 'show');
          } else {
            if(that.fullPostView == null) {
              that.fullPostView = new PostView({
                model: model
              });
            } else {
              that.fullPostView.model.set(model.toJSON());
            }

            utility.swapClass(that.$el, 'show', 'hide');
          }
        }
      });

      this.render();

      if(_.isEmpty(this.model.get('post_url'))) {
        addToCollection.call(this);
      } else {
        this.requestMoreNotes(addToCollection, this);
      }
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
      var offset, notesURL, that, tempNotes;

      tempNotes = this.model.get('notes_html');
      offset = utility.findOffset(tempNotes);

      if(offset == null) return;

      notesURL = this.model.get('post_url') + offset;
      that     = this;

      $.get(notesURL, function(data) {
        var canGrabMore, endstr, htmlstr, json;

        endstr  = ' NOTES -->';
        htmlstr = data.split('<!-- START' + endstr)[1]
                      .split('<!-- END'   + endstr)[0];
        tempNotes.html(htmlstr);

        canGrabMore = utility.canGrabMoreNotes(
          that.notesJSON, tempNotes);

        // check for length and end of notes
        if(canGrabMore) {
          json = utility.notesToJSON(
            tempNotes);

          that.notesJSON = that.notesJSON.concat(json);

          that.requestMoreNotes(callback, context);
        } else {
          callback.call(context);
        }
      });
    },

    addMoreNotesButton: function() {
      var that = this;

      if(utility.findOffset(this.model.get('notes_html')) == null) return;

      if(this.moreNotesView) {
        this.moreNotesView.remove();
      }

      this.moreNotesView = new MoreButtonView({
        events: {
          'click': function() {
            this.$el.addClass('hide');
            utility.toggleVisiblity($loader);
            that.requestMoreNotes(addToCollection, that);
          }
        }
      });

      this.$el.append(this.moreNotesView.render().el);
    }
  });
});
