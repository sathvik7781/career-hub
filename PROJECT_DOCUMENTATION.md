# CareerHub Project Documentation

## 1. What Is CareerHub?

CareerHub is a MERN stack job platform where three types of users work together:

- `Admin` keeps the platform safe and trusted.
- `Recruiter` creates companies, posts jobs, and manages applicants.
- `Job Seeker` builds a profile, searches jobs, and applies.

### In very simple words

CareerHub is like a smart job fair on the internet:

- `Admins` are the organizers.
- `Recruiters` are the companies looking for people.
- `Job Seekers` are the people looking for jobs.

The app helps all three talk to the same system in the right way.

---

## 2. Main Goal of the Product

CareerHub is designed to solve three business problems:

1. Help job seekers discover real job opportunities quickly.
2. Help recruiters hire faster with a clean applicant pipeline.
3. Help admins control trust, verification, and platform quality.

### In very simple words

The platform tries to do three things well:

- help people find jobs,
- help companies hire people,
- stop fake or bad activity.

---

## 3. Technology Stack

### Frontend

- `React`
- `React Router`
- `TanStack Query`
- `Tailwind CSS`
- `Styled Components`
- `Framer Motion`
- `Vite`

### Backend

- `Node.js`
- `Express`
- `MongoDB`
- `Mongoose`
- `JWT Authentication`
- `Cookie-based refresh token flow`
- `Cloudinary` for uploads
- `Nodemailer` for OTP emails

### In very simple words

- The `frontend` is what users see.
- The `backend` is the brain that handles data and rules.
- The `database` stores users, companies, jobs, and applications.

---

## 4. User Roles

## 4.1 Admin

### Professional view

Admin is the governance role. This user reviews companies, verifies or rejects them, manages job visibility, and protects the trust of the platform.

### Child-friendly view

The admin is the referee and security guard of CareerHub.

---

## 4.2 Recruiter

### Professional view

Recruiter is the hiring-side role. This user manages company identity, creates job listings, and reviews candidate applications.

### Child-friendly view

The recruiter is the company person who says, "We need someone for this job."

---

## 4.3 Job Seeker

### Professional view

Job Seeker is the candidate-side role. This user creates a professional profile, explores jobs, and applies for opportunities.

### Child-friendly view

The job seeker is the person trying to find the best job for them.

---

## 5. High-Level User Journey

```text
Visitor
  -> Register or Login
  -> System identifies role
  -> User enters role-based dashboard

Recruiter
  -> Create/join company
  -> Wait for company approval
  -> Post jobs
  -> Review applications

Job Seeker
  -> Complete profile
  -> Search jobs
  -> Apply
  -> Track application status

Admin
  -> Review companies
  -> Approve / reject / suspend
  -> Moderate jobs
```

### In very simple words

Everyone enters through the same door, but after login each person goes to their own room:

- seekers go to job tools,
- recruiters go to hiring tools,
- admins go to control tools.

---

## 6. Authentication and Access Control Flow

## 6.1 Registration Flow

### Current flow

1. User enters email.
2. System sends OTP to email.
3. User verifies OTP.
4. User chooses role and password.
5. Account is created.
6. Role-based profile is created automatically.

### Important implementation notes

- Registration uses OTP verification before account creation.
- The backend now enforces OTP verification.
- A `SeekerProfile` or `RecruiterProfile` is created during registration depending on role.

### Child-friendly view

Before someone joins the app, the app sends them a secret number to check that the email is really theirs.

---

## 6.2 Login Flow

### Current flow

1. User enters email and password.
2. Backend validates credentials.
3. Access token is returned.
4. Refresh token is stored in cookie.
5. Frontend loads the correct dashboard based on role.

### Protection rules

- Unauthenticated users cannot access protected pages.
- Only allowed roles can access protected routes.
- Admin, recruiter, and seeker each have separate protected sections.

### Child-friendly view

Login is like showing your ID card. If the card is correct, the app opens your area.

---

## 6.3 Password Reset Flow

### Current flow

1. User requests reset OTP.
2. System emails OTP.
3. User verifies OTP.
4. User sets a new password.

### Security support already present

