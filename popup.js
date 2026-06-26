(function () {
    "use strict";

    const ENABLED_KEY = "acfNameRevealerEnabled";
    const SHOW_KEY_KEY = "acfNameRevealerShowKey";

    const enabledToggle = document.getElementById("toggle-enabled");
    const keyToggle = document.getElementById("toggle-key");

    chrome.storage.local.get(
        { [ENABLED_KEY]: true, [SHOW_KEY_KEY]: false },
        function (data) {
            enabledToggle.checked = data[ENABLED_KEY] !== false;
            keyToggle.checked = data[SHOW_KEY_KEY] === true;
        }
    );

    enabledToggle.addEventListener("change", function () {
        chrome.storage.local.set({ [ENABLED_KEY]: enabledToggle.checked });
    });

    keyToggle.addEventListener("change", function () {
        chrome.storage.local.set({ [SHOW_KEY_KEY]: keyToggle.checked });
    });
})();
