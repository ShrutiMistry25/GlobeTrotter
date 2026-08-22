import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ProtectedRoute, PublicOnlyRoute } from './components/RouteGuards';

import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import MyTripsPage from './pages/trips/MyTripsPage';
import CreateTripPage from './pages/trips/CreateTripPage';
import ItineraryBuilderPage from './pages/trips/ItineraryBuilderPage';
import ItineraryViewPage from './pages/trips/ItineraryViewPage';
import TripCalendarPage from './pages/trips/TripCalendarPage';
import BudgetPage from './pages/trips/BudgetPage';
import CitySearchPage from './pages/explore/CitySearchPage';
import ActivitySearchPage from './pages/explore/ActivitySearchPage';
import ProfilePage from './pages/ProfilePage';
import SharedItineraryPage from './pages/public/SharedItineraryPage';

function Shell({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
            <Route path="/signup" element={<PublicOnlyRoute><SignupPage /></PublicOnlyRoute>} />
            <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPasswordPage /></PublicOnlyRoute>} />
            <Route path="/reset-password" element={<PublicOnlyRoute><ResetPasswordPage /></PublicOnlyRoute>} />

            <Route path="/share/:slug" element={<SharedItineraryPage />} />

            <Route path="/" element={<ProtectedRoute><Shell><DashboardPage /></Shell></ProtectedRoute>} />
            <Route path="/trips" element={<ProtectedRoute><Shell><MyTripsPage /></Shell></ProtectedRoute>} />
            <Route path="/trips/new" element={<ProtectedRoute><Shell><CreateTripPage /></Shell></ProtectedRoute>} />
            <Route path="/trips/:id/build" element={<ProtectedRoute><Shell><ItineraryBuilderPage /></Shell></ProtectedRoute>} />
            <Route path="/trips/:id/view" element={<ProtectedRoute><Shell><ItineraryViewPage /></Shell></ProtectedRoute>} />
            <Route path="/trips/:id/calendar" element={<ProtectedRoute><Shell><TripCalendarPage /></Shell></ProtectedRoute>} />
            <Route path="/trips/:id/budget" element={<ProtectedRoute><Shell><BudgetPage /></Shell></ProtectedRoute>} />
            <Route path="/explore/cities" element={<ProtectedRoute><Shell><CitySearchPage /></Shell></ProtectedRoute>} />
            <Route path="/explore/activities" element={<ProtectedRoute><Shell><ActivitySearchPage /></Shell></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Shell><ProfilePage /></Shell></ProtectedRoute>} />

            <Route
              path="*"
              element={
                <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center">
                  <span className="material-symbols-outlined mb-3 text-6xl text-outline">wrong_location</span>
                  <h1 className="text-2xl font-extrabold text-ink">Page not found</h1>
                  <a href="/" className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white">Back home</a>
                </div>
              }
            />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
