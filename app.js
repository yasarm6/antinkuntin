const PROJECTS_DATA = [
  {
    id: 'kum-havuzu',
    title: 'Piksel Kum Havuzu (Sandboxels)',
    tag: 'Simülatör & Fizik',
    category: 'games',
    emoji: '⏳',
    bgGradient: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
    desc: 'Neal.fun klasiği! 500\'den fazla element, lav, su, elektrik, asit ve nükleer reaksiyonlarla sınırsız piksel deneyi.',
    url: 'games/kum-havuzu/index.html'
  },
  {
    id: 'para-harca',
    title: 'Türk Zengininin Parasını Bitir',
    tag: 'Simülasyon',
    category: 'games',
    emoji: '💸',
    bgGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    desc: '100 Milyar TL servetle Boğaz yalısı, Togg filoları, çeyrek altın ve Süper Lig takımı alarak parayı sıfırlamaya çalış.',
    url: 'games/para-harca/index.html'
  },
  {
    id: 'turkiye-sayaci',
    title: 'Şu Anda Türkiye\'de Ne Oluyor?',
    tag: 'Canlı Veri',
    category: 'explore',
    emoji: '🇹🇷',
    bgGradient: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
    desc: 'Sayfayı açtığından bu yana demlenen ince belli çaylar, trafikte korna çalanlar, pişirilen simitler.',
    url: 'games/turkiye-sayaci/index.html'
  },
  {
    id: 'asgari-karsilastir',
    title: 'Maaşınla Ne Alabiliyorsun?',
    tag: 'Absürt Kıyas',
    category: 'explore',
    emoji: '🪙',
    bgGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    desc: 'Maaşını gir, kaç bin tane simite, kaç metre Boğaz Köprüsü asfaltına veya kaç gram fıstığa denk geldiğini gör.',
    url: 'games/asgari-karsilastir/index.html'
  },
  {
    id: 'memleket-carki',
    title: 'Memleket Dedikodu Çarkı',
    tag: 'Mizah & Eğlence',
    category: 'fun',
    emoji: '🎡',
    bgGradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    desc: 'Çarkı çevir; 81 ilden rastgele absürt bir şehir efsanesi, yöresel adet veya garip bir görev kazan.',
    url: '#'
  },
  {
    id: 'metrobuse-bin',
    title: 'Metrobüse Binme Simülatörü',
    tag: 'Refleks Oyunu',
    category: 'games',
    emoji: '🚌',
    bgGradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    desc: 'Zincirlikuyu aktarmasında kapı açılınca içeri adım atabilecek misin? 10 saniyelik gerilim testi!',
    url: 'games/metrobuse-bin/index.html'
  },
  {
    id: 'derinlik',
    title: 'İstanbul\'un Altına İn',
    tag: 'İnteraktif Skrol',
    category: 'explore',
    emoji: '⛏️',
    bgGradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    desc: 'Aşağı kaydırdıkça Marmaray\'ın, Bizans sarnıçlarının ve metro tünellerinin derinliklerine in.',
    url: '#'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const gridContainer = document.getElementById('projectGrid');
  const themeToggle = document.getElementById('themeToggle');
  const filterChips = document.querySelectorAll('.filter-chip');

  // Theme Management (Default clean light with color accents)
  const savedTheme = localStorage.getItem('ak-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle?.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('ak-theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    if (!themeToggle) return;
    themeToggle.innerHTML = theme === 'dark' ? '☀️ Aydınlık Mod' : '🌙 Gece Modu';
  }

  // Render Cards
  function renderCards(filter = 'all') {
    if (!gridContainer) return;
    gridContainer.innerHTML = '';

    const filtered = filter === 'all' 
      ? PROJECTS_DATA 
      : PROJECTS_DATA.filter(p => p.category === filter);

    filtered.forEach(project => {
      const card = document.createElement('a');
      card.className = 'card';
      card.href = project.url;
      if (project.url === '#') {
        card.onclick = (e) => {
          e.preventDefault();
          alert(`"${project.title}" geliştirme aşamasında! Görüşlerinize göre ilk eklenecek.`);
        };
      }

      card.innerHTML = `
        <div class="card-preview" style="background: ${project.bgGradient};">
          <span class="card-emoji">${project.emoji}</span>
        </div>
        <div class="card-content">
          <div class="card-title">
            <span>${project.title}</span>
            <span class="card-tag">${project.tag}</span>
          </div>
          <p class="card-desc">${project.desc}</p>
          <div class="card-footer">
            <span>Deneyimi Başlat</span>
            <span class="arrow">→</span>
          </div>
        </div>
      `;
      gridContainer.appendChild(card);
    });
  }

  // Filter Event Listeners
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const category = chip.getAttribute('data-filter') || 'all';
      renderCards(category);
    });
  });

  // Initial render
  renderCards('all');
});
