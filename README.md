# SMBU Smart Campus System

[中文](#中文) | [English](#english)

---

## English

An intelligent campus management platform for **Shenzhen MSU-BIT University (SMBU)**, built for the "Campus Smart Assistant" AI Programming Competition.

### Features

- **Schedule & Task Management** — Visual timeline (day/week/month views), personal plan CRUD with priorities
- **Organization OA & Task Workflow** — Organization management, task boards with status tracking, cross-department task routing
- **Student Profile Center** — Basic info, identity verification, volunteer number binding, skill tags, awards & honors
- **Trilingual Support** — Chinese / English / Russian (Русский), switchable via the language selector
- **Mobile Responsive** — Optimized for all screen sizes with adaptive sidebar and layouts
- **Role-Based Access** — Student, Organization Leader, and Committee (团委) roles with dedicated views

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui |
| Backend | Next.js API Routes + Prisma ORM |
| Database | PostgreSQL 16 |
| Auth | NextAuth.js v5 (JWT Strategy) |
| i18n | next-intl (zh / en / ru) |
| Deployment | Docker Compose |

### Quick Start

**Prerequisites:** Docker 20.10+ and Docker Compose 2.0+

```bash
# 1. Clone the repository
git clone https://github.com/Yogdunana/smbu-smart-campus-system.git
cd smbu-smart-campus-system

# 2. Configure environment variables
cp .env.example .env
# Edit .env with your own values (see .env.example for reference)

# 3. Start all services
docker compose up -d

# 4. Monitor logs
docker compose logs -f app
```

The application will be available at `http://localhost:3000` after ~30-60 seconds (database initialization on first run).

### Test Accounts

All accounts share the password `123456`.

| Role | Student ID | Description |
|------|-----------|-------------|
| Committee Admin | `admin` | Full access, can review profiles and view all organizations |
| Student | `2023001` | Completed profile with volunteer records and skill tags |
| Student | `2023002` | Profile pending review |
| Org Leader | `2023003` | Leader of Student Union & Computer Association |
| Student | `2023004` | Completed profile |
| Student | `2023005` | Profile in draft status |
| Org Leader | `2023006` | Leader of Computer Association |
| Student | `2023010` | Profile rejected, can resubmit |

### Project Structure

```
├── .github/workflows/    # CI/CD pipelines
├── prisma/                # Database schema & seed data
├── src/
│   ├── app/               # Next.js App Router (pages & API routes)
│   ├── components/        # React components (UI + layout)
│   ├── i18n/              # Internationalization files (zh/en/ru)
│   └── lib/               # Utilities, auth config, Prisma client
├── docker-compose.yml     # Docker Compose orchestration
├── Dockerfile             # Multi-stage Docker build
└── .env.example          # Environment variable template
```

### CI/CD

The project uses GitHub Actions for automated deployment:

1. **CI** — Runs lint, type-check, and build on every push to `main`
2. **CD** — Automatically deploys to your server via SSH after CI passes

To enable deployment, configure the following **GitHub Secrets** in your repository settings:

| Secret | Description |
|--------|-------------|
| `SERVER_HOST` | Your server's IP address |
| `SERVER_PORT` | SSH port (default: 22) |
| `SERVER_USER` | SSH username |
| `SERVER_PASSWORD` | SSH password |
| `POSTGRES_USER` | Database username |
| `POSTGRES_PASSWORD` | Database password |
| `POSTGRES_DB` | Database name |
| `NEXTAUTH_URL` | Public URL of your application |
| `NEXTAUTH_SECRET` | Random string for JWT encryption |

### FAQ

**Q: Cannot access after `docker compose up -d`?**
Wait 30-60 seconds for database initialization. Check logs: `docker compose logs -f`

**Q: How to reset all data?**
```bash
docker compose down -v  # Remove data volumes
docker compose up -d    # Restart fresh
```

**Q: How to change the port?**
Edit `APP_PORT` in your `.env` file.

### License

MIT License

---

## 中文

深圳北理莫斯科大学"校园智慧助手"AI实战编程大赛参赛作品。

### 功能特性

- **时间与任务管理** — 可视化时间轴（日/周/月视图），个人计划增删改查，支持优先级
- **组织OA与任务流转** — 组织管理，任务看板状态追踪，跨部门任务路由
- **学生个人档案中心** — 基础信息、身份验证、志愿者号绑定、能力标签、奖项荣誉
- **三语支持** — 中文 / English / Русский，右上角一键切换
- **移动端适配** — 响应式布局，侧边栏抽屉，全屏幕尺寸优化
- **角色权限** — 学生、组织负责人、团委三种角色，各有专属视图

### 快速部署

**前置条件：** Docker 20.10+ 和 Docker Compose 2.0+

```bash
# 1. 克隆仓库
git clone https://github.com/Yogdunana/smbu-smart-campus-system.git
cd smbu-smart-campus-system

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 填入你的配置（参考 .env.example）

# 3. 一键启动
docker compose up -d

# 4. 查看日志
docker compose logs -f app
```

访问地址：`http://localhost:3000`，首次启动约需 30-60 秒（数据库初始化）。

### 许可证

MIT License
