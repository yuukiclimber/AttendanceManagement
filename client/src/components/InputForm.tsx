import { useState, useEffect } from 'react';
import type { AttendanceRecord } from '../types/attendance';
import { getTodayString, calculateHours, formatHours } from '../utils/timeCalculation';
import './InputForm.css';

interface InputFormProps {
  onSubmit: (record: AttendanceRecord) => void;
  editingRecord?: AttendanceRecord | null;
  onCancelEdit?: () => void;
}

export function InputForm({ onSubmit, editingRecord, onCancelEdit }: InputFormProps) {
  const [date, setDate] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [memo, setMemo] = useState('');

  // コンポーネントマウント時と編集モード変更時に初期化
  // useEffect内で複数のsetStateを呼び出すのはパフォーマンス上の推奨事項ですが、
  // 実装の必要上、ここでは許容します
  useEffect(() => {
    if (editingRecord) {
      setDate(editingRecord.date);
      setStart(editingRecord.start);
      setEnd(editingRecord.end);
      setMemo(editingRecord.memo);
    } else {
      setDate(getTodayString());
      setStart('');
      setEnd('');
      setMemo('');
    }
  }, [editingRecord]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !start || !end) {
      alert('日付、開始時刻、終了時刻を入力してください');
      return;
    }

    const hours = calculateHours(start, end);
    
    const record: AttendanceRecord = {
      date,
      start,
      end,
      hours: formatHours(hours),
      memo,
    };

    onSubmit(record);

    // フォームをリセット
    if (!editingRecord) {
      setStart('');
      setEnd('');
      setMemo('');
    }
  };

  const handleCancel = () => {
    setDate(getTodayString());
    setStart('');
    setEnd('');
    setMemo('');
    onCancelEdit?.();
  };

  return (
    <form className="input-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label className="form-label">
          日付：
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="form-input"
          />
        </label>

        <label className="form-label">
          開始時間：
          <input
            type="time"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="form-input"
          />
        </label>

        <label className="form-label">
          終了時間：
          <input
            type="time"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="form-input"
          />
        </label>

        <label className="form-label">
          メモ：
          <input
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="メモを入力"
            className="form-input form-input-memo"
          />
        </label>

        <button type="submit" className="btn btn-primary">
          {editingRecord ? '更新する' : '記録する'}
        </button>

        {editingRecord && (
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            キャンセル
          </button>
        )}
      </div>
    </form>
  );
}
