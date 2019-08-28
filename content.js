//Creating Elements
// var btn = document.createElement("BUTTON")
// var t = document.createTextNode("CLICK ME");
// btn.appendChild(t);
// //Appending to DOM
// document.body.appendChild(btn);

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
  const friendsOnly = true;
  const hidePostsBeyondDay = false;
  const hideViralPosts = false;
  const hideComments = true;

  // If the received message has the expected format...
  if (msg.text === 'fetchTimeline') {
    console.log("Fetching HTML...");
    // Call the specified callback, passing
    // the web-page's DOM content as argument
    // sendResponse(document.all[0].outerHTML);
    const postElements = document.querySelector('*[role^="feed"]').querySelectorAll('*[data-timestamp]');
    const currentSeconds = Date.now() / 1000;
    const posts = [];
    postElements.forEach(el => {
      const post = {
        timestamp: parseInt(el.dataset.timestamp, 10)
      };
      const titleEl = el.querySelector('a[title]');
      if (titleEl && titleEl.title.toLowerCase() !== 'leave a comment') {
        post.profileName = titleEl.title;
      }
      if (friendsOnly) {
        if(post.profileName) {
          posts.push(post);
        }
      } else {
        posts.push(post);
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

    const sortedPosts = [...posts].sort(function(a, b){return a.timestamp-b.timestamp});
    const timelineEl = document.createElement('div');
    const nameToColor = {};
    timelineEl.style.cssText = "width:100%;height:50px;background:beige;display:grid";
    posts.forEach((post, i) => {
      const time = post.timestamp;
      const postElement = document.createElement('span');
      const diff = currentSeconds-sortedPosts[0].timestamp;
      const position = (currentSeconds-time)/diff*100;
      let profileName = '';
      if (post.profileName) {
        profileName = post.profileName;
        let color = nameToColor[profileName];
        if (!color) {
          color = `rgb(128,${Math.random()*255},${Math.random()*255})`;
          nameToColor[profileName] = color;
        }
        postElement.style.cssText = `width:10px;height:15px;position:absolute;background-color:${color};right:${position}%`;
      } else {
        postElement.style.cssText = `width:5px;height:50px;position:absolute;background-color:blue;right:${position}%`;
      }

      const date = new Date(0);
      date.setUTCSeconds(time);
      postElement.textContent=`${i+1}: ${date.toLocaleDateString()} ${profileName}`;
      timelineEl.appendChild(postElement);
    });

    document.getElementById("contentCol").prepend(timelineEl);

    sendResponse(document.body.outerHTML);
    // sendResponse({msg: "testing 1, 2, 3"});
  }
});
