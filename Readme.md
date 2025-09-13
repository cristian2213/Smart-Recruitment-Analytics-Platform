# Recruitment Analytics Platform

A full-stack recruitment management system built with Laravel and React, featuring AI-powered resume parsing, role-based access control, and advanced analytics.

## 🚀 Technology Stack

- **Backend:** Laravel 12
- **Frontend:** React 18 + Inertia.js
- **Database:** PostgreSQL
- **Cache & Queue:** Redis
- **AI/ML:** Python microservice with spaCy
- **Storage:** MinIO (S3-compatible)
- **Containerization:** Docker
- **Authentication:** Laravel Breeze

## 👥 Role-Based Access Control

### Admin (`/admin/dashboard`)

- **User Management:** Full CRUD operations for all user roles (HR Manager, Recruiter, Applicant)
- **Job Management:** Create, view, update, and delete all job postings
    - Assign and unassign Recruiters to Jobs
    - Assign and unassign Applicants to Jobs
    - Update Job status (Draft, Published, Closed)
- **Analytics Dashboard:** View platform-wide analytics for Applicants, Jobs, and Users
- **Oversight:** Monitor all Recruiter activities (Notes, Emails, Interviews)
- **Communication:** Send global notifications to all users

### HR Manager (`/hr-manager/dashboard`)

- **Recruiter Management:** Create, view, update, and delete Recruiter accounts
- **Job Management:** Full CRUD operations for own Jobs only
    - Assign and unassign Recruiters to Jobs
    - Update Job status (Draft, Published, Closed)
- **Applicant Overview:** View all Applicants and their Applications across all Jobs
- **Performance Monitoring:** Track Recruiter performance metrics
    - Monitor all Recruiter activities (Notes, Emails, Interviews)
- **Analytics:** View detailed analytics for Applicants, Jobs, and Recruiter performance

### Recruiter (`/recruiter/dashboard`)

- **Dashboard Analytics:** View key metrics for assigned Jobs
    - Total Applicants, Jobs, Applications, Interviews, Hired, and Rejected
- **Job Management:** View and update only assigned Jobs
    - Update Job status (Draft, Published, Closed)
- **Interview Management:**
    - Schedule interviews and send automated emails to Applicants
    - Evaluate candidates post-interview (Hire/Reject)
    - Hire selected Applicants and close Jobs
- **Notifications:** Receive alerts for:
    - New Job assignments
    - New Applicants for assigned Jobs

### Applicant (`/dashboard`)

- **Application Tracking:** View all applied Jobs and status
- **Job Application:** Apply to new Job postings
    - Manage Resume library (Upload, Update, Delete)
    - View Match percentage for each Job
    - See application volume for each Job
    - Manage Interview schedules (Accept/Decline)
    - View Interview results
    - Withdraw applications
- **Personal Analytics:** View statistics for own Applications
- **Notifications:** Receive alerts for:
    - New Interview schedules
    - Interview results
    - Communications from Recruiters

### Public Route (`/jobs`)

- **Job Discovery:** Browse available Job postings
- **Application Process:** Apply to Jobs by creating an account and uploading Resume

## 🚀 Getting Started

[Installation instructions would go here]

## 📊 Key Features

- AI-powered resume parsing and candidate matching
- Advanced analytics and data visualization
- Role-based access control with fine-grained permissions
- Automated email notifications and interview scheduling
- File management with resume storage and processing
- Queue-based background job processing
- Docker containerization for easy deployment

## 🔧 Development Setup

[Development environment setup instructions would go here]

---
