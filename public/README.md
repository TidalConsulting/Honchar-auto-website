# Static files

Anything in this folder is served from the site root. `public/logo.png` becomes
`https://honcharauto.com/logo.png`.

## The logo

Put the brand artwork here as **`logo.png`** and it replaces the drawn stand-in
in the site header and footer automatically — no code change needed. An `.svg`
or `.webp` works too; point `NEXT_PUBLIC_LOGO_FILE` at it if the name differs.

A transparent background is preferable: without one, the logo sits on a small
white chip against the dark footer.

If the file isn't here, or fails to load, `src/components/Logo.tsx` falls back
to a drawn mark in the brand colours, so the header is never broken.

## Uploaded vehicle photos

Photos added through the dashboard go to Vercel Blob in production. Running
locally they land in `public/uploads/`, which is gitignored — those are working
files, not part of the repository.