- Rate limiting on login attempts
- Rate limiting on OTP requests
- Rate limiting on OTP verification endpoints

### Child-friendly view

If you forget your password, the app sends another secret code so you can safely create a new one.

---

## 7. Frontend Application Flows

## 7.1 Public Pages

### Available public pages

- Home page
- Login
- Register
- Job listing page
- Job details page
- Company listing page
- Company details page
- Not found page

### Purpose

These pages allow visitors to explore the platform before signing in.

### Child-friendly view

These are the pages anyone can look at, even before they make an account.

---

## 7.2 Shared Authenticated Layout

### Shared UI features

- Top navigation bar
- Sidebar for logged-in users
- Role-based dashboard entry
- Notifications bell
- Toast feedback messages
- Theme switch

### Why this matters

A shared shell keeps the product consistent while still allowing role-specific pages inside it.

### Child-friendly view

This is the part of the app that looks familiar no matter who is using it, like the same school building with different classrooms.

---

## 8. Admin Flow

## 8.1 Admin Dashboard

### Current features

- View all companies
- See total, pending, and approved counts
- Review verification status
- Approve companies
- Reject companies with reason
- Suspend approved companies
- Unsuspend suspended companies

### Business value

This gives admin the ability to control platform trust and company legitimacy.

### Child-friendly view

The admin checks if companies are real and safe before letting them fully use the app.

---

## 8.2 Admin Job Management

### Current features

- View all jobs
- Search jobs
- Filter by type
- Filter by status
- Paginate job list
- Remove jobs from public visibility

### Business value

This allows moderation of jobs that are outdated, misleading, abusive, or low quality.

### Child-friendly view

If a job post is bad or not supposed to be there, the admin can take it away.

---

## 8.3 Admin Flow Summary

```text
Admin login
  -> Dashboard
  -> Review companies
     -> approve / reject / suspend
  -> Review jobs
     -> filter / search / remove
```

### Recommended future additions

- User management
- Recruiter verification queue
- Abuse reporting inbox
- Audit log
- Platform settings
- Dashboard analytics

---

## 9. Recruiter Flow

## 9.1 Recruiter Dashboard

### Current goal

The recruiter dashboard acts as the entry point to the hiring workflow and recruiter-specific actions.

### Child-friendly view

This is the recruiter’s home screen.

---

## 9.2 Company Management

### Current features

- Register a company
- View own company
- Update company details
- Request to join existing company
- View join requests if owner
- Approve or reject join requests
- Leave company

### Verification behavior

- Recruiter company activity is connected to company approval state.
- Admin can approve, reject, or suspend the company.

### Child-friendly view

First the recruiter tells the app which company they belong to. Then the admin checks if that company is okay.

---

## 9.3 Job Management

### Current features

- Create job posts
- View recruiter’s own jobs
- Edit job posts
- Delete job posts
- View job applications for a specific job

### Child-friendly view

Recruiters can put up job posters, change them, or remove them.

---

## 9.4 Candidate Management

### Current features

- See applicants for a job
- Review candidate list
- Update application status

### Current pipeline idea

Applications move through a recruiter-controlled status flow so seekers can track progress.

### Child-friendly view

When people apply, the recruiter can look at them and say things like:

- still checking,
- moving ahead,
- not selected.

---

## 9.5 Recruiter Flow Summary

```text
Recruiter login
  -> Recruiter dashboard
  -> Company setup or join company
  -> Company gets approved by admin
  -> Post jobs
  -> View applicants
  -> Update candidate status
```

---

## 10. Job Seeker Flow

## 10.1 Seeker Dashboard

### Current goal

The seeker dashboard acts as a launchpad for profile completion, job exploration, and application tracking.

### Child-friendly view

This is the seeker’s personal control room.

---

## 10.2 Profile Management

### Current features

- View personal profile
- Add basic information
- Upload avatar
- Remove avatar
- Add education
- Edit education
- Delete education
- Add professional summary/details
- Add experience
- Edit experience
- Delete experience
- Add skills
- Delete skills
- Add projects
- Edit projects
- Delete projects
- Upload resume
- Download resume
- Delete resume
- Completion percentage tracking

### Important implementation note

Profile completion is recalculated when profile sections change.

