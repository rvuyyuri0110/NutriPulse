/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { useApp } from './AppContext';
import { Mail, Lock, User, AlertCircle, ArrowRight, ShieldCheck, Activity } from 'lucide-react';

export default function AuthPage() {
  const { login, register, authError } = useApp();
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLoginView) {
        await login(email, password);
      } else {
        const success = await register(name, email, password);
        if (success) {
          localStorage.setItem('bodysync_just_registered', 'true');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F4EF] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      
      {/* Absolute subtle modern overlay background */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-[#2D2A26]/3 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 flex flex-col items-center">
        
        {/* Sleek Minimal Brand Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="bg-[#2D2A26] text-white p-2.5 rounded-lg flex items-center justify-center shadow-sm">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <span className="text-[#2D2A26] font-semibold text-base font-sans tracking-tight block leading-none">NutriPulse</span>
            <span className="text-[9px] text-[#8C867B] block mt-1 font-medium uppercase tracking-wider">
              Health Intelligence System
            </span>
          </div>
        </div>

        {/* Content Box with ultra-minimal enterprise curves */}
        <div className="w-full bg-white border border-[#EBE6DC] p-8 sm:p-10 rounded-xl shadow-sm">
          
          {/* Switch tab buttons */}
          <div className="flex border-b border-[#EBE6DC] pb-4 mb-8">
            <button 
              type="button"
              id="switch-login-btn"
              onClick={() => { setIsLoginView(true); setName(''); }}
              className={`flex-1 text-center py-2 text-[11px] font-semibold uppercase tracking-wider transition-all duration-150 cursor-pointer ${isLoginView ? 'text-[#2D2A26] border-b-2 border-[#2D2A26]' : 'text-[#8C867B] hover:text-[#2D2A26]'}`}
            >
              Log In
            </button>
            <button 
              type="button"
              id="switch-signup-btn"
              onClick={() => setIsLoginView(false)}
              className={`flex-1 text-center py-2 text-[11px] font-semibold uppercase tracking-wider transition-all duration-150 cursor-pointer ${!isLoginView ? 'text-[#2D2A26] border-b-2 border-[#2D2A26]' : 'text-[#8C867B] hover:text-[#2D2A26]'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {!isLoginView && (
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[10px] font-bold text-[#2D2A26] uppercase tracking-wider">My Nickname / Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-[#8C867B]" />
                  <input
                    type="text"
                    required
                    placeholder="E.g. Alexander Cole"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#F6F4EF]/40 border border-[#EBE6DC] rounded-lg pl-9 pr-3 py-2 text-[11px] font-medium placeholder-[#8C867B] text-[#2D2A26] outline-none focus:bg-white focus:border-[#2D2A26] transition-all font-sans"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[10px] font-bold text-[#2D2A26] uppercase tracking-wider">My Account Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-[#8C867B]" />
                <input
                  type="email"
                  required
                  placeholder="name@organization.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F6F4EF]/40 border border-[#EBE6DC] rounded-lg pl-9 pr-3 py-2 text-[11px] font-medium placeholder-[#8C867B] text-[#2D1A26] outline-none focus:bg-white focus:border-[#2D1A26] transition-all font-sans"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[10px] font-bold text-[#2D2A26] uppercase tracking-wider">Choose a Secret Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-[#8C867B]" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#F6F4EF]/40 border border-[#EBE6DC] rounded-lg pl-9 pr-3 py-2 text-[11px] font-medium placeholder-[#8C867B] text-[#2D1A26] outline-none focus:bg-white focus:border-[#2D1A26] transition-all font-sans"
                />
              </div>
            </div>

            {authError && (
              <div className="bg-red-50 border border-red-200/60 p-3.5 rounded-lg flex items-start gap-2.5 text-[10px] text-red-800 font-medium font-sans">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              id="auth-submit-btn"
              className="w-full py-2.5 bg-[#2D2A26] hover:bg-[#1E1C1A] text-white rounded-lg text-[10px] font-semibold uppercase tracking-widest disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 mt-6 cursor-pointer"
            >
              <span>{loading ? 'Authenticating System...' : isLoginView ? "Sign In Securely" : 'Complete Registration'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </button>

          </form>

          <div className="mt-8 pt-6 border-t border-[#EBE6DC] flex flex-col gap-2.5 text-[9px] text-[#8C867B] leading-relaxed text-left font-medium">
            <div className="flex items-center gap-1.5 text-[#2D2A26] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#2D2A26]" />
              <span>Identity Verification Enforced</span>
            </div>
            <div>Registration is automated. System utilizes local secure tokens for ongoing profiling validations.</div>
          </div>

        </div>
      </div>

    </div>
  );
}
