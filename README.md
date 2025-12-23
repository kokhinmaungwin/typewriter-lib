# Typewriter Ticker PRO

A lightweight, dependency-free **typewriter ticker library** with RSS / JSON feed support.  
Perfect for blogs, GitHub Pages, PWAs, and static websites.

![Typewriter Ticker Demo](demo.gif)

---

## ✨ Features

- ⌨️ Typewriter + delete animation
- 🔁 Loop & loop count control
- 📰 Blogger JSON feed support (GitHub Pages safe)
- ⚠️ RSS support (same-origin only)
- 🧍 Human-like typing speed
- ⏸ Pause on hover / tab hidden
- ♿ Respects `prefers-reduced-motion`
- 🔌 Control API (pause, resume, next)
- 🛟 Fallback text (no data / offline safe)
- 🎨 PRO CSS styling included

---

## 🚀 Quick Start (CDN)

```html
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/kokhinmaungwin/typewriter-lib/typewriter-lib.pro.css" />

<h2 id="ticker" class="tt-ticker">
  <a href="/blog">Latest blog posts</a>
</h2>

<script src="https://cdn.jsdelivr.net/gh/kokhinmaungwin/typewriter-lib/typewriter-lib.pro.js"></script>
<script>
  new TypewriterTicker(document.getElementById("ticker"), {
    source: {
      type: "json",
      url: "https://YOUR-BLOG/feeds/posts/default?alt=json",
      limit: 5
    }
  });
</script>
```
---

## 📰 Feed Support
- ✅ Blogger JSON (Recommended)
```js
source: {
  type: "json",
  url: "https://example.com/feeds/posts/default?alt=json",
  limit: 5
}
```
- ✔ Works on GitHub Pages
- ✔ No CORS issues
- ⚠ RSS (Limited)
```js
source: {
  type: "rss",
  url: "https://example.com/feeds/posts/default?alt=rss"
}
```
- RSS may fail on GitHub Pages due to CORS restrictions.

---

## ⚙️ Options
|Option |Type |Default |Description|
|-------|-----|--------|-----------|
|items  |Array|[]      |Static items|
|fallback|Array|Loading…|Used if feed fails|
|typeSpeed|Number|80|Typing speed|
|deleteSpeed|Number|40|Deleting speed|
|delay|Number|2000|Delay before delete|
|loop|Boolean|true|Loop animation|
|cursor|String|`|`|Cursor character|
|pauseOnHover|Boolean|true|Pause on hover|

---

## 🎮 Control API
```js
const ticker = new TypewriterTicker(el, options);

ticker.pause();
ticker.resume();
ticker.next();
ticker.destroy();
```
---

## ♿ Reduced Motion Support
Automatically disables animation if user prefers reduced motion.
## 📄 License
MIT © Khin Maung Win

---

## 📗 Docs Structure (docs/index.md)


# Typewriter Ticker PRO – Documentation

## 1. Installation
- CDN
- Local file

## 2. Basic Usage
- Static text
- Blog feed

## 3. Blogger JSON Example
```js
source: {
  type: "json",
  url: "https://yourblog.com/feeds/posts/default?alt=json"
}
```
## 4. Fallback Content
```js
fallback: [
  { text: "Welcome to my blog", url: "/blog" }
]
```
## 5. Styling (PRO CSS)
```css
.tt-ticker
.tt-cursor
```
Dark mode support
## 6. API Methods
```js
pause()
resume()
next()
destroy()
```
## 7. Common Issues
- RSS not working on GitHub Pages
- CORS explanation
## 8. Version History
- v1.3.0 Initial PRO
- v1.4.0 JSON + fallback + API

---

## 🧠 Pro Tips

### SEO Tip
Always include static HTML inside `.tt-ticker`
so content is visible even without JavaScript.
## 🏁 Next Suggested Steps
docs/index.html demo page
GitHub Pages live demo
NPM package (optional)
