// Spiellogik von Oathkeep, geprüft gegen die Regeln in CLAUDE.md (Abschnitt 4 und 11).
// Erwartete Werte stammen aus den Regeln, nicht aus dem Code.
// Zeit ist immer simuliert (vi.useFakeTimers, OK.clock.fixed). Zeitzone Europe/Zurich (vitest.config.mjs).
import { createRequire } from 'node:module';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
const OK = createRequire(import.meta.url)('../logic.js');

const H = 3600000, D = OK.DAY;
const T = (s) => new Date(s).getTime(); // Ortszeit Europe/Zurich
const NOW = T('2026-11-18T12:00:00'); // Mittwoch
const rng = (v) => () => v; // fester Zufall
const CH = ['kueche', 'bad', 'saugen', 'staub', 'bett'];
const putzAlle = (S, t) => CH.forEach((k) => { S.last[k] = t; });

beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(NOW); });
afterEach(() => { vi.useRealTimers(); OK.clock.fixed = null; OK.clock.offset = 0; });

describe('Umgebung und Uhr', () => {
  it('Tests laufen in Europe/Zurich (Sommer +2, Winter +1)', () => {
    expect(new Date('2026-07-01T12:00:00').getTimezoneOffset()).toBe(-120);
    expect(new Date('2026-12-01T12:00:00').getTimezoneOffset()).toBe(-60);
  });
  it('OK.now folgt der simulierten Systemzeit, clock.fixed und clock.offset', () => {
    expect(OK.now()).toBe(NOW);
    OK.clock.offset = D; expect(OK.now()).toBe(NOW + D);
    OK.clock.fixed = T('2027-01-01T00:00:00'); expect(OK.now()).toBe(T('2027-01-01T00:00:00'));
  });
});

describe('Stufen', () => {
  it('Fertigkeitsstufe floor(sqrt(ruhm/30))+1', () => {
    expect([0, 29, 30, 119, 120, 269, 270, 30000].map(OK.lvl)).toEqual([1, 1, 2, 2, 3, 3, 4, 32]);
  });
  it('Charakterstufe floor(sqrt(summe/150))+1', () => {
    const xp = (n) => ({ aus: n, sta: 0, kla: 0, hau: 0, kra: 0, wis: 0 });
    expect([0, 149, 150, 599, 600].map((n) => OK.charLvlOf(xp(n)))).toEqual([1, 1, 2, 2, 3]);
    expect(OK.charLvlOf({ aus: 100, sta: 100, kla: 100, hau: 100, kra: 100, wis: 100 })).toBe(3);
  });
  it('Plausibilität: nach einem Monat Alltag etwa Stufe 5', () => {
    const S = OK.preset('normal', NOW);
    const l = OK.charLvlOf(S.xp);
    expect(l).toBeGreaterThanOrEqual(4); expect(l).toBeLessThanOrEqual(6);
  });
  it('Plausibilität: nach einem Jahr nach den Zielen etwa Stufe 19 und 150 bis 200 Gold pro Woche', () => {
    const start = T('2025-11-17T00:00:00'); const S = OK.fresh(start);
    for (let d = 0; d < 365; d++) {
      const t = new Date(start); t.setDate(t.getDate() + d); const b = t.getTime(), w = t.getDay();
      if (w === 1 || w === 4) OK.logEntry(S, 'run', 6, b + 7 * H);
      if (w === 2 || w === 5 || w === 6) OK.logEntry(S, 'gym', 1, b + 18 * H);
      if (w !== 0 && w !== 3) OK.logEntry(S, 'piano', 20, b + 19 * H);
      if (d % 3 === 0) OK.logEntry(S, 'water', 1, b + 9 * H);
      if (w === 6) ['kueche', 'bad', 'saugen', 'staub'].forEach((k, i) => OK.logEntry(S, k, 1, b + 10 * H + i * 60000));
      if (d % 21 === 0) OK.logEntry(S, 'bett', 1, b + 11 * H);
      OK.logEntry(S, 'read', 20, b + 21 * H);
      if (d % 14 === 13) OK.logEntry(S, 'book', 1, b + 22 * H, 'Buch');
    }
    const l = OK.charLvlOf(S.xp);
    expect(l).toBeGreaterThanOrEqual(17); expect(l).toBeLessThanOrEqual(21);
    const proWoche = (S.gold - 25) / 52;
    expect(proWoche).toBeGreaterThanOrEqual(130); expect(proWoche).toBeLessThanOrEqual(220);
  });
});

describe('Ruhm und Gold je Routine', () => {
  let S; beforeEach(() => { S = OK.fresh(NOW - 10 * D); });

  it('Laufen: 12 Ruhm pro km, Gold round(Ruhm/5)', () => {
    const r = OK.logEntry(S, 'run', 5, NOW);
    expect(r.ok).toBe(true); expect(r.x).toBe(60); expect(r.g).toBe(12);
    expect(S.xp.aus).toBe(60); expect(S.gold).toBe(25 + 12);
  });
  it('Laufen: höchstens 200 Ruhm pro Tag', () => {
    expect(OK.logEntry(S, 'run', 10, NOW).x).toBe(120);
    expect(OK.logEntry(S, 'run', 10, NOW + H).x).toBe(80);
    expect(OK.logEntry(S, 'run', 1, NOW + 2 * H).x).toBe(0);
    expect(S.xp.aus).toBe(200);
  });
  it('Kampftraining: 50 Ruhm, nur einmal pro Tag', () => {
    expect(OK.logEntry(S, 'gym', 1, NOW).x).toBe(50);
    const r = OK.logEntry(S, 'gym', 1, NOW + H);
    expect(r).toMatchObject({ ok: false, err: 'today' }); expect(S.xp.sta).toBe(50); expect(S.log).toHaveLength(1);
  });
  it('Piano: 2 Ruhm pro Minute, höchstens 80 pro Tag', () => {
    expect(OK.logEntry(S, 'piano', 30, NOW).x).toBe(60);
    expect(OK.logEntry(S, 'piano', 30, NOW + H).x).toBe(20);
    expect(S.xp.kla).toBe(80);
  });
  it('Giessen: 25 Ruhm, nur einmal pro Tag', () => {
    expect(OK.logEntry(S, 'water', 1, NOW).x).toBe(25);
    expect(OK.logEntry(S, 'water', 1, NOW + H)).toMatchObject({ ok: false, err: 'today' });
  });
  it('Putzaufgaben: je 30 Ruhm, gemeinsames Tageslimit 150', () => {
    CH.forEach((k, i) => expect(OK.logEntry(S, k, 1, NOW + i * 60000).x).toBe(30));
    expect(OK.logEntry(S, 'waesche', 1, NOW + H).x).toBe(0);
    expect(S.xp.hau).toBe(150);
  });
  it('Wäsche: 15 Ruhm', () => {
    expect(OK.logEntry(S, 'waesche', 1, NOW).x).toBe(15);
  });
  it('Lesen: 1 Ruhm pro Minute, höchstens 60 pro Tag', () => {
    expect(OK.logEntry(S, 'read', 90, NOW).x).toBe(60);
  });
  it('Buch vollendet: 80 Ruhm, Titel wird gespeichert (max. 60 Zeichen)', () => {
    const r = OK.logEntry(S, 'book', 1, NOW, 'x'.repeat(100));
    expect(r.x).toBe(80); expect(r.g).toBe(16);
    expect(S.books).toHaveLength(1); expect(S.books[0].n).toHaveLength(60);
  });
  it('Buch vollendet verbraucht nicht das Lese-Tageslimit (Schriften studieren)', () => {
    OK.logEntry(S, 'book', 1, NOW, 'Der Hobbit');
    const r = OK.logEntry(S, 'read', 30, NOW + H);
    expect(r.x).toBe(30); // Regel: 1 Ruhm pro Minute, max. 60 pro Tag; Buch hat eigene 80
  });
  it('Trank: 50 % mehr Gold für 24 Stunden', () => {
    S.potions = 1; expect(OK.drinkPotion(S, NOW)).toBe(true);
    expect(OK.logEntry(S, 'run', 5, NOW + H).g).toBe(18); // 12 * 1.5
    expect(OK.logEntry(S, 'gym', 1, NOW + 24 * H).g).toBe(10); // Trank abgelaufen
  });
  it('Ausrüstungsbonus auf Gold (Läuferamulett +15 %)', () => {
    S.inv.push('laeufer'); S.equip.talisman = 'laeufer';
    expect(OK.logEntry(S, 'run', 5, NOW).g).toBe(14); // 12 * 1.15 = 13.8
  });
});

