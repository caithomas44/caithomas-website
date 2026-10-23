# caithomas.com

Cai Thomas's personal site, https://www.caithomas.com/. One static page (`index.html`, `style.css`,
`script.js`, `images/`), hosted on GitHub Pages from the `main` branch of this repo. It replaced the
previous host in October 2026; `reference/live-2026-10-22.html` is the page as it was served on the
day of the move, kept for comparison only (it is not published).

## Changing the site

Edit the files and push to `main`. GitHub Pages republishes within a minute or two.

The design dates from 23 October 2026: dark by default with a light/dark switch, Geist and Geist
Mono type, one orange accent, a floating pill navigation, a card grid for the headline numbers and
tools, a client logo wall and numbered sections. It was agreed from a mockup on a private Design
canvas, https://claude.ai/artifact/7fZAVz12KTuBYQJieuXdhd, which is the reference for the look.

- `index.html` is the whole page. The `<head>` repeats facts from the page for search engines, AI
  assistants and social previews: Open Graph and X tags, and a JSON-LD block (`ProfilePage`,
  `WebSite`, `ImageObject` and a `Person` with the job, employer, Bath, the
  LinkedIn and Instagram profiles, every role in the career timeline as an `EmployeeRole`, and the
  two volunteer roles as `OrganizationRole`s). When the page text changes a role, a date or a
  contact detail, change it there too, and update `dateModified`.
- Colours are tokens at the top of `style.css`: one set for dark (the default) and one under
  `[data-theme="light"]`. The accent is #FF6A2B in dark and #C2410C in light; `--accent-ink` is a
  deeper orange for small text on the tinted cards. Every text pair passes WCAG AA in both themes
  (axe reported no violations on 23 October 2026), so check contrast in both if a colour changes.
- The light/dark choice is stored in the visitor's browser (`localStorage` key `theme`). A one-line
  script at the top of the `<head>` applies it before the page paints, so there is no flash; the
  privacy and 404 pages carry the same line.
- `style.css` holds all the styling, including the privacy and 404 pages (they link `/style.css`).
  Breakpoints: 960 px (navigation becomes a menu button), 700 px (cookie bar stacks) and 560 px
  (phone spacing), then the `prefers-reduced-motion` block.
- `script.js` is loaded with `defer`, so nothing blocks rendering. It adds the fade-in on scroll,
  the light/dark switch, the phone menu (Escape closes it), the cookie notice, Google Tag Manager
  and its click events, and the email link. The page is complete without it: the fade-in only
  applies when the `js` class is on `<html>`, and the switch and menu button only show then.
- Client logos had their white margins trimmed so they read at the same size; keep any new logo
  tight to its edges.
- **Consent.** Google Tag Manager is not in the HTML. `script.js` loads it only after the visitor
  presses "Accept all" (or on later visits once they have), with Google Consent Mode defaults set
  to denied before that. "Reject all" stores the refusal, deletes the trackers' first-party
  cookies and reloads the page if they were already running. "Cookie settings" in the footer
  reopens the notice. Click events reach the dataLayer only after consent. The notice is a bar
  along the bottom of the screen and links to `privacy.html`, the privacy and cookies page.
- `privacy.html` describes exactly what the site loads. If a tag is added to or removed from Tag
  Manager, or a retention setting changes, change that page and the cookie notice's wording too.
- The Google and Bing verification tags are in the page's `<head>`, not in Tag Manager, so they
  work for verification crawlers whatever the cookie choice.
- **Email.** The address is not in the page source. The contact link carries it reversed in two
  data attributes and `script.js` builds the `mailto:` link; with scripts off it reads
  "mail [at] caithomas.com". It is deliberately left out of the structured data.
- `images/social-share.jpg` (1200×630) is the picture shown when the site is shared on LinkedIn,
  WhatsApp, Facebook or X. After changing it, re-scrape the page in LinkedIn's Post Inspector and
  Facebook's Sharing Debugger so they stop showing the old one.
- Client logos live in `images/logos/` (they used to be hot-linked from wearecrank.com).
- The headshot is served as `images/cai-thomas-headshot-480.webp` (480 px, shown at up to 240 px),
  with `cai-thomas-headshot-480.jpg` as the fallback. The 800 px `cai-thomas-headshot.jpg` stays for
  the structured data. Replace all three together.
- Analytics is Google Tag Manager container `GTM-KKZ54J` (account "Cai Thomas Online Marketing").
  Since version 14 (23 October 2026) it holds three tags: GA4 (G-VH8NCC8951), the Meta Pixel and
  Microsoft Clarity. Version 14 removed Google Optimize's anti-flicker snippet (it hid the whole
  page for four seconds waiting for Optimize, which Google shut down in 2023), a dead GoDaddy Site
  Apps script and four verification tags (now in the page's `<head>`). Version 13 has them all if
  anything needs restoring. `html.async-hide { opacity: 1 !important; }` stays at the end of
  `style.css` as a guard in case an anti-flicker snippet is ever added again.

## Checks before pushing

- Structured data: POST the page to https://validator.schema.org/validate (`html=` form field).
  It reported 0 errors and 0 warnings on 22 October 2026.
- HTML: https://validator.w3.org/nu/?out=json with the page as the request body.
- Layout: look at the page at 360, 375, 768, 1024 and 1366 px wide; there should be no horizontal
  scrolling and nothing hidden when scripts are off.
- Consent: on a first visit nothing from googletagmanager.com, google-analytics.com,
  facebook.net or clarity.ms may load before "Accept all" is pressed, and nothing after "Reject
  all".

## Hosting and DNS

- GitHub Pages, custom domain `www.caithomas.com` (the `CNAME` file), HTTPS enforced.
  `caithomas.com` redirects to `www`.
- `.nojekyll` tells GitHub Pages to publish the files as they are.
- The certificate is GitHub's (Let's Encrypt), first issued 22 October 2026 for both names and
  renewed by GitHub. It was only issued after the custom domain was cleared and set again once DNS
  pointed at GitHub; do the same if the certificate ever gets stuck.
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

