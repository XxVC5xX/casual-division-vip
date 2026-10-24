/* Casual Division — comportements communs (barre, défilé, compteurs, carte 3D, message flottant) */
(() => {
  const calme = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Barre du haut : fond plein dès qu'on a défilé
  const barre = document.querySelector('.barre');
  if (barre) {
    const maj = () => barre.classList.toggle('pleine', scrollY > 40);
    maj(); addEventListener('scroll', maj, { passive: true });
  }

  // Défilé des marques : on double le contenu pour une boucle sans couture
  document.querySelectorAll('.defile .piste').forEach(p => { p.innerHTML += p.innerHTML; });

  // Compteurs : montent une fois quand ils arrivent à l'écran
  const nombres = document.querySelectorAll('[data-compte]');
  const fmt = n => n.toLocaleString('fr-FR');
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    const el = e.target, fin = +el.dataset.compte, suf = el.dataset.suffixe || '';
    if (calme) { el.textContent = fmt(fin) + suf; return; }
    const t0 = performance.now(), d = 1400;
    const pas = t => { const p = Math.min(1, (t - t0) / d), v = Math.round(fin * (1 - Math.pow(1 - p, 4)));
      el.textContent = fmt(v) + suf; if (p < 1) requestAnimationFrame(pas); };
    requestAnimationFrame(pas);
  }), { threshold: .6 });
  nombres.forEach(n => io.observe(n));

  // Carte de membre : se redresse en défilant, suit la souris sur ordinateur
  const carte = document.querySelector('[data-carte]');
  if (carte && !calme) {
    let sx = 0, sy = 0, rx = 0, ry = 0;
    const boucle = () => {
      const r = carte.getBoundingClientRect(), vh = innerHeight;
      const p = Math.max(0, Math.min(1, 1 - (r.top + r.height / 2 - vh * .45) / (vh * .7)));
      const bx = (1 - p) * 28, by = (1 - p) * -22;
      rx += (bx + sy - rx) * .12; ry += (by + sx - ry) * .12;
      carte.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      carte.style.setProperty('--reflet', `${50 + ry * 2}%`);
      requestAnimationFrame(boucle);
    };
    requestAnimationFrame(boucle);
    carte.parentElement.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      const r = carte.getBoundingClientRect();
      sx = ((e.clientX - r.left) / r.width - .5) * 16; sy = -((e.clientY - r.top) / r.height - .5) * 12;
    });
    carte.parentElement.addEventListener('pointerleave', () => { sx = sy = 0; });
  }

  // Message flottant
  window.cdToast = (txt) => {
    let t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = txt; t.classList.add('vu');
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('vu'), 3200);
  };

  document.querySelectorAll('[data-annee]').forEach(e => { e.textContent = new Date().getFullYear(); });
})();
