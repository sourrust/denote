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

  initialize: function(options) {
    _.bindAll(this, 'render');

    router = options.router;
  },

  render: function() {
    let html = this.template(this.model.toJSON());

    this.$el.html(html);

    return this;
  },

  show: function() {
    utility.swapClass(this.$el, 'hide', 'show');
  },

  hide: function() {
    utility.swapClass(this.$el, 'show', 'hide');
  },

  backToNotes: function(event) {
    event.preventDefault();
    router.navigate('index', { trigger: true });
  },

  toggleResponses: function() {
    let $button, $responses, visiblity;

    $button    = this.$el.find('#response-button');
    $responses = this.$el.find('ol.responses');
    visiblity  = $responses.hasClass('hide') ? 'Hide' : 'Show';

    $button.html(visiblity + ' Previous Responses');

    utility.toggleVisiblity($responses);
  }
});
