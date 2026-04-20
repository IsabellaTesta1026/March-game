# Images — Birmingham 1963 Game

To swap any image: drop your file into this folder with the **exact filename** listed below.
Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`
(If you use a format other than .jpg, update the `bg:` value in game-data.js to match, e.g. `bg: 'round2-fire-hose.png'`)

---

## Background Images (behind the center card)

| File                                   | When it appears                                              |
|----------------------------------------|--------------------------------------------------------------|
| `bg-title.jpg`                         | Title / start screen                                         |
| `bg-history.jpg`                       | "Before You Begin" historical context screen                 |
| `bg-round1-kelly-ingram-park.jpg`      | Opening context + Round 1 (march approaching the park)       |
| `bg-round2-fire-hose.jpg`              | Round 2 + R2-C branch (fire hoses deployed)                  |
| `bg-round3-police-dogs.jpg`            | Round 3 + R3-C dog bite branch (police dogs enter)           |
| `bg-round4-mass-arrests.jpg`           | Round 4 (officers arresting children, filling the buses)     |
| `bg-round4c-bus-rescue.jpg`            | R4-C branch — bus rescue scene (both paths that reach it)    |
| `bg-round5-home.jpg`                   | Round 5 general + both home endings (watching TV at home)    |
| `bg-round5-police-station.jpg`         | Round 5 station path + testimony ending (processed at desk)  |

Two scenes can share a file — if `round3-police-dogs` and `round4-mass-arrests` feel visually similar,
point them both at the same file by giving them the same `bg:` value in game-data.js.

---

## Title Page Photos (three newspaper columns)

| File                | Location                                      |
|---------------------|-----------------------------------------------|
| `title-left.jpg`    | Left column photo                             |
| `title-center.jpg`  | Center column tall photo (under "GAME TITLE") |
| `title-right.jpg`   | Right column photo                            |

---

## Character Portrait

| File                | Location                                                          |
|---------------------|-------------------------------------------------------------------|
| `char-officer.jpg`  | Character select screen — "The Officer"                           |

If this file is missing, the original SVG silhouette shows as a fallback.

---

## Tips

- All images use `object-fit: cover` so any aspect ratio works.
- If a background file is missing, the game falls back to the paper-color background — nothing breaks.
- A semi-transparent dark overlay is automatically applied over background images so the card text stays readable.
- To reassign a background to a different scene, edit the `bg:` field for that scene in `game-data.js`.
