FROM node:22-alpine

WORKDIR /app

# Use pnpm (preferred) and the existing pnpm-lock.yaml for reproducible installs.
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 3000
CMD ["pnpm", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
