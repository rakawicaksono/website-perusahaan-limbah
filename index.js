// ============================================================
//  UD. LUAS JAYA – index.js  (Full System)
//  Role: Pembeli | Penjual | Admin
//  Fitur: Auth, Pemesanan, Dashboard per-role, Admin Panel
// ============================================================

const APPS_SCRIPT_URL = 'PASTE_YOUR_APPS_SCRIPT_URL_HERE';

// ── State global ──────────────────────────────────────────
let selectedRole = 'penjual';
let currentUser  = null;

// ── Demo accounts ─────────────────────────────────────────
const DEMO_ACCOUNTS = {
  'admin@luasjaya.co.id': { password:'admin123',  nama:'Administrator',    peran:'Admin',   email:'admin@luasjaya.co.id',   hp:'081200000000' },
  'penjual@demo.com':     { password:'demo1234',  nama:'PT. Maju Jaya', peran:'Penjual', email:'penjual@demo.com',       hp:'081211112222' },
  'pembeli@demo.com':     { password:'demo1234',  nama:'Andi Santoso',  peran:'Pembeli', email:'pembeli@demo.com',       hp:'081233334444' },
};

// ── Data dummy produk ──────────────────────────────────────
const PRODUCTS = [
  { id:1, nama:'Scrap Besi Campuran',     kat:'Logam & Besi', harga:4500,  stok:5000, satuan:'kg',  lokasi:'Cikarang, Bekasi',         emoji:'🔩', badge:'Stok Banyak', penjual:'PT. Maju Jaya' },
  { id:2, nama:'Limbah Plastik PET Bersih',kat:'Plastik',     harga:2800,  stok:2000, satuan:'kg',  lokasi:'Surabaya, Jawa Timur',     emoji:'🥤', badge:'Terlaris',    penjual:'CV. Plastik Raya' },
  { id:3, nama:'Tembaga Kabel Stripped',  kat:'Logam & Besi', harga:68000, stok:300,  satuan:'kg',  lokasi:'Tangerang, Banten',        emoji:'🔋', badge:'Premium',     penjual:'PT. Maju Jaya' },
  { id:4, nama:'Karton Duplex Bekas',     kat:'Kertas & Karton',harga:1200,stok:10000,satuan:'kg', lokasi:'Bandung, Jawa Barat',      emoji:'📦', badge:'Murah',       penjual:'UD. Kertas Mas' },
  { id:5, nama:'PCB Elektronik Bekas',    kat:'Elektronik',   harga:15000, stok:500,  satuan:'kg',  lokasi:'Karawang, Jawa Barat',     emoji:'⚡', badge:'Nego',        penjual:'CV. E-Recycle' },
  { id:6, nama:'Palet Kayu Bekas',        kat:'Kayu',         harga:35000, stok:200,  satuan:'pcs', lokasi:'Semarang, Jawa Tengah',    emoji:'🪵', badge:'Stok Banyak', penjual:'CV. Kayu Lestari' },
  { id:7, nama:'Oli Bekas Industri',      kat:'Kimia & Oli',  harga:3500,  stok:1500, satuan:'liter',lokasi:'Gresik, Jawa Timur',     emoji:'🧴', badge:'Murah',       penjual:'PT. Oli Nusantara' },
  { id:8, nama:'Aki Bekas Mobil',         kat:'Baterai & Aki',harga:55000, stok:80,   satuan:'pcs', lokasi:'Depok, Jawa Barat',        emoji:'🔋', badge:'Stok Terbatas',penjual:'Toko Aki Jaya' },
  { id:9, nama:'Serat Tekstil Sisa',      kat:'Tekstil Industri',harga:800,stok:3000, satuan:'kg',  lokasi:'Solo, Jawa Tengah',        emoji:'🏭', badge:'Murah',       penjual:'CV. Tekstil Prima' },
];

// ── Data dummy pesanan ─────────────────────────────────────
let ORDERS = [
  { id:'ORD-2025-001', produk:'Scrap Besi Campuran',     qty:500,  satuan:'kg',  harga:4500,  pembeli:'Andi Santoso',  penjual:'PT. Maju Jaya',     status:'selesai',    tanggal:'12 Mei 2025', total:2250000  },
  { id:'ORD-2025-002', produk:'Limbah Plastik PET Bersih',qty:200, satuan:'kg',  harga:2800,  pembeli:'Andi Santoso',  penjual:'CV. Plastik Raya',  status:'dikirim',    tanggal:'18 Mei 2025', total:560000   },
  { id:'ORD-2025-003', produk:'Karton Duplex Bekas',     qty:1000, satuan:'kg',  harga:1200,  pembeli:'Andi Santoso',  penjual:'UD. Kertas Mas',    status:'diproses',   tanggal:'22 Mei 2025', total:1200000  },
  { id:'ORD-2025-004', produk:'Tembaga Kabel Stripped',  qty:50,   satuan:'kg',  harga:68000, pembeli:'Hendra Wijaya', penjual:'PT. Maju Jaya',     status:'baru',       tanggal:'25 Mei 2025', total:3400000  },
  { id:'ORD-2025-005', produk:'Scrap Besi Campuran',     qty:800,  satuan:'kg',  harga:4500,  pembeli:'Sari Dewi',     penjual:'PT. Maju Jaya',     status:'dikonfirmasi',tanggal:'24 Mei 2025', total:3600000  },
  { id:'ORD-2025-006', produk:'PCB Elektronik Bekas',    qty:100,  satuan:'kg',  harga:15000, pembeli:'Budi Setiawan', penjual:'CV. E-Recycle',     status:'menunggu',   tanggal:'26 Mei 2025', total:1500000  },
  { id:'ORD-2025-007', produk:'Palet Kayu Bekas',        qty:30,   satuan:'pcs', harga:35000, pembeli:'Andi Santoso',  penjual:'CV. Kayu Lestari',  status:'menunggu',   tanggal:'26 Mei 2025', total:1050000  },
  { id:'ORD-2025-008', produk:'Limbah Plastik PET Bersih',qty:500, satuan:'kg',  harga:2800,  pembeli:'CV. Daur Ulang', penjual:'CV. Plastik Raya',  status:'dispute',    tanggal:'15 Mei 2025', total:1400000  },
];

// ── Data dummy pengguna ────────────────────────────────────
const USERS = [
  { id:1, nama:'PT. Maju Jaya',   email:'penjual@demo.com',  peran:'Penjual', status:'Terverifikasi', bergabung:'10 Jan 2025' },
  { id:2, nama:'Andi Santoso',    email:'pembeli@demo.com',  peran:'Pembeli', status:'Aktif',         bergabung:'15 Jan 2025' },
  { id:3, nama:'CV. Plastik Raya',email:'plastik@demo.com',  peran:'Penjual', status:'Terverifikasi', bergabung:'3 Feb 2025'  },
  { id:4, nama:'UD. Kertas Mas',  email:'kertas@demo.com',   peran:'Penjual', status:'Pending',       bergabung:'18 Mar 2025' },
  { id:5, nama:'Hendra Wijaya',   email:'hendra@demo.com',   peran:'Pembeli', status:'Aktif',         bergabung:'2 Apr 2025'  },
  { id:6, nama:'Sari Dewi',       email:'sari@demo.com',     peran:'Pembeli', status:'Aktif',         bergabung:'5 Apr 2025'  },
  { id:7, nama:'CV. E-Recycle',   email:'erecycle@demo.com', peran:'Penjual', status:'Pending',       bergabung:'20 Apr 2025' },
  { id:8, nama:'Budi Setiawan',   email:'budi@demo.com',     peran:'Pembeli', status:'Aktif',         bergabung:'1 Mei 2025'  },
];

// ── Load manual users dari localStorage ke USERS & DEMO_ACCOUNTS ──
(function loadManualUsers() {
  const saved = JSON.parse(localStorage.getItem('manual_users') || '[]');
  saved.forEach(u => {
    if (!USERS.find(x => x.email === u.email)) USERS.push(u);
    if (!DEMO_ACCOUNTS[u.email]) DEMO_ACCOUNTS[u.email] = { password: u.password, nama: u.nama, peran: u.peran, email: u.email, hp: u.hp || '-' };
  });
})();

