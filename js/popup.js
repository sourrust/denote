import $        from 'jquery';
import Backbone from 'backbone';
import Router   from './router';

let tabInfo = {
  active: true,
  currentWindow: true
};

chrome.tabs.query(tabInfo, function([tab]) {
  chrome.tabs.sendMessage(tab.id, {}, function(response = {}) {
    let data, router;

    if(response.notes) {
      data = {
        post_url: response.url,
        notes_html: $('<ol>').html(response.notes)
      };

      router = new Router({ data });

      Backbone.history.start({ pushState: true });
    }
  });
});
