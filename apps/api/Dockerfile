# Node 22.16.0 버전 사용
FROM node:22
 
# 작업 디렉토리 설정
WORKDIR /usr/src/app

# pnpm 설치
RUN npm install -g pnpm@9.0.0

# 루트 package.json, pnpm lockfile, workspace 설정 복사
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# turbo.json 복사
COPY turbo.json ./

# apps/api의 package.json 복사
COPY apps/api/package.json ./apps/api/package.json

# packages의 package.json 복사
COPY packages/database/package.json ./packages/database/
COPY packages/ui/package.json ./packages/ui/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/eslint-config/package.json ./packages/eslint-config/

# 의존성 설치 (workspace 전체)
RUN pnpm install --frozen-lockfile

# 소스 코드 복사
COPY . .

# Prisma 생성을 위한 임시 환경 변수 설정
ENV DATABASE_URL="postgresql://user:password@localhost:5432/db"
ENV DIRECT_URL="postgresql://user:password@localhost:5432/db"

# Prisma 클라이언트 생성 (올바른 문법)
RUN pnpm --filter=@repo/db run db:generate

# 데이터베이스 패키지 빌드
RUN pnpm --filter=@repo/db run build

# 앱 빌드 (api 워크스페이스만)
RUN pnpm --filter=api run build

# NestJS API 포트
EXPOSE 3000

# NestJS 실행
CMD ["node", "apps/api/dist/main"]