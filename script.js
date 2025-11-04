// Product Data with Enhanced Information
const products = [
    {
        id: 1,
        name: "Ciki Citato Lite",
        category: "pedas",
        price: 7000,
        oldPrice: 12000,
        rating: 4.5,
        reviews: 128,
        description: "Ciki Citato Lite rasa original dengan kerenyahan khas yang bikin nagih. Cocok untuk menemani waktu santai, nonton, atau nongkrong bareng teman.",
        image: "assets/ciki-1.jpg",
        badge: "hot"
    },
    {
        id: 2,
        name: "Ciki Citato Mie Goreng",
        category: "gurih",
        price: 8000,
        oldPrice: 13000,
        rating: 4.8,
        reviews: 95,
        description: "Ciki Citato Lite rasa Mie Goreng — kombinasi gurih, asin, dan sedikit manis yang mirip mie goreng legendaris. Kerenyahan maksimal dengan aroma khas yang bikin lapar terus.",
        image: "assets/ciki-2.png",
        badge: "new"
    },
    {
        id: 3,
        name: "Ciki Lays Rumput Laut",
        category: "gurih",
        price: 6000,
        oldPrice: 11000,
        rating: 4.3,
        reviews: 76,
        description: "Lays Rumput Laut menghadirkan kerenyahan kentang pilihan dengan balutan bumbu rumput laut yang gurih dan aromatik. Setiap gigitan memberikan rasa laut yang khas dan bikin nagih.",
        image: "assets/ciki-3.jpg"
    },
    {
        id: 4,
        name: "Ciki Doritos",
        category: "pedas",
        price: 9500,
        oldPrice: 14000,
        rating: 4.6,
        reviews: 112,
        description: "Doritos Jagung Bakar menghadirkan sensasi renyah khas tortilla chips berpadu dengan rasa jagung bakar yang gurih, manis, dan sedikit smoky. Camilan favorit yang bikin susah berhenti ngemil.",
        image: "assets/ciki-4.jpg",
        badge: "hot"
    },
    {
        id: 5,
        name: "Ciki Japota Rumput Laut",
        category: "gurih",
        price: 6000,
        oldPrice: 12000,
        rating: 4.4,
        reviews: 88,
        description: "Japota Rumput Laut hadir dengan potongan kentang super renyah dan bumbu rumput laut asli yang gurih serta aromatik. Setiap gigitan bikin kamu serasa ngemil di pinggir pantai Jepang.",
        image: "assets/ciki-5.jpg"
    },
    {
        id: 6,
        name: "Ciki Japota Ayam Bawang",
        category: "gurih",
        price: 7500,
        oldPrice: 13000,
        rating: 4.7,
        reviews: 134,
        description: "Japota Ayam Bawang menghadirkan kelezatan rasa ayam gurih berpadu aroma bawang yang harum menggoda. Renyahnya kentang Japota membuat rasa klasik ini terasa makin istimewa di setiap gigitan.",
        image: "assets/ciki-6.jpg",
        badge: "new"
    },
    {
        id: 7,
        name: "Ciki Japota Sapi Panggang",
        category: "spesial",
        price: 7500,
        oldPrice: 12000,
        rating: 4.9,
        reviews: 67,
        description: "Japota Sapi Panggang menawarkan rasa daging sapi panggang premium dengan aroma smoky yang khas. Kentangnya tebal, gurih, dan renyah — bikin setiap gigitan terasa seperti makan steak mini.",
        image: "assets/ciki-10.jpg",
        badge: "new"
    },
    {
        id: 8,
        name: "Ciki Twist Jagung Bakar",
        category: "spesial",
        price: 6500,
        oldPrice: 12500,
        rating: 4.5,
        reviews: 91,
        description: "Ciki Twist Jagung Bakar menghadirkan sensasi gurih dan manis dari jagung bakar khas Indonesia. Teksturnya ringan, renyah, dan bikin susah berhenti ngemil. Cocok untuk semua suasana.",
        image: "assets/ciki-11.jpg"
    }
];

