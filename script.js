const SUPABASE_URL = "https://ribrhupnsocybyzznwsu.supabase.co";
const SUPABASE_KEY = "sb_publishable_NDLHFnFXdlHkSSNuPxWYKw_MxmXmZYh";

document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.querySelector('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const form = document.querySelector('#application-form');
  const formStatus = document.querySelector('#form-status');
  const submitButton = form?.querySelector('.submit-button');

  // Gestion de la soumission du formulaire
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
          'Prefer': 'return=representation' // Permet de récupérer l'ID unique créé
        },
        body: JSON.stringify({
          first_name: payload.firstName,
          last_name: payload.lastName,
          age: parseInt(payload.age) || 18,
          position: payload.position,
          availability: payload.availability,
          discord: payload.discord,
          experience: payload.experience,
          traits: payload.traits,
          motivation: payload.motivation,
          status: 'en_attente'
        })
      });

      if (!response.ok) throw new Error('Erreur lors de l’enregistrement');

      const data = await response.json();
      const applicationId = data[0]?.id; // Récupère le numéro unique de dossier

      form.reset();
      if (formStatus) {
        formStatus.style.color = "#4ade80";
        formStatus.innerHTML = `Candidature transmise avec succès ! <br><b>Ton numéro de suivi : #${applicationId}</b> (conserve-le bien).`;
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

  // Gestion du bouton de suivi de candidature en temps réel
  document.getElementById('track-btn')?.addEventListener('click', async () => {
    const idInput = document.getElementById('track-id').value;
    const resultDiv = document.getElementById('track-result');

    if (!idInput) {
      resultDiv.style.color = "#f87171";
      resultDiv.textContent = "Entre un numéro de dossier valide.";
      return;
    }

    resultDiv.style.color = "#fff";
    resultDiv.textContent = "Recherche en cours...";

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/applications?id=eq.${idInput}`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });

      const data = await res.json();

      if (data.length === 0) {
        resultDiv.style.color = "#f87171";
        resultDiv.textContent = "Aucune candidature trouvée avec ce numéro.";
      } else {
        const status = data[0].status;
        let statusText = "En attente d'examen 🕒";
        let color = "#f59e0b";

        if (status === "accepte") {
          statusText = "Acceptée ! Félicitations 🎉";
          color = "#4ade80";
        } else if (status === "refuse") {
          statusText = "Refusée ❌";
          color = "#f87171";
        }

        resultDiv.style.color = color;
        resultDiv.innerHTML = `Statut actuel : ${statusText}`;
      }
    } catch (err) {
      console.error(err);
      resultDiv.style.color = "#f87171";
      resultDiv.textContent = "Erreur lors de la vérification.";
    }
  });

  // Accès secret à l'admin
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
