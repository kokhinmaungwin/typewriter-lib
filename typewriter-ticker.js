class TypewriterTicker {
  constructor(el, options = {}) {
    this.el = el;
    this.items = options.items || [];
    this.typeSpeed = options.typeSpeed || 80;
    this.deleteSpeed = options.deleteSpeed || 50;
    this.delay = options.delay || 2000;

    this.index = 0;
    this.charIndex = 0;
    this.isDeleting = false;

    this.tick();
  }

  tick() {
    const item = this.items[this.index];
    const text = item.text;

    let output = this.isDeleting
      ? text.substring(0, this.charIndex--)
      : text.substring(0, this.charIndex++);

    this.el.textContent = output;

    let speed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

    if (!this.isDeleting && this.charIndex === text.length) {
      speed = this.delay;

      if (item.url) {
        this.el.innerHTML =
          `<a href="${item.url}" target="_blank" rel="noopener">${text}</a>`;
      }

      this.isDeleting = true;
    }

    if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.index = (this.index + 1) % this.items.length;
    }

    setTimeout(() => this.tick(), speed);
  }
}
