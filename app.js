// ==========================================================================
// AntinKuntin - Core Platform Application Logic
// Features: Modern Game Library, PotatoBros integration,
// Left Sidebar Favorites, Account System (Register/Login & State Syncing)
// ==========================================================================

const GAMES_DATA = [
  {
    id: 'potatobros',
    title: 'PotatoBros: Arena Hayatta Kalma',
    tag: 'Aksiyon & Hayatta Kalma',
    category: 'games',
    emoji: '🥔',
    isNew: true,
    color: '#0284c7',
    iconBg: '#e0f2fe',
    desc: 'Brotato tarzı hızlı arena aksiyonu! Dalgadan dalgaya düşmanları biç, patates gücünü artır ve sonuna kadar hayatta kal.',
    url: 'potatobros.html'
  },
  {
    id: 'kum-havuzu',
    title: 'Piksel Kum Havuzu (Sandboxels)',
    tag: 'Fizik & Simülasyon',
    category: 'simulation',
    emoji: '⏳',
    color: '#eab308',
    iconBg: '#fef3c7',
    desc: 'Neal.fun klasiği! 500\'den fazla element, lav, su, elektrik, asit ve yaşam formlarıyla piksel deneyleri yap.',
    url: 'games/kum-havuzu/index.html'
  },
  {
    id: 'para-harca',
    title: 'Türk Zengini Serveti Bitir',
    tag: 'Simülasyon',
    category: 'simulation',
    emoji: '💸',
    color: '#10b981',
    iconBg: '#d1fae5',
    desc: '100 Milyar TL dev bütçe ile Boğaz yalıları, Togg filoları, çeyrek altın alıp serveti sıfırlamaya çalış!',
    url: 'games/para-harca/index.html'
  },
  {
    id: 'metrobuse-bin',
    title: 'Metrobüse Binme Simülatörü',
    tag: 'Refleks Oyunu',
    category: 'games',
    emoji: '🚌',
    color: '#06b6d4',
    iconBg: '#cffafe',
    desc: 'Zincirlikuyu aktarmasında kapı açılınca ezilmeden içeri adım atabilecek misin? Reflekslerini sına!',
    url: 'games/metrobuse-bin/index.html'
  },
  {
    id: 'asgari-karsilastir',
    title: 'Maaşınla Ne Alabiliyorsun?',
    tag: 'Absürt Kıyas',
    category: 'fun',
    emoji: '🪙',
    color: '#f59e0b',
    iconBg: '#fef3c7',
    desc: 'Maaşını gir; kaç bin tane çıtır simite veya kaç metre köprü asfaltına denk geldiğini anında hesapla.',
    url: 'games/asgari-karsilastir/index.html'
  },
  {
    id: 'memleket-carki',
    title: 'Memleket Dedikodu Çarkı',
    tag: 'Mizah & Oyun',
    category: 'fun',
    emoji: '🎡',
    color: '#8b5cf6',
    iconBg: '#ede9fe',
    desc: 'Çarkı çevir; 81 ilden rastgele absürt şehir efsaneleri, yöresel dedikodular ve eğlenceli görevler kazan!',
    url: 'games/memleket-carki/index.html'
  },
  {
    id: 'derinlik',
    title: 'İstanbul\'un Altına İn',
    tag: 'İnteraktif Skrol',
    category: 'simulation',
    emoji: '⛏️',
    color: '#3b82f6',
    iconBg: '#dbeafe',
    desc: 'Aşağı kaydırdıkça Marmaray\'ın, Bizans sarnıçlarının ve derin metro tünellerinin gizemlerine in.',
    url: 'games/derinlik/index.html'
  }
];

// ==========================================================================
// Account & Favorites Persistence Service
// ==========================================================================
class AuthService {
  constructor() {
    this.STORAGE_USERS_KEY = 'antinkuntin_registered_users';
    this.STORAGE_ACTIVE_USER = 'antinkuntin_current_session';
    this.STORAGE_GUEST_FAVS = 'antinkuntin_guest_favorites';
  }

