// ==========================================
// SISTEM PENYIMPANAN OTOMATIS (LOCAL STORAGE)
// ==========================================

const defaultMenu = [
    { id: 1, name: "Taichan Original", category: "sate", price: 25000, desc: "10 Tusuk dada ayam fillet padat murni.", img: "https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=400", isBest: true },
    { id: 2, name: "Taichan Kulit", category: "sate", price: 20000, desc: "10 Tusuk kulit ayam crispy dan kenyal.", img: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400", isBest: true },
    { id: 3, name: "Es Teh Cendana", category: "minuman", price: 8000, desc: "Es teh manis wangi pandan alami.", img: "https://images.unsplash.com/photo-1486328228599-85db4443971f?w=400", isBest: false }
];
let menuItems = JSON.parse(localStorage.getItem('app_menu')) || defaultMenu;
let restoWaNumber = localStorage.getItem('app_wa') || "6281234567890";

let defaultGmaps = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.466840043823!2d106.82496411476906!3d-6.175392395529188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5d2e764b12d%3A0x3d2ad6e1e0e9bcc8!2sMonumen%20Nasional!5e0!3m2!1sid!2sid!4v1614742699863!5m2!1sid!2sid";
let restoGmapsUrl = localStorage.getItem('app_gmaps') || defaultGmaps;

const defaultVisi = "Menjadi pionir kedai sate taichan terpedas dan paling modern di Indonesia yang mengutamakan kualitas, kebersihan, dan kepuasan pelanggan melalui layanan digital.";
const defaultMisi = "1. Menyajikan daging ayam segar pilihan setiap hari.\n2. Meracik bumbu rahasia dengan tingkat kepedasan maksimal.\n3. Mengedepankan teknologi untuk mempermudah pesanan.";
let visiMisiData = JSON.parse(localStorage.getItem('app_visimisi')) || { visi: defaultVisi, misi: defaultMisi };

const defaultReviews = [
    { id: 1, name: "Dimas A.", rating: 5, text: "Gila pedesnya nampol banget! Dagingnya full nggak pelit. Langsung pesen lewat WA cepet." },
    { id: 2, name: "Siti Nurhaliza", rating: 4, text: "Satenya gurih, sambelnya juara. Mantap pokoknya!" }
];
let reviewsData = JSON.parse(localStorage.getItem('app_reviews')) || defaultReviews;

let cart = {};
let cActiveCategory = 'all'; 

// ==========================================
// INISIALISASI
// ==========================================
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('app-loader');
        if(loader) { loader.style.opacity = '0'; setTimeout(() => loader.remove(), 600); }
    }, 800); 
});

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    updateThemeIcons(document.documentElement.classList.contains('dark'));
    renderCustomerMenu(cActiveCategory); 
    renderCustomerReviews();
    renderVisiMisi();
    updateWaUI();
    updateGmapsUI(); 
});

function saveData(key, data) { localStorage.setItem(key, typeof data === 'string' ? data : JSON.stringify(data)); }

// ==========================================
// PENGATURAN INFO (WA, GMAPS, VISI MISI)
// ==========================================
function saveWaNumber(e) {
    e.preventDefault();
    let inputNum = document.getElementById('admin-wa-input').value;
    restoWaNumber = inputNum.replace(/[^0-9]/g, ''); 
    saveData('app_wa', restoWaNumber);
    updateWaUI();
    alert("Nomor WhatsApp berhasil diperbarui!");
}

function updateWaUI() {
    const adminInput = document.getElementById('admin-wa-input');
    if(adminInput) adminInput.value = restoWaNumber;
    const qrImg = document.getElementById('qr-code-img');
    if(qrImg) qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://wa.me/${restoWaNumber}&color=F97316`;
}

function saveGmaps(e) {
    e.preventDefault();
    restoGmapsUrl = document.getElementById('admin-gmaps-input').value;
    saveData('app_gmaps', restoGmapsUrl);
    updateGmapsUI();
    alert("Lokasi Google Maps berhasil diperbarui!");
}

function updateGmapsUI() {
    const adminInput = document.getElementById('admin-gmaps-input');
    if(adminInput) adminInput.value = restoGmapsUrl;
    const iframe = document.getElementById('c-gmaps-iframe');
    if(iframe) iframe.src = restoGmapsUrl;
}

