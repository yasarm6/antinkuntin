// ==========================================================================
// AntinKuntin - Supabase Client & Realtime Core Services
// Project: antinkuntin
// Admin: yasarlovesf1@gmail.com
// ==========================================================================

const SUPABASE_URL = 'https://nbmlhantvsaulrhmteup.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ZQw35j-NLObn2HWjTlI1RA_7Qu36Srq';
const ADMIN_EMAIL = 'yasarlovesf1@gmail.com';

// Global Supabase client instance
let _supabaseInstance = null;
let _presenceChannel = null;
let _scoreChannel = null;
let _presenceListeners = [];
let _currentPresenceState = [];

function getSupabase() {
  if (!_supabaseInstance && window.supabase && window.supabase.createClient) {
    try {
      _supabaseInstance = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
    } catch (e) {
      console.warn('Supabase başlatılırken hata:', e);
    }
  }
  return _supabaseInstance;
}

window.AntinDB = {
  get client() {
    return getSupabase();
  },

  ADMIN_EMAIL: ADMIN_EMAIL,

  // Admin kontrolü
  isAdmin(user) {
    if (!user) return false;
    const email = (user.email || '').toLowerCase().trim();
    return email === ADMIN_EMAIL.toLowerCase();
  },

  // ------------------------------------------------------------------------
  // Liderlik Tablosu (Leaderboard) Servisleri
  // ------------------------------------------------------------------------
  async saveScore(gameId, playerName, score) {
    const sb = getSupabase();
    if (!sb) {
      console.warn('Supabase bağlı değil, yerel fallback kullanılıyor.');
      return { success: false, error: 'Veritabanı bağlı değil' };
    }

    try {
      const cleanName = (playerName || 'Anonim Oyuncu').trim().slice(0, 30);
      const cleanScore = Math.max(0, parseInt(score, 10) || 0);

      const { data, error } = await sb
        .from('leaderboard')
        .insert([
          {
            game_id: gameId,
            player_name: cleanName,
            score: cleanScore
          }
        ])
        .select();

      if (error) throw error;
      return { success: true, data };
    } catch (err) {
      console.error('Skor kaydetme hatası:', err);
      return { success: false, error: err.message };
    }
  },

  async getTopScores(gameId, limit = 10) {
    const sb = getSupabase();
    if (!sb) return { success: false, data: [] };

    try {
      let query = sb
        .from('leaderboard')
        .select('*');

      if (gameId && gameId !== 'all') {
        query = query.eq('game_id', gameId);
      }

      const { data, error } = await query
        .order('score', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (err) {
      console.error('Skor listesi çekme hatası:', err);
      return { success: false, data: [] };
    }
  },

  async getAllScores(limit = 100, gameId = null) {
    const sb = getSupabase();
    if (!sb) return { success: false, data: [] };

    try {
      let query = sb
        .from('leaderboard')
        .select('*');

      if (gameId && gameId !== 'all') {
        query = query.eq('game_id', gameId);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (err) {
      console.error('Tüm skorları çekme hatası:', err);
      return { success: false, data: [], error: err.message };
    }
  },

  async deleteScore(id) {
    const sb = getSupabase();
    if (!sb) return { success: false, error: 'Supabase bağlı değil' };

    try {
      const { data, error } = await sb
        .from('leaderboard')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true, data };
    } catch (err) {
      console.error('Skor silme hatası:', err);
      return { success: false, error: err.message };
    }
  },

  // Canlı Skor Akışı Dinleyicisi (Realtime Postgres Changes)
  subscribeToScores(callback) {
    const sb = getSupabase();
    if (!sb || _scoreChannel) return;

    try {
      _scoreChannel = sb
        .channel('public:leaderboard')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'leaderboard' },
          (payload) => {
            if (typeof callback === 'function') {
              callback(payload);
            }
          }
        )
        .subscribe();
    } catch (e) {
      console.warn('Realtime skor dinleme hatası:', e);
    }
  },

  // ------------------------------------------------------------------------
  // Canlı Oyuncu Takibi (Realtime Presence) Servisi
  // ------------------------------------------------------------------------
  initPresence(pageInfo = {}) {
    const sb = getSupabase();
    if (!sb) return;

    if (_presenceChannel) {
      // Zaten bir kanal varsa sadece sayfayı güncelle
      return;
    }

    try {
      // Kullanıcı veya oturum bilgisi al
      let userSession = null;
      try {
        const raw = localStorage.getItem('antinkuntin_current_session');
        if (raw) userSession = JSON.parse(raw);
      } catch (e) {}

      const clientId = (userSession && userSession.id) 
        ? userSession.id 
        : 'guest_' + Math.random().toString(36).substring(2, 9);

      const displayName = (userSession && (userSession.username || userSession.email))
        ? (userSession.username || userSession.email.split('@')[0])
        : 'Oyuncu #' + clientId.slice(-4);

      const email = userSession ? userSession.email : null;
      const isAdminUser = this.isAdmin(userSession);

      _presenceChannel = sb.channel('antin-realtime-presence', {
        config: {
          presence: { key: clientId }
        }
      });

      _presenceChannel
        .on('presence', { event: 'sync' }, () => {
          const state = _presenceChannel.presenceState();
          const list = [];
          for (const key in state) {
            const presences = state[key];
            if (Array.isArray(presences) && presences.length > 0) {
              list.push(presences[0]);
            }
          }
          _currentPresenceState = list;
          _presenceListeners.forEach(fn => {
            try { fn(list); } catch (err) {}
          });
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await _presenceChannel.track({
              clientId: clientId,
              name: displayName,
              email: email,
              isAdmin: isAdminUser,
              page: pageInfo.page || 'Ana Sayfa',
              device: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobil' : 'Masaüstü',
              joinedAt: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
              timestamp: Date.now()
            });
          }
        });
    } catch (e) {
      console.warn('Presence başlatılamadı:', e);
    }
  },

  onPresenceUpdate(callback) {
    if (typeof callback === 'function') {
      _presenceListeners.push(callback);
      if (_currentPresenceState.length > 0) {
        callback(_currentPresenceState);
      }
    }
  },

  getLivePlayers() {
    return _currentPresenceState;
  },

  // ------------------------------------------------------------------------
  // Sistem Duyuru & Genel Kontrol Servisi
  // ------------------------------------------------------------------------
  BROADCAST_STORAGE_KEY: 'antinkuntin_live_broadcast',

  setBroadcast(text, active = true) {
    const data = {
      text: (text || '').trim(),
      active: !!active,
      updatedAt: new Date().toISOString(),
      updatedBy: ADMIN_EMAIL
    };
    localStorage.setItem(this.BROADCAST_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('antin_broadcast_changed', { detail: data }));
    return data;
  },

  getBroadcast() {
    try {
      const raw = localStorage.getItem(this.BROADCAST_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }
};
