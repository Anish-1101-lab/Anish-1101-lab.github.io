# anish-website

Personal research site for Anish Sathyanarayanan, built with React, Vite and Tailwind.

Live at:

- https://web.mit.edu/anish559/www/
- https://anish-1101-lab.github.io/

## Develop

```sh
npm install
npm run dev
```

Content lives in `src/data.js` (home page) and `src/data/projects.js` (project pages).

## Deploy

- **GitHub Pages:** every push to `main` is built and published by `.github/workflows/pages.yml`.
- **web.mit.edu:** connect to the MIT VPN, run `kinit anish559@ATHENA.MIT.EDU`, then `./deploy.sh` (add `-n` for a dry run).
