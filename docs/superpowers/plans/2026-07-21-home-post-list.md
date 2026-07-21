# 主页文章紧凑列表 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 Hexo 主页及分页改成只显示标题、日期、分类和标签的紧凑文章列表，同时保持其他页面布局不变。

**Architecture:** 使用独立的纯函数模块生成安全的列表 HTML，并把列表插入 Icarus 的主页主内容容器；根目录 Hexo 脚本只负责把 helper 和渲染上下文适配给纯函数。自定义 CSS 通过首页专属 body class 隐藏原文章卡片并设置列表样式，因此无需修改 `themes/icarus/`。

**Tech Stack:** Hexo 8、Node.js CommonJS、Node.js 内置测试运行器、Icarus/Bulma、自定义 CSS

---

## 文件结构

- Create: `lib/home-post-list.js` — 集合归一化、HTML 转义、列表渲染和主页 HTML 注入纯函数。
- Create: `scripts/home-post-list.js` — 注册 Hexo `after_render:html` 过滤器，绑定 `url_for` 与 `date` helper，并在注入失败时记录警告。
- Create: `test/home-post-list.test.js` — 覆盖列表渲染、缺失元数据和 HTML 注入。
- Create: `test/home-post-list-script.test.js` — 使用 Hexo mock 覆盖主页过滤、非主页旁路和异常告警。
- Modify: `source/css/custom.css` — 增加首页列表布局、标签样式和移动端规则。
- Modify: `package.json` — 增加基于 Node.js 内置测试运行器的 `test` 命令。

### Task 1: 主页列表纯函数

**Files:**
- Create: `test/home-post-list.test.js`
- Create: `lib/home-post-list.js`
- Modify: `package.json`

- [ ] **Step 1: 增加测试命令并编写失败测试**

在 `package.json` 的 `scripts` 中加入：

```json
"test": "node --test test/*.test.js"
```

创建 `test/home-post-list.test.js`：

```js
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
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
```

- [ ] **Step 2: 运行测试并确认因模块缺失而失败**

Run: `npm test`

Expected: FAIL，错误包含 `Cannot find module '../lib/home-post-list'`。

- [ ] **Step 3: 实现最小纯函数模块**

创建 `lib/home-post-list.js`：

```js
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
```

- [ ] **Step 4: 运行单元测试并确认通过**

Run: `npm test`

Expected: 4 tests PASS，0 FAIL。

- [ ] **Step 5: 提交纯函数与测试**

```bash
git add package.json lib/home-post-list.js test/home-post-list.test.js
git commit -m "feat: add compact home post list renderer"
```

### Task 2: Hexo 首页过滤器适配

**Files:**
- Create: `test/home-post-list-script.test.js`
- Create: `scripts/home-post-list.js`

- [ ] **Step 1: 编写 Hexo 适配器失败测试**

创建 `test/home-post-list-script.test.js`：

```js
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
```

- [ ] **Step 2: 运行测试并确认因适配器缺失而失败**

Run: `npm test`

Expected: FAIL，错误包含 `Cannot find module '../scripts/home-post-list'`。

- [ ] **Step 3: 实现 Hexo 过滤器注册**

创建 `scripts/home-post-list.js`：

```js
'use strict';

const {
  injectHomePostList,
  renderHomePostList
} = require('../lib/home-post-list');

function registerHomePostList(hexoInstance) {
  const date = hexoInstance.extend.helper.get('date');
  const urlFor = hexoInstance.extend.helper.get('url_for');

  hexoInstance.extend.filter.register('after_render:html', (html, locals) => {
    const page = locals && locals.page;
    if (!page || !page.__index || !page.posts || page.posts.length === 0) return html;

    const helperContext = {
      config: locals.config || hexoInstance.config,
      page
    };
    const listHtml = renderHomePostList(page.posts, {
      formatDate: value => date.call(helperContext, value, 'YYYY-MM-DD'),
      urlFor: value => urlFor.call(helperContext, value)
    });
    const result = injectHomePostList(html, listHtml);
    if (!result.injected) {
      hexoInstance.log.warn('[home-post-list] Icarus main container .column-main was not found; homepage HTML was left unchanged.');
    }
    return result.html;
  });
}

if (typeof hexo !== 'undefined') registerHomePostList(hexo);

module.exports = { registerHomePostList };
```

- [ ] **Step 4: 运行全部测试并确认通过**

Run: `npm test`

