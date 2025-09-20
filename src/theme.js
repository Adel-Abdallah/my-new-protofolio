(function () {
  function getSystemPref() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
      // Broadcast theme change to other pages
      window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: theme } }));
    } catch (e) {}
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      const pressed = theme === 'dark';
      btn.setAttribute('aria-pressed', String(pressed));
      // Update icon path (moon for dark default, sun for light)
      const svg = btn.querySelector('svg');
      if (svg) {
        svg.innerHTML = theme === 'dark'
          ? '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>'
          : '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
      }
    }
  }

  function init() {
    let saved = null;
    try { saved = localStorage.getItem('theme'); } catch (e) {}
    const initial = saved === 'dark' || saved === 'light' ? saved : getSystemPref();
    applyTheme(initial);

    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        const current = document.documentElement.getAttribute('data-theme') || initial;
        applyTheme(current === 'dark' ? 'light' : 'dark');
      });
    }

    // Keep in sync with OS changes if user hasn't explicitly chosen
    const mm = window.matchMedia('(prefers-color-scheme: dark)');
    if (mm && typeof mm.addEventListener === 'function') {
      mm.addEventListener('change', () => {
        let hasExplicit = null;
        try { hasExplicit = localStorage.getItem('theme'); } catch (e) {}
        if (hasExplicit !== 'dark' && hasExplicit !== 'light') {
          applyTheme(getSystemPref());
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
