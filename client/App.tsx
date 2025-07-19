import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { InteractiveProvider } from "@/contexts/InteractiveContext";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import GetStarted from "./pages/GetStarted";
import VoiceSession from "./pages/VoiceSession";
import Demo from "./pages/Demo";
import Dashboard from "./pages/Dashboard";
import FindMentor from "./pages/FindMentor";
import Placeholder from "./pages/Placeholder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <InteractiveProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/get-started" element={<GetStarted />} />
              <Route path="/voice-session" element={<VoiceSession />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/find-mentor" element={<FindMentor />} />
              <Route path="/schedule" element={<Placeholder />} />
              <Route path="/achievements" element={<Placeholder />} />
              <Route path="/courses" element={<Placeholder />} />
              <Route path="/community" element={<Placeholder />} />
              <Route path="/questions" element={<Placeholder />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </InteractiveProvider>
    </AppProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
