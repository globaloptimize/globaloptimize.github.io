/* Progressive enhancement: every photograph remains an ordinary image link. */
(() => {
  'use strict';

  if (typeof HTMLDialogElement === 'undefined' ||
      typeof HTMLDialogElement.prototype.showModal !== 'function') return;

  const links = document.querySelectorAll('a.photo-open-v8[href]');
  if (!links.length) return;

  function localPhotograph(link) {
    try {
      const url = new URL(link.href, window.location.href);
      return url.origin === window.location.origin && /\.jpe?g$/i.test(url.pathname) ? url.href : null;
    } catch (_) {
      return null;
    }
  }

  const dialog = document.createElement('dialog');
  dialog.className = 'photo-dialog-v8';
  dialog.setAttribute('aria-labelledby', 'photo-dialog-title-v8');
  dialog.setAttribute('aria-describedby', 'photo-dialog-caption-v8');

  const title = document.createElement('h2');
  title.id = 'photo-dialog-title-v8';
  title.className = 'sr-only';
  title.textContent = 'Expanded photograph';

  const toolbar = document.createElement('div');
  toolbar.className = 'photo-dialog-toolbar-v8';
  const close = document.createElement('button');
  close.className = 'photo-dialog-close-v8';
  close.type = 'button';
  close.textContent = 'Close photo';
  close.setAttribute('autofocus', '');
  toolbar.append(close);

  const figure = document.createElement('figure');
  const photograph = document.createElement('img');
  photograph.decoding = 'async';
  const caption = document.createElement('figcaption');
  caption.id = 'photo-dialog-caption-v8';
  const captionText = document.createElement('span');
  const credit = document.createElement('span');
  credit.className = 'photo-dialog-credit-v8';
  caption.append(captionText, credit);
  figure.append(photograph, caption);
  dialog.append(title, toolbar, figure);
  document.body.append(dialog);

  let trigger = null;
  let previousOverflow = '';
  let previousOverflowPriority = '';

  links.forEach((link) => {
    if (!localPhotograph(link)) return;
    link.setAttribute('aria-haspopup', 'dialog');
    link.setAttribute('data-photo-enhanced', '');
    link.addEventListener('click', (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const source = localPhotograph(link);
      const thumbnail = link.querySelector('img');
      if (!source || !thumbnail || dialog.open) return;

      photograph.src = source;
      photograph.alt = thumbnail.alt;
      captionText.textContent = link.dataset.photoCaption || thumbnail.alt;
      credit.textContent = link.dataset.photoCredit || '';
      trigger = link;
      try {
        dialog.showModal();
      } catch (_) {
        trigger = null;
        return;
      }
      event.preventDefault();
      previousOverflow = document.documentElement.style.getPropertyValue('overflow');
      previousOverflowPriority = document.documentElement.style.getPropertyPriority('overflow');
      document.documentElement.style.setProperty('overflow', 'hidden');
    });
  });

  close.addEventListener('click', () => dialog.close());
  // The close button is this dialog's only interactive control. Keep Tab and
  // Shift+Tab on it instead of cycling through the browser's address bar.
  dialog.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    event.preventDefault();
    close.focus();
  });
  let backdropPress = false;
  function outsideDialog(event) {
    const bounds = dialog.getBoundingClientRect();
    return event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom;
  }
  dialog.addEventListener('pointerdown', (event) => {
    backdropPress = event.target === dialog && outsideDialog(event);
  });
  dialog.addEventListener('click', (event) => {
    if (backdropPress && event.target === dialog && outsideDialog(event)) dialog.close();
    backdropPress = false;
  });
  dialog.addEventListener('close', () => {
    if (previousOverflow) document.documentElement.style.setProperty('overflow', previousOverflow, previousOverflowPriority);
    else document.documentElement.style.removeProperty('overflow');
    if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    trigger = null;
    photograph.removeAttribute('src');
  });
})();
