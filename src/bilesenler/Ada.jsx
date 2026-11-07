import { useRef, useState } from 'react';
import { dosyaYolu } from '../veri/index.js';

const tabs = [['bildirim', 'Bildirimler'], ['medya', 'Medya'], ['ayar', 'Hızlı ayarlar'], ['ajanda', 'Ajanda']];
export default function Ada() {
  const [aktif, setAktif] = useState('bildirim');
  const refs = useRef([]);
  function gezin(event, index) {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); setAktif(tabs[next][0]); refs.current[next]?.focus(); }
  }
  return <div className="ada-demo reveal"><div className="ada-landscape" aria-hidden="true" /><div className="ada-compact" aria-label="Ada küçük görünümü"><span className="ada-time">Salı 27 Eki <b>14:32</b></span><span className="ada-status"><span className="weather">13°</span><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M2 7a12 12 0 0 1 16 0M5 10a7 7 0 0 1 10 0m-7 3a3 3 0 0 1 4 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><circle cx="10" cy="16" r="1" fill="currentColor" /></svg><span>%82</span><span className="ada-badge">1</span></span></div><div className="ada-panel"><div className="ada-panel-head"><strong>Ada</strong><span>Günün özeti</span></div><div className="ada-tabs" role="tablist" aria-label="Ada sayfaları">{tabs.map(([id, text], i) => <button key={id} ref={el => { refs.current[i] = el; }} type="button" id={`tab-${id}`} role="tab" aria-selected={aktif === id} aria-controls={`panel-${id}`} tabIndex={aktif === id ? 0 : -1} onClick={() => setAktif(id)} onKeyDown={e => gezin(e, i)}>{text}</button>)}</div>
    <div className="ada-content" role="tabpanel" id="panel-bildirim" aria-labelledby="tab-bildirim" hidden={aktif !== 'bildirim'}><div className="notice"><img src={dosyaYolu('/img/ikonlar/lifeos-folio.png')} width="30" height="30" alt="" /><div><strong>LifeOS Folio</strong><p>Örnek dosyanın duruşmasına<br />30 dakika kaldı.</p><small>Şimdi · Örnek kayıt</small></div></div></div>
    <div className="ada-content" role="tabpanel" id="panel-medya" aria-labelledby="tab-medya" hidden={aktif !== 'medya'}><div className="media-row"><span>Şu an çalan medya yok.</span><span aria-hidden="true">♫</span></div></div>
    <div className="ada-content" role="tabpanel" id="panel-ayar" aria-labelledby="tab-ayar" hidden={aktif !== 'ayar'}><div className="control-row"><span>Wi-Fi</span><span>Bluetooth</span><span>Rahatsız etme</span><span>Ses</span></div></div>
    <div className="ada-content" role="tabpanel" id="panel-ajanda" aria-labelledby="tab-ajanda" hidden={aktif !== 'ajanda'}><div className="calendar-row">Örnek dosya duruşması<span>15:00 · Örnek ajanda kaydı</span></div></div>
    </div><p className="ada-footnote">Ada’nın sayfalarını seçerek keşfet.</p></div>;
}
