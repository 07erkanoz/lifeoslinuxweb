import { useState } from 'react';
import { Meta, UygulamaSatiri } from '../bilesenler/Ortak.jsx';
import { uygulamalar } from '../veri/index.js';

export default function Uygulamalar() {
  const [arama, setArama] = useState(''); const [kategori, setKategori] = useState('Tümü');
  const kategoriler = ['Tümü', ...new Set(uygulamalar.map(a => a.kategori))];
  const sonuc = uygulamalar.filter(a => (kategori === 'Tümü' || kategori === a.kategori) && `${a.ad} ${a.kisa_aciklama}`.toLocaleLowerCase('tr').includes(arama.trim().toLocaleLowerCase('tr')));
  return <section className="shell page"><Meta baslik="Uygulamalar" aciklama="LifeOS uygulamalarını ara; kategorilere, açıklamalara, özelliklere ve görsellere göz at." /><p className="eyebrow">LIFEOS UYGULAMALARI</p><h1>Her işin<br />bir aracı var.</h1><p className="page-lead">Masaüstü, belgeler, bağlantı ve günlük işlerin için LifeOS araçları.</p><div className="filters"><label>Ad veya açıklamayla ara<input type="search" value={arama} onChange={e => setArama(e.target.value)} /></label><label>Kategori<select value={kategori} onChange={e => setKategori(e.target.value)}>{kategoriler.map(k => <option key={k}>{k}</option>)}</select></label></div><p className="result-count" role="status">{sonuc.length} uygulama</p><div className="compact-apps">{sonuc.map(app => <UygulamaSatiri key={app.id} app={app} />)}</div>{!sonuc.length && <p className="empty-message">Bu aramayla eşleşen uygulama bulunamadı.</p>}</section>;
}
