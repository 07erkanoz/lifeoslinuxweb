var ws = workspace.windowList();
for (var i = 0; i < ws.length; i++) {
  var w = ws[i];
  if (w.resourceClass !== "tr.com.lifeos.Hesap") continue;
  if (w.minimized) w.minimized = false;
  workspace.activeWindow = w;
  print("LOSW|AKTIF|" + w.resourceClass);
}
