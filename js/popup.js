import $        from 'jquery';
import Backbone from 'backbone';
import Router   from './router';
import utility  from './utility';

let tabInfo = {
  active: true,
  currentWindow: true
};

chrome.tabs.query(tabInfo, function([tab]) {
  chrome.tabs.sendMessage(tab.id, {}, function(response = {}) {
    let data, router;

    if(response.notes) {
      data = {
        postURL: response.url,
        notesHTML: $('<ol>').html(response.notes)
      };

      router = new Router({ data });

      Backbone.history.start({ pushState: true });
    } else {
      utility.$error.find('p').html(
        'The current tab isn\'t a tumblr page or denote is unable to ' +
        'find the notes in this page.'
      );

      utility.toggleVisiblity(utility.$loader);
      utility.toggleVisiblity(utility.$error);
    }
  });
});
