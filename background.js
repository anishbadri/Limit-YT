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
            incrementVideoCount(new Date().toLocaleDateString()).then((result)=> {updateBadge()})
        } 
        console.log(videoId);
        // videoCount++;
        // console.log("Url changed to ", changeInfo.url);
    }
})


async function updateBadge(){
    var videoCount = await getVideoCount(new Date().toLocaleDateString());
    chrome.browserAction.setBadgeText({text: videoCount.toString()})
}


function getVideoCount(date){
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['dailyCount'], function(data){
            if(data.dailyCount[date]){
                resolve(data.dailyCount[date])
            }
            else{
                reject(0);
            }
        })
    })
}

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

function videoCountAvailabilityOn(date){
    return new Promise((resolve, reject) => {
        try{
            chrome.storage.local.get(['dailyCount'], function(data){
                if(data.dailyCount){
                    console.log(data.dailyCount[date]);
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

function incrementVideoCount(date){
    return new Promise(async (resolve, reject) => {
        try {
            const countAvailability = await videoCountAvailabilityOn(date)
            chrome.storage.local.get(['dailyCount'], function(data){
                if(countAvailability){
                    data.dailyCount[date] ++;
                }
                else{
                    data.dailyCount[date] = 1;
                }
                chrome.storage.local.set({dailyCount: data.dailyCount});
                resolve(true);
            })
        } catch(err) {
            console.log(err);
            reject("Error occured when incrementing count on a date");
        }
    });
}


// incrementDateCount("11/6/2019");