function saveVisiMisi(e) {
    e.preventDefault();
    visiMisiData = { visi: document.getElementById('admin-visi-input').value, misi: document.getElementById('admin-misi-input').value };
    saveData('app_visimisi', visiMisiData);
    renderVisiMisi();
    alert("Visi & Misi berhasil disimpan!");
}

function renderVisiMisi() {
    document.getElementById('admin-visi-input').value = visiMisiData.visi;
    document.getElementById('admin-misi-input').value = visiMisiData.misi;
    const container = document.getElementById('c-visi-misi-content');
    if(container) {
        const misiHtml = visiMisiData.misi.replace(/\n/g, '<br>');
        container.innerHTML = `<div><p class="text-xs font-bold text-app-orange mb-2 uppercase tracking-wider">Visi</p><p class="text-sm dark:text-gray-300 font-medium leading-relaxed">${visiMisiData.visi}</p></div><div class="mt-4"><p class="text-xs font-bold text-app-orange mb-2 uppercase tracking-wider">Misi</p><p class="text-sm dark:text-gray-300 leading-relaxed">${misiHtml}</p></div>`;
    }
}

// ==========================================
// RATING & ULASAN
// ==========================================
function renderCustomerReviews() {
    const container = document.getElementById('c-reviews-list');
    if(!container) return;
    container.innerHTML = reviewsData.map(r => {
        let stars = '';
        for(let i=0; i<5; i++) { stars += `<i data-lucide="star" class="w-4 h-4 lg:w-5 lg:h-5 ${i < r.rating ? 'text-app-orange fill-current' : 'text-gray-300 dark:text-gray-600'}"></i>`; }
        return `<div class="min-w-[280px] max-w-[280px] bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 snap-center transform transition-transform hover:scale-105"><div class="flex mb-4 gap-1">${stars}</div><p class="text-sm text-gray-800 dark:text-gray-200 font-medium mb-4 leading-relaxed">"${r.text}"</p><p class="text-xs text-app-muted dark:text-gray-400 font-bold flex items-center gap-3"><span class="w-8 h-8 bg-orange-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-app-orange text-sm shadow-sm">${r.name.charAt(0)}</span> ${r.name}</p></div>`;
    }).join('');
    lucide.createIcons();
}

function renderAdminReviews() {
    document.getElementById('admin-reviews-table').innerHTML = reviewsData.map(r => `
        <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 transition-colors"><td class="p-5 font-bold">${r.name}</td><td class="p-5 text-app-orange font-bold">${r.rating} Bintang</td><td class="p-5"><p class="line-clamp-2 max-w-[200px] text-xs">${r.text}</p></td><td class="p-5 text-right"><button onclick="deleteReview(${r.id})" class="text-app-red hover:bg-red-50 dark:hover:bg-red-900/30 p-2.5 rounded-xl active-scale transition-colors"><i data-lucide="trash-2" class="w-5 h-5"></i></button></td></tr>
    `).join('');
    lucide.createIcons();
}

function openAddReviewModal() { document.getElementById('add-review-modal').classList.add('open'); }
function closeAddReviewModal() { document.getElementById('add-review-modal').classList.remove('open'); document.getElementById('form-add-review').reset(); }

function submitNewReview(e) {
    e.preventDefault();
    reviewsData.push({ id: Date.now(), name: document.getElementById('r-name').value, rating: parseInt(document.getElementById('r-rating').value), text: document.getElementById('r-text').value });
    saveData('app_reviews', reviewsData); closeAddReviewModal(); renderAdminReviews(); renderCustomerReviews();
    alert("Ulasan berhasil dipublish!");
}
function deleteReview(id) {
    if(confirm('Hapus ulasan ini dari Beranda?')) { reviewsData = reviewsData.filter(r => r.id !== id); saveData('app_reviews', reviewsData); renderAdminReviews(); renderCustomerReviews(); }
}

