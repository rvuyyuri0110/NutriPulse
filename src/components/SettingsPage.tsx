/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useApp } from './AppContext';
import { Shield, HardDrive, Bell, Trash2, Moon, Sun, Monitor, Check } from 'lucide-react';

export default function SettingsPage() {
  const { logout, userLogs } = useApp();
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('light');
  const [optInAlerts, setOptInAlerts] = useState(true);
  const [macroAlerts, setMacroAlerts] = useState(true);
  
  // States for biometric date range export
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7); // Default to last 7 days
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const [clearing, setClearing] = useState(false);
  const [clearedOk, setClearedOk] = useState(false);

  // CSV Data Exporter
  const handleExportDataRange = () => {
    const start = new Date(startDate + 'T00:00:00').getTime();
    const end = new Date(endDate + 'T23:59:59').getTime();
    
    let csvRows = [];
    // CSV Header row
    csvRows.push([
      'Date',
      'Record Type',
      'Category/Section',
      'Item/Activity Name',
      'Quantity/Duration',
      'Calories (kcal)',
      'Protein (g)',
      'Carbs (g)',
      'Fats (g)'
    ].join(','));

    let rowsAdded = 0;
    const sortedDates = Object.keys(userLogs || {}).sort();

    sortedDates.forEach((dateStr) => {
      const logTime = new Date(dateStr + 'T12:00:00').getTime();
      if (logTime >= start && logTime <= end) {
        const dayLog = userLogs[dateStr];

        // 1. Water Intake
        if (dayLog.waterIntake && dayLog.waterIntake > 0) {
          csvRows.push([
            dateStr,
            'Hydration',
            'Water Intake',
            'Logged Pure Water',
            `${dayLog.waterIntake} ml`,
            '0',
            '0',
            '0',
            '0'
          ].map(v => `"${v.replace(/"/g, '""')}"`).join(','));
          rowsAdded++;
        }

        // 2. Steps Metric
        if (dayLog.steps && dayLog.steps > 0) {
          csvRows.push([
            dateStr,
            'Physical Metrics',
            'Steps Count',
            'Daily Step Count',
            `${dayLog.steps} steps`,
            '0',
            '0',
            '0',
            '0'
          ].map(v => `"${v.replace(/"/g, '""')}"`).join(','));
          rowsAdded++;
        }

        // 3. Meals
        if (dayLog.meals) {
          const sections: ('breakfast' | 'lunch' | 'snacks' | 'dinner')[] = ['breakfast', 'lunch', 'snacks', 'dinner'];
          sections.forEach((sect) => {
            const list = dayLog.meals[sect] || [];
            list.forEach((food) => {
              csvRows.push([
                dateStr,
                'Dietary Log',
                sect.toUpperCase(),
                food.name || 'Custom Food Item',
                food.quantity || '1 portion',
                String(food.calories || 0),
                String(food.protein || 0),
                String(food.carbs || 0),
                String(food.fats || 0)
              ].map(v => `"${v.replace(/"/g, '""')}"`).join(','));
              rowsAdded++;
            });
          });
        }

        // 4. Workouts
        if (dayLog.workouts) {
          dayLog.workouts.forEach((work) => {
            csvRows.push([
              dateStr,
              'Active Workouts',
              'Workout Session',
              work.name || 'Athletic Activity',
              `${work.duration} minutes`,
              `-${work.caloriesBurned || 0}`,
              '0',
              '0',
              '0'
            ].map(v => `"${v.replace(/"/g, '""')}"`).join(','));
            rowsAdded++;
          });
        }
      }
    });

    if (rowsAdded === 0) {
      alert(`No lifestyle logs found between ${startDate} and ${endDate}. Please log some data first!`);
      return;
    }

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodedUri);
    downloadAnchor.setAttribute('download', `NutriPulse_Log_Export_${startDate}_to_${endDate}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
  };

  const purgeLocalCache = () => {
    setClearing(true);
    setClearedOk(false);
    setTimeout(() => {
      localStorage.removeItem('bodysync_jwt_token');
      setClearing(false);
      setClearedOk(true);
      setTimeout(() => logout(), 1000);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto">
      
      {/* Title Segment */}
      <div className="bg-white border border-[#EBE6DC] rounded-xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
        <div className="text-left">
          <h1 className="text-xl font-semibold text-[#2D2A26] tracking-tight">System Configurations</h1>
          <p className="text-[#8C867B] text-[11px] font-normal mt-1 uppercase tracking-wider leading-relaxed">
            Configure telemetry displays, enable automated system alerts, and manage underlying local storage blocks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column configuration blocks */}
        <div className="lg:col-span-2 flex flex-col gap-8 font-sans">
          
          {/* Theme presentation settings */}
          <div className="card-bento flex flex-col gap-6 text-left">
            <div>
              <h2 className="text-xs font-semibold text-[#2D2A26] flex items-center gap-1.5 uppercase tracking-wide">
                <Sun className="w-4 h-4 text-[#2D2A26]" />
                <span>Visual Display Framework Preference</span>
              </h2>
              <p className="text-[10px] text-[#8C867B] mt-0.5">Toggle default system skin modes</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <button 
                onClick={() => setThemeMode('light')}
                className={`flex flex-col items-center gap-3 p-6 rounded-lg border text-[11px] font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  themeMode === 'light' ? 'border-[#2D2A26] bg-[#F6F4EF] text-[#2D2A26]' : 'border-[#EBE6DC] text-[#8C867B] hover:bg-[#F6F4EF]/25'
                }`}
              >
                <Sun className="w-5 h-5 text-[#2D2A26]" />
                <span>Classic Light</span>
              </button>

              <button 
                onClick={() => setThemeMode('dark')}
                className={`flex flex-col items-center gap-3 p-6 rounded-lg border text-[11px] font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  themeMode === 'dark' ? 'border-[#2D2A26] bg-[#F6F4EF] text-[#2D2A26]' : 'border-[#EBE6DC] text-[#8C867B] hover:bg-[#F6F4EF]/25'
                }`}
              >
                <Moon className="w-5 h-5 text-[#2D2A26]" />
                <span>Modern Slate</span>
              </button>

              <button 
                onClick={() => setThemeMode('system')}
                className={`flex flex-col items-center gap-3 p-6 rounded-lg border text-[11px] font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  themeMode === 'system' ? 'border-[#2D2A26] bg-[#F6F4EF] text-[#2D2A26]' : 'border-[#EBE6DC] text-[#8C867B] hover:bg-[#F6F4EF]/25'
                }`}
              >
                <Monitor className="w-5 h-5 text-[#8C867B]" />
                <span>System Sync</span>
              </button>
            </div>

            <div className="bg-[#F6F4EF] text-[#2D2A26] p-4 rounded-lg border border-[#EBE6DC] text-[10px] font-bold tracking-wide text-center uppercase">
              The layout automatically synchronizes with our low-latency high-contrast enterprise color standards.
            </div>
          </div>

          {/* Simple notifications alerting settings */}
          <div className="card-bento flex flex-col gap-6 text-left">
            <h3 className="text-xs font-semibold text-[#2D2A26] flex items-center gap-1.5 pb-2 border-b border-[#EBE6DC] uppercase tracking-wide">
              <Bell className="w-4 h-4 text-[#2D2A26]" />
              <span>Diagnostic System Alerts</span>
            </h3>

            <div className="flex justify-between items-center py-2">
              <div>
                <span className="text-xs font-semibold text-[#2D2A26] block">Automated Intake Alerts</span>
                <span className="text-[10px] text-[#8C867B] block mt-1 leading-relaxed">Alert me via visual badge constraints if macronutrient thresholds deviate substantially.</span>
              </div>
              <input 
                type="checkbox"
                checked={optInAlerts}
                onChange={() => setOptInAlerts(!optInAlerts)}
                className="w-4 h-4 accent-[#2D2A26] text-white focus:ring-[#2D2A26] border-[#EBE6DC] rounded transition-all cursor-pointer"
              />
            </div>

            <div className="flex justify-between items-center py-2 border-t border-[#EBE6DC]">
              <div>
                <span className="text-xs font-semibold text-[#2D2A26] block">Physical Activity Prompts</span>
                <span className="text-[10px] text-[#8C867B] block mt-1 leading-relaxed">System notifications showing estimated burn scores while active.</span>
              </div>
              <input 
                type="checkbox"
                checked={macroAlerts}
                onChange={() => setMacroAlerts(!macroAlerts)}
                className="w-4 h-4 accent-[#2D2A26] text-white focus:ring-[#2D2A26] border-[#EBE6DC] rounded transition-all cursor-pointer"
              />
            </div>
          </div>

          {/* Biometric Data Export Center Bento card */}
          <div className="card-bento flex flex-col gap-6 text-left">
            <div>
              <h3 className="text-xs font-semibold text-[#2D2A26] flex items-center gap-1.5 pb-2 border-b border-[#EBE6DC] uppercase tracking-wide">
                <Shield className="w-4 h-4 text-[#2D2A26]" />
                <span>Enterprise Biometric Data Export</span>
              </h3>
              <p className="text-[10px] text-[#8C867B] mt-1.5 leading-relaxed">
                Export comprehensive daily schedules, macro totals, water logs, and workout metrics as structured Excel-compatible sheets.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-[#8C867B] uppercase tracking-wider">Start Date Range</label>
                <input 
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-[#F6F4EF]/55 border border-[#EBE6DC] rounded-lg px-4 py-2 text-[11px] text-[#2D2A26] outline-none focus:bg-white focus:border-[#2D2A26] transition-all font-sans"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-[#8C867B] uppercase tracking-wider">End Date Range</label>
                <input 
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-[#F6F4EF]/55 border border-[#EBE6DC] rounded-lg px-4 py-2 text-[11px] text-[#2D2A26] outline-none focus:bg-white focus:border-[#2D2A26] transition-all font-sans"
                />
              </div>
            </div>

            <button 
              onClick={handleExportDataRange}
              id="export-metrics-btn"
              className="w-full bg-[#2D2A26] hover:bg-[#1E1C1A] text-white py-2.5 rounded-lg text-[10px] font-semibold uppercase tracking-widest transition-all cursor-pointer shadow-sm text-center font-sans tracking-widest border border-[#2D2A26]"
            >
              Export Selected Logs to Excel (CSV)
            </button>
          </div>

        </div>

        {/* Right column settings: Data operations */}
        <div className="flex flex-col gap-8 font-sans text-left">
          
          {/* Storage Information card */}
          <div className="card-bento flex flex-col gap-5">
            <div className="pb-2 border-b border-[#EBE6DC]">
              <h3 className="text-xs font-semibold text-[#2D2A26] uppercase tracking-wider">Storage & Metadata</h3>
              <p className="text-[9px] text-[#8C867B] mt-0.5 font-bold uppercase">Sandbox Database Persistence</p>
            </div>

            <div className="flex flex-col gap-4 text-xs">
              <div className="bg-[#F6F4EF] border border-[#EBE6DC] p-4 rounded-lg flex flex-col gap-1 text-[10px] font-semibold">
                <span className="text-[#2D2A26] uppercase font-bold flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-[#2D2A26]" />
                  <span>STANDALONE DEV DATABASE</span>
                </span>
                <span className="text-[#2D2A26]/80 mt-1 block font-mono">
                  /data/db.json
                </span>
              </div>
            </div>

            <button 
              onClick={purgeLocalCache}
              disabled={clearing}
              className="mt-4 w-full bg-[#FFFFFF] hover:bg-red-50 text-red-700 border border-red-200 py-2.5 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{clearing ? 'Purging Local Context...' : 'Reset App & Sign Out'}</span>
            </button>

            {clearedOk && (
              <span className="text-[9px] text-red-600 text-center font-bold font-mono">Purge completed successfully. Reallocating session variables...</span>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