describe('Ungültige Eingaben', () => {
  let S; beforeEach(() => { S = OK.fresh(NOW - D); });
  const unveraendert = (S) => { expect(S.log).toHaveLength(0); expect(S.gold).toBe(25); expect(S.xp.aus + S.xp.kla + S.xp.wis).toBe(0); expect(S.bosses[0].dmg).toBe(0); };

  it.each([0, -5, -0.0001, NaN, Infinity, 100.1, 1e9, undefined, null])('Laufen mit %s km wird abgelehnt', (a) => {
    expect(OK.logEntry(S, 'run', a, NOW)).toEqual({ ok: false, err: 'km' });
    unveraendert(S);
  });
  it.each([0, -1, 601, NaN])('Piano und Lesen mit %s Minuten werden abgelehnt', (a) => {
    expect(OK.logEntry(S, 'piano', a, NOW).err).toBe('min');
    expect(OK.logEntry(S, 'read', a, NOW).err).toBe('min');
    unveraendert(S);
  });
  it('Laufen mit 100 km (Obergrenze) ist erlaubt, Ruhm auf 200 begrenzt', () => {
    const r = OK.logEntry(S, 'run', 100, NOW);
    expect(r.ok).toBe(true); expect(r.x).toBe(200);
  });
  it('Unbekannte Routine wird abgelehnt', () => {
    expect(OK.logEntry(S, 'tanzen', 1, NOW).err).toBe('kind'); unveraendert(S);
  });
  it('Menge als Text ("5") ergibt Zahlen im Spielstand, keine Textverkettung', () => {
    OK.logEntry(S, 'run', '5', NOW);
    expect(S.bosses[0].dmg).toBe(5);
    expect(OK.monthKm(S, NOW)).toBe(5);
  });
});

describe('Tageswechsel Europe/Zurich', () => {
  it('Tageslimit endet um Mitternacht Ortszeit', () => {
    const S = OK.fresh(NOW - 5 * D);
    OK.logEntry(S, 'run', 20, T('2026-11-17T23:59:59'));
    expect(OK.logEntry(S, 'run', 10, T('2026-11-17T23:59:59.999')).x).toBe(0);
    expect(OK.logEntry(S, 'run', 10, T('2026-11-18T00:00:00')).x).toBe(120);
  });
  it('Kampftraining kurz vor und kurz nach Mitternacht zählt zweimal', () => {
    const S = OK.fresh(NOW - 5 * D);
    expect(OK.logEntry(S, 'gym', 1, T('2026-11-17T23:59:00')).x).toBe(50);
    expect(OK.logEntry(S, 'gym', 1, T('2026-11-18T00:01:00')).x).toBe(50);
  });
  it('Sommerzeitbeginn 29.3.2026 (23 Stunden): 00:30 und 23:30 sind derselbe Tag', () => {
    const S = OK.fresh(T('2026-03-20T12:00:00'));
    expect(OK.dkey(T('2026-03-29T00:30:00'))).toBe('2026-03-29');
    expect(OK.dkey(T('2026-03-29T23:30:00'))).toBe('2026-03-29');
    expect(OK.logEntry(S, 'gym', 1, T('2026-03-29T00:30:00')).x).toBe(50);
    expect(OK.logEntry(S, 'gym', 1, T('2026-03-29T23:30:00')).err).toBe('today');
    expect(OK.logEntry(S, 'gym', 1, T('2026-03-30T00:00:00')).x).toBe(50);
  });
  it('Winterzeitbeginn 25.10.2026 (25 Stunden): 00:10 und 23:50 sind derselbe Tag', () => {
    const S = OK.fresh(T('2026-10-20T12:00:00'));
    expect(OK.logEntry(S, 'gym', 1, T('2026-10-25T00:10:00')).x).toBe(50);
    expect(OK.logEntry(S, 'gym', 1, T('2026-10-25T23:50:00')).err).toBe('today');
    expect(OK.dkey(T('2026-10-25T23:59:59'))).toBe('2026-10-25');
    expect(OK.dkey(T('2026-10-26T00:00:00'))).toBe('2026-10-26');
  });
  it('Sommerzeitbeginn 28.3.2027: Tagesgrenze stimmt', () => {
    expect(OK.dkey(T('2027-03-28T23:59:59'))).toBe('2027-03-28');
    expect(OK.dkey(T('2027-03-29T00:00:00'))).toBe('2027-03-29');
  });
  it('Zurücknehmen nur am selben Tag: 23:59 eingetragen, 00:01 nicht mehr', () => {
    const S = OK.fresh(NOW - 5 * D);
    OK.logEntry(S, 'gym', 1, T('2026-11-17T23:59:00'));
    expect(OK.undoLast(S, T('2026-11-18T00:01:00'))).toBe(false);
    expect(OK.undoLast(S, T('2026-11-17T23:59:30'))).toBe(true);
  });
});

