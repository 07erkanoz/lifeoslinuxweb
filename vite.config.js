import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Göreli base: aynı derleme lifeos.com.tr/linux/ altında da, yerel bir klasörden de çalışır (HashRouter).
export default defineConfig({ base: './', plugins: [react()] });
