// Enhanced Backend System
class MixCrunchBackend {
    constructor() {
        this.baseURL = 'https://api.mixncrunch.id/v1';
        this.localStorageKey = 'mixncrunch_';
        this.initializeBackend();
    }

    initializeBackend() {
        // Initialize API endpoints simulation
        this.endpoints = {
            products: `${this.baseURL}/products`,
            reviews: `${this.baseURL}/reviews`,
            orders: `${this.baseURL}/orders`,
            analytics: `${this.baseURL}/analytics`
        };
        
        // Initialize real-time features
        this.initializeRealTimeFeatures();
    }

    // Real-time features initialization
    initializeRealTimeFeatures() {
        // Simulate real-time updates
        setInterval(() => {
            this.updateLiveStats();
        }, 30000); // Update every 30 seconds
    }

    // Product Management
    async getProducts() {
        try {
            // Simulate API call
            const response = await this.simulateAPICall('GET', this.endpoints.products);
            return response.data || this.getDefaultProducts();
        } catch (error) {
            console.warn('API offline, using local data:', error);
            return this.getDefaultProducts();
        }
    }

    async addProductReview(productId, reviewData) {
        try {
            const response = await this.simulateAPICall('POST', 
                `${this.endpoints.reviews}/${productId}`, 
                reviewData
            );
            
            // Update local storage
            this.updateLocalReviews(productId, reviewData);
            
            // Send to analytics
            this.trackReviewAnalytics(productId, reviewData.rating);
            
            return response;
        } catch (error) {
            console.warn('Review submission failed, saving locally:', error);
            this.updateLocalReviews(productId, reviewData);
            return { success: true, message: 'Review saved locally' };
        }
    }

    // Order Management
    async createOrder(orderData) {
        try {
            const response = await this.simulateAPICall('POST', this.endpoints.orders, orderData);
            
            // Track order analytics
            this.trackOrderAnalytics(orderData);
            
            return response;
        } catch (error) {
            console.warn('Order creation failed, saving locally:', error);
            this.saveOrderLocally(orderData);
            return { 
                success: true, 
                message: 'Order saved locally',
                orderId: this.generateOrderId() 
            };
        }
    }

    // Analytics Tracking
    trackProductView(productId) {
        const analyticsData = {
            type: 'product_view',
            productId: productId,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        };
        
        this.sendAnalytics(analyticsData);
    }

    trackAddToCart(productId, quantity) {
        const analyticsData = {
            type: 'add_to_cart',
            productId: productId,
            quantity: quantity,
            timestamp: new Date().toISOString()
        };
        
        this.sendAnalytics(analyticsData);
    }

