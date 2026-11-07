# LifeOS web marka ve görsel kaynakları

Kaynak depo salt okunur olarak incelendi: `LifeOSLinux`, başlangıç revizyonu
`db26b2c`. Bu çalışma hiçbir LifeOS uygulamasını başlatmaz, ekran görüntüsü
çekmez ve kaynak depoya yazmaz.

## Amblem

Üst menü, alt bilgi ve ikon bulunamayan alanlar artık yeni bir çizim yerine
`design/branding/lifeos-symbol-ink.svg` (açık yüzey) ve
`design/branding/lifeos-symbol.svg` (koyu yüzey) dosyalarının aynısını kullanır.
Dosyalar `public/img/marka/` altındadır. Favicon da aynı SVG çiftidir.

`design/branding/README.md` Eşik ambleminin özgün marka varlığı olduğunu açıklar.
`design/approved-designs.json` 27 Ekim 2026 tarihli Eşik/Cachy tasarım onayını,
eski Indigo tasarımlarının yerini aldığını ve gerçek kurulum/önyükleme
doğrulamalarının henüz yapılmadığını kaydeder. Bu görsel onay, sitede test
edilmiş ürün özelliği iddiasına dönüştürülmedi.

## Renkler

Web sitesinde amblemin marka renkleri ile güncel açılışın sade zeminleri
kullanıldı. Kaynakların gradyanları ve animasyonları siteye taşınmadı.

| CSS değişkeni | Açık / koyu | Kaynak |
| --- | --- | --- |
| `--marka` | `#147e73` / `#42b5a4` | `lifeos-symbol-ink.svg` / `lifeos-symbol.svg`, ana çizgi |
| `--metin` | `#172d35` / `#f2eee9` | açık amblemin yükseliş çizgisi / `tools/build_boot_assets.py` içindeki `INK` |
| `--zemin` | `#f2eee9` / `#0c0a09` | `tools/build_boot_assets.py`, `INK` / `ground()` |
| `--yuzey` | `#e7efed` / `#1a1614` | renkli amblemin yükseliş çizgisi / aynı betiğin `key()` yüzeyi |
| `--soluk` | `#52635f` / `#a39a90` | açıkta okunaklılık için nötr uyarlama / aynı betikte `MUTED` |
| `--cizgi` | `#bcc9c4` / `#3a302b` | açık yüzey için nötr uyarlama / aynı betikte `LINE` |
| `--yasam` | `#ff7a33` / `#e8ac76` | renkli amblemin noktası / aynı betikte `LIFE` |

`tools/build_boot_assets.py` ve `tools/prepare_visual_assets.py` 28 Ekim tarihli
Kor açılış paletini birlikte tanımlar. Bu, 27 Ekim tarihli onay manifestinden
daha yeni kaynak kaydıdır; sitenin koyu nötrleri bu güncel betiklerden alınmıştır.
Açık nötr uyarlamalar bir depo sabiti olarak sunulmamıştır. Buton metni açık
temada beyaz, koyu temada koyu zemindir; küçük yazı ve buton renkleri AA
kontrastına göre kontrol edilir.

## Tipografi

`design/branding/eclipse.css` ilk satırında `Inter,"Noto Sans",sans-serif`
tanımlıdır. Site bu aile sırasını kullanır. Depoda paketlenmiş font dosyası
bulunmadığı için makinedeki açık lisanslı
`/usr/share/fonts/inter/InterVariable.ttf`, `public/fonts/` altına kopyalandı;
lisansı `/usr/share/licenses/inter-font/LICENSE.txt` dosyasından alındı.
Değişken fontun 100–900 ağırlıkları kullanılır; Türkçe karakterleri destekler.
Yerel Noto Sans düzenli/kalın fontları ve lisansı yedek olarak korunmuştur.
Font veya ikon için CDN isteği yoktur.

## Katalog aktarımı

`python3 araclar/depo-gorselleri.py` yalnız şu kaynakları okur:

