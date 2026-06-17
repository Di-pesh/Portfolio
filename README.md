# Premium Developer Portfolio

A sleek, modern, and highly responsive single-page portfolio website designed for developers. Built with high-fidelity glassmorphism aesthetics, custom CSS animations, dark/light theme options, and dynamic rendering.

## 🚀 Features

- **Dynamic Data Rendering**: Manage all profile information, skills, projects, and work history from a single configuration file (`data.js`).
- **Interactive Light & Dark Mode**: Persistent theme state saved directly to `localStorage`.
- **Aesthetic Details**:
  - Top scroll progress indicator.
  - Floating ambient background blur blobs.
  - Animated profile avatar and micro-interactions.
  - Interactive project filtering categories.
  - Dynamic project search bar by title, tech tags, or description, with real-time sort options (Alphabetical A-Z, Z-A, and Tech Complexity based on tag frequency).
  - Premium animated floating labels for contact form fields that animate smoothly on focus or presence of text.
  - Custom timeline lists for experience & education history.
- **Contact Form Validation**: High-fidelity contact form with dynamic loading indicator, success alert toaster, and a vibrant canvas confetti spray celebration upon successful submit.
- **Interactive Project Details Modal**: Clicking project cards launches a custom popup modal with detailed project description, key technical challenges, and specialized tag chips.
- **Scroll-Reveal Animations**: Seamless page entry animations that lift and fade in page sections dynamically as they scroll into view.
- **Secret Message Control Console**: Admin logs dashboard that persists contact form entries locally in browser storage, triggered by clicking the footer branding logo 5 times or pressing `Ctrl + Shift + L`. Includes itemized delete, clear, and terminal command options (like `/stats`, `/mock`, `/profile` for retro ASCII developer details, `/purge`, `/export`, and `/theme` to adjust theme accent color dynamically).
- **Interactive Theme Accent Color Customizer**: Floating settings dashboard that enables changing the entire site accent theme in real-time (options: Indigo, Teal, Ocean Blue, Amber Gold, Rose Red). Choices persist across reloads in browser storage.

---

## 📂 Project Structure

```bash
Portfolio/
├── index.html        # Main HTML skeleton & section wrappers
├── styles.css        # Premium typography, design token variables, and layout styles
├── data.js           # Central data store (customizable content)
├── script.js         # Navigation, typing animations, filtering, and theme controller
└── README.md         # Project documentation (this file)
```

---

## 🛠️ Customization

To personalize this portfolio with your details:

1. Open `data.js` in your text editor.
2. Update the values in `portfolioData`:
   - **Personal Info**: Replace `name`, `titles`, `bio`, `email`, `location`, and social links under `socials`.
   - **Skills**: Add or remove items within the `skills` categories and adjust the `level` percentages.
   - **Projects**: Define project `title`, `description`, tags, category filters, and links.
   - **Experience & Education**: Update the roles, company names, periods, and descriptions.
3. Save the file and reload the website!

---

## 💻 Running Locally

To preview your portfolio locally:
- Simply open the `index.html` file in any modern web browser.
- Alternatively, run a simple local web server in the folder:
  - Using Python: `python -m http.server 8000` (then open `http://localhost:8000`)
  - Using Node.js: `npx http-server` or `npm install -g serve && serve`

---

## 🛠️ Secret Administrative Console CLI Manual

The portfolio features a hidden **Secret Message Control Console** designed for developer testing and managing locally stored contact form entries.

### How to Access the Console
1. **Interactive Trigger**: Click the main branding logo `D.` in the footer **5 times** within a span of 3 seconds.
2. **Keyboard Shortcut**: Press `Ctrl + Shift + L` simultaneously in your web browser.

### Stored Data Mechanism
Contact messages are serialized and stored inside the browser's `localStorage` namespace under the key `portfolio_contact_messages`. This keeps your contact logs offline, persistent, and secure.

### Command Reference Table
Type commands in the CLI input prompt at the bottom of the console modal and hit `Enter` to run them:

