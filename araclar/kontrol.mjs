#!/usr/bin/env node
// LifeOS site kalite kontrolu. Yalniz Node'un yerlesik modulleri kullanilir.
// Kullanim: npm run build && npm run kontrol
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = fileURLToPath(new URL('..', import.meta.url));
const hatalar = [];
const uyarilar = [];
const gecenler = [];

const hata = (kural, mesaj) => hatalar.push(`${kural}: ${mesaj}`);
const uyar = (kural, mesaj) => uyarilar.push(`${kural}: ${mesaj}`);
const gecti = (kural) => gecenler.push(kural);

function dosyalar(dizin, uzantilar = null) {
  const yol = join(KOK, dizin);
  if (!existsSync(yol)) return [];
  const sonuc = [];
  const gez = (d) => {
    for (const ad of readdirSync(d)) {
      if (ad === 'node_modules' || ad.startsWith('.')) continue;
      const tam = join(d, ad);
      if (statSync(tam).isDirectory()) gez(tam);
      else if (!uzantilar || uzantilar.includes(extname(tam))) sonuc.push(tam);
    }
  };
  gez(yol);
  return sonuc;
}

const oku = (tam) => readFileSync(tam, 'utf8');
const kisa = (tam) => relative(KOK, tam);

// Bir metinde desenin gectigi satirlari bulur.
function satirlar(metin, desen) {
  const bulunan = [];
  metin.split('\n').forEach((satir, i) => {
    desen.lastIndex = 0;
    if (desen.test(satir)) bulunan.push({ no: i + 1, satir: satir.trim().slice(0, 140) });
  });
  return bulunan;
}

// --- 1. Veri: her uygulamanin detay kaydi ve rotasi var mi? ---
const veriYolu = join(KOK, 'data/uygulamalar.json');
let uygulamalar = [];
if (!existsSync(veriYolu)) {
  hata('veri', 'data/uygulamalar.json bulunamadı.');
} else {
  let veri;
  try {
    veri = JSON.parse(oku(veriYolu));
  } catch (e) {
    hata('veri', `data/uygulamalar.json okunamadı: ${e.message}`);
  }
  if (veri) {
    uygulamalar = Array.isArray(veri) ? veri : (veri.uygulamalar ?? []);
    if (uygulamalar.length === 0) hata('veri', 'data/uygulamalar.json içinde uygulama yok.');
    const gorulen = new Set();
    for (const [i, app] of uygulamalar.entries()) {
      const etiket = app.id || app.ad || `#${i}`;
      if (!app.id) hata('veri', `${etiket}: id alanı yok.`);
      else if (gorulen.has(app.id)) hata('veri', `${app.id}: id birden fazla kez kullanılmış.`);
      else if (app.id !== encodeURIComponent(app.id)) hata('veri', `${app.id}: id rota için güvenli değil.`);
      else gorulen.add(app.id);
      if (!app.ad) hata('veri', `${etiket}: ad alanı yok.`);
      if (!app.kisa_aciklama) hata('veri', `${etiket}: kisa_aciklama alanı yok.`);
    }
  }
}

const kaynakJsx = dosyalar('src', ['.jsx', '.js']);
const kaynakHepsi = kaynakJsx.map(t => ({ yol: kisa(t), metin: oku(t) }));
const tumKaynak = kaynakHepsi.map(d => d.metin).join('\n');

