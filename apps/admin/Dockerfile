# Node 22.16.0 버전 사용
FROM node:22

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# pnpm 설치
RUN npm install -g pnpm@9.0.0

# 루트 package.json, pnpm lockfile, workspace 설정 복사
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# apps/admin의 package.json 복사
COPY apps/admin/package.json ./apps/admin/package.json

# 의존성 설치
RUN pnpm install --frozen-lockfile

# 소스 복사
COPY . .

# 앱 빌드 (admin 워크스페이스만)
RUN pnpm run build --filter=admin

# Next.js는 기본적으로 4001 포트를 사용
EXPOSE 4001

# 작업 디렉토리 재설정
WORKDIR /usr/src/app/apps/admin

# 앱 실행 (Next.js는 start로 실행)
CMD ["pnpm", "dlx", "next", "start", "--port", "4001"]

# 도커파일 빌드
# docker build --platform linux/amd64 -t ghcr.io/doob9p/admin-app:1.0.2 -f apps/admin/Dockerfile .

# 깃헙 컨테이너 레지스트리
# docker build --platform linux/amd64 -t ghcr.io/[username]/admin-app:1.0.0 -f apps/admin/Dockerfile .

