#!/bin/bash
set -e

DEPLOY_DIR="/home/wbti"
REPO="xiaoyuyu6420/next-arknights-covenant"
GITHUB_RAW="https://raw.githubusercontent.com/${REPO}/main"
GITHUB_PROXY="https://ghfast.top/https://raw.githubusercontent.com/${REPO}/main"
IMAGE="xiaoyuyu123/magical-girls-witch-trial"

VERSION_FILE="$DEPLOY_DIR/.current-version"
HEALTH_URL="http://localhost:8080"
MAX_WAIT=60

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

info()  { echo -e "${CYAN}[INFO]${NC}  $*"; }
ok()    { echo -e "${GREEN}[OK]${NC}    $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC}  $*"; }
fail()  { echo -e "${RED}[FAIL]${NC}  $*"; exit 1; }

# 回滚函数
rollback() {
  echo ""
  info "=== 版本回滚 ==="
  if [ ! -f "$VERSION_FILE" ]; then
    fail "没有版本记录，无法回滚"
  fi

  current=$(cat "$VERSION_FILE")

  if [ ! -f "$VERSION_FILE.history" ]; then
    fail "没有历史版本记录"
  fi

  previous=$(grep -v "^$current$" "$VERSION_FILE.history" | tail -1)
  if [ -z "$previous" ]; then
    fail "没有找到上一个版本"
  fi

  info "当前版本: $current"
  info "回滚版本: $previous"
  read -p "确定回滚吗？(y/N): " confirm
  if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    info "已取消"
    exit 0
  fi

  cd "$DEPLOY_DIR"
  sed -i "s|image: ${IMAGE}.*|image: ${IMAGE}:${previous}|" docker-compose.yml
  docker compose pull
  docker compose up -d
  echo "$previous" > "$VERSION_FILE"
  ok "回滚完成，版本: $previous"
  exit 0
}

if [ "$1" = "--rollback" ] || [ "$1" = "-r" ]; then
  rollback
fi

echo ""
info "=== WBTI 卫戍人格测试 部署脚本 ==="
echo ""

command -v docker >/dev/null 2>&1 || fail "Docker 未安装"
docker compose version >/dev/null 2>&1 || fail "Docker Compose 未安装"

# 1. 创建目录
info "创建部署目录: $DEPLOY_DIR"
mkdir -p $DEPLOY_DIR/{data/prisma/db,backups}
cd $DEPLOY_DIR

# 2. 密码配置（在下载配置文件之前）
if [ ! -f .env ]; then
  echo ""
  warn "首次部署，请设置管理后台密码"
  while true; do
    read -sp "请输入管理密码: " ADMIN_PW
    echo ""
    if [ -z "$ADMIN_PW" ]; then
      warn "密码不能为空"
      continue
    fi
    read -sp "确认密码: " ADMIN_PW_CONFIRM
    echo ""
    if [ "$ADMIN_PW" != "$ADMIN_PW_CONFIRM" ]; then
      warn "密码不匹配，请重新输入"
      continue
    fi
    break
  done

  cat > .env << EOF
DATABASE_URL=file:./db/wbti.db
ADMIN_PASSWORD=${ADMIN_PW}
EOF
  ok ".env 已创建"
else
  ok ".env 已存在"
fi

# 3. 下载 docker-compose.yml
info "下载配置文件..."
if [ -f docker-compose.yml ]; then
  backup_name="docker-compose.yml.backup.$(date +%Y%m%d%H%M%S)"
  cp docker-compose.yml "$backup_name"
  info "已备份: $backup_name"
fi

download_success=false
if curl -sSf --connect-timeout 10 -o docker-compose.yml.new "$GITHUB_RAW/docker-compose.yml" 2>/dev/null; then
  download_success=true
else
  info "直连失败，尝试镜像加速..."
  if curl -sSf --connect-timeout 10 -o docker-compose.yml.new "$GITHUB_PROXY/docker-compose.yml" 2>/dev/null; then
    download_success=true
  fi
fi

if [ "$download_success" = false ] || [ ! -s docker-compose.yml.new ]; then
  fail "下载 docker-compose.yml 失败"
fi
mv docker-compose.yml.new docker-compose.yml
ok "配置文件已下载"

# 4. 镜像加速（可选）
if [ ! -f /etc/docker/daemon.json ] || ! grep -q "registry-mirrors" /etc/docker/daemon.json 2>/dev/null; then
  if [ "$(id -u)" -eq 0 ] && [ -t 0 ]; then
    echo ""
    warn "未检测到镜像加速配置"
    read -p "是否配置阿里云镜像加速？(y/N): " setup_mirror
    if [ "$setup_mirror" = "y" ] || [ "$setup_mirror" = "Y" ]; then
      echo "  请前往 https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors 获取加速地址"
      read -p "  请输入加速地址 (留空跳过): " mirror_url
      if [ -n "$mirror_url" ]; then
        if [[ ! "$mirror_url" =~ ^https://[a-zA-Z0-9.-]+\.mirror\.aliyuncs\.com/?$ ]]; then
          warn "无效的阿里云镜像地址格式，跳过"
        else
          mkdir -p /etc/docker
          echo "{\"registry-mirrors\":[\"$mirror_url\"]}" > /etc/docker/daemon.json
          if command -v systemctl >/dev/null 2>&1; then
            systemctl daemon-reload && systemctl restart docker
            ok "镜像加速配置完成"
          fi
        fi
      fi
    fi
  fi
fi

# 5. 版本记录
LATEST_SHA=$(curl -sSf "https://api.github.com/repos/${REPO}/commits/main" 2>/dev/null | grep -m1 '"sha"' | cut -d'"' -f4 || echo "latest")
CURRENT_VERSION="${LATEST_SHA:0:7}"
if [ -f "$VERSION_FILE" ]; then
  PREVIOUS_VERSION=$(cat "$VERSION_FILE")
  if [ -n "$PREVIOUS_VERSION" ] && [ "$PREVIOUS_VERSION" != "$CURRENT_VERSION" ]; then
    echo "$PREVIOUS_VERSION" >> "$VERSION_FILE.history"
  fi
fi
echo "$CURRENT_VERSION" > "$VERSION_FILE"
info "版本: $CURRENT_VERSION"

# 6. 拉取并启动
info "拉取镜像..."
docker compose pull
info "启动服务..."
docker compose up -d

# 7. 健康检查
info "等待服务启动..."
waited=0
while [ $waited -lt $MAX_WAIT ]; do
  if curl -sf "$HEALTH_URL" > /dev/null 2>&1; then
    echo ""
    ok "部署成功！"
    echo ""
    info "访问: http://$(hostname -I 2>/dev/null | awk '{print $1}' || echo '<服务器IP>'):8080"
    info "数据: $DEPLOY_DIR/data/prisma/db"
    info "备份: $DEPLOY_DIR/backups"
    info "版本: $CURRENT_VERSION"
    echo ""
    info "回滚:    cd $DEPLOY_DIR && bash scripts/deploy.sh --rollback"
    info "恢复DB:  bash scripts/restore-backup.sh"
    info "更新:    cd $DEPLOY_DIR && docker compose pull && docker compose up -d"
    exit 0
  fi
  sleep 2
  waited=$((waited + 2))
  echo -n "."
done

echo ""
fail "服务未就绪，检查日志: docker compose logs wbti"