// ==========================================
// TEMA & WARNA
// ==========================================
function toggleTheme() {
    const html = document.documentElement; html.classList.toggle('dark');
    const isDark = html.classList.contains('dark'); localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcons(isDark);
}
function updateThemeIcons(isDark) {
    document.querySelectorAll('.theme-icon').forEach(icon => { icon.setAttribute('data-lucide', isDark ? 'sun' : 'moon'); });
    lucide.createIcons();
}

// ==========================================
// CUSTOMER NAV (FAB VERSION)
// ==========================================
function switchCustomer(viewName) {
    ['home', 'menu', 'qr'].forEach((v, i) => {
        const el = document.getElementById(`c-view-${v}`);
        if(!el) return;
        el.classList.remove('active', 'slide-left', 'slide-right');
        if (v === viewName) el.classList.add('active');
        else if (i < ['home', 'menu', 'qr'].indexOf(viewName)) el.classList.add('slide-left');
        else el.classList.add('slide-right');
    });
    document.querySelectorAll('.c-nav-desk').forEach(btn => {
        btn.classList.remove('active', 'text-app-orange', 'bg-orange-50', 'dark:bg-gray-700', 'dark:text-app-orange');
        if (btn.dataset.target === viewName) btn.classList.add('active', 'text-app-orange', 'bg-orange-50', 'dark:bg-gray-700', 'dark:text-app-orange');
    });
    document.querySelectorAll('.fab-nav-item').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.target === viewName) btn.classList.add('active');
    });
}

function toggleFab(e) { 
    if(e) e.stopPropagation(); 
    document.getElementById('c-fab-wrapper').classList.toggle('expanded'); 
}

// Menutup menu bulat melayang jika di klik sembarangan
document.addEventListener('click', (event) => {
    const fab = document.getElementById('c-fab-wrapper');
    if (fab && fab.classList.contains('expanded') && !fab.contains(event.target)) {
        fab.classList.remove('expanded');
    }
});

document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.cat-btn').forEach(t => { t.classList.remove('bg-gray-900', 'dark:bg-app-orange', 'text-white', 'active', 'shadow-md'); t.classList.add('bg-white', 'dark:bg-gray-800', 'text-gray-600', 'dark:text-gray-300'); });
        e.target.classList.remove('bg-white', 'dark:bg-gray-800', 'text-gray-600', 'dark:text-gray-300');
        e.target.classList.add('bg-gray-900', 'dark:bg-app-orange', 'text-white', 'active', 'shadow-md');
        cActiveCategory = e.target.dataset.category; renderCustomerMenu(cActiveCategory); 
    });
});

