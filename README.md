# 校园综合智慧管理系统 | SMBU Smart Campus System

深圳北理莫斯科大学"校园智慧助手"AI实战编程大赛参赛作品

## 🚀 快速部署

### 前置条件
- Docker 20.10+
- Docker Compose 2.0+

### 一键部署

```bash
# 1. 克隆仓库
git clone https://github.com/Yogdunana/smbu-smart-campus-system.git
cd smbu-smart-campus-system

# 2. 配置环境变量
cp .env.example .env

# 3. 一键启动（首次启动会自动初始化数据库和种子数据）
docker compose up -d

# 4. 查看日志
docker compose logs -f app
```

### 访问系统
- 地址：http://localhost:3000
- 首次启动约需 30-60 秒（数据库初始化）

## 📋 测试账号

| 角色 | 学号 | 密码 | 说明 |
|------|------|------|------|
| 团委管理员 | admin | 123456 | 全局权限，可审核档案、查看所有组织 |
| 学生 | 2023001 | 123456 | 已完善档案，有志愿记录和能力标签 |
| 学生 | 2023002 | 123456 | 档案待审核状态 |
| 组织负责人 | 2023003 | 123456 | 校学生会 + 计算机协会负责人 |
| 学生 | 2023004 | 123456 | 已完善档案 |
| 学生 | 2023005 | 123456 | 档案草稿状态 |
| 组织负责人 | 2023006 | 123456 | 计算机协会负责人 |
| 学生 | 2023010 | 123456 | 档案已驳回，可重新提交 |

## 🌐 三语支持

系统全面支持中文、English、Русский三种语言，点击右上角语言切换器即可切换。

## 📦 核心功能模块

### 1. 学生时间与任务管理
- 可视化时间轴（日/周/月视图）
- 课表信息整合（模拟API）
- 个人计划管理（CRUD、优先级、完成状态）
- 统筹信息同步（志愿时长、综合实践）
- 空闲时段任务创建

### 2. 组织OA与任务流转
- 组织信息管理（创建、编辑、状态管理）
- 任务看板（待查看/已查看/进行中/已完成）
- 任务类型（单部门/跨部门/上下级）
- 团委全局视图（所有组织任务进度）

### 3. 学生个人档案中心
- 基础信息管理
- 身份信息管理
- **志愿者号关联**（硬性要求 - 自动关联志愿记录和累计时长）
- **能力标签**（硬性要求 - 按技术/策划/管理/运动四分类展示）
- 奖项荣誉管理（含审核机制）
- 档案审核功能（团委审核通过/驳回）

## 🛠️ 技术栈

- **前端**: Next.js 14+ (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **后端**: Next.js API Routes + Prisma ORM
- **数据库**: PostgreSQL 16
- **认证**: NextAuth.js v5 (JWT)
- **国际化**: next-intl (中/英/俄)
- **部署**: Docker Compose

## 📁 项目结构

```
├── .github/workflows/    # CI/CD
├── prisma/                # 数据库模型和种子数据
├── src/
│   ├── app/               # Next.js App Router 页面和API
│   ├── components/        # React 组件
│   ├── i18n/              # 国际化翻译文件
│   └── lib/               # 工具函数和配置
├── docker-compose.yml     # Docker 编排
├── Dockerfile             # Docker 构建
└── .env.example          # 环境变量模板
```

## 🔧 常见问题

### Q: docker compose up -d 后无法访问？
A: 首次启动需要等待数据库初始化和种子数据导入（约30-60秒），查看日志确认：
```bash
docker compose logs -f
```

### Q: 如何重置数据？
```bash
docker compose down -v  # 删除数据卷
docker compose up -d    # 重新启动
```

### Q: 如何修改端口？
编辑 .env 文件中的 APP_PORT 变量。

## 📄 许可证

MIT License