  // Get all registered users from localStorage
  getUsers() {
    try {
      const data = localStorage.getItem(this.STORAGE_USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  // Save users array
  saveUsers(users) {
    localStorage.setItem(this.STORAGE_USERS_KEY, JSON.stringify(users));
  }

  // Get currently active logged-in user session
  getCurrentUser() {
    try {
      const data = localStorage.getItem(this.STORAGE_ACTIVE_USER);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  // Register new account (Supabase + Local fallback)
  async register(username, email, password) {
    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim() || cleanEmail.split('@')[0];
    const guestFavs = this.getGuestFavorites();

    const sb = window.AntinDB ? window.AntinDB.client : null;
    if (sb) {
      try {
        const { data, error } = await sb.auth.signUp({
          email: cleanEmail,
          password: password,
          options: {
            data: { 
              username: cleanUsername,
              favorites: guestFavs 
            }
          }
        });
        if (error) {
          return { success: false, message: error.message };
        }
        const newUser = {
          id: data.user?.id || 'usr_' + Date.now(),
          username: cleanUsername,
          email: cleanEmail,
          favorites: guestFavs,
          createdAt: new Date().toISOString()
        };
        this.updateUser(newUser);
        if (guestFavs.length > 0) {
          localStorage.removeItem(this.STORAGE_GUEST_FAVS);
        }
        return { success: true, user: newUser };
      } catch (e) {
        console.warn('Supabase kayıt uyarısı, yerel kaydediliyor:', e);
      }
    }

    const users = this.getUsers();
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'Bu e-posta adresiyle kayıtlı bir hesap zaten var.' };
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      username: cleanUsername,
      email: cleanEmail,
      password: password,
      favorites: guestFavs,
      createdAt: new Date().toISOString()
    };

    this.updateUser(newUser);
    if (guestFavs.length > 0) {
      localStorage.removeItem(this.STORAGE_GUEST_FAVS);
    }
    return { success: true, user: newUser };
  }

  // Login existing account (Supabase + Local fallback)
  async login(email, password) {
    const cleanEmail = email.trim().toLowerCase();
    const guestFavs = this.getGuestFavorites();

    const sb = window.AntinDB ? window.AntinDB.client : null;
    if (sb) {
      try {
        const { data, error } = await sb.auth.signInWithPassword({
          email: cleanEmail,
          password: password
        });
        if (error) {
          return { success: false, message: error.message };
        }
        const username = data.user?.user_metadata?.username || cleanEmail.split('@')[0];
        const users = this.getUsers();
        const localUser = users.find(u => u.email && u.email.toLowerCase() === cleanEmail);
        const metaFavs = Array.isArray(data.user?.user_metadata?.favorites) ? data.user.user_metadata.favorites : [];
        const localFavs = localUser && Array.isArray(localUser.favorites) ? localUser.favorites : [];
        const mergedFavs = Array.from(new Set([...metaFavs, ...localFavs, ...guestFavs]));

        const loggedUser = {
          id: data.user.id,
          username: username,
          email: cleanEmail,
          favorites: mergedFavs,
          createdAt: data.user.created_at || new Date().toISOString()
        };
        this.updateUser(loggedUser);
        if (guestFavs.length > 0) {
          localStorage.removeItem(this.STORAGE_GUEST_FAVS);
        }
        return { success: true, user: loggedUser };
      } catch (e) {
        console.warn('Supabase giriş uyarısı, yerel deneniyor:', e);
      }
    }

    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return { success: false, message: 'Bu e-posta adresine ait bir hesap bulunamadı.' };
    }

    if (user.password !== password) {
      return { success: false, message: 'Hatalı şifre girdiniz. Lütfen tekrar deneyin.' };
    }

    const merged = Array.from(new Set([...(user.favorites || []), ...guestFavs]));
    user.favorites = merged;
    this.updateUser(user);
    if (guestFavs.length > 0) {
      localStorage.removeItem(this.STORAGE_GUEST_FAVS);
    }

    return { success: true, user: user };
  }

  setCurrentUser(user) {
    if (!user) {
      localStorage.removeItem(this.STORAGE_ACTIVE_USER);
      return;
    }
    localStorage.setItem(this.STORAGE_ACTIVE_USER, JSON.stringify(user));
  }

  updateUser(updatedUser) {
    if (!updatedUser) return;
    const users = this.getUsers();
    const index = users.findIndex(u => 
      (updatedUser.id && u.id === updatedUser.id) ||
      (updatedUser.email && u.email && u.email.toLowerCase() === updatedUser.email.toLowerCase())
    );

    if (index !== -1) {
      users[index] = { ...users[index], ...updatedUser };
    } else {
      users.push(updatedUser);
    }
    this.saveUsers(users);
    this.setCurrentUser(updatedUser);

    // Sync to Supabase user_metadata if available
    const sb = window.AntinDB ? window.AntinDB.client : null;
    if (sb && sb.auth && updatedUser.favorites) {
      sb.auth.getUser().then(({ data }) => {
        if (data && data.user) {
          sb.auth.updateUser({
            data: {
              username: updatedUser.username,
              favorites: updatedUser.favorites
            }
          }).catch(err => console.warn('Supabase metadata senkronizasyon uyarısı:', err));
        }
      }).catch(() => {});
    }
  }

  async logout() {
    const sb = window.AntinDB ? window.AntinDB.client : null;
    if (sb) {
      try { await sb.auth.signOut(); } catch (e) {}
    }
    localStorage.removeItem(this.STORAGE_ACTIVE_USER);
  }

  // Guest favorites storage
  getGuestFavorites() {
    try {
      const data = localStorage.getItem(this.STORAGE_GUEST_FAVS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveGuestFavorites(favs) {
    localStorage.setItem(this.STORAGE_GUEST_FAVS, JSON.stringify(favs));
  }

  // Get current active favorites list
  getActiveFavorites() {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      return currentUser.favorites || [];
    }
    return this.getGuestFavorites();
  }

  // Toggle favorite game
  toggleFavorite(gameId) {
    const currentUser = this.getCurrentUser();
    let isFavorited = false;

    if (currentUser) {
      let favs = Array.isArray(currentUser.favorites) ? [...currentUser.favorites] : [];
      if (favs.includes(gameId)) {
        favs = favs.filter(id => id !== gameId);
        isFavorited = false;
      } else {
        favs.push(gameId);
        isFavorited = true;
      }
      currentUser.favorites = favs;
      this.updateUser(currentUser);
      return { isFavorited, count: favs.length, syncedWithAccount: true };
    } else {
      let favs = this.getGuestFavorites();
      if (favs.includes(gameId)) {
        favs = favs.filter(id => id !== gameId);
        isFavorited = false;
      } else {
        favs.push(gameId);
        isFavorited = true;
      }
      this.saveGuestFavorites(favs);
      return { isFavorited, count: favs.length, syncedWithAccount: false };
    }
  }
}

const auth = new AuthService();

// ==========================================================================
// UI Controller
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Main Elements
  const projectGrid = document.getElementById('projectGrid');
  const favoritesList = document.getElementById('favoritesList');
  const favCounter = document.getElementById('favCounter');
  const totalGameCount = document.getElementById('totalGameCount');
  const searchInput = document.getElementById('searchInput');
  const filterChips = document.querySelectorAll('.filter-chip');
  const syncStatusText = document.getElementById('syncStatusText');
  const syncDot = document.getElementById('syncDot');

  // Mobile Sidebar
  const sidebarToggle = document.getElementById('sidebarToggle');
  const favoritesSidebar = document.getElementById('favoritesSidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  // Auth Elements
  const authLoggedOut = document.getElementById('authLoggedOut');
  const authLoggedIn = document.getElementById('authLoggedIn');
  const openLoginBtn = document.getElementById('openLoginBtn');
  const openRegisterBtn = document.getElementById('openRegisterBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const userNameDisplay = document.getElementById('userNameDisplay');
  const userAvatarText = document.getElementById('userAvatarText');

  // Modal Elements
  const authModal = document.getElementById('authModal');
  const authModalClose = document.getElementById('authModalClose');
  const authModalTitle = document.getElementById('authModalTitle');
  const authModalSubtitle = document.getElementById('authModalSubtitle');
  const tabLogin = document.getElementById('tabLogin');
  const tabRegister = document.getElementById('tabRegister');
  const usernameGroup = document.getElementById('usernameGroup');
  const regUsername = document.getElementById('regUsername');
  const authEmail = document.getElementById('authEmail');
  const authPassword = document.getElementById('authPassword');
  const authSubmitBtn = document.getElementById('authSubmitBtn');
  const authForm = document.getElementById('authForm');
  const toastContainer = document.getElementById('toastContainer');

  let currentFilter = 'all';
  let searchQuery = '';
  let authMode = 'login'; // 'login' or 'register'

  if (totalGameCount) {
    totalGameCount.textContent = GAMES_DATA.length;
  }

  // Toast Notification Helper
  function showToast(message, isFav = false) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${isFav ? 'toast-fav' : ''}`;
    toast.innerHTML = `
      <span>${isFav ? '❤️' : '✨'}</span>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // Update Header Auth Status Display
  function updateAuthUI() {
    const currentUser = auth.getCurrentUser();
    const adminHeaderBtn = document.getElementById('adminHeaderBtn');

    if (currentUser) {
      if (authLoggedOut) authLoggedOut.style.display = 'none';
      if (authLoggedIn) authLoggedIn.style.display = 'flex';
      
      const displayName = currentUser.username || currentUser.email.split('@')[0];
      if (userNameDisplay) userNameDisplay.textContent = displayName;
      if (userAvatarText) userAvatarText.textContent = displayName.charAt(0).toUpperCase();

      if (syncStatusText) syncStatusText.textContent = `${displayName} hesabıyla senkronize`;
      if (syncDot) {
        syncDot.className = 'sync-dot';
      }

      // Admin Kontrolü
      if (adminHeaderBtn) {
        if (window.AntinDB && window.AntinDB.isAdmin(currentUser)) {
          adminHeaderBtn.style.display = 'inline-flex';
        } else {
          adminHeaderBtn.style.display = 'none';
        }
      }
    } else {
      if (authLoggedOut) authLoggedOut.style.display = 'flex';
      if (authLoggedIn) authLoggedIn.style.display = 'none';

      if (syncStatusText) syncStatusText.textContent = 'Favoriler tarayıcıya kayıtlı';
      if (syncDot) {
        syncDot.className = 'sync-dot offline';
      }

      if (adminHeaderBtn) {
        adminHeaderBtn.style.display = 'none';
      }
    }

    renderFavorites();
    renderGameGrid();
  }

  // Render Left Sidebar Favorites
  function renderFavorites() {
    if (!favoritesList) return;
    const favIds = auth.getActiveFavorites();
    const favGames = GAMES_DATA.filter(g => favIds.includes(g.id));

    if (favCounter) {
      favCounter.textContent = favGames.length;
    }

    if (favGames.length === 0) {
      favoritesList.innerHTML = `
        <div class="favorites-empty">
          <div class="empty-icon">⭐</div>
          <p>Henüz favori oyunun yok.</p>
          <div class="empty-tip">Beğendiğin oyunların kartındaki kalp (❤️) butonuna tıkla!</div>
        </div>
      `;
      return;
    }

    favoritesList.innerHTML = favGames.map(game => `
      <div class="fav-item">
        <a href="${game.url}" class="fav-item-main" title="${game.title} Oyununu Aç">
          <span class="fav-item-emoji">${game.emoji}</span>
          <span class="fav-item-title">${game.title}</span>
        </a>
        <button class="fav-remove-btn" data-remove-fav="${game.id}" title="Favorilerden Çıkar" aria-label="Favorilerden Çıkar">
          ✕
        </button>
      </div>
    `).join('');

    // Attach remove listeners
    favoritesList.querySelectorAll('[data-remove-fav]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-remove-fav');
        const game = GAMES_DATA.find(g => g.id === id);
        auth.toggleFavorite(id);
        renderFavorites();
        renderGameGrid();
        showToast(`"${game?.title || 'Oyun'}" favorilerden çıkarıldı.`);
      });
    });
  }

  // Render Main Game Cards
  function renderGameGrid() {
    if (!projectGrid) return;
    const favIds = auth.getActiveFavorites();

    const filtered = GAMES_DATA.filter(game => {
      // Category filter
      const matchesCategory = currentFilter === 'all' || game.category === currentFilter;
      // Search filter
      const matchesSearch = searchQuery === '' || 
        game.title.toLowerCase().includes(searchQuery) ||
        game.desc.toLowerCase().includes(searchQuery) ||
        game.tag.toLowerCase().includes(searchQuery);

      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      projectGrid.innerHTML = `
        <div style="grid-column: 1 / -1; background: #ffffff; border: 1px dashed #bae6fd; border-radius: 16px; padding: 48px 24px; text-align: center; color: #64748b;">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">🔍</div>
          <h3 style="color: #0f172a; margin-bottom: 8px;">Sonuç Bulunamadı</h3>
          <p>Aramanızla eşleşen bir oyun bulunamadı. Lütfen farklı anahtar kelimeler deneyin.</p>
        </div>
      `;
      return;
    }

    projectGrid.innerHTML = filtered.map(game => {
      const isFav = favIds.includes(game.id);
      return `
        <div class="game-card">
          <div class="card-top">
            <div class="card-icon-wrap" style="background: ${game.iconBg};">
              <span>${game.emoji}</span>
            </div>
            <button class="card-fav-btn ${isFav ? 'is-favorited' : ''}" 
                    data-toggle-fav="${game.id}" 
                    title="${isFav ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}"
                    aria-label="Favori Butonu">
              ${isFav ? '❤️' : '🤍'}
            </button>
          </div>

          <div style="display: flex; gap: 8px; align-items: center;">
            <span class="card-tag">${game.tag}</span>
            ${game.isNew ? '<span class="card-tag tag-new">🔥 Yeni Eklendi</span>' : ''}
          </div>

          <h3 class="card-title">${game.title}</h3>
          <p class="card-desc">${game.desc}</p>

          <div class="card-footer">
            <span style="font-size: 0.78rem; font-weight: 600; color: #64748b;">🎮 Tarayıcıda Hemen Oyna</span>
            <a href="${game.url}" class="card-play-btn">
              <span>Oyna</span>
              <span>➜</span>
            </a>
          </div>
        </div>
      `;
    }).join('');

    // Attach favorite toggle listeners
    projectGrid.querySelectorAll('[data-toggle-fav]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.getAttribute('data-toggle-fav');
        const game = GAMES_DATA.find(g => g.id === id);
        const res = auth.toggleFavorite(id);
        
        renderFavorites();
        renderGameGrid();

        if (res.isFavorited) {
          showToast(`"${game?.title}" favorilerine eklendi!`, true);
        } else {
          showToast(`"${game?.title}" favorilerden çıkarıldı.`);
        }
      });
    });
  }

  // Filter Chip Click Handling
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilter = chip.getAttribute('data-filter');
      renderGameGrid();
    });
  });

  // Search Input Handling
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderGameGrid();
    });
  }

  // Mobile Sidebar Toggle
  if (sidebarToggle && favoritesSidebar && sidebarOverlay) {
    sidebarToggle.addEventListener('click', () => {
      favoritesSidebar.classList.toggle('mobile-open');
      sidebarOverlay.classList.toggle('active');
    });

    sidebarOverlay.addEventListener('click', () => {
      favoritesSidebar.classList.remove('mobile-open');
      sidebarOverlay.classList.remove('active');
    });
  }

  // ==========================================================================
  // Auth Modal & Form Handling
  // ==========================================================================
  function setAuthMode(mode) {
    authMode = mode;
    if (mode === 'login') {
      tabLogin?.classList.add('active');
      tabRegister?.classList.remove('active');
      if (authModalTitle) authModalTitle.textContent = 'Hesabına Giriş Yap';
      if (authModalSubtitle) authModalSubtitle.textContent = 'Favorilerini ve oyun ilerlemelerini güvenle senkronize et.';
      if (usernameGroup) usernameGroup.style.display = 'none';
      if (authSubmitBtn) authSubmitBtn.textContent = 'Giriş Yap';
    } else {
      tabRegister?.classList.add('active');
      tabLogin?.classList.remove('active');
      if (authModalTitle) authModalTitle.textContent = 'Yeni Hesap Oluştur';
      if (authModalSubtitle) authModalSubtitle.textContent = 'Oyunlarını kaydet, favorilerini tüm cihazlarında taşı.';
      if (usernameGroup) usernameGroup.style.display = 'flex';
      if (authSubmitBtn) authSubmitBtn.textContent = 'Hesabımı Oluştur';
    }
  }

  function openAuthModal(mode = 'login') {
    setAuthMode(mode);
    if (authModal) authModal.classList.add('active');
    setTimeout(() => {
      if (mode === 'register' && regUsername) regUsername.focus();
      else if (authEmail) authEmail.focus();
    }, 150);
  }

  function closeAuthModal() {
    if (authModal) authModal.classList.remove('active');
    if (authForm) authForm.reset();
  }

  openLoginBtn?.addEventListener('click', () => openAuthModal('login'));
  openRegisterBtn?.addEventListener('click', () => openAuthModal('register'));
  authModalClose?.addEventListener('click', closeAuthModal);

  tabLogin?.addEventListener('click', () => setAuthMode('login'));
  tabRegister?.addEventListener('click', () => setAuthMode('register'));

  authModal?.addEventListener('click', (e) => {
    if (e.target === authModal) closeAuthModal();
  });

  // Handle Form Submission (Async with Supabase)
  authForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = authEmail?.value || '';
    const password = authPassword?.value || '';

    if (!email || !password) {
      alert('Lütfen e-posta ve şifre alanlarını doldurun.');
      return;
    }

    const prevBtnText = authSubmitBtn ? authSubmitBtn.textContent : '';
    if (authSubmitBtn) {
      authSubmitBtn.disabled = true;
      authSubmitBtn.textContent = 'İşleniyor...';
    }

    try {
      if (authMode === 'register') {
        const username = regUsername?.value || '';
        const result = await auth.register(username, email, password);
        if (result.success) {
          showToast(`Hoş geldin, ${result.user.username}! Hesabın oluşturuldu.`);
          closeAuthModal();
          updateAuthUI();
        } else {
          alert('Kayıt başarısız: ' + (result.message || 'Bilinmeyen hata'));
        }
      } else {
        const result = await auth.login(email, password);
        if (result.success) {
          showToast(`Tekrar hoş geldin, ${result.user.username || 'Oyuncu'}!`);
          closeAuthModal();
          updateAuthUI();
        } else {
          alert('Giriş başarısız: ' + (result.message || 'Hatalı e-posta veya şifre'));
        }
      }
    } finally {
      if (authSubmitBtn) {
        authSubmitBtn.disabled = false;
        authSubmitBtn.textContent = prevBtnText;
      }
    }
  });

  // Handle Logout
  logoutBtn?.addEventListener('click', async () => {
    if (confirm('Hesabından çıkış yapmak istediğine emin misin?')) {
      await auth.logout();
      showToast('Oturum kapatıldı.');
      updateAuthUI();
    }
  });

  // Supabase Auth State Dinleyicisi
  if (window.AntinDB && window.AntinDB.client) {
    window.AntinDB.client.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem(auth.STORAGE_ACTIVE_USER);
        updateAuthUI();
        return;
      }
      if (session && session.user) {
        const metaUser = session.user.user_metadata?.username || session.user.email.split('@')[0];
        const active = auth.getCurrentUser() || {};
        const metaFavs = Array.isArray(session.user.user_metadata?.favorites) ? session.user.user_metadata.favorites : [];
        const activeFavs = Array.isArray(active.favorites) ? active.favorites : [];
        const mergedFavs = Array.from(new Set([...metaFavs, ...activeFavs]));

        const updated = {
          ...active,
          id: session.user.id,
          username: metaUser,
          email: session.user.email,
          favorites: mergedFavs
        };
        auth.updateUser(updated);
        updateAuthUI();
      }
    });
  }

  // Canlı Duyuru Bandı Kontrolü
  function checkAnnouncement() {
    const banner = document.getElementById('siteAnnouncementBanner');
    const textEl = document.getElementById('announcementText');
    const closeBtn = document.getElementById('announcementCloseBtn');
    if (!banner || !textEl) return;

    const data = window.AntinDB ? window.AntinDB.getBroadcast() : null;
    if (data && data.active && data.text) {
      textEl.textContent = data.text;
      banner.style.display = 'flex';
    } else {
      banner.style.display = 'none';
    }

    if (closeBtn) {
      closeBtn.onclick = () => {
        banner.style.display = 'none';
      };
    }
  }

  window.addEventListener('antin_broadcast_changed', () => {
    checkAnnouncement();
  });
  checkAnnouncement();

  // Canlı Oyuncu Takibi (Presence) Başlat
  if (window.AntinDB && window.AntinDB.initPresence) {
    window.AntinDB.initPresence({ page: 'Ana Sayfa' });
  }

  // Initial Load
  updateAuthUI();
});