// Topping prices configuration
const toppingPrices = {
    'Saus Tomat': 2000,
    'Saus Sambal': 2000,
    'Mayones': 3000,
    'Saus BBQ': 3000,
    'Selada': 1500,
    'Tomat': 2000,
    'Timun': 1500,
    'Jagung': 2500,
    'Nugget': 5000,
    'Sosis': 4000,
    'Keju': 3500,
    'Telur': 3000
};

// Global Variables
let cart = JSON.parse(localStorage.getItem('mixcrunch_cart')) || [];
let reviews = JSON.parse(localStorage.getItem('mixcrunch_reviews')) || {};
let selectedToppings = [];
let showingAllProducts = false;

// Storage Manager
const StorageManager = {
    saveCart() {
        localStorage.setItem('mixcrunch_cart', JSON.stringify(cart));
    },
    
    saveReviews() {
        localStorage.setItem('mixcrunch_reviews', JSON.stringify(reviews));
    },
    
    clearAll() {
        localStorage.removeItem('mixcrunch_cart');
        localStorage.removeItem('mixcrunch_reviews');
    }
};

// Utility Functions
const Utils = {
    formatPrice(price) {
        return `Rp ${price.toLocaleString('id-ID')}`;
    },
    
    generateStars(rating) {
        let starsHTML = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }
        
        return starsHTML;
    },
    
    showNotification(id, message, duration = 3000) {
        const notification = document.getElementById(id);
        if (notification) {
            if (id === 'social-notification') {
                document.getElementById('social-notification-text').textContent = message;
            } else {
                notification.querySelector('span').textContent = message;
            }
            notification.style.display = 'flex';
            setTimeout(() => {
                notification.style.display = 'none';
            }, duration);
        }
    }
};

// Product Manager
const ProductManager = {
    renderProducts(limit = null) {
        const productContainer = document.getElementById('product-container');
        if (!productContainer) return;
        
        productContainer.innerHTML = '';
        const productsToShow = limit ? products.slice(0, limit) : products;
        
        productsToShow.forEach(product => {
            const productCard = this.createProductCard(product);
            productContainer.appendChild(productCard);
        });
    },
    
    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-category', product.category);
        
        const badgeHTML = product.badge ? 
            `<div class="product-badge ${product.badge}">${product.badge === 'hot' ? 'HOT' : 'BARU'}</div>` : '';
        
        const productReviews = reviews[product.id] || [];
        const averageRating = productReviews.length > 0 
            ? productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length
            : product.rating;
        
        const starsHTML = Utils.generateStars(averageRating);
        const reviewCount = productReviews.length || product.reviews;
        
        card.innerHTML = `
            <div class="product-image">
                <img alt="${product.name}" src="${product.image}" onerror="this.src='assets/coming-soon.jpeg'"/>
                ${badgeHTML}
                <div class="product-overlay">
                    <button class="quick-add-btn add-to-cart" data-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-rating">
                    <div class="stars">${starsHTML}</div>
                    <span class="review-count">(${reviewCount} ulasan)</span>
                </div>
                <p>${product.description}</p>
                <div class="product-footer">
                    <div class="price">
                        <span class="current-price">${Utils.formatPrice(product.price)}</span>
                        <span class="old-price">${Utils.formatPrice(product.oldPrice)}</span>
                    </div>
                    <div class="product-actions">
                        <button class="add-to-cart-btn" data-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i> Keranjang
                        </button>
                        <button class="whatsapp-order-btn" data-id="${product.id}">
                            <i class="fab fa-whatsapp"></i> Pesan
                        </button>
                    </div>
                </div>
                <div class="product-social-actions">
                    <button class="social-action-btn reviews-btn" data-id="${product.id}">
                        <i class="fas fa-star"></i> <span>Ulasan</span>
                    </button>
                    <button class="social-action-btn like-btn" data-id="${product.id}">
                        <i class="far fa-heart"></i> <span>Suka</span>
                    </button>
                    <button class="social-action-btn share-btn" data-id="${product.id}">
                        <i class="fas fa-share-alt"></i> <span>Bagikan</span>
                    </button>
                </div>
            </div>
        `;
        
        return card;
    },
    
    filterProducts(category) {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
    },
    
    searchProducts(searchTerm) {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            const productName = card.querySelector('h3').textContent.toLowerCase();
            if (productName.includes(searchTerm.toLowerCase())) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
};

