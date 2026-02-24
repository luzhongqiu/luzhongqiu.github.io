# PROJECT KNOWLEDGE BASE

**Generated:** 2026-02-24
**Branch:** blog → deploys to master (GitHub Pages)

## OVERVIEW
Personal Chinese-language tech blog by Lu Zhongqiu. Built with **Hexo 8.x** + **Icarus theme**, deployed via GitHub Actions to GitHub Pages at https://luzhongqiu.github.io.

## STRUCTURE
```
.
├── _config.yml            # Hexo site config (permalink, plugins, theme)
├── _config.icarus.yml     # Icarus theme config (sidebar, widgets, plugins)
├── source/                # All content (posts, pages, assets)
│   ├── _posts/            # Blog posts (YYYY-MM-DD-slug.md)
│   ├── about/index.md     # About page
│   └── img/               # Site images (avatar, logo)
├── scaffolds/             # Hexo new-post templates
├── themes/icarus/         # Active theme (treat as dependency, avoid editing)
├── themes/landscape/      # Unused theme (legacy)
├── themes/maupassant/     # Unused theme (legacy)
├── .github/workflows/
│   └── pages.yml          # CI: push blog branch → build → deploy to master
├── deploy.sh              # Manual deploy shortcut (hexo clean + generate + deploy)
└── package.json           # npm scripts entry point
```

## WHERE TO LOOK
| Task | Location |
|------|----------|
| Add a new post | `source/_posts/YYYY-MM-DD-slug.md` |
| Edit about page | `source/about/index.md` |
| Change site title/URL/permalink | `_config.yml` |
| Change sidebar / widgets / theme appearance | `_config.icarus.yml` |
| Add/change nav links | `_config.icarus.yml` → `navbar.menu` |
| Change avatar/logo | `source/img/` + `_config.icarus.yml` |
| CI/CD pipeline | `.github/workflows/pages.yml` |
| Post/page scaffold templates | `scaffolds/` |

## POST FORMAT
**Filename**: `source/_posts/YYYY-MM-DD-english-slug.md`

**Required front matter**:
```markdown
---
title: 文章标题
date: 2026-03-01 10:00:00
categories:
  - 分类名
tags:
  - 标签1
  - 标签2
---
```
- `categories`: single value only (one category per post)
- `tags`: multiple values OK
- `date`: format `YYYY-MM-DD HH:mm:ss`

## BRANCH WORKFLOW
- **`blog`** branch = source content (push here to publish)
- **`master`** branch = built static files (managed by GitHub Actions, never edit directly)
- GitHub Actions: push to `blog` → `npm run build` → deploys `public/` to `master`

## COMMANDS
```bash
npm install && npm install --prefix themes/icarus  # First-time setup
npm run server     # Local dev at http://localhost:4000
npm run dev        # Same but includes drafts (source/_drafts/)
npm run build      # Generate static files to public/
npm run clean      # Remove public/ cache
npm run deploy     # Build + push to GitHub Pages (manual)
./deploy.sh        # Alias for deploy
```

## ANTI-PATTERNS
- **Never push to `master` directly** — it's the built output, managed by CI only
- **Never edit `themes/icarus/` files** — it's an npm dependency; use `_config.icarus.yml` for all theme customization
- **Don't skip the date prefix** in post filenames — Hexo uses it for permalink generation
- **Don't add multiple categories** — convention is single category per post
- `public/` is gitignored and ephemeral — never store assets there

## NOTES
- Icarus theme dep is installed separately: `npm install --prefix themes/icarus` (CI does this explicitly)
- `_config.icarus.yml` overrides theme defaults — all Icarus-level config lives here, not in `themes/icarus/_config.yml`
- Three themes exist in `themes/` but only `icarus` is active; `landscape`/`maupassant` are unused vestiges
- KaTeX/MathJax disabled; enable in `_config.icarus.yml` → `plugins` if needed for math posts
- Search uses `insight` plugin (client-side); generates `search.xml` at build
