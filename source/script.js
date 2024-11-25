import messages from './data/messages.json';

const { variations, subtitles } = messages;

const CONFIG = {
  MESSAGES_START: 3,
  PATH_SEGMENT: 'recursion-explained',
  ANIMATION_DELAYS: {
    OVERLAY: 300,
    ZOOM: 500,
  },
  CURSOR_EASING: 0.08,
};

const elements = {
  content: document.querySelector('[data-content]'),
  overlay: document.querySelector('[data-overlay]'),
  cursor: document.querySelector('[data-cursor]'),
  clickCounter: document.querySelector('[data-click-count]'),
  link: document.querySelector('[data-learn-more]'),
  subtitle: document.querySelector('[data-subtitle]'),
  background: document.querySelector('[data-background]'),
};

const state = {
  clicks: getInitialClicks(),
  cursorPosition: { x: 0, y: 0 },
  currentPosition: { x: 0, y: 0 },
};

function getInitialClicks() {
  return window.location.pathname
    .split('/')
    .filter((segment) => segment === CONFIG.PATH_SEGMENT).length;
}

function getMessageIndex(clicks) {
  if (clicks <= CONFIG.MESSAGES_START) return 0;
  return (clicks - CONFIG.MESSAGES_START) % variations.length;
}

function createGradient(x, y) {
  return `radial-gradient(circle at ${x}% ${y}%,transparent 85%,rgba(139, 92, 246, 0.03) 95%,transparent 100%)`;
}

function buildUrl(clicks) {
  return `/${CONFIG.PATH_SEGMENT}`.repeat(clicks);
}

function updateClickCounter(clicks) {
  if (clicks > CONFIG.MESSAGES_START) {
    elements.clickCounter.style.opacity = '1';
    elements.clickCounter.textContent = `Recursion depth: ${clicks}`;
  }
}

function updateMessages(clicks) {
  if (clicks > CONFIG.MESSAGES_START) {
    const messageIndex = getMessageIndex(clicks);
    elements.link.textContent = `${variations[messageIndex]} →`;
    elements.subtitle.textContent = subtitles[messageIndex];
  }
}

function updateBackground(clicks) {
  if (clicks > CONFIG.MESSAGES_START) {
    elements.background.style.transform = `rotate(${clicks}deg) scale(${1 + clicks * 0.02})`;
  }
}

function updateUrl(clicks) {
  const redirectUrl = buildUrl(clicks);
  window.history.replaceState({}, '', redirectUrl);
  elements.link.setAttribute('href', redirectUrl);
}

function updateCursor() {
  state.currentPosition.x +=
    (state.cursorPosition.x - state.currentPosition.x) * CONFIG.CURSOR_EASING;
  state.currentPosition.y +=
    (state.cursorPosition.y - state.currentPosition.y) * CONFIG.CURSOR_EASING;

  elements.cursor.style.left = state.currentPosition.x + 'px';
  elements.cursor.style.top = state.currentPosition.y + 'px';

  requestAnimationFrame(updateCursor);
}

function updateAmbientPosition({ clientX, clientY }) {
  const position = {
    x: (clientX / window.innerWidth) * 100,
    y: (clientY / window.innerHeight) * 100,
  };

  document.querySelectorAll('[data-lightning]').forEach((lightning) => {
    lightning.style.background = createGradient(position.x, position.y);
  });
}

function handleClick() {
  state.clicks++;
  elements.content.classList.add('zoom-out');

  setTimeout(() => {
    elements.overlay.classList.add('active');

    setTimeout(() => {
      updateUrl(state.clicks);
      updateClickCounter(state.clicks);
      updateMessages(state.clicks);
      updateBackground(state.clicks);

      elements.content.classList.remove('zoom-out');
      elements.content.style.animation = 'none';
      elements.content.offsetHeight;
      elements.content.style.animation = '';

      elements.overlay.classList.remove('active');
    }, CONFIG.ANIMATION_DELAYS.OVERLAY);
  }, CONFIG.ANIMATION_DELAYS.ZOOM);
}

function init() {
  if (state.clicks > 0) {
    updateClickCounter(state.clicks);
    updateMessages(state.clicks);
    updateBackground(state.clicks);
    elements.link.setAttribute('href', buildUrl(state.clicks));
  }

  document.addEventListener('mousemove', (e) => {
    state.cursorPosition.x = e.clientX;
    state.cursorPosition.y = e.clientY;
    updateAmbientPosition(e);
  });

  elements.link.addEventListener('click', (event) => {
    event.preventDefault();
    handleClick();
  });

  updateCursor();
}

document.addEventListener('DOMContentLoaded', init);
