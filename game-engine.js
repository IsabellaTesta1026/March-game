// game-engine.js — State machine, rendering, screen transitions, localStorage
// Birmingham 1963 — Choose-Your-Own-Adventure

'use strict';

// ─── Game State ─────────────────────────────────────────────────────────────
const state = {
  playerName:               '',
  currentSceneId:           null,
  timerEnabled:             true,   // 20-second decision timer (can be turned off)
  soundEnabled:             true,   // sound on/off
  accessibilityLargeText:   false,
  accessibilityHighContrast:false,
  accessibilityReduceMotion:false,
};

// ─── Story paging state ───────────────────────────────────────────────────
let storyBeats      = [];   // array of paragraph strings (one per screen)
let storyBeatIndex  = 0;
let storyPageStart  = 0;    // index of first bubble on current page
let storyNextScene  = null; // null → go to endReflection (ending type)
let storyEndCallback = null; // if set, called on last beat instead of loadScene
let storyIsEnding   = false;

// ─── Reaction paging state ────────────────────────────────────────────────
let reactionBeats       = [];   // array of strings (one per screen)
let reactionBeatIndex   = 0;
let reactionPageStart   = 0;    // index of first bubble on current page
let reactionNextScene   = null;
let reactionChoiceScene = null; // scene ID where the choice was made (for audio filename)
let reactionChoiceLetter = '';  // 'a' / 'b' / 'c'

// ─── Timer state ─────────────────────────────────────────────────────────
let timerInterval     = null;
let timerSeconds      = 0;
const TIMER_DURATION  = 20;
let pendingChoiceScene = null;   // the scene whose choices are currently shown

// ─── DOM References ──────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

const screens = {
  title:         $('title-screen'),
  history:       $('history-screen'),
  charSelect:    $('character-select-screen'),
  charName:      $('character-name-screen'),
  preReflection: $('pre-reflection-screen'),
  gallery:       $('gallery-screen'),
  game:          $('game-screen'),
  endReflection: $('end-reflection-screen'),
  learnMore:     $('learn-more-screen'),
  worksCited:    $('works-cited-screen'),
};

const gameViews = {
  story:    $('story-view'),
  choice:   $('choice-view'),
  reaction: $('reaction-view'),
};

// ─── Background Image System ─────────────────────────────────────────────────
// Maps screen keys to their bg image key (null = default paper texture)
const SCREEN_BG = {
  title:         'title',
  history:       'history',
  charSelect:    'round1-kelly-ingram-park',
  charName:      'round1-kelly-ingram-park',
  preReflection: 'round1-kelly-ingram-park',
  gallery:       'round1-kelly-ingram-park',
  endReflection: 'round1-kelly-ingram-park',
  learnMore:     'round1-kelly-ingram-park',
  worksCited:    'round1-kelly-ingram-park',
};

let _bgImg = null;

function setSceneBg(key) {
  if (!_bgImg) _bgImg = document.getElementById('scene-bg-img');
  if (key) {
    _bgImg.src = `images/bg-${key}.jpg`;
    document.body.classList.add('has-scene-bg');
  } else {
    _bgImg.src = '';
    document.body.classList.remove('has-scene-bg');
  }
}

// ─── Screen Management ───────────────────────────────────────────────────────
function showScreen(screenKey) {
  clearChoiceTimer();
  if (screenKey !== 'game') {
    stopSpeaking();
    setSceneBg(SCREEN_BG.hasOwnProperty(screenKey) ? SCREEN_BG[screenKey] : null);
  }

  Object.values(screens).forEach(s => {
    s.classList.add('hidden');
    s.classList.remove('fade-in');
  });

  const target = screens[screenKey];
  if (!target) { console.warn('Unknown screen:', screenKey); return; }

  target.classList.remove('hidden');
  if (!state.accessibilityReduceMotion) {
    target.classList.add('fade-in');
    target.addEventListener('animationend', () => target.classList.remove('fade-in'), { once: true });
  }

  target.scrollTop = 0;
  if (screenKey === 'history' && narrationOn) setTimeout(narrateHistory, 100);
}

