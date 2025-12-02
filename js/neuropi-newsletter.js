/**
 * NeuroPi Newsletter Subscription Handler
 * Connects newsletter form to Google Apps Script backend
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbwa9J2oBl62gKU2bVDLX12SZYSDS3PRAnnqZiyoZ4nNxPSIRhStWS8r28m1T4KfhVrz/exec',
    EMAIL_INPUT_SELECTOR: 'input[name="email"]',
    HONEYPOT_SELECTOR: 'input[name="blablabla"]',
    SUBMIT_BTN_SELECTOR: 'button[type="submit"], button.input-submit',
    BTN_TEXT_SELECTOR: '.input-submit-txt, button span'
  };

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    // Find all forms in footer sections
    const footerForms = document.querySelectorAll('footer form, .footer form');

    // Process each footer form
    footerForms.forEach(function(form) {
      // Check if this form is near "Subscribe to Newsletters" text
      const footerSection = form.closest('footer, .footer');
      if (!footerSection) return;

      // Check if the footer section contains the specific text
      // We check textContent to be safe, but we could also check specific headings if needed
      const hasNewsletterText = footerSection.textContent.includes('Subscribe to Newsletters');
      if (!hasNewsletterText) return;

      const emailInput = form.querySelector(CONFIG.EMAIL_INPUT_SELECTOR);
      const honeyPot = form.querySelector(CONFIG.HONEYPOT_SELECTOR);
      const submitBtn = form.querySelector(CONFIG.SUBMIT_BTN_SELECTOR);

      // Try to find button text element, or fallback to the button itself if it has text
      let btnText = form.querySelector(CONFIG.BTN_TEXT_SELECTOR);
      if (!btnText && submitBtn) {
          btnText = submitBtn;
      }

      if (!emailInput || !submitBtn) return;

      const originalBtnText = btnText ? btnText.textContent : 'Subscribe';
      let isSubmitting = false;

      // Create status message element
      const statusDiv = document.createElement('div');
      statusDiv.className = 'newsletter-status';
      statusDiv.style.cssText = 'margin-top: 10px; font-size: 14px; font-weight: bold; min-height: 20px;';
      form.appendChild(statusDiv);

      // Helper functions
      const setStatus = (message, isSuccess) => {
        statusDiv.textContent = message;
        statusDiv.style.color = isSuccess ? '#0a7c4a' : '#ff471d';
      };

      const resetStatus = () => {
        setTimeout(() => {
          statusDiv.textContent = '';
          statusDiv.style.color = '';
        }, 5000);
      };

      // Form submission handler
      const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation(); // Stop other listeners (like HubSpot)

        // Honeypot check
        if (honeyPot && honeyPot.value.trim() !== '') {
          return; // Bot detected
        }

        // Validate email
        if (!emailInput.value.trim() || !emailInput.checkValidity()) {
          setStatus('Please enter a valid email address', false);
          emailInput.focus();
          resetStatus();
          return;
        }

        if (isSubmitting) return;
        isSubmitting = true;

        // UI Loading state
        submitBtn.disabled = true;
        if (btnText) btnText.textContent = 'Subscribing...';
        setStatus('Processing...', true);

        const payload = {
          email: emailInput.value.trim(),
          source: window.location.href
        };

        try {
          const response = await fetch(CONFIG.WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
          });

          // Success (no-cors mode doesn't allow reading response)
          form.reset();
          setStatus('✅ Thank you for subscribing to NeuroPi! Check your email.', true);

          // Analytics tracking
          if (typeof gtag !== 'undefined') {
            gtag('event', 'newsletter_subscription', {
              'event_category': 'engagement',
              'event_label': 'footer_form'
            });
          }

        } catch (error) {
          console.error('Newsletter subscription error:', error);
          setStatus('❌ Something went wrong. Please try again.', false);
        } finally {
          submitBtn.disabled = false;
          if (btnText) btnText.textContent = originalBtnText;
          isSubmitting = false;
          resetStatus();
        }
      };

      // Event listeners
      form.addEventListener('submit', handleSubmit);

      // Submit on Enter key
      emailInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          form.dispatchEvent(new Event('submit'));
        }
      });
    });
  });

})();
