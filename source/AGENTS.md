# SOURCE DIRECTORY

All user-facing content lives here. Hexo reads this directory to generate the site.

## STRUCTURE
```
source/
├── _posts/        # Blog posts — the primary authoring target
├── about/
│   └── index.md  # About page (static page, not a post)
└── img/           # Static assets: avatar (conan-avatar.svg), logo (logo.svg)
```

## WHERE TO ADD THINGS
| What | Where | Notes |
|------|-------|-------|
| New blog post | `_posts/YYYY-MM-DD-slug.md` | slug must be English/ASCII |
| New static page | `about/`, `contact/`, etc. as `index.md` | use `page` scaffold |
| Images referenced in posts | `img/` | reference as `/img/filename.ext` |
| Draft (not published) | `_drafts/` (create if missing) | visible only with `npm run dev` |

## POST FILENAME CONVENTION
- Format: `YYYY-MM-DD-english-slug.md`
- Slug: lowercase, hyphens only, ASCII — no Chinese characters
- Example: `2026-03-15-deep-learning-notes.md`
- Hexo derives the permalink from the date + slug; wrong format breaks URLs

## FRONT MATTER (required fields)
```yaml
title: 中文标题或英文标题
date: 2026-03-15 10:00:00
categories:
  - 分类     # ONE category only
tags:
  - 标签A
  - 标签B
```

## ANTI-PATTERNS
- No Chinese in filename — breaks URL generation
- No multiple categories — single category per post only
- Don't put assets in `public/` — it's generated output, gitignored, ephemeral
- Don't create pages outside `source/` root — Hexo only renders from here
