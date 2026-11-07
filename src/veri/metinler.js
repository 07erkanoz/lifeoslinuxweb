// Sitenin arayüz metinleri. Şimdilik yalnızca Türkçe; İngilizce eklenirken aynı anahtarlarla `en` yazılacak.
// Menü ve alt bilgi lifeos.com.tr ile birebir aynı (lifeosweb: src/components/layout/Header.tsx, Footer.tsx).
// Site lifeos.com.tr/linux/ altında yayımlanacağı için ana site bağlantıları kökten başlayan mutlak yollardır.

export const ANA_SITE = '';

const tr = {
  marka: { ad: 'LifeOS', ek: 'Linux', anaSayfa: 'LifeOS Linux ana sayfa' },
  icerigeGec: 'İçeriğe geç',
  menu: {
    etiket: 'Ana gezinme',
    ac: 'Menü',
    kapat: 'Kapat',
    anaSite: [
      { href: '/#birlikte', ad: 'Birlikte yazın' },
      { href: '/#buro-yonetimi', ad: 'Büro' },
      { href: '/ozellikler', ad: 'Özellikler' },
      { href: '/#gizlilik', ad: 'Gizlilik' },
      { href: '/#indir', ad: 'İndir' },
      { href: '/#hakkinda', ad: 'Hakkında' },
      { href: '/iletisim', ad: 'İletişim' },
    ],
    uygulamalar: 'Uygulamalar',
    uygulamaListesi: [
      { href: '/ofis', ad: 'LifeOS Ofis', not: 'Belge ve e-imza' },
      { href: '/iptv', ad: 'LifeOS TV', not: 'IPTV oynatıcı' },
      { href: '/gate', ad: 'LifeOS Gate', not: 'SSH ve SFTP istemcisi' },
      { href: '/anywhere', ad: 'LifeOS AnyWhere', not: 'Cihazlar arası dosya paylaşımı' },
      { href: '/kupler/', ad: 'Küpler', not: 'Blok oyunu' },
    ],
    linux: 'LifeOS Linux',
    linuxListesi: [
      { to: '/', ad: 'Genel bakış', not: 'Masaüstü, Ada ve araçlar' },
      { to: '/uygulamalar', ad: 'Linux uygulamaları', not: 'Arama ve kategoriler' },
      { to: '/indir', ad: 'İndirme ve kurulum', not: 'Standart ve Avukat profilleri' },
    ],
    tema: ad => `Tema: ${ad}. Sonraki temaya geç`,
    ayarlar: 'Ayarlar',
  },
  altBilgi: {
    ozet: 'Linux masaüstü. LifeOS’un kendi araçları.',
    telif: yil => `© ${yil} LifeOS. Tüm hakları saklıdır.`,
    linux: [
      { to: '/uygulamalar', ad: 'Linux uygulamaları' },
      { to: '/indir', ad: 'Kurulum' },
      { to: '/ayarlar', ad: 'Ayarlar' },
    ],
    anaSite: [
      { href: '/#ozellikler', ad: 'Özellikler' },
      { href: '/udf-cevirici', ad: 'Online UDF çevirici' },
      { href: '/iletisim', ad: 'İletişim' },
      { href: '/privacy-policy', ad: 'Gizlilik politikası' },
      { href: '/kullanim-kosullari', ad: 'Kullanım koşulları' },
    ],
  },
  // lifeos.com.tr'de kendi tanıtım sayfası olan uygulamalar; içerik iki yerde yazılmasın diye oraya bağlanır.
  tanitim: {
    'lifeos-folio': '/ozellikler',
    'lifeos-ofis': '/ofis',
    'lifeos-iptv-player': '/iptv',
    'lifeos-gate': '/gate',
    'lifeos-anywhere': '/anywhere',
    'lifeos-kupler': '/kupler/',
  },
  ayrintiliTanitim: 'Ayrıntılı tanıtım',
  uygulamayiIncele: 'Uygulamayı incele',
};

export const metin = tr;
export const anaSiteYolu = yol => `${ANA_SITE}${yol}`;
