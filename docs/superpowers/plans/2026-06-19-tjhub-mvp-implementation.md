# TJHub MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Phase 1 TJHub static campus navigation site with Chinese-only public UI, Markdown/YAML content, validated content loading, search, guide routing, and Cloudflare Pages deployment files.

**Architecture:** Vue 3 + Vite renders a static-first site from normalized Markdown/YAML content loaded at build time with `import.meta.glob`. Zod validates frontmatter before rendering, and all pages consume shared content and collection renderers rather than hard-coded content arrays. `/admin` remains a noindex placeholder, while `/guides/:slug` renders internal guide content linked from navigation cards.

**Tech Stack:** Vue 3, Vite, TypeScript, Vue Router, Tailwind CSS v4 via `@tailwindcss/vite`, Zod, gray-matter, markdown-it, Vitest.

---

## File Structure

Create or modify these files:

- `package.json`: scripts and dependencies.
- `index.html`: Vite HTML entry with Chinese metadata.
- `vite.config.ts`: Vue and Tailwind Vite plugins.
- `tsconfig.json`, `tsconfig.node.json`: TypeScript settings.
- `src/main.ts`: Vue app bootstrap.
- `src/App.vue`: root shell.
- `src/style.css`: Tailwind import and base tokens.
- `src/router/index.ts`: required route table.
- `src/types/content.ts`: shared content types.
- `src/services/contentSchemas.ts`: Zod schemas.
- `src/services/content.ts`: Markdown loading, parsing, validation, filtering, and lookup.
- `src/services/search.ts`: local Chinese-friendly search.
- `src/components/layout/SiteHeader.vue`: Chinese navigation and global search.
- `src/components/layout/SiteFooter.vue`: disclaimer and site links.
- `src/components/layout/PageShell.vue`: shared page wrapper.
- `src/components/content/ContentRenderer.vue`: page renderer.
- `src/components/content/BlockRenderer.vue`: block switch.
- `src/components/content/HeroBlock.vue`: hero block.
- `src/components/content/BannerBlock.vue`: static banner block.
- `src/components/content/MarkdownBlock.vue`: rendered Markdown block.
- `src/components/content/CollectionPreviewBlock.vue`: curated collection block.
- `src/components/collections/CollectionCard.vue`: two-part external link card with guide action.
- `src/components/collections/CollectionList.vue`: list/grid renderer.
- `src/components/collections/CategoryFilter.vue`: category tabs.
- `src/components/collections/SearchInput.vue`: search input.
- `src/components/collections/SourceBadge.vue`: source label.
- `src/components/collections/StatusBadge.vue`: status label.
- `src/views/HomeView.vue`: homepage from `content/pages/home.md`.
- `src/views/NavView.vue`: full navigation page.
- `src/views/FreshmanView.vue`: freshman page from `content/pages/freshman.md`.
- `src/views/ProjectsView.vue`: projects page.
- `src/views/ContributeView.vue`: contribution page.
- `src/views/AboutView.vue`: about page.
- `src/views/AdminView.vue`: noindex admin placeholder.
- `src/views/GuideView.vue`: guide detail page.
- `src/views/NotFoundView.vue`: Chinese 404.
- `content/pages/*.md`: page content.
- `content/guides/*.md`: guide content.
- `content/collections/links/**/*.md`: launch link content.
- `content/collections/projects/*.md`: launch project content.
- `content/taxonomies/categories.yaml`: category labels.
- `public/_redirects`: Cloudflare Pages SPA fallback.
- `public/robots.txt`: crawler policy.
- `.github/ISSUE_TEMPLATE/*.yml`: contribution templates.
- `README.md`, `CONTRIBUTING.md`, `docs/content-guidelines.md`, `docs/deployment.md`: project documentation.
- `tests/contentSchemas.test.ts`, `tests/contentService.test.ts`, `tests/search.test.ts`: unit tests.

---

### Task 1: Scaffold Vue, Vite, Tailwind, Router, And Test Harness

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `src/main.ts`
- Create: `src/App.vue`
- Create: `src/style.css`

- [ ] **Step 1: Create package manifest**

Use this exact package shape:

```json
{
  "name": "tjhub",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "typecheck": "vue-tsc --noEmit"
  },
  "dependencies": {
    "@tailwindcss/vite": "latest",
    "gray-matter": "latest",
    "markdown-it": "latest",
    "tailwindcss": "latest",
    "vue": "latest",
    "vue-router": "latest",
    "zod": "latest"
  },
  "devDependencies": {
    "@types/markdown-it": "latest",
    "@vitejs/plugin-vue": "latest",
    "typescript": "latest",
    "vite": "latest",
    "vitest": "latest",
    "vue-tsc": "latest"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run:

```powershell
npm install
```

Expected: `node_modules` and `package-lock.json` are created.

- [ ] **Step 3: Add Vite and Tailwind configuration**

`vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts']
  }
})
```

`src/style.css`:

```css
@import "tailwindcss";

:root {
  color-scheme: light;
  font-family: Inter, "Noto Sans SC", "Microsoft YaHei", system-ui, sans-serif;
  background: #f7f8fb;
  color: #172033;
}

body {
  margin: 0;
  min-width: 320px;
}

a {
  color: inherit;
}
```

- [ ] **Step 4: Add root app shell**

`index.html`:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="TJHub 是面向同济学生的非官方校园信息入口。" />
    <title>TJHub · 同济校园信息入口</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

`src/main.ts`:

```ts
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import './style.css'

createApp(App).use(router).mount('#app')
```

`src/App.vue`:

```vue
<template>
  <RouterView />
</template>
```

- [ ] **Step 5: Add TypeScript configs**

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "jsx": "preserve",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["vitest/importMeta"]
  },
  "include": ["src/**/*.ts", "src/**/*.vue", "tests/**/*.ts"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

`tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 6: Run typecheck**

Run:

```powershell
npm run typecheck
```

Expected: fails only if `src/router` does not exist yet. If so, proceed to Task 5 before re-running.

- [ ] **Step 7: Commit**

```powershell
git add package.json package-lock.json index.html vite.config.ts tsconfig.json tsconfig.node.json src
git commit -m "chore: scaffold vue vite app"
```

---

### Task 2: Define Content Types And Zod Schemas

**Files:**
- Create: `src/types/content.ts`
- Create: `src/services/contentSchemas.ts`
- Create: `tests/contentSchemas.test.ts`

- [ ] **Step 1: Write schema tests first**

