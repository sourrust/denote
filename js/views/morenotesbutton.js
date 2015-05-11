import _                   from 'underscore';
import $                   from 'jquery';
import { View }            from 'backbone';
import { toggleVisiblity } from '../utility';

var _        = require('underscore');
var $        = require('jquery');
var Backbone = require('backbone');
var utility  = require('utility');

var parentView, $loader = $('#loader');

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
    var html = 'More +';

    html += '<div class="clearfix"></div>';

    this.$el.html(html);

    return this;
  },

  loadMoreNotes: function() {
    this.$el.addClass('hide');
    utility.toggleVisiblity($loader);
    parentView.requestMoreNotes();
    this.remove();
  }
});
