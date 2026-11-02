const tabButtons = Array.from(document.querySelectorAll('.tab'));
const tabPanels = Array.from(document.querySelectorAll('.tab-panel'));
const modal = document.querySelector('#demo-modal');
const modalTitle = document.querySelector('#modal-title');
const demoForm = document.querySelector('#demo-form');
const modalStatus = document.querySelector('#modal-status');
const signinFields = document.querySelector('.signin-fields');
const demoPassword = document.querySelector('#demo-password');

function selectTab(name) {
  tabButtons.forEach((button) => {
    const isActive = button.dataset.tab === name;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-selected', String(isActive));
    button.tabIndex = isActive ? 0 : -1;
  });
  tabPanels.forEach((panel) => {
    const isActive = panel.dataset.panel === name;
    panel.classList.toggle('active', isActive);
    panel.hidden = !isActive;
  });
}

tabButtons.forEach((button, index) => {
  button.addEventListener('click', () => selectTab(button.dataset.tab));
  button.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const next = (index + direction + tabButtons.length) % tabButtons.length;
    tabButtons[next].focus();
    selectTab(tabButtons[next].dataset.tab);
  });
});

document.querySelectorAll('.faq-question').forEach((button) => {
  button.addEventListener('click', () => {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!isExpanded));
    button.querySelector('span').textContent = isExpanded ? '+' : '×';
    button.nextElementSibling.hidden = isExpanded;
  });
});

function openModal(mode) {
  const isSignin = mode === 'signin';
  modalTitle.textContent = isSignin ? 'Sign In' : 'Start your free demo';
  signinFields.hidden = !isSignin;
  demoPassword.required = isSignin;
  demoForm.reset();
  modalStatus.textContent = '';
  modal.hidden = false;
  document.body.classList.add('modal-open');
  window.setTimeout(() => document.querySelector('#demo-email').focus(), 0);
}

function closeModal() {
  modal.hidden = true;
  document.body.classList.remove('modal-open');
  modalStatus.textContent = '';
}

document.querySelectorAll('[data-open-modal]').forEach((button) => {
  button.addEventListener('click', () => openModal(button.dataset.openModal));
});

document.querySelector('.modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modal.hidden) closeModal();
});

demoForm.addEventListener('submit', (event) => {
  event.preventDefault();
  modalStatus.textContent = 'Demo only — nothing was sent and no account or subscription was created.';
});

function bindEmailForm(formId, inputId) {
  const form = document.querySelector(formId);
  const input = document.querySelector(inputId);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!input.reportValidity()) return;
    openModal('join');
    document.querySelector('#demo-email').value = input.value.trim();
  });
}
bindEmailForm('#hero-email-form', '#hero-email');
bindEmailForm('#footer-email-form', '#footer-email');
