//this process is used so it do not reads the Same thing multiple Times
// Store the last selected text to avoid repeated readings
let lastSelectedText = "";

// Listen for text selection events in the active tab
document.addEventListener("mouseup", function () {
  // Get the selected text and remove leading/trailing whitespace
  const selectedText = window.getSelection().toString().trim();

  // Check if the selected text has changed
  if (selectedText !== lastSelectedText) {
    // Update the last selected text  
    lastSelectedText = selectedText;

    // Apply Speech in the Extension
    const speech = new SpeechSynthesisUtterance();
    speech.text = selectedText;
    window.speechSynthesis.speak(speech);

    if (selectedText) {
      // Send the selected text to the extension's popup
      console.log(selectedText);
      chrome.runtime.sendMessage({ selectedTextData: selectedText });
      highlightWords(selectedText);
    }
  }
});

//this function triggers when we get the Message from the popup.js
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  // Stop speech synthesis if requested from the popup
  if (message.action === "stopSpeech") {
    console.log("Stop speech requested");
    window.speechSynthesis.cancel();
  }
});




// Highlighting words
let isSpeechActive = false;
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "StartHighlighting") {
    console.log("Received highlighting requested");
    sendResponse({ success: true }); //sending response to popup

    isSpeechActive = !isSpeechActive;
/*     if (isSpeechActive) {
      highlightWords();
    } else {
      removeHighlight();
    } */
  }
});



function highlightWords(selectedText) {
  const words = selectedText.split(/\s+/);
  let currentIndex = 0;

  function highlightNextWord() {
    if (currentIndex < words.length) {
      // Create a span element
      const span = document.createElement('span');
      span.className = 'highlight';
      span.textContent = words[currentIndex] + ' ';

      // Get the selection and range
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);

      // Surround the word with the span element
      range.surroundContents(span);

      currentIndex++;
      setTimeout(highlightNextWord, 200);
    }
  }

  highlightNextWord();
}



