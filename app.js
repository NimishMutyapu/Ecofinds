// App State
let currentUser = null;
let products = [];
let cart = [];
let purchases = [];

// DOM Elements
const authScreen = document.getElementById('auth-screen');
const mainApp = document.getElementById('main-app');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const showSignup = document.getElementById('show-signup');
const showLogin = document.getElementById('show-login');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const navBtns = document.querySelectorAll('.nav-btn');
const screens = document.querySelectorAll('.screen');
const productList = document.getElementById('product-list');
const userProductList = document.getElementById('user-product-list');
const historyList = document.getElementById('history-list');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const addProductBtn = document.getElementById('add-product-btn');
const addMyProductBtn = document.getElementById('add-my-product-btn');
const productDetail = document.getElementById('product-detail-content');
const addToCartBtn = document.getElementById('add-to-cart-btn');
const editProductScreen = document.getElementById('edit-product');
const productForm = document.getElementById('product-form');
const editProductTitle = document.getElementById('edit-product-title');
const userProfileBtn = document.getElementById('user-profile-btn');
const userDashboard = document.getElementById('user-dashboard');
const profileForm = document.getElementById('profile-form');
const logoutBtn = document.getElementById('logout-btn');
const cartBtn = document.getElementById('cart-btn');
const cartScreen = document.getElementById('cart-screen');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

// document.getElementById('back-btn').addEventListener('click', function(e) {
//   e.preventDefault();
//   // Call your function to show the previous screen
//   showMainScreen();
// });


// Initialize the app
function init() {
    // Load sample data if no data in localStorage
    if (!localStorage.getItem('ecoFindsUsers')) {
        const sampleUsers = [{
                id: 1,
                username: 'user1',
                email: 'user1@example.com',
                password: 'password1'
            },
            {
                id: 2,
                username: 'user2',
                email: 'user2@example.com',
                password: 'password2'
            }
        ];
        localStorage.setItem('ecoFindsUsers', JSON.stringify(sampleUsers));
    }

    if (!localStorage.getItem('ecoFindsProducts')) {
        const sampleProducts = [{
                id: 1,
                title: 'Wooden Chair',
                description: 'Handcrafted wooden chair made from reclaimed oak.',
                category: 'furniture',
                price: 45.99,
                userId: 1,
                image: 'https://www.godrejinterio.com/imagestore/B2C/56101502SD01899/56101502SD01899_A2_803x602.jpg'
            },
            
            {
                id: 2,
                title: 'Vintage Jacket',
                description: 'Leather jacket from the 80s in great condition.',
                category: 'clothing',
                price: 75.50,
                userId: 2,
                image: 'https://www.orangetree.in/cdn/shop/files/Gallery-1ChiyoL-ShapedSofaBuyOnline.jpg?v=1722852692'
            },
            {
                id: 3,
                title: 'JavaScript Book',
                description: 'Learn JavaScript from beginner to advanced.',
                category: 'books',
                price: 15.00,
                userId: 1,
                image: 'https://craftsmill.in/cdn/shop/files/sofas-accent-chairs-cider-orange-soft-velvet-touch-fabric-emily-flared-arm-2-seater-sofa-60-46567514931491.jpg?v=1725047510'
            }
        ];
        localStorage.setItem('ecoFindsProducts', JSON.stringify(sampleProducts));
    }

    // Check if user is logged in
    const loggedInUser = localStorage.getItem('ecoFindsCurrentUser');
    if (loggedInUser) {
        currentUser = JSON.parse(loggedInUser);
        authScreen.classList.add('hidden');
        mainApp.classList.remove('hidden');
        loadProducts();
        loadUserPurchases();
        updateProfileDisplay();
    }

    // Event Listeners
    showSignup.addEventListener('click', () => {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
    });

    showLogin.addEventListener('click', () => {
        signupForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });

    loginBtn.addEventListener('click', handleLogin);
    signupBtn.addEventListener('click', handleSignup);

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const screenId = btn.getAttribute('data-screen');
            showScreen(screenId);
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    searchInput.addEventListener('input', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);

    addProductBtn.addEventListener('click', () => {
        prepareAddProductForm();
        showScreen('edit-product');
    });

    addMyProductBtn.addEventListener('click', () => {
        prepareAddProductForm();
        showScreen('edit-product');
    });

    productForm.addEventListener('submit', handleProductSubmit);

    userProfileBtn.addEventListener('click', () => {
        showScreen('user-dashboard');
    });

    profileForm.addEventListener('submit', handleProfileUpdate);

    logoutBtn.addEventListener('click', handleLogout);

    cartBtn.addEventListener('click', () => {
        showScreen('cart-screen');
        renderCart();
    });

    addToCartBtn.addEventListener('click', addCurrentProductToCart);

    checkoutBtn.addEventListener('click', handleCheckout);
}