if (uygulamalar.length > 0) {
  // Detay rotasi ve id ile arama var mi?
  const rotaVar = /path\s*=\s*["'`]\/uygulamalar\/:[a-zA-Z]+["'`]/.test(tumKaynak);
  const aramaVar = /uygulamalar\s*\.\s*find\s*\(/.test(tumKaynak);
  if (!rotaVar) hata('rota', 'src içinde /uygulamalar/:id rotası bulunamadı; uygulamaların detay sayfası yok.');
  if (!aramaVar) hata('rota', 'Detay sayfasında uygulamayı id ile bulan bir kayıt araması yok.');
  if (rotaVar && aramaVar) gecti(`rota (${uygulamalar.length} uygulama detay rotasından karşılanıyor)`);
}

// --- 2. JSON'daki her ikon ve ekran goruntusu public/ altinda var mi? ---
const gorselYolu = (p) => join(KOK, 'public', String(p).replace(/^\//, ''));
let gorselSayisi = 0;
for (const app of uygulamalar) {
  const etiket = app.id || app.ad;
  if (app.ikon) {
    gorselSayisi++;
    if (!existsSync(gorselYolu(app.ikon))) hata('gorsel', `${etiket}: ikon public/ altında yok → ${app.ikon}`);
  }
  for (const ekran of app.ekran_goruntuleri ?? []) {
    const p = typeof ekran === 'string' ? ekran : ekran?.dosya;
    if (!p) { hata('gorsel', `${etiket}: ekran görüntüsü kaydında dosya yolu yok.`); continue; }
    gorselSayisi++;
    if (!existsSync(gorselYolu(p))) hata('gorsel', `${etiket}: ekran görüntüsü public/ altında yok → ${p}`);
    if (typeof ekran === 'object' && !ekran.alt) hata('gorsel', `${etiket}: ${p} için alt metni yok.`);
  }
}
if (gorselSayisi > 0) gecti(`gorsel (${gorselSayisi} yol denetlendi)`);

// --- 3. Kaynakta dis CDN ya da font adresi var mi? ---
const DIS_ADRES = /(https?:)?\/\/(fonts\.(googleapis|gstatic)\.com|cdn[a-z0-9.-]*\.|unpkg\.com|cdnjs\.|jsdelivr\.net|use\.typekit\.net|ajax\.googleapis\.com)/i;
const MUTLAK_VARLIK = /(?:src|href)\s*=\s*["'`]https?:\/\/[^"'`]+\.(?:css|js|woff2?|ttf|otf|png|jpg|jpeg|webp|svg)/i;
let disBulgu = 0;
for (const { yol, metin } of [...kaynakHepsi,
  { yol: 'index.html', metin: existsSync(join(KOK, 'index.html')) ? oku(join(KOK, 'index.html')) : '' },
  ...dosyalar('src', ['.css']).map(t => ({ yol: kisa(t), metin: oku(t) }))]) {
  for (const d of [DIS_ADRES, MUTLAK_VARLIK]) {
    for (const b of satirlar(metin, new RegExp(d.source, 'i'))) {
      hata('dis-kaynak', `${yol}:${b.no} dış adres → ${b.satir}`);
      disBulgu++;
    }
  }
}
if (disBulgu === 0) gecti('dis-kaynak (kaynakta CDN ya da dış font adresi yok)');

// --- 4. index.html: lang, title, meta description ---
function htmlDenetle(etiket, metin) {
  if (!/<html[^>]*\blang\s*=\s*["']tr["']/i.test(metin)) hata('html', `${etiket}: <html lang="tr"> yok.`);
  if (!/<title>\s*\S[^<]*<\/title>/i.test(metin)) hata('html', `${etiket}: boş olmayan <title> yok.`);
  if (!/<meta[^>]+name\s*=\s*["']description["'][^>]+content\s*=\s*["']\s*\S[^"']*["']/i.test(metin))
    hata('html', `${etiket}: meta description yok ya da boş.`);
}
if (existsSync(join(KOK, 'index.html'))) htmlDenetle('index.html', oku(join(KOK, 'index.html')));
else hata('html', 'index.html bulunamadı.');

// --- 5. Yer tutucu metinler ---
const YASAK = [/\bLorem\b/i, /\bTODO\b/, /\bplaceholder\b/i, /örnek veri/i];
let yerTutucu = 0;
const metinDosyalari = [
  ...dosyalar('src', ['.jsx', '.js', '.css', '.json']),
  ...dosyalar('data', ['.json']),
];
for (const tam of metinDosyalari) {
  const metin = oku(tam);
  for (const d of YASAK) {
    for (const b of satirlar(metin, new RegExp(d.source, d.flags.includes('i') ? 'i' : ''))) {
      hata('yer-tutucu', `${kisa(tam)}:${b.no} → ${b.satir}`);
      yerTutucu++;
    }
  }
}
if (yerTutucu === 0) gecti('yer-tutucu (Lorem/TODO/placeholder/örnek veri yok)');

// --- 6. JSX icindeki her <img> alt tasiyor mu? ---
let imgSayisi = 0;
for (const { yol, metin } of kaynakHepsi) {
  const desen = /<img\b[^>]*?\/?>/gs;
  let m;
  while ((m = desen.exec(metin)) !== null) {
    imgSayisi++;
    if (!/\balt\s*=/.test(m[0])) {
      const no = metin.slice(0, m.index).split('\n').length;
      hata('img-alt', `${yol}:${no} <img> alt taşımıyor → ${m[0].slice(0, 120)}`);
    }
  }
}
if (imgSayisi > 0) gecti(`img-alt (${imgSayisi} <img> denetlendi)`);

// --- 7. dist/ denetimi ---
const dist = join(KOK, 'dist');
if (!existsSync(dist)) {
  hata('dist', 'dist/ yok. Önce `npm run build` çalıştırın.');
} else {
  const distIndex = join(dist, 'index.html');
  if (!existsSync(distIndex)) hata('dist', 'dist/index.html yok.');
  else htmlDenetle('dist/index.html', oku(distIndex));

  let distDis = 0;
  for (const tam of dosyalar('dist', ['.html', '.js', '.css'])) {
    const metin = oku(tam);
    for (const b of satirlar(metin, new RegExp(DIS_ADRES.source, 'i'))) {
      hata('dist', `${kisa(tam)}:${b.no} derlenmiş çıktıda dış adres → ${b.satir}`);
      distDis++;
    }
  }
  if (distDis === 0) gecti('dist (derlenmiş çıktıda CDN ya da dış font adresi yok)');

  // Veride geçen görseller dist/ içine de kopyalanmış mı?
  let eksikDist = 0;
  for (const app of uygulamalar) {
    const yollar = [app.ikon, ...(app.ekran_goruntuleri ?? []).map(e => typeof e === 'string' ? e : e?.dosya)];
    for (const p of yollar.filter(Boolean)) {
      if (!existsSync(join(dist, String(p).replace(/^\//, '')))) {
        hata('dist', `${app.id}: görsel dist/ altında yok → ${p}`);
        eksikDist++;
      }
    }
  }
  if (eksikDist === 0 && gorselSayisi > 0) gecti('dist-gorsel (veri dosyasındaki tüm görseller dist/ altında)');
}

// --- Rapor ---
for (const g of gecenler) console.log(`  ok  ${g}`);
for (const u of uyarilar) console.log(`  !   ${u}`);
if (hatalar.length === 0) {
  console.log(`\nkontrol: sorun yok (${uygulamalar.length} uygulama).`);
  process.exit(0);
}
console.error('');
for (const h of hatalar) console.error(`  HATA ${h}`);
console.error(`\nkontrol: ${hatalar.length} sorun bulundu.`);
process.exit(1);
