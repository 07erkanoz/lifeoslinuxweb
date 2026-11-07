#!/bin/bash
# cek.sh <cikti.png> <komut...>
# Uygulamayi acar, penceresini 1440x900 yapar, yalniz aktif pencereyi ceker, kapatir.
set -u
B=/home/erkanoz/.local/share/lifeos/ekip/is/1
out="$1"; shift
W=${LOS_W:-1440}; H=${LOS_H:-900}
baseline=$("$B/araclar/kwrun.sh" "$B/araclar/kwin/liste.js" | cut -d'|' -f2 | tr '\n' ' ')
setsid "$@" >>"$B/araclar/cek.log" 2>&1 &
pid=$!
new=""; newcls=""; newcap=""
for i in $(seq 1 40); do
  sleep 0.5
  while IFS='|' read -r _ id cls cap geo; do
    [ "$id" = "END" ] && continue
    case " $baseline " in *" $id "*) continue;; esac
    new="$id"; newcls="$cls"; newcap="$cap"
  done < <("$B/araclar/kwrun.sh" "$B/araclar/kwin/liste.js")
  [ -n "$new" ] && break
done
if [ -z "$new" ]; then
  echo "ACILMADI: $*"
  kill $pid 2>/dev/null
  exit 1
fi
cat > "$B/araclar/kwin/ayar.js" <<EOF
var ws = workspace.windowList();
for (var i = 0; i < ws.length; i++) {
  var w = ws[i];
  if (String(w.internalId) !== "$new") continue;
  if (w.fullScreen) w.fullScreen = false;
  w.frameGeometry = { x: Math.round((workspace.workspaceWidth - $W)/2), y: 60, width: $W, height: $H };
  workspace.activeWindow = w;
  print("LOSW|SET|" + w.frameGeometry.width + "x" + w.frameGeometry.height);
}
EOF
"$B/araclar/kwrun.sh" "$B/araclar/kwin/ayar.js" >/dev/null
sleep 3
"$B/araclar/kwrun.sh" "$B/araclar/kwin/ayar.js" >/dev/null
sleep 1
spectacle -b -n -a -o "$out" >/dev/null 2>&1
sleep 2
echo "CEKILDI: $out | $newcls | $newcap"
if [ "${LOS_KAPAT:-1}" = "1" ]; then
  cat > "$B/araclar/kwin/kapat.js" <<EOF
var ws = workspace.windowList();
for (var i = 0; i < ws.length; i++) {
  if (String(ws[i].internalId) === "$new") { ws[i].closeWindow(); print("LOSW|KAPANDI"); }
}
EOF
  "$B/araclar/kwrun.sh" "$B/araclar/kwin/kapat.js" >/dev/null
  sleep 1
  kill $pid 2>/dev/null
fi
