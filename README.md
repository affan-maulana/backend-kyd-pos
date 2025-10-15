---

# 📦 POS-KYD Backend API v1

![Node.js](https://img.shields.io/badge/node-%3E%3D16.x-green.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-%3E%3D12.x-blue.svg)

Backend API for POS-KYD built with **NestJS**, **TypeORM**, **PostgreSQL**, and **Swagger API Documentation**.

> **Author:** Dendy F
> **Status:** Development
> **Year:** 2025

---

## 📁 Project Structure

```
src/
├── common/              # Global helpers (guards, strategies, interceptors)
├── migrations/          # TypeORM database migrations
├── module/              # Main feature modules
├── repository/          # Database entities (TypeORM)
├── utils/               # Extra utilities (e.g., data-source.ts)
├── app.module.ts
├── main.ts              # App entry point (NestFactory)
```

---

## ⚙️ Environment Configuration (.env)

```env
HOST_DB=postgres
PORT_DB=5432
USERNAME_DB=postgres
PASSWORD_DB=postgres
NAME_DB=pos_kyd_db

PORT=3000
```

---

## ▶️ Running Locally

1️⃣ Install dependencies:

```bash
npm install
```

2️⃣ Run PostgreSQL (use Docker or local)

3️⃣ Start the app (development):

```bash
npm run start:dev
```

4️⃣ Open API Documentation:

```
http://localhost:3000/api-docs
```

---

## 📖 API Documentation - Swagger

* **Base URL:** `http://localhost:3000/api/v1`
* **Swagger UI:** `http://localhost:3000/api-docs`
* **Auth:** Bearer Token (Authorization header)

Example endpoints:

```
POST /api/v1/auth/login
```

---

## 🗃️ Database Migrations (TypeORM)

create an empty migration:

```bash
npm run typeorm -- migration:create src/migrations/migrationName
```

Run migration:

```bash
npm run migration:run
```

Revert last migration:

```bash
npm run migration:revert
```

---

## 🐳 Docker Support

### Dockerfile

```Dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
```

---

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    container_name: pos-kyd-backend
    ports:
      - "3000:3000"
    env_file:
      - .env
    depends_on:
      - postgres

  postgres:
    image: postgres:15-alpine
    container_name: pos-kyd-db
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: pos_kyd_db
    volumes:
      - posdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  posdata:
```


## 📌 Features Used

* ✅ **NestJS** (v10)
* ✅ **TypeORM** (v0.3.x)
* ✅ **PostgreSQL** (via Docker or local)
* ✅ **Swagger API Docs**
* ✅ **JWT Authentication**
* ✅ **Winston Logging**
* ✅ **CORS Enabled**

---

## 📖 Example API Response Format

```json
{
  "success": 200,
  "message": "Success",
  "data": { /* response data */ }
}
```

---

## Database
to backup database from db server you can use psql
```
psql --host=localhost --port=5432 --username=affanmaulana --dbname=pos_kyd -f /Users/affanmaulana/Downloads/POS-KYD-pos_kyd-202507061437.sql
```

## Nest Command CLI
| Kebutuhan                             | Command                                             |
| ------------------------------------- | --------------------------------------------------- |
| Generate module                       | `nest generate module users` atau `nest g mo users` |
| Generate controller                   | `nest g co users`                                   |
| Generate service                      | `nest g s users`                                    |
| Generate class (misalnya DTO)         | `nest g class users/dto/create-user.dto`            |
| Generate interface                    | `nest g interface users/interfaces/user`            |
| Generate guard                        | `nest g guard auth/jwt`                             |
| Generate pipe                         | `nest g pipe common/validation`                     |
| Generate interceptor                  | `nest g interceptor common/logging`                 |
| Generate middleware                   | `nest g middleware logger`                          |
| Generate provider (helper, util, dsb) | `nest g provider utils/helper`                      |
| Generate Entity                       | `nest g class repository/business-type.entity --no-spec`|
| Generate new module Resource          | `nest g resource module/outlet --no-spec` choose REST API > Yes| 

## Notes
Create migration
```
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate src/migrations/Users -d src/utils/data-source.ts
```

run migration
```
npm run migration:run
```

## Initial
```
$ npm i
$ npm run migration:run
$ npm run seeder:run
$ npm run start:dev
```

## 📃 License

License: **UNLICENSED**
Author: **Dendy F**

---