// Cart Manager
const CartManager = {
    addToCart(productId) {
        const product = products.find(p => p.id == productId);
        if (!product) return;
        
        const existingItem = cart.find(item => item.id == productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                quantity: 1
            });
        }
        
        this.updateCart();
        StorageManager.saveCart();
        Utils.showNotification('cart-notification', 'Produk berhasil ditambahkan ke keranjang!');
        this.animateCartIcon();
    },
    
    removeFromCart(productId) {
        cart = cart.filter(item => item.id != productId);
        this.updateCart();
        StorageManager.saveCart();
    },
    
    updateQuantity(productId, change) {
        const item = cart.find(item => item.id == productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                this.updateCart();
                StorageManager.saveCart();
            }
        }
    },
    
    clearCart() {
        cart = [];
        this.updateCart();
        StorageManager.saveCart();
    },
    
    updateCart() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        // Update cart count
        document.querySelectorAll('.cart-count').forEach(element => {
            element.textContent = totalItems;
        });
        
        // Update cart items display
        this.renderCartItems();
        
        // Update cart summary
        this.updateCartSummary();
        
        // Update button states
        const checkoutBtn = document.getElementById('checkout-btn');
        const clearCartBtn = document.getElementById('clear-cart-btn');
        
        if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;
        if (clearCartBtn) clearCartBtn.disabled = cart.length === 0;
    },
    
    renderCartItems() {
        const cartItems = document.getElementById('cart-items');
        if (!cartItems) return;
        
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Keranjang belanja kosong</p>
                    <small>Tambahkan produk untuk mulai berbelanja</small>
                </div>
            `;
            return;
        }
        
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${Utils.formatPrice(item.price)}</p>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="qty-btn decrease" data-id="${item.id}">-</button>
                        <span class="qty-display">${item.quantity}</span>
                        <button class="qty-btn increase" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    },
    
    updateCartSummary() {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        const cartSubtotal = document.getElementById('cart-subtotal');
        const cartTotal = document.getElementById('cart-total');
        
        if (cartSubtotal) cartSubtotal.textContent = Utils.formatPrice(subtotal);
        if (cartTotal) cartTotal.textContent = Utils.formatPrice(subtotal);
    },
    
    animateCartIcon() {
        document.querySelectorAll('.cart-icon').forEach(icon => {
            icon.classList.add('animate');
            setTimeout(() => {
                icon.classList.remove('animate');
            }, 600);
        });
    },
    
    openCartSidebar() {
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartOverlay = document.getElementById('cart-overlay');
        
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },
    
    closeCartSidebar() {
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartOverlay = document.getElementById('cart-overlay');
        
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
};

// Topping Manager
const ToppingManager = {
    selectedToppings: [],
    
    openModal() {
        if (cart.length === 0) {
            alert('Keranjang belanja kosong. Silakan tambahkan produk terlebih dahulu.');
            return;
        }
        
        const modal = document.getElementById('toppings-overlay');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            this.resetForm();
        }
    },
    
    closeModal() {
        const modal = document.getElementById('toppings-overlay');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    },
    
    resetForm() {
        this.selectedToppings = [];
        document.getElementById('custom-notes').value = '';
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        this.updateToppingSummary();
    },
    
    handleToppingChange(checkbox) {
        const toppingName = checkbox.value;
        const toppingPrice = toppingPrices[toppingName] || 0;
        
        if (checkbox.checked) {
            this.selectedToppings.push({
                name: toppingName,
                price: toppingPrice
            });
        } else {
            this.selectedToppings = this.selectedToppings.filter(
                topping => topping.name !== toppingName
            );
        }
        
        this.updateToppingSummary();
    },
    
    updateToppingSummary() {
        const total = this.selectedToppings.reduce((sum, topping) => sum + topping.price, 0);
        const toppingTotal = document.getElementById('topping-total');
        if (toppingTotal) {
            toppingTotal.textContent = Utils.formatPrice(total);
        }
    },
    
    confirmOrder() {
        if (this.selectedToppings.length === 0) {
            alert('Silakan pilih minimal satu topping sebelum melanjutkan!');
            return;
        }
        
        const customNotes = document.getElementById('custom-notes').value.trim();
        this.sendToWhatsApp(customNotes);
        this.closeModal();
    },
    
    sendToWhatsApp(customNotes) {
        const productSubtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const toppingSubtotal = this.selectedToppings.reduce((total, topping) => total + topping.price, 0);
        const grandTotal = productSubtotal + toppingSubtotal;
        
        let message = `Halo! Saya tertarik untuk memesan produk berikut:\n\n`;
        
        message += `*Detail Pesanan:*\n`;
        cart.forEach((item, index) => {
            message += `${index + 1}. ${item.name}\n`;
            message += `   Jumlah: ${item.quantity}\n`;
            message += `   Harga: ${Utils.formatPrice(item.price)}\n`;
            message += `   Subtotal: ${Utils.formatPrice(item.price * item.quantity)}\n\n`;
        });
        
        if (this.selectedToppings.length > 0) {
            message += `*Topping:*\n`;
            this.selectedToppings.forEach((topping, index) => {
                message += `${index + 1}. ${topping.name} - ${Utils.formatPrice(topping.price)}\n`;
            });
            message += `\n`;
        }
        
        if (customNotes) {
            message += `*Catatan Khusus:*\n${customNotes}\n\n`;
        }
        
        message += `*Ringkasan Pembayaran:*\n`;
        message += `Subtotal Produk: ${Utils.formatPrice(productSubtotal)}\n`;
        message += `Subtotal Topping: ${Utils.formatPrice(toppingSubtotal)}\n`;
        message += `*Total: ${Utils.formatPrice(grandTotal)}*\n\n`;
        message += `Bisa tolong informasikan ketersediaan dan cara pemesanannya? Terima kasih!`;
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/6285692816835?text=${encodedMessage}`;
        
        window.open(whatsappURL, '_blank');
        
        // Clear cart after successful order
        CartManager.clearCart();
        
        setTimeout(() => {
            alert('Pesanan berhasil dikirim ke WhatsApp! Terima kasih telah berbelanja.');
        }, 1000);
    }
};

