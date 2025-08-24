module.exports = {
  apps: [
    {
      namespace: "loan-turborepo",
      name: "api",
      script: "pnpm run start",
      cwd: "./apps/api",
      env: {
        NODE_ENV: "production",
      },
      watch: false,
    },
    {
      namespace: "loan-turborepo",
      name: "admin",
      script: "pnpm run start --port 3001",
      cwd: "./apps/admin",
      env: {
        NODE_ENV: "production",
      },
      watch: false,
    },
  ],
};
