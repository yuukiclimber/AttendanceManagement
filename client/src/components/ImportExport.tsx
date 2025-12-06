import { useRef } from 'react';
import type { AttendanceRecord } from '../types/attendance';
import './ImportExport.css';

interface ImportExportProps {
  records: AttendanceRecord[];
  onImport: (records: AttendanceRecord[]) => void;
}

export function ImportExport({ records, onImport }: ImportExportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const json = JSON.stringify(records, null, 2);
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
        
        // 配列かどうかチェック
        if (!Array.isArray(data)) {
          alert('無効なファイル形式です');
          return;
        }

        // データの形式を検証・変換
        const importedRecords: AttendanceRecord[] = data.map((item: Record<string, unknown>) => ({
          date: String(item.date || ''),
          start: String(item.start || ''),
          end: String(item.end || ''),
          hours: String(item.hours || '0'),
          memo: String(item.memo || ''),
        }));

        onImport(importedRecords);
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
