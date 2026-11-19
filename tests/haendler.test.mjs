// Händler, Einrichtung und Ausrüster (Cosmetics).
import { createRequire } from 'node:module';
import { describe, it, expect } from 'vitest';
const OK = createRequire(import.meta.url)('../logic.js');

const NOW = new Date('2026-11-18T12:00:00').getTime(); // Mittwoch
const DAY = OK.DAY;
const fresh = (gold = 1000, hof = 3) => { const S = OK.fresh(NOW); S.gold = gold; S.up.hof = hof; return S; };

describe('Händler', () => {
  it('ist erst mit dem Marktstand offen', () => {
    const S = fresh(1000, 0);
    const id = OK.shopOffer(S, NOW)[0];
    expect(OK.shopOpen(S)).toBe(false);
    expect(OK.buyDeko(S, id, NOW)).toBe(false);
  });
  it('bietet 6 Stücke an, gleich innerhalb einer Woche, neu ab Montag', () => {
    const S = fresh();
    const a = OK.shopOffer(S, NOW);
    expect(a).toHaveLength(6);
    expect(OK.shopOffer(S, NOW + DAY)).toEqual(a);          // Donnerstag
    expect(OK.shopOffer(S, NOW + 5 * DAY)).not.toEqual(a);  // nächster Montag
    a.forEach(id => expect(OK.DEKO[id].p).toBeGreaterThan(0));
  });
  it('verkauft nur Angebotenes, zieht Gold ab und nimmt es aus dem Angebot', () => {
    const S = fresh(1000);
    const id = OK.shopOffer(S, NOW)[0], p = OK.DEKO[id].p;
    const nicht = Object.keys(OK.DEKO).find(k => OK.DEKO[k].p > 0 && !OK.shopOffer(S, NOW).includes(k));
    expect(OK.buyDeko(S, nicht, NOW)).toBe(false);
    expect(OK.buyDeko(S, id, NOW)).toBe(true);
    expect(S.gold).toBe(1000 - p);
    expect(S.deko).toContain(id);
    expect(OK.shopOffer(S, NOW)).not.toContain(id);
  });
  it('verkauft nicht ohne genug Gold und keine Beute-Stücke', () => {
    const S = fresh(10);
    expect(OK.buyDeko(S, OK.shopOffer(S, NOW)[0], NOW)).toBe(false);
    expect(OK.buyDeko(fresh(), 'drachenei', NOW)).toBe(false);
  });
});

describe('Aufstellen', () => {
  it('innen nur Innenstücke, aussen nur Aussenstücke, beides überall', () => {
    expect(OK.dekoFits('standuhr', 'halle')).toBe(true);
    expect(OK.dekoFits('standuhr', 'garten')).toBe(false);
    expect(OK.dekoFits('heuballen', 'hof')).toBe(true);
    expect(OK.dekoFits('heuballen', 'thron')).toBe(false);
    expect(OK.dekoFits('topfpflanze', 'garten')).toBe(true);
    expect(OK.dekoFits('topfpflanze', 'bib')).toBe(true);
  });
  it('nur Eigenes, jedes Stück in einem Raum, zurück ins Lager', () => {
    const S = fresh();
    expect(OK.dekoPlace(S, 'halle', 'standuhr', 100)).toBe(false);
    S.deko.push('standuhr');
    expect(OK.dekoPlace(S, 'halle', 'standuhr', 100)).toBe(true);
    expect(OK.dekoPlace(S, 'thron', 'standuhr', 200)).toBe(true);
    expect(OK.dekoWhere(S, 'standuhr')).toBe('thron');
    expect(S.place.halle).toHaveLength(0);
    OK.dekoStore(S, 'standuhr');
    expect(OK.dekoWhere(S, 'standuhr')).toBe('');
  });
  it('Beute-Möbel lassen sich ebenfalls aufstellen', () => {
    const S = fresh();
    S.inv.push('kristallbaum');
    expect(OK.dekoOwned(S)).toContain('kristallbaum');
    expect(OK.dekoPlace(S, 'garten', 'kristallbaum', 120)).toBe(true);
  });
});

describe('Ausrüster', () => {
  it('ist erst mit der Schmiede offen', () => {
    const S = fresh(1000, 2);
    expect(OK.buyCos(S, 'cape_blau')).toBe(false);
  });
  it('kauft einmal, legt gleich an, wechselt nur auf Eigenes', () => {
    const S = fresh(1000);
    expect(OK.buyCos(S, 'cape_blau')).toBe(true);
    expect(S.cos.cape).toBe('cape_blau');
    expect(S.gold).toBe(920);
    expect(OK.buyCos(S, 'cape_blau')).toBe(false);
    expect(OK.setCos(S, 'cape', 'cape_gold')).toBe(false);
    expect(OK.setCos(S, 'pet', 'cape_blau')).toBe(false);
    expect(OK.setCos(S, 'cape', '')).toBe(true);
    expect(S.cos.cape).toBe('');
  });
});

describe('Alte Spielstände', () => {
  it('bekommen Lager, Aufstellung und Cosmetics nachgetragen', () => {
    const S = OK.migrate({ xp: { aus: 100 }, log: [], bosses: [] }, NOW);
    expect(S.deko).toEqual([]);
    expect(S.place).toEqual({});
    expect(S.cos).toEqual({ own: [], cape: '', metall: '', pet: '', outfit: '' });
  });
});
