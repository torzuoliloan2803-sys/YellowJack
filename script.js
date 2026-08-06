// CONFIGURATION SUPABASE
const SUPABASE_URL = "https://ribrhupnsocybyzznwsu.supabase.co";
const SUPABASE_KEY = "sb_publishable_NDLHFnFXdlHkSSNuPxWYKw_MxmXmZYh"; // Colle ta clé sb_publishable_... ici

const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.main-nav a');
const form = document.querySelector('#application-form');
const formStatus = document.querySelector('#form-status');
const submitButton = form?.querySelector('button[type="submit"]');

document.querySelector('#year').textContent = new Date().getFullYear();

const closeNavigation = () => {
  document.body.classList.remove('nav-open');
  navToggle?.setAttribute('aria-expanded', 'false');
  navToggle?.setAttribute('aria-label', 'Ouvrir le menu');
};

navToggle?.addEventListener('click', () => {
  const isOpen = document.body.classList.toggle('nav-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
});

navLinks.forEach((link) => link.addEventListener('click', closeNavigation));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeNavigation();
});

const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 30);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  revealObserver.observe(element);
});

const setStatus = (message, type = '') => {
  formStatus.textContent = message;
  formStatus.className = `form-status ${type}`.trim();
};

const setLoading = (loading) => {
  submitButton.disabled = loading;
  submitButton.querySelector('span').textContent = loading ? 'Transmission en cours...' : 'Envoyer ma candidature';
};

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  setStatus('');

  const fields = [...form.querySelectorAll('input, select, textarea')];
  fields.forEach((field) => field.removeAttribute('aria-invalid'));

  if (!form.checkValidity()) {
    const invalidFields = fields.filter((field) => !field.checkValidity());
    invalidFields.forEach((field) => field.setAttribute('aria-invalid', 'true'));
    invalidFields[0]?.focus();
    setStatus('Vérifie les champs obligatoires avant d’envoyer ton dossier.', 'error');
    return;
  }

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());
  
  if (payload.company) {
    setStatus('Candidature transmise !', 'success');
    return;
  }

  setLoading(true);
  setStatus('Le dossier traverse le désert jusqu’au bureau du patron...');

  try {
    // 1. Enregistrement dans Supabase
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
        age: parseInt(payload.age),
        position: payload.position,
        availability: payload.availability,
        experience: payload.experience,
        traits: payload.traits,
        motivation: payload.motivation
      })
    });

    if (!response.ok) throw new Error('Erreur lors de l’enregistrement.');

    // 2. Optionnel : Webhook Discord de notification simple
    const discordWebhookUrl = "https://discord.com/api/webhooks/1534733289305411735/rIeFIN8w4s4OmnKjcvMW-5i_kVsjYJeQ-dPeUgKT9MzGReVB_WIyTWuBA_RdJSu0yVu5";
    if (discordWebhookUrl && !discordWebhookUrl.includes("TON_URL")) {
      await fetch(discordWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `📥 **Nouvelle candidature reçue !** Un nouveau dossier de **${payload.firstName} ${payload.lastName}** (${payload.position}) attend sur le panneau d'administration.`
        })
      });
    }

    form.reset();
    setStatus('Candidature transmise avec succès ! L’équipe du Yellow Jack va l’examiner.', 'success');
  } catch (error) {
    console.error(error);
    setStatus('Une erreur est survenue lors de l’envoi. Réessaie dans quelques instants.', 'error');
  } finally {
    setLoading(false);
  }
});
