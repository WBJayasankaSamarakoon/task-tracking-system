# 📋 Task Tracking System

A full-stack web application to manage projects and tasks easily. It has a modern Kanban board, list view, user roles, and dark/light mode.

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
├── web-api/                             
│   ├── Controllers/                     
│   │   ├── AuthController.cs            
│   │   ├── ProjectsController.cs        
│   │   └── TaskController.cs            
│   ├── Data/                            
│   │   └── AppDbContext.cs              
│   ├── Middleware/                      
│   │   └── GlobalExceptionMiddleware.cs 
│   ├── Models/                          
│   │   ├── DTOs/                        
│   │   ├── Project.cs                   
│   │   ├── TaskItem.cs                  
│   │   └── User.cs                      
│   ├── Services/                        
│   │   ├── Interfaces/                  
│   │   └── Implementations/             
│   ├── Migrations/                      
│   ├── appsettings.json                 
│   └── Program.cs                       
│
├── frontend/                            
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/              
│   │   │   │   ├── sidebar/              
│   │   │   │   ├── task-board/          
│   │   │   │   ├── task-list/            
│   │   │   │   └── task-modal/           
│   │   │   ├── models/                  
│   │   │   │   ├── project.model.ts     
│   │   │   │   ├── task.model.ts        
│   │   │   │   └── user.model.ts        
│   │   │   ├── services/                
│   │   │   │   ├── auth.service.ts      
│   │   │   │   ├── project.service.ts   
│   │   │   │   └── task.service.ts      
│   │   │   ├── app.ts                   
│   │   │   ├── app.html                 
│   │   │   └── app.css                    
|   ├── styles.css                 
│   │   └── index.html                   
│   ├── angular.json                     
│   └── package.json                     
│
└── README.md                            
```
