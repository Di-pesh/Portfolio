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
  - Dynamic project search bar by title, tech tags, or description.
  - Custom timeline lists for experience & education history.
- **Contact Form Validation**: High-fidelity contact form with dynamic loading indicator and feedback alerts.
- **Interactive Project Details Modal**: Clicking project cards launches a custom popup modal with detailed project description, key technical challenges, and specialized tag chips.
- **Scroll-Reveal Animations**: Seamless page entry animations that lift and fade in page sections dynamically as they scroll into view.
- **Secret Message Control Console**: Admin logs dashboard that persists contact form entries locally in browser storage, triggered by clicking the footer branding logo 5 times or pressing `Ctrl + Shift + L`. Includes itemized delete, clear, and terminal command options (like `/stats`, `/mock`, `/purge`, `/export`, and `/theme` to adjust theme accent color dynamically).
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
| `/stats` | None | Compiles stats on total entries, unique senders, and unique subjects. | System audits |
| `/mock` | None | Injects 3 mock contact form submissions into local database storage. | Testing scroll UI lists |
| `/theme` | `[hue]` or `random` or `reset` | Sets Accent color to `hue` (0-360), chooses random color, or resets to default. | Accent theme preview |
| `/export` | None | Serializes database and prompts download of `portfolio_contact_messages_<timestamp>.json` file. | Data backup & transfer |
| `/purge` | None | Wipes the entire local database permanently after confirmation prompt. | System reset |
