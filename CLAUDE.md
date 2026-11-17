# Oathkeep: Projektübergabe für Claude Code

Stand: 17. November 2026. Diese Datei beschreibt das Projekt vollständig. Lies sie ganz, bevor du etwas änderst.

## 1. Worum es geht

Oathkeep ist ein privates Handy-Spiel von Jeremie. Es verwandelt seine Alltagsroutinen in ein Fantasy-Rollenspiel: Training, Piano, Putzen, Pflanzen giessen und Lesen trainieren einen Helden und halten eine Burg instand. Wer Routinen auslässt, sieht es an der Burg (Moder, verdorrte Pflanzen, Mauerschaden) und am Helden (müde, geschwächt).

- Nur für den eigenen Gebrauch, kein Verkauf, keine weiteren Nutzer.
- Zielgerät: iPhone, Hochformat. Die App läuft als Web-App im Browser und soll vom Homescreen startbar sein.
- Eine native iOS-App ist eine Option für später, nicht jetzt.

## 2. Zusammenarbeit mit Jeremie

**Sprache und Schreibregeln (gelten für Antworten und für jeden Text in der App):**

- Hochdeutsch, Anrede mit «du».
- Immer echte Umlaute (ä, ö, ü).
- Nie Eszett, immer «ss» (also «gross», «Strasse»).
- Keine Gedankenstriche, weder Halbgeviertstrich noch Geviertstrich noch «--» als Satzzeichen oder Trenner. Bindestriche in zusammengesetzten Wörtern und Ergänzungsstriche («Miet- und Ersatzpumpen») sind erlaubt.
- Prüfe vor jedem Speichern, dass keine verbotenen Zeichen in `index.html` oder in Texten stehen.

**Arbeitsweise, die er schätzt:**

- Kritisch arbeiten: schwache Ideen und Risiken offen ansprechen, nicht einfach zustimmen. Unsicherheit offen sagen.
- Schnell, präzise, ehrlich, nicht belehrend, nicht übertrieben begeistert.
- Wenn es mehrere gute Wege gibt: die besten zwei oder drei mit kurzer Begründung, keine erschöpfenden Listen.
- Er schickt oft Screenshots vom Handy und Referenzbilder. Nimm sie als genaue Vorgabe.
- Er gibt Änderungen meist knapp und stichwortartig. Setze sie um, frag nur nach, wenn eine Entscheidung wirklich offen ist.
- Er ist Interaction Designer und Grafiker. Gestalterische Qualität ist ihm wichtig.

## 3. Dateien und Links

| Datei oder Link | Inhalt |
| --- | --- |
| `index.html` | Die komplette App (HTML, CSS, JavaScript in einer Datei, rund 90 KB). Einzige externe Abhängigkeit: Schrift «VT323» von Google Fonts. |
| `CLAUDE.md` | Diese Übergabe. |
| App auf claude.ai | https://claude.ai/artifact/8j2noP6KZNuU5AytKtN7yN (Stand von `index.html`, wird von hier aus nicht mehr aktualisiert) |
| Spielkonzept | https://claude.ai/artifact/GdkUbdjrxj6V41rWGGai6m |
| Moodboard | https://claude.ai/artifact/ELHbsQv4igBoEciXbGUeVQ |

Die drei Links sind privat und vermutlich nur für Jeremie im Browser erreichbar. Alles Wesentliche daraus steht in dieser Datei.

## 4. Spielmechanik

### Routinen und Fertigkeiten

