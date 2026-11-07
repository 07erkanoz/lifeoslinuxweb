var ws = workspace.windowList();
for (var i = 0; i < ws.length; i++) {
  var w = ws[i];
  if (w.normalWindow !== true) continue;
  if (w.minimized) { w.minimized = false; print("LOSW|GERI|" + w.resourceClass); }
}
