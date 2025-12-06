/**
 * 勤怠記録の型定義
 */
export interface AttendanceRecord {
  /** 日付 (YYYY-MM-DD形式) */
  date: string;
  /** 開始時刻 (HH:MM形式) */
  start: string;
  /** 終了時刻 (HH:MM形式) */
  end: string;
  /** 勤務時間 (小数点形式の文字列) */
  hours: string;
  /** メモ */
  memo: string;
}
