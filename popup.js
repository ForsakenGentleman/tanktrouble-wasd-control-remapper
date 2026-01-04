let selectedKey = null;
let keybinds = {};

chrome.storage.sync.get("keybinds", (data) => {
  keybinds = (data && data.keybinds) || {};
  if (data && data.keybinds) {
    document.querySelectorAll(".key").forEach((key) => {
      const action = key.dataset.action;
      if (data.keybinds[action]) {
        const binding = data.keybinds[action];
        const displayKey = binding.key;
        key.querySelector("span:not(.label)").textContent = displayKey.toUpperCase();
      }
    });
  }
});

document.querySelectorAll(".key").forEach((key) => {
  key.addEventListener("click", () => {
    document.querySelectorAll(".key").forEach((k) => k.classList.remove("active"));
    key.classList.add("active");
    selectedKey = key;
  });
});

document.addEventListener("keydown", async (e) => {
  if (!selectedKey) return;
  e.preventDefault();

  const action = selectedKey.dataset.action;
  const duplicateAction = Object.keys(keybinds).find(
    (existingAction) => existingAction !== action && keybinds[existingAction]?.keyCode === e.keyCode
  );

  if (duplicateAction) {
    selectedKey.classList.remove("active");
    selectedKey = null;
    return;
  }
  selectedKey.querySelector("span:not(.label)").textContent = e.key.toUpperCase();
  selectedKey.classList.remove("active");

  keybinds[action] = {
    key: e.key,
    keyCode: e.keyCode,
  };
  await chrome.storage.sync.set({ keybinds: keybinds });

  injectKeybinds(keybinds);
  selectedKey = null;
});

function injectKeybinds(keybinds) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      world: "MAIN",
      func: (binds) => {
        if (!window.updateKeybindsExt) return;
        window.updateKeybindsExt(binds);
      },
      args: [keybinds],
    });
  });
}
