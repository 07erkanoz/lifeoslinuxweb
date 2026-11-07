#!/bin/bash
# kwrun.sh <jsfile> : KWin betigini yukle, calistir, bosalt; journal cikisini bas
js="$1"; name="los$RANDOM$RANDOM"
since=$(date '+%Y-%m-%d %H:%M:%S')
qdbus6 org.kde.KWin /Scripting org.kde.kwin.Scripting.loadScript "$js" "$name" >/dev/null 2>&1
qdbus6 org.kde.KWin /Scripting org.kde.kwin.Scripting.start >/dev/null 2>&1
sleep 0.4
qdbus6 org.kde.KWin /Scripting org.kde.kwin.Scripting.unloadScript "$name" >/dev/null 2>&1
journalctl --user --since "$since" --no-pager -o cat 2>/dev/null | grep '^LOSW|' || true