`tests/contentSchemas.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { linkSchema, pageSchema } from '../src/services/contentSchemas'

describe('content schemas', () => {
  it('accepts a public approved link with aliases and guideSlug', () => {
    const parsed = linkSchema.parse({
      type: 'link',
      title: '同济大学一网通办',
      slug: 'tongji-service-portal',
      url: 'https://example.com',
      description: '常用校园事务办理入口。',
      category: 'official',
      tags: ['官方', '办事'],
      aliases: ['一网通办', '网上办事大厅', 'service portal'],
      sourceKind: 'official',
      official: true,
      featured: true,
      placements: ['home'],
      audience: ['all'],
      priority: 100,
      status: 'active',
      visibility: 'public',
      reviewStatus: 'approved',
      contributors: ['cnyj'],
      lastCheckedAt: '2026-06-19',
      guideSlug: 'service-portal-guide'
    })

    expect(parsed.aliases).toContain('一网通办')
    expect(parsed.guideSlug).toBe('service-portal-guide')
  })

  it('rejects unknown enum values', () => {
    expect(() =>
      linkSchema.parse({
        type: 'link',
        title: '错误示例',
        slug: 'bad',
        url: 'https://example.com',
        description: '错误示例。',
        category: 'official',
        sourceKind: 'school',
        status: 'active',
        visibility: 'public',
        reviewStatus: 'approved'
      })
    ).toThrow()
  })

  it('accepts a page with block metadata', () => {
    const parsed = pageSchema.parse({
      type: 'page',
      title: 'TJHub',
      slug: 'home',
      visibility: 'public',
      reviewStatus: 'approved',
      blocks: [
        { type: 'hero', title: 'TJHub', description: '同济学生常用信息入口' },
        { type: 'banner', source: 'banners' },
        { type: 'collectionPreview', collection: 'links', placement: 'home', limit: 8 }
      ]
    })

    expect(parsed.blocks).toHaveLength(3)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npm run test -- tests/contentSchemas.test.ts
```

Expected: FAIL because `contentSchemas.ts` does not exist.

- [ ] **Step 3: Add shared content types**

`src/types/content.ts`:

```ts
export type ContentType = 'page' | 'guide' | 'link' | 'project'
export type SourceKind = 'official' | 'student' | 'third_party' | 'internal'
export type EntryStatus = 'active' | 'stale' | 'unavailable' | 'archived'
export type Visibility = 'public' | 'hidden' | 'draft'
export type ReviewStatus = 'draft' | 'pending' | 'approved' | 'rejected'

export interface BaseContent {
  type: ContentType
  title: string
  slug: string
  visibility: Visibility
  reviewStatus: ReviewStatus
  body: string
  html: string
}

export interface LinkEntry extends BaseContent {
  type: 'link'
  url: string
  description: string
  category: string
  tags: string[]
  aliases: string[]
  sourceKind: SourceKind
  official: boolean
  featured: boolean
  placements: string[]
  audience: string[]
  priority: number
  status: EntryStatus
  contributors: string[]
  createdAt?: string
  updatedAt?: string
  lastCheckedAt?: string
  guideSlug?: string
}

export interface ProjectEntry extends BaseContent {
  type: 'project'
  url: string
  description: string
  category: string
  tags: string[]
  aliases: string[]
  sourceKind: SourceKind
  featured: boolean
  placements: string[]
  audience: string[]
  priority: number
  status: EntryStatus
  maintainers: string[]
  contributors: string[]
  lastCheckedAt?: string
}

export interface PageBlock {
  type: string
  title?: string
  description?: string
  source?: string
  collection?: 'links' | 'projects'
  placement?: string
  limit?: number
}

export interface PageContent extends BaseContent {
  type: 'page' | 'guide'
  blocks: PageBlock[]
}

export interface ContentIndex {
  pages: PageContent[]
  guides: PageContent[]
  links: LinkEntry[]
  projects: ProjectEntry[]
}
```

- [ ] **Step 4: Add Zod schemas**

`src/services/contentSchemas.ts`:

```ts
import { z } from 'zod'

export const sourceKindSchema = z.enum(['official', 'student', 'third_party', 'internal'])
export const entryStatusSchema = z.enum(['active', 'stale', 'unavailable', 'archived'])
export const visibilitySchema = z.enum(['public', 'hidden', 'draft'])
export const reviewStatusSchema = z.enum(['draft', 'pending', 'approved', 'rejected'])

const pageBlockSchema = z.object({
  type: z.string().min(1),
  title: z.string().optional(),
  description: z.string().optional(),
  source: z.string().optional(),
  collection: z.enum(['links', 'projects']).optional(),
  placement: z.string().optional(),
  limit: z.number().int().positive().optional()
})

export const pageSchema = z.object({
  type: z.enum(['page', 'guide']),
  title: z.string().min(1),
  slug: z.string().min(1),
  visibility: visibilitySchema.default('public'),
  reviewStatus: reviewStatusSchema.default('approved'),
  blocks: z.array(pageBlockSchema).default([])
})

export const linkSchema = z.object({
  type: z.literal('link'),
  title: z.string().min(1),
  slug: z.string().min(1),
  url: z.string().url(),
  description: z.string().min(1),
  category: z.string().min(1),
  tags: z.array(z.string()).default([]),
  aliases: z.array(z.string()).default([]),
  sourceKind: sourceKindSchema,
  official: z.boolean().default(false),
  featured: z.boolean().default(false),
  placements: z.array(z.string()).default([]),
  audience: z.array(z.string()).default(['all']),
  priority: z.number().int().default(0),
  status: entryStatusSchema.default('active'),
  visibility: visibilitySchema.default('public'),
  reviewStatus: reviewStatusSchema.default('approved'),
  contributors: z.array(z.string()).default([]),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  lastCheckedAt: z.string().optional(),
  guideSlug: z.string().optional()
})

export const projectSchema = z.object({
  type: z.literal('project'),
  title: z.string().min(1),
  slug: z.string().min(1),
  url: z.string().url(),
  description: z.string().min(1),
  category: z.string().min(1),
  tags: z.array(z.string()).default([]),
  aliases: z.array(z.string()).default([]),
  sourceKind: sourceKindSchema.default('student'),
  featured: z.boolean().default(false),
  placements: z.array(z.string()).default([]),
  audience: z.array(z.string()).default(['all']),
  priority: z.number().int().default(0),
  status: entryStatusSchema.default('active'),
  visibility: visibilitySchema.default('public'),
  reviewStatus: reviewStatusSchema.default('approved'),
  maintainers: z.array(z.string()).default([]),
  contributors: z.array(z.string()).default([]),
  lastCheckedAt: z.string().optional()
})
```

- [ ] **Step 5: Run schema tests**

Run:

```powershell
npm run test -- tests/contentSchemas.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit**

```powershell
git add src/types/content.ts src/services/contentSchemas.ts tests/contentSchemas.test.ts
git commit -m "feat: add content schemas"
```

---

### Task 3: Implement Build-Time Markdown Loading

**Files:**
- Create: `src/services/content.ts`
- Create: `tests/contentService.test.ts`

- [ ] **Step 1: Write content service tests**

`tests/contentService.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { normalizeMarkdownContent, publicApproved } from '../src/services/content'

const linkMarkdown = `---
type: link
title: 同济大学一网通办
slug: service-portal
url: https://example.com
description: 常用校园事务办理入口。
category: official
tags: [官方, 办事]
aliases: [一网通办, 网上办事大厅]
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
guideSlug: service-portal-guide
---
正文说明。`

