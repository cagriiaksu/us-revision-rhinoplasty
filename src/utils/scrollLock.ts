let lockedScrollY = 0;
let lockCount = 0;

export function lockBodyScroll() {
  if (lockCount === 0) {
    lockedScrollY = window.scrollY;
    const body = document.body;
    body.style.position = 'fixed';
    body.style.top = `-${lockedScrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflow = 'hidden';
  }
  lockCount++;
}

export function unlockBodyScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    const body = document.body;
    body.style.position = '';
    body.style.top = '';
    body.style.left = '';
    body.style.right = '';
    body.style.width = '';
    body.style.overflow = '';
    // Restore instantly, bypassing the page's global `scroll-behavior: smooth`.
    // A smooth (async) restore lets a follow-up lock read a mid-animation
    // scrollY and capture the wrong position — causing a jump on the next close.
    const html = document.documentElement;
    const prevBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';
    window.scrollTo(0, lockedScrollY);
    html.style.scrollBehavior = prevBehavior;
  }
}
