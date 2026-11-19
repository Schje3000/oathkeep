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
| `index.html` | Die App (HTML, CSS, Oberfläche). Einzige externe Abhängigkeit: Schrift «VT323» von Google Fonts. |
| `logic.js` | Spielregeln als reine Funktionen, zentrale Uhr, Spielstand-Vorlagen. |
| `debug.js` | Debug-Panel, nur mit `?debug=1`. |
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

### Stufen und Fortschritt

- Stufe einer Fertigkeit: `floor(sqrt(ruhm / 30)) + 1`
- Charakterstufe aus dem gesamten Ruhm: `floor(sqrt(summe / 150)) + 1` (nach einem Monat etwa 5, nach einem Jahr etwa 19).
- Titel: «Eroberer» nach der ersten abgeschlossenen Eroberung, «Gelehrter» ab Wissen Stufe 3, «Weiser» ab Wissen Stufe 6.
- Ziel: Alles ist nach etwa einem Jahr ausgebaut. Fortschritt wählt Jeremie selbst und bezahlt ihn mit Gold.
- Alles wächst optisch: vom Bauernjungen in Tunika und einer Holzpalisade zur Festung mit Held in Goldrüstung.

### Gold

- Jeder Eintrag bringt Gold: `round(Ruhm / 5)`, mal Trank (50 % für 24 Stunden) und Ausrüstungsboni. Etwa 150 bis 200 Gold pro Woche.
- Alter Mauerstein wurde beim Umbau 1 zu 5 in Gold umgerechnet (`migrate`).

### Ausbau (`CAT` im Code)

- Burg: 8 Stufen (`S.wall.lvl` 1 bis 8), je ein Bild `stufe0` bis `stufe7`. Preise 100 bis 1000, Voraussetzung Charakterstufe.
- Thronsaal, Innenraum, Zauberturm, Bibliothek, Garten, Innenhof: je 8 Ausbauten (`S.up`). Preise 30 bis 360. Voraussetzung: Fertigkeit des Raums (Hauswacht, Klang-Magie, Wissen, Kräuterkunde) oder Charakterstufe (Thronsaal, Innenhof).
- Stil der Räume folgt der Burgstufe (`vibe()`): 1 bis 3 Holz (Blockhaus, Palisade), 4 bis 6 Stein, 7 bis 8 Prunk (Marmor, hohe Mauer).

### Zustände (Tage seit dem letzten Eintrag)

| Bereich | Zustände |
| --- | --- |
| Held (seit letztem Lauf oder Kampftraining) | unter 4 Tagen kräftig, unter 7 müde, sonst geschwächt |
| Garten (seit letztem Bewässern) | unter 3,5 frisch, unter 6 welk, unter 9 verdorrt, sonst verrottet |
| Zauberturm (seit letzter Übung) | unter 1,5 leuchtet, unter 3,5 glimmt, sonst erloschen |
| Moder | Anzahl überfälliger Putzaufgaben |
| Bewohner | zufrieden, wenn kein Moder, Garten frisch und Mauer ohne Schaden |

Der Held soll sichtbar verfallen: kräftig mit erhobenem Schwert, müde mit gesenktem Kopf, geschwächt dünn und gebeugt, Schwert am Boden nachgezogen. Das ist Jeremie wichtig.

### Mauer und Ansturm der Horde

- Schaden 0 bis 5, Reparatur 15 Gold pro Punkt. Solange Schaden besteht, kein Burgausbau.
- Jeden Sonntag um 20 Uhr. Verteidigung = Burgstufe mal 10 + Einträge der letzten 7 Tage mal 4 - Moder mal 5 - Schaden mal 5 + Ausrüstung und Trophäen.
- Angriff = min(150, 40 + 2 mal Anzahl bisheriger Anstürme): Die Horde wächst jede Woche.
- Sieg: 20 Gold und mit 35 % Wahrscheinlichkeit Beute. Niederlage: Mauerschaden +1. Verpasste Sonntage werden nachgerechnet (höchstens 8).

### Eroberungen (früher «Bosse»)

- Grössere Ziele mit Zeitlimit, vom Nutzer selbst angelegt: Name, Ziel, Bereich, Zeitlimit, Zielwert. Jeder passende Eintrag zählt automatisch.
- «Abschliessen» erst am Tag des Zeitlimits. Ziel erreicht: erobert, 150 Gold, ein Ausrüstungs- oder Möbelstück (selten oder episch) und eine Trophäe; auf der Karte entsteht ein Dorf. Nicht erreicht: gescheitert, keine Belohnung, kein Dorf.
- Auf der Weltkarte: aktive Eroberung als Fahne, erobert als Dorf, gescheitert verschwindet sie.
- Vorhanden: «Der Aarewyrm», GP von Bern am 15. Mai 2027 (10 Meilen), Zielwert 300 km als Platzhalter.

