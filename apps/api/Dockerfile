# Node Alpine 버전 사용
FROM node:22-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 필수 시스템 패키지 설치
RUN apk add --no-cache libc6-compat python3 make g++

# pnpm 설치
RUN npm install -g pnpm@9.0.0

# 패키지 파일 복사
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# workspace package.json 파일들 복사
COPY apps/api/package.json ./apps/api/
COPY packages/database/package.json ./packages/database/
COPY packages/ui/package.json ./packages/ui/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/eslint-config/package.json ./packages/eslint-config/

# 의존성 설치
RUN pnpm install --frozen-lockfile

# 소스 코드 복사
COPY . .

# Prisma 환경 변수 설정 (임시)
ENV DATABASE_URL="postgresql://temp:temp@localhost:5432/temp"
ENV DIRECT_URL="postgresql://temp:temp@localhost:5432/temp"

# 메모리 제한 증가하여 빌드
ENV NODE_OPTIONS="--max-old-space-size=2048"

# Prisma 생성 및 빌드
RUN pnpm --filter=@repo/db run db:generate && \
    pnpm --filter=@repo/db run build && \
    pnpm --filter=api run build

# Production 의존성만 유지
RUN pnpm prune --prod

# 불필요한 파일 제거
RUN rm -rf \
    .git \
    .gitignore \
    apps/api/src \
    packages/*/src \
    **/*.test.* \
    **/*.spec.*

# Non-root 사용자 생성
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 && \
    chown -R nestjs:nodejs /app

# 사용자 전환
USER nestjs

# 환경 변수 재설정
ENV NODE_ENV=production
ENV PORT=3000
ENV NODE_OPTIONS="--max-old-space-size=512"

# 포트 노출
EXPOSE 3000

# 헬스체크 (선택사항 - Railway에서 자동으로 처리하므로 제거 가능)
# HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
#     CMD node -e "require('http').get('http://localhost:3000/health', (r) => {r.statusCode === 200 ? process.exit(0) : process.exit(1)})" || exit 1

# 앱 실행
CMD ["node", "apps/api/dist/main"]