function showGameView(viewKey) {
  if (viewKey !== 'choice') clearChoiceTimer();
  Object.values(gameViews).forEach(v => v.classList.add('hidden'));
  const view = gameViews[viewKey];
  if (view) {
    view.classList.remove('hidden');
    view.scrollTop = 0;
  }
}

// ─── Scene Routing ───────────────────────────────────────────────────────────
function loadScene(sceneId) {
  const scene = GAME_DATA[sceneId];
  if (!scene) { console.error('Scene not found:', sceneId); return; }

  state.currentSceneId = sceneId;
  // Only run the full screen transition on first entry to the game screen.
  // Scene-to-scene navigation skips the hide/re-show so the bg and card
  // don't fall out of sync.
  if (screens.game.classList.contains('hidden')) {
    showScreen('game');
  }
  setSceneBg(scene.bg || null);

  if (scene.type === 'narrative' || scene.type === 'ending') {
    renderNarrativeView(scene);
  } else if (scene.type === 'choice') {
    if (scene.setup && scene.setup.length > 0) {
      renderSetupView(scene);
    } else {
      renderChoiceView(scene);
    }
  }
}

// ─── Story / Narrative View — beat by beat ────────────────────────────────
function renderNarrativeView(scene) {
  showGameView('story');

  // Set round label in card header
  const roundLabel = $('story-round-label');
  if (roundLabel) {
    if (scene.title) {
      roundLabel.textContent = scene.title;
    } else if (scene.type === 'ending') {
      roundLabel.textContent = 'EPILOGUE';
    } else {
      roundLabel.textContent = '';
    }
  }

  // Group paragraphs into slides of 2 (filter dividers/blanks first)
  storyBeats = groupParagraphs(
    (scene.paragraphs || []).filter(p => {
      const t = p.trim();
      return t !== '' && t !== '—' && !t.startsWith('—–') && t !== '———';
    }),
    1
  );
  storyBeatIndex   = 0;
  storyPageStart   = 0;
  storyIsEnding    = scene.type === 'ending';
  storyEndCallback = null;
  storyNextScene = storyIsEnding ? null : (scene.next || null);

  renderStoryBeat();
}

function renderStoryBeat() {
  const textEl  = $('story-beat-text');
  const advBtn  = $('story-advance-btn');
  const backBtn = $('story-back-btn');

  const { bubbleItems, narrativeHtml } = collectBeats(storyBeats, storyBeatIndex);
  storyPageStart = renderWithFit(textEl, bubbleItems, narrativeHtml, storyPageStart);
  playBeatAudio(`scene-${state.currentSceneId}-${storyBeatIndex}.mp3`, textEl);

  if (backBtn) {
    backBtn.style.display = storyBeatIndex > 0 ? 'flex' : 'none';
    backBtn.onclick = () => { storyBeatIndex--; storyPageStart = 0; renderStoryBeat(); };
  }

  const isLast = storyBeatIndex >= storyBeats.length - 1;
  if (isLast) {
    advBtn.onclick = () => {
      if (storyEndCallback) {
        const cb = storyEndCallback;
        storyEndCallback = null;
        cb();
      } else if (storyIsEnding) {
        showScreen('endReflection');
      } else {
        loadScene(storyNextScene);
      }
    };
  } else {
    advBtn.onclick = () => {
      storyBeatIndex++;
      renderStoryBeat();
    };
  }
}

// ─── Setup View (context beats before choice) ─────────────────────────────────
function renderSetupView(scene) {
  showGameView('story');
  const roundLabel = $('story-round-label');
  if (roundLabel) roundLabel.textContent = scene.title || '';
  storyBeats = groupParagraphs(
    scene.setup.filter(p => p.trim() !== ''),
    1
  );
  storyBeatIndex  = 0;
  storyPageStart  = 0;
  storyIsEnding   = false;
  storyNextScene  = null;
  storyEndCallback = () => renderChoiceView(scene);
  renderStoryBeat();
}

