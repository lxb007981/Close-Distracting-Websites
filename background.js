const SCANNING_INTERVAL = 2;
let threshold = 10;
let urlList = ['https://www.bilibili.com/*', 'https://www.youtube.com/*', 'https://www.zhihu.com/*'];
chrome.storage.local.get(["threshold"], (object) => {
  if (!('threshold' in object)) {
    chrome.storage.local.set({ threshold });
    chrome.storage.local.set({ urlList });
    console.log(`Block list: ${urlList}. Threshold: ${threshold}`);
  }
})

chrome.storage.onChanged.addListener(async () => {
  let destroyer = await chrome.alarms.get("destroyer");
  if (destroyer != null) {
    let [_, object] = await Promise.all([chrome.alarms.clear(destroyer.name), chrome.storage.local.get(["urlList", "threshold"])]);
    let tabs = await chrome.tabs.query({ url: object.urlList });
    if (tabs.length !== 0) {
      chrome.alarms.create("destroyer", { delayInMinutes: object.threshold });
      console.log(`Destroy in ${object.threshold} minutes`);
    }
  }
});

chrome.alarms.get("scanner", (scanner) => {
  if (scanner == null) {
    chrome.storage.local.get(["threshold"], (object) => {
      chrome.alarms.create("scanner", { delayInMinutes: object.threshold, periodInMinutes: SCANNING_INTERVAL });
    });
  }
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "scanner") {
    let destroyer = await chrome.alarms.get("destroyer");
    if (destroyer == null) {
      let getValue = await chrome.storage.local.get(["threshold", "urlList"]);
      let newThreshold = getValue.threshold, newUrlList = getValue.urlList;
      scanTabs(newThreshold, newUrlList);
    }
  }
  else {//alarm.name==="destroyer"
    let getValue = await chrome.storage.local.get(["urlList"]);
    let tabsToDestroyed = await chrome.tabs.query({ url: getValue.urlList });
    chrome.tabs.remove(tabsToDestroyed.map(tab => tab.id));
  }
});

async function scanTabs(threshold, urlList) {
  console.log("Scanning tabs...")
  let tabs = await chrome.tabs.query({ url: urlList });
  if (tabs.length !== 0) {
    chrome.alarms.create("destroyer", { delayInMinutes: threshold });
    console.log(`Destroy in ${threshold} minutes`);
  }
}
