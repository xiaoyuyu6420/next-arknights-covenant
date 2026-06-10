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
INSTALL_DIR="$HOME/wbti"
IMAGE="xiaoyuyu123/magical-girls-witch-trial:latest"
COMPOSE_URL="https://raw.githubusercontent.com/${REPO}/${BRANCH}/docker-compose.yml"

# --------------------------------------------------
# 1. Preflight checks
# --------------------------------------------------
info "检查运行环境..."

command -v docker >/dev/null 2>&1 || error "未安装 Docker，请先安装: https://docs.docker.com/engine/install/"
docker compose version >/dev/null 2>&1 || error "未安装 Docker Compose v2，请先安装"

# --------------------------------------------------
# 2. Configure Alibaba Cloud mirror (if in China)
# --------------------------------------------------
configure_mirror() {
  # 需要 root 权限配置镜像加速
  if [ "$(id -u)" -ne 0 ]; then
    warn "非 root 用户，跳过镜像加速配置（可选）"
    return 0
  fi

  if [ -f /etc/docker/daemon.json ] && grep -q "registry-mirrors" /etc/docker/daemon.json 2>/dev/null; then
    info "已检测到 Docker 镜像加速配置，跳过"
    return 0
  fi

  # 非交互式环境跳过
  if [ ! -t 0 ]; then
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

  # 验证 URL 格式，防止注入
  if [[ ! "$mirror_url" =~ ^https?://[a-zA-Z0-9./_-]+$ ]]; then
    error "无效的镜像地址格式"
  fi

  mkdir -p /etc/docker
  if [ -f /etc/docker/daemon.json ]; then
    # 使用 jq 合并配置（更安全）
    if command -v jq >/dev/null 2>&1; then
      jq --arg url "$mirror_url" '.registry-mirrors = [.url] + (.registry-mirrors // [])' \
        /etc/docker/daemon.json > /tmp/daemon.json.tmp && \
        mv /tmp/daemon.json.tmp /etc/docker/daemon.json
    else
      # 回退到简单追加（已验证格式，相对安全）
      echo "{\"registry-mirrors\":[\"$mirror_url\"]}" > /etc/docker/daemon.json
    fi
  else
    echo "{\"registry-mirrors\":[\"$mirror_url\"]}" > /etc/docker/daemon.json
  fi

  if command -v systemctl >/dev/null 2>&1; then
    systemctl daemon-reload
    systemctl restart docker
    info "Docker 镜像加速配置完成"
  else
    warn "非 systemd 系统，请手动重启 Docker 服务"
  fi
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
