import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/AttendanceManagement/', // リポジトリ名に合わせる（大文字小文字も一致）
  server: { host: '0.0.0.0' },
})
