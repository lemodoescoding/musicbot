FROM node:22.12-bookworm-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

ENV YTDLP_DISABLE_DOWNLOAD=true

COPY package*.json ./
COPY patches ./patches
RUN npm ci

COPY . .

FROM node:22.12-bookworm-slim 

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 ffmpeg curl ca-certificates unzip \
    && rm -rf /var/lib/apt/lists/*

RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp

RUN curl -fsSL https://deno.land/install.sh | DENO_INSTALL=/usr/local sh

RUN mkdir -p /etc && echo '--remote-components ejs:github --cookies /app/cookies/scratch_cookies.txt --extractor-args "youtube:player_client=web_safari,web,ios_music,android_music" -f "bestaudio/best"' > /etc/yt-dlp.conf

ENV YTDLP_DISABLE_DOWNLOAD=true
ENV YTDLP_DIR=/usr/local/bin
ENV YTDLP_FILENAME=yt-dlp

COPY --from=builder /app/node_modules ./node_modules
RUN rm -rf /app/node_modules/@distube/yt-dlp/bin

COPY . .

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

RUN useradd app
RUN chown -R app:app /app

RUN chown app:app /usr/local/bin/yt-dlp
# for ytdlp signature function
RUN mkdir -p /home/app/.cache && chown -R app:app /home/app
RUN mkdir -p /app/cookies && chown -R app:app /app/cookies

USER app

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["node", "src/index.js"]
