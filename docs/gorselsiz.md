# Görseller ve kapsanan araçlar

## Depoda görseli bulunmayan uygulamalar

Bu uygulamalar sitede ikon ve metinle tanıtılır. Yeni çekim yapılmaz.

- LifeOS Ada (`lifeos-ada`)
- LifeOS Yönetim (`lifeos-manager`)
- LifeOS Yayınla (`lifeos-yayin`)
- LifeOS Mağaza (`lifeos-store`)
- LifeOS Ajanda (`lifeos-ajanda`)
- LifeOS Editör (`lifeos-editor`)
- LifeOS Hesap (`lifeos-hesap`)
- LifeOS Sistem (`lifeos-sistem`)
- LifeOS Donanım Merkezi (`lifeos-suruculer`)
- LifeOS USB Oluşturucu (`lifeos-usb`)
- LifeOS Müzik (`lifeos-muzik`)
- LifeOS Player (`lifeos-player`)
- LifeOS Karşılama (`lifeos-karsilama`)
- LifeOS Ekip (`lifeos-ekip`)
- LifeOS WhatsApp paneli (`lifeos-whatsapp`)
- LifeOS Paneller (`lifeos-paneller`)
- LifeOS Temalar (`lifeos-temalar`)
- LifeOS İzin (`lifeos-izin`)
- LifeOS Destek Ekibi (`lifeos-destek-ekibi`)
- lifeos — Komut satırı ve servis (`lifeos-cli`)
- LifeOS Yakındakiler (`lifeos-yakin`)
- LifeOS Türkçe Dil Araçları (`lifeos-language-tr`)
- LifeOS Java Yöneticisi (`lifeos-java-manager`)
- LifeOS Başlangıç ve Görünüm (`lifeos-setup`)

## Kullanılan ek tasarım görseli

- Konsol: `design/konsol/cikti/konsol-gun.png` → `public/img/ekran/konsol-tasarim-gun.webp`. `design/approved-designs.json` içindeki onaylı dosyadır. Gerçek çekim olarak adlandırılmaz; galeride “tasarım” olarak belirtilir. Kullanıcıya gösterimi müdürün onay akışındadır.
- Ada: `design/`, `docs/ada.md` ve katalog tarandı; uygun Ada görseli bulunmadı. Başka uygulamanın görüntüsü Ada diye kullanılmaz.
- Yönetim: `design/yonetim/cikti/hiz-gun.png` ve `hiz-gece.png` bulundu; onay manifestinde yer almıyorlar. Kullanılmadılar; şimdilik ikon/metin.
- Yayınla: katalogda ve depo design/docs/apps taramasında uygun görsel bulunmadı; ikon/metin.

## Görsel kaynağı politikası

Katalog ekranları ve telefon görselleri Görev 9’da src/veri/medya.json ile eşlenmiştir. Hiçbir ekran-ham dosyası kullanılmaz. Uygulama ikonları öncelikle catalog/media ve design/branding/apps kaynaklarından, bulunmayanlar izin verilen /usr/share/icons/hicolor altından alınır. Özel ikon bulunmayan uygulamalar ortak Eşik amblemini kullanır; ikon_kaynagi alanı bunu açıkça kaydeder.

## Kapsanan araçlar

| Uygulama | /usr/bin araçları | apps/ dizini |
| --- | --- | --- |
| LifeOS Ada | lifeos-ada | ada |
| LifeOS Yönetim | lifeos-yonetim | manager |
| LifeOS Konsol | lifeos-konsol | konsol |
| LifeOS Folio | lifeos-folio | — |
| LifeOS Ofis | — | — |
| LifeOS Yayınla | lifeos-yayin | — |
| LifeOS Mağaza | lifeos-magaza, lifeos-magaza-kur | magaza |
| LifeOS Küpler | lifeos-kupler | — |
| LifeOS TV | lifeos-tv | — |
| LifeOS Gate | — | — |
| LifeOS AnyWhere | — | — |
| Gölge Oyunu | — | — |
| LifeOS Ajanda | lifeos-ajanda | ajanda |
| LifeOS Editör | lifeos-editor | — |
| LifeOS Hesap | lifeos-hesap | — |
| LifeOS Sistem | lifeos-sistem | sistem |
| LifeOS Donanım Merkezi | lifeos-suruculer | — |
| LifeOS USB Oluşturucu | lifeos-usb | — |
| LifeOS Müzik | lifeos-muzik | — |
| LifeOS Player | lifeos-player | — |
| LifeOS Karşılama | lifeos-karsilama | karsilama |
| LifeOS Ekip | lifeos-ekip | — |
| LifeOS WhatsApp paneli | lifeos-whatsapp | — |
| LifeOS Paneller | — | paneller |
| LifeOS Masaüstü | — | masaustu |
| LifeOS Temalar | — | — |
| LifeOS İzin | — | izin |
| LifeOS Destek Ekibi | — | destek-ekibi |
| lifeos — Komut satırı ve servis | — | — |
| LifeOS Yakındakiler | — | — |
| LifeOS Türkçe Dil Araçları | — | — |
| LifeOS Java Yöneticisi | — | — |
| LifeOS Başlangıç ve Görünüm | — | — |

20 adet /usr/bin/lifeos-* başlatıcısının tamamı ve apps/ altındaki 11 dizinin tamamı kapsanır. lifeos-magaza-kur bağımsız ürün olarak çoğaltılmaz, Mağaza’nın dosya kurulum başlatıcısı olarak eşlenir. Üç katalog hedefi (Türkçe Dil Araçları, Java Yöneticisi, Başlangıç ve Görünüm) “Tasarım aşamasında” etiketi taşır; Gölge paketlemesi ve İzin test durumu ayrı belirtilir.

## Kurulum bilgisinin sınırı

catalog/installer.json ve docs/kurulum.md yer yer eski hedef kayıtları da içeriyor. Profil bileşimi için Standart/Avukat tablosu ve güncel ilk açılış açıklaması kullanıldı. Sayısal gereksinimler Calamares welcomeq.conf içindeki denetim eşikleridir; önerilen donanım diye sunulmaz. Şifreleme, Secure Boot, otomatik harici yedekleme ve gerçek Windows kurulumu testleri tamamlanmış gibi anlatılmaz. ISO indirme adresi kaynaklarda doğrulanmadığından siteye uydurma bağlantı eklenmez.
