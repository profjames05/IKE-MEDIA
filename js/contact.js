const contactForm = document.getElementById('contactForm');
const hireForm = document.getElementById('hireForm');
const apiBase = window.location.pathname.includes('/admin/') ? '../php' : 'php';

function setFieldError(form, field, message) {
  const input = form.elements.namedItem(field);
  const error = document.getElementById(`${field}Error`);
  if (!input || !error) return;
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
  error.textContent = message;
}

function validateFields(form) {
  const values = Object.fromEntries(new FormData(form));
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[+0-9][0-9().\-\s]{7,25}$/;
  const errors = {};

  if (!values.name?.trim()) errors.name = 'Please enter your full name.';
  if (!values.email?.trim()) errors.email = 'Please enter your email address.';
  else if (!emailPattern.test(values.email.trim())) errors.email = 'Please enter a valid email address.';
  if (!values.phone?.trim()) errors.phone = 'Please enter your phone number.';
  else if (!phonePattern.test(values.phone.trim())) errors.phone = 'Please enter a valid phone number.';
  if (!values.subject?.trim()) errors.subject = 'Please enter a subject.';
  if (!values.message?.trim()) errors.message = 'Please enter your message.';
  else if (values.message.trim().length < 10) errors.message = 'Please provide at least 10 characters.';

  ['name', 'email', 'phone', 'subject', 'message'].forEach((field) => setFieldError(form, field, errors[field] || ''));
  return Object.keys(errors).length === 0;
}

async function getCsrfToken() {
  const response = await fetch(`${apiBase}/auth/csrf.php`, { credentials: 'same-origin' });
  const result = await response.json();
  if (!response.ok || !result.success || !result.csrf_token) {
    throw new Error('Unable to secure this form request.');
  }
  return result.csrf_token;
}

async function submitForm(form, endpoint, successMessage, failureMessage, validate = validateFields) {
  if (!form.checkValidity() || !validate(form)) {
    const firstInvalid = form.querySelector('[aria-invalid="true"]');
    firstInvalid?.focus();
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  const originalLabel = submitButton?.textContent;
  submitButton && (submitButton.disabled = true, submitButton.textContent = 'Sending…');

  try {
    const formData = new FormData(form);
    formData.set('csrf_token', await getCsrfToken());
    const response = await fetch(endpoint, { method: 'POST', credentials: 'same-origin', body: formData });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || failureMessage);
    }
    window.renderToast ? window.renderToast(result.message || successMessage, 'success') : alert(result.message || successMessage);
    form.reset();
    ['name', 'email', 'phone', 'subject', 'message'].forEach((field) => setFieldError(form, field, ''));
  } catch (error) {
    window.renderToast ? window.renderToast(error.message || failureMessage, 'error') : alert(error.message || failureMessage);
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = originalLabel;
    }
  }
}

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    submitForm(contactForm, `${apiBase}/messages/create.php`, 'Your message was sent successfully.', 'Unable to send your message right now.');
  });
}

if (hireForm) {
  hireForm.addEventListener('submit', (event) => {
    event.preventDefault();
    submitForm(hireForm, `${apiBase}/hire/create.php`, 'Your hire request was submitted successfully.', 'Unable to submit your hire request right now.', (form) => form.checkValidity());
  });
}
