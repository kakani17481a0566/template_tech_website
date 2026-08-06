(function () {
    'use strict';

    var menuEl = document.getElementById('menu');
    var vueManaged = !!(menuEl && menuEl.__vue__);

    function topLevelLinks() {
        return document.querySelectorAll('header.main-header nav > ul > li > a');
    }

    function hasChild(li) {
        return !!(li && li.querySelector(':scope > ul.child'));
    }

    function removeClassAll(list, cls) {
        for (var i = 0; i < list.length; i++) {
            list[i].classList.remove(cls);
        }
    }

    // Clears the .active state that reveals submenus on mobile, so the menu
    // folds closed after a link click.
    function clearActive() {
        removeClassAll(topLevelLinks(), 'active');

        // If the theme's Vue app owns the menu, reset its internal open item too
        // so the class is not restored on the next render.
        var menu = document.getElementById('menu');
        if (menu && menu.__vue__) {
            (function walk(v) {
                if (!v) return;
                if (Object.prototype.hasOwnProperty.call(v.$data || {}, 'activeItem')) {
                    v.activeItem = null;
                }
                if (v.$children) {
                    for (var i = 0; i < v.$children.length; i++) {
                        walk(v.$children[i]);
                    }
                }
            })(menu.__vue__);
        }
    }

    function unsuppressAll() {
        var lis = document.querySelectorAll('header.main-header nav > ul > li.first-level-item.nav-suppressed');
        for (var i = 0; i < lis.length; i++) {
            lis[i].classList.remove('nav-suppressed');
        }
    }

    function getTopLevel(a) {
        var node = a && a.parentElement;
        while (node && node !== document.body) {
            if (node.classList && node.classList.contains('first-level-item')) {
                return node;
            }
            node = node.parentElement;
        }
        return null;
    }

    document.addEventListener('click', function (e) {
        var target = e.target;
        var a = target && target.closest ? target.closest('a') : null;
        if (!a) return;
        var nav = a.closest('header.main-header nav');
        if (!nav) return;

        var li = a.parentElement && a.parentElement.classList.contains('first-level-item')
            ? a.parentElement
            : null;

        if (li) {
            // Top-level item. When the theme's Vue app renders the menu it owns
            // this toggle, so only act when the static menu is in use.
            if (!vueManaged && hasChild(li)) {
                e.preventDefault();
                var wasOpen = a.classList.contains('active');
                unsuppressAll();
                clearActive();
                if (!wasOpen) {
                    a.classList.add('active');
                }
            }
            return;
        }

        // Deeper link: let the navigation/scroll proceed, then close the menu.
        unsuppressAll();
        clearActive();
        var parent = getTopLevel(a);
        if (parent) {
            parent.classList.add('nav-suppressed');
        }
    });

    // Clear the suppressed state on the next hover of any top-level item so the
    // submenu can open again normally. Delegated on document so it also works
    // after the theme's Vue app re-renders the menu.
    document.addEventListener('mouseenter', function (e) {
        var t = e.target;
        if (!t || !t.closest) return;
        if (!t.closest('header.main-header nav')) return;
        var li = t.closest('li.first-level-item');
        if (li) {
            unsuppressAll();
        }
    }, true);
})();
