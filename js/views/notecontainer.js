'use strict';

var _              = require('underscore'),
    $              = require('jquery'),
    Backbone       = require('backbone'),
    utility        = require('utility'),
    MoreButtonView = require('views/morenotesbutton'),
    ReblogView     = require('views/reblog'),
    ReplyView      = require('views/reply');

var router, $loader = $('#loader');

module.exports = Backbone.View.extend({
  el: '.notes',

  initialize: function(options) {
    _.bindAll(this);

    this.collection.on('add', this.renderNote);

    router = options.router;

    this.render();
    this.requestMoreNotes();
  },

  render: function() {
    this.collection.each(this.renderNote);

    return this;
  },

  renderNote: function(model) {
    var note, NoteType, isReply;

    isReply  = model.get('note_type') === 'reply';
    NoteType = isReply ? ReplyView : ReblogView;

    note = new NoteType({
      model: model,
      className: model.get('classes').join(' '),
      router: router
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
