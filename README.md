# Task Management App

Full-stack task management application developed as a technical test for Full Stack Developer position. The project demonstrates best practices in architecture, component design, and frontend-backend communication.

## 📋 About the Project

This project was developed following the requirements of a technical test that evaluates:
- ✅ Backend REST API design
- ✅ Frontend component design
- ✅ Communication between frontend and backend
- ✅ Clean, structured, and well-organized code
- ✅ Trade-offs and architectural decisions

## 🚀 Technologies Used

### Backend
- **ASP.NET Core 10** - Web framework
- **Entity Framework Core 10** - ORM with InMemory database
- **Minimal APIs** - Simplified REST endpoints
- **Clean Architecture** - Layer separation (Domain, Application, Infrastructure, API)
- **xUnit** - Unit testing

### Frontend
- **Angular 21** - Frontend framework
- **Angular Material 21** - UI component library
- **Standalone Components** - Modern Angular architecture
- **Signals** - Reactive state management

## 📁 Project Structure

```
TaskManagementApp/
├── Backend/
│   ├── Tasks.Api/              # Presentation layer (Minimal APIs)
│   ├── Tasks.Application/      # Business logic and use cases
│   ├── Tasks.Domain/           # Domain entities and rules
│   ├── Tasks.Infrastructure/   # Data access and persistence
│   └── Tasks.Tests/            # Unit tests
└── Frontend/
    └── tasks-app/              # Angular application
        ├── src/app/
        │   ├── components/     # Reusable components
        │   ├── services/       # HTTP services
        │   ├── interceptors/   # HTTP interceptors
        │   └── models/         # TypeScript interfaces
        └── proxy.conf.json     # Proxy configuration for dev
```

## 🎯 Implemented Features

### Core Requirements
- ✅ **List tasks** - View all registered tasks
- ✅ **Create task** - Add new task with title
- ✅ **Toggle status** - Mark/unmark task as completed
- ✅ **Delete task** - Remove task from list

### Additional Features
- ✅ **Duplicate validation** - Prevents creating tasks with duplicate titles
- ✅ **Input validation** - Validates required and non-empty title
- ✅ **Global error handling** - Custom middleware on backend
- ✅ **Error interceptor** - HTTP error handling on frontend
- ✅ **Visual feedback** - Snackbars and loading spinners
- ✅ **Confirmation dialogs** - Confirmation before deleting tasks
- ✅ **Structured logging** - Logs of important operations
- ✅ **Result Pattern** - Error handling without exceptions
- ✅ **Unit tests** - Coverage of main use cases
- ✅ **Docker support** - API containerization

## 🏗️ Architecture

### Backend - Clean Architecture

The backend follows Clean Architecture principles with clear separation of concerns:

- **Tasks.Domain**: Domain entities (`TaskItem`)
- **Tasks.Application**: Interfaces, services, and business logic (`ITaskService`, `TaskService`)
- **Tasks.Infrastructure**: Repository implementation and data access (`TaskRepository`, `TasksDbContext`)
- **Tasks.Api**: REST endpoints, middleware, and configuration

**Patterns used:**
- Repository Pattern
- Dependency Injection
- Result Pattern (for error handling)
- Global Exception Middleware

### Frontend - Component-Based Architecture

The frontend uses Angular's standalone component-based architecture:

- **Components**: `TaskList`, `TaskForm`, `ConfirmDialog`, `AlertDialog`
- **Services**: `TaskService` (HTTP communication)
- **Interceptors**: `ErrorInterceptor` (global error handling)
- **Signals**: Reactive state management

## 🔧 Setup and Running

### Prerequisites
- **.NET SDK 10** or higher
- **Node.js 20+** and npm
- **(Optional) Docker** for containerization

### Backend

1. Navigate to the backend folder:
```bash
cd Backend
```

2. Run the API:
```bash
dotnet run --project Tasks.Api --urls http://localhost:5072
```

The API will be available at `http://localhost:5072`

### Frontend

1. Navigate to the frontend folder:
```bash
cd Frontend/tasks-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm start
```

The application will be available at `http://localhost:4200`

**Notes:**
- Proxy is configured to redirect `/api` to `http://localhost:5072`
- Hot reload is enabled for development

### Production Build

**Frontend:**
```bash
cd Frontend/tasks-app
npm run build
```
Compiled files will be in `dist/tasks-app/browser/`

## 🧪 Tests

### Backend - Unit Tests

Run the `TaskService` tests:
```bash
cd Backend
dotnet test Tasks.sln
```

## 🐳 Docker

### Build the image:
```bash
cd Backend
docker build -t tasks-api .
```

### Run container:
```bash
docker run -p 5072:5072 tasks-api
```

The API will be available at `http://localhost:5072`

## 📡 API Endpoints

**Base URL:** `http://localhost:5072/api/tasks`

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| `GET` | `/api/tasks` | List all tasks | - |
| `POST` | `/api/tasks` | Create a new task | `{ "title": "Task title" }` |
| `PUT` | `/api/tasks/{id}/toggle` | Toggle completion status | - |
| `DELETE` | `/api/tasks/{id}` | Remove a task | - |

## 💡 Technical Decisions and Trade-offs

### Backend

**✅ Choices:**
- **EF Core InMemory**: Simplicity for demonstration, no database setup needed
- **Minimal APIs**: More concise and direct code for simple APIs
- **Result Pattern**: Avoids exceptions for expected business flows
- **Clean Architecture**: Clear separation of concerns and testability

**⚠️ Trade-offs:**
- InMemory doesn't persist data between restarts (suitable for demo)
- Open CORS (development only)
- No authentication/authorization (out of scope)

### Frontend

**✅ Choices:**
- **Standalone Components**: Modern Angular architecture, no modules
- **Signals**: Reactive and performant state management
- **Angular Material**: Ready-to-use and accessible components
- **Interceptors**: Centralized HTTP error handling

**⚠️ Trade-offs:**
- Duplicate validation on frontend (could be backend only)
- No pagination (suitable for small data volume)
- No local persistence (always fetches from server)

## 📝 Implementation Notes

### What was implemented beyond requirements:
1. **Robust validation** - Duplicate titles, empty fields
2. **Complete visual feedback** - Loading states, confirmations, alerts
3. **Error handling** - Global on backend and frontend
4. **Logging** - Important operations logged
5. **Unit tests** - Coverage of main cases
6. **Docker** - API containerization
8. **Task deletion** - Useful additional feature