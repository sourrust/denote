import _             from 'underscore';
import { View }      from 'backbone';
import replyTemplate from 'template/reply';

export default View.extend({
  tagName: 'li',

  template: replyTemplate,

  initialize: function() {
    _.bindAll(this, 'render');
  },

  render: function() {
    const html = this.template(this.model.toJSON());

    this.$el.html(html);

    return this;
  }
});