describe('content service', () => {
  it('normalizes Markdown into a public approved link', () => {
    const item = normalizeMarkdownContent('/content/collections/links/official/service-portal.md', linkMarkdown)

    expect(item.type).toBe('link')
    expect(item.title).toBe('同济大学一网通办')
    expect(item.body).toContain('正文说明')
    expect(item.html).toContain('正文说明')
  })

  it('filters only public approved content', () => {
    expect(publicApproved({ visibility: 'public', reviewStatus: 'approved' })).toBe(true)
    expect(publicApproved({ visibility: 'draft', reviewStatus: 'approved' })).toBe(false)
    expect(publicApproved({ visibility: 'public', reviewStatus: 'pending' })).toBe(false)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npm run test -- tests/contentService.test.ts
```

Expected: FAIL because `content.ts` does not exist.

- [ ] **Step 3: Implement content service**

`src/services/content.ts`:

```ts
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import type { BaseContent, ContentIndex, LinkEntry, PageContent, ProjectEntry } from '../types/content'
import { linkSchema, pageSchema, projectSchema } from './contentSchemas'

const markdown = new MarkdownIt({ html: false, linkify: true, typographer: true })

type VisibilityShape = Pick<BaseContent, 'visibility' | 'reviewStatus'>

export function publicApproved(item: VisibilityShape): boolean {
  return item.visibility === 'public' && item.reviewStatus === 'approved'
}

export function normalizeMarkdownContent(path: string, raw: string): PageContent | LinkEntry | ProjectEntry {
  const parsed = matter(raw)
  const body = parsed.content.trim()
  const html = markdown.render(body)
  const data = parsed.data

  if (data.type === 'link') {
    return { ...linkSchema.parse(data), body, html }
  }

  if (data.type === 'project') {
    return { ...projectSchema.parse(data), body, html }
  }

  if (data.type === 'page' || data.type === 'guide') {
    return { ...pageSchema.parse(data), body, html }
  }

  throw new Error(`Unsupported content type in ${path}`)
}

function loadRawMarkdown(): Array<{ path: string; raw: string }> {
  const modules = import.meta.glob('/content/**/*.md', {
    query: '?raw',
    import: 'default',
    eager: true
  }) as Record<string, string>

  return Object.entries(modules).map(([path, raw]) => ({ path, raw }))
}

export function loadContentIndex(): ContentIndex {
  const index: ContentIndex = { pages: [], guides: [], links: [], projects: [] }

  for (const entry of loadRawMarkdown()) {
    try {
      const item = normalizeMarkdownContent(entry.path, entry.raw)

      if (!publicApproved(item)) {
        continue
      }

      if (item.type === 'page') index.pages.push(item)
      if (item.type === 'guide') index.guides.push(item)
      if (item.type === 'link') index.links.push(item)
      if (item.type === 'project') index.projects.push(item)
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn(`[TJHub] Invalid content skipped: ${entry.path}`, error)
      }
    }
  }

  index.links.sort((a, b) => b.priority - a.priority)
  index.projects.sort((a, b) => b.priority - a.priority)
  return index
}

export const contentIndex = loadContentIndex()

export function findPage(slug: string): PageContent | undefined {
  return contentIndex.pages.find((page) => page.slug === slug)
}

export function findGuide(slug: string): PageContent | undefined {
  return contentIndex.guides.find((guide) => guide.slug === slug)
}
```

- [ ] **Step 4: Run content service tests**

Run:

```powershell
npm run test -- tests/contentService.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/services/content.ts tests/contentService.test.ts
git commit -m "feat: load markdown content"
```

---

### Task 4: Implement Search Including Chinese Aliases

**Files:**
- Create: `src/services/search.ts`
- Create: `tests/search.test.ts`

- [ ] **Step 1: Write search tests**

`tests/search.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import type { LinkEntry } from '../src/types/content'
import { searchLinks } from '../src/services/search'

const baseLink: LinkEntry = {
  type: 'link',
  title: '同济大学信息门户',
  slug: 'portal',
  url: 'https://example.com',
  description: '统一身份认证相关入口。',
  category: 'official',
  tags: ['官方'],
  aliases: ['统一认证', 'identity portal'],
  sourceKind: 'official',
  official: true,
  featured: true,
  placements: ['home'],
  audience: ['all'],
  priority: 10,
  status: 'active',
  visibility: 'public',
  reviewStatus: 'approved',
  contributors: [],
  body: '登录入口。',
  html: '<p>登录入口。</p>'
}

describe('searchLinks', () => {
  it('matches aliases', () => {
    expect(searchLinks([baseLink], '统一认证')).toHaveLength(1)
    expect(searchLinks([baseLink], 'identity')).toHaveLength(1)
  })

  it('matches description and tags', () => {
    expect(searchLinks([baseLink], '入口')).toHaveLength(1)
    expect(searchLinks([baseLink], '官方')).toHaveLength(1)
  })

  it('returns all links for empty query', () => {
    expect(searchLinks([baseLink], '')).toHaveLength(1)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npm run test -- tests/search.test.ts
```

Expected: FAIL because `search.ts` does not exist.

- [ ] **Step 3: Implement search**

`src/services/search.ts`:

```ts
import type { LinkEntry, ProjectEntry } from '../types/content'

type SearchableEntry = LinkEntry | ProjectEntry

function normalize(value: string): string {
  return value.trim().toLowerCase()
}

function haystack(entry: SearchableEntry): string {
  return [
    entry.title,
    entry.description,
    entry.category,
    ...entry.tags,
    ...entry.aliases,
    entry.body
  ]
    .join(' ')
    .toLowerCase()
}

export function searchEntries<T extends SearchableEntry>(entries: T[], query: string): T[] {
  const normalizedQuery = normalize(query)

  if (!normalizedQuery) {
    return entries
  }

  return entries.filter((entry) => haystack(entry).includes(normalizedQuery))
}

export function searchLinks(entries: LinkEntry[], query: string): LinkEntry[] {
  return searchEntries(entries, query)
}

export function searchProjects(entries: ProjectEntry[], query: string): ProjectEntry[] {
  return searchEntries(entries, query)
}
```

- [ ] **Step 4: Run search tests**

Run:

```powershell
npm run test -- tests/search.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/services/search.ts tests/search.test.ts
git commit -m "feat: add local content search"
```

---

### Task 5: Add Launch Content

**Files:**
- Create: `content/pages/home.md`
- Create: `content/pages/freshman.md`
- Create: `content/pages/about.md`
- Create: `content/pages/contribute.md`
- Create: `content/pages/admin.md`
- Create: `content/guides/service-portal-guide.md`
- Create: `content/guides/course-selection-guide.md`
- Create: `content/guides/campus-network-guide.md`
- Create: `content/collections/links/official/*.md`
- Create: `content/collections/links/tools/*.md`
- Create: `content/collections/links/learning/*.md`
- Create: `content/collections/links/life/*.md`
- Create: `content/collections/projects/*.md`
- Create: `content/taxonomies/categories.yaml`

- [ ] **Step 1: Create page content**

`content/pages/home.md`:

```md
---
type: page
title: TJHub
slug: home
visibility: public
reviewStatus: approved
blocks:
  - type: hero
    title: TJHub
    description: 同济学生常用信息入口
  - type: banner
    title: 新生常用入口整理中
    description: 从一网通办、教务系统到校园网服务，先把最常用的入口放在你面前。
  - type: collectionPreview
    title: 常用工具
    collection: links
    placement: home
    limit: 12
---

TJHub 是面向同济学生的非官方校园信息入口。
```

`content/pages/freshman.md`:

```md
---
type: page
title: 新生指南
slug: freshman
visibility: public
reviewStatus: approved
blocks:
  - type: hero
    title: 新生指南
    description: 面向新同学的校园入口、账号、网络、学习与生活信息索引。
  - type: markdown
---

## 入学初期建议先确认的事项

1. 完成统一身份认证相关账号检查。
2. 熟悉一网通办、教务系统、图书馆和校园网服务入口。
3. 保存校园地图、校历、校车和后勤服务入口。
```

`content/pages/about.md`:

```md
---
type: page
title: 关于 TJHub
slug: about
visibility: public
reviewStatus: approved
blocks:
  - type: hero
    title: 关于 TJHub
    description: 一个由学生自发维护的非官方校园信息导航项目。
  - type: markdown
---

TJHub 旨在整理同济学生常用的校园系统、学习资源、生活服务、学生项目与贡献入口。

TJHub 不代表同济大学官方立场。站内链接可能指向第三方网站，请自行判断信息准确性与安全性。
```

`content/pages/contribute.md`:

```md
---
type: page
title: 参与共建
slug: contribute
visibility: public
reviewStatus: approved
blocks:
  - type: hero
    title: 参与共建
    description: 提交新入口、反馈失效链接、补充指南或申请成为编辑者。
  - type: markdown
---

你可以通过 GitHub Issue 提交新链接、反馈失效入口、建议指南内容或申请参与维护。

所有内容都需要满足：与同济学生相关、来源清楚、不伪装官方、不收集不必要隐私、不推广灰产或侵权风险资源。
```

`content/pages/admin.md`:

```md
---
type: page
title: 后台管理
slug: admin
visibility: public
reviewStatus: approved
blocks:
  - type: hero
    title: 后台管理功能规划中
    description: 未来将为管理员和编辑者提供可视化内容维护能力。
  - type: markdown
---

第一阶段暂不开放登录、数据库和在线编辑器。维护者请通过 GitHub 修改内容文件并提交 Pull Request。
```

- [ ] **Step 2: Create guide content**

Create these exact guide files:

`content/guides/service-portal-guide.md`:

```md
---
type: guide
title: 一网通办使用指南
slug: service-portal-guide
visibility: public
reviewStatus: approved
blocks:
  - type: hero
    title: 一网通办使用指南
    description: 用于校园事务办理入口的基础说明。
  - type: markdown
---

一网通办通常用于办理校园事务。进入前请确认域名和登录页面，避免在非官方页面输入账号密码。
```

`content/guides/course-selection-guide.md`:

```md
---
type: guide
title: 选课系统使用提示
slug: course-selection-guide
visibility: public
reviewStatus: approved
blocks:
  - type: hero
    title: 选课系统使用提示
    description: 选课前后的常见入口说明。
  - type: markdown
---

选课相关入口请以学校官方通知为准。TJHub 只提供入口索引，不复制非公开选课数据。
```

`content/guides/campus-network-guide.md`:

```md
---
type: guide
title: 校园网服务指南
slug: campus-network-guide
visibility: public
reviewStatus: approved
blocks:
  - type: hero
    title: 校园网服务指南
    description: 校园网、VPN 与网络服务入口说明。
  - type: markdown
---

使用校园网服务时，请优先确认官方入口。涉及账号、密码和 VPN 的页面必须谨慎识别来源。
```

- [ ] **Step 3: Create launch link files**

Create at least these 33 link entries as individual Markdown files. Each file must contain the fields shown in the sample. The table gives the path, title, category, featured value, and guide value for each entry.

Sample file `content/collections/links/official/service-portal.md`:

```md
---
type: link
title: 同济大学一网通办
slug: service-portal
url: https://example.com/service-portal
description: 常用校园事务办理入口。
category: official
tags: [官方, 办事, 校园服务]
aliases: [一网通办, 网上办事大厅, service portal]
sourceKind: official
official: true
featured: true
placements: [home]
audience: [all]
priority: 100
status: active
visibility: public
reviewStatus: approved
contributors: [tjhub]
lastCheckedAt: 2026-06-19
guideSlug: service-portal-guide
---

同济学生常用校园事务办理入口。请以实际官方页面为准。
```

Required entries:

| Path | Title | Category | Featured | Guide |
| --- | --- | --- | --- | --- |
| `content/collections/links/official/service-portal.md` | 同济大学一网通办 | official | true | service-portal-guide |
| `content/collections/links/official/official-site.md` | 同济大学官网 | official | true | none |
| `content/collections/links/official/info-portal.md` | 信息门户 | official | true | none |
| `content/collections/links/official/auth.md` | 统一身份认证 | official | true | none |
| `content/collections/links/official/undergraduate-system.md` | 本科教务系统 | official | true | course-selection-guide |
| `content/collections/links/official/graduate-system.md` | 研究生教育管理系统 | official | false | none |
| `content/collections/links/official/library.md` | 图书馆 | official | true | none |
| `content/collections/links/official/mail.md` | 校园邮箱 | official | true | none |
| `content/collections/links/official/network-service.md` | 校园网服务 | official | true | campus-network-guide |
| `content/collections/links/official/calendar.md` | 校历 | official | true | none |
| `content/collections/links/official/map.md` | 校园地图 | official | true | none |
| `content/collections/links/official/card.md` | 校园卡服务 | official | true | none |
| `content/collections/links/official/logistics.md` | 后勤服务 | official | false | none |
| `content/collections/links/official/hospital.md` | 校医院 | official | false | none |
| `content/collections/links/official/security.md` | 保卫处服务 | official | false | none |
| `content/collections/links/tools/vpn.md` | VPN 服务 | tools | true | campus-network-guide |
| `content/collections/links/tools/software.md` | 常用软件下载 | tools | true | none |
| `content/collections/links/tools/cloud-disk.md` | 校园云盘 | tools | true | none |
| `content/collections/links/tools/print.md` | 打印服务 | tools | true | none |
| `content/collections/links/tools/repair.md` | 报修服务 | tools | true | none |
| `content/collections/links/tools/bus.md` | 校车查询 | tools | true | none |
| `content/collections/links/tools/express.md` | 快递信息 | tools | false | none |
| `content/collections/links/tools/sports.md` | 体育场馆服务 | tools | false | none |
| `content/collections/links/learning/course-selection.md` | 选课入口 | learning | true | course-selection-guide |
| `content/collections/links/learning/course-evaluation.md` | 课程评价入口 | learning | false | none |
| `content/collections/links/learning/textbook.md` | 教材与资料索引 | learning | false | none |
| `content/collections/links/learning/academic-search.md` | 学术搜索工具 | learning | false | none |
| `content/collections/links/learning/library-database.md` | 图书馆数据库 | learning | false | none |
| `content/collections/links/life/canteen.md` | 食堂信息 | life | true | none |
| `content/collections/links/life/dormitory.md` | 宿舍服务 | life | false | none |
| `content/collections/links/life/traffic.md` | 交通出行 | life | false | none |
| `content/collections/links/life/medical.md` | 医疗服务 | life | false | none |
| `content/collections/links/life/campus-life.md` | 校园生活服务 | life | false | none |

For entries without confirmed production URLs, use `https://example.com/<slug>` in Phase 1 seed data and mark the body text as "请在上线前替换为确认后的真实入口。". Before public launch, replace all `example.com` URLs.

- [ ] **Step 4: Create project files**

Create three project files:

`content/collections/projects/tjhub.md`:

```md
---
type: project
title: TJHub
slug: tjhub
url: https://tjhub.cc
description: 面向同济学生的非官方校园信息入口。
category: student-project
tags: [学生项目, 导航]
aliases: [同济导航, tjhub]
sourceKind: student
featured: true
placements: [home]
audience: [all]
priority: 100
status: active
visibility: public
reviewStatus: approved
maintainers: [tjhub]
contributors: [tjhub]
lastCheckedAt: 2026-06-19
---

TJHub 是学生自发维护的校园信息入口项目。
```

`content/collections/projects/example-tool.md`:

```md
---
type: project
title: 示例校园工具
slug: example-tool
url: https://example.com/example-tool
description: 一个用于占位的学生工具项目条目。
category: student-project
tags: [学生项目, 工具]
aliases: [校园工具示例]
sourceKind: student
featured: false
placements: []
audience: [all]
priority: 50
status: active
visibility: public
reviewStatus: approved
maintainers: [example]
contributors: [tjhub]
lastCheckedAt: 2026-06-19
---

这是第一阶段的示例项目条目。公开上线前，维护者应替换为确认后的真实学生项目。
```

`content/collections/projects/example-resource.md`:

```md
---
type: project
title: 示例资料整理项目
slug: example-resource
url: https://example.com/example-resource
description: 一个用于占位的资料整理项目条目。
category: student-project
tags: [学生项目, 资料]
aliases: [资料项目示例]
sourceKind: student
featured: false
placements: []
audience: [all]
priority: 40
status: active
visibility: public
reviewStatus: approved
maintainers: [example]
contributors: [tjhub]
lastCheckedAt: 2026-06-19
---

这是第一阶段的示例资料项目条目。公开上线前，维护者应替换为确认后的真实学生项目。
```

- [ ] **Step 5: Create category taxonomy**

`content/taxonomies/categories.yaml`:

```yaml
official:
  label: 官方网站
  description: 学校官方系统和服务入口
tools:
  label: 常用工具
  description: 多数同学都会用到的校园工具
learning:
  label: 学习选课
  description: 课程、选课、图书馆和学术资源入口
life:
  label: 校园生活
  description: 生活、交通、后勤和医疗相关入口
student-project:
  label: 学生项目
  description: 学生维护的项目和友链
```

- [ ] **Step 6: Run content tests**

Run:

```powershell
npm run test
```

Expected: PASS.

- [ ] **Step 7: Commit**

```powershell
git add content tests
git commit -m "feat: add launch content"
```

---

### Task 6: Add Router And Shared Layout

**Files:**
- Create: `src/router/index.ts`
- Create: `src/components/layout/SiteHeader.vue`
- Create: `src/components/layout/SiteFooter.vue`
- Create: `src/components/layout/PageShell.vue`
- Create: `src/views/NotFoundView.vue`

- [ ] **Step 1: Add router**

`src/router/index.ts`:

```ts
import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
    { path: '/nav', name: 'nav', component: () => import('../views/NavView.vue') },
    { path: '/freshman', name: 'freshman', component: () => import('../views/FreshmanView.vue') },
    { path: '/projects', name: 'projects', component: () => import('../views/ProjectsView.vue') },
    { path: '/contribute', name: 'contribute', component: () => import('../views/ContributeView.vue') },
    { path: '/about', name: 'about', component: () => import('../views/AboutView.vue') },
    { path: '/admin', name: 'admin', component: () => import('../views/AdminView.vue') },
    { path: '/guides/:slug', name: 'guide', component: () => import('../views/GuideView.vue') },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue') }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})
```

- [ ] **Step 2: Add Chinese header**

`src/components/layout/SiteHeader.vue` must contain only Chinese public labels:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const query = ref('')

function submitSearch() {
  const q = query.value.trim()
  router.push({ path: '/nav', query: q ? { q } : {} })
}
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
    <div class="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
      <RouterLink to="/" class="text-lg font-semibold text-slate-950">TJHub</RouterLink>
      <form class="hidden flex-1 md:block" @submit.prevent="submitSearch">
        <input
          v-model="query"
          class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          placeholder="搜索网站、工具、指南"
        />
      </form>
      <nav class="hidden items-center gap-4 text-sm text-slate-700 md:flex">
        <RouterLink to="/nav?category=official">官方网站</RouterLink>
        <RouterLink to="/nav?category=tools">常用工具</RouterLink>
        <RouterLink to="/freshman">新生指南</RouterLink>
        <RouterLink to="/projects">学生项目</RouterLink>
        <RouterLink to="/contribute">参与共建</RouterLink>
        <RouterLink to="/about">关于</RouterLink>
      </nav>
    </div>
  </header>
</template>
```

- [ ] **Step 3: Add footer and shell**

`src/components/layout/SiteFooter.vue`:

```vue
<template>
  <footer class="border-t border-slate-200 bg-white">
    <div class="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-600">
      <p>
        TJHub 是由学生自发维护的非官方校园信息导航项目，不代表同济大学官方立场。
        站内部分链接指向第三方网站，请自行判断信息准确性与安全性。
      </p>
      <div class="mt-4 flex flex-wrap gap-4">
        <RouterLink to="/contribute">提交反馈</RouterLink>
        <RouterLink to="/about">项目说明</RouterLink>
        <RouterLink to="/admin">后台入口</RouterLink>
      </div>
    </div>
  </footer>
</template>
```

`src/components/layout/PageShell.vue`:

```vue
<script setup lang="ts">
import SiteHeader from './SiteHeader.vue'
import SiteFooter from './SiteFooter.vue'
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-950">
    <SiteHeader />
    <main>
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
```

- [ ] **Step 4: Add 404 view**

`src/views/NotFoundView.vue`:

```vue
<script setup lang="ts">
import PageShell from '../components/layout/PageShell.vue'
</script>

<template>
  <PageShell>
    <section class="mx-auto max-w-3xl px-4 py-24">
      <h1 class="text-3xl font-semibold">页面不存在</h1>
      <p class="mt-4 text-slate-600">你访问的页面暂时没有内容，或链接已经变更。</p>
      <RouterLink class="mt-8 inline-flex rounded-md bg-slate-950 px-4 py-2 text-white" to="/">
        返回首页
      </RouterLink>
    </section>
  </PageShell>
</template>
```

- [ ] **Step 5: Run typecheck**

Run:

```powershell
npm run typecheck
```

Expected: FAIL until view files from later tasks exist. Continue to Task 7, then re-run.

- [ ] **Step 6: Commit**

```powershell
git add src/router src/components/layout src/views/NotFoundView.vue
git commit -m "feat: add routes and layout"
```

---

### Task 7: Build Content Renderer And Public Views

**Files:**
- Create: `src/components/content/*.vue`
- Create: `src/views/HomeView.vue`
- Create: `src/views/FreshmanView.vue`
- Create: `src/views/ContributeView.vue`
- Create: `src/views/AboutView.vue`
- Create: `src/views/AdminView.vue`
- Create: `src/views/GuideView.vue`

- [ ] **Step 1: Add content renderer components**

`src/components/content/MarkdownBlock.vue`:

```vue
<script setup lang="ts">
defineProps<{ html: string }>()
</script>

<template>
  <div class="prose prose-slate max-w-none" v-html="html" />
</template>
```

`src/components/content/HeroBlock.vue`:

```vue
<script setup lang="ts">
defineProps<{ title?: string; description?: string }>()
</script>

<template>
  <section class="mx-auto max-w-6xl px-4 py-12">
    <h1 class="text-4xl font-semibold tracking-normal text-slate-950">{{ title }}</h1>
    <p v-if="description" class="mt-4 max-w-2xl text-lg leading-8 text-slate-600">{{ description }}</p>
  </section>
</template>
```

`src/components/content/BannerBlock.vue`:

```vue
<script setup lang="ts">
defineProps<{ title?: string; description?: string }>()
</script>

<template>
  <section class="mx-auto max-w-6xl px-4">
    <div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 class="text-xl font-semibold text-slate-950">{{ title }}</h2>
      <p v-if="description" class="mt-2 text-slate-600">{{ description }}</p>
    </div>
  </section>
</template>
```

`src/components/content/BlockRenderer.vue`:

```vue
<script setup lang="ts">
import type { PageBlock } from '../../types/content'
import HeroBlock from './HeroBlock.vue'
import BannerBlock from './BannerBlock.vue'

defineProps<{ block: PageBlock }>()
</script>

<template>
  <HeroBlock v-if="block.type === 'hero'" :title="block.title" :description="block.description" />
  <BannerBlock v-else-if="block.type === 'banner'" :title="block.title" :description="block.description" />
</template>
```

`src/components/content/ContentRenderer.vue`:

```vue
<script setup lang="ts">
import type { PageContent } from '../../types/content'
import BlockRenderer from './BlockRenderer.vue'
import MarkdownBlock from './MarkdownBlock.vue'

defineProps<{ page: PageContent }>()
</script>

<template>
  <BlockRenderer v-for="(block, index) in page.blocks" :key="`${block.type}-${index}`" :block="block" />
  <section v-if="page.html" class="mx-auto max-w-4xl px-4 py-10">
    <MarkdownBlock :html="page.html" />
  </section>
</template>
```

- [ ] **Step 2: Add page views**

Each page view should load from `findPage`.

Example `src/views/AboutView.vue`:

```vue
<script setup lang="ts">
import PageShell from '../components/layout/PageShell.vue'
import ContentRenderer from '../components/content/ContentRenderer.vue'
import { findPage } from '../services/content'

const page = findPage('about')
</script>

<template>
  <PageShell>
    <ContentRenderer v-if="page" :page="page" />
    <section v-else class="mx-auto max-w-3xl px-4 py-24">关于页面暂不可用。</section>
  </PageShell>
</template>
```

Create matching files for `HomeView.vue`, `FreshmanView.vue`, `ContributeView.vue`, using slugs `home`, `freshman`, and `contribute`.

- [ ] **Step 3: Add guide view**

`src/views/GuideView.vue`:

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PageShell from '../components/layout/PageShell.vue'
import ContentRenderer from '../components/content/ContentRenderer.vue'
import { findGuide } from '../services/content'

const route = useRoute()
const guide = computed(() => findGuide(String(route.params.slug)))
</script>

<template>
  <PageShell>
    <ContentRenderer v-if="guide" :page="guide" />
    <section v-else class="mx-auto max-w-3xl px-4 py-24">
      <h1 class="text-3xl font-semibold">指南不存在</h1>
      <p class="mt-4 text-slate-600">这个指南暂时没有内容，或链接已经变更。</p>
    </section>
  </PageShell>
</template>
```

- [ ] **Step 4: Add admin noindex placeholder**

`src/views/AdminView.vue`:

```vue
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import PageShell from '../components/layout/PageShell.vue'
import ContentRenderer from '../components/content/ContentRenderer.vue'
import { findPage } from '../services/content'

const page = findPage('admin')
let meta: HTMLMetaElement | undefined

onMounted(() => {
  meta = document.createElement('meta')
  meta.name = 'robots'
  meta.content = 'noindex,nofollow'
  document.head.appendChild(meta)
})

onUnmounted(() => {
  meta?.remove()
})
</script>

<template>
  <PageShell>
    <ContentRenderer v-if="page" :page="page" />
  </PageShell>
</template>
```

- [ ] **Step 5: Run typecheck**

Run:

```powershell
npm run typecheck
```

Expected: FAIL until collection components and `NavView.vue`/`ProjectsView.vue` exist. Continue to Task 8.

- [ ] **Step 6: Commit**

```powershell
git add src/components/content src/views
git commit -m "feat: render content pages"
```

---

### Task 8: Build Navigation Collections, Cards, And Filters

**Files:**
- Create: `src/components/collections/*.vue`
- Create: `src/views/NavView.vue`
- Create: `src/views/ProjectsView.vue`

- [ ] **Step 1: Add badges and card**

`src/components/collections/SourceBadge.vue`:

```vue
<script setup lang="ts">
import type { SourceKind } from '../../types/content'

const labels: Record<SourceKind, string> = {
  official: '官方',
  student: '学生项目',
  third_party: '第三方',
  internal: '站内'
}

defineProps<{ kind: SourceKind }>()
</script>

<template>
  <span class="rounded border border-slate-200 px-2 py-0.5 text-xs text-slate-600">{{ labels[kind] }}</span>
</template>
```

`src/components/collections/StatusBadge.vue`:

```vue
<script setup lang="ts">
import type { EntryStatus } from '../../types/content'

const labels: Record<EntryStatus, string> = {
  active: '可用',
  stale: '待复核',
  unavailable: '不可用',
  archived: '已归档'
}

defineProps<{ status: EntryStatus }>()
</script>

<template>
  <span class="rounded border border-slate-200 px-2 py-0.5 text-xs text-slate-600">{{ labels[status] }}</span>
</template>
```

`src/components/collections/CollectionCard.vue`:

```vue
<script setup lang="ts">
import type { LinkEntry, ProjectEntry } from '../../types/content'
import SourceBadge from './SourceBadge.vue'
import StatusBadge from './StatusBadge.vue'

defineProps<{ entry: LinkEntry | ProjectEntry }>()
</script>

<template>
  <article class="flex h-full flex-col rounded-lg border border-slate-200 bg-white shadow-sm">
    <a class="flex-1 p-4 hover:bg-slate-50" :href="entry.url" target="_blank" rel="noreferrer">
      <div class="flex items-center gap-2">
        <h3 class="font-semibold text-slate-950">{{ entry.title }}</h3>
        <SourceBadge :kind="entry.sourceKind" />
        <StatusBadge :status="entry.status" />
      </div>
      <p class="mt-2 text-sm leading-6 text-slate-600">{{ entry.description }}</p>
    </a>
    <div class="border-t border-slate-200 p-3">
      <div v-if="'guideSlug' in entry && entry.guideSlug" class="grid grid-cols-2 gap-2">
        <a class="rounded-md bg-slate-950 px-3 py-2 text-center text-sm text-white" :href="entry.url" target="_blank" rel="noreferrer">打开</a>
        <RouterLink class="rounded-md border border-slate-300 px-3 py-2 text-center text-sm" :to="`/guides/${entry.guideSlug}`">指南</RouterLink>
      </div>
      <a v-else class="block rounded-md bg-slate-950 px-3 py-2 text-center text-sm text-white" :href="entry.url" target="_blank" rel="noreferrer">打开</a>
    </div>
  </article>
</template>
```

- [ ] **Step 2: Add list, filter, and search input**

`src/components/collections/CollectionList.vue`:

```vue
<script setup lang="ts">
import type { LinkEntry, ProjectEntry } from '../../types/content'
import CollectionCard from './CollectionCard.vue'

defineProps<{ entries: Array<LinkEntry | ProjectEntry> }>()
</script>

<template>
  <div v-if="entries.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <CollectionCard v-for="entry in entries" :key="entry.slug" :entry="entry" />
  </div>
  <div v-else class="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
    没有找到匹配的内容。
  </div>
</template>
```

`src/components/collections/CategoryFilter.vue`:

```vue
<script setup lang="ts">
defineProps<{ categories: string[]; modelValue: string }>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button class="rounded-md border px-3 py-2 text-sm" :class="modelValue === '' ? 'bg-slate-950 text-white' : 'bg-white'" @click="$emit('update:modelValue', '')">全部</button>
    <button
      v-for="category in categories"
      :key="category"
      class="rounded-md border px-3 py-2 text-sm"
      :class="modelValue === category ? 'bg-slate-950 text-white' : 'bg-white'"
      @click="$emit('update:modelValue', category)"
    >
      {{ category }}
    </button>
  </div>
</template>
```

`src/components/collections/SearchInput.vue`:

```vue
<script setup lang="ts">
defineProps<{ modelValue: string }>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <input
    class="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-950"
    :value="modelValue"
    placeholder="搜索网站、工具、指南"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
```

- [ ] **Step 3: Add full navigation view**

`src/views/NavView.vue`:

```vue
<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import PageShell from '../components/layout/PageShell.vue'
import SearchInput from '../components/collections/SearchInput.vue'
import CategoryFilter from '../components/collections/CategoryFilter.vue'
import CollectionList from '../components/collections/CollectionList.vue'
import { contentIndex } from '../services/content'
import { searchLinks } from '../services/search'

const route = useRoute()
const query = ref('')
const category = ref('')

watchEffect(() => {
  query.value = typeof route.query.q === 'string' ? route.query.q : ''
  category.value = typeof route.query.category === 'string' ? route.query.category : ''
})

const categories = computed(() => [...new Set(contentIndex.links.map((link) => link.category))])
const filtered = computed(() => {
  const searched = searchLinks(contentIndex.links, query.value)
  return category.value ? searched.filter((link) => link.category === category.value) : searched
})
</script>

<template>
  <PageShell>
    <section class="mx-auto max-w-6xl px-4 py-10">
      <h1 class="text-3xl font-semibold">网站导航</h1>
      <p class="mt-3 text-slate-600">搜索和筛选同济学生常用入口。</p>
      <div class="mt-8 space-y-4">
        <SearchInput v-model="query" />
        <CategoryFilter v-model="category" :categories="categories" />
        <p class="text-sm text-slate-500">共找到 {{ filtered.length }} 个入口。</p>
        <CollectionList :entries="filtered" />
      </div>
    </section>
  </PageShell>
</template>
```

- [ ] **Step 4: Add projects view**

`src/views/ProjectsView.vue`:

```vue
<script setup lang="ts">
import PageShell from '../components/layout/PageShell.vue'
import CollectionList from '../components/collections/CollectionList.vue'
import { contentIndex } from '../services/content'
</script>

<template>
  <PageShell>
    <section class="mx-auto max-w-6xl px-4 py-10">
      <h1 class="text-3xl font-semibold">学生项目</h1>
      <p class="mt-3 text-slate-600">这里展示学生维护的项目和友链，非官方项目会明确标注。</p>
      <div class="mt-8">
        <CollectionList :entries="contentIndex.projects" />
      </div>
    </section>
  </PageShell>
</template>
```

- [ ] **Step 5: Run typecheck and tests**

Run:

```powershell
npm run typecheck
npm run test
```

Expected: PASS.

- [ ] **Step 6: Commit**

```powershell
git add src/components/collections src/views
git commit -m "feat: add navigation collections"
```

---

### Task 9: Add Cloudflare Pages Files And Project Docs

**Files:**
- Create: `public/_redirects`
- Create: `public/robots.txt`
- Create: `.github/ISSUE_TEMPLATE/new-link.yml`
- Create: `.github/ISSUE_TEMPLATE/stale-link.yml`
- Create: `.github/ISSUE_TEMPLATE/guide-suggestion.yml`
- Create: `.github/ISSUE_TEMPLATE/student-project.yml`
- Create: `README.md`
- Create: `CONTRIBUTING.md`
- Create: `docs/content-guidelines.md`
- Create: `docs/deployment.md`

- [ ] **Step 1: Add Cloudflare static files**

`public/_redirects`:

```text
/* /index.html 200
```

`public/robots.txt`:

```text
User-agent: *
Disallow: /admin
Allow: /
Sitemap: https://tjhub.cc/sitemap.xml
```

- [ ] **Step 2: Add issue templates**

`new-link.yml` should collect Chinese fields:

```yaml
name: 新增网站或工具入口
description: 推荐一个适合 TJHub 收录的入口
title: "新增入口："
labels: ["content"]
body:
  - type: input
    id: name
    attributes:
      label: 名称
    validations:
      required: true
  - type: input
    id: url
    attributes:
      label: 链接
    validations:
      required: true
  - type: textarea
    id: purpose
    attributes:
      label: 用途说明
    validations:
      required: true
  - type: dropdown
    id: source
    attributes:
      label: 来源性质
      options:
        - 官方网站
        - 学生项目
        - 第三方工具
    validations:
      required: true
```

`stale-link.yml`:

```yaml
name: 失效链接反馈
description: 反馈 TJHub 中已经失效或信息错误的入口
title: "失效链接："
labels: ["content", "stale-link"]
body:
  - type: input
    id: page
    attributes:
      label: TJHub 页面或条目名称
    validations:
      required: true
  - type: input
    id: url
    attributes:
      label: 失效链接
    validations:
      required: true
  - type: textarea
    id: problem
    attributes:
      label: 问题说明
      description: 例如无法访问、跳转错误、内容过期、疑似风险页面。
    validations:
      required: true
```

`guide-suggestion.yml`:

```yaml
name: 指南内容建议
description: 建议新增或修改一篇站内指南
title: "指南建议："
labels: ["guide"]
body:
  - type: input
    id: topic
    attributes:
      label: 指南主题
    validations:
      required: true
  - type: textarea
    id: audience
    attributes:
      label: 适用对象
      description: 例如新生、本科生、研究生、留学生或所有同学。
    validations:
      required: true
  - type: textarea
    id: content
    attributes:
      label: 建议内容
    validations:
      required: true
```

`student-project.yml`:

```yaml
name: 学生项目或友链申请
description: 推荐一个学生项目、工具站或资料站
title: "学生项目："
labels: ["project"]
body:
  - type: input
    id: name
    attributes:
      label: 项目名称
    validations:
      required: true
  - type: input
    id: url
    attributes:
      label: 项目链接
    validations:
      required: true
  - type: input
    id: maintainers
    attributes:
      label: 维护者
      description: 可填写组织、昵称或项目主页中公开展示的维护者信息。
    validations:
      required: false
  - type: textarea
    id: description
    attributes:
      label: 项目说明
    validations:
      required: true
  - type: textarea
    id: risk
    attributes:
      label: 隐私、登录或版权风险说明
      description: 如无相关风险，请填写“无”。
    validations:
      required: true
```

- [ ] **Step 3: Add README**

`README.md` must include these sections in Chinese:

```md
# TJHub

TJHub 是一个面向同济学生的非官方校园信息入口，旨在整理常用校园系统、学习资源、学生项目与生活服务链接。

访问地址：

https://tjhub.cc

## 技术栈

- Vue 3
- Vite
- TypeScript
- Tailwind CSS
- Markdown + YAML frontmatter
- Cloudflare Pages

## 本地运行

```powershell
npm install
npm run dev
```

## 免责声明

TJHub 是由学生自发维护的非官方校园信息导航项目，不代表同济大学官方立场。站内部分链接指向第三方网站，请自行判断信息准确性与安全性。如发现失效、错误或不适合展示的内容，欢迎提交反馈。
```

- [ ] **Step 4: Add contribution and deployment docs**

`CONTRIBUTING.md` must explain issue submission, PR content edits, review rules, and editor expectations in Chinese.

`docs/content-guidelines.md` must define `sourceKind`, `status`, `visibility`, `reviewStatus`, `aliases`, `guideSlug`, `placements`, and `audience` in Chinese.

`docs/deployment.md` must state:

```md
# 部署说明

Cloudflare Pages 构建设置：

- Framework preset: Vite
- Build command: npm run build
- Output directory: dist
- Node version: 20 或 22

`public/_redirects` 提供 Vue Router history 模式下的 SPA fallback。

正式域名使用 `tjhub.cc`，`www.tjhub.cc` 通过 Cloudflare Redirect Rules 301 跳转到主域名。
```

- [ ] **Step 5: Build**

Run:

```powershell
npm run build
```

Expected: PASS and `dist` is generated.

- [ ] **Step 6: Commit**

```powershell
git add public .github README.md CONTRIBUTING.md docs/content-guidelines.md docs/deployment.md
git commit -m "docs: add contribution and deployment docs"
```

---

### Task 10: Final Verification

**Files:**
- Modify only files needed to fix verification failures.

- [ ] **Step 1: Run full verification**

Run:

```powershell
npm run typecheck
npm run test
npm run build
```

Expected: all commands PASS.

- [ ] **Step 2: Start dev server**

Run:

```powershell
npm run dev
```

Expected: Vite prints a local URL such as `http://localhost:5173/`.

- [ ] **Step 3: Browser verification**

Open the local URL and verify:

- `/` shows Chinese UI, header search, static banner, curated common tools.
- `/nav` searches aliases such as `一网通办`, `vpn`, `图书馆`, and `统一认证`.
- `/guides/service-portal-guide` renders the guide.
- Cards with `guideSlug` show `打开` and `指南`.
- Cards without `guideSlug` show only `打开`.
- `/admin` shows the placeholder and injects `noindex,nofollow`.
- No public UI label appears in English except brand names, URLs, and content-owned proper nouns such as `TJHub`, `VPN`, or `Canvas`.
- Mobile viewport keeps search and navigation usable without text overlap.

- [ ] **Step 4: Fix any failures**

For each failure, edit the smallest responsible file, then rerun:

```powershell
npm run typecheck
npm run test
npm run build
```

Expected: PASS after each fix.

- [ ] **Step 5: Final commit**

```powershell
git status --short
git add .
git commit -m "feat: ship tjhub mvp"
```

Expected: final working tree is clean except ignored files such as `node_modules` and `dist`.

---

## Self-Review

Spec coverage:

- Required routes are covered in Task 6 and Task 7.
- Markdown/YAML loading, `import.meta.glob`, Markdown rendering, and Zod validation are covered in Task 2 and Task 3.
- Chinese-only frontend interface is covered in Task 6, Task 8, Task 9, and final verification.
- Search aliases are covered in Task 2, Task 4, and Task 5.
- Homepage curated banner and common tools are covered in Task 5 and Task 7.
- Two-part navigation card behavior with guide action is covered in Task 8.
- `/admin` noindex and robots policy are covered in Task 7 and Task 9.
- MVP launch content minimum is covered in Task 5.
- Cloudflare Pages SPA fallback is covered in Task 9.
- GitHub contribution docs and issue templates are covered in Task 9.

Placeholder scan:

- No unresolved placeholder markers are intentionally present.
- Seed entries using `example.com` are explicitly marked as pre-launch seed data and must be replaced before public launch.

Type consistency:

- Content fields match `src/types/content.ts`, Zod schemas, search service, and card components.
- Route names and paths match the design spec.

## References Consulted

- Tailwind CSS Vite installation: https://tailwindcss.com/docs/installation/using-vite
- Cloudflare Pages redirects: https://developers.cloudflare.com/pages/configuration/redirects/