// ─── Choice View ──────────────────────────────────────────────────────────────
function renderChoiceView(scene) {
  showGameView('choice');
  pendingChoiceScene = scene;

  const container = $('choice-buttons');
  container.innerHTML = '';

  scene.choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.className = 'btn-choice';
    btn.setAttribute('aria-label', `Choice ${choice.letter}: ${choice.label}`);

    const letter = document.createElement('span');
    letter.className = 'choice-letter';
    letter.textContent = choice.letter;
    letter.setAttribute('aria-hidden', 'true');

    const text = document.createElement('span');
    text.className = 'choice-text';
    text.textContent = choice.label;

    btn.appendChild(letter);
    btn.appendChild(text);

    btn.addEventListener('click', () => {
      clearChoiceTimer();
      showReaction(choice);
    });
    container.appendChild(btn);
  });

  startChoiceTimer(scene);
}

// ─── Decision Timer ───────────────────────────────────────────────────────────
function startChoiceTimer(scene) {
  clearChoiceTimer();
  const timerEl   = $('timer-display');
  const barInner  = $('timer-bar-inner');

  if (!state.timerEnabled) {
    if (timerEl) timerEl.style.display = 'none';
    return;
  }

  if (timerEl)  timerEl.style.display = 'flex';
  timerSeconds = TIMER_DURATION;
  updateTimerDisplay();

  // CSS animation for the bar (smooth depletion)
  if (barInner) {
    barInner.style.transition = 'none';
    barInner.style.transform  = 'scaleX(1)';
    // Force reflow then start animation
    void barInner.offsetWidth;
    barInner.style.transition = `transform ${TIMER_DURATION}s linear`;
    barInner.style.transform  = 'scaleX(0)';
  }

  timerInterval = setInterval(() => {
    timerSeconds--;
    updateTimerDisplay();
    if (timerSeconds <= 0) {
      clearChoiceTimer();
      // Randomly select a choice when time expires
      if (scene && scene.choices.length > 0) {
        const randomChoice = scene.choices[Math.floor(Math.random() * scene.choices.length)];
        showReaction(randomChoice);
      }
    }
  }, 1000);
}

function clearChoiceTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  const barInner = $('timer-bar-inner');
  if (barInner) {
    barInner.style.transition = 'none';
    barInner.style.transform  = 'scaleX(0)';
  }
  const timerEl = $('timer-display');
  if (timerEl) timerEl.style.display = 'none';
}

function updateTimerDisplay() {
  const numEl = $('timer-count');
  if (!numEl) return;
  numEl.textContent = timerSeconds;
  numEl.classList.toggle('timer-urgent', timerSeconds <= 5);
}

// ─── Reaction View (one beat per screen) ─────────────────────────────────────
/**
 * Split response text into individual "beats" — one per screen.
 * Split on any newline sequence; filter empty strings.
 */
function getBeats(responseText) {
  return responseText.split('\n').filter(line => line.trim() !== '');
}

function showReaction(choice) {
  reactionBeats        = groupParagraphs(getBeats(choice.response), 1);
  reactionBeatIndex    = 0;
  reactionPageStart    = 0;
  reactionNextScene    = choice.next;
  reactionChoiceScene  = state.currentSceneId;
  reactionChoiceLetter = (choice.letter || '').toLowerCase();

  // Set the choice echo (shown persistently at top throughout all beats)
  const echoEl = $('reaction-choice-text');
  echoEl.innerHTML = `<strong>${escapeAndFormat(choice.reactionHeader)}</strong>`;

  showGameView('reaction');
  renderReactionBeat();
}

