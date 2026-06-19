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

## GitHub Actions 部署流程

当前仓库使用 GitHub Actions 通过 Wrangler Direct Upload 部署 Cloudflare Pages。

- PR：运行类型检查、测试和构建，不部署
- `main` 分支推送：运行类型检查、测试、构建，通过后部署 `dist/` 到 Cloudflare Pages

工作流文件：

```text
.github/workflows/deploy.yml
```

Cloudflare Pages 项目名：

```text
tjhub
```

GitHub 仓库需要配置以下 Actions secrets：

```text
CLOUDFLARE_ACCOUNT_ID
CLOUDFLARE_API_TOKEN
```

`CLOUDFLARE_API_TOKEN` 需要至少具备 Cloudflare Pages Edit 权限。

## 手动验证部署命令

如果需要在本地复现部署命令，可在已登录 Wrangler 且具备权限的环境运行：

```powershell
npm run build
npx wrangler pages deploy dist --project-name=tjhub --branch=main
```

不要将 Cloudflare token 写入仓库文件。

## 注意事项

1. `dist/` 目录不纳入 Git 版本控制（已在 `.gitignore` 中配置）
2. `public/` 目录下的文件（`_redirects`、`robots.txt`）会被原样复制到构建产物
3. GitHub Actions secrets 只在 GitHub 仓库设置中配置，不要提交到仓库
4. 若 Cloudflare Pages 项目名不是 `tjhub`，需要同步修改 `.github/workflows/deploy.yml`
