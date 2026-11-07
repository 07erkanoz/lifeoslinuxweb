#!/usr/bin/env python3
"""Gerçek PNG çekimlerinden LifeOS WebP sunumları üretir.

Çalıştırma: python3 araclar/sunum.py
Varsayılan: yalnız onaylı magaza-1, usb-1, hesap-1 örnekleri.
Başka onaylı çekimler: --sec ad-1 ad-2
Çıktılar: <ad>.webp, <ad>@1x.webp, <ad>-pencere.webp
masaustu-* çekimleri yeniden çerçevelenmeden dönüştürülür.
Duvar kâğıdı seçimleri çıktı klasöründeki sunum-esleme.json'da saklanır.
"""

import argparse
import json
from pathlib import Path
import sys

from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SIZE = (2560, 1600)
QUALITY = 88
RESAMPLE = Image.Resampling.LANCZOS
SAMPLES = ('magaza-1', 'usb-1', 'hesap-1')
# Bu eski çekimler gerçek kişisel veri içeriyor; yeni çekim farklı adla gelmeli.
REJECTED = {'sistem-1', 'yonetim-1', 'karsilama-1'}


def local_path(value):
    path = (ROOT / value).resolve()
    if not path.is_relative_to(ROOT):
        raise ValueError(f"Yol çalışma klasörü içinde olmalı: {value}")
    return path


def wallpapers():
    """Her LifeOS temasından bir gerçek duvar kâğıdı seç."""
    result = {}
    for folder in sorted(Path('/usr/share/wallpapers').glob('LifeOS-*')):
        images = sorted(p for p in (folder / 'contents/images').glob('*')
                        if p.suffix.lower() in {'.png', '.jpg', '.jpeg', '.webp'})
        if images:
            preferred = next((p for p in images if p.stem == '2560x1600'), images[0])
            result[folder.name] = preferred
    return result


def read_image(path):
    with Image.open(path) as image:
        image.load()
        return ImageOps.exif_transpose(image).convert('RGBA')


def rounded_window(image):
    """Piksel içeriğini koru; 1x'te 12, 2x'te 24 px köşe uygula."""
    image = image.copy()
    mask = Image.new('L', image.size)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, image.width - 1, image.height - 1),
                                           radius=24, fill=255)
    image.putalpha(ImageChops.multiply(image.getchannel('A'), mask))
    return image


def crop_window(image):
    """Opak pencerenin bbox'u ile KWin gölgesini ve boş kenarları çıkar."""
    alpha = image.getchannel('A')
    bounds = alpha.point(lambda value: 255 if value >= 250 else 0).getbbox()
    if not bounds:
        raise ValueError('Opak pencere alanı bulunamadı; çekim kontrol edilmeli.')
    return image.crop(bounds)


