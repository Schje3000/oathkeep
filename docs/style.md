# Oathkeep Styleguide

Stand: 17. November 2026, abgeglichen mit der App. Massgebend für Gestaltung und Sprache.

## Grundidee

Oathkeep ist ein Pixel-Art-Fantasy-Spiel für das Handy (iPhone, Hochformat). Der
Spieler hält seine Routinen und trainiert damit seinen Helden und seine Burg.
Spielzeit 3 bis 5 Minuten pro Tag. Nur ein Spieler.

## Grafik

- Pixel-Art im Fantasy-Stil: Ritter, Burgen, Ruinen, sonniger grüner Wald.
  Ruhig und einladend, nicht düster.
- Perspektive: Seitenansicht (Sidescroller). Jeder Ort ist pro Ausbaustufe ein
  Hochformatbild (360 × 512) von der Seite, mit einer klaren waagrechten
  Bodenlinie knapp über der Holzleiste. Oben nur Decke oder Himmel.
- Held und Bewohner sind Sprites in Seitenansicht. Sie laufen nur nach links
  und rechts auf der Bodenlinie, Westen ist gespiegelter Osten. In Ruhe
  schauen sie zum Betrachter oder zur Seite. Figuren und Möbel haben den
  gleichen Massstab.
- Die Weltkarte ist die einzige Ausnahme: eine Pergamentkarte von oben.
- Grafiken aus PixelLab, detailliert gepixelt (Held und Burg).
- Pixel immer scharf skaliert, nie verwischt (`image-rendering: pixelated`).
- Jeder Bereich hat ein eigenes animiertes Bild mit sichtbarer Stufe.
- Der Stil der Räume folgt der Burgstufe: Stufe 1 bis 3 Holz, 4 bis 6 Stein,
  7 bis 8 Prunk (Marmor).

## UI

- Bildschirmfüllende Szenen, UI liegt darüber.
- Oben (HUD): Logo, Gold und Held-Knopf mit kleinem Heldensymbol und
  Charakterstufe. In Räumen links der Knopf «Burg» zum Zurückgehen, daneben
  Raumname und Ausbaustufe (zum Beispiel 3/8).
- Unten eine scrollbare Holzleiste (Bottom Sheet).
- Modern in der Bedienung, mittelalterlich in der Optik.
- Holz-Stil: dunkles Holz mit hellerem Holzrahmen, grüne glänzende
  Hauptknöpfe, Holzknöpfe für Nebenaktionen, segmentierte grüne Balken in
  Holzfassung.
- Symbole als kleine Pixel-Grafiken (`assets/raum/u_*`).
- Touch-Ziele mindestens 44 × 44 Pixel, echte `button`-Elemente.
- Safe Areas (Notch, Home-Leiste) bleiben frei.

### Schrift

- «VT323» (Google Fonts) für Titel, Knöpfe und Zahlen.
- Systemschrift für Erklärtexte.

### Farben

| Zweck | Variable | Wert |
|---|---|---|
| Holz dunkel | `--w1` | #3b2414 |
| Holz | `--w2` | #4d2f1a |
| Holz hell (Rahmen) | `--w3` | #6e4526 |
| Holz Kante | `--w4` | #9a6638 |
| Holz Schatten | `--wd` | #1e1108 |
| Grün hell | `--g1` | #9be06a |
| Grün | `--g2` | #62b440 |
| Grün dunkel | `--g3` | #3c7f2a |
| Text | `--text` | #f6ead0 |
| Text gedämpft | `--mut` | #cdb48c |
| Gold | `--gold` | #f0cf6a |
| Gut | `--green` | #a4e070 |
| Warnung | `--red` | #ff9d80 |

## Aufbau

- **Startbildschirm:** Aussenansicht der Burg ohne Figuren. Rechts der Knopf
  «Weltkarte» mit Countdown zum Ansturm der Horde. In der Leiste: Mauerschaden
  mit Reparatur (falls vorhanden), Burgausbau mit Gold als Fortschrittsbalken
  und sechs Raumkacheln (Garten, Innenraum, Zauberturm, Thronsaal, Innenhof,
  Bibliothek) mit ihrem Zustand. Kein Inventar, kein Verlauf.
- **Thronsaal:** Held, Ausrüstung, Trophäen. Reiter für Kampftraining und
  Ausdauertraining mit Zurücknehmen der letzten Einträge.
- **Burggarten:** Pflanzen in vier Zuständen (frisch, welk, verdorrt,
  verrottet), Tränke brauen und trinken.
- **Innenraum:** Moder, wenn nicht geputzt. Putzaufgaben mit Fälligkeit.
- **Innenhof:** Bewohner, zufrieden wenn alles läuft.
- **Zauberturm (innen):** leuchtet, glimmt oder ist erloschen, je nach
  Klang-Magie.
- **Bibliothek:** wächst alle 3 gelesenen Bücher, höchstens Stufe 5.
- **Jeder Raum:** 8 Ausbauten, bezahlt mit Gold.
- **Weltkarte:** Reiter «Ansturm» (wöchentlich, Bereitschaft mit
  Aufschlüsselung) und Reiter «Eroberungen» (mit Fortschrittsbalken und
  Zeitlimit). Aktive Eroberung als Fahne, erobert als Dorf.
- **Heldenseite:** Vorschau des Helden in seiner Rüstung, Ausrüstung anlegen,
  Verlauf, Rast am Lagerfeuer, Fertigkeiten, Monatsziel, Sicherung. Keine freie
  Farbwahl: Das Aussehen ändert sich über die Rüstung (Tunika, Leder,
  Kettenhemd, Platte, Gold).

Routinen werden im jeweiligen Bereich eingetragen.

## Zustände des Helden

- Kräftig: aufrecht, Schwert erhoben.
- Müde: Kopf gesenkt, Schwert gesenkt.
- Geschwächt: dünn, gebeugt, Kopf unten, Schwert am Boden nachgezogen.

## Sprache

Hochdeutsch, Anrede mit «du», mittelalterlich und knapp. Echte Umlaute, nie
Eszett (immer «ss»), keine Gedankenstriche.

| Statt              | Verwenden             |
|--------------------|-----------------------|
| Sport              | Training              |
| Piano              | Klang-Magie           |
| Joggen             | Ausdauertraining      |
| Gym / Boxen        | Kampftraining         |
| Pflanzen giessen   | Garten bewässern      |
| Putzen             | Burgküche schrubben, Waschraum scheuern, Halle fegen, Gemächer entstauben |
| Bettwäsche         | Lager frisch beziehen |
| Wäsche             | Gewänder waschen      |
| Lesen              | Schriften studieren   |
| Ruhetag            | Rast am Lagerfeuer    |
| Wochenangriff      | Ansturm der Horde     |
| Punkte / XP        | Ruhm                  |
| Währung, Mauerstein | Gold                 |
| Bosse              | Eroberungen           |
| Level              | Stufe                 |
| Level up           | Stufe erreicht        |
| Inventar           | Ausrüstung, Beute     |
