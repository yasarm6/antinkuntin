# AntinKuntin - Proje Hatırlatma ve Yol Haritası (Neal.fun Tarzı)

## 📌 Proje Vizyonu
**AntinKuntin**, [neal.fun](https://neal.fun) tarzında, tarayıcı üzerinden doğrudan oynanabilen eğlenceli, yaratıcı, interaktif mini oyunlar, simülasyonlar, zihin açıcı görsel deneyimler ve veri görselleştirme araçları barındıran bir web platformudur.

---

## 🎨 Tasarım & Kimlik Rehberi
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

---

## 🏗️ Proje Mimarisi
```text
AntinKuntin/
├── index.html              # Ana vitrin (Temiz beyaz zemin + renkli vitrin kartları)
├── style.css               # Neal.fun ferah açık tema + canlı renk detayları
├── app.js                  # Kategori filtreleme, arama ve deneyim yönetimi
├── assets/
│   ├── logo.svg            # AntinKuntin maskotu ve tipografisi
│   └── icons/              # Özel SVG ikonlar
├── games/                  # Yerelleştirilmiş interaktif mini deneyimler
│   ├── para-harca/         # "Bir Türk Zengininin Parasını Bitir" (Simit, Togg, Yalı, Futbol Kulübü)
│   ├── asgari-sayac/       # "Şu Anda Türkiye'de Ne Oluyor?" (Tüketim, çay, trafik)
│   └── memleket-carki/     # "Absürt Memleket & Görev Çarkı"
└── HATIRLATMA.md           # Proje hafızası ve yol haritası
```

---

## 🚀 Mevcut & Aktif Mini Deneyimler
1. ⏳ **Piksel Kum Havuzu (Sandboxels)**: Neal.fun'daki orijinal oyunun eksiksiz yerel sürümü (500+ element, lav, su, elektrik, fizik ve kimya motoru).
2. 💸 **Türk Zengininin Parasını Bitir**: 100 Milyar TL bütçe; Çeyrek Altın, Togg, Boğaz Yalısı, Süper Lig Kulübü Satın Alma.
3. 🇹🇷 **Şu Anda Türkiye'de Ne Oluyor?**: Ekrana baktığın andan itibaren demlenen çaylar, çalınan kornalar, satılan simitler.
4. 🪙 **Maaşınla Ne Alabilirsin?**: Gelirini girip fıstık, altın ve Boğaz geçişine göre canlı analiz.
5. 🚌 **Metrobüse Binme Simülatörü**: Zincirlikuyu kapı açılınca içeri dalma refleks oyunu.
6. 🎡 **Memleket Dedikodu Çarkı**: Rastgele 81 il efsaneleri (Sırada).
7. ⛏️ **İstanbul'un Altına İn**: İnteraktif skrol derinlik simülasyonu (Sırada).

