# No Code HTML Builder

A single-page web app that generates and iteratively refines HTML using a custom AI endpoint.

## Usage

Open `no_code_builder.html` in your browser, describe the page you want, and click **Generate**. When describing new blocks, include `data-section="<unique-name>"` on the wrapper element for each logical block. If duplicates slip in, the app automatically suffixes them (e.g. `hero` → `hero-1`) and shows a warning so each block remains unique. Use **Continue**, **Coach**, and **Next Step** to expand or improve the page. The **Edit** button opens an embedded code editor (Ace) so you can adjust the HTML manually. AI-powered changes merge with existing markup rather than replacing it, and your progress is saved locally, so you can close the page and continue later.


## Development

The app relies on CDN-hosted libraries (Bootstrap, jQuery, animate.css, FontAwesome, clipboard.js, and Ace). AOS is bundled locally in `vendor/aos`; rebuild with `npm run build:aos` if you need to refresh the files.

### HTML validation

Install dependencies and run the validation script to ensure each top-level block in `no_code_builder.html` defines a `data-section` attribute:

```sh
npm install
npm test
```

## Quick Navigation

The table below maps line numbers in `no_code_builder.html` to key feature areas.

| Line | Feature |
| ---- | ------- |
| 79 | Builder Container |
| 87 | Prompt Input |
| 101 | Builder Controls |
| 125 | Loading Spinner |
| 132 | Preview Iframe |
| 142 | AI Coach |
| 172 | Code Editor Modal |

