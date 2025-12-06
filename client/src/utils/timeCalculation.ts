import type { AttendanceRecord } from '../types/attendance';

/**
 * HH:MM形式の時刻文字列を分単位に変換
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * 分を時間（小数点形式）に変換
 */
export function minutesToHours(minutes: number): number {
  return Math.round((minutes / 60) * 100) / 100;
}

/**
 * 開始時刻と終了時刻から勤務時間を計算
 */
export function calculateHours(start: string, end: string): number {
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);
  const diffMinutes = endMinutes - startMinutes;
  
  if (diffMinutes < 0) {
    return 0;
  }
  
  return minutesToHours(diffMinutes);
}

/**
 * 勤務時間を文字列形式に変換
 */
export function formatHours(hours: number): string {
  return hours.toFixed(2);
}

/**
 * Date を YYYY-MM-DD 形式の文字列に変換
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 今日の日付を YYYY-MM-DD 形式で取得
 */
export function getTodayString(): string {
  return formatDate(new Date());
}

/**
 * 特定の日付の勤務時間合計を取得
 */
export function getDailyTotal(records: AttendanceRecord[], date: string): number {
  return records
    .filter(record => record.date === date)
    .reduce((sum, record) => sum + (parseFloat(record.hours) || 0), 0);
}

/**
 * 月のカレンダー用の日付配列を生成（前月・翌月の日付を含む）
 */
export function getCalendarDays(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  const endDate = new Date(lastDay);
  const remainingDays = 6 - lastDay.getDay();
  endDate.setDate(endDate.getDate() + remainingDays);
  
  const days: Date[] = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return days;
}
