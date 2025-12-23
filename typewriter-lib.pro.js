(function () {
  "use strict";

  class TypewriterTicker {
    constructor(el, options = {}) {
      if (!el) throw new Error("TypewriterTicker: element required");

      this.el = el;
      this.opts = Object.assign({
        items: [],
        fallback: [{ text: "Loading...", url: "" }],
        typeSpeed: 80,
        deleteSpeed: 40,
        delay: 2000,
        loop: true,
        loopCount: Infinity,
        startIndex: 0,
        maxLength: null,
        linkTarget: "_blank",
        cursor: "|",
        cursorBlink: true,
        pauseOnHover: true,
        humanize: true,
        pauseWhenHidden: true,
        respectReducedMotion: true,
        silentFail: true,
        source: null,
        beforeType: null,
        onTypeStart: null,
        onTypeEnd: null,
        onComplete: null
      }, options);

      this.index = this.opts.startIndex || 0;
      this.charIndex = 0;
      this.isDeleting = false;
      this.loopsDone = 0;
      this.paused = false;
      this.destroyed = false;

      this._init();
    }

    async _init() {
      if (this.opts.respectReducedMotion &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        this._renderStatic();
        return;
      }

      if (this.opts.source) {
        await this._loadSource();
      }

      if (!this.opts.items.length) {
        this.opts.items = this.opts.fallback;
      }

      if (this.opts.pauseOnHover) {
        this.el.addEventListener("mouseenter", () => this.pause());
        this.el.addEventListener("mouseleave", () => this.resume());
      }

      if (this.opts.pauseWhenHidden) {
        document.addEventListener("visibilitychange", () => {
          this.paused = document.hidden;
        });
      }

      this._addCursor();
      this._tick();
    }

    async _loadSource() {
      try {
        if (this.opts.source.type === "json") await this._loadJSON();
        if (this.opts.source.type === "rss") await this._loadRSS();
      } catch (e) {
        if (!this.opts.silentFail) console.warn(e);
      }
    }

    async _loadJSON() {
      try {
        const res = await fetch(this.opts.source.url);
        const data = await res.json();
        const entries = data.feed?.entry || [];

        this.opts.items = entries
          .slice(0, this.opts.source.limit || 5)
          .map(e => ({
            text: e.title.$t,
            url: e.link.find(l => l.rel === "alternate")?.href || ""
          }));
      } catch {
        if (!this.opts.silentFail)
          console.warn("JSON load failed, using fallback");
      }
    }

    async _loadRSS() {
      try {
        const res = await fetch(this.opts.source.url);
        const txt = await res.text();
        const xml = new DOMParser().parseFromString(txt, "text/xml");

        this.opts.items = [...xml.querySelectorAll("item")]
          .slice(0, this.opts.source.limit || 5)
          .map(i => ({
            text: i.querySelector("title")?.textContent || "",
            url: i.querySelector("link")?.textContent || ""
          }));
      } catch {
        if (!this.opts.silentFail)
          console.warn("RSS load failed, using fallback");
      }
    }

    _addCursor() {
      if (!this.opts.cursor) return;

      this.textNode = document.createElement("span");
      this.cursorEl = document.createElement("span");

      this.cursorEl.className = "tt-cursor";
      this.cursorEl.textContent = this.opts.cursor;

      this.el.innerHTML = "";
      this.el.appendChild(this.textNode);
      this.el.appendChild(this.cursorEl);

      if (this.opts.cursorBlink && !document.getElementById("tt-style")) {
        const style = document.createElement("style");
        style.id = "tt-style";
        style.textContent = `
          @keyframes tt-blink {
            0%,50%,100%{opacity:1}
            25%,75%{opacity:0}
          }
          .tt-cursor {
            animation: tt-blink 1s infinite;
            margin-left:4px;
            user-select:none;
          }`;
        document.head.appendChild(style);
      }
    }

    _prepareText(text) {
      if (this.opts.beforeType) {
        text = this.opts.beforeType(text, this.index);
      }
      if (this.opts.maxLength && text.length > this.opts.maxLength) {
        text = text.slice(0, this.opts.maxLength) + "...";
      }
      return text;
    }

    _tick() {
      if (this.destroyed) return;
      if (this.paused) return setTimeout(() => this._tick(), 200);

      const item = this.opts.items[this.index];
      if (!item) return;

      const text = this._prepareText(item.text);

      if (!this.isDeleting) {
        if (this.charIndex === 0 && this.opts.onTypeStart)
          this.opts.onTypeStart(text);

        this.textNode.textContent = text.slice(0, ++this.charIndex);
      } else {
        this.textNode.textContent = text.slice(0, --this.charIndex);
      }

      let speed = this.isDeleting ? this.opts.deleteSpeed : this.opts.typeSpeed;
      if (this.opts.humanize) speed += Math.random() * 40;

      if (!this.isDeleting && this.charIndex === text.length) {
        if (item.url) {
          this.textNode.innerHTML =
            `<a href="${item.url}" target="${this.opts.linkTarget}" rel="noopener">${text}</a>`;
        }
        if (this.opts.onTypeEnd) this.opts.onTypeEnd(text);
        speed = this.opts.delay;
        this.isDeleting = true;
      }

      if (this.isDeleting && this.charIndex === 0) {
        this.isDeleting = false;
        this.index = (this.index + 1) % this.opts.items.length;
      }

      setTimeout(() => this._tick(), speed);
    }

    _renderStatic() {
      const item = this.opts.items[0] || this.opts.fallback[0];
      this.el.innerHTML = item.url
        ? `<a href="${item.url}" target="${this.opts.linkTarget}">${item.text}</a>`
        : item.text;
    }

    pause() { this.paused = true; }
    resume() { this.paused = false; }
    next() {
      this.charIndex = 0;
      this.isDeleting = false;
      this.index = (this.index + 1) % this.opts.items.length;
    }
    destroy() {
      this.destroyed = true;
      this.el.innerHTML = "";
      this.cursorEl?.remove();
    }
  }

  window.TypewriterTicker = TypewriterTicker;
})();
