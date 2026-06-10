/**
 * NeuroPi Website Translation Widget
 * Powered by Google Translate API
 */

(function () {
  // Define available languages
  const languages = [
    { code: 'en', name: 'English', nativeName: 'English', flagCode: 'us' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flagCode: 'in' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flagCode: 'in' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flagCode: 'sa' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flagCode: 'es' },
    { code: 'fr', name: 'French', nativeName: 'Français', flagCode: 'fr' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flagCode: 'de' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', flagCode: 'it' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', flagCode: 'jp' }
  ];

  // Inject CSS Styles
  const style = document.createElement('style');
  style.textContent = `
    /* Custom Translation Widget */
    #np-translate-widget {
      position: fixed;
      bottom: 25px;
      right: 25px;
      z-index: 9999999;
      font-family: 'Lato', 'PT Sans', sans-serif;
    }
    
    .np-translate-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(26, 66, 85, 0.85); /* Navy transparent */
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.18);
      color: #ffffff;
      padding: 12px 20px;
      border-radius: 30px;
      cursor: pointer;
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      font-weight: 700;
      font-size: 14px;
      letter-spacing: 0.8px;
      text-transform: uppercase;
    }
    
    .np-translate-btn:hover {
      background: #ff471d; /* NeuroPi Orange */
      border-color: rgba(255, 255, 255, 0.3);
      transform: translateY(-3px) scale(1.03);
      box-shadow: 0 12px 40px 0 rgba(255, 71, 29, 0.4);
    }
    
    .np-translate-btn svg {
      width: 18px;
      height: 18px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
      transition: transform 0.3s ease;
    }
    
    .np-translate-btn:hover svg {
      transform: rotate(15deg);
    }
    
    .np-translate-dropdown {
      position: absolute;
      bottom: calc(100% + 15px);
      right: 0;
      width: 260px;
      background: rgba(26, 66, 85, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 16px;
      box-shadow: 0 15px 45px 0 rgba(0, 0, 0, 0.4);
      overflow: hidden;
      transform: translateY(20px) scale(0.9);
      opacity: 0;
      pointer-events: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      padding: 8px 0;
    }
    
    .np-translate-dropdown.active {
      transform: translateY(0) scale(1);
      opacity: 1;
      pointer-events: auto;
    }
    
    .np-translate-option {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 20px;
      color: rgba(255, 255, 255, 0.8);
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 14px;
      font-weight: 600;
      border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    }
    
    .np-translate-option:last-child {
      border-bottom: none;
    }
    
    .np-translate-option:hover {
      background: rgba(255, 71, 29, 0.15);
      color: #ffffff;
      padding-left: 25px;
    }
    
    .np-translate-option.active {
      background: rgba(255, 71, 29, 0.85);
      color: #ffffff;
    }
    
    .np-translate-option-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .np-translate-flag {
      width: 20px;
      height: 14px;
      object-fit: cover;
      border-radius: 2px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }
    
    .np-translate-names {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
    }
    
    .np-translate-native {
      font-size: 13px;
    }
    
    .np-translate-english {
      font-size: 11px;
      opacity: 0.6;
    }
    
    .np-translate-option.active .np-translate-english {
      opacity: 0.8;
    }
    
    .np-translate-check {
      display: none;
      width: 16px;
      height: 16px;
      stroke: currentColor;
    }
    
    .np-translate-option.active .np-translate-check {
      display: block;
    }
    
    /* Hide Google Translate native UI junk */
    iframe.skiptranslate,
    iframe.goog-te-banner-frame,
    .goog-te-banner-frame,
    #goog-gt-tt,
    .goog-te-balloon-frame {
      display: none !important;
      visibility: hidden !important;
    }
    
    body {
      top: 0px !important;
    }
    
    font {
      background-color: transparent !important;
      box-shadow: none !important;
    }
  `;
  document.head.appendChild(style);

  // Helper: Read googtrans cookie
  function getActiveLang() {
    const value = "; " + document.cookie;
    const parts = value.split("; googtrans=");
    if (parts.length === 2) {
      const parts2 = parts.pop().split(";").shift();
      const code = parts2.split('/').pop();
      if (code) return code.toLowerCase();
    }
    return 'en';
  }

  // Create UI Structure
  const widget = document.createElement('div');
  widget.id = 'np-translate-widget';
  widget.className = 'notranslate';
  widget.setAttribute('translate', 'no');

  // Toggle Button
  const btn = document.createElement('button');
  btn.className = 'np-translate-btn notranslate';
  btn.setAttribute('translate', 'no');
  btn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="notranslate" translate="no">
      <circle cx="12" cy="12" r="10" class="notranslate" translate="no"></circle>
      <line x1="2" y1="12" x2="22" y2="12" class="notranslate" translate="no"></line>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" class="notranslate" translate="no"></path>
    </svg>
    <span class="np-translate-btn-label notranslate" translate="no">Translate</span>
  `;

  // Dropdown Menu
  const dropdown = document.createElement('div');
  dropdown.className = 'np-translate-dropdown notranslate';
  dropdown.setAttribute('translate', 'no');

  // Render options inside Dropdown
  function renderOptions() {
    dropdown.innerHTML = '';
    const activeLang = getActiveLang();

    // Update main button label with active language name
    const activeObj = languages.find(l => l.code === activeLang) || languages[0];
    btn.querySelector('.np-translate-btn-label').textContent = activeObj.name;

    languages.forEach(lang => {
      const option = document.createElement('div');
      option.className = `np-translate-option notranslate ${lang.code === activeLang ? 'active' : ''}`;
      option.setAttribute('translate', 'no');
      option.innerHTML = `
        <div class="np-translate-option-left notranslate" translate="no">
          <img class="np-translate-flag notranslate" src="https://flagcdn.com/w40/${lang.flagCode}.png" alt="${lang.name} flag" translate="no">
          <div class="np-translate-names notranslate" translate="no">
            <span class="np-translate-native notranslate" translate="no">${lang.nativeName}</span>
            ${lang.code !== 'en' ? `<span class="np-translate-english notranslate" translate="no">${lang.name}</span>` : ''}
          </div>
        </div>
        <svg class="np-translate-check notranslate" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" translate="no">
          <polyline points="20 6 9 17 4 12" class="notranslate" translate="no"></polyline>
        </svg>
      `;

      option.addEventListener('click', () => {
        setLanguage(lang.code);
        dropdown.classList.remove('active');
      });

      dropdown.appendChild(option);
    });
  }

  // Set Language function
  function setLanguage(langCode) {
    const googleSelect = document.querySelector('.goog-te-combo');
    if (googleSelect) {
      googleSelect.value = langCode;
      googleSelect.dispatchEvent(new Event('change'));
      
      // Update our UI active class
      setTimeout(renderOptions, 100);
    } else {
      // If widget not loaded yet, write cookie manually and refresh page
      const domain = window.location.hostname;
      const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
      
      // Clear any conflicting cookie first
      document.cookie = `googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
      if (domain.includes('.')) {
        document.cookie = `googtrans=; path=/; domain=.${domain}; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
        document.cookie = `googtrans=; path=/; domain=${domain}; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
      }
      
      // Set cookies for both the current hostname and root domain
      document.cookie = `googtrans=/en/${langCode}; path=/; SameSite=Lax${secureFlag}`;
      if (domain.includes('.')) {
        document.cookie = `googtrans=/en/${langCode}; path=/; domain=.${domain}; SameSite=Lax${secureFlag}`;
        document.cookie = `googtrans=/en/${langCode}; path=/; domain=${domain}; SameSite=Lax${secureFlag}`;
      }
      window.location.reload();
    }
  }

  // Toggle dropdown trigger
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('active');
  });

  // Close dropdown on click outside
  document.addEventListener('click', () => {
    dropdown.classList.remove('active');
  });

  // Append structures to Widget, then to Page
  widget.appendChild(btn);
  widget.appendChild(dropdown);
  document.body.appendChild(widget);

  // Initialize options
  renderOptions();

  // Create Google Translate element hook
  window.googleTranslateElementInit = function () {
    new google.translate.TranslateElement({
      pageLanguage: 'en',
      includedLanguages: languages.map(l => l.code).join(','),
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
      autoDisplay: false
    }, 'google_translate_element');

    // Run renderOptions again once Google Translate loads to sync state
    setTimeout(renderOptions, 1000);
  };

  // Append hidden element required by Google Translate
  const gtDiv = document.createElement('div');
  gtDiv.id = 'google_translate_element';
  gtDiv.style.display = 'none';
  document.body.appendChild(gtDiv);

  // Load Google Translate API Script
  const gtScript = document.createElement('script');
  gtScript.type = 'text/javascript';
  gtScript.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  document.body.appendChild(gtScript);
})();
