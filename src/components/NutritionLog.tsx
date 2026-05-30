/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { useApp } from './AppContext';
import { FOOD_SUGGESTIONS, SuggestedFood } from '../data/foodSuggestions';
import { 
  Sparkles, Plus, Trash2, Dumbbell, Droplet, Footprints, 
  Search, ShieldCheck, Calculator, ArrowRight, CheckCircle2, Apple, Smile, Trophy
} from 'lucide-react';

interface NutritionLogProps {
  onCompleteAnalysisRedirect: () => void;
}

export default function NutritionLog({ onCompleteAnalysisRedirect }: NutritionLogProps) {
  const { userLogs, updateLogsForDate, deleteFoodItem, deleteWorkoutItem, estimateFoodWithAi, estimateWorkoutWithAi } = useApp();
  
  // Track selected active log date
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Selected daily records
  const dayLog = userLogs[logDate] || {
    date: logDate,
    meals: { breakfast: [], lunch: [], snacks: [], dinner: [] },
    waterIntake: 0,
    steps: 0,
    workouts: [],
    completed: false
  };

  // State managers for active input boxes
  const [foodQuery, setFoodQuery] = useState('');
  const [activeMealSection, setActiveMealSection] = useState<'breakfast' | 'lunch' | 'snacks' | 'dinner'>('breakfast');
  
  // Live manual form values
  const [manualFoodName, setManualFoodName] = useState('');
  const [customUnit, setCustomUnit] = useState<'countable' | 'portion'>('countable');
  const [customQtyText, setCustomQtyText] = useState('1');
  const [isCustomLogging, setIsCustomLogging] = useState(false);
  
  // AI food description input
  const [aiFoodInput, setAiFoodInput] = useState('');
  const [isAiEstimating, setIsAiEstimating] = useState(false);
  const [aiEstimateResult, setAiEstimateResult] = useState<any | null>(null);

  // Manual exercise logging
  const [workoutName, setWorkoutName] = useState('');
  const [workoutDuration, setWorkoutDuration] = useState('');
  const [isWorkoutLogging, setIsWorkoutLogging] = useState(false);

  // Quick inputs
  const [quickWater, setQuickWater] = useState('250');
  const [quickSteps, setQuickSteps] = useState('2000');

  const [searchPortionSize, setSearchPortionSize] = useState<number>(1);

  // Filter static food list suggestions
  const filteredSuggestions = foodQuery
    ? FOOD_SUGGESTIONS.filter(f => f.name.toLowerCase().includes(foodQuery.toLowerCase())).slice(0, 5)
    : [];

  // Submit handlers
  const selectSuggestedFood = (food: SuggestedFood) => {
    const scale = searchPortionSize;
    const freshFoodEntry = {
      id: `food-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: food.name,
      quantity: scale === 1 ? food.quantity : `${scale}x (${food.quantity})`,
      calories: Math.round(Number(food.calories) * scale),
      protein: Math.round(Number(food.protein || 0) * scale * 10) / 10,
      carbs: Math.round(Number(food.carbs || 0) * scale * 10) / 10,
      fats: Math.round(Number(food.fats || 0) * scale * 10) / 10
    };

    const currentMealList = dayLog.meals[activeMealSection] || [];
    const updatedMeals = {
      ...dayLog.meals,
      [activeMealSection]: [...currentMealList, freshFoodEntry]
    };

    updateLogsForDate(logDate, { meals: updatedMeals });
    setFoodQuery('');
  };

  const handleManualFoodSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!manualFoodName.trim()) return;

    setIsCustomLogging(true);
    try {
      const formattedQty = customUnit === 'countable' 
        ? `${customQtyText} item(s)` 
        : `${customQtyText} portion`;
      
      const aiQuery = customUnit === 'countable'
        ? `${customQtyText} ${manualFoodName}`
        : `${customQtyText} portion of ${manualFoodName}`;

      const result = await estimateFoodWithAi(aiQuery);
      
      const freshFoodEntry = {
        id: `food-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: result?.foodName || manualFoodName,
        quantity: result?.quantity || formattedQty,
        calories: result?.calories || 120,
        protein: result?.protein || 4,
        carbs: result?.carbs || 18,
        fats: result?.fats || 3
      };

      const currentMealList = dayLog.meals[activeMealSection] || [];
      const updatedMeals = {
        ...dayLog.meals,
        [activeMealSection]: [...currentMealList, freshFoodEntry]
      };

      updateLogsForDate(logDate, { meals: updatedMeals });
      
      // Clear inputs
      setManualFoodName('');
      setCustomQtyText('1');
    } catch (err) {
      console.error('Error auto-approximating custom food log:', err);
    } finally {
      setIsCustomLogging(false);
    }
  };

  // Submit AI-estimated foods
  const handleAiEstimate = async () => {
    if (!aiFoodInput.trim()) return;
    setIsAiEstimating(true);
    setAiEstimateResult(null);
    try {
      const result = await estimateFoodWithAi(aiFoodInput);
      if (result) {
        setAiEstimateResult(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiEstimating(false);
    }
  };

  const addAiEstimatedFood = () => {
    if (!aiEstimateResult) return;
    const freshFoodEntry = {
      id: `food-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: aiEstimateResult.foodName,
      quantity: aiEstimateResult.quantity,
      calories: aiEstimateResult.calories,
      protein: aiEstimateResult.protein,
      carbs: aiEstimateResult.carbs,
      fats: aiEstimateResult.fats
    };

    const currentMealList = dayLog.meals[activeMealSection] || [];
    const updatedMeals = {
      ...dayLog.meals,
      [activeMealSection]: [...currentMealList, freshFoodEntry]
    };

    updateLogsForDate(logDate, { meals: updatedMeals });
    setAiEstimateResult(null);
    setAiFoodInput('');
  };

  const handleWorkoutSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!workoutName || !workoutDuration) return;

    setIsWorkoutLogging(true);
    try {
      const minutes = Number(workoutDuration) || 30;
      const aiEst = await estimateWorkoutWithAi(workoutName, minutes);

      const freshWorkout = {
        id: `workout-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: aiEst?.activityName || workoutName,
        duration: minutes,
        caloriesBurned: aiEst?.caloriesBurned || Math.round(minutes * 7.5),
        notes: "AI Estimated"
      };

      const updatedWorkouts = [...(dayLog.workouts || []), freshWorkout];
      updateLogsForDate(logDate, { workouts: updatedWorkouts });

      // Clear workout form strings
      setWorkoutName('');
      setWorkoutDuration('');
    } catch (err) {
      console.error('Error estimating workout burn rate:', err);
    } finally {
      setIsWorkoutLogging(false);
    }
  };

  // Sync hydration & steps
  const syncWater = (e: FormEvent) => {
    e.preventDefault();
    const qty = Number(quickWater);
    if (isNaN(qty)) return;
    updateLogsForDate(logDate, { waterIntake: (dayLog.waterIntake || 0) + qty });
  };

  const syncSteps = (e: FormEvent) => {
    e.preventDefault();
    const count = Number(quickSteps);
    if (isNaN(count)) return;
    updateLogsForDate(logDate, { steps: (dayLog.steps || 0) + count });
  };

  // Compute total indices
  let dayCals = 0;
  Object.values(dayLog.meals || {}).forEach((mealList: any) => {
    mealList.forEach((item: any) => {
      dayCals += Number(item.calories || 0);
    });
  });

  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto font-sans">
      
      {/* Date settings Header row */}
      <div className="bg-white border border-[#EBE6DC] rounded-xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
        <div>
          <h1 className="text-xl font-semibold text-[#2D2A26] tracking-tight">Activity Log</h1>
          <p className="text-[#8C867B] text-[11px] font-normal mt-1 uppercase tracking-wider leading-relaxed">
            Preserve dietary records, hydration quantities, and active performance durations.
          </p>
        </div>
        <div className="flex items-center gap-2.5 bg-[#F6F4EF] px-3.5 py-2.5 border border-[#EBE6DC] rounded-lg">
          <label className="text-[10px] font-semibold text-[#2D2A26] uppercase tracking-wider">LOG DATE:</label>
          <input 
            type="date"
            value={logDate}
            onChange={(e) => setLogDate(e.target.value)}
            className="bg-white border border-[#EBE6DC] rounded px-2 py-1.5 text-[11px] font-medium text-[#2D2A26] font-sans focus:outline-none focus:border-[#2D2A26]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 columns: Active Logs Sections */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Section choice controls */}
          <div className="bg-white border border-[#EBE6DC] rounded-xl p-1.5 flex overflow-x-auto gap-1.5 no-scrollbar">
            {(['breakfast', 'lunch', 'snacks', 'dinner'] as const).map((meal) => (
              <button
                key={meal}
                id={`meal-btn-${meal}`}
                onClick={() => setActiveMealSection(meal)}
                className={`px-4.5 py-2 text-[11px] font-medium rounded-lg transition-all uppercase tracking-wide shrink-0 cursor-pointer ${
                  activeMealSection === meal 
                    ? 'bg-[#2D2A26] text-white' 
                    : 'text-[#8C867B] hover:bg-[#F6F4EF] hover:text-[#2D2A26]'
                }`}
              >
                {meal === 'breakfast' && 'Breakfast'}
                {meal === 'lunch' && 'Lunch'}
                {meal === 'snacks' && 'Snacks'}
                {meal === 'dinner' && 'Dinner'}
              </button>
            ))}
          </div>

          {/* Combined Smart Food Addition Panel */}
          <div className="card-bento flex flex-col gap-6">
            <div>
              <h2 className="text-sm font-semibold text-[#2D2A26] uppercase tracking-wider">Log Foods to {activeMealSection}</h2>
              <p className="text-[11px] text-[#8C867B] font-normal mt-0.5">Utilize the standard dictionary, AI automatic parser, or manual forms.</p>
            </div>

            {/* A. SEARCHABLE METHOD */}
            <div className="flex flex-col gap-2 relative">
              <label className="text-[10px] font-semibold text-[#8C867B] uppercase tracking-wider">A. Standard Food Dictionary Search</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#8C867B]" />
                  <input 
                    type="text"
                    placeholder="Type food items here (scrambled eggs, oatmeal, etc.)..."
                    value={foodQuery}
                    onChange={(e) => setFoodQuery(e.target.value)}
                    className="w-full bg-[#FFFFFF] border border-[#EBE6DC] rounded-lg pl-9 pr-4 py-2 text-[11px] text-[#2D2A26] outline-none focus:border-[#2D2A26] focus:bg-white transition-all shadow-inner"
                  />
                </div>
                
                {/* Portions Dropdown */}
                <div className="flex items-center gap-1.5 shrink-0 bg-[#FFFFFF] border border-[#EBE6DC] rounded-lg px-2.5 py-1.5">
                  <span className="text-[9px] font-bold text-[#8C867B] uppercase tracking-wider">Portion:</span>
                  <select
                    value={searchPortionSize}
                    onChange={(e) => setSearchPortionSize(Number(e.target.value))}
                    className="bg-transparent text-[11px] font-semibold text-[#2D2A26] outline-none cursor-pointer"
                  >
                    <option value="0.25">0.25x (Quarter)</option>
                    <option value="0.5">0.5x (Half)</option>
                    <option value="0.75">0.75x (Three-Quarters)</option>
                    <option value="1">1.0x (Standard)</option>
                    <option value="1.5">1.5x (1.5 Portions)</option>
                    <option value="2">2.0x (Double Portion)</option>
                    <option value="3">3.0x (Triple Portion)</option>
                  </select>
                </div>
              </div>
 
              {/* Suggestions Popup Dropdown */}
              {foodQuery && (
                <div className="absolute top-[75px] sm:top-[65px] left-0 right-0 bg-white border border-[#EBE6DC] rounded-lg shadow-md z-20 overflow-hidden divide-y divide-[#EBE6DC]">
                  {filteredSuggestions.length > 0 ? (
                    filteredSuggestions.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => selectSuggestedFood(item)}
                        className="w-full text-left px-4 py-3 hover:bg-[#F6F4EF] text-[11px] transition-colors flex justify-between items-center cursor-pointer font-sans text-[#2D2A26]"
                      >
                        <span>{item.name} <span className="text-[9px] text-[#8C867B]">({item.quantity})</span></span>
                        <span className="font-semibold text-[10px] bg-[#F6F4EF] border border-[#EBE6DC] px-2 py-0.5 rounded">{item.calories} kcal</span>
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-center text-[11px] text-[#8C867B]">
                      No perfect matches. Utilize manual options below.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* B. DYNAMIC GEMINI AI ESTIMATOR CARD */}
            <div className="bg-[#FFFFFF] border border-[#EBE6DC] p-5 rounded-lg flex flex-col gap-2">
              <span className="text-[10px] font-semibold text-[#2D2A26] uppercase flex items-center gap-1 tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#2D2A26]" />
                <span>AI Automated Nutrition Approximation</span>
              </span>
              <p className="text-[11px] text-[#8C867B] font-normal leading-relaxed">
                Describe your meal components: E.g., "three scrambled egg whites, half avocado and whole grain toast." Our modeling calculates standard profiles.
              </p>
              
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="Describe items..."
                  value={aiFoodInput}
                  onChange={(e) => setAiFoodInput(e.target.value)}
                  className="flex-1 bg-[#F6F4EF] border border-[#EBE6DC] rounded-lg px-3 py-2 text-[11px] text-[#2D2A26] outline-none focus:border-[#2D2A26]"
                />
                <button 
                  onClick={handleAiEstimate}
                  disabled={isAiEstimating || !aiFoodInput}
                  className="bg-[#2D2A26] cursor-pointer hover:bg-[#1E1C1A] text-white rounded-lg px-4 py-2 text-[10px] font-medium tracking-wider uppercase disabled:opacity-50 transition-all text-center shrink-0"
                >
                  {isAiEstimating ? 'Estimating...' : 'Analyze'}
                </button>
              </div>

              {aiEstimateResult && (
                <div className="bg-white border border-[#EBE6DC] p-4 rounded-lg flex flex-col gap-2 mt-2">
                  <div className="text-[11px] font-medium text-[#2D2A26] flex justify-between uppercase tracking-wider">
                    <span>Result: {aiEstimateResult.foodName}</span>
                    <span className="text-slate-600 font-semibold">{aiEstimateResult.calories} kcal</span>
                  </div>
                  <button 
                    onClick={addAiEstimatedFood}
                    className="mt-1 text-[10px] w-full bg-[#2D2A26] hover:bg-[#1E1C1A] text-white font-medium py-2 px-3 rounded-lg flex items-center justify-center gap-1 uppercase tracking-wider cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Include in daily {activeMealSection} context</span>
                  </button>
                </div>
              )}
            </div>

            {/* C. MANUAL ADDITION FORM */}
            <form onSubmit={handleManualFoodSubmit} className="border-t border-[#EBE6DC] pt-5 flex flex-col gap-4">
              <label className="text-[10px] font-semibold text-[#8C867B] uppercase tracking-wider block">B. Or, Log Custom Entry</label>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5 md:col-span-1">
                  <span className="text-[9px] font-semibold text-[#8C867B] uppercase tracking-wider">Food Name</span>
                  <input 
                    type="text" 
                    placeholder="E.g. boiled egg, butter chicken"
                    required
                    value={manualFoodName}
                    onChange={(e) => setManualFoodName(e.target.value)}
                    className="w-full bg-[#FFFFFF] border border-[#EBE6DC] rounded-lg px-3 py-2 text-[11px] text-[#2D2A26] outline-none focus:border-[#2D2A26] font-sans"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-semibold text-[#8C867B] uppercase tracking-wider">Quantifier Unit</span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => { setCustomUnit('countable'); setCustomQtyText('1'); }}
                      className={`flex-1 py-2 text-[9px] font-semibold uppercase tracking-wider rounded border cursor-pointer transition-all ${customUnit === 'countable' ? 'bg-[#2D2A26] text-white border-[#2D2A26]' : 'bg-white text-[#8C867B] border-[#EBE6DC]'}`}
                    >
                      Countable (No's)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setCustomUnit('portion'); setCustomQtyText('0.5'); }}
                      className={`flex-1 py-2 text-[9px] font-semibold uppercase tracking-wider rounded border cursor-pointer transition-all ${customUnit === 'portion' ? 'bg-[#2D2A26] text-white border-[#2D2A26]' : 'bg-white text-[#8C867B] border-[#EBE6DC]'}`}
                    >
                      Portions (Fractions)
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-semibold text-[#8C867B] uppercase tracking-wider">Quantity Size</span>
                  <select
                    value={customQtyText}
                    onChange={(e) => setCustomQtyText(e.target.value)}
                    className="w-full bg-white border border-[#EBE6DC] rounded-lg px-3 py-2 text-[11px] text-[#2D2A26] outline-none focus:border-[#2D2A26] font-sans"
                  >
                    {customUnit === 'countable' ? (
                      <>
                        <option value="1">1 piece / egg</option>
                        <option value="2">2 pieces / eggs</option>
                        <option value="3">3 pieces / eggs</option>
                        <option value="4">4 pieces / eggs</option>
                        <option value="5">5 pieces / eggs</option>
                        <option value="6">6 pieces / eggs</option>
                      </>
                    ) : (
                      <>
                        <option value="0.25">1/4 (quarter plate/bowl)</option>
                        <option value="0.5">1/2 (half plate/bowl)</option>
                        <option value="0.75">3/4 (three-quarter plate/bowl)</option>
                        <option value="1">1 (full plate/bowl)</option>
                        <option value="1.5">1.5 (one and a half plates/bowls)</option>
                        <option value="2">2 (double plates/bowls)</option>
                        <option value="3">3 (triple plates/bowls)</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                id="submit-manual-food-btn"
                disabled={isCustomLogging || !manualFoodName.trim()}
                className="w-full bg-[#2D2A26] hover:bg-[#1E1C1A] text-white disabled:opacity-50 font-semibold py-2.5 rounded-lg text-[10px] transition-colors uppercase tracking-widest cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>{isCustomLogging ? 'Estimating portion calories...' : 'Log Dietary Entry (AI Auto-Calculated)'}</span>
              </button>
            </form>

          </div>

          {/* List of logged meal items */}
          <div className="card-bento flex flex-col gap-6">
            <div>
              <h2 className="text-sm font-semibold text-[#2D2A26] uppercase tracking-wider">Logged Diet Entries</h2>
              <p className="text-[11px] text-[#8C867B] font-normal mt-0.5">Overview of active profiles parameters on {logDate}</p>
            </div>

            {['breakfast', 'lunch', 'snacks', 'dinner'].map((mealKey) => {
              const list = dayLog.meals[mealKey] || [];
              return (
                <div key={mealKey} className="border-b border-[#EBE6DC] pb-4 last:border-b-0 last:pb-0">
                  <h3 className="text-[10px] font-semibold text-[#2D2A26] uppercase mb-2 tracking-widest flex items-center justify-between">
                    <span>{mealKey}</span>
                    <span className="text-[9px] text-[#8C867B] font-medium">{list.length} variables</span>
                  </h3>
                  
                  {list.length > 0 ? (
                    <div className="flex flex-col gap-2 mt-2">
                      {list.map((food: any) => (
                        <div key={food.id} className="bg-white border border-[#EBE6DC] p-3 rounded-lg flex justify-between items-center text-[11px] transition-all">
                          <div>
                            <span className="font-semibold text-[#2D2A26]">{food.name}</span>
                            <div className="text-[9px] text-[#8C867B] font-normal mt-0.5">Portions: {food.quantity}</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] bg-[#F6F4EF] border border-[#EBE6DC] px-2 py-1 rounded text-[#2D2A26] font-medium">{food.calories} kcal</span>
                            <button 
                              onClick={() => deleteFoodItem(logDate, mealKey as any, food.id)}
                              className="text-[#8C867B] hover:text-[#2D2A26] transition-colors cursor-pointer p-0.5"
                              title="Delete food entry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[10px] text-[#8C867B] italic block mt-2">No dietary parameters entries in {mealKey}.</span>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Right 1 column: Simple Play logs and hydration counters */}
        <div className="flex flex-col gap-8">
          
          {/* Active stats card - Refined 3-color styled */}
          <div className="bg-[#2D2A26] border border-[#2D2A26] rounded-xl p-6 text-white shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-[9px] font-semibold text-[#EBE6DC] uppercase tracking-widest">Aggregate Daily Intake</h2>
              <div className="text-3xl font-light text-white mt-1.5">
                {dayCals} <span className="text-[10px] font-medium text-[#EBE6DC] block mt-1 font-sans uppercase">total kilocalories</span>
              </div>
            </div>

            <button 
              onClick={onCompleteAnalysisRedirect}
              id="metabolic-redirect-btn"
              className="mt-6 w-full bg-white text-[#2D2A26] hover:bg-[#F6F4EF] font-semibold py-2.5 rounded-lg text-[10px] transition-all flex items-center justify-center gap-1.5 uppercase tracking-widest cursor-pointer border border-[#EBE6DC]"
            >
              <span>Review Advisory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Workout physical output logging */}
          <div className="card-bento flex flex-col gap-5">
            <div>
              <h2 className="text-xs font-semibold text-[#2D2A26] uppercase tracking-wider flex items-center gap-1.5">
                <Dumbbell className="w-4 h-4 text-[#2D2A26]" />
                <span>Athletic movement records</span>
              </h2>
              <p className="text-[10px] text-[#8C867B] font-normal mt-0.5">Track structured workout variables or routine physical games.</p>
            </div>

            <form onSubmit={handleWorkoutSubmit} className="flex flex-col gap-3">
              <input 
                type="text" 
                placeholder="Training action (e.g. running, swimming, weight lifting)"
                required
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                className="bg-white border border-[#EBE6DC] rounded-lg px-3 py-2 text-[11px] text-[#2D2A26] outline-none focus:border-[#2D2A26]"
              />
              <input 
                type="number" 
                placeholder="Duration (minutes)"
                required
                value={workoutDuration}
                onChange={(e) => setWorkoutDuration(e.target.value)}
                className="bg-white border border-[#EBE6DC] rounded-lg px-3 py-2 text-[11px] text-[#2D2A26] outline-none focus:border-[#2D2A26] font-mono"
              />
              <button 
                type="submit"
                id="workout-submit-btn"
                disabled={isWorkoutLogging || !workoutName.trim() || !workoutDuration}
                className="bg-[#2D2A26] text-white disabled:opacity-50 font-semibold py-2.5 rounded-lg text-[10px] hover:bg-[#1E1C1A] transition-all uppercase tracking-widest cursor-pointer shadow-sm"
              >
                {isWorkoutLogging ? 'AI estimating active burn...' : 'Save Workout'}
              </button>
            </form>

            {/* List logged workouts */}
            <div className="border-t border-[#EBE6DC] pt-4 mt-1">
              <h3 className="text-[9px] font-semibold text-[#8C867B] uppercase mb-2 tracking-widest">Workout History:</h3>
              
              {dayLog.workouts && dayLog.workouts.length > 0 ? (
                <div className="flex flex-col gap-2 mt-2">
                  {dayLog.workouts.map((work: any) => (
                    <div key={work.id} className="bg-[#FFFFFF] border border-[#EBE6DC] p-3 rounded-lg flex justify-between items-center text-[11px]">
                      <div>
                        <span className="font-semibold text-[#2D2A26]">{work.name}</span>
                        <div className="text-[9px] text-[#8C867B] font-normal mt-0.5">{work.duration} min. performance</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] bg-[#F6F4EF] border border-[#EBE6DC] text-[#2D2A26] px-2 py-0.5 rounded font-medium">{work.caloriesBurned} kcal</span>
                        <button 
                          onClick={() => deleteWorkoutItem(logDate, work.id)}
                          className="text-[#8C867B] hover:text-[#2D2A26] transition-colors cursor-pointer"
                          title="Delete playtime record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-[10px] text-[#8C867B] italic block mt-2">No exercises tracked today.</span>
              )}
            </div>

          </div>

          {/* Quick logs for water and steps */}
          <div className="card-bento flex flex-col gap-4">
            <div>
              <h2 className="text-xs font-semibold text-[#2D2A26] uppercase tracking-wider flex items-center gap-1.5">
                <Droplet className="w-4 h-4 text-[#2D2A26]" />
                <span>Hydration & Steps shortcut</span>
              </h2>
              <p className="text-[10px] text-[#8C867B] font-normal mt-0.5">Quick logging for water and step counts.</p>
            </div>

            {/* Total display matching Item 10 */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-[#F6F4EF] rounded-lg border border-[#EBE6DC] text-center">
              <div>
                <span className="text-[9px] font-semibold text-[#8C867B] uppercase block">Water Today</span>
                <span className="text-base font-light text-[#2D2A26]">{dayLog.waterIntake || 0} <span className="text-[9px] font-normal text-[#8C867B]">ml</span></span>
              </div>
              <div>
                <span className="text-[9px] font-semibold text-[#8C867B] uppercase block">Steps Today</span>
                <span className="text-base font-light text-[#2D2A26]">{(dayLog.steps || 0).toLocaleString()} <span className="text-[9px] font-normal text-[#8C867B]">steps</span></span>
              </div>
            </div>

            {/* Quick water additions matching Item 4 */}
            <div className="flex flex-col gap-2 border-t border-[#EBE6DC]/60 pt-3">
              <span className="text-[9px] font-semibold text-[#8C867B] uppercase tracking-wider">Quick Water Options:</span>
              <div className="grid grid-cols-3 gap-1.5">
                <button 
                  onClick={() => updateLogsForDate(logDate, { waterIntake: (dayLog.waterIntake || 0) + 100 })}
                  className="bg-white hover:bg-[#F6F4EF] text-[#2D2A26] border border-[#EBE6DC] py-1.5 rounded-lg text-[9px] font-medium uppercase cursor-pointer transition-all leading-none"
                >
                  +100ml
                </button>
                <button 
                  onClick={() => updateLogsForDate(logDate, { waterIntake: (dayLog.waterIntake || 0) + 250 })}
                  className="bg-white hover:bg-[#F6F4EF] text-[#2D2A26] border border-[#EBE6DC] py-1.5 rounded-lg text-[9px] font-medium uppercase cursor-pointer transition-all leading-none"
                >
                  +250ml
                </button>
                <button 
                  onClick={() => updateLogsForDate(logDate, { waterIntake: (dayLog.waterIntake || 0) + 500 })}
                  className="bg-white hover:bg-[#F6F4EF] text-[#2D2A26] border border-[#EBE6DC] py-1.5 rounded-lg text-[9px] font-medium uppercase cursor-pointer transition-all leading-none"
                >
                  +500ml
                </button>
              </div>
            </div>

            <form onSubmit={syncWater} className="flex gap-2 border-t border-[#EBE6DC]/60 pt-3">
              <input 
                type="number"
                placeholder="Water (ml)"
                value={quickWater}
                onChange={(e) => setQuickWater(e.target.value)}
                className="w-1/2 bg-white border border-[#EBE6DC] rounded-lg px-3 py-2 text-[11px] font-mono outline-none focus:border-[#2D2A26]"
              />
              <button 
                type="submit"
                id="add-water-btn"
                className="flex-1 bg-[#F6F4EF] hover:bg-[#EBE6DC] text-[#2D2A26] rounded-lg text-[10px] font-medium py-2 transition-all cursor-pointer border border-[#EBE6DC]"
              >
                + Water Log
              </button>
            </form>

            <form onSubmit={syncSteps} className="flex gap-2">
              <input 
                type="number"
                placeholder="Steps count"
                value={quickSteps}
                onChange={(e) => setQuickSteps(e.target.value)}
                className="w-1/2 bg-white border border-[#EBE6DC] rounded-lg px-3 py-2 text-[11px] font-mono outline-none focus:border-[#2D2A26]"
              />
              <button 
                type="submit"
                id="add-steps-btn"
                className="flex-1 bg-[#F6F4EF] hover:bg-[#EBE6DC] text-[#2D2A26] rounded-lg text-[10px] font-medium py-2 transition-all cursor-pointer border border-[#EBE6DC]"
              >
                + Steps Log
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
