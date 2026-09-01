# 📋 Task Tracking System

A full-stack web application to manage projects and tasks easily. It has a modern Kanban board, list view, user roles, and dark/light mode.

---

## 🌟 Key Features

- **Task Management**: Create, update, view, and delete tasks (CRUD).
- **Multiple Views**:
  - **Kanban Board**: Drag or move tasks across columns (To Do, In Progress, In Review, Done).
  - **List View**: View tasks in a clean table with search and filters.
- **Projects**: Group tasks by project.
- **User Roles & Authentication**:
  - **Admin**: Full access across projects and users.
  - **Project Manager**: Create and manage projects and tasks.
  - **Developer**: View assigned tasks and update status.
- **Dark / Light Theme**: Easily toggle between dark and light modes.
- **Responsive UI**: Works smoothly on desktops and mobile screens.

---

## 🛠️ Tech Stack

### Backend
- **ASP.NET Core Web API** (.NET 8)
- **Entity Framework Core (EF Core)**: Object-Relational Mapper (ORM)
- **Microsoft SQL Server**: Relational Database
- **Swagger / OpenAPI**: Interactive API testing documentation

### Frontend
- **Angular**: Modern standalone components with Signals for state management
- **TypeScript & CSS**: Clean styling with dark mode support
- **RxJS / HttpClient**: For calling backend REST APIs

---

## 📁 Project Structure

Here is an easy guide to where files are located:

```text
task-tracking-system/
│
├── web-api/                            # Backend Project (.NET 8 Web API)
│   ├── Controllers/                    # Handles HTTP requests & API routes
│   │   ├── AuthController.cs           # User registration and login endpoints
│   │   ├── ProjectsController.cs       # Project management endpoints
│   │   └── TaskController.cs           # Task management endpoints
│   ├── Data/                           # Database setup
│   │   └── AppDbContext.cs             # EF Core Database Context & tables
│   ├── Middleware/                     # Custom request/response handling
│   │   └── GlobalExceptionMiddleware.cs# Global error handling
│   ├── Models/                         # Data models & classes
│   │   ├── DTOs/                       # Data Transfer Objects (request/response schemas)
│   │   ├── Project.cs                  # Project database entity
│   │   ├── TaskItem.cs                 # Task database entity
│   │   └── User.cs                     # User database entity
│   ├── Services/                       # Business logic layer
│   │   ├── Interfaces/                 # Service contracts (ITaskService, etc.)
│   │   └── Implementations/            # Service logic (TaskService, etc.)
│   ├── Migrations/                     # EF Core database migration files
│   ├── appsettings.json                # Database connection string & settings
│   └── Program.cs                      # App startup, dependency injection & CORS
│
├── frontend/                           # Frontend Project (Angular)
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/             # Reusable UI components
│   │   │   │   ├── sidebar/            # Navigation sidebar & project switcher
│   │   │   │   ├── task-board/         # Kanban board view
│   │   │   │   ├── task-list/          # Table / list view with filters
│   │   │   │   └── task-modal/         # Modal popup to add/edit tasks
│   │   │   ├── models/                 # TypeScript interfaces & types
│   │   │   │   ├── project.model.ts    # Project data type
│   │   │   │   ├── task.model.ts       # Task data type
│   │   │   │   └── user.model.ts       # User & role data types
│   │   │   ├── services/               # API communication services
│   │   │   │   ├── auth.service.ts     # Login & user state service
│   │   │   │   ├── project.service.ts  # Project API calls
│   │   │   │   └── task.service.ts     # Task API calls
│   │   │   ├── app.ts                  # Main dashboard component logic
│   │   │   ├── app.html                # Main application layout
│   │   │   └── app.css                 # Main styles
│   │   ├── styles.css                  # Global CSS tokens & themes
│   │   └── index.html                  # HTML entry point
│   ├── angular.json                    # Angular workspace configuration
│   └── package.json                    # Frontend dependencies & npm scripts
│
└── README.md                           # Project guide (this file)
```
