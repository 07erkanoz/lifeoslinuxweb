var ws = workspace.windowList();
for (var i = 0; i < ws.length; i++) {
  var w = ws[i];
  if (w.normalWindow !== true) continue;
  print("LOSW|KALAN|" + w.internalId + "|" + w.resourceClass + "|min=" + w.minimized + "|minable=" + w.minimizable);
}
