const script = document.createElement("script");
const scriptUrl = chrome.runtime.getURL("inject.js");
script.src = scriptUrl;

script.onload = () => {
  script.remove();
  chrome.storage.sync.get("keybinds", (data) => {
    if (data && data.keybinds) {
      window.postMessage(
        {
          direction: "from-content-script",
          type: "applyStoredKeybinds",
          keybinds: data.keybinds,
        },
        "*"
      );
    }
  });
};
document.head.appendChild(script);
