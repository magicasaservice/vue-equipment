FROM node:22-slim AS base
RUN corepack enable

FROM base AS deps
WORKDIR /app
# better-sqlite3 is the @nuxt/content connector; the toolchain covers
# platforms it ships no prebuilt binary for
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/docs/package.json ./apps/docs/
COPY packages/composables/package.json ./packages/composables/
COPY packages/fonts/package.json ./packages/fonts/
COPY packages/metadata/package.json ./packages/metadata/
COPY packages/mirror-compat/package.json ./packages/mirror-compat/
COPY packages/nuxt/package.json ./packages/nuxt/
COPY packages/nuxt/playground/package.json ./packages/nuxt/playground/
COPY packages/plugins/package.json ./packages/plugins/
COPY packages/utils/package.json ./packages/utils/
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

FROM deps AS builder
WORKDIR /app
COPY . .
# The turbo graph gates every build on the test suites, browser tests
# included. The docs read the plugin sources directly, so no package needs a
# build of its own: the tokens and the metadata index are all they need.
RUN pnpm tokens \
    && pnpm --filter metadata run update
RUN NODE_OPTIONS="--max-old-space-size=4096" pnpm --filter docs build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/docs/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
