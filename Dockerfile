FROM node:17.9-alpine3.14

WORKDIR /usr/src/app

CMD tail -f /dev/null

# COPY package*.json ./

# RUN npm install glob rimraf

# RUN npm install --include=dev

# COPY . .

# RUN npm run build

# FROM node:17.9-alpine3.14 as production

# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

# WORKDIR /usr/src/app

# COPY package*.json ./

# RUN npm install --production

# COPY . .

# COPY --from=development /usr/src/app/dist ./dist

# CMD ["node", "dist/main"]