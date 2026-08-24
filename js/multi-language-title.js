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
            var timer = null;
            var visible = false;

            function resetText() {
                container.textContent = originalText;
                container.style.opacity = '1';
                busy = false;
            }

            function stop() {
                if (timer) {
                    clearInterval(timer);
                    timer = null;
                }
            }

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
                            if (!visible) {
                                resetText();
                                return;
                            }
                            container.textContent = originalText;
                            container.style.opacity = '1';
                            busy = false;
                        }, 500);
                    }, 2500);

                }, 500);
            }

            function start() {
                if (!visible || timer) return;
                timer = setInterval(showNext, 6000);
            }

            if ('IntersectionObserver' in window) {
                var observer = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        visible = entry.isIntersecting;
                        if (visible) {
                            start();
                        } else {
                            stop();
                        }
                    });
                }, { threshold: 0 });
                observer.observe(container);
            } else {
                visible = true;
                start();
            }

            // Expose stop/start so tab visibility changes can pause cycling
            container._mltStop = stop;
            container._mltStart = start;
        });
    }

    // Pause all cycling while the tab is hidden, resume when it is visible again
    document.addEventListener('visibilitychange', function () {
        var containers = document.querySelectorAll('.multi-language-title');
        Array.prototype.forEach.call(containers, function (container) {
            if (document.hidden) {
                if (container._mltStop) container._mltStop();
            } else if (container._mltStart) {
                container._mltStart();
            }
        });
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMultiLanguageTitles);
    } else {
        initMultiLanguageTitles();
    }
})();