### Child-friendly view

The job seeker builds a smart digital resume inside the app, piece by piece.

---

## 10.3 Job Search

### Current features

- Browse jobs
- View job details
- Browse companies
- View company details

### UX meaning

This is the discovery side of the product where seekers explore opportunities before applying.

### Child-friendly view

This is like searching through many job cards to find the best match.

---

## 10.4 Applying to Jobs

### Current features

- Apply to a job
- Prevent duplicate logic through backend checks
- Recruiter receives notification

### Child-friendly view

When the seeker clicks apply, the recruiter gets told, "Someone wants this job."

---

## 10.5 Application Tracking

### Current features

- View own applications
- Track status changes
- Receive status-related notifications

### Child-friendly view

The seeker can see whether their application is still waiting, being reviewed, or changed to a new stage.

---

## 10.6 Seeker Flow Summary

```text
Seeker login
  -> Complete profile
  -> Search jobs
  -> Open job details
  -> Apply
  -> Track applications
```

---

## 11. Notifications Flow

### Current behavior

- Recruiters receive a notification when a seeker applies to a job.
- Seekers receive a notification when application status changes.
- Notification links point to the relevant recruiter or seeker page.

### Why this matters

Notifications reduce delay and keep the platform responsive without the user needing to manually refresh every area.

### Child-friendly view

Notifications are like little reminders that say, "Something important happened. Come look."

---

## 12. Backend Module Overview

## 12.1 Auth Module

### Responsibilities

- Register OTP request
- Register OTP verification
- Register account
- Login
- Refresh token
- Logout
- Password reset OTP request
- Password reset OTP verification
- Reset password

### Child-friendly view

This module decides who can come in and proves who they are.

---

## 12.2 User and Profile Module

### Responsibilities

- Return logged-in user profile
- Manage seeker profile sections
- Handle avatar and resume uploads
- Track profile completion

### Child-friendly view

This module stores your personal job story.

---

## 12.3 Company Module

### Responsibilities

- Register company
- Fetch recruiter’s own company
- Update company
- Public company listing
- Public company details
- Join request management
- Company verification workflow

### Child-friendly view

This module stores information about the companies inside CareerHub.

---

## 12.4 Job Module

### Responsibilities

- Public job listing
- Public job details
- Recruiter job CRUD
- Admin job moderation

### Child-friendly view

This module stores all the job posts.

---

## 12.5 Application Module

### Responsibilities

- Seeker applies to job
- Seeker views own applications
- Recruiter views applicants for a job
- Recruiter updates application status

### Child-friendly view

This module keeps track of who applied to what.

---

## 12.6 Notification Module

### Responsibilities

- Create user notifications
- Support role-specific updates after key actions

### Child-friendly view

This module sends helpful reminders to users.

---

## 13. Route Structure

## 13.1 Frontend Routes

### Public

- `/`
- `/login`
- `/register`
- `/jobs`
- `/jobs/:id`
- `/companies`
- `/companies/:id`

### Protected for all authenticated roles

- `/dashboard`

### Protected for seeker and recruiter

- `/profile`

### Recruiter-only

- `/recruiter/company`
- `/recruiter/jobs`
- `/recruiter/post-job`
- `/recruiter/edit-job/:id`
- `/recruiter/jobs/:jobId/applications`

### Seeker-only

- `/my-applications`

### Admin-only

- `/admin`
- `/admin/jobs`

---

## 13.2 Backend Route Groups

### Auth

- `/auth/register/request-otp`
- `/auth/register/verify-otp`
- `/auth/register`
- `/auth/login`
- `/auth/refresh-token`
- `/auth/logout`
- `/auth/forgot-password/request-otp`
- `/auth/forgot-password/verify-otp`
- `/auth/forgot-password/reset`

### Company

- `/company`
- `/company/:companyId`
- `/company/me`
- `/company/register`
- `/company/update/:companyId`
- `/company/join/:companyId`
- `/company/leave`
- `/company/requests`
- `/company/respond-request`
- `/company/verify/:companyId`
- `/company/admin/all`

### Jobs

