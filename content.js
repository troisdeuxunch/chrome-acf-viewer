(function () {
    "use strict";

    const BADGE_CLASS = "acf-name-revealer-badge";
    const KEY_MODIFIER = "acf-name-revealer-badge--key";
    const ENABLED_KEY = "acfNameRevealerEnabled";
    const SHOW_KEY_KEY = "acfNameRevealerShowKey";

    const DEFAULTS = {
        [ENABLED_KEY]: true,
        [SHOW_KEY_KEY]: false
    };

    let enabled = true;
    let showKey = false;
    let observer = null;

    function buildBadge(value, isKey) {
        const badge = document.createElement("span");
        badge.className = isKey ? `${BADGE_CLASS} ${KEY_MODIFIER}` : BADGE_CLASS;
        badge.textContent = isKey ? `key: ${value}` : `ACF: ${value}`;
        badge.title = "Cliquer pour copier";
        badge.setAttribute("role", "button");
        badge.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            copyToClipboard(value, badge);
        });

        return badge;
    }

    function copyToClipboard(text, badge) {
        const original = badge.textContent;
        const done = function () {
            badge.textContent = "Copié !";
            badge.classList.add(`${BADGE_CLASS}--copied`);
            setTimeout(function () {
                badge.textContent = original;
                badge.classList.remove(`${BADGE_CLASS}--copied`);
            }, 900);
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(done).catch(done);
            return;
        }

        done();
    }

    function annotateField(field) {
        const name = field.getAttribute("data-name");

        if (!name) {
            return;
        }

        if (field.closest(".acf-clone")) {
            return;
        }

        const label = field.querySelector(":scope > .acf-label > label");

        if (!label) {
            return;
        }

        if (label.querySelector(`.${BADGE_CLASS}`)) {
            return;
        }

        label.appendChild(buildBadge(name, false));

        const key = field.getAttribute("data-key");

        if (showKey && key) {
            label.appendChild(buildBadge(key, true));
        }
    }

    function annotateAll() {
        if (!enabled) {
            return;
        }

        document.querySelectorAll(".acf-field[data-name]").forEach(annotateField);
    }

    function removeAll() {
        document.querySelectorAll(`.${BADGE_CLASS}`).forEach(function (badge) {
            badge.remove();
        });
    }

    let scheduled = false;

    function scheduleAnnotate() {
        if (scheduled) {
            return;
        }

        scheduled = true;
        requestAnimationFrame(function () {
            scheduled = false;
            annotateAll();
        });
    }

    function startObserver() {
        if (observer) {
            return;
        }

        observer = new MutationObserver(scheduleAnnotate);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function stopObserver() {
        if (!observer) {
            return;
        }

        observer.disconnect();
        observer = null;
    }

    function applyState() {
        removeAll();

        if (!enabled) {
            stopObserver();
            return;
        }

        annotateAll();
        startObserver();
    }

    function init() {
        if (!chrome.storage || !chrome.storage.local) {
            applyState();
            return;
        }

        chrome.storage.local.get(DEFAULTS, function (data) {
            enabled = data[ENABLED_KEY] !== false;
            showKey = data[SHOW_KEY_KEY] === true;
            applyState();
        });

        chrome.storage.onChanged.addListener(function (changes, area) {
            if (area !== "local") {
                return;
            }

            if (!changes[ENABLED_KEY] && !changes[SHOW_KEY_KEY]) {
                return;
            }

            if (changes[ENABLED_KEY]) {
                enabled = changes[ENABLED_KEY].newValue !== false;
            }

            if (changes[SHOW_KEY_KEY]) {
                showKey = changes[SHOW_KEY_KEY].newValue === true;
            }

            applyState();
        });
    }

    init();
})();
