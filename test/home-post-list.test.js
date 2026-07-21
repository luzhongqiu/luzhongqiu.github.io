'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const {
  injectHomePostList,
  renderHomePostList
} = require('../lib/home-post-list');

const helpers = {
  formatDate: () => '2026-07-21',
  urlFor: path => `/root/${path}`
};

test('renderHomePostList renders one safe, linked row per post', () => {
  const html = renderHomePostList([
    {
      title: 'JEPA <追踪>',
      path: 'posts/jepa/',
      date: new Date('2026-07-21T08:00:00+08:00'),
      content: '<h1>不应进入列表</h1>',
      categories: [
        { name: 'AI & ML', path: 'categories/ai/' },
        { name: '忽略的第二分类', path: 'categories/ignored/' }
      ],
      tags: [
        { name: 'JEPA', path: 'tags/jepa/' },
        { name: '视觉', path: 'tags/vision/' }
      ]
    }
  ], helpers);

  assert.match(html, /class="card home-post-list"/);
  assert.match(html, /href="&#x2F;root&#x2F;posts&#x2F;jepa&#x2F;"/);
  assert.match(html, /JEPA &lt;追踪&gt;/);
  assert.match(html, /AI &amp; ML/);
  assert.match(html, /#JEPA/);
  assert.match(html, /#视觉/);
  assert.match(html, /2026-07-21/);
  assert.doesNotMatch(html, /不应进入列表/);
  assert.doesNotMatch(html, /忽略的第二分类/);
});

test('renderHomePostList omits missing date and taxonomies', () => {
  const html = renderHomePostList([
    { title: '只有标题', path: 'posts/title-only/' }
  ], helpers);

  assert.match(html, /只有标题/);
  assert.doesNotMatch(html, /<time/);
  assert.doesNotMatch(html, /home-post-list__taxonomies/);
});

test('injectHomePostList marks the homepage and inserts before original cards', () => {
  const source = '<html><body class="is-2-column"><div class="column order-2 column-main"><div class="card">旧卡片</div><nav class="pagination">分页</nav></div></body></html>';
  const result = injectHomePostList(source, '<section class="card home-post-list">新列表</section>');

  assert.equal(result.injected, true);
  assert.match(result.html, /<body class="home-list-page is-2-column">/);
  assert.ok(result.html.indexOf('新列表') < result.html.indexOf('旧卡片'));
  assert.match(result.html, /pagination/);
});

test('injectHomePostList leaves unknown layouts unchanged', () => {
  const source = '<html><body class="is-2-column"><main>内容</main></body></html>';
  assert.deepEqual(injectHomePostList(source, '<section>列表</section>'), {
    html: source,
    injected: false
  });
});

test('homepage card hiding requires the compact list to be present', () => {
  const css = readFileSync(join(__dirname, '../source/css/custom.css'), 'utf8');

  assert.match(
    css,
    /\.home-list-page \.column-main > \.home-post-list ~ \.card\s*\{\s*display: none;\s*\}/
  );
  assert.doesNotMatch(
    css,
    /\.home-list-page \.column-main > \.card:not\(\.home-post-list\)/
  );
});