- `/jobs`
- `/jobs/:id`
- `/jobs/recruiter/me`
- `/jobs/admin/all`
- `/jobs/admin/:jobId`

### Applications

- `/applications/apply`
- `/applications/me`
- `/applications/job/:jobId`
- `/applications/status/:applicationId`

### Profile

- `/seeker/me`
- `/seeker/basic-info`
- `/seeker/upload-avatar`
- `/seeker/remove-avatar`
- `/seeker/education`
- `/seeker/education/:educationId`
- `/seeker/professional`
- `/seeker/experience`
- `/seeker/experience/:expId`
- `/seeker/skills`
- `/seeker/skills/:skillId`
- `/seeker/projects`
- `/seeker/projects/:projectId`
- `/seeker/upload-resume`
- `/seeker/resume`

---

## 14. Data Model Overview

### Core entities

- `User`
- `Otp`
- `SeekerProfile`
- `RecruiterProfile`
- `Company`
- `Job`
- `Application`
- `Notification`

### Relationship summary

- One `User` can own one role profile.
- A `RecruiterProfile` can belong to a `Company`.
- A `Company` can have many recruiters.
- A `Company` can have many jobs.
- A `Job` can have many applications.
- A `SeekerProfile` can apply to many jobs.

### Child-friendly view

Think of the app like boxes connected by lines:

- one person,
- one profile,
- one company or many jobs,
- and many applications between seekers and jobs.

---

## 15. Business Rules Already Present

- OTP is required before registration.
- Roles are separated by protected routes.
- Recruiter-only actions are protected by role middleware.
- Seeker-only profile editing is protected by role middleware.
- Admin can verify and moderate companies.
- Admin can remove jobs from public visibility.
- Public company listing only shows approved companies.
- Login and OTP endpoints are rate limited.

### Child-friendly view

These are the platform rules that stop people from doing things they should not do.

---

## 16. Current Strengths of the Project

- Clear role-based product idea
- Real multi-user workflow
- Public and protected route separation
- OTP-based onboarding
- Refresh-token-based auth flow
- Profile completion system
- Recruiter company workflow
- Admin moderation support
- Notification flow tied to real actions
- Modular frontend structure

---

## 17. Current Product Gaps

These are the most important features not fully built yet:

- Saved jobs
- Advanced search filters
- Recruiter interview pipeline
- User blocking and suspension management
- Reports and abuse center
- Messaging/chat
- Admin analytics and audit logs
- Platform settings page
- Email digests and alerts
- Recommendation engine

### Child-friendly view

The app is strong already, but there are still some rooms in the house that have not been built yet.

---

## 18. Recommended Future Roadmap

## Phase 1: Trust and Stability

- Add backend integration tests
- Add audit logs
- Add account suspension support
- Add stronger recruiter verification

## Phase 2: Recruiter Efficiency

- Candidate pipeline stages
- Notes and tags
- Screening questions
- Bulk actions

## Phase 3: Seeker Success

- Saved jobs
- Job alerts
- Match scoring
- Better recommendations

## Phase 4: Admin Power

- Full user management
- Abuse reports
- Advanced moderation rules
- Platform analytics dashboard

---

## 19. Ideal Explanation to Present in Viva, Interview, or Review

CareerHub is a role-based recruitment platform built with the MERN stack. It supports three user types: admin, recruiter, and job seeker. The platform uses OTP-based onboarding, JWT authentication with refresh-token support, recruiter company workflows, seeker profile and resume management, job posting and application tracking, and admin moderation for company trust and job quality. The architecture is modular on both frontend and backend, making the system easy to extend with future features like saved jobs, analytics, audit logs, interview pipelines, and anti-abuse tooling.

### Super simple version

CareerHub is a website where:

- job seekers make profiles and apply for jobs,
- recruiters post jobs and review people,
- admins make sure the platform stays safe and real.

---

## 20. Conclusion

CareerHub is not just a CRUD project. It is a multi-role platform with real product logic:

- identity verification,
- role-based access,
- company trust workflows,
- job discovery,
- applications,
- moderation.

That makes it a strong foundation for a real SaaS hiring platform.

### Final child-friendly line

CareerHub is like a smart job city where everyone has a different job to do, and the app helps them work together safely.
