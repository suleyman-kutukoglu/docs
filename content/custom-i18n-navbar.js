// content/custom-i18n.js
(function () {
  if (window.__mint_i18n_installed) return;
  window.__mint_i18n_installed = true;

  // Dil belirleme
  function detectLang() {
    const path = window.location.pathname.toLowerCase();
    if (path.startsWith('/tr')) return 'tr';
    if (path.startsWith('/de')) return 'de';
    if (path.startsWith('/en')) return 'en';
    const htmlLang = document.documentElement.getAttribute('lang');
    if (htmlLang) return htmlLang.split('-')[0].toLowerCase();
    return 'en';
  }

  // i18n sözlükleri
  const navbarDict = {
    Support: { tr: 'Destek', de: 'Unterstützung', en: 'Support' },
    Status:  { tr: 'Durum',  de: 'Status',         en: 'Status' }
  };

  const globalDict = {
    'Edge Cloud Portal': { tr: 'Edge Cloud Portal', de: 'Edge Cloud Portal', en: 'Edge Cloud Portal' },
    'LinkedIn':          { tr: 'LinkedIn',          de: 'LinkedIn',          en: 'LinkedIn' },
    'Blog':              { tr: 'Blog',              de: 'Blog',              en: 'Blog' }
  };

  // Global anchors -> docs.json'daki href’lere göre *sadece bunları* hedefle
  const globalAnchorTargets = [
    { hrefIncludes: 'mintlify.com/docs', key: 'Edge Cloud Portal' },
    { hrefIncludes: 'linkedin.com/company/rngtechnology', key: 'LinkedIn' },
    { hrefIncludes: 'rng.tech/blog', key: 'Blog' }
  ];

  // Bir elementteki mevcut *metin* düğümünü veya metin içeren çocuk elemanı güvenle güncelle
  function replaceVisibleLabel(el, newText) {
    if (!el) return;

    // 1) Metin düğümü ara
    const textNode = Array.from(el.childNodes).find(
      (n) => n.nodeType === Node.TEXT_NODE && n.nodeValue && n.nodeValue.trim().length > 0
    );
    if (textNode) {
      textNode.nodeValue = newText;
      return true;
    }

    // 2) Metin içeren bir alt eleman (span/strong/em vs.) ara
    const textElem = Array.from(el.children).find((c) => {
      const tag = c.tagName ? c.tagName.toLowerCase() : '';
      if (['svg', 'img', 'path', 'use'].includes(tag)) return false;
      const t = (c.textContent || '').trim();
      return t.length > 0;
    });
    if (textElem) {
      textElem.textContent = newText;
      return true;
    }

    // 3) Hiç metin yoksa *yeni node eklemiyoruz* (spacing bozulmasın)
    return false;
  }

  function updateNavbar(lang) {
    const navbar = document.querySelector('#navbar') || document.querySelector('nav, header');
    if (!navbar) return;

    // Support linkini hedefli ve sadece mevcut metni değiştir
    const supportLink =
      navbar.querySelector('a[href^="mailto:support@rng.tech"]') ||
      Array.from(navbar.querySelectorAll('a,button')).find((el) => (el.textContent || '').trim() === 'Support');

    if (supportLink) {
      const t = navbarDict['Support'][lang];
      if (t && replaceVisibleLabel(supportLink, t)) {
        supportLink.setAttribute('title', t);
        supportLink.setAttribute('aria-label', t);
      }
    }

    // Status (primary) butonunu *kesin* hedefle
    const statusBtn =
      navbar.querySelector('a[href^="https://status.rng.tech"]') ||
      navbar.querySelector('a[href*="/status"]') ||
      Array.from(navbar.querySelectorAll('a,button')).find((el) => (el.textContent || '').trim() === 'Status');

    if (statusBtn) {
      const t = navbarDict['Status'][lang];
      if (t && replaceVisibleLabel(statusBtn, t)) {
        statusBtn.setAttribute('title', t);
        statusBtn.setAttribute('aria-label', t);
      }
    }
  }

  function updateGlobalAnchors(lang) {
    globalAnchorTargets.forEach(({ hrefIncludes, key }) => {
      const el = document.querySelector(`a[href*="${hrefIncludes}"]`);
      if (!el) return;
      const t = globalDict[key] && globalDict[key][lang];
      if (!t) return;
      // Sadece mevcut metni değiştir (yeni node ekleme!)
      if (replaceVisibleLabel(el, t)) {
        el.setAttribute('title', t);
        el.setAttribute('aria-label', t);
      }
    });
  }

  function updateAll() {
    const lang = detectLang();
    updateNavbar(lang);
    updateGlobalAnchors(lang);
  }

  // İlk yükleme
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateAll);
  } else {
    updateAll();
  }

  // SPA route değişimleri için hafif debounce ile gözlem
  const observer = new MutationObserver(() => {
    clearTimeout(window.__mint_i18n_tick);
    window.__mint_i18n_tick = setTimeout(updateAll, 80);
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