// Show a specific screen
function showScreen(screenId) {
    screens.forEach(screen => {
        screen.classList.remove('active');
        if (screen.id === screenId) {
            screen.classList.add('active');
        }
    });

    // Load appropriate data when screen is shown
    if (screenId === 'product-feed') {
        filterProducts();
    } else if (screenId === 'my-listings') {
        renderUserProducts();
    } else if (screenId === 'purchase-history') {
        renderPurchaseHistory();
    }
}

// Handle user login
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const users = JSON.parse(localStorage.getItem('ecoFindsUsers')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('ecoFindsCurrentUser', JSON.stringify(user));
        authScreen.classList.add('hidden');
        mainApp.classList.remove('hidden');
        loadProducts();
        loadUserPurchases();
        updateProfileDisplay();
        showScreen('product-feed');
    } else {
        alert('Invalid email or password');
    }
}

// Handle user signup
function handleSignup(e) {
    e.preventDefault();
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    if (!username || !email || !password) {
        alert('Please fill in all fields');
        return;
    }

    const users = JSON.parse(localStorage.getItem('ecoFindsUsers')) || [];

    // Check if email already exists
    if (users.some(u => u.email === email)) {
        alert('Email already in use');
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        username,
        email,
        password
    };

    users.push(newUser);
    localStorage.setItem('ecoFindsUsers', JSON.stringify(users));

    // Log in the new user
    currentUser = newUser;
    localStorage.setItem('ecoFindsCurrentUser', JSON.stringify(newUser));
    authScreen.classList.add('hidden');
    mainApp.classList.remove('hidden');
    loadProducts();
    updateProfileDisplay();
    showScreen('product-feed');

    // Switch back to login form for next time
    signupForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
}

// Load products from localStorage
function loadProducts() {
    products = JSON.parse(localStorage.getItem('ecoFindsProducts')) || [];
}

// Load user's purchase history
function loadUserPurchases() {
    const allPurchases = JSON.parse(localStorage.getItem('ecoFindsPurchases')) || [];
    purchases = allPurchases.filter(p => p.userId === currentUser.id);
}

// Filter products based on search and category
function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;

    let filteredProducts = products;

    if (category !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    if (searchTerm) {
        filteredProducts = filteredProducts.filter(p =>
            p.title.toLowerCase().includes(searchTerm)
        );
    }

    renderProducts(filteredProducts);
}

// Render products to the product feed
function renderProducts(productsToRender) {
    productList.innerHTML = '';

    if (productsToRender.length === 0) {
        productList.innerHTML = '<p>No products found</p>';
        return;
    }

    productsToRender.forEach(product => {
        const productCard = createProductCard(product);
        productList.appendChild(productCard);
    });
}

// Render user's products
function renderUserProducts() {
    userProductList.innerHTML = '';

    const userProducts = products.filter(p => p.userId === currentUser.id);

    if (userProducts.length === 0) {
        userProductList.innerHTML = '<p>You have no listings yet</p>';
        return;
    }

    userProducts.forEach(product => {
        const productCard = createProductCard(product, true);
        userProductList.appendChild(productCard);
    });
}

// Create a product card element
function createProductCard(product, withActions = false) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;

    let imageContent = '<i class="fas fa-image"></i>';
    if (product.image) {
        imageContent = `<img src="${product.image}" alt="${product.title}">`;
    }

    card.innerHTML = `
        <div class="product-image">
            ${imageContent}
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.title}</h3>
            <p class="product-price">$${product.price.toFixed(2)}</p>
        </div>
    `;

    if (withActions) {
        const actions = document.createElement('div');
        actions.className = 'product-actions';
        actions.innerHTML = `
            <button class="edit-btn" data-id="${product.id}">Edit</button>
            <button class="delete-btn" data-id="${product.id}">Delete</button>
        `;
        card.querySelector('.product-info').appendChild(actions);

        // Add event listeners to action buttons
        card.querySelector('.edit-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            prepareEditProductForm(product.id);
            showScreen('edit-product');
        });

        card.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Are you sure you want to delete this product?')) {
                deleteProduct(product.id);
            }
        });
    }

    // Add click event to view product details
    card.addEventListener('click', () => {
        showProductDetail(product.id);
    });

    return card;
}

