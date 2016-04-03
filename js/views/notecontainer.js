import _              from 'underscore';
import { View }       from 'backbone';
import utility        from '../utility';
import MoreButtonView from './morenotesbutton';
import ReblogView     from './reblog';
import ReplyView      from './reply';

let router, $loader = utility.$loader;

export default View.extend({
  el: '.notes',

  initialize: function(options) {
    _.bindAll(this, 'renderNote');

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
    let className, note, NoteType, isReply;

    isReply   = model.get('noteType') === 'reply';
    NoteType  = isReply ? ReplyView : ReblogView;
    className = model.get('classes').join(' ');

    note = new NoteType({ model, className, router });

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

    let onSucess = collection => {
      if(collection.canFetchMore()) {
        this.requestMoreNotes.call(this);
      } else {
        collection.count = 0;

        utility.toggleVisiblity($loader);
        this.addMoreNotesButton();
      }
    };

    this.collection.fetch({
      success: onSucess,
      remove: false,
      dataType: 'html'
    });
  },

  addMoreNotesButton: function() {
    if(!this.collection.canFetchMore()) return;

    let moreNotesView = new MoreButtonView({ parentView: this });

    this.$el.append(moreNotesView.render().el);
  }
});
