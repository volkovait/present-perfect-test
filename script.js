const STORAGE_KEY = 'presentPerfectTest';

const botToken = '8543757949:AAHkb7EeGKgHpNsH7DJN0sc3jgoM-3U4Ibg';
const chatId = '385632170';

const timeMarkers = [
  { en: 'ever', ru: 'когда-либо' },
  { en: 'never', ru: 'никогда' },
  { en: 'just', ru: 'только что' },
  { en: 'already', ru: 'уже' },
  { en: 'yet', ru: 'ещё (в отрицании и вопросах)' },
];

const gapQuestions = [
  {
    id: 'gap-1',
    prompt: 'She ___ (already / finish) her homework.',
    bracket: 'already / finish',
    answers: ['has already finished', "'s already finished"],
    displayCorrect: 'has already finished',
  },
  {
    id: 'gap-2',
    prompt: 'They ___ (never / be) to Japan.',
    bracket: 'never / be',
    answers: ['have never been', "'ve never been"],
    displayCorrect: 'have never been',
  },
  {
    id: 'gap-3',
    prompt: 'I ___ (never / see) this film.',
    bracket: 'never / see',
    answers: ['have never seen', "'ve never seen"],
    displayCorrect: 'have never seen',
  },
  {
    id: 'gap-4',
    prompt: 'He ___ (just / leave) the office.',
    bracket: 'just / leave',
    answers: ['has just left', "'s just left"],
    displayCorrect: 'has just left',
  },
  {
    id: 'gap-5',
    prompt: 'We ___ (already / learn) fifty new words.',
    bracket: 'already / learn',
    answers: ['have already learned', 'have already learnt', "'ve already learned", "'ve already learnt"],
    displayCorrect: 'have already learned',
  },
  {
    id: 'gap-6',
    prompt: 'It ___ (just / stop) raining.',
    bracket: 'just / stop',
    answers: ['has just stopped', "'s just stopped"],
    displayCorrect: 'has just stopped',
  },
  {
    id: 'gap-7',
    prompt: 'My sister ___ (just / start) working here.',
    bracket: 'just / start',
    answers: ['has just started', "'s just started"],
    displayCorrect: 'has just started',
  },
  {
    id: 'gap-8',
    prompt: 'The children ___ (already / eat) all the cookies.',
    bracket: 'already / eat',
    answers: ['have already eaten', "'ve already eaten"],
    displayCorrect: 'have already eaten',
  },
  {
    id: 'gap-9',
    prompt: 'Look! Someone ___ (just / break) the window.',
    bracket: 'just / break',
    answers: ['has just broken', "'s just broken"],
    displayCorrect: 'has just broken',
  },
  {
    id: 'gap-10',
    prompt: 'I ___ (just / lose) my keys.',
    bracket: 'just / lose',
    answers: ['have just lost', "'ve just lost"],
    displayCorrect: 'have just lost',
  },
  {
    id: 'gap-11',
    prompt: 'She ___ (not / call) me yet.',
    bracket: 'not / call',
    answers: ['has not called', 'hasnt called', "hasn't called", "'s not called"],
    displayCorrect: 'has not called',
  },
  {
    id: 'gap-12',
    prompt: 'We ___ (not / finish) the project yet.',
    bracket: 'not / finish',
    answers: ['have not finished', 'havent finished', "haven't finished", "'ve not finished"],
    displayCorrect: 'have not finished',
  },
  {
    id: 'gap-13',
    prompt: '___ (you / ever / be) to Paris?',
    bracket: 'you / ever / be',
    answers: ['have you ever been'],
    displayCorrect: 'Have you ever been',
  },
  {
    id: 'gap-14',
    prompt: 'What ___ (you / already / do) today?',
    bracket: 'you / already / do',
    answers: ['have you already done', "'ve you already done"],
    displayCorrect: 'have you already done',
  },
  {
    id: 'gap-15',
    prompt: '___ (they / ever / meet) before?',
    bracket: 'they / ever / meet',
    answers: ['have they ever met', "'ve they ever met"],
    displayCorrect: 'Have they ever met',
  },
];

