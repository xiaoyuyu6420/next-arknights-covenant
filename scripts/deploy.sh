#!/usr/bin/env bash
set -euo pipefail

# ============================================================
#  WBTI 一键部署脚本
#  Usage: curl -sSL https://raw.githubusercontent.com/xiaoyuyu6420/next-arknights-covenant/main/scripts/deploy.sh | bash
# ============================================================

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

info()  { echo -e "${GREEN}[INFO]${NC} $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $*"; }
error() { echo -e "${RED}[ERROR]${NC} $*"; exit 1; }

REPO="xiaoyuyu6420/next-arknights-covenant"
BRANCH="main"
INSTALL_DIR="/opt/wbti"
IMAGE="xiaoyuyu123/magical-girls-witch-trial:latest"
COMPOSE_URL="https://raw.githubusercontent.com/${REPO}/${BRANCH}/docker-compose.yml"

# --------------------------------------------------
# 1. Preflight checks
# --------------------------------------------------
info "检查运行环境..."

command -v docker >/dev/null 2>&1 || error "未安装 Docker，请先安装: https://docs.docker.com/engine/install/"
docker compose version >/dev/null 2>&1 || error "未安装 Docker Compose v2，请先安装"

if [ "$(id -u)" -ne 0 ]; then
  error "请使用 root 用户或 sudo 执行此脚本"
fi

# --------------------------------------------------
# 2. Configure Alibaba Cloud mirror (if in China)
# --------------------------------------------------
configure_mirror() {
  if [ -f /etc/docker/daemon.json ] && grep -q "registry-mirrors" /etc/docker/daemon.json 2>/dev/null; then
    info "已检测到 Docker 镜像加速配置，跳过"
    return 0
  fi

  echo ""
  warn "检测到未配置 Docker 镜像加速"
  echo -n "是否配置阿里云镜像加速？[Y/n] "
  read -r setup_mirror
  case "${setup_mirror:-Y}" in
    [nN]*) return 0 ;;
  esac

  echo ""
  echo "  请前往 https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors 获取你的专属加速地址"
  echo "  格式如: https://xxxxx.mirror.aliyuncs.com"
  echo -n "  请输入加速地址 (留空跳过): "
  read -r mirror_url

  if [ -z "$mirror_url" ]; then
    warn "跳过镜像加速配置"
    return 0
  fi

  mkdir -p /etc/docker
  if [ -f /etc/docker/daemon.json ]; then
    # Merge into existing config
    python3 -c "
import json, sys
with open('/etc/docker/daemon.json') as f:
    cfg = json.load(f)
cfg.setdefault('registry-mirrors', [])
if '$mirror_url' not in cfg['registry-mirrors']:
    cfg['registry-mirrors'].insert(0, '$mirror_url')
with open('/etc/docker/daemon.json', 'w') as f:
    json.dump(cfg, f, indent=2)
" 2>/dev/null || echo "{\"registry-mirrors\":[\"$mirror_url\"]}" > /etc/docker/daemon.json
  else
    echo "{\"registry-mirrors\":[\"$mirror_url\"]}" > /etc/docker/daemon.json
  fi

  systemctl daemon-reload
  systemctl restart docker
  info "Docker 镜像加速配置完成"
}

configure_mirror

# --------------------------------------------------
# 3. Create install directory
# --------------------------------------------------
info "创建部署目录: ${INSTALL_DIR}"
mkdir -p "${INSTALL_DIR}/data/prisma/db"

# --------------------------------------------------
# 4. Download docker-compose.yml
# --------------------------------------------------
info "下载 docker-compose.yml ..."
curl -sSLf "${COMPOSE_URL}" -o "${INSTALL_DIR}/docker-compose.yml" || error "下载 docker-compose.yml 失败"

# --------------------------------------------------
# 5. Pull and start
# --------------------------------------------------
cd "${INSTALL_DIR}"

info "拉取镜像 ${IMAGE} ..."
docker compose pull

info "启动服务..."
docker compose up -d

# --------------------------------------------------
# 6. Done
# --------------------------------------------------
echo ""
info "========================================="
info "  部署完成!"
info "========================================="
echo ""
info "  应用地址:    http://$(hostname -I 2>/dev/null | awk '{print $1}' || echo '<服务器IP>'):8080"
info "  数据目录:    ${INSTALL_DIR}/data/prisma/db"
info "  备份目录:    ${INSTALL_DIR}/data/prisma/db/backups"
info "  Compose文件: ${INSTALL_DIR}/docker-compose.yml"
echo ""
info "  常用命令:"
info "    查看日志:  cd ${INSTALL_DIR} && docker compose logs -f"
info "    停止服务:  cd ${INSTALL_DIR} && docker compose down"
info "    更新部署:  cd ${INSTALL_DIR} && docker compose pull && docker compose up -d"
echo ""
