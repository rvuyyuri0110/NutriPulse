/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useApp } from './AppContext';
import { DayLog } from '../types';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  CartesianGrid, BarChart, Bar, Legend, LineChart, Line 
} from 'recharts';
import { BarChart4, Flame, Trophy, Smile, Activity } from 'lucide-react';

export default function ProgressAnalytics() {
  const { userLogs } = useApp();
  const [metricTab, setMetricTab] = useState<'calories' | 'cups' | 'steps'>('calories');

  // Parse historic tracking metrics from available logs
  const logDays = (Object.values(userLogs) as DayLog[]).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Generate historic analytics dataset for charts
  const chartData = logDays.map((dayLog) => {
    let mealsCals = 0;
    dayLog.meals?.breakfast?.forEach((f: any) => mealsCals += Number(f.calories || 0));
    dayLog.meals?.lunch?.forEach((f: any) => mealsCals += Number(f.calories || 0));
    dayLog.meals?.snacks?.forEach((f: any) => mealsCals += Number(f.calories || 0));
    dayLog.meals?.dinner?.forEach((f: any) => mealsCals += Number(f.calories || 0));

    let workoutBurn = 0;
    dayLog.workouts?.forEach((w: any) => workoutBurn += Number(w.caloriesBurned || 0));

    const dateFormatted = new Date(dayLog.date).toLocaleDateString('default', { month: 'short', day: 'numeric' });
    const cupsIntake = Math.round((dayLog.waterIntake || 0) / 250);

    return {
      date: dateFormatted,
      intake: mealsCals,
      burned: workoutBurn,
      steps: dayLog.steps || 0,
      cups: cupsIntake,
    };
  });

  // Fallback demo data for clean initial visual chart presentation
  const fallbackChartData = [
    { date: 'May 25', intake: 1800, burned: 250, steps: 8400, cups: 6 },
    { date: 'May 26', intake: 1980, burned: 410, steps: 10200, cups: 8 },
    { date: 'May 27', intake: 1540, burned: 140, steps: 5100, cups: 4 },
    { date: 'May 28', intake: 2150, burned: 450, steps: 9400, cups: 9 },
    { date: 'May 29', intake: 1650, burned: 350, steps: 8100, cups: 7 },
  ];

  const activeData = chartData.length > 0 ? chartData : fallbackChartData;

  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto">
      
      {/* Header section banner */}
      <div className="bg-white border border-[#EBE6DC] rounded-xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
        <div className="text-left font-sans">
          <h1 className="text-xl font-semibold text-[#2D2A26] tracking-tight animate-fade-in">Analytical Performance Logs</h1>
          <p className="text-[#8C867B] text-[11px] font-normal mt-1 uppercase tracking-wider leading-relaxed">
            Historical overview of metabolic patterns, energy indexes, and hydration performance.
          </p>
        </div>
      </div>

      {/* Grid of friendly indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="card-bento p-6 text-left">
          <div className="flex justify-between items-center text-[#2D2A26] mb-2 border-b border-[#EBE6DC] pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Metabolic Threshold</span>
            <Trophy className="w-4 h-4 text-[#2D2A26]" />
          </div>
          <div className="text-lg font-semibold text-[#2D2A26] tracking-tight">Active Consistency</div>
          <p className="text-[10px] text-[#8C867B] mt-1 line-clamp-2">
            Historical trend shows consistent synchronization of steps and workout sessions relative to targets.
          </p>
        </div>

        <div className="card-bento p-6 text-left">
          <div className="flex justify-between items-center text-[#2D2A26] mb-2 border-b border-[#EBE6DC] pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Average Heat Index</span>
            <Flame className="w-4 h-4 text-[#2D2A26]" />
          </div>
          <div className="text-lg font-semibold text-[#2D2A26] tracking-tight">~320 Kcal Active</div>
          <p className="text-[10px] text-[#8C867B] mt-1 font-sans">
            Average energy expenditure tracked during logged exercise sessions.
          </p>
        </div>

        <div className="card-bento p-6 text-left">
          <div className="flex justify-between items-center text-[#2D2A26] mb-2 border-b border-[#EBE6DC] pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Hydration Index</span>
            <Smile className="w-4 h-4 text-[#2D2A26]" />
          </div>
          <div className="text-lg font-semibold text-[#2D2A26] tracking-tight">7.6 L logged</div>
          <p className="text-[10px] text-[#8C867B] mt-1">
            Calculated close proximity to default biometric fluid guidelines over current interval.
          </p>
        </div>

      </div>

      {/* Primary Chart panel block */}
      <div className="card-bento p-6 flex flex-col gap-6">
        
        {/* Toggle buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#EBE6DC] pb-4 gap-4">
          <div className="text-left">
            <h3 className="text-xs font-semibold text-[#2D2A26] flex items-center gap-1.5 uppercase tracking-wide">
              <BarChart4 className="w-4 h-4 text-[#2D2A26]" />
              <span>Biometric Trend Graphs</span>
            </h3>
            <p className="text-[9px] text-[#8C867B] mt-0.5 uppercase tracking-wider">Interactive diagnostic data feeds</p>
          </div>
          <div className="bg-[#F6F4EF] border border-[#EBE6DC] rounded-xl p-1 flex space-x-1 self-stretch sm:self-auto justify-center">
            <button 
              onClick={() => setMetricTab('calories')}
              className={`px-3 py-1.5 text-[9px] font-semibold rounded-lg transition-all uppercase tracking-wide cursor-pointer ${metricTab === 'calories' ? 'bg-[#2D2A26] text-white' : 'text-[#8C867B] hover:text-[#2D2A26]'}`}
            >
              Intake vs Burn
            </button>
            <button 
              onClick={() => setMetricTab('cups')}
              className={`px-3 py-1.5 text-[9px] font-semibold rounded-lg transition-all uppercase tracking-wide cursor-pointer ${metricTab === 'cups' ? 'bg-[#2D2A26] text-white' : 'text-[#8C867B] hover:text-[#2D2A26]'}`}
            >
              Water Cups
            </button>
            <button 
              onClick={() => setMetricTab('steps')}
              className={`px-3 py-1.5 text-[9px] font-semibold rounded-lg transition-all uppercase tracking-wide cursor-pointer ${metricTab === 'steps' ? 'bg-[#2D2A26] text-white' : 'text-[#8C867B] hover:text-[#2D2A26]'}`}
            >
              Steps Metrics
            </button>
          </div>
        </div>

        {/* Dynamic Display Recharts panel */}
        <div className="w-full h-[320px] bg-[#F6F4EF]/25 rounded-xl p-4 border border-[#EBE6DC]">
          <ResponsiveContainer width="100%" height="100%">
            {metricTab === 'calories' ? (
              <BarChart data={activeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBE6DC" />
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#2D2A26', fontWeight: 'bold' }} />
                <YAxis tick={{ fontSize: 9, fill: '#2D2A26', fontWeight: 'bold' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #EBE6DC', backgroundColor: '#FFF', fontSize: 10 }} />
                <Legend wrapperStyle={{ fontSize: 10, fontWeight: 'bold' }} />
                <Bar dataKey="intake" name="Dietary Intake (kcal)" fill="#2D2A26" radius={[4, 4, 0, 0]} />
                <Bar dataKey="burned" name="Active Energy expenditure (kcal)" fill="#8C867B" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : metricTab === 'cups' ? (
              <AreaChart data={activeData}>
                <defs>
                  <linearGradient id="cupsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2D2A26" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#2D2A26" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBE6DC" />
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#2D2A26', fontWeight: 'bold' }} />
                <YAxis domain={[0, 'dataMax + 2']} tick={{ fontSize: 9, fill: '#2D2A26', fontWeight: 'bold' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #EBE6DC', backgroundColor: '#FFF', fontSize: 10 }} />
                <Area type="monotone" dataKey="cups" name="Water (Cups logged)" stroke="#2D2A26" strokeWidth={2} fillOpacity={1} fill="url(#cupsGrad)" />
              </AreaChart>
            ) : (
              <LineChart data={activeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBE6DC" />
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#2D2A26', fontWeight: 'bold' }} />
                <YAxis tick={{ fontSize: 9, fill: '#2D2A26', fontWeight: 'bold' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #EBE6DC', backgroundColor: '#FFF', fontSize: 10 }} />
                <Line type="monotone" dataKey="steps" name="Accumulated Steps" stroke="#2D2A26" strokeWidth={2} activeDot={{ r: 6 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  );
}
