var c = workspace.activeWindow || workspace.activeClient;
print("ACTIVE: " + (c ? c.resourceClass + " | " + c.caption : "none"));
