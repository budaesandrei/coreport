FROM node:22-alpine

WORKDIR /app

# npm is used here because the imported project has a package-lock.json.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
