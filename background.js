console.log("Background working")
var newDay = {};
var storage = [];
videoCount = 0
// chrome.browserAction.setBadgeText({text: '0'})

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    // console.log(changeInfo.url);
    const youTubeRegex = new RegExp("/*youtube.com/watch*")
    if(isUrlActiveYTVideo(changeInfo.url))
    {
        videoId = getVideoIdFromUrl(changeInfo.url);

        if(videoId){
            //save video ID
            chrome.storage.local.get(['dailyCount'], function(data){
                if (data.dailyCount){
                    //increment the count by one 
                    data.dailyCount += 1
                    chrome.storage.local.set({dailyCount: data.dailyCount})


                } 
                else {
                    //if there was no video count
                    data.dailyCount = 1
                    chrome.storage.local.set({dailyCount: 1})
                }
                chrome.browserAction.setBadgeText({text: data.dailyCount.toString()})
            })
        } 
        console.log(videoId);
        videoCount++;
        console.log("Url changed to ", changeInfo.url);
    }
})


function isUrlActiveYTVideo(url){
    //watch regex
    const youTubeWatchRegex = new RegExp("/*youtube.com/watch*");
    if(youTubeWatchRegex.exec(url)){
        return true;
    }
    return false;
}

function getVideoIdFromUrl(url){
    //works only for a striaght forward Url 
    const regex = /https\:\/\/www\.youtube\.com\/watch\?v=([\w-]{11})/;
    return url.match(regex) ? url.match(regex)[1]: null;
}

function addUpdateDateAndCountOfVideosInStorage(){
    storage.push()
}


function dateCountAvailabilityOn(date){
    return new Promise((resolve, reject) => {
        try{
            chrome.storage.local.get(['dailyCount'], function(data){
                if(data.dailyCount){
                    if(data.dailyCount[date] != undefined){
                        resolve(true)
                    }
                    else{
                        resolve(false)
                    }
                }
                else{
                    reject("No dailyCount in Storage")
                }
            })
        } catch{
            reject("Error occured when checking dateCountAvailability");
        }

    })
}

async function incrementDateCount(date){
    return new Promise((resolve, reject) => {
        try {
            const countAvailability = await dateCountAvailabilityOn(date)
            resolve(true);
            // if(countAvailability){
            //     chrome.storage.local.get(['dailyCount'], function(data){
            //         data.dailyCount[date] ++;
            //         chrome.storage.local.set({dailyCount: data.dailyCount});
            //     });
            // }
        } catch {
            reject("Error occured when incrementing count on a date");
        }
    });
}

incrementDateCount("11/6/2019");