// PERBAIKAN: Layout card direkayasa agar teks tidak meluber keluar dari batas grid
function renderCustomerMenu(category) {
    const bestContainer = document.getElementById('bestseller-container');
    if(bestContainer) {
        bestContainer.innerHTML = menuItems.filter(i=>i.isBest).map(i => `
            <div class="min-w-[200px] max-w-[200px] bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden snap-center pb-4 flex flex-col cursor-pointer active-scale transition-all hover:shadow-md" onclick="addToCart(${i.id})">
                <div class="relative h-32 w-full"><img src="${i.img}" class="w-full h-full object-cover"><div class="absolute top-3 left-3 bg-app-red text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg shadow-md tracking-wider">HOT</div></div>
                <div class="px-5 pt-4"><h4 class="font-extrabold text-[15px] dark:text-white truncate">${i.name}</h4><p class="text-app-orange font-extrabold text-[15px] mt-1.5">Rp ${i.price.toLocaleString('id')}</p></div>
            </div>`).join('');
    }
    const filteredMenu = category === 'all' ? menuItems : menuItems.filter(i => i.category === category);
    document.getElementById('c-menu-list').innerHTML = filteredMenu.map((i, index) => {
        const qty = cart[i.id] || 0;
        return `
        <div class="flex gap-4 lg:gap-5 bg-white dark:bg-gray-800 p-4 lg:p-5 border border-gray-100 dark:border-gray-700 rounded-3xl shadow-sm animate-pop-in hover:shadow-md transition-shadow h-full" style="animation-delay: ${index * 60}ms">
            <img src="${i.img}" class="w-24 h-24 lg:w-28 lg:h-28 object-cover rounded-2xl border border-gray-50 dark:border-gray-700 shrink-0">
            <div class="flex-1 flex flex-col justify-between py-1 min-w-0">
                <div>
                    <h4 class="font-bold text-base lg:text-lg dark:text-white truncate">${i.name}</h4>
                    <p class="text-xs text-app-muted dark:text-gray-400 line-clamp-2 mt-1 lg:mt-1.5 leading-relaxed">${i.desc}</p>
                </div>
                <div class="flex justify-between items-center mt-3 gap-2">
                    <span class="font-extrabold text-sm lg:text-base dark:text-white shrink-0">Rp ${i.price.toLocaleString('id')}</span>
                    ${qty===0 ? 
                        `<button onclick="addToCart(${i.id})" class="bg-orange-50 dark:bg-gray-700 hover:bg-app-orange hover:text-white text-app-orange text-xs font-bold px-4 lg:px-6 py-2.5 rounded-full active-scale transition-all shrink-0">Tambah</button>` 
                        : 
                        `<div class="flex gap-2 lg:gap-4 bg-gray-50 dark:bg-gray-700 px-2 py-1.5 rounded-full shadow-inner shrink-0">
                            <button onclick="updateCart(${i.id},-1)" class="w-6 h-6 lg:w-7 lg:h-7 flex items-center justify-center text-app-orange font-extrabold active-scale hover:bg-white dark:hover:bg-gray-600 rounded-full transition-colors">-</button>
                            <span class="text-xs lg:text-sm font-bold w-4 text-center dark:text-white py-0.5 lg:py-1">${qty}</span>
                            <button onclick="updateCart(${i.id},1)" class="w-6 h-6 lg:w-7 lg:h-7 flex items-center justify-center text-app-orange font-extrabold active-scale hover:bg-white dark:hover:bg-gray-600 rounded-full transition-colors">+</button>
                        </div>`
                    }
                </div>
            </div>
        </div>`
    }).join('');
}

// ==========================================
// KERANJANG
// ==========================================
function addToCart(id) { cart[id] = (cart[id]||0)+1; document.getElementById('nav-cart-icon')?.classList.add('pulse-once'); setTimeout(()=>document.getElementById('nav-cart-icon')?.classList.remove('pulse-once'), 400); updateCartUI(); renderCustomerMenu(cActiveCategory); }
function updateCart(id, ch) { cart[id]+=ch; if(cart[id]<=0) delete cart[id]; updateCartUI(); renderCustomerMenu(cActiveCategory); }

function updateCartUI() {
    let total = 0, count = 0, html = '';
    for(const [id, qty] of Object.entries(cart)){
        const i = menuItems.find(m=>m.id==parseInt(id)); if(!i) continue;
        total += i.price*qty; count+=qty;
        html += `<div class="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 transition-colors"><img src="${i.img}" class="w-14 h-14 rounded-xl object-cover shadow-sm"><div class="flex-1"><h5 class="font-bold text-sm dark:text-white line-clamp-1">${i.name}</h5><p class="text-xs text-app-orange font-extrabold mt-1">Rp ${(i.price*qty).toLocaleString('id')}</p></div><div class="flex flex-col bg-white dark:bg-gray-700 rounded-xl p-1 shadow-sm"><button onclick="updateCart(${i.id},1)" class="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-app-orange transition-colors"><i data-lucide="chevron-up" class="w-4 h-4"></i></button><span class="text-xs font-bold text-center dark:text-white py-0.5">${qty}</span><button onclick="updateCart(${i.id},-1)" class="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-app-orange transition-colors"><i data-lucide="chevron-down" class="w-4 h-4"></i></button></div></div>`;
    }
    document.querySelectorAll('.c-cart-items-desktop, .c-cart-items-mobile').forEach(el => el.innerHTML = html);
    document.querySelectorAll('.c-cart-total').forEach(el => el.textContent = `Rp ${total.toLocaleString('id')}`);
    document.querySelectorAll('.c-item-count').forEach(el => el.textContent = count > 0 ? count + ' Item' : '0 Item');
    document.querySelectorAll('.c-cart-empty').forEach(el => el.style.display = count ? 'none' : 'flex');
    document.querySelectorAll('.c-checkout-btn').forEach(btn => btn.disabled = !count);
    document.querySelectorAll('.c-cart-badge').forEach(b => { if(count){ b.textContent=count; b.classList.remove('hidden'); } else b.classList.add('hidden'); });
    lucide.createIcons();
}

