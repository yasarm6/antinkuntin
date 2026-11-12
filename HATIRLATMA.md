# AntinKuntin - Proje Hatırlatma ve Yol Haritası (Neal.fun Tarzı)

## 📌 Proje Vizyonu
**AntinKuntin**, [neal.fun](https://neal.fun) tarzında, tarayıcı üzerinden doğrudan oynanabilen eğlenceli, yaratıcı, interaktif mini oyunlar, simülasyonlar, zihin açıcı görsel deneyimler ve veri görselleştirme araçları barındıran bir web platformudur.

---

## 🎯 Kullanıcı Tercihleri & Mimari Kararlar (Güncellendi)
1. **İçerik Stili**:
   - Neal.fun klasikleri doğrudan kopyalanmayacak; **Türkiye'ye ve yerel mizaha uyarlanmış absürt, eğlenceli ve düşündürücü mini deneyimler** üretilecek (Örn: Türk Milyarderin Parasını Bitir [TL cinsinden], Asgari Ücretle Hayatta Kalma / Harcama Sayacı, Boğaz Geçişi, Çılgın Dürüm/Çay Simülatörü vb.).
2. **Görsel Tasarım Dili**:
   - **Neal.fun tarzı ferah beyaz/açık minimalist arka plan** temel alınacak.
   - Ancak arayüzün çeşitli yerlerinde göz alıcı renkli mikro detaylar, tatlı gradyanlar, canlı butonlar ve interaktif neşeli animasyonlar yer alacak.
3. **Teknik Altyapı & Gelecek Vizyonu**:
   - **Modüler Standart Web Teknolojileri (Vanilla JS + Clean CSS + Standart Web Bileşenleri)**:
     - **Neden bu seçim?** Capacitor veya React Native WebView ile **tek bir tıkla hiçbir şeyi baştan yazmadan doğrudan iOS ve Android mobil uygulamaya (APK/IPA)** dönüştürülebilir.
     - Ekstra ağır framework bağımlılıkları olmadan sıfır yükleme süresi ve %100 mobil uyumluluk sunar.
4. **Veri ve Canlı Eşitleme (Supabase Bulut Entegrasyonu)**:
   - **Supabase Auth & Database & Realtime**:
     - Kullanıcı hesapları ve favori listeleri Supabase `user_metadata` ve `localStorage` üzerinde çift yönlü eşitlenir.
     - **Liderlik Tablosu (Leaderboard)**: `leaderboard` tablosu ile canlı skor kaydetme ve denetleme.
     - **Canlı Oyuncu Takibi (Realtime Presence)**: `antin-realtime-presence` kanalı üzerinden sitede veya oyunlarda aktif olan tüm oyuncuları admin panelinde canlı izleme.
5. **Yönetici Yetkilendirmesi (Admin Security)**:
   - Yönetici e-posta adresi: `yasarlovesf1@gmail.com`.
   - Bu hesapla giriş yapıldığında ana sayfada "👑 Admin Paneli" rozet butonu açılır ve `admin.html` kontrol merkezi tam yetkiyle çalışır.

---

## 🏗️ Proje Mimarisi
```text
AntinKuntin/
├── index.html              # Ana vitrin (Temiz beyaz zemin + renkli vitrin kartları + duyuru bandı)
├── admin.html              # Canlı Yönetici Paneli (Canlı oyuncular, skor denetimi, duyuru yönetimi)
├── potatobros.html         # PotatoBros Arena Hayatta Kalma oyunu (Brotato esintili)
├── style.css               # Neal.fun ferah açık tema + canlı renk detayları + admin stilleri
├── app.js                  # Kategori filtreleme, arama, favori ve oturum yönetimi
├── supabaseClient.js       # Supabase Client, Leaderboard, Presence ve Realtime servisleri
├── assets/
│   ├── logo.svg            # AntinKuntin maskotu ve tipografisi
│   └── icons/              # Özel SVG ikonlar
├── games/                  # Yerelleştirilmiş interaktif mini deneyimler
│   ├── kum-havuzu/         # 500+ elementli fizik & kimya simülasyonu
│   ├── metrobuse-bin/      # Zincirlikuyu Metrobüs Kapı Kapmaca refleks oyunu
│   ├── para-harca/         # "Bir Türk Zengininin Parasını Bitir" (100 Milyar TL bütçe)
│   ├── asgari-karsilastir/ # "Maaşınla Ne Alabiliyorsun?"
│   ├── memleket-carki/     # "Absürt Memleket & Görev Çarkı"
│   └── derinlik/           # "İstanbul'un Altına İn"
└── HATIRLATMA.md           # Proje hafızası, yapılanlar ve yol haritası
```

---

## 🚀 Mevcut & Aktif Mini Deneyimler
1. 🥔 **PotatoBros: Arena Hayatta Kalma**: Brotato tarzı hızlı arena aksiyonu; Spud ve Fry karakterleri, kristal toplama, dalga bazlı yükseltmeler, boss döngüleri ve güncellenen mermi sıçrama/ek vuruş dinamikleri.
2. ⏳ **Piksel Kum Havuzu (Sandboxels)**: Neal.fun'daki orijinal oyunun eksiksiz yerel sürümü (500+ element, lav, su, elektrik, fizik ve kimya motoru).
3. 💸 **Türk Zengininin Parasını Bitir**: 100 Milyar TL bütçe; Çeyrek Altın, Togg, Boğaz Yalısı, Süper Lig Kulübü Satın Alma.
4. 🇹🇷 **Şu Anda Türkiye'de Ne Oluyor?**: Ekrana baktığın andan itibaren demlenen çaylar, çalınan kornalar, satılan simitler.
5. 🪙 **Maaşınla Ne Alabilirsin?**: Gelirini girip fıstık, altın ve Boğaz geçişine göre canlı analiz.
6. 🚌 **Metrobüse Binme Simülatörü**: Zincirlikuyu kapı açılınca içeri dalma refleks oyunu (Canlı Liderlik Tablosu entegreli).
7. 🎡 **Memleket Dedikodu Çarkı**: Rastgele 81 il efsaneleri.
8. ⛏️ **İstanbul'un Altına İn**: İnteraktif skrol derinlik simülasyonu.

---

## 🛠️ Son Yapılan Geliştirmeler & Çözülen Hatalar (12 Kasım 2026)
1. **Giriş Yapıldığında Favori Oyunların Sol Panelde Görünmeme Hatası Çözüldü**:
   - **Kök Neden**: Kullanıcı Supabase ile giriş yaptığında oturum bilgisi belleğe ve `STORAGE_ACTIVE_USER`'a yazılıyor ancak yerel `users` listesinde indeksi bulunamadığı için `updateUser()` fonksiyonundaki `if (index !== -1)` şartına takılıp favori güncellemelerini yerel depolamaya ve arayüze yansıtamıyordu. Ayrıca yeniden girişte boş misafir favorileri mevcut favorileri eziyordu.
   - **Çözüm**: `AuthService.updateUser()` güçlendirildi. Kullanıcı ister Supabase'den gelsin ister yerelden, aktif oturum derhal güncelleniyor, `users` listesine ekleniyor/güncelleniyor ve Supabase `user_metadata.favorites` alanına bulut senkronizasyonu yapılıyor. `login()` ve `onAuthStateChange()` mekanizmaları favorileri kaybetmeden otomatik birleştiriyor (merge).
2. **Canlı Yönetici Paneli (`admin.html`) Geliştirildi**:
   - **Hedef Yönetici**: `yasarlovesf1@gmail.com`.
   - **Güvenlik Kapısı**: Yönetici harici kişilere kilit ekranı gösterilir; `yasarlovesf1@gmail.com` oturumu açıldığında panel doğrudan açılır.
   - **Canlı Oyuncu Takibi (Realtime Presence)**: Supabase Presence ile sitede ve oyunlarda o an bulunan oyuncular isimleri, cihazları ve bulundukları sayfalarla canlı kartlar halinde listelenir.
   - **Liderlik Tablosu & Rekor Denetimi**: Supabase `leaderboard` tablosundaki tüm skorlar canlı listelenir, oyun bazında filtrelenir ve hileli/hatalı skorlar tek tıkla silinebilir.
   - **Canlı Duyuru Bandı (Broadcast)**: Yöneticinin panelden yazdığı duyuru anında ana sayfada (`index.html`) üst bildirim bandı olarak tüm ziyaretçilere yayınlanır.
   - **Ana Sayfa Rozeti**: `yasarlovesf1@gmail.com` giriş yaptığında header alanında "👑 Admin Paneli" rozet butonu belirir.
3. **PotatoBros Güncellemesi**:
   - Mermi sıçrama (`pierce`) ve ek vuruş (`proj`) dinamikleri optimize edildi.
   - Supabase Realtime Presence entegre edildi (`PotatoBros Arena` oyuncuları yönetici panelinde canlı görüntülenir).
4. **GitHub Push Rehberi & Terminalden Git CLI Kullanım Kılavuzu (Yöntem B)**:
   - Adım 1: Git Kurulumu (`winget install --id Git.Git -e --source winget` veya git-scm.com).
   - Adım 2: Kimlik Tanımlama (`git config --global user.name` ve `user.email`).
   - Adım 3: Depo Başlatma ve Bağlama (`git init`, `git branch -M main`, `git remote add origin <url>`).
   - Adım 4: Güncelleme Rutini (`git add potatobros.html`, `git commit -m "mesaj"`, `git push origin main`).
   - Güvenlik ve Kimlik Doğrulama: Tarayıcı üzerinden Git Credential Manager (GCM) ile tek tıkla oturum açma akışı.