### Beute (`ITEMS` im Code)

- Plätze: Waffe, Rüstung, Talisman (anlegen beim Helden), dazu Trophäen (Thronsaal, je +1 bis +3 Verteidigung) und Einrichtung (erscheint in ihrem Raum).
- Seltenheit: gewöhnlich, selten, episch. Doppelte Funde werden zu Gold.
- Rüstung ist am Helden sichtbar: Tunika (ohne), Leder, Kettenhemd, Platte, Gold. Waffen wirken nur über Boni, der Held trägt die Waffe seiner Rüstungsstufe.

### Weiteres

- **Rast am Lagerfeuer:** Bei Krankheit oder Ferien. Friert alle Timer und den Ansturm ein, keine Einträge möglich.
- **Tränke:** Im Garten brauen (40 Gold, mit Kräuterkunde billiger) oder als Beute. Ein Trank gibt 24 Stunden lang 50 % mehr Gold.
- **Zurücknehmen:** Im Thronsaal je Trainingsart die letzten fünf Einträge, sonst der letzte Eintrag von heute.
- **Aufstieg:** Neue Charakterstufe zeigt eine Karte mit dem, was jetzt baubar ist (`S.lvlSeen`).

### Händler, Einrichtung und Ausrüster

- **Händler** im Innenhof ab Hof-Ausbau 1, mit eigenen Ausbaustufen (`OK.SHOP.h`, `S.shop.h`): Händlerkarren (3 Angebote), Marktstand (4, 120 Gold, Charakterstufe 4), Krämerladen (5, 220 Gold, Stufe 7), Handelshaus (6 plus jede Woche eine Rarität aus der Beute, 380 Gold, Stufe 10). Wochenangebot neu jeden Montag (`OK.shopOffer`), Kauf mit Gold (`OK.buyDeko`). Gekauftes liegt in `S.deko`, gekaufte Raritäten in `S.inv` (zählen wie Beute).
- **Einrichtung** (`OK.DEKO`, Liste mit Bildbeschreibungen in `tools/deko.json`): 48 Stücke, davon 10 nur als Beute (auch als `ITEMS` mit `sl: 'moebel'` und kleinen Boni). Je Stück Art (Boden, Wand, Decke) und Ort (innen, aussen, beides). Aufstellen beim Einrichten über das Lager in jedem passenden Raum (`S.place[raum] = [{id,x,y}]`), zurück ins Lager durch Antippen. Bilder `k_deko_<id>.png`, Animationen als Streifen `k_deko_<id>_a.png` (8 Bilder nebeneinander).
- **Ausrüster** ab Hof-Ausbau 3, mit eigenen Ausbaustufen (`OK.SHOP.a`, `S.shop.a`): Schneiderstand (Umhänge), Rüstschmiede (Metalltöne, 150 Gold, Stufe 5), Tierstall (Begleiter, 250 Gold, Stufe 8), Gewandhaus (Gewänder, 400 Gold, Stufe 11). Rein optisch (`OK.COS`, `S.cos`): Umhangfarben und Metalltöne per Code umgefärbt (`cosTint`), Begleiter folgen dem Helden (`pet_<n>.png` und `_a`), Gewänder Waldläufer und Magier (`assets/held/s_<gewand>.png`, `tools/outfits.py`). Wechseln beim Helden unter «Aussehen».
- Im Innenhof stehen beide Läden als Gebäude je Stufe (`k_hof_haendler1..4`, `k_hof_ausruester1..4`, Stufe 2 nutzt Marktstand und Schmiede) mit einer animierten Ladenfigur davor. Antippen eines Ladens springt zu seiner Karte in der Leiste.
- **Animationen** entstehen mit `tools/anim_img.py` (PixelLab `animate_image`, letztes Bild gleich dem ersten, damit es eine Schleife ergibt), etwa 1 Generierung pro Stück.
- **Zauberturm** ist mystisch: Die Klangorgel (Holz, Stein, Kristall) erzeugt sichtbar Magie, dazu Runen, schwebende Kerzen, Klangkristall, Runenpult, Zauberbücher, Astrolabium, Resonanzharfe, Zauberspiegel. Verstummt der Turm, stehen Orgel und Kristall still und werden grau.

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

### Spielregeln, Uhr, Debug und Tests

