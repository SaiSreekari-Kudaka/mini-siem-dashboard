# Mini SIEM Dashboard 

A full-stack Security Information and Event Management (SIEM) application that demonstrates core Security Operations Center (SOC) workflows, including log ingestion, event normalization, detection rules, alert generation, threat intelligence management, and security monitoring.

The application provides a React-based frontend, a FastAPI backend, and a PostgreSQL database. It is designed as an educational and portfolio project focused on defensive cybersecurity workflows.

> This project uses simulated security telemetry and sample logs for educational purposes. It does not provide malware, exploitation, credential theft, or attack automation functionality.

---

## Overview

Mini SIEM Dashboard processes security-related logs through the following workflow:

1. Logs are uploaded or submitted through the API.
2. The backend processes and parses supported log formats.
3. Raw logs and normalized security events are stored separately.
4. Detection rules evaluate incoming events.
5. Matching activity generates or updates security alerts.
6. Users can investigate events and alerts through the dashboard.
7. Administrators can manage users, rules, threat intelligence, and demo data.

The application is structured as a separated frontend and backend system, with Docker Compose support for running the complete environment.

---

## Features

### Security Monitoring Dashboard

- Centralized overview of security activity
- Dashboard metrics and summary information
- Recent security alerts
- Security-focused visualizations
- Responsive SOC-style interface

### Log Ingestion

- Upload support for supported log files
- JSON, CSV, TXT, and LOG file handling
- File validation
- Raw log storage
- Structured event ingestion through the API
- Upload processing results and previews
- Sample logs included for testing

### Log Parsing and Normalization

The backend contains dedicated parsing functionality for different log formats, including:

- SSH authentication logs
- Web access logs
- Application login logs
- Firewall-style logs
- CSV-based data
- Generic text logs

Parsed data is converted into normalized security events that can be used for:

- Searching
- Filtering
- Detection
- Correlation
- Investigation

### Detection Rules

The application includes a rule-based detection system for identifying suspicious activity.

Detection rules can use:

- Event conditions
- Grouping fields
- Thresholds
- Time windows
- Severity levels
- Enabled or disabled states

The rule engine evaluates normalized events and creates or updates alerts when configured conditions are met.

### Alert Management

- Security alert listing
- Severity indicators
- Alert status management
- Alert details
- Related security events
- Analyst notes
- Investigation-oriented workflows

### Threat Intelligence

The application supports locally managed threat intelligence indicators, including:

- IP addresses
- Domains
- Usernames

Threat intelligence indicators can be managed through the application and used as part of the security monitoring workflow.

### Role-Based Access Control

The application supports multiple user roles with different permissions.

#### Admin

Administrators can access functionality for:

- User management
- Detection rule management
- Threat intelligence management
- Demo data management
- Administrative statistics

#### Analyst

Analysts can:

- Monitor security activity
- View events and alerts
- Upload logs
- Update alert status
- Add investigation notes

#### Viewer

Viewers have read-oriented access to security monitoring information such as:

- Dashboard data
- Events
- Alerts
- Detection rules
- Threat intelligence information

---

# Technology Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- Recharts
- Lucide Icons

## Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- JWT Authentication
- Passlib
- bcrypt

## Database and Infrastructure

- PostgreSQL
- Alembic
- Docker
- Docker Compose

---

# Project Structure

```text
mini-siem-dashboard/
│
├── backend/
│   │
│   ├── alembic/
│   │   ├── env.py
│   │   └── versions/
│   │
│   ├── app/
│   │   │
│   │   ├── api/
│   │   │   ├── admin.py
│   │   │   ├── alerts.py
│   │   │   ├── auth.py
│   │   │   ├── dashboard.py
│   │   │   ├── demo.py
│   │   │   ├── events.py
│   │   │   ├── logs.py
│   │   │   ├── rules.py
│   │   │   └── threat_intel.py
│   │   │
│   │   ├── auth/
│   │   │   ├── dependencies.py
│   │   │   └── security.py
│   │   │
│   │   ├── database/
│   │   │   ├── base.py
│   │   │   └── session.py
│   │   │
│   │   ├── models/
│   │   │   ├── alert.py
│   │   │   ├── event.py
│   │   │   ├── raw_log.py
│   │   │   ├── rule.py
│   │   │   ├── threat_indicator.py
│   │   │   └── user.py
│   │   │
│   │   ├── parsers/
│   │   │   └── log_parser.py
│   │   │
│   │   ├── rules/
│   │   │   ├── builtin.py
│   │   │   └── engine.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── alert.py
│   │   │   ├── common.py
│   │   │   ├── event.py
│   │   │   ├── rule.py
│   │   │   ├── threat.py
│   │   │   └── user.py
│   │   │
│   │   ├── services/
│   │   │   ├── ingestion.py
│   │   │   └── seed.py
│   │   │
│   │   ├── config.py
│   │   └── main.py
│   │
│   ├── sample_logs/
│   ├── .env.example
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   │
│   ├── public/
│   │   └── sample_logs/
│   │
│   ├── src/
│   │   │
│   │   ├── components/
│   │   │   ├── AuthProvider.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Layout.tsx
│   │   │   ├── MetricCard.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── State.tsx
│   │   │   └── Toast.tsx
│   │   │
│   │   ├── pages/
│   │   │   ├── AdminPage.tsx
│   │   │   ├── AlertsPage.tsx
│   │   │   ├── EventsPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── OverviewPage.tsx
│   │   │   ├── RulesPage.tsx
│   │   │   ├── ThreatIntelPage.tsx
│   │   │   └── UploadLogsPage.tsx
│   │   │
│   │   ├── services/
│   │   │   └── api.ts
│   │   │
│   │   ├── types/
│   │   │   └── index.ts
│   │   │
│   │   ├── utils/
│   │   │   └── format.ts
│   │   │
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   │
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── Dockerfile
│
├── .gitignore
├── docker-compose.yml
└── README.md
```