function toggleCustomerCart() {
    const drawer = document.getElementById('c-cart-drawer'), overlay = document.getElementById('c-cart-overlay');
    if(!drawer) return;
    if(drawer.classList.contains('drawer-open')){ drawer.classList.remove('drawer-open'); overlay.classList.remove('opacity-100'); setTimeout(()=>overlay.classList.add('hidden'), 300); }
    else { overlay.classList.remove('hidden'); void overlay.offsetWidth; overlay.classList.add('opacity-100'); drawer.classList.add('drawer-open'); }
}

function checkoutWA() {
    let msg = `*ORDER BARU - RestoKita* 🔥\n\n`; let total = 0;
    for (const [id, qty] of Object.entries(cart)) {
        const item = menuItems.find(i => i.id == parseInt(id));
        if(item) { total += item.price * qty; msg += `▪ ${qty}x ${item.name}\n`; }
    }
    msg += `\n*Total: Rp ${total.toLocaleString('id')}*\n\n_Mohon pesanan disiapkan admin_`;
    window.open(`https://wa.me/${restoWaNumber}?text=${encodeURIComponent(msg)}`, '_blank');
}

// ==========================================
// ADMIN LOGIC
// ==========================================
function openLoginModal() { document.getElementById('login-modal').classList.add('open'); document.getElementById('login-password').value = ''; document.getElementById('login-error').classList.add('hidden'); }
function closeLoginModal() { document.getElementById('login-modal').classList.remove('open'); }
function togglePasswordVisibility() { const input = document.getElementById('login-password'), icon = document.getElementById('eye-icon'); if(input.type === 'password'){ input.type='text'; icon.setAttribute('data-lucide','eye-off');} else {input.type='password'; icon.setAttribute('data-lucide','eye');} lucide.createIcons(); }
function submitLogin(e) { e.preventDefault(); if(document.getElementById('login-password').value === 'admin123') { closeLoginModal(); toggleAppMode('admin'); } else document.getElementById('login-error').classList.remove('hidden'); }

function toggleAppMode(mode) {
    document.getElementById('app-customer').classList.toggle('mode-hidden', mode === 'admin'); document.getElementById('app-customer').classList.toggle('mode-active', mode !== 'admin');
    document.getElementById('app-admin').classList.toggle('mode-hidden', mode !== 'admin'); document.getElementById('app-admin').classList.toggle('mode-active', mode === 'admin');
    if(mode === 'admin') { setTimeout(initChart, 400); renderAdminMenu(); renderAdminReviews(); } else { renderCustomerMenu(cActiveCategory); renderCustomerReviews(); }
}

function switchAdmin(viewName) {
    ['dashboard', 'menu', 'reviews', 'settings'].forEach((v) => {
        const el = document.getElementById(`a-view-${v}`);
        if(el) { el.classList.remove('active', 'slide-left', 'slide-right');
        if (v === viewName) el.classList.add('active');
        else if (['dashboard', 'menu', 'reviews', 'settings'].indexOf(v) < ['dashboard', 'menu', 'reviews', 'settings'].indexOf(viewName)) el.classList.add('slide-left');
        else el.classList.add('slide-right'); }
    });
    document.querySelectorAll('.a-nav-btn').forEach(btn => {
        btn.classList.remove('active', 'text-app-orange', 'bg-orange-50', 'dark:bg-gray-700'); btn.classList.add('text-gray-500', 'dark:text-gray-400');
        if(btn.dataset.target === viewName) { btn.classList.remove('text-gray-500', 'dark:text-gray-400'); btn.classList.add('active', 'text-app-orange', 'bg-orange-50', 'dark:bg-gray-700'); }
    });
}

function toggleAdminSidebar() {
    const s = document.getElementById('a-mobile-sidebar'), o = document.getElementById('a-sidebar-overlay');
    if(s.classList.contains('sidebar-open')){ s.classList.remove('sidebar-open'); o.classList.remove('opacity-100'); setTimeout(()=>o.classList.add('pointer-events-none'), 300); }
    else { o.classList.remove('pointer-events-none'); void o.offsetWidth; o.classList.add('opacity-100'); s.classList.add('sidebar-open'); }
}