describe('Woche', () => {
  it('Wochenbeginn Montag 00:00, auch über Sommer- und Winterzeit', () => {
    expect(OK.weekStart(T('2026-03-29T22:00:00'))).toBe(T('2026-03-23T00:00:00'));
    expect(OK.weekStart(T('2026-03-30T00:00:00'))).toBe(T('2026-03-30T00:00:00'));
    expect(OK.weekStart(T('2026-10-25T23:00:00'))).toBe(T('2026-10-19T00:00:00'));
    expect(OK.weekStart(T('2026-10-26T00:30:00'))).toBe(T('2026-10-26T00:00:00'));
    expect(OK.weekStart(T('2027-03-28T12:00:00'))).toBe(T('2027-03-22T00:00:00'));
  });
  it('Piano-Tage: Sonntag 23:59 gehört zur alten Woche, Montag 00:00 zur neuen', () => {
    const S = OK.fresh(T('2026-11-01T12:00:00'));
    OK.logEntry(S, 'piano', 20, T('2026-11-15T23:59:00'));
    expect(OK.pianoDays(S, T('2026-11-15T23:59:30'))).toBe(1);
    OK.logEntry(S, 'piano', 20, T('2026-11-16T00:00:00'));
    expect(OK.pianoDays(S, T('2026-11-16T12:00:00'))).toBe(1);
  });
  it('Piano-Tage zählen nur Tage mit mindestens 15 Minuten', () => {
    const S = OK.fresh(T('2026-11-01T12:00:00'));
    OK.logEntry(S, 'piano', 10, T('2026-11-16T19:00:00'));
    expect(OK.pianoDays(S, NOW)).toBe(0); // Ziel: je mindestens 15 Minuten
    OK.logEntry(S, 'piano', 10, T('2026-11-17T19:00:00'));
    OK.logEntry(S, 'piano', 10, T('2026-11-17T20:00:00')); // 20 Minuten am 17.11.
    expect(OK.pianoDays(S, NOW)).toBe(1);
  });
});

describe('Monat und Laufziel', () => {
  const lauf = (pairs) => { const S = OK.fresh(T('2025-10-01T12:00:00')); pairs.forEach(([t, km]) => OK.logEntry(S, 'run', km, T(t))); return S; };
  it('31-Tage-Monat: 31.10. 23:59 zählt zum Oktober, 1.11. 00:00 zum November (nach Winterzeit)', () => {
    const S = lauf([['2026-10-31T23:59:00', 5], ['2026-11-01T00:00:00', 7]]);
    expect(OK.monthKm(S, T('2026-10-31T23:59:30'))).toBe(5);
    expect(OK.monthKm(S, T('2026-11-01T12:00:00'))).toBe(7);
  });
  it('30-Tage-Monat: 30.11. und 1.12.', () => {
    const S = lauf([['2026-11-30T23:59:59', 4], ['2026-12-01T00:00:01', 6]]);
    expect(OK.monthKm(S, T('2026-11-30T23:59:59.5'))).toBe(4);
    expect(OK.monthKm(S, T('2026-12-01T08:00:00'))).toBe(6);
  });
  it('28-Tage-Monat: Februar 2027', () => {
    const S = lauf([['2027-02-01T00:00:00', 3], ['2027-02-28T23:59:00', 4], ['2027-03-01T00:01:00', 9]]);
    expect(OK.monthKm(S, T('2027-02-28T23:59:30'))).toBe(7);
    expect(OK.monthKm(S, T('2027-03-01T00:02:00'))).toBe(9);
  });
  it('März 2027 über Sommerzeitbeginn hinweg', () => {
    const S = lauf([['2027-03-01T07:00:00', 5], ['2027-03-28T03:30:00', 5], ['2027-03-31T23:59:00', 5]]);
    expect(OK.monthKm(S, T('2027-03-31T23:59:30'))).toBe(15);
  });
  it('Gleicher Monat im Vorjahr zählt nicht', () => {
    const S = lauf([['2025-11-10T07:00:00', 8], ['2026-11-10T07:00:00', 3]]);
    expect(OK.monthKm(S, NOW)).toBe(3);
  });
  it('Laufziel während des Monats ändern verändert die gelaufenen km nicht', () => {
    const S = lauf([['2026-11-03T07:00:00', 12]]);
    S.runGoal = 80;
    expect(OK.monthKm(S, NOW)).toBe(12); expect(S.runGoal).toBe(80);
  });
});

