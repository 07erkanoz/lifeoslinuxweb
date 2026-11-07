var ws = workspace.windowList();
for (var i = 0; i < ws.length; i++) {
  var w = ws[i];
  if (w.resourceClass !== "lifeos-ada") continue;
  if (w.fullScreen) w.fullScreen = false;
  if (w.minimized) w.minimized = false;
  w.frameGeometry = { x: 240, y: 60, width: 1440, height: 900 };
  workspace.activeWindow = w;
  print("LOSW|ADA|" + w.caption + "|" + w.frameGeometry.width + "x" + w.frameGeometry.height);
}
