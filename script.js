// ==================================================================================
// --- 1. DATA MENU RESTORAN & INISIALISASI ---
// ==================================================================================
const menuItems = [
    { id: 1, name: "Sate Taichan Ayam", price: 25000, category: "Makanan Utama", desc: "10 tusuk sate ayam tanpa bumbu kacang, disajikan dengan sambal pedas dan jeruk limau.", image: "https://images.unsplash.com/photo-1598929550302-39c8945f3c5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=80&w=400" },
    { id: 2, name: "Sate Taichan Kulit", price: 28000, category: "Makanan Utama", desc: "10 tusuk sate kulit ayam yang dibakar hingga garing, dengan sambal spesial.", image: "https://images.unsplash.com/photo-1544025166-f08985149303?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=80&w=400" },
    { id: 3, name: "Nasi Putih", price: 5000, category: "Pelengkap", desc: "Nasi putih pulen, cocok untuk pendamping sate.", image: "https://images.unsplash.com/photo-1572656631137-79352973ffa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=80&w=400" },
    { id: 4, name: "Es Teh Manis", price: 8000, category: "Minuman", desc: "Teh segar dengan es dan pemanis.", image: "https://images.unsplash.com/photo-1627796531195-2364c7d2427f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=80&w=400" },
    { id: 5, name: "Air Mineral", price: 5000, category: "Minuman", desc: "Air minum kemasan 600ml.", image: "https://images.unsplash.com/photo-1588665773229-3c35b80a1843?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=80&w=400" },
    { id: 6, name: "Kentang Goreng", price: 15000, category: "Pelengkap", desc: "Kentang goreng renyah disajikan dengan saus tomat.", image: "https://images.unsplash.com/photo-1606716298585-bc999330a6c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=80&w=400" }
];

// Inisialisasi Keranjang Belanja dari Local Storage
let cart = JSON.parse(localStorage.getItem('restokitaCart')) || [];

// Konstanta WhatsApp (Ganti dengan nomor dan pesan Anda)
const WHATSAPP_NUMBER = "6281234567890"; // Ganti dengan nomor WhatsApp Restoran Anda
const RESTAURANT_NAME = "RestoKita Sate Taichan";

// ----------------------------------------------------------------------------------
// --- 2. FUNGSI KERANJANG DAN LOGIKA BISNIS ---
// ----------------------------------------------------------------------------------

/**
 * Menyimpan data keranjang ke Local Storage.
 */
function saveCart() {
    localStorage.setItem('restokitaCart', JSON.stringify(cart));
}

/**
 * Memperbarui tampilan keranjang belanja (modal) dan ikon keranjang (navbar).
 */
function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartCountElement = document.getElementById('cart-count');
    const emptyCartElement = document.getElementById('empty-cart');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Kosongkan container item keranjang
    if (cartItemsContainer) cartItemsContainer.innerHTML = '';
    
    let total = 0;
    let itemCount = 0;

    if (cart.length === 0) {
        if (emptyCartElement) emptyCartElement.classList.remove('hidden');
        if (checkoutBtn) checkoutBtn.disabled = true;
    } else {
        if (emptyCartElement) emptyCartElement.classList.add('hidden');
        if (checkoutBtn) checkoutBtn.disabled = false;

        cart.forEach(item => {
            const subtotal = item.price * item.quantity;
            total += subtotal;
            itemCount += item.quantity;

            const cartItemHTML = `
                <div class="flex items-center justify-between border-b border-gray-100 py-3">
                    <div class="flex items-center space-x-3">
                        <div class="font-semibold text-gray-800">${item.name}</div>
                        <div class="text-sm text-gray-500">x${item.quantity}</div>
                    </div>
                    <div class="flex items-center space-x-3">
                        <span class="font-bold text-orange-600 min-w-[70px] text-right">Rp ${subtotal.toLocaleString('id-ID')}</span>
                        <button onclick="removeFromCart(${item.id}, true)" class="p-1 text-red-500 hover:text-red-700 transition-colors" title="Hapus item ini">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
            `;
            if (cartItemsContainer) cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
        });
    }
    
    // Perbarui total dan hitungan di Navbar
    if (cartTotalElement) cartTotalElement.textContent = `Rp ${total.toLocaleString('id-ID')}`;
    if (cartCountElement) {
        cartCountElement.textContent = itemCount;
        if (itemCount > 0) {
            cartCountElement.classList.remove('hidden');
        } else {
            cartCountElement.classList.add('hidden');
        }
    }
    
    // Pastikan ikon lucide di modal di-render
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        // Hanya render ikon yang ada di modal (perbaikan: hanya render ulang bagian keranjang)
        const modalElement = document.getElementById('cart-modal');
        if (modalElement) lucide.createIcons({ scope: modalElement });
    }
}

