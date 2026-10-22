# caithomas.com

Cai Thomas's personal site, https://www.caithomas.com/. One static page (`index.html`, `style.css`,
`script.js`, `images/`), hosted on GitHub Pages from the `main` branch of this repo. It replaced the
previous host in October 2026; `reference/live-2026-10-22.html` is the page as it was served on the
day of the move, kept for comparison only (it is not published).

## Changing the site

Edit the files and push to `main`. GitHub Pages republishes within a minute or two.

- `index.html` is the whole page. The `<head>` repeats facts from the page for search engines, AI
  assistants and social previews: Open Graph and X tags, and a JSON-LD block (`ProfilePage`,
  `WebSite`, `ImageObject` and a `Person` with the job, employer, Bath, the email address, the
  LinkedIn and Instagram profiles, every role in the career timeline as an `EmployeeRole`, and the
  two volunteer roles as `OrganizationRole`s). When the page text changes a role, a date or a
  contact detail, change it there too, and update `dateModified`.
- `style.css` holds all the styling. The responsive rules are at the end of the file (breakpoints
  at 1100, 960, 900, 600 and 380 px), followed by the `prefers-reduced-motion` block.
- `script.js` is loaded with `defer`, so nothing blocks rendering. It adds the fade-in on scroll,
  the burger menu, the client-logo tabs, the Google Tag Manager click events and the cookie notice.
  The page is complete without it: the fade-in only applies when the `js` class is on `<html>`.
- `images/social-share.jpg` (1200×630) is the picture shown when the site is shared on LinkedIn,
  WhatsApp, Facebook or X. After changing it, re-scrape the page in LinkedIn's Post Inspector and
  Facebook's Sharing Debugger so they stop showing the old one.
- Client logos live in `images/logos/` (they used to be hot-linked from wearecrank.com).
- Analytics is Google Tag Manager container `GTM-KKZ54J`, unchanged from the old site.

## Checks before pushing

- Structured data: POST the page to https://validator.schema.org/validate (`html=` form field).
  It reported 0 errors and 0 warnings on 22 October 2026.
- HTML: https://validator.w3.org/nu/?out=json with the page as the request body.
- Layout: look at the page at 360, 375, 768, 1024 and 1366 px wide; there should be no horizontal
  scrolling and nothing hidden when scripts are off.

## Hosting and DNS

- GitHub Pages, custom domain `www.caithomas.com` (the `CNAME` file), HTTPS enforced.
  `caithomas.com` redirects to `www`.
- `.nojekyll` tells GitHub Pages to publish the files as they are.
- The domain's DNS is in Cloudflare (Cai's own account, "Mail@caithomas.com's Account"), reached
  through the Cloudflare dashboard. The web records are DNS-only (grey cloud) so that GitHub can
  issue the certificate. Mail records (Google Workspace MX, SPF, the `mail` CNAME) are untouched.

| Host | Type  | Value | Proxy |
|------|-------|-------|-------|
| @    | A     | 185.199.108.153 | DNS only |
| @    | A     | 185.199.109.153 | DNS only |
| @    | A     | 185.199.110.153 | DNS only |
| @    | A     | 185.199.111.153 | DNS only |
| www  | CNAME | caithomas44.github.io | DNS only |

## Other files

- `404.html` is shown for any address that does not exist.
- `robots.txt`, `sitemap.xml` and `site.webmanifest` are what they say.
- `favicon.ico` sits at the root because browsers ask for it there; the other icons are in `images/`.
