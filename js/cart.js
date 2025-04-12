let cart = JSON.parse(localStorage.getItem('cart')) || [];

function formatUGX(amount) {
    return 'UGX ' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getProductById(id) {
    const products = [
        { id: 1, name: "Organic Apples", price: 11000, image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb" },
        { id: 2, name: "Fresh Milk", price: 12800, image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e" },
        { id: 3, name: "Whole Wheat Bread", price: 8400, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff" },
        { id: 4, name: "Carrots", price: 5500, image: "https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg" },
        { id: 5, name: "Greek Yogurt", price: 18300, image: "https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg" },
        { id: 6, name: "Bananas", price: 2200, image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e" }
    ];
    return products.find(product => product.id === id);
}

function addToCart(productId) {
    const product = getProductById(productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    saveCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    saveCart();
}

function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = parseInt(newQuantity);
        if (item.quantity <= 0) {
            removeFromCart(productId);
        }
    }
    updateCartDisplay();
    saveCart();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartDisplay() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('#cart-count').forEach(el => {
        el.textContent = totalItems;
    });
    
    if (document.querySelector('.cart-items')) {
        const cartItemsContainer = document.querySelector('.cart-items');
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        } else {
            cart.forEach(item => {
                cartItemsContainer.innerHTML += `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="cart-item-details">
                            <h3>${item.name}</h3>
                            <p>${formatUGX(item.price)} each</p>
                        </div>
                        <div class="cart-item-controls">
                            <input type="number" min="1" value="${item.quantity}" 
                                   onchange="updateQuantity(${item.id}, this.value)">
                            <button onclick="removeFromCart(${item.id})">Remove</button>
                        </div>
                        <div class="cart-item-price">
                            ${formatUGX(item.price * item.quantity)}
                        </div>
                    </div>
                `;
            });
        }
        
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const delivery = 5000;
        const total = subtotal + delivery;
        
        document.getElementById('subtotal').textContent = formatUGX(subtotal);
        document.getElementById('delivery').textContent = formatUGX(delivery);
        document.getElementById('total').textContent = formatUGX(total);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', updateCartDisplay);

// Make functions available globally
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;