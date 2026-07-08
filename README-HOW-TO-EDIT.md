# Zap Mudra — How to edit your website

Each page is **one self-contained file** — the design (CSS) and the logic
(JavaScript) are built right into it. That means you can just double-click any
`.html` file to open it in a browser, and it works with no setup, no folders,
no internet needed.

## The pages

| File | What it is |
|------|------------|
| `index.html` | Home page (hero, loan types, Credit Cards, Loans, EMI calculator) |
| `about.html` | About Us + FAQ |
| `contact.html` | Contact Us + the Apply form |
| `how-to-apply.html` | How to apply for loans & credit cards |
| `privacy-policy.html` | Privacy Policy |
| `terms.html` | Terms & Conditions |
| `disclaimer.html` | Disclaimer |

## Where to change things

Open any page in a text editor (Notepad, VS Code, etc.). Two special blocks live
at the top and bottom of each file:

- **The `CONFIG` block** (inside the `<script>` near the bottom of the page).
  This holds your **company info, the menu, and the bank/NBFC lists**.
- **The `:root` block** (inside the `<style>` near the top of the page).
  This holds your **brand colours**.

Everything else — headings, paragraphs, FAQ, legal text — is normal text in the
page. Look for `<!-- EDIT ... -->` comments for guidance, change the words, save.

### 1. Bank lists (Credit Cards & Loans) — edit in `index.html`
The tiles on the home page come from two lists in the `CONFIG` block of
`index.html`. Each bank is one line:
```js
{ name: "HDFC Bank", short: "HDFC", color: "#004c8f", url: "https://www.hdfcbank.com" },
```
- `name`  = text under the logo
- `short` = letters shown in the coloured badge
- `color` = badge colour
- `url`   = where the tile opens when clicked  ← **put your referral links here**
  (a `url` of `"#"` means "no link yet")

To add a bank, copy a line and edit it. To remove one, delete its line.

**Use a real logo image instead of letters?** Put the image next to your pages
(e.g. `hdfc.png`) and add `logo: "hdfc.png"` to that bank's line:
```js
{ name: "HDFC Bank", short: "HDFC", color: "#004c8f", logo: "hdfc.png", url: "https://www.hdfcbank.com" },
```

### 2. Company info (name, phone, email, address, social)
This is in the `CONFIG` block too, under `company:`. Because each page is
self-contained, this block is repeated in every page. To change your phone number
everywhere, use your editor's **Find & Replace** across all files (change the old
number to the new one). The bank lists only need editing in `index.html`.

### 3. Colours
Edit the `:root` values at the top of the `<style>` in each page:
- `--navy` = deep brand purple (#2D0A5C)
- `--zap`  = bright purple (links, highlights) (#7B2FBE)
- `--gold` = amber (the Apply Now buttons) (#F59E0B)

### 4. Fonts
Each page loads Google Fonts via a `<link>` near the top. Swap the font names
there and update `--font-display` / `--font-body` in the `:root` block.

## Make the contact form email you
Right now the form shows a "thank you" message but doesn't send anything. To
receive enquiries, connect it to a free service like **Formspree**:
1. Sign up at https://formspree.io and create a form — you'll get a URL.
2. In `contact.html`, find `<form id="leadForm" action="#" method="POST"...>`
   and replace `action="#"` with your Formspree URL.

## Put it online
Upload all the `.html` files to any web host (Hostinger, GoDaddy, Netlify,
Vercel, etc.), keeping `index.html` as the main page. Nothing else is needed.

---
**Reminder:** the legal pages (Privacy, Terms, Disclaimer) are starting templates,
not legal advice. Have someone review them and fill in the `[bracketed]` blanks
(dates, city) before going live.
