'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { registerHomePostList } = require('../scripts/home-post-list');

function createHexoMock() {
  let filter;
  const warnings = [];
  const helpers = {
    date: function () { return '2026-07-21'; },
    url_for: function (path) { return `/blog/${path}`; }
  };
  const hexo = {
    config: { date_format: 'YYYY-MM-DD', language: 'zh-CN' },
    extend: {
      filter: { register: (name, callback) => { filter = { name, callback }; } },
      helper: { get: name => helpers[name] }
    },
    log: { warn: message => warnings.push(message) }
  };
  return { hexo, warnings, getFilter: () => filter };
}

test('registerHomePostList transforms index pages only', () => {
  const mock = createHexoMock();
  registerHomePostList(mock.hexo);
  const filter = mock.getFilter();
  const source = '<html><body class="is-2-column"><div class="column column-main"><div class="card">旧卡片</div></div></body></html>';
  const page = {
    __index: true,
    posts: [{ title: '文章标题', path: 'posts/example/', tags: [] }]
  };

  assert.equal(filter.name, 'after_render:html');
  assert.match(filter.callback(source, { config: mock.hexo.config, page }), /文章标题/);
  assert.equal(filter.callback(source, { config: mock.hexo.config, page: { posts: page.posts } }), source);
});

test('registerHomePostList warns and returns original HTML when the theme container is missing', () => {
  const mock = createHexoMock();
  registerHomePostList(mock.hexo);
  const source = '<html><body class="is-2-column"><main>内容</main></body></html>';
  const page = {
    __index: true,
    posts: [{ title: '文章标题', path: 'posts/example/' }]
  };

  assert.equal(mock.getFilter().callback(source, { config: mock.hexo.config, page }), source);
  assert.equal(mock.warnings.length, 1);
  assert.match(mock.warnings[0], /column-main/);
});
