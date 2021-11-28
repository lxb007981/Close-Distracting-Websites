let thresholdNode = document.getElementById("threshold");
let blocklistNode = document.getElementById("blocklist");
let responseNode = document.getElementById("response");
chrome.runtime.sendMessage({},(response)=>{
    let threshold = response.threshold;
    let urlList = response.urlList;
    thresholdNode.value = threshold;
    blocklistNode.value = urlList.join('\n');
});
document.getElementById("submitButton").addEventListener("click", set);
document.getElementById("clearButton").addEventListener("click", clearInput);
function set() {
    let threshold = thresholdNode.value.trim();
    let urlList = blocklistNode.value.trim().split('\n');
    responseNode.innerHTML = "Submitted!"
    try {
        chrome.runtime.sendMessage({threshold: parseInt(threshold)*60*1000, urlList: urlList});
    } catch (error) {
        console.log(error)
    }
    
}
function clearInput() {
    thresholdNode.value = "";
    blocklistNode.value = "";
    responseNode.innerHTML = "";
}