# Aohoyo Admin

<p align="center">
  <b>一个简洁、优雅的 Vue3 后台管理模板</b>
</p>

<p align="center">
  <a href="#功能特性">功能特性</a> ·
  <a href="#快速开始">快速开始</a> ·
  <a href="#目录结构">目录结构</a> ·
  <a href="#图标使用">图标使用</a> ·
  <a href="#二次开发">二次开发</a> ·
  <a href="#更新日志">更新日志</a>
</p>

---

## 功能特性

### 主题系统

- 暗黑模式切换
- 主题色自定义（5 种预设 + 自定义颜色选择器）
- 侧边栏 / 头部独立主题设置
- 圆角大小调节
- 灰色模式 / 色弱模式

### 权限管理

- 用户管理（增删改查、状态切换）
- 角色管理（权限分配）
- 菜单管理（树形结构、图标选择器）
- 权限指令 `v-permission`
- 角色指令 `v-role`

### 页面组件

- 登录页面
- Dashboard 仪表盘
- 个人中心（修改密码、个人信息）
- 表格示例 / 表单示例
- 图标示例页
- 404 页面

### 公共组件

- Layout 布局（默认后台布局）
- Sidebar 侧边栏（可折叠）
- Header 头部
- Tabs 标签栏（右键菜单、持久化缓存）
- ThemeSetting 主题设置面板
- GlobalLoading 全局加载
- ResponsiveDialog / ResponsiveSearch / ResponsiveTable 响应式组件
- LockScreen 锁屏组件

### 工程化

- Vite 5 + Vue 3.5 + TypeScript
- Pinia 状态管理（持久化）
- Vue Router 4 路由守卫
- unplugin-vue-components 按需导入组件
- unplugin-auto-import 按需导入 API
- unplugin-icons (Iconify) 图标系统
- Vitest 单元测试（17 个用例）
- GitHub Actions CI
- Conventional Commits + commitlint

---

## 快速开始

### 环境要求

- Node.js >= 20.0.0
- npm >= 10.0.0

### 安装与启动

```bash
git clone https://github.com/aohoyo/aohoyo-admin.git
cd aohoyo-admin
npm install
npm run dev
# 访问 http://localhost:3000
```

### 生产构建

```bash
npm run build    # 构建产物到 dist/
npm run preview  # 预览构建结果
npm run test     # 运行单元测试
npm run lint     # ESLint 检查
```

### 默认账号

| 账号  | 密码     |
| ----- | -------- |
| admin | admin123 |

---

## 目录结构

```
aohoyo-admin/
├── public/
│   └── logo.webp / logo-256.webp   # 网站 Logo（WebP 格式）
├── mock/                           # Mock 数据（开发阶段模拟接口）
│   ├── index.ts                    # 汇总导出
│   ├── user.ts                     # 登录/用户信息 Mock
│   └── system.ts                   # 系统管理 Mock（用户/角色/菜单列表）
├── src/
│   ├── api/
│   │   ├── modules/                # 模块化接口
│   │   └── request.ts              # Axios 封装
│   ├── components/                  # 公共组件
│   │   ├── GlobalLoading/
│   │   ├── LockScreen/
│   │   ├── ResponsiveDialog/
│   │   ├── ResponsiveSearch/
│   │   ├── ResponsiveTable/
│   │   ├── SvgIcon/
│   │   └── ThemeSetting/
│   ├── composables/                 # 组合式函数
│   │   ├── useForm.ts
│   │   ├── useLoading.ts
│   │   ├── useResponsive.ts
│   │   └── useTable.ts
│   ├── config/
│   │   └── settings.ts             # 全局配置（标题/Logo/主题默认值）
│   ├── directives/
│   │   └── permission.ts           # v-permission / v-role 指令
│   ├── layouts/
│   │   └── default/                 # 默认后台布局
│   ├── locales/                     # 国际化语言包
│   ├── router/
│   │   ├── index.ts                # 路由实例
│   │   ├── routes.ts                # 路由定义
│   │   └── guards.ts                # 路由守卫
│   ├── stores/                      # Pinia 状态管理
│   │   ├── app.ts / tabs.ts / theme.ts / user.ts
│   ├── styles/
│   │   └── index.css               # 全局样式
│   ├── types/
│   │   └── index.ts                # 全局类型声明
│   ├── utils/
│   │   └── crypto.ts               # AES-GCM 加密（锁屏密码）
│   ├── views/
│   │   ├── dashboard/
│   │   ├── error/                  # 404
│   │   ├── example/
│   │   │   ├── icon/               # 图标示例页
│   │   │   ├── form/
│   │   │   └── table/
│   │   ├── login/
│   │   ├── profile/
│   │   └── system/
│   ├── App.vue
│   └── main.ts
├── .env.development
├── .env.production
├── index.html
├── package.json
├── vite.config.ts
├── vitest.config.ts
├── tsconfig.json
└── CHANGELOG.md
```

