FROM ubi8/nodejs-20:1-22 AS build

USER root

RUN mkdir -p /app

# Set the working directory
WORKDIR /app

COPY . /app

RUN npm install -g npm@10.9.0

RUN npm install --legacy-peer-deps

# Generate the build of the application
RUN npm run build

# Stage 2: Serve app with nginx server
FROM ubi8/nginx-122:1-47

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/dist/fe-admin-tareas /usr/share/nginx/html

CMD nginx -g "daemon off;""