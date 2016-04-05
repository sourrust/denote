import _        from 'underscore';
import { View } from 'backbone';
import utility  from '../utility';

let parentView;

let $loader         = utility.$loader;
let toggleVisiblity = utility.toggleVisiblity;

export default View.extend({
  tagName: 'li',
  className: 'note more-comments',

  events: {
    'click': 'loadMoreNotes'
  },

  initialize: function(options) {
    _.bindAll(this, 'render');

    parentView = options.parentView;
  },

  render: function() {
    let html = 'More +';

    html += '<div class="clearfix"></div>';

    this.$el.html(html);

    return this;
  },

  loadMoreNotes: function() {
    this.$el.addClass('hide');
    toggleVisiblity($loader);
    parentView.requestMoreNotes();
    this.remove();
  }
});
