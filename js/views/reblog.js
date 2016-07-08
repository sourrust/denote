import _              from 'underscore';
import { View }       from 'backbone';
import reblogTemplate from 'template/reblog';

let router;

export default View.extend({
  tagName: 'li',

  template: reblogTemplate,

  events: {
    'click .preview-link': 'showFullPreview'
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

  showFullPreview(event) {
    event.preventDefault();

    const model = this.model;
    const route = () => router.navigate(`post/${model.id}`,
                                        { trigger: true });

    if(_.isEmpty(model.get('full_text'))) {
      model.fetch({ success: route });
    } else {
      route();
    }
  }
});