---

# Application Architecture

```mermaid
flowchart LR
    A[Log Upload or API Input] --> B[FastAPI Backend]
    B --> C[Log Ingestion Service]

    C --> D[Raw Log Storage]
    C --> E[Log Parser and Normalizer]

    E --> F[Normalized Events]

    F --> G[Detection Rule Engine]
    H[Threat Intelligence Indicators] --> G

    G --> I[Security Alerts]

    F --> J[React Dashboard]
    I --> J

    J --> K[Events and Alert Investigation]
```

The backend separates authentication, API routes, database access, data models, schemas, parsing, detection rules, and application services into dedicated modules.

The frontend separates reusable components, application pages, API communication, TypeScript types, and utility functions.

---

# Backend Architecture

The backend is organized around the following responsibilities.

## API

The `backend/app/api/` directory contains the application's API routes.

These routes provide functionality for:

- Authentication
- Dashboard summaries
- Events
- Alerts
- Log uploads
- Detection rules
- Threat intelligence
- Administration
- Demo data

## Authentication

The `backend/app/auth/` directory handles:

- Password hashing
- Password verification
- JWT creation
- JWT validation
- Current user authentication
- Role-based authorization

## Database

The `backend/app/database/` directory manages:

- Database configuration
- SQLAlchemy sessions
- Database model setup

## Models

The `backend/app/models/` directory defines database entities for:

- Users
- Raw logs
- Security events
- Detection rules
- Alerts
- Threat indicators

## Parsers

The `backend/app/parsers/` directory handles log parsing and normalization.

## Rules

The `backend/app/rules/` directory contains:

- Built-in detection rules
- Rule evaluation logic

## Schemas

The `backend/app/schemas/` directory defines Pydantic schemas used for request validation and API responses.

## Services

The `backend/app/services/` directory contains application-level services such as:

- Log ingestion
- Demo data seeding

---

# Frontend Architecture

The frontend is organized into reusable components and page-level views.

## Components

The `frontend/src/components/` directory contains reusable application components, including:

- Authentication provider
- Protected route handling
- Application layout
- Navigation
- Metrics
- Status badges
- Loading and empty states
- Toast notifications

## Pages

The `frontend/src/pages/` directory contains the primary application views:

| Page | Purpose |
|---|---|
| Dashboard | Security overview and monitoring metrics |
| Events | Security event investigation |
| Alerts | Alert monitoring and investigation |
| Detection Rules | Detection rule management |
| Upload Logs | Log upload and ingestion |
| Threat Intelligence | Indicator management |
| Admin | Administrative operations |
| Login | User authentication |

## API Service

The frontend communicates with the backend through:

```text
frontend/src/services/api.ts
```

This provides a centralized location for API requests and backend integration.

---

# Database Entities

The application includes database models for the following security-related entities.

## User

Stores:

- Username
- Email
- Password hash
- Role

## Raw Log

Stores the original log content before normalization.

## Event

Stores normalized security event information used throughout the monitoring and detection workflow.

## Detection Rule

Stores detection configuration such as:

- Name
- Description
- Severity
- Conditions
- Threshold
- Time window
- Enabled state

## Alert

Represents suspicious activity detected by the rule engine.

Alerts can contain information related to:

- Severity
- Status
- Related events
- Source information
- Affected users
- Investigation notes

## Threat Indicator

Stores locally managed threat intelligence values used in the security monitoring workflow.

---

# API Endpoints

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

## Dashboard

```text
GET /api/dashboard/summary
```

## Logs

```text
POST /api/logs/upload
POST /api/logs/ingest
```

## Events

```text
GET /api/events
GET /api/events/{id}
```

## Alerts

```text
GET /api/alerts
GET /api/alerts/{id}
PATCH /api/alerts/{id}/status
POST /api/alerts/{id}/notes
```

## Detection Rules

```text
GET /api/rules
PATCH /api/rules/{id}/toggle
POST /api/rules
```

## Threat Intelligence

```text
GET /api/threat-intel
POST /api/threat-intel
PATCH /api/threat-intel/{id}
DELETE /api/threat-intel/{id}
```

## Administration

