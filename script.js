document.addEventListener('DOMContentLoaded', () => {

    // ============================================================
    // PRELOADER
    // ============================================================
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.pointerEvents = 'none';
            setTimeout(() => preloader.remove(), 600);
        }, 500); // reduced timeout and removed window.onload dependency
    }

    // ============================================================
    // MOBILE MENU TOGGLE
    // ============================================================
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const spans = hamburger.querySelectorAll('span');
        if (navLinks.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // ============================================================
    // STICKY NAVBAR & ACTIVE LINK
    // ============================================================
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section, header');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') && link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // ============================================================
    // SCROLL REVEAL
    // ============================================================
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.12 });

    revealElements.forEach(el => revealObserver.observe(el));

    // ============================================================
    // CONTACT FORM
    // ============================================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("Thank you for reaching out to Bake 'N' Flake! We'll get back to you shortly.");
            contactForm.reset();
        });
    }

    // ============================================================
    // AVAILABLE ITEMS (with emoji mapping for search/sidebar)
    // ============================================================
    const availableItems = [
        { id: 'item1', name: 'Signature Cake',       price: 899,  emoji: '🎂', category: 'Cakes' },
        { id: 'item2', name: 'Chocolate Truffle Cake', price: 799, emoji: '🍫', category: 'Cakes' },
        { id: 'item3', name: 'Black Forest Cake',    price: 699,  emoji: '🎂', category: 'Cakes' },
        { id: 'item4', name: 'Strawberry Cake',      price: 749,  emoji: '🍓', category: 'Cakes' },
        { id: 'item5', name: 'Flaky Pastry',         price: 49,   emoji: '🥐', category: 'Pastries' },
        { id: 'item6', name: 'Croissant',            price: 59,   emoji: '🥐', category: 'Pastries' },
        { id: 'item7', name: 'Chocolate Box',        price: 199,  emoji: '🍫', category: 'Chocolates' },
        { id: 'item8', name: 'Cold Coffee',          price: 99,   emoji: '☕', category: 'Drinks' },
        { id: 'item9', name: 'Mango Shake',          price: 89,   emoji: '🥭', category: 'Drinks' },
        { id: 'item10', name: 'Custom Cake',          price: 1200, emoji: '🎂', category: 'Cakes' }
    ];

    // ============================================================
    // CART STATE (LocalStorage)
    // ============================================================
    function getCart() {
        return JSON.parse(localStorage.getItem('bnf_cart') || '[]');
    }

    function saveCart(cartArray) {
        localStorage.setItem('bnf_cart', JSON.stringify(cartArray));
    }

    // Global add to cart function
    window.addToCart = function(itemName, btnElement) {
        const itemDef = availableItems.find(i => i.name === itemName);
        
        if (itemDef && itemDef.category === 'Cakes') {
            if (typeof openCakeCustomizer === 'function') {
                openCakeCustomizer(itemDef);
                return;
            }
        }

        const cartArray = getCart();
        const existingItem = cartArray.find(i => i.name === itemName);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            if (itemDef) {
                cartArray.push({
                    id: itemDef.id,
                    name: itemDef.name,
                    price: itemDef.price,
                    emoji: itemDef.emoji,
                    quantity: 1
                });
            }
        }
        
        saveCart(cartArray);
        updateCartUI();
        
        if (btnElement) {
            const originalText = btnElement.textContent;
            btnElement.textContent = '✓ Added!';
            btnElement.classList.add('added');
            setTimeout(() => {
                btnElement.textContent = originalText;
                btnElement.classList.remove('added');
            }, 1200);
        }
    };

    window.updateCartUI = function() {
        const cartArray = getCart();
        const totalItems = cartArray.reduce((acc, item) => acc + item.quantity, 0);
        
        // Update nav badge
        const navBadge = document.getElementById('cartBadge');
        if (navBadge) {
            navBadge.textContent = totalItems;
            navBadge.classList.remove('bump');
            void navBadge.offsetWidth;
            navBadge.classList.add('bump');
        }
        
        // Update floating badge
        const floatingBadge = document.getElementById('fcBadge');
        if (floatingBadge) {
            floatingBadge.textContent = totalItems;
        }

        // If sidebar is active, re-render it
        const sidebar = document.getElementById('cartSidebar');
        if (sidebar && sidebar.classList.contains('active')) {
            renderCartSidebar();
        }

        // If order modal is open, re-render its content
        syncModalCart();
    };

    // ============================================================
    // CART SIDEBAR
    // ============================================================
    const cartSidebar = document.getElementById('cartSidebar');
    const cartSidebarOverlay = document.getElementById('cartSidebarOverlay');

    window.toggleCartSidebar = () => {
        if (!cartSidebar) return;
        const isOpen = cartSidebar.classList.contains('active');
        if (isOpen) {
            cartSidebar.classList.remove('active');
            cartSidebarOverlay.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            renderCartSidebar();
            cartSidebar.classList.add('active');
            cartSidebarOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    window.renderCartSidebar = function() {
        const cartArray = getCart();
        const sidebarItems = document.getElementById('cartSidebarItems');
        const totalSpan = document.getElementById('cartSidebarTotal');
        if(!sidebarItems) return;
        
        if (cartArray.length === 0) {
            sidebarItems.innerHTML = '<div class="cart-empty-msg">Your cart is empty 🍰</div>';
            if (totalSpan) totalSpan.textContent = '₹0';
            return;
        }
        
        let html = '';
        let total = 0;
        
        cartArray.forEach(item => {
            const subtotal = item.price * item.quantity;
            total += subtotal;
            const detailsHtml = item.details ? `<div style="font-size:0.8rem;color:#888;margin-bottom:0.3rem;">${item.details}</div>` : '';
            html += `
                <div class="cart-sidebar-entry">
                    <div class="sidebar-item-emoji">${item.emoji}</div>
                    <div class="sidebar-item-info">
                        <div class="sidebar-item-name">${item.name}</div>
                        ${detailsHtml}
                        <div class="sidebar-item-price">₹${item.price} × ${item.quantity} = ₹${subtotal}</div>
                    </div>
                    <div class="sidebar-item-controls">
                        <button class="sidebar-qty-btn" onclick="sidebarChangeQty('${item.id}', -1)">−</button>
                        <span class="sidebar-qty-val">${item.quantity}</span>
                        <button class="sidebar-qty-btn" onclick="sidebarChangeQty('${item.id}', 1)">+</button>
                    </div>
                </div>
            `;
        });
        
        sidebarItems.innerHTML = html;
        if (totalSpan) totalSpan.textContent = `₹${total}`;
    };

    window.sidebarChangeQty = (itemId, delta) => {
        let cartArray = getCart();
        const item = cartArray.find(i => i.id === itemId);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                cartArray = cartArray.filter(i => i.id !== itemId);
            }
            saveCart(cartArray);
            updateCartUI();
            
            // Re-render specifically if cartList is in DOM because structural items might be deleted
            const cartList = document.getElementById('cartList');
            if (cartList && document.getElementById('orderModal').classList.contains('active')) {
                renderCart();
            }
        }
    };

    // ============================================================
    // ORDER MODAL LOGIC
    // ============================================================
    window.openOrderModal = () => {
        const cartArray = getCart();
        if(cartArray.length === 0) {
            alert('Your cart is empty! Please add some items first.');
            return;
        }
        document.getElementById('orderModal').classList.add('active');
        document.body.style.overflow = 'hidden';
        renderCart(); // to populate modal view
    };

    window.closeOrderModal = () => {
        document.getElementById('orderModal').classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            document.getElementById('orderForm').reset();
            goToStep(1);
            document.getElementById('successStep').classList.remove('active');
            document.getElementById('step1').classList.add('active');
            document.querySelector('.progress-bar').style.display = 'flex';
        }, 300);
    };

    window.goToStep = (step) => {
        document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
        document.getElementById('step' + step).classList.add('active');
        document.querySelectorAll('.progress-step').forEach(el => el.classList.remove('active'));
        for (let i = 1; i <= step; i++) {
            const indicator = document.getElementById('step' + i + '-indicator');
            if (indicator) indicator.classList.add('active');
        }
    };

    window.nextStep = (step) => goToStep(step);
    window.prevStep = (step) => goToStep(step);

    window.toggleAddress = () => {
        const pref = document.querySelector('input[name="deliveryPref"]:checked').value;
        const addressField = document.getElementById('addressField');
        if (pref === 'delivery') {
            addressField.classList.remove('hidden');
            document.getElementById('orderAddress').required = true;
        } else {
            addressField.classList.add('hidden');
            document.getElementById('orderAddress').required = false;
        }
    };

    window.togglePaymentDetails = () => {
        const method = document.getElementById('paymentMethod').value;
        document.querySelectorAll('.payment-details').forEach(el => el.classList.add('hidden'));
        if (method === 'upi') document.getElementById('upiDetails').classList.remove('hidden');
        else if (method === 'netbanking') document.getElementById('netBankingDetails').classList.remove('hidden');
        else if (method === 'cod') document.getElementById('codDetails').classList.remove('hidden');
    };

    // Replace the submit order functionality to pull from new cart logic and localStorage
    window.submitOrder = (e) => {
        e.preventDefault();
        const cartArray = getCart();
        if (cartArray.length === 0) {
            alert('Please select at least one item before placing the order.');
            return;
        }
        
        // Save to orders localStorage
        const orders = JSON.parse(localStorage.getItem('bnf_orders') || '[]');
        const itemsMap = {};
        let total = 0;
        cartArray.forEach(i => {
            itemsMap[i.name] = i.quantity;
            total += i.price * i.quantity;
        });
        
        // Collect checked addons
        const addons = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
                           .filter(cb => cb.value !== 'on') // Ignore non-value checkboxes like codConfirm
                           .map(cb => cb.value);
                           
        const newOrder = {
            id: '#BNF' + new Date().getFullYear() + Math.floor(1000 + Math.random() * 9000),
            date: new Date().toISOString(),
            status: 'preparing',
            timestamp: Date.now(),
            total: total,
            deliveryPref: document.querySelector('input[name="deliveryPref"]:checked').value,
            address: document.getElementById('orderAddress').value,
            orderDate: document.getElementById('orderDate').value,
            orderTime: document.getElementById('orderTime').value,
            paymentMethod: document.getElementById('paymentMethod').value,
            items: itemsMap,
            addons: addons
        };
        
        orders.push(newOrder);
        localStorage.setItem('bnf_orders', JSON.stringify(orders));
        
        document.getElementById('successOrderId').textContent = newOrder.id;
        document.querySelector('.progress-bar').style.display = 'none';
        document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
        document.getElementById('successStep').classList.add('active');
        
        // Clear cart
        saveCart([]);
        updateCartUI();
    };

    // ============================================================
    // ORDER MODAL CART RENDER
    // ============================================================
    function renderCart() {
        const cartList = document.getElementById('cartList');
        if (!cartList) return;
        
        const cartArray = getCart();
        let html = '';
        cartArray.forEach(item => {
            const detailsHtml = item.details ? `<div style="font-size:0.8rem;color:#888;margin-bottom:0.3rem;">${item.details}</div>` : '';
            html += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.emoji} ${item.name}</div>
                        ${detailsHtml}
                        <div class="cart-item-price">₹${item.price}</div>
                    </div>
                    <div class="cart-item-controls">
                        <button type="button" class="qty-btn" onclick="sidebarChangeQty('${item.id}', -1)">−</button>
                        <span class="qty-value" id="qty-${item.id}">${item.quantity}</span>
                        <button type="button" class="qty-btn" onclick="sidebarChangeQty('${item.id}', 1)">+</button>
                    </div>
                </div>
            `;
        });
        cartList.innerHTML = html;
        syncModalCart();
    }

    function syncModalCart() {
        const cartArray = getCart();
        
        // Modal specific fields
        const summaryEl = document.getElementById('summaryItems');
        const totalPriceEl = document.getElementById('totalPrice');
        
        if (summaryEl && totalPriceEl) {
            if (cartArray.length === 0) {
                summaryEl.innerText = 'No items selected';
                totalPriceEl.innerText = 'Total: ₹0';
                
                // If cartList exists, empty it
                const cartList = document.getElementById('cartList');
                if (cartList) cartList.innerHTML = '';
            } else {
                let total = 0;
                let summaryHtml = '';
                cartArray.forEach(item => {
                    total += item.quantity * item.price;
                    summaryHtml += `${item.quantity}× ${item.name}\n`;
                    
                    // Update qty display inside modal if visible
                    const qtyEl = document.getElementById(`qty-${item.id}`);
                    if (qtyEl) qtyEl.innerText = item.quantity;
                });
                
                summaryEl.innerText = summaryHtml;
                totalPriceEl.innerText = `Total: ₹${total}`;
            }
        }
    }

    // Call on page load
    updateCartUI();

    // ============================================================
    // MY ORDERS MODAL
    // ============================================================
    window.openMyOrders = (e) => {
        if (e) e.preventDefault();
        document.querySelector('.nav-links').classList.remove('active');
        const spans = document.querySelectorAll('.hamburger span');
        if (spans.length === 3) {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
        document.getElementById('myOrdersModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeMyOrders = () => {
        document.getElementById('myOrdersModal').classList.remove('active');
        document.body.style.overflow = '';
    };

    // ============================================================
    // SEARCH BAR WITH LIVE RESULTS
    // ============================================================
    const searchInput = document.getElementById('menuSearchInput');
    const searchDropdown = document.getElementById('searchResultsDropdown');
    const searchClearBtn = document.getElementById('searchClearBtn');

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim().toLowerCase();

            if (query.length === 0) {
                searchDropdown.classList.remove('active');
                searchClearBtn.classList.remove('visible');
                return;
            }

            searchClearBtn.classList.add('visible');

            const results = availableItems.filter(item =>
                item.name.toLowerCase().includes(query) ||
                item.category.toLowerCase().includes(query)
            );

            if (results.length === 0) {
                searchDropdown.innerHTML = `
                    <div class="search-no-results">
                        <span>🍰</span>
                        No results found for "<strong>${searchInput.value}</strong>"<br>
                        <small>Try searching for "cake", "pastry", or "chocolate"</small>
                    </div>
                `;
            } else {
                searchDropdown.innerHTML = results.map(item => `
                    <div class="search-result-item">
                        <div class="search-result-emoji">${item.emoji}</div>
                        <div class="search-result-info">
                            <div class="search-result-name">${highlightMatch(item.name, query)}</div>
                            <div class="search-result-price">₹${item.price} · ${item.category}</div>
                        </div>
                        <button class="search-add-btn" onclick="addToCartFromSearch('${item.name}')">+ Add</button>
                    </div>
                `).join('');
            }

            searchDropdown.classList.add('active');
        });

        // Hide dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-bar-wrapper') && searchDropdown) {
                searchDropdown.classList.remove('active');
            }
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                clearSearch();
            }
        });
    }

    function highlightMatch(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, `<mark style="background:rgba(183,110,121,0.2);border-radius:3px;padding:0 2px;">$1</mark>`);
    }

    window.addToCartFromSearch = (itemName) => {
        window.addToCart(itemName, null);

        // Visual feedback on the button
        const btns = document.querySelectorAll('.search-add-btn');
            btns.forEach(btn => {
                if (btn.getAttribute('onclick').includes(itemName)) {
                    btn.textContent = '✓ Added!';
                    btn.style.background = '#2E7D32';
                    setTimeout(() => {
                        btn.textContent = '+ Add';
                        btn.style.background = '';
                    }, 1200);
                }
            });
    };

    window.clearSearch = () => {
        searchInput.value = '';
        searchDropdown.classList.remove('active');
        searchClearBtn.classList.remove('visible');
        searchInput.focus();
    };

    // ============================================================
    // HAPPY HOURS COUNTDOWN TIMER
    // (Counts down to 5:00 PM IST each day)
    // ============================================================
    function updateHappyHoursTimer() {
        const timerEl = document.getElementById('happyHoursTimer');
        if (!timerEl) return;

        const now = new Date();
        const target = new Date();
        target.setHours(17, 0, 0, 0); // 5:00 PM

        let diff = target - now;

        if (diff < 0) {
            // Happy hours have passed — show tomorrow's countdown
            timerEl.textContent = 'Offer Starts Tomorrow!';
            timerEl.style.fontSize = '0.95rem';
            timerEl.style.color = '#C62828';
            return;
        }

        if (now.getHours() >= 14 && now.getHours() < 17) {
            // Happy hours are ACTIVE
            timerEl.style.color = '#2E7D32';
        } else if (now.getHours() < 14) {
            // Before happy hours, count down to 2PM when it starts
            const startTarget = new Date();
            startTarget.setHours(14, 0, 0, 0);
            diff = startTarget - now;
            timerEl.style.color = '#EF6C00';
        }

        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);

        timerEl.textContent =
            String(hours).padStart(2, '0') + ':' +
            String(minutes).padStart(2, '0') + ':' +
            String(seconds).padStart(2, '0');
    }

    updateHappyHoursTimer();
    setInterval(updateHappyHoursTimer, 1000);

    // ============================================================
    // STORE LOCATOR — Card click highlight
    // ============================================================
    document.querySelectorAll('.store-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.store-card').forEach(c => c.classList.remove('active-card'));
            card.classList.add('active-card');
        });
    });

    // ============================================================
    // CAKE CUSTOMIZER MODAL INJECTION & LOGIC
    // ============================================================
    const customizerHTML = `
    <div id="cakeCustomizerOverlay" class="cake-customizer-overlay">
        <div class="cake-customizer-container">
            <button class="customizer-close-btn" onclick="closeCakeCustomizer()">&times;</button>
            
            <div class="customizer-preview">
                <div class="customizer-preview-inner" id="cakeSvgWrapper">
                    <svg viewBox="0 0 200 200" width="100%" height="100%">
                        <!-- Base Cake -->
                        <path d="M40 120 C40 140, 160 140, 160 120 L160 80 C160 60, 40 60, 40 80 Z" fill="#F5E6D3" id="svgBaseCake" />
                        <path d="M40 80 C40 100, 160 100, 160 80 C160 60, 40 60, 40 80 Z" fill="#E8D1B5" id="svgBaseTop" />
                        <!-- Frosting Drip -->
                        <path d="M38 80 C38 60, 162 60, 162 80 C162 90, 150 100, 140 85 C130 105, 110 85, 100 100 C90 85, 70 105, 60 85 C50 100, 38 90, 38 80 Z" fill="#FFFFFF" id="svgFrosting" />
                        <!-- Toppings Group -->
                        <g id="svgToppings">
                            <!-- Strawberries -->
                            <g id="svgStrawberries" style="display:none;">
                                <circle cx="100" cy="70" r="8" fill="#D32F2F"/>
                                <circle cx="70" cy="75" r="7" fill="#D32F2F"/>
                                <circle cx="130" cy="75" r="7" fill="#D32F2F"/>
                            </g>
                            <!-- Roses -->
                            <g id="svgRoses" style="display:none;">
                                <circle cx="85" cy="65" r="9" fill="#E91E63"/>
                                <circle cx="115" cy="65" r="9" fill="#E91E63"/>
                            </g>
                            <!-- Gold Dust -->
                            <g id="svgGold" style="display:none;">
                                <circle cx="60" cy="80" r="2" fill="#FFD700"/><circle cx="140" cy="80" r="2" fill="#FFD700"/><circle cx="80" cy="90" r="2" fill="#FFD700"/><circle cx="120" cy="90" r="2" fill="#FFD700"/>
                            </g>
                            <!-- Choco Chips -->
                            <g id="svgChoco" style="display:none;">
                                <rect x="90" y="65" width="4" height="4" fill="#3E2723"/><rect x="110" y="70" width="4" height="4" fill="#3E2723"/><rect x="75" y="70" width="4" height="4" fill="#3E2723"/>
                            </g>
                            <!-- Blueberries -->
                            <g id="svgBlueberries" style="display:none;">
                                <circle cx="95" cy="75" r="4" fill="#303F9F"/><circle cx="105" cy="75" r="4" fill="#303F9F"/><circle cx="85" cy="70" r="4" fill="#303F9F"/>
                            </g>
                            <!-- Nuts -->
                            <g id="svgNuts" style="display:none;">
                                <circle cx="100" cy="65" r="2" fill="#8D6E63"/><circle cx="90" cy="75" r="2" fill="#8D6E63"/><circle cx="110" cy="75" r="2" fill="#8D6E63"/><circle cx="80" cy="65" r="2" fill="#8D6E63"/>
                            </g>
                        </g>
                        <!-- Message -->
                        <text x="100" y="115" class="cake-svg-text" id="svgMessageText"></text>
                    </svg>
                </div>
            </div>
            
            <div class="customizer-options">
                <div class="customizer-header">
                    <h2 id="cBaseName">Customize Your Cake</h2>
                    <div class="customizer-progress">
                        <div class="c-step-dot active" id="cDot1">1</div>
                        <div class="c-step-dot" id="cDot2">2</div>
                        <div class="c-step-dot" id="cDot3">3</div>
                        <div class="c-step-dot" id="cDot4">4</div>
                        <div class="c-step-dot" id="cDot5">5</div>
                        <div class="c-step-dot" id="cDot6">✓</div>
                    </div>
                </div>

                <div class="customizer-step active" id="cStep1">
                    <h3>Choose Size</h3>
                    <div class="size-grid">
                        <div class="size-card selected" onclick="setCakeSize('Half Kg', 0)">
                            <span class="size-icon">🍰</span>
                            <div class="size-name">Half Kg</div>
                            <div class="size-serves">Serves 4</div>
                            <div class="size-price">+₹0</div>
                        </div>
                        <div class="size-card" onclick="setCakeSize('1 Kg', 200)">
                            <span class="size-icon">🎂</span>
                            <div class="size-name">1 Kg</div>
                            <div class="size-serves">Serves 8</div>
                            <div class="size-price">+₹200</div>
                        </div>
                        <div class="size-card" onclick="setCakeSize('2 Kg', 500)">
                            <span class="size-icon">🎉</span>
                            <div class="size-name">2 Kg</div>
                            <div class="size-serves">Serves 16</div>
                            <div class="size-price">+₹500</div>
                        </div>
                    </div>
                </div>

                <div class="customizer-step" id="cStep2">
                    <h3>Choose Flavor</h3>
                    <div class="flavor-scroll">
                        <div class="flavor-chip selected" onclick="setCakeFlavor('Vanilla', '#F5E6D3', '#E8D1B5')">
                            <span class="flavor-color" style="background:#F5E6D3;"></span> Vanilla
                        </div>
                        <div class="flavor-chip" onclick="setCakeFlavor('Chocolate', '#4E342E', '#3E2723')">
                            <span class="flavor-color" style="background:#4E342E;"></span> Chocolate
                        </div>
                        <div class="flavor-chip" onclick="setCakeFlavor('Red Velvet', '#C62828', '#B71C1C')">
                            <span class="flavor-color" style="background:#C62828;"></span> Red Velvet
                        </div>
                        <div class="flavor-chip" onclick="setCakeFlavor('Butterscotch', '#FFB300', '#FFA000')">
                            <span class="flavor-color" style="background:#FFB300;"></span> Butterscotch
                        </div>
                        <div class="flavor-chip" onclick="setCakeFlavor('Strawberry', '#F8BBD0', '#F48FB1')">
                            <span class="flavor-color" style="background:#F8BBD0;"></span> Strawberry
                        </div>
                    </div>
                </div>

                <div class="customizer-step" id="cStep3">
                    <h3>Choose Frosting Color</h3>
                    <div class="frosting-grid">
                        <div class="frosting-swatch-wrapper selected" onclick="setCakeFrosting('White Cream', '#FFFFFF')">
                            <div class="frosting-swatch" style="background:#FFFFFF;"></div>
                            <div class="frosting-label">White</div>
                        </div>
                        <div class="frosting-swatch-wrapper" onclick="setCakeFrosting('Chocolate', '#3E2723')">
                            <div class="frosting-swatch" style="background:#3E2723;"></div>
                            <div class="frosting-label">Chocolate</div>
                        </div>
                        <div class="frosting-swatch-wrapper" onclick="setCakeFrosting('Pink Rose', '#F48FB1')">
                            <div class="frosting-swatch" style="background:#F48FB1;"></div>
                            <div class="frosting-label">Pink Rose</div>
                        </div>
                        <div class="frosting-swatch-wrapper" onclick="setCakeFrosting('Sky Blue', '#81D4FA')">
                            <div class="frosting-swatch" style="background:#81D4FA;"></div>
                            <div class="frosting-label">Sky Blue</div>
                        </div>
                        <div class="frosting-swatch-wrapper" onclick="setCakeFrosting('Lavender', '#CE93D8')">
                            <div class="frosting-swatch" style="background:#CE93D8;"></div>
                            <div class="frosting-label">Lavender</div>
                        </div>
                        <div class="frosting-swatch-wrapper" onclick="setCakeFrosting('Golden Yellow', '#FFF59D')">
                            <div class="frosting-swatch" style="background:#FFF59D;"></div>
                            <div class="frosting-label">Golden</div>
                        </div>
                    </div>
                </div>

                <div class="customizer-step" id="cStep4">
                    <h3>Choose Toppings</h3>
                    <div class="toppings-grid">
                        <div class="topping-card" onclick="toggleCakeTopping(this, 'Strawberries', 50, 'svgStrawberries')">
                            <div class="topping-icon">🍓</div>
                            <div class="topping-name">Strawberries</div>
                            <div class="topping-price">+₹50</div>
                        </div>
                        <div class="topping-card" onclick="toggleCakeTopping(this, 'Choco Chips', 30, 'svgChoco')">
                            <div class="topping-icon">🍫</div>
                            <div class="topping-name">Choco Chips</div>
                            <div class="topping-price">+₹30</div>
                        </div>
                        <div class="topping-card" onclick="toggleCakeTopping(this, 'Edible Roses', 80, 'svgRoses')">
                            <div class="topping-icon">🌹</div>
                            <div class="topping-name">Edible Roses</div>
                            <div class="topping-price">+₹80</div>
                        </div>
                        <div class="topping-card" onclick="toggleCakeTopping(this, 'Crushed Nuts', 40, 'svgNuts')">
                            <div class="topping-icon">🥜</div>
                            <div class="topping-name">Crushed Nuts</div>
                            <div class="topping-price">+₹40</div>
                        </div>
                        <div class="topping-card" onclick="toggleCakeTopping(this, 'Blueberries', 60, 'svgBlueberries')">
                            <div class="topping-icon">🫐</div>
                            <div class="topping-name">Blueberries</div>
                            <div class="topping-price">+₹60</div>
                        </div>
                        <div class="topping-card" onclick="toggleCakeTopping(this, 'Gold Dust', 100, 'svgGold')">
                            <div class="topping-icon">✨</div>
                            <div class="topping-name">Gold Dust</div>
                            <div class="topping-price">+₹100</div>
                        </div>
                    </div>
                </div>

                <div class="customizer-step" id="cStep5">
                    <h3>Personal Message</h3>
                    <input type="text" class="message-input" id="cMessageInput" placeholder="Write message (max 30 chars)" maxlength="30" oninput="updateCakeMessage()">
                    <div class="msg-color-options">
                        <div class="msg-color-btn selected" style="background:#3E2723;" onclick="setCakeMessageColor(this, '#3E2723')"></div>
                        <div class="msg-color-btn" style="background:#FFFFFF;" onclick="setCakeMessageColor(this, '#FFFFFF')"></div>
                        <div class="msg-color-btn" style="background:#E91E63;" onclick="setCakeMessageColor(this, '#E91E63')"></div>
                    </div>
                </div>

                <div class="customizer-step" id="cStep6">
                    <h3>Order Summary</h3>
                    <div class="customizer-summary-card">
                        <div class="c-summary-row">
                            <span id="cSumBase">Base Cake</span>
                            <span id="cSumBasePrice">₹0</span>
                        </div>
                        <div class="c-summary-row">
                            <span id="cSumSize">Size: Half Kg</span>
                            <span id="cSumSizePrice">+₹0</span>
                        </div>
                        <div class="c-summary-row">
                            <span>Flavor & Frosting</span>
                            <span id="cSumFlavor">Vanilla / White</span>
                        </div>
                        <div class="c-summary-row" id="cSumToppingsRow">
                            <span id="cSumToppingsList">No Toppings</span>
                            <span id="cSumToppingsPrice">+₹0</span>
                        </div>
                        <div class="c-summary-row" id="cSumMessageRow" style="display:none;">
                            <span>Message: <i id="cSumMessageText"></i></span>
                        </div>
                        <div class="c-summary-total">
                            Total: <span id="cSumTotal">₹0</span>
                        </div>
                        <p style="font-size:0.8rem;color:var(--text-muted);text-align:right;margin-top:0.5rem;">Estimated prep time: 24-48 hours</p>
                    </div>
                </div>

                <div class="customizer-footer">
                    <div class="live-price-box">Total: <span class="live-price-val" id="cLivePrice">₹0</span></div>
                    <div>
                        <button class="btn secondary-btn" id="cBtnBack" onclick="navCustomizer(-1)" style="display:none;margin-right:1rem;">Back</button>
                        <button class="btn primary-btn" id="cBtnNext" onclick="navCustomizer(1)">Next Step</button>
                        <button class="btn primary-btn" id="cBtnAddCart" onclick="finalizeCustomCake()" style="display:none;">Add to Cart 🛒</button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', customizerHTML);

    // State Variables
    let cState = {
        baseItem: null, basePrice: 0,
        size: 'Half Kg', sizePrice: 0,
        flavor: 'Vanilla', flavorColor1: '#F5E6D3', flavorColor2: '#E8D1B5',
        frosting: 'White Cream', frostingColor: '#FFFFFF',
        toppings: [], toppingsPrice: 0,
        message: '', messageColor: '#3E2723',
        step: 1
    };

    window.openCakeCustomizer = function(itemDef) {
        cState = {
            baseItem: itemDef, basePrice: itemDef.price,
            size: 'Half Kg', sizePrice: 0,
            flavor: 'Vanilla', flavorColor1: '#F5E6D3', flavorColor2: '#E8D1B5',
            frosting: 'White Cream', frostingColor: '#FFFFFF',
            toppings: [], toppingsPrice: 0,
            message: '', messageColor: '#3E2723',
            step: 1
        };
        
        document.getElementById('cBaseName').textContent = 'Customize ' + itemDef.name;
        document.getElementById('cMessageInput').value = '';
        
        // Reset selections UI
        document.querySelectorAll('.size-card').forEach(el => el.classList.remove('selected'));
        document.querySelector('.size-card').classList.add('selected'); // First one
        document.querySelectorAll('.flavor-chip').forEach(el => el.classList.remove('selected'));
        document.querySelector('.flavor-chip').classList.add('selected');
        document.querySelectorAll('.frosting-swatch-wrapper').forEach(el => el.classList.remove('selected'));
        document.querySelector('.frosting-swatch-wrapper').classList.add('selected');
        document.querySelectorAll('.topping-card').forEach(el => el.classList.remove('selected'));
        document.querySelectorAll('.msg-color-btn').forEach(el => el.classList.remove('selected'));
        document.querySelector('.msg-color-btn').classList.add('selected');
        
        // Reset SVG
        document.getElementById('svgBaseCake').setAttribute('fill', '#F5E6D3');
        document.getElementById('svgBaseTop').setAttribute('fill', '#E8D1B5');
        document.getElementById('svgFrosting').setAttribute('fill', '#FFFFFF');
        document.getElementById('svgMessageText').textContent = '';
        document.getElementById('svgMessageText').setAttribute('fill', '#3E2723');
        const ts = ['svgStrawberries', 'svgRoses', 'svgGold', 'svgChoco', 'svgBlueberries', 'svgNuts'];
        ts.forEach(id => document.getElementById(id).style.display = 'none');

        updateCustomizerUI();
        document.getElementById('cakeCustomizerOverlay').classList.add('active');
    };

    window.closeCakeCustomizer = function() {
        document.getElementById('cakeCustomizerOverlay').classList.remove('active');
    };

    window.setCakeSize = function(name, price) {
        cState.size = name; cState.sizePrice = price;
        event.currentTarget.parentElement.querySelectorAll('.size-card').forEach(el => el.classList.remove('selected'));
        event.currentTarget.classList.add('selected');
        triggerWobble(); updateCustomizerPrice();
    };

    window.setCakeFlavor = function(name, c1, c2) {
        cState.flavor = name; cState.flavorColor1 = c1; cState.flavorColor2 = c2;
        event.currentTarget.parentElement.querySelectorAll('.flavor-chip').forEach(el => el.classList.remove('selected'));
        event.currentTarget.classList.add('selected');
        document.getElementById('svgBaseCake').setAttribute('fill', c1);
        document.getElementById('svgBaseTop').setAttribute('fill', c2);
        triggerWobble();
    };

    window.setCakeFrosting = function(name, color) {
        cState.frosting = name; cState.frostingColor = color;
        event.currentTarget.parentElement.querySelectorAll('.frosting-swatch-wrapper').forEach(el => el.classList.remove('selected'));
        event.currentTarget.classList.add('selected');
        document.getElementById('svgFrosting').setAttribute('fill', color);
        triggerWobble();
    };

    window.toggleCakeTopping = function(el, name, price, svgId) {
        el.classList.toggle('selected');
        const isSelected = el.classList.contains('selected');
        document.getElementById(svgId).style.display = isSelected ? 'block' : 'none';
        
        if (isSelected) {
            cState.toppings.push({ name, price });
            cState.toppingsPrice += price;
        } else {
            cState.toppings = cState.toppings.filter(t => t.name !== name);
            cState.toppingsPrice -= price;
        }
        triggerWobble(); updateCustomizerPrice();
    };

    window.updateCakeMessage = function() {
        const val = document.getElementById('cMessageInput').value;
        cState.message = val;
        document.getElementById('svgMessageText').textContent = val;
    };

    window.setCakeMessageColor = function(el, color) {
        cState.messageColor = color;
        event.currentTarget.parentElement.querySelectorAll('.msg-color-btn').forEach(el => el.classList.remove('selected'));
        event.currentTarget.classList.add('selected');
        document.getElementById('svgMessageText').setAttribute('fill', color);
    };

    function triggerWobble() {
        const svg = document.getElementById('cakeSvgWrapper');
        svg.classList.remove('wobble');
        void svg.offsetWidth; // trigger reflow
        svg.classList.add('wobble');
    }

    function updateCustomizerPrice() {
        const total = cState.basePrice + cState.sizePrice + cState.toppingsPrice;
        const priceEl = document.getElementById('cLivePrice');
        priceEl.textContent = '₹' + total;
        priceEl.classList.add('updating');
        setTimeout(() => priceEl.classList.remove('updating'), 300);
        return total;
    }

    function updateCustomizerUI() {
        // Steps
        document.querySelectorAll('.customizer-step').forEach(el => el.classList.remove('active'));
        document.getElementById('cStep' + cState.step).classList.add('active');
        
        // Dots
        for(let i=1; i<=6; i++) {
            const dot = document.getElementById('cDot'+i);
            dot.className = 'c-step-dot';
            if (i < cState.step) dot.classList.add('completed');
            if (i === cState.step) dot.classList.add('active');
        }

        // Buttons
        document.getElementById('cBtnBack').style.display = cState.step > 1 ? 'block' : 'none';
        
        if (cState.step === 6) {
            document.getElementById('cBtnNext').style.display = 'none';
            document.getElementById('cBtnAddCart').style.display = 'block';
            buildSummary();
        } else {
            document.getElementById('cBtnNext').style.display = 'block';
            document.getElementById('cBtnAddCart').style.display = 'none';
        }

        updateCustomizerPrice();
    }

    window.navCustomizer = function(dir) {
        cState.step += dir;
        if (cState.step < 1) cState.step = 1;
        if (cState.step > 6) cState.step = 6;
        updateCustomizerUI();
    };

    function buildSummary() {
        document.getElementById('cSumBase').textContent = cState.baseItem.name;
        document.getElementById('cSumBasePrice').textContent = '₹' + cState.basePrice;
        document.getElementById('cSumSize').textContent = 'Size: ' + cState.size;
        document.getElementById('cSumSizePrice').textContent = '+₹' + cState.sizePrice;
        document.getElementById('cSumFlavor').textContent = cState.flavor + ' / ' + cState.frosting;
        
        if (cState.toppings.length > 0) {
            document.getElementById('cSumToppingsList').textContent = cState.toppings.map(t=>t.name).join(', ');
            document.getElementById('cSumToppingsPrice').textContent = '+₹' + cState.toppingsPrice;
        } else {
            document.getElementById('cSumToppingsList').textContent = 'No Toppings';
            document.getElementById('cSumToppingsPrice').textContent = '+₹0';
        }

        if (cState.message.trim() !== '') {
            document.getElementById('cSumMessageRow').style.display = 'flex';
            document.getElementById('cSumMessageText').textContent = cState.message;
        } else {
            document.getElementById('cSumMessageRow').style.display = 'none';
        }

        document.getElementById('cSumTotal').textContent = '₹' + updateCustomizerPrice();
    }

    function spawnConfetti() {
        for(let i=0; i<30; i++){
            let c = document.createElement('div');
            c.className = 'confetti';
            c.style.left = Math.random() * 100 + 'vw';
            c.style.animationDuration = (Math.random() * 2 + 2) + 's';
            c.style.backgroundColor = ['#B76E79', '#FFF59D', '#81D4FA', '#F48FB1'][Math.floor(Math.random()*4)];
            document.body.appendChild(c);
            setTimeout(() => c.remove(), 4000);
        }
    }

    window.finalizeCustomCake = function() {
        spawnConfetti();
        const customName = `${cState.baseItem.name} (${cState.size}, ${cState.flavor})`;
        const finalPrice = cState.basePrice + cState.sizePrice + cState.toppingsPrice;
        const uniqueId = cState.baseItem.id + '_' + Date.now();

        let details = [cState.frosting + ' Frosting'];
        if (cState.toppings.length > 0) details.push(cState.toppings.map(t=>t.name).join(', '));
        if (cState.message.trim()) details.push(`Msg: "${cState.message}"`);

        const cartArray = getCart();
        cartArray.push({
            id: uniqueId,
            name: customName,
            price: finalPrice,
            emoji: cState.baseItem.emoji,
            quantity: 1,
            details: details.join(' | ')
        });
        
        saveCart(cartArray);
        updateCartUI();
        
        setTimeout(() => {
            closeCakeCustomizer();
            toggleCartSidebar(); // Open cart to show it
        }, 1200);
    };

    // ==========================================
    // GIFT & OCCASION PLANNER
    // ==========================================
    const giftPlannerHTML = `
    <div id="giftPlannerOverlay" class="gp-overlay">
        <div class="gp-container">
            <button class="gp-close-btn" onclick="closeGiftPlanner()">&times;</button>
            <div class="gp-header">
                <h2>🎁 Gift & Occasion Planner</h2>
                <div class="gp-progress-wrapper">
                    <div class="gp-progress-bar" id="gpProgressBar"></div>
                </div>
                <span class="gp-step-text" id="gpStepText">Step 1 of 7: Choose Occasion</span>
            </div>
            <div class="gp-content">
                <!-- Step 1: Occasion -->
                <div class="gp-step active" id="gpStep1">
                    <h3 class="gp-step-title">🎉 What are we celebrating?</h3>
                    <div class="occasion-grid">
                        <div class="occasion-card" style="background:#FFEbee;" onclick="setGPOccasion('Birthday', this)">
                            <div class="occasion-check">✓</div>
                            <span class="occasion-emoji">🎂</span><span class="occasion-name">Birthday</span>
                        </div>
                        <div class="occasion-card" style="background:#FCE4EC;" onclick="setGPOccasion('Anniversary', this)">
                            <div class="occasion-check">✓</div>
                            <span class="occasion-emoji">💍</span><span class="occasion-name">Anniversary</span>
                        </div>
                        <div class="occasion-card" style="background:#E3F2FD;" onclick="setGPOccasion('Baby Shower', this)">
                            <div class="occasion-check">✓</div>
                            <span class="occasion-emoji">👶</span><span class="occasion-name">Baby Shower</span>
                        </div>
                        <div class="occasion-card" style="background:#F3E5F5;" onclick="setGPOccasion('Wedding', this)">
                            <div class="occasion-check">✓</div>
                            <span class="occasion-emoji">💑</span><span class="occasion-name">Wedding</span>
                        </div>
                        <div class="occasion-card" style="background:#E8F5E9;" onclick="setGPOccasion('Graduation', this)">
                            <div class="occasion-check">✓</div>
                            <span class="occasion-emoji">🎓</span><span class="occasion-name">Graduation</span>
                        </div>
                        <div class="occasion-card" style="background:#FFEB3B1A;" onclick="setGPOccasion('Valentine', this)">
                            <div class="occasion-check">✓</div>
                            <span class="occasion-emoji">💝</span><span class="occasion-name">Valentine's Day</span>
                        </div>
                        <div class="occasion-card" style="background:#FFF3E0;" onclick="setGPOccasion('Housewarming', this)">
                            <div class="occasion-check">✓</div>
                            <span class="occasion-emoji">🏠</span><span class="occasion-name">Housewarming</span>
                        </div>
                        <div class="occasion-card" style="background:#FBE9E7;" onclick="setGPOccasion('Just Because', this)">
                            <div class="occasion-check">✓</div>
                            <span class="occasion-emoji">🎊</span><span class="occasion-name">Just Because</span>
                        </div>
                    </div>
                </div>

                <!-- Step 2: Person -->
                <div class="gp-step" id="gpStep2">
                    <h3 class="gp-step-title">👤 Tell us about the recipient</h3>
                    <div class="person-group">
                        <span class="person-label">Who is this for?</span>
                        <div class="radio-chips">
                            <div class="radio-chip selected" onclick="setGPRadio('recipient', 'Him', this)">👨 Him</div>
                            <div class="radio-chip" onclick="setGPRadio('recipient', 'Her', this)">👩 Her</div>
                            <div class="radio-chip" onclick="setGPRadio('recipient', 'Child', this)">👧 Child</div>
                            <div class="radio-chip" onclick="setGPRadio('recipient', 'Couple', this)">👫 Couple</div>
                            <div class="radio-chip" onclick="setGPRadio('recipient', 'Office', this)">🏢 Office/Team</div>
                        </div>
                    </div>
                    <div class="person-group">
                        <span class="person-label">Age Group: <span id="gpAgeDisplay" style="color:var(--text-muted);font-weight:normal;">Adult</span></span>
                        <input type="range" class="budget-slider" min="1" max="5" value="4" oninput="updateGPAge(this.value)" style="background:var(--rose-gold)">
                        <div style="display:flex;justify-content:space-between;margin-top:0.5rem;font-size:0.8rem;color:#888;">
                            <span>Baby</span><span>Kid</span><span>Teen</span><span>Adult</span><span>Senior</span>
                        </div>
                    </div>
                    <div class="person-group">
                        <span class="person-label">Dietary Preferences (Optional)</span>
                        <div class="radio-chips">
                            <div class="radio-chip" onclick="toggleGPDiet('Vegetarian', this)">🌱 Vegetarian</div>
                            <div class="radio-chip" onclick="toggleGPDiet('Nut Free', this)">🚫🥜 Nut Free</div>
                            <div class="radio-chip" onclick="toggleGPDiet('Sugar Free', this)">🍬 Sugar Free</div>
                            <div class="radio-chip" onclick="toggleGPDiet('Gluten Free', this)">🌾 Gluten Free</div>
                        </div>
                    </div>
                </div>

                <!-- Step 3: Budget -->
                <div class="gp-step" id="gpStep3">
                    <h3 class="gp-step-title">💰 Set Your Budget</h3>
                    <div class="budget-wrapper" id="gpBudgetWrapper" style="background:#FFF3E0">
                        <div class="budget-display" id="gpBudgetDisplay" style="color:#E65100">₹1000 - ₹2000</div>
                        <div class="budget-label-text" id="gpBudgetLabel">"Premium Gift"</div>
                        <input type="range" class="budget-slider" min="1" max="4" value="3" oninput="updateGPBudget(this.value)" id="gpBudgetSlider">
                        <div style="display:flex;justify-content:space-between;margin-top:1rem;font-size:0.85rem;color:#888;">
                            <span>&lt;₹500</span><span>₹1000</span><span>₹2000</span><span>&gt;₹2000</span>
                        </div>
                    </div>
                </div>

                <!-- Step 4: Delivery -->
                <div class="gp-step" id="gpStep4">
                    <h3 class="gp-step-title">📅 Delivery Details</h3>
                    <input type="date" class="gp-input" id="gpDate">
                    <select class="gp-input" id="gpTimeSlot">
                        <option value="Morning">Morning (9 AM - 12 PM)</option>
                        <option value="Afternoon">Afternoon (12 PM - 4 PM)</option>
                        <option value="Evening">Evening (4 PM - 8 PM)</option>
                    </select>
                    <div class="radio-chips" style="margin-bottom:1rem;">
                        <div class="radio-chip selected" onclick="setGPRadio('deliveryType', 'Home Delivery', this)">🏠 Home Delivery</div>
                        <div class="radio-chip" onclick="setGPRadio('deliveryType', 'Store Pickup', this)">🏪 Store Pickup</div>
                    </div>
                    <label style="display:flex;align-items:center;gap:0.5rem;font-weight:600;cursor:pointer;">
                        <input type="checkbox" id="gpSurprise" style="width:20px;height:20px;accent-color:var(--rose-gold);">
                        🎁 Keep it a surprise (don't call recipient before delivery)
                    </label>
                </div>

                <!-- Step 5: Recommendations -->
                <div class="gp-step" id="gpStep5">
                    <h3 class="gp-step-title">✨ Recommended for You</h3>
                    <div class="rec-grid" id="gpRecGrid">
                        <!-- Injected via JS -->
                    </div>
                </div>

                <!-- Step 6: Extras -->
                <div class="gp-step" id="gpStep6">
                    <h3 class="gp-step-title">🎀 Add Gift Wrapping & Card</h3>
                    <div class="wrap-grid">
                        <div class="wrap-card selected" onclick="setGPWrap('None', 0, this)">
                            <div style="font-size:2rem;">📦</div>
                            <div style="font-weight:700;">No Wrapping</div>
                            <div style="color:var(--text-muted)">Free</div>
                        </div>
                        <div class="wrap-card" onclick="setGPWrap('Standard Pink Box', 49, this)">
                            <div style="font-size:2rem;">🎀</div>
                            <div style="font-weight:700;">Pink Box</div>
                            <div style="color:var(--rose-gold)">+₹49</div>
                        </div>
                        <div class="wrap-card" onclick="setGPWrap('Premium Gold Box', 99, this)">
                            <div style="font-size:2rem;">✨</div>
                            <div style="font-weight:700;">Gold Box</div>
                            <div style="color:var(--rose-gold)">+₹99</div>
                        </div>
                        <div class="wrap-card" onclick="setGPWrap('Luxury Hamper Basket', 199, this)">
                            <div style="font-size:2rem;">💝</div>
                            <div style="font-weight:700;">Luxury Hamper</div>
                            <div style="color:var(--rose-gold)">+₹199</div>
                        </div>
                    </div>
                    <span class="person-label">Personalized Greeting Card</span>
                    <textarea class="gp-input" id="gpCardMsg" rows="3" placeholder="Write your heartfelt message here (max 100 chars)..." maxlength="100" oninput="updateGPCardPreview()"></textarea>
                    <div class="card-preview-box" id="gpCardPreview" style="background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);">
                        Your message will appear here
                    </div>
                </div>

                <!-- Summary -->
                <div class="gp-step" id="gpStep7">
                    <div class="gp-summary">
                        <div class="summary-confetti">🎉</div>
                        <h3 style="color:var(--chocolate);margin-bottom:0.5rem;" id="gpSumTitle">Perfect Choice!</h3>
                        <div class="summary-box">
                            <div class="summary-row">
                                <span><strong id="gpSumPkgName">Package Name</strong></span>
                                <span id="gpSumPkgPrice">₹0</span>
                            </div>
                            <div class="summary-row" style="color:var(--text-muted);font-size:0.9rem;">
                                <span id="gpSumPkgItems">Items list...</span>
                            </div>
                            <div class="summary-row" style="margin-top:1rem;">
                                <span>Gift Wrapping (<span id="gpSumWrapName">None</span>)</span>
                                <span id="gpSumWrapPrice">+₹0</span>
                            </div>
                            <div class="summary-row" id="gpSumMsgRow">
                                <span>Greeting Card Message</span>
                                <span>Included</span>
                            </div>
                            <div class="summary-total">
                                <span>Grand Total:</span>
                                <span id="gpSumTotal">₹0</span>
                            </div>
                            <div style="margin-top:1rem;color:var(--rose-gold);font-weight:bold;text-align:center;">
                                Delivery: <span id="gpSumDelText">Tomorrow</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="gp-footer">
                <button class="btn secondary-btn" id="gpBtnBack" onclick="navGiftPlanner(-1)" style="visibility:hidden;">Back</button>
                <button class="btn primary-btn" id="gpBtnNext" onclick="navGiftPlanner(1)">Next Step</button>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', giftPlannerHTML);

    let gpState = {
        step: 1,
        occasion: '',
        recipient: 'Him',
        age: 'Adult',
        diet: [],
        budgetLvl: 3,
        date: '',
        time: 'Morning',
        deliveryType: 'Home Delivery',
        surprise: false,
        pkgId: null,
        pkgName: '',
        pkgItems: '',
        pkgPrice: 0,
        wrapName: 'None',
        wrapPrice: 0,
        message: ''
    };

    window.openGiftPlanner = function(e) {
        if(e) e.preventDefault();
        gpState.step = 1;
        updateGPUI();
        document.getElementById('giftPlannerOverlay').classList.add('active');
    };

    window.closeGiftPlanner = function() {
        document.getElementById('giftPlannerOverlay').classList.remove('active');
    };

    window.setGPOccasion = function(occ, el) {
        document.querySelectorAll('.occasion-card').forEach(c => c.classList.remove('selected'));
        el.classList.add('selected');
        gpState.occasion = occ;
    };

    window.setGPRadio = function(field, val, el) {
        const parent = el.closest('.radio-chips');
        parent.querySelectorAll('.radio-chip').forEach(c => c.classList.remove('selected'));
        el.classList.add('selected');
        gpState[field] = val;
    };

    window.updateGPAge = function(val) {
        const ages = {1:'Baby', 2:'Kid', 3:'Teen', 4:'Adult', 5:'Senior'};
        gpState.age = ages[val];
        document.getElementById('gpAgeDisplay').innerText = gpState.age;
    };

    window.toggleGPDiet = function(val, el) {
        el.classList.toggle('selected');
        if(gpState.diet.includes(val)) {
            gpState.diet = gpState.diet.filter(d => d !== val);
        } else {
            gpState.diet.push(val);
        }
    };

    window.updateGPBudget = function(val) {
        gpState.budgetLvl = parseInt(val);
        const disp = document.getElementById('gpBudgetDisplay');
        const label = document.getElementById('gpBudgetLabel');
        const wrap = document.getElementById('gpBudgetWrapper');
        
        if(val == 1) { disp.innerText = 'Under ₹500'; label.innerText = 'Sweet & Simple'; wrap.style.background = '#E8F5E9'; disp.style.color = '#2E7D32'; }
        if(val == 2) { disp.innerText = '₹500 - ₹1000'; label.innerText = 'Thoughtful Treat'; wrap.style.background = '#FFFDE7'; disp.style.color = '#F57F17'; }
        if(val == 3) { disp.innerText = '₹1000 - ₹2000'; label.innerText = 'Premium Gift'; wrap.style.background = '#FFF3E0'; disp.style.color = '#E65100'; }
        if(val == 4) { disp.innerText = 'Above ₹2000'; label.innerText = 'Grand Celebration'; wrap.style.background = '#FFEBEE'; disp.style.color = '#C62828'; }
    };

    function getRecommendations() {
        // Smart hardcoded suggestions based on occ and recipient
        const occ = gpState.occasion;
        const rec = gpState.recipient;
        let combos = [];
        
        if(occ === 'Birthday' && rec === 'Her') {
            combos.push({id:'pkg1', name: 'Birthday Queen Package 👑', items: '1kg Strawberry Cake + Edible Roses + Pink Box + Greeting Card', price: 1299, emoji: '🎂🌸', save: 200});
        } else if(occ === 'Anniversary' && rec === 'Couple') {
            combos.push({id:'pkg2', name: 'Love Story Combo 💕', items: 'Red Velvet Cake + Premium Chocolate Box + Gold Dust + Message Card', price: 1899, emoji: '🍰🍫', save: 300});
        } else if(occ === 'Baby Shower') {
            combos.push({id:'pkg3', name: "Little One's Delight 👶", items: 'Vanilla Cupcakes (12) + Fruit Toppings + Pastel Theme Box', price: 899, emoji: '🧁🍼', save: 150});
        } else if(occ === 'Graduation') {
            combos.push({id:'pkg4', name: 'Achievement Unlocked 🎓', items: 'Custom Message Cake (1kg) + Pastry Box + Party Poppers', price: 1499, emoji: '🎂🎉', save: 250});
        } else if(occ === 'Valentine') {
            combos.push({id:'pkg5', name: 'Sweet Love Box 💝', items: 'Heart Shaped Chocolate Cake + Truffles + Red Rose', price: 1199, emoji: '❤️🍫', save: 200});
        } else if(rec === 'Office') {
            combos.push({id:'pkg6', name: 'Team Celebration Pack 🏢', items: '2kg Black Forest Cake + 12 Pastries + Cold Drinks', price: 2499, emoji: '🎂🥤', save: 400});
        }
        
        // Fallbacks
        if(combos.length === 0) {
            combos.push({id:'pkg7', name: 'The Classic Celebration 🎉', items: '1kg Chocolate Truffle Cake + Birthday Candles + Sparklers', price: 999, emoji: '🍫✨', save: 100});
            combos.push({id:'pkg8', name: 'Premium Sweet Tooth 🍬', items: '1kg Signature Cake + 6 Assorted Pastries + Deluxe Box', price: 1599, emoji: '🍰🍪', save: 250});
        }
        return combos;
    }

    function renderRecommendations() {
        const grid = document.getElementById('gpRecGrid');
        grid.innerHTML = '';
        const combos = getRecommendations();
        
        combos.forEach((c, idx) => {
            const el = document.createElement('div');
            el.className = 'rec-card';
            el.innerHTML = `
                <div class="rec-badge">Save ₹${c.save}</div>
                <div class="rec-collage">${c.emoji}</div>
                <div class="rec-title">${c.name}</div>
                <div class="rec-items">${c.items}</div>
                <div class="rec-price">₹${c.price}</div>
                <button class="btn primary-btn btn-choose-pkg" onclick="chooseGPPkg('${c.id}', '${c.name}', '${c.items}', ${c.price}, this)">
                    Choose This Package
                </button>
            `;
            grid.appendChild(el);
            setTimeout(() => el.classList.add('show'), 100 * idx);
        });
    }

    window.chooseGPPkg = function(id, name, items, price, btn) {
        document.querySelectorAll('.btn-choose-pkg').forEach(b => {
            b.innerText = 'Choose This Package';
            b.classList.remove('secondary-btn');
            b.classList.add('primary-btn');
        });
        
        btn.innerText = '✓ Selected';
        btn.classList.remove('primary-btn');
        btn.classList.add('secondary-btn');
        
        // Heart animation
        let heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerText = '❤️';
        heart.style.left = '50%';
        heart.style.top = '10%';
        btn.appendChild(heart);
        setTimeout(()=>heart.remove(), 1000);

        gpState.pkgId = id;
        gpState.pkgName = name;
        gpState.pkgItems = items;
        gpState.pkgPrice = price;
    };

    window.setGPWrap = function(name, price, el) {
        document.querySelectorAll('.wrap-card').forEach(c => c.classList.remove('selected'));
        el.classList.add('selected');
        gpState.wrapName = name;
        gpState.wrapPrice = price;
    };

    window.updateGPCardPreview = function() {
        const msg = document.getElementById('gpCardMsg').value;
        gpState.message = msg;
        const p = document.getElementById('gpCardPreview');
        p.innerText = msg.trim() === '' ? 'Your message will appear here' : msg;
    };

    window.navGiftPlanner = function(dir) {
        if(dir === 1) {
            if(gpState.step === 1 && !gpState.occasion) return alert('Please choose an occasion!');
            if(gpState.step === 5 && !gpState.pkgId) return alert('Please choose a package to continue!');
            if(gpState.step === 4) {
                gpState.date = document.getElementById('gpDate').value;
                gpState.time = document.getElementById('gpTimeSlot').value;
                gpState.surprise = document.getElementById('gpSurprise').checked;
                if(!gpState.date) return alert('Please select a delivery date!');
            }
        }
        
        gpState.step += dir;
        
        if(gpState.step === 5 && dir === 1) renderRecommendations();
        if(gpState.step === 7) buildGPSummary();
        
        if (gpState.step > 7) {
            addGiftToCart();
            return;
        }
        updateGPUI();
    };

    function updateGPUI() {
        document.querySelectorAll('.gp-step').forEach(s => s.classList.remove('active'));
        document.getElementById('gpStep' + gpState.step).classList.add('active');
        
        document.getElementById('gpProgressBar').style.width = ((gpState.step / 7) * 100) + '%';
        const titles = ['Choose Occasion', 'Recipient Profile', 'Set Budget', 'Delivery Details', 'Recommendations', 'Gift Wrap & Card', 'Summary'];
        document.getElementById('gpStepText').innerText = `Step ${gpState.step} of 7: ${titles[gpState.step-1]}`;
        
        document.getElementById('gpBtnBack').style.visibility = gpState.step === 1 ? 'hidden' : 'visible';
        
        const nextBtn = document.getElementById('gpBtnNext');
        if(gpState.step === 7) {
            nextBtn.innerHTML = 'Add to Cart 🛒';
            nextBtn.style.background = '#2E7D32';
        } else {
            nextBtn.innerHTML = 'Next Step';
            nextBtn.style.background = 'var(--rose-gold)';
        }
    }

    function buildGPSummary() {
        document.getElementById('gpSumPkgName').innerText = gpState.pkgName;
        document.getElementById('gpSumPkgPrice').innerText = '₹' + gpState.pkgPrice;
        document.getElementById('gpSumPkgItems').innerText = gpState.pkgItems;
        document.getElementById('gpSumWrapName').innerText = gpState.wrapName;
        document.getElementById('gpSumWrapPrice').innerText = '+₹' + gpState.wrapPrice;
        
        if(gpState.message.trim() !== '') {
            document.getElementById('gpSumMsgRow').style.display = 'flex';
        } else {
            document.getElementById('gpSumMsgRow').style.display = 'none';
        }
        
        const total = gpState.pkgPrice + gpState.wrapPrice;
        document.getElementById('gpSumTotal').innerText = '₹' + total;
        
        const dType = gpState.deliveryType === 'Store Pickup' ? 'Pickup' : 'Delivery';
        document.getElementById('gpSumDelText').innerText = `${dType} on ${gpState.date} (${gpState.time})` + (gpState.surprise ? ' 🎁 Surprise' : '');
    }

    function addGiftToCart() {
        const cartArray = getCart();
        const total = gpState.pkgPrice + gpState.wrapPrice;
        const details = [
            `For ${gpState.recipient} (${gpState.age})`,
            gpState.wrapName !== 'None' ? gpState.wrapName : null,
            gpState.message.trim() ? `Msg: "${gpState.message}"` : null,
            `${gpState.date} ${gpState.time}`
        ].filter(Boolean).join(' | ');

        cartArray.push({
            id: 'gp_' + Date.now(),
            name: gpState.pkgName + ' (Gift Combo)',
            price: total,
            emoji: '🎁',
            quantity: 1,
            details: details
        });
        
        saveCart(cartArray);
        updateCartUI();
        
        closeGiftPlanner();
        toggleCartSidebar();
    }

});
