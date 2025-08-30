import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GetStartedPage from "./pages/GetStarted";
import TimelinePage from "./pages/Timeline";
import DarshanBookingPage from "./pages/DarshanBooking";
import BookingsPage from "./pages/Bookings";
import AudioPage from "./pages/Audio";
import LoginPage from "./pages/Login";
import { AuthProvider } from "@/components/auth-provider";
import { AnonOnly, RequireAuth } from "@/components/route-guards";
import ProfilePage from "./pages/Profile";
import PublicProfilePage from "./pages/PublicProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route
                  path="/"
                  element={
                    <RequireAuth>
                      <Index />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/get-started"
                  element={
                    <AnonOnly>
                      <GetStartedPage />
                    </AnonOnly>
                  }
                />
                <Route path="/signup" element={<Navigate to="/get-started" replace />} />
                <Route
                  path="/timeline"
                  element={
                    <RequireAuth>
                      <TimelinePage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/darshan-booking"
                  element={
                    <RequireAuth>
                      <DarshanBookingPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/bookings"
                  element={
                    <RequireAuth>
                      <BookingsPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/audio"
                  element={
                    <RequireAuth>
                      <AudioPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <AnonOnly>
                      <LoginPage />
                    </AnonOnly>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <RequireAuth>
                      <ProfilePage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/u/:id"
                  element={
                    <RequireAuth>
                      <PublicProfilePage />
                    </RequireAuth>
                  }
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
