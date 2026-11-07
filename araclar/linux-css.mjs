// LifeOS Linux tema CSS'lerini lifeosweb için kapsamlı hâle getirir: her kural .linux kapsayıcısının içinde kalır,
// böylece Tailwind'le ve Folio/ürün sayfalarıyla çakışmaz. Menü ve alt bilgi kuralları atılır (lifeosweb'in kendi Header/Footer'ı var).
// Kullanım: node araclar/linux-css.mjs  →  .inceleme/lifeosweb/src/linux/stil/*.css
import postcss from 'postcss';
import fs from 'node:fs';

const HEDEF = '/home/erkanoz/.local/share/lifeos/ekip/is/1/.inceleme/lifeosweb/src/linux/stil';
const ATILAN = /\.(nav|top|skip|site-header|site-nav|menu-toggle|acilir|theme-quick|settings-link|ana-site-baglantilari|footer|brand|mobile-landmark|is-inner|nav-links|nav-tools)\b/;

const yol = css => css.replaceAll('/img/tasarim/', '/linux/tasarim/').replaceAll('../ortak/', '/linux/tasarim/').replaceAll("url('masaustu-gun.png')", "url('/linux/tasarim/masaustu-gun.png')");

function kapsa(s) {
  s = s.trim();
  if (s.startsWith(':root')) return s.replace(':root', '.linux');
  if (/^html\b/.test(s)) return s.replace(/^html/, '.linux');
  if (/^body\b/.test(s)) return s.replace(/^body/, '.linux');
  if (s.startsWith('[data-') || s.startsWith('.motion-ready')) return `.linux${s}`;
  return `.linux ${s}`;
}
// Prototiplerde tek vitrin vardı (h2, doğrudan img); sitede altı vitrin var (h3, bağlantı içinde img).
function genislet(s) {
  s = s.replace('.folio-screen>img', '.folio-screen img').replace('.hero-screen>img', '.hero-screen img');
  return s.includes('.feature-copy h2') ? [s, s.replace('.feature-copy h2', '.feature-copy h3')] : [s];
}
function donustur(css, temaOneki) {
  const ast = postcss.parse(yol(css));
  ast.walkAtRules('font-face', at => at.remove());
  ast.walkRules(rule => {
    if (rule.parent?.type === 'atrule' && /keyframes/.test(rule.parent.name)) return;
    const secici = rule.selectors.filter(s => !ATILAN.test(s)).flatMap(genislet).map(s => kapsa(temaOneki ? temaOneki(s) : s));
    if (secici.length) rule.selectors = secici; else rule.remove();
  });
  ast.walkAtRules('media', at => { if (!at.nodes.length) at.remove(); });
  return ast.toString();
}

const ortak = fs.readFileSync('tasarim/ortak/temel.css', 'utf8')
  .replace(/@media\(prefers-reduced-motion:reduce\)\{(.*)\}\s*$/s, (_, govde) =>
    govde.replace(/(^|\})([^{}]+)\{/g, (m, son, sec) => `${son}${sec.split(',').map(s => s.trim() === 'html' ? 'html[data-hareket="azalt"]' : `html[data-hareket="azalt"] ${s.trim()}`).join(',')}{`) + '\n');
fs.writeFileSync(`${HEDEF}/ortak.css`, donustur(ortak));

for (const [dir, tema] of [['a', 'sistem'], ['b', 'gece'], ['c', 'manzara']]) {
  const onek = s => s.includes(':root') ? s.replace(':root', `:root[data-tema="${tema}"]`)
    : s.startsWith('.motion-ready') ? `[data-tema="${tema}"]${s}`
    : /^(html|body)\b/.test(s) ? `[data-tema="${tema}"]${s.replace(/^(html|body)/, '')}`
    : `[data-tema="${tema}"] ${s}`;
  fs.writeFileSync(`${HEDEF}/${tema}.css`, donustur(fs.readFileSync(`tasarim/${dir}/yon.css`, 'utf8'), onek));
}

const site = fs.readFileSync('src/stil/site.css', 'utf8')
  .replace('html[data-yazi="buyuk"] main,html[data-yazi="buyuk"] .footer{zoom:1.14}', 'html[data-yazi="buyuk"]{zoom:1.14}')
  .replace('html[data-yazi="buyuk"] main :is(', 'html[data-yazi="buyuk"] :is(');
fs.writeFileSync(`${HEDEF}/site.css`, donustur(site) + fs.readFileSync('araclar/linux-ek.css', 'utf8'));
console.log('linux CSS yazıldı');
