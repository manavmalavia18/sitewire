# Sitewire Users Dashboard

React + TypeScript app for the [Sitewire coding challenge](https://github.com/sitewireco/sitewire-coding-challenge).

Displays user profiles with last login info from the fake users API, with retry logic, batched fetching, and per-row loading states.

**Bonus features:** humanized login times, country from IP, inactive user highlighting.

## Tabs

- **Dashboard** — user table with login data
- **Explain this load** — live event log for demo walkthrough
- **Interview prep** — full walkthrough notes (also available as PDF)

## Interview notes (PDF)

Simple beginner-friendly notes explaining every file. Good for reading on your phone before the interview.

```bash
npm run pdf
```

Output: `Sitewire-Interview-Notes.pdf` in the project root.

In the app: open the **Interview prep** tab.

## Local development

```bash
npm install
npm run dev
```

## Deploy (Vercel)

Framework preset: **Vite**  
Build command: `npm run build`  
Output directory: `dist`

No environment variables required.