function renderReactionBeat() {
  const textEl  = $('reaction-beat-text');
  const advBtn  = $('reaction-advance-btn');
  const backBtn = $('reaction-back-btn');

  const { bubbleItems, narrativeHtml } = collectBeats(reactionBeats, reactionBeatIndex);
  reactionPageStart = renderWithFit(textEl, bubbleItems, narrativeHtml, reactionPageStart);
  playBeatAudio(`reaction-${reactionChoiceScene}-${reactionChoiceLetter}-${reactionBeatIndex}.mp3`, textEl);

  if (backBtn) {
    backBtn.style.display = reactionBeatIndex > 0 ? 'flex' : 'none';
    backBtn.onclick = () => { reactionBeatIndex--; reactionPageStart = 0; renderReactionBeat(); };
  }

  const isLast = reactionBeatIndex >= reactionBeats.length - 1;
  if (isLast) {
    advBtn.onclick = () => loadScene(reactionNextScene);
  } else {
    advBtn.onclick = () => {
      reactionBeatIndex++;
      renderReactionBeat();
    };
  }
}

// ─── Utility ─────────────────────────────────────────────────────────────────
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAndFormat(text) {
  return escapeHtml(text).replace(/\n/g, '<br>');
}

// ─── Dialogue detection regexes ──────────────────────────────────────────────
// 1. Pure: CHARACTER: "text"
const PURE_DIALOGUE_RE  = /^([A-Z]{2,}(?:\s+[A-Z]+)*):\s*"?(.+?)"?\s*$/;
// 2. Inline: context[: . , !] "speech" [trailing]
const INLINE_SPEECH_RE  = /^(.*?\S)\s*([:.,!])\s*"(.+?)"(.*)$/;
// 3. Standalone: "text" (entire beat is quoted)
const STANDALONE_QUOTE_RE = /^"(.+)"$/;

function makeBubble(side, character, speech) {
  const nameHtml = character
    ? `<span class="bubble-name">${escapeHtml(character)}</span>`
    : '';
  return `<div class="bubble bubble-${side}">${nameHtml}<span class="bubble-speech">${escapeAndFormat(speech)}</span></div>`;
}

function renderBeatHTML(rawText) {
  const trimmed = rawText.trim();
  if (!trimmed) return '';

  // 1. Pure named dialogue: "CHARACTER: text"
  const pure = trimmed.match(PURE_DIALOGUE_RE);
  if (pure) {
    return makeBubble(pure[1] === 'YOU' ? 'right' : 'left', pure[1], pure[2].trim());
  }

  // 2. Inline speech: narrative context + quoted speech
  const inline = trimmed.match(INLINE_SPEECH_RE);
  if (inline) {
    const context  = inline[1].trim();
    const punct    = inline[2];
    const speech   = inline[3].trim();
    const trailing = (inline[4] || '').trim();
    const side     = /^you\b/i.test(context) ? 'right' : 'left';
    let html = `<p class="beat-plain">${escapeAndFormat(context)}${escapeHtml(punct)}</p>`;
    html += makeBubble(side, null, speech);
    if (trailing) html += `<p class="beat-plain">${escapeAndFormat(trailing)}</p>`;
    return html;
  }

  // 3. Quote-first: "speech" narrative trailing  (e.g. "Are they bad?" Your son asks.)
  const quoteFront = trimmed.match(/^"(.+?)"\s+(.+)$/);
  if (quoteFront) {
    const speech   = quoteFront[1].trim();
    const trailing = quoteFront[2].trim();
    const side     = /^you\b/i.test(trailing) ? 'right' : 'left';
    return makeBubble(side, null, speech) + `<p class="beat-plain">${escapeAndFormat(trailing)}</p>`;
  }

  // 4. Standalone quoted line: "text"
  const standalone = trimmed.match(STANDALONE_QUOTE_RE);
  if (standalone) {
    const side = /^you\b/i.test(standalone[1]) ? 'right' : 'left';
    return makeBubble(side, null, standalone[1]);
  }

  // 4. Plain narrative
  return `<p class="beat-plain">${escapeAndFormat(trimmed)}</p>`;
}

