#!/bin/sh
# LifeOSLinux deposundaki design/tanitim/ klasörünü (GitHub, main) lifeosweb'e olduğu gibi eşitler:
# yeni ve değişen dosyaları indirir, GitHub'da artık olmayan resimleri siler. medya.ts dosyaları adlarından bulur.
# Kullanım: sh araclar/tanitim-indir.sh [hedef klasör]
set -eu

DEPO=07erkanoz/LifeOSLinux
KAYNAK=design/tanitim
HEDEF=${1:-"$(dirname "$0")/../.inceleme/lifeosweb/src/content/linux/tanitim"}
mkdir -p "$HEDEF"

liste=$(gh api "repos/$DEPO/contents/$KAYNAK?ref=main" --jq '.[] | select(.type == "file") | "\(.name) \(.sha)"')
[ -n "$liste" ] || { echo "GitHub'dan liste alınamadı" >&2; exit 1; }

# Aynı içerik zaten varsa (git blob sha'sı eşitse) yeniden indirme.
echo "$liste" | while read -r ad sha; do
  if [ -f "$HEDEF/$ad" ] && [ "$(git hash-object "$HEDEF/$ad")" = "$sha" ]; then
    continue
  fi
  gh api "repos/$DEPO/contents/$KAYNAK/$ad?ref=main" -H 'Accept: application/vnd.github.raw' > "$HEDEF/$ad.yeni"
  mv "$HEDEF/$ad.yeni" "$HEDEF/$ad"
  echo "indirildi: $ad"
done

# GitHub'da kaldırılan resimler sitede de kalmasın.
for yol in "$HEDEF"/*; do
  ad=$(basename "$yol")
  echo "$liste" | grep -q "^$ad " || { rm -f "$yol"; echo "silindi: $ad"; }
done
echo "tanıtım resimleri eşit: $(ls "$HEDEF" | wc -l) dosya"