describe('Zustände und Folgen', () => {
  const t0 = T('2026-11-01T12:00:00');
  it('Garten: frisch < 3,5, welk < 6, verdorrt < 9, sonst verrottet; erholt sich nach Giessen', () => {
    const S = OK.fresh(t0);
    expect(OK.plant(S, t0 + 3.5 * D - 1)).toBe(0);
    expect(OK.plant(S, t0 + 3.5 * D)).toBe(1);
    expect(OK.plant(S, t0 + 6 * D)).toBe(2);
    expect(OK.plant(S, t0 + 9 * D)).toBe(3);
    expect(OK.plant(S, t0 + 40 * D)).toBe(3);
    OK.logEntry(S, 'water', 1, t0 + 40 * D);
    expect(OK.plant(S, t0 + 40 * D + H)).toBe(0);
  });
  it('Held: kräftig < 4, müde < 7, sonst geschwächt; Lauf oder Kampftraining macht wieder kräftig', () => {
    const S = OK.fresh(t0);
    expect(OK.fit(S, t0 + 4 * D - 1)).toBe(0);
    expect(OK.fit(S, t0 + 4 * D)).toBe(1);
    expect(OK.fit(S, t0 + 7 * D)).toBe(2);
    OK.logEntry(S, 'run', 3, t0 + 10 * D);
    expect(OK.fit(S, t0 + 10 * D)).toBe(0);
    expect(OK.fit(S, t0 + 15 * D)).toBe(1);
    OK.logEntry(S, 'gym', 1, t0 + 15 * D);
    expect(OK.fit(S, t0 + 15 * D)).toBe(0);
  });
  it('Zauberturm: leuchtet < 1,5, glimmt < 3,5, sonst erloschen; neu ohne Übung erloschen', () => {
    const S = OK.fresh(t0);
    expect(OK.tower(S, t0)).toBe(0);
    OK.logEntry(S, 'piano', 15, t0);
    expect(OK.tower(S, t0 + 1.5 * D - 1)).toBe(2);
    expect(OK.tower(S, t0 + 1.5 * D)).toBe(1);
    expect(OK.tower(S, t0 + 3.5 * D)).toBe(0);
  });
  it('Moder: zählt überfällige Putzaufgaben (7 bzw. 21 Tage) und verschwindet nach dem Putzen', () => {
    const S = OK.fresh(t0);
    expect(OK.moder(S, t0 + 7 * D)).toBe(0);
    expect(OK.moder(S, t0 + 7 * D + 1)).toBe(4);
    expect(OK.moder(S, t0 + 21 * D + 1)).toBe(5);
    OK.logEntry(S, 'kueche', 1, t0 + 22 * D);
    expect(OK.moder(S, t0 + 22 * D)).toBe(4);
    ['bad', 'saugen', 'staub', 'bett'].forEach((k, i) => OK.logEntry(S, k, 1, t0 + 22 * D + i * 1000));
    expect(OK.moder(S, t0 + 22 * D + H)).toBe(0);
  });
  it('Moder über Sommerzeitbeginn: Fälligkeit spätestens 7 Tage plus 1 Stunde Ortszeit', () => {
    const S = OK.fresh(T('2026-03-15T12:00:00'));
    putzAlle(S, T('2026-03-22T10:00:00'));
    expect(OK.moder(S, T('2026-03-29T11:00:01'))).toBe(4);
  });
  it('Bewohner zufrieden nur ohne Moder, Garten frisch und ohne Mauerschaden', () => {
    const S = OK.fresh(t0);
    expect(OK.happy(S, t0 + D)).toBe(true);
    S.wall.dmg = 1; expect(OK.happy(S, t0 + D)).toBe(false); S.wall.dmg = 0;
    expect(OK.happy(S, t0 + 4 * D)).toBe(false);
  });
  it('App wochenlang nicht geöffnet: alles verfallen, aber nichts stürzt ab', () => {
    const S = OK.fresh(t0); const later = t0 + 60 * D;
    expect(OK.plant(S, later)).toBe(3); expect(OK.fit(S, later)).toBe(2);
    expect(OK.moder(S, later)).toBe(5); expect(OK.tower(S, later)).toBe(0);
  });
});

describe('Rast am Lagerfeuer', () => {
  it('wird nicht bestraft: Zustände nach 14 Tagen Rast wie vor der Rast', () => {
    const t0 = T('2026-11-01T12:00:00'); const S = OK.fresh(t0 - 2 * D);
    OK.logEntry(S, 'piano', 20, t0 - D);
    const a = t0, b = t0 + 14 * D;
    const vor = [OK.moder(S, a), OK.plant(S, a), OK.fit(S, a), OK.tower(S, a)];
    OK.toggleRest(S, a);
    expect([OK.moder(S, b), OK.plant(S, b), OK.fit(S, b), OK.tower(S, b)]).toEqual(vor);
    OK.toggleRest(S, b);
    expect([OK.moder(S, b), OK.plant(S, b), OK.fit(S, b), OK.tower(S, b)]).toEqual(vor);
  });
  it('während der Rast keine Einträge und kein Ansturm', () => {
    const S = OK.fresh(T('2026-11-01T12:00:00')); S.lastRaid = T('2026-11-08T20:00:00');
    OK.toggleRest(S, T('2026-11-10T12:00:00'));
    expect(OK.logEntry(S, 'gym', 1, NOW).err).toBe('rest');
    expect(OK.resolveRaids(S, T('2026-11-30T12:00:00'), rng(0.9)).n).toBe(0);
    expect(S.wall.dmg).toBe(0);
  });
  it('Ansturm ist eingefroren: nach kurzer Rast über den Sonntag kommt der Ansturm nicht sofort', () => {
    const S = OK.fresh(T('2026-11-01T12:00:00')); S.lastRaid = T('2026-11-08T20:00:00');
    OK.toggleRest(S, T('2026-11-14T10:00:00')); // Samstag, noch 1 Tag 10 Stunden bis zum Ansturm
    OK.toggleRest(S, T('2026-11-16T10:00:00')); // Montag
    expect(OK.resolveRaids(S, T('2026-11-16T10:00:00'), rng(0.9)).n).toBe(0);
    expect(OK.nextRaid(S.lastRaid)).toBeGreaterThan(T('2026-11-16T10:00:00'));
  });
  it('Rast über eine ganze Woche: kein Ansturm, danach nächster Sonntag', () => {
    const S = OK.fresh(T('2026-11-01T12:00:00')); S.lastRaid = T('2026-11-08T20:00:00');
    OK.toggleRest(S, T('2026-11-11T12:00:00')); OK.toggleRest(S, T('2026-11-18T12:00:00'));
    expect(OK.resolveRaids(S, NOW, rng(0.9)).n).toBe(0);
    expect(OK.nextRaid(S.lastRaid)).toBe(T('2026-11-22T20:00:00'));
  });
  it('Missbrauch: kurze Rast über Sonntag 20 Uhr umgeht den Ansturm nicht', () => {
    const S = OK.fresh(T('2026-11-01T12:00:00')); S.lastRaid = T('2026-11-08T20:00:00');
    OK.toggleRest(S, T('2026-11-15T19:59:00')); OK.toggleRest(S, T('2026-11-15T20:01:00'));
    // Eingefroren: Der Ansturm kommt um die Rastdauer (2 Minuten) später, er entfällt nicht.
    expect(OK.resolveRaids(S, T('2026-11-15T20:01:00'), rng(0.9)).n).toBe(0);
    expect(OK.resolveRaids(S, T('2026-11-15T20:03:00'), rng(0.9)).n).toBe(1);
  });
  it('Missbrauch: Rast an und aus setzt keinen Verfall zurück', () => {
    const t0 = T('2026-11-01T12:00:00'); const S = OK.fresh(t0);
    const vor = OK.plant(S, t0 + 8 * D);
    OK.toggleRest(S, t0 + 8 * D); OK.toggleRest(S, t0 + 8 * D + 1000);
    expect(OK.plant(S, t0 + 8 * D + 1000)).toBe(vor);
  });
  it('Zurücknehmen nach einer Rast setzt den Zeitstempel der Routine zurück', () => {
    const S = OK.fresh(T('2026-11-01T12:00:00'));
    OK.logEntry(S, 'run', 5, T('2026-11-05T07:00:00'));
    const t = T('2026-11-10T07:00:00'); OK.logEntry(S, 'run', 5, t);
    OK.toggleRest(S, T('2026-11-12T12:00:00')); OK.toggleRest(S, T('2026-11-14T12:00:00'));
    expect(OK.undoEntry(S, t)).toBe(true);
    // Der zurückgenommene Lauf darf den Helden nicht weiter kräftig halten.
    expect(S.last.run).toBeLessThan(t);
  });
});

