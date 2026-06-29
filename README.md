# Downtown Donuts — Website

A custom, mobile-first website for **Downtown Donuts**, a cozy family-owned
donut & coffee shop serving downtown since 1992. Built on the CS208 full-stack
starter (Node.js + Express + Pug + MariaDB/MySQL).

This is a **prototype** built to win the development contract. All copy is
placeholder (Lorem Ipsum) and the palette is a stand-in until the official
Brand Guidelines are dropped in (see **Branding** below).

---

Author- Logan Jungert
Class- CS208
Term- Summer 2026

---

## Features

- **Landing page** (`/`) — hero, featured items, story teaser, and ordering CTA.
- **Menu page** (`/menu`) — categorized menu (Donuts / Coffee / Seasonal) plus an
  **online ordering** section linking to UberEats and DoorDash (`/menu#order`).
- **About page** (`/about`) — the shop's story and a since-1992 timeline.
- **Comments page** (`/comments`) — visitors submit a name, rating, and message;
  comments are stored in the database and rendered newest-first on a public wall.
- Sticky responsive nav with a mobile hamburger menu (CSS-only).
- Cozy, minimal, modern design driven by a single set of CSS brand tokens.
- Fully responsive / mobile-first; respects `prefers-reduced-motion`.

## Tech stack

- **Node.js + Express 5** — server and routing
- **Pug** — server-side HTML templates
- **MariaDB / MySQL** (via `mysql2`) — stores customer comments
- Plain CSS (no build step) in `public/stylesheets/style.css`

---

## Setup & Run

> Prerequisites: Node.js and MariaDB/MySQL. In a GitHub Codespace, use the
> scripts below exactly as written.

### 1. Install and start the database (run once)

```bash
./setup_scripts/install_db.sh
```

Answer the prompts as in the original course docs (root password `12345`).
See `docs/example_project.md` for the full prompt-by-prompt walkthrough.

### 2. Create the database and `comments` table (with demo data)

```bash
sudo mysql -u root -p < ./setup_scripts/create_demo_table.sql
```

This creates the `downtowndonuts` database, the `comments` table, and seeds a
few example comments so the wall isn't empty on first load.

### 3. Install Node dependencies and run

```bash
npm install
npm start
```

Then open **http://localhost:3000**.

> DB credentials live in `bin/db.js` (host `localhost`, user `root`,
> password `12345`, database `downtowndonuts`). Update them there if your
> setup differs.

---

## Branding — how to apply the official guidelines

The design is token-driven so the brand can be applied in minutes:

1. **Colors & fonts:** open `public/stylesheets/style.css` and edit the
   `:root` block at the very top (clearly marked `>>> BRAND TOKENS <<<`).
   Replace the placeholder `--color-*` values and the two `--font-*` values
   with the official palette and typefaces from the Brand Guidelines.
2. **Logo:** drop the logo file into `public/images/` and replace the
   `span.brand-mark 🍩` text in `views/layout.pug` (header and footer) with an
   `img(src='/images/logo.svg', alt='Downtown Donuts')`.
3. **Menu content:** replace the placeholder arrays in `routes/menu.js` with the
   real items/prices from the client's PDF menu.
4. **Ordering links:** update the UberEats/DoorDash URLs in `routes/menu.js`
   (and the footer in `views/layout.pug`) with the shop's real store pages.

---

## Project structure

```
app.js                      Express app: middleware + route wiring
bin/www                     Server entry point (starts HTTP + DB connection)
bin/db.js                   MySQL connection + dbMiddleware (req.db)
routes/
  index.js                  Landing page
  menu.js                   Menu + ordering links
  about.js                  About / story / timeline
  comments.js               GET list + POST create (comments)
views/
  layout.pug                Shared shell: nav, footer, fonts
  index.pug  menu.pug  about.pug  comments.pug  error.pug
public/
  stylesheets/style.css     All styles + brand tokens
  images/  javascripts/     (assets)
setup_scripts/
  install_db.sh             Installs MariaDB
  create_demo_table.sql     Creates downtowndonuts DB + comments table + seed
docs/                       Original course setup docs
```

## Credits / resources used

- **Fonts:** [Fraunces](https://fonts.google.com/specimen/Fraunces) and
  [Nunito Sans](https://fonts.google.com/specimen/Nunito+Sans) via Google Fonts
  (Open Font License).
- Donut/coffee glyphs are standard Unicode emoji (no external assets).
- Built on the CS208 full-stack starter by Shane Panter.
- No third-party CSS frameworks; all styling is original.
