import { useState } from 'react';
import type { AttendanceRecord } from '../types/attendance';
import { getCalendarDays, formatDate, getDailyTotal } from '../utils/timeCalculation';
import './Calendar.css';

interface CalendarProps {
  records: AttendanceRecord[];
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

export function Calendar({ records }: CalendarProps) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

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
            // 累計（この週までの合計）
            const cumulativeTotal = weeks
              .slice(0, weekIndex + 1)
              .reduce((sum, w) => sum + getWeekTotal(w), 0);

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
