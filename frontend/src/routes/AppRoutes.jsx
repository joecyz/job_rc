import { BrowserRouter, Routes, Route } from "react-router-dom";

// ==============================
// PUBLIC PAGES
// ==============================

import Landing from "../pages/Landing/Landing";
import Jobs from "../pages/Jobs/Jobs";
import JobDetail from "../pages/JobDetail/JobDetail";
import Events from "../pages/Events/Events";
import EventDetail from "../pages/EventDetail/EventDetail";
import FAQ from "../pages/FAQ/FAQ";

// ==============================
// AUTH PAGES
// ==============================

import ApplicantLogin from "../pages/Auth/ApplicantLogin";
import ApplicantRegister from "../pages/Auth/ApplicantRegister";
import InternalLogin from "../pages/Auth/InternalLogin";

// ==============================
// APPLICANT PAGES
// ==============================

import Applications from "../pages/Applications/Applications";
import Profile from "../pages/Profile/Profile";

// ==============================
// EVENT PAGES
// ==============================

import AllEvents from "../pages/Events/AllEvents";
import EventDashboard from "../pages/EventDashboard/EventDashboard";

// ==============================
// HR PAGES
// ==============================

import HRDashboard from "../pages/HRDashboard/HRDashboard";
import HRApplications from "../pages/HRApplications/HRApplications";
import HRApplicationDetail from "../pages/HRApplications/HRApplicationDetail";
import HRJobForm from "../pages/HRJobForm";
import HRJobDetail from "../pages/HRJobDetail";

// ==============================
// ROUTE PROTECTION
// ==============================

import RoleProtectedRoute from "./RoleProtectedRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ==================================================
            PUBLIC
        ================================================== */}

        <Route
          path="/"
          element={<Landing />}
        />

        {/* Applicant Login */}
        <Route
          path="/login"
          element={<ApplicantLogin />}
        />

        {/* Applicant Register */}
        <Route
          path="/register"
          element={<ApplicantRegister />}
        />

        {/* Internal Login - HR & Team Event */}
        <Route
          path="/internal/login"
          element={<InternalLogin />}
        />

        {/* Public Jobs */}
        <Route
          path="/jobs"
          element={<Jobs />}
        />

        <Route
          path="/jobs/:id"
          element={<JobDetail />}
        />

        {/* Public Events */}
        <Route
          path="/events"
          element={<Events />}
        />

        <Route
          path="/events/:id"
          element={<EventDetail />}
        />

        {/* Public All Events */}
        <Route
          path="/events/all"
          element={<AllEvents />}
        />

        {/* Public FAQ */}
        <Route
          path="/faq"
          element={<FAQ />}
        />


        {/* ==================================================
            TEAM EVENT
        ================================================== */}

        {/* Dashboard Team Event */}
        <Route
          path="/event/dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["Event Team"]}>
              <EventDashboard />
            </RoleProtectedRoute>
          }
        />


        {/* ==================================================
            APPLICANT
        ================================================== */}

        {/* My Applications */}
        <Route
          path="/applications"
          element={
            <RoleProtectedRoute allowedRoles={["Applicant"]}>
              <Applications />
            </RoleProtectedRoute>
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <RoleProtectedRoute allowedRoles={["Applicant"]}>
              <Profile />
            </RoleProtectedRoute>
          }
        />


        {/* ==================================================
            HR DASHBOARD
        ================================================== */}

        <Route
          path="/hr/dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["HR"]}>
              <HRDashboard />
            </RoleProtectedRoute>
          }
        />


        {/* ==================================================
            HR APPLICATIONS
        ================================================== */}

        <Route
          path="/hr/applications"
          element={
            <RoleProtectedRoute allowedRoles={["HR"]}>
              <HRApplications />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/hr/applications/:id"
          element={
            <RoleProtectedRoute allowedRoles={["HR"]}>
              <HRApplicationDetail />
            </RoleProtectedRoute>
          }
        />


        {/* ==================================================
            HR JOBS
        ================================================== */}

        {/* Create Job */}
        <Route
          path="/hr/jobs/create"
          element={
            <RoleProtectedRoute allowedRoles={["HR"]}>
              <HRJobForm />
            </RoleProtectedRoute>
          }
        />

        {/* Job Detail */}
        <Route
          path="/hr/jobs/:id"
          element={
            <RoleProtectedRoute allowedRoles={["HR"]}>
              <HRJobDetail />
            </RoleProtectedRoute>
          }
        />

        {/* Edit Job */}
        <Route
          path="/hr/jobs/:id/edit"
          element={
            <RoleProtectedRoute allowedRoles={["HR"]}>
              <HRJobForm />
            </RoleProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;