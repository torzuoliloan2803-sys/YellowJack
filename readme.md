# Yellow Jack — Space New RP

Site vitrine officiel du bar Yellow Jack, dirigé par Petru Santu sur le serveur GTA RP Space New RP. Le site présente le règlement, la carte officielle, les informations communautaires et un formulaire de recrutement connecté à Discord.

## Technologies

- HTML sémantique, CSS responsive et JavaScript natif
- Netlify Functions pour l’envoi sécurisé des candidatures
- Webhook Discord conservé uniquement dans les variables d’environnement Netlify
- Image du Yellow Jack fournie comme référence visuelle du projet

## Lancer le site localement

Le site statique peut être ouvert directement, mais Netlify Dev est nécessaire pour tester l’envoi Discord :

```bash
netlify dev --port 8889
```

Le site est alors disponible sur `http://localhost:8889`.

## Configuration Discord

1. Créer un webhook dans le salon Discord destiné aux recrutements.
2. Dans Netlify, ouvrir **Site configuration → Environment variables**.
3. Ajouter `DISCORD_RECRUITMENT_WEBHOOK_URL` avec l’URL complète du webhook.
4. Facultatif : ajouter `DISCORD_RECRUITER_ROLE_ID` avec l’ID du rôle à notifier.
5. Déployer de nouveau le site après l’ajout des variables.

Ne jamais placer l’URL du webhook dans `script.js`, le HTML ou un fichier versionné. Le fichier `.env.example` indique uniquement les noms attendus.

Le formulaire envoie ses données à `/api/recruitment`. La fonction valide le dossier, bloque le champ anti-spam et limite les mentions Discord au seul rôle configuré.

## Structure

- `index.html` — contenu et structure de la page unique
- `style.css` — direction artistique, responsive et animations
- `script.js` — navigation, animations et soumission du formulaire
- `assets/` — image WebP optimisée utilisée dans le hero
- `netlify/functions/recruitment.mts` — validation et transmission de l’embed Discord
- `netlify.toml` — publication, fonctions et en-têtes de sécurité
