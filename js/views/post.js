import _            from 'underscore';
import { View }     from 'backbone';
import postTemplate from 'template/post';
import utility      from '../utility';

let router;

export default View.extend({
  el: '#post-container',

  template: postTemplate,

  events: {
    'click .back-to-notes': 'backToNotes',
    'click #response-button': 'toggleResponses'
  },

  initialize(options) {
    _.bindAll(this, 'render');

    router = options.router;
  },

  render() {
    const html = this.template(this.model.toJSON());

    this.$el.html(html);

    return this;
  },

  show() {
    utility.swapClass(this.$el, 'hide', 'show');
  },

  hide() {
    utility.swapClass(this.$el, 'show', 'hide');
  },

  backToNotes(event) {
    event.preventDefault();
    router.navigate('index', { trigger: true });
  },

  toggleResponses() {
    const $button    = this.$el.find('#response-button');
    const $responses = this.$el.find('ol.responses');
    const visiblity  = $responses.hasClass('hide') ? 'Hide' : 'Show';

    $button.html(`${visiblity} Previous Responses`);

    utility.toggleVisiblity($responses);
  }
});