describe('Ansturm der Horde', () => {
  it('nächster Ansturm Sonntag 20 Uhr, strikt danach', () => {
    expect(OK.nextRaid(NOW)).toBe(T('2026-11-22T20:00:00'));
    expect(OK.nextRaid(T('2026-11-22T19:59:59.999'))).toBe(T('2026-11-22T20:00:00'));
    expect(OK.nextRaid(T('2026-11-22T20:00:00'))).toBe(T('2026-11-29T20:00:00'));
  });
  it.each([
    ['2026-03-22T20:00:00', '2026-03-29T20:00:00'],
    ['2026-10-18T20:00:00', '2026-10-25T20:00:00'],
    ['2027-03-21T20:00:00', '2027-03-28T20:00:00'],
    ['2026-03-29T01:00:00', '2026-03-29T20:00:00'],
    ['2026-10-25T02:30:00', '2026-10-25T20:00:00'],
  ])('Sommer/Winterzeit: nach %s kommt %s', (a, b) => {
    expect(OK.nextRaid(T(a))).toBe(T(b));
    expect(new Date(OK.nextRaid(T(a))).getHours()).toBe(20);
  });
  it('Ansturm genau um 20:00 wird ausgelöst, eine Millisekunde davor nicht', () => {
    const S = OK.fresh(T('2026-03-15T12:00:00')); S.lastRaid = T('2026-03-22T20:00:00');
    expect(OK.resolveRaids(S, T('2026-03-29T19:59:59.999'), rng(0.9)).n).toBe(0);
    const r = OK.resolveRaids(S, T('2026-03-29T20:00:00'), rng(0.9));
    expect(r.n).toBe(1); expect(S.raids[0].t).toBe(T('2026-03-29T20:00:00'));
  });
  it('Angriff = min(150, 40 + 2 mal bisherige Anstürme)', () => {
    const S = OK.fresh(NOW);
    expect([0, 10, 55, 100].map((n) => { S.raidN = n; return OK.raidAtk(S); })).toEqual([40, 60, 150, 150]);
  });
  it('Verteidigung = Burgstufe*10 + Einträge*4 - Moder*5 - Schaden*5 + Ausrüstung', () => {
    const S = OK.fresh(T('2026-11-10T12:00:00'));
    S.lastRaid = T('2026-11-15T20:00:00'); S.wall = { lvl: 3, dmg: 1 }; S.inv = ['wolfsfell'];
    OK.logEntry(S, 'gym', 1, T('2026-11-16T18:00:00'));
    OK.logEntry(S, 'run', 5, T('2026-11-17T07:00:00'));
    putzAlle(S, T('2026-11-17T12:00:00')); S.last.kueche = T('2026-11-10T12:00:00'); // 1 Moder
    const d = OK.defNow(S, NOW);
    expect(d.nr).toBe(T('2026-11-22T20:00:00'));
    expect([d.n, d.m, d.eq]).toEqual([2, 1, 1]);
    expect(d.def).toBe(30 + 8 - 5 - 5 + 1);
    expect(d.atk).toBe(40);
  });
  it('Sieg: +20 Gold, Niederlage: Mauerschaden +1', () => {
    const S = OK.fresh(T('2026-11-10T12:00:00')); S.lastRaid = T('2026-11-08T20:00:00');
    S.wall.lvl = 8; putzAlle(S, T('2026-11-15T12:00:00'));
    OK.resolveRaids(S, T('2026-11-15T21:00:00'), rng(0.9));
    expect(S.gold).toBe(45); expect(S.wall.dmg).toBe(0);
    S.wall.lvl = 1; OK.resolveRaids(S, T('2026-11-22T21:00:00'), rng(0.9));
    expect(S.gold).toBe(45); expect(S.wall.dmg).toBe(1);
  });
  it('Sieg: Beute mit 35 % Wahrscheinlichkeit', () => {
    const mk = () => { const S = OK.fresh(T('2026-11-10T12:00:00')); S.lastRaid = T('2026-11-08T20:00:00'); S.wall.lvl = 8; putzAlle(S, T('2026-11-15T12:00:00')); return S; };
    let S = mk(); let r = OK.resolveRaids(S, T('2026-11-15T21:00:00'), rng(0.34));
    expect(r.last.loot.items).toHaveLength(1);
    S = mk(); r = OK.resolveRaids(S, T('2026-11-15T21:00:00'), rng(0.35));
    expect(r.last.loot.items).toHaveLength(0); expect(S.inv).toHaveLength(0);
  });
  it('Doppelte Funde werden zu Gold', () => {
    const S = OK.fresh(NOW); S.inv = Object.keys(OK.ITEMS);
    const e = OK.lootRoll(S, 'raid', NOW, rng(0.2));
    expect(e.items).toHaveLength(0); expect(e.gold).toBeGreaterThan(0);
    expect(S.inv).toHaveLength(Object.keys(OK.ITEMS).length);
  });
  it('Sommerzeit: ein Eintrag wird nicht in zwei Anstürmen gezählt (22.3./29.3.2026)', () => {
    const S = OK.fresh(T('2026-03-01T12:00:00')); S.wall.lvl = 8; S.lastRaid = T('2026-03-15T20:00:00');
    OK.logEntry(S, 'gym', 1, T('2026-03-22T19:30:00')); // vor dem Ansturm vom 22.3.
    putzAlle(S, T('2026-03-29T12:00:00'));
    OK.resolveRaids(S, T('2026-03-29T21:00:00'), rng(0.9));
    expect(S.raids).toHaveLength(2);
    expect(S.raids[0].def).toBe(84);
    expect(S.raids[1].def).toBe(80); // Eintrag gehört nur zum ersten Ansturm
  });
  it('Winterzeit: ein Eintrag kurz nach dem Ansturm zählt für den nächsten (18.10./25.10.2026)', () => {
    const S = OK.fresh(T('2026-10-01T12:00:00')); S.wall.lvl = 8; S.lastRaid = T('2026-10-18T20:00:00');
    OK.logEntry(S, 'gym', 1, T('2026-10-18T20:30:00'));
    putzAlle(S, T('2026-10-25T12:00:00'));
    OK.resolveRaids(S, T('2026-10-25T21:00:00'), rng(0.9));
    expect(S.raids).toHaveLength(1);
    expect(S.raids[0].def).toBe(84);
  });
  it('Verpasste Sonntage: höchstens 8 nachgerechnet, Schaden höchstens 5, danach regulär weiter', () => {
    const S = OK.fresh(T('2026-09-01T12:00:00')); S.lastRaid = T('2026-09-06T20:00:00');
    const r = OK.resolveRaids(S, NOW, rng(0.9)); // 10 Sonntage verpasst
    expect(r.n).toBe(8); expect(S.raidN).toBe(8);
    expect(S.wall.dmg).toBe(5);
    expect(OK.nextRaid(S.lastRaid)).toBe(T('2026-11-22T20:00:00'));
    expect(OK.resolveRaids(S, NOW, rng(0.9)).n).toBe(0);
  });
  it('Burgschaden: Reparatur 15 Gold pro Punkt, nie negativ, Gold nie negativ', () => {
    const S = OK.fresh(NOW); S.wall.dmg = 2; S.gold = 20;
    expect(OK.repairWall(S)).toBe(true); expect(S.wall.dmg).toBe(1); expect(S.gold).toBe(5);
    expect(OK.repairWall(S)).toBe(false); expect(S.wall.dmg).toBe(1); expect(S.gold).toBe(5);
    S.gold = 100; OK.repairWall(S);
    expect(OK.repairWall(S)).toBe(false); expect(S.wall.dmg).toBe(0); expect(S.gold).toBe(85);
  });
  it('Solange Schaden besteht, kein Burgausbau', () => {
    const S = OK.fresh(NOW); S.gold = 5000; S.xp.aus = 100000; S.wall.dmg = 1;
    expect(OK.upOk(S, 'burg')).toBe(false); expect(OK.upBuy(S, 'burg')).toBeNull();
    S.wall.dmg = 0; expect(OK.upOk(S, 'burg')).toBe(true);
  });
});