- **Spielregeln** liegen als reine Funktionen in `logic.js` (Objekt `OK`). Jede Funktion bekommt Spielstand und Zeit als Parameter, zum Beispiel `OK.moder(S, now)`, `OK.logEntry(S, art, menge, now)`, `OK.resolveRaids(S, now, rng)`. In `index.html` sind `moder()`, `logAct()` und so weiter nur noch dünne Hüllen darum. Neue Regeln gehören nach `logic.js`, nicht in die Oberfläche.
- **Uhr:** Die echte Zeit wird nur in `OK.now()` abgefragt. Tests setzen `OK.clock.fixed`, das Debug-Panel `OK.clock.offset`. In `index.html` immer `now()` statt `Date.now()` verwenden.
- **Debug-Panel:** `index.html?debug=1` lädt `debug.js`. Zeit vorspulen (1 Tag, 1 Woche, bis zum Ansturm), Vorlagen (`OK.preset`: leer, normal, vernachlaessigt, maximal), Zurücksetzen. Der Debug-Modus nutzt einen eigenen Spielstand (`oathkeep_debug`) und synchronisiert nie mit dem Konto. Der echte Spielstand bleibt unberührt.
- **Testkennungen:** Statische Bereiche haben `data-testid` (`scene`, `hud`, `float`, `sheet`, `toast`). Knöpfe bekommen ihn nach jedem `render()` aus `data-act` (`room:turm` wird `act-room-turm`), Eingabefelder `in-<name>`, Karten `card-<titel>`.
- **Tests:** `npm install`, dann `npm test` (Vitest, Zeitzone fest Europe/Zurich). Tests liegen in `tests/`.
- **Test-Agents:** `.claude/agents/oathkeep-logic-tester.md` und `oathkeep-ui-tester.md`, Styleguide `docs/style.md`. Playwright-MCP in `.mcp.json`.

### Reste, die aufgeräumt werden dürfen

`ui.inv`, `ui.more` und Teile der Inventar-Logik sind aus früheren Versionen übrig und werden nicht mehr angezeigt.

## 7. Bekannte Schwächen

- Die gezeichnete Grafik ist detailliert, erreicht aber nicht die Dichte der Referenzbilder.
- Die Räume sind in Seitenansicht umgesetzt (Branch `seitenansicht` ist in `main` zusammengeführt). Burg und Weltkarte bleiben schräg von oben.
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

**Überholt:** Die Perspektive ist jetzt Seitenansicht (Abschnitt 9). Der folgende Text bleibt nur als Verlauf stehen, die PixelLab-Beschreibungen des Helden sind weiter brauchbar.

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

- **Perspektive:** entschieden, Seitenansicht (Sidescroller). Szenen als Hochformatbilder von der Seite, Held und Bewohner laufen links und rechts auf der Bodenlinie (`FLOOR`, gemessen mit `tools/boden.py`), Sprites mit `tools/held_seite.py` und `tools/bewohner.py` (PixelLab `view: side`). Burg-Aussenansicht und Weltkarte bleiben von oben. Umgesetzt und in `main`. Massgebend ist `docs/style.md`.
- **Heldenanpassung:** entschieden. Die frühere Farbwahl ist durch Ausrüstung ersetzt (Rüstung sichtbar am Helden). `S.look` bleibt im Spielstand, wird aber nicht mehr angezeigt.
- **Tränke:** entschieden, kaufbar und als Beute, wirken 24 Stunden auf Gold.
- **Spielwerte:** nach ein bis zwei Wochen Alltag anpassen.
- **Ideen für später, noch nicht beauftragt:** Kämpfe mit Entscheidungen, Talentpunkte, Mitteilungen bei fälligen Aufgaben, Import von Läufen aus Apple Health (nur als native App).

## 10. Regeln für Änderungen

- Spielstände nie zerstören. Neue Felder über `fresh()` und `migrate()`.
- Nach jeder Änderung in einer mobilen Ansicht prüfen und bei Gestaltungsänderungen einen Screenshot anschauen.
- Keine Funktion entfernen, die Jeremie nicht ausdrücklich streichen will.
- Texte in der App mittelalterlich und knapp halten, passend zu den bestehenden Namen.
- Grössere Umbauten in kleinen Schritten, mit Git-Commit pro Schritt.

## 11. Stand PixelLab und Grafik

