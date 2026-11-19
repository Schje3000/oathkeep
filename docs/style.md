# Oathkeep Styleguide

Stand: 17. November 2026, abgeglichen mit der App. Massgebend für Gestaltung und Sprache.

## Grundidee

Oathkeep ist ein Pixel-Art-Fantasy-Spiel für das Handy (iPhone, Hochformat). Der
Spieler hält seine Routinen und trainiert damit seinen Helden und seine Burg.
Spielzeit 3 bis 5 Minuten pro Tag. Nur ein Spieler.

## Grafik

- Pixel-Art im Fantasy-Stil: Ritter, Burgen, Ruinen, sonniger grüner Wald.
  Ruhig und einladend, nicht düster.
- Perspektive: Seitenansicht (Sidescroller). Die Räume sind ein Bühnenbaukasten
  (siehe unten). Burg-Aussenansicht und Weltkarte sind von oben.
- Held und Bewohner sind Sprites in Seitenansicht. Sie laufen nur nach links
  und rechts auf der Bodenlinie, Westen ist gespiegelter Osten. In Ruhe
  schauen sie zum Betrachter oder zur Seite. Figuren und Möbel haben den
  gleichen Massstab.
- Grafiken aus PixelLab, detailliert gepixelt (Held und Burg).
- Pixel immer scharf skaliert, nie verwischt (`image-rendering: pixelated`).
- Jeder Bereich hat ein eigenes animiertes Bild mit sichtbarer Stufe.
- Der Stil der Räume folgt der Ausbaustufe des Raums: 0 bis 2 Holz, 3 bis 5
  Stein, 6 bis 8 Prunk. Stein braucht Burgstufe 4, Prunk Burgstufe 7.

## Bühnenbaukasten (Räume)

Verbindlich für alle Innen- und Aussenräume. Ziel: Held, Möbel und Leute
wirken wie aus einem Guss, und der Held läuft nie in ein Objekt.

### Aufbau

1. **Hintergrund** je Raum und Material: ein Bild 360 × 512 mit Decke (oder
   Himmel), Rückwand und Boden aus demselben Material. Die Rückwand ist eine
   flache Fläche über die ganze Breite: keine Seitenwände, keine Ecken, keine
   Säulen, keine Bögen, keine Fenster, keine Möbel, keine Leute.
2. **Bodenlinie:** Alle Bodenobjekte stehen auf derselben Linie (Wandfuss).
   Sie kommt aus dem Code (`KIT.bgF`), nicht aus dem Bild.
3. **Laufweg:** Der Held und die Bewohner laufen auf einem Streifen vor der
   Bodenlinie (`KIT.lane`). Sie werden immer vor den Möbeln gezeichnet.
4. **Objekte** sind einzelne Sprites mit transparentem Hintergrund:
   Bodenobjekte (Möbel, Figuren), Wandobjekte (Bilder, Banner, Fackeln),
   Deckenobjekte (Leuchter mit Schnur). Säulen reichen immer vom Boden bis zur
   Decke.
5. **Ausbau:** Jede Ausbaustufe fügt ein Objekt hinzu oder tauscht eines aus.
   Je Material gibt es zwei feste Wandschmuck-Stücke.
6. **Einrichten:** Jeremie kann Objekte selbst verschieben. Bodenobjekte nur
   waagrecht auf der Bodenlinie, Wandobjekte frei zwischen Boden und Decke.

### Kamera und Zeichnung

- Reine Seitenansicht auf Augenhöhe: keine Draufsicht, keine Schrägsicht,
  keine sichtbare Oberseite von Tischen oder Sockeln. Figuren in Ruhe frontal.
- Licht warm von links oben. Schatten nur als Kontaktschatten unter Figuren.
- Kontur 1 px, einfarbig dunkel. Pixel nie weichgezeichnet.
- Keine Rohre, Schornsteine oder Ansätze, die ins Leere laufen.

### Massstab

1 m = 45 px. Der Held ist 82 px gross (1,80 m).

| Objekt | Höhe |
|---|---|
| Held, erwachsene Bewohner | 76 bis 84 px |
| Kind | 56 px |
| Stuhl | 45 px |
| Tisch | 36 bis 52 px |
| Kamin | 70 bis 75 px |
| Schrank, Regal | 85 bis 130 px |
| Thron | 110 bis 120 px |
| Marktstand, Schmiede | 85 bis 100 px |
| Tür | 100 px |

### Einrichtung und Animation

- Einrichtungsstücke folgen denselben Regeln wie die Möbel: Seitenansicht,
  kein Boden, keine Grasplatte, keine Draufsicht.
- Animiert sind Dinge, die sich von selbst bewegen: Flammen, Pendel, Wasser,
  Tiere, Magie. Schleife aus 8 Bildern, ruhig und klein, nie hektisch.
- Der Zauberturm ist kein Musikzimmer: Alles weist auf Klangmagie hin
  (Orgel, Runen, Kristalle, schwebende Kerzen, Sternbilder).

### PixelLab-Beschreibungen

- Hintergrund: «Empty background for a 2D side-scrolling platformer game, like
  a flat stage backdrop ... the back wall is one single flat surface ... no
  side walls, no corners, no recesses, no arches ... completely empty».
- Bodenobjekt: «a single object, strict side view as in a 2D side-scrolling
  game: seen exactly from the front at eye level, flat, symmetrical, no top
  surface visible, no perspective, standing on the bottom edge of the canvas».
- Wandobjekt: «a single object mounted flat on a wall, strict front view ...
  no wall behind it».
- Figur: «a single character standing still and facing the viewer straight
  on, front view, full body».
- Immer zwei Varianten erzeugen und die flachere wählen. Jedes neue Objekt in
  einer Übersicht neben dem Helden prüfen.

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

### Waldholz-Stil

- Alle Bedienelemente kommen aus einem PixelLab-UI-Satz (`assets/ui/`): warmes Holz mit Ranken, Moos und Goldbeschlägen.
- Hauptknopf: blattgrünes Holz mit Ranken, heller Text mit dunkelgrünem Schatten. Nebenknopf: helles Holz mit Goldecken, dunkler Text. Gesperrt: dunkles Holz, abgedunkelt.
- Reiter: gewählt helles Holz, sonst dunkles Holz. Karten und Kacheln: dunkler Holzrahmen. Holzleiste: Rahmen mit Moos und Ranken an der Oberkante.
- Pixel bleiben scharf: 1 Bildpixel = 1 CSS-Pixel, keine krummen Skalierungen.
- Zurück zur Burg: Pfeil im Knopf «Burg», zusätzlich vom linken Rand nach rechts wischen.

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
| Putzen, Haushalt   | Burgpflege (als Oberbegriff), einzeln: Burgküche schrubben, Waschraum scheuern, Halle fegen, Gemächer entstauben |
| Bettwäsche         | Lager frisch beziehen |
| Wäsche             | Gewänder waschen      |
| Lesen              | Schriften studieren, als Bereich Schriften |
| Laufen, Läufe      | Ausdauertraining      |
| Giessen            | Garten bewässern      |
| Timer, pausieren   | Die Zeit ruht         |
| Fundstücke         | Beutestücke           |
| Ruhetag            | Rast am Lagerfeuer    |
| Wochenangriff      | Ansturm der Horde     |
| Punkte / XP        | Ruhm                  |
| Währung, Mauerstein | Gold                 |
| Bosse              | Eroberungen           |
| Level              | Stufe                 |
| Level up           | Stufe erreicht        |
| Inventar           | Ausrüstung, Beute     |
