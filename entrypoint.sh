#!/bin/sh
set -e

echo "[entrypoint] Updating yt-dlp..."
yt-dlp -U || echo "[entrypoint] yt-dlp update check failed, continuing with current version"

exec "$@"
