function redact() {
  const redactEl = document.createElement('div');
  redactEl.style.cssText = 'width:100%;height:100%;background-color:black;z-index:500;position:absolute;';

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

// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  const hidePostsBeyondDay = true;
  const hideViralPosts = false;
  const hideComments = false;

  // If the received message has the expected format...
  if (msg.text === 'fetchTimeline') {
    const postElements = document.querySelector('*[role^="feed"]').querySelectorAll('*[data-timestamp]');
    const currentSeconds = Date.now() / 1000;
    postElements.forEach(el => {
      const post = {
        timestamp: parseInt(el.dataset.timestamp, 10)
      };
      const titleEl = el.querySelector('a[title]');
      if (titleEl && titleEl.title.toLowerCase() !== 'leave a comment') {
        post.profileName = titleEl.title;
      }
      if (hidePostsBeyondDay && (currentSeconds-post.timestamp > 86400) ) {
        el.prepend(redact());
      }

      if (hideViralPosts) {
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
      }
    });

    if (hideComments) {
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
