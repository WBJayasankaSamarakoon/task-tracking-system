# 🚀 Task Tracking System

A modern, full-stack **Task Tracking System** built with **ASP.NET Core Web API** (Backend), **Angular** (Frontend), and **Microsoft SQL Server** (Database).

---

## 🛠️ Tech Stack

### 🖥️ Backend (.NET Web API)
- **Framework**: ASP.NET Core (.NET 8.0)
- **ORM**: Entity Framework Core (`Microsoft.EntityFrameworkCore.SqlServer`)
- **Database**: Microsoft SQL Server
- **API Documentation**: Swagger / OpenAPI

### 🎨 Frontend (Angular)
- **Framework**: Angular (Standalone Components, Signals & Computed State)
- **Styling**: Tailwind CSS & Custom Design System

---

## 📁 Project Architecture & Folder Structure

```text
task-tracking-system/
│
├── web-api/                          # ASP.NET Core Web API Project
│   ├── Controllers/
│   │   └── TasksController.cs        # REST API Endpoints (CRUD)
│   ├── Data/
│   │   └── AppDbContext.cs           # EF Core Database Context & DbSets
│   ├── Models/
│   │   └── TaskItem.cs               # Database Entity Model
│   ├── appsettings.json              # Connection strings & App configuration
│   └── Program.cs                    # Dependency Injection, Middleware & CORS
│
├── frontend/                         # Angular Client Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── app.ts                # Main component logic, signals & theme management
│   │   │   ├── app.html              # Modern workspace UI (Sidebar, Views, Modal)
│   │   │   ├── app.css               # Component micro-styles & animations
│   │   │   └── app.config.ts         # App providers & routes
│   │   ├── styles.css                # Global CSS tokens & Dark/Light mode rules
│   │   └── index.html                # App entry point & Inter font setup
│   ├── angular.json
│   └── package.json
│
└── README.md                         # Project documentation
```

---