// Group an array into chunks of `size` (last chunk may be smaller)
function groupParagraphs(arr, size) {
  const groups = [];
  for (let i = 0; i < arr.length; i += size) {
    groups.push(arr.slice(i, i + size));
  }
  return groups;
}

// Walk beats 0..upToIndex, separate bubbles (accumulate) from narrative (current beat only)
function collectBeats(beats, upToIndex) {
  const bubbleItems = [];
  let narrativeHtml = '';

  for (let i = 0; i <= upToIndex; i++) {
    const group = beats[i] || [];
    let groupNarrative = '';

    for (const p of group) {
      const trimmed = p.trim();
      if (!trimmed) continue;
      const html = renderBeatHTML(trimmed);
      if (html.includes('class="bubble')) {
        // Whole item (context paragraph + bubble) treated as one bubble unit
        bubbleItems.push(`<div class="beat-bubble-item">${html}</div>`);
      } else {
        groupNarrative += html;
      }
    }

    // Only keep narrative from the current (newest) beat
    if (i === upToIndex) narrativeHtml = groupNarrative;
  }

  return { bubbleItems, narrativeHtml };
}

// Render bubbles + narrative into textEl.
// Accumulate until full, then start a fresh page from the newest bubble.
// Returns updated pageStart for the caller to store.
function renderWithFit(textEl, bubbleItems, narrativeHtml, pageStart) {
  const narrativeEl = narrativeHtml
    ? `<div class="beat-narrative">${narrativeHtml}</div>`
    : '';

  // Try rendering all accumulated bubbles from current page start
  textEl.innerHTML = bubbleItems.slice(pageStart).join('') + narrativeEl;
  if (textEl.scrollHeight <= textEl.clientHeight + 2) return pageStart;

  // Overflows — fresh page starting from the newest bubble
  const newPageStart = Math.max(bubbleItems.length - 1, 0);
  textEl.innerHTML = (bubbleItems[newPageStart] || '') + narrativeEl;
  return newPageStart;
}

// ─── localStorage — Reflections ──────────────────────────────────────────────
const STORAGE_KEY_PRE  = 'birmingham_pre_reflections';
const STORAGE_KEY_POST = 'birmingham_post_reflections';

function loadReflections(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; }
  catch { return []; }
}

function saveReflection(key, text) {
  if (!text.trim()) return;
  const existing = loadReflections(key);
  existing.push({ text: text.trim(), timestamp: Date.now() });
  try { localStorage.setItem(key, JSON.stringify(existing)); }
  catch (e) { console.warn('Could not save to localStorage:', e); }
}

// ─── Gallery ─────────────────────────────────────────────────────────────────
function openGalleryDetail(labelText, bodyText) {
  $('gallery-detail-label').textContent = labelText;
  $('gallery-detail-text').textContent  = bodyText;
  openModal('gallery-detail-modal');
}

function renderGallery() {
  const container = $('gallery-posts');
  container.innerHTML = '';
  const reflections = loadReflections(STORAGE_KEY_PRE);

  if (reflections.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'gallery-empty';
    empty.textContent = 'No reflections posted yet. Be the first!';
    container.appendChild(empty);
    return;
  }

  reflections.forEach((entry, i) => {
    const labelText = `Anonymous · Response ${i + 1}`;

    const card = document.createElement('div');
    card.className = 'gallery-post-card sketchy';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `${labelText} — click to read full reflection`);

    const label = document.createElement('p');
    label.className = 'gallery-post-label';
    label.textContent = labelText;

    const body = document.createElement('p');
    body.className = 'gallery-post-body';
    body.textContent = entry.text;

    const hint = document.createElement('p');
    hint.className = 'gallery-read-more';
    hint.textContent = 'Read more…';

    card.appendChild(label);
    card.appendChild(body);
    card.appendChild(hint);

    const open = () => openGalleryDetail(labelText, entry.text);
    card.addEventListener('click', open);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });

    container.appendChild(card);
  });
}

