# Downtown Donuts — Website Prototype

A custom, mobile-first website built to win the development contract for
**Downtown Donuts**, a cozy family-owned donut & coffee shop serving downtown
since 1992. Built on the CS208 full-stack starter using Node.js, Express, Pug,
and MariaDB/MySQL, with hand-written CSS (no frameworks).

This is a **prototype**. All copy is placeholder (Lorem Ipsum) and the color
palette is a stand-in until the official Brand Guidelines assets are applied
(see "Applying the brand" below).

---

## Pages

- **Landing** (`/`) — hero, featured items, story teaser, ordering call-to-action.
- **Menu** (`/menu`) — categorized menu plus an online-ordering section linking
  to UberEats and DoorDash (`/menu#order`).
- **About Us** (`/about`) — the shop's story and a since-1992 timeline.
- **Comments** (`/comments`) — full-stack: visitors post a name, rating, and
  message; comments persist in the database and render newest-first with
  server-side timestamps and pagination.

---

## Tech stack

- **Node.js + Express 5** — server and routing
- **Pug** — server-side HTML templates (auto-escapes output, mitigating XSS)
- **MariaDB / MySQL** (via `mysql2`) — stores customer comments
- **Hand-written CSS** — no Bootstrap/Tailwind/etc.; all media queries written by hand

---

## Setup Instructions

> Prerequisites: Node.js and MariaDB/MySQL. In a GitHub Codespace, the scripts
> below work out of the box.

**1. Install and start the database (run once):**

```bash
./setup_scripts/install_db.sh
```

Answer the prompts as in the course docs — set the root password to `12345`.
See `docs/example_project.md` for the full prompt-by-prompt walkthrough.

**2. Create the database, table, and demo data:**

```bash
sudo mysql -u root -p < ./setup_scripts/create_demo_table.sql
```

This creates the `downtowndonuts` database, the `comments` table, and seeds 12
demo comments (more than one page) so pagination is visible immediately.

**3. Install Node dependencies and run:**

```bash
npm install
npm start
```

Open **http://localhost:3000**.

> Database credentials live in `bin/db.js` (host `localhost`, user `root`,
> password `12345`, database `downtowndonuts`). Update them there if your setup
> differs.

---

## Design Decisions