| Command | Arguments | System Response | Usage Scenario |
| :--- | :--- | :--- | :--- |
| `/help` | None | Displays list of all available terminal commands and guides. | Help references |
| `/profile` | None | Renders a retro-styled ASCII art profile business card of the developer. | Personal branding audit |
| `/stats` | None | Compiles stats on total entries, unique senders, and unique subjects. | System audits |
| `/mock` | None | Injects 3 mock contact form submissions into local database storage. | Testing scroll UI lists |
| `/theme` | `[hue]` or `random` or `reset` | Sets Accent color to `hue` (0-360), chooses random color, or resets to default. | Accent theme preview |
| `/export` | None | Serializes database and prompts download of `portfolio_contact_messages_<timestamp>.json` file. | Data backup & transfer |
| `/purge` | None | Wipes the entire local database permanently after confirmation prompt. | System reset |

---

## 🎨 CSS Theme Token & Customizer Architecture

The portfolio implements a highly dynamic, customizable design system using vanilla CSS variables. This architecture enables real-time changes to the color accent theme without code modifications or page reloads.

### Dynamic Design Variables

Theme variables are defined in the `:root` scope of `styles.css`. The base system relies on a single **HSL hue angle variable** (`--hue`):

- **Hue Customization**: `--hue: 250` (Indigo base by default).
- **Derived HSL Shading**:
  - Accent Color: `var(--first-color) = HSL(var(--hue), 75%, 60%)`
  - Hover Action: `var(--first-color-alt) = HSL(var(--hue), 75%, 53%)`
  - Glowing Glows: `var(--first-color-light) = HSL(var(--hue), 70%, 80%)`

### Dynamic Mode (Light & Dark)

Mode states override the text, background, and glass variables dynamically under the `.light-theme` class selector:

| Token / Property | Dark Theme (Default) | Light Theme (`.light-theme`) |
| :--- | :--- | :--- |
| `body` Background | `HSL(var(--hue), 24%, 6%)` (Deep Space) | `HSL(var(--hue), 20%, 97%)` (Light Warm Off-white) |
| Container Color | `HSL(var(--hue), 24%, 10%)` | `HSL(0, 0%, 100%)` (Solid White) |
| Border Color | `HSL(var(--hue), 20%, 15%)` | `HSL(var(--hue), 15%, 90%)` |
| Backdrop Glass | `rgba(20, 16, 36, 0.6)` | `rgba(255, 255, 255, 0.7)` |

### How Style Customizer Panel Syncs
The **Style Customizer Overlay Panel** communicates dynamically with the document styles. When you choose a hue color card or type a command in the console:
1. JavaScript catches the user selection event and reads the `data-hue` attribute.
2. The global custom property is set dynamically via `document.documentElement.style.setProperty('--hue', hue)`.
3. The configuration is written to the browser's `localStorage` as `selected-hue`.
4. On subsequent page loads, an inline IIFE runs immediately in the head of `index.html` to retrieve and apply the stored hue, ensuring **zero layout color flash (FOUC)**.

---

## 🚀 Deployment & Developer Reference

This portfolio is built as a pure frontend web application utilizing vanilla Javascript, custom CSS, and HTML5. There are no build steps, backend servers, or dynamic pre-compilers required, making it incredibly fast and simple to deploy.

### Deployment Guide

#### 1. GitHub Pages (Recommended)
GitHub Pages hosts static websites directly from your GitHub repository for free:
1. Push your latest commits to the `main` branch on GitHub.
2. Navigate to your repository on GitHub.
3. Click on the **Settings** tab.
4. Select **Pages** from the sidebar menu.
5. Under **Build and deployment**, set the source to **Deploy from a branch**.
6. Select the `/root` directory of your `main` branch.
7. Click **Save**. Your site will be published at `https://<username>.github.io/<repository-name>/` in less than a minute!

#### 2. Vercel / Netlify Static Setup
For rapid hosting and custom domain integration:
- **Vercel**: Click **New Project** in your Vercel Dashboard, import your GitHub repo, select **Other** for the project framework, leave the build settings empty, and click **Deploy**.
- **Netlify**: Go to your Netlify dashboard, click **Add new site**, select **Import an existing project**, authorize GitHub, select your repository, select `main` as the production branch, keep the build command empty, and click **Deploy site**.

### Developer Workflow Best Practices

- **Adding Projects & Work Data**: Always update the structure inside `data.js` instead of editing `index.html` manually. The dynamic loader parses data automatically and keeps the formatting clean.
- **Local Testing**: To test local features, run `python -m http.server 8000` rather than clicking on the `index.html` file directly. Running a local HTTP server guarantees that WebSocket, local storage APIs, and standard script tags run in a secure, origin-matching sandboxed context.