describe('Ausbau und Gold (Mauerstein)', () => {
  it('Burg: 8 Stufen, Preise 100 bis 1000, Voraussetzung Charakterstufe', () => {
    const S = OK.fresh(NOW);
    const n = OK.upNext(S, 'burg'); expect(n.p).toBe(100); expect(n.sk).toBeNull();
    S.wall.lvl = 7; expect(OK.upNext(S, 'burg').p).toBe(1000);
    S.wall.lvl = 8; expect(OK.upNext(S, 'burg')).toBeNull();
  });
  it('Burgausbau braucht Charakterstufe und Gold, Gold wird abgezogen', () => {
    const S = OK.fresh(NOW); S.gold = 100;
    expect(OK.upOk(S, 'burg')).toBe(false); // Charakterstufe 1 < 2
    S.xp.aus = 150; expect(OK.upBuy(S, 'burg').p).toBe(100);
    expect(S.wall.lvl).toBe(2); expect(S.gold).toBe(0);
    expect(OK.upBuy(S, 'burg')).toBeNull(); expect(S.gold).toBe(0);
  });
  it('Räume: 8 Ausbauten, Preise 30 bis 360, danach Ende', () => {
    const S = OK.fresh(NOW);
    const p = []; for (let i = 0; i < 8; i++) { S.up.halle = i; p.push(OK.upNext(S, 'halle').p); }
    expect(p[0]).toBe(30); expect(p[7]).toBe(360);
    expect(p.every((v, i) => i === 0 || v > p[i - 1])).toBe(true);
    S.up.halle = 8; expect(OK.upNext(S, 'halle')).toBeNull();
  });
  it('Voraussetzung: Fertigkeit des Raums bzw. Charakterstufe für Thronsaal und Innenhof', () => {
    const S = OK.fresh(NOW);
    expect(OK.upNext(S, 'halle').sk).toBe('hau'); expect(OK.upNext(S, 'turm').sk).toBe('kla');
    expect(OK.upNext(S, 'bib').sk).toBe('wis'); expect(OK.upNext(S, 'garten').sk).toBe('kra');
    expect(OK.upNext(S, 'thron').sk).toBeNull(); expect(OK.upNext(S, 'hof').sk).toBeNull();
  });
  it('Holz 1 bis 2 ohne Burgbedingung, Stein 3 bis 5 Burgstufe 4, Prunk 6 bis 8 Burgstufe 7', () => {
    const S = OK.fresh(NOW);
    const bq = []; for (let i = 0; i < 8; i++) { S.up.garten = i; bq.push(OK.upNext(S, 'garten').bq); }
    expect(bq).toEqual([1, 1, 4, 4, 4, 7, 7, 7]);
    S.up.garten = 5; S.gold = 9999; S.xp.kra = 100000; S.wall.lvl = 6;
    expect(OK.upOk(S, 'garten')).toBe(false);
    S.wall.lvl = 7; expect(OK.upOk(S, 'garten')).toBe(true);
  });
  it('Alter Mauerstein wird 1 zu 5 in Gold umgerechnet', () => {
    const o = { xp: { aus: 0, sta: 0, kla: 0, hau: 0, kra: 0, wis: 0 }, last: {}, stones: 20, raids: [{}, {}], buff: true };
    const S = OK.migrate(o, NOW);
    expect(S.gold).toBe(100); expect(S.raidN).toBe(2);
    expect(S.buff).toBe(false); expect(S.buffUntil).toBe(NOW + D);
  });
});

describe('Tränke', () => {
  it('Brauen 40 Gold, mit Kräuterkunde billiger, nie unter 15; nicht ohne Gold', () => {
    const S = OK.fresh(NOW); S.gold = 39;
    expect(OK.potPrice(S)).toBe(40); expect(OK.buyPotion(S)).toBe(0); expect(S.gold).toBe(39);
    S.gold = 40; expect(OK.buyPotion(S)).toBe(40); expect(S.gold).toBe(0); expect(S.potions).toBe(1);
    S.xp.kra = 30; expect(OK.potPrice(S)).toBeLessThan(40);
    S.xp.kra = 1e7; expect(OK.potPrice(S)).toBe(15);
  });
  it('Trank wirkt genau 24 Stunden, nicht doppelt trinkbar', () => {
    const S = OK.fresh(NOW); S.potions = 2;
    expect(OK.drinkPotion(S, NOW)).toBe(true);
    expect(OK.drinkPotion(S, NOW + H)).toBe(false); expect(S.potions).toBe(1);
    expect(OK.buffOn(S, NOW + 24 * H - 1)).toBe(true);
    expect(OK.buffOn(S, NOW + 24 * H)).toBe(false);
  });
});

