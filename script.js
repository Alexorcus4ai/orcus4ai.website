// ===============================
// THEME INITIALIZATION (early execution may still need inline or defer in head)
// ===============================
(function() {
  // Immediately set theme based on stored preference or system
  try {
    const stored = localStorage.getItem('theme');
    const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = (stored === 'light' || stored === 'dark') ? stored : (sysDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', sysDark ? 'dark' : 'light');
  }
})();

// ===============================
// MAIN DOM-DEPENDENT LOGIC
// ===============================
document.addEventListener('DOMContentLoaded', function() {
  // THEME TOGGLE LOGIC
  (function() {
    const themeCheckbox = document.getElementById('themeSwitch');
    if (!themeCheckbox) return;

    // Sync checkbox state with current theme
    const currentTheme = document.documentElement.getAttribute('data-theme');
    themeCheckbox.checked = (currentTheme === 'dark');

    // On toggle change: update theme & localStorage
    themeCheckbox.addEventListener('change', () => {
      const newTheme = themeCheckbox.checked ? 'dark' : 'light';
      try {
        localStorage.setItem('theme', newTheme);
      } catch (e) {
        // ignore if storage unavailable
      }
      document.documentElement.setAttribute('data-theme', newTheme);
    });

    // If no stored preference, adapt to system changes
    try {
      const stored = localStorage.getItem('theme');
      if (stored !== 'light' && stored !== 'dark') {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
          document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
          themeCheckbox.checked = e.matches;
        });
      }
    } catch(e) {
      // ignore
    }
  })();

  // MODAL POPUP LOGIC
  (function() {
    // Show modal after a delay on window load (we use DOMContentLoaded here; 
    // if you want to guarantee images/styles loaded, you might combine window.load too)
    window.addEventListener('load', function() {
      setTimeout(function() {
        const modal = document.getElementById('subscribeModal');
        if (modal) modal.style.display = 'flex';
      }, 10000); // 10 seconds
    });

    const closeBtn = document.getElementById('closeModal');
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        const modal = document.getElementById('subscribeModal');
        if (modal) modal.style.display = 'none';
      });
    }
  })();

  // SHARE BUTTON SCRIPT
  (function() {
    const shareBtn = document.getElementById('shareBtnAlt');
    if (!shareBtn) return;

    shareBtn.addEventListener('click', async () => {
      // Get article title
      const titleElem = document.querySelector('.article-title');
      const title = titleElem ? titleElem.innerText : document.title;

      // Get article image
      const imageElem = document.querySelector('.article-image'); // Adjust selector to match your.HTML
      const imageUrl = imageElem ? imageElem.src : ''; // Fallback to empty string if no image

      // Prepare share data
      const shareData = {
        title: title,
        text: 'Check out this article on Orcus4AI:',
        url: window.location.href
      };

      // If image exists, include it in the text for fallback
      const fallbackText = imageUrl 
        ? `${shareData.text}\n${shareData.url}\nImage: ${imageUrl}` 
        : `${shareData.text}\n${shareData.url}`;

      if (navigator.share) {
        try {
          // Web Share API doesn't directly support images, but some platforms may use the URL
          await navigator.share(shareData);
        } catch (err) {
          console.error('Share was canceled or failed:', err);
        }
      } else {
        // Fallback: copy to clipboard with image URL if available
        try {
          await navigator.clipboard.writeText(fallbackText);
          const originalHTML = shareBtn.innerHTML;
          shareBtn.textContent = 'Copied!';
          setTimeout(() => {
            shareBtn.innerHTML = originalHTML;
          }, 2000);
        } catch (err) {
          alert('Could not copy link automatically. Please copy manually: ' + fallbackText);
        }
      }
    });
  })();

  // BACK-HOME SCRIPT
  (function() {
    const ref = document.referrer;
    let fromOutside = true;
    try {
      if (ref) {
        const refHostname = new URL(ref).hostname;
        fromOutside = (refHostname !== window.location.hostname);
      }
    } catch(e) {
      fromOutside = true;
    }
    if (fromOutside) {
      // Prevent back navigation to outside: push a state, then on popstate, redirect
      history.pushState(null, '', window.location.href);
      window.addEventListener('popstate', function(event) {
        window.location.replace('index.html');
      });
    }
  })();
});

// Load Google Analytics (gtag.js) dynamically
(function() {
  var gaScript = document.createElement('script');
  gaScript.async = true;
  gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-XF88NV2RC7';
  document.head.appendChild(gaScript);

  // Once it's loaded, run gtag initialization
  gaScript.onload = function() {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    window.gtag = gtag; // make gtag globally accessible
    gtag('js', new Date());
    gtag('config', 'G-XF88NV2RC7');
  };
})();
