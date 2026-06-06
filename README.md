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
  - Custom timeline lists for experience & education history.
- **Contact Form Validation**: High-fidelity contact form with dynamic loading indicator and feedback alerts.

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
