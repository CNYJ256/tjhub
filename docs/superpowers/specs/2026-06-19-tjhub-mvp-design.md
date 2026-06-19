# TJHub MVP Design

Date: 2026-06-19

## Goal

TJHub is a non-official campus information entrance for Tongji students, published at `tjhub.cc`.

Phase 1 should ship a lightweight, trustworthy, static-first campus navigation site. It should help users quickly find common campus websites, tools, freshman guidance, student projects, and contribution instructions. It should not become a heavy community platform, course review system, crawler, or login-based CMS in the first release.

## Confirmed Decisions

- Product name: `TJHub`.
- Domain: `tjhub.cc`.
- Frontend stack: Vue 3, Vite, TypeScript, Tailwind CSS.
- Deployment target: Cloudflare Pages.
- DNS and redirects: Cloudflare DNS and redirect rules.
- Phase 1 content source: Markdown body plus YAML frontmatter.
- Long-term editor model: Admin/editor rich text editor stores structured block JSON, uploads images to R2, and publishes static Markdown plus YAML output.
- Admin route in Phase 1: reserved entrance only. No login, database, real editor, or submission API yet.
- Public rendering model: shared content renderer and shared collection renderer.
- MVP scope: standard MVP with freshman guide included as a first-class page or section.

## Phase 1 Pages

### `/`

Homepage. It is an administrator-curated entry page, not the full navigation library.

Structure:

- Top navigation bar with logo, global search, and primary nav items.
- Configurable carousel banner.
- Curated common tools selected by administrators.
- Lightweight pointers to freshman guide, student projects, contribution, and about pages.
- Footer with GitHub, contribution, disclaimer, and contact or feedback links.

Homepage cards should be selected by content metadata such as `featured: true`, `placements: [home]`, `audience: [all]`, and `priority`.

### `/nav`

Full navigation page.

Features:

- Keyword search.
- Category filtering.
- Result count.
- Link cards grouped or filtered by category.
- Source and status badges.
- Empty state.

Categories should include at least official websites, common tools, study/course-related entries, campus life, freshman guide entries, and student projects or project links.

### `/freshman`

Freshman guide page. This page is included in Phase 1, but the initial content can be small.

It should use the same content renderer as other pages and may link to relevant navigation entries. It should not require a separate custom page framework.

### `/projects`

Student projects and friendly links page.

It should clearly mark each entry's source type, maintenance status, maintainers or contributors when known, and external link.

### `/contribute`

Contribution instructions page.

It should explain how to submit a new link, report a stale link, suggest a guide, apply to become an editor, and follow content rules.

### `/about`

Project description page.

It should explain that TJHub is a student-maintained non-official campus navigation project, describe the maintenance model, show a roadmap, and include the disclaimer.

### `/admin`

Reserved admin entrance.

Phase 1 behavior:

- Show that admin/editor features are planned.
- Link maintainers to GitHub contribution and maintenance docs.
- Do not implement authentication, D1, R2 uploads, or real editing.

The code should still keep a clear admin boundary through route, layout, and view files so future Workers + D1 admin work can attach cleanly.

## Navigation Bar

Desktop nav:

- TJHub logo or wordmark.
- Global search input.
- Official websites.
- Common tools.
- Freshman guide.
- Student projects.
- Contribute.
- About.

Search behavior:

- Keyword input should match title, description, tags, category, and guide title when available.
- Pressing Enter from the top nav should route to `/nav?q=<keyword>`.
- On pages that can filter local collections, local live filtering is allowed but should not replace `/nav` as the canonical search result page.

Mobile nav:

- Keep TJHub brand visible.
- Provide a compact search entry.
- Collapse navigation into a menu.

## Homepage Banner

The homepage uses a configurable carousel banner.

Banner content should be data-driven. It can promote:

- Freshman season guidance.
- Important campus entry points.
- Featured guides.
- TJHub contribution callouts.
- Project announcements.

The banner should support:

- Title.
- Description.
- Image or simple visual background.
- Primary link.
- Optional secondary link.
- Visibility and ordering metadata.

Phase 1 can use local images or static assets. Long term, editor-uploaded banner images should live in Cloudflare R2.

## Navigation Card Interaction

Each website card has two visual areas.

Top area:

- Website name.
- Short description.
- Clicking the top area opens the target website in a new browser tab.

Bottom area:

- If the link has a guide:
  - Left action: open target website in a new tab.
  - Right action: open the internal guide page.
- If the link has no guide:
  - Single open action.

