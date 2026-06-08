# 🚼 DevPulse

> **Internal Tech Issue & Feature Tracker**
> 
> *A collaborative backend platform for software teams to report bugs, suggest features, and coordinate resolutions.*

DevPulse is a robust RESTful API built with **Node.js**, **Express**, and **TypeScript**. It utilizes a **PostgreSQL** database accessed via raw SQL queries (`pg` driver) to manage users and track issues efficiently. The project follows a clean **Controller-Service architecture**, ensuring a scalable and maintainable codebase.

✅ Live Deployment URL: https://devpulse-iums.onrender.com

---

## 🛠️ Technology Stack

- **Runtime:** Node.js 
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL (Neon DB)
- **Database Driver:** Native `pg` (Raw SQL)
- **Authentication:** JSON Web Tokens (JWT)
- **Security:** `bcryptjs` for password hashing

---

## 👥 User Roles & Permissions

DevPulse uses a Role-Based Access Control (RBAC) system:

| Role | Permissions |
| --- | --- |
| **Contributor** | • Register and log in<br>• Create new issues (bug or feature requests)<br>• View all issues<br>• Update fields on their *own* issues |
| **Maintainer** | • All contributor permissions<br>• Update *any* issue field<br>• Delete *any* issue<br>• Change issue workflow status (`open`, `in_progress`, `resolved`) |

---

## 🌐 API Endpoints Specification

### 🔹 Authentication Module

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Register a new user (`contributor` or `maintainer`) | Public |
| `POST` | `/api/auth/login` | Authenticate user and receive JWT tokens | Public |
| `POST` | `/api/auth/refresh-token` | Obtain a new access token using a refresh token | Public |

### 🔹 Issues Module

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| `POST` | `/api/issues` | Create a new issue | Protected |
| `GET` | `/api/issues` | Get all issues (supports `?type=`, `?status=`, `?sort=`) | Public |
| `GET` | `/api/issues/:id` | Get a specific issue by ID (includes reporter details) | Public |
| `PATCH`| `/api/issues/:id` | Update an issue | Protected (Owner / Maintainer) |
| `DELETE`|`/api/issues/:id` | Delete an issue | Protected (Maintainer Only) |

---

## 🗄️ Database Schema

The database relies on raw SQL via the `pg` pool.

- **`users` Table:** Stores user accounts, hashed passwords, and roles (`contributor` or `maintainer`).
- **`issues` Table:** Stores issue entries (`bug` or `feature_request`), descriptions, statuses (`open`, `in_progress`, `resolved`), and references the `reporter_id`.

---

## 🏗️ Architecture

The codebase relies heavily on the **Controller-Service Pattern**:
- **Routes (`*.route.ts`):** Defines HTTP endpoints and attaches middleware.
- **Controllers (`*.controller.ts`):** Handles HTTP requests, extracts parameters/body, and formats the standard JSON response using `sendSuccess`.
- **Services (`*.service.ts`):** Contains the core business logic, executes raw SQL database queries, and throws `CustomError` exceptions when rules are violated.
- **Middlewares (`auth.middleware.ts`, `globalErrorHandler.ts`):** Verifies JWT tokens, enforces role boundaries, and centrally formats error responses.

---

## 📂 Project Structure

```text
src/
├── config/
│   └── index.ts        
├── db/
│   └── schema.ts    
├── middleware/
│   ├── auth.middleware.ts
│   ├── globalErrorHandler.ts
│   ├── index.d.ts     
│   └── logger.ts
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.interface.ts
│   │   ├── auth.route.ts
│   │   └── auth.service.ts
│   └── issues/
│       ├── issues.controller.ts
│       ├── issues.route.ts
│       └── issues.service.ts
├── utils/
│   ├── catchAsync.ts    
│   ├── customError.ts  
│   └── response.ts      
├── app.ts               
└── server.ts          
```

---

## 👥 Author

**Abdur Rahman Faisal**  
*Software and Data Enthusiast | CSE Undergraduate @ SEU*

- **Email:** arfaisal463@gmail.com
- **LinkedIn:** [linkedin.com/in/abdur-rahman-faisal](https://www.linkedin.com/in/abdur-rahman-faisal/)
- **GitHub:** [github.com/arfaisal043](https://github.com/arfaisal043)

---
