/*
 * The half of dark mode that can wait for the page to parse: cycling the
 * setting, persisting it, and announcing it.
 *
 * The half that cannot is the inline script in _layouts/default.html, which
 * stamps data-theme before the stylesheet loads. Nothing here runs early enough
 * to prevent a flash, and nothing here should try.
 *
 * Three states, not two. `light` and `dark` are stored; the third is the
 * absence of a stored value, meaning "follow the OS". A two-state toggle would
 * strand a visitor outside OS-following the first time they touched it, with no
 * way back.
 *
 * The seam for #11 (Mermaid) is the `themechange` event dispatched below:
 *
 *   document.addEventListener('themechange', function (e) {
 *     e.detail.theme;       // 'light' | 'dark' - always resolved, never 'system'
 *     e.detail.preference;  // 'light' | 'dark' | 'system' - what the visitor set
 *   });
 *
 * detail.theme is resolved rather than passed through, because in the unset
 * state a diagram still has to be drawn in one concrete palette. The current
 * theme before the first event is the same expression this file uses:
 *
 *   document.documentElement.getAttribute('data-theme') ||
 *     (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'theme';
  /* The cycle order the button walks, starting from whatever is current. */
  var ORDER = ['light', 'dark', 'system'];
  var LABELS = { light: 'Light', dark: 'Dark', system: 'System' };
  /* Spoken, not seen: what the next press does. "System" on its own reads as a
     status readout rather than a control. */
  var NEXT = { light: 'light', dark: 'dark', system: 'the system setting' };

  var root = document.documentElement;
  var query = window.matchMedia('(prefers-color-scheme: dark)');
  var button = document.querySelector('[data-theme-toggle]');
  var label = document.querySelector('[data-theme-toggle-label]');
  var next = document.querySelector('[data-theme-toggle-next]');

  /* Reading and writing are both wrapped: storage access throws where site data
     is blocked, rather than returning null, and an uncaught throw here would
     take the toggle down with it. */
  function readPreference() {
    var stored;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return 'system';
    }
    return stored === 'light' || stored === 'dark' ? stored : 'system';
  }

  function writePreference(preference) {
    try {
      if (preference === 'system') {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, preference);
      }
    } catch (e) {
      /* The choice applies to this page; it just will not survive a reload. */
    }
  }

  function resolve(preference) {
    if (preference === 'system') {
      return query.matches ? 'dark' : 'light';
    }
    return preference;
  }

  function announce(preference) {
    document.dispatchEvent(
      new CustomEvent('themechange', {
        detail: { theme: resolve(preference), preference: preference }
      })
    );
  }

  function advance(preference) {
    return ORDER[(ORDER.indexOf(preference) + 1) % ORDER.length];
  }

  function render(preference) {
    if (label) {
      label.textContent = LABELS[preference];
    }
    if (next) {
      next.textContent = '. Activate for ' + NEXT[advance(preference)] + '.';
    }
  }

  function apply(preference) {
    if (preference === 'system') {
      /* Removing the attribute, rather than writing the resolved theme, is what
         hands the page back to the media query in style.css - including later
         OS changes with the page still open. */
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', preference);
    }
    writePreference(preference);
    render(preference);
    announce(preference);
  }

  /* The inline script has already stamped the attribute, so the initial pass
     only catches the button up. Firing themechange here would report a change
     that never happened, and #11 reads the current theme directly instead. */
  var preference = readPreference();
  render(preference);

  /* The cycle advances from the variable, not from a re-read: where storage is
     blocked the write is a no-op, and reading back would return "system" every
     time and pin the button to the first step of the cycle. */
  if (button) {
    button.addEventListener('click', function () {
      preference = advance(preference);
      apply(preference);
    });
  }

  /* The OS flipping at sunset while the page sits open. Only meaningful in the
     unset state - an explicit choice already outranks the OS, and re-announcing
     would tell #11 to redraw for a change it should ignore. */
  function onSystemChange() {
    if (preference === 'system') {
      announce(preference);
    }
  }

  if (typeof query.addEventListener === 'function') {
    query.addEventListener('change', onSystemChange);
  } else if (typeof query.addListener === 'function') {
    /* Safari below 14. */
    query.addListener(onSystemChange);
  }
})();
