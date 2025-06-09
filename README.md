# SPEC-1: MediLink - Medical Appointment and Health Record System

## Background

The Medico project is an end-to-end medical appointment and health record management application. It uses MERN for backend and web frontend. The project is designed to parallelize backend, web development efforts, simulating a real-world development workflow.

## Requirements

### Must Have (MoSCoW: Must)

- User authentication and role management (Patient, Doctor)
- Booking and managing doctor appointments
- Uploading and scanning medical reports (OCR-based text extraction)
- Web frontend (React, Next) with full feature parity
- Backend (Node.js, Express.js, MongoDB) with REST API
- Git integration and collaborative workflows
- Software engineering best practices (branching, PRs, commits)

### Should Have

- Appointment history for users
- Profile management for doctors and patients
- Role-based dashboards/UI adjustments
- Basic appointment notifications (status updates in UI)

### Could Have

- Doctor availability management
- Archival view of scanned medical records
- UI indication of appointment status (Confirmed, Cancelled, Pending)

### Won’t Have (in MVP)

- Payments and billing integration
- In-app chat or messaging
- Video consultations
- Advanced analytics or AI integration
- Push notifications

## Method

### Architecture Overview

```plantuml
@startuml
package "Medico" {
  [Web App (React, Next)] --> [REST API]
  [REST API] --> [MongoDB]
  [REST API] --> [OCR Module]
}
@enduml
````

### User Roles

* **Doctor**: Can manage appointments, view uploaded reports, update status(accept, cancel, pending,complete).
* **Patient**: Can book appointments, upload reports, view history.

### Database Schema (MongoDB)

#### Users Collection

* `_id` (ObjectId)
* `name` (String)
* `email` (String, unique)
* `password` (String, hashed)
* `role` (String: 'doctor' | 'patient')
* `profile` (Object)

  * `age`, `gender`, `specialization` (for doctor), etc.

#### Appointments Collection

* `_id` (ObjectId)
* `doctorId` (ObjectId, ref: Users)
* `patientId` (ObjectId, ref: Users)
* `dateTime` (Date)
* `status` (String: 'pending', 'confirmed', 'cancelled')

#### MedicalReports Collection

* `_id` (ObjectId)
* `patientId` (ObjectId, ref: Users)
* `doctorId` (ObjectId, ref: Users)
* `fileUrl` (String)
* `extractedText` (String)
* `uploadedAt` (Date)

### REST API Endpoints

* `POST /auth/signup`
* `POST /auth/login`
* `GET /users/profile`
* `PUT /users/profile`
* `POST /appointments`
* `GET /appointments?role=doctor|patient`
* `PUT /appointments/:id/status`
* `POST /reports/upload`
* `GET /reports/:userId`

### OCR Integration

* Use Tesseract.js or OCR.space API
* Client uploads image/pdf → server parses → returns extracted text

### UI Features for Both Frontends

* Login/Signup, Role-aware dashboards
* Profile management
* Appointment booking/listing
* Medical report upload + OCR preview
* Appointment status tracking

### Repository Structure (Monorepo)

```markdown

medico/
├── backend/
├── frontend/
├── README.md
└── .github/

```

### Development Practices

- GitHub branches: `feature/<name>`, `bugfix/<name>`
- Use linting and codeguidelines
- Shared API contract via Swagger/Postman
- Daily demo at EOD

### Testing Guidelines

- Write Unit Testing and End-To-End Testings

---
