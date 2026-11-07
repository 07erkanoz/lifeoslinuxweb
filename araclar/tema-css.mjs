// Prototip CSS'lerini (tasarim/a,b,c) data-tema katmanlarına dönüştürür.
// Kullanım: node araclar/tema-css.mjs
import postcss from 'postcss';
import fs from 'node:fs';

const base = fs.readFileSync('tasarim/ortak/temel.css', 'utf8')
  .replace("url('InterVariable.ttf')", "url('/fonts/InterVariable.ttf')")
  .replaceAll("url('masaustu-gun.png')", "url('/img/tasarim/masaustu-gun.png')")
  // Hareket tercihi Ayarlar'dan geçersiz kılınabilsin: medya sorgusu yerine data-hareket.
  .replace(/@media\(prefers-reduced-motion:reduce\)\{(.*)\}\s*$/s, (_, body) =>
    body.replace(/(^|\})([^{}]+)\{/g, (m, end, sel) => `${end}${sel.split(',').map(s => s.trim() === 'html' ? 'html[data-hareket="azalt"]' : `html[data-hareket="azalt"] ${s.trim()}`).join(',')}{`) + '\n');
fs.writeFileSync('src/stil/ortak.css', paylasilan(base));

// Prototiplerde tek bir vitrin vardı (h2, doğrudan img); sitede birden çok vitrin var (h3, bağlantı içinde img).
function paylasilan(css) {
  const ast = postcss.parse(css);
  ast.walkRules(rule => { rule.selectors = rule.selectors.flatMap(genislet); });
  return ast.toString();
}
function genislet(s) {
  s = s.replace('.folio-screen>img', '.folio-screen img');
  return s.includes('.feature-copy h2') ? [s, s.replace('.feature-copy h2', '.feature-copy h3')] : [s];
}

for (const [dir, tema] of [['a', 'sistem'], ['b', 'gece'], ['c', 'manzara']]) {
  const ast = postcss.parse(fs.readFileSync(`tasarim/${dir}/yon.css`, 'utf8').replaceAll('../ortak/', '/img/tasarim/'));
  ast.walkRules(rule => {
    if (rule.parent?.type === 'atrule' && /keyframes/.test(rule.parent.name)) return;
    rule.selectors = rule.selectors.map(s => s.includes(':root') ? s.replace(':root', `:root[data-tema="${tema}"]`)
      : s.startsWith('.motion-ready') ? `html[data-tema="${tema}"]${s}`
      : /^(html|body)\b/.test(s) ? s.replace(/^(html|body)/, m => m === 'html' ? `html[data-tema="${tema}"]` : `[data-tema="${tema}"] body`)
      : `[data-tema="${tema}"] ${s}`).flatMap(genislet);
  });
  fs.writeFileSync(`src/stil/temalar/${tema}.css`, ast.toString());
}
console.log('tema CSS katmanları yazıldı');
