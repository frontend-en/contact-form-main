document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.form');
  const successToast = document.querySelector('.success-toast');
  const inputs = form.querySelectorAll('input:not([type="radio"]):not([type="checkbox"]), textarea');
  const submitButton = form.querySelector('button[type="submit"]');

  const errorHandlers = {
    show: (input, message) => {
      const inputGroup = input.closest('.input-group');
      const errorElement = document.getElementById(`${input.id}-error`);
      
      if (errorElement) {
        errorElement.textContent = message;
        errorElement.hidden = false;
      }
      inputGroup?.classList.add('error');
    },

    hide: (input) => {
      const inputGroup = input.closest('.input-group');
      const errorElement = document.getElementById(`${input.id}-error`);
      
      if (errorElement) {
        errorElement.hidden = true;
      }
      inputGroup?.classList.remove('error');
    }
  };

  const validators = {
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    required: (value) => value.trim().length > 0,
    radio: () => form.querySelector('input[name="queryType"]:checked'),
    consent: () => form.querySelector('#consent').checked
  };

  const showSuccessToast = () => {
    successToast.hidden = false;
    requestAnimationFrame(() => {
      successToast.classList.add('show');
      setTimeout(() => {
        successToast.classList.remove('show');
        setTimeout(() => successToast.hidden = true, 300);
      }, 3000);
    });
  };

  const validateForm = () => {
    let isValid = true;

    // Validate text inputs and textarea
    inputs.forEach(input => {
      if (input.required && !validators.required(input.value)) {
        errorHandlers.show(input, `Please enter your ${input.name}`);
        isValid = false;
      } else if (input.type === 'email' && !validators.email(input.value)) {
        errorHandlers.show(input, 'Please enter a valid email address');
        isValid = false;
      } else {
        errorHandlers.hide(input);
      }
    });

    // Validate radio buttons
    if (!validators.radio()) {
      errorHandlers.show(form.querySelector('input[name="queryType"]'), 'Please select a query type');
      isValid = false;
    }

    // Validate consent checkbox
    if (!validators.consent()) {
      errorHandlers.show(form.querySelector('#consent'), 'Please provide your consent to proceed');
      isValid = false;
    }

    return isValid;
  };

  // Event Listeners
  submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (validateForm()) {
      showSuccessToast();
      form.reset();
    }
  });

  inputs.forEach(input => {
    input.addEventListener('input', () => errorHandlers.hide(input));
  });

  // Add error handling for checkbox
  const consentCheckbox = form.querySelector('#consent');
  consentCheckbox.addEventListener('change', () => {
    errorHandlers.hide(consentCheckbox);
  });
});
