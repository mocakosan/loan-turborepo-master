# Node 22.16.0 버전 사용
FROM node:22
 
# 작업 디렉토리 설정
WORKDIR /usr/src/app

# pnpm 설치
RUN npm install -g pnpm@9.0.0

# 루트 package.json, pnpm lockfile, workspace 설정 복사
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# apps/api의 package.json 복사
COPY apps/api/package.json ./apps/api/package.json

# 의존성 설치 (workspace 전체)
RUN pnpm install --frozen-lockfile

# Copy app source
COPY . .

# 앱 빌드 (api 워크스페이스만)
RUN pnpm run build --filter=api
 
# NestJS API 포트
EXPOSE 3000
 
# NestJS 실행
CMD ["node", "apps/api/dist/main"]

# 도커파일 빌드
# docker build --platform linux/amd64 -t ghcr.io/doob9p/api-app:1.0.2 -f apps/api/Dockerfile .

# 깃헙 컨테이너 레지스트리
# docker build --platform linux/amd64 -t ghcr.io/[username]/api-app:1.0.0 -f apps/api/Dockerfile .


