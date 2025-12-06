import { useState, useEffect } from 'react';
import type { AttendanceRecord } from './types/attendance';
import { InputForm } from './components/InputForm';
import { RecordTable } from './components/RecordTable';
import { Calendar } from './components/Calendar';
import { ImportExport } from './components/ImportExport';
import './App.css';

const STORAGE_KEY = 'attendance_records';

// localStorageからデータを読み込む
function loadRecords(): AttendanceRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load records from localStorage:', e);
  }
  return [];
}

// localStorageにデータを保存する
function saveRecords(records: AttendanceRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save records to localStorage:', e);
  }
}

function App() {
  const [records, setRecords] = useState<AttendanceRecord[]>(loadRecords);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // recordsが変更されたらlocalStorageに保存
  useEffect(() => {
    saveRecords(records);
  }, [records]);

  const handleAddRecord = (record: AttendanceRecord) => {
    if (editingIndex !== null) {
      // 編集モード
      const newRecords = [...records];
      newRecords[editingIndex] = record;
      setRecords(newRecords);
      setEditingIndex(null);
    } else {
      // 新規追加
      setRecords([record, ...records]);
    }
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
  };

  const handleDelete = (index: number) => {
    setRecords(records.filter((_, i) => i !== index));
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
  };

  const handleImport = (importedRecords: AttendanceRecord[]) => {
    setRecords(importedRecords);
  };

  return (
    <div className="app">
      <h1 className="app-title">勤怠管理</h1>

      <InputForm
        onSubmit={handleAddRecord}
        editingRecord={editingIndex !== null ? records[editingIndex] : null}
        onCancelEdit={handleCancelEdit}
      />

      <RecordTable
        records={records}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Calendar records={records} />

      <ImportExport records={records} onImport={handleImport} />
    </div>
  );
}

export default App;
