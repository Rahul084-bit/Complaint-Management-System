# Complaint Management System

Full-stack complaint management app built with **Spring Boot** and **Angular**.

## Features
- Submit complaints with validation
- View all complaints, filter by status
- Update status (Open / In Progress / Resolved)
- Delete complaints

## Tech Stack
- Backend: Java 17, Spring Boot 3, Spring Data JPA, H2
- Frontend: Angular (standalone components, signals), TypeScript

## Run Locally

Backend (http://localhost:8080):
```
cd complaint-backend
mvn spring-boot:run
```

Frontend (http://localhost:4200):
```
cd complaint-frontend
npm install
npm start
```

## API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/complaints?status=OPEN | List complaints |
| POST | /api/complaints | Create complaint |
| PUT | /api/complaints/{id}/status | Update status |
| DELETE | /api/complaints/{id} | Delete complaint |
