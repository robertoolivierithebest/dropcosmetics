document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('dropCart')) || [];
    const itemsContainer = document.getElementById('checkout-items');
    const subtotalEl = document.getElementById('subtotal');
    const grandTotalEl = document.getElementById('grand-total');
    const discountRow = document.getElementById('discount-row');
    const discountAmountEl = document.getElementById('discount-amount');
    
    // Redirect if cart is empty
    if (cart.length === 0) {
        window.location.href = 'index.html';
        return;
    }

    let subtotal = 0;
    let discount = 0;

    // Render items
    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;
        
        const itemEl = document.createElement('div');
        itemEl.classList.add('summary-item');
        itemEl.innerHTML = `
            <img src="${item.img}" class="summary-img">
            <div class="summary-details">
                <div class="summary-title">${item.name}</div>
                <div class="summary-qty">Quantità: ${item.qty}</div>
            </div>
            <div class="summary-price">€ ${itemTotal.toFixed(2)}</div>
        `;
        itemsContainer.appendChild(itemEl);
    });

    // Initial totals
    function updateTotals() {
        subtotalEl.innerText = `€ ${subtotal.toFixed(2)}`;
        const total = subtotal - discount;
        grandTotalEl.innerText = `€ ${total.toFixed(2)}`;
        
        if (discount > 0) {
            discountRow.style.display = 'flex';
            discountAmountEl.innerText = `- € ${discount.toFixed(2)}`;
        }
    }
    updateTotals();

    // Payment method selection
    const paymentMethods = document.querySelectorAll('.payment-method');
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            paymentMethods.forEach(m => m.classList.remove('active'));
            this.classList.add('active');
            this.querySelector('input').checked = true;
        });
    });

    // Coupon logic
    const applyCouponBtn = document.getElementById('apply-coupon');
    const couponInput = document.getElementById('coupon-input');
    const couponMsg = document.getElementById('coupon-msg');
    let couponApplied = false;

    applyCouponBtn.addEventListener('click', () => {
        if (couponApplied) {
            couponMsg.innerHTML = '<span class="coupon-error">Un coupon è già stato applicato.</span>';
            return;
        }
        
        const code = couponInput.value.trim().toUpperCase();
        if (code === 'DROP10') {
            discount = subtotal * 0.10;
            couponApplied = true;
            couponMsg.innerHTML = '<span class="coupon-success">Sconto del 10% applicato con successo!</span>';
            couponInput.disabled = true;
            applyCouponBtn.disabled = true;
            updateTotals();
        } else if (code !== '') {
            couponMsg.innerHTML = '<span class="coupon-error">Codice non valido. Prova DROP10.</span>';
        }
    });

    // Form submission simulation
    const checkoutForm = document.getElementById('checkout-form');
    const loadingOverlay = document.getElementById('loading-overlay');

    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent actual submission
        
        loadingOverlay.classList.add('active');
        
        // Simulate processing time
        setTimeout(() => {
            // Clear cart
            localStorage.removeItem('dropCart');
            // Redirect to Thank You page
            window.location.href = 'thankyou.html';
        }, 2000);
    });
});
