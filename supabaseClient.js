// ==========================================================================
// AntinKuntin - Supabase Client & Helper Services
// Project: antinkuntin
// ==========================================================================

const SUPABASE_URL = 'https://nbmlhantvsaulrhmteup.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ZQw35j-NLObn2HWjTlI1RA_7Qu36Srq';

// Global Supabase client instance
let _supabaseInstance = null;

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

  // ------------------------------------------------------------------------
  // Liderlik Tablosu (Leaderboard) Servisi
  // ------------------------------------------------------------------------
  async saveScore(gameId, playerName, score) {
    const sb = getSupabase();
    if (!sb) {
      console.warn('Supabase bağlı değil, yerel fallback kullanılıyor.');
      return { success: false, error: 'Veritabanı bağlı değil' };
    }

    try {
      const cleanName = (playerName || 'Anonim Yolcu').trim().slice(0, 30);
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
      const { data, error } = await sb
        .from('leaderboard')
        .select('*')
        .eq('game_id', gameId)
        .order('score', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (err) {
      console.error('Skor listesi çekme hatası:', err);
      return { success: false, data: [] };
    }
  }
};

