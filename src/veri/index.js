import veri from '../../data/uygulamalar.json';
export const uygulamalar = Array.isArray(veri) ? veri : (veri.uygulamalar ?? []);
export const sistem = Array.isArray(veri) ? {} : (veri.sistem ?? {});
export const uygulamaYolu = (id) => `/uygulamalar/${encodeURIComponent(id)}`;
export const dosyaYolu = (path) => typeof path === 'string' && path ? `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}` : undefined;
export const durumMetni = (app) => ({ design: 'Tasarım aşamasında', 'packaging-pending': 'Paketleme sürüyor', testing: 'Test aşamasında' }[app.durum]);
