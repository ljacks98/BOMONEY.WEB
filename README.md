# BOMONEY — VGELESS VIBES website

A plain HTML/CSS/JS site. No build step, no framework, no server required —
it runs by just opening `index.html`, and it's ready to host on GitHub Pages.

## Folder structure

```
index.html          the page
css/style.css        all styling
js/main.js            all behavior, and the site's editable content
assets/images/        put cover art here (empty for now)
assets/audio/         put beat-preview MP3s here (empty for now)
```

## Deploy on GitHub Pages

1. Create a new GitHub repository (Public — GitHub Pages needs a public repo
   unless you're on a paid GitHub plan).
2. Upload everything in this folder to the repo, keeping the folder
   structure (drag-and-drop works: GitHub → **Add file → Upload files**).
3. In the repo, go to **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**,
   then set branch to **main** and folder to **/ (root)**. Save.
5. GitHub takes a minute or two to build. Your live URL will be
   `https://<your-username>.github.io/<repo-name>/`, shown at the top of
   the Pages settings once it's ready.
6. Optional: add a custom domain (like bomoneymusic.com) from that same
   Pages settings page once you own one.

## Editing the site's content

Almost everything you'd want to change lives in one place: the top of
**`js/main.js`**, under the comment `SITE CONTENT`. That's where you'll find:

- `EMAIL` — the address Buy/Contact/Pre-order buttons send mail to
- `BEATSTARS_URL` — currently blank, so Buy buttons email you instead of
  linking out. Paste your Vgeless.Vibes BeatStars store link here once you
  have it, and Buy buttons switch to "Buy on BeatStars" automatically
- `NEXT_DROP` — the upcoming pre-order: title, type, drop date, price
- `RELEASES` — your singles and albums list
- `BEATS` — your beat catalog: title, price, and (optionally) an `audio`
  preview file path and a `url` deep link straight to that beat's own
  BeatStars page (falls back to `BEATSTARS_URL` when left out)

No other file needs to change for normal content updates.

## The cart & checkout

Visitors can add any priced beat, or the pre-order once it has a price, to a
cart (top-right "Cart" button), adjust quantities, and check out. Submitting
the order opens an email to `EMAIL` with the full itemized order — name,
items, quantities, and total — and the cart clears. There's no payment
processing yet: a real-time card checkout for a multi-item cart needs a
small backend (a serverless function that creates a Stripe Checkout Session
server-side, since a secret key can't safely live in this client-side code).
The cart, totals, and order emails all work correctly today; wiring in
Stripe for actual card capture is the next step, whenever you're ready.

## Known gaps to fill in

- **BeatStars link** — not set yet (see `BEATSTARS_URL` above)
- **"Natural Mystic"** — full title was cut off in the source screenshot;
  update it in `BEATS` once you have it
- **Prices for "Snakes" and "First Pop"** — currently show "Price on
  BeatStars"; add a `price:` value once you have one
- **Cover art and beat-preview audio** — see the README files inside
  `assets/images/` and `assets/audio/`