// ─── Character Counter ────────────────────────────────────────────────────────
function attachCharCounter(textareaId, counterId, limit) {
  const ta  = $(textareaId);
  const cnt = $(counterId);
  if (!ta || !cnt) return;
  const update = () => {
    const len = ta.value.length;
    cnt.textContent = len;
    cnt.style.color = len >= limit ? '#c00' : '';
  };
  ta.addEventListener('input', update);
  update();
}

// ─── Accessibility ────────────────────────────────────────────────────────────
function applyAccessibility() {
  document.body.classList.toggle('high-contrast', state.accessibilityHighContrast);
}

function setupToggle(toggleId, stateKey, callback) {
  const el = $(toggleId);
  if (!el) return;

  const update = () => {
    el.classList.toggle('on', state[stateKey]);
    el.setAttribute('aria-checked', String(state[stateKey]));
  };
  update();

  const toggle = () => {
    state[stateKey] = !state[stateKey];
    update();
    applyAccessibility();
    if (callback) callback(state[stateKey]);
  };
  el.addEventListener('click', toggle);
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
  });
}

// ─── Modal Helpers ────────────────────────────────────────────────────────────
function openModal(id)  { $(id).classList.remove('hidden'); }
function closeModal(id) { $(id).classList.add('hidden'); }

// ─── Narration — pre-generated audio + Web Speech fallback ───────────────────
// Drop .mp3 files into the audio/ folder (see audio/README.md for filenames).
// If a file is missing the engine falls back to the browser's speech synthesis.
let narrationOn   = false;
let _currentAudio = null;  // fresh Audio() per play — avoids Chrome autoplay blocks

// Web Speech fallback voice selection
let _selectedVoice = null;
const PREFERRED_VOICES = ['Google US English', 'Samantha', 'Alex'];

function pickVoice() {
  if (!window.speechSynthesis) return;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return;
  for (const name of PREFERRED_VOICES) {
    const v = voices.find(v => v.name === name);
    if (v) { _selectedVoice = v; return; }
  }
  _selectedVoice = voices.find(v => v.lang === 'en-US') || voices[0] || null;
}

// Stop both the HTML audio element and any Web Speech in progress
function stopAllAudio() {
  if (_currentAudio) { _currentAudio.pause(); _currentAudio = null; }
  if (window.speechSynthesis) window.speechSynthesis.cancel();
}

// Web Speech fallback (used when audio file is missing)
function speakRaw(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  text = (text || '').trim().replace(/\s+/g, ' ');
  if (!text) return;
  const utt = new SpeechSynthesisUtterance(text);
  if (_selectedVoice) utt.voice = _selectedVoice;
  utt.rate  = 0.92;
  utt.pitch = 1;
  window.speechSynthesis.speak(utt);
}

// Play a pre-generated audio file; fall back to Web Speech if missing/error.
// Creates a fresh Audio each call so Chrome doesn't block it as "autoplay".
function playBeatAudio(filename, fallbackEl) {
  if (!narrationOn) return;
  stopAllAudio();
  const audio = new Audio(`audio/${filename}`);
  _currentAudio = audio;
  audio.play().catch(err => {
    console.warn('Audio play failed:', filename, err.name, err.message);
    speakRaw((fallbackEl.textContent || '').trim().replace(/\s+/g, ' '));
  });
}

// Narrate the full history screen using audio/history.mp3
function narrateHistory() {
  if (!narrationOn) return;
  stopAllAudio();
  const audio = new Audio('audio/history.mp3');
  _currentAudio = audio;
  audio.play().catch(() => {
    const el = document.querySelector('#history-screen .history-columns');
    if (el) speakRaw((el.textContent || '').trim().replace(/\s+/g, ' '));
  });
}

