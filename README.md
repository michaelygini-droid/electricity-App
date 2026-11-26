# Listrik — Home Electricity Estimator (PLN token)

Mobile-first web app (installable PWA) to estimate and manage home electricity cost in Indonesia.

- Live app: https://michaelygini-droid.github.io/electricity-App/
- Tech: React + Vite + TypeScript + Tailwind, data stored on the device (localStorage).
- Languages: English / Bahasa Indonesia.

## Folder guide
- `src/core` — calculations only (no screens); reusable in a future native app
- `src/state` — saving/loading data on the device
- `src/components` — reusable UI pieces
- `src/screens` — full pages
- `src/i18n` — English and Indonesian text
- `tests` — automatic checks

## Run on your own computer (optional)
1. Install Node.js 22 from https://nodejs.org
2. In this folder run `npm install` then `npm run dev` and open the address it prints.
