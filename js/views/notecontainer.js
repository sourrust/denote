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

  var $loader = $('#loader');

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
      this.requestMoreNotes();
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

    requestMoreNotes: function() {
      if(!this.collection.canFetchMore()) return;

      var that = this;

      this.collection.fetch({
        success: function(collection) {
          if(collection.canFetchMore()) {
            that.requestMoreNotes.call(that);
          } else {
            collection.count = 0;

            utility.toggleVisiblity($loader);
            that.addMoreNotesButton();
          }
        },
        remove: false
      });
    },

    addMoreNotesButton: function() {
      var that = this, noMoreNotes;

      noMoreNotes = !this.collection.canFetchMore();

      if(noMoreNotes) return;

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