**1. A token-driven palette built on the official brand colors.**
The client provided a Style Guide, so I centralized every color and font into a
single `:root` block at the top of `public/stylesheets/style.css` (marked
`>>> BRAND TOKENS <<<`). This keeps the look consistent across pages and means
the brand can be adjusted by editing a handful of values in one place. I used
the exact palette from the guide: dark green (#10291D) for sections and primary
text, saffron (#F7C64A) for dividers and accents, and seasalt (#F7F7F7) for
backgrounds. I followed the guide's contrast rules — black/dark text on seasalt,
seasalt text on the dark-green sections, and no black backgrounds. The "story"
band uses dark green with saffron accents to show off the signature brand look.
For type I used the brand fonts: Italianno (script) for the "Downtown Donuts"
name only, as the guide specifies, and Montserrat for all headings and body text.

**2. Server-rendered pages with progressive enhancement.**
The brief prioritizes mobile-friendliness and a fast, simple experience for a
small business. Rather than a heavy client-side framework, every page is
rendered server-side with Pug, and the comments page layers a small vanilla-JS
file on top purely for UX (live character counter, double-submit guard). The
site is fully functional with JavaScript disabled — validation, timestamps, and
pagination all happen on the server. This is faster on phones and more robust.

**3. A two-column comments layout that collapses on mobile.**
On desktop the comment form sits beside the comment wall (CSS Grid,
`grid-template-columns: 0.9fr 1.1fr`); below 720px it stacks into a single
column via a hand-written media query. This keeps the form visible and the wall
scannable on large screens while staying thumb-friendly on phones, directly
serving the client's "mobile-friendliness is a top priority" requirement. The
sticky header collapses into a CSS-only hamburger menu at the same breakpoint.

---

## Comments data flow (Submit → appears on page)

1. User fills the form and clicks **Post comment**. Client JS disables the
   button to prevent a double-submit, then the browser POSTs the form fields to
   `/comments/create`.
2. Express parses the body (`express.urlencoded`) and the `dbMiddleware`
   attaches a live DB connection as `req.db`.
3. The route validates server-side: rejects empty/whitespace names or messages,
   rejects input over 5,000 raw characters, and enforces 60/500-char limits.
4. On failure, the page re-renders with a friendly error and the user's typed
   values preserved (HTTP 400). On success, the comment is inserted with a
   **parameterized query** (prevents SQL injection).
5. The server issues a redirect (Post/Redirect/Get) to `/comments?success=1` so
   refreshing won't resubmit.
6. The GET handler counts rows, computes pages, fetches the current page
   (`LIMIT/OFFSET`), generates a server-side "x minutes ago" timestamp for each,
   and renders them. Pug auto-escapes the output, so any `<script>` in a comment
   displays as inert text.

---

## Edge Cases

The application handles each required scenario gracefully:

1. **Server / database unreachable.** DB query callbacks check for errors and
   render the comments page with a friendly message ("We could not load comments
   right now. Please try again in a moment.") and an HTTP 503 — never a stack
   trace. The global error handler (`app.js`) shows a branded error page and
   suppresses error details outside development.

2. **Whitespace-only submission.** Both fields are `.trim()`-ed server-side
   before validation, so a name or message of only spaces becomes empty and is
   rejected with "Please add both your name and a message." The user's other
   input is preserved.

3. **Extremely long input (e.g. 10,000 characters).** Raw input over 5,000
   characters is rejected outright with a clear message rather than silently
   truncated. Inputs within that range but over the 60/500-char limits are also
   rejected with a specific message. The DB columns are `VARCHAR(60)` /
   `VARCHAR(500)` as a final backstop.

4. **Rapid double-click on Submit.** Client-side JS disables the submit button
   and changes its label to "Posting..." on the first valid submit, preventing
   duplicate POSTs. Because this is enhancement only, the Post/Redirect/Get
   pattern also protects against accidental resubmission via refresh even if JS
   is off.

---

## Challenges & Learnings

**1. Server-side timestamps and pagination without an ORM.**
The starter uses raw `mysql2` callbacks, not an ORM, so I had to compute
pagination manually. My first approach fetched all comments and sliced them in
JavaScript, which would not scale and re-fetched everything on every page view.
I reworked it to run a `COUNT(*)` query first, compute `totalPages`, clamp the
requested page into range (so `?page=999` lands on the last page instead of
showing nothing), then fetch only that page with `LIMIT ? OFFSET ?`. The "x ago"
timestamps are derived server-side from the stored `created_at` so they can't be
spoofed by the client and don't depend on the visitor's clock.

**2. Unicode characters disappearing through the build.**
While generating the templates, em-dashes, star glyphs, and donut emoji were
initially written as literal `\u2014`-style escape text and rendered on the page
as raw backslash sequences instead of real characters, because Pug treats text
as literal. I caught this by inspecting the files with `cat -A` (which revealed
the literal `\u` sequences) and fixed it by converting every escape to a real
UTF-8 character and re-verifying. Lesson: Pug does not interpret JS string
escapes in template text — the actual character has to be in the file.

---

## Accessibility

- Semantic landmarks: `<nav>`, `<main>`, `<header>`, `<footer>`, `<article>`,
  `<time>`, and a "Skip to content" link.
- All form inputs have associated `<label>` elements; hints use `aria-describedby`.
- Fully keyboard-navigable with visible `:focus-visible` outlines.
- Decorative star ratings expose an `aria-label` ("4 out of 5 stars"); alerts
  use `role="alert"` / `role="status"`.
- When a logo image is added, it must carry meaningful `alt` text (see below).

---

## Applying the brand

The design is token-driven so the official guidelines apply in minutes:

1. **Colors & fonts:** edit the `:root` block at the top of
   `public/stylesheets/style.css` (marked `>>> BRAND TOKENS <<<`).
2. **Logo:** drop the file in `public/images/` and replace the
   `span.brand-mark(aria-hidden='true') 🍩` in `views/layout.pug` (header and
   footer) with, e.g.,
   `img.brand-logo(src='/images/logo.svg', alt='Downtown Donuts logo')`.
3. **Menu content:** replace the placeholder arrays in `routes/menu.js` with the
   real items/prices from the client's PDF menu.
4. **Ordering links:** update the UberEats/DoorDash URLs in `routes/menu.js` and
   the footer in `views/layout.pug` with the shop's real store pages.

---

## Project structure

```
app.js                      Express app: middleware + route wiring
bin/www                     Server entry point (starts HTTP + DB connection)
bin/db.js                   MySQL connection + dbMiddleware (req.db)
routes/
  index.js  menu.js  about.js  comments.js
views/
  layout.pug  index.pug  menu.pug  about.pug  comments.pug  error.pug
public/
  stylesheets/style.css     All styles + brand tokens + media queries
  javascripts/comments.js   Char counter + double-submit guard (enhancement)
  images/                   (logo + assets)
setup_scripts/
  install_db.sh             Installs MariaDB
  create_demo_table.sql     Creates DB + comments table + 12 seed rows
docs/                       Original course setup docs
```
