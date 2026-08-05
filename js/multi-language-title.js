(function () {
    function initMultiLanguageTitles() {
        var containers = document.querySelectorAll('.multi-language-title');
        Array.prototype.forEach.call(containers, function (container) {
            var titles = [];
            try {
                var raw = container.getAttribute('data-titles');
                if (raw) {
                    titles = JSON.parse(raw);
                }
            } catch (e) {
                return;
            }
            if (!titles.length) {
                return;
            }

            // Save the original English text
            var originalText = container.textContent.trim();

            // Lock the element's current rendered size so swapping text never
            // causes layout reflow / page shake
            var rect = container.getBoundingClientRect();
            if (rect.width > 0)  { container.style.minWidth  = rect.width  + 'px'; }
            if (rect.height > 0) { container.style.minHeight = rect.height + 'px'; }

            // Fade transition
            container.style.transition = 'opacity 0.5s ease-in-out';

            var i = 0;
            var busy = false;

            function showNext() {
                if (busy) return;
                busy = true;

                // Fade out
                container.style.opacity = '0';

                setTimeout(function () {
                    // Swap to translated text
                    container.textContent = titles[i].title;
                    i = (i + 1) % titles.length;

                    // Fade in
                    container.style.opacity = '1';

                    // After showing translation, fade back to English
                    setTimeout(function () {
                        container.style.opacity = '0';
                        setTimeout(function () {
                            container.textContent = originalText;
                            container.style.opacity = '1';
                            busy = false;
                        }, 500);
                    }, 2500);

                }, 500);
            }

            // Start cycling every 6 seconds
            setInterval(showNext, 6000);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMultiLanguageTitles);
    } else {
        initMultiLanguageTitles();
    }
})();
