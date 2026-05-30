/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Activity, LayoutDashboard, Utensils, Zap, User, BarChart4, Settings, LogOut, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  activeStreak: number;
  userName?: string;
  onLogout: () => void;
}

export default function Navbar({ currentPage, onPageChange, activeStreak, userName, onLogout }: NavbarProps) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('bodysync_theme');
    if (saved) return saved === 'dark';
    return typeof window !== 'undefined' ? document.documentElement.classList.contains('dark') : false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('bodysync_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('bodysync_theme', 'light');
    }
  }, [isDark]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'nutrition', label: 'Activity Log', icon: Utensils },
    { id: 'insights', label: 'Health Advisory', icon: Zap },
    { id: 'profile', label: 'Metrics Plan', icon: User },
    { id: 'progress', label: 'Analytics', icon: BarChart4 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#EBE6DC] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo Brand Segment in sleek 3-color look */}
          <div className="flex items-center gap-2.5">
            <div className="bg-[#2D2A26] text-white p-2 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-[#2D2A26] font-semibold font-sans tracking-tight text-sm leading-none block">NutriPulse</span>
              <span className="text-[9px] text-[#8C867B] block mt-0.5 font-medium uppercase tracking-wider">
                Health Intelligence System
              </span>
            </div>
          </div>

          {/* Center Navigation Links with smaller text and reduced weights */}
          <div className="hidden lg:flex space-x-1 items-center">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => onPageChange(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium tracking-normal transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#2D2A26] text-white shadow-sm'
                      : 'text-[#8C867B] hover:text-[#2D2A26] hover:bg-[#F6F4EF]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Action Items: Streak, Profile & Logout in elegant thin frames */}
          <div className="flex items-center gap-3">
            {/* Active Theme Mode Toggler */}
            <button
              onClick={() => setIsDark(!isDark)}
              id="theme-mode-toggle"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="flex items-center justify-center p-2 text-[#2D2A26] hover:bg-[#F6F4EF] rounded-lg transition-all cursor-pointer relative"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-500 shrink-0" />
              ) : (
                <Moon className="w-4 h-4 text-[#2D2A26] shrink-0" />
              )}
            </button>

            {/* Profile context */}
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-[11px] font-semibold text-[#2D2A26] leading-none">{userName || 'Active User'}</span>
              <span className="text-[8px] text-[#8C867B] mt-0.5 font-medium uppercase tracking-wider">Supervised Profile</span>
            </div>

            {/* Log Out Button */}
            <button
              onClick={onLogout}
              id="nav-logout-btn"
              title="Sign Out"
              className="p-2 text-[#8C867B] hover:text-[#2D2A26] hover:bg-[#F6F4EF] rounded-lg transition-all duration-150 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Small screens submenu bar with refined weights */}
        <div className="flex lg:hidden overflow-x-auto pb-2 pt-1 border-t border-[#EBE6DC] space-x-1 no-scrollbar scroll-smooth">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-mobile-${item.id}`}
                onClick={() => onPageChange(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#2D2A26] text-white font-semibold'
                    : 'text-[#8C867B] hover:bg-[#F6F4EF]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </nav>
  );
}
