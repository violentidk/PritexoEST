// Firebase konfigurajtsioon
const firebaseConfig = {
  apiKey: "AIzaSyBrJPtj6hdlTuix9gMiW9vNz8nuXeE6elU",
  authDomain: "pritexo.firebaseapp.com",
  projectId: "pritexo",
  storageBucket: "pritexo.appspot.com,
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "1:452336140936:web:57354db695d49d8475953d"
};

// Algatage Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);

// Vorm andmete lisamiseks
document.getElementById('addProductForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // Vormist saadud andmed
  const productName = document.getElementById('productName').value;
  const productCategory = document.getElementById('productCategory').value;
  const productPrices = document.getElementById('productPrices').value;

  // Lisame toote Firestore'i
  db.collection('Products').add({
    name: productName,
    category: productCategory,
    prices: productPrices,
    lastUpdated: new Date().toLocaleDateString()
  })
  .then(() => {
    alert('Toode lisatud!');
    // Vormist tühjendamine
    document.getElementById('addProductForm').reset();
    loadProducts(); // Laadi uuesti tooted
  })
  .catch((error) => {
    console.error("Error adding document: ", error);
  });
});

// Kuvame tooted veebilehel
function loadProducts() {
  db.collection('Products').get().then((querySnapshot) => {
    const productTableBody = document.getElementById('productTableBody');
    productTableBody.innerHTML = ''; // Tühjendame tabeli
    querySnapshot.forEach((doc) => {
      const product = doc.data();
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>${product.prices}</td>
        <td>${product.lastUpdated}</td>
        <td><button onclick="deleteProduct('${doc.id}')">Kustuta</button></td>
      `;
      productTableBody.appendChild(row);
    });
  });
}

// Kustutame toote Firestore'ist
function deleteProduct(productId) {
  db.collection('Products').doc(productId).delete()
    .then(() => {
      alert('Toode kustutatud!');
      loadProducts(); // Laadi uuesti tooted
    })
    .catch((error) => {
      console.error("Error deleting document: ", error);
    });
}

// Laadime tooted, kui leht avaneb
window.onload = loadProducts;