def compose(window, wallpaper):
    background = ImageOps.fit(wallpaper.convert('RGB'), SIZE, method=RESAMPLE)
    background = background.filter(ImageFilter.GaussianBlur(64))
    canvas = ImageEnhance.Brightness(background).enhance(.82).convert('RGBA')
    scale = min(SIZE[0] * .8 / window.width, SIZE[1] * .8 / window.height)
    size = (max(1, round(window.width * scale)), max(1, round(window.height * scale)))
    window = rounded_window(window.resize(size, RESAMPLE))
    x, y = ((SIZE[0] - size[0]) // 2, (SIZE[1] - size[1]) // 2)
    shadow = Image.new('RGBA', SIZE)
    ImageDraw.Draw(shadow).rounded_rectangle((x, y + 30, x + size[0], y + size[1] + 30),
                                             radius=24, fill=(0, 0, 0, 89))
    canvas = Image.alpha_composite(canvas, shadow.filter(ImageFilter.GaussianBlur(36)))
    canvas.alpha_composite(window, (x, y))
    return canvas.convert('RGB')


def save_webp(image, path):
    # Kaynak EXIF, yorum ve diğer kişisel metaveriler çıktıya taşınmaz.
    image.save(path, 'WEBP', quality=QUALITY, method=6, exif=b'', xmp=b'')


def convert(source, output, wallpaper=None):
    image = read_image(source)
    stem = source.stem
    desktop = stem.startswith('masaustu-') or stem == 'masaustu'
    if not desktop:
        image = crop_window(image)
    main = image if desktop else compose(image, read_image(wallpaper))
    save_webp(main, output / f'{stem}.webp')
    height = max(1, round(main.height * 1280 / main.width))
    save_webp(main.resize((1280, height), RESAMPLE), output / f'{stem}@1x.webp')
    save_webp(image, output / f'{stem}-pencere.webp')


def run(input_dir, output_dir, selected=SAMPLES):
    if not input_dir.exists():
        print('Ham görüntü bulunamadı: ekran-ham/ çekimleri bekleniyor.')
        return 0
    sources = sorted(p for p in input_dir.rglob('*')
                     if p.suffix.lower() == '.png' and p.is_file()
                     and not p.is_symlink()
                     and p.stem in selected
                     and p.stem not in REJECTED
                     and 'kisisel' not in p.relative_to(input_dir).parts
                     and p.resolve().is_relative_to(input_dir.resolve())
                     and 'kisisel' not in p.resolve().relative_to(input_dir.resolve()).parts)
    missing = set(selected) - {p.stem for p in sources}
    if missing:
        raise ValueError('Seçili çekim eksik veya işlenmesi yasak: ' + ', '.join(sorted(missing)))
    stems = [p.stem for p in sources]
    if len(stems) != len(set(stems)):
        raise ValueError('Ham görüntü dosya adları alt klasörler dahil benzersiz olmalı.')
    names = [name for stem in stems for name in (stem, f'{stem}@1x', f'{stem}-pencere')]
    if len(names) != len(set(names)):
        raise ValueError('Ham dosya adlarında @1x veya -pencere çıktı adı çakışması var.')
    if not sources:
        print('İşlenecek PNG yok; kisisel/ klasörü atlandı.')
        return 0
    output_dir.mkdir(parents=True, exist_ok=True)
    manifest = output_dir / 'sunum-esleme.json'
    assignments = json.loads(manifest.read_text()) if manifest.exists() else {}
    if not isinstance(assignments, dict) or not all(isinstance(v, str) for v in assignments.values()):
        raise ValueError('sunum-esleme.json bir ad → duvar kâğıdı eşlemesi olmalı.')
    backgrounds = wallpapers()
    windows = [p for p in sources if not (p.stem.startswith('masaustu-') or p.stem == 'masaustu')]
    if windows and not backgrounds:
        raise ValueError('/usr/share/wallpapers/LifeOS-* altında duvar kâğıdı bulunamadı.')
    for source in windows:
        if assignments.get(source.stem) not in backgrounds:
            # Kayıtlı seçimleri koru; yeni dosyalara en az kullanılan zemini sırayla ver.
            assignments[source.stem] = min(backgrounds,
                key=lambda name: (list(assignments.values()).count(name), name))
    for source in sources:
        convert(source, output_dir, backgrounds.get(assignments.get(source.stem)))
    manifest.write_text(json.dumps(assignments, ensure_ascii=False, indent=2) + '\n')
    print(f'{len(sources)} PNG işlendi; {len(sources) * 3} WebP üretildi. Kişisel klasör atlandı.')
    return len(sources)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--girdi', default='ekran-ham', help='Çalışma klasörüne göre PNG klasörü')
    parser.add_argument('--cikti', default='public/img/ekran', help='Çalışma klasörüne göre çıktı klasörü')
    parser.add_argument('--sec', nargs='+', default=SAMPLES,
                        help='Kişisel veri içermediği doğrulanmış çekim adları (uzantısız)')
    args = parser.parse_args()
    try:
        source, target = local_path(args.girdi), local_path(args.cikti)
        if source == target or source.is_relative_to(target) or target.is_relative_to(source):
            raise ValueError('Girdi ve çıktı klasörleri birbirinden ayrı olmalı.')
        if 'kisisel' in source.relative_to(ROOT).parts or 'kisisel' in target.relative_to(ROOT).parts:
            raise ValueError('kisisel/ klasörü girdi veya çıktı olarak kullanılamaz.')
        run(source, target, args.sec)
    except (OSError, ValueError, Image.DecompressionBombError) as error:
        print(f'Hata: {error}', file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
