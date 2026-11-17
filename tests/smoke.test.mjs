// Grundprüfung: logic.js lädt, die Uhr ist steuerbar, die Debug-Vorlagen ergeben die erwarteten Zustände.
import { createRequire } from 'node:module';
import { describe, it, expect, afterEach } from 'vitest';
const OK = createRequire(import.meta.url)('../logic.js');

const NOW = new Date('2026-11-18T12:00:00').getTime(); // Mittwoch, Ortszeit Zürich

afterEach(() => { OK.clock.fixed = null; OK.clock.offset = 0; });

describe('Uhr', () => {
  it('lässt sich fest setzen und verschieben', () => {
    OK.clock.fixed = NOW;
    expect(OK.now()).toBe(NOW);
    OK.clock.fixed = null; OK.clock.offset = OK.DAY;
    expect(OK.now() - Date.now()).toBeGreaterThan(OK.DAY - 1000);
  });
});

describe('Vorlagen', () => {
  it('leer: frischer Spielstand', () => {
    const S = OK.preset('leer', NOW);
    expect(S.log).toHaveLength(0);
    expect(OK.charLvlOf(S.xp)).toBe(1);
  });
  it('normal: alles gepflegt', () => {
    const S = OK.preset('normal', NOW);
    expect(OK.fit(S, NOW)).toBe(0);
    expect(OK.plant(S, NOW)).toBe(0);
    expect(OK.moder(S, NOW)).toBe(0);
    expect(S.log.length).toBeGreaterThan(50);
  });
  it('vernachlässigt: Held schwach, Garten verdorrt, Moder, Mauerschaden', () => {
    const S = OK.preset('vernachlaessigt', NOW);
    expect(OK.fit(S, NOW)).toBe(2);
    expect(OK.plant(S, NOW)).toBeGreaterThanOrEqual(2);
    expect(OK.moder(S, NOW)).toBeGreaterThan(0);
    expect(S.wall.dmg).toBeGreaterThan(0);
  });
  it('maximal: alles ausgebaut', () => {
    const S = OK.preset('maximal', NOW);
    expect(S.wall.lvl).toBe(8);
    expect(OK.upNext(S, 'burg')).toBeNull();
    expect(OK.charLvlOf(S.xp)).toBeGreaterThanOrEqual(19);
  });
  it('migrate übersteht leeren und kaputten Spielstand', () => {
    expect(OK.migrate(null, NOW).wall.lvl).toBe(1);
    expect(OK.migrate('Unsinn', NOW).gold).toBe(25);
  });
});