---

## 图标使用

本项目使用 **Iconify** 图标系统（`@iconify/vue` + `@iconify-json/ep` Element Plus 图标集）。

### 模板中引用图标

图标组件名格式：`i-{集合名}-{图标名}`

```vue
<!-- Element Plus 图标（ep = @iconify-json/ep） -->
<el-icon><i-ep-HomeFilled /></el-icon>
<el-icon><i-ep-User /></el-icon>
<el-icon><i-ep-Setting /></el-icon>

<!-- 自定义 SVG 图标（放 public/） -->
<SvgIcon name="my-icon" prefix="svg" />
```

### 路由菜单图标

路由定义中使用图标名（不带前缀）：

```ts
// src/router/routes.ts
{
  path: '/dashboard',
  meta: { icon: 'HomeFilled', title: '首页' }
  // → 渲染为 <i-ep-HomeFilled />
}
```

### 图标示例页

访问 `/example/icon` 查看所有可用图标，支持搜索。

### 图标集合

| 集合         | 前缀    | 来源                         |
| ------------ | ------- | ---------------------------- |
| Element Plus | `i-ep-` | `@iconify-json/ep`           |
| 可扩展       | —       | 替换 `@iconify-json/ep` 即可 |

---

## 二次开发

### 换项目名称

**① 环境变量**（`.env.development` / `.env.production`）

```env
VITE_APP_TITLE=我的新后台
```

**② HTML 标题**（`index.html`）

```html
<title>我的新后台</title>
```

**③ Logo**：`public/logo.webp` / `public/logo-256.webp`

### 接入真实 API

**① 修改 API 地址**（`.env.development`）

```env
VITE_APP_BASE_API=https://your-api.com/api
```

**② 替换 Mock 数据**：`mock/` 目录下修改或删除 `.ts` 文件，然后注释掉 `vite.config.ts` 中的 `viteMockServe`。

**③ 调整 Axios 封装**：`src/api/request.ts` 根据真实后端调整响应格式和认证方式。

### 添加新页面

1. 创建页面组件：`src/views/your-page/index.vue`
2. 定义 API（如需）：`src/api/modules/your-api.ts`
3. 在 `src/router/routes.ts` 的对应 `children` 中添加路由记录

### 添加权限

```vue
<el-button v-permission="'admin'">仅管理员可见</el-button>
<el-button v-role="['editor', 'admin']">编辑者和管理员可见</el-button>
```

---

## 更新日志

### v1.5.0 (2026-04-24)

- Dashboard chunk: 1.1MB → 4.26KB（-99.6%）— manualChunks 拆分为独立 vendor chunk
- Dashboard gzip: 368KB → 1.97KB
- 修复 Tabs 初始化时序（onMounted + immediately 标志替代 { immediate: true }）
- 修复 vue-tsc 类型检查报错（dashboard 模板绑定、ThemeSetting props 类型、Sidebar redirect 类型）
- Element Plus 按需引入 + unplugin-vue-components 自动导入组件
- Logo 转为 WebP 格式（407KB → 6KB + 16KB）

### v1.4.0 (2026-04-24)

- 新增 Vitest 单元测试（17 个测试用例）
- 新增 GitHub Actions CI（lint → type-check → test → build）
- 新增 rollup-plugin-visualizer 体积分析报告
- 新增 `src/types/index.ts` 全局类型声明
- 新增 commitlint + Husky commit-msg hook
- ECharts 按需引入（LineChart + PieChart）
- `vite.config.ts` 重构：ElementPlusResolver + manualChunks
- 移除 `DEV_PLAN.md`、`vite-plugin-compression`

### v1.3.1 (2026-04-24)

- 完善 README，补充二次开发指引

### v1.3.0 (2026-04-11)

- 移动端适配（响应式布局/组件/样式优化）
- 新增 ResponsiveDialog / ResponsiveSearch / ResponsiveTable
- 新增 useResponsive 组合式函数

### v1.0.0 (2026-03-27)

- 初始版本发布
- 完整主题系统、用户/角色/菜单管理、标签页缓存、权限指令、Mock 数据

---

## 浏览器支持

| 浏览器  | 支持版本    |
| ------- | ----------- |
| Chrome  | 最新 2 版本 |
| Firefox | 最新 2 版本 |
| Safari  | 最新 2 版本 |
| Edge    | 最新 2 版本 |

---

## 许可证

[MIT](LICENSE) © 2026 Aohoyo
