const adminApiBase = window.location.pathname.includes('/admin/') ? '../php' : 'php';

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => toast.remove(), 3200);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

async function getCsrfToken() {
  const response = await fetch(`${adminApiBase}/auth/csrf.php`, { credentials: 'same-origin' });
  const result = await response.json();
  if (!response.ok || !result.success || !result.csrf_token) {
    throw new Error('Unable to secure this request.');
  }
  return result.csrf_token;
}

async function fetchJson(url, options = {}) {
  const requestOptions = { ...options, credentials: options.credentials || 'same-origin' };
  if (requestOptions.method && requestOptions.method.toUpperCase() === 'POST') {
    const token = await getCsrfToken();
    if (requestOptions.body instanceof FormData) {
      requestOptions.body.append('csrf_token', token);
    } else if (requestOptions.body instanceof URLSearchParams) {
      requestOptions.body.set('csrf_token', token);
    } else {
      requestOptions.headers = { ...(requestOptions.headers || {}), 'X-CSRF-Token': token };
    }
  }

  const response = await fetch(url, requestOptions);
  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : {};
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

if (document.getElementById('adminLoginForm')) {
  const loginForm = document.getElementById('adminLoginForm');
  const passwordInput = document.getElementById('admin-password');
  const passwordToggle = document.getElementById('togglePassword');

  passwordToggle?.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    passwordToggle.textContent = isPassword ? 'Hide password' : 'Show password';
    passwordToggle.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    passwordInput.focus();
  });

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(loginForm);
    const submitButton = loginForm.querySelector('button[type="submit"]');
    const error = document.getElementById('adminLoginError');
    error.textContent = '';

    if (!loginForm.checkValidity()) {
      loginForm.reportValidity();
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Signing in…';
    try {
      const result = await fetchJson(`${adminApiBase}/auth/login.php`, { method: 'POST', body: formData });
      showToast(result.message || 'Login successful.', 'success');
      window.location.assign(result.redirect || 'dashboard.html');
    } catch (error) {
      error.textContent = error.message || 'Login failed. Please try again.';
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Login';
    }
  });
}

