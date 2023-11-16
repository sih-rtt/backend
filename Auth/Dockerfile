FROM node:latest
WORKDIR /app
COPY . .
RUN npm install
RUN npx prisma generate
CMD ["npm","run","auth"]
EXPOSE 3000
