var ws = workspace.windowList();
for (var i = 0; i < ws.length; i++) {
  var w = ws[i];
  if (String(w.internalId) !== "{b1b011c5-9b36-49fa-ab22-a21191f2627d}") continue;
  if (w.fullScreen) w.fullScreen = false;
  w.frameGeometry = { x: Math.round((workspace.workspaceWidth - 1440)/2), y: 60, width: 1440, height: 900 };
  workspace.activeWindow = w;
  print("LOSW|SET|" + w.frameGeometry.width + "x" + w.frameGeometry.height);
}
