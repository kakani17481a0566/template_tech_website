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
            var i = 0;
            container.style.transition = 'opacity 1.5s ease-in-out';
            setInterval(function () {
                container.style.opacity = '0';
                setTimeout(function () {
                    container.textContent = titles[i].title;
                    i = (i + 1) % titles.length;
                    container.style.opacity = '1';
                }, 1500);
            }, 5500);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMultiLanguageTitles);
    } else {
        initMultiLanguageTitles();
    }
})();
