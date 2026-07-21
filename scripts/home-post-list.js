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
