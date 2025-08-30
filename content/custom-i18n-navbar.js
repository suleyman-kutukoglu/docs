// content/custom-i18n.js
(function () {
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

  // Navbar sözlüğü
  const navbarDict = {
    Support: { tr: 'Destek', de: 'Unterstützung', en: 'Support' },
    Status:  { tr: 'Durum',  de: 'Status',         en: 'Status' }
  };

  // Global anchors sözlüğü
  const globalDict = {
    "Edge Cloud Portal": {
      tr: "Edge Cloud Portal", 
      de: "Edge Cloud Portal", 
      en: "Edge Cloud Portal"
    },
    "LinkedIn": {
      tr: "LinkedIn", 
      de: "LinkedIn", 
      en: "LinkedIn"
    },
    "Blog": {
      tr: "Blog", 
      de: "Blog", 
      en: "Blog"
    }
  };

  // Navbar metinlerini güncelle
  function updateNavbarLabels(lang) {
    const navbar = document.querySelector('#navbar') || document.querySelector('nav, header');
    if (!navbar) return;

    navbar.querySelectorAll('a, button').forEach((el) => {
      const label = (el.textContent || '').trim();
      if (navbarDict[label] && navbarDict[label][lang]) {
        el.textContent = navbarDict[label][lang];
        el.setAttribute('title', navbarDict[label][lang]);
        el.setAttribute('aria-label', navbarDict[label][lang]);
      }
    });
  }

  // Global anchor metinlerini güncelle
  function updateGlobalAnchors(lang) {
    // global anchors genelde footer veya sidebar’da
    const anchors = document.querySelectorAll('a');
    anchors.forEach((el) => {
      const label = (el.textContent || '').trim();
      if (globalDict[label] && globalDict[label][lang]) {
        el.textContent = globalDict[label][lang];
        el.setAttribute('title', globalDict[label][lang]);
        el.setAttribute('aria-label', globalDict[label][lang]);
      }
    });
  }

  // Genel update
  function updateLabels() {
    const lang = detectLang();
    updateNavbarLabels(lang);
    updateGlobalAnchors(lang);
  }

  // İlk yüklemede çalıştır
  document.addEventListener('DOMContentLoaded', updateLabels);

  // SPA route değişimlerinde çalıştır
  const observer = new MutationObserver(() => {
    clearTimeout(window.__mint_i18n_tick);
    window.__mint_i18n_tick = setTimeout(updateLabels, 50);
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
