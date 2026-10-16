# WBTI - 卫戍协议重度依赖测试

> 你是哪种卫戍协议重度依赖？测测你的 WBTI！

一款基于《明日方舟》卫戍协议玩法的人格测试应用，通过 30 道题目、15 个维度分析，测出你的卫戍玩家人格类型。

## 在线体验

**http://www.jadeai.icu:8080/**

## 数据成果

| 指标 | 数值 |
|------|------|
| 累计测试次数 | **12,547** |
| 独立用户数 | **11,868** |
| 人格类型数 | 25 + 2 种特殊类型 |
| 搜索引擎收录 | Bing 搜索"卫戍协议测试"排名第二 |

## 关于流量

本项目在卫戍协议活跃期间获得了大量传播，累计超 1.2 万人完成测试。近期流量下降是因为《明日方舟》卫戍协议模式暂时关闭，待模式重开后流量预期将回升。

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
# 安装依赖
bun install

# 启动开发服务器
bun dev

# 类型检查和生产构建
bun run typecheck
bun run build

# 访问
# 主页: http://localhost:3000
# 管理后台: http://localhost:3000/admin
```

## Docker 部署

```bash
# 构建并启动
docker compose up -d

# 自定义端口（默认 3000）
PORT=8080 docker compose up -d
```

数据库文件持久化在 `prisma/db/wbti.db`。

## 项目结构

```
src/
├── app/
│   ├── page.tsx              # 主页（欢迎/测试/结果三屏）
│   ├── layout.tsx            # 全局布局和字体配置
│   ├── globals.css           # WBTI 主题变量和全局样式
│   ├── admin/                # 管理后台页面
│   └── api/
│       ├── quiz/             # 获取题目和人格数据
│       ├── results/          # 保存测试结果
│       └── admin/            # 管理接口（CRUD + 统计）
├── lib/
│   ├── quiz-data.ts          # 默认题目和人格类型数据
│   └── db.ts                 # Prisma 客户端
prisma/
├── schema.prisma             # 数据库模型定义
└── db/wbti.db                # SQLite 数据库
public/
└── img-sy/                   # 表情包图片资源
```

## 数据模型

- **Question** - 测试题目（普通题/门控题/触发题）
- **Option** - 选项（含分值或分支值）
- **PersonalityType** - 25 种人格类型（向量编码 + 描述）
- **SpecialType** - 特殊人格类型（攻略大佬 / 电子斗蛐蛐）
- **TestRecord** - 测试记录（用户 ID、结果、相似度、时间戳）

## 一键部署

服务器上执行：

```bash
curl -sSL https://raw.githubusercontent.com/xiaoyuyu6420/next-arknights-covenant/main/scripts/deploy.sh | bash
```

脚本会自动：
- 检查 Docker 环境
- 引导配置阿里云镜像加速（可选）
- 创建部署目录 `/opt/wbti`
- 下载 `docker-compose.yml`
- 拉取镜像并启动容器

部署完成后访问 `http://<服务器IP>:8080`

## License

[GPL-3.0](LICENSE) - 修改后必须开源并保留原作者信息