- Aufrufe über `tools/pixellab.py <werkzeug> '<json>'`, Bildserien mit `tools/batch.py <liste.json> <ordner>` (überspringt vorhandene, wartet bei vollen Plätzen), Kachelsätze mit `tools/tileset.py`, Heldenstufen mit `tools/tiers.py`. Der Schlüssel liegt als Netzwerk-Geheimnis in der Cloud-Umgebung. Abo Tier 1: 2000 Generierungen pro Monat, 8 Aufträge gleichzeitig.
- **Perspektive:** Seitenansicht (siehe Abschnitt 9). Der frühere Zusatz «strict front view ...» für Möbel gilt nur für die alten frontalen Szenen.
- **Räume (Bühnenbaukasten, verbindlich, siehe `docs/style.md`):** Je Raum und Material (Holz, Stein, Prunk) ein leerer Hintergrund `k_<raum>_bg<0-2>` (360 × 512, flache Rückwand über die ganze Breite, Decke oder Himmel oben). Möbel, Figuren und Wandschmuck sind einzelne Sprites `k_<raum>_<name>` und stehen an festen Plätzen (`KIT` in `tools/welt.js`). `bgF` ist die Bodenlinie im Hintergrundbild, `top` die Oberkante der Wand (für Säulen bis zur Decke und Leuchterschnüre), `lane` der Laufweg des Helden vor den Möbeln. Je Ausbaustufe kommt ein Objekt dazu oder wird ersetzt (`s` ab Stufe, `e` bis Stufe, `m` nur in einem Material, `v` je Material eigenes Bild). Jeremie kann im Raum über «Einrichten» selbst anordnen (`S.layout`): Bodenobjekte nur waagrecht, Wandobjekte frei. Burg und Weltkarte bleiben von oben (`v_burg*`, `v_welt`).
- Held (Seitenansicht): Grundfigur Tunika `a7c5a390-77a1-4d8b-b1da-83f6ef42be01` (88 px, view side), Rüstungsstufen und Zustände als Zustände davon, IDs in `tools/held_seite.py`-Ausgabe. Blätter `assets/held/s_<stufe>.png` (tunika, leder, kette, platte, gold): Zellen 96 × 96, Füsse auf y 90, Zeile je Zustand (kräftig, müde, geschwächt), Spalten Ruhe Süd, Ruhe Ost, 6 × Laufen Ost (Westen gespiegelt). Gebaut mit `tools/blatt.py`. Bewohner `assets/raum/bew_<name>.png` gleich aufgebaut (`tools/bewohner.py`).
- Grafiken: `assets/raum/` mit Baukasten-Teilen `k_*`, Burgstufen `v_burg0` bis `v_burg7`, Weltkarte `v_welt`, Kartensymbole `mb0` bis `mb3`, `m_lager`, `m_fahne`, `m_dorf`, Gegenstände `i_*` und Beutebilder, Oberflächensymbole `u_*`, Bewohner `bew_*`. Heldensprites in `assets/held/`.
- Stufen 0 bis 2 sind Holz, 3 bis 5 Stein, 6 bis 8 Prunk. Stein-Ausbauten brauchen Burgstufe 4, Prunk-Ausbauten Burgstufe 7 (`bq` in `OK.upNext`, `logic.js`).
- Code: Block zwischen `/* WELT-START */` und `/* WELT-ENDE */` in `index.html`, Quelle `tools/welt.js` (nach Änderungen den Block in `index.html` ersetzen). Räume entstehen in `kRoom`, Zustände als Überlagerung (Moder, Dürre per Umfärben der Beete und Bäume, Turm abgedunkelt mit grauem Kristall, besorgte Bewohner blass). Held und Bewohner laufen nur waagrecht auf dem Laufweg (`actorStep`). Die alten Seitenansicht-Szenen (`FLOOR`, `rRoom`) sind ersetzt.
- Neue Teile immer zuerst in einer Übersicht neben dem Helden prüfen (Massstab), Bodenlinie und Wandoberkante neuer Hintergründe mit einem Raster ablesen.
- Beute-Einrichtung und Trophäen geben Boni und erscheinen in der Sammlung beim Helden. Im Raum stehen sie noch nicht, das wäre mit dem Baukasten jetzt möglich.
- **Oberfläche (Waldholz-Stil):** Knöpfe, Reiter, Schilder, Karten und der Rahmen der Holzleiste sind PixelLab-UI-Teile in `assets/ui/` (Vorlage `oathkeep_5_waldholz`, ID `3b2a96d3-f963-4ce7-81bf-b9d1e439b5e2`, zerlegt mit `update_ui_asset split`). Eingebunden als 9-Slice mit `border-image`, 1 Bildpixel = 1 CSS-Pixel, im CSS-Block «Waldholz-Stil» am Ende des Stylesheets, unter `#app` gebündelt. Teile: `pri` (Hauptknopf), `sec` (Nebenknopf), je `_gedrueckt`, `tab_an`, `tab_aus` (auch Karten, Kacheln, gesperrte Knöpfe), `schild` (Kopfleiste), `rahmen` (Holzleiste), `balken`, `gesperrt`, `rund`. Texte bleiben echter Text in VT323.
- **Zurück zur Burg:** Knopf «Burg» mit Pfeil, Zurückwischen in Safari (Verlaufseintrag beim Verlassen der Burg) und eigene Wischgeste vom linken Rand für die Homescreen-App (`leaveHome`, `goHome`, `navPushed`).
