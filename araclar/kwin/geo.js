var ws = workspace.windowList();
for (var i = 0; i < ws.length; i++) {
  var w = ws[i];
  if (w.normalWindow !== true) continue;
  var g = w.frameGeometry;
  print("LOSW|G|" + w.resourceClass + "|" + w.caption + "|" + Math.round(g.x) + "," + Math.round(g.y) + " " + Math.round(g.width) + "x" + Math.round(g.height));
}
