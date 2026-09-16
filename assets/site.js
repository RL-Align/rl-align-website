'use strict';

const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('#navigation');
function setMenu(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  navigation.classList.toggle('is-open', open);
}
menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
navigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (navigation && menuButton && !navigation.contains(event.target) && !menuButton.contains(event.target)) setMenu(false);
});

// Social links remain usable without JavaScript; motion is progressive enhancement.
(() => {
  const orbit = document.querySelector('.social-orbit');
  const toggle = document.querySelector('.social-motion-toggle');
  if (!orbit || !toggle) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = false;
  let inView = !('IntersectionObserver' in window);
  function updateMotion() {
    const running = !paused && !reducedMotion.matches && inView && !document.hidden;
    orbit.dataset.motion = running ? 'running' : 'paused';
    toggle.hidden = reducedMotion.matches;
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.setAttribute('aria-label', paused ? 'Resume floating social icons' : 'Pause floating social icons');
    toggle.querySelector('span').textContent = paused ? 'Resume motion' : 'Pause motion';
  }
  toggle.addEventListener('click', () => { paused = !paused; updateMotion(); });
  reducedMotion.addEventListener('change', updateMotion);
  document.addEventListener('visibilitychange', updateMotion);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      inView = entries.some(entry => entry.isIntersecting);
      updateMotion();
    });
    observer.observe(orbit);
  }
  updateMotion();
})();

// The native disclosure also works without JavaScript.
const emailDisclosure = document.querySelector('.email-disclosure');
if (emailDisclosure) {
  document.addEventListener('click', event => {
    if (emailDisclosure.open && !emailDisclosure.contains(event.target)) emailDisclosure.open = false;
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && emailDisclosure.open) {
      const restoreFocus = emailDisclosure.contains(document.activeElement);
      emailDisclosure.open = false;
      if (restoreFocus) emailDisclosure.querySelector('summary').focus();
    }
  });
}

const tabs = [...document.querySelectorAll('.code-tabs [role="tab"]')];
const copyButton = document.querySelector('.copy-button');
const copyStatus = document.querySelector('#copy-status');
let copyTimer;
function activateTab(tab) {
  tabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  });
  if (copyButton) {
    clearTimeout(copyTimer);
    copyButton.querySelector('span').textContent = 'Copy';
    copyButton.setAttribute('aria-label', 'Copy installation commands');
  }
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', event => {
    const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length
      : event.key === 'ArrowLeft' ? (index + tabs.length - 1) % tabs.length
      : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : null;
    if (next !== null) { event.preventDefault(); activateTab(tabs[next]); tabs[next].focus(); }
  });
});
copyButton?.addEventListener('click', async () => {
  const selected = tabs.find(tab => tab.getAttribute('aria-selected') === 'true');
  if (!selected) return;
  const code = document.querySelector(`#${selected.getAttribute('aria-controls')} code`);
  try {
    await navigator.clipboard.writeText(code.textContent);
    copyButton.querySelector('span').textContent = 'Copied';
    copyButton.setAttribute('aria-label', 'Installation commands copied');
    copyStatus.textContent = 'Installation commands copied to clipboard.';
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => {
      copyButton.querySelector('span').textContent = 'Copy';
      copyButton.setAttribute('aria-label', 'Copy installation commands');
    }, 2200);
  } catch {
    const range = document.createRange();
    range.selectNodeContents(code);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    copyStatus.textContent = 'Clipboard access is unavailable. Commands are selected; use your device’s copy command.';
    copyButton.querySelector('span').textContent = 'Selected';
  }
});
