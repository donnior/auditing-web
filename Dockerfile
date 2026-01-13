FROM oven/bun:1.3.6 as build

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

# COPY .npmrc /app/.npmrc
COPY package.json /app/package.json
COPY bun.lock /app/bun.lock

RUN bun install
COPY . /app
RUN bun run build

FROM caddy:2.5.2
WORKDIR /srv

COPY --from=build /app/build /srv
COPY Caddyfile /etc/caddy/Caddyfile
