import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="patients" element={<Patients />} />
            <Route path="articles" element={<Articles />} />
            <Route path="suspended" element={<SuspendedUsers />} />
            <Route path="appointments" element={<AppointmentsList />} />
            <Route path="transactions" element={<TransactionLog />} />
            <Route path="feedback" element={<FeedbackAnalysis />} />
            <Route path="candidates" element={<Candidates />} />
            <Route path="activity" element={<AdminActivity />} />
            <Route path="chat" element={<ChatScreen />} />
            <Route path="video" element={<VideoCallScreen />} />
            <Route path="notifications" element={<NotificationsScreen />} />
            <Route path="settings" element={<SettingsScreen />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
