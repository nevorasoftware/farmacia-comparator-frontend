FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80 8080
CMD ["/bin/sh", "-c", "if [ -n \"$PORT\" ] && [ \"$PORT\" != \"80\" ] && [ \"$PORT\" != \"8080\" ]; then sed -i \"s/listen 80;/listen ${PORT};/g\" /etc/nginx/conf.d/default.conf; fi && nginx -g 'daemon off;'"]
