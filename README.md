# Taskly

Taskly is a simple project and task management web application built with Node.js, Express, MongoDB, and vanilla JavaScript. It allows users to register, log in, create projects, assign tasks to other users, update task status, and add comments to tasks.

## Features

- User authentication with JWT
- User registration and login
- Create and delete projects
- Create tasks under a selected project
- Assign tasks to users by email
- Update task status: Pending, In Progress, Completed
- Add and view task comments
- Clean dashboard-style UI for managing work

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Authentication: JSON Web Tokens (JWT)

## Project Structure

```text
Taskly/
├── client/
│   ├── css/
│   ├── js/
│   ├── home.html
│   ├── login.html
│   └── register.html
└── server/
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── package.json
    └── server.js
```

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd Taskly
```

### 2. Install server dependencies

```bash
cd server
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `server` folder with the following variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

### 4. Run the application

Start the backend server:

```bash
npm run dev
```

Then open your browser and visit:

```text
http://localhost:5000
```

The app serves the frontend from the server, so no separate frontend build step is required.

## API Overview

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Projects
- `GET /api/projects`
- `POST /api/projects`
- `DELETE /api/projects/:id`

### Tasks
- `GET /api/tasks?project=projectId`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

### Comments
- `GET /api/comments/:taskId`
- `POST /api/comments`

## Notes

- This project is intended as a lightweight task management app for learning and demo purposes.
- Make sure MongoDB is running and accessible through the provided `MONGO_URI`.

## License

This project is licensed under the ISC License.
