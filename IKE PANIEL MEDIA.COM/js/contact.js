const contactForm = document.getElementById('contactForm');
const hireForm = document.getElementById('hireForm');
const apiBase = window.location.pathname.includes('/admin/') ? '../php' : 'php';

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    try {
      const response = await fetch(`${apiBase}/messages/create.php`, {
        method: 'POST',
        body: formData
      });
      const result = await response.json();

      if (result.success) {
        window.renderToast ? window.renderToast(result.message, 'success') : alert(result.message);
        contactForm.reset();
      } else {
        window.renderToast ? window.renderToast(result.message || 'Message failed.', 'error') : alert(result.message || 'Message failed.');
      }
    } catch (error) {
      console.error('Contact form failed', error);
      alert('Unable to send your message right now.');
    }
  });
}

if (hireForm) {
  hireForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(hireForm);
    try {
      const response = await fetch(`${apiBase}/hire/create.php`, {
        method: 'POST',
        body: formData
      });
      const result = await response.json();

      if (result.success) {
        window.renderToast ? window.renderToast(result.message, 'success') : alert(result.message);
        hireForm.reset();
      } else {
        window.renderToast ? window.renderToast(result.message || 'Request failed.', 'error') : alert(result.message || 'Request failed.');
      }
    } catch (error) {
      console.error('Hire form failed', error);
      alert('Unable to submit your hire request right now.');
    }
  });
}