Card metadata should include source type and status badges so users can distinguish official websites, student projects, and third-party tools.

## Content Architecture

TJHub uses a hybrid content model.

Page content:

- Used by homepage, freshman guide, about, contribute, admin placeholder, and future guide pages.
- Modeled as page frontmatter plus Markdown body and optional section/block metadata.

Collection content:

- Used by links, projects, and future resources.
- Modeled as one Markdown file per content item.
- YAML frontmatter stores searchable and filterable metadata.
- Markdown body stores optional long description or guide text.

Recommended directory structure:

```text
content/
  pages/
    home.md
    freshman.md
    about.md
    contribute.md
    admin.md
  guides/
    *.md
  collections/
    links/
      official/
      learning/
      life/
      tools/
    projects/
  taxonomies/
    categories.yaml
    tags.yaml
  assets/
```

## Link Schema

Example:

```yaml
---
type: link
title: 同济大学一网通办
slug: tongji-service-portal
url: https://example.com
description: 常用校园事务办理入口。
category: official
tags: [官方, 办事, 校园服务]
sourceKind: official
official: true
featured: true
placements: [home]
audience: [all]
priority: 100
status: active
visibility: public
reviewStatus: approved
contributors: [cnyj]
createdAt: 2026-06-19
updatedAt: 2026-06-19
lastCheckedAt: 2026-06-19
guideSlug: service-portal-guide
---

可选补充说明。
```

Core fields:

- `type`: `link`, `project`, `page`, `guide`, or future types.
- `title`: display name.
- `slug`: stable content identifier.
- `url`: external target when applicable.
- `description`: short summary for cards and search.
- `category`: primary category.
- `tags`: searchable labels.
- `sourceKind`: `official`, `student`, `third_party`, or `internal`.
- `official`: boolean shortcut for official entries.
- `featured`: whether it can appear in curated areas.
- `placements`: page placements such as `home`.
- `audience`: `all`, `freshman`, `undergraduate`, `graduate`, `international`, or future audience tags.
- `priority`: sort weight.
- `status`: `active`, `stale`, `unavailable`, or `archived`.
- `visibility`: `public`, `hidden`, or `draft`.
- `reviewStatus`: `draft`, `pending`, `approved`, or `rejected`.
- `contributors`: content contributors.
- `lastCheckedAt`: last manual or automated link check date.
- `guideSlug`: optional internal guide link.

Only content with `visibility: public` and `reviewStatus: approved` should be rendered publicly.

## Project Schema

Project entries reuse most link fields and add maintainers when known.

```yaml
---
type: project
title: Example Student Project
slug: example-student-project
url: https://example.com
description: 一个学生维护的校园工具。
category: student-project
tags: [学生项目, 工具]
sourceKind: student
featured: false
placements: []
audience: [all]
priority: 50
status: active
visibility: public
reviewStatus: approved
maintainers: [example]
contributors: [cnyj]
lastCheckedAt: 2026-06-19
---

项目介绍正文。
```

## Page And Block Model

Public pages should use a shared renderer.

Renderer structure:

```text
ContentRenderer
  SectionRenderer
    BlockRenderer
      HeroBlock
      MarkdownBlock
      CollectionPreviewBlock
      CollectionListBlock
      SearchBlock
      NoticeBlock
      CtaBlock
      BannerCarouselBlock
```

Phase 1 block types:

- `hero`
- `markdown`
- `bannerCarousel`
- `collectionPreview`
- `collectionList`
- `search`
- `notice`
- `cta`

Avoid adding many block types before the admin/editor exists. New block types should be added only when they serve a real page requirement.

## Frontend Structure

Recommended source structure:

```text
src/
  components/
    layout/
      SiteHeader.vue
      SiteFooter.vue
      PageShell.vue
    content/
      ContentRenderer.vue
      SectionRenderer.vue
      BlockRenderer.vue
      MarkdownBlock.vue
      HeroBlock.vue
      BannerCarouselBlock.vue
      NoticeBlock.vue
      CtaBlock.vue
    collections/
      CollectionList.vue
      CollectionCard.vue
      CategoryFilter.vue
      TagFilter.vue
      SearchInput.vue
      SourceBadge.vue
      StatusBadge.vue
    admin/
      AdminShell.vue
      AdminPlaceholder.vue
  content/
    loadContent.ts
    normalizeContent.ts
  router/
    index.ts
  services/
    search.ts
    content.ts
  types/
    content.ts
```

Content loading should be isolated behind `src/services/content` or equivalent helpers so future API-backed data can replace static file loading without rewriting Vue components.

