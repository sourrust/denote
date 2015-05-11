import $        from 'jquery';
import Backbone from 'backbone';
import Router   from './router';

var tabInfo = {
  active: true,
  currentWindow: true
};

chrome.tabs.query(tabInfo, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {}, function(response) {
    var data, router;

    response = response || {};

    if(response.notes) {
      data = {
        post_url: response.url,
        notes_html: $('<ol>').html(response.notes)
      };

      router = new Router({ data: data });

      Backbone.history.start({ pushState: true });
    }
  });
});
