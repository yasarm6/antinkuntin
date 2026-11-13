# 🎵 Ses Dosyaları (Audio Assets)

Oyunlarda kullanmak istediğiniz ses efektlerini (SFX) ve arka plan müziklerini (BGM) buraya ekleyebilirsiniz:

## Desteklenen Formatlar:
- `.mp3` (En uyumlu ve tavsiye edilen format)
- `.wav` (Kısa ve kaliteli ses efektleri için)
- `.ogg` (Hafif ve açık kaynaklı format)

## Örnek Kullanım (JavaScript):
```javascript
// Ses dosyasını yükle
const atesSesi = new Audio('assets/sounds/shoot.mp3');

// Sesi çal
atesSesi.currentTime = 0; // Başa sar
atesSesi.play();
```
