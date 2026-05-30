/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { useApp } from './AppContext';
import { UserProfile, GenderType } from '../types';
import { 
  User, Mail, Dumbbell, Scale, HelpCircle, CheckCircle2, ChevronRight, Calculator, Trophy, Smile
} from 'lucide-react';

export default function ProfilePage() {
  const { user, updateProfile } = useApp();
  
  const p = user?.profile || {
    name: '',
    email: '',
    age: 26,
    gender: 'unspecified',
    height: 175,
    weight: 72,
    targetWeight: 72,
    bodyFatPercentage: 15,
    muscleMassEstimate: 20,
    activityLevel: 'moderately_active',
    dietaryPreference: 'none',
    allergies: 'None',
    workoutFrequency: 4,
    sleepDuration: 8,
    fatDistribution: 'uniform',
    fitnessGoal: 'maintain',
  };

  // Profile forms state
  const [profileForm, setProfileForm] = useState<UserProfile>({
    name: p.name,
    email: p.email || user?.email || '',
    age: p.age,
    gender: p.gender,
    height: p.height,
    weight: p.weight,
    targetWeight: p.targetWeight || p.weight,
    bodyFatPercentage: p.bodyFatPercentage || 15,
    muscleMassEstimate: p.muscleMassEstimate || 20,
    activityLevel: p.activityLevel,
    dietaryPreference: p.dietaryPreference,
    allergies: p.allergies || 'None',
    workoutFrequency: p.workoutFrequency || 4,
    sleepDuration: p.sleepDuration || 8,
    fatDistribution: p.fatDistribution || 'uniform',
    fitnessGoal: p.fitnessGoal || 'maintain',
  });

  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  // Compute stats
  const heightInMeters = profileForm.height / 100;
  const bmi = heightInMeters > 0 ? profileForm.weight / (heightInMeters * heightInMeters) : 0;
  
  const targetCalories = 2200; // Enterprise active norm calculator
  const recommendedWaterUsageMl = 2500; // standard adult rule

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSyncing(true);
    setSyncSuccess(false);
    try {
      const ok = await updateProfile(profileForm);
      if (ok) {
        setSyncSuccess(true);
        setTimeout(() => setSyncSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto">
      
      {/* Title Segment */}
      <div className="bg-white border border-[#EBE6DC] rounded-xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
        <div className="text-left">
          <h1 className="text-xl font-semibold text-[#2D2A26] tracking-tight">Metrics Plan & Biometrics</h1>
          <p className="text-[#8C867B] text-[11px] font-normal mt-1 uppercase tracking-wider">
            Maintain metabolic thresholds, dynamic calorie targets, and somatometric profiles.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns: Profile Configuration forms */}
        <div className="lg:col-span-2 card-bento flex flex-col gap-6 text-left">
          <div className="border-b border-[#EBE6DC] pb-3">
            <h2 className="text-xs font-semibold text-[#2D2A26] uppercase tracking-wider">Demographic & BioData Parameters</h2>
            <p className="text-[10px] text-[#8C867B] font-normal mt-0.5">Configure accurate active status variables</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Identity and Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#8C867B] uppercase tracking-wider">Full Account Identifier</label>
                <input 
                  type="text" 
                  value={profileForm.name}
                  placeholder="E.g., Alexander Cole"
                  onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-[#F6F4EF]/55 border border-[#EBE6DC] rounded-lg px-4 py-2 text-[11px] text-[#2D2A26] outline-none focus:bg-white focus:border-[#2D2A26] transition-all font-sans"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#8C867B] uppercase tracking-wider">Gender Classifier</label>
                <select
                  value={profileForm.gender}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, gender: e.target.value as GenderType }))}
                  className="bg-[#F6F4EF]/55 border border-[#EBE6DC] rounded-lg px-4 py-2 text-[11px] font-medium text-[#2D2A26] outline-none focus:bg-white focus:border-[#2D2A26] transition-all cursor-pointer font-sans"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="unspecified">Unspecified / Other</option>
                </select>
              </div>
            </div>

            {/* Somanometrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-[#EBE6DC]/80 pt-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#8C867B] uppercase tracking-wider">Age (Years)</label>
                <input 
                  type="number" 
                  value={profileForm.age}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, age: Number(e.target.value) }))}
                  className="bg-[#F6F4EF]/55 border border-[#EBE6DC] rounded-lg px-4 py-2 text-[11px] text-[#2D2A26] outline-none focus:bg-white focus:border-[#2D2A26] transition-all font-sans font-mono"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#8C867B] uppercase tracking-wider">Height (cm)</label>
                <input 
                  type="number" 
                  value={profileForm.height}
                  placeholder="Height in cm"
                  onChange={(e) => setProfileForm(prev => ({ ...prev, height: Number(e.target.value) }))}
                  className="bg-[#F6F4EF]/55 border border-[#EBE6DC] rounded-lg px-4 py-2 text-[11px] text-[#2D2A26] outline-none focus:bg-white focus:border-[#2D2A26] transition-all font-sans font-mono"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#8C867B] uppercase tracking-wider">Weight (kg)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={profileForm.weight}
                  placeholder="Weight in kg"
                  onChange={(e) => setProfileForm(prev => ({ ...prev, weight: Number(e.target.value) }))}
                  className="bg-[#F6F4EF]/55 border border-[#EBE6DC] rounded-lg px-4 py-2 text-[11px] text-[#2D2A26] outline-none focus:bg-white focus:border-[#2D2A26] transition-all font-sans font-mono"
                />
              </div>
            </div>

            {/* Activities & Physical Thresholds */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-[#EBE6DC]/80 pt-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#8C867B] uppercase tracking-wider">Night Sleep Target (Hrs)</label>
                <input 
                  type="number"
                  step="0.5"
                  value={profileForm.sleepDuration}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, sleepDuration: Number(e.target.value) }))}
                  className="bg-[#F6F4EF]/55 border border-[#EBE6DC] rounded-lg px-4 py-2 text-[11px] text-[#2D2A26] outline-none focus:bg-white focus:border-[#2D2A26] transition-all font-sans font-mono"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#8C867B] uppercase tracking-wider">Activity Frequency</label>
                <select
                  value={profileForm.activityLevel}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, activityLevel: e.target.value as any }))}
                  className="bg-[#F6F4EF]/55 border border-[#EBE6DC] rounded-lg px-4 py-2 text-[11px] font-medium text-[#2D2A26] outline-none focus:bg-white focus:border-[#2D2A26] transition-all cursor-pointer font-sans"
                >
                  <option value="sedentary">Sedentary (Minimum movement)</option>
                  <option value="lightly_active">Active Training 1-2 days / week</option>
                  <option value="moderately_active">Active Training 3-5 days / week</option>
                  <option value="very_active">Intense Professional Athlete</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#8C867B] uppercase tracking-wider">Food Cautions / Allergies</label>
                <input 
                  type="text"
                  value={profileForm.allergies}
                  placeholder="E.g., No peanuts, dairy..."
                  onChange={(e) => setProfileForm(prev => ({ ...prev, allergies: e.target.value }))}
                  className="bg-[#F6F4EF]/55 border border-[#EBE6DC] rounded-lg px-4 py-2 text-[11px] text-[#2D2A26] outline-none focus:bg-white focus:border-[#2D2A26] transition-all font-sans"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={syncing}
              id="profile-sync-btn"
              className="mt-4 w-full py-2.5 bg-[#2D2A26] hover:bg-[#1E1C1A] text-white rounded-lg text-[10px] font-semibold uppercase tracking-widest disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>{syncing ? 'Processing Profiling Database...' : 'Save Metrics Plan'}</span>
            </button>

            {syncSuccess && (
              <div className="bg-[#F6F4EF] border border-[#EBE6DC] p-4 rounded-lg text-[10px] font-bold text-[#2D2A26] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2D2A26] shrink-0" />
                <span>Profiles successfully synchronized into system disk memory.</span>
              </div>
            )}

          </form>
        </div>

        {/* Right 1 column: Simple Calculated child dashboard */}
        <div className="flex flex-col gap-8">
          
          <div className="card-bento flex flex-col gap-5 text-left">
            <div className="border-b border-[#EBE6DC] pb-3">
              <h2 className="text-xs font-semibold text-[#2D2A26] uppercase tracking-wider">Computed Benchmarks</h2>
              <p className="text-[10px] text-[#8C867B] font-normal mt-0.5">Calculated automatic biomarkers</p>
            </div>

            <div className="flex flex-col gap-3">
              {/* Simplified BMI */}
              <div className="bg-[#F6F4EF] border border-[#EBE6DC] p-4.5 rounded-lg flex justify-between items-center">
                <div>
                  <span className="text-[9px] text-[#8C867B] font-bold uppercase tracking-wider block">Somatotype Index (BMI)</span>
                  <span className="text-sm font-semibold text-[#2D2A26] mt-1 block">
                    {bmi.toFixed(1)} 
                    <span className="text-[9px] font-bold text-[#8C867B] block mt-1 uppercase tracking-wider">
                      {bmi < 18.5 ? 'Catabolism Threshold' : bmi < 25 ? 'Optimized Equilibrium' : 'Anabolism Variance'}
                    </span>
                  </span>
                </div>
                <Smile className="w-6 h-6 text-[#2D2A26]" />
              </div>

              {/* Maintenance */}
              <div className="bg-[#F6F4EF] border border-[#EBE6DC] p-4.5 rounded-lg flex justify-between items-center">
                <div>
                  <span className="text-[9px] text-[#8C867B] font-bold uppercase tracking-wider block font-sans">Basal Energy Allowance</span>
                  <span className="text-sm font-semibold text-[#2D2A26] mt-1 block font-mono">{targetCalories} kcal / day</span>
                </div>
                <Calculator className="w-6 h-6 text-[#2D2A26]" />
              </div>

              {/* Hydration goal */}
              <div className="bg-[#F6F4EF] border border-[#EBE6DC] p-4.5 rounded-lg flex justify-between items-center">
                <div>
                  <span className="text-[9px] text-[#8C867B] font-bold uppercase tracking-wider block">Recommended Pure Hydration</span>
                  <span className="text-sm font-semibold text-[#2D2A26] mt-1 block font-mono">{(recommendedWaterUsageMl / 1000).toFixed(1)} Liters / Day</span>
                </div>
                <Trophy className="w-6 h-6 text-[#2D2A26]" />
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
