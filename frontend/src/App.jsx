import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useContext, useState, useEffect, Suspense, lazy } from "react";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./components/layout/PageTransition";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthContext } from "./context/AuthContext";
import { Loader2 } from "lucide-react";

const Home                = lazy(() => import("./pages/Home"));
const Login               = lazy(() => import("./pages/Login"));
const Register            = lazy(() => import("./pages/Register"));
const NotFoundPage        = lazy(() => import("./pages/NotFoundPage"));
const ProfilePage         = lazy(() => import("./features/profile/pages/ProfilePage"));
const SeekerDashboard     = lazy(() => import("./features/seeker/pages/SeekerDashboard"));
const JobSearchPage       = lazy(() => import("./features/seeker/pages/JobSearchPage"));
const JobDetailsPage      = lazy(() => import("./features/seeker/pages/JobDetailsPage"));
const MyApplicationsPage  = lazy(() => import("./features/seeker/pages/MyApplicationsPage"));
const SavedJobsPage       = lazy(() => import("./features/seeker/pages/SavedJobsPage"));
const CompaniesPage       = lazy(() => import("./features/seeker/pages/CompaniesPage"));
const CompanyDetailsPage  = lazy(() => import("./features/seeker/pages/CompanyDetailsPage"));
const RecruiterDashboard  = lazy(() => import("./features/recruiter/pages/RecruiterDashboard"));
const CompanyManagementPage = lazy(() => import("./features/recruiter/pages/CompanyManagementPage"));
const JobDashboardPage    = lazy(() => import("./features/recruiter/pages/JobDashboardPage"));
const JobFormPage         = lazy(() => import("./features/recruiter/pages/JobFormPage"));
const JobApplicationsPage = lazy(() => import("./features/recruiter/pages/JobApplicationsPage"));
const AdminDashboard      = lazy(() => import("./features/admin/pages/AdminDashboard"));
const AdminDashboardPage  = lazy(() => import("./features/admin/pages/AdminDashboardPage"));
const AdminJobsPage       = lazy(() => import("./features/admin/pages/AdminJobsPage"));

function PageLoader() {
  return (
    <div className="flex justify-center items-center h-full py-20">
      <Loader2 className="animate-spin text-secondary w-8 h-8" />
    </div>
  );
}

const AUTH_ROUTES = ["/login", "/register"];

function AppLayout() {
  const { isAuthenticated, user } = useContext(AuthContext);
  const location = useLocation();

  const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
  const [expanded, setExpanded] = useState(isDesktop);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const handler = (e) => setExpanded(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const isMobile   = !window.matchMedia("(min-width: 1024px)").matches;
  const isAuthPage  = AUTH_ROUTES.includes(location.pathname);
  const showSidebar = isAuthenticated && !isAuthPage;

  // Sidebar is fixed-positioned; offset main content on desktop only
  const mainOffset = showSidebar && !isMobile ? (expanded ? "lg:pl-60" : "lg:pl-16") : "";

  return (
    <div className="h-screen flex flex-col bg-app font-sans text-primary transition-colors duration-300">
      <Navbar
        sidebarExpanded={expanded}
        onToggleSidebar={() => setExpanded((p) => !p)}
      />

      <div className="flex flex-1 overflow-hidden">
        {showSidebar && (
          <Sidebar
            expanded={expanded}
            onClose={() => setExpanded(false)}
            isMobile={isMobile}
          />
        )}

        <main
          className={`flex-1 overflow-y-auto h-full transition-all duration-300 ${mainOffset}`}
        >
          <AnimatePresence mode="wait">
            <Suspense fallback={<PageLoader />}>
            <Routes location={location} key={location.pathname}>
              {/* Home — only for logged out users */}
              <Route path="/" element={
                isAuthenticated
                  ? <Navigate to="/dashboard" replace />
                  : <PageTransition><Home /></PageTransition>
              } />
              <Route path="/login"    element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <PageTransition><Login /></PageTransition>} />
              <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <PageTransition><Register /></PageTransition>} />

              {/* Dashboards — single route, role-based render */}
              <Route element={<ProtectedRoute allowedRoles={["seeker", "recruiter", "admin"]} />}>
                <Route path="/dashboard" element={
                  <PageTransition>
                    {user?.role === "seeker"    ? <SeekerDashboard />    :
                     user?.role === "recruiter" ? <RecruiterDashboard /> :
                     user?.role === "admin"     ? <AdminDashboard />     : null}
                  </PageTransition>
                } />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={["seeker", "recruiter"]} />}>
                <Route path="/profile" element={<PageTransition><ProfilePage /></PageTransition>} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={["recruiter"]} />}>
                <Route path="/recruiter/company"  element={<PageTransition><CompanyManagementPage /></PageTransition>} />
                <Route path="/recruiter/jobs"     element={<PageTransition><JobDashboardPage /></PageTransition>} />
                <Route path="/recruiter/post-job" element={<PageTransition><JobFormPage /></PageTransition>} />
                <Route path="/recruiter/edit-job/:id" element={<PageTransition><JobFormPage /></PageTransition>} />
                <Route path="/recruiter/jobs/:jobId/applications" element={<PageTransition><JobApplicationsPage /></PageTransition>} />
              </Route>

              <Route path="/jobs"     element={<PageTransition><JobSearchPage /></PageTransition>} />
              <Route path="/jobs/:id" element={<PageTransition><JobDetailsPage /></PageTransition>} />
              <Route path="/companies"     element={<PageTransition><CompaniesPage /></PageTransition>} />
              <Route path="/companies/:id" element={<PageTransition><CompanyDetailsPage /></PageTransition>} />

              <Route element={<ProtectedRoute allowedRoles={["seeker"]} />}>
                <Route path="/my-applications" element={<PageTransition><MyApplicationsPage /></PageTransition>} />
                <Route path="/saved-jobs" element={<PageTransition><SavedJobsPage /></PageTransition>} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                <Route path="/admin" element={<PageTransition><AdminDashboardPage /></PageTransition>} />
                <Route path="/admin/jobs" element={<PageTransition><AdminJobsPage /></PageTransition>} />
              </Route>

              <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
            </Routes>
            </Suspense>
          </AnimatePresence>
        </main>
      </div>

      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppLayout />
    </ThemeProvider>
  );
}
