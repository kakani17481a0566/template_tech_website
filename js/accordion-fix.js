    (function() {
        function getNav() {
            try {
                var el = document.querySelector('.menu-data');
                return el ? JSON.parse(el.innerText || el.textContent) : null;
            } catch(e) { return null; }
        }

        function getChildren(nav, parentId) {
            if (!nav || !nav.primary_nav) return [];
            return nav.primary_nav.filter(function(item) {
                return String(item.menu_item_parent) === String(parentId);
            });
        }

        function patch() {
            var allLabels = document.querySelectorAll('label, a, span, div');
            var targetLi = null;
            
            for (var i = 0; i < allLabels.length; i++) {
                var txt = allLabels[i].textContent || "";
                if (txt.trim().toLowerCase().indexOf('how you can contribute') !== -1 && allLabels[i].children.length < 5) {
                    var parentLi = allLabels[i].closest('li');
                    if (parentLi) {
                        targetLi = parentLi;
                        break;
                    }
                }
            }

            if (!targetLi) return false;

            var panel = targetLi.querySelector('ul');
            if (!panel) return false;

            var lis = Array.prototype.slice.call(panel.querySelectorAll(':scope > li'));
            if (!lis.length) return false;

            if (panel.dataset.done) return true;
            panel.dataset.done = '1';

            var nav = getNav();
            if (!nav) return true;

            var contributeId = null;
            nav.primary_nav.forEach(function(item) {
                if (item.title.toLowerCase().indexOf('how you can contribute') !== -1) {
                    contributeId = item.ID;
                }
            });
            if (!contributeId) contributeId = 2017;

            var lvl3 = getChildren(nav, contributeId);
            if (lvl3.length === 0) return true;

            panel.querySelectorAll('input[type="checkbox"]').forEach(function(cb) {
                cb.style.cssText += ';display:none!important;position:absolute!important;opacity:0!important;';
            });

            var allSubPanels = [];
            lis.forEach(function(li, idx) {
                var jsonItem = lvl3[idx];
                if (!jsonItem) return;

                var children = getChildren(nav, jsonItem.ID);
                if (children.length === 0) return;

                var subUl = document.createElement('ul');
                subUl.style.cssText = 'max-height:0;overflow:hidden;transition:max-height 0.4s ease;list-style:none;padding:2px 0 2px 0.6em;margin:0;';
                children.forEach(function(child) {
                    var li2 = document.createElement('li');
                    var a = document.createElement('a');
                    a.href = child.url || '#';
                    a.textContent = child.title;
                    a.style.cssText = 'color:rgba(255,255,255,0.88);font-size:0.82rem;font-weight:400;padding:5px 0;border-bottom:1px solid rgba(255,255,255,0.1);display:block;text-decoration:none;';
                    li2.appendChild(a);
                    subUl.appendChild(li2);
                });

                var toggle = li.querySelector('label') || li.querySelector('a');
                if (!toggle) return;

                // CLEAN UP: Wipe out the broken Vue material icon rectangle
                toggle.innerHTML = jsonItem.title;

                var old = li.querySelector('ul');
                if (old) old.remove();
                li.appendChild(subUl);

                toggle.style.cssText = 'display:flex!important;align-items:center!important;justify-content:space-between!important;padding:7px 0!important;border-bottom:1px solid rgba(255,255,255,0.4)!important;cursor:pointer!important;font-size:0.875rem!important;font-weight:600!important;color:#fff!important;user-select:none!important;';

                var chev = document.createElement('span');
                toggle.appendChild(chev);
                chev.textContent = '▾';
                chev.style.cssText = 'font-size:14px;color:#fff;display:inline-block;transition:transform 0.3s ease;transform:rotate(0deg);margin-left:6px;flex-shrink:0;pointer-events:none;';

                allSubPanels.push({ panel: subUl, arrow: chev });

                (function(p, arrow) {
                    toggle.addEventListener('click', function(e) {
                        e.preventDefault(); e.stopPropagation();
                        var isOpen = p.style.maxHeight && p.style.maxHeight !== '0px';
                        
                        // Exclusive accordion: Close all other panels
                        allSubPanels.forEach(function(item) {
                            item.panel.style.maxHeight = '0';
                            item.arrow.style.transform = 'rotate(0deg)';
                        });

                        // Open this one if it wasn't already open
                        if (!isOpen) {
                            p.style.maxHeight = (p.scrollHeight + 300) + 'px';
                            arrow.style.transform = 'rotate(180deg)';
                        }
                    });
                })(subUl, chev);
            });

            return true;
        }

        var attempts = 0;
        var timer = setInterval(function() {
            if (patch() || ++attempts > 75) clearInterval(timer);
        }, 200);
    })();
