const SUPABASE_URL = "https://ribrhupnsocybyzznwsu.supabase.co";
const SUPABASE_KEY = "sb_publishable_NDLHFnFXdlHkSSNuPxWYKw_MxmXmZYh";

document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.querySelector('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const form = document.querySelector('#application-form');
  const formStatus = document.querySelector('#form-status');
  const submitButton = form?.querySelector('.submit-button');

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (formStatus) formStatus.textContent = '';

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    if (payload.company) {
      if (formStatus) formStatus.textContent = 'Candidature transmise !';
      return;
    }

    if (submitButton) submitButton.disabled = true;
    if (formStatus) formStatus.textContent = 'Envoi de votre dossier en cours...';

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          first_name: payload.firstName,
          last_name: payload.lastName,
          age: parseInt(payload.age) || 18,
          position: payload.position,
          experience: payload.experience,
          traits: payload.traits,
          motivation: payload.motivation
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("DÉTAIL ERREUR SUPABASE :", errorText);
        throw new Error('Erreur lors de l’enregistrement');
      }

      form.reset();
      if (formStatus) {
        formStatus.style.color = "#4ade80";
        formStatus.textContent = 'Candidature transmise avec succès ! L’équipe va l’examiner.';
      }
    } catch (err) {
      console.error(err);
      if (formStatus) {
        formStatus.style.color = "#f87171";
        formStatus.textContent = 'Une erreur est survenue lors de l’envoi. Réessayez.';
      }
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });

  document.getElementById('secret-admin-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    const password = prompt("Entrez le mot de passe administrateur :", "");
    if (password === "yellowjackpassword") {
      window.location.href = "admin.html";
    } else if (password !== null) {
      alert("Mot de passe incorrect !");
    }
  });
});
