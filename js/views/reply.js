import _             from 'underscore';
import { View }      from 'backbone';
import replyTemplate from 'template/reply';

export default View.extend({
  tagName: 'li',

  template: replyTemplate,

  initialize() {
    _.bindAll(this, 'render');
  },

  render() {
    const html = this.template(this.model.toJSON());

    this.$el.html(html);

    return this;
  }
});
