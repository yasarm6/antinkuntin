# 🖼️ Görsel Dosyaları (Image Assets)

Oyunlarda ve web arayüzünde kullanmak istediğiniz karakterleri, arkaplanları, nesneleri ve ikonları buraya ekleyebilirsiniz:

## Desteklenen Formatlar:
- `.png` (Saydam arka planlı karakterler ve eşyalar için en ideali)
- `.svg` (Vektörel logo ve ikonlar için net ve hafif)
- `.webp` (Yüksek sıkıştırma ve hızlı yükleme)

## Canvas Oyunlarında Kullanım:
```javascript
const karakterImg = new Image();
karakterImg.src = 'assets/images/karakter.png';

karakterImg.onload = () => {
  // Oyun çizim döngüsünde:
  ctx.drawImage(karakterImg, x, y, genislik, yukseklik);
};
```
