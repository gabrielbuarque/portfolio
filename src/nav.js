// Shared disclosure navigation for the portfolio, blog and both languages.
(() => {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const button = header.querySelector('.nav-toggle');
  const nav = header.querySelector('.primary-nav');
  if (!button || !nav) return;
  const mobile = matchMedia('(max-width: 900px)');
  const en = document.documentElement.lang.startsWith('en');
  const label = button.querySelector('.nav-toggle-label');
  const setOpen = (open, restoreFocus = false) => {
    open = open && mobile.matches;
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? (en ? 'Close menu' : 'Fechar menu') : (en ? 'Open menu' : 'Abrir menu'));
    label.textContent = open ? (en ? 'Close' : 'Fechar') : 'Menu';
    header.classList.toggle('nav-open', open);
    nav.inert = mobile.matches && !open;
    if (restoreFocus) button.focus();
  };
  button.hidden = false;
  header.classList.add('nav-ready');
  setOpen(false);
  button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('click', e => { if (!header.contains(e.target)) setOpen(false); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') setOpen(false, true);
  });
  document.addEventListener('focusin', e => { if (!header.contains(e.target)) setOpen(false); });
  mobile.addEventListener('change', () => setOpen(false));
})();
