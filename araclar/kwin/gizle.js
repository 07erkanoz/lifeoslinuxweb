var ws = workspace.windowList();
for (var i = 0; i < ws.length; i++) {
  var w = ws[i];
  if (w.normalWindow !== true) continue;
  if (w.minimized) continue;
  if (!w.minimizable) continue;
  w.minimized = true;
  print("LOSW|GIZLE|" + w.internalId + "|" + w.resourceClass);
}
