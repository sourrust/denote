import _ from 'underscore';
import $ from 'jquery';

let getAvatar      = $el => $el.attr('src');
let getPreviewText = $el => $el.html().trim();
let getPermalink   = $el => $el.attr('data-post-url');
let getClasses     = $el => $el.attr('class').split(' ');

function getBlogInfo($el, $avatarEl) {
  let info = {
    username: $el.html(),
    link: $el.attr('href'),
    title: $el.attr('title')
  };

  if($avatarEl) {
    info.avatar = getAvatar($avatarEl);
  }

  return info;
}

function noteToJSON(note) {
  let $note, classes;

  $note   = $(note);
  classes = getClasses($note);

  if(_.contains(classes, 'reply')) {
    return {
      noteType: 'reply',
      text: getPreviewText($note.find('.answer_content')),
      classes: classes,
      blog: getBlogInfo($note.find('.action > a'),
                          $note.find('.avatar'))
    };
  } else {
    return {
      noteType: 'reblog',
      previewText: getPreviewText($note.find('blockquote > a')),
      permalink: getPermalink($note.find('.action')),
      classes: classes,
      blogs: [
        getBlogInfo($note.find('.tumblelog'),
                    $note.find('.avatar')),
        getBlogInfo($note.find('.source_tumblelog'))
      ]
    };
  }
}

export let toggleVisiblity = $el => $el.toggleClass('show hide');
export let swapClass       = ($el, exchange, forClass) =>
  $el.addClass(forClass).removeClass(exchange);

export function notesToJSON(context) {
  let $notes = context.find('.with_commentary, .reply');

  return _.map($notes, noteToJSON);
}

export default { toggleVisiblity, swapClass, notesToJSON };