| Routine (Name in der App) | Wirklich gemeint | Fertigkeit | Ruhm | Mauerstein | Raum |
| --- | --- | --- | --- | --- | --- |
| Ausdauertraining | Joggen, in km | Ausdauer (`aus`) | 12 pro km, max. 200 pro Tag | 2 | Thronsaal |
| Kampftraining | Gym und Boxen | Stärke (`sta`) | 50, einmal pro Tag | 2 | Thronsaal |
| Übung eintragen | Piano, in Minuten | Klang-Magie (`kla`) | 2 pro Minute, max. 80 pro Tag | 1 | Zauberturm |
| Garten bewässern | Pflanzen giessen | Kräuterkunde (`kra`) | 25, einmal pro Tag | 1 | Burggarten |
| Burgküche schrubben | Küche putzen, alle 7 Tage | Hauswacht (`hau`) | 30 | 2 | Innenraum |
| Waschraum scheuern | Bad putzen, alle 7 Tage | Hauswacht | 30 | 2 | Innenraum |
| Halle fegen | Staubsaugen, alle 7 Tage | Hauswacht | 30 | 2 | Innenraum |
| Gemächer entstauben | Abstauben, alle 7 Tage | Hauswacht | 30 | 2 | Innenraum |
| Lager frisch beziehen | Bettwäsche, alle 21 Tage | Hauswacht | 30 | 2 | Innenraum |
| Gewänder waschen | Wäsche, ohne festen Rhythmus | Hauswacht | 15 | 1 | Innenraum |
| Schriften studieren | Lesen, in Minuten | Wissen (`wis`) | 1 pro Minute, max. 60 pro Tag | 1 | Bibliothek |
| Buch vollendet | Buch fertig gelesen, mit Titel | Wissen | 80 | 3 | Bibliothek |

Putzaufgaben teilen sich ein Tageslimit von 150 Ruhm. «Ruhm» ist die Erfahrung, «Mauerstein» die Währung.

**Ziele des Nutzers:**

- Training: 3 bis 4 Einheiten pro Woche, davon 1 Boxen. Gym und Boxen zählen zusammen als Kampftraining.
- Laufen: Monatsziel in km, frei einstellbar (Standard 50 km), selbst auf die Wochen verteilt.
- Piano: an 5 Tagen pro Woche je mindestens 15 Minuten, täglich wäre ideal.
- Giessen: 2 bis 3 Mal pro Woche, er hat viele Pflanzen.
- Putzen: je 7 Tage, Bettwäsche alle 3 Wochen.

### Stufen

- Stufe einer Fertigkeit: `floor(sqrt(ruhm / 30)) + 1`
- Charakterstufe: Summe aller Fertigkeitsstufen minus Anzahl Fertigkeiten plus 1
- Titel: «Eroberer» nach der ersten abgeschlossenen Eroberung, «Gelehrter» ab Wissen Stufe 3, «Weiser» ab Wissen Stufe 6. Ab Wissen Stufe 3 trägt der Held eine Brille.

### Zustände (Tage seit dem letzten Eintrag)

| Bereich | Zustände |
| --- | --- |
| Held (seit letztem Lauf oder Kampftraining) | unter 4 Tagen kräftig, unter 7 müde, sonst geschwächt |
| Garten (seit letztem Bewässern) | unter 3,5 frisch, unter 6 welk, unter 9 verdorrt, sonst verrottet |
| Zauberturm (seit letzter Übung) | unter 1,5 leuchtet, unter 3,5 glimmt, sonst erloschen |
| Moder | Anzahl überfälliger Putzaufgaben |
| Bewohner | zufrieden, wenn kein Moder, Garten frisch und Mauer ohne Schaden |

Der Held soll sichtbar verfallen: kräftig mit erhobenem Schwert, müde mit gesenktem Kopf, geschwächt dünn und gebeugt, Schwert am Boden nachgezogen. Das ist Jeremie wichtig.

### Mauer

- Stufe 1 bis 5. Ausbau kostet Stufe mal 8 Mauerstein. Ein Fortschrittsbalken zeigt, wie viel bis zum nächsten Ausbau fehlt.
- Schaden 0 bis 5. Reparatur kostet 3 Mauerstein pro Punkt. Solange Schaden besteht, ist kein Ausbau möglich.
- Ausgelassene Routinen beschädigen, zerstören aber nie endgültig. Stufen und Freischaltungen gehen nie verloren.

