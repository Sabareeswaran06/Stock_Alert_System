// Firebase + EmailJS Integration

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getDatabase, ref, set, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

// ✅ Initialize EmailJS
emailjs.init("Py_lKo-sgQjmG9YgY"); // Replace with your EmailJS User ID

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: " ",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ✅ Add New Item
window.addStockItem = function () {
  const itemName = document.getElementById("itemName").value.trim();
  const quantity = parseInt(document.getElementById("quantity").value);
  const threshold = parseInt(document.getElementById("threshold").value);

  if (!itemName || isNaN(quantity) || isNaN(threshold)) {
    alert("Please enter all fields correctly.");
    return;
  }

  set(ref(db, "stock_items/" + itemName), {
    item_name: itemName,
    quantity,
    threshold,
    alerted: false
  });

  // Clear fields
  document.getElementById("itemName").value = "";
  document.getElementById("quantity").value = "";
  document.getElementById("threshold").value = "";
};

// ✅ Update Quantity Logic (purchase/sell)
function updateStock(itemName, delta) {
  const itemRef = ref(db, "stock_items/" + itemName);
  onValue(itemRef, snapshot => {
    const data = snapshot.val();
    if (!data) return;

    const newQty = (data.quantity || 0) + delta;
    if (newQty < 0) return;

    const isLow = newQty < data.threshold;

    update(itemRef, {
      quantity: newQty,
      alerted: isLow
    });

    if (isLow && !data.alerted) {
      sendLowStockEmail(data.item_name, newQty, data.threshold);
    }
  }, { onlyOnce: true });
}

// ✅ Send Email via EmailJS
function sendLowStockEmail(itemName, qty, min) {
  const params = {
    item_name: itemName,
    current_stock: qty,
    threshold: min
  };

  emailjs.send("service_anhww1g", "template_uk4zt3i", params)
    .then(() => console.log("✅ Email sent for", itemName))
    .catch((err) => console.error("❌ Email Error", err));
}

// ✅ Display All Items in Real-time
const container = document.getElementById("stockContainer");

onValue(ref(db, "stock_items"), snapshot => {
  const data = snapshot.val();
  container.innerHTML = "";

  if (data) {
    Object.values(data).forEach(item => {
      const card = document.createElement("div");
      card.className = "card";
      if (item.quantity < item.threshold) {
        card.classList.add("low-stock");
      }

      card.innerHTML = `
        <h3>${item.item_name}</h3>
        <p>Stock: ${item.quantity}</p>
        <p>Minimum: ${item.threshold}</p>
        <button onclick="sellItem('${item.item_name}')">Sell</button>
        <button onclick="purchaseItem('${item.item_name}')">Purchase</button>
        <button class="delete-btn" onclick="deleteItem('${item.item_name}')">Delete</button>
      `;

      container.appendChild(card);
    });
  }
});

// ✅ Sell / Purchase / Delete functions
window.sellItem = function (itemName) {
  updateStock(itemName, -1);
};

window.purchaseItem = function (itemName) {
  updateStock(itemName, +1);
};

window.deleteItem = function (itemName) {
  if (confirm(`Are you sure you want to delete "${itemName}"?`)) {
    remove(ref(db, "stock_items/" + itemName))
      .then(() => alert(`${itemName} deleted.`))
      .catch(err => {
        console.error("Delete Error:", err);
        alert("Failed to delete item.");
      });
  }
};
