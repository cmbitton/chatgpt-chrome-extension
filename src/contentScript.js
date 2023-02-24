'use strict';
import './background.css'
export {}
// Content script file will run in the context of web page.
// With content script you can manipulate the web pages using
// Document Object Model (DOM).
// You can also pass information to the parent extension.

// We execute this script by making an entry in manifest.json file
// under `content_scripts` property

// For more information on Content Scripts,
// See https://developer.chrome.com/extensions/content_scripts

// Log `title` of current active web page
const pageTitle = document.head.getElementsByTagName('title')[0].innerHTML;
console.log(
  `Page title is: '${pageTitle}' - evaluated by Chrome extension's 'contentScript.js' file`
);


function createChatGPTInterface() {
  const ChatGPTContainer = document.createElement('div');
  ChatGPTContainer.classList.add('chatgpt-container');
  const email = document.querySelector('div[aria-label="Message Body"]');
  const button = document.createElement("button");
  const chatGPTInput = document.createElement('input')
  chatGPTInput.id = 'chatgpt-input'
  button.id = 'chatgpt-button'
  const inputContainer = document.querySelector('table.iN')
  ChatGPTContainer.append(chatGPTInput, button)
  inputContainer.insertBefore(ChatGPTContainer, inputContainer.firstChild);
  button.addEventListener('click', () => {
    console.log(chatGPTInput.value)
    chrome.runtime.sendMessage(
      {
        type: 'GREETINGS',
        payload: {
          prompt: chatGPTInput.value, 
          message: email.textContent
        },
      },
      (response) => {
        const formattedText = response.res.text.replace(/\n/g, '<br>')
        email.innerHTML += (formattedText);
        console.log(response.res)
      }
    );
  })
}

function main() {
  const interval = setInterval(function listenForEmail() {
    const email = document.querySelector('div[aria-label="Message Body"]');
    if (email) {
      clearInterval(interval);
      const interval2 = setInterval(function listenforEndEmail() {
        const email = document.querySelector('div[aria-label="Message Body"]');
        if (!email) {
          clearInterval(interval2);
          main();
        }
      }, 3000);
      createChatGPTInterface();
    }
  }, 3000);
}

main();
// Communicate with background file by sending a message


// Listen for message
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.type === 'COUNT') {
    console.log(`Current count is ${request.payload.count}`);
  }

  // Send an empty response
  // See https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-531531890
  sendResponse({});
  return true;
});
