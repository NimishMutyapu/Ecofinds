
# EcoFinds – A Sustainable Marketplace 🌱

**EcoFinds** is a simple and elegant web-based marketplace for buying and selling second-hand or sustainable products. Built with plain HTML, CSS, and JavaScript, it focuses on clean UI and intuitive user experience. This repository contains the frontend code of the project.

---

## 🌐 Live Preview

> You can host this frontend using **GitHub Pages** or **Vercel**. Just upload the repo and link it to your backend.
  https://nimishmutyapu.github.io/Ecofinds/

---

## 🛠️ Tech Stack

| Technology | Purpose                            |
|------------|------------------------------------|
| HTML5      | Page structure                     |
| CSS3       | Styling and layout                 |
| JavaScript | Functionality and UI interactivity |

---

## 📁 Folder Structure

EcoFinds/
│
├── index.html              # Main landing page
├── styles.css              # Styling for all components
├── script.js               # All JS logic: state, rendering, API calls
├── assets/                 # (Optional) Folder for icons/images
└── README.md               # Project documentation

---

## ✨ Features

* 🔍 **Search** products by title
* 🎯 **Filter** by category (dropdown)
* ➕ **Add product** via modal (form)
* 🖊️ **Edit/Delete** your own products
* 🎨 Responsive and mobile-friendly card layout
* 🔁 Instant UI updates after changes
* 🧠 Local state management using JS

---

## 📦 Sample Categories (With 10 Products Each)

* **Furniture**
* **Books**
* **Fashion**
* **Electronics**
* **Others**

---

## 🔧 How to Use

1. Clone this repo:

   ```bash
   git clone https://github.com/yourusername/ecofinds.git
   cd ecofinds
   ```

2. Open `index.html` in your browser (or use Live Server in VS Code).

3. Make sure your **Flask backend is running** on `http://localhost:5000`.

4. Test features like:

   * Browsing products
   * Filtering by category
   * Adding a new product
   * Editing/deleting an existing product

---

## 🧠 Developer Notes

* Products are rendered dynamically via JS by looping over the fetched array.

---

