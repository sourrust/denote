define('views/notecontainer',

[ 'underscore'
, 'jquery'
, 'backbone'
, 'collections/notes'
, 'models/note'
, 'utility'
, 'views/morenotesbutton'
, 'views/note'
],

function
( _, $, Backbone
, Notes, NoteModel
, utility
, MoreButtonView
, NoteView
) {
  'use strict';

  var $loader = $('#loader');

  return Backbone.View.extend({
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
});