    // Local Storage Management with Enhanced Features
    set(key, value) {
        try {
            const data = {
                value: value,
                timestamp: new Date().toISOString(),
                version: '1.0'
            };
            localStorage.setItem(this.localStorageKey + key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('LocalStorage set error:', error);
            return false;
        }
    }

    get(key) {
        try {
            const item = localStorage.getItem(this.localStorageKey + key);
            if (!item) return null;
            
            const data = JSON.parse(item);
            
            // Check if data is expired (24 hours for demo)
            const expiryTime = 24 * 60 * 60 * 1000; // 24 hours
            const storedTime = new Date(data.timestamp).getTime();
            if (Date.now() - storedTime > expiryTime) {
                this.remove(key);
                return null;
            }
            
            return data.value;
        } catch (error) {
            console.error('LocalStorage get error:', error);
            return null;
        }
    }

    remove(key) {
        try {
            localStorage.removeItem(this.localStorageKey + key);
            return true;
        } catch (error) {
            console.error('LocalStorage remove error:', error);
            return false;
        }
    }

    // Utility Methods
    simulateAPICall(method, url, data = null) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 90% success rate
                if (Math.random() > 0.1) {
                    resolve({
                        success: true,
                        data: data,
                        message: `${method} request to ${url} successful`
                    });
                } else {
                    reject(new Error('API simulation error'));
                }
            }, 500 + Math.random() * 1000); // Random delay between 500-1500ms
        });
    }

    updateLocalReviews(productId, reviewData) {
        const reviews = this.get('productReviews') || {};
        if (!reviews[productId]) {
            reviews[productId] = [];
        }
        
        reviews[productId].push({
            ...reviewData,
            id: this.generateId(),
            date: new Date().toLocaleDateString('id-ID'),
            verified: false // Local reviews are not verified
        });
        
        this.set('productReviews', reviews);
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    generateOrderId() {
        return 'ORD_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    getDefaultProducts() {
        return [
            {
                id: 1,
                name: "Ciki citato lite",
                category: "gurih",
                price: 12000,
                oldPrice: 14000,
                rating: 4.5,
                reviews: 128,
                description: "Ciki Citato Lite rasa original dengan kerenyahan khas yang bikin nagih. Cocok untuk menemani waktu santai, nonton, atau nongkrong bareng teman.",
                image: "ciki 1.jpg",
                badge: "new",
                variants: [
                    { name: "Pedas Biasa", price: 12000 },
                    { name: "Pedas Extra", price: 15000 },
                    { name: "Pedas Level 10", price: 18000 }
                ]
            },
            {
                id: 2,
                name: "Ciki citato mie goreng",
                category: "gurih",
                price: 12000,
                oldPrice: 15000,
                rating: 4.8,
                reviews: 95,
                description: "Ciki Citato Lite rasa Mie Goreng — kombinasi gurih, asin, dan sedikit manis yang mirip mie goreng legendaris. Kerenyahan maksimal dengan aroma khas yang bikin lapar terus.",
                image: "ciki 2.png",
                badge: "new",
                variants: [
                    { name: "Keju Original", price: 13000 },
                    { name: "Keju Extra", price: 16000 },
                    { name: "Keju Premium", price: 19000 }
                ]
            },
            {
                id: 3,
                name: "Ciki lays rumput laut",
                category: "gurih",
                price: 12000,
                oldPrice: 13000,
                rating: 4.3,
                reviews: 76,
                description: "Lays Rumput Laut menghadirkan kerenyahan kentang pilihan dengan balutan bumbu rumput laut yang gurih dan aromatik. Setiap gigitan memberikan rasa laut yang khas dan bikin nagih.",
                image: "ciki 3.jpg",
                variants: [
                    { name: "Jagung Bakar Original", price: 11000 },
                    { name: "Jagung Bakar Pedas", price: 13000 }
                ]
            },
            {
                id: 4,
                name: "Ciki doritos",
                category: "pedas",
                price: 12000,
                oldPrice: 14000,
                rating: 4.6,
                reviews: 112,
                description: "Doritos Jagung Bakar menghadirkan sensasi renyah khas tortilla chips berpadu dengan rasa jagung bakar yang gurih, manis, dan sedikit smoky. Camilan favorit yang bikin susah berhenti ngemil.",
                image: "ciki 4.jpg",
                badge: "hot",
                variants: [
                    { name: "Balado Original", price: 12500 },
                    { name: "Balado Extra Pedas", price: 15000 }
                ]
            },
            {
                id: 5,
                name: "Ciki japota rumput laut ",
                category: "gurih",
                price: 12000,
                oldPrice: 15000,
                rating: 4.4,
                reviews: 88,
                description: "japota Rumput Laut hadir dengan potongan kentang super renyah dan bumbu rumput laut asli yang gurih serta aromatik. Setiap gigitan bikin kamu serasa ngemil di pinggir pantai Jepang.",
                image: "ciki 5.jpg",
                variants: [
                    { name: "BBQ Original", price: 14000 },
                    { name: "BBQ Spicy", price: 16000 }
                ]
            },
            {
                id: 6,
                name: "Ciki japota ayam bawang",
                category: "gurih",
                price: 12000,
                oldPrice: 13000,
                rating: 4.7,
                reviews: 134,
                description: "Japota Ayam Bawang menghadirkan kelezatan rasa ayam gurih berpadu aroma bawang yang harum menggoda. Renyahnya kentang Japota membuat rasa klasik ini terasa makin istimewa di setiap gigitan.",
                image: "ciki 6.jpg",
                badge: "new",
                variants: [
                    { name: "Rumput Laut Original", price: 15000 },
                    { name: "Rumput Laut Pedas", price: 17000 }
                ]
            },
            {
                id: 7,
                name: "Ciki japota Sapi Panggang",
                category: "spesial",
                price: 12000,
                oldPrice: 16000,
                rating: 4.9,
                reviews: 67,
                description: "Japota Sapi Panggang menawarkan rasa daging sapi panggang premium dengan aroma smoky yang khas. Kentangnya tebal, gurih, dan renyah — bikin setiap gigitan terasa seperti makan steak mini.",
                image: "ciki 10.jpg",
                badge: "new",
                variants: [
                    { name: "Sapi Panggang Original", price: 18000 },
                    { name: "Sapi Panggang Black Pepper", price: 20000 }
                ]
            },
            {
                id: 8,
                name: "Ciki twist jagung bakar",
                category: "spesial",
                price: 12000,
                oldPrice: 12500,
                rating: 4.5,
                reviews: 91,
                description: "Ciki Twist Jagung Bakar menghadirkan sensasi gurih dan manis dari jagung bakar khas Indonesia. Teksturnya ringan, renyah, dan bikin susah berhenti ngemil. Cocok untuk semua suasana.",
                image: "ciki 11.jpg",
                variants: [
                    { name: "Ayam Bakar Original", price: 16000 },
                    { name: "Ayam Bakar Madu", price: 18000 }
                ]
            }
        ];
    }

    // Analytics methods
    sendAnalytics(data) {
        // In a real app, this would send to your analytics service
        console.log('Analytics Event:', data);
        
        // Store locally for batch processing
        const analyticsQueue = this.get('analyticsQueue') || [];
        analyticsQueue.push(data);
        this.set('analyticsQueue', analyticsQueue.slice(-100)); // Keep last 100 events
    }

    trackReviewAnalytics(productId, rating) {
        this.sendAnalytics({
            type: 'review_submitted',
            productId: productId,
            rating: rating,
            timestamp: new Date().toISOString()
        });
    }

    trackOrderAnalytics(orderData) {
        this.sendAnalytics({
            type: 'order_created',
            orderId: orderData.orderId,
            total: orderData.total,
            itemCount: orderData.items.length,
            timestamp: new Date().toISOString()
        });
    }

    updateLiveStats() {
        // Update live visitor count, sales stats, etc.
        const stats = {
            liveVisitors: Math.floor(Math.random() * 50) + 10,
            todayOrders: Math.floor(Math.random() * 20) + 5,
            totalRevenue: Math.floor(Math.random() * 5000000) + 1000000
        };
        
        // Could update a live stats display if needed
        console.log('Live Stats Updated:', stats);
    }

    saveOrderLocally(orderData) {
        const localOrders = this.get('pendingOrders') || [];
        localOrders.push({
            ...orderData,
            localId: this.generateId(),
            status: 'pending',
            createdAt: new Date().toISOString()
        });
        this.set('pendingOrders', localOrders);
    }
}

// Initialize Backend
const backend = new MixCrunchBackend();