const orderQuestions = [
  {
    id: 'order-1',
    words: ['already', 'finished', 'have', 'I', 'my', 'work', '.'],
    correct: ['I', 'have', 'already', 'finished', 'my', 'work', '.'],
    displayCorrect: 'I have already finished my work.',
  },
  {
    id: 'order-2',
    words: ['called', 'not', 'She', 'has', 'yet', '.'],
    correct: ['She', 'has', 'not', 'called', 'yet', '.'],
    displayCorrect: 'She has not called yet.',
    altCorrect: [['She', "'s", 'not', 'called', 'yet', '.']],
  },
  {
    id: 'order-3',
    words: ['never', 'have', 'They', 'abroad', 'lived', '.'],
    correct: ['They', 'have', 'never', 'lived', 'abroad', '.'],
    displayCorrect: 'They have never lived abroad.',
  },
  {
    id: 'order-4',
    words: ['ever', 'you', 'Have', 'sushi', 'tried', '?'],
    correct: ['Have', 'you', 'ever', 'tried', 'sushi', '?'],
    displayCorrect: 'Have you ever tried sushi?',
  },
  {
    id: 'order-5',
    words: ['just', 'has', 'He', 'lost', 'the', 'keys', '.'],
    correct: ['He', 'has', 'just', 'lost', 'the', 'keys', '.'],
    displayCorrect: 'He has just lost the keys.',
  },
];

let formSubmitted = false;

function normalizeAnswer(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[?.!]+$/g, '')
    .replace(/\s+/g, ' ')
    .replace(/['']/g, "'")
    .replace(/\bhasnt\b/g, "hasn't")
    .replace(/\bhavent\b/g, "haven't");
}

