import _        from 'underscore';
import { View } from 'backbone';
import utility  from '../utility';

let parentView;

const $loader         = utility.$loader;
const toggleVisiblity = utility.toggleVisiblity;

export default View.extend({
  tagName: 'li',
  className: 'note more-comments',

  events: {
    click: 'loadMoreNotes'
  },

  initialize(options) {
    _.bindAll(this, 'render');

    parentView = options.parentView;
  },

  render() {
    let html = 'More +';

    html += '<div class="clearfix"></div>';

    this.$el.html(html);

    return this;
  },

  loadMoreNotes() {
    this.$el.addClass('hide');
    toggleVisiblity($loader);
    parentView.requestMoreNotes();
    this.remove();
  }
});
