/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { useApp } from './AppContext';
import { 
  Sparkles, ShieldCheck, CheckCircle2, 
  HelpCircle, Gift, Droplet, Apple, Dumbbell, Flame, Heart, Smile, Trophy
} from 'lucide-react';

export default function BodyInsights() {
  const { 
    user, 
    metabolicStats, 
    isMetabolicLoading, 
    fetchMetabolicAnalysis 
  } = useApp();

  // Load analysis once on mount
  useEffect(() => {
    if (!metabolicStats) {
      fetchMetabolicAnalysis();
    }
  }, []);

  // Helper renderer for sleek circular progress indicators
  const renderRadialRing = (label: string, consumed: number, target: number, unit: string) => {
    const percentage = Math.min(100, Math.round((consumed / (target || 1)) * 100));
    const radius = 34;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className={`bg-white border border-[#EBE6DC] p-5 rounded-lg flex flex-col items-center justify-center text-center shadow-sm`}>
        <span className="text-[9px] font-semibold uppercase text-[#8C867B] tracking-wider mb-2.5 block">{label}</span>
        
        {/* Sleek Minimalist Ring */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background ring */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              className="stroke-[#F6F4EF] fill-none"
              strokeWidth="5"
            />
            {/* Realized ring */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              className="stroke-[#2D2A26] fill-none transition-all duration-1000 ease-out"
              strokeWidth="5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
            <span className="text-xs font-semibold text-[#2D2A26]">{percentage}%</span>
            <span className="text-[8px] text-[#8C867B] mt-0.5 font-medium uppercase tracking-wider">Sync</span>
          </div>
        </div>

        <div className="text-[10px] text-[#2D2A26] mt-3 font-medium">
          {Math.round(consumed)}{unit} <span className="text-[#8C867B] font-normal">/ {target}{unit}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto font-sans">
      
      {/* Page Title Block */}
      <div className="bg-white border border-[#EBE6DC] rounded-xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
        <div>
          <h1 className="text-xl font-semibold text-[#2D2A26] tracking-tight">Health Advisory</h1>
          <p className="text-[#8C867B] text-[11px] font-normal mt-1 uppercase tracking-wider leading-relaxed">
            Biomarker metrics breakdown, macro nutrient values analysis, and custom automated advice templates.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-block px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider bg-[#F6F4EF] border border-[#EBE6DC] text-[#2D2A26] rounded-md">
              AdvisoryCompiled: {new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button 
            onClick={fetchMetabolicAnalysis}
            disabled={isMetabolicLoading}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#2D2A26] hover:bg-[#1E1C1A] text-white text-[10px] font-medium rounded-lg uppercase tracking-wider transition-all cursor-pointer border border-[#2D2A26]"
          >
            <Sparkles className={`w-3.5 h-3.5 text-white ${isMetabolicLoading ? 'animate-spin' : ''}`} />
            <span>{isMetabolicLoading ? 'Computing...' : 'Refresh Status'}</span>
          </button>
        </div>
      </div>

      {isMetabolicLoading ? (
        <div className="bg-white border border-[#EBE6DC] rounded-xl p-16 flex flex-col items-center justify-center gap-3 text-center">
          <div className="w-6 h-6 border-2 border-[#2D2A26] border-t-transparent rounded-full animate-spin" />
          <div>
            <span className="text-[10px] text-[#2D2A26] font-medium uppercase tracking-widest block">Querying adviser module...</span>
            <span className="text-[10px] text-[#8C867B] font-normal mt-1 block">Validating metabolic log records and daily variables...</span>
          </div>
        </div>
      ) : metabolicStats ? (
        <div className="flex flex-col gap-10">
          
          {/* AI Coach Summary Card */}
          <div className="card-bento flex flex-col gap-5">
            <div className="border-b border-[#EBE6DC] pb-3">
              <h2 className="text-xs font-semibold text-[#2D2A26] tracking-wider uppercase flex items-center gap-2">
                <Smile className="w-4 h-4 text-[#2D2A26]" />
                <span>Executive Metric Commentary</span>
              </h2>
              <p className="text-[9px] text-[#8C867B] mt-0.5 font-medium uppercase tracking-wider">Automated synthesis feedback</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              
              {/* Core Diagnosis Statement */}
              <div className="flex-1 flex flex-col gap-5">
                <blockquote className="text-xs font-normal text-[#2D2A26] italic border-l border-[#2D2A26] pl-4 py-1.5 bg-[#F6F4EF] p-4 rounded-lg leading-relaxed">
                  "{metabolicStats.aiFeedbackSummary || "Analysis of entered logs suggests appropriate caloric ranges and carbohydrate densities. Continue periodic logging."}"
                </blockquote>

                {/* Specific Alerts simplified */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* Deficiencies area */}
                  <div className="bg-white border border-[#EBE6DC] p-4.5 rounded-lg">
                    <span className="text-[10px] font-semibold text-[#2D2A26] uppercase flex items-center gap-2 mb-2.5">
                      <Trophy className="w-3.5 h-3.5 text-[#2D2A26]" />
                      <span>Metric target optimizations</span>
                    </span>
                    <ul className="flex flex-col gap-2">
                      {metabolicStats.deficiencies.length > 0 ? (
                        metabolicStats.deficiencies.map((def, i) => (
                          <li key={i} className="text-[11px] text-[#2D2A26] flex items-start gap-1.5 font-normal leading-relaxed">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#2D2A26] shrink-0 mt-0.5" />
                            <span>{def}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-[11px] text-[#2D2A26] flex items-start gap-1.5 font-normal leading-relaxed">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2D2A26] shrink-0 mt-0.5" />
                          <span>Ensure balanced leafy vegetables are scheduled for fiber metrics.</span>
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Gentle Cautions */}
                  <div className="bg-white border border-[#EBE6DC] p-4.5 rounded-lg">
                    <span className="text-[10px] font-semibold text-[#2D2A26] uppercase flex items-center gap-2 mb-2.5">
                      <Gift className="w-3.5 h-3.5 text-[#2D2A26]" />
                      <span>Consistency Suggestions</span>
                    </span>
                    <ul className="flex flex-col gap-2">
                      {metabolicStats.warnings.length > 0 ? (
                        metabolicStats.warnings.map((warn, i) => (
                          <li key={i} className="text-[11px] text-[#2D2A26] flex items-start gap-1.5 font-normal leading-relaxed">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#2D2A26] shrink-0 mt-0.5" />
                            <span>{warn}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-[11px] text-[#2D2A26] flex items-start gap-1.5 font-normal leading-relaxed">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2D2A26] shrink-0 mt-0.5" />
                          <span>Verify daily water thresholds are met during intervals.</span>
                        </li>
                      )}
                    </ul>
                  </div>

                </div>
              </div>

              {/* summary sidebar */}
              <div className="w-full md:w-[240px] bg-[#F6F4EF] border border-[#EBE6DC] p-4.5 rounded-lg flex flex-col gap-2.5 text-[11px]">
                <div className="text-[9px] font-semibold text-[#8C867B] uppercase tracking-wider pb-1.5 border-b border-[#EBE6DC]">Contextual Summary</div>
                <div className="flex justify-between py-1 border-b border-[#EBE6DC]/60">
                  <span className="text-[#8C867B]">Target Sleep:</span>
                  <span className="font-medium text-[#2D2A26]">{user?.profile.sleepDuration || 9} Hours</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#EBE6DC]/60">
                  <span className="text-[#8C867B]">Workout Frequency:</span>
                  <span className="font-medium text-[#2D2A26]">{user?.profile.workoutFrequency || 4} days/Wk</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#8C7A70]">Profile Tag:</span>
                  <span className="font-semibold text-[#2D2A26]">{user?.profile.name || 'User'}</span>
                </div>
              </div>

            </div>

          </div>

          {/* progress rings */}
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-xs font-semibold text-[#2D2A26] uppercase tracking-wider">Macromolecule Synthesis Variables</h2>
              <p className="text-[11px] text-[#8C867B] mt-0.5">Tracking values in compliance with predetermined health models.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              
              {renderRadialRing(
                'Protein',
                metabolicStats.proteinConsumed, 
                metabolicStats.proteinGoal || 60, 
                'g'
              )}

              {renderRadialRing(
                'Carbohydrates',
                metabolicStats.carbsConsumed, 
                metabolicStats.carbsGoal || 220, 
                'g'
              )}

              {renderRadialRing(
                'Fats',
                metabolicStats.fatsConsumed, 
                metabolicStats.fatsGoal || 65, 
                'g'
              )}

              {renderRadialRing(
                'Fiber',
                metabolicStats.fiberConsumed, 
                metabolicStats.fiberGoal || 25, 
                'g'
              )}

              {renderRadialRing(
                'Hydration',
                metabolicStats.waterConsumed, 
                metabolicStats.waterGoal || 2000, 
                'ml'
              )}

            </div>
          </div>

          {/* food/drink tips cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white border border-[#EBE6DC] rounded-xl p-6 flex flex-col gap-3">
              <h3 className="text-xs font-semibold text-[#2D2A26] uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-[#EBE6DC]">
                <Apple className="w-4 h-4 text-[#2D2A26]" />
                <span>Nutrient Density Guidelines</span>
              </h3>
              <p className="text-[11px] text-[#8C867B] leading-relaxed font-normal">
                Sustain biological performance and target cognitive focus with high-density foods including complex grains, nut compounds, and vegetable varieties. Eliminate processed structures.
              </p>
            </div>

            <div className="bg-white border border-[#EBE6DC] rounded-xl p-6 flex flex-col gap-3">
              <h3 className="text-xs font-semibold text-[#2D2A26] uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-[#EBE6DC]">
                <Dumbbell className="w-4 h-4 text-[#2D2A26]" />
                <span>Athletic Recovery & Rest</span>
              </h3>
              <p className="text-[11px] text-[#8C867B] leading-relaxed font-normal">
                Physical exercises like swimming, structured running, or routine aerobic sessions keeps the cardiovascular system optimized. Aim for regular quiet sleep intervals of 8-9 hours daily.
              </p>
            </div>

          </div>

        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-dashed border-[#EBE6DC] text-center">
          <HelpCircle className="w-8 h-8 text-[#2D2A26]/30 mb-3" />
          <span className="text-[10px] text-[#8C867B] font-semibold uppercase tracking-wider">No analysis compiled yet.</span>
          <p className="text-[11px] text-[#8C867B] mt-1 max-w-sm">Tap below to calculate physiological advisory profiles.</p>
          <button 
            onClick={fetchMetabolicAnalysis}
            className="mt-4 text-[10px] font-medium uppercase tracking-wider bg-[#2D2A26] hover:bg-[#1E1C1A] text-white rounded-lg py-2 px-4 shadow-sm cursor-pointer"
          >
            Compute Analysis Output
          </button>
        </div>
      )}

    </div>
  );
}
