import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Ekran, Ikon, Meta, UygulamaSatiri } from '../bilesenler/Ortak.jsx';
import { uygulamalar, durumMetni } from '../veri/index.js';
import { anaSiteYolu, metin } from '../veri/metinler.js';

function Galeri({ app }) {
  const goruntuler = (app.ekran_goruntuleri ?? []).filter(g => g && typeof g.dosya === 'string' && g.alt);
  const [aktif, setAktif] = useState(0); const [acik, setAcik] = useState(false);
  const diyalog = useRef(null); const oncekiOdak = useRef(null);
  useEffect(() => {
    if (!acik) return;
    oncekiOdak.current = document.activeElement;
    const eski = document.body.style.overflow; document.body.style.overflow = 'hidden';
    const dialog = diyalog.current; dialog.showModal();
    return () => { if (dialog.open) dialog.close(); document.body.style.overflow = eski; oncekiOdak.current?.focus(); };
  }, [acik]);
  if (!goruntuler.length) return null;
  function ilerle(delta) { setAktif(a => (a + delta + goruntuler.length) % goruntuler.length); }
  function gezin(event) {
    if (event.key === 'ArrowLeft') { event.preventDefault(); ilerle(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); ilerle(1); }
  }
  const goruntu = goruntuler[aktif];
  const galeri = telefon => goruntuler.map((g, i) => ({ g, i })).filter(({ g }) => Boolean(g.telefon) === telefon).map(({ g, i }) => <figure key={g.dosya}><Ekran src={g.dosya} ad={g.alt} ikon={app.ikon} telefon={telefon} onClick={() => { setAktif(i); setAcik(true); }} /><figcaption>{g.tasarim ? 'Uygulama tasarımı · ' : ''}{g.alt}</figcaption></figure>);
  return <section className="gallery"><h2>Yakından bak.</h2>{goruntuler.some(g => !g.telefon) && <div className="gallery-desktop">{galeri(false)}</div>}{goruntuler.some(g => g.telefon) && <><h3>Telefon görünümleri</h3><div className="gallery-phones">{galeri(true)}</div></>}
    <dialog className="lightbox" ref={diyalog} aria-label={`${app.ad} görselleri`} onCancel={() => setAcik(false)} onKeyDown={gezin} onClick={e => { if (e.target === e.currentTarget) setAcik(false); }}>{acik && <div className="lightbox-content"><div className="lightbox-head"><span>{app.ad}</span><button type="button" autoFocus onClick={() => setAcik(false)}>Kapat ×</button></div><Ekran src={goruntu.dosya} ad={goruntu.alt} telefon={Boolean(goruntu.telefon)} /><p>{goruntu.alt}</p><div className="lightbox-controls"><button type="button" disabled={goruntuler.length < 2} onClick={() => ilerle(-1)}>← Önceki</button><span aria-live="polite">{aktif + 1} / {goruntuler.length}</span><button type="button" disabled={goruntuler.length < 2} onClick={() => ilerle(1)}>Sonraki →</button></div></div>}</dialog>
  </section>;
}

export default function UygulamaDetay() {
  const { id } = useParams(); const app = uygulamalar.find(a => a.id === id);
  if (!app) return <section className="shell page"><Meta baslik="Uygulama bulunamadı" aciklama="Bu uygulama LifeOS kataloğunda bulunamadı." /><h1>Uygulama bulunamadı.</h1><Link className="text-link" to="/uygulamalar">Uygulamalara dön →</Link></section>;
  const ilgili = uygulamalar.filter(a => a.id !== id && a.kategori === app.kategori).slice(0, 4);
  return <article className="shell page app-detail" key={id}><Meta baslik={app.ad} aciklama={app.kisa_aciklama} /><Link className="back-link" to="/uygulamalar">← Tüm uygulamalar</Link><div className="detail-heading"><Ikon src={app.ikon} ad={app.ad} /><div><p className="eyebrow">{app.kategori}</p><h1>{app.ad}</h1>{durumMetni(app) && <p className="status-label">{durumMetni(app)}</p>}</div></div><div className="detail-information"><div><p className="detail-description">{app.uzun_aciklama}</p><ul className="detail-features">{app.ozellikler.map(o => <li key={o}>{o}</li>)}</ul>{metin.tanitim[app.id] && <a className="text-link" href={anaSiteYolu(metin.tanitim[app.id])}>lifeos.com.tr’de {metin.ayrintiliTanitim.toLocaleLowerCase('tr')} ↗</a>}</div>{(app.paket || app.surum) && <dl className="package-details">{app.paket && <div><dt>Paket</dt><dd><code>{app.paket}</code></dd></div>}{app.surum && <div><dt>Sürüm</dt><dd>{app.surum}</dd></div>}</dl>}</div><Galeri key={id} app={app} />{ilgili.length > 0 && <section className="related-apps"><h2>Aynı alandaki araçlar</h2><div className="compact-apps">{ilgili.map(a => <UygulamaSatiri app={a} key={a.id} />)}</div></section>}</article>;
}
