import type { AttendanceRecord } from '../types/attendance';
import './RecordTable.css';

interface RecordTableProps {
  records: AttendanceRecord[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

export function RecordTable({ records, onEdit, onDelete }: RecordTableProps) {
  const handleDelete = (index: number) => {
    if (confirm('この記録を削除しますか？')) {
      onDelete(index);
    }
  };

  return (
    <div className="record-table-container">
      <table className="record-table">
        <thead>
          <tr>
            <th>日付</th>
            <th>開始</th>
            <th>終了</th>
            <th>労働時間</th>
            <th>メモ</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={`${record.date}-${record.start}-${index}`}>
              <td>{record.date}</td>
              <td>{record.start}</td>
              <td>{record.end}</td>
              <td>{record.hours}</td>
              <td className="memo-cell">{record.memo}</td>
              <td className="action-cell">
                <button className="btn-small" onClick={() => onEdit(index)}>
                  編集
                </button>
                <button className="btn-small btn-delete" onClick={() => handleDelete(index)}>
                  削除
                </button>
              </td>
            </tr>
          ))}
          {records.length === 0 && (
            <tr>
              <td colSpan={6} className="no-records">
                記録がありません
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
