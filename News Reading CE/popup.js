chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  console.log("hey we are in the popup mode");

  chrome.tabs.executeScript(tabs[0].id, { file: "content.js" }, function () {
    console.log("Content script injected");
  });

});

//this is for the Hilighting of the reading text ....
//here we used an response function , so its sends message to content and then if the message reaches it sends an response
chrome.tabs.query({ active: true , currentWindow:true}, function ( tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {action :"StartHighlighting"}, function(response){
    console.log("Highlight message sent to content");
    if(response && response.success ){
      console.log("Response received from content is  : " + response.success); 

    }
    else{
      console.log("response not came or is False ");
    }
  })
})

// Listen for the Message from the Content Scripts
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("selected text 2  :", message.selectedTextData);
});



//Used ffor Stoping the Speech That its Speaking 
//We are Passing an Message to the content script 
const stopBtn = document.getElementById("stopreading");
stopBtn.addEventListener("click", function() {
  console.log("Stop reading clicked");
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "stopSpeech" });
  });
});


