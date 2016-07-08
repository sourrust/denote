import _              from 'underscore';
import { View }       from 'backbone';
import utility        from '../utility';
import MoreButtonView from './morenotesbutton';
import ReblogView     from './reblog';
import ReplyView      from './reply';

let router;

const $loader = utility.$loader;
const $error  = utility.$error;

export default View.extend({
  el: '.notes',

  initialize(options) {
    _.bindAll(this, 'renderNote');

    this.collection.on('add', this.renderNote);

    router = options.router;

    $error.find('p').html(
      'The current tab doesn\'t have any notes with reblog comments or ' +
      'replies.'
    );

    this.render();
    this.requestMoreNotes();
  },

  render() {
    this.collection.each(this.renderNote);

    return this;
  },

  renderNote(model) {
    const isReply   = model.get('noteType') === 'reply';
    const NoteType  = isReply ? ReplyView : ReblogView;
    const className = model.get('classes').join(' ');

    const note = new NoteType({ model, className, router });

    this.$el.append(note.render().el);
  },

  show() {
    utility.swapClass(this.$el, 'hide', 'show');
  },

  hide() {
    utility.swapClass(this.$el, 'show', 'hide');
  },

  requestMoreNotes() {
    if(!this.collection.canFetchMore()) {
      utility.toggleVisiblity($loader);

      if(this.collection.isEmpty()) {
        utility.toggleVisiblity($error);
      }

      return;
    }

    const onSuccess = collection => {
      if(collection.canFetchMore()) {
        this.requestMoreNotes.call(this);
      } else {
        collection.count = 0;

        if(this.collection.isEmpty()) {
          utility.toggleVisiblity($error);
        }

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

  addMoreNotesButton() {
    if(!this.collection.canFetchMore()) return;

    const moreNotesView = new MoreButtonView({ parentView: this });

    this.$el.append(moreNotesView.render().el);
  }
});
