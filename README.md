# TJHub

TJHub 是一个面向同济学生的非官方校园信息入口，旨在整理常用校园系统、学习资源、学生项目与生活服务链接。

访问地址：

https://tjhub.cc

> TJHub 由学生自发维护，不代表同济大学官方立场。

## 项目定位

- **非官方**：本站收录第三方网站链接和校园相关资源，并非学校官方产品
- **导航与索引**：为同济学生提供一站式校园信息检索入口
- **社区驱动**：内容由贡献者共同维护，欢迎提交建议与反馈

## 技术栈

- Vue 3
- Vite
- TypeScript
- Tailwind CSS
- Markdown + YAML frontmatter
- Vitest（单元测试）
- Cloudflare Pages

## 本地运行

```powershell
npm install
npm run dev
```

访问 http://localhost:5173

## 运行测试

```powershell
npm run test
```

类型检查：

```powershell
npm run typecheck
```

## 内容结构

项目内容以 Markdown + YAML frontmatter 的形式存放在 `content/` 目录下：

```
content/
├── pages/            # 静态页面（首页、新生专题、关于、投稿、管理后台）
├── guides/           # 站内指南（服务门户、选课、校园网络等）
├── collections/
│   ├── links/        # 入口链接
│   │   ├── official/ # 官方入口
│   │   ├── tools/    # 工具服务
│   │   ├── learning/ # 学习资源
│   │   └── life/     # 生活服务
│   └── projects/     # 学生项目
```

## 参与贡献

TJHub 欢迎社区贡献！参与方式包括：

- **提交 Issue**：发现失效链接、建议新增入口、反馈内容问题
- **提交 Pull Request**：直接修改或新增 Markdown 内容文件
- **审核**：协助审核待处理的条目

详细说明请参见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

### 内容审核规范

所有提交的内容需经过审核：

- **reviewStatus** 为 `draft` 的条目不会在公开页面展示
- 新提交的链接默认审核状态由维护者设定
- 定期对已收录条目进行可用性检查，标记失效链接

### 内容规范

关于 `sourceKind`、`status`、`visibility`、`aliases`、`guideSlug`、`placements`、`audience` 等字段的说明，请参见 [docs/content-guidelines.md](./docs/content-guidelines.md)。

## 部署说明

项目部署在 Cloudflare Pages 上，详见 [docs/deployment.md](./docs/deployment.md)。

## 开发路线图

- [x] 基础框架搭建（Vue 3 + Vite + Tailwind CSS）
- [x] 内容系统（Markdown 加载 + YAML frontmatter）
- [x] 搜索功能（含中文别名）
- [x] 导航与分类展示
- [x] 内容渲染（Markdown 页面和指南）
- [ ] 自动化链接可用性检查
- [ ] 移动端 PWA 支持

## 免责声明

TJHub 是由学生自发维护的非官方校园信息导航项目，不代表同济大学官方立场。站内部分链接指向第三方网站，请自行判断信息准确性与安全性。如发现失效、错误或不适合展示的内容，欢迎通过 GitHub Issues 提交反馈。

## 许可证

MIT
