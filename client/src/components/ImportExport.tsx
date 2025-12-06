import { useRef } from 'react';
import type { AttendanceRecord } from '../types/attendance';
import './ImportExport.css';

interface ImportExportProps {
  records: AttendanceRecord[];
  carryOverByMonth: Record<string, number>;
  onImport: (records: AttendanceRecord[], carryOverByMonth?: Record<string, number>) => void;
}

interface ExportData {
  records: AttendanceRecord[];
  carryOverByMonth: Record<string, number>;
}

export function ImportExport({ records, carryOverByMonth, onImport }: ImportExportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const exportData: ExportData = {
      records,
      carryOverByMonth
    };
    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `kintai_log.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const data = JSON.parse(json);
        
        // 新形式（records + carryOverByMonth）か旧形式（配列のみ）かチェック
        let importedRecords: AttendanceRecord[];
        let importedCarryOver: Record<string, number> | undefined;

        if (Array.isArray(data)) {
          // 旧形式：配列のみ
          importedRecords = data.map((item: Record<string, unknown>) => ({
            date: String(item.date || ''),
            start: String(item.start || ''),
            end: String(item.end || ''),
            hours: String(item.hours || '0'),
            memo: String(item.memo || ''),
          }));
        } else if (data && typeof data === 'object' && Array.isArray(data.records)) {
          // 新形式：オブジェクト
          importedRecords = data.records.map((item: Record<string, unknown>) => ({
            date: String(item.date || ''),
            start: String(item.start || ''),
            end: String(item.end || ''),
            hours: String(item.hours || '0'),
            memo: String(item.memo || ''),
          }));
          if (data.carryOverByMonth && typeof data.carryOverByMonth === 'object') {
            importedCarryOver = data.carryOverByMonth as Record<string, number>;
          }
        } else {
          alert('無効なファイル形式です');
          return;
        }

        onImport(importedRecords, importedCarryOver);
        alert(`${importedRecords.length}件のデータをインポートしました`);
      } catch {
        alert('ファイルの読み込みに失敗しました');
      }
    };
    reader.readAsText(file);

    // ファイル選択をリセット
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="import-export">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="file-input"
        id="file-input"
      />
      <button className="btn-import" onClick={() => fileInputRef.current?.click()}>
        インポート
      </button>
      <button className="btn-export" onClick={handleExport}>
        エクスポート
      </button>
    </div>
  );
}
