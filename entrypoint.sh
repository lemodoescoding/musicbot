#!/bin/sh
set -e

echo "[entrypoint] Refreshing yt-dlp cookies from master..."
cp /app/cookies/master_cookies.txt /app/cookies/scratch_cookies.txt
chmod 600 /app/cookies/scratch_cookies.txt

echo "[entrypoint] Updating yt-dlp..."
yt-dlp -U || echo "[entrypoint] yt-dlp update check failed, continuing with current version"

exec "$@"