### Ansturm der Horde (wöchentlich)

- Jeden Sonntag um 20 Uhr.
- Verteidigung = Mauerstufe mal 10 + Einträge der letzten 7 Tage mal 4 - Moder mal 5 - Mauerschaden mal 5
- Angriff = min(65, 25 + Charakterstufe mal 3)
- Sieg: +4 Mauerstein. Niederlage: Mauerschaden +1.
- Verpasste Sonntage werden beim nächsten Öffnen nachgerechnet (höchstens 8).

### Eroberungen (früher «Bosse»)

- Grössere Ziele mit Zeitlimit, vom Nutzer selbst angelegt: Name, Ziel, Bereich, Zeitlimit, Zielwert.
- Bereiche: Ausdauertraining (km), Kampftraining (Einheiten), Piano (Minuten), Haushalt (Aufgaben), Lesen (Bücher).
- Jeder Eintrag im passenden Bereich zählt automatisch als Fortschritt.
- Zwei Balken: Fortschritt und verstrichene Zeit. Darunter «Im Plan» oder «Im Rückstand».
- «Abschliessen» erst am Tag des Zeitlimits. Ziel erreicht: erobert, +20 Mauerstein. Sonst knapp, +8.
- Vorhanden: «Der Aarewyrm», GP von Bern am 15. Mai 2027 (10 Meilen), Zielwert 300 km als Platzhalter. Jeremie nimmt teil.

### Weiteres

- **Rast am Lagerfeuer:** Bei Krankheit oder Ferien. Friert alle Timer und den Ansturm ein, keine Einträge möglich. Beim Beenden werden alle Zeitstempel um die Dauer verschoben.
- **Tränke:** 1 Trank pro Bewässerungstag, solange der Garten frisch oder welk ist (max. 9). Ein Trank gibt 50 % mehr Ruhm auf den nächsten Eintrag. Jeremie will das später überdenken.
- **Freischaltungen beim Helden:** Haut, Haar und drei Rüstungen frei. Goldrüstung nach der ersten Eroberung. Umhänge ab Ausdauer 3 und 6 sowie Klang-Magie 4. Helmbüsche ab Stärke 3 und 6.
- **Zurücknehmen:** Nur der letzte Eintrag von heute.

## 5. Oberfläche

### Aufbau

- Jede Szene füllt den ganzen Bildschirm (Canvas). Alle Bedienelemente liegen darüber.
- **Oben (HUD):** Logo und Held-Knopf mit Stufe. In Räumen «Burg» zum Zurückgehen und der Raumname mit Stufe.
- **Rechts auf dem Startbild:** Knopf «Weltkarte» mit Countdown zum Ansturm.
- **Unten:** eine Holzleiste (Bottom Sheet), scrollbar.
- **Startbildschirm:** Aussenansicht der Burg ohne Figuren. In der Leiste: Mauerausbau mit Fortschrittsbalken und sechs Raumkacheln (Garten, Moder, Zauberturm, Held, Bewohner, Bibliothek). Kein Inventar, kein Verlauf.
- **Räume:** Szene mit Animation und Stufe. In der Leiste die Routine des Raums. Der Thronsaal zeigt zusätzlich Trophäen und Ausrüstung, der Garten die Tränke.
- **Weltkarte:** Pergamentkarte mit Burg, Hordenlager und je einer Festung pro Eroberung. Zwei Reiter: «Ansturm» (Bereitschaft mit Aufschlüsselung) und «Eroberungen».
- **Held:** Vorschau mit Live-Anpassung, Verlauf, Rast am Lagerfeuer, Fertigkeiten, Monatsziel, Sicherung.

### Gestaltung

