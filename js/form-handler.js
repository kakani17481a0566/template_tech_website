/**
 * Google Sheets Form Handler
 * Handles form submission to Google Apps Script Web App
 */

// Google Apps Script Web App URL for form submissions
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwDBNkVq4cjvyEO7h4U8Wp-S0041iNItpJaqvRoftXA0w5-MMjSfbryE1mYN_Huen1W/exec';

/**
 * Initialize form handler
 */
function initFormHandler() {
  const form = document.getElementById('registerForm');

  if (!form) {
    console.error('Registration form not found');
    return;
  }

  form.addEventListener('submit', handleFormSubmit);
}

/**
 * Handle form submission
 * @param {Event} e - Submit event
 */
async function handleFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const submitButton = form.querySelector('.submit-button');
  const originalButtonText = submitButton.textContent;

  // Show loading spinner
  showLoadingSpinner();

  // Disable submit button and show loading state
  submitButton.disabled = true;
  submitButton.textContent = 'Submitting...';
  submitButton.style.opacity = '0.6';

  try {
    // Collect form data
    const formData = new FormData(form);

    // Concatenate country code with mobile number using hyphen
    const countryCode = formData.get('countryCode');
    const mobileNumber = formData.get('mobile');
    const fullPhoneNumber = `${countryCode}-${mobileNumber}`;

    // Replace mobile field with full phone number
    formData.set('mobile', fullPhoneNumber);

    // Remove separate country code field since it's now part of mobile
    formData.delete('countryCode');

    console.log('Full Phone Number:', fullPhoneNumber);

    // Handle checkbox array for interests
    const interests = [];
    const interestCheckboxes = form.querySelectorAll('input[name="interests[]"]:checked');

    console.log('Total checkboxes checked:', interestCheckboxes.length);

    interestCheckboxes.forEach(checkbox => {
      console.log('Adding interest:', checkbox.value);
      interests.push(checkbox.value);
    });

    console.log('All interests collected:', interests);

    // Remove individual checkbox entries
    formData.delete('interests[]');

    // Add as a single comma-separated string
    // This fixes the issue where Google Apps Script only sees the last value
    if (interests.length > 0) {
      formData.append('interests[]', interests.join(', '));
    }

    console.log('FormData interests:', formData.getAll('interests[]'));

    // Submit to Google Sheets
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: formData,
      mode: 'no-cors' // Required for Google Apps Script
    });

    // Note: With 'no-cors' mode, we can't read the response
    // So we assume success if no error was thrown
    showSuccessMessage();
    form.reset();
    updateInterestsButton(); // Reset interests dropdown text

  } catch (error) {
    console.error('Form submission error:', error);
    showErrorMessage(error.message);
  } finally {
    // Hide loading spinner
    hideLoadingSpinner();

    // Re-enable submit button
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
    submitButton.style.opacity = '1';
  }
}

/**
 * Show success message to user
 */
function showSuccessMessage() {
  // Create success message element
  const message = document.createElement('div');
  message.className = 'form-message success-message';
  message.innerHTML = `
    <div>
      <span><strong>Thank You for Registering with NeuroPi!</strong></span>
    </div>
  `;

  // Append to body for fixed positioning
  document.body.appendChild(message);

  // Auto-remove message after 5 seconds
  setTimeout(() => {
    message.style.animation = 'slideOutRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    setTimeout(() => message.remove(), 400);
  }, 5000);
}

/**
 * Show error message to user
 * @param {string} errorText - Error message
 */
function showErrorMessage(errorText) {
  // Create error message element
  const message = document.createElement('div');
  message.className = 'form-message error-message';
  message.innerHTML = `
    <div>
      <span><strong>Error!</strong> ${errorText || 'Something went wrong. Please try again.'}</span>
    </div>
  `;

  // Append to body for fixed positioning
  document.body.appendChild(message);

  // Auto-remove message after 7 seconds
  setTimeout(() => {
    message.style.animation = 'slideOutRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    setTimeout(() => message.remove(), 400);
  }, 7000);
}

/**
 * Update interests button text
 */
function updateInterestsButton() {
  const checkboxes = document.querySelectorAll('#interestDropdown input[type="checkbox"]');
  const selected = Array.from(checkboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.parentNode.textContent.trim());
  const btn = document.getElementById('dropdownToggleBtn');

  if (!btn) return;

  if (selected.length === 0) {
    btn.textContent = 'Select Interests';
  } else if (selected.length === 1) {
    btn.textContent = selected[0];
  } else {
    btn.textContent = `${selected.length} Selected: ${selected.join(', ')}`;
  }
}

/**
 * Show loading spinner overlay
 */
function showLoadingSpinner() {
  // Create spinner overlay
  const overlay = document.createElement('div');
  overlay.id = 'loadingSpinnerOverlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    backdrop-filter: blur(4px);
  `;

  // Create spinner container
  const spinnerContainer = document.createElement('div');
  spinnerContainer.style.cssText = `
    text-align: center;
  `;

  // Create spinner
  const spinner = document.createElement('div');
  spinner.style.cssText = `
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid #008281;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
  `;

  // Create loading text
  const loadingText = document.createElement('div');
  loadingText.style.cssText = `
    color: white;
    font-size: 18px;
    font-weight: 600;
    margin-top: 10px;
  `;
  loadingText.textContent = 'Submitting your registration...';

  // Add CSS animation
  if (!document.getElementById('spinnerAnimation')) {
    const style = document.createElement('style');
    style.id = 'spinnerAnimation';
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  spinnerContainer.appendChild(spinner);
  spinnerContainer.appendChild(loadingText);
  overlay.appendChild(spinnerContainer);
  document.body.appendChild(overlay);
}

/**
 * Hide loading spinner overlay
 */
function hideLoadingSpinner() {
  const overlay = document.getElementById('loadingSpinnerOverlay');
  if (overlay) {
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.3s ease';
    setTimeout(() => overlay.remove(), 300);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFormHandler);
} else {
  initFormHandler();
}
