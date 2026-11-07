(() => {
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  function choose(button, focus = false) {
    tabs.forEach(tab => { const selected = tab === button; tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1; document.getElementById(tab.getAttribute('aria-controls')).hidden = !selected; });
    if (focus) button.focus();
  }
  tabs.forEach((button, index) => {
    button.addEventListener('click', () => choose(button));
    button.addEventListener('keydown', event => {
      let target;
      if (event.key === 'ArrowRight') target = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') target = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') target = 0;
      if (event.key === 'End') target = tabs.length - 1;
      if (target !== undefined) { event.preventDefault(); choose(tabs[target], true); }
    });
  });
  if (document.body.classList.contains('night') && 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }); }, { threshold: .12 });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  }
})();
