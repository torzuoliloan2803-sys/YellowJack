// Mot de passe simple pour protéger la page (à personnaliser)
const ADMIN_PASSWORD_HASH = "yellowjack2026"; 

const loginBox = document.getElementById('login-box');
const dashboard = document.getElementById('dashboard');
const loginBtn = document.getElementById('login-btn');
const passwordInput = document.getElementById('admin-password');
const appsList = document.getElementById('applications-list');

loginBtn.addEventListener('click', () => {
  if (passwordInput.value === ADMIN_PASSWORD_HASH) {
    loginBox.style.display = 'none';
    dashboard.style.display = 'block';
    loadApplications();
  } else {
    alert('Mot de passe incorrect !');
  }
});

function loadApplications() {
  // Ici, on récupérera les candidatures stockées (via un petit backend ou une base de données)
  appsList.innerHTML = `<p>Aucune candidature pour le moment.</p>`;
}