// Show product detail view
function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    let imageContent = '<i class="fas fa-image"></i>';
    if (product.image) {
        imageContent = `<img src="${product.image}" alt="${product.title}">`;
    }

    productDetail.innerHTML = `
        <div class="detail-image">
            ${imageContent}
        </div>
        <h2 class="detail-title">${product.title}</h2>
        <p class="detail-price">$${product.price.toFixed(2)}</p>
        <span class="detail-category">${product.category}</span>
        <p class="detail-description">${product.description}</p>
    `;

    // Check if the product is the user's own product
    if (product.userId === currentUser.id) {
        addToCartBtn.classList.add('hidden');
    } else {
        addToCartBtn.classList.remove('hidden');
        addToCartBtn.dataset.productId = product.id;
    }

    showScreen('product-detail');
}

// Prepare the add product form
function prepareAddProductForm() {
    editProductTitle.textContent = 'Add New Product';
    productForm.reset();
    document.getElementById('image-preview').innerHTML = '<i class="fas fa-image"></i>';
    productForm.dataset.mode = 'add';
}

// Prepare the edit product form
function prepareEditProductForm(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    editProductTitle.textContent = 'Edit Product';
    document.getElementById('product-name').value = product.title;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-price').value = product.price;

    const imagePreview = document.getElementById('image-preview');
    if (product.image) {
        imagePreview.innerHTML = `<img src="${product.image}" alt="${product.title}">`;
    } else {
        imagePreview.innerHTML = '<i class="fas fa-image"></i>';
    }

    productForm.dataset.mode = 'edit';
    productForm.dataset.productId = productId;
}

// Handle product form submission
function handleProductSubmit(e) {
    e.preventDefault();

    const title = document.getElementById('product-name').value;
    const category = document.getElementById('product-category').value;
    const description = document.getElementById('product-description').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const imageFile = document.getElementById('product-image').files[0];

    if (!title || !category || !description || isNaN(price)) {
        alert('Please fill in all fields');
        return;
    }

    // Handle image upload
    let imageData = null;
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imageData = e.target.result;
            saveProduct(title, category, description, price, imageData);
        };
        reader.readAsDataURL(imageFile);
    } else {
        // If editing and no new image selected, keep the existing image
        if (productForm.dataset.mode === 'edit' && !imageFile) {
            const productId = parseInt(productForm.dataset.productId);
            const existingProduct = products.find(p => p.id === productId);
            imageData = existingProduct ? existingProduct.image : null;
        }
        saveProduct(title, category, description, price, imageData);
    }
}

// Save product to localStorage
function saveProduct(title, category, description, price, image) {
    if (productForm.dataset.mode === 'add') {
        // Add new product
        const newProduct = {
            id: Date.now(),
            title,
            description,
            category,
            price,
            userId: currentUser.id,
            image
        };

        products.push(newProduct);
    } else {
        // Update existing product
        const productId = parseInt(productForm.dataset.productId);
        const productIndex = products.findIndex(p => p.id === productId);

        if (productIndex !== -1) {
            products[productIndex] = {
                ...products[productIndex],
                title,
                description,
                category,
                price,
                image: image || products[productIndex].image
            };
        }
    }

    localStorage.setItem('ecoFindsProducts', JSON.stringify(products));
    showScreen('my-listings');
    renderUserProducts();
}

// Delete a product
function deleteProduct(productId) {
    products = products.filter(p => p.id !== productId);
    localStorage.setItem('ecoFindsProducts', JSON.stringify(products));
    renderUserProducts();
}

// Update user profile display
function updateProfileDisplay() {
    document.getElementById('profile-username').textContent = currentUser.username;
    document.getElementById('edit-username').value = currentUser.username;
    document.getElementById('edit-email').value = currentUser.email;
}

