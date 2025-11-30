# Bosch Task Manager

### Full-Stack Task Management Application (Angular + Flask)

The **Bosch Task Manager** is a full-stack application built with
**Angular** on the frontend and **Flask (Python)** on the backend.\
It allows authenticated users to manage their personal tasks in a
simple, fast, and secure way, following clean architectural principles
and Bosch-inspired UI styling.

The system supports JWT authentication, full task CRUD, user-based
access control, and a modular structure aligned with industry best
practices.

------------------------------------------------------------------------

## 1. Main Features

### Authentication

-   User registration\
-   Secure login with JWT\
-   Logout\
-   Access restricted to each user's own tasks

### Task Management

-   Create new tasks\
-   List all tasks belonging to the logged-in user\
-   Edit tasks\
-   Mark tasks as completed / not completed\
-   Delete tasks\
-   Responsive Angular UI with Bosch-themed styling

### Technical Architecture

-   REST API built with Flask\
-   ORM with SQLAlchemy\
-   JWT authentication layer\
-   Angular SPA with modular components\
-   Services, dependency injection, and routing\
-   CORS configuration\
-   Scalable folder structure

------------------------------------------------------------------------

##  2. Project Architecture

    /backend
       app.py
       config.py
       models/
       routes/
       utils/
       database.py
       create_db.py

    /frontend
       src/
          app/
             auth/
             tasks/
             services/
             components/

------------------------------------------------------------------------

##  3. Technologies Used

### Backend

-   Python 3.10+
-   Flask
-   Flask-JWT-Extended
-   SQLAlchemy ORM
-   Werkzeug Security
-   SQLite / PostgreSQL compatible

### Frontend

-   Angular 18+
-   TypeScript
-   Angular Material (optional)
-   Custom SCSS / Tailwind (Bosch style)

------------------------------------------------------------------------

## 4. Prerequisites

### System Requirements

-   Node.js LTS\
-   Angular CLI\

``` bash
npm install -g @angular/cli
```

-   Python 3.10+\
-   pip + virtualenv

------------------------------------------------------------------------

## 5. Installation & Execution

# Backend (Flask API)

### 1. Navigate to the backend folder:

``` bash
cd backend
```

### 2. Create a virtual environment:

``` bash
python -m venv venv
```

### 3. Activate the environment:

``` bash
source venv/bin/activate       # Mac/Linux
venv\Scripts\activate          # Windows
```

### 4. Install dependencies:

``` bash
pip install -r utils/requirements.txt
```

### 5. Create the database:

``` bash
python create_db.py
```

### 6. Run the backend:

``` bash
python app.py
```

------------------------------------------------------------------------

# 6. Frontend (Angular)

### 1. Navigate to the frontend folder:

``` bash
cd frontend
```

### 2. Install packages:

``` bash
npm install
```

### 3. Run the Angular app:

``` bash
ng serve --open
```

The application will be available at:

    http://localhost:4200

------------------------------------------------------------------------

## 7. REST API Endpoints

### Authentication

  Method   Route                  Description
  -------- ---------------------- -----------------------------
  POST     `/api/auth/register`   Register a new user
  POST     `/api/auth/login`      Authenticate and return JWT

### Tasks (Private)

  Method   Route               Description
  -------- ------------------- ------------------------------------------
  GET      `/api/tasks`        Retrieve tasks of the authenticated user
  POST     `/api/tasks`        Create a new task
  PUT      `/api/tasks/<id>`   Update an existing task
  DELETE   `/api/tasks/<id>`   Delete a task

------------------------------------------------------------------------

## 8. Testing the System

-   Test `/api/health`
-   Register → Login → Copy JWT
-   List user tasks
-   Create a task
-   Edit a task or mark as completed
-   Delete a task

------------------------------------------------------------------------

## 9. Troubleshooting

### CORS errors

Ensure the backend allows Angular origin:

``` python
from flask_cors import CORS
CORS(app)
```

### Invalid or expired JWT

-   Token may be expired\
-   Check `Authorization: Bearer <token>` header

### Database not created

Run:

``` bash
python create_db.py
```

### Angular cannot reach the backend

Check `environment.ts`:

``` ts
apiUrl: 'http://localhost:500/api/health'
```

------------------------------------------------------------------------

## 10. Author

**Nuno Figueiredo**\
Full-Stack Developer -- Angular & Python\
GitHub: https://github.com/nunasf\
LinkedIn: https://www.linkedin.com/in/nuno-andre-figueiredo/

------------------------------------------------------------------------

## 11. License
This project is provided for professional evaluation purposes.
