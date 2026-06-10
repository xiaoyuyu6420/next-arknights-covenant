# WBTI - 卫戍协议重度依赖测试

> 你是哪种卫戍协议重度依赖？测测你的 WBTI！

一款基于《明日方舟》卫戍协议玩法的人格测试应用，通过 30 道题目、15 个维度分析，测出你的卫戍玩家人格类型。

## 在线体验

**http://www.jadeai.icu:8080/**

## 🚀 一键部署

```bash
curl -sSL https://raw.githubusercontent.com/xiaoyuyu6420/next-arknights-covenant/main/scripts/deploy.sh | bash
```

部署完成后访问 `http://<服务器IP>:8080`

<details>
<summary>部署脚本功能</summary>

- 检查 Docker 环境
- 引导配置阿里云镜像加速（可选）
- 创建部署目录 `/home/wbti`
- 下载 `docker-compose.yml`
- 拉取镜像并启动容器
- 健康检查确认服务就绪

</details>

<details>
<summary>日常运维</summary>

```bash
# 更新
cd /home/wbti && docker compose pull && docker compose up -d

# 回滚
cd /home/wbti && bash scripts/deploy.sh --rollback

# 恢复数据库
bash /home/wbti/scripts/restore-backup.sh

# 查看日志
cd /home/wbti && docker compose logs -f
```

</details>

## 数据成果

| 指标 | 数值 |
|------|------|
| 累计测试次数 | **12,547** |
| 独立用户数 | **11,868** |
| 人格类型数 | 25 + 2 种特殊类型 |
| 搜索引擎收录 | Bing 搜索"卫戍协议测试"排名第二 |

## 特性

- **25 种人格类型** + 2 种特殊类型，每种都有详细描述和吐槽
- **15 维度分析**：沉迷、社交、策略、情感、风格五大模型，各 3 个子维度
- **向量匹配算法**：基于 H/M/L 三维评分系统计算人格匹配度
- **门控题 + 触发题**：动态问卷路径，选择不同分支触发特殊结果
- **TOP 3 匹配**：结果页展示最接近的三个人格类型
- **管理后台**：题目管理、人格类型配置、测试结果查看、数据统计
- **粒子背景动画** + 毛玻璃 UI + Framer Motion 动效
- **移动端适配** + 键盘快捷键（A/B/C 快速作答）
- **结果分享**：支持原生分享 API 和剪贴板复制

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router) |
| 语言 | TypeScript |
| 运行时 | Bun |
| 样式 | Tailwind CSS 4 |
| 动画 | Framer Motion 12 |
| 数据库 | SQLite + Prisma ORM |
| 部署 | Docker (standalone) |

## 快速开始

```bash
bun install          # 安装依赖
bun dev              # 启动开发服务器 http://localhost:3000
bun run build        # 生产构建
bun run typecheck    # 类型检查
```

## 项目结构

```
src/
├── app/           # Next.js App Router
├── lib/           # 共享库和工具函数
prisma/            # 数据库 schema 和 seed
scripts/           # 部署脚本
public/            # 静态资源
```

## License

[GPL-3.0](LICENSE) - 修改后必须开源并保留原作者信息
