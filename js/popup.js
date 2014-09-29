'use strict';

var $        = require('jquery');
var Backbone = require('backbone');
var Router   = require('router');

$(function() {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {}, function(response) {
      var data, router;

      response = response || {};

      if(response.notes != null) {
        data = {
          post_url: response.url,
          notes_html: $('<ol>').html(response.notes)
        };

        router = new Router({ data: data });

        Backbone.history.start({ pushState: true });
      }
    });
  });
});
