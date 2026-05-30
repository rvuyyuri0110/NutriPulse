/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './components/AppContext';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import NutritionLog from './components/NutritionLog';
import BodyInsights from './components/BodyInsights';
import ProfilePage from './components/ProfilePage';
import ProgressAnalytics from './components/ProgressAnalytics';
import SettingsPage from './components/SettingsPage';
import AuthPage from './components/AuthPage';
import { motion, AnimatePresence } from 'motion/react';

function AppContent() {
  const { isAuthenticated, isLoading, user, logout, activeStreak } = useApp();
  const [currentPage, setCurrentPage] = useState<string>('dashboard');

  // Redirect to profile immediately if they just registered
  useEffect(() => {
    if (isAuthenticated) {
      const justReg = localStorage.getItem('bodysync_just_registered');
      if (justReg === 'true') {
        setCurrentPage('profile');
        localStorage.removeItem('bodysync_just_registered');
      }
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F6F4EF] flex flex-col items-center justify-center p-8">
        <div className="w-10 h-10 border-2 border-[#2D2A26] border-t-transparent rounded-full animate-spin" />
        <span className="text-[#2D2A26] mt-5 text-[11px] font-medium tracking-widest uppercase">
          Initializing secure environment...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-[#F6F4EF] flex flex-col font-sans selection:bg-[#EBE6DC]">
      
      {/* Premium Navbar segment */}
      <Navbar 
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
        activeStreak={activeStreak}
        userName={user?.profile.name}
        onLogout={logout}
      />

      {/* Main Container Viewport wrapping with smooth motions */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 sm:px-8 py-10 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-full flex flex-col gap-10"
          >
            {currentPage === 'dashboard' && <Dashboard />}
            
            {currentPage === 'nutrition' && (
              <NutritionLog 
                onCompleteAnalysisRedirect={() => setCurrentPage('insights')} 
              />
            )}
            
            {currentPage === 'insights' && <BodyInsights />}
            
            {currentPage === 'profile' && <ProfilePage />}
            
            {currentPage === 'progress' && <ProgressAnalytics />}
            
            {currentPage === 'settings' && <SettingsPage />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Subtle compact footer */}
      <footer className="py-8 border-t border-[#EBE6DC] bg-[#FFFFFF]/40 mt-20 text-center text-[10px] font-medium tracking-wider text-[#8C867B]">
        <div className="max-w-6xl mx-auto px-6">
          BODYSYNC METRIC SYSTEM &copy; 2026. SECURE COMPLIANCE ENGINE.
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
