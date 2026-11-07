#!/usr/bin/env python3
"""LifeOSLinux kataloğunu salt okuyup site görsellerini ve alt metinlerini üretir.

python3 araclar/depo-gorselleri.py [--kaynak /depo/yolu]
Ağ erişimi, uygulama başlatma ve ekran çekimi yoktur.
"""

import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import shutil
import sys

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_REPO = Path('/home/erkanoz/Projeler/LifeosArch/src/LifeOSLinux')
# Görsel inceleme: Gate'in kaynaklarında zaten 8 px siyah dış çerçeve var.
FRAMED = {'lifeos-gate'}


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def under(root, relative):
    result = (root / relative).resolve()
    if not result.is_relative_to(root.resolve()):
        raise ValueError(f'Kaynak depo dışına çıkıyor: {relative}')
    if not result.is_file():
        raise ValueError(f'Kaynak dosya yok: {relative}')
    return result


def presentation_module():
    sys.dont_write_bytecode = True
    spec = importlib.util.spec_from_file_location('lifeos_sunum', ROOT / 'araclar/sunum.py')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def convert(repo):
    if repo == ROOT or repo.is_relative_to(ROOT) or ROOT.is_relative_to(repo):
        raise ValueError('Kaynak depo çalışma klasöründen ayrı olmalı.')
    presentation = presentation_module()
    catalog = json.loads(under(repo, 'catalog/media.json').read_text())
    provenance = {v['file']: v for v in json.loads(under(repo, 'catalog/media/provenance.json').read_text())}
    wallpaper_root = repo / 'iso/airootfs/usr/share/wallpapers'
    wallpapers = [p for folder in sorted(wallpaper_root.glob('LifeOS-*'))
                  for p in sorted((folder / 'contents/images').glob('2560x1600.png'))]
    if not wallpapers:
        raise ValueError('Depoda LifeOS duvar kâğıdı bulunamadı.')
    output = ROOT / 'public'
    manifest = ROOT / 'src/veri/medya.json'
    old = json.loads(manifest.read_text()) if manifest.exists() else []
    old = {v['kaynak']: v for v in old}
    version = sha(Path(__file__)) + sha(ROOT / 'araclar/sunum.py')
    records = []
    outputs = set()

    def export(source, app_id, asset, mode, wallpaper=None):
        phone = bool(asset.get('phone'))
        icon = asset['role'] == 'icon'
        folder = 'ikonlar' if icon else ('telefon' if phone else 'ekran')
        name = source.name if icon else source.stem + '.webp'
        public_src = f'/img/{folder}/{name}'
        if public_src in outputs:
            raise ValueError(f'Çıktı adı çakışıyor: {public_src}')
        outputs.add(public_src)
        destination = output / public_src.lstrip('/')
        destination.parent.mkdir(parents=True, exist_ok=True)
        relative = source.relative_to(repo).as_posix()
        digest = sha(source)
        proof = provenance.get(source.name)
        if proof and proof['sha256'] != digest:
            raise ValueError(f'Provenance özeti uyuşmuyor: {relative}')
        fingerprint = hashlib.sha256((version + digest + mode + (sha(wallpaper) if wallpaper else '')).encode()).hexdigest()
        previous = old.get(relative, {})
        variants = [] if icon or phone else [
            destination.with_name(destination.stem + '@1x.webp'),
            destination.with_name(destination.stem + '-pencere.webp')]
        files = [destination, *variants]
        cached = (previous.get('uretici_ozeti') == fingerprint
                  and all(p.is_file() and previous.get('cikti_ozetleri', {}).get('/' + p.relative_to(output).as_posix()) == sha(p) for p in files))
        with Image.open(source) as original:
            original_size = original.size
        if not cached:
            image = presentation.read_image(source)
            if icon:
                shutil.copyfile(source, destination)
            else:
                window = presentation.crop_window(image) if mode == 'sunum' else image
                result = presentation.compose(window, presentation.read_image(wallpaper)) if mode == 'sunum' else image
                presentation.save_webp(result, destination)
                if variants:
                    height = max(1, round(result.height * 1280 / result.width))
                    presentation.save_webp(result.resize((1280, height), Image.Resampling.LANCZOS), variants[0])
                    presentation.save_webp(window, variants[1])
        with Image.open(destination) as image:
            width, height = image.size
        record = dict(asset, app_id=app_id, src=public_src, kaynak=relative,
                      kaynak_sha256=digest, kaynak_boyutu=list(original_size),
                      width=width, height=height, sunum=mode, uretici_ozeti=fingerprint,
                      cikti_ozetleri={'/' + p.relative_to(output).as_posix(): sha(p) for p in files})
        if wallpaper:
            record['duvar_kagidi'] = wallpaper.relative_to(repo).as_posix()
        if variants:
            record['src_1x'] = '/' + variants[0].relative_to(output).as_posix()
            record['pencere'] = '/' + variants[1].relative_to(output).as_posix()
        records.append(record)

    index = 0
    for app_id, app in catalog['apps'].items():
        for asset in app['assets']:
            filename = asset['file']
            if Path(filename).name != filename or asset['role'] not in {'icon', 'screenshot'} or not asset.get('alt'):
                raise ValueError(f'Geçersiz medya kaydı: {filename}')
            source = under(repo, 'catalog/media/' + filename)
            mode = 'dogrudan' if asset['role'] == 'icon' or asset.get('phone') or app_id in FRAMED else 'sunum'
            wallpaper = wallpapers[index % len(wallpapers)] if mode == 'sunum' else None
            if mode == 'sunum':
                index += 1
            export(source, app_id, asset, mode, wallpaper)

    for name, theme, alt in [('masaustu-gun', 'light', 'LifeOS açık masaüstü tasarımı: dosyalar, konsol ve bildirim'),
                             ('masaustu-gece', 'dark', 'LifeOS koyu masaüstü tasarımı: dosyalar, konsol ve bildirim')]:
        source = under(repo, f'apps/karsilama/lifeos_karsilama/qml/gorsel/{name}.png')
        export(source, 'lifeos-masaustu', dict(file=source.name, role='screenshot', alt=alt, theme=theme), 'dogrudan')
    manifest.parent.mkdir(parents=True, exist_ok=True)
    manifest.write_text(json.dumps(records, ensure_ascii=False, indent=2) + '\n')
    print(f'{len(records)} medya kaydı aktarıldı; katalog alt metinleri korundu.')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--kaynak', type=Path, default=DEFAULT_REPO)
    args = parser.parse_args()
    try:
        convert(args.kaynak.resolve())
    except (OSError, ValueError, KeyError) as error:
        print(f'Hata: {error}', file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