// Enhanced Frontend Application
class MixCrunchApp {
    constructor() {
        this.backend = backend;
        this.products = [];
        this.cart = [];
        this.reviews = {};
        this.selectedToppings = [];
        this.currentProductId = null;
        this.currentRating = 0;
        this.editingReviewId = null;
        
        this.initializeApp();
    }

    async initializeApp() {
        try {
            // Load initial data
            await this.loadInitialData();
            
            // Initialize all components
            this.initializeComponents();
            
            // Start background services
            this.startBackgroundServices();
            
            console.log('Mix & Crunch App initialized successfully');
        } catch (error) {
            console.error('App initialization failed:', error);
            this.initializeFallback();
        }
    }

    async loadInitialData() {
        // Load products from backend
        this.products = await this.backend.getProducts();
        
        // Load cart from localStorage
        this.cart = this.backend.get('cart') || [];
        
        // Load reviews from backend/localStorage
        this.reviews = this.backend.get('productReviews') || {};
        
        // Track app load
        this.backend.trackAppLoad();
    }

    initializeComponents() {
        this.initializeNavbar();
        this.initializeSlider();
        this.initializeCart();
        this.initializeProductFilters();
        this.initializeToppingsModal();
        this.initializeFAQ();
        this.initializeBackToTop();
        this.initializePromoTimer();
        this.initializeSmoothScroll();
        this.initializeWhatsAppOrders();
        this.initializeScrollAnimations();
        this.initializeViewMore();
        this.initializeProductSocialActions();
        this.initializeReviewsModal();
        this.initializePerformanceOptimizations();
        
        // Render initial products
        this.renderProducts(3);
    }