// Handle profile update
function handleProfileUpdate(e) {
    e.preventDefault();

    const username = document.getElementById('edit-username').value;
    const email = document.getElementById('edit-email').value;
    const password = document.getElementById('edit-password').value;

    if (!username || !email) {
        alert('Username and email are required');
        return;
    }

    // Update current user
    currentUser.username = username;
    currentUser.email = email;
    if (password) {
        currentUser.password = password;
    }

    // Update in localStorage
    localStorage.setItem('ecoFindsCurrentUser', JSON.stringify(currentUser));

    // Update in users array
    const users = JSON.parse(localStorage.getItem('ecoFindsUsers')) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('ecoFindsUsers', JSON.stringify(users));
    }

    alert('Profile updated successfully');
    updateProfileDisplay();
}

// Handle logout
function handleLogout() {
    currentUser = null;
    localStorage.removeItem('ecoFindsCurrentUser');
    mainApp.classList.add('hidden');
    authScreen.classList.remove('hidden');
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
}

// Add product to cart
function addCurrentProductToCart() {
    const productId = parseInt(addToCartBtn.dataset.productId);
    const product = products.find(p => p.id === productId);

    if (product) {
        // Check if product is already in cart
        const existingItem = cart.find(item => item.productId === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                productId,
                title: product.title,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }

        saveCart();
        renderCart();
        alert('Product added to cart');
    }
}

// Render cart items
function renderCart() {
    cartItems.innerHTML = '';

    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.textContent = '0.00';
        return;
    }

    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';

        let imageContent = '<i class="fas fa-image"></i>';
        if (item.image) {
            imageContent = `<img src="${item.image}" alt="${item.title}">`;
        }

        cartItem.innerHTML = `
            <div class="cart-item-image">
                ${imageContent}
            </div>
            <div class="cart-item-details">
                <h3 class="cart-item-title">${item.title}</h3>
                <p class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <button class="cart-item-remove" data-id="${item.productId}">
                <i class="fas fa-trash"></i>
            </button>
        `;

        cartItem.querySelector('.cart-item-remove').addEventListener('click', (e) => {
            e.stopPropagation();
            removeFromCart(item.productId);
        });

        cartItems.appendChild(cartItem);
    });

    cartTotal.textContent = total.toFixed(2);
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    saveCart();
    renderCart();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem(`ecoFindsCart_${currentUser.id}`, JSON.stringify(cart));
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem(`ecoFindsCart_${currentUser.id}`);
    cart = savedCart ? JSON.parse(savedCart) : [];
}

// Handle checkout
function handleCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }

    // Create a new purchase
    const newPurchase = {
        id: Date.now(),
        userId: currentUser.id,
        date: new Date().toISOString(),
        items: [...cart],
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };

    // Add to purchases
    const allPurchases = JSON.parse(localStorage.getItem('ecoFindsPurchases')) || [];
    allPurchases.push(newPurchase);
    localStorage.setItem('ecoFindsPurchases', JSON.stringify(allPurchases));

    // Clear cart
    cart = [];
    saveCart();

    // Update UI
    loadUserPurchases();
    renderCart();

    alert('Purchase completed successfully!');
    showScreen('purchase-history');
}

// Render purchase history
function renderPurchaseHistory() {
    historyList.innerHTML = '';

    if (purchases.length === 0) {
        historyList.innerHTML = '<p>No purchase history</p>';
        return;
    }

    purchases.forEach(purchase => {
        const purchaseDate = new Date(purchase.date);
        const purchaseElement = document.createElement('div');
        purchaseElement.className = 'purchase';

        purchaseElement.innerHTML = `
            <h3>Purchase #${purchase.id}</h3>
            <p>Date: ${purchaseDate.toLocaleDateString()}</p>
            <p>Total: $${purchase.total.toFixed(2)}</p>
            <div class="purchase-items"></div>
        `;

        const itemsContainer = purchaseElement.querySelector('.purchase-items');

        purchase.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'purchase-item';

            itemElement.innerHTML = `
                <p>${item.title} - $${item.price.toFixed(2)} x ${item.quantity}</p>
            `;

            itemsContainer.appendChild(itemElement);
        });

        historyList.appendChild(purchaseElement);
    });
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