// Review Manager
const ReviewManager = {
    currentProductId: null,
    
    openModal(productId) {
        this.currentProductId = productId;
        const product = products.find(p => p.id == productId);
        if (!product) return;
        
        const modal = document.getElementById('reviews-overlay');
        if (!modal) return;
        
        // Set product info
        const productImage = document.getElementById('review-product-image');
        productImage.src = product.image;
        productImage.onerror = function() {
            this.src = 'assets/coming-soon.jpeg';
        };
        
        document.getElementById('review-product-name').textContent = product.name;
        
        // Calculate average rating
        const productReviews = reviews[productId] || [];
        const averageRating = productReviews.length > 0 
            ? productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length
            : product.rating;
        
        // Update rating display
        const ratingElement = document.getElementById('review-product-rating');
        ratingElement.innerHTML = Utils.generateStars(averageRating);
        
        // Update review count
        document.getElementById('review-product-count').textContent = `(${productReviews.length} ulasan)`;
        
        // Display reviews
        this.displayReviews(productId);
        
        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Reset form
        this.resetForm();
    },
    
    closeModal() {
        const modal = document.getElementById('reviews-overlay');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
        this.currentProductId = null;
    },
    
    resetForm() {
        document.getElementById('reviewer-name').value = '';
        document.getElementById('review-comment').value = '';
        document.querySelectorAll('.star-rating i').forEach(star => {
            star.classList.remove('active');
            star.classList.remove('fas');
            star.classList.add('far');
        });
    },
    
    handleStarClick(rating) {
        const stars = document.querySelectorAll('.star-rating i');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
                star.classList.remove('far');
                star.classList.add('fas');
            } else {
                star.classList.remove('active');
                star.classList.remove('fas');
                star.classList.add('far');
            }
        });
    },
    
    submitReview() {
        const reviewerName = document.getElementById('reviewer-name').value.trim();
        const reviewComment = document.getElementById('review-comment').value.trim();
        const activeStars = document.querySelectorAll('.star-rating i.active');
        const rating = activeStars.length;
        
        if (!reviewerName || !reviewComment || rating === 0) {
            alert('Silakan isi semua field dan berikan rating!');
            return;
        }
        
        // Add review to product
        if (!reviews[this.currentProductId]) {
            reviews[this.currentProductId] = [];
        }
        
        reviews[this.currentProductId].push({
            id: Date.now().toString(),
            name: reviewerName,
            rating: rating,
            comment: reviewComment,
            date: new Date().toLocaleDateString('id-ID')
        });
        
        // Save to localStorage
        StorageManager.saveReviews();
        
        // Update reviews display
        this.displayReviews(this.currentProductId);
        
        // Reset form
        this.resetForm();
        
        // Show success message
        Utils.showNotification('social-notification', 'Ulasan berhasil ditambahkan!');
        
        // Update product rating in product card
        this.updateProductRating(this.currentProductId);
    },
    
    displayReviews(productId) {
        const reviewsList = document.getElementById('reviews-list');
        const productReviews = reviews[productId] || [];
        
        if (!reviewsList) return;
        
        if (productReviews.length === 0) {
            reviewsList.innerHTML = '<p class="no-reviews">Belum ada ulasan untuk produk ini.</p>';
            return;
        }
        
        reviewsList.innerHTML = productReviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <div class="reviewer-info">
                        <h5>${review.name}</h5>
                        <div class="stars">
                            ${Utils.generateStars(review.rating)}
                        </div>
                    </div>
                    <div class="review-meta">
                        <span class="review-date">${review.date}</span>
                        <button class="review-action-btn delete-review delete" data-id="${review.id}" data-product="${productId}">
                            <i class="fas fa-trash"></i> Hapus
                        </button>
                    </div>
                </div>
                <p class="review-comment">${review.comment}</p>
            </div>
        `).join('');
    },
    
    deleteReview(productId, reviewId) {
        if (!confirm('Apakah Anda yakin ingin menghapus ulasan ini?')) {
            return;
        }
        
        const productReviews = reviews[productId] || [];
        const reviewIndex = productReviews.findIndex(r => r.id === reviewId);
        
        if (reviewIndex !== -1) {
            productReviews.splice(reviewIndex, 1);
            
            // Save to localStorage
            StorageManager.saveReviews();
            
            // Update reviews display
            this.displayReviews(productId);
            
            // Show success message
            Utils.showNotification('social-notification', 'Ulasan berhasil dihapus!');
            
            // Update product rating in product card
            this.updateProductRating(productId);
        }
    },
    
    updateProductRating(productId) {
        // Re-render products to update ratings
        ProductManager.renderProducts(showingAllProducts ? null : 3);
    }
};

// Navigation Manager
const NavigationManager = {
    initNavbar() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                hamburger.classList.toggle('active');
            });
        }
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            }
        });
    },
    
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    },
    
    initBackToTop() {
        const backToTop = document.getElementById('back-to-top');
        
        if (backToTop) {
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 300) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
            });
            
            backToTop.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }
};

// Slider Manager
const SliderManager = {
    currentSlide: 0,
    slideInterval: null,
    
    init() {
        const slider = document.getElementById('slider');
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.slider-dot');
        const prevBtn = document.getElementById('prev-slide');
        const nextBtn = document.getElementById('next-slide');
        
        if (!slider || slides.length === 0) return;
        
        // Auto slide
        this.slideInterval = setInterval(() => this.nextSlide(), 5000);
        
        // Button navigation
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.clearInterval();
                this.prevSlide();
                this.startInterval();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.clearInterval();
                this.nextSlide();
                this.startInterval();
            });
        }
        
        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.clearInterval();
                this.showSlide(index);
                this.startInterval();
            });
        });
        
        // Touch swipe support
        let startX = 0;
        let endX = 0;
        
        slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        slider.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
        });
    },
    
    showSlide(index) {
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.slider-dot');
        
        // Update active slide
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
        
        // Update active dot
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
        
        // Update background color based on slide
        const category = slides[index].getAttribute('data-category');
        this.updateHeroBackground(category);
        
        this.currentSlide = index;
    },
    
    nextSlide() {
        const slides = document.querySelectorAll('.slide');
        let next = this.currentSlide + 1;
        if (next >= slides.length) next = 0;
        this.showSlide(next);
    },
    
    prevSlide() {
        const slides = document.querySelectorAll('.slide');
        let prev = this.currentSlide - 1;
        if (prev < 0) prev = slides.length - 1;
        this.showSlide(prev);
    },
    
    handleSwipe(startX, endX) {
        const diff = startX - endX;
        const swipeThreshold = 50;
        
        if (Math.abs(diff) > swipeThreshold) {
            this.clearInterval();
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
            this.startInterval();
        }
    },
    
    updateHeroBackground(category) {
        const heroBg = document.querySelector('.hero-bg');
        if (!heroBg) return;
        
        const colors = {
            pedas: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
            gurih: 'linear-gradient(135deg, #f59e0b 0%, #eab308 100%)',
            spesial: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
            manis: 'linear-gradient(135deg, #f59e0b 0%, #eab308 100%)'
        };
        
        heroBg.style.background = colors[category] || colors.pedas;
    },
    
    clearInterval() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
        }
    },
    
    startInterval() {
        this.slideInterval = setInterval(() => this.nextSlide(), 5000);
    }
};

// FAQ Manager
const FAQManager = {
    init() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current FAQ item
                item.classList.toggle('active');
            });
        });
    }
};

// Promo Timer Manager
const PromoManager = {
    init() {
        this.updateTimer();
        setInterval(() => this.updateTimer(), 1000);
    },
    
    updateTimer() {
        // Set promo end date to 7 days from now
        const promoEndDate = new Date();
        promoEndDate.setDate(promoEndDate.getDate() + 7);
        
        const now = new Date();
        const timeLeft = promoEndDate - now;
        
        if (timeLeft <= 0) {
            promoEndDate.setDate(promoEndDate.getDate() + 7);
        }
        
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        const promoDays = document.getElementById('promo-days');
        const promoHours = document.getElementById('promo-hours');
        const promoMinutes = document.getElementById('promo-minutes');
        const promoSeconds = document.getElementById('promo-seconds');
        
        if (promoDays) promoDays.textContent = days.toString().padStart(2, '0');
        if (promoHours) promoHours.textContent = hours.toString().padStart(2, '0');
        if (promoMinutes) promoMinutes.textContent = minutes.toString().padStart(2, '0');
        if (promoSeconds) promoSeconds.textContent = seconds.toString().padStart(2, '0');
    }
};

// Event Handlers
const EventHandlers = {
    init() {
        this.initProductEvents();
        this.initCartEvents();
        this.initToppingEvents();
        this.initReviewEvents();
        this.initSearchEvents();
        this.initFilterEvents();
        this.initViewMoreEvents();
        this.initSocialEvents();
        this.initWhatsAppEvents();
    },
    
    initProductEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-cart') || e.target.closest('.add-to-cart-btn')) {
                const button = e.target.closest('.add-to-cart') || e.target.closest('.add-to-cart-btn');
                const productId = button.getAttribute('data-id');
                CartManager.addToCart(productId);
            }
        });
    },
    
    initCartEvents() {
        // Cart icon clicks
        document.querySelectorAll('.cart-icon').forEach(icon => {
            icon.addEventListener('click', () => CartManager.openCartSidebar());
        });
        
        // Close cart events
        const closeCart = document.querySelector('.close-cart');
        const cartOverlay = document.getElementById('cart-overlay');
        const continueShopping = document.querySelector('.continue-shopping');
        
        if (closeCart) closeCart.addEventListener('click', () => CartManager.closeCartSidebar());
        if (cartOverlay) cartOverlay.addEventListener('click', () => CartManager.closeCartSidebar());
        if (continueShopping) continueShopping.addEventListener('click', () => CartManager.closeCartSidebar());
        
        // Cart item controls
        document.addEventListener('click', (e) => {
            if (e.target.closest('.increase')) {
                const id = e.target.closest('.increase').getAttribute('data-id');
                CartManager.updateQuantity(id, 1);
            }
            
            if (e.target.closest('.decrease')) {
                const id = e.target.closest('.decrease').getAttribute('data-id');
                CartManager.updateQuantity(id, -1);
            }
            
            if (e.target.closest('.remove-item')) {
                const id = e.target.closest('.remove-item').getAttribute('data-id');
                CartManager.removeFromCart(id);
            }
        });
        
        // Checkout and clear cart
        const checkoutBtn = document.getElementById('checkout-btn');
        const clearCartBtn = document.getElementById('clear-cart-btn');
        
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                CartManager.closeCartSidebar();
                ToppingManager.openModal();
            });
        }
        
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => {
                if (cart.length === 0) {
                    alert('Keranjang belanja sudah kosong!');
                    return;
                }
                
                if (confirm('Apakah Anda yakin ingin menghapus semua item dari keranjang?')) {
                    CartManager.clearCart();
                    alert('Keranjang belanja berhasil dikosongkan!');
                }
            });
        }
    },
    
    initToppingEvents() {
        // Open/close topping modal
        const closeToppings = document.getElementById('close-toppings');
        const cancelToppings = document.getElementById('cancel-toppings');
        const confirmToppings = document.getElementById('confirm-toppings');
        
        if (closeToppings) closeToppings.addEventListener('click', () => ToppingManager.closeModal());
        if (cancelToppings) cancelToppings.addEventListener('click', () => ToppingManager.closeModal());
        if (confirmToppings) confirmToppings.addEventListener('click', () => ToppingManager.confirmOrder());
        
        // Topping selection
        document.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox' && e.target.name) {
                ToppingManager.handleToppingChange(e.target);
            }
        });
    },
    
    initReviewEvents() {
        // Open/close review modal
        const closeReviews = document.getElementById('close-reviews');
        const submitReview = document.getElementById('submit-review');
        
        if (closeReviews) closeReviews.addEventListener('click', () => ReviewManager.closeModal());
        if (submitReview) submitReview.addEventListener('click', () => ReviewManager.submitReview());
        
        // Star rating
        document.addEventListener('click', (e) => {
            if (e.target.closest('.star-rating i')) {
                const star = e.target.closest('.star-rating i');
                const rating = parseInt(star.getAttribute('data-rating'));
                ReviewManager.handleStarClick(rating);
            }
            
            if (e.target.closest('.reviews-btn')) {
                const button = e.target.closest('.reviews-btn');
                const productId = button.getAttribute('data-id');
                ReviewManager.openModal(productId);
            }
            
            if (e.target.closest('.delete-review')) {
                const button = e.target.closest('.delete-review');
                const reviewId = button.getAttribute('data-id');
                const productId = button.getAttribute('data-product');
                ReviewManager.deleteReview(productId, reviewId);
            }
        });
    },
    
    initSearchEvents() {
        const searchInput = document.querySelector('.search-input');
        const mobileSearchInput = document.querySelector('.mobile-search-input');
        
        const handleSearch = (searchTerm) => {
            ProductManager.searchProducts(searchTerm);
            // Reset filter buttons
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
        };
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => handleSearch(e.target.value));
        }
        
        if (mobileSearchInput) {
            mobileSearchInput.addEventListener('input', (e) => handleSearch(e.target.value));
        }
    },
    
    initFilterEvents() {
        document.querySelectorAll('.filter-btn').forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                ProductManager.filterProducts(filter);
            });
        });
    },
    
    initViewMoreEvents() {
        const viewMoreBtn = document.getElementById('view-more-btn');
        
        if (viewMoreBtn) {
            viewMoreBtn.addEventListener('click', () => {
                if (showingAllProducts) {
                    ProductManager.renderProducts(3);
                    viewMoreBtn.innerHTML = '<i class="fas fa-eye"></i> Lihat Produk Lainnya';
                    showingAllProducts = false;
                    
                    // Scroll to products section
                    const productsSection = document.getElementById('produk');
                    if (productsSection) {
                        const offsetTop = productsSection.offsetTop - 80;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                } else {
                    ProductManager.renderProducts();
                    viewMoreBtn.innerHTML = '<i class="fas fa-eye-slash"></i> Lihat Lebih Sedikit';
                    showingAllProducts = true;
                }
            });
        }
    },
    
    initSocialEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.like-btn')) {
                const button = e.target.closest('.like-btn');
                const icon = button.querySelector('i');
                const text = button.querySelector('span');
                
                if (icon.classList.contains('far')) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    button.classList.add('liked');
                    text.textContent = 'Disukai';
                    Utils.showNotification('social-notification', 'Produk berhasil ditambahkan ke favorit!');
                } else {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    button.classList.remove('liked');
                    text.textContent = 'Suka';
                    Utils.showNotification('social-notification', 'Produk dihapus dari favorit!');
                }
            }
            
            if (e.target.closest('.share-btn')) {
                const button = e.target.closest('.share-btn');
                const productId = button.getAttribute('data-id');
                const product = products.find(p => p.id == productId);
                
                if (product && navigator.share) {
                    navigator.share({
                        title: product.name,
                        text: product.description,
                        url: window.location.href + '#produk'
                    }).then(() => {
                        Utils.showNotification('social-notification', 'Produk berhasil dibagikan!');
                    }).catch(err => {
                        console.log('Error sharing:', err);
                    });
                } else {
                    const url = window.location.href + '#produk';
                    const text = `Lihat ${product.name} di Mix & Crunch: ${product.description}`;
                    
                    navigator.clipboard.writeText(text + ' ' + url).then(() => {
                        Utils.showNotification('social-notification', 'Tautan produk berhasil disalin!');
                    }).catch(err => {
                        console.log('Error copying:', err);
                    });
                }
            }
        });
    },
    
    initWhatsAppEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.whatsapp-order-btn')) {
                const button = e.target.closest('.whatsapp-order-btn');
                const productId = button.getAttribute('data-id');
                const product = products.find(p => p.id == productId);
                
                if (product) {
                    const message = `Halo! Saya tertarik untuk memesan ${product.name}. Bisa tolong informasikan ketersediaan dan cara pemesanannya? Terima kasih!`;
                    const encodedMessage = encodeURIComponent(message);
                    const whatsappURL = `https://wa.me/6285692816835?text=${encodedMessage}`;
                    
                    window.open(whatsappURL, '_blank');
                }
            }
        });
    }
};

// Main App Initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all managers
    NavigationManager.initNavbar();
    NavigationManager.initSmoothScroll();
    NavigationManager.initBackToTop();
    SliderManager.init();
    FAQManager.init();
    PromoManager.init();
    EventHandlers.init();
    
    // Initialize cart
    CartManager.updateCart();
    
    // Render initial products (show only 3)
    ProductManager.renderProducts(3);
    
    // Initialize scroll animations
    const animatedElements = document.querySelectorAll('.product-card, .testimonial-card, .section-header, .about-content, .feature-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('bounce-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
});

// Global functions for external access
window.MixCrunchApp = {
    CartManager,
    ProductManager,
    ToppingManager,
    ReviewManager,
    Utils,
    StorageManager
};
