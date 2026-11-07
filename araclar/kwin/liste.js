var ws = workspace.windowList ? workspace.windowList() : workspace.clientList();
for (var i = 0; i < ws.length; i++) {
  var w = ws[i];
  if (w.normalWindow === false) continue;
  print("LOSW|" + w.internalId + "|" + w.resourceClass + "|" + w.caption + "|" + w.frameGeometry.width + "x" + w.frameGeometry.height);
}
print("LOSW|END");
