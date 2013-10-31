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

  utility.findOffset = function(context) {
    var $moreNotes, offset;

    $moreNotes = $('.more_notes_link', context);

    if(!$moreNotes.length) return;

    offset     = $moreNotes.attr('onclick').match(/\?from_c=\d+/)[0];

    return offset;
  };

  utility.notesToJSON = function(context) {
    var $notes, value;

    // $notes = $('.reblog', context);
    $notes = $('.with_commentary', context);
    value  = [];

    if(!_.isEmpty($notes)) {
      _.each($notes, function($note) {
        value.push({
          'preview_text': getPreviewText($('blockquote > a', $note)),
          'permalink': getPermalink($('.action', $note)),
          'classes': getClasses($($note)),
          'blogs': [
            getBlogInfo($('.tumblelog', $note), $('.avatar', $note)),
            getBlogInfo($('.source_tumblelog', $note))
          ]
        });
      });
    }

    return value;
  };

  return utility;
});
