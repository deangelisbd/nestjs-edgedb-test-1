FROM node:17.9-alpine3.14 AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --include=dev

RUN npm install glob rimraf

COPY . .

RUN npm run build

# FROM node:17.9-alpine3.14 as production

# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

# WORKDIR /usr/src/app

# COPY package*.json ./

# RUN npm install --production

# COPY . .

# COPY --from=development /usr/src/app/dist ./dist

# CMD ["node", "dist/main"]