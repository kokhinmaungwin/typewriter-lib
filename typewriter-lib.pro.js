/*!
 * Typewriter Ticker PRO
 * Version: 1.3.0
 * Author: Khin Maung Win
 * License: MIT
 */

(function () {
  "use strict";

  class TypewriterTicker {
    constructor(el, options = {}) {
      this.el = el;
      this.opts = Object.assign({
        items: [],
        typeSpeed: 80,
        deleteSpeed: 40,
        delay: 2000,
        loop: true,
        loopCount: Infinity,
        cursor: "|",
        cursorBlink: true,
        pauseOnHover: true,
        humanize: true,
        pauseWhenHidden: true,
        respectReducedMotion: true,
        source: null,
        onTypeStart: null,
        onTypeEnd: null,
        onComplete: null
      }, options);

      this.index = 0;
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

      if (this.opts.source?.type === "rss") {
        await this._loadRSS();
      }

      if (this.opts.pauseOnHover) {
        this.el.addEventListener("mouseenter", () => this.paused = true);
        this.el.addEventListener("mouseleave", () => this.paused = false);
      }

      if (this.opts.pauseWhenHidden) {
        document.addEventListener("visibilitychange", () => {
          this.paused = document.hidden;
        });
      }

      this._addCursor();
      this._tick();
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
      } catch (e) {
        console.error("RSS load failed", e);
      }
    }

    _addCursor() {
      if (!this.opts.cursor) return;
      this.cursorEl = document.createElement("span");
      this.cursorEl.textContent = this.opts.cursor;
      this.cursorEl.style.marginLeft = "4px";
      if (this.opts.cursorBlink) {
        this.cursorEl.style.animation = "tt-blink 1s infinite";
      }
      this.el.after(this.cursorEl);

      if (!document.getElementById("tt-style")) {
        const style = document.createElement("style");
        style.id = "tt-style";
        style.textContent = `
          @keyframes tt-blink {
            0%,50%,100%{opacity:1}
            25%,75%{opacity:0}
          }`;
        document.head.appendChild(style);
      }
    }

    _tick() {
      if (this.destroyed) return;
      if (this.paused) return setTimeout(() => this._tick(), 200);

      const item = this.opts.items[this.index];
      if (!item) return;

      const text = item.text;
      let output;

      if (!this.isDeleting) {
        if (this.charIndex === 0 && this.opts.onTypeStart)
          this.opts.onTypeStart(text);

        output = text.substring(0, ++this.charIndex);
      } else {
        output = text.substring(0, --this.charIndex);
      }

      this.el.textContent = output;

      let speed = this.isDeleting ? this.opts.deleteSpeed : this.opts.typeSpeed;
      if (this.opts.humanize) speed += Math.random() * 40;

      if (!this.isDeleting && this.charIndex === text.length) {
        if (item.url) {
          this.el.innerHTML =
            `<a href="${item.url}" target="_blank" rel="noopener">${text}</a>`;
        }
        if (this.opts.onTypeEnd) this.opts.onTypeEnd(text);
        speed = this.opts.delay;
        this.isDeleting = true;
      }

      if (this.isDeleting && this.charIndex === 0) {
        this.isDeleting = false;
        this.index++;

        if (this.index >= this.opts.items.length) {
          this.index = 0;
          this.loopsDone++;
          if (!this.opts.loop || this.loopsDone >= this.opts.loopCount) {
            this.opts.onComplete && this.opts.onComplete();
            return;
          }
        }
      }

      setTimeout(() => this._tick(), speed);
    }

    _renderStatic() {
      const item = this.opts.items[0];
      if (!item) return;
      this.el.innerHTML = item.url
        ? `<a href="${item.url}">${item.text}</a>`
        : item.text;
    }

    destroy() {
      this.destroyed = true;
      this.el.textContent = "";
      this.cursorEl?.remove();
    }

    restart() {
      this.destroy();
      this.destroyed = false;
      this.index = this.charIndex = this.loopsDone = 0;
      this.isDeleting = false;
      this._init();
    }
  }

  window.TypewriterTicker = TypewriterTicker;

})();
