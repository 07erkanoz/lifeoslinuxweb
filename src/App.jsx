import { useEffect, useRef } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import AnaSayfa from './sayfalar/AnaSayfa.jsx';
import Uygulamalar from './sayfalar/Uygulamalar.jsx';
import UygulamaDetay from './sayfalar/UygulamaDetay.jsx';
import Indir from './sayfalar/Indir.jsx';
import Ayarlar from './sayfalar/Ayarlar.jsx';
import UstMenu from './bilesenler/UstMenu.jsx';
import { Isaret, Meta, Ok } from './bilesenler/Ortak.jsx';
import { useTema } from './tema/TemaContext.jsx';
import { anaSiteYolu, metin } from './veri/metinler.js';

export default function App() {
  const konum = useLocation();
  const ana = useRef(null);
  const ilk = useRef(true);
  const { tema, azalt } = useTema();
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const target = konum.hash && document.getElementById(konum.hash.slice(1));
      if (target) target.scrollIntoView({ behavior: 'instant' }); else window.scrollTo(0, 0);
      if (!ilk.current) ana.current?.focus({ preventScroll: true });
      ilk.current = false;
    });
    return () => cancelAnimationFrame(frame);
  }, [konum.key, konum.hash]);
  useEffect(() => {
    const root = document.documentElement;
    if (tema !== 'gece' || azalt || !('IntersectionObserver' in window)) { root.classList.remove('motion-ready'); return; }
    root.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: .08 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => { observer.disconnect(); root.classList.remove('motion-ready'); };
  }, [tema, azalt, konum.key]);
  const a = metin.altBilgi;
  return <div className={`app-root ${konum.pathname === '/' ? 'is-home' : 'is-inner'}`}>
    <a className="skip" href="#icerik" onClick={e => { e.preventDefault(); ana.current?.focus(); ana.current?.scrollIntoView(); }}>{metin.icerigeGec}</a>
    <UstMenu />
    <main id="icerik" ref={ana} tabIndex="-1"><Routes>
      <Route path="/" element={<AnaSayfa />} /><Route path="/uygulamalar" element={<Uygulamalar />} /><Route path="/uygulamalar/:id" element={<UygulamaDetay />} /><Route path="/indir" element={<Indir />} /><Route path="/ayarlar" element={<Ayarlar />} />
      <Route path="*" element={<section className="shell page"><Meta baslik="Sayfa bulunamadı" aciklama="Aradığın LifeOS sayfası bulunamadı." /><p className="eyebrow">404</p><h1>Bu sayfa bulunamadı.</h1><p className="page-lead">Adres değişmiş ya da hiç var olmamış olabilir.</p><Link className="button" to="/">LifeOS Linux’a dön <Ok /></Link></section>} />
    </Routes></main>
    <footer className="footer shell">
      <div className="footer-brand"><Link className="brand" to="/"><Isaret />{metin.marka.ad}<small>{metin.marka.ek}</small></Link><p>{a.ozet} {a.telif(new Date().getFullYear())}</p></div>
      <nav aria-label="Alt gezinme"><ul>{a.linux.map(b => <li key={b.to}><Link to={b.to}>{b.ad}</Link></li>)}{a.anaSite.map(b => <li key={b.href}><a href={anaSiteYolu(b.href)}>{b.ad}</a></li>)}</ul></nav>
    </footer>
  </div>;
}