## Before the move, and rollback

Until 22 October 2026 www.caithomas.com was a Workers custom domain on the Cloudflare Worker
`proud-flower-8fd3` (static assets, deployed 20 February 2026), in the same Cloudflare account. The
bare domain had no record at all. The Worker was detached from www, not deleted, and is still
reachable on its workers.dev address. To roll back: delete the `www` CNAME and the four `@` A
records in Cloudflare, then add `www.caithomas.com` back as a custom domain on that Worker
(Workers & Pages → proud-flower-8fd3 → Settings → Domains & Routes).

Removed from Cloudflare on 23 October 2026 (Cai's decision), recorded here so they can be recreated:

- DNS: `A *.caithomas.com → 192.0.2.1`, proxied. The address is a placeholder, so every
  subdomain without its own record showed a Cloudflare error page. Without it, unknown
  subdomains don't resolve. `tracking.caithomas.com` is a CNAME to `smtp.caithomas.com`, which
  has no record of its own; it only resolved through the wildcard, to that error page.
- Redirect rules (Rules → Redirect Rules), both 301 without the query string:
  - "Redirect from root to WWW [Template]": when `http.request.full_uri wildcard r"https://caithomas.com/*"`,
    go to `wildcard_replace(http.request.full_uri, r"https://caithomas.com/*", r"https://www.caithomas.com/${1}")`.
  - "Redirect from HTTP to HTTPS [Template]": when `http.request.full_uri wildcard r"http://*"`,
    go to `wildcard_replace(http.request.full_uri, r"http://*", r"https://${1}")`.
  Neither could fire once the web records became DNS only; GitHub Pages now does both redirects.

Email records changed on 23 October 2026 (Cai no longer uses SendGrid; his decision):

- SPF was `v=spf1 include:_spf.google.com include:sendgrid.net ~all`; it is now
  `v=spf1 include:_spf.google.com ~all`. The SendGrid include let mail from any SendGrid customer
  pass SPF as caithomas.com.
- Removed CNAMEs: `sendgrid` → `u1869093.wl.sendgrid.net`, `s1._domainkey` →
  `s1.domainkey.u1869093.wl.sendgrid.net`, `s2._domainkey` → `s2.domainkey.u1869093.wl.sendgrid.net`
  (SendGrid no longer published a key there), and `tracking` → `smtp.caithomas.com` (no such name).
- Added DMARC: `_dmarc` TXT `v=DMARC1; p=quarantine; rua=mailto:<id>@dmarc-reports.cloudflare.net`.
  Mail that fails both SPF and DKIM alignment goes to spam. The daily aggregate reports go to
  Cloudflare's DMARC Management (Email → DMARC Management in the dashboard), not to an inbox. Anything new that sends as @caithomas.com (a newsletter tool, a CRM) must
  be added to SPF or set up with DKIM first, or its mail will land in spam.

Mail and DNS hardening, 23 October 2026 (Cai's choices):

- MTA-STS: `mta-sts` CNAME → `caithomas44.github.io` serves the policy from the repo
  `caithomas44/caithomas-mta-sts`, and `_mta-sts` TXT `v=STSv1; id=20261023` announces it. The
  policy is in testing mode; that repo's README says how to move to enforcement.
- TLS reporting: `_smtp._tls` TXT `v=TLSRPTv1; rua=mailto:mail@caithomas.com`. Expect a few
  JSON reports a day.
- CAA on `caithomas.com`: `0 issue "letsencrypt.org"` (GitHub Pages) and
  `0 iodef "mailto:mail@caithomas.com"`. Cloudflare adds its own certificate authorities to the
  answers automatically while Universal SSL is on.
- Removed `start` CNAME → `ghs.googlehosted.com` (Google's discontinued start page, a 404) and
  two `_acme-challenge` TXT records left over from an old certificate check.

Not done (Cai's decisions): the domain is registered at GoDaddy and expires on 10 December 2026;
Cai is handling the renewal. DNSSEC is off. Google's DKIM key is 1024-bit.

Left as they were: the Google Workspace shortcuts (`calendar`, `docs`, `mail`, `sites`), the MX
records, Google's DKIM key (`google._domainkey`) and the Google verification TXT.

## Other files

- `privacy.html` is the privacy and cookies page.
- `404.html` is shown for any address that does not exist.
- `robots.txt`, `sitemap.xml` and `site.webmanifest` are what they say.
- `favicon.ico` sits at the root because browsers ask for it there; the other icons are in `images/`.
