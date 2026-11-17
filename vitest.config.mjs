import { defineConfig } from 'vitest/config';

// Spielregeln rechnen in der Zeitzone des Geräts. Tests laufen fest in Europe/Zurich.
process.env.TZ = 'Europe/Zurich';

export default defineConfig({
  test: { include: ['tests/**/*.test.{js,mjs}'], environment: 'node' }
});
