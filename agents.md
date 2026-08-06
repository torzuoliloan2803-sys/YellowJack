# Project Guide

## Architecture

This is a no-build static site deployed from the repository root. `index.html`, `style.css`, and `script.js` form the complete client. Server-side behavior lives in `netlify/functions/` and uses modern Netlify Functions with Web API request and response objects.

## Key Directories

- `assets/`: local production images referenced by the static site.
- `netlify/functions/`: secure server-side integrations. Never expose credentials in client files.
- `.netlify/`: platform-generated metadata and result summaries; do not treat it as application source.

## Conventions

- Keep the interface framework-free unless the project requirements materially change.
- Use semantic HTML, accessible labels, visible focus styles, and reduced-motion fallbacks.
- Reuse the CSS custom properties in `:root` for all colors and typography.
- Keep Discord payload validation and formatting inside the recruitment function.
- Read secrets with `Netlify.env.get()` and document only environment variable names.
- Preserve French user-facing copy and the western saloon visual language.

## Non-obvious Decisions

The Discord webhook is intentionally proxied through `/api/recruitment`; direct browser calls would reveal the webhook URL. The optional recruiter role mention uses Discord `allowed_mentions` so applicant text cannot trigger arbitrary mentions. The hidden honeypot supplements server-side field validation without collecting persistent user data.

## Verification

Review edited files directly. The platform pipeline handles build and deployment validation; do not add a frontend build step for this project.
