'use strict';

var _ = require('underscore'),
    $ = require('jquery');

var getAvatar, getBlogInfo, getClasses, getPermalink, getPreviewText;

getAvatar = function($el) {
  return $el.attr('src');
};

getBlogInfo = function($el, $avatarEl) {
  var info = {
    'username': $el.html(),
    'link': $el.attr('href'),
    'title': $el.attr('title')
  };

  if($avatarEl) {
    info.avatar = getAvatar($avatarEl);
  }

  return info;
};

getPreviewText = function($el) {
  return $el.html().trim();
};

getPermalink = function($el) {
  return $el.attr('data-post-url');
};

getClasses = function($el) {
  return $el.attr('class').split(' ');
};

exports.toggleVisiblity = function($el) {
  return $el.toggleClass('show hide');
};

exports.swapClass = function($el, exchange, forClass) {
  $el.addClass(forClass);
  $el.removeClass(exchange);
};

exports.notesToJSON = function(context) {
  var $notes, value;

  $notes = context.find('.with_commentary');
  value  = [];

  if(!_.isEmpty($notes)) {
    _.each($notes, function(note) {
      var $note = $(note);
      value.push({
        'preview_text': getPreviewText($note.find('blockquote > a')),
        'permalink': getPermalink($note.find('.action')),
        'classes': getClasses($note),
        'blogs': [
          getBlogInfo($note.find('.tumblelog'),
                      $note.find('.avatar')),
          getBlogInfo($note.find('.source_tumblelog'))
        ]
      });
    });
  }

  return value;
};
