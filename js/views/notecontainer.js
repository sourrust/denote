'use strict';

var _              = require('underscore'),
    $              = require('jquery'),
    Backbone       = require('backbone'),
    Notes          = require('collections/notes'),
    utility        = require('utility'),
    MoreButtonView = require('views/morenotesbutton'),
    NoteView       = require('views/note'),
    PostView       = require('views/post');

var $loader = $('#loader');

module.exports = Backbone.View.extend({
  el: '.notes',

  initialize: function() {
    _.bindAll(this);

    this.collection = new Notes();
    this.collection.storeInitialData(this.model);

    this.fullPostView = new PostView();

    this.collection.on({
      'add': this.renderNote,
      'change:is_preview': this.displayPostView
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

  displayPostView: function(model) {
    var $el = [ this.$el
              , this.fullPostView.$el
              ];

    if(model.get('is_preview')) {
      utility.swapClass($el[0], 'hide', 'show');
      utility.swapClass($el[1], 'show', 'hide');
    } else {
      this.fullPostView.model = model;
      this.fullPostView.render();

      utility.swapClass($el[0], 'show', 'hide');
      utility.swapClass($el[1], 'hide', 'show');
    }
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
      remove: false,
      dataType: 'html'
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
          that.requestMoreNotes();
        }
      }
    });

    this.$el.append(this.moreNotesView.render().el);
  }
});
