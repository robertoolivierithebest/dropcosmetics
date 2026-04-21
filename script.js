document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    const header = document.querySelector('.glass-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(227, 154, 255, 0.95)'; /* Lilac #e39aff */
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            header.style.background = 'rgba(227, 154, 255, 0.7)';
            header.style.boxShadow = 'none';
        }
    });

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for fade-in animations on cards
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add a small delay based on index for a staggered effect
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const productCards = document.querySelectorAll('.product-card');
    
    // Initial state for animation
    productCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Cart Logic
    let cart = JSON.parse(localStorage.getItem('dropCart')) || [];
    const cartBtn = document.getElementById('cart-btn');
    const closeCartBtn = document.getElementById('close-cart');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartCounter = document.getElementById('cart-counter');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');

    // Open/Close Cart
    function toggleCart() {
        cartOverlay.classList.toggle('active');
        cartSidebar.classList.toggle('active');
    }

    if(cartBtn) cartBtn.addEventListener('click', toggleCart);
    if(closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
    if(cartOverlay) cartOverlay.addEventListener('click', toggleCart);

    // Add to Cart
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const name = e.target.getAttribute('data-name');
            const price = parseFloat(e.target.getAttribute('data-price'));
            const img = e.target.getAttribute('data-img');

            const existingItem = cart.find(item => item.id === id);
            
            if (existingItem) {
                existingItem.qty += 1;
            } else {
                cart.push({ id, name, price, img, qty: 1 });
            }

            updateCart();
            
            // Visual feedback
            const originalText = e.target.innerText;
            e.target.innerText = 'Aggiunto ✓';
            e.target.style.background = '#9affe3';
            e.target.style.color = '#2C2133';
            setTimeout(() => {
                e.target.innerText = originalText;
                e.target.style.background = '';
                e.target.style.color = '';
            }, 1000);
        });
    });

    // Update Cart UI
    function updateCart() {
        // Update Counter
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        cartCounter.innerText = totalItems;
        
        // Simple animation on badge
        cartCounter.style.transform = 'scale(1.3)';
        setTimeout(() => cartCounter.style.transform = 'scale(1)', 200);

        // Render Items
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Il tuo carrello è vuoto.</p>';
        } else {
            cart.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.classList.add('cart-item');
                itemEl.innerHTML = `
                    <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">€ ${(item.price * item.qty).toFixed(2)}</div>
                        <div class="cart-item-controls">
                            <button class="qty-btn minus" data-id="${item.id}">-</button>
                            <span>${item.qty}</span>
                            <button class="qty-btn plus" data-id="${item.id}">+</button>
                        </div>
                    </div>
                `;
                cartItemsContainer.appendChild(itemEl);
            });
        }

        // Update Total
        const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        cartTotalPrice.innerText = `€ ${total.toFixed(2)}`;

        // Attach listeners to new +/- buttons
        document.querySelectorAll('.qty-btn.plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const item = cart.find(i => i.id === id);
                if(item) { item.qty++; updateCart(); }
            });
        });

        document.querySelectorAll('.qty-btn.minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const item = cart.find(i => i.id === id);
                if(item) { 
                    item.qty--; 
                    if(item.qty <= 0) {
                        cart = cart.filter(i => i.id !== id);
                    }
                    updateCart(); 
                }
            });
        });
        
        // Save to localStorage
        localStorage.setItem('dropCart', JSON.stringify(cart));
    }

    // Initialize UI on load
    updateCart();
});