```text
GET /api/admin/stats
GET /api/admin/users
POST /api/admin/users
PATCH /api/admin/users/{id}
```

## Demo Data

```text
POST /api/demo/seed
DELETE /api/demo/clear
```

Interactive API documentation is available at:

```text
http://localhost:8000/api/docs
```

---

# Running the Application

## Using Docker

### Prerequisites

Install:

- Docker Desktop
- Docker Compose

From the root directory of the repository, run:

```bash
docker compose up --build
```

The application will start the following services:

- PostgreSQL database
- FastAPI backend
- React frontend

After startup, open:

```text
Frontend: http://localhost:5173
Backend API: http://localhost:8000
API Documentation: http://localhost:8000/api/docs
```

To stop the application:

```bash
docker compose down
```

---

# Local Development

## Backend

Create and activate a Python virtual environment:

```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

Create the environment file:

```powershell
copy .env.example .env
```

Start the backend:

```powershell
uvicorn app.main:app --reload
```

The backend will run at:

```text
http://localhost:8000
```

## Frontend

Open a separate terminal:

```powershell
cd frontend
npm install
```

Create the frontend environment file:

```powershell
copy .env.example .env
```

Start the development server:

```powershell
npm run dev
```

The frontend will run at:

```text
http://localhost:5173
```

---

# Environment Variables

## Backend

Example:

```env
DATABASE_URL=postgresql+psycopg://siem:siem@localhost:5432/mini_siem
JWT_SECRET_KEY=replace-with-a-long-random-secret
CORS_ORIGINS=["http://localhost:5173","http://127.0.0.1:5173"]
```

Important backend variables include:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL database connection URL |
| `JWT_SECRET_KEY` | Secret used to sign JWT tokens |
| `JWT_ALGORITHM` | JWT signing algorithm |
| `JWT_EXPIRE_MINUTES` | JWT token expiration time |
| `CORS_ORIGINS` | Allowed frontend origins |
| `MAX_UPLOAD_BYTES` | Maximum allowed upload size |
| `AUTO_CREATE_TABLES` | Local database table creation setting |

## Frontend

Example:

```env
VITE_API_URL=http://localhost:8000/api
```

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API |

Do not commit real production credentials or secrets to the repository.

Local `.env` files should remain excluded by `.gitignore`, while `.env.example` files provide safe configuration templates.

---

# Sample Logs

The repository includes sample logs for testing the ingestion and detection workflow.

Available sample files include:

```text
ssh_auth.log
web_access.log
firewall.log
application_logins.jsonl
```

Sample logs are available in:

```text
backend/sample_logs/
```

The frontend also includes sample logs for use through the application.

The expected workflow is:

1. Select a supported log file.
2. Upload the file through the Upload Logs page.
3. The backend validates and processes the file.
4. Raw log data is stored.
5. Events are normalized.
6. Detection rules are evaluated.
7. Relevant alerts are created or updated.

---

# Detection Workflow

The detection process follows this general flow:

```text
Log Input
    ↓
Validation
    ↓
Parsing
    ↓
Normalization
    ↓
Event Storage
    ↓
Detection Rule Evaluation
    ↓
Alert Creation or Update
    ↓
Dashboard Investigation
```

Detection rules can be enabled or disabled and use configurable conditions, thresholds, and time windows to identify suspicious activity.

---

# Authentication and Authorization

The application uses:

- Password hashing through Passlib and bcrypt
- JWT-based authentication
- Protected frontend routes
- Backend authentication dependencies
- Role-based authorization

The frontend includes authentication state management and protected routes, while the backend validates access tokens and user roles for protected operations.

---

# Build Verification

The frontend production build can be verified with:

```powershell
cd frontend
npm run build
```

A successful build confirms that the TypeScript compilation and Vite production build complete successfully.

---

# Security Considerations

This project includes several security-focused practices:

- Passwords are stored as hashes
- JWT tokens are generated server-side
- Protected API routes require authentication where appropriate
- Role-based access control restricts administrative functionality
- Uploads are validated
- File size limits can be configured
- CORS is configurable through environment variables
- Local environment files are excluded from version control
- Sample security data is simulated for educational use

This application is intended as a learning and portfolio project and should not be considered a replacement for a production enterprise SIEM platform.

---

# Future Improvements

Possible future improvements include:

- Advanced event search
- Full-text search indexing
- Additional log parsers
- More advanced event correlation
- Case management
- Saved investigations
- Event and alert export
- Background processing for large log ingestion
- Automated backend testing
- Automated frontend testing
- Detection rule simulation
- External threat intelligence integrations
- Enhanced monitoring and observability

## Author

**Sai Sreekari Kudaka**

Computer Science student with an interest in Cybersecurity.

- GitHub: https://github.com/SaiSreekari-Kudaka
- Project Repository: https://github.com/SaiSreekari-Kudaka/mini-siem-dashboard

---

This project was developed as a portfolio and learning project to demonstrate practical skills in full-stack development, cybersecurity concepts, log analysis, authentication, role-based access control, and security monitoring workflows.
