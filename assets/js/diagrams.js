/*
 * Turning ```mermaid fenced blocks into rendered SVG.
 *
 * Loaded only on pages that contain one — see the gate in
 * _layouts/default.html. The vendored bundle beside this file is 3.5 MB, and
 * most pages here have no diagram at all.
 *
 * WHAT KRAMDOWN ACTUALLY EMITS
 *
 * Mermaid's own auto-discovery looks for `<pre class="mermaid">`, which nothing
 * in this pipeline produces. Rouge has no `mermaid` lexer, so kramdown's
 * highlighter declines the block and it falls through to kramdown's plain
 * fallback:
 *
 *   <pre><code class="language-mermaid">graph TD; ...</code></pre>
 *
 * A `ruby` block, which Rouge does lex, comes out shaped differently:
 *
 *   <div class="language-ruby highlighter-rouge"><div class="highlight">
 *     <pre class="highlight"><code>...</code></pre></div></div>
 *
 * The second shape is what a ```mermaid block would become the day Rouge ships
 * a mermaid lexer. No Gemfile.lock is committed — see the Gemfile — so Rouge is
 * re-resolved on every CI run, and that day would arrive with no diff here to
 * explain why the diagrams stopped. Both shapes are matched; the cost is one
 * extra selector.
 *
 * RENDER, NOT RUN
 *
 * `mermaid.run({ nodes })` renders in place, overwriting each node's text with
 * the SVG built from it — which destroys the source the next render needs.
 * `mermaid.render()` takes the source as an argument and hands back a string,
 * so the source can live in `data-diagram-source` and every render, first or
 * fiftieth, is built from that same text. It also builds off-document, so a
 * theme flip swaps finished SVG for finished SVG rather than blanking the
 * diagram and refilling it.
 *
 * NO-JS AND BROKEN-DIAGRAM BEHAVIOUR ARE THE SAME BEHAVIOUR
 *
 * The code block is left in the document until a render succeeds, and only then
 * replaced. A visitor without JavaScript, one whose bundle failed to load, and
 * one looking at a diagram with a syntax error all get the same thing: the
 * diagram source, readable, as a code block.
 */
(function () {
  'use strict';

  var SOURCE_ATTR = 'data-diagram-source';

  /* Both shapes above. The second only ever matches if Rouge gains a lexer. */
  var SELECTOR = 'code.language-mermaid, .language-mermaid.highlighter-rouge code';

  var query = window.matchMedia('(prefers-color-scheme: dark)');

  /* The expression assets/js/theme.js documents as the way to read the current
     theme before the first themechange event arrives. */
  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') ||
      (query.matches ? 'dark' : 'light');
  }

  function collect() {
    var nodes = document.querySelectorAll(SELECTOR);
    var found = [];

    for (var i = 0; i < nodes.length; i++) {
      var code = nodes[i];
      /* The element to replace: the wrapper div in Rouge's shape, the <pre> in
         kramdown's. */
      var block = code.closest('.language-mermaid.highlighter-rouge') ||
        code.closest('pre');
      if (!block || !block.parentNode) continue;

      /* textContent, not innerHTML: Rouge's shape wraps the source in token
         spans, and kramdown escapes `-->` to `--&gt;` in both. */
      var source = code.textContent;
      if (!source.trim()) continue;

      var host = document.createElement('div');
      host.className = 'diagram';
      host.setAttribute(SOURCE_ATTR, source);

      found.push({ block: block, host: host, id: 'diagram-' + i, broken: false });
    }

    return found;
  }

  var diagrams = collect();
  if (!diagrams.length || typeof window.mermaid === 'undefined') return;

  var pass = 0;
  var pending = null;
  var running = false;

  function configure(theme) {
    var css = window.getComputedStyle(document.documentElement);
    window.mermaid.initialize({
      /* Auto-start would race the theme stamping in _layouts/default.html and
         paint light diagrams onto a dark page. Every render here is explicit. */
      startOnLoad: false,
      /* Left alone, mermaid writes its own "Syntax error" graphic into the
         page. This site shows the source instead. */
      suppressErrorRendering: true,
      theme: theme === 'dark' ? 'dark' : 'default',
      /* Mermaid's palette is its own, entirely separate from the stylesheet.
         This is the seam where the diagram borrows the page's. */
      themeVariables: {
        /* So diagram labels are set in the same face as the prose around them. */
        fontFamily: css.getPropertyValue('--font-body').trim(),
        /* So the SVG does not sit on a rectangle of a slightly different white. */
        background: css.getPropertyValue('--bg').trim(),
        /* Not cosmetic. Mermaid's dark theme puts its #ccc edge labels on a
           mid-grey box of its own, which measures 4.43:1 - under the 4.5:1 the
           rest of the site holds to. On the page background the same text is
           well clear of it, and the label stops looking like a sticker. */
        edgeLabelBackground: css.getPropertyValue('--bg').trim()
      }
    });
  }

  function draw(d) {
    /* A fresh id per pass. Mermaid derives the SVG's internal ids — arrowhead
       markers among them — from this one, and two copies sharing an id is how
       arrowheads go missing after a re-render. */
    return window.mermaid.render(d.id + '-' + pass, d.host.getAttribute(SOURCE_ATTR))
      .then(function (out) {
        if (!d.host.parentNode) {
          d.block.parentNode.replaceChild(d.host, d.block);
        }
        d.host.innerHTML = out.svg;
        if (typeof out.bindFunctions === 'function') {
          out.bindFunctions(d.host);
        }
      }, function () {
        /* The code block is still in the document on the pass that fails, which
           is the whole fallback. Nothing about a syntax error changes with the
           theme, so this diagram is not retried. */
        d.broken = true;
        d.block.className += (d.block.className ? ' ' : '') + 'diagram-unrendered';
      });
  }

  function renderAll(theme) {
    pass++;
    configure(theme);
    return Promise.all(diagrams.filter(function (d) { return !d.broken; }).map(draw));
  }

  /* Renders are serialised, and a burst of them collapses to its last theme.
     mermaid.render is async, and letting two passes overlap is what makes a
     diagram vanish when the toggle is pressed faster than a render finishes. */
  function request(theme) {
    pending = theme;
    if (running) return;
    running = true;

    (function next() {
      var wanted = pending;
      pending = null;
      /* Wrapped rather than called directly: mermaid.initialize and
         mermaid.render can both throw synchronously, and a throw on the way
         into the chain would leave `running` true for good — the toggle would
         keep working and the diagrams would silently stop following it. */
      Promise.resolve()
        .then(function () { return renderAll(wanted); })
        .catch(function () {})
        .then(function () {
          if (pending === null) running = false;
          else next();
        });
    })();
  }

  request(currentTheme());

  document.addEventListener('themechange', function (e) {
    request(e.detail.theme);
  });
})();
