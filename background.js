console.log("Background working")
videoCount = 0
chrome.browserAction.setBadgeText({text: '0'})

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    // console.log(changeInfo.url);
    const youTubeRegex = new RegExp("/*youtube.com/watch*")
    if(youTubeRegex.exec(changeInfo.url))
    {
        videoCount++;
        console.log("Url changed to ", changeInfo.url);
        chrome.browserAction.setBadgeText({text: videoCount.toString()})

    }
})