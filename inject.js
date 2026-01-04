function updateKeybindsExt(keybinds) {
  if (!window.Inputs) return;
  const inputs = window.Inputs;

  const newKeybinds = {
    forwardKey: keybinds.forward?.keyCode || Phaser.KeyCode.W,
    backKey: keybinds.back?.keyCode || Phaser.KeyCode.S,
    leftKey: keybinds.left?.keyCode || Phaser.KeyCode.A,
    rightKey: keybinds.right?.keyCode || Phaser.KeyCode.D,
    fireKey: keybinds.fire?.keyCode || Phaser.KeyCode.Q,
  };
  inputs._inputSets.WASDKeys.data = newKeybinds;

  const targetId = Object.keys(inputs._playerIdInputSetId).find(
    (playerId) => inputs._playerIdInputSetId[playerId] === "WASDKeys"
  );

  if (targetId) {
    inputs._releaseInput;
    inputs.addInputManager(targetId, "WASDKeys");
  }
}
window.updateKeybindsExt = updateKeybindsExt;

window.addEventListener("message", function (event) {
  if (
    event.source !== window ||
    !event.data ||
    event.data.direction !== "from-content-script" ||
    event.data.type !== "applyStoredKeybinds"
  )
    return;

  const keybinds = event.data.keybinds;
  if (window.Inputs && window.updateKeybindsExt) updateKeybindsExt(keybinds);
});
