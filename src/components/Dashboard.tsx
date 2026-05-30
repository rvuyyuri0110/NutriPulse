/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { useApp } from './AppContext';
import { 
  Sparkles, Flame, Droplet, Footprints, Clock, Trophy, 
  ChevronLeft, ChevronRight, CheckCircle, Apple, AlertCircle, Plus, Smile, HelpCircle
} from 'lucide-react';

export default function Dashboard() {
  const { user, userLogs, aiInsights, isAiInsightLoading, fetchAiInsights, updateLogsForDate } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date());

  // Trigger insights once on dashboard launch
  useEffect(() => {
    if (!aiInsights) {
      fetchAiInsights();
    }
  }, []);

  // Compute log parameters for the selected date
  const targetedLog = userLogs[selectedDate] || {
    date: selectedDate,
    meals: { breakfast: [], lunch: [], snacks: [], dinner: [] },
    waterIntake: 0,
    steps: 0,
    workouts: [],
    completed: false
  };

  // Compute active nutrition summaries
  let totalCaloriesTaken = 0;
  let totalProteinTaken = 0;
  let totalCarbsTaken = 0;
  let totalFatsTaken = 0;

  Object.values(targetedLog.meals || {}).forEach((mealList: any) => {
    mealList.forEach((food: any) => {
      totalCaloriesTaken += Number(food.calories || 0);
      totalProteinTaken += Number(food.protein || 0);
      totalCarbsTaken += Number(food.carbs || 0);
      totalFatsTaken += Number(food.fats || 0);
    });
  });

  let caloriesBurned = 0;
  let workoutMins = 0;
  targetedLog.workouts?.forEach((w: any) => {
    caloriesBurned += Number(w.caloriesBurned || 0);
    workoutMins += Number(w.duration || 0);
  });

  // Calculate dynamic maintenance calories based on profile (adapted for kids friendly averages)
  const p = user?.profile || { name: 'Friend', weight: 45, height: 145, age: 11, gender: 'unspecified' };
  const targetCalories = 2000; // Kid-friendly daily active energy norm

  // Hydration & Steps quick logging triggers
  const addWater = (amount: number = 250) => {
    updateLogsForDate(selectedDate, {
      waterIntake: (targetedLog.waterIntake || 0) + amount
    });
  };

  const addSteps = () => {
    updateLogsForDate(selectedDate, {
      steps: targetedLog.steps + 1000
    });
  };

  // Calendar matrix generator
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const generateDaysOfCalendar = () => {
    const year = currentCalendarMonth.getFullYear();
    const month = currentCalendarMonth.getMonth();
    const totalDays = getDaysInMonth(year, month);
    const firstDayIndex = new Date(year, month, 1).getDay();

    const days = [];
    // Pad previous month spacing
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    // Real days
    for (let d = 1; d <= totalDays; d++) {
      const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ day: d, dateStr: formattedDate });
    }
    return days;
  };

  const calendarDays = generateDaysOfCalendar();

  const handlePrevMonth = () => {
    setCurrentCalendarMonth(new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentCalendarMonth(new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() + 1, 1));
  };

  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto font-sans">
      
      {/* Top Welcome Card with Quick Stats Overview banner with maximum breathing space */}
      <div className="bg-white border border-[#EBE6DC] rounded-xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
        <div>
          <h1 className="text-xl font-semibold text-[#2D2A26] tracking-tight">
            Overview for {p.name}
          </h1>
          <p className="text-[#8C867B] text-[11px] font-normal uppercase mt-1.5 tracking-wider">
            Physiological tracking, metabolic metric records and behavioral parameters.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchAiInsights} 
            disabled={isAiInsightLoading}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#2D2A26] hover:bg-[#1E1C1A] disabled:opacity-50 text-white rounded-lg text-[10px] font-medium tracking-wide uppercase transition-all shadow-sm cursor-pointer"
          >
            <Sparkles className={`w-3.5 h-3.5 text-white ${isAiInsightLoading ? 'animate-spin' : ''}`} />
            <span>{isAiInsightLoading ? 'Requesting Advice...' : 'Execute AI Analysis'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Clean & Decongested Space */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Playful Daily Goals Cards Section - Refined for Sleek Look */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Calories / Food Points widget */}
            <div className="card-bento flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="label-bento text-[10px]">Nutritional Intake</div>
                  <Apple className="w-4 h-4 text-[#2D2A26]" />
                </div>
                <div className="text-2xl font-light text-[#2D2A26]">
                  {totalCaloriesTaken} <span className="text-xs font-normal text-[#8C867B]">kcal</span>
                </div>
                <p className="text-[10px] text-[#8C867B] font-medium mt-1 uppercase tracking-wide">
                  Target threshold: {targetCalories} kcal
                </p>
              </div>
              <div className="mt-4">
                <div className="w-full h-1 bg-[#F6F4EF] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#2D2A26] transition-all duration-300" 
                    style={{ width: `${Math.min(100, (totalCaloriesTaken / targetCalories) * 100)}%` }} 
                  />
                </div>
              </div>
            </div>

            {/* Play Power / Burn energy widget */}
            <div className="card-bento flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="label-bento text-[10px]">Active Expenditure</div>
                  <Flame className="w-4 h-4 text-[#2D2A26]" />
                </div>
                <div className="text-2xl font-light text-[#2D2A26]">
                  {caloriesBurned} <span className="text-xs font-normal text-[#8C867B]">kcal</span>
                </div>
                <p className="text-[10px] text-[#8C867B] font-medium mt-1 uppercase tracking-wide">
                  Energy consumed during athletic movement
                </p>
              </div>
              <div className="mt-4">
                <div className="w-full h-1 bg-[#F6F4EF] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#2D2A26] transition-all duration-300"
                    style={{ width: `${Math.min(100, (caloriesBurned / 400) * 100)}%` }} 
                  />
                </div>
              </div>
            </div>

            {/* Steps Track widget */}
            <div className="card-bento flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="label-bento text-[10px]">Movement Tally</div>
                  <Footprints className="w-4 h-4 text-[#2D2A26]" />
                </div>
                <div className="text-2xl font-light text-[#2D2A26]">
                  {targetedLog.steps.toLocaleString()} <span className="text-xs font-normal text-[#8C867B]">steps</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[10px] text-[#8C867B] font-medium uppercase tracking-wide">Goal: 10,000</span>
                  <button 
                    onClick={addSteps}
                    className="text-[9px] font-semibold text-[#2D2A26] hover:bg-[#F6F4EF] hover:underline flex items-center gap-1 cursor-pointer bg-[#F6F4EF] border border-[#EBE6DC] px-2 py-1 rounded transition-all"
                  >
                    <Plus className="w-3 h-3" /> <span>+1,000 Steps</span>
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full h-1 bg-[#F6F4EF] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#2D2A26] transition-all duration-300"
                    style={{ width: `${Math.min(100, (targetedLog.steps / 10000) * 100)}%` }} 
                  />
                </div>
              </div>
            </div>

            {/* Active Minutes Track */}
            <div className="card-bento flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="label-bento text-[10px]">Duration Active</div>
                  <Clock className="w-4 h-4 text-[#2D2A26]" />
                </div>
                <div className="text-2xl font-light text-[#2D2A26]">
                  {workoutMins} <span className="text-xs font-normal text-[#8C867B]">minutes</span>
                </div>
                <p className="text-[10px] text-[#8C867B] font-medium mt-1 uppercase tracking-wide">
                  Stamina threshold limits. Target: 60 min.
                </p>
              </div>
              <div className="mt-4">
                <div className="w-full h-1 bg-[#F6F4EF] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#2D2A26] transition-all duration-300"
                    style={{ width: `${Math.min(100, (workoutMins / 60) * 100)}%` }} 
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Water cups logging - beautifully redesigned to use simple cups */}
          <div className="card-bento p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-[#F6F4EF] p-2.5 rounded-lg border border-[#EBE6DC]">
                <Droplet className="w-6 h-6 text-[#2D2A26]" />
              </div>
              <div className="text-left">
                <h3 className="text-xs font-semibold text-[#2D2A26]">Hydration Tracker</h3>
                <p className="text-[11px] text-[#8C867B] font-normal mt-0.5">
                  Logged <span className="font-semibold text-[#2D2A26]">{targetedLog.waterIntake || 0} ml</span> of fluid today
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => addWater(100)}
                  className="bg-[#F6F4EF] hover:bg-[#EBE6DC] text-[#2D2A26] border border-[#EBE6DC] font-medium px-3 py-1.5 rounded-lg text-[9px] uppercase tracking-wider transition-all cursor-pointer"
                >
                  +100ml
                </button>
                <button 
                  onClick={() => addWater(250)}
                  className="bg-[#F6F4EF] hover:bg-[#EBE6DC] text-[#2D2A26] border border-[#EBE6DC] font-medium px-3 py-1.5 rounded-lg text-[9px] uppercase tracking-wider transition-all cursor-pointer"
                >
                  +250ml
                </button>
                <button 
                  onClick={() => addWater(500)}
                  className="bg-[#F6F4EF] hover:bg-[#EBE6DC] text-[#2D2A26] border border-[#EBE6DC] font-medium px-3 py-1.5 rounded-lg text-[9px] uppercase tracking-wider transition-all cursor-pointer"
                >
                  +500ml
                </button>
              </div>
              
              <div className="flex items-center gap-1.5">
                <input 
                  type="number"
                  placeholder="Custom..."
                  defaultValue="250"
                  id="custom-water-input"
                  className="bg-white border border-[#EBE6DC] rounded-lg px-2.5 py-1.5 text-[10px] w-18 text-[#2D2A26] outline-none text-center font-mono"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const val = Number((e.currentTarget as HTMLInputElement).value);
                      if (val > 0) addWater(val);
                    }
                  }}
                />
                <button 
                  onClick={() => {
                    const input = document.getElementById('custom-water-input') as HTMLInputElement;
                    const val = Number(input?.value || 250);
                    if (val > 0) addWater(val);
                  }}
                  className="bg-[#2D2A26] hover:bg-[#1E1C1A] text-white font-medium px-3 py-1.5 rounded-lg text-[9px] uppercase tracking-wide transition-all cursor-pointer"
                >
                  Log
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Simplifed Habits Calendar Center */}
        <div className="card-bento flex flex-col justify-between gap-5 col-span-1">
          <div className="flex justify-between items-center pb-2 border-b border-[#EBE6DC]">
            <div>
              <h2 className="text-xs font-semibold text-[#2D2A26]">Temporal Matrix</h2>
              <p className="text-[9px] text-[#8C867B] font-normal uppercase tracking-wider mt-0.5">Click date to sync records</p>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={handlePrevMonth} className="p-1 hover:bg-[#F6F4EF] rounded text-[#2D2A26]"><ChevronLeft className="w-4 h-4" /></button>
              <span className="text-[10px] font-semibold text-[#2D2A26] tracking-wide min-w-[70px] text-center uppercase">
                {currentCalendarMonth.toLocaleString('default', { month: 'short', year: 'numeric' })}
              </span>
              <button onClick={handleNextMonth} className="p-1 hover:bg-[#F6F4EF] rounded text-[#2D2A26]"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Grid view of Calendar days */}
          <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-medium text-[#8C867B] uppercase">
            <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
          </div>
          
          <div className="grid grid-cols-7 gap-1 my-1">
            {calendarDays.map((dayObj, idx) => {
              if (dayObj === null) {
                return <div key={`empty-${idx}`} />;
              }
              
              const isSelected = selectedDate === dayObj.dateStr;
              const savedDayLog = userLogs[dayObj.dateStr];
              
              let bgIndicator = 'bg-[#FFFFFF] hover:bg-[#F6F4EF] text-[#2D2A26] border border-[#EBE6DC]/40';
              
              if (savedDayLog) {
                let dayCals = 0;
                Object.values(savedDayLog.meals || {}).forEach((mealList: any) => {
                  mealList.forEach((item: any) => dayCals += Number(item.calories || 0));
                });
                
                if (dayCals > 0) {
                  // Muted micro indicator for activity log
                  bgIndicator = 'bg-[#F6F4EF] text-[#2D2A26] font-semibold border border-[#EBE6DC]';
                }
              }

              return (
                <button
                  key={dayObj.dateStr}
                  onClick={() => setSelectedDate(dayObj.dateStr)}
                  className={`aspect-square text-[11px] font-normal rounded-md flex flex-col items-center justify-center transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-[#2D2A26] text-white font-bold border border-[#2D2A26]' 
                      : bgIndicator
                  }`}
                >
                  <span>{dayObj.day}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#EBE6DC]">
            <div className="bg-[#F6F4EF] text-[#2D2A26] p-2 rounded-lg border border-[#EBE6DC] text-center font-semibold uppercase tracking-wider text-[8px]">
              Active Log Date: {selectedDate}
            </div>
          </div>

        </div>

      </div>

      {/* AI Coach Advisor Panel - High-end structure */}
      <div className="card-bento flex flex-col gap-6">
        <h3 className="text-[#2D2A26] font-semibold text-xs uppercase tracking-widest flex items-center gap-2 pb-4 border-b border-[#EBE6DC]">
          <Smile className="w-4 h-4 text-[#2D2A26]" />
          <span>Algorithmic Health advisory summary</span>
        </h3>

        {isAiInsightLoading ? (
          <div className="py-10 flex flex-col items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-[#2D2A26] border-t-transparent rounded-full animate-spin" />
            <span className="text-[10px] text-[#2D2A26] font-medium uppercase tracking-widest">
              Synthesizing generative physiological analysis...
            </span>
          </div>
        ) : aiInsights ? (
          <div className="flex flex-col gap-6">
            
            {/* Key summary text */}
            <div className="relative pl-4 border-l-2 border-[#2D2A26] bg-[#F6F4EF] p-4.5 rounded-lg">
              <span className="text-[#2D2A26] text-xs font-normal leading-relaxed block italic">
                "{aiInsights.summaryText}"
              </span>
            </div>

            {/* Structured feedback cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="bg-white border border-[#EBE6DC] p-5 rounded-lg flex flex-col gap-1">
                <span className="text-[9px] font-semibold text-[#8C867B] uppercase tracking-wider flex items-center gap-1.5">
                  <Apple className="w-3.5 h-3.5 text-[#2D2A26]" />
                  <span>Calorie Expenditure Review</span>
                </span>
                <span className="text-[11px] text-[#2D2A26] leading-relaxed font-normal">{aiInsights.calorieBalanceFeedback || "Physiological profiles suggest standard carbohydrate and hydration counts are ideal."}</span>
              </div>

              <div className="bg-white border border-[#EBE6DC] p-5 rounded-lg flex flex-col gap-1">
                <span className="text-[9px] font-semibold text-[#8C867B] uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#2D2A26]" />
                  <span>Stamina Recovery Protocol</span>
                </span>
                <span className="text-[11px] text-[#2D2A26] leading-relaxed font-normal">{aiInsights.recoverySuggestions || "Regular interval tracking of sleep variables supports high productivity parameters."}</span>
              </div>

            </div>

            {/* Recommendations segment */}
            <div className="bg-[#F6F4EF] border border-[#EBE6DC] p-5 rounded-lg">
              <div className="text-[9px] font-semibold text-[#2D2A26] flex items-center gap-1.5 mb-3 uppercase tracking-wider">
                <Trophy className="w-3.5 h-3.5 text-[#2D2A26]" />
                <span>Behavioral exercise directives</span>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] text-[#2D2A26] leading-relaxed">
                {(aiInsights.workoutRecommendations || []).length > 0 ? (
                  aiInsights.workoutRecommendations.map((rec, i) => (
                    <li key={i} className="flex gap-2 items-start bg-white p-3 rounded-lg border border-[#EBE6DC] shadow-sm">
                      <span className="font-semibold text-[#2D2A26] text-[10px]">{i+1}.</span>
                      <span>{rec}</span>
                    </li>
                  ))
                ) : (
                  <>
                    <li className="flex gap-1.5 items-start bg-white p-3 rounded-lg border border-[#EBE6DC] shadow-sm">
                      <span className="font-semibold text-[#2D2A26] text-[10px]">1.</span>
                      <span>Log swimming, running or playground athletic duration counts.</span>
                    </li>
                    <li className="flex gap-1.5 items-start bg-white p-3 rounded-lg border border-[#EBE6DC] shadow-sm">
                      <span className="font-semibold text-[#2D2A26] text-[10px]">2.</span>
                      <span>Adjust pure calorie variables to match active performance goals.</span>
                    </li>
                    <li className="flex gap-1.5 items-start bg-white p-3 rounded-lg border border-[#EBE6DC] shadow-sm">
                      <span className="font-semibold text-[#2D2A26] text-[10px]">3.</span>
                      <span>Maintain consistency in biological hydration thresholds.</span>
                    </li>
                  </>
                )}
              </ul>
            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg border border-dashed border-[#EBE6DC] text-center">
            <HelpCircle className="w-8 h-8 text-[#2D2A26]/30 mb-2" />
            <span className="text-[10px] text-[#8C867B] font-semibold uppercase tracking-wider">No advisors compiled yet</span>
            <p className="text-[10px] text-[#8C867B] mt-1 max-w-xs font-normal">Initiate real-time system recommendation engine via button above.</p>
            <button 
              onClick={fetchAiInsights} 
              className="mt-3 text-[10px] bg-[#2D2A26] hover:bg-[#1E1C1A] text-white flex items-center gap-1.5 font-medium px-4 py-2 rounded-lg transition-all cursor-pointer"
            >
              <span>Ask AI Coach</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
