#!/bin/bash
set -e

BACKUP_DIR="/home/wbti/data/backups"
DB_PATH="/home/wbti/data/prisma/db/wbti.db"

echo "=== 数据库恢复工具 ==="
echo ""

if [ ! -d "$BACKUP_DIR" ]; then
  echo "错误: 备份目录不存在: $BACKUP_DIR"
  exit 1
fi

mapfile -t backups < <(find "$BACKUP_DIR" -maxdepth 1 -name "*.db.gz" -type f -print0 | sort -zr | xargs -0 -n1 echo)

if [ ${#backups[@]} -eq 0 ]; then
  echo "错误: 没有找到备份文件"
  exit 1
fi

echo "可用备份:"
for i in "${!backups[@]}"; do
  backup_file="${backups[$i]}"
  backup_date=$(stat -c %y "$backup_file" 2>/dev/null || stat -f "%Sm" "$backup_file")
  backup_size=$(du -h "$backup_file" | cut -f1)
  echo "  [$i] $(basename "$backup_file") ($backup_size) - $backup_date"
done
echo ""

if [ -n "$1" ]; then
  selected_backup="$1"
  if [ ! -f "$selected_backup" ]; then
    echo "错误: 备份文件不存在: $selected_backup"
    exit 1
  fi
else
  read -p "选择备份编号 (默认 0): " selection
  selection=${selection:-0}

  if ! [[ "$selection" =~ ^[0-9]+$ ]]; then
    echo "错误: 请输入数字"
    exit 1
  fi

  if [ "$selection" -ge "${#backups[@]}" ] || [ "$selection" -lt 0 ]; then
    echo "错误: 无效的选择"
    exit 1
  fi
  selected_backup="${backups[$selection]}"
fi

echo ""
echo "选择的备份: $(basename "$selected_backup")"
echo ""

read -p "这将覆盖当前数据库，确定继续吗？(y/N): " confirm
if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
  echo "已取消"
  exit 0
fi

echo ""
echo "停止服务..."
cd /home/wbti
docker compose stop wbti

if [ -f "$DB_PATH" ]; then
  current_backup="$DB_PATH.before-restore.$(date +%Y%m%d%H%M%S)"
  cp "$DB_PATH" "$current_backup"
  echo "已备份当前数据库: $(basename "$current_backup")"
fi

echo "恢复数据库..."
gunzip -c "$selected_backup" > "$DB_PATH"

if ! sqlite3 "$DB_PATH" "PRAGMA integrity_check;" > /dev/null 2>&1; then
  echo "警告: 数据库完整性检查失败"
fi

echo "数据库已恢复"

echo "启动服务..."
docker compose start wbti

sleep 10

if curl -sf http://localhost:8080 > /dev/null 2>&1; then
  echo ""
  echo "恢复成功！服务已正常运行"
else
  echo ""
  echo "服务可能未正常启动，请检查日志:"
  echo "    docker compose logs wbti"
fi
