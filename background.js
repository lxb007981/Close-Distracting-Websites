let threshold = 1000 * 60 * 20;
let urlList = ['https://www.bilibili.com/*', 'https://www.youtube.com/*', 'https://www.zhihu.com/*']
console.log(`Block list: ${urlList}. Threshold: ${threshold}`);

let timer = null;
chrome.runtime.onMessage.addListener(
  function(request, _sender, sendResponse) {
    if ('threshold' in request){
      threshold = request.threshold;
      urlList = request.urlList;
      console.log(`Updated block list: ${urlList} and threshold: ${threshold}`);  
    } else {
      sendResponse({threshold: parseInt(threshold/1000/60), urlList: urlList});
    }
  }
);

setInterval(async () => {
  if (timer === null) {
    let tabs = await chrome.tabs.query({ url: urlList });
    if (tabs.length !== 0) {
      timer = setTimeout((async () => {
        let tabsToDestroyed = await chrome.tabs.query({ url: urlList });
        await chrome.tabs.remove(tabsToDestroyed.map(tab => tab.id));
      }), threshold);
    }

  }
}, 1000 * 60 * 5)