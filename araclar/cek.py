"""LifeOS sayfalarını üç temada, masaüstü ve 390 px'te uzun pencereyle çeker; her sayfa için tek bir karşılaştırma sayfası yapar.

Uzun pencere kullanılır, çünkü headless Chrome kaydırılmış sayfaları boş çekiyor.
Kullanım: python3 araclar/cek.py [http://127.0.0.1:4173] /uygulamalar /ayarlar ...   →  .cek/sayfa-<ad>.png
"""
import subprocess
import sys
from pathlib import Path

from PIL import Image

KOK = Path(__file__).resolve().parent.parent / '.cek'
TEMALAR = ['manzara', 'sistem', 'gece']
BOYUT = {'masaustu': (1440, 2600), 'telefon': (390, 2600)}


def cek(adres, dosya, genislik, yukseklik):
    subprocess.run(['google-chrome-stable', '--headless=new', '--no-sandbox', '--hide-scrollbars',
                    f'--window-size={genislik},{yukseklik}', f'--screenshot={dosya}', '--virtual-time-budget=6000', adres],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=90, check=False)


def main():
    argumanlar = sys.argv[1:]
    sunucu = argumanlar.pop(0) if argumanlar and argumanlar[0].startswith('http') else 'http://127.0.0.1:4173'
    KOK.mkdir(exist_ok=True)
    for yol in argumanlar:
        ad = yol.strip('/').replace('/', '-') or 'ana'
        kareler = []
        for boyut, (g, y) in BOYUT.items():
            for tema in TEMALAR:
                dosya = KOK / f'_{ad}-{boyut}-{tema}.png'
                ayirac = '&' if '?' in yol else '?'
                cek(f'{sunucu}{yol}{ayirac}tema={tema}', dosya, g, y)
                kareler.append(Image.open(dosya).convert('RGB'))
        # Üstte üç masaüstü, altta üç telefon; okunur kalsın diye küçültülür.
        masa = [k.resize((480, int(k.height * 480 / k.width))) for k in kareler[:3]]
        tel = [k.resize((240, int(k.height * 240 / k.width))) for k in kareler[3:]]
        genislik = 480 * 3
        yukseklik = max(m.height for m in masa) + max(t.height for t in tel)
        sayfa = Image.new('RGB', (genislik, yukseklik), 'white')
        for i, m in enumerate(masa):
            sayfa.paste(m, (i * 480, 0))
        for i, t in enumerate(tel):
            sayfa.paste(t, (i * 480 + 120, max(m.height for m in masa)))
        hedef = KOK / f'sayfa-{ad}.png'
        sayfa.save(hedef)
        print(hedef)


if __name__ == '__main__':
    main()
