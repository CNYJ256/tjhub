# 内容字段规范

本文档定义 TJHub 内容条目中关键字段的含义和使用规范。

## 通用字段

以下字段适用于所有内容类型。

### type

条目类型，可选值：

| 值 | 说明 |
|----|------|
| `page` | 静态页面 |
| `guide` | 站内指南 |
| `link` | 外部入口链接 |
| `project` | 学生项目 |

### title

条目标题，必须使用中文。要求简洁、准确，能概括条目内容。

### slug

URL 友好标识符，使用小写字母和连字符（`-`）。每个条目 slug 必须唯一。

### visibility

控制条目的展示状态：

| 值 | 说明 |
|----|------|
| `public` | 公开可见，对任何访问者展示 |
| `hidden` | 仅通过直接链接访问，不在导航或列表中展示 |
| `draft` | 仅开发环境可见，不会部署到生产环境 |

### reviewStatus

审核状态：

| 值 | 说明 |
|----|------|
| `draft` | 草稿，尚未提交审核 |
| `pending` | 已提交，等待审核 |
| `approved` | 审核通过，可公开展示 |
| `rejected` | 已驳回，需修改后重新提交 |

## 入口链接和项目字段

以下字段适用于 `link` 和 `project` 类型。

### sourceKind

来源性质，描述条目的版权和运营归属：

| 值 | 说明 |
|----|------|
| `official` | 同济大学官方部门或机构的网站 |
| `student` | 由同济学生创建或维护的项目 |
| `third_party` | 第三方商业或开源工具服务 |
| `internal` | TJHub 内部定义的内容 |

### status

条目当前可用性状态：

| 值 | 说明 |
|----|------|
| `active` | 正常运行，可正常访问 |
| `stale` | 内容可能已过期，但链接仍可访问 |
| `unavailable` | 暂时无法访问 |
| `archived` | 已归档，历史记录保留 |

### aliases

`string[]`，中文搜索别名列表。用于改善搜索体验，让用户通过俗称、缩写、拼音等找到对应条目。例如"教学管理信息系统"可添加别名 `["选课网", "教务系统", "4m3"]`。

### guideSlug

`string`（可选）。如果该入口有对应的站内指南，填写指南的 slug。用于在入口详情页关联指南链接。

### placements

`string[]`，展示位置列表。指定该条目应出现在哪些页面或区域。例如：

- `home`：首页
- `freshman`：新生专题页
- `admin`：管理后台页面

如留空，则在符合分类的展示位置默认出现。

### audience

`string[]`，目标受众列表。描述该条目的适用对象：

| 值 | 说明 |
|----|------|
| `all` | 所有同学均适用 |
| `freshman` | 新生 |
| `undergraduate` | 本科生 |
| `graduate` | 研究生 |
| `international` | 留学生 |

可通过组合表达更精确的受众范围，例如 `["undergraduate", "graduate"]`。

### official

`boolean`（仅 `link` 类型）。标记该入口是否为同济大学官方运行的系统。用户可根据此标记判断信息权威性。

### featured

`boolean`。标记为 `true` 的条目会在首页或对应展示区域优先显示。

### priority

`number`，排序优先级。数值越大，在同类条目中排序越靠前。默认为 `0`。

### maintainers

`string[]`（仅 `project` 类型）。项目的维护者列表。

### contributors

`string[]`，条目的贡献者列表。记录参与编辑或维护该条目的 GitHub 用户名。

## 页面和指南字段

以下字段适用于 `page` 和 `guide` 类型。

### blocks

`page` 和 `guide` 的 `blocks` 字段定义页面的内容区块。每个区块包含：

- `type`：区块类型
- `title`（可选）：区块标题
- `description`（可选）：区块描述
- `source`（可选）：数据来源过滤
- `collection`（可选）：指定集合类型（`links` 或 `projects`）
- `placement`（可选）：在指定集合中按展示位置过滤
- `limit`（可选）：限制显示条目数量

区块类型示例：

- `hero`：首页顶部横幅
- `links`：入口链接集合
- `projects`：学生项目展示
- `guides`：指南列表
- `markdown`：Markdown 正文