/**
 * Menambahkan item ke keranjang atau menambah kuantitasnya.
 * @param {number} itemId - ID item menu yang akan ditambahkan.
 */
function addToCart(itemId) {
    const selectedItem = menuItems.find(item => item.id === itemId);
    if (!selectedItem) return;

    const existingItemIndex = cart.findIndex(item => item.id === itemId);

    if (existingItemIndex > -1) {
        // Item sudah ada, tambah kuantitas
        cart[existingItemIndex].quantity += 1;
    } else {
        // Item baru, tambahkan ke keranjang
        // Kita hanya menyimpan data penting ke keranjang, bukan seluruh objek menu
        cart.push({ 
            id: selectedItem.id, 
            name: selectedItem.name, 
            price: selectedItem.price, 
            quantity: 1 
        });
    }

    saveCart();
    updateCartUI();
    // Tampilkan notifikasi (opsional, bisa diganti dengan animasi)
    console.log(`${selectedItem.name} ditambahkan ke keranjang!`);
}

/**
 * Menghapus item dari keranjang (mengurangi kuantitas atau menghapus seluruh item).
 * @param {number} itemId - ID item yang akan dihapus.
 * @param {boolean} removeAll - Jika true, hapus semua kuantitas item ini.
 */
function removeFromCart(itemId, removeAll = false) {
    const existingItemIndex = cart.findIndex(item => item.id === itemId);

    if (existingItemIndex > -1) {
        if (removeAll || cart[existingItemIndex].quantity <= 1) {
            // Hapus item dari array jika kuantitasnya 1 atau removeAll=true
            cart.splice(existingItemIndex, 1);
        } else {
            // Kurangi kuantitas
            cart[existingItemIndex].quantity -= 1;
        }
    }

    saveCart();
    updateCartUI();
}

/**
 * Menghasilkan tautan WhatsApp dengan daftar pesanan.
 */
