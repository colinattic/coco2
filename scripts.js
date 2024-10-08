const productContainer = document.getElementById('product-container');
let allProducts = [];

// Function to display products
function displayProducts(products) {
    productContainer.innerHTML = ''; // Clear container
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>Price: <b>රු ${product.price}</b></p>
            <p class="${product.stock > 0 ? 'in-stock' : 'out-of-stock'}">${product.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>
            <p>Minimum Order: ${product.minOrder} units</p>
            <button>Order WhatsApp</button>
        `;

        // Redirect to product details page on click
        productDiv.onclick = () => {
            window.location.href = `product-details.html?id=${product.id}`;
        };

        productContainer.appendChild(productDiv);
    });
}

// Function to filter products based on search input
function filterProducts() {
    const searchQuery = document.getElementById('search-bar').value.toLowerCase();
    const filteredProducts = allProducts.filter(product => 
        product.name.toLowerCase().includes(searchQuery) || 
        product.description.toLowerCase().includes(searchQuery)
    );
    displayProducts(filteredProducts);
}

// Function to open the checkout modal
function openCheckoutModal(productName, productPrice, productStock, minOrder) {
    document.getElementById('checkout-modal').style.display = 'block';
    document.getElementById('submitOrder').onclick = () => submitOrder(productName, productPrice, productStock, minOrder);
}

// Function to close the checkout modal
function closeCheckoutModal() {
    document.getElementById('checkout-modal').style.display = 'none';
}

// Event listener for closing the modal
document.getElementById('closeModal').onclick = closeCheckoutModal;

// Function to submit the order
function submitOrder(productName, productPrice, productStock, minOrder) {
    const shopName = document.getElementById('shop-name').value;
    const address = document.getElementById('address').value;
    const quantity = parseInt(document.getElementById('quantity').value);

    // Error handling for quantity
    if (quantity < minOrder) {
        document.getElementById('quantity-error').textContent = `Minimum order is ${minOrder} units.`;
        document.getElementById('quantity-error').style.display = 'block';
        return;
    } else if (quantity > productStock) {
        document.getElementById('quantity-error').textContent = `Only ${productStock} units available in stock.`;
        document.getElementById('quantity-error').style.display = 'block';
        return;
    } else {
        document.getElementById('quantity-error').style.display = 'none'; // Hide error message
    }

    // WhatsApp number with country code
    const whatsappNumber = "+94785822315"; // Your WhatsApp number with country code
    const message = `*New Order*\nShop Name: ${shopName}\nAddress: ${address}\nProduct: ${productName}\nQuantity: ${quantity}\nTotal Price: LKR ${productPrice * quantity}`;
    const whatsappLink = `https://wa.me/${whatsappNumber.replace("+", "")}?text=${encodeURIComponent(message)}`;

    window.open(whatsappLink, '_blank'); // Open WhatsApp chat
    closeCheckoutModal(); // Close modal after submission
}

// Fetch product data from JSON file in the same directory
fetch('./products.json') // Use the relative path to your JSON file
    .then(response => response.json())
    .then(data => {
        allProducts = data; // Store all products
        displayProducts(data); // Display all products initially
    })
    .catch(error => console.error('Error fetching product data:', error));
