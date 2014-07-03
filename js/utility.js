'use strict';

var _ = require('underscore'),
    $ = require('jquery');

function getAvatar($el) {
  return $el.attr('src');
}

function getBlogInfo($el, $avatarEl) {
  var info = {
    'username': $el.html(),
    'link': $el.attr('href'),
    'title': $el.attr('title')
  };

  if($avatarEl) {
    info.avatar = getAvatar($avatarEl);
  }

  return info;
}

function getPreviewText($el) {
  return $el.html().trim();
}

function getPermalink($el) {
  return $el.attr('data-post-url');
}

function getClasses($el) {
  return $el.attr('class').split(' ');
}

exports.toggleVisiblity = function($el) {
  return $el.toggleClass('show hide');
};

exports.swapClass = function($el, exchange, forClass) {
  $el.addClass(forClass);
  $el.removeClass(exchange);
};

exports.notesToJSON = function(context) {
  var $notes, value;

  $notes = context.find('.with_commentary, .reply');
  value  = [];

  _.each($notes, function(note) {
    var $note, classes;

    $note   = $(note);
    classes = getClasses($note);

    if(_.contains(classes, 'reply')) {
      value.push({
        'note_type': 'reply',
        'text': getPreviewText($note.find('.answer_content')),
        'classes': classes,
        'blog': getBlogInfo($note.find('.action > a'),
                            $note.find('.avatar'))
      });
    } else {
      value.push({
        'note_type': 'reblog',
        'preview_text': getPreviewText($note.find('blockquote > a')),
        'permalink': getPermalink($note.find('.action')),
        'classes': classes,
        'blogs': [
          getBlogInfo($note.find('.tumblelog'),
                      $note.find('.avatar')),
          getBlogInfo($note.find('.source_tumblelog'))
        ]
      });
    }
  });

  return value;
};
