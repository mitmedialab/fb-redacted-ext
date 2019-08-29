function redact() {
  const redactEl = document.createElement('div');
  redactEl.style.cssText = 'width:100%;height:100%;background-color:black;z-index:500;position:absolute;';
  redactEl.dataset.redacted = true;

  const words = [
    'Nope!',
    'Nada...',
    ':)',
    'Bye, now!',
    '🤫',
    '🤭',
    '👎',
    '👊',
    'Why not read a book?',
    'Affirmative visions of social media.',
    'Take control of your feed'];
  const wordEl = document.createElement('div');
  wordEl.textContent = words[Math.floor(Math.random()*words.length)];
  wordEl.style.cssText = 'color: white; width: 100%; text-align: center; top: 40%; position: absolute; font-size: 50px;';
  redactEl.prepend(wordEl);
  return redactEl;
}

function hideStalePosts(postElements) {
  const currentSeconds = Date.now() / 1000;
  postElements.forEach(el => {
    if (!el.firstChild.dataset.redacted) {
      const postTimestamp = parseInt(el.dataset.timestamp, 10);
      const secondsInDay = 86400;
      if (currentSeconds-postTimestamp > secondsInDay) {
        el.prepend(redact());
      }
    }
  });
}

function hideViralPosts(postElements) {
  postElements.forEach(el => {
    const reactedEl = el.querySelector('*[aria-label="See who reacted to this"]');
    let count = "";
    if (reactedEl) {
      count = reactedEl.textContent;
      if (count.length === 0) {
        const nextSibling = reactedEl.nextSibling;
        if (nextSibling) {
          const tooltipEl = nextSibling.querySelector('*[aria-hidden=true]');
          if (tooltipEl) {
            count = tooltipEl.textContent;
          }
        }
      }
    }
    if (count && (count.indexOf('M') > 0 || count.indexOf('K') > 0 || parseInt(count, 10) > 10)) {
      el.prepend(redact());
    }
  });
}

// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  const HIDE_STALE_POSTS = 'HIDE_STALE_POSTS';
  const HIDE_VIRAL_POSTS = 'HIDE_VIRAL_POSTS';
  const HIDE_COMMENTS = 'HIDE_COMMENTS';
  const mode = HIDE_STALE_POSTS;

  if (msg.text === 'fetchTimeline') {
    const postElements = document.querySelector('*[role^="feed"]').querySelectorAll('*[data-timestamp]');
    if (mode === HIDE_STALE_POSTS) {
      hideStalePosts(postElements);
    } else if (mode === HIDE_VIRAL_POSTS) {
      hideViralPosts(postElements);
    } else if (mode === HIDE_COMMENTS) {
      // TODO: this needs work
      document.querySelector('*[role^="feed"]').querySelectorAll('.commentable_item').forEach(el => {
        while (el.firstChild) {
          el.removeChild(el.firstChild);
        }
        el.prepend(redact());
        // el.style.cssText = 'display:none;'
      });
    }
  }
});
