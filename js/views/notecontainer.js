import _              from 'underscore';
import $              from 'jquery';
import { View }       from 'backbone';
import utility        from '../utility';
import MoreButtonView from './morenotesbutton';
import ReblogView     from './reblog';
import ReplyView      from './reply';


var router, $loader = $('#loader');

export default View.extend({
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

  show: function() {
    utility.swapClass(this.$el, 'hide', 'show');
  },

  hide: function() {
    utility.swapClass(this.$el, 'show', 'hide');
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
    if(!this.collection.canFetchMore()) return;

    var moreNotesView = new MoreButtonView({ parentView: this });

    this.$el.append(moreNotesView.render().el);
  }
});
