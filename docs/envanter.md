# LifeOS Linux — kurulum ve gereksinim envanteri

Sitedeki kurulum karşılaştırması (`src/veri/kurulum.json`) ve gereksinimler yalnızca aşağıdaki dosyalara dayanır.
Yollar, kullanıcının LifeOSLinux deposuna göredir (`~/Projeler/LifeosArch/src/LifeOSLinux`). Satır numaraları 2026-11-08 tarihli yerel kopyadan alındı.

## Gereksinimler ve kurulum denetimleri

| Bilgi | Değer | Kaynak |
|---|---|---|
| Mimari ve önyükleme | x86_64, UEFI, GPT (ilk sürüm hedefi) | `catalog/installer.json:40` |
| Eski BIOS | İlk sürümde yok, yalnızca UEFI | `catalog/installer.json:41` |
| Bölüm tablosu | GPT | `iso/airootfs/etc/calamares/modules/partition.conf:9` |
| Dosya sistemi | Btrfs (tek seçenek) | `iso/airootfs/etc/calamares/modules/partition.conf:10-11` |
| Bölümler | EFI 1024 MiB, `/boot` 2 GB ext4, `/` Btrfs | `partition.conf:1-5`, `partition.conf:17-29` |
| Elle bölümleme | Kapalı | `partition.conf:12` |
| Boş alan eşiği | 16 GB | `iso/airootfs/etc/calamares/modules/welcomeq.conf:6`, `partition.conf:16` |
| Bellek eşiği | 2 GiB | `iso/airootfs/etc/calamares/modules/welcomeq.conf:7` |
| Zorunlu denetimler | Alan, bellek, yönetici yetkisi | `welcomeq.conf:8-9` |
| Secure Boot | İmzalama ve entegrasyon sürüyor | `catalog/installer.json:43` |
| Disk şifreleme | Calamares yapılandırmasında otomatik LUKS kapalı | `partition.conf:13` |
| Varsayılan tarayıcı | Google Chrome | `catalog/installer.json:122` |

**Çelişki notu:** `catalog/installer.json:49`, tasarımda kök bölüm için isteğe bağlı LUKS2 öngörüyor. Ancak ISO ile gelen Calamares yapılandırması (`partition.conf:13`) bunu kapatıyor. Site, kullanıcının kurulumda gerçekte göreceği hâli yazıyor: "Disk şifreleme bu yapılandırmada kapalı."

## Kurulum profilleri

| | Standart | Avukat | Kaynak |
|---|---|---|---|
| Özet | Türkçe Plasma, LifeOS uygulamaları, Google Chrome, Opera, WhatsApp (Whatsie), LifeOS Ofis, NAPS2, Windows yazı tipleri ve kodekler | Standart'ın internet uygulamaları; Ofis yerine Folio, UYAP Doküman Editörü, Adalet e-İmza, AKİS Kart (Akia), OpenWebStart, iPhone/iPad bağlayıcı, Evince, Java 8, LibreOffice, Türkçe dil araçları | `catalog/installer.json:71`, `:80` |
| Ek paketler | `lifeos-ofis`, `whatsie` | `whatsie`, `lifeos-folio`, `openwebstart`, `java8-runtime`, `java-runtime`, `lifeos-java-manager`, `lifeos-language-tr`, `evince`, `libreoffice-fresh`, `libreoffice-fresh-tr` | `catalog/installer.json:72-75`, `:81-92` |
| Hukuk uygulamaları | — | Katalogdaki bütün hukuk uygulamaları | `catalog/installer.json:93` |
| Kurulumda sorulan | — | Folio profili (ad, baro, sicil, TBB, büro, telefon, e-posta, KEP, adres) | `catalog/installer.json:94-96`, `apps/karsilama/lifeos_karsilama/backend.py:17-18` |

## İlk açılış

| Bilgi | Kaynak |
|---|---|
| Kalıpta olmayan uygulamalar ilk açılışta internetle kurulur, hepsi kurulana kadar her açılışta ve Karşılama'daki "Tekrar dene" ile yeniden denenir | `catalog/installer.json:205-210` |
| Uygulama kaynakları (ISO, LifeOS deposu, üretici, Flathub, Arch) | `catalog/installer.json:178-204` |
| Karşılama, ilk kurulum durumunu 3 saniyede bir yeniler | `apps/karsilama/lifeos_karsilama/backend.py:48-55` |
| Karşılama'nın son sayfasındaki uygulamalar: Yönetim, Mağaza, Sistem, Konsol, Folio, Ofis | `apps/karsilama/lifeos_karsilama/backend.py:20-27` |

## Bilgisi sitede kullanılmayanlar

`catalog/installer.json:140-177` (Btrfs anlık görüntü politikası) VM testi beklediği için sitede vaat olarak yazılmadı. Sitede yalnızca "Anlık görüntüler, ayrı bir diskteki belge yedeğinin yerini tutmaz" uyarısı var (`:175`).

## Belge uygulaması ve Folio'nun kapsamı

Standart kurulumda belge uygulaması LifeOS Ofis (`catalog/installer.json:71-74`). Avukat kurulumunda Ofis'in yerini LifeOS Folio alır (`catalog/installer.json:80-83`). Folio yalnızca Türkiye Cumhuriyeti hukuk sistemine özeldir: UYAP, UETS ve e-imzayla çalışır. Bu kapsam kullanıcının kuralıdır (pano #998). Site bunu Folio'yu anlatan her yerde, TR ve EN olarak yazar: vitrin, detay sayfası, kurulum karşılaştırması ve mobil bölüm.