## Search And Filtering

Phase 1 search is local and static.

It should search:

- Title.
- Description.
- Tags.
- Category label.
- Markdown excerpt.
- Guide title when available.

Filtering:

- Category filtering is required.
- Tag display is required.
- Complex multi-tag filtering is optional.

Sorting:

- `priority` descending.
- Featured items can be promoted in selected contexts.
- Stale or unavailable entries should be demoted or visually marked.

## Cloudflare Deployment

Phase 1 uses Cloudflare Pages.

Build settings:

```text
Framework preset: Vite
Build command: npm run build
Output directory: dist
Node version: 20 or 22
```

Routing:

- Use Vue Router history mode.
- Configure Cloudflare Pages SPA fallback:

```text
/* /index.html 200
```

DNS:

- `tjhub.cc` is the canonical host.
- `www.tjhub.cc` should redirect permanently to `tjhub.cc`.

Suggested redirect:

```text
https://www.tjhub.cc/* -> https://tjhub.cc/$1
```

## Future Cloudflare Architecture

Future admin/editor platform:

```text
Admin editor
  -> Workers + Hono API
  -> D1 structured records
  -> R2 uploaded images and files
  -> Publish job
  -> Markdown + YAML static output
  -> Cloudflare Pages build/render
```

Workers + Hono may later own:

- `/api/admin/*`
- `/api/content/*`
- `/api/upload/*`
- `/api/publish`

D1 may later store:

- users
- roles
- content_pages
- content_blocks
- links
- projects
- review_records
- publish_jobs

R2 may later store:

- banner images
- guide images
- screenshots
- attachments

KV may later store:

- lightweight configuration
- homepage cache
- publish version metadata

Do not implement these in Phase 1 unless a later plan explicitly expands scope.

## Contribution Workflow

Phase 1 accepts contributions through GitHub.

Contributor paths:

- New link request.
- Stale link report.
- Guide or content suggestion.
- Student project or friendly link application.

Editor paths:

- Pull request editing Markdown + YAML files.
- Review content against the content guidelines.
- Confirm source type and disclaimer requirements.

Issue templates should collect:

- Name.
- URL.
- Purpose.
- Audience.
- Source type: official, student project, or third-party tool.
- Privacy or login risk.
- Optional submitter contact.

## Review Rules

TJHub should not become an advertisement wall or low-quality link farm.

Content should be accepted only when it:

- Is clearly relevant to Tongji students.
- Has a clear source.
- Has a reachable link.
- Does not pretend to be official when it is not.
- Does not collect unnecessary personal information.
- Does not promote scams, gray-market services, illegal content, or copyright-risk resources.
- Labels non-official projects clearly.
- Provides risk notices for sensitive third-party links when needed.

## Required Documents

Phase 1 should include:

- `README.md`
- `CONTRIBUTING.md`
- `docs/content-guidelines.md`
- `docs/deployment.md`
- Optional `CODE_OF_CONDUCT.md`

README should include:

- Project introduction.
- Online URL.
- Non-official positioning.
- Tech stack.
- Local development.
- Content structure.
- Contribution workflow.
- Review rules.
- Deployment notes.
- Roadmap.
- Disclaimer.
- License.

## Disclaimer And Privacy

Use the disclaimer in the footer, about page, and README:

```text
TJHub 是由学生自发维护的非官方校园信息导航项目，不代表同济大学官方立场。站内部分链接指向第三方网站，请自行判断信息准确性与安全性。如发现失效、错误或不适合展示的内容，欢迎提交反馈。
```

Phase 1 privacy statement:

```text
TJHub 第一阶段不提供用户登录，也不主动收集个人身份信息。若通过 GitHub Issue 或外部平台提交内容，相关信息将受对应平台规则约束。
```

Robots policy:

```text
User-agent: *
Disallow: /admin
Allow: /
Sitemap: https://tjhub.cc/sitemap.xml
```

## Non-Goals

Phase 1 must not include:

- Login system.
- Real admin/editor backend.
- D1 database.
- User submission API.
- Course review community.
- Crawling non-public data.
- Bypassing anti-crawler systems.
- Copying third-party course review data without permission.
- Any design that makes TJHub look like an official Tongji University platform.

## Open Implementation Notes

- The repository is currently not a git repository at the time this design was written.
- If Git is initialized later, this spec should be committed before implementation planning starts.
- The first implementation plan should scaffold the Vue/Vite/Tailwind app, content loader, renderer boundaries, route structure, and initial sample content.
