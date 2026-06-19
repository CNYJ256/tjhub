# TJHub Phase 2 Workers, D1, and Admin Design

Date: 2026-06-19

## Goal

Phase 2 turns TJHub from a static-first campus navigation site into a content-managed site backed by Cloudflare Pages Functions, D1, and R2.

The public site should read live approved content from D1 at runtime while keeping the existing Markdown/YAML content as a fallback. The admin area should let non-technical editors create and maintain links, guides, projects, pages, homepage blocks, banners, categories, and media without using GitHub or editing code.

All public and admin user-facing interface text must be Simplified Chinese.

## Confirmed Decisions

- Architecture approach: gradual dynamic content layer.
- Public content source: Workers/Pages Functions API backed by D1.
- Fallback source: current `content/**/*.md` Markdown/YAML files.
- Admin authentication: Cloudflare Access.
- TJHub authorization: D1 roles.
- Admin scope: complete content backend for links, guides, projects, pages, homepage blocks, banners, categories, and media.
- Editor model: structured block editor, not a freeform page builder.
- Media storage: Cloudflare R2.
- Review workflow: editors submit for review, administrators approve and publish.
- Deployment topology: Cloudflare Pages plus Pages Functions in the same project.
- Content versioning: every save creates a version; public API reads the latest published approved version.
- Public API output: normalized JSON close to the existing frontend content model.

## Non-Goals

Phase 2 should not include:

- Site-owned username/password login.
- Public user submission forms.
- Comments, likes, feeds, or social features.
- Course review community features.
- Crawlers or scraping non-public data.
- Freeform canvas-style page building.
- Real-time collaborative editing.
- Advanced image editing or cropping.
- External full-text search infrastructure.
- Making TJHub appear official.

## Architecture

TJHub remains a Cloudflare Pages project hosting the Vue/Vite frontend. Pages Functions are added to the same project for API routes.

Public content loading order:

1. The frontend requests `/api/public/content` or a narrower public API endpoint.
2. The API reads the latest published approved content from D1.
3. The API returns normalized JSON shaped close to current `NormalizedPage`, `LinkEntry`, `ProjectEntry`, `Guide`, category, and banner data.
4. The frontend validates the payload.
5. If the API succeeds and validates, the frontend renders D1 content.
6. If the API fails, times out, returns non-2xx, returns empty content, or fails schema validation, the frontend falls back to the current build-time Markdown/YAML content.

Admin routes:

- `/admin` is the Vue admin application.
- `/api/admin/*` is the admin API.
- Cloudflare Access protects `/admin` and `/api/admin/*`.
- TJHub reads the Cloudflare Access identity and maps it to a D1 user role.

Media:

- Images, banners, guide illustrations, and attachments are stored in R2.
- D1 stores file metadata and references.
- Content payloads refer to media by `mediaId` or a normalized URL.

## Data Model

The D1 model is based on stable content entities plus immutable content versions.

### `users`

Stores admin/editor users recognized through Cloudflare Access.

Fields:

- `id`
- `email`
- `name`
- `role`: `admin` or `editor`
- `status`: `active`, `disabled`
- `created_at`
- `last_seen_at`

Cloudflare Access decides whether a person can enter the admin area. D1 roles decide which TJHub actions they can perform.

### `content_items`

Stores stable content identity.

Fields:

- `id`
- `type`: `page`, `guide`, `link`, `project`, `category`, `banner`
- `slug`
- `current_version_id`
- `published_version_id`
- `created_by`
- `updated_by`
- `created_at`
- `updated_at`
- `archived_at`

The `slug` must be stable and unique per type.

### `content_versions`

Stores each saved version. Existing versions are not overwritten.

Fields:

- `id`
- `item_id`
- `version_number`
- `status`: `draft`, `pending`, `approved`, `rejected`, `archived`
- `title`
- `description`
- `payload_json`
- `created_by`
- `created_at`
- `submitted_at`
- `reviewed_by`
- `reviewed_at`
- `review_note`

`payload_json` contains content shaped close to the current frontmatter and renderer model. Examples:

- Link fields such as `url`, `category`, `tags`, `aliases`, `sourceKind`, `status`, `featured`, `placements`, `audience`, `priority`, and `guideSlug`.
- Page and guide fields such as `blocks` and Markdown body.
- Project fields such as `url`, `maintainers`, and metadata.
- Category and banner fields.

Public APIs only expose versions that are both:

- `status = approved`
- referenced by `content_items.published_version_id`

### `media_assets`

Stores R2 file metadata.

Fields:

- `id`
- `r2_key`
- `filename`
- `mime_type`
- `size_bytes`
- `width`
- `height`
- `alt_text`
- `uploaded_by`
- `created_at`
- `usage_count`

Binary data never goes into D1.

### `review_events`

Stores review history.

Fields:

- `id`
- `item_id`
- `version_id`
- `actor_id`
- `action`
- `note`
- `created_at`

Actions include `submit`, `approve`, `reject`, `publish`, and `rollback`.

### `publish_events`

Stores publish and rollback history.

Fields:

- `id`
- `item_id`
- `from_version_id`
- `to_version_id`
- `actor_id`
- `created_at`
- `note`

## Public API

### `GET /api/public/content`

Returns the full public content snapshot needed by the frontend:

- pages
- guides
- links
- projects
- categories
- banners
- `version`
- `generatedAt`

This is the primary Phase 2 read endpoint.

### `GET /api/public/pages/:slug`

Returns a single public page by slug.

This endpoint is included in Phase 2 so page-level reads can be tested independently from the full content snapshot.

### `GET /api/public/collections/:type`

Returns a public collection such as `links` or `projects`.

Supported query parameters:

- `category`
- `placement`
- `q`

Phase 2 keeps search execution on the frontend using existing search helpers. The API only returns filterable collection data.

### `GET /api/public/media/:id`

Phase 2 does not implement this endpoint by default.

R2 assets should be served through a controlled public URL or custom domain. Content payloads should reference that URL. If private media proxying becomes necessary, it should be specified as a separate post-Phase-2 change.

## Admin API

### `GET /api/admin/me`

Reads Cloudflare Access identity and returns the current TJHub user and role.

### `GET /api/admin/items`

Lists content items by type, status, keyword, and owner filters.

### `POST /api/admin/items`

Creates a content item and its first version.

### `GET /api/admin/items/:id`

Returns item details, versions, review history, and publish history.

### `POST /api/admin/items/:id/versions`

Creates a new version. Saves never overwrite old versions.

### `POST /api/admin/versions/:id/submit`

Moves a draft version to pending review.

### `POST /api/admin/versions/:id/review`

Administrator endpoint for approving or rejecting a pending version.

Rejection requires a Chinese review note.

### `POST /api/admin/items/:id/publish`

Publishes an approved version by updating `published_version_id`.

### `POST /api/admin/items/:id/rollback`

Rolls back to an older approved version.

### `POST /api/admin/media/upload`

Uploads a file to R2 and creates a `media_assets` row.

The API must validate MIME type, size, and file extension.

## Caching and Fallback

Public API responses should use:

```text
Cache-Control: public, max-age=60, stale-while-revalidate=300
```

The content snapshot includes a `version` field. Publishing or rollback updates the effective public content revision.

Frontend fallback rules:

- Request the public API with a short timeout, such as 1500-2500ms.
- Use D1 content only if the response is successful and schema-valid.
- Fall back to Markdown/YAML content if API fetch fails.
- Fall back to Markdown/YAML content if response schema validation fails.
- Fall back to Markdown/YAML content if public content is empty.

Admin APIs do not fall back to Markdown. Admin errors must display clear Simplified Chinese messages.

## Admin UI

The admin application is served at `/admin`.

Primary navigation:

- 仪表盘
- 页面
- 导航链接
- 指南
- 项目
- 分类
- 轮播
- 媒体库
- 审核
- 发布记录
- 用户与角色

### Editor Capabilities

Editors can:

- Create and edit their own content.
- View drafts assigned to them.
- View rejected content needing changes.
- Upload media.
- Submit versions for review.

Editors cannot:

- Approve content.
- Publish content.
- Roll back published content.
- Manage users and roles.

### Admin Capabilities

Administrators can:

- View all content.
- Review pending versions.
- Approve or reject versions.
- Publish approved versions.
- Roll back to old approved versions.
- Manage users and roles.
- View review and publish logs.

## Editors

### Block Editor

Pages, guides, homepage content, and banners use a structured block editor.

The first Phase 2 block types should match existing renderer capabilities:

- `hero`
- `markdown`
- `bannerCarousel`
- `collectionPreview`
- `collectionList`
- `search`
- `notice`
- `cta`

The block editor supports:

- Add block.
- Reorder block.
- Delete block.
- Edit block fields through forms.
- Preview using the same renderer as the public site.
- Drag-and-drop media upload where image fields are supported.

It is not a freeform visual design canvas.

### Link and Project Forms

Links and projects use structured forms rather than block editing.

Fields should map to the existing schema:

- `title`
- `slug`
- `url`
- `description`
- `category`
- `tags`
- `aliases`
- `sourceKind`
- `status`
- `featured`
- `placements`
- `audience`
- `priority`
- `guideSlug`
- `maintainers`
- `contributors`

The goal is to avoid YAML typos and make content maintenance usable for non-technical editors.

## Review and Publish Flow

1. Editor saves content.
2. TJHub creates a `draft` version.
3. Editor submits the version for review.
4. Version becomes `pending`.
5. Admin previews and reviews the version.
6. Admin approves or rejects the version.
7. Approved versions can be published.
8. Publishing updates `content_items.published_version_id`.
9. Public API starts returning that published version.
10. Old approved versions remain available for rollback.

Rejecting a version requires a review note.

Preview must clearly label:

- 草稿预览
- 待审核预览
- 已发布预览

## Migration

Phase 2 should include an import script that reads existing content and seeds D1.

Mapping:

- `content/pages/*.md` -> `page`
- `content/guides/*.md` -> `guide`
- `content/collections/links/**/*.md` -> `link`
- `content/collections/projects/*.md` -> `project`
- `content/taxonomies/categories.yaml` -> `category`

Imported content should:

- Create `content_items`.
- Create initial `content_versions`.
- Mark initial versions as `approved`.
- Set `published_version_id` to the imported approved version.
- Preserve Markdown body in `payload_json.body` or a markdown block.

Markdown files remain in the repository as fallback content and an audit baseline.

## Deployment

Phase 2 continues using Cloudflare Pages.

New Cloudflare bindings:

- D1 database for content and admin data.
- R2 bucket for media.
- Cloudflare Access policy for `/admin` and `/api/admin/*`.

Pages Functions should live in the existing repository and deploy through the existing GitHub Actions Pages workflow.

The workflow should not manage custom domains or DNS records.

## Testing Strategy

### Backend

Test:

- D1 migrations are repeatable.
- Public API returns only published approved content.
- Admin API enforces editor/admin permissions.
- Save creates new versions.
- Submit/review/publish/rollback transitions are valid.
- Rejection requires a note.
- Media upload validates MIME type, size, and R2 key.

### Frontend

Test:

- API content is used when valid.
- Markdown fallback is used on API failure.
- Markdown fallback is used on timeout.
- Markdown fallback is used on schema failure.
- Admin role sees admin actions.
- Editor role does not see admin actions.
- Save creates a new version.
- Publishing updates public content.

### End-to-End Smoke

Scenarios:

- Create link -> submit -> approve -> publish -> link appears on `/nav`.
- Edit homepage block -> submit -> approve -> publish -> homepage updates.
- Upload banner image -> publish -> public image loads.
- Simulate public API failure -> public site still renders fallback content.

## Rollout

Recommended rollout:

1. Add D1/R2 bindings and local migrations.
2. Implement import script and seed preview D1.
3. Implement public API and frontend API-first content loader with fallback.
4. Implement Cloudflare Access-protected admin shell.
5. Implement user role resolution.
6. Implement content item/version APIs.
7. Implement link/project forms.
8. Implement page/guide/block editor.
9. Implement media upload.
10. Implement review and publish workflows.
11. Run smoke tests in preview.
12. Enable production D1/R2 bindings.

Keep Markdown fallback enabled for at least one release phase after D1 public content is live.
