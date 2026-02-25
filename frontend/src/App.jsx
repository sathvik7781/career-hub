import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProfilePage from "./features/profile/pages/ProfilePage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import PageTransition from "./components/layout/PageTransition";
import { ThemeProvider } from "./context/ThemeContext";

// Recruiter Pages
import CompanyManagementPage from "./features/recruiter/pages/CompanyManagementPage";
import JobDashboardPage from "./features/recruiter/pages/JobDashboardPage";
import JobFormPage from "./features/recruiter/pages/JobFormPage";
import JobApplicationsPage from "./features/recruiter/pages/JobApplicationsPage";

// Seeker Pages
import JobSearchPage from "./features/seeker/pages/JobSearchPage";
import JobDetailsPage from "./features/seeker/pages/JobDetailsPage";
import MyApplicationsPage from "./features/seeker/pages/MyApplicationsPage";

// Admin
import AdminDashboardPage from "./features/admin/pages/AdminDashboardPage";

export default function App() {
  const location = useLocation();

  return (
    <ThemeProvider>
      <div className="h-screen flex flex-col bg-app font-sans text-primary transition-colors duration-300">
        <Navbar />

        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

        <main className="flex-1 overflow-y-auto w-full">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  <PageTransition>
                    <Home />
                  </PageTransition>
                }
              />
              <Route
                path="/login"
                element={
                  <PageTransition>
                    <Login />
                  </PageTransition>
                }
              />
              <Route
                path="/register"
                element={
                  <PageTransition>
                    <Register />
                  </PageTransition>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <PageTransition>
                    <ForgotPassword />
                  </PageTransition>
                }
              />

              {/* Protected Routes */}

              {/* Common Authenticated Routes */}
              <Route element={<ProtectedRoute />}>
                <Route
                  path="/profile"
                  element={
                    <PageTransition>
                      <ProfilePage />
                    </PageTransition>
                  }
                />
              </Route>

              {/* Recruiter Routes */}
              <Route element={<ProtectedRoute role="recruiter" />}>
                <Route
                  path="/recruiter/company"
                  element={
                    <PageTransition>
                      <CompanyManagementPage />
                    </PageTransition>
                  }
                />
                <Route
                  path="/recruiter/jobs"
                  element={
                    <PageTransition>
                      <JobDashboardPage />
                    </PageTransition>
                  }
                />
                <Route
                  path="/recruiter/post-job"
                  element={
                    <PageTransition>
                      <JobFormPage />
                    </PageTransition>
                  }
                />
                <Route
                  path="/recruiter/edit-job/:id"
                  element={
                    <PageTransition>
                      <JobFormPage />
                    </PageTransition>
                  }
                />
                <Route
                  path="/recruiter/jobs/:jobId/applications"
                  element={
                    <PageTransition>
                      <JobApplicationsPage />
                    </PageTransition>
                  }
                />
              </Route>

              <Route
                path="/jobs"
                element={
                  <PageTransition>
                    <JobSearchPage />
                  </PageTransition>
                }
              />
              <Route
                path="/jobs/:id"
                element={
                  <PageTransition>
                    <JobDetailsPage />
                  </PageTransition>
                }
              />

              <Route element={<ProtectedRoute role="seeker" />}>
                <Route
                  path="/my-applications"
                  element={
                    <PageTransition>
                      <MyApplicationsPage />
                    </PageTransition>
                  }
                />
              </Route>

              {/* Admin Routes */}
              <Route element={<ProtectedRoute role="admin" />}>
                <Route
                  path="/admin"
                  element={
                    <PageTransition>
                      <AdminDashboardPage />
                    </PageTransition>
                  }
                />
              </Route>
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </ThemeProvider>
  );
}
