chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'www.facebook.com'},
      })
      ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

// When the browser-action button is clicked...
chrome.pageAction.onClicked.addListener(function (tab) {
  // ...if it matches, send a message specifying a callback too
  console.log("Sending message to fetch timeline...");
  chrome.tabs.sendMessage(tab.id, {text: 'fetchTimeline'});
});
// });

chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
  console.log('sending message?');
  chrome.tabs.sendMessage(tabs[0].id, {action: "fetchTimeline"}, function(response) {
    console.log('got a response...');
    console.log(response);
  });
});

//Get message from content script
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        //Alert the message
        alert('The message from the content script: ' + request.method);//You have to choose which part of the response you want to display ie. request.method
        //Construct & send a response
        sendResponse({
            response: "Message received"
        });
    }
);