- Szenen: detaillierte Pixel-Art-Fantasy, sonniger Sommerwald, Burg aus Stein, ruhig und einladend, nicht düster. Referenzen: Ritter auf Waldlichtung mit Lichtstrahl, Reiter im Tannenwald, Burgturm mit Tor, überwachsene Ruinenhalle.
- Oberfläche: dunkles Holz mit hellerem Holzrahmen, grüne glänzende Hauptknöpfe, Holzknöpfe für Nebenaktionen, segmentierte grüne Balken in Holzfassung. Vorlage war ein Cartoon-Holz-UI-Kit, aber mit dunklerem Holz.
- Schrift: «VT323» (Google Fonts) für Titel, Knöpfe und Zahlen. Systemschrift für Erklärtexte.
- Farben (CSS-Variablen): Holz `--w1` #3b2414, `--w2` #4d2f1a, `--w3` #6e4526, `--w4` #9a6638, Schatten `--wd` #1e1108, Grün `--g1` #9be06a, `--g2` #62b440, `--g3` #3c7f2a, Text #f6ead0, Gold #f0cf6a.
- Touch-Ziele mindestens 44 Pixel. Echte `button`-Elemente.

## 6. Technik

### Grundsätze

- Reines HTML, CSS und JavaScript im ES5-Stil, ohne Framework und ohne Build. Das hat sich bewährt, bitte beibehalten, solange nichts dagegen spricht.
- Wenn PixelLab-Grafiken dazukommen, ist ein Ordner `assets/` mit PNG-Dateien sinnvoll. Dann ist die App nicht mehr eine einzige Datei, das ist in Ordnung.

### Spielstand

- Globales Objekt `S`. Aufbau in `fresh()`, Ergänzung fehlender Felder für alte Spielstände in `migrate()`.
- Wichtige Felder: `xp` (Ruhm je Fertigkeit), `last` (Zeitstempel je Routine), `log` (Einträge, max. 400), `wall`, `stones`, `potions`, `buff`, `books`, `bosses` (Eroberungen), `raids`, `lastRaid`, `rest`, `look`, `runGoal`.
- **Neue Felder immer in `fresh()` ergänzen, damit `migrate()` sie bei bestehenden Spielständen nachträgt. Nie Felder umbenennen, ohne in `migrate()` umzuziehen. Jeremie hat bereits einen Spielstand.**
- Speicherung: `localStorage`, Schlüssel `oathkeep`. Läuft die App als Claude-Artifact, zusätzlich im Konto über `window.claude.use('db')` (Dokument `data/users/<id>/state`). Ausserhalb von Claude greift nur `localStorage`; der Code dafür (`initSync`, `push`) tut dann einfach nichts.
- Sicherung: beim Helden als JSON-Text kopieren und wieder einfügen.

### Ablauf im Code

- Zustandslogik: `lvl`, `charLvl`, `moder`, `plant`, `fit`, `tower`, `happy`, `defNow`, `nextRaid`, `raids`.
- Einträge: `logAct(art, menge)`, Rücknahme `undo()`.
- Klicks: Jedes Bedienelement hat `data-act="..."`. Ein einziger Listener ruft `act()` auf, das den Text zerlegt (zum Beispiel `room:turm`, `log:run`, `tab:held`, `mtab:erob`, `boss:hit:<id>`).
- Oberfläche: `render()` füllt `#hud`, `#float` und `#sheet` aus `sheetStart`, `vRout` (liefert je Raum ein HTML-Stück), `vMap` und `vHeld`. `ui` hält den Ansichtszustand (`tab`, `room`, `mtab` und so weiter).
- Szenen: Canvas mit 360 Pixeln logischer Breite, Höhe 440 bis 840 je nach Bildschirm (`fitCv`). Die eigentliche Szene ist 360 mal 280 Pixel, `topOff` verschiebt sie, `extFill` ergänzt Himmel, Boden oder Wände bis zum Rand. Statische Teile werden in einem Zwischenbild gecacht, animierte Teile alle 120 ms neu gezeichnet (`draw`, `tick`).
- Räume: `ROOMS.hof`, `.garten`, `.halle`, `.turm`, `.thron`, `.bib`, `.karte` mit je `st` (statisch) und `dy` (animiert). Die Aussenansicht entsteht in `build` und `drawExt`. Der Held entsteht in `heroDraw` aus Pixel-Masken (`HEAD`, `TORSO`), eingefärbt mit den Farben aus `S.look`.
- Raumstufen: Garten nach Kräuterkunde, Innenraum nach Hauswacht, Zauberturm nach Klang-Magie, Thronsaal nach Charakterstufe, Innenhof nach Mauerstufe, Bibliothek nach Wissen (wächst alle 3 Bücher, max. Stufe 5).

