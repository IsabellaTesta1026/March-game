# Hold The Line

A choose-your-own-adventure web game set during the 1963 Birmingham Children's Crusade.

**Play it:** https://isabellatesta1026.github.io/March-game/

---

## How to Play

1. Open the link above in any web browser (Chrome, Firefox, Safari, Edge).
2. On the title screen, click **BEGIN**.
3. Read the historical context, then click through to start the game.
4. You play as a white Birmingham police officer on May 2, 1963.
5. Each round presents a situation. Read the scene, then **choose A, B, or C**.
6. Your choices carry forward — earlier decisions shape what happens later.
7. The game has **two possible endings** depending on your path:
   - **General ending** — you go back to work
   - **Testimony ending** — you testify against the department
8. After the ending, read the reflection and explore the **Learn More** and **Works Cited** tabs.

**The game takes about 10-15 minutes to complete.**

---

## Story Structure

The game has 5 rounds of choices and 15 total scenes.

```
Historical Context
        |
      Round 1  (hold the line or hesitate?)
        |
      Round 2  (fire hoses deployed)
       / \
    A,B   C ── Hose drop scene
      \   /
      Round 3  (police dogs enter)
       / \
    A,B   C ── Dog bite scene
      \   /
      Round 4  (mass arrests)
       / \
    A,B   C ── Bus rescue scene
      \   /
      Round 5
       / \
   Home  Station (incident report)
    |       |
End (general)  End (testimony)
```

Choosing **C** consistently unlocks the testimony ending.

---

## Settings

Click the **gear icon** (top right) at any time to adjust:

- **Text size** — small, medium, or large
- **High contrast mode** — increases color contrast for readability
- **Audio narration** — toggle voice narration on or off

---

## Project Structure

```
index.html        — all screens and UI
style.css         — visual design (newspaper aesthetic)
game-data.js      — story scenes and choice text
game-engine.js    — game logic and screen transitions
images/           — background photos and title images
audio/            — narration MP3 files
```

---

## Credits

Created by Isabella Testa and Juliana Testa.

Historical photographs courtesy of the Bob Adelman Estate, Getty Images, Wikimedia Commons, and the Museum of Fine Arts Houston.

This game is intended for educational use.
