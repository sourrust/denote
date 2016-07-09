import _ from 'underscore';
import $ from 'jquery';

const getAvatar      = $el => $el.attr('src');
const getPreviewText = $el => $el.html().trim();
const getPermalink   = $el => $el.attr('data-post-url');
const getClasses     = $el => $el.attr('class').split(' ');

function getBlogInfo($el, $avatarEl) {
  const info = {
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
  const result = _.kebabCase(`${blogName} ${text}`);

  return _.truncate(result, {
    length: Math.pow(2, 6),
    omission: '',
    separator: '-'
  });
}

function noteToJSON(note) {
  let blogInfo, text;

  const $note   = $(note);
  const classes = getClasses($note);

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
  }

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

export const $loader         = $('#loader');
export const $error          = $('#error-message');
export const toggleVisiblity = $el => $el.toggleClass('show hide');
export const swapClass       = ($el, exchange, forClass) =>
  $el.addClass(forClass).removeClass(exchange);

export function notesToJSON(context) {
  const $notes = context.find('.with_commentary, .reply');

  return _.map($notes, noteToJSON);
}

export default { $loader, $error, toggleVisiblity, swapClass, notesToJSON };
