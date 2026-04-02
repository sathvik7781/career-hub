# CareerHub

A modern, full-stack recruitment platform connecting job seekers with recruiters. CareerHub offers an intuitive, scalable MERN-based application supporting advanced job search, applicant tracking, and comprehensive profile management.

## 🌟 Key Features

*   **Role-Based Dashboards:** Distinct and personalized experiences for both Job Seekers and Admin/Recruiters.
*   **Advanced search & filters:** Effortlessly discover opportunities by title, location, experience levels, and salary ranges.
*   **Saved Jobs System:** Seekers can bookmark jobs and track applications in a dedicated dashboard.
*   **Audit Logging:** Detailed system-wide action tracking for recruitment workflows and status changes.
*   **Performance Analytics:** Real-time metrics on profile views, job engagement, and application status.
*   **Responsive UI:** Fully fluid and dynamic interface using React, TailwindCSS, and optimized interactions.

## 🛠 Tech Stack

**Frontend:** React, Vite, TailwindCSS, Framer Motion, React Query, Lucide-React. \
**Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT Auth.

## 📂 Project Structure

*   **/frontend:** Vite+React frontend application.
*   **/backend:** Express+MongoDB server and REST API.
*   **PROJECT_DOCUMENTATION.md:** High-level project roadmaps, features, and progress.
*   **SYSTEM_DESIGN.MD:** Deep-dive architectural patterns and integration references.

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+ recommended)
*   MongoDB (or MongoDB Atlas cluster)

### Environment Setup
Create a `.env` file inside the `/backend` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Running Locally

1. **Start the Backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
2. **Start the Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 🧪 Testing
The API features a comprehensive set of integration tests utilizing `supertest` alongside `mongodb-memory-server` to mock live environments.
```bash
cd backend
npm test
```
