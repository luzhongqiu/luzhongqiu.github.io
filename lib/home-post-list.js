'use strict';

const { escapeHTML } = require('hexo-util');

function asArray(collection) {
  if (!collection) return [];
  if (Array.isArray(collection)) return collection;
  if (typeof collection.toArray === 'function') return collection.toArray();
  return Array.from(collection);
}

function escape(value) {
  return escapeHTML(String(value == null ? '' : value));
}

function isoDate(value) {
  if (!value) return '';
  try {
    return escape(value.toISOString());
  } catch (error) {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? '' : escape(parsed.toISOString());
  }
}

function renderPost(post, helpers) {
  const { formatDate, urlFor } = helpers;
  const categories = asArray(post.categories);
  const tags = asArray(post.tags);
  const href = escape(urlFor(post.link || post.path || ''));
  const date = post.date ? escape(formatDate(post.date)) : '';
  const dateTime = isoDate(post.date);
  const category = categories[0]
    ? `<a class="home-post-list__category link-muted" href="${escape(urlFor(categories[0].path))}"><i class="fas fa-folder-open" aria-hidden="true"></i><span>${escape(categories[0].name)}</span></a>`
    : '';
  const tagLinks = tags.map(tag =>
    `<a class="home-post-list__tag link-muted" rel="tag" href="${escape(urlFor(tag.path))}">#${escape(tag.name)}</a>`
  ).join('');
  const taxonomies = category || tagLinks
    ? `<div class="home-post-list__taxonomies">${category}${tagLinks}</div>`
    : '';
  const time = date
    ? `<time class="home-post-list__date"${dateTime ? ` datetime="${dateTime}"` : ''}>${date}</time>`
    : '';

  return `<li class="home-post-list__item"><div class="home-post-list__header"><h2 class="home-post-list__title"><a class="link-muted" href="${href}">${escape(post.title)}</a></h2>${time}</div>${taxonomies}</li>`;
}

function renderHomePostList(posts, helpers) {
  const items = asArray(posts).map(post => renderPost(post, helpers)).join('');
  return `<section class="card home-post-list" aria-label="文章列表"><ol class="home-post-list__items">${items}</ol></section>`;
}

function addHomeClass(html) {
  return html.replace(/<body class="([^"]*)">/, (match, classes) => {
    const classNames = classes.split(/\s+/).filter(Boolean);
    if (!classNames.includes('home-list-page')) classNames.unshift('home-list-page');
    return `<body class="${classNames.join(' ')}">`;
  });
}

function injectHomePostList(html, listHtml) {
  const mainColumn = /<div class="[^"]*\bcolumn-main\b[^"]*">/;
  const body = /<body class="[^"]*">/;
  if (!mainColumn.test(html) || !body.test(html)) {
    return { html, injected: false };
  }

  const withList = html.replace(mainColumn, match => `${match}${listHtml}`);
  return { html: addHomeClass(withList), injected: true };
}

module.exports = {
  injectHomePostList,
  renderHomePostList
};
