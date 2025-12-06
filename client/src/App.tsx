import { useState, useEffect } from 'react';
import type { AttendanceRecord } from './types/attendance';
import { InputForm } from './components/InputForm';
import { RecordTable } from './components/RecordTable';
import { Calendar } from './components/Calendar';
import { ImportExport } from './components/ImportExport';
import './App.css';

const STORAGE_KEY = 'attendance_records';
const CARRY_OVER_KEY = 'attendance_carry_over_by_month';

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

// localStorageから月別繰越を読み込む
function loadCarryOverByMonth(): Record<string, number> {
  try {
    const data = localStorage.getItem(CARRY_OVER_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load carryOverByMonth from localStorage:', e);
  }
  return {};
}

// localStorageに月別繰越を保存する
function saveCarryOverByMonth(carryOverByMonth: Record<string, number>): void {
  try {
    localStorage.setItem(CARRY_OVER_KEY, JSON.stringify(carryOverByMonth));
  } catch (e) {
    console.error('Failed to save carryOverByMonth to localStorage:', e);
  }
}

function App() {
  const [records, setRecords] = useState<AttendanceRecord[]>(loadRecords);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [carryOverByMonth, setCarryOverByMonth] = useState<Record<string, number>>(loadCarryOverByMonth);

  // recordsが変更されたらlocalStorageに保存
  useEffect(() => {
    saveRecords(records);
  }, [records]);

  // carryOverByMonthが変更されたらlocalStorageに保存
  useEffect(() => {
    saveCarryOverByMonth(carryOverByMonth);
  }, [carryOverByMonth]);

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

  const handleImport = (importedRecords: AttendanceRecord[], importedCarryOverByMonth?: Record<string, number>) => {
    setRecords(importedRecords);
    if (importedCarryOverByMonth) {
      setCarryOverByMonth(importedCarryOverByMonth);
    }
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

      <Calendar 
        records={records} 
        carryOverByMonth={carryOverByMonth} 
        onCarryOverChange={(month, value) => {
          setCarryOverByMonth(prev => ({ ...prev, [month]: value }));
        }} 
      />

      <ImportExport 
        records={records} 
        carryOverByMonth={carryOverByMonth}
        onImport={handleImport} 
      />
    </div>
  );
}

export default App;