function shuffleArray(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveState(partial) {
  const current = loadState();
  const next = { ...current, ...partial };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function renderMarkers() {
  const list = document.getElementById('markers-list');
  timeMarkers.forEach((marker) => {
    const item = document.createElement('li');
    item.innerHTML = `<span class="marker-en">${marker.en}</span><span class="marker-ru">${marker.ru}</span>`;
    list.appendChild(item);
  });
}

function renderGapQuestions() {
  const container = document.getElementById('gap-questions');
  const saved = loadState();

  gapQuestions.forEach((question, index) => {
    const item = document.createElement('li');
    item.className = 'question-item';
    item.dataset.questionId = question.id;

    const promptText = question.prompt.replace('___', '<span class="blank">      </span>');

    item.innerHTML = `
      <p class="question-prompt">${promptText}</p>
      <input
        type="text"
        class="gap-input"
        id="${question.id}"
        name="${question.id}"
        autocomplete="off"
        aria-label="Ответ ${index + 1}"
      >
    `;

    container.appendChild(item);

    const input = item.querySelector('.gap-input');
    if (saved[question.id]) {
      input.value = saved[question.id];
    }

    input.addEventListener('input', () => {
      if (!formSubmitted) {
        saveState({ [question.id]: input.value });
      }
    });
  });
}

function getOrderExerciseZones(chip) {
  const exercise = chip.closest('.order-exercise');
  if (!exercise) return null;
  return {
    bank: exercise.querySelector('.word-bank'),
    zone: exercise.querySelector('.order-zone'),
  };
}

function moveChipBetweenZones(chip, targetZone) {
  const sourceZone = chip.parentElement;
  if (!sourceZone || sourceZone === targetZone || formSubmitted) return;

  targetZone.appendChild(chip);
  saveOrderAnswers();

  if (sourceZone.classList.contains('word-bank') && sourceZone.children.length === 0) {
    sourceZone.style.minHeight = '2.75rem';
  }
}

function toggleChipPlacementByTap(chip) {
  const zones = getOrderExerciseZones(chip);
  if (!zones) return;

  const parent = chip.parentElement;
  if (parent === zones.bank) {
    moveChipBetweenZones(chip, zones.zone);
  } else if (parent === zones.zone) {
    moveChipBetweenZones(chip, zones.bank);
  }
}

function createWordChip(word, sourceZone) {
  const chip = document.createElement('span');
  chip.className = 'word-chip';
  chip.textContent = word;
  chip.draggable = true;
  chip.dataset.word = word;
  chip.title = 'Нажмите, чтобы перенести слово';

  let suppressTapAfterDrag = false;

  chip.addEventListener('dragstart', (event) => {
    if (formSubmitted) {
      event.preventDefault();
      return;
    }
    suppressTapAfterDrag = true;
    chip.classList.add('dragging');
    event.dataTransfer.setData('text/plain', word);
    event.dataTransfer.setData('application/x-source-id', sourceZone.id);
    event.dataTransfer.effectAllowed = 'move';
  });

  chip.addEventListener('dragend', () => {
    chip.classList.remove('dragging');
    saveOrderAnswers();
    window.setTimeout(() => {
      suppressTapAfterDrag = false;
    }, 0);
  });

  chip.addEventListener('click', (event) => {
    if (formSubmitted || suppressTapAfterDrag) return;
    event.preventDefault();
    toggleChipPlacementByTap(chip);
  });

  return chip;
}

function setupDropZone(zone) {
  zone.addEventListener('dragover', (event) => {
    if (formSubmitted) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  });

  zone.addEventListener('drop', (event) => {
    if (formSubmitted) return;
    event.preventDefault();
    const sourceId = event.dataTransfer.getData('application/x-source-id');
    const sourceZone = document.getElementById(sourceId);
    const draggingChip = document.querySelector('.word-chip.dragging');

    if (!draggingChip || !sourceZone) return;

    moveChipBetweenZones(draggingChip, zone);
  });
}

function getZoneWords(zone) {
  return [...zone.querySelectorAll('.word-chip')].map((chip) => chip.dataset.word);
}

function saveOrderAnswers() {
  const orderAnswers = {};
  orderQuestions.forEach((question) => {
    const zone = document.getElementById(`${question.id}-zone`);
    orderAnswers[question.id] = getZoneWords(zone);
  });
  saveState({ orderAnswers });
}

function restoreOrderAnswers(question, bank, zone) {
  const saved = loadState();
  const savedWords = saved.orderAnswers?.[question.id];
  if (!savedWords || savedWords.length === 0) return;

  savedWords.forEach((word) => {
    const chipInBank = [...bank.querySelectorAll('.word-chip')].find((chip) => chip.dataset.word === word);
    const chipInZone = [...zone.querySelectorAll('.word-chip')].find((chip) => chip.dataset.word === word);
    const chip = chipInBank || chipInZone;
    if (chip) {
      zone.appendChild(chip);
    }
  });
}

function renderOrderQuestions() {
  const container = document.getElementById('order-questions');

  orderQuestions.forEach((question) => {
    const item = document.createElement('li');
    item.className = 'question-item order-exercise';
    item.dataset.questionId = question.id;

    const bankId = `${question.id}-bank`;
    const zoneId = `${question.id}-zone`;

    item.innerHTML = `
      <p class="question-prompt">Составьте предложение:</p>
      <p class="word-bank-label">Слова</p>
      <p class="order-zone-label">Ваш ответ</p>
    `;

    const bankEl = document.createElement('div');
    bankEl.className = 'word-bank';
    bankEl.id = bankId;

    const zoneEl = document.createElement('div');
    zoneEl.className = 'order-zone';
    zoneEl.id = zoneId;

    const zoneLabel = item.querySelector('.order-zone-label');
    item.insertBefore(bankEl, zoneLabel);
    item.appendChild(zoneEl);

    container.appendChild(item);

    shuffleArray(question.words).forEach((word) => {
      bankEl.appendChild(createWordChip(word, bankEl));
    });

    setupDropZone(bankEl);
    setupDropZone(zoneEl);

    restoreOrderAnswers(question, bankEl, zoneEl);
  });
}

function checkGapAnswer(question, userValue) {
  const normalized = normalizeAnswer(userValue);
  return question.answers.some((answer) => normalizeAnswer(answer) === normalized);
}

function arraysEqual(first, second) {
  if (first.length !== second.length) return false;
  return first.every((value, index) => value === second[index]);
}

function checkOrderAnswer(question, userWords) {
  if (arraysEqual(userWords, question.correct)) return true;
  if (question.altCorrect) {
    return question.altCorrect.some((variant) => arraysEqual(userWords, variant));
  }
  return false;
}

function getAllQuestionResults() {
  const results = [];
  let questionNumber = 0;

  gapQuestions.forEach((question) => {
    questionNumber += 1;
    const input = document.getElementById(question.id);
    const userValue = input.value.trim();
    const isCorrect = checkGapAnswer(question, userValue);
    results.push({
      number: questionNumber,
      correct: question.displayCorrect,
      student: userValue || '—',
      isCorrect,
    });
  });

  orderQuestions.forEach((question) => {
    questionNumber += 1;
    const zone = document.getElementById(`${question.id}-zone`);
    const userWords = getZoneWords(zone);
    const studentSentence = userWords.length > 0 ? userWords.join(' ') : '—';
    const isCorrect = checkOrderAnswer(question, userWords);
    results.push({
      number: questionNumber,
      correct: question.displayCorrect,
      student: studentSentence,
      isCorrect,
    });
  });

  return results;
}

function applyVisualFeedback(results) {
  gapQuestions.forEach((question, index) => {
    const input = document.getElementById(question.id);
    const result = results[index];
    input.classList.add(result.isCorrect ? 'correct' : 'incorrect');
  });

  orderQuestions.forEach((question, index) => {
    const zone = document.getElementById(`${question.id}-zone`);
    const result = results[gapQuestions.length + index];
    zone.classList.add(result.isCorrect ? 'correct' : 'incorrect');
  });
}

async function collectBrowserMetadata() {
  const timezoneOptions = Intl.DateTimeFormat().resolvedOptions();
  const pageUrl = new URL(window.location.href);
  const urlParams = Object.fromEntries(pageUrl.searchParams.entries());

  const metadata = {
    submittedAt: new Date().toISOString(),
    pageUrl: pageUrl.href,
    urlParams,
    hash: pageUrl.hash || undefined,
    referrer: document.referrer || undefined,
    language: navigator.language,
    languages: navigator.languages ? [...navigator.languages] : [],
    timezone: timezoneOptions.timeZone,
    timezoneOffsetMinutes: new Date().getTimezoneOffset(),
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    vendor: navigator.vendor,
    cookieEnabled: navigator.cookieEnabled,
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemory: navigator.deviceMemory,
    maxTouchPoints: navigator.maxTouchPoints,
    screen: {
      width: screen.width,
      height: screen.height,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight,
      colorDepth: screen.colorDepth,
      pixelRatio: window.devicePixelRatio,
    },
    viewport: {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
    },
    localStorageKeys: Object.keys(localStorage),
    sessionStorageKeys: Object.keys(sessionStorage),
  };

  if (navigator.connection) {
    metadata.connection = {
      effectiveType: navigator.connection.effectiveType,
      downlink: navigator.connection.downlink,
      rtt: navigator.connection.rtt,
    };
  }

  if (navigator.userAgentData) {
    try {
      metadata.clientHints = {
        brands: navigator.userAgentData.brands,
        mobile: navigator.userAgentData.mobile,
        platform: navigator.userAgentData.platform,
        ...(await navigator.userAgentData.getHighEntropyValues([
          'architecture',
          'model',
          'platform',
          'platformVersion',
          'uaFullVersion',
          'fullVersionList',
        ])),
      };
    } catch {
      metadata.clientHints = {
        brands: navigator.userAgentData.brands,
        mobile: navigator.userAgentData.mobile,
        platform: navigator.userAgentData.platform,
      };
    }
  }

  return metadata;
}

function formatUtcOffset(offsetMinutes) {
  const hours = -offsetMinutes / 60;
  const sign = hours >= 0 ? '+' : '';
  return `UTC${sign}${hours}`;
}

function formatMetadataForTelegram(metadata) {
  const lines = [
    `Время отправки: ${metadata.submittedAt}`,
    `Страница: ${metadata.pageUrl}`,
  ];

  if (metadata.hash) {
    lines.push(`Hash: ${metadata.hash}`);
  }

  if (Object.keys(metadata.urlParams).length > 0) {
    lines.push(`Параметры URL: ${JSON.stringify(metadata.urlParams)}`);
  }

  if (metadata.referrer) {
    lines.push(`Referrer: ${metadata.referrer}`);
  }

  lines.push(
    `Язык: ${metadata.language}`,
    `Языки (приоритет): ${metadata.languages.join(', ') || '—'}`,
    `Часовой пояс: ${metadata.timezone} (${formatUtcOffset(metadata.timezoneOffsetMinutes)})`,
    `User-Agent: ${metadata.userAgent}`,
    `Платформа: ${metadata.platform || '—'}`,
    `Vendor: ${metadata.vendor || '—'}`,
    `Экран: ${metadata.screen.width}×${metadata.screen.height} (доступно ${metadata.screen.availWidth}×${metadata.screen.availHeight}, DPR ${metadata.screen.pixelRatio})`,
    `Окно: ${metadata.viewport.innerWidth}×${metadata.viewport.innerHeight}`,
    `CPU (потоки): ${metadata.hardwareConcurrency ?? '—'}`,
    `RAM (ГБ, оценка): ${metadata.deviceMemory ?? '—'}`,
    `Touch points: ${metadata.maxTouchPoints ?? 0}`,
    `Cookies: ${metadata.cookieEnabled ? 'да' : 'нет'}`,
    `localStorage ключи: ${metadata.localStorageKeys.join(', ') || '—'}`,
    `sessionStorage ключи: ${metadata.sessionStorageKeys.join(', ') || '—'}`
  );

  if (metadata.connection) {
    lines.push(
      `Сеть: ${metadata.connection.effectiveType ?? '—'}, downlink ${metadata.connection.downlink ?? '—'}`
    );
  }

  if (metadata.clientHints) {
    lines.push(`Client Hints: ${JSON.stringify(metadata.clientHints)}`);
  }

  return lines.join('\n');
}

function buildTelegramMessage(score, maxScore, results, metadata) {
  const header = `<b>Present Perfect — тест</b>\nОбщий балл: ${score} из ${maxScore}.\n\n`;

  const rows = results.map((row) => {
    const correctCell = escapeHtml(row.correct);
    let studentCell = escapeHtml(row.student);
    studentCell += row.isCorrect ? ' ✅' : ' ❌';
    return `${row.number} | ${correctCell} | ${studentCell}`;
  });

  const table = `<pre>№ | Правильный ответ | Ответ студента\n${rows.join('\n')}</pre>`;
  const metaBlock = `<b>Метаданные браузера</b>\n<pre>${escapeHtml(formatMetadataForTelegram(metadata))}</pre>`;
  return header + table + '\n\n' + metaBlock;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function sendToTelegram(message) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || `HTTP ${response.status}`);
  }

  return response.json();
}