if (document.getElementById('logoutButton')) {
  document.getElementById('logoutButton').addEventListener('click', async () => {
    try {
      await fetchJson(`${adminApiBase}/auth/logout.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams().toString(),
      });
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      window.location.assign('../index.html');
    }
  });
}

if (document.getElementById('settingsForm')) {
  async function loadAdminSettings() {
    try {
      const result = await fetchJson(`${adminApiBase}/settings/read.php`);
      const settings = result.settings || {};
      Object.entries(settings).forEach(([key, value]) => {
        const input = document.getElementById(key);
        if (input) input.value = value || '';
      });
    } catch (error) {
      showToast('Unable to load settings.', 'error');
    }
  }

  document.getElementById('settingsForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      const result = await fetchJson(`${adminApiBase}/settings/update.php`, { method: 'POST', body: formData });
      showToast(result.message || 'Settings saved.', 'success');
    } catch (error) {
      showToast(error.message || 'Unable to save settings.', 'error');
    }
  });

  loadAdminSettings();
}

if (document.getElementById('projectForm')) {
  document.getElementById('projectForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const result = await fetchJson(`${adminApiBase}/projects/create.php`, { method: 'POST', body: formData });
      showToast(result.message || 'Project created.', 'success');
      form.reset();
      await loadCategoriesForSelect('project-category');
    } catch (error) {
      showToast(error.message || 'Project creation failed.', 'error');
    }
  });

  async function loadCategoriesForSelect(targetId) {
    const selectElement = document.getElementById(targetId);
    if (!selectElement) return;

    try {
      const result = await fetchJson(`${adminApiBase}/categories/read.php`);
      const categories = result.categories || [];
      selectElement.innerHTML = categories.map((category) => `<option value="${Number(category.id) || ''}">${escapeHtml(category.name)}</option>`).join('');
    } catch (error) {
      console.error(error);
    }
  }

  loadCategoriesForSelect('project-category');
}

if (document.getElementById('editProjectForm')) {
  async function populateEditProject() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return;

    try {
      const result = await fetchJson(`${adminApiBase}/projects/read.php?id=${id}`);
      const project = result.project || {};
      document.getElementById('edit-project-id').value = project.id;
      document.getElementById('edit-project-title').value = project.title || '';
      document.getElementById('edit-project-description').value = project.description || '';
      document.getElementById('edit-project-client').value = project.client || '';
      document.getElementById('edit-project-date').value = project.project_date || '';
      document.getElementById('edit-project-tools').value = project.tools || '';
      document.getElementById('edit-project-type').value = project.project_type || '';
      document.getElementById('edit-project-featured').checked = Number(project.featured) === 1;

      const categoryResult = await fetchJson(`${adminApiBase}/categories/read.php`);
      const categories = categoryResult.categories || [];
      const categorySelect = document.getElementById('edit-project-category');
      categorySelect.innerHTML = categories.map((category) => `<option value="${Number(category.id) || ''}">${escapeHtml(category.name)}</option>`).join('');
      categorySelect.value = String(project.category_id || categories[0]?.id || '');
    } catch (error) {
      showToast('Unable to load project.', 'error');
    }
  }

  document.getElementById('editProjectForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      const result = await fetchJson(`${adminApiBase}/projects/update.php`, { method: 'POST', body: formData });
      showToast(result.message || 'Project updated.', 'success');
    } catch (error) {
      showToast(error.message || 'Project update failed.', 'error');
    }
  });

  populateEditProject();
}

if (document.getElementById('projectsTableBody')) {
  async function loadProjectsTable() {
    try {
      const result = await fetchJson(`${adminApiBase}/projects/read.php?limit=50`);
      const projects = result.projects || [];
      const tbody = document.getElementById('projectsTableBody');
      tbody.innerHTML = projects.map((project) => `
        <tr>
          <td>${escapeHtml(project.title)}</td>
          <td>${escapeHtml(project.category_name || 'N/A')}</td>
          <td>${escapeHtml(project.client || 'N/A')}</td>
          <td>${escapeHtml(project.project_date || 'N/A')}</td>
          <td>${Number(project.featured) === 1 ? 'Yes' : 'No'}</td>
          <td class="table-actions">
            <a href="../project-details.html?id=${Number(project.id) || ''}" class="action-btn" target="_blank">View</a>
            <a href="edit-project.html?id=${Number(project.id) || ''}" class="action-btn primary">Edit</a>
            <button class="action-btn danger" data-delete-id="${Number(project.id) || ''}" data-delete-type="project">Delete</button>
          </td>
        </tr>
      `).join('');

      document.querySelectorAll('[data-delete-type="project"]').forEach((button) => {
        button.addEventListener('click', async () => {
          const id = button.dataset.deleteId;
          try {
            await fetchJson(`${adminApiBase}/projects/delete.php`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: new URLSearchParams({ id }).toString()
            });
            showToast('Project deleted.', 'success');
            loadProjectsTable();
          } catch (error) {
            showToast(error.message || 'Delete failed.', 'error');
          }
        });
      });
    } catch (error) {
      showToast('Unable to load projects.', 'error');
    }
  }

  document.getElementById('projectSearch').addEventListener('input', async (event) => {
    const query = event.target.value;
    const result = await fetchJson(`${adminApiBase}/projects/read.php?limit=50&search=${encodeURIComponent(query)}`);
    const projects = result.projects || [];
    const tbody = document.getElementById('projectsTableBody');
    tbody.innerHTML = projects.map((project) => `
      <tr>
        <td>${escapeHtml(project.title)}</td>
        <td>${escapeHtml(project.category_name || 'N/A')}</td>
        <td>${escapeHtml(project.client || 'N/A')}</td>
        <td>${escapeHtml(project.project_date || 'N/A')}</td>
        <td>${Number(project.featured) === 1 ? 'Yes' : 'No'}</td>
        <td class="table-actions">
          <a href="../project-details.html?id=${Number(project.id) || ''}" class="action-btn" target="_blank">View</a>
          <a href="edit-project.html?id=${Number(project.id) || ''}" class="action-btn primary">Edit</a>
          <button class="action-btn danger" data-delete-id="${Number(project.id) || ''}" data-delete-type="project">Delete</button>
        </td>
      </tr>
    `).join('');
  });

  loadProjectsTable();
}

if (document.getElementById('categoriesTableBody')) {
  async function loadCategoriesTable() {
    try {
      const result = await fetchJson(`${adminApiBase}/categories/read.php`);
      const categories = result.categories || [];
      const tbody = document.getElementById('categoriesTableBody');
      tbody.innerHTML = categories.map((category) => `
        <tr>
          <td>${escapeHtml(category.name)}</td>
          <td>${escapeHtml(category.description || 'N/A')}</td>
          <td class="table-actions">
            <button class="action-btn primary" data-edit-category-id="${Number(category.id) || ''}" data-edit-category-name="${escapeHtml(category.name)}" data-edit-category-description="${escapeHtml(category.description || '')}">Edit</button>
            <button class="action-btn danger" data-delete-category-id="${Number(category.id) || ''}">Delete</button>
          </td>
        </tr>
      `).join('');

      document.querySelectorAll('[data-delete-category-id]').forEach((button) => {
        button.addEventListener('click', async () => {
          try {
            await fetchJson(`${adminApiBase}/categories/delete.php`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: new URLSearchParams({ id: button.dataset.deleteCategoryId }).toString()
            });
            showToast('Category deleted.', 'success');
            loadCategoriesTable();
          } catch (error) {
            showToast(error.message || 'Delete failed.', 'error');
          }
        });
      });

      document.querySelectorAll('[data-edit-category-id]').forEach((button) => {
        button.addEventListener('click', () => {
          document.getElementById('category-name').value = button.dataset.editCategoryName;
          document.getElementById('category-description').value = button.dataset.editCategoryDescription;
          document.getElementById('categoryForm').dataset.editCategoryId = button.dataset.editCategoryId;
        });
      });
    } catch (error) {
      showToast('Unable to load categories.', 'error');
    }
  }

  document.getElementById('categoryForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const id = event.currentTarget.dataset.editCategoryId;
    const url = id ? `${adminApiBase}/categories/update.php` : `${adminApiBase}/categories/create.php`;
    if (id) formData.append('id', id);

    try {
      const result = await fetchJson(url, { method: 'POST', body: formData });
      showToast(result.message || 'Category saved.', 'success');
      event.currentTarget.reset();
      delete event.currentTarget.dataset.editCategoryId;
      loadCategoriesTable();
    } catch (error) {
      showToast(error.message || 'Category action failed.', 'error');
    }
  });

  loadCategoriesTable();
}

if (document.getElementById('testimonialsTableBody')) {
  async function loadTestimonialsTable() {
    try {
      const result = await fetchJson(`${adminApiBase}/testimonials/read.php?status=published`);
      const testimonials = result.testimonials || [];
      const tbody = document.getElementById('testimonialsTableBody');
      tbody.innerHTML = testimonials.map((test) => `
        <tr>
          <td>${escapeHtml(test.name)}</td>
          <td>${escapeHtml(test.company || 'N/A')}</td>
          <td>${'★'.repeat(Number(test.rating) || 0)}${'☆'.repeat(Math.max(0, 5 - (Number(test.rating) || 0)))}</td>
          <td>${escapeHtml(test.status)}</td>
          <td class="table-actions">
            <button class="action-btn danger" data-delete-testimonial-id="${Number(test.id) || ''}">Delete</button>
          </td>
        </tr>
      `).join('');

      document.querySelectorAll('[data-delete-testimonial-id]').forEach((button) => {
        button.addEventListener('click', async () => {
          try {
            await fetchJson(`${adminApiBase}/testimonials/delete.php`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: new URLSearchParams({ id: button.dataset.deleteTestimonialId }).toString()
            });
            showToast('Testimonial deleted.', 'success');
            loadTestimonialsTable();
          } catch (error) {
            showToast(error.message || 'Delete failed.', 'error');
          }
        });
      });
    } catch (error) {
      showToast('Unable to load testimonials.', 'error');
    }
  }

  document.getElementById('testimonialForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set('status', formData.get('status') ? 'published' : 'hidden');

    try {
      const result = await fetchJson(`${adminApiBase}/testimonials/create.php`, { method: 'POST', body: formData });
      showToast(result.message || 'Testimonial added.', 'success');
      event.currentTarget.reset();
      loadTestimonialsTable();
    } catch (error) {
      showToast(error.message || 'Unable to add testimonial.', 'error');
    }
  });

  loadTestimonialsTable();
}

if (document.getElementById('messagesTableBody')) {
  const messageSearch = document.getElementById('messageSearch');
  const messageStatusFilter = document.getElementById('messageStatusFilter');
  const messageCount = document.getElementById('messageCount');

  async function loadMessagesTable() {
    try {
      const params = new URLSearchParams({
        limit: '50',
        search: messageSearch?.value || '',
        status: messageStatusFilter?.value || '',
      });
      const result = await fetchJson(`${adminApiBase}/messages/read.php?${params.toString()}`);
      const messages = result.messages || [];
      const tbody = document.getElementById('messagesTableBody');
      messageCount.textContent = `${result.total || messages.length} message${(result.total || messages.length) === 1 ? '' : 's'}`;
      tbody.innerHTML = messages.length ? messages.map((message) => `
        <tr>
          <td><strong>${escapeHtml(message.name)}</strong></td>
          <td><a href="mailto:${escapeHtml(message.email)}">${escapeHtml(message.email)}</a></td>
          <td>${escapeHtml(message.phone || 'N/A')}</td>
          <td>${escapeHtml(message.subject || 'N/A')}</td>
          <td class="message-preview">${escapeHtml(message.message)}</td>
          <td><span class="status-badge ${escapeHtml(message.status)}">${escapeHtml(message.status)}</span></td>
          <td>${message.created_at ? new Date(message.created_at).toLocaleString() : 'N/A'}</td>
          <td class="table-actions">
            <button class="action-btn primary" data-message-status-id="${Number(message.id) || ''}" data-status="read">Mark Read</button>
            <button class="action-btn danger" data-delete-message-id="${Number(message.id) || ''}">Delete</button>
          </td>
        </tr>
      `).join('') : '<tr><td colspan="8" class="empty-state">No messages match these filters.</td></tr>';

      document.querySelectorAll('[data-delete-message-id]').forEach((button) => {
        button.addEventListener('click', async () => {
          try {
            await fetchJson(`${adminApiBase}/messages/delete.php`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: new URLSearchParams({ id: button.dataset.deleteMessageId }).toString()
            });
            showToast('Message deleted.', 'success');
            loadMessagesTable();
          } catch (error) {
            showToast(error.message || 'Delete failed.', 'error');
          }
        });
      });

      document.querySelectorAll('[data-message-status-id]').forEach((button) => {
        button.addEventListener('click', async () => {
          try {
            await fetchJson(`${adminApiBase}/messages/update-status.php`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: new URLSearchParams({ id: button.dataset.messageStatusId, status: button.dataset.status }).toString()
            });
            showToast('Message status updated.', 'success');
            loadMessagesTable();
          } catch (error) {
            showToast(error.message || 'Status update failed.', 'error');
          }
        });
      });
    } catch (error) {
      showToast('Unable to load messages.', 'error');
    }
  }

  messageSearch?.addEventListener('input', loadMessagesTable);
  messageStatusFilter?.addEventListener('change', loadMessagesTable);
  loadMessagesTable();
}

if (document.getElementById('hireRequestsTableBody')) {
  async function loadHireRequestsTable() {
    try {
      const result = await fetchJson(`${adminApiBase}/hire/read.php`);
      const requests = result.hire_requests || [];
      const tbody = document.getElementById('hireRequestsTableBody');
      tbody.innerHTML = requests.map((request) => `
        <tr>
          <td>${escapeHtml(request.name)}</td>
          <td>${escapeHtml(request.project_type || 'N/A')}</td>
          <td>${escapeHtml(request.budget || 'N/A')}</td>
          <td>${escapeHtml(request.status)}</td>
          <td>${request.created_at ? new Date(request.created_at).toLocaleDateString() : 'N/A'}</td>
          <td class="table-actions">
            <button class="action-btn primary" data-hire-status-id="${Number(request.id) || ''}" data-status="contacted">Contacted</button>
          </td>
        </tr>
      `).join('');

      document.querySelectorAll('[data-hire-status-id]').forEach((button) => {
        button.addEventListener('click', async () => {
          try {
            await fetchJson(`${adminApiBase}/hire/update-status.php`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: new URLSearchParams({ id: button.dataset.hireStatusId, status: button.dataset.status }).toString()
            });
            showToast('Hire request updated.', 'success');
            loadHireRequestsTable();
          } catch (error) {
            showToast(error.message || 'Status update failed.', 'error');
          }
        });
      });
    } catch (error) {
      showToast('Unable to load hire requests.', 'error');
    }
  }

  loadHireRequestsTable();
}

if (document.getElementById('total-works')) {
  async function loadDashboardStats() {
    try {
      const projectResponse = await fetchJson(`${adminApiBase}/projects/read.php?stats=1`);
      const messageResponse = await fetchJson(`${adminApiBase}/messages/read.php`);
      const testimonialResponse = await fetchJson(`${adminApiBase}/testimonials/read.php?stats=1`);
      const hireResponse = await fetchJson(`${adminApiBase}/hire/read.php`);
      const categoryResponse = await fetchJson(`${adminApiBase}/categories/read.php`);

      document.getElementById('total-works').textContent = projectResponse.stats?.total ?? 0;
      document.getElementById('total-categories').textContent = (categoryResponse.categories || []).length;
      document.getElementById('total-messages').textContent = (messageResponse.messages || []).length;
      document.getElementById('total-testimonials').textContent = testimonialResponse.stats?.total ?? 0;
      document.getElementById('total-hire-requests').textContent = (hireResponse.hire_requests || []).length;

      const projectList = await fetchJson(`${adminApiBase}/projects/read.php?limit=5`);
      document.getElementById('recent-projects').innerHTML = (projectList.projects || []).map((project) => `
        <div class="mini-list-item"><span>${escapeHtml(project.title)}</span><small>${escapeHtml(project.category_name || 'Design')}</small></div>
      `).join('');

      const messages = messageResponse.messages || [];
      document.getElementById('recent-messages').innerHTML = messages.slice(0, 5).map((message) => `
        <div class="mini-list-item"><span>${escapeHtml(message.name)}</span><small>${escapeHtml(message.status)}</small></div>
      `).join('');

      const categories = categoryResponse.categories || [];
      document.getElementById('category-stats').innerHTML = categories.map((category) => `
        <div class="category-stat"><span>${escapeHtml(category.name)}</span><strong>${(projectResponse.stats && projectResponse.stats.total) ? 'Active' : '0'}</strong></div>
      `).join('');
    } catch (error) {
      console.error(error);
    }
  }

  loadDashboardStats();
}

if (document.getElementById('changePasswordForm')) {
  document.getElementById('changePasswordForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      const result = await fetchJson(`${adminApiBase}/auth/change-password.php`, { method: 'POST', body: formData });
      showToast(result.message || 'Password updated.', 'success');
      event.currentTarget.reset();
    } catch (error) {
      showToast(error.message || 'Password change failed.', 'error');
    }
  });
}

if (document.getElementById('homeContentForm')) {
  async function loadHomeContentSettings() {
    try {
      const result = await fetchJson(`${adminApiBase}/settings/read.php`);
      const settings = result.settings || {};
      Object.entries(settings).forEach(([key, value]) => {
        const input = document.getElementById(key);
        if (input) input.value = value || '';
      });
    } catch (error) {
      showToast('Unable to load home content.', 'error');
    }
  }

  document.getElementById('homeContentForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      const result = await fetchJson(`${adminApiBase}/settings/update.php`, { method: 'POST', body: formData });
      showToast(result.message || 'Home content saved.', 'success');
    } catch (error) {
      showToast(error.message || 'Unable to save home content.', 'error');
    }
  });

  loadHomeContentSettings();
}

if (document.getElementById('mediaUploadForm')) {
  const mediaForm = document.getElementById('mediaUploadForm');

  async function loadMediaLibrary() {
    try {
      const result = await fetchJson(`${adminApiBase}/media/read.php`);
      const files = result.files || [];
      const target = document.getElementById('mediaFilesList');
      if (!target) return;

      target.innerHTML = files.map((file) => `
        <div class="panel">
          <img src="${safeImageUrl(file.file_path)}" alt="${escapeHtml(file.name)}" style="max-height: 160px; object-fit: cover; border-radius: 12px; margin-bottom: 12px;" />
          <div><strong>${escapeHtml(file.name)}</strong></div>
          <div class="table-actions" style="margin-top: 10px;">
            <a href="${safeImageUrl(file.file_path)}" class="action-btn primary" target="_blank">View</a>
            <button class="action-btn danger" data-delete-media-id="${Number(file.id) || ''}">Delete</button>
          </div>
        </div>
      `).join('');

      document.querySelectorAll('[data-delete-media-id]').forEach((button) => {
        button.addEventListener('click', async () => {
          try {
            await fetchJson(`${adminApiBase}/media/delete.php`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: new URLSearchParams({ id: button.dataset.deleteMediaId }).toString()
            });
            showToast('Media deleted.', 'success');
            loadMediaLibrary();
          } catch (error) {
            showToast(error.message || 'Delete failed.', 'error');
          }
        });
      });
    } catch (error) {
      showToast('Unable to load media files.', 'error');
    }
  }

  mediaForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(mediaForm);

    try {
      const result = await fetchJson(`${adminApiBase}/media/upload.php`, { method: 'POST', body: formData });
      showToast(result.message || 'Image uploaded.', 'success');
      mediaForm.reset();
      loadMediaLibrary();
    } catch (error) {
      showToast(error.message || 'Upload failed.', 'error');
    }
  });

  loadMediaLibrary();
}

if (document.getElementById('serviceForm')) {
  async function loadServicesList() {
    try {
      const result = await fetchJson(`${adminApiBase}/services/read.php`);
      const services = result.services || [];
      const target = document.getElementById('servicesTableBody');
      if (!target) return;

      target.innerHTML = services.map((service) => `
        <div class="mini-list-item">
          <div>
            <strong>${escapeHtml(service.icon || '✦')} ${escapeHtml(service.title)}</strong>
            <div>${escapeHtml(service.description)}</div>
          </div>
          <div class="table-actions">
            <button class="action-btn primary" data-edit-service-id="${Number(service.id) || ''}" data-edit-title="${escapeHtml(service.title)}" data-edit-icon="${escapeHtml(service.icon || '✦')}" data-edit-description="${escapeHtml(service.description)}" data-edit-sort-order="${Number(service.sort_order) || 0}" data-edit-published="${Number(service.published) === 1}">Edit</button>
            <button class="action-btn danger" data-delete-service-id="${Number(service.id) || ''}">Delete</button>
          </div>
        </div>
      `).join('');

      document.querySelectorAll('[data-delete-service-id]').forEach((button) => {
        button.addEventListener('click', async () => {
          try {
            await fetchJson(`${adminApiBase}/services/delete.php`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: new URLSearchParams({ id: button.dataset.deleteServiceId }).toString()
            });
            showToast('Service deleted.', 'success');
            loadServicesList();
          } catch (error) {
            showToast(error.message || 'Delete failed.', 'error');
          }
        });
      });

      document.querySelectorAll('[data-edit-service-id]').forEach((button) => {
        button.addEventListener('click', () => {
          document.getElementById('service-title').value = button.dataset.editTitle;
          document.getElementById('service-icon').value = button.dataset.editIcon || '✦';
          document.getElementById('service-description').value = button.dataset.editDescription;
          document.getElementById('service-sort-order').value = button.dataset.editSortOrder || 0;
          document.getElementById('serviceForm').dataset.serviceId = button.dataset.editServiceId;
          document.getElementById('serviceForm').querySelector('input[name="published"]').checked = Number(button.dataset.editPublished) === 1;
        });
      });
    } catch (error) {
      showToast('Unable to load services.', 'error');
    }
  }

  document.getElementById('serviceForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const serviceId = event.currentTarget.dataset.serviceId;
    const payloadUrl = serviceId ? `${adminApiBase}/services/update.php` : `${adminApiBase}/services/create.php`;
    if (serviceId) {
      formData.append('id', serviceId);
    }
    formData.set('published', formData.get('published') ? '1' : '0');

    try {
      const result = await fetchJson(payloadUrl, { method: 'POST', body: formData });
      showToast(result.message || 'Service saved.', 'success');
      event.currentTarget.reset();
      delete event.currentTarget.dataset.serviceId;
      loadServicesList();
    } catch (error) {
      showToast(error.message || 'Unable to save service.', 'error');
    }
  });

  loadServicesList();
}