function renderAdminMenu() {
    document.getElementById('admin-menu-table').innerHTML = menuItems.map(i => `
        <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 transition-colors"><td class="p-5 flex items-center gap-4"><img src="${i.img}" class="w-14 h-14 rounded-xl object-cover shadow-sm"><div><p class="font-bold line-clamp-1 max-w-[150px]">${i.name} ${i.isBest ? '<span class="ml-2 bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-md font-extrabold tracking-wider">HOT</span>' : ''}</p><p class="text-[10px] text-app-muted uppercase mt-1.5 font-bold tracking-wider">${i.category}</p></div></td><td class="p-5 font-bold text-gray-900 dark:text-white">Rp ${i.price.toLocaleString('id')}</td><td class="p-5 text-right"><div class="flex justify-end gap-2"><button onclick="toggleHotSeller(${i.id})" title="${i.isBest ? 'Hapus Rekomendasi' : 'Jadikan Rekomendasi'}" class="${i.isBest ? 'text-app-orange bg-orange-50 dark:bg-orange-900/30' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'} p-2.5 rounded-xl active-scale transition-all"><i data-lucide="flame" class="w-5 h-5"></i></button><button onclick="deleteMenu(${i.id})" title="Hapus Menu" class="text-app-red hover:bg-red-50 dark:hover:bg-red-900/30 p-2.5 rounded-xl active-scale transition-all"><i data-lucide="trash-2" class="w-5 h-5"></i></button></div></td></tr>
    `).join(''); lucide.createIcons();
}

function toggleHotSeller(id) { const item = menuItems.find(i => i.id === id); if(item) { item.isBest = !item.isBest; saveData('app_menu', menuItems); renderAdminMenu(); renderCustomerMenu(cActiveCategory); } }
function deleteMenu(id) { if(confirm('Hapus menu ini secara permanen?')) { menuItems = menuItems.filter(i => i.id !== id); saveData('app_menu', menuItems); renderAdminMenu(); renderCustomerMenu(cActiveCategory); } }
function openAddMenuModal() { document.getElementById('add-menu-modal').classList.add('open'); }
function closeAddMenuModal() { document.getElementById('add-menu-modal').classList.remove('open'); document.getElementById('form-add-menu').reset(); }
function submitNewMenu(e) {
    e.preventDefault(); const isBest = document.getElementById('m-best').checked;
    menuItems.push({ id: Date.now(), name: document.getElementById('m-name').value, category: document.getElementById('m-category').value, price: parseInt(document.getElementById('m-price').value), desc: document.getElementById('m-desc').value, img: document.getElementById('m-img').value, isBest: isBest });
    saveData('app_menu', menuItems); closeAddMenuModal(); renderAdminMenu(); renderCustomerMenu(cActiveCategory); alert("Menu baru sukses tersimpan!");
}

let chartRendered = false;
function initChart() {
    if(chartRendered) return; const ctx = document.getElementById('revenueChart'); if(!ctx) return; const ctx2d = ctx.getContext('2d');
    let gradient = ctx2d.createLinearGradient(0, 0, 0, 350); gradient.addColorStop(0, 'rgba(249, 115, 22, 0.5)'); gradient.addColorStop(1, 'rgba(249, 115, 22, 0.0)');
    new Chart(ctx2d, { type: 'line', data: { labels: ['Sn', 'Sl', 'Rb', 'Km', 'Jm', 'Sb', 'Mg'], datasets: [{ data: [2.2, 3.1, 2.5, 4.1, 5.8, 7.2, 8.5], borderColor: '#F97316', borderWidth: 3, backgroundColor: gradient, fill: true, tension: 0.4, pointBackgroundColor: '#fff', pointBorderColor: '#F97316', pointBorderWidth: 2, pointRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { border: { display: false }, grid: { color: 'rgba(156, 163, 175, 0.1)' } }, x: { grid: { display: false }, border: { display: false } } } } });
    chartRendered = true;
}
