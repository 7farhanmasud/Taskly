# Taskly 🚀

Taskly is a lightweight, responsive full-stack project and task management application built using clean MVC (Model-View-Controller) architecture guidelines. The project features a native asynchronously-driven frontend interacting with a secure Node.js, Express, and MongoDB backend framework, packed with a fluid Day/Night theme engine and an interactive Kanban board task workflow system.

## 🌟 Key Features

- **Robust Authentication:** Secure account creation and login workflows utilizing JSON Web Tokens (JWT) and `bcryptjs` for industry-standard password hashing.
- **Dynamic Kanban Dashboard:** Interactive, status-segregated workflows rendering tasks automatically across custom columns (`Pending`, `In Progress`, `Completed`).
- **Interactive Day & Night Modes:** Smooth transitions switching between a crisp modern layout theme and a high-contrast deep tech dark mode configuration.
- **Project Configuration Ports:** Workspace organization features letting teams initialize distinct project boards, remove outdated workflows, and assign milestones.
- **Real-Time Context Collaboration:** Instant inline comment streaming under targeted task containers enabling fluid developer updates.
- **Strict Parameter Security:** Input sanitization parameters applied frontend-wide blocking cross-site scripting (XSS) code injection vulnerabilities.

---

## 🛠️ Tech Stack & System Architecture

### Backend Core
- **Runtime Environment:** Node.js
- **Web Framework:** Express.js (utilizing modern path-to-regexp parsing fallbacks)
- **Database Engine:** MongoDB (Object Modeling via Mongoose ODM)
- **Security & Authorization:** JSON Web Tokens (JWT) & Bcrypt password encryption

### Frontend Interface
- **Layout & Presentation:** Modern Semantic HTML5, CSS Grid / Flexbox variables
- **Logic Engine:** Vanilla JavaScript (Native Fetch API asynchronous handlers)

---

## 📂 Project Directory Layout

```text
Taskly/
├── client/                      # Frontend Client Static Assets
│   ├── css/
│   │   └── style.css            # Unified Light/Dark Style Sheets
│   ├── js/
│   │   ├── api.js               # Global Fetch Async API Utility Wrapper
│   │   ├── login.js             # Authentication Management Script
│   │   ├── register.js          # User Registration Handler
│   │   └── home.js              # Core Dashboard & Kanban Board Controller
│   ├── login.html               # User Login Screen Layout
│   ├── register.html            # User Sign-Up Layout
│   └── home.html                # Workspace Hub Matrix
└── server/                      # Backend Core API Framework
    ├── config/
    │   └── db.js                # Database Connection Configuration
    ├── middleware/
    │   └── authMiddleware.js    # Secure Route Token Validation Interceptor
    ├── models/
    │   ├── User.js              # Account Collections Mapping Schema
    │   ├── Project.js           # Project Boards Storage Schema
    │   ├── Task.js              # Workspace Objectives Schema
    │   └── Comment.js           # Collaboration Logging Schema
    ├── routes/
    │   ├── authRoutes.js        # Authentication Handlers Routing Map
    │   ├── projectRoutes.js     # Project Configuration Routing Map
    │   ├── taskRoutes.js        # Task Parameter Operations Map
    │   └── commentRoutes.js     # Collaborative Notes Routing Map
    ├── .env                     # Local Environment Parameters Config
    ├── package.json             # Core Dependency Management File
    └── server.js                # Primary System Bootstrap Hook