// ══════════════════════════════════════════════════════════
//  FILTER TABS (landing)
// ══════════════════════════════════════════════════════════
document.querySelectorAll('.ftab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.ftab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// ══════════════════════════════════════════════════════════
//  NAVBAR
// ══════════════════════════════════════════════════════════
document.addEventListener('click', e => {
  const navUser = document.getElementById('nav-user');
  if (navUser && !navUser.contains(e.target)) navUser.classList.remove('open');
});

function toggleUserDropdown() {
  document.getElementById('nav-user').classList.toggle('open');
}

// ── Menu navbar per-role ───────────────────────────────────
const ROLE_MENUS = {
  Pembeli: [
    { label:'Beranda',  icon:'🏠', tab:'beranda',  role:'pembeli' },
    { label:'Katalog',  icon:'🔍', tab:'katalog',  role:'pembeli' },
    { label:'Pesanan',  icon:'📦', tab:'pesanan',  role:'pembeli', badge:'badge-pesanan-pembeli' },
    { label:'Favorit',  icon:'❤️', tab:'favorit',  role:'pembeli' },
    { label:'Profil',   icon:'👤', tab:'profil',   role:'pembeli' },
  ],
  Penjual: [
    { label:'Dashboard',   icon:'🏠', tab:'beranda',    role:'penjual' },
    { label:'Produk Saya', icon:'📋', tab:'produk',     role:'penjual' },
    { label:'Pesanan',     icon:'📦', tab:'pesanan',    role:'penjual', badge:'badge-pesanan-penjual' },
    { label:'Pendapatan',  icon:'💰', tab:'pendapatan', role:'penjual' },
    { label:'Profil Toko', icon:'👤', tab:'profil',     role:'penjual' },
  ],
  Admin: [
    { label:'Overview',    icon:'📊', tab:'overview',   role:'admin' },
    { label:'Pengguna',    icon:'👥', tab:'pengguna',   role:'admin', badge:'badge-pengguna' },
    { label:'Manajemen Produk',icon:'📋',tab:'produk',  role:'admin' },
    { label:'Semua Pesanan',icon:'📦',tab:'pesanan',    role:'admin' },
    { label:'Laporan',     icon:'📈', tab:'laporan',    role:'admin' },
  ],
};

function renderRoleMenu(peran) {
  const container = document.getElementById('nav-role-menu');
  if (!container) return;
  const menus = ROLE_MENUS[peran] || [];
  container.innerHTML = menus.map(m => {
    const badgeEl = m.badge ? `<span class="nsc-badge" id="nsc-${m.badge}" style="display:none">0</span>` : '';
    return `<button class="nsc-btn" id="nsc-tab-${m.role}-${m.tab}"
      onclick="openDashboard();setTimeout(()=>switchTab('${m.role}','${m.tab}'),50)">
      <span class="nsc-icon">${m.icon}</span>
      <span>${m.label}</span>
      ${badgeEl}
    </button>`;
  }).join('');
  // Sync badge dari sidebar yang sudah ada
  if (peran === 'Penjual') {
    syncNavBadge('badge-pesanan-penjual', 'nsc-badge-pesanan-penjual');
  } else if (peran === 'Admin') {
    syncNavBadge('badge-pengguna', 'nsc-badge-pengguna');
  }
}

function syncNavBadge(srcId, dstId) {
  const src = document.getElementById(srcId);
  const dst = document.getElementById('nsc-' + srcId);
  if (src && dst) {
    const txt = src.textContent.trim();
    if (txt) { dst.textContent = txt; dst.style.display = 'flex'; }
  }
}

// Tandai menu aktif di navbar saat tab berubah
function setActiveNavMenu(role, tab) {
  document.querySelectorAll('.nsc-btn').forEach(b => b.classList.remove('nsc-active'));
  const active = document.getElementById(`nsc-tab-${role}-${tab}`);
  if (active) active.classList.add('nsc-active');
}

function updateNavbar(user) {
  const guestEl = document.getElementById('nav-guest');
  const userEl  = document.getElementById('nav-user');
  const linksEl = document.getElementById('nav-links-landing');

  if (user) {
    guestEl.style.display = 'none';
    userEl.style.display  = 'flex';
    userEl.classList.add('visible');
    if (linksEl) linksEl.style.display = 'none';
    const initials = user.nama.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
    document.getElementById('user-avatar-text').textContent = initials;
    document.getElementById('user-nav-name').textContent    = user.nama;
    const roleLabel = user.peran === 'Penjual' ? '🏭 Penjual' : user.peran === 'Admin' ? '⚙️ Admin' : '🛒 Pembeli';
    document.getElementById('user-nav-role').textContent    = roleLabel;
    document.getElementById('dd-name').textContent          = user.nama;
    document.getElementById('dd-email').textContent         = user.email || user.hp || '-';
    renderRoleMenu(user.peran);
  } else {
    guestEl.style.display = '';
    userEl.style.display  = 'none';
    userEl.classList.remove('visible', 'open');
    if (linksEl) linksEl.style.display = '';
  }
}

function doLogout() {
  currentUser = null;
  // sembunyikan semua dashboard
  document.querySelectorAll('.dashboard').forEach(d => d.classList.add('hidden'));
  // tampilkan landing
  document.getElementById('landing-page').classList.remove('hidden');
  document.getElementById('main-nav').style.display = '';
  updateNavbar(null);
  window.scrollTo(0,0);
  showToast('success','Berhasil Keluar','Sampai jumpa kembali!');
  const navUser = document.getElementById('nav-user');
  if (navUser) navUser.classList.remove('open');
}

// ══════════════════════════════════════════════════════════
//  MODAL AUTH
// ══════════════════════════════════════════════════════════
function openModal(type) {
  if (type === 'login') {
    document.getElementById('login-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  closeLoginModal();
}

function closeLoginModal(e) {
  if (!e || e.target === document.getElementById('login-modal')) {
    document.getElementById('login-modal').classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Quick login langsung dari navbar (isi + buka modal)
function fillDemoAndOpen(email, pass) {
  openModal('login');
  setTimeout(() => {
    document.getElementById('login-email').value    = email;
    document.getElementById('login-password').value = pass;
  }, 50);
}

// ══════════════════════════════════════════════════════════
//  LUPA PASSWORD
// ══════════════════════════════════════════════════════════
function openForgotPassword(e) {
  if (e) e.preventDefault();
  closeLoginModal();
  setTimeout(() => {
    document.getElementById('modal-forgot').classList.add('active');
    document.body.style.overflow = 'hidden';
    showForgotStep(1);
  }, 150);
}
function closeForgotModal(e) {
  if (!e || e.target === document.getElementById('modal-forgot')) {
    document.getElementById('modal-forgot').classList.remove('active');
    document.body.style.overflow = '';
  }
}
function showForgotStep(n) {
  [1,2,3,4].forEach(i => {
    const el = document.getElementById('forgot-step'+i);
    if (el) el.style.display = (i === n) ? '' : 'none';
  });
}
function handleForgotStep1() {
  const email = document.getElementById('forgot-email').value.trim();
  if (!email || !email.includes('@')) {
    showToast('error','Email Tidak Valid','Masukkan email yang terdaftar.');
    return;
  }
  showToast('success','Kode Dikirim!','Cek inbox email Anda (demo: 123456).');
  showForgotStep(2);
}
function handleForgotStep2() {
  const otp = document.getElementById('forgot-otp').value.trim();
  if (otp !== '123456') {
    showToast('error','Kode Salah','Masukkan kode yang benar (demo: 123456).');
    return;
  }
  showForgotStep(3);
}
function handleForgotStep3() {
  const np  = document.getElementById('forgot-newpass').value;
  const cp  = document.getElementById('forgot-confirmpass').value;
  if (!np || np.length < 8) { showToast('error','Password Terlalu Pendek','Minimal 8 karakter.'); return; }
  if (np !== cp)             { showToast('error','Password Tidak Sama','Konfirmasi password tidak cocok.'); return; }
  showToast('success','Password Diperbarui!','Silakan masuk dengan password baru.');
  showForgotStep(4);
}

// ── LOGIN ──────────────────────────────────────────────────
// Pengguna manual yang ditambah admin (persisten di localStorage)
let MANUAL_USERS = JSON.parse(localStorage.getItem('manual_users') || '[]');

function handleLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pw    = document.getElementById('login-password').value;

  if (!email || !pw) {
    showToast('error','Form Belum Lengkap','Email dan password wajib diisi.');
    return;
  }

  // Cek akun bawaan (demo)
  const demoAccount = DEMO_ACCOUNTS[email];
  if (demoAccount && demoAccount.password === pw) {
    currentUser = { ...demoAccount };
    updateNavbar(currentUser);
    closeLoginModal();
    showToast('success','Berhasil Masuk!',`Selamat datang, ${currentUser.nama}!`);
    setTimeout(() => openDashboard(), 300);
    return;
  }

  // Cek akun yang ditambah admin secara manual
  const manualUser = MANUAL_USERS.find(u => u.email === email && u.password === pw);
  if (manualUser) {
    currentUser = { ...manualUser };
    updateNavbar(currentUser);
    closeLoginModal();
    showToast('success','Berhasil Masuk!',`Login sebagai ${manualUser.peran}`);
    setTimeout(() => openDashboard(), 300);
    return;
  }

  showToast('error','Login Gagal','Email atau password salah.');
}

// ══════════════════════════════════════════════════════════
//  ROUTING DASHBOARD
// ══════════════════════════════════════════════════════════
function openDashboard() {
  if (!currentUser) return;
  const peran = currentUser.peran;

  // Sembunyikan landing, tampilkan dashboard yang sesuai
  document.getElementById('landing-page').classList.add('hidden');
  document.querySelectorAll('.dashboard').forEach(d => d.classList.add('hidden'));

  let dashId;
  if (peran === 'Admin')   dashId = 'dashboard-admin';
  else if (peran === 'Penjual') dashId = 'dashboard-penjual';
  else                     dashId = 'dashboard-pembeli';

  document.getElementById(dashId).classList.remove('hidden');

  // Isi data per role
  if (peran === 'Admin')        initAdminDashboard();
  else if (peran === 'Penjual') initPenjualDashboard();
  else                          initPembeliDashboard();

  // Init notifikasi
  initNotifs();
}

function openOrdersFromNav() {
  if (!currentUser) return;
  document.getElementById('nav-user').classList.remove('open');
  openDashboard();
  const peran = currentUser.peran;
  if      (peran === 'Admin')   switchTab('admin','pesanan');
  else if (peran === 'Penjual') switchTab('penjual','pesanan');
  else                          switchTab('pembeli','pesanan');
}

// ══════════════════════════════════════════════════════════
//  TAB SWITCHER (universal)
// ══════════════════════════════════════════════════════════
function switchTab(role, tab) {
  const prefix = `tab-${role}-`;
  document.querySelectorAll(`[id^="${prefix}"]`).forEach(el => el.classList.remove('active'));
  const target = document.getElementById(prefix + tab);
  if (target) target.classList.add('active');

  const sidebar = document.getElementById(`sidebar-${role}`) || document.querySelector(`#dashboard-${role} .db-sidebar`);
  if (sidebar) {
    sidebar.querySelectorAll('.db-nav-item').forEach(item => item.classList.remove('active'));
    const items = sidebar.querySelectorAll('.db-nav-item');
    items.forEach(item => {
      if (item.getAttribute('onclick') && item.getAttribute('onclick').includes(`'${tab}'`)) item.classList.add('active');
    });
  }
  // Sync active state di navbar
  setActiveNavMenu(role, tab);

  const pageTitles = {
    beranda:'Dashboard', katalog:'Cari Produk', pesanan:'Pesanan', favorit:'Favorit', profil:'Profil',
    produk:'Produk Saya', pendapatan:'Pendapatan', overview:'Overview', pengguna:'Manajemen Pengguna',
    verifikasi:'Verifikasi Penjual', laporan:'Laporan & Analitik',
  };
  const titleEl = document.getElementById(`db-title-${role}`);
  if (titleEl && pageTitles[tab]) titleEl.textContent = pageTitles[tab];
}

// ══════════════════════════════════════════════════════════
//  DASHBOARD PEMBELI
// ══════════════════════════════════════════════════════════
function initPembeliDashboard() {
  const u = currentUser;
  const initials = u.nama.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();

  // Avatar & nama
  setEl('db-avatar-pembeli', initials);
  setEl('db-name-pembeli',   u.nama);
  setEl('topbar-avatar-pembeli', initials);
  setEl('wb-greeting-pembeli',   `Halo, ${u.nama.split(' ')[0]}! 👋`);
  setEl('profil-avatar-pembeli', initials);
  setEl('profil-name-pembeli',   u.nama);

  // Isi profil form
  const pf = document.getElementById('pf-nama-pembeli'); if (pf) pf.value = u.nama;
  const pe = document.getElementById('pf-email-pembeli');if (pe) pe.value = u.email || '';
  const ph = document.getElementById('pf-hp-pembeli');   if (ph) ph.value = u.hp    || '';

  // Pesanan milik pembeli
  const myOrders = ORDERS.filter(o => o.pembeli === u.nama || u.nama === 'Andi Santoso');
  renderOrderList('order-list-pembeli', myOrders.slice(0,3));
  renderOrderFull('order-full-pembeli', myOrders);

  // Update stats cards dynamically
  const aktif   = myOrders.filter(o => !['selesai','batal'].includes(o.status)).length;
  const selesai = myOrders.filter(o => o.status === 'selesai').length;
  const statCards = document.querySelectorAll('#tab-pembeli-beranda .stat-card .sc-num');
  if (statCards[0]) statCards[0].textContent = aktif;
  if (statCards[1]) statCards[1].textContent = selesai;

  // Katalog
  renderKatalogPembeli();

  // Favorit
  renderFavoritPembeli();

  // Rekomendasi
  renderMiniProducts('rekomen-pembeli', PRODUCTS.slice(0,4));

  // Badge
  const active = myOrders.filter(o => !['selesai','dispute'].includes(o.status)).length;
  setEl('badge-pesanan-pembeli', active);
}

function renderKatalogPembeli() {
  const grid = document.getElementById('katalog-pembeli');
  if (!grid) return;
  grid.innerHTML = PRODUCTS.map(p => `
    <div class="db-prod-card" onclick="openOrderModal(${p.id})">
      <div class="db-prod-img">${p.emoji}</div>
      <div class="db-prod-body">
        <div class="db-prod-name">${p.nama}</div>
        <div class="db-prod-meta">📍 ${p.lokasi} · ${p.stok.toLocaleString('id-ID')} ${p.satuan}</div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
          <div class="db-prod-price">Rp ${p.harga.toLocaleString('id-ID')}<span style="font-size:.7rem;color:var(--muted);font-weight:400">/${p.satuan}</span></div>
          <button class="oa-btn primary" onclick="event.stopPropagation();openOrderModal(${p.id})">Pesan</button>
        </div>
      </div>
    </div>`).join('');
}

function renderFavoritPembeli() {
  const grid = document.getElementById('favorit-pembeli');
  if (!grid) return;
  const favs = PRODUCTS.slice(0,3);
  grid.innerHTML = favs.map(p => `
    <div class="db-prod-card" onclick="openOrderModal(${p.id})">
      <div class="db-prod-img">${p.emoji}</div>
      <div class="db-prod-body">
        <div class="db-prod-name">${p.nama}</div>
        <div class="db-prod-meta">📍 ${p.lokasi}</div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
          <div class="db-prod-price">Rp ${p.harga.toLocaleString('id-ID')}/${p.satuan}</div>
          <button class="oa-btn danger" onclick="event.stopPropagation();showToast('success','Dihapus dari Favorit','')">🗑</button>
        </div>
      </div>
    </div>`).join('');
}

function renderMiniProducts(containerId, products) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = products.map(p => `
    <div class="db-prod-card" onclick="openOrderModal(${p.id})">
      <div class="db-prod-img">${p.emoji}</div>
      <div class="db-prod-body">
        <div class="db-prod-name">${p.nama}</div>
        <div class="db-prod-price">Rp ${p.harga.toLocaleString('id-ID')}/${p.satuan}</div>
      </div>
    </div>`).join('');
}

// ══════════════════════════════════════════════════════════
//  DASHBOARD PENJUAL
// ══════════════════════════════════════════════════════════
function initPenjualDashboard() {
  const u = currentUser;
  const initials = u.nama.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();

  setEl('db-avatar-penjual',    initials);
  setEl('db-name-penjual',      u.nama);
  setEl('topbar-avatar-penjual',initials);
  setEl('wb-greeting-penjual',  `Halo, ${u.nama.split(' ')[0]}! 🏭`);
  setEl('profil-avatar-penjual',initials);
  setEl('profil-name-penjual',  u.nama);

  const pf = document.getElementById('pf-nama-penjual'); if(pf) pf.value = u.nama;
  const pe = document.getElementById('pf-email-penjual');if(pe) pe.value = u.email||'';
  const ph = document.getElementById('pf-hp-penjual');   if(ph) ph.value = u.hp||'';

  // Pesanan masuk untuk penjual ini
  const myOrders = ORDERS.filter(o => o.penjual === u.nama || u.nama === 'PT. Maju Jaya');
  renderOrderList('order-list-penjual', myOrders.slice(0,3));
  renderOrderFull('order-full-penjual', myOrders);

  // Produk saya
  const myProducts = PRODUCTS.filter(p => p.penjual === u.nama || u.nama === 'PT. Maju Jaya').slice(0,6);
  renderMyProducts(myProducts);

  // Performa
  renderPerformaList(myProducts.slice(0,4));

  // Pendapatan history
  renderIncomeHistory();

  const newOrders = myOrders.filter(o => o.status === 'baru').length;
  setEl('badge-pesanan-penjual', newOrders || 0);
}

function renderMyProducts(products) {
  const grid = document.getElementById('my-products-grid');
  if (!grid) return;
  if (!products.length) {
    grid.innerHTML = '<div style="text-align:center;padding:40px;color:var(--muted)">Belum ada produk. Tambahkan produk pertama Anda!</div>';
    return;
  }
  grid.innerHTML = products.map(p => `
    <div class="my-prod-card">
      <div class="my-prod-img">${p.emoji}</div>
      <div class="my-prod-body">
        <div class="my-prod-name">${p.nama}</div>
        <div class="my-prod-meta">${p.kat} · Stok: ${p.stok.toLocaleString('id-ID')} ${p.satuan}</div>
        <div class="my-prod-footer">
          <div class="my-prod-price">Rp ${p.harga.toLocaleString('id-ID')}/${p.satuan}</div>
          <span class="my-prod-status">Aktif</span>
        </div>
        <div class="my-prod-actions">
          <button class="oa-btn ghost" onclick="showToast('success','Mode Edit','Fitur edit akan segera hadir!')">✏️ Edit</button>
          <button class="oa-btn danger" onclick="showToast('success','Produk Dinonaktifkan','Produk berhasil dinonaktifkan.')">🗑</button>
        </div>
      </div>
    </div>`).join('');
}

function renderPerformaList(products) {
  const el = document.getElementById('perf-list');
  if (!el) return;
  const views = [128, 95, 74, 52];
  el.innerHTML = products.map((p,i) => `
    <div class="perf-item">
      <div class="perf-icon">${p.emoji}</div>
      <div class="perf-info">
        <div class="perf-name">${p.nama}</div>
        <div class="perf-sub">${views[i]} dilihat minggu ini</div>
      </div>
      <div class="perf-stat">
        <div class="perf-num">${[12,8,5,3][i]} pesanan</div>
      </div>
    </div>`).join('');
}

function renderIncomeHistory() {
  const el = document.getElementById('income-history');
  if (!el) return;
  const rows = [
    { desc:'Penjualan Scrap Besi 500kg', tgl:'25 Mei 2025', amt:2250000 },
    { desc:'Penjualan Tembaga 50kg',      tgl:'24 Mei 2025', amt:3400000 },
    { desc:'Penjualan Scrap Besi 300kg',  tgl:'20 Mei 2025', amt:1350000 },
    { desc:'Penjualan Scrap Besi 200kg',  tgl:'15 Mei 2025', amt:900000  },
  ];
  el.innerHTML = rows.map(r => `
    <div class="income-row">
      <div class="inc-icon">💰</div>
      <div class="inc-info">
        <div class="inc-desc">${r.desc}</div>
        <div class="inc-date">${r.tgl}</div>
      </div>
      <div class="inc-amount">+Rp ${r.amt.toLocaleString('id-ID')}</div>
    </div>`).join('');
}

// ══════════════════════════════════════════════════════════
//  DASHBOARD ADMIN
// ══════════════════════════════════════════════════════════
function initAdminDashboard() {
  const u = currentUser;
  const initials = u.nama.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();

  setEl('db-avatar-admin',    initials);
  setEl('db-name-admin',      u.nama);
  setEl('topbar-avatar-admin',initials);

  renderOrderList('order-list-admin', ORDERS.slice(0,4), true);
  renderOrderFull('order-full-admin',  ORDERS, true);
  renderNewUsers();
  renderUserTable(USERS);
  renderTopSellers();
  renderAdminProducts();
}

function renderNewUsers() {
  const el = document.getElementById('new-users-list');
  if (!el) return;
  el.innerHTML = USERS.slice(-4).reverse().map(u => {
    const bg = u.peran === 'Penjual' ? 'linear-gradient(135deg,var(--violet),var(--primary))' : 'linear-gradient(135deg,var(--accent-dark),var(--accent))';
    const badgeCls = u.peran === 'Penjual' ? 'seller-badge' : 'buyer-badge';
    return `
    <div class="nu-row">
      <div class="nu-avatar" style="background:${bg}">${u.nama.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()}</div>
      <div class="nu-info">
        <div class="nu-name">${u.nama}</div>
        <div class="nu-meta">${u.email} · ${u.bergabung}</div>
      </div>
      <span class="nu-badge profil-badge ${badgeCls}">${u.peran}</span>
    </div>`;
  }).join('');
}

function renderUserTable(users) {
  const el = document.getElementById('user-table');
  if (!el) return;
  const statusColor = { 'Terverifikasi':'var(--green-ok)', 'Aktif':'var(--accent)', 'Pending':'var(--admin)', 'Suspend':'#F87171' };
  el.innerHTML = `
    <div class="user-row header">
      <div>#</div><div>Nama</div><div>Email</div><div>Peran</div><div>Status</div><div>Aksi</div>
    </div>` +
    users.map((u,i) => {
      const bg = u.peran === 'Penjual' ? 'linear-gradient(135deg,var(--violet),var(--primary))' :
                 u.peran === 'Admin'   ? 'linear-gradient(135deg,var(--admin),var(--admin-dark))' :
                                         'linear-gradient(135deg,var(--accent-dark),var(--accent))';
      const isManual = MANUAL_USERS.some(m => m.email === u.email);
      return `
      <div class="user-row" id="urow-${u.id}">
        <div><div class="user-row-avatar" style="background:${bg}">${u.nama.split(' ').map(w=>w[0]).slice(0,1).join('').toUpperCase()}</div></div>
        <div style="font-weight:600">${u.nama}</div>
        <div style="color:var(--muted)">${u.email}</div>
        <div><span style="font-size:.78rem;font-weight:600">${u.peran}</span></div>
        <div><span style="color:${statusColor[u.status]||'var(--muted)'};font-size:.75rem;font-weight:600">● ${u.status}</span></div>
        <div style="display:flex;gap:6px">
          <button class="oa-btn ghost" onclick="showToast('success','Info','${u.nama} · ${u.email} · ${u.peran}')">👁 Lihat</button>
          ${isManual
            ? `<button class="oa-btn danger" onclick="hapusPengguna('${u.email}')">🗑 Hapus</button>`
            : `<button class="oa-btn danger" onclick="showToast('error','Tidak Bisa Dihapus','Akun bawaan sistem tidak bisa dihapus.')">Suspend</button>`
          }
        </div>
      </div>`;
    }).join('');
}

function hapusPengguna(email) {
  // Hapus dari USERS
  const idx = USERS.findIndex(u => u.email === email);
  if (idx !== -1) USERS.splice(idx, 1);
  // Hapus dari MANUAL_USERS & localStorage
  const midx = MANUAL_USERS.findIndex(u => u.email === email);
  if (midx !== -1) MANUAL_USERS.splice(midx, 1);
  localStorage.setItem('manual_users', JSON.stringify(MANUAL_USERS));
  // Hapus dari DEMO_ACCOUNTS
  delete DEMO_ACCOUNTS[email];
  renderUserTable(USERS);
  showToast('success','Pengguna Dihapus','Akun berhasil dihapus dari sistem.');
}

function renderTopSellers() {
  const el = document.getElementById('top-sellers');
  if (!el) return;
  const sellers = [
    { nama:'PT. Maju Jaya', meta:'Logam & Besi · 42 transaksi', amt:28500000, rank:'🥇' },
    { nama:'CV. Plastik Raya', meta:'Plastik · 38 transaksi',   amt:21200000, rank:'🥈' },
    { nama:'UD. Kertas Mas', meta:'Kertas · 31 transaksi',       amt:15800000, rank:'🥉' },
    { nama:'CV. E-Recycle', meta:'Elektronik · 24 transaksi',    amt:12400000, rank:'4️⃣' },
    { nama:'Toko Aki Jaya', meta:'Baterai · 18 transaksi',       amt:9900000,  rank:'5️⃣' },
  ];
  el.innerHTML = sellers.map(s => `
    <div class="ts-row">
      <div class="ts-rank">${s.rank}</div>
      <div class="ts-info"><div class="ts-name">${s.nama}</div><div class="ts-meta">${s.meta}</div></div>
      <div class="ts-amount">Rp ${(s.amt/1000000).toFixed(1)} Jt</div>
    </div>`).join('');
}

function renderAdminProducts() {
  const el = document.getElementById('admin-product-table');
  if (!el) return;
  el.innerHTML = `
    <div class="ap-row header">
      <div>#</div><div>Nama Produk</div><div>Kategori</div><div>Penjual</div><div>Harga</div><div>Stok</div><div>Status</div>
    </div>` +
    PRODUCTS.map((p,i) => `
    <div class="ap-row">
      <div>${p.emoji}</div>
      <div style="font-weight:600">${p.nama}</div>
      <div style="color:var(--muted)">${p.kat}</div>
      <div style="color:var(--muted)">${p.penjual}</div>
      <div style="color:var(--accent);font-weight:600">Rp ${p.harga.toLocaleString('id-ID')}</div>
      <div>${p.stok.toLocaleString('id-ID')} ${p.satuan}</div>
      <div><span style="color:var(--green-ok);font-size:.75rem;font-weight:600">● Aktif</span></div>
    </div>`).join('');
}


// ══════════════════════════════════════════════════════════
//  TAMBAH PENGGUNA MANUAL (ADMIN)
// ══════════════════════════════════════════════════════════
let tambahPenggunaRole = 'Penjual';

function openTambahPengguna() {
  tambahPenggunaRole = 'Penjual';
  // reset fields
  ['tp-nama','tp-email','tp-hp','tp-password'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  const st = document.getElementById('tp-status'); if (st) st.value = 'Aktif';
  selectTambahRole('Penjual');
  document.getElementById('modal-tambah-pengguna').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeTambahPengguna(e) {
  if (!e || e.target === document.getElementById('modal-tambah-pengguna')) {
    document.getElementById('modal-tambah-pengguna').classList.remove('active');
    document.body.style.overflow = '';
  }
}

function selectTambahRole(role) {
  tambahPenggunaRole = role;
  ['Penjual','Pembeli','Admin'].forEach(r => {
    const el = document.getElementById('tp-' + r.toLowerCase());
    if (el) el.classList.toggle('selected', r === role);
  });
}

function submitTambahPengguna() {
  const nama     = document.getElementById('tp-nama').value.trim();
  const email    = document.getElementById('tp-email').value.trim();
  const hp       = document.getElementById('tp-hp').value.trim();
  const password = document.getElementById('tp-password').value;
  const status   = document.getElementById('tp-status').value;

  if (!nama)                          { showToast('error','Form Belum Lengkap','Nama wajib diisi.'); return; }
  if (!email || !email.includes('@')) { showToast('error','Email Tidak Valid','Masukkan email yang valid.'); return; }
  if (!password || password.length<8) { showToast('error','Password Lemah','Password minimal 8 karakter.'); return; }

  // Cek duplikat email
  const allEmails = [
    ...Object.keys(DEMO_ACCOUNTS),
    ...MANUAL_USERS.map(u => u.email),
    ...USERS.map(u => u.email),
  ];
  if (allEmails.includes(email)) { showToast('error','Email Sudah Digunakan','Gunakan email lain.'); return; }

  const newUser = {
    id: USERS.length + MANUAL_USERS.length + 10,
    nama, email, hp: hp || '-', password,
    peran: tambahPenggunaRole,
    status,
    bergabung: new Date().toLocaleDateString('id-ID', {day:'numeric',month:'short',year:'numeric'}),
  };

  // Simpan ke MANUAL_USERS (persisten)
  MANUAL_USERS.push(newUser);
  localStorage.setItem('manual_users', JSON.stringify(MANUAL_USERS));

  // Tambah ke USERS agar muncul di tabel
  USERS.push(newUser);

  // Tambah ke DEMO_ACCOUNTS agar bisa login
  DEMO_ACCOUNTS[email] = { password, nama, peran: tambahPenggunaRole, email, hp: hp || '-' };

  closeTambahPengguna();
  renderUserTable(USERS);
  showToast('success','Pengguna Berhasil Ditambah',`${nama} (${tambahPenggunaRole}) sudah bisa login.`);
}

// ══════════════════════════════════════════════════════════
//  TAMBAH PESANAN MANUAL (ADMIN)
// ══════════════════════════════════════════════════════════
function openTambahPesananAdmin() {
  // Isi dropdown produk
  const sel = document.getElementById('tpa-produk');
  if (sel) {
    sel.innerHTML = '<option value="">— Pilih Produk —</option>' +
      PRODUCTS.map(p => `<option value="${p.id}">${p.emoji} ${p.nama} (Rp ${p.harga.toLocaleString('id-ID')}/${p.satuan})</option>`).join('');
  }
  // Reset fields
  ['tpa-qty','tpa-pembeli','tpa-alamat','tpa-catatan'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  const ti = document.getElementById('tpa-total-display'); if (ti) ti.value = '';
  const ib = document.getElementById('tpa-info-box'); if (ib) ib.style.display = 'none';
  const st = document.getElementById('tpa-status'); if (st) st.value = 'menunggu';

  document.getElementById('modal-tambah-pesanan-admin').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeTambahPesananAdmin(e) {
  if (!e || e.target === document.getElementById('modal-tambah-pesanan-admin')) {
    document.getElementById('modal-tambah-pesanan-admin').classList.remove('active');
    document.body.style.overflow = '';
  }
}

function updateTambahPesananInfo() {
  const sel = document.getElementById('tpa-produk');
  const infoBox = document.getElementById('tpa-info-box');
  const pid = parseInt(sel.value);
  if (!pid) { infoBox.style.display = 'none'; return; }
  const p = PRODUCTS.find(x => x.id === pid);
  if (!p) return;
  infoBox.style.display = '';
  infoBox.innerHTML = `
    <span style="color:var(--white);font-weight:600">${p.emoji} ${p.nama}</span>
    &nbsp;·&nbsp; Penjual: <strong style="color:var(--accent)">${p.penjual}</strong>
    &nbsp;·&nbsp; Stok: ${p.stok.toLocaleString('id-ID')} ${p.satuan}
    &nbsp;·&nbsp; Harga: <strong style="color:var(--violet)">Rp ${p.harga.toLocaleString('id-ID')}/${p.satuan}</strong>
  `;
  updateTambahPesananTotal();
}

function updateTambahPesananTotal() {
  const pid = parseInt(document.getElementById('tpa-produk').value);
  const qty = parseInt(document.getElementById('tpa-qty').value) || 0;
  const td  = document.getElementById('tpa-total-display');
  if (!pid || !qty) { if (td) td.value = ''; return; }
  const p = PRODUCTS.find(x => x.id === pid);
  if (p && td) td.value = 'Rp ' + (p.harga * qty).toLocaleString('id-ID');
}

function submitTambahPesananAdmin() {
  const pid     = parseInt(document.getElementById('tpa-produk').value);
  const qty     = parseInt(document.getElementById('tpa-qty').value) || 0;
  const pembeli = document.getElementById('tpa-pembeli').value.trim();
  const alamat  = document.getElementById('tpa-alamat').value.trim();
  const status  = document.getElementById('tpa-status').value;

  if (!pid)    { showToast('error','Produk Belum Dipilih','Pilih produk terlebih dahulu.'); return; }
  if (qty < 1) { showToast('error','Jumlah Tidak Valid','Masukkan jumlah yang valid.'); return; }
  if (!pembeli){ showToast('error','Nama Pembeli Kosong','Isi nama pembeli.'); return; }
  if (!alamat) { showToast('error','Alamat Kosong','Isi alamat pengiriman.'); return; }

  const p = PRODUCTS.find(x => x.id === pid);
  if (qty > p.stok) { showToast('error','Stok Tidak Cukup',`Stok tersedia: ${p.stok} ${p.satuan}.`); return; }

  const newOrder = {
    id:      'ORD-2025-' + String(ORDERS.length + 1).padStart(3,'0'),
    produk:  p.nama,
    qty, satuan: p.satuan, harga: p.harga,
    pembeli, penjual: p.penjual,
    status,
    tanggal: new Date().toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'}),
    total: qty * p.harga,
    catatan: document.getElementById('tpa-catatan').value.trim(),
  };

  ORDERS.push(newOrder);
  p.stok -= qty;

  closeTambahPesananAdmin();
  initAdminDashboard();
  switchTab('admin','pesanan');
  showToast('success','Pesanan Berhasil Dibuat!',`${newOrder.id} · Total Rp ${newOrder.total.toLocaleString('id-ID')}`);
}

// ── Filter admin orders by status ─────────────────────────
function filterAdminOrders(status, btn) {
  document.querySelectorAll('.admin-otab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  const filtered = status === 'semua' ? ORDERS : ORDERS.filter(o => o.status === status);
  renderOrderFull('order-full-admin', filtered, true);
}

// ── Filter orders pembeli/penjual ──────────────────────────
function filterOrders(role, status, btn) {
  const container = `order-full-${role}`;
  const isAdmin   = role === 'admin';
  document.querySelectorAll(`#tab-${role}-pesanan .otab`).forEach(t => t.classList.remove('active'));
  btn.classList.add('active');

  let myOrders;
  if (role === 'pembeli') {
    myOrders = ORDERS.filter(o => o.pembeli === currentUser.nama || currentUser.nama === 'Andi Santoso');
  } else {
    myOrders = ORDERS.filter(o => o.penjual === currentUser.nama || currentUser.nama === 'PT. Maju Jaya');
  }
  const filtered = status === 'semua' ? myOrders : myOrders.filter(o => o.status === status);
  renderOrderFull(container, filtered, isAdmin);
}

// ══════════════════════════════════════════════════════════
//  RENDER ORDERS
// ══════════════════════════════════════════════════════════
function renderOrderList(containerId, orders, isAdmin=false) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (!orders.length) { el.innerHTML = '<div style="padding:24px;text-align:center;color:var(--muted)">Belum ada pesanan.</div>'; return; }
  el.innerHTML = orders.map(o => orderCardHTML(o, isAdmin, false)).join('');
}

function renderOrderFull(containerId, orders, isAdmin=false) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (!orders.length) { el.innerHTML = '<div style="padding:40px;text-align:center;color:var(--muted)">Tidak ada pesanan ditemukan.</div>'; return; }
  el.innerHTML = orders.map(o => orderCardHTML(o, isAdmin, true)).join('');
}

function orderCardHTML(o, isAdmin, full) {
  const statusLabel = { menunggu:'Menunggu Pembayaran', diproses:'Sedang Diproses', dikirim:'Sedang Dikirim', selesai:'Selesai', baru:'Pesanan Baru', dikonfirmasi:'Dikonfirmasi', dispute:'Dispute 🔴' };
  const actions = buildOrderActions(o, isAdmin);
  return `
  <div class="order-card" id="oc-${o.id}">
    <div class="oc-top">
      <div class="oc-left">
        <div class="oc-id">${o.id}</div>
        <div class="oc-product">${o.produk}</div>
        <div class="oc-meta">${o.qty} ${o.satuan} · Rp ${o.harga.toLocaleString('id-ID')}/${o.satuan}${isAdmin ? ` · Pembeli: <strong>${o.pembeli}</strong>` : ` · Pembeli: <strong>${o.pembeli}</strong>`}</div>
      </div>
      <div class="oc-right">
        <div class="oc-total">Rp ${o.total.toLocaleString('id-ID')}</div>
        <div class="order-status status-${o.status}">${statusLabel[o.status]||o.status}</div>
        <div style="font-size:.72rem;color:var(--muted);margin-top:4px">${o.tanggal}</div>
      </div>
    </div>
    ${full || actions ? `<div class="order-actions">${actions}</div>` : ''}
  </div>`;
}

function buildOrderActions(o, isAdmin) {
  let btns = '';
  btns += `<button class="oa-btn ghost" onclick="openDetailOrder('${o.id}')">🔍 Detail</button>`;

  // Semua aksi hanya bisa dilakukan oleh Admin
  if (isAdmin) {
    // Konfirmasi pembayaran
    if (o.status === 'menunggu' || o.status === 'baru') {
      btns += `<button class="oa-btn primary" onclick="adminKonfirmasiPembayaran('${o.id}')">💳 Konfirmasi Bayar</button>`;
    }
    // Proses pesanan
    if (o.status === 'diproses') {
      btns += `<button class="oa-btn primary" onclick="adminKonfirmasiPesanan('${o.id}')">✅ Konfirmasi Pesanan</button>`;
    }
    // Tandai dikirim
    if (o.status === 'dikonfirmasi') {
      btns += `<button class="oa-btn primary" onclick="adminKirimPesanan('${o.id}')">🚚 Tandai Dikirim</button>`;
    }
    // Selesaikan (barang diterima)
    if (o.status === 'dikirim') {
      btns += `<button class="oa-btn primary" onclick="adminSelesaikanPesanan('${o.id}')">✅ Selesaikan</button>`;
    }
    // Resolve dispute
    if (o.status === 'dispute') {
      btns += `<button class="oa-btn primary" onclick="resolveDispute('${o.id}')">⚖️ Selesaikan Dispute</button>`;
    }
    // Batalkan (semua status kecuali selesai)
    if (!['selesai'].includes(o.status)) {
      btns += `<button class="oa-btn danger" onclick="adminBatalkanPesanan('${o.id}')">🚫 Batalkan</button>`;
    }
  } else {
    // Pembeli & Penjual hanya bisa lihat tracking kalau dikirim
    if (['dikirim','selesai'].includes(o.status)) {
      btns += `<button class="oa-btn ghost" onclick="showToast('success','Tracking','Lacak pengiriman aktif!')">📦 Lacak</button>`;
    }
    // Info: semua aksi lewat admin
    if (['menunggu','baru','diproses','dikonfirmasi'].includes(o.status)) {
      btns += `<span class="order-admin-note">⏳ Menunggu konfirmasi admin</span>`;
    }
  }
  return btns;
}

// ── Order actions — HANYA ADMIN ───────────────────────────
function adminKonfirmasiPembayaran(id) {
  const o = ORDERS.find(x=>x.id===id);
  if (!o) return;
  o.status = 'diproses';
  refreshCurrentDashboard();
  showToast('success','Pembayaran Dikonfirmasi','Pesanan masuk ke antrian proses.');
}
function adminKonfirmasiPesanan(id) {
  const o = ORDERS.find(x=>x.id===id);
  if (!o) return;
  o.status = 'dikonfirmasi';
  refreshCurrentDashboard();
  showToast('success','Pesanan Dikonfirmasi','Penjual diberitahu untuk memproses pengiriman.');
}
function adminKirimPesanan(id) {
  const o = ORDERS.find(x=>x.id===id);
  if (!o) return;
  o.status = 'dikirim';
  refreshCurrentDashboard();
  showToast('success','Status Diperbarui','Pesanan ditandai sedang dikirim.');
}
function adminSelesaikanPesanan(id) {
  const o = ORDERS.find(x=>x.id===id);
  if (!o) return;
  o.status = 'selesai';
  refreshCurrentDashboard();
  showToast('success','Pesanan Selesai','Dana diteruskan ke penjual.');
}
function adminBatalkanPesanan(id) {
  const o = ORDERS.find(x=>x.id===id);
  if (!o) return;
  o.status = 'batal';
  refreshCurrentDashboard();
  showToast('error','Pesanan Dibatalkan','Pesanan berhasil dibatalkan oleh admin.');
}
function resolveDispute(id) {
  const o = ORDERS.find(x=>x.id===id);
  if (!o) return;
  o.status = 'selesai';
  refreshCurrentDashboard();
  showToast('success','Dispute Diselesaikan','Dana telah dikembalikan ke pembeli.');
}

function refreshCurrentDashboard() {
  if (!currentUser) return;
  if (currentUser.peran === 'Admin')   initAdminDashboard();
  else if (currentUser.peran === 'Penjual') initPenjualDashboard();
  else                                  initPembeliDashboard();
}

// ── Detail order modal ─────────────────────────────────────
function openDetailOrder(id) {
  const o = ORDERS.find(x=>x.id===id);
  if (!o) return;
  const statusLabel = { menunggu:'Menunggu Pembayaran', diproses:'Sedang Diproses', dikirim:'Sedang Dikirim', selesai:'Selesai', baru:'Pesanan Baru', dikonfirmasi:'Dikonfirmasi', dispute:'Dispute 🔴' };
  document.getElementById('modal-order-content').innerHTML = `
    <div class="modal-title">Detail Pesanan 📦</div>
    <div class="modal-sub">${o.id} · ${o.tanggal}</div>
    <div class="success-info" style="margin-bottom:20px">
      <div class="si-row"><span class="si-label">Produk</span><span class="si-val">${o.produk}</span></div>
      <div class="si-row"><span class="si-label">Jumlah</span><span class="si-val">${o.qty} ${o.satuan}</span></div>
      <div class="si-row"><span class="si-label">Harga Satuan</span><span class="si-val">Rp ${o.harga.toLocaleString('id-ID')}/${o.satuan}</span></div>
      <div class="si-row"><span class="si-label">Total</span><span class="si-val" style="color:var(--accent);font-weight:700">Rp ${o.total.toLocaleString('id-ID')}</span></div>
      <div class="si-row"><span class="si-label">Pembeli</span><span class="si-val">${o.pembeli}</span></div>
      ${currentUser?.peran === 'Admin' ? `<div class="si-row"><span class="si-label">Penjual</span><span class="si-val">${o.penjual}</span></div>` : ''}
      <div class="si-row"><span class="si-label">Status</span><span class="si-val"><span class="order-status status-${o.status}">${statusLabel[o.status]||o.status}</span></span></div>
    </div>
    <button class="form-submit" onclick="closeOrderModal()">Tutup</button>
  `;
  document.getElementById('modal-order').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeOrderModal(e) {
  if (!e || e.target === document.getElementById('modal-order')) {
    document.getElementById('modal-order').classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ══════════════════════════════════════════════════════════
//  MODAL PEMESANAN (dari katalog)
// ══════════════════════════════════════════════════════════
function openOrderModal(productId) {
  if (!currentUser) { openModal('login'); return; }
  if (currentUser.peran !== 'Pembeli') { showToast('error','Akses Ditolak','Hanya pembeli yang bisa memesan produk.'); return; }
  const p = PRODUCTS.find(x=>x.id===productId);
  if (!p) return;

  const overlay = document.getElementById('modal-order');
  document.getElementById('modal-order-content').innerHTML = `
    <div class="modal-title">Buat Pesanan 🛒</div>
    <div class="modal-sub">${p.nama} · ${p.penjual}</div>
    <div style="background:rgba(99,102,241,0.06);border:1px solid var(--border-subtle);border-radius:12px;padding:16px;margin-bottom:20px;display:flex;align-items:center;gap:14px">
      <span style="font-size:2.5rem">${p.emoji}</span>
      <div>
        <div style="font-family:'Syne',sans-serif;font-weight:700;font-size:.95rem">${p.nama}</div>
        <div style="font-size:.78rem;color:var(--muted);margin-top:2px">📍 ${p.lokasi} · Stok: ${p.stok.toLocaleString('id-ID')} ${p.satuan}</div>
        <div style="font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:800;color:var(--accent);margin-top:6px">Rp ${p.harga.toLocaleString('id-ID')}/${p.satuan}</div>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Jumlah (${p.satuan})</label>
      <input class="form-input" id="order-qty" type="number" min="1" max="${p.stok}" placeholder="Masukkan jumlah" oninput="updateOrderTotal(${p.harga},'${p.satuan}')" />
    </div>
    <div class="form-group">
      <label class="form-label">Alamat Pengiriman</label>
      <input class="form-input" id="order-alamat" type="text" placeholder="Jalan, Kota, Provinsi" />
    </div>
    <div class="form-group">
      <label class="form-label">Catatan (opsional)</label>
      <textarea class="form-input" id="order-catatan" rows="2" placeholder="Spesifikasi khusus, jadwal pickup, dll…" style="resize:vertical"></textarea>
    </div>
    <div id="order-total-box" style="display:none;background:rgba(34,211,238,0.06);border:1px solid rgba(34,211,238,0.2);border-radius:10px;padding:14px;margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="color:var(--muted);font-size:.85rem">Total Pembayaran</span>
        <span id="order-total-val" style="font-family:'Syne',sans-serif;font-size:1.2rem;font-weight:800;color:var(--accent)">Rp 0</span>
      </div>
    </div>
    <button class="form-submit" onclick="submitOrder(${p.id})">Pesan Sekarang →</button>
    <p style="font-size:.72rem;color:rgba(255,255,255,.3);text-align:center;margin-top:10px">Dana akan disimpan escrow hingga barang Anda terima</p>
  `;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function updateOrderTotal(harga, satuan) {
  const qty = parseInt(document.getElementById('order-qty').value)||0;
  const box = document.getElementById('order-total-box');
  const val = document.getElementById('order-total-val');
  if (qty > 0) {
    box.style.display = 'block';
    val.textContent   = 'Rp ' + (qty * harga).toLocaleString('id-ID');
  } else {
    box.style.display = 'none';
  }
}

function submitOrder(productId) {
  const p       = PRODUCTS.find(x=>x.id===productId);
  const qty     = parseInt(document.getElementById('order-qty').value)||0;
  const alamat  = document.getElementById('order-alamat').value.trim();

  if (!qty || qty < 1) { showToast('error','Jumlah Invalid','Masukkan jumlah yang valid.'); return; }
  if (!alamat)         { showToast('error','Alamat Kosong','Masukkan alamat pengiriman.'); return; }
  if (qty > p.stok)   { showToast('error','Stok Tidak Cukup',`Stok tersedia: ${p.stok} ${p.satuan}.`); return; }

  const newOrder = {
    id:      'ORD-2025-' + String(ORDERS.length + 1).padStart(3,'0'),
    produk:  p.nama,
    qty:     qty,
    satuan:  p.satuan,
    harga:   p.harga,
    pembeli: currentUser.nama,
    penjual: p.penjual,
    status:  'menunggu',
    tanggal: new Date().toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'}),
    total:   qty * p.harga,
  };
  ORDERS.push(newOrder);
  p.stok -= qty;

  closeOrderModal();
  showToast('success','Pesanan Berhasil Dibuat!',`${newOrder.id} · Total Rp ${newOrder.total.toLocaleString('id-ID')}`);
  pushNotif('🛒', 'Pesanan Berhasil!', `${newOrder.id} sedang menunggu konfirmasi admin.`);

  // Refresh & arahkan ke tab pesanan
  setTimeout(() => {
    initPembeliDashboard();
    switchTab('pembeli','pesanan');
  }, 400);
}

// ══════════════════════════════════════════════════════════
//  MODAL TAMBAH PRODUK (penjual)
// ══════════════════════════════════════════════════════════
function openAddProduct() {
  document.getElementById('modal-produk').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeProductModal(e) {
  if (!e || e.target === document.getElementById('modal-produk')) {
    document.getElementById('modal-produk').classList.remove('active');
    document.body.style.overflow = '';
  }
}
function submitProduct() {
  const nama    = document.getElementById('prod-nama').value.trim();
  const kat     = document.getElementById('prod-kategori').value;
  const harga   = parseInt(document.getElementById('prod-harga').value)||0;
  const stok    = parseInt(document.getElementById('prod-stok').value)||0;
  const lokasi  = document.getElementById('prod-lokasi').value.trim();
  if (!nama||!kat||!harga||!stok||!lokasi) { showToast('error','Form Belum Lengkap','Isi semua field yang diperlukan.'); return; }

  const newProd = { id: PRODUCTS.length+1, nama, kat, harga, stok, satuan:'kg', lokasi, emoji:'📦', badge:'Baru', penjual: currentUser.nama };
  PRODUCTS.push(newProd);
  closeProductModal();
  showToast('success','Produk Berhasil Diupload!',`${nama} sudah aktif di katalog.`);
  setTimeout(() => {
    const myProducts = PRODUCTS.filter(p => p.penjual === currentUser.nama);
    renderMyProducts(myProducts);
    switchTab('penjual','produk');
  }, 400);
}

// ══════════════════════════════════════════════════════════
//  TOAST
// ══════════════════════════════════════════════════════════
function showToast(type, title, sub) {
  document.querySelectorAll('.toast').forEach(t=>t.remove());
  const icon  = type === 'success' ? '🎉' : '⚠️';
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icon}</span><div class="toast-text"><div class="toast-title">${title}</div><div class="toast-sub">${sub}</div></div>`;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ══════════════════════════════════════════════════════════
//  SISTEM NOTIFIKASI
// ══════════════════════════════════════════════════════════
let NOTIFS = [];

const NOTIF_TEMPLATES = {
  Pembeli: [
    { icon:'📦', title:'Pesanan Dikonfirmasi', sub:'ORD-2025-003 sedang diproses oleh penjual.', time:'2 menit lalu' },
    { icon:'🚚', title:'Barang Dalam Perjalanan', sub:'ORD-2025-002 sedang dikirim ke alamat Anda.', time:'1 jam lalu' },
    { icon:'✅', title:'Pesanan Selesai', sub:'ORD-2025-001 telah selesai. Terima kasih!', time:'2 hari lalu' },
    { icon:'💬', title:'Promo Spesial!', sub:'Diskon 10% untuk pembelian Scrap Besi minggu ini.', time:'3 hari lalu' },
  ],
  Penjual: [
    { icon:'🛒', title:'Pesanan Baru Masuk!', sub:'ORD-2025-004 menunggu konfirmasi Anda.', time:'5 menit lalu' },
    { icon:'💳', title:'Pembayaran Diterima', sub:'ORD-2025-005 sudah dibayar, segera proses.', time:'30 menit lalu' },
    { icon:'⭐', title:'Rating Baru', sub:'Pembeli memberi bintang 5 untuk pesanan Anda.', time:'1 hari lalu' },
  ],
  Admin: [
    { icon:'👤', title:'Pengguna Baru Mendaftar', sub:'CV. Daur Ulang Makmur menunggu verifikasi.', time:'10 menit lalu' },
    { icon:'⚠️', title:'Dispute Aktif', sub:'ORD-2025-008 masuk status dispute.', time:'1 jam lalu' },
    { icon:'📊', title:'Laporan Harian', sub:'Ringkasan transaksi hari ini sudah tersedia.', time:'3 jam lalu' },
    { icon:'🔔', title:'Produk Stok Kritis', sub:'5 produk hampir kehabisan stok.', time:'5 jam lalu' },
  ],
};

function initNotifs() {
  if (!currentUser) return;
  const templates = NOTIF_TEMPLATES[currentUser.peran] || [];
  NOTIFS = templates.map((t, i) => ({ ...t, id: i + 1, read: false }));
  updateNotifBadge();
}

function updateNotifBadge() {
  const unread = NOTIFS.filter(n => !n.read).length;
  const badge  = document.getElementById('notif-badge-count') ||
                 document.querySelector('.notif-badge-count');
  if (badge) {
    if (unread > 0) { badge.textContent = unread; badge.style.display = 'flex'; }
    else            { badge.style.display = 'none'; }
  }
}

function toggleNotifPanel() {
  const panel = document.getElementById('notif-panel');
  if (!panel) return;
  const isOpen = panel.classList.toggle('active');
  if (isOpen) renderNotifList();
  // Tutup user dropdown kalau terbuka
  document.getElementById('nav-user')?.classList.remove('open');
}

function renderNotifList() {
  const list = document.getElementById('notif-list');
  if (!list) return;
  if (!NOTIFS.length) {
    list.innerHTML = '<div style="padding:24px;text-align:center;color:var(--muted);font-size:.85rem">Tidak ada notifikasi.</div>';
    return;
  }
  list.innerHTML = NOTIFS.map(n => `
    <div class="notif-item ${n.read ? 'read' : 'unread'}" onclick="readNotif(${n.id})">
      <div class="notif-icon-wrap">${n.icon}</div>
      <div class="notif-content">
        <div class="notif-title">${n.title}</div>
        <div class="notif-sub">${n.sub}</div>
        <div class="notif-time">${n.time}</div>
      </div>
      ${!n.read ? '<div class="notif-dot"></div>' : ''}
    </div>`).join('');
}

function readNotif(id) {
  const n = NOTIFS.find(x => x.id === id);
  if (n) n.read = true;
  renderNotifList();
  updateNotifBadge();
}

function markAllRead() {
  NOTIFS.forEach(n => n.read = true);
  renderNotifList();
  updateNotifBadge();
}

// Tambah notif baru (dipanggil saat ada event penting)
function pushNotif(icon, title, sub) {
  NOTIFS.unshift({ id: Date.now(), icon, title, sub, time: 'Baru saja', read: false });
  updateNotifBadge();
  // Animasi bell
  const btn = document.getElementById('notif-btn');
  if (btn) { btn.style.animation = 'none'; btn.offsetHeight; btn.style.animation = 'bellRing 0.5s ease'; }
}

// Tutup panel notif kalau klik di luar
document.addEventListener('click', e => {
  const wrap = document.querySelector('.notif-wrap');
  if (wrap && !wrap.contains(e.target)) {
    document.getElementById('notif-panel')?.classList.remove('active');
  }
});

// ══════════════════════════════════════════════════════════
//  DOWNLOAD LAPORAN
// ══════════════════════════════════════════════════════════
function downloadLaporanCSV() {
  const header = ['ID Pesanan','Produk','Qty','Satuan','Harga Satuan','Total','Pembeli','Status','Tanggal'];
  const rows = ORDERS.map(o => [
    o.id, o.produk, o.qty, o.satuan,
    o.harga, o.total, o.pembeli, o.status, o.tanggal
  ]);
  const csv = [header, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  downloadFile('laporan-pesanan-luasjaya.csv', csv, 'text/csv');
  showToast('success','Export Berhasil','File CSV pesanan berhasil diunduh.');
}

function downloadLaporanPengguna() {
  const header = ['ID','Nama','Email','Peran','Status','Bergabung'];
  const rows = USERS.map(u => [u.id, u.nama, u.email, u.peran, u.status, u.bergabung]);
  const csv = [header, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  downloadFile('data-pengguna-luasjaya.csv', csv, 'text/csv');
  showToast('success','Export Berhasil','File CSV pengguna berhasil diunduh.');
}

function downloadLaporanPDF() {
  // Buat konten HTML untuk print/PDF
  const totalOmzet = ORDERS.filter(o=>o.status==='selesai').reduce((a,o)=>a+o.total,0);
  const totalPesanan = ORDERS.length;
  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Laporan UD. LUAS JAYA</title>
<style>
  body{font-family:Arial,sans-serif;padding:32px;color:#111;font-size:13px}
  h1{color:#4F46E5;margin-bottom:4px}
  .sub{color:#666;margin-bottom:24px;font-size:12px}
  table{width:100%;border-collapse:collapse;margin-top:16px}
  th{background:#4F46E5;color:#fff;padding:9px 10px;text-align:left;font-size:12px}
  td{padding:8px 10px;border-bottom:1px solid #eee}
  tr:nth-child(even) td{background:#f8f8ff}
  .summary{display:flex;gap:20px;margin-bottom:20px;flex-wrap:wrap}
  .scard{border:2px solid #4F46E5;border-radius:8px;padding:14px 20px;min-width:150px}
  .scard-num{font-size:22px;font-weight:700;color:#4F46E5}
  .scard-label{font-size:11px;color:#666;margin-top:2px}
</style></head><body>
<h1>📊 Laporan Platform UD. LUAS JAYA</h1>
<div class="sub">Dicetak: ${new Date().toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</div>
<div class="summary">
  <div class="scard"><div class="scard-num">${totalPesanan}</div><div class="scard-label">Total Pesanan</div></div>
  <div class="scard"><div class="scard-num">${ORDERS.filter(o=>o.status==='selesai').length}</div><div class="scard-label">Pesanan Selesai</div></div>
  <div class="scard"><div class="scard-num">Rp ${(totalOmzet/1000000).toFixed(1)} Jt</div><div class="scard-label">Total Omzet</div></div>
  <div class="scard"><div class="scard-num">${USERS.length}</div><div class="scard-label">Total Pengguna</div></div>
</div>
<table>
  <tr><th>#</th><th>ID Pesanan</th><th>Produk</th><th>Pembeli</th><th>Total</th><th>Status</th><th>Tanggal</th></tr>
  ${ORDERS.map((o,i)=>`<tr><td>${i+1}</td><td>${o.id}</td><td>${o.produk}</td><td>${o.pembeli}</td><td>Rp ${o.total.toLocaleString('id-ID')}</td><td>${o.status}</td><td>${o.tanggal}</td></tr>`).join('')}
</table>
</body></html>`;
  const win = window.open('','_blank');
  if (win) { win.document.write(html); win.document.close(); setTimeout(()=>win.print(),400); }
  showToast('success','Siap Cetak / PDF','Jendela print sudah dibuka.');
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ══════════════════════════════════════════════════════════
//  SEARCH PRODUK (KATALOG PEMBELI)
// ══════════════════════════════════════════════════════════
function searchKatalog(query) {
  const q = query.toLowerCase().trim();
  const filtered = q
    ? PRODUCTS.filter(p =>
        p.nama.toLowerCase().includes(q) ||
        p.kat.toLowerCase().includes(q)  ||
        p.lokasi.toLowerCase().includes(q))
    : PRODUCTS;
  const grid = document.getElementById('katalog-pembeli');
  if (!grid) return;
  if (!filtered.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--muted)">Produk tidak ditemukan untuk "<strong>${q}</strong>"</div>`;
    return;
  }
  grid.innerHTML = filtered.map(p => `
    <div class="db-prod-card" onclick="openOrderModal(${p.id})">
      <div class="db-prod-img">${p.emoji}<span class="prod-badge" style="position:absolute;top:8px;right:8px;font-size:.6rem;background:rgba(99,102,241,.8);color:#fff;padding:2px 7px;border-radius:20px">${p.badge}</span></div>
      <div class="db-prod-body">
        <div class="db-prod-name">${p.nama}</div>
        <div class="db-prod-meta">📍 ${p.lokasi} · ${p.stok.toLocaleString('id-ID')} ${p.satuan}</div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
          <div class="db-prod-price">Rp ${p.harga.toLocaleString('id-ID')}<span style="font-size:.7rem;color:var(--muted);font-weight:400">/${p.satuan}</span></div>
          <button class="oa-btn primary" onclick="event.stopPropagation();openOrderModal(${p.id})">Pesan</button>
        </div>
      </div>
    </div>`).join('');
}

// ══════════════════════════════════════════════════════════
//  TAMBAH PRODUK ADMIN (dengan opsional tambah pengguna)
// ══════════════════════════════════════════════════════════
function openTambahProdukAdmin() {
  // Isi dropdown penjual
  const sel = document.getElementById('tprod-penjual');
  if (sel) {
    const sellers = USERS.filter(u => u.peran === 'Penjual');
    sel.innerHTML = '<option value="">— Pilih Penjual —</option>' +
      sellers.map(s => `<option value="${s.nama}">${s.nama}</option>`).join('') +
      '<option value="__new__">➕ Tambah Penjual Baru</option>';
  }
  // Reset form
  ['tprod-nama','tprod-harga','tprod-stok','tprod-lokasi','tprod-desc'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  ['tprod-kat','tprod-satuan'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.selectedIndex=0;
  });
  const sec = document.getElementById('tprod-new-penjual-sec');
  if (sec) sec.style.display = 'none';
  document.getElementById('modal-tambah-produk-admin').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeTambahProdukAdmin(e) {
  if (!e || e.target === document.getElementById('modal-tambah-produk-admin')) {
    document.getElementById('modal-tambah-produk-admin').classList.remove('active');
    document.body.style.overflow = '';
  }
}

function onChangePenjualDropdown() {
  const val = document.getElementById('tprod-penjual').value;
  const sec = document.getElementById('tprod-new-penjual-sec');
  if (sec) sec.style.display = val === '__new__' ? '' : 'none';
}

function submitTambahProdukAdmin() {
  const penjualVal = document.getElementById('tprod-penjual').value;
  const nama    = document.getElementById('tprod-nama').value.trim();
  const kat     = document.getElementById('tprod-kat').value;
  const harga   = parseInt(document.getElementById('tprod-harga').value) || 0;
  const stok    = parseInt(document.getElementById('tprod-stok').value) || 0;
  const satuan  = document.getElementById('tprod-satuan').value;
  const lokasi  = document.getElementById('tprod-lokasi').value.trim();

  if (!nama || !kat || !harga || !stok || !lokasi) {
    showToast('error','Form Belum Lengkap','Isi semua field produk.'); return;
  }

  let penjualNama = penjualVal;

  // Kalau tambah penjual baru
  if (penjualVal === '__new__') {
    const npNama  = document.getElementById('tprod-np-nama').value.trim();
    const npEmail = document.getElementById('tprod-np-email').value.trim();
    const npPw    = document.getElementById('tprod-np-pw').value;
    if (!npNama)                         { showToast('error','Nama Penjual Kosong','Isi nama penjual baru.'); return; }
    if (!npEmail || !npEmail.includes('@')){ showToast('error','Email Tidak Valid','Masukkan email penjual.'); return; }
    if (!npPw || npPw.length < 8)        { showToast('error','Password Lemah','Min. 8 karakter.'); return; }

    // Cek duplikat
    const allEmails = [...Object.keys(DEMO_ACCOUNTS), ...MANUAL_USERS.map(u=>u.email)];
    if (allEmails.includes(npEmail)) { showToast('error','Email Sudah Terdaftar','Gunakan email lain.'); return; }

    const newUser = {
      id: USERS.length + MANUAL_USERS.length + 10,
      nama: npNama, email: npEmail, hp: '-', password: npPw,
      peran: 'Penjual', status: 'Terverifikasi',
      bergabung: new Date().toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'}),
    };
    MANUAL_USERS.push(newUser);
    localStorage.setItem('manual_users', JSON.stringify(MANUAL_USERS));
    USERS.push(newUser);
    DEMO_ACCOUNTS[npEmail] = { password: npPw, nama: npNama, peran:'Penjual', email: npEmail, hp:'-' };
    penjualNama = npNama;
    pushNotif('👤', 'Penjual Baru Ditambahkan', `${npNama} berhasil didaftarkan.`);
  }

  if (!penjualNama || penjualNama === '__new__') {
    showToast('error','Penjual Belum Dipilih','Pilih atau tambah penjual.'); return;
  }

  const emojiMap = { 'Logam & Besi':'🔩', 'Plastik':'🥤', 'Kertas & Karton':'📦', 'Elektronik':'⚡', 'Kayu':'🪵', 'Kimia & Oli':'🧴', 'Tekstil Industri':'🏭', 'Baterai & Aki':'🔋' };
  const newProd = {
    id: PRODUCTS.length + 1, nama, kat, harga, stok, satuan, lokasi,
    emoji: emojiMap[kat] || '📦', badge: 'Baru', penjual: penjualNama,
    deskripsi: document.getElementById('tprod-desc')?.value.trim() || '',
  };
  PRODUCTS.push(newProd);

  closeTambahProdukAdmin();
  initAdminDashboard();
  showToast('success','Produk Berhasil Ditambahkan!',`${nama} oleh ${penjualNama} sudah aktif.`);
  pushNotif('📋', 'Produk Baru Ditambahkan', `${nama} masuk ke katalog.`);
}

// ══════════════════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════════════════
function setEl(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

// ══════════════════════════════════════════════════════════
//  SCROLL ANIMATIONS
// ══════════════════════════════════════════════════════════
const observer = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.1 }
);
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ── Escape close ──────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(); closeOrderModal(); closeProductModal(); closeForgotModal(); }
});

function filterKatalogChip(kat, chipEl) {
  document.querySelectorAll('.filter-chips .chip').forEach(c => c.classList.remove('active'));
  chipEl.classList.add('active');
  const grid = document.getElementById('katalog-pembeli');
  if (!grid) return;
  const filtered = kat ? PRODUCTS.filter(p => p.kat.toLowerCase().includes(kat.toLowerCase())) : PRODUCTS;
  grid.innerHTML = filtered.map(p => `
    <div class="db-prod-card" onclick="openOrderModal(${p.id})">
      <div class="db-prod-img">${p.emoji}</div>
      <div class="db-prod-body">
        <div class="db-prod-name">${p.nama}</div>
        <div class="db-prod-meta">📍 ${p.lokasi} · ${p.stok.toLocaleString('id-ID')} ${p.satuan}</div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
          <div class="db-prod-price">Rp ${p.harga.toLocaleString('id-ID')}<span style="font-size:.7rem;color:var(--muted);font-weight:400">/${p.satuan}</span></div>
          <button class="oa-btn primary" onclick="event.stopPropagation();openOrderModal(${p.id})">Pesan</button>
        </div>
      </div>
    </div>`).join('');
}

// ── Filter chips (katalog pembeli) ────────────────────────
document.querySelectorAll('.filter-chips .chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.filter-chips .chip').forEach(c=>c.classList.remove('active'));
    chip.classList.add('active');
  });
});

function toggleChat(){
  const win = document.getElementById('chat-window');
  const iconOpen  = document.querySelector('.chat-icon-open');
  const iconClose = document.querySelector('.chat-icon-close');
  const notif     = document.getElementById('chat-notif-dot');

  const isOpen = win.classList.toggle('active');
  if (iconOpen)  iconOpen.style.display  = isOpen ? 'none' : '';
  if (iconClose) iconClose.style.display = isOpen ? ''     : 'none';
  if (notif)     notif.style.display     = 'none'; // clear notif saat dibuka
}

function sendChat(){
  const input    = document.getElementById('chatInput');
  const messages = document.getElementById('chatMessages');

  if(!input.value.trim()) return;

  const text = input.value.trim();

  messages.innerHTML += `
    <div class="chat-msg-wrap me-wrap">
      <div class="chat-msg me">${text}</div>
    </div>
  `;

  input.value = '';
  messages.scrollTop = messages.scrollHeight;

  setTimeout(()=>{
    messages.innerHTML += `
      <div class="chat-msg-wrap admin-wrap">
        <div class="chat-msg-avatar">LJ</div>
        <div class="chat-msg admin">Terima kasih pesannya! Tim kami akan segera membalas pesan Anda. 🙏</div>
      </div>
    `;
    messages.scrollTop = messages.scrollHeight;
  }, 700);
}