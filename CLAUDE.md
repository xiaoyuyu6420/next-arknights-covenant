# CLAUDE.md

## Repository Overview

WBTI (卫戍协议重度依赖测试) — a Next.js personality quiz app for Arknights players. Users answer 30 questions across 15 dimensions, then the server matches their answers to 1 of 25 personality types via a vector algorithm. Supports 2 locales (zh, ja) and includes an admin dashboard.

## Common Commands

```bash
bun install          # Install dependencies
bun dev              # Start dev server on http://localhost:3000
bun run build        # Production build
bun run typecheck    # TypeScript check
```

## Git 操作规范

### 自动推送规则

每次完成代码修改后，**自动推送到远程**：

```bash
git add -A && git commit -m "<conventional commit message>" && git push
```

### Commit 规范

- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `refactor:` 重构
- `ci:` CI/CD 相关
- `chore:` 杂项

## Architecture

### Quiz Flow

```
/ (test page) ──answers──▶  result
```

- `src/app/page.tsx` is the main quiz page with 3 screens: welcome → test → result
- Screen transitions are state changes, not route changes
- Results are persisted to DB via `/api/results`

### Matching Algorithm

1. Collect dimension scores from answers (skip gate/trigger dims)
2. Convert each dim's score to tier L=0, M=1, H=2 via config
3. Distance calculation vs each personality template vector
4. Sort ascending by distance, take top 3, compute similarity %

### API Surface

- `GET  /api/quiz` — questions, dimensions, types
- `POST /api/results` — persist test record
- `GET  /api/visits` — record share visits
- Admin: `/api/admin/*` (CRUD + stats)

### Database

Prisma + SQLite. Models: `Question`, `Option`, `PersonalityType`, `SpecialType`, `TestRecord`, `ShareVisit`. Schema pushed with `prisma db push`, no migrations folder.

## Deployment

### Architecture

```
本地开发 → GitHub → GitHub Actions → Docker Hub → 服务器(镜像加速)
```

### Docker

Multi-stage build using Next.js standalone output. Container entrypoint:
1. Initializes DB on first boot
2. Runs `scripts/backup.sh` (SQLite `.backup` → gzip, retains 30 copies)
3. Starts `crond` for automatic backups every 6 hours
4. Launches `node server.js`

Port: `8080` (external) → `3000` (internal)

### CI/CD

`.github/workflows/deploy.yml` — triggered on push to `main`. Builds `linux/amd64` image, pushes to `xiaoyuyu123/magical-girls-witch-trial:latest` on Docker Hub.

Required GitHub Secrets:
- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

### Server Setup (一次性)

```bash
curl -sSL https://raw.githubusercontent.com/xiaoyuyu6420/next-arknights-covenant/main/scripts/deploy.sh | bash
```

### 日常更新

```bash
cd /home/wbti && docker compose pull && docker compose up -d
```

### 回滚

```bash
cd /home/wbti && bash scripts/deploy.sh --rollback
```

### 恢复数据库

```bash
bash /home/wbti/scripts/restore-backup.sh
```

## Auto Sync to GitHub

A Stop hook is configured that automatically commits and pushes to GitHub at the end of each conversation if there are uncommitted changes.

- **Repository**: https://github.com/xiaoyuyu6420/next-arknights-covenant
- **Branch**: main
- **Hook trigger**: End of each conversation (Stop event)
- **Behavior**: If `git diff` shows changes, runs `git add -A && git commit -m 'auto: sync' && git push`
