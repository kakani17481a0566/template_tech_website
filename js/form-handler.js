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

  // Disable submit button and show loading state
  submitButton.disabled = true;
  submitButton.textContent = 'Submitting...';
  submitButton.style.opacity = '0.6';

  try {
    // Collect form data
    const formData = new FormData(form);

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
      <span><strong>Success!</strong> Your registration has been submitted.</span>
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

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFormHandler);
} else {
  initFormHandler();
}