// Alias kept for showScreen compatibility
function stopSpeaking() { stopAllAudio(); }

function updateNarrationBtn() {
  const btn = $('narration-btn');
  btn.setAttribute('aria-pressed', String(narrationOn));
  btn.classList.toggle('narration-active', narrationOn);
  $('narration-icon-on').style.display  = narrationOn ? ''     : 'none';
  $('narration-icon-off').style.display = narrationOn ? 'none' : '';
  // Show replay buttons only when narration is on
  ['story-replay-btn', 'reaction-replay-btn', 'history-replay-btn'].forEach(id => {
    const el = $(id);
    if (el) el.style.display = narrationOn ? '' : 'none';
  });
}

// ─── Init ─────────────────────────────────────────────────────────────────────
function init() {
  showScreen('title');

  attachCharCounter('pre-reflection-textarea', 'pre-char-count', 350);
  attachCharCounter('end-reflection-textarea', 'end-char-count', 350);

  // Accessibility toggles
  setupToggle('high-contrast-toggle', 'accessibilityHighContrast');

  // Settings toggles — sound + timer
  // Sound starts ON
  state.soundEnabled = true;
  setupToggle('sound-toggle', 'soundEnabled');

  // Timer starts ON — toggle also restarts timer if on choice screen
  state.timerEnabled = true;
  setupToggle('timer-toggle', 'timerEnabled', (isOn) => {
    if (!isOn) {
      clearChoiceTimer();
    } else if (pendingChoiceScene) {
      startChoiceTimer(pendingChoiceScene);
    }
  });

  // ── Voice setup ────────────────────────────────────────────
  pickVoice();
  if (window.speechSynthesis) window.speechSynthesis.addEventListener('voiceschanged', pickVoice);

  // ── Narration toggle ──────────────────────────────────────
  $('narration-btn').addEventListener('click', () => {
    narrationOn = !narrationOn;
    updateNarrationBtn();
    if (!narrationOn) {
      stopSpeaking();
    } else {
      // Immediately read whatever is currently on screen
      if (!$('game-screen').classList.contains('hidden')) {
        if (!$('story-view').classList.contains('hidden')) {
          playBeatAudio(`scene-${state.currentSceneId}-${storyBeatIndex}.mp3`, $('story-beat-text'));
        } else if (!$('reaction-view').classList.contains('hidden')) {
          playBeatAudio(`reaction-${reactionChoiceScene}-${reactionChoiceLetter}-${reactionBeatIndex}.mp3`, $('reaction-beat-text'));
        }
      } else if (!$('history-screen').classList.contains('hidden')) {
        narrateHistory();
      }
    }
  });

  // ── Replay buttons ────────────────────────────────────────
  $('story-replay-btn').addEventListener('click', () =>
    playBeatAudio(`scene-${state.currentSceneId}-${storyBeatIndex}.mp3`, $('story-beat-text')));
  $('reaction-replay-btn').addEventListener('click', () =>
    playBeatAudio(`reaction-${reactionChoiceScene}-${reactionChoiceLetter}-${reactionBeatIndex}.mp3`, $('reaction-beat-text')));
  $('history-replay-btn').addEventListener('click', narrateHistory);

  // ── Title ──────────────────────────────────────────────────
  $('start-btn').addEventListener('click', () => showScreen('history'));

  // ── Historical Context ────────────────────────────────────
  $('history-continue-btn').addEventListener('click', () => showScreen('charSelect'));

  // ── Character Select ──────────────────────────────────────
  $('select-character-btn').addEventListener('click', () => showScreen('charName'));

  // ── Character Name ────────────────────────────────────────
  $('back-to-character-btn').addEventListener('click', () => showScreen('charSelect'));

  $('confirm-name-btn').addEventListener('click', () => {
    state.playerName = $('character-name-input').value.trim() || 'The Officer';
    showScreen('preReflection');
  });

  $('character-name-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') $('confirm-name-btn').click();
  });

  // ── Pre-Reflection ────────────────────────────────────────
  $('pre-post-btn').addEventListener('click', () => {
    const text = $('pre-reflection-textarea').value;
    if (text.trim()) {
      saveReflection(STORAGE_KEY_PRE, text);
      $('pre-reflection-textarea').value = '';
      $('pre-char-count').textContent = '0';
    }
    renderGallery();
    showScreen('gallery');
  });

  $('pre-continue-btn').addEventListener('click', () => {
    renderGallery();
    showScreen('gallery');
  });

  // ── Gallery ───────────────────────────────────────────────
  $('gallery-start-btn').addEventListener('click', () => loadScene('context'));

  // ── End Reflection ────────────────────────────────────────
  $('end-post-btn').addEventListener('click', () => {
    const text = $('end-reflection-textarea').value;
    if (text.trim()) {
      saveReflection(STORAGE_KEY_POST, text);
      $('end-reflection-textarea').value = '';
      $('end-char-count').textContent = '0';
    }
    showScreen('learnMore');
  });

  $('end-continue-btn').addEventListener('click', () => showScreen('learnMore'));

  // ── Learn More / Works Cited ──────────────────────────────
  function resetToTitle() {
    state.playerName     = '';
    state.currentSceneId = null;
    $('character-name-input').value    = '';
    $('pre-reflection-textarea').value = '';
    $('pre-char-count').textContent    = '0';
    $('end-reflection-textarea').value = '';
    $('end-char-count').textContent    = '0';
    showScreen('title');
  }

  $('learn-more-title-btn').addEventListener('click', resetToTitle);
  $('works-cited-title-btn').addEventListener('click', resetToTitle);
  $('learn-more-works-btn').addEventListener('click', () => showScreen('worksCited'));
  $('works-cited-learn-btn').addEventListener('click', () => showScreen('learnMore'));

  $('title-learn-more-btn').addEventListener('click', () => showScreen('learnMore'));
  $('title-works-cited-btn').addEventListener('click', () => showScreen('worksCited'));

  // ── Settings modal ────────────────────────────────────────
  $('settings-btn').addEventListener('click', () => openModal('settings-modal'));
  $('close-settings-btn').addEventListener('click', () => closeModal('settings-modal'));

  $('restart-game-btn').addEventListener('click', () => {
    closeModal('settings-modal');
    state.currentSceneId = null;
    loadScene('context');
  });

  $('settings-title-btn').addEventListener('click', () => {
    closeModal('settings-modal');
    state.playerName = '';
    state.currentSceneId = null;
    showScreen('title');
  });

  $('settings-learn-more-btn').addEventListener('click', () => {
    closeModal('settings-modal');
    showScreen('learnMore');
  });

  $('settings-works-cited-btn').addEventListener('click', () => {
    closeModal('settings-modal');
    showScreen('worksCited');
  });

  $('settings-modal').addEventListener('click', e => {
    if (e.target === $('settings-modal')) closeModal('settings-modal');
  });


  // ── Gallery detail modal ──────────────────────────────────
  $('close-gallery-detail-btn').addEventListener('click', () => closeModal('gallery-detail-modal'));
  $('gallery-detail-modal').addEventListener('click', e => {
    if (e.target === $('gallery-detail-modal')) closeModal('gallery-detail-modal');
  });

  // ── Escape closes modals ──────────────────────────────────
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal('settings-modal');
      closeModal('gallery-detail-modal');
    }
  });

  // ── Keyboard: Space/Enter/→ advances story or reaction beats ──
  document.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'ArrowRight') return;
    const gameScreen = $('game-screen');
    if (gameScreen.classList.contains('hidden')) return;

    if (!$('story-view').classList.contains('hidden')) {
      e.preventDefault();
      $('story-advance-btn').click();
    } else if (!$('reaction-view').classList.contains('hidden')) {
      e.preventDefault();
      $('reaction-advance-btn').click();
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
