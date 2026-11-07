import { Link } from 'react-router-dom';
import { Meta, Ok } from '../bilesenler/Ortak.jsx';
import kurulum from '../veri/kurulum.json';

export function KurulumProfilleri() {
  return <section id="kurulum" className="setup section" aria-labelledby="kurulum-baslik"><div className="shell"><div className="section-head reveal"><p className="eyebrow">KURULUM SEÇENEKLERİ</p><h2 id="kurulum-baslik">Senin işine göre<br />bir başlangıç.</h2><p>Standart ve Avukat. Aynı masaüstü, farklı çalışma araçları.</p></div><div className="profiles reveal">{kurulum.profiller.map(p => <article className={`profile profile-${p.id}`} key={p.id}><h3>{p.ad}</h3><p className="for">{p.kime}</p><ul>{p.uygulamalar.map(a => <li key={a}>{a}</li>)}</ul><p className="profile-note">{p.not}</p></article>)}</div><p className="setup-note">{kurulum.ilk_acilis}</p></div></section>;
}

export function Gereksinimler() {
  return <section className="requirements" aria-labelledby="gereksinim-baslik"><h2 id="gereksinim-baslik">Kurulum denetimleri</h2><dl>{kurulum.gereksinimler.map(g => <div key={g.ad}><dt>{g.ad}</dt><dd>{g.deger}</dd></div>)}</dl><p>Bellek ve alan değerleri kurulumun denetim eşikleridir.</p><p>{kurulum.guvenlik_notu}</p></section>;
}

export function IndirmeBilgisi() {
  return <div className="release-panel"><p className="eyebrow">LIFEOS LINUX</p><h2>İndirme bağlantısı<br />henüz yayımlanmadı.</h2><p>ISO dosyası ve doğrulama özeti hazır olduğunda burada yer alacak.</p><Link className="text-link" to="/#kurulum">Kurulum profillerini karşılaştır <Ok /></Link></div>;
}

export default function Indir() {
  return <><section className="shell page download-page"><Meta baslik="İndirme ve kurulum" aciklama="LifeOS Linux indirme durumu, Standart ve Avukat kurulum profilleri ve doğrulanmış kurulum denetimleri." /><p className="eyebrow">İNDİRME VE KURULUM</p><h1>LifeOS’a<br />yer aç.</h1><p className="page-lead">Profilini seçmeden önce bilgisayarını ve kişisel dosyalarının yedeğini hazırla.</p><div className="download-layout"><IndirmeBilgisi /><Gereksinimler /></div></section><KurulumProfilleri /></>;
}