describe('Eroberungen', () => {
  const mk = (target = 10) => { const S = OK.fresh(T('2026-11-01T12:00:00')); S.bosses = []; OK.addBoss(S, { name: 'Testfeste', area: 'run', date: '2026-11-30', target }, T('2026-11-01T12:00:00')); return S; };
  it('Anlegen nur mit Name, Datum und Zielwert > 0', () => {
    const S = OK.fresh(NOW);
    expect(OK.addBoss(S, { name: '', date: '2027-01-01', target: 5, area: 'run' }, NOW)).toBeNull();
    expect(OK.addBoss(S, { name: 'A', date: '', target: 5, area: 'run' }, NOW)).toBeNull();
    expect(OK.addBoss(S, { name: 'A', date: '2027-01-01', target: 0, area: 'run' }, NOW)).toBeNull();
    expect(OK.addBoss(S, { name: 'A', date: '2027-01-01', target: -3, area: 'run' }, NOW)).toBeNull();
    expect(S.bosses).toHaveLength(1);
  });
  it('Passende Einträge zählen automatisch, andere nicht', () => {
    const S = mk();
    OK.logEntry(S, 'run', 4, T('2026-11-02T07:00:00'));
    OK.logEntry(S, 'gym', 1, T('2026-11-02T18:00:00'));
    expect(S.bosses[0].dmg).toBe(4);
  });
  it('Abschliessen erst am Tag des Zeitlimits (Regel in logic.js)', () => {
    const S = mk(); S.bosses[0].dmg = 50; const g = S.gold;
    expect(OK.bossReady(S.bosses[0], T('2026-11-29T23:59:59'))).toBe(false);
    expect(OK.bossReady(S.bosses[0], T('2026-11-30T00:00:00'))).toBe(true);
    expect(OK.finishBoss(S, S.bosses[0].id, T('2026-11-29T12:00:00'), rng(0.5))).toBeNull();
    expect(S.bosses[0].done).toBe(false); expect(S.gold).toBe(g);
  });
  it('Sieg genau am Zielwert: erobert, 150 Gold, Ausrüstungsstück und Trophäe', () => {
    const S = mk(10); S.bosses[0].dmg = 10; const g = S.gold;
    const r = OK.finishBoss(S, S.bosses[0].id, T('2026-11-30T12:00:00'), rng(0.5));
    expect(r.won).toBe(true); expect(S.bosses[0].won).toBe(true);
    expect(S.gold).toBe(g + 150);
    const sl = r.loot.items.map((id) => OK.ITEMS[id].sl);
    expect(sl).toContain('trophae'); expect(r.loot.items).toHaveLength(2);
  });
  it('Eroberungsbeute: das Ausrüstungsstück ist selten oder episch und eine Waffe, Rüstung oder Talisman', () => {
    const S = mk(10); S.bosses[0].dmg = 10;
    const r = OK.finishBoss(S, S.bosses[0].id, T('2026-11-30T12:00:00'), rng(0.99));
    const it0 = OK.ITEMS[r.loot.items[0]];
    expect(it0.r).toBeGreaterThanOrEqual(1);
    expect(['waffe', 'ruestung', 'talisman']).toContain(it0.sl);
  });
  it('Knapp verfehlt: gescheitert, keine Belohnung; zweites Abschliessen tut nichts', () => {
    const S = mk(10); S.bosses[0].dmg = 9.9; const g = S.gold;
    const r = OK.finishBoss(S, S.bosses[0].id, T('2026-11-30T12:00:00'), rng(0.5));
    expect(r.won).toBe(false); expect(r.loot).toBeNull(); expect(S.gold).toBe(g); expect(S.inv).toHaveLength(0);
    expect(OK.finishBoss(S, S.bosses[0].id, T('2026-11-30T13:00:00'), rng(0.5))).toBeNull();
  });
  it('Einträge nach Ablauf des Zeitlimits zählen nicht mehr', () => {
    const S = mk(10);
    OK.logEntry(S, 'run', 5, T('2026-11-30T23:59:00'));
    OK.logEntry(S, 'run', 5, T('2026-12-01T00:01:00'));
    expect(S.bosses[0].dmg).toBe(5);
  });
  it('Gelaufene km vor dem Anlegen zählen nicht', () => {
    const S = OK.fresh(T('2026-11-01T12:00:00')); S.bosses = [];
    OK.logEntry(S, 'run', 5, T('2026-11-02T07:00:00'));
    OK.addBoss(S, { name: 'X', area: 'run', date: '2026-12-31', target: 10 }, T('2026-11-03T07:00:00'));
    expect(S.bosses[0].dmg).toBe(0);
  });
});

describe('Zurücknehmen', () => {
  it('stellt Ruhm, Gold, Zeitstempel, Buch und Eroberungsfortschritt wieder her', () => {
    const S = OK.fresh(T('2026-11-01T12:00:00')); const pl = S.last.run;
    OK.logEntry(S, 'run', 5, NOW);
    expect(OK.undoLast(S, NOW + H)).toBe(true);
    expect(S.xp.aus).toBe(0); expect(S.gold).toBe(25); expect(S.last.run).toBe(pl); expect(S.bosses[0].dmg).toBe(0);
    OK.logEntry(S, 'book', 1, NOW, 'Titel');
    OK.undoLast(S, NOW); expect(S.books).toHaveLength(0); expect(S.xp.wis).toBe(0);
  });
  it('nach Rücknahme gibt ein neuer Eintrag am selben Tag wieder vollen Ruhm', () => {
    const S = OK.fresh(T('2026-11-01T12:00:00'));
    OK.logEntry(S, 'gym', 1, NOW); OK.undoLast(S, NOW);
    expect(OK.logEntry(S, 'gym', 1, NOW + H).x).toBe(50);
  });
});

describe('Missbrauch von Mehrfacheinträgen', () => {
  it('ein zweites Kampftraining am selben Tag stärkt die Verteidigung nicht', () => {
    const S = OK.fresh(T('2026-11-10T12:00:00')); S.lastRaid = T('2026-11-15T20:00:00');
    putzAlle(S, NOW);
    OK.logEntry(S, 'gym', 1, NOW);
    const d1 = OK.defNow(S, NOW).def;
    for (let i = 1; i <= 10; i++) OK.logEntry(S, 'gym', 1, NOW + i * 60000);
    expect(OK.defNow(S, NOW + H).def).toBe(d1); // "einmal pro Tag"
  });
  it('ein zweites Kampftraining am selben Tag zählt nicht für eine Kampf-Eroberung', () => {
    const S = OK.fresh(T('2026-11-10T12:00:00')); S.bosses = [];
    OK.addBoss(S, { name: 'G', area: 'gym', date: '2026-12-31', target: 12 }, T('2026-11-10T12:00:00'));
    for (let i = 0; i < 12; i++) OK.logEntry(S, 'gym', 1, NOW + i * 60000);
    expect(S.bosses[0].dmg).toBe(1);
  });
});

