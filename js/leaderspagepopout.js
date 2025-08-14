document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('memberModal');
  const iframe = document.getElementById('modalIframe');
  const closeBtn = modal.querySelector('[data-close]');
  const loading = document.getElementById('modalLoading');
  const errorPanel = document.getElementById('modalError');
  const openNewTabBtn = document.getElementById('modalOpenNewTab');
  const titleEl = document.getElementById('memberModalTitle');

  let lastFocused = null;
  let loadTimeout = null;

  // Open modal helper
  function openModal(href, titleText) {
    lastFocused = document.activeElement;
    titleEl.textContent = titleText || 'Profile';
    errorPanel.hidden = true;
    openNewTabBtn.removeAttribute('href');

    // show loader
    loading.classList.add('active');

    // set iframe src and open
    iframe.src = href;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    // Fallback in case iframe never fires "load" (blocked or slow)
    clearTimeout(loadTimeout);
    loadTimeout = setTimeout(() => {
      // If still "loading", assume blocked by X-Frame-Options
      if (loading.classList.contains('active')) {
        loading.classList.remove('active');
        errorPanel.hidden = false;
        openNewTabBtn.href = href;
      }
    }, 3000); // 3s – adjust if you like

    // Focus close
    closeBtn.focus();
  }

  // Close modal helper
  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    iframe.src = '';
    loading.classList.remove('active');
    errorPanel.hidden = true;
    clearTimeout(loadTimeout);
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  // Card click interception
  document.querySelectorAll('.team-card a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      const customTitle = link.getAttribute('data-title')
        || link.querySelector('h4')?.textContent?.trim()
        || 'Profile';
      openModal(href, customTitle);
    });
  });

  // Iframe load = success
  iframe.addEventListener('load', () => {
    loading.classList.remove('active');
    clearTimeout(loadTimeout);
    // If the loaded page is blank due to a block, the timeout fallback above handles it.
  });

  // Close interactions
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(); // click on overlay
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  // Basic focus trap inside modal when open
  modal.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || !modal.classList.contains('is-open')) return;

    const focusables = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  });
});
