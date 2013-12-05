define('utility', ['underscore','jquery'],

function(_, $) {
  'use strict';

  var getAvatar, getBlogInfo, getClasses, getPermalink, getPreviewText
    , utility;

  utility = {};

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

  utility.toggleVisiblity = function($el) {
    return $el.toggleClass('show hide');
  };

  utility.swapClass = function($el, exchange, forClass) {
    $el.addClass(forClass);
    $el.removeClass(exchange);
  };

  utility.notesToJSON = function(context) {
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

  return utility;
});
