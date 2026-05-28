/* =========================================
   ANIMATION ENGINE — NEWAGE CLINIC Exosome LP
   シンプル版（parallax / split-text / clip-path 削除済み）
   ========================================= */

/* ── 1. AUTO STAGGER for grid children ── */
document.querySelectorAll('.why-grid, .pain-grid, .effects-grid, .testi-grid, .results-grid').forEach(grid => {
  grid.querySelectorAll(':scope > *').forEach((child, i) => {
    child.classList.add('reveal');
    child.setAttribute('data-d', String(Math.min(i, 3)));
  });
});

/* ── 2. REVEAL (fade + slide up, simplified) ── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ── 3. LINE ANIM ── */
const lineObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      lineObs.unobserve(e.target);
    }
  });
});
document.querySelectorAll('.rule').forEach(el => {
  el.classList.add('line-anim');
  lineObs.observe(el);
});

/* ── 4. COUNT-UP ── */
function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const fmt = el.dataset.format;
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const elapsed = Math.min(now - start, duration);
    const ease = 1 - Math.pow(1 - elapsed / duration, 3);
    const val = Math.round(ease * target);
    if (fmt === 'k') {
      el.textContent = val >= 1000 ? (val / 1000).toFixed(0) + 'K' + suffix : val + suffix;
    } else if (fmt === 'comma') {
      el.textContent = val.toLocaleString() + suffix;
    } else {
      el.textContent = val + suffix;
    }
    if (elapsed < duration) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const countObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCount(e.target);
      countObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.count-num[data-count]').forEach(el => {
  if (parseInt(el.dataset.count, 10) === 0) el.textContent = '0';
  countObs.observe(el);
});

/* ── 5. FAQ ACCORDION ── */
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

/* ── 6. NAV SCROLL STATE ── */
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.style.boxShadow = window.scrollY > 60 ? '0 1px 0 rgba(26,38,38,0.08)' : 'none';
}, { passive: true });

/* ── 6b. HAMBURGER MENU ── */
(function () {
  const btn     = document.getElementById('hamburgerBtn');
  const menu    = document.getElementById('mobileMenu');
  const overlay = document.getElementById('mobileOverlay');
  const closeBtn = document.getElementById('mobileMenuClose');

  if (!btn || !menu) return;

  function openMenu() {
    btn.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    menu.classList.add('is-open');
    menu.removeAttribute('aria-hidden');
    overlay.classList.add('is-open');
    document.body.classList.add('menu-open');
    // フォーカスをメニュー内の最初のリンクへ移動（a11y）
    const firstLink = menu.querySelector('a, button');
    if (firstLink) firstLink.focus();
  }

  function closeMenu() {
    btn.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    btn.focus();
  }

  // ハンバーガーボタン
  btn.addEventListener('click', () => {
    btn.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
  });

  // ✕ 閉じるボタン
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  // オーバーレイクリックで閉じる
  overlay.addEventListener('click', closeMenu);

  // メニュー内リンクをタップで閉じる
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // ESC キー
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) closeMenu();
  });

  // フォーカストラップ（Tab でメニュー内を循環）
  menu.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const focusable = Array.from(
      menu.querySelectorAll('a[href], button:not([disabled])')
    ).filter(el => !el.closest('[hidden]'));
    if (!focusable.length) return;
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  });
})();

/* ── 7. FLOATING CTA — ヒーロー通過後に表示、フッター到達時に非表示 ── */
const floatingCta = document.querySelector('.floating-cta');
const hero = document.querySelector('.hero');
const footer = document.querySelector('footer');

if (floatingCta && hero) {
  const updateFloating = () => {
    const heroBottom = hero.getBoundingClientRect().bottom;
    // display:none のときは offsetParent が null → フッターなしとして扱う
    const footerTop = (footer && footer.offsetParent !== null)
      ? footer.getBoundingClientRect().top
      : Infinity;
    const windowH = window.innerHeight;

    const pastHero = heroBottom < 0;
    const nearFooter = footerTop < windowH + 20;

    if (pastHero && !nearFooter) {
      floatingCta.classList.add('is-visible');
    } else {
      floatingCta.classList.remove('is-visible');
    }
  };
  window.addEventListener('scroll', updateFloating, { passive: true });
  updateFloating();
}
