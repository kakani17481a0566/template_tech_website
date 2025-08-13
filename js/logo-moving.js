// js/logo-moving.js
(function () {
  const DEFAULT_SPEED   = 0.6;   // px per frame
  const HOVER_PAUSE     = true;  // pause when hovering a row
  const DUPLICATE_ONCE  = true;  // duplicate children once for seamless loop
  const IMG_BG_COLOR    = "#fff";
  const IMG_PADDING_PX  = 6;     // tweak if you want breathing room
  const IMG_RADIUS_PX   = 8;     // optional rounded look

  // Respect reduced motion
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  function setX(el, x) { el.style.transform = "translate3d(" + x + "px,0,0)"; }

  // NEW: paint white background on logos via JS-only inline styles
  function paintLogoBackgrounds(root) {
    const imgs = root.querySelectorAll("img");
    imgs.forEach(img => {
      img.style.background = IMG_BG_COLOR;
      img.style.padding = IMG_PADDING_PX + "px";
      img.style.borderRadius = IMG_RADIUS_PX + "px";
      img.style.boxSizing = "border-box";
      img.style.display = "block";        // avoids weird inline gaps
      img.style.webkitUserDrag = "none";  // keeps drag from stuttering
    });
    if (imgs.length) console.log(`🎨 Applied white background to ${imgs.length} logo(s)`);
  }

  function duplicateChildren(el) {
    if (!DUPLICATE_ONCE) return;
    const kids = Array.from(el.children);
    if (!kids.length) return;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < kids.length; i++) frag.appendChild(kids[i].cloneNode(true));
    el.appendChild(frag);
    console.log(`✅ Duplicated ${kids.length} logos for seamless loop`);
  }

  // If a row has no logos, clone from the first non-empty row
  function ensureFilled(sequenceEl) {
    if (sequenceEl.children.length > 0) return true;
    const all = Array.from(document.querySelectorAll(".home-part__marquee-item"));
    const donor = all.find(n => n !== sequenceEl && n.children.length > 0);
    if (donor) {
      const clones = Array.from(donor.children).map(n => n.cloneNode(true));
      sequenceEl.append(...clones);
      console.warn(`🪄 Row was empty. Cloned ${clones.length} logos from another row.`);
      return true;
    } else {
      console.warn("⚠️ Row is empty and no donor row found. Nothing to animate in this track.");
      return false;
    }
  }

  function MarqueeTrack(wrapper) {
    console.log("🎯 Initializing marquee for wrapper:", wrapper);

    // Work on the inner sequence (one per row)
    const sequence = wrapper.querySelector(".home-part__marquee-item");
    if (!sequence) {
      console.warn("⚠️ No .home-part__marquee-item found inside wrapper");
      this.skip = true;
      return;
    }

    this.wrapper = wrapper;
    this.el = sequence;

    // Ensure content exists
    if (!ensureFilled(this.el)) {
      this.skip = true;
      return;
    }

    // NEW: paint background on originals before any duplication
    paintLogoBackgrounds(this.el);

    console.log(`🧱 Track child count: ${this.el.children.length}`);

    // Direction
    if (wrapper.classList.contains("--left")) this.dir = -1;
    else if (wrapper.classList.contains("--right")) this.dir = 1;
    else {
      const d = (wrapper.dataset.direction || "").toLowerCase();
      this.dir = d === "right" ? 1 : -1;
    }
    console.log(`➡ Direction for this track: ${this.dir === 1 ? "RIGHT" : "LEFT"}`);

    // Speed
    const ds = Number(wrapper.dataset.speed);
    this.speed = Number.isFinite(ds) && ds > 0 ? ds : DEFAULT_SPEED;
    console.log(`⚡ Speed for this track: ${this.speed}`);

    this.paused = false;
    this.pos = 0;

    // Build seamless loop
    duplicateChildren(this.el);

    // NEW: paint background on clones too
    paintLogoBackgrounds(this.el);

    this.half = this.el.scrollWidth / 2;
    console.log(`📏 Original sequence width: ${this.half * 2}px, half: ${this.half}px`);

    // Offset right-moving rows
    if (this.dir === 1) {
      this.pos = -this.half;
      setX(this.el, this.pos);
    }

    // Hover pause
    if (HOVER_PAUSE) {
      wrapper.addEventListener("mouseenter", () => { this.paused = true; console.log("⏸ Paused on hover"); });
      wrapper.addEventListener("mouseleave", () => { this.paused = false; console.log("▶ Resumed after hover"); });
    }

    // Resize handling
    const onResize = () => {
      const oldHalf = this.half || 1;
      this.half = this.el.scrollWidth / 2;
      if (this.half <= 0) this.half = oldHalf;
      const ratio = this.half / oldHalf;
      this.pos *= ratio;
      this.normalize();
      setX(this.el, this.pos);
      console.log(`📐 Resized: new half=${this.half}, adjusted position=${this.pos}`);
    };

    if (typeof ResizeObserver !== "undefined") {
      this.ro = new ResizeObserver(onResize);
      this.ro.observe(this.el);
    } else {
      this._resizeHandler = () => {
        clearTimeout(this._resizeTO);
        this._resizeTO = setTimeout(onResize, 100);
      };
      window.addEventListener("resize", this._resizeHandler);
    }
  }

  MarqueeTrack.prototype.normalize = function () {
    if (this.dir === -1) {
      while (this.pos <= -this.half) this.pos += this.half;
    } else {
      while (this.pos >= 0) this.pos -= this.half;
    }
  };

  MarqueeTrack.prototype.step = function () {
    if (this.skip || this.paused || !this.half) return;
    this.pos += this.speed * this.dir;
    this.normalize();
    setX(this.el, this.pos);
  };

  MarqueeTrack.prototype.destroy = function () {
    if (this.ro) this.ro.disconnect();
    if (this._resizeHandler) window.removeEventListener("resize", this._resizeHandler);
  };

  const tracks = [];
  let running = false;

  function tick() {
    if (!running) return;
    for (let i = 0; i < tracks.length; i++) tracks[i].step();
    requestAnimationFrame(tick);
  }

  function start() {
    if (running) return;
    running = true;
    console.log("🏁 Marquee animation started");
    requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    console.log("🛑 Marquee animation stopped");
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop(); else start();
  });

  window.LogoMarquee = {
    start,
    stop,
    destroyAll() {
      for (let i = 0; i < tracks.length; i++) tracks[i].destroy();
      tracks.length = 0;
      stop();
    }
  };

  // Start AFTER images are loaded
  window.addEventListener("load", function () {
    const wrappers = document.querySelectorAll(".home-part__marquee-wrapper");
    console.log(`🔍 Found ${wrappers.length} marquee wrapper(s)`);
    if (!wrappers.length) return;

    wrappers.forEach((w, idx) => {
      const seq = w.querySelector(".home-part__marquee-item");
      const count = seq ? seq.children.length : 0;
      console.log(`📦 Before init, row ${idx + 1} child count: ${count}`);
      const track = new MarqueeTrack(w);
      if (!track.skip) {
        tracks.push(track);
      } else {
        console.warn(`🚫 Skipping row ${idx + 1}: no content to animate.`);
      }
    });

    start();
  });
})();
