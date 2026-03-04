// Shop.Niva - Main JavaScript File

// Sample Products Data
const products = [
    {
        id: 1,
        name: 'Elegant Shoulder Bag',
        category: 'shoulder-bags',
        price: 1299,
        originalPrice: 1799,
        image: 'https://via.placeholder.com/300x300/D4AF37/FFFFFF?text=Shoulder+Bag',
        rating: 4.8,
        reviews: 48,
        description: 'Premium vegan leather shoulder bag with adjustable strap',
        inStock: true
    },
    {
        id: 2,
        name: 'Classic Handbag',
        category: 'handbags',
        price: 1599,
        originalPrice: 2299,
        image: 'https://via.placeholder.com/300x300/2C2C2C/FFFFFF?text=Handbag',
        rating: 4.9,
        reviews: 62,
        description: 'Timeless design with spacious interior',
        inStock: true
    },
    {
        id: 3,
        name: 'Evening Clutch',
        category: 'clutches',
        price: 899,
        originalPrice: 1299,
        image: 'https://via.placeholder.com/300x300/B8941F/FFFFFF?text=Clutch',
        rating: 4.7,
        reviews: 35,
        description: 'Perfect for special occasions',
        inStock: true
    },
    {
        id: 4,
        name: 'Crossbody Bag',
        category: 'shoulder-bags',
        price: 1199,
        originalPrice: 1699,
        image: 'https://via.placeholder.com/300x300/D4AF37/FFFFFF?text=Crossbody',
        rating: 4.6,
        reviews: 41,
        description: 'Hands-free convenience with style',
        inStock: true
    },
    {
        id: 5,
        name: 'Tote Bag',
        category: 'handbags',
        price: 1399,
        originalPrice: 1899,
        image: 'https://via.placeholder.com/300x300/2C2C2C/FFFFFF?text=Tote',
        rating: 4.8,
        reviews: 55,
        description: 'Spacious and stylish everyday bag',
        inStock: true
    },
    {
        id: 6,
        name: 'Mini Clutch',
        category: 'clutches',
        price: 799,
        originalPrice: 1099,
        image: 'https://via.placeholder.com/300x300/B8941F/FFFFFF?text=Mini+Clutch',
        rating: 4.5,
        reviews: 28,
        description: 'Compact elegance for evenings',
        inStock: true
    }
];

// Cart Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    updateCartCount();
    loadFeaturedProducts();
    loadShopProducts();
    loadCartItems();
    initProductPage();
    initCheckoutPage();
    initForms();
});

// Navigation Functions
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Search functionality
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const query = prompt('Search products:');
            if (query) {
                window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
            }
        });
    }
}

// Product Display Functions
function createProductCard(product) {
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    
    return `
        <div class="product-card" onclick="goToProduct(${product.id})">
            <div class="product-image" style="background-image: url('${product.image}'); background-size: cover; background-position: center;">
                ${discount > 0 ? `<span class="product-badge">${discount}% OFF</span>` : ''}
            </div>
            <div class="product-info">
                <div class="product-rating">★★★★★ (${product.reviews})</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-category">${product.category.replace('-', ' ')}</p>
                <div class="product-price-row">
                    <span class="product-price">₹${product.price}</span>
                    ${product.originalPrice ? `<span class="product-original-price">₹${product.originalPrice}</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="btn btn-primary" onclick="event.stopPropagation(); addToCart(${product.id})">
                        Add to Cart
                    </button>
                    <button class="btn btn-outline" onclick="event.stopPropagation(); toggleWishlist(${product.id})">
                        ❤️
                    </button>
                </div>
            </div>
        </div>
    `;
}

function loadFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;
    
    const featuredProducts = products.slice(0, 4);
    container.innerHTML = featuredProducts.map(createProductCard).join('');
}

function loadShopProducts() {
    const container = document.getElementById('shopProducts');
    if (!container) return;
    
    // Get filters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const search = urlParams.get('search');
    
    let filtered = products;
    
    if (category) {
        filtered = products.filter(p => p.category === category);
    }
    
    if (search) {
        filtered = products.filter(p => 
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase())
        );
    }
    
    container.innerHTML = filtered.length > 0 
        ? filtered.map(createProductCard).join('')
        : '<p>No products found.</p>';
}

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    showNotification('Product added to cart!');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    loadCartItems();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        loadCartItems();
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cartCounts = document.querySelectorAll('.cart-count, #cartCount');
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCounts.forEach(el => {
        if (el) el.textContent = count;
    });
}

function loadCartItems() {
    const container = document.getElementById('cartItems');
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<p>Your cart is empty. <a href="shop.html">Start shopping!</a></p>';
        return;
    }
    
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p>₹${item.price}</p>
                <div class="quantity-control">
                    <button onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button onclick="removeFromCart(${item.id})" class="remove-btn">Remove</button>
        </div>
    `).join('');
    
    updateCartSummary();
}

function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 999 ? 0 : 99;
    const total = subtotal + shipping;
    
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const totalEl = document.getElementById('total');
    const checkoutTotalEl = document.getElementById('checkoutTotal');
    
    if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'FREE' : `₹${shipping}`;
    if (totalEl) totalEl.textContent = `₹${total}`;
    if (checkoutTotalEl) checkoutTotalEl.textContent = `₹${total}`;
}

// Product Page Functions
function initProductPage() {
    const qtyMinus = document.getElementById('qtyMinus');
    const qtyPlus = document.getElementById('qtyPlus');
    const quantity = document.getElementById('quantity');
    const addToCartBtn = document.getElementById('addToCartBtn');
    
    if (qtyMinus && qtyPlus && quantity) {
        qtyMinus.addEventListener('click', () => {
            const val = parseInt(quantity.value);
            if (val > 1) quantity.value = val - 1;
        });
        
        qtyPlus.addEventListener('click', () => {
            const val = parseInt(quantity.value);
            quantity.value = val + 1;
        });
    }
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            // Get product from URL or use sample
            addToCart(1);
        });
    }
}

// Checkout Functions
function initCheckoutPage() {
    const checkoutForm = document.getElementById('checkoutForm');
    const checkoutItems = document.getElementById('checkoutItems');
    
    if (checkoutItems) {
        checkoutItems.innerHTML = cart.map(item => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>${item.name} x ${item.quantity}</span>
                <span>₹${item.price * item.quantity}</span>
            </div>
        `).join('');
        
        updateCartSummary();
    }
    
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Generate order number
            const orderNumber = 'SN' + Date.now();
            
            // Clear cart
            cart = [];
            saveCart();
            updateCartCount();
            
            // Show success and redirect
            alert(`Order placed successfully! Order #${orderNumber}\n\nThank you for shopping with Shop.Niva!`);
            window.location.href = 'index.html';
        });
    }
}

// Form Handlers
function initForms() {
    const newsletterForm = document.getElementById('newsletterForm');
    const contactForm = document.getElementById('contactForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Thank you for subscribing!');
            newsletterForm.reset();
        });
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Message sent! We\'ll get back to you soon.');
            contactForm.reset();
        });
    }
}

// Utility Functions
function goToProduct(productId) {
    window.location.href = `product.html?id=${productId}`;
}

function toggleWishlist(productId) {
    showNotification('Added to wishlist!');
}

function showNotification(message) {
    // Simple notification
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #D4AF37;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export functions to global scope
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.goToProduct = goToProduct;
window.toggleWishlist = toggleWishlist;