function sendResultsToTelegramSilently(score, maxScore, results) {
  void (async () => {
    try {
      const metadata = await collectBrowserMetadata();
      const message = buildTelegramMessage(score, maxScore, results, metadata);
      await sendToTelegram(message);
    } catch (error) {
      console.error(error);
    }
  })();
}

function lockForm() {
  formSubmitted = true;
  document.getElementById('test-form').classList.add('form-locked');
  document.getElementById('submit-btn').disabled = true;

  document.querySelectorAll('.gap-input').forEach((input) => {
    input.readOnly = true;
  });

  document.querySelectorAll('.word-chip').forEach((chip) => {
    chip.draggable = false;
  });
}

async function handleSubmit(event) {
  event.preventDefault();

  const results = getAllQuestionResults();
  const score = results.filter((row) => row.isCorrect).length;
  const maxScore = results.length;

  applyVisualFeedback(results);
  lockForm();

  const resultsCard = document.getElementById('results-card');
  const finalScore = document.getElementById('final-score');
  const scorePreview = document.getElementById('score-preview');

  resultsCard.hidden = false;
  finalScore.textContent = `Ваш результат: ${score} из ${maxScore} баллов.`;
  scorePreview.hidden = false;
  scorePreview.textContent = `Набрано баллов: ${score} / ${maxScore}`;

  sendResultsToTelegramSilently(score, maxScore, results);

  resultsCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function init() {
  renderMarkers();
  renderGapQuestions();
  renderOrderQuestions();

  document.getElementById('test-form').addEventListener('submit', handleSubmit);
}

document.addEventListener('DOMContentLoaded', init);
