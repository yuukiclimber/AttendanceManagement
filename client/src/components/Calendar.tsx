import { useState } from 'react';
import type { AttendanceRecord } from '../types/attendance';
import { getCalendarDays, formatDate, getDailyTotal } from '../utils/timeCalculation';
import './Calendar.css';

interface CalendarProps {
  records: AttendanceRecord[];
  carryOverByMonth: Record<string, number>;
  onCarryOverChange: (month: string, value: number) => void;
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

// 月のキーを生成 (例: "2025-01")
function getMonthKey(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

export function Calendar({ records, carryOverByMonth, onCarryOverChange }: CalendarProps) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  
  const monthKey = getMonthKey(currentYear, currentMonth);
  const carryOver = carryOverByMonth[monthKey] ?? 0;
  
  const [carryOverText, setCarryOverText] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);

  const calendarDays = getCalendarDays(currentYear, currentMonth);

  // 週ごとにグループ化
  const weeks: Date[][] = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  // 週の合計時間を計算
  const getWeekTotal = (week: Date[]): number => {
    return week.reduce((sum, day) => {
      const dateStr = formatDate(day);
      return sum + getDailyTotal(records, dateStr);
    }, 0);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button className="nav-btn" onClick={handlePrevMonth}>
          &lt;&lt;
        </button>
        <span className="calendar-title">
          {currentYear}年 {currentMonth + 1}月
        </span>
        <button className="nav-btn" onClick={handleNextMonth}>
          &gt;&gt;
        </button>
        <div className="carry-over-container">
          <label className="carry-over-label">前月からの繰越</label>
          <input
            type="text"
            value={isEditing ? carryOverText : (carryOver === 0 ? '' : carryOver)}
            onChange={(e) => {
              setCarryOverText(e.target.value);
            }}
            onFocus={() => {
              setIsEditing(true);
              setCarryOverText(carryOver === 0 ? '' : String(carryOver));
            }}
            onBlur={() => {
              setIsEditing(false);
              const num = parseFloat(carryOverText);
              if (!isNaN(num)) {
                onCarryOverChange(monthKey, num);
              } else {
                onCarryOverChange(monthKey, 0);
              }
            }}
            className="carry-over-input"
            placeholder="繰越"
          />
          <span className="carry-over-unit">時間</span>
        </div>
      </div>

      <table className="calendar-table">
        <thead>
          <tr>
            {WEEKDAYS.map((day) => (
              <th key={day}>{day}</th>
            ))}
            <th className="week-total-header">週合計<br />累計</th>
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, weekIndex) => {
            const weekTotal = getWeekTotal(week);
            // 累計（この週までの合計）+ 繰越
            const cumulativeTotal = weeks
              .slice(0, weekIndex + 1)
              .reduce((sum, w) => sum + getWeekTotal(w), 0) + carryOver;

            return (
              <tr key={weekIndex}>
                {week.map((day) => {
                  const dateStr = formatDate(day);
                  const isCurrentMonth = day.getMonth() === currentMonth;
                  const dailyHours = getDailyTotal(records, dateStr);
                  const dayOfMonth = day.getDate();

                  return (
                    <td
                      key={dateStr}
                      className={`calendar-cell ${!isCurrentMonth ? 'other-month' : ''}`}
                    >
                      <div className="cell-date">
                        {isCurrentMonth ? `${currentMonth + 1}/${dayOfMonth}` : `${day.getMonth() + 1}/${dayOfMonth}`}
                      </div>
                      {dailyHours > 0 && (
                        <div className="cell-hours">{dailyHours} 時間</div>
                      )}
                    </td>
                  );
                })}
                <td className="week-total-cell">
                  <div className="week-total">{weekTotal} 時間</div>
                  <div className="cumulative-total">{cumulativeTotal} 時間</div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
