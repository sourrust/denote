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

function slug(blogName, text) {
  let result = _.kebabCase(`${blogName} ${text}`);

  return _.truncate(result, {
    length: Math.pow(2, 6),
    omission: '',
    separator: '-'
  });
}

function noteToJSON(note) {
  let $note, blogInfo, classes, text;

  $note   = $(note);
  classes = getClasses($note);

  if(_.includes(classes, 'reply')) {
    text     = getPreviewText($note.find('.answer_content'));
    blogInfo = getBlogInfo($note.find('.action > a'),
                           $note.find('.avatar'));

    return {
      noteType: 'reply',
      text: text,
      classes: classes,
      blog: blogInfo,
      id: slug(blogInfo.username, text)
    };
  } else {
    text     = getPreviewText($note.find('blockquote > a'));
    blogInfo = getBlogInfo($note.find('.tumblelog'),
                           $note.find('.avatar'));


    return {
      noteType: 'reblog',
      previewText: text,
      permalink: getPermalink($note.find('.action')),
      classes: classes,
      blogs: [
        blogInfo,
        getBlogInfo($note.find('.source_tumblelog'))
      ],
      id: slug(blogInfo.username, text)
    };
  }
}

export let $loader         = $('#loader');
export let toggleVisiblity = $el => $el.toggleClass('show hide');
export let swapClass       = ($el, exchange, forClass) =>
  $el.addClass(forClass).removeClass(exchange);

export function notesToJSON(context) {
  let $notes = context.find('.with_commentary, .reply');

  return _.map($notes, noteToJSON);
}

export default { $loader, toggleVisiblity, swapClass, notesToJSON };
