// content/custom-i18n-navbar.js
(function () {
  // Dil belirleme: URL prefix'e göre (/tr, /en, /de). Gerekirse html[lang] de kontrol edilir.
  function detectLang() {
    const path = window.location.pathname.toLowerCase();
    if (path.startsWith('/tr')) return 'tr';
    if (path.startsWith('/de')) return 'de';
    if (path.startsWith('/en')) return 'en';
    // fallback: <html lang="...">
    const htmlLang = document.documentElement.getAttribute('lang');
    if (htmlLang) return htmlLang.split('-')[0].toLowerCase();
    return 'en';
  }

  // Yerelleştirme sözlüğü
  const dict = {
    Support: { tr: 'Destek', de: 'Unterstützung', en: 'Support' },
    Status:  { tr: 'Durum',  de: 'Status',         en: 'Status' }
  };

  // Navbar içindeki metinleri güncelle
  function updateNavbarLabels() {
    const lang = detectLang();

    // Navbar kökü – sen CSS örneğinde #navbar kullanmışsın, bu varsa önce onu deneyelim
    const navbar = document.querySelector('#navbar') || document.querySelector('nav, header');

    if (!navbar) return;

    // 1) Links: "Support" gibi
    // Birden fazla link olabilir; label eşleşmesine göre değiştiriyoruz.
    navbar.querySelectorAll('a, button').forEach((el) => {
      const label = (el.textContent || '').trim();
      if (dict[label] && dict[label][lang]) {
        el.textContent = dict[label][lang];
        // Erişilebilirlik için title/aria-label de güncelle
        el.setAttribute('title', dict[label][lang]);
        el.setAttribute('aria-label', dict[label][lang]);
      }
    });

    // 2) Primary button özel seçici (Mintlify temalarında genelde header/right bölgede buton oluyor)
    // Eğer belirli bir selector biliyorsan daha net hedefle:
    // örn: const primaryBtn = navbar.querySelector('a[href*="status"]');
    const primaryBtn = navbar.querySelector('a, button');
    if (primaryBtn) {
      const txt = (primaryBtn.textContent || '').trim();
      if (dict[txt] && dict[txt][lang]) {
        primaryBtn.textContent = dict[txt][lang];
        primaryBtn.setAttribute('title', dict[txt][lang]);
        primaryBtn.setAttribute('aria-label', dict[txt][lang]);
      }
    }
  }

  // İlk yüklemede çalıştır
  document.addEventListener('DOMContentLoaded', updateNavbarLabels);

  // SPA route değişimlerinde de çalışsın diye gözlemci
  const observer = new MutationObserver(() => {
    // DOM değişince kısa bir debounce ile güncelle
    clearTimeout(window.__mint_i18n_tick);
    window.__mint_i18n_tick = setTimeout(updateNavbarLabels, 50);
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
