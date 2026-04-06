<div align="center">
  <h1>💝 Valentine's Day Interactive Experience</h1>
  <p>A modern, glassmorphism-styled web interaction to ask that special someone "Will you be my Valentine?"</p>
</div>

---

## 🌟 Overview

This repository contains a lightweight, highly polished, and interactive Valentine-themed web experience. Built with pure HTML, CSS, and JavaScript, it delivers a tailored, animated interaction complete with floating emojis, custom responses, and background music. 

The UI features a modern **glassmorphism** aesthetic, beautiful typography (Google Fonts), and smooth transitions, making it feel like a professional mini-app rather than a simple static page.

## ✨ Features

- 🎨 **Modern UI:** Glassmorphism card design with floating animations and subtle gradient backgrounds.
- 📱 **Fully Responsive:** Looks perfect on desktop, tablet, and mobile devices.
- 🎵 **Audio Integration:** Seamless background music integration with a clean "tap to play" initial overlay.
- 💘 **Interactive & Playful:** A cheeky "No" button that playfully dodges the user's cursor.
- ⚙️ **Easily Customizable:** Change names, questions, colors, and emojis instantly via a simple JSON file—no coding required.
- ⚡ **Zero Dependencies:** Pure HTML, CSS, and vanilla JavaScript. No build steps, no frameworks.

## 🚀 Quick Start

Since this is a pure static website, there are no build steps or `npm install` commands required.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/PsychoFinTech/valentine-14-feburary.git
   ```

2. **Navigate to the directory:**
   ```bash
   cd valentine-14-feburary
   ```

3. **Run a local server:**
   To ensure the JSON configuration and audio load correctly without CORS issues, serve the directory using any simple HTTP server. For example, using Python:
   ```bash
   python -m http.server 8000
   ```
   *Then open `http://localhost:8000` in your browser.*

## 🛠️ Customization

You can completely personalize the experience by editing the `customize.json` file. 

**What you can change:**
- The recipient's name (`valentineName`)
- All questions and button texts (`questions`)
- The floating emojis (`floatingEmojis`)
- The color scheme (`colors`)
- The background music (Replace `audio.mp3` with your own file)

## 📄 License

This project is open-source and available under the [MIT License](LICENSE). Feel free to clone, modify, and use it to ask your special someone!