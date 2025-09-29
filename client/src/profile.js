// Profile Page JavaScript - Inherits paw generation from main script

document.addEventListener('DOMContentLoaded', () => {
  loadUserProfile();
  initializeProfileAuth();
  wireProfileButtons();
});

function wireProfileButtons() {
  const editBtn = document.querySelector('.btn-edit');
  const deleteBtn = document.querySelector('.btn-delete');
  const cancelBtn = document.querySelector('.btn-cancel');

  if (editBtn && !editBtn.__wired) {
    editBtn.addEventListener('click', (e) => {
      e.preventDefault();
      editProfile();
    });
    editBtn.__wired = true;
  }

  if (deleteBtn && !deleteBtn.__wired) {
    deleteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      deleteProfile();
    });
    deleteBtn.__wired = true;
  }

  if (cancelBtn && !cancelBtn.__wired) {
    cancelBtn.addEventListener('click', (e) => {
      e.preventDefault();
      cancelEdit();
    });
    cancelBtn.__wired = true;
  }
}

// ---- Load User ----
function loadUserProfile() {
  let currentUser = null;
  try {
    currentUser = JSON.parse(localStorage.getItem('currentUser')) ||
                  JSON.parse(sessionStorage.getItem('currentUser'));
  } catch (_) {}

  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }

  const userName = currentUser.name || (currentUser.email ? currentUser.email.split('@')[0] : 'User');
  const userEmail = currentUser.email || '';

  const userNameEl = document.getElementById('user-name');
  const userEmailEl = document.getElementById('user-email');
  if (userNameEl) userNameEl.textContent = userName;
  if (userEmailEl) userEmailEl.textContent = userEmail;

  const displayNameInput = document.getElementById('display-name');
  const displayEmailInput = document.getElementById('display-email');
  const themeInput = document.getElementById('current-theme');

  if (displayNameInput) displayNameInput.value = userName;
  if (displayEmailInput) displayEmailInput.value = userEmail;
  if (themeInput) {
    const currentTheme = localStorage.getItem('darkmode') === 'active' ? 'Dark' : 'Light';
    themeInput.value = currentTheme;
  }
}

// ---- Auth State ----
function initializeProfileAuth() {
  const isLoggedIn =
    localStorage.getItem('simpleAuthState') === 'logged-in' ||
    sessionStorage.getItem('simpleAuthState') === 'logged-in';

  const loggedOutButtons = document.querySelector('.logged-out-buttons');
  const loggedInButtons = document.querySelector('.logged-in-buttons');

  if (isLoggedIn) {
    if (loggedOutButtons) loggedOutButtons.style.display = 'none';
    if (loggedInButtons) loggedInButtons.style.display = 'flex';
  } else {
    if (loggedOutButtons) loggedOutButtons.style.display = 'flex';
    if (loggedInButtons) loggedInButtons.style.display = 'none';
    window.location.href = '../index.html';
    return;
  }

  const logoutButton = document.getElementById('logout-button');
  if (logoutButton && !logoutButton.__wired) {
    logoutButton.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('simpleAuthState');
      localStorage.removeItem('currentUser');
      sessionStorage.removeItem('simpleAuthState');
      sessionStorage.removeItem('currentUser');
      window.location.href = '../index.html';
    });
    logoutButton.__wired = true;
  }
}

// ---- Edit / Save / Cancel ----
function editProfile() {
  const editButton = document.querySelector('.btn-edit');
  if (!editButton) return;
  const isEditMode = editButton.textContent === 'Save';
  if (isEditMode) {
    saveProfileChanges();
  } else {
    enterEditMode();
  }
}

function enterEditMode() {
  const displayNameInput = document.getElementById('display-name');
  const displayEmailInput = document.getElementById('display-email');
  const themeInput = document.getElementById('current-theme');
  const notificationInput = document.getElementById('notification-settings');
  const cancelBtn = document.querySelector('.btn-cancel');
  const editBtn = document.querySelector('.btn-edit');

  [displayNameInput, displayEmailInput, themeInput, notificationInput].forEach(inp => {
    if (inp) {
      inp.dataset.original = inp.value;
      inp.removeAttribute('readonly');
      inp.classList.add('editing');
    }
  });

  if (editBtn) {
    editBtn.textContent = 'Save';
    editBtn.classList.add('btn-save');
  }
  if (cancelBtn) cancelBtn.style.display = 'inline-block';
}

function saveProfileChanges() {
  const displayNameInput = document.getElementById('display-name');
  const displayEmailInput = document.getElementById('display-email');

  let currentUser = null;
  let store = null;
  try {
    if (localStorage.getItem('currentUser')) {
      currentUser = JSON.parse(localStorage.getItem('currentUser'));
      store = 'local';
    } else if (sessionStorage.getItem('currentUser')) {
      currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
      store = 'session';
    }
  } catch (_) {}

  if (currentUser) {
    if (displayNameInput) currentUser.name = displayNameInput.value;
    if (displayEmailInput) currentUser.email = displayEmailInput.value;
    const serialized = JSON.stringify(currentUser);
    if (store === 'local') localStorage.setItem('currentUser', serialized);
    else sessionStorage.setItem('currentUser', serialized);

    const userNameEl = document.getElementById('user-name');
    const userEmailEl = document.getElementById('user-email');
    if (userNameEl) userNameEl.textContent = currentUser.name || '';
    if (userEmailEl) userEmailEl.textContent = currentUser.email || '';
  }

  exitEditMode();
  showMessage('Profile updated successfully!', 'success');
}

function cancelEdit() {
  ['display-name', 'display-email', 'current-theme', 'notification-settings'].forEach(id => {
    const el = document.getElementById(id);
    if (el && el.dataset.original !== undefined) {
      el.value = el.dataset.original;
    }
  });
  exitEditMode();
}

function exitEditMode() {
  const inputs = [
    document.getElementById('display-name'),
    document.getElementById('display-email'),
    document.getElementById('current-theme'),
    document.getElementById('notification-settings')
  ];
  const editBtn = document.querySelector('.btn-edit');
  const cancelBtn = document.querySelector('.btn-cancel');

  inputs.forEach(inp => {
    if (inp) {
      inp.setAttribute('readonly', 'true');
      inp.classList.remove('editing');
      delete inp.dataset.original;
    }
  });

  if (editBtn) {
    editBtn.textContent = 'Edit Profile';
    editBtn.classList.remove('btn-save');
  }
  if (cancelBtn) cancelBtn.style.display = 'none';
}

// ---- Delete Profile ----
function deleteProfile() {
  if (!confirm('Are you sure you want to delete your profile? This cannot be undone.')) return;

  localStorage.removeItem('currentUser');
  sessionStorage.removeItem('currentUser');
  localStorage.removeItem('simpleAuthState');
  sessionStorage.removeItem('simpleAuthState');

  showMessage('Profile deleted.', 'success');
  setTimeout(() => {
    window.location.href = '../index.html';
  }, 800);
}

// ---- Message ----
function showMessage(message, type = 'info') {
  const messageEl = document.createElement('div');
  messageEl.className = `profile-message ${type}`;
  messageEl.textContent = message;
  Object.assign(messageEl.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '12px 20px',
    borderRadius: '5px',
    color: '#fff',
    zIndex: '1000',
    fontWeight: '500',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    backgroundColor: type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'
  });
  document.body.appendChild(messageEl);
  setTimeout(() => messageEl.remove(), 3000);
}

// Expose for inline handlers if still present
window.editProfile = editProfile;
window.cancelEdit = cancelEdit;
window.deleteProfile = deleteProfile;