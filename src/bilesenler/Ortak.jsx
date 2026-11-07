import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { uygulamaYolu, dosyaYolu, durumMetni } from '../veri/index.js';
import { useTema } from '../tema/TemaContext.jsx';

export function Meta({ baslik, aciklama }) {
  useEffect(() => {
    document.title = `${baslik} — LifeOS`;
    document.querySelector('meta[name="description"]').content = aciklama;
  }, [baslik, aciklama]);
  return null;
}

export function Isaret({ className = '' }) {
  const { tema } = useTema();
  return <img className={`marka-amblemi ${className}`} src={dosyaYolu(`/img/marka/lifeos-symbol${tema === 'gece' ? '' : '-ink'}.svg`)} alt="" width="34" height="34" />;
}

export function Ok({ yon }) { return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={yon === 'asagi' ? 'M12 4v15m-6-6 6 6 6-6' : 'M5 12h14m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>; }

export function Ikon({ src, ad, className = '' }) {
  const [bozuk, setBozuk] = useState(false);
  useEffect(() => setBozuk(false), [src]);
  return src && !bozuk ? <img className={`uygulama-ikonu ${className}`} src={dosyaYolu(src)} alt="" onError={() => setBozuk(true)} /> : <span className={`ikon-yedek ${className}`} aria-label={ad}><Isaret /></span>;
}

export function Ekran({ src, ad, ikon, telefon = false, onClick }) {
  const [bozuk, setBozuk] = useState(false);
  useEffect(() => setBozuk(false), [src]);
  const mevcut = src && !bozuk;
  const icerik = mevcut ? <img src={dosyaYolu(src)} alt={ad} loading="lazy" onError={() => setBozuk(true)} /> : <div className="ekran-bekleme"><Ikon src={ikon} ad={ad} /></div>;
  const className = `ekran${telefon ? ' telefon' : ''}`;
  return onClick && mevcut ? <button type="button" className={`${className} ekran-dugme`} onClick={onClick} aria-label={`${ad}, büyüt`}>{icerik}<span className="buyut">Büyüt ↗</span></button> : <div className={className}>{icerik}</div>;
}

export function UygulamaSatiri({ app }) {
  return <Link className="uygulama-satiri" to={uygulamaYolu(app.id)}><Ikon src={app.ikon} ad={app.ad} /><span><strong>{app.ad}</strong><small>{app.kisa_aciklama}</small>{durumMetni(app) && <small className="durum-etiketi">{durumMetni(app)}</small>}</span><span aria-hidden="true">↗</span></Link>;
}