- `catalog/media.json`: uygulama, dosya, rol, telefon işareti ve birebir alt metin.
- `catalog/media/`: görüntü dosyaları.
- `catalog/media/provenance.json`: var olan kaynak SHA-256 kayıtları; eşleşme zorunlu.
- `iso/airootfs/usr/share/wallpapers/LifeOS-*/contents/images/2560x1600.png`:
  sunum zeminleri. Sistemden veya ham çekim klasöründen görsel alınmaz.

Çıktıdaki `src/veri/medya.json` düz bir kayıt listesidir. Katalogdaki alanlar
korunur; `app_id`, `src`, `kaynak`, `kaynak_sha256`, `kaynak_boyutu`, `width`,
`height`, `sunum` ve çıktı özetleri eklenir. Sunumlu kayıtta `duvar_kagidi`,
masaüstü uygulama kaydında `src_1x` ve `pencere` de bulunur. `source_url`
yalnız kaynak bilgisidir; betik ağdan indirme yapmaz.

| Kaynak grubu | İşlem | Gerekçe |
| --- | --- | --- |
| Küpler ve Gölge masaüstü oyunları | 2560×1600 sunum | Görseller oyun alanıyla kenardan kenara; dış sunum çerçevesi yok. |
| Folio | 2560×1600 sunum | Uygulama içeriği kenardan kenara; dış zemin yok. |
| Ofis, TV/IPTV, Anywhere | 2560×1600 sunum | Kendi arayüzleri korunur; ayrıca dış cihaz çerçevesi/zemini yok. |
| Gate'in beş görseli | Boyutunu ve siyah çerçevesini koruyan doğrudan WebP | Kaynakta 8 px siyah dış çerçeve mevcut; ikinci sunum uygulanmaz. |
| `phone: true` olan Küpler/Folio görselleri | Zeminsiz WebP, özgün boyut | Dikey mobil kompozisyona ikinci cihaz/zemin eklenmez. |
| `role: icon` | Özgün dosyanın aynısı | Uygulama simgesini yeniden çizmeden korur. |

Sunum `araclar/sunum.py` içindeki kırpma ve kompozisyon işlevlerini kullanır:
opak pencerenin alfa kutusuna göre kırpma, 2560×1600 tuval, %80 pencere sınırı,
64 px Gaussian bulanıklık, 0,82 zemin parlaklığı, %35 siyah gölge ve 24 px
köşe (1280 sürümde 12 px). WebP kalite 88'dir. Masaüstü uygulamaları için
ayrıca 1280 px `@1x` ve zeminsiz `-pencere` sürümü oluşur. Yazı, logo,
parlama veya cihaz çerçevesi eklenmez. Üretilen WebP'ye kaynak EXIF/XMP aktarılmaz.

İlk aktarım katalog sırasıyla duvar kâğıtlarını dağıtır; aynı kaynak ve üretici
özetiyle tekrar çalıştırma çıktıları yeniden sıkıştırmadan doğrular. Kaynak
dosya değişirse yeniden üretir. Dönüşüm kararları betikte açıkça tanımlıdır;
kaynak değiştiğinde görsel inceleme yenilenmelidir.

## Ana sayfa masaüstü

`apps/karsilama/lifeos_karsilama/qml/gorsel/masaustu-gun.png` ve
`masaustu-gece.png`, `public/img/ekran/` altına doğrudan WebP olarak aktarılır.
Bunlar hazır masaüstü tasarım kompozisyonlarıdır; yeniden zemin veya gölge
eklenmez. Ana sayfa açık/koyu sistem tercihine göre uygun görseli seçer ve
görseli **masaüstü tasarımı** olarak adlandırır; yeni çekim olduğu ileri sürülmez.
`design/karsilama/` altındaki karşılama adımı tasarımları bu masaüstü çiftinin
yerine kullanılmadı.

`data/uygulamalar.json` bu görevde değiştirilmez. Uygulama kataloğunun içerik
bağlantıları sonraki içerik görevi kapsamında yapılacaktır.
