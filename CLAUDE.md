# CLAUDE.md - 项目指南

## Git 操作规范

### 自动推送规则

每次完成以下操作后，**自动推送到远程**：

1. **代码修改** — 任何 `.ts`, `.tsx`, `.js`, `.cjs` 文件修改后
2. **配置修改** — `package.json`, `docker-compose.yml`, `Dockerfile`, `prisma/schema.prisma`
3. **文档更新** — `README.md`, `CLAUDE.md`
4. **CI/CD 修改** — `.github/workflows/*.yml`

### 推送流程

```bash
# 每次修改后执行
git add -A && git commit -m "<conventional commit message>" && git push
```

### Commit 规范

使用 Conventional Commits：

- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `refactor:` 重构
- `ci:` CI/CD 相关
- `chore:` 杂项

### 分支策略

- `main` — 生产分支，触发 CI 构建
- `feature/*` — 功能开发分支

## 项目结构

```
src/
├── app/           # Next.js App Router
├── lib/           # 共享库和工具函数
prisma/            # 数据库 schema 和 seed
scripts/           # 部署脚本
public/            # 静态资源
```

## 部署

- **镜像**: `xiaoyuyu123/magical-girls-witch-trial:latest`
- **一键部署**: `curl -sSL https://raw.githubusercontent.com/xiaoyuyu6420/next-arknights-covenant/main/scripts/deploy.sh | bash`
- **数据目录**: `/home/wbti/data/prisma/db`
- **备份**: 每次容器重启自动备份，保留最近 30 份

## 开发命令

```bash
bun install        # 安装依赖
bun dev            # 开发服务器
bun run build      # 生产构建
bun run typecheck  # 类型检查
```