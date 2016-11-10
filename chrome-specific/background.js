chrome.browserAction.onClicked.addListener((tab) => {
  chrome.browserAction.setPopup({
    'popup': 'popup.html'
  });
});