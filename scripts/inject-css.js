/**
 * Inject custom.css into every page's <head>
 * Hexo injector API: https://hexo.io/api/injector
 */
hexo.extend.injector.register(
  'head_end',
  '<link rel="stylesheet" href="/css/custom.css">',
  'default'
);
