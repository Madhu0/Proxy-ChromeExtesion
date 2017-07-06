// chrome.browserAction.setBadgeText({
//   text: "MAD"
// });

// chrome.browserAction.setBadgeBackgroundColor({
//   color: "#b20707"
// })


function generateUrlPattern(url) {
  return '*://' + url + '/*';
}

function redirect(details){
  // console.log("Request Details", details);
  return {
    redirectUrl: 'https://www.google.co.in',
  };
}

function addTargetHeader(details){
  console.log("Before Sending Headers Request Details", details);
  const requestHeaders = details.requestHeaders || [];
  requestHeaders.push({ name: 'target', value: 'https://www.google.com' });
  return {
    requestHeaders: requestHeaders,
  };
}

function registerListeners(urls){
  if (!urls || urls.length === 0) {
    return;
  }
  const urlPatterns = urls.map(function(v, ind){ return generateUrlPattern(v); });
  chrome.webRequest.onBeforeRequest.addListener(redirect, {
    urls: urlPatterns,
  }, [
    "blocking"
  ]);

  chrome.webRequest.onBeforeSendHeaders.addListener(addTargetHeader, {
    urls: urlPatterns,
  }, [
    "blocking"
  ]);
}

chrome.storage.onChanged.addListener(function(object, area){
  if (area === 'local' && object.urlMappings) {
    chrome.webRequest.onBeforeRequest.removeListener(redirect);
    chrome.webRequest.onBeforeSendHeaders.removeListener(addTargetHeader);
    chrome.storage.local.get('urlMappings', function(object){
      registerListeners(object.urlMappings);
    });
  }
})

chrome.storage.local.get('urlMappings', function(object){
  registerListeners(object.urlMappings || []);
});