function generateWhatsAppLink() {
    let orderList = cart.map(item => {
        // Gunakan nama dan harga dari item yang tersimpan di keranjang
        const priceDisplay = item.price.toLocaleString('id-ID');
        return `*${item.quantity}x* ${item.name} (Rp ${priceDisplay}/item)`;
    }).join('\n');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalDisplay = total.toLocaleString('id-ID');
    
    let message = `*Halo ${RESTAURANT_NAME},*
Saya ingin melakukan pemesanan berikut:

${orderList}

*Total Pesanan:* Rp ${totalDisplay}

Mohon konfirmasi pesanan saya. Terima kasih!`;
    
    // URL-encode pesan untuk WhatsApp
    const encodedMessage = encodeURIComponent(message);
    
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

/**
 * Membuka jendela WhatsApp untuk checkout.
 */
function openWhatsApp() {
    if (cart.length === 0) {
        alert("Keranjang Anda masih kosong. Silakan tambahkan menu terlebih dahulu.");
        return;
    }
    window.open(generateWhatsAppLink(), '_blank');
}


// ----------------------------------------------------------------------------------
// --- 3. FUNGSI RENDER TAMPILAN ---
// ----------------------------------------------------------------------------------

/**
 * Menghasilkan kartu menu ke dalam elemen #menu-grid.
 */
function generateMenu() {
    const menuGrid = document.getElementById('menu-grid');
    if (!menuGrid) return;

    menuGrid.innerHTML = ''; // Kosongkan dulu

    menuItems.forEach(item => {
        const itemHTML = `
            <div class="bg-white rounded-2xl shadow-xl overflow-hidden transform transition duration-500 hover:scale-[1.02] card-hover">
                <div class="h-48 w-full overflow-hidden">
                    <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover transition duration-300 hover:opacity-90">
                </div>
                <div class="p-6">
                    <div class="text-sm font-semibold text-orange-600 mb-1">${item.category}</div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-2">${item.name}</h3>
                    <p class="text-gray-600 mb-4 h-12 overflow-hidden">${item.desc}</p>
                    <div class="flex items-center justify-between">
                        <span class="text-2xl font-bold text-orange-700">Rp ${item.price.toLocaleString('id-ID')}</span>
                        <button onclick="addToCart(${item.id})" class="btn-primary text-white px-6 py-2 rounded-full font-semibold transition-colors shadow-md hover:shadow-lg">
                            <i data-lucide="plus" class="w-5 h-5 inline mr-1"></i> Tambah
                        </button>
                    </div>
                </div>
            </div>
        `;
        menuGrid.insertAdjacentHTML('beforeend', itemHTML);
    });

    // Pastikan ikon lucide di menu di-render
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

/**
 * Menghasilkan QR Code untuk link WhatsApp.
 */
function generateQRCode() {
    const qrCodeContainer = document.getElementById('qr-code');
    if (!qrCodeContainer) return;
    
    // Bersihkan container dari elemen sebelumnya
    qrCodeContainer.innerHTML = '';
    
    const waLink = `https://wa.me/${WHATSAPP_NUMBER}`;

    // Menggunakan library qrcode.js (dipastikan sudah diimpor melalui CDN di HTML)
    if (typeof QRCode !== 'undefined') {
        try {
            const canvas = document.createElement('canvas');
            qrCodeContainer.appendChild(canvas);

            QRCode.toCanvas(canvas, waLink, {
                errorCorrectionLevel: 'H',
                width: 200,
                color: {
                    dark: '#000000',
                    light: '#ffffff'
                }
            }, function (error) {
                if (error) console.error("Error generating QR code:", error);
            });
        } catch (e) {
            console.error("Gagal membuat QR Code:", e);
            qrCodeContainer.innerHTML = `<p class="text-red-500">Gagal memuat QR Code. Silakan klik tombol di bawah.</p>`;
        }
    } else {
         qrCodeContainer.innerHTML = `<p class="text-red-500">Library QR Code tidak dimuat. Silakan klik tombol di bawah.</p>`;
    }
}


// ----------------------------------------------------------------------------------
// --- 4. INITIALIZATION & EVENT LISTENERS ---
// ----------------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function() {
    // 4.1. Initial Render
    generateMenu();
    updateCartUI(); // Pastikan keranjang di navbar terupdate

    // 4.2. Element References
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const cartBtn = document.getElementById('cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.getElementById('close-cart');
    const cartOverlay = document.getElementById('cart-overlay');
    const waFloat = document.getElementById('wa-float');
    
    const qrBtn = document.getElementById('qr-btn'); 
    const qrModal = document.getElementById('qr-modal');
    const closeQR = document.getElementById('close-qr');
    const qrOverlay = document.getElementById('qr-overlay');
    const directWaBtn = document.getElementById('direct-wa'); 

    const pesanSekarangBtn = document.getElementById('nav-pesan-sekarang'); 
    const pesanSekarangMobileBtn = document.getElementById('nav-pesan-sekarang-mobile'); 
    
    const checkoutBtn = document.getElementById('checkout-btn');
    const openMapsBtn = document.getElementById('open-maps-btn'); 
    const scrollTopBtn = document.getElementById('scroll-top');
    const navbar = document.getElementById('navbar');


    // 4.3. Mobile Menu Toggle
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // 4.4. Cart Modal Handlers
    const openCartModal = () => {
        if (cartModal) cartModal.classList.remove('hidden');
        updateCartUI(); // Perbarui konten keranjang setiap kali dibuka
    };

    if (cartBtn) cartBtn.addEventListener('click', openCartModal);
    if (closeCart) closeCart.addEventListener('click', () => { if (cartModal) cartModal.classList.add('hidden'); });
    if (cartOverlay) cartOverlay.addEventListener('click', () => { if (cartModal) cartModal.classList.add('hidden'); });

    // 4.5. WhatsApp/QR Modal Handlers
    const openQrModal = () => {
        if (qrModal) {
            generateQRCode(); // Buat QR code setiap kali modal dibuka
            qrModal.classList.remove('hidden');
        } else {
            openWhatsApp(); // Fallback
        }
    };
    
    if (waFloat) waFloat.addEventListener('click', openQrModal);
    if (qrBtn) qrBtn.addEventListener('click', openQrModal); 
    
    if (closeQR) closeQR.addEventListener('click', () => { if (qrModal) qrModal.classList.add('hidden'); });
    if (qrOverlay) qrOverlay.addEventListener('click', () => { if (qrModal) qrModal.classList.add('hidden'); });
    
    // Event listener untuk tombol "Buka WhatsApp Langsung" di modal QR
    if (directWaBtn) directWaBtn.addEventListener('click', () => { 
        window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank');
        if (qrModal) qrModal.classList.add('hidden');
    });

    // 4.6. Checkout & Pesan Sekarang Handlers
    [pesanSekarangBtn, pesanSekarangMobileBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                openCartModal(); 
                if (mobileMenu) mobileMenu.classList.add('hidden');
            });
        }
    });

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length > 0) {
                openWhatsApp();
                if (cartModal) cartModal.classList.add('hidden');
            }
        });
    }

    // 4.7. Buka Maps (menggunakan tautan statis untuk contoh)
    if (openMapsBtn) {
        const defaultMapLink = "https://maps.app.goo.gl/YourRestaurantLocation"; // Ganti dengan link Google Maps Restoran Anda
        openMapsBtn.addEventListener('click', function() {
            window.open(defaultMapLink, '_blank');
        });
    }
    
    // 4.8. Scroll Effects (Navbar & Scroll to Top)
    if (navbar) {
        const toggleNavbarStyles = () => {
            const scrolled = window.scrollY > 100;

            if (scrolled) {
                navbar.classList.add('navbar-scrolled');
                navbar.classList.remove('glass-effect');
                // Perbaiki warna nama restoran saat di-scroll
                const nameElement = document.getElementById('navbar-restaurant-name');
                if (nameElement) nameElement.classList.remove('text-white');
            } else {
                navbar.classList.remove('navbar-scrolled');
                navbar.classList.add('glass-effect');
                 // Perbaiki warna nama restoran saat di atas
                const nameElement = document.getElementById('navbar-restaurant-name');
                if (nameElement) nameElement.classList.add('text-white');
            }
        };
        window.addEventListener('scroll', toggleNavbarStyles);
        toggleNavbarStyles(); 
    }

    if (scrollTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 4.9. Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Perbaikan: Smooth scroll tidak dijalankan jika link mengarah ke modal (e.g. Pesan Sekarang)
            if (href === '#menu' && (this.id.includes('pesan-sekarang'))) {
                 // Hanya menjalankan fungsionalitas tombol pesan sekarang (yaitu openCartModal)
                 return; 
            }
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Tutup mobile menu setelah klik link
                if (mobileMenu) mobileMenu.classList.add('hidden');
            }
        });
    });

    // 4.10. Final Initialization Ikon (PENTING!)
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
});