### Reste, die aufgeräumt werden dürfen

`ui.inv`, `ui.more` und Teile der Inventar-Logik sind aus früheren Versionen übrig und werden nicht mehr angezeigt.

## 7. Bekannte Schwächen

- Die gezeichnete Grafik ist detailliert, erreicht aber nicht die Dichte der Referenzbilder.
- Alle Szenen sind von vorne gezeichnet (wie ein Bühnenbild).
- Im Innenhof sind die Bewohner klein. Im Thronsaal ist der Held doppelt skaliert und dadurch gröber als der Raum.
- Die Weltkarte hat keine Ortsnamen und zeigt höchstens fünf Eroberungen als Festungen.
- Die Spielwerte (Ruhm, Kosten, Schwellen) sind Annahmen und noch nicht im Alltag erprobt.
- Nicht getestet: die Speicherung im Konto und das Verhalten als Homescreen-App auf dem iPhone.

## 8. Nächste Schritte

### Schritt 0: Arbeitsumgebung

1. Git im Projektordner einrichten und den Ausgangszustand festhalten.
2. Lokal testen: einfachen Webserver starten und die App in einer mobilen Ansicht (390 mal 844) prüfen.
3. Hosting fürs iPhone vorschlagen und mit Jeremie einrichten, zum Beispiel GitHub Pages oder Netlify. Dazu ein Web-App-Manifest und ein Homescreen-Symbol, damit die App vom Homescreen im Vollbild startet. Den Spielstand überträgt Jeremie über «Sicherung kopieren» und «Sicherung laden».
4. Den PixelLab-MCP prüfen. Einrichtung laut PixelLab:

```
claude mcp add pixellab https://api.pixellab.ai/mcp -t http -H "Authorization: Bearer <PIXELLAB_SCHLÜSSEL>"
```

Den Schlüssel trägt Jeremie selbst ein. Nie in Dateien oder ins Repository schreiben. Dokumentation der Werkzeuge: https://api.pixellab.ai/mcp/docs

### Schritt 1: Umbau auf Low Top-Down, zuerst nur der Thronsaal

Jeremie will die Welt in der Sicht «Low Top-Down» (schräg von oben, wie klassische Aufbauspiele), mit Grafiken aus PixelLab. Bevor alles umgebaut wird, entsteht ein Testraum.

Benötigte Teile, alle in Low Top-Down und im gleichen Stil:

| Teil | Hinweise |
| --- | --- |
| Held, Grundfigur | Humanoid, v3, Low Top-Down, 64 Pixel, «Highly detailed», Standardkontur. 8 Richtungen. |
| Held, Zustand müde | Als Zustand der Grundfigur, nicht neu aus Text. |
| Held, Zustand geschwächt | Als Zustand der Grundfigur. |
| Laufanimation | Für jeden Zustand, mindestens Süd, Nord und Ost. West durch Spiegeln. |
| Steinboden | Kachelsatz für Draufsicht. |
| Roter Teppich mit Goldrand | Kachel oder Objekt. |
| Steinmauer | Wandstück für den hinteren Rand. |
| Thron, Säule, Banner, Fackel | Einzelobjekte mit transparentem Hintergrund. |

Beschreibung der Grundfigur für PixelLab:

```
Medieval hero knight in full steel plate armour, broad shoulders, upright confident posture. Open-faced steel helmet with a small red plume, brown hair visible at the back, fair skin. Polished grey-blue armour with lighter highlights, brown leather belt with gold buckle, dark trousers, brown leather boots. Red cape on the back. Holds a longsword with a gold crossguard in the right hand. Classic 16-bit fantasy RPG pixel art, clean dark outline, muted natural colours.
```

Zustand müde:

```
Same knight, tired: shoulders slightly slumped, head tilted forward, sword lowered with the tip pointing to the ground, a small sweat drop.
```

Zustand geschwächt:

```
Same knight, weak and exhausted: thin and hunched, head hanging down, pale and dull armour colours, tattered cape, dragging the sword behind him on the ground with one hand.
```

Umsetzung im Code:

- Einen Bild-Lader für `assets/` einführen und den Thronsaal aus Kacheln und Objekten zusammensetzen.
- Den Helden als Sprite mit Laufanimation durch den Raum laufen lassen, Zustand nach `fit()`.
- Die übrigen Räume bleiben vorerst gezeichnet. Mischen ist für den Test in Ordnung.
- Erst Jeremie das Ergebnis zeigen und seine Rückmeldung abwarten, bevor weitere Räume umgebaut werden.

### Schritt 2: Rest der Burg

Wenn der Testraum überzeugt: Aussenansicht, Garten (Pflanzen in vier Zuständen), Innenraum (Moder-Stufen), Zauberturm (leuchtend, glimmend, erloschen), Innenhof mit Bewohnern, Bibliothek (Regale füllen sich mit Büchern), Weltkarte.

## 9. Offene Entscheidungen

Diese Punkte sind nicht entschieden. Frag Jeremie, bevor du sie umsetzt:

- **Heldenanpassung mit PixelLab-Grafik:** Heute werden Farben per Code getauscht. Mit fertigen Sprites geht das nicht mehr frei. Möglich sind feste Varianten (eigene Sprites je Ausrüstung) oder Umfärben über eine Palette.
- **Tränke:** behalten, ändern oder streichen.
- **Spielwerte:** nach ein bis zwei Wochen Alltag anpassen.
- **Ideen für später, noch nicht beauftragt:** Kämpfe mit Entscheidungen, Talentpunkte, Mitteilungen bei fälligen Aufgaben, Import von Läufen aus Apple Health (nur als native App).

## 10. Regeln für Änderungen

- Spielstände nie zerstören. Neue Felder über `fresh()` und `migrate()`.
- Nach jeder Änderung in einer mobilen Ansicht prüfen und bei Gestaltungsänderungen einen Screenshot anschauen.
- Keine Funktion entfernen, die Jeremie nicht ausdrücklich streichen will.
- Texte in der App mittelalterlich und knapp halten, passend zu den bestehenden Namen.
- Grössere Umbauten in kleinen Schritten, mit Git-Commit pro Schritt.

## 11. Stand PixelLab

- Aufrufe über `tools/pixellab.py <werkzeug> '<json>'`. Der Schlüssel liegt als Netzwerk-Geheimnis in der Cloud-Umgebung und wird vom Proxy eingesetzt. Konto im Trial: nur 1 Auftrag gleichzeitig, Generierungen knapp.
- Held: Charakter `89a15b04-044d-4997-96c6-8d653debb432` (64 px, 8 Richtungen, Low Top-Down).
  - Laufen Vorlage «walking» (Gruppe `ffbb5fb9-…`): Süd verwendet, Nord unbrauchbar, Ost mit flackerndem Schwert.
  - Laufen v3 (Gruppe `35735bfc-ed24-4e43-ae26-96c6afbe7e7f`): Nord und Ost, 92 px, 9 Bilder, Bild 0 ist die Ruhepose.
  - «sad-walk» Süd (Gruppe `6115c2fd-…`): für müde, wirkt nur schwach.
