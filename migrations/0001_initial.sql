CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'editor')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TEXT
);

CREATE TABLE IF NOT EXISTS content_items (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('page', 'guide', 'link', 'project', 'category', 'banner')),
  slug TEXT NOT NULL,
  current_version_id TEXT,
  published_version_id TEXT,
  created_by TEXT,
  updated_by TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  archived_at TEXT,
  UNIQUE (type, slug)
);

CREATE TABLE IF NOT EXISTS content_versions (
  id TEXT PRIMARY KEY,
  item_id TEXT NOT NULL,
  version_number INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'archived')),
  title TEXT NOT NULL,
  description TEXT,
  payload_json TEXT NOT NULL,
  created_by TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  submitted_at TEXT,
  reviewed_by TEXT,
  reviewed_at TEXT,
  review_note TEXT,
  UNIQUE (item_id, version_number),
  FOREIGN KEY (item_id) REFERENCES content_items(id)
);

CREATE TABLE IF NOT EXISTS media_assets (
  id TEXT PRIMARY KEY,
  r2_key TEXT NOT NULL UNIQUE,
  filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  uploaded_by TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS review_events (
  id TEXT PRIMARY KEY,
  item_id TEXT NOT NULL,
  version_id TEXT NOT NULL,
  actor_id TEXT,
  action TEXT NOT NULL CHECK (action IN ('submit', 'approve', 'reject', 'publish', 'rollback')),
  note TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS publish_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_id TEXT NOT NULL,
  from_version_id TEXT,
  to_version_id TEXT NOT NULL,
  actor_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  note TEXT
);

CREATE TABLE IF NOT EXISTS public_revisions (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  revision INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO public_revisions (id, revision) VALUES (1, 0);

CREATE INDEX IF NOT EXISTS idx_content_items_type_slug ON content_items(type, slug);
CREATE INDEX IF NOT EXISTS idx_content_items_published ON content_items(published_version_id);
CREATE INDEX IF NOT EXISTS idx_content_versions_item_status ON content_versions(item_id, status);
CREATE INDEX IF NOT EXISTS idx_media_assets_r2_key ON media_assets(r2_key);
