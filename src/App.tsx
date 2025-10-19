import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminLayout } from "./components/admin/AdminLayout";

import Dashboard from "./pages/Dashboard";
import Doctors from "./pages/Doctors";
import Patients from "./pages/Patients";
import Articles from "./pages/Articles";
import SuspendedUsers from "./pages/SuspendedUsers";
import AppointmentsList from "./pages/AppointmentsList";
import ChatScreen from "./pages/ChatScreen";
import VideoCallScreen from "./pages/VideoCallScreen";
import NotificationsScreen from "./pages/NotificationsScreen";
import SettingsScreen from "./pages/SettingsScreen";
import TransactionLog from "./pages/TransactionLog";
import FeedbackAnalysis from "./pages/FeedbackAnalysis";
import Candidates from "./pages/Candidates";
import AdminActivity from "./pages/AdminActivity";
import NotFound from "./pages/NotFound";
import ExportLog from "./pages/ExportLog";
import SecurityReport from "./pages/SecurityReport";
import ViewAppointment from "./pages/ViewAppointment";
import EditAppointment from "./pages/EditAppointment";
import UploadArticle from "./pages/UploadArticles";
import ExportList from "./pages/ExportList";
import AddCandidate from "./pages/AddCandidate";
import ReviewCandidate from "./pages/ReviewCandidate";
import GenerateReport from "./pages/GenerateReport";
import DoctorFeedback from "./pages/DoctorFeedback";
import EditDoctor from "./pages/EditDoctor";
import EditPatient from "./pages/EditPatient";
import AddPatient from "./pages/AddPatient";
import GenerateReports from "./pages/GenerateReports";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import AdminManagement from "./pages/AdminManagement";
import BlacklistManagement from "./pages/BlacklistManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Login Page */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Admin Layout (with Sidebar) */}
            <Route element={<AdminLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/add-patient" element={<AddPatient />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/articles/upload" element={<UploadArticle />} />
              <Route path="/suspended" element={<SuspendedUsers />} />
              <Route path="/appointments" element={<AppointmentsList />} />
              <Route path="/appointments/:id" element={<ViewAppointment />} />
              <Route path="/appointments/:id/edit" element={<EditAppointment />} />
              <Route path="/transactions" element={<TransactionLog />} />
              <Route path="/feedback" element={<FeedbackAnalysis />} />
              <Route path="/feedback/:id" element={<DoctorFeedback />} />
              <Route path="/candidates" element={<Candidates />} />
              <Route path="/add-candidate" element={<AddCandidate />} />
              <Route path="/review/:id" element={<ReviewCandidate />} />
              <Route path="/generate-report" element={<GenerateReport />} />
              <Route path="/generate-reports" element={<GenerateReports />} />
              <Route path="/chat" element={<ChatScreen />} />
              <Route path="/video" element={<VideoCallScreen />} />
              <Route path="/notifications" element={<NotificationsScreen />} />
              <Route path="/settings" element={<SettingsScreen />} />
              <Route path="/export-log" element={<ExportLog />} />
              <Route path="/export-list" element={<ExportList />} />
              <Route path="/security-report" element={<SecurityReport />} />
              <Route path="/admin-management" element={<AdminManagement />} />
              <Route path="/activity" element={<AdminActivity />} />
              <Route path="/blacklist" element={<BlacklistManagement />} />
              <Route path="/edit-doctor/:id" element={<EditDoctor />} />
              <Route path="/edit-patient/:id" element={<EditPatient />} />
            </Route>

            {/* 404 Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
