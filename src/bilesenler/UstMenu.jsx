import { useEffect, useId, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Isaret } from './Ortak.jsx';
import { TEMALAR, useTema } from '../tema/TemaContext.jsx';
import { anaSiteYolu, metin } from '../veri/metinler.js';

const m = metin.menu;

function Acilir({ ad, aktif = false, children }) {
  const [acik, setAcik] = useState(false);
  const kok = useRef(null);
  const dugme = useRef(null);
  const id = useId();
  useEffect(() => {
    if (!acik) return;
    const disari = e => { if (!kok.current?.contains(e.target)) setAcik(false); };
    document.addEventListener('pointerdown', disari);
    return () => document.removeEventListener('pointerdown', disari);
  }, [acik]);
  const fare = fn => e => { if (e.pointerType === 'mouse' && matchMedia('(min-width: 1181px)').matches) fn(); };
  return <div className={`acilir${acik ? ' acik' : ''}`} ref={kok}
    onPointerEnter={fare(() => setAcik(true))} onPointerLeave={fare(() => setAcik(false))}
    onBlur={e => { if (!kok.current.contains(e.relatedTarget)) setAcik(false); }}
    onKeyDown={e => { if (e.key === 'Escape' && acik) { e.stopPropagation(); setAcik(false); dugme.current.focus(); } }}>
    <button type="button" ref={dugme} className={aktif ? 'aktif' : undefined} aria-expanded={acik} aria-controls={id} onClick={() => setAcik(!acik)}>
      {ad}<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </button>
    <div className="acilir-panel" id={id} hidden={!acik}><ul onClick={e => { if (e.target.closest('a')) setAcik(false); }}>{children}</ul></div>
  </div>;
}

export default function UstMenu() {
  const [menu, setMenu] = useState(false);
  const konum = useLocation();
  const { tema, temaAdi, setTema } = useTema();
  useEffect(() => setMenu(false), [konum.key]);
  useEffect(() => {
    if (!menu) return;
    const kapat = e => { if (e.key === 'Escape') setMenu(false); };
    document.addEventListener('keydown', kapat);
    return () => document.removeEventListener('keydown', kapat);
  }, [menu]);
  const sonraki = TEMALAR[(TEMALAR.indexOf(tema) + 1) % TEMALAR.length];
  return <header className={`top site-header${menu ? ' menu-acik' : ''}`}><div className="nav shell">
    <Link className="brand" to="/" aria-label={metin.marka.anaSayfa}><Isaret />{metin.marka.ad}<small>{metin.marka.ek}</small></Link>
    <nav id="ana-menu" className={`site-nav${menu ? ' open' : ''}`} aria-label={m.etiket}>
      <ul className="ana-site-baglantilari">{m.anaSite.map(b => <li key={b.href}><a href={anaSiteYolu(b.href)}>{b.ad}</a></li>)}</ul>
      <Acilir ad={m.uygulamalar}>{m.uygulamaListesi.map(b => <li key={b.href}><a href={anaSiteYolu(b.href)}><strong>{b.ad}</strong><small>{b.not}</small></a></li>)}</Acilir>
      <Acilir ad={m.linux} aktif>{m.linuxListesi.map(b => <li key={b.to}><NavLink to={b.to} end><strong>{b.ad}</strong><small>{b.not}</small></NavLink></li>)}</Acilir>
    </nav>
    <div className="nav-tools">
      <button type="button" className="theme-quick" onClick={() => setTema(sonraki)} aria-label={m.tema(temaAdi)} title={m.tema(temaAdi)}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.5" /><path d="M12 5a7 7 0 0 1 0 14Z" fill="currentColor" /></svg><span>{temaAdi}</span></button>
      <NavLink className="settings-link" to="/ayarlar" aria-label={m.ayarlar} title={m.ayarlar}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h10m4 0h2M4 17h4m4 0h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><circle cx="16" cy="7" r="2" stroke="currentColor" strokeWidth="1.5" /><circle cx="10" cy="17" r="2" stroke="currentColor" strokeWidth="1.5" /></svg><span>{m.ayarlar}</span></NavLink>
      <button type="button" className="menu-toggle" aria-controls="ana-menu" aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? m.kapat : m.ac}</button>
    </div>
  </div></header>;
}
