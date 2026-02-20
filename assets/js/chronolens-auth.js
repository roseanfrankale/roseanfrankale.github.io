// ChronoLens Auth Modals
document.addEventListener('DOMContentLoaded', () => {
  const loginModal = document.getElementById('login-modal');
  const signupModal = document.getElementById('signup-modal');
  const loginTriggers = document.querySelectorAll('[data-auth="login"]');
  const signupTriggers = document.querySelectorAll('[data-auth="signup"]');
  const closeButtons = document.querySelectorAll('[data-close-modal]');
  const switchToSignup = document.getElementById('switch-to-signup');
  const switchToLogin = document.getElementById('switch-to-login');

  const openModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      modal.classList.remove('opacity-0');
      modal.querySelector('.cl-auth-content')?.classList.remove('scale-95');
    });
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.add('opacity-0');
    modal.querySelector('.cl-auth-content')?.classList.add('scale-95');
    setTimeout(() => {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }, 200);
  };

  const closeAllModals = () => {
    [loginModal, signupModal].forEach(closeModal);
  };

  loginTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      closeAllModals();
      openModal(loginModal);
    });
  });

  signupTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      closeAllModals();
      openModal(signupModal);
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.cl-auth-modal');
      closeModal(modal);
    });
  });

  if (switchToSignup) {
    switchToSignup.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal(loginModal);
      setTimeout(() => openModal(signupModal), 200);
    });
  }

  if (switchToLogin) {
    switchToLogin.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal(signupModal);
      setTimeout(() => openModal(loginModal), 200);
    });
  }

  // Close on backdrop click
  [loginModal, signupModal].forEach(modal => {
    if (!modal) return;
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  // Handle URL params for intent
  const urlParams = new URLSearchParams(window.location.search);
  const intent = urlParams.get('intent');
  if (intent === 'login' && loginModal) {
    openModal(loginModal);
  } else if (intent === 'signup' && signupModal) {
    openModal(signupModal);
  }
});
