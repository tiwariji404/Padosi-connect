import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppDataProvider } from './contexts/AppDataContext';
import Login from './pages/Login';
import OTPVerification from './pages/OTPVerification';
import Onboarding from './pages/Onboarding';
import HomePage from './pages/HomePage';
import CityFeed from './pages/CityFeed';
import ChatList from './pages/ChatList';
import ChatRoom from './pages/ChatRoom';
import Services from './pages/Services';
import Profile from './pages/Profile';
import GroupDetail from './pages/GroupDetail';
import Notifications from './pages/Notifications';
import Marketplace from './pages/Marketplace';
import BloodDirectory from './pages/BloodDirectory';
import BottomNav from './components/BottomNav';
import SOSAlertModal from './components/SOSAlertModal';

const ProtectedRoute = ({ children, hideNav }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return (
    <div className="mobile-shell">
      {children}
      {!hideNav && <BottomNav />}
      <SOSAlertModal />
    </div>
  );
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<div className="mobile-shell"><Login /></div>} />
    <Route path="/otp" element={<div className="mobile-shell"><OTPVerification /></div>} />
    <Route path="/onboarding" element={<div className="mobile-shell"><Onboarding /></div>} />
    <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
    <Route path="/city-feed" element={<ProtectedRoute><CityFeed /></ProtectedRoute>} />
    <Route path="/chat" element={<ProtectedRoute><ChatList /></ProtectedRoute>} />
    <Route path="/chat/:id" element={<ProtectedRoute hideNav><ChatRoom /></ProtectedRoute>} />
    <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    <Route path="/groups/:id" element={<ProtectedRoute><GroupDetail /></ProtectedRoute>} />
    <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
    <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
    <Route path="/blood-directory" element={<ProtectedRoute><BloodDirectory /></ProtectedRoute>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppDataProvider>
    </AuthProvider>
  );
}
