# 🚀 OpportunityHub

A smart full-stack Student Opportunity Tracker built using React, Spring Boot, MySQL, and JWT authentication. OpportunityHub helps students discover, save, apply for, and track internships and job opportunities in one place.

## 🌐 Live Demo

🔗 [View Live Application](https://opportunityhub-frontend.onrender.com)

---

## 📌 Features

- 🔐 Student registration and login
- 🔑 JWT-based authentication
- 🔒 Role-based access control
- 💼 Browse available opportunities
- 🔎 Search opportunities by title, company, and category
- 🏷️ Filter opportunities
- 📝 Apply for opportunities
- 📋 Track applications and application status
- ⭐ Save/bookmark opportunities
- 🔖 View saved opportunities
- 🎯 Personalized opportunity recommendations
- ⏰ Deadline alerts for upcoming opportunities
- 👤 Student profile management
- 📊 Dashboard with opportunity and application statistics
- 🛡️ User-data isolation and secure API access
- 🌐 Fully deployed full-stack application

---

## 🛠️ Technologies Used

### Frontend
- **React.js** – Building the user interface
- **JavaScript** – Application logic and interactivity
- **HTML5** – Application structure
- **CSS3** – Styling and responsive layout
- **Vite** – Frontend development and production build

### Backend
- **Java** – Backend programming
- **Spring Boot** – REST API and application development
- **Spring Security** – Authentication and authorization
- **JWT** – Secure token-based authentication
- **BCrypt** – Password encryption
- **Maven** – Dependency management and build automation

### Database
- **MySQL** – Storing users, opportunities, applications, saved opportunities, and profiles

### Deployment
- **GitHub** – Source code and version control
- **Render** – Frontend and backend deployment
- **Aiven** – Cloud MySQL database

---

## 🏗️ Architecture

```text
                    ┌──────────────────────┐
                    │       Student        │
                    │      Web Browser     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   React Frontend     │
                    │      + Vite          │
                    └──────────┬───────────┘
                               │
                         REST API / JWT
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Spring Boot        │
                    │      Backend         │
                    ├──────────────────────┤
                    │ Controllers          │
                    │ Services             │
                    │ Repositories         │
                    │ Spring Security      │
                    │ JWT Authentication   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      MySQL           │
                    │      Database        │
                    │       Aiven          │
                    └──────────────────────┘
