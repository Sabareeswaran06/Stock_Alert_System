# 🛒 Supermarket Stock Alert Dashboard

A real-time stock management dashboard built for supermarket-like environments. 
It helps track product quantities, notifies when stock falls below a set threshold using 
EmailJS, and allows simple restock/sell operations — all connected via Firebase Realtime Database.

---

## 📌 Features

- 🔄 Real-time display of stock items using Firebase.
- ✏️ Add, update, or delete product entries.
- 📉 Auto email alert when stock goes below threshold.
- ➕ Quick purchase/sell buttons for each item.
- ⚠️ Red border alert for low stock items.

---

## 🧰 Technologies Used

- **HTML**, **CSS**, **JavaScript (ES6 modules)**
- **Firebase Realtime Database**
- **EmailJS** (for sending email notifications)

---

## ⚙️ Setup Instructions

### 1. 🔥 Firebase Setup
- Create a Firebase project from [console.firebase.google.com](https://console.firebase.google.com)
- Enable **Realtime Database**
- Replace the Firebase config in `script.js` with your project credentials

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  databaseURL: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
