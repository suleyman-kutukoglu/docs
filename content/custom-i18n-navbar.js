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

  // Global anchors sözlüğü (istediğin gibi genişlet)
  const globalDict = {
    "Edge Cloud Portal": { tr: "Edge Cloud Portal", de: "Edge Cloud Portal", en: "Edge Cloud Portal" },
    "LinkedIn":          { tr: "LinkedIn",          de: "LinkedIn",          en: "LinkedIn" },
    "Blog":              { tr: "Blog",              de: "Blog",              en: "Blog" }
  };

  // Yardımcı: bir elementin ilk TEXT node'unu güvenli şekilde güncelle
  function setTextNode(el, text) {
    if (!el) return;
    // Eğer ilk node text ise onu güncelle
    if (el.firstChild && el.firstChild.nodeType === Node.TEXT_NODE) {
      el.firstChild.nodeValue = text;
      return;
    }
    // Değilse bir text node ekleyelim (ikon, span vb. bozulmaz)
    el.insertBefore(document.createTextNode(text), el.firstChild);
  }

  // Navbar metinlerini güncelle (Support vb.)
  function updateNavbarLabels(lang) {
    const navbar = document.querySelector('#navbar') || document.querySelector('nav, header');
    if (!navbar) return;

    // 1) Support vb. linkler – metin düğümü odaklı
    navbar.querySelectorAll('a, button').forEach((el) => {
      const label = (el.textContent || '').trim();
      if (navbarDict[label] && navbarDict[label][lang]) {
        setTextNode(el, navbarDict[label][lang]);
        el.setAttribute('title', navbarDict[label][lang]);
        el.setAttribute('aria-label', navbarDict[label][lang]);
      }
    });

    // 2) PRIMARY (Status) buton – spesifik seçim + sadece text node güncelle
    // a) URL'e göre kesin hedef (tercih edilen)
    let primaryBtn =
      navbar.querySelector('a[href*="status.rng.tech"]') ||
      navbar.querySelector('a[href*="/status"]');

    // b) Fallback: "Status" yazılı butonu bul
    if (!primaryBtn) {
      primaryBtn = Array.from(navbar.querySelectorAll('a, button')).find((el) => {
        const txt = (el.textContent || '').trim();
        return txt === 'Status' || txt === 'Durum' || txt === 'Status'; // çok dilli olasılıklar
      });
    }

    const langLabel = navbarDict['Status'][lang];
    if (primaryBtn && langLabel) {
      setTextNode(primaryBtn, langLabel);
      primaryBtn.setAttribute('title', langLabel);
      primaryBtn.setAttribute('aria-label', langLabel);
      // NOT: class'lara dokunmuyoruz -> yeşil/havalı stil korunur
    }
  }

  // Global anchor metinlerini güncelle
  function updateGlobalAnchors(lang) {
    // Global anchorlar genelde footer/side'da; tüm linkleri dolaşıp known label'ları çeviriyoruz
    document.querySelectorAll('a').forEach((el) => {
      const label = (el.textContent || '').trim();
      if (globalDict[label] && globalDict[label][lang]) {
        setTextNode(el, globalDict[label][lang]);
        el.setAttribute('title', globalDict[label][lang]);
        el.setAttribute('aria-label', globalDict[label][lang]);
      }
    });
  }

  function updateLabels() {
    const lang = detectLang();
    updateNavbarLabels(lang);
    updateGlobalAnchors(lang);
  }

  document.addEventListener('DOMContentLoaded', updateLabels);

  // SPA route değişimleri için gözlemci
  const observer = new MutationObserver(() => {
    clearTimeout(window.__mint_i18n_tick);
    window.__mint_i18n_tick = setTimeout(updateLabels, 50);
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
