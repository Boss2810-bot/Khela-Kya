(function () {
  const DEFAULT_LOCAL_API = 'http://localhost:5000';
  const API_BASE = getApiBase();

  const modal = document.getElementById('authModal');
  if (!modal) return;

  const authForm = document.getElementById('authForm');
  const authFields = document.getElementById('authFields');
  const authTitle = document.getElementById('authTitle');
  const feedback = document.getElementById('authFeedback');
  const switchLink = document.getElementById('switchToSignUp');

  function getApiBase() {
    const configured = window.KK_API_BASE;
    if (typeof configured === 'string' && configured.trim()) {
      return configured.trim().replace(/\/+$/, '');
    }
    return window.location.protocol === 'file:' ? DEFAULT_LOCAL_API : '';
  }

  function apiUrl(path) {
    return `${API_BASE}${path}`;
  }

  function setFeedback(message) {
    feedback.textContent = message || '';
  }

  function getStoredUser() {
    try {
      return JSON.parse(localStorage.getItem('kk_user') || 'null');
    } catch (err) {
      localStorage.removeItem('kk_user');
      return null;
    }
  }

  function openModal(mode) {
    const nextMode = mode || 'login';
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    authForm.dataset.mode = nextMode;
    renderFields(nextMode);
    authTitle.textContent = nextMode === 'signup' ? 'Create an account' : 'Sign in';
    setFeedback('');
    const first = authFields.querySelector('input');
    if (first) first.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    setFeedback('');
    authForm.reset();
  }

  function renderFields(mode) {
    authFields.replaceChildren();
    if (mode === 'signup') {
      authFields.appendChild(createInput('name', 'text', 'Full name', 'name'));
    }
    authFields.appendChild(createInput('email', 'email', 'Email', 'email'));
    authFields.appendChild(createInput(
      'password',
      'password',
      'Password',
      mode === 'signup' ? 'new-password' : 'current-password',
      8
    ));
  }

  function createInput(name, type, placeholder, autocomplete, minLength) {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = type;
    input.name = name;
    input.required = true;
    input.placeholder = placeholder;
    input.autocomplete = autocomplete;
    if (minLength) input.minLength = minLength;
    label.appendChild(document.createTextNode(placeholder));
    label.appendChild(input);
    return label;
  }

  async function readJson(response) {
    const text = await response.text();
    if (!text) return {};
    try {
      return JSON.parse(text);
    } catch (err) {
      return { message: text };
    }
  }

  document.querySelectorAll('.open-auth').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      openModal(link.dataset.mode || 'login');
    });
  });

  if (switchLink) {
    switchLink.addEventListener('click', (event) => {
      event.preventDefault();
      openModal('signup');
    });
  }

  modal.querySelectorAll('.modal-close').forEach((button) => {
    button.addEventListener('click', closeModal);
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) closeModal();
  });

  authForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const mode = authForm.dataset.mode || 'login';
    const formData = new FormData(authForm);
    const body = Object.fromEntries(formData.entries());

    setFeedback('Working...');
    try {
      const response = await fetch(apiUrl(mode === 'signup' ? '/api/signup' : '/api/login'), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body)
      });
      const json = await readJson(response);

      if (!response.ok) {
        setFeedback(json.message || `Auth failed (${response.status})`);
        return;
      }

      if (json.token) localStorage.setItem('kk_token', json.token);
      localStorage.setItem('kk_user', JSON.stringify(json.user || {}));
      updateAuthUI();
      setFeedback('Success');
      setTimeout(closeModal, 700);
    } catch (err) {
      console.error(err);
      setFeedback(`Network error. Start the server with "npm start" and open ${DEFAULT_LOCAL_API}.`);
    }
  });

  function createAvatar(initials, large) {
    const avatar = document.createElement('span');
    avatar.className = large ? 'user-avatar large' : 'user-avatar';
    avatar.textContent = initials || '?';
    return avatar;
  }

  function getInitials(user) {
    return String(user.name || user.email || '')
      .split(/\s+/)
      .map((part) => part.charAt(0))
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  function closeDropdown(menu) {
    const dropdown = menu && menu.querySelector('.user-dropdown');
    const trigger = menu && menu.querySelector('.user-trigger');
    if (!dropdown || !trigger) return;
    dropdown.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
  }

  function updateAuthUI() {
    const user = getStoredUser();
    document.querySelectorAll('.open-auth').forEach((link) => {
      link.style.display = user ? 'none' : 'inline';
    });

    let userEl = document.getElementById('userMenu');
    if (!user) {
      if (userEl) userEl.remove();
      return;
    }

    if (!userEl) {
      userEl = document.createElement('div');
      userEl.id = 'userMenu';
      userEl.className = 'user-menu';
      userEl.style.marginLeft = '1rem';
      document.querySelector('.header-inner').appendChild(userEl);
    }

    const initials = getInitials(user);
    const displayName = user.name || user.email || 'Account';

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'user-trigger';
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');

    const triggerName = document.createElement('span');
    triggerName.className = 'user-name';
    triggerName.textContent = displayName;
    trigger.append(createAvatar(initials), triggerName);

    const dropdown = document.createElement('div');
    dropdown.className = 'user-dropdown';
    dropdown.hidden = true;

    const card = document.createElement('div');
    card.className = 'user-card';

    const info = document.createElement('div');
    info.className = 'user-info';

    const nameEl = document.createElement('div');
    nameEl.className = 'user-name';
    nameEl.textContent = displayName;

    const emailEl = document.createElement('div');
    emailEl.className = 'user-email muted-small';
    emailEl.textContent = user.email || '';

    info.append(nameEl, emailEl);
    card.append(createAvatar(initials, true), info);

    const actions = document.createElement('div');
    actions.className = 'user-actions';

    const profileButton = document.createElement('button');
    profileButton.type = 'button';
    profileButton.className = 'btn-ghost';
    profileButton.textContent = 'View profile';

    const signOutButton = document.createElement('button');
    signOutButton.type = 'button';
    signOutButton.className = 'btn';
    signOutButton.textContent = 'Sign out';

    const profileStatus = document.createElement('div');
    profileStatus.className = 'muted-small';
    profileStatus.hidden = true;

    actions.append(profileButton, signOutButton);
    dropdown.append(card, profileStatus, actions);
    userEl.replaceChildren(trigger, dropdown);

    trigger.addEventListener('click', (event) => {
      event.stopPropagation();
      dropdown.hidden = !dropdown.hidden;
      trigger.setAttribute('aria-expanded', String(!dropdown.hidden));
    });

    profileButton.addEventListener('click', async () => {
      const token = localStorage.getItem('kk_token');
      if (!token) return;

      profileButton.disabled = true;
      profileStatus.hidden = false;
      profileStatus.textContent = 'Loading profile...';
      try {
        const response = await fetch(apiUrl('/api/profile'), {
          headers: { authorization: `Bearer ${token}` }
        });
        const json = await readJson(response);
        if (!response.ok) throw new Error(json.message || 'Unable to load profile');

        const joined = json.user && json.user.created_at
          ? new Date(json.user.created_at).toLocaleDateString()
          : 'recently';
        profileStatus.textContent = `Member since ${joined}`;
      } catch (err) {
        profileStatus.textContent = err.message || 'Unable to load profile';
      } finally {
        profileButton.disabled = false;
      }
    });

    signOutButton.addEventListener('click', () => {
      localStorage.removeItem('kk_token');
      localStorage.removeItem('kk_user');
      updateAuthUI();
    });
  }

  document.addEventListener('click', (event) => {
    const menu = document.getElementById('userMenu');
    if (menu && !menu.contains(event.target)) closeDropdown(menu);
  });

  updateAuthUI();
})();