Expected: 6 tests PASS，0 FAIL。

- [ ] **Step 5: 提交 Hexo 适配器**

```bash
git add scripts/home-post-list.js test/home-post-list-script.test.js
git commit -m "feat: register compact homepage renderer"
```

### Task 3: 主页列表样式与生成结果验证

**Files:**
- Modify: `source/css/custom.css`
- Verify: `public/index.html`
- Verify: `public/categories/index.html`
- Verify: one generated post page under `public/`

- [ ] **Step 1: 在自定义 CSS 中增加首页专属样式**

追加到 `source/css/custom.css`：

```css
/* =====================================================
   Compact post list — home pages only
   ===================================================== */

.home-list-page .column-main > .card:not(.home-post-list) {
  display: none;
}

.home-post-list {
  overflow: hidden;
}

.home-post-list__items {
  list-style: none;
  margin: 0;
  padding: 0;
}

.home-post-list__item {
  padding: 1.35rem 1.5rem;
}

.home-post-list__item + .home-post-list__item {
  border-top: 1px solid #f0f0f0;
}

.home-post-list__header {
  align-items: baseline;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}

.home-post-list__title {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.45;
  margin: 0;
}

.home-post-list__date {
  color: #7a7a7a;
  flex: 0 0 auto;
  font-size: 0.8rem;
}

.home-post-list__taxonomies {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-top: 0.65rem;
}

.home-post-list__category,
.home-post-list__tag {
  border-radius: 999px;
  display: inline-flex;
  font-size: 0.75rem;
  line-height: 1.5;
  padding: 0.2rem 0.65rem;
}

.home-post-list__category {
  align-items: center;
  background: #3273dc;
  color: #fff !important;
  gap: 0.35rem;
}

.home-post-list__tag {
  background: #f3f5f7;
  color: #4a4a4a;
}

.home-post-list__category:hover,
.home-post-list__tag:hover {
  filter: brightness(0.96);
}

@media screen and (max-width: 768px) {
  .home-post-list__item {
    padding: 1rem;
  }

  .home-post-list__header {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.35rem;
  }

  .home-post-list__title {
    font-size: 1.1rem;
  }
}
```

- [ ] **Step 2: 运行单元测试**

Run: `npm test`

Expected: 6 tests PASS，0 FAIL。

- [ ] **Step 3: 清理并重新生成站点**

Run: `npm run clean`

Expected: Hexo 报告缓存和 `public/` 已删除。

Run: `npm run build`

Expected: 命令退出码为 0，生成主页、分页、分类、标签和文章页面，无 `FATAL` 或渲染异常。

- [ ] **Step 4: 检查生成主页和非主页**

Run: `rg -n "home-list-page|home-post-list__item|home-post-list__category|home-post-list__tag" public/index.html`

Expected: 四种标识均在主页 HTML 中出现。

Run: `rg -n "home-list-page|home-post-list__item" public/categories/index.html`

Expected: 无匹配。

Run: `rg -n "home-list-page|home-post-list__item" public/2026/07/20/jepa-research-tracking/index.html`

Expected: 无匹配；文章详情仍包含原文章标题和正文。

Run: `rg -n "home-list-page|home-post-list__item" public/page/2/index.html`

Expected: 分页主页包含两种标识。

- [ ] **Step 5: 检查代码和工作区状态**

Run: `git diff --check`

Expected: 无输出，退出码为 0。

Run: `git status --short`

Expected: 只包含本任务修改，以及用户原有的未跟踪 `source/_drafts/`；草稿未被暂存。

- [ ] **Step 6: 提交样式**

```bash
git add source/css/custom.css
git commit -m "style: add compact homepage post list"
```

### Task 4: 最终回归验证

**Files:**
- Verify: `lib/home-post-list.js`
- Verify: `scripts/home-post-list.js`
- Verify: `source/css/custom.css`
- Verify: generated files under `public/`

- [ ] **Step 1: 重新运行全部测试与构建**

Run: `npm test`

Expected: 6 tests PASS，0 FAIL。

Run: `npm run build`

Expected: 命令退出码为 0，无 `FATAL` 或渲染异常。

- [ ] **Step 2: 检查最终提交与用户文件隔离**

Run: `git log -4 --oneline`

Expected: 包含设计文档、纯函数、Hexo 适配器和样式提交。

Run: `git status --short`

Expected: 仅保留用户原有的未跟踪 `source/_drafts/`；本任务文件均已提交。