- Boden mit Teppich: Kachelsatz `3d14a3a2-cd33-46a5-8ed5-0ca86c212f6a` (32 px, Wang). Die Ecken-Kennzeichnung «upper/lower» ist in den Metadaten vertauscht, siehe `TH_WANG` und `car()` im Code.
- Möbel und Wand: `create_image_pixen`, je 1 Generierung.
- Im Code: `TH`, `thLoad`, `thStatic`, `thHero`, `thDraw`. Spritesheet `assets/thron/held.png` mit Zellen 92 × 92: Zeile 0 Ruheposen in 8 Richtungen (S, SO, O, NO, N, NW, W, SW), Zeile 1 Laufen Süd, 2 Nord, 3 Ost (West gespiegelt), 4 müde Süd. Müde und geschwächt werden zusätzlich per Code entsättigt.
- Fehlen die Bilder (etwa als Claude-Artifact), zeichnet die App den alten Thronsaal.

### Übrige Räume (Stand 17. November 2026)

- Innenraum, Zauberturm, Bibliothek, Burggarten und Innenhof sind aus PixelLab-Grafiken in `assets/raum/` zusammengesetzt. Code: `RX`, `RX_ROOMS`, `rxDraw`, `rxOk`. Gemeinsame Teile: Wand und Fackeln aus dem Thronsaal, Böden als Kachelsätze (`holz`, `garten`, `hof`).
- Zustände per Code statt eigener Bilder: Moder (`rxModer`), Farbvarianten mit `rxTone` (welke Pflanzen, dunkler Kristall, besorgte Bewohner), Abdunklung im Turm.
- Stufen: Halle mit Teppich, Banner, Fackeln, Rüstung; Turm mit Regal und Teleskop; Bibliothek mit einem Regal je Stufe und Globus; Garten mit mehr Beeten, Vogelscheuche, Bienenkorb; Innenhof mit mehr Bewohnern.
- Kachelsätze: Die Bezeichnung «upper/lower» ist bei Thron- und Gartenboden vertauscht. Der Holzboden wurde dadurch mit Stein statt Teppich verkettet, verwendet wird nur die reine Holzkachel. Der Teppich `teppich.png` ist offline aus den Thronsaal-Kacheln gebaut.
- Die Held-Vorschau beim Helden zeichnet weiterhin den alten Helden (offene Entscheidung zur Anpassung).
- Seit dem Abo (Tier 1, 2000 Generierungen pro Monat): `tools/batch.py` erzeugt Bilder aus einer Liste, `tools/tileset.py` lädt Kachelsätze.
- Held: echte Zustände `Muede` (`4db411ae-31bd-4219-be1e-cc81a13d30a0`) und `Geschwaecht` (`b7e604d2-a414-4883-8e46-1b9e5b10b821`), je mit Laufen v3 nach Süd, Nord, Ost. Spritesheet `assets/thron/held.png`: 12 Zeilen, je Zustand (kräftig, müde, geschwächt) vier Zeilen: Ruhepose 8 Richtungen, Laufen Süd, Nord, Ost, je 8 Bilder. `tools/anim.py` reiht Laufanimationen ein.
- Aussenansicht: `RX_ROOMS.mauer`, ein Bild je Mauerstufe (`burg1` bis `burg5`), oben und unten mit Wiese, Baumreihe und Weg fortgesetzt (`rxExtend`). Schaden zeigt Geröll, Risse und Staub.
- Weltkarte: `RX_ROOMS.karte` mit `karte.png` und Symbolen (`m_burg`, `m_lager`, `m_festung`, `m_erobert`). Positionen in `RX_MAP`; die Burg und die erste Eroberung liegen auf den beiden in der Karte gezeichneten Burgen.
- Thronsaal-Ausbau nach Charakterstufe: Tafel ab 3, Wachen ab 5, Hofdame ab 7, Barde ab 9. Pokal je Eroberung (bis 4), Drachenschild nach der ersten Eroberung. Der Held weicht der Tafel aus.
- Innenhof mit sechs verschiedenen Bewohnern, Bibliothek mit Eule ab Stufe 5. Homescreen-Symbol aus `m_burg`.
- Schrift: VT323.
