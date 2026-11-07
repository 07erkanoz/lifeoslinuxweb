var ws = workspace.windowList();
for (var i = 0; i < ws.length; i++) {
  var w = ws[i];
  if (w.resourceClass !== "lifeos-ada") continue;
  w.frameGeometry = { x: 0, y: 0, width: 1920, height: 660 };
  print("LOSW|ADAGERI|" + w.frameGeometry.width + "x" + w.frameGeometry.height);
}
