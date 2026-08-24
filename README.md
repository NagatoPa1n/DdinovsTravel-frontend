# Ddinovs Travel — frontend

React + Vite front end for a tour agency: a public marketing site and an admin
panel for managing tours, destinations, categories, media, pages and settings.

The REST API that backs it lives in
[DdinovsTravel-backend](https://github.com/NagatoPa1n/DdinovsTravel-backend).

## Getting started

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` and point `VITE_API_URL` at your backend.

## Structure

- `src/app` — root component, providers, route table
- `src/pages/public` — marketing site
- `src/pages/admin` — authenticated CMS
- `src/features/*` — one API module per domain, plus domain helpers
- `src/features/i18n` — English / Uzbek / Russian interface strings and the language context
- `src/components/ui` — presentational primitives (button, input, modal, table…)
- `src/components/layout` — page shells and navigation
- `src/components/media` — media library building blocks
- `src/services` — fetch wrapper (`api.js`) and XHR uploader (`upload.js`)
- `src/hooks`, `src/utils`, `src/styles`

## Backend contract

The app expects a REST API at `VITE_API_URL` with bearer-token auth:

| Area | Endpoints |
| --- | --- |
| Auth | `POST /auth/login`, `GET /auth/me`, `PUT /auth/profile`, `PUT /auth/password`, `POST /auth/logout` |
| Tours | `GET /tours`, `GET /tours/:id`, `GET /tours/slug/:slug`, `POST/PUT/DELETE /tours` |
| Destinations | `GET/POST/PUT/DELETE /destinations`, `GET /destinations/slug/:slug` |
| Categories | `GET/POST/PUT/DELETE /categories` |
| Media | `GET /media`, `POST /media/upload`, `PUT/DELETE /media/:id` |
| Pages | `GET /pages`, `GET/PUT /pages/:slug` |
| Settings | `GET/PUT /settings/:group` (`general`, `contact`, `social`) |
| Contact form | `POST /contact` |

List endpoints may return either a bare array or `{ items, meta: { page, pages, total } }`.

`api.js` sends the chosen language as `Accept-Language`, so the API can return stored content
(tour descriptions, itineraries, page copy) machine-translated to match the interface.
