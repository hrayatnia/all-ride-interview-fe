FROM node:20-slim AS build

WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
RUN npm install --save-dev copy-webpack-plugin --legacy-peer-deps

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]