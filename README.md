# MeetFlow AI – Modern AI-Powered Meeting Management SaaS

MeetFlow AI is a production-ready, full-stack AI-powered meeting management application designed to streamline meeting organization, automated AI summarization, note taking, and actionable task management.

---

## Features

- **User Authentication**: Secure JWT-based authentication with bcrypt password hashing and user profile management.
- **Meeting Management**: Complete CRUD operations for organizing and tracking team meetings with scheduling details.
- **Interactive Notes**: Real-time note-taking linked directly to specific meetings.
- **AI Summary Generation**: Pluggable AI summarization engine with fallback logic, transforming meeting notes into concise executive summaries.
- **Actionable Task Board**: Integrated task tracking with priority badges (`low`, `medium`, `high`), status management (`pending`, `in_progress`, `completed`), and due dates.
- **Executive Dashboard**: Real-time stats widgets, total meetings breakdown, task completion rates, upcoming schedules, and quick actions.
- **Modern Responsive SaaS UI**: Responsive Tailwind CSS user interface with dark mode theme support, animations, toast notifications, confirmation modals, and protected routes.
- **System Health Checks**: Diagnostic health check endpoint (`/health`) monitoring application status.

---

## Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios (Centralized API client with auth interceptors)
- **Icons**: Lucide React / Heroicons

### Backend
- **Framework**: FastAPI
- **ORM & Migrations**: SQLAlchemy 2.0 & Alembic
- **Validation**: Pydantic v2
- **Authentication**: PyJWT & Passlib (bcrypt)
- **Database**: MySQL (SQLAlchemy configurable with SQLite dev support)
- **AI Engine**: Pluggable Provider (OpenAI/Gemini with built-in heuristic summarizer fallback)

---

## Project Folder Structure

```
Meetflow_AI/
├── app/                      # FastAPI Backend
│   ├── ai/                   # Pluggable AI Summarization engine & fallbacks
│   ├── api/                  # API Routers (Auth, Meetings, Notes, Tasks, Dashboard, Health)
│   ├── core/                 # Config & Security (JWT, Hashing)
│   ├── database/             # SQLAlchemy Engine, Base, & Session management
│   ├── middleware/           # Auth middleware & Global error handling
│   ├── models/               # SQLAlchemy Models (User, Meeting, MeetingNote, Task)
│   ├── repositories/         # Database access layer
│   ├── schemas/              # Pydantic schemas
│   ├── services/             # Business logic services
│   ├── utils/                # Helper utilities
│   └── main.py               # Main FastAPI entry point
│
├── src/                      # React (Vite) Frontend
│   ├── api/                  # Centralized API service methods
│   ├── assets/               # Static assets & graphics
│   ├── components/           # Reusable UI components (Navbar, Sidebar, Modals, Tables, Cards)
│   ├── context/              # Context providers (AuthContext, ToastContext, ThemeContext)
│   ├── hooks/                # Custom React hooks
│   ├── layouts/              # Auth & Dashboard Layout wrappers
│   ├── pages/                # Application pages (Dashboard, Meetings, Tasks, Profile, Settings, etc.)
│   ├── routes/               # Router definitions & Protected route guards
│   └── utils/                # Utility helpers & formatters
│
├── alembic/                  # Database migration scripts
├── .env.example              # Sample environment configuration
├── alembic.ini               # Alembic configuration
├── package.json              # Frontend dependencies
├── requirements.txt          # Backend dependencies
├── vite.config.js            # Vite configuration
└── README.md
```

---

## Setup & Running Instructions

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- MySQL Server (or SQLite for quick local development)

### 1. Backend Setup

```bash
# Navigate to project root
cd Meetflow_AI

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env

# Run database migrations
alembic upgrade head

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```
Backend will be live at `http://localhost:8000`. API docs available at `http://localhost:8000/docs`.

### 2. Frontend Setup

```bash
# Install frontend dependencies
npm install

# Start Vite development server
npm run dev
```
Frontend will be live at `http://localhost:5173`.

### 3. Docker (Beginner Friendly)

Run both Backend and Frontend in one command:

```bash
docker compose up --build
```

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:8000`

---

## Environment Variables Configuration

Create a `.env` file in the root directory (refer to `.env.example`):

```env
# Backend Settings
PROJECT_NAME="MeetFlow AI"
SECRET_KEY="your-super-secret-jwt-key"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Database Configuration (MySQL default, SQLite optional)
DATABASE_URL="mysql+pymysql://root:password@localhost:3306/meetflow_db"
# Alternative SQLite for zero-config testing:
# DATABASE_URL="sqlite:///./meetflow.db"

# AI Provider Configuration (Optional)
AI_PROVIDER="heuristic" # Options: openai, gemini, heuristic
OPENAI_API_KEY=""
GEMINI_API_KEY=""

# CORS Settings
CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000"]
```

---

## API Documentation Summary

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `GET` | `/health` | Application health check | No |
| `POST` | `/register` | Register new user account | No |
| `POST` | `/login` | Authenticate and obtain JWT token | No |
| `GET` | `/me` | Get authenticated user profile | Yes |
| `GET` | `/meetings` | List all user meetings | Yes |
| `POST` | `/meetings` | Create a new meeting | Yes |
| `GET` | `/meetings/{id}` | Get meeting details | Yes |
| `PUT` | `/meetings/{id}` | Update meeting details | Yes |
| `DELETE`| `/meetings/{id}` | Delete a meeting | Yes |
| `POST` | `/notes` | Save a new note for meeting | Yes |
| `GET` | `/notes/{meeting_id}` | Fetch notes for meeting | Yes |
| `PUT` | `/notes/{id}` | Edit meeting note | Yes |
| `DELETE`| `/notes/{id}` | Delete meeting note | Yes |
| `POST` | `/notes/summarize` | Generate AI summary for notes | Yes |
| `GET` | `/tasks` | List user tasks | Yes |
| `POST` | `/tasks` | Create task linked to meeting | Yes |
| `PUT` | `/tasks/{id}` | Update task status / priority | Yes |
| `DELETE`| `/tasks/{id}` | Delete task | Yes |
| `GET` | `/dashboard` | Fetch dashboard stats & widgets | Yes |

---

## Future Roadmap (V2+)

- Multi-tenant Organization & Team Workspaces
- Calendar Integrations (Google Calendar, Outlook)
- Audio/Video Transcript AI Summarization
- Webhook notifications & Slack/Teams Integration
- Real-time Collaborative Note Editing via WebSockets
- Containerization with Docker & Kubernetes CI/CD pipelines

---

## License

MIT License. Designed and Developed for MeetFlow AI.
