let thresholdNode = document.getElementById("threshold");
let blocklistNode = document.getElementById("blocklist");
let responseNode = document.getElementById("response");

chrome.storage.local.get(["threshold"], ({ threshold }) => { thresholdNode.value = threshold; })
chrome.storage.local.get(["urlList"], ({ urlList }) => { blocklistNode.value = urlList.join('\n'); })
document.getElementById("submitButton").addEventListener("click", set);
document.getElementById("clearButton").addEventListener("click", clearInput);
function set() {
    let threshold = parseInt(thresholdNode.value.trim());
    let urlList = blocklistNode.value.trim().split('\n');
    responseNode.innerHTML = "Submitted!"

    chrome.storage.local.set({ threshold });
    chrome.storage.local.set({ urlList });
}
function clearInput() {
    thresholdNode.value = "";
    blocklistNode.value = "";
    responseNode.innerHTML = "";
}