    // Enhanced Toppings Modal with Slide-in Animation
    initializeToppingsModal() {
        const toppingsModal = document.getElementById('toppings-modal');
        const closeToppings = document.querySelector('.close-toppings');
        const cancelToppings = document.getElementById('cancel-toppings');
        const confirmToppings = document.getElementById('confirm-toppings');

        // Open toppings modal with slide-in animation
        window.openToppingsModal = () => {
            if (toppingsModal) {
                toppingsModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Reset form
                document.getElementById('custom-toppings').value = '';
                document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                    checkbox.checked = false;
                });
                this.selectedToppings = [];
            }
        };

        // Enhanced close function
        const closeToppingsModal = () => {
            if (toppingsModal) {
                toppingsModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        };

        if (closeToppings) {
            closeToppings.addEventListener('click', closeToppingsModal);
        }

        if (cancelToppings) {
            cancelToppings.addEventListener('click', closeToppingsModal);
        }

        // Handle topping selection with enhanced UX
        document.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox' && e.target.name) {
                const toppingName = e.target.value;
                const toppingElement = e.target.closest('.topping-option');
                
                // Add selection animation
                if (e.target.checked) {
                    toppingElement.classList.add('selected');
                    this.selectedToppings.push({ name: toppingName });
                    
                    // Add subtle bounce effect
                    toppingElement.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        toppingElement.style.transform = 'scale(1)';
                    }, 150);
                } else {
                    toppingElement.classList.remove('selected');
                    this.selectedToppings = this.selectedToppings.filter(topping => topping.name !== toppingName);
                }
                
                // Update selection counter
                this.updateToppingSelectionCounter();
            }
        });

        // Enhanced confirm toppings with validation
        if (confirmToppings) {
            confirmToppings.addEventListener('click', () => {
                const customToppings = document.getElementById('custom-toppings').value.trim();
                
                if (this.selectedToppings.length === 0) {
                    this.showValidationError('Silakan pilih minimal satu topping sebelum melanjutkan!');
                    return;
                }
                
                // Add loading state
                confirmToppings.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
                confirmToppings.disabled = true;
                
                setTimeout(() => {
                    this.sendOrderToWhatsApp(this.selectedToppings, customToppings);
                    closeToppingsModal();
                    
                    // Reset button state
                    setTimeout(() => {
                        confirmToppings.innerHTML = '<i class="fab fa-whatsapp"></i> Pesan via WhatsApp';
                        confirmToppings.disabled = false;
                    }, 1000);
                }, 1000);
            });
        }
    }

    // Enhanced Reviews Modal with Edit/Delete Features
    initializeReviewsModal() {
        const reviewsModal = document.getElementById('reviews-modal');
        const closeReviews = document.querySelector('.close-reviews');

        // Enhanced close function
        const closeReviewsModal = () => {
            if (reviewsModal) {
                reviewsModal.classList.remove('active');
                document.body.style.overflow = '';
                this.editingReviewId = null;
            }
        };

        if (closeReviews) {
            closeReviews.addEventListener('click', closeReviewsModal);
        }

        // Enhanced star rating with click functionality
        document.addEventListener('click', (e) => {
            if (e.target.closest('.star-rating i')) {
                const star = e.target.closest('.star-rating i');
                const rating = parseInt(star.getAttribute('data-rating'));
                this.setStarRating(rating);
            }
        });

        // Enhanced star rating with hover effects
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.star-rating i')) {
                const star = e.target.closest('.star-rating i');
                const rating = parseInt(star.getAttribute('data-rating'));
                const stars = document.querySelectorAll('.star-rating i');
                
                stars.forEach((s, index) => {
                    if (index < rating) {
                        s.classList.add('hover');
                    } else {
                        s.classList.remove('hover');
                    }
                });
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('.star-rating')) {
                const stars = document.querySelectorAll('.star-rating i');
                stars.forEach(star => star.classList.remove('hover'));
                this.updateStarDisplay();
            }
        });

        // Enhanced review submission
        const submitReview = document.getElementById('submit-review');
        if (submitReview) {
            submitReview.addEventListener('click', async () => {
                const productId = this.currentProductId;
                const reviewerName = document.getElementById('reviewer-name').value.trim();
                const reviewComment = document.getElementById('review-comment').value.trim();
                const rating = this.currentRating;

                if (!reviewerName || !reviewComment || rating === 0) {
                    this.showValidationError('Silakan isi semua field dan berikan rating!');
                    return;
                }

                // Add loading state
                submitReview.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
                submitReview.disabled = true;

                const reviewData = {
                    name: reviewerName,
                    rating: rating,
                    comment: reviewComment,
                    date: new Date().toLocaleDateString('id-ID')
                };

                try {
                    if (this.editingReviewId) {
                        // Edit existing review
                        await this.editProductReview(productId, this.editingReviewId, reviewData);
                    } else {
                        // Add new review
                        await this.backend.addProductReview(productId, reviewData);
                    }
                    
                    // Update UI
                    this.displayProductReviews(productId);
                    this.updateProductRating(productId);
                    
                    // Reset form
                    document.getElementById('reviewer-name').value = '';
                    document.getElementById('review-comment').value = '';
                    this.setStarRating(0);
                    this.editingReviewId = null;
                    
                    // Show success
                    this.showSocialNotification(this.editingReviewId ? 'Ulasan berhasil diperbarui!' : 'Ulasan berhasil ditambahkan!');
                    
                } catch (error) {
                    this.showSocialNotification('Ulasan berhasil disimpan secara lokal!');
                } finally {
                    // Reset button state
                    submitReview.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim Ulasan';
                    submitReview.disabled = false;
                }
            });
        }
    }

    // Enhanced Star Rating System
    setStarRating(rating) {
        this.currentRating = rating;
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
        
        this.updateRatingText();
    }

    updateStarDisplay() {
        const stars = document.querySelectorAll('.star-rating i');
        stars.forEach((star, index) => {
            if (index < this.currentRating) {
                star.classList.add('active');
                star.classList.remove('far');
                star.classList.add('fas');
            }
        });
    }

    updateRatingText() {
        const ratingText = document.getElementById('selected-rating-text');
        if (ratingText) {
            if (this.currentRating === 0) {
                ratingText.textContent = 'Pilih rating 1-5 bintang';
            } else {
                ratingText.textContent = `Anda memilih ${this.currentRating} bintang`;
            }
        }
    }

    // Enhanced Cart System with Real-time Updates
    initializeCart() {
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartOverlay = document.getElementById('cart-overlay');
        const closeCart = document.querySelector('.close-cart');
        const checkoutBtn = document.getElementById('checkout-btn');
        const clearCartBtn = document.getElementById('clear-cart-btn');
        const continueShopping = document.querySelector('.continue-shopping');

        // Enhanced open cart function
        window.openCartSidebar = () => {
            if (cartSidebar && cartOverlay) {
                cartSidebar.classList.add('active');
                cartOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Update cart display
                this.updateCartDisplay();
            }
        };

        // Enhanced close function
        const closeCartSidebar = () => {
            if (cartSidebar && cartOverlay) {
                cartSidebar.classList.remove('active');
                cartOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        };

        if (closeCart) {
            closeCart.addEventListener('click', closeCartSidebar);
        }

        if (cartOverlay) {
            cartOverlay.addEventListener('click', closeCartSidebar);
        }

        if (continueShopping) {
            continueShopping.addEventListener('click', closeCartSidebar);
        }

        // Enhanced checkout with validation
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (this.cart.length === 0) {
                    this.showValidationError('Keranjang belanja kosong. Silakan tambahkan produk terlebih dahulu.');
                    return;
                }

                closeCartSidebar();
                
                // Add slight delay for smooth transition
                setTimeout(() => {
                    window.openToppingsModal();
                }, 300);
            });
        }

        // Enhanced clear cart with confirmation
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => {
                if (this.cart.length === 0) {
                    this.showValidationError('Keranjang belanja sudah kosong!');
                    return;
                }

                this.showConfirmationDialog(
                    'Hapus Semua Item',
                    'Apakah Anda yakin ingin menghapus semua item dari keranjang?',
                    () => {
                        this.cart = [];
                        this.updateCart();
                        this.backend.set('cart', this.cart);
                        this.showSocialNotification('Keranjang belanja berhasil dikosongkan!');
                    }
                );
            });
        }

        // Enhanced add to cart functionality
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-cart') || e.target.closest('.add-to-cart-btn')) {
                const button = e.target.closest('.add-to-cart') || e.target.closest('.add-to-cart-btn');
                const productId = button.getAttribute('data-id');
                const productName = button.getAttribute('data-product');
                const productPrice = parseInt(button.getAttribute('data-price'));

                this.addToCart(productId, productName, productPrice);
                
                // Track analytics
                this.backend.trackAddToCart(productId, 1);
            }
        });

        // Initialize cart display
        this.updateCart();
    }

    // Enhanced Product Display with Lazy Loading
    renderProducts(limit = null) {
        const productContainer = document.getElementById('product-container');
        if (!productContainer) return;

        productContainer.innerHTML = '';

        const productsToShow = limit ? this.products.slice(0, limit) : this.products;

        productsToShow.forEach((product, index) => {
            const productCard = this.createProductCard(product, index);
            productContainer.appendChild(productCard);
        });

        // Initialize lazy loading for images
        this.initializeLazyLoading();
    }

    createProductCard(product, index) {
        const card = document.createElement('div');
        card.className = `product-card ${product.comingSoon ? 'coming-soon' : ''}`;
        card.setAttribute('data-category', product.category);
        card.style.animationDelay = `${index * 0.1}s`;

        const badgeHTML = product.badge ? 
            `<div class="product-badge ${product.badge}">${product.badge === 'hot' ? 'HOT' : 'BARU'}</div>` : '';

        const productReviews = this.reviews[product.id] || [];
        const averageRating = productReviews.length > 0 
            ? productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length
            : product.rating;

        const starsHTML = this.generateStars(averageRating);
        const reviewCount = productReviews.length || product.reviews;

        card.innerHTML = `
            <div class="product-image">
                <div class="image-container ${this.getRandomColor()}">
                    <img alt="${product.name}" src="${product.image}" loading="lazy" 
                         onerror="this.src='Coming Soon.jpeg'"/>
                </div>
                ${badgeHTML}
                <div class="product-overlay">
                    <button class="quick-add-btn add-to-cart" 
                            data-id="${product.id}" 
                            data-price="${product.price}" 
                            data-product="${product.name}">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-rating">
                    <div class="stars">
                        ${starsHTML}
                    </div>
                    <span class="review-count">(${reviewCount} ulasan)</span>
                </div>
                <p>${product.description}</p>
                <div class="product-footer">
                    <div class="price">
                        <span class="current-price">Rp ${product.price.toLocaleString('id-ID')}</span>
                        <span class="old-price">Rp ${product.oldPrice.toLocaleString('id-ID')}</span>
                    </div>
                    <div class="product-actions">
                        <button class="add-to-cart-btn" 
                                data-id="${product.id}" 
                                data-price="${product.price}" 
                                data-product="${product.name}">
                            <i class="fas fa-shopping-cart"></i>
                            Keranjang
                        </button>
                        <button class="whatsapp-order-btn" 
                                data-id="${product.id}" 
                                data-price="${product.price}" 
                                data-product="${product.name}">
                            <i class="fab fa-whatsapp"></i>
                            Pesan
                        </button>
                    </div>
                </div>
                <div class="product-social-actions">
                    <button class="social-action-btn reviews-btn" data-id="${product.id}">
                        <i class="fas fa-star"></i>
                        <span>Ulasan</span>
                    </button>
                    <button class="social-action-btn like-btn" data-id="${product.id}">
                        <i class="far fa-heart"></i>
                        <span>Suka</span>
                    </button>
                    <button class="social-action-btn share-btn" data-id="${product.id}">
                        <i class="fas fa-share-alt"></i>
                        <span>Bagikan</span>
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    // Enhanced Utility Methods
    addToCart(productId, productName, productPrice) {
        const existingItem = this.cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                quantity: 1
            });
        }

        this.updateCart();
        this.backend.set('cart', this.cart);
        this.showCartNotification();
        this.animateCartIcon();
    }

    updateCart() {
        // Update cart count
        const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(element => {
            element.textContent = totalItems;
        });

        // Update checkout button state
        const checkoutBtn = document.getElementById('checkout-btn');
        const clearCartBtn = document.getElementById('clear-cart-btn');
        
        if (checkoutBtn) checkoutBtn.disabled = this.cart.length === 0;
        if (clearCartBtn) clearCartBtn.disabled = this.cart.length === 0;

        // Update cart items display
        this.updateCartDisplay();
    }

    updateCartDisplay() {
        const cartItems = document.getElementById('cart-items');
        if (!cartItems) return;

        cartItems.innerHTML = '';

        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Keranjang belanja kosong</p>
                    <small>Tambahkan produk untuk mulai berbelanja</small>
                </div>
            `;
        } else {
            this.cart.forEach((item, index) => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.style.animationDelay = `${index * 0.1}s`;
                
                cartItem.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>Rp ${item.price.toLocaleString('id-ID')}</p>
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
                `;
                cartItems.appendChild(cartItem);
            });

            // Add event listeners
            this.attachCartEventListeners();
            
            // Update summary
            this.updateCartSummary();
        }
    }

    attachCartEventListeners() {
        document.querySelectorAll('.increase').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.closest('.increase').getAttribute('data-id');
                const item = this.cart.find(item => item.id === id);
                if (item) {
                    item.quantity += 1;
                    this.updateCart();
                    this.backend.set('cart', this.cart);
                }
            });
        });

        document.querySelectorAll('.decrease').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.closest('.decrease').getAttribute('data-id');
                const item = this.cart.find(item => item.id === id);
                if (item && item.quantity > 1) {
                    item.quantity -= 1;
                    this.updateCart();
                    this.backend.set('cart', this.cart);
                }
            });
        });

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.closest('.remove-item').getAttribute('data-id');
                this.cart = this.cart.filter(item => item.id !== id);
                this.updateCart();
                this.backend.set('cart', this.cart);
            });
        });
    }

    updateCartSummary() {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const total = subtotal;

        const cartSubtotal = document.getElementById('cart-subtotal');
        const cartTotal = document.getElementById('cart-total');

        if (cartSubtotal) cartSubtotal.textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
        if (cartTotal) cartTotal.textContent = `Rp ${total.toLocaleString('id-ID')}`;
    }

    // Enhanced WhatsApp Order System
    sendOrderToWhatsApp(selectedToppings, customToppings) {
        const productSubtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const total = productSubtotal;

        let message = `Halo! Saya tertarik untuk memesan produk berikut:\n\n`;
        
        message += `*Detail Pesanan:*\n`;
        this.cart.forEach((item, index) => {
            message += `${index + 1}. ${item.name}\n`;
            message += `   Jumlah: ${item.quantity}\n`;
            message += `   Harga: Rp ${item.price.toLocaleString('id-ID')}\n`;
            message += `   Subtotal: Rp ${(item.price * item.quantity).toLocaleString('id-ID')}\n\n`;
        });

        if (selectedToppings.length > 0) {
            message += `*Topping:*\n`;
            selectedToppings.forEach((topping, index) => {
                message += `${index + 1}. ${topping.name}\n`;
            });
            message += `\n`;
        }

        if (customToppings) {
            message += `*Catatan Khusus:*\n${customToppings}\n\n`;
        }

        message += `*Ringkasan Pembayaran:*\n`;
        message += `Subtotal Produk: Rp ${productSubtotal.toLocaleString('id-ID')}\n`;
        message += `*Total: Rp ${total.toLocaleString('id-ID')}*\n\n`;
        message += `Bisa tolong informasikan ketersediaan dan cara pemesanannya? Terima kasih!`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/6285692816835?text=${encodedMessage}`;

        // Create order data for analytics
        const orderData = {
            orderId: this.backend.generateOrderId(),
            items: this.cart,
            toppings: selectedToppings,
            notes: customToppings,
            total: total,
            timestamp: new Date().toISOString()
        };

        // Send to backend
        this.backend.createOrder(orderData);

        // Open WhatsApp
        window.open(whatsappURL, '_blank');

        // Clear cart after successful order
        this.cart = [];
        this.updateCart();
        this.backend.set('cart', this.cart);

        // Show success message with delay
        setTimeout(() => {
            this.showSuccessDialog(
                'Pesanan Berhasil!',
                'Pesanan berhasil dikirim ke WhatsApp! Terima kasih telah berbelanja di Mix & Crunch.'
            );
        }, 1500);
    }

    // Enhanced UI Components
    showValidationError(message) {
        const notification = document.createElement('div');
        notification.className = 'validation-notification';
        notification.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 4000);
    }

    showConfirmationDialog(title, message, onConfirm) {
        const dialog = document.createElement('div');
        dialog.className = 'confirmation-dialog';
        dialog.innerHTML = `
            <div class="dialog-content">
                <h3>${title}</h3>
                <p>${message}</p>
                <div class="dialog-actions">
                    <button class="btn-secondary cancel-btn">Batal</button>
                    <button class="btn-primary confirm-btn">Ya, Lanjutkan</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        setTimeout(() => {
            dialog.classList.add('show');
        }, 100);
        
        // Add event listeners
        dialog.querySelector('.cancel-btn').addEventListener('click', () => {
            dialog.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(dialog);
            }, 300);
        });
        
        dialog.querySelector('.confirm-btn').addEventListener('click', () => {
            dialog.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(dialog);
                onConfirm();
            }, 300);
        });
    }

    showSuccessDialog(title, message) {
        const dialog = document.createElement('div');
        dialog.className = 'success-dialog';
        dialog.innerHTML = `
            <div class="dialog-content">
                <i class="fas fa-check-circle"></i>
                <h3>${title}</h3>
                <p>${message}</p>
                <button class="btn-primary ok-btn">Oke</button>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        setTimeout(() => {
            dialog.classList.add('show');
        }, 100);
        
        dialog.querySelector('.ok-btn').addEventListener('click', () => {
            dialog.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(dialog);
            }, 300);
        });
    }

    // Animation Methods
    animateCartIcon() {
        const cartIcons = document.querySelectorAll('.cart-icon');
        cartIcons.forEach(icon => {
            icon.classList.add('animate');
            setTimeout(() => {
                icon.classList.remove('animate');
            }, 600);
        });
    }

    showCartNotification() {
        const notification = document.getElementById('cart-notification');
        if (notification) {
            notification.style.display = 'flex';
            setTimeout(() => {
                notification.style.display = 'none';
            }, 3000);
        }
    }

    showSocialNotification(message) {
        const notification = document.getElementById('social-notification');
        const notificationText = document.getElementById('social-notification-text');
        
        if (notification && notificationText) {
            notificationText.textContent = message;
            notification.style.display = 'flex';
            
            setTimeout(() => {
                notification.style.display = 'none';
            }, 3000);
        }
    }

    // Utility Methods
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
    }

    getRandomColor() {
        const colors = ['red', 'yellow', 'green', 'blue', 'purple', 'orange'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    updateToppingSelectionCounter() {
        const counter = document.querySelector('.topping-selection-counter');
        if (!counter) {
            const header = document.querySelector('.toppings-header h3');
            if (header) {
                const newCounter = document.createElement('span');
                newCounter.className = 'topping-selection-counter';
                header.appendChild(newCounter);
            }
        }
        
        const counterElement = document.querySelector('.topping-selection-counter');
        if (counterElement) {
            counterElement.textContent = ` (${this.selectedToppings.length} dipilih)`;
        }
    }

    // Initialize other components
    initializeNavbar() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        const navOverlay = document.createElement('div');
        navOverlay.className = 'nav-menu-overlay';
        document.body.appendChild(navOverlay);
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                hamburger.classList.toggle('active');
                navOverlay.classList.toggle('active');
            });
        }

        // Close menu when clicking on overlay
        navOverlay.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            navOverlay.classList.remove('active');
        });

        // Cart icon functionality
        document.querySelectorAll('.cart-icon').forEach(icon => {
            icon.addEventListener('click', () => {
                window.openCartSidebar();
            });
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                    navOverlay.classList.remove('active');
                }
            });
        });
    }

    // Enhanced Slider with Color Changes
    initializeSlider() {
        const slider = document.getElementById('slider');
        if (!slider) return;

        let currentSlide = 0;
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.slider-dot');
        const heroBg = document.querySelector('.hero-bg');

        // Define colors for each slide
        const slideColors = [
            'linear-gradient(135deg, #f97316 0%, #fb923c 100%)', // Orange
            'linear-gradient(135deg, #fbbf24 0%, #fcd34d 100%)', // Yellow
            'linear-gradient(135deg, #ef4444 0%, #f87171 100%)'  // Red
        ];

        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            currentSlide = index;
            
            // Change background color
            if (heroBg) {
                heroBg.style.background = slideColors[index];
            }
        }

        // Auto slide
        setInterval(() => {
            let next = currentSlide + 1;
            if (next >= slides.length) next = 0;
            showSlide(next);
        }, 5000);

        // Navigation
        document.getElementById('next-slide')?.addEventListener('click', () => {
            let next = currentSlide + 1;
            if (next >= slides.length) next = 0;
            showSlide(next);
        });

        document.getElementById('prev-slide')?.addEventListener('click', () => {
            let prev = currentSlide - 1;
            if (prev < 0) prev = slides.length - 1;
            showSlide(prev);
        });

        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => showSlide(index));
        });

        // Initialize first slide
        showSlide(0);
    }

    // Other initialization methods
    initializeProductFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                
                const filter = e.target.getAttribute('data-filter');
                const products = document.querySelectorAll('.product-card');
                
                products.forEach(product => {
                    if (filter === 'all' || product.getAttribute('data-category') === filter) {
                        product.style.display = 'block';
                    } else {
                        product.style.display = 'none';
                    }
                });
            });
        });
    }

    initializeFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            item.querySelector('.faq-question').addEventListener('click', () => {
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) otherItem.classList.remove('active');
                });
                item.classList.toggle('active');
            });
        });
    }

    initializeBackToTop() {
        const backToTop = document.getElementById('back-to-top');
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop?.classList.add('visible');
            } else {
                backToTop?.classList.remove('visible');
            }
        });
        
        backToTop?.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    initializePromoTimer() {
        function updateTimer() {
            const promoEndDate = new Date();
            promoEndDate.setDate(promoEndDate.getDate() + 7);
            
            const now = new Date();
            const timeLeft = promoEndDate - now;
            
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            document.getElementById('promo-days').textContent = days.toString().padStart(2, '0');
            document.getElementById('promo-hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('promo-minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('promo-seconds').textContent = seconds.toString().padStart(2, '0');
        }
        
        setInterval(updateTimer, 1000);
        updateTimer();
    }

    initializeSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    initializeWhatsAppOrders() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.whatsapp-order-btn')) {
                const button = e.target.closest('.whatsapp-order-btn');
                const productName = button.getAttribute('data-product');
                
                const message = `Halo! Saya tertarik untuk memesan ${productName}. Bisa tolong informasikan ketersediaan dan cara pemesanannya? Terima kasih!`;
                const encodedMessage = encodeURIComponent(message);
                const whatsappURL = `https://wa.me/6285692816835?text=${encodedMessage}`;
                
                window.open(whatsappURL, '_blank');
            }
        });
    }

    initializeScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('bounce-in');
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.product-card, .testimonial-card, .section-header').forEach(el => {
            observer.observe(el);
        });
    }

    initializeViewMore() {
        const viewMoreBtn = document.getElementById('view-more-btn');
        let showingAll = false;
        
        viewMoreBtn?.addEventListener('click', () => {
            if (showingAll) {
                this.renderProducts(3);
                viewMoreBtn.innerHTML = '<i class="fas fa-eye"></i> Lihat Produk Lainnya';
                showingAll = false;
            } else {
                this.renderProducts();
                viewMoreBtn.innerHTML = '<i class="fas fa-eye-slash"></i> Lihat Lebih Sedikit';
                showingAll = true;
            }
        });
    }

    initializeProductSocialActions() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.like-btn')) {
                const button = e.target.closest('.like-btn');
                const icon = button.querySelector('i');
                
                if (icon.classList.contains('far')) {
                    icon.classList.replace('far', 'fas');
                    button.classList.add('liked');
                    this.showSocialNotification('Produk berhasil ditambahkan ke favorit!');
                } else {
                    icon.classList.replace('fas', 'far');
                    button.classList.remove('liked');
                    this.showSocialNotification('Produk dihapus dari favorit!');
                }
            }
            
            if (e.target.closest('.reviews-btn')) {
                const button = e.target.closest('.reviews-btn');
                const productId = button.getAttribute('data-id');
                this.openReviewsModal(productId);
            }
            
            if (e.target.closest('.share-btn')) {
                const button = e.target.closest('.share-btn');
                const productId = button.getAttribute('data-id');
                const product = this.products.find(p => p.id == productId);
                
                if (product && navigator.share) {
                    navigator.share({
                        title: product.name,
                        text: product.description,
                        url: window.location.href
                    });
                } else {
                    navigator.clipboard.writeText(window.location.href).then(() => {
                        this.showSocialNotification('Tautan berhasil disalin!');
                    });
                }
            }
        });
    }

    openReviewsModal(productId) {
        const reviewsModal = document.getElementById('reviews-modal');
        const product = this.products.find(p => p.id == productId);
        
        if (!product || !reviewsModal) return;
        
        this.currentProductId = productId;
        this.currentRating = 0;
        
        // Set product info
        document.getElementById('review-product-image').src = product.image;
        document.getElementById('review-product-name').textContent = product.name;
        
        // Calculate rating
        const productReviews = this.reviews[productId] || [];
        const averageRating = productReviews.length > 0 
            ? productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length
            : product.rating;
        
        document.getElementById('review-product-rating').innerHTML = this.generateStars(averageRating);
        document.getElementById('review-product-count').textContent = `(${productReviews.length} ulasan)`;
        
        // Reset star rating
        this.setStarRating(0);
        
        // Display reviews
        this.displayProductReviews(productId);
        
        // Show modal
        reviewsModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    displayProductReviews(productId) {
        const reviewsList = document.getElementById('reviews-list');
        const productReviews = this.reviews[productId] || [];
        
        if (!reviewsList) return;
        
        if (productReviews.length === 0) {
            reviewsList.innerHTML = '<p class="no-reviews">Belum ada ulasan untuk produk ini.</p>';
            return;
        }
        
        reviewsList.innerHTML = productReviews.map(review => `
            <div class="review-item" data-review-id="${review.id}">
                <div class="review-header">
                    <div class="reviewer-info">
                        <h5>${review.name}</h5>
                        <div class="stars">
                            ${this.generateStars(review.rating)}
                        </div>
                    </div>
                    <div class="review-meta">
                        <span class="review-date">${review.date}</span>
                    </div>
                </div>
                <p class="review-comment">${review.comment}</p>
                <div class="review-actions">
                    <button class="review-action-btn edit-review" data-review-id="${review.id}">
                        <i class="fas fa-edit"></i>
                        Edit
                    </button>
                    <button class="review-action-btn delete-review" data-review-id="${review.id}">
                        <i class="fas fa-trash"></i>
                        Hapus
                    </button>
                </div>
            </div>
        `).join('');
        
        // Add event listeners for edit and delete buttons
        this.attachReviewActionListeners(productId);
    }

    attachReviewActionListeners(productId) {
        // Edit review
        document.querySelectorAll('.edit-review').forEach(button => {
            button.addEventListener('click', (e) => {
                const reviewId = e.target.closest('.edit-review').getAttribute('data-review-id');
                this.editReview(reviewId, productId);
            });
        });

        // Delete review
        document.querySelectorAll('.delete-review').forEach(button => {
            button.addEventListener('click', (e) => {
                const reviewId = e.target.closest('.delete-review').getAttribute('data-review-id');
                this.deleteReview(reviewId, productId);
            });
        });
    }

    editReview(reviewId, productId) {
        const productReviews = this.reviews[productId] || [];
        const review = productReviews.find(r => r.id === reviewId);
        
        if (!review) return;
        
        // Populate form with review data
        document.getElementById('reviewer-name').value = review.name;
        document.getElementById('review-comment').value = review.comment;
        this.setStarRating(review.rating);
        
        // Set editing mode
        this.editingReviewId = reviewId;
        
        // Change button text
        const submitButton = document.getElementById('submit-review');
        if (submitButton) {
            submitButton.innerHTML = '<i class="fas fa-save"></i> Perbarui Ulasan';
        }
    }

    async editProductReview(productId, reviewId, reviewData) {
        const productReviews = this.reviews[productId] || [];
        const reviewIndex = productReviews.findIndex(r => r.id === reviewId);
        
        if (reviewIndex !== -1) {
            productReviews[reviewIndex] = {
                ...productReviews[reviewIndex],
                ...reviewData
            };
            
            this.reviews[productId] = productReviews;
            this.backend.set('productReviews', this.reviews);
            
            return { success: true, message: 'Review updated successfully' };
        }
        
        return { success: false, message: 'Review not found' };
    }

    deleteReview(reviewId, productId) {
        this.showConfirmationDialog(
            'Hapus Ulasan',
            'Apakah Anda yakin ingin menghapus ulasan ini?',
            () => {
                const productReviews = this.reviews[productId] || [];
                this.reviews[productId] = productReviews.filter(r => r.id !== reviewId);
                
                this.backend.set('productReviews', this.reviews);
                this.displayProductReviews(productId);
                this.updateProductRating(productId);
                
                this.showSocialNotification('Ulasan berhasil dihapus!');
            }
        );
    }

    updateProductRating(productId) {
        const productCard = document.querySelector(`.product-card[data-category] .product-rating`);
        if (!productCard) return;
        
        const productReviews = this.reviews[productId] || [];
        const averageRating = productReviews.length > 0 
            ? productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length
            : this.products.find(p => p.id == productId).rating;
        
        const starsElement = productCard.querySelector('.stars');
        const reviewCountElement = productCard.querySelector('.review-count');
        
        if (starsElement) starsElement.innerHTML = this.generateStars(averageRating);
        if (reviewCountElement) reviewCountElement.textContent = `(${productReviews.length} ulasan)`;
    }

    initializePerformanceOptimizations() {
        // Lazy loading
        this.initializeLazyLoading();
        
        // Debounced resize handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 100);
        });
    }

    initializeLazyLoading() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    handleResize() {
        // Handle responsive behavior
        if (window.innerWidth <= 768) {
            document.body.classList.add('mobile-view');
        } else {
            document.body.classList.remove('mobile-view');
        }
    }

    initializeFallback() {
        // Fallback initialization if main initialization fails
        console.log('Initializing fallback mode...');
        this.products = this.backend.getDefaultProducts();
        this.renderProducts(3);
    }

    startBackgroundServices() {
        // Start any background services
        setInterval(() => {
            this.backend.updateLiveStats();
        }, 30000);
    }
}

// Add backend method for app load tracking
MixCrunchBackend.prototype.trackAppLoad = function() {
    this.sendAnalytics({
        type: 'app_load',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`
    });
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create global app instance
    window.mixCrunchApp = new MixCrunchApp();
});