describe('Spielstand', () => {
  it('Erster Start: leerer, gültiger Spielstand', () => {
    const S = OK.migrate(null, NOW);
    expect(S.log).toEqual([]); expect(S.wall).toEqual({ lvl: 1, dmg: 0 });
    expect(S.gold).toBe(25); expect(S.runGoal).toBe(50); expect(S.rest).toBe(0);
    expect([OK.moder(S, NOW), OK.plant(S, NOW), OK.fit(S, NOW)]).toEqual([0, 0, 0]);
    expect(OK.charLvlOf(S.xp)).toBe(1);
    expect(OK.nextRaid(S.lastRaid)).toBe(T('2026-11-22T20:00:00'));
  });
  it('übersteht Neuladen (JSON hin und zurück, migrate)', () => {
    const S = OK.preset('normal', NOW);
    const S2 = OK.migrate(JSON.parse(JSON.stringify(S)), NOW + H);
    expect(S2).toEqual(JSON.parse(JSON.stringify(S)));
    const f = (X) => [OK.moder(X, NOW), OK.plant(X, NOW), OK.fit(X, NOW), OK.tower(X, NOW), OK.defNow(X, NOW).def, OK.monthKm(X, NOW)];
    expect(f(S2)).toEqual(f(S));
  });
  it('migrate überschreibt vorhandene Werte nicht und ergänzt fehlende Felder', () => {
    const S = OK.migrate({ gold: 500, xp: { aus: 90 }, last: { run: NOW - D } }, NOW);
    expect(S.gold).toBe(500); expect(S.xp.aus).toBe(90); expect(S.xp.wis).toBe(0);
    expect(S.last.run).toBe(NOW - D); expect(S.last.kueche).toBe(NOW);
    expect(S.bosses).toHaveLength(1); expect(S.equip).toEqual({ waffe: '', ruestung: '', talisman: '' });
  });
  it.each([undefined, null, 'Unsinn', 42, true, []])('migrate(%s) liefert gültigen Spielstand', (o) => {
    const S = OK.migrate(o, NOW);
    expect(() => OK.logEntry(S, 'run', 5, NOW)).not.toThrow();
    expect(S.wall.lvl).toBe(1);
  });
  it.each(['xp', 'last', 'wall', 'up', 'equip', 'look', 'log', 'bosses', 'inv', 'raids', 'books'])('beschädigtes Feld %s = null führt nicht zum Absturz', (k) => {
    const o = JSON.parse(JSON.stringify(OK.fresh(NOW - 10 * D))); o[k] = null;
    expect(() => {
      const S = OK.migrate(o, NOW);
      OK.logEntry(S, 'run', 5, NOW); OK.logEntry(S, 'book', 1, NOW, 'b');
      OK.moder(S, NOW); OK.plant(S, NOW); OK.fit(S, NOW); OK.happy(S, NOW);
      OK.defNow(S, NOW); OK.resolveRaids(S, NOW + 7 * D, rng(0.5)); OK.monthKm(S, NOW);
      OK.upOk(S, 'burg'); OK.upOk(S, 'thron'); OK.trim(S);
    }).not.toThrow();
  });
  it('beschädigtes Feld wall als Text führt nicht zum Absturz', () => {
    const o = JSON.parse(JSON.stringify(OK.fresh(NOW))); o.wall = 'kaputt';
    expect(() => OK.migrate(o, NOW)).not.toThrow();
  });
  it('Zahlen als Text (gold: "100") werden nicht zu Textverkettung', () => {
    const o = JSON.parse(JSON.stringify(OK.fresh(NOW - D))); o.gold = '100';
    const S = OK.migrate(o, NOW); OK.logEntry(S, 'gym', 1, NOW);
    expect(S.gold).toBe(110);
  });
  it('Verlauf wird auf 400 Einträge gekürzt, Anstürme auf 12', () => {
    const S = OK.fresh(NOW); S.log = Array.from({ length: 450 }, (_, i) => ({ t: i })); S.raids = Array.from({ length: 20 }, (_, i) => ({ t: i }));
    OK.trim(S); expect(S.log).toHaveLength(400); expect(S.log[0].t).toBe(50); expect(S.raids).toHaveLength(12);
  });
});

describe('Korrekturen nach dem ersten Testlauf', () => {
  it('Rast verschiebt den Ansturm um die Rastdauer', () => {
    const S = OK.fresh(T('2026-11-01T12:00:00')); S.lastRaid = T('2026-11-08T20:00:00');
    OK.toggleRest(S, T('2026-11-14T10:00:00')); OK.toggleRest(S, T('2026-11-16T10:00:00'));
    expect(OK.raidDue(S)).toBe(T('2026-11-17T20:00:00'));
    expect(OK.resolveRaids(S, T('2026-11-17T20:01:00'), rng(0.9)).n).toBe(1);
    expect(OK.raidDue(S)).toBe(T('2026-11-22T20:00:00')); // danach wieder sonntags
  });
  it('Spielstand mit kaputten Feldern wird repariert, bekannte Werte bleiben', () => {
    const o = JSON.parse(JSON.stringify(OK.fresh(NOW - 10 * D)));
    o.gold = 321; o.xp = null; o.wall = 'kaputt'; o.log = [null, { t: NOW, k: 'run', a: '5', x: 60, g: 12 }, { k: 'unsinn' }];
    const S = OK.migrate(o, NOW);
    expect(S.gold).toBe(321);
    expect(S.xp.aus).toBe(0); expect(S.wall.lvl).toBe(1);
    expect(S.log).toHaveLength(1); expect(S.log[0].a).toBe(5);
  });
  it('Titel Eroberer nur nach gewonnener Eroberung', () => {
    const S = OK.fresh(NOW); S.bosses = [{ id: 'x', done: true, won: false, date: '2026-01-01', dmg: 0, target: 1 }];
    expect(OK.bossWon(S)).toBe(false);
    S.bosses[0].won = true; expect(OK.bossWon(S)).toBe(true);
  });
});
