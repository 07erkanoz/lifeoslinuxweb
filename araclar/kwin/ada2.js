var ws = workspace.windowList();
for (var i = 0; i < ws.length; i++) {
  var w = ws[i];
  if (w.resourceClass !== "lifeos-ada") continue;
  print("LOSW|ADA|caption=" + w.caption + "|normal=" + w.normalWindow + "|dock=" + w.dock + "|accept=" + w.wantsInput + "|min=" + w.minimized + "|geo=" + w.frameGeometry.width + "x" + w.frameGeometry.height + "|hidden=" + w.hidden);
}
var a = workspace.activeWindow;
print("LOSW|AKTIF|" + (a ? a.resourceClass : "yok"));
