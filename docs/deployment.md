# 部署说明

## Cloudflare Pages 构建设置

| 配置项 | 值 |
|--------|-----|
| Framework preset | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | 20 或 22 |

## SPA fallback

`public/_redirects` 提供 Vue Router history 模式下的 SPA fallback：

```
/* /index.html 200
```

所有未匹配静态文件的请求都会返回 `index.html`，由 Vue Router 处理客户端路由。

## 域名

- 正式域名：`tjhub.cc`
- `www.tjhub.cc` 通过 Cloudflare Redirect Rules 301 跳转到 `tjhub.cc`

## 构建产物

`npm run build` 会经历以下步骤：

1. **类型检查**：`vue-tsc --noEmit`，验证 TypeScript 类型
2. **Vite 构建**：编译 Vue 组件、处理静态资源、输出到 `dist/`

构建完成后，`dist/` 目录包含部署就绪的静态文件。

## 部署流程

Cloudflare Pages 连接 GitHub 仓库后自动部署：

- `main` 分支推送 → 生产环境自动部署
- PR 分支推送 → 预览环境自动部署

## 注意事项

1. `dist/` 目录不纳入 Git 版本控制（已在 `.gitignore` 中配置）
2. `public/` 目录下的文件（`_redirects`、`robots.txt`）会被原样复制到构建产物
3. 环境变量和密钥在 Cloudflare Pages 控制台中配置，不要提交到仓库
