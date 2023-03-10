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

function createChatGPTGeneralInterface () {
  const body = document.querySelector('body')
  const container = document.createElement('div')
  container.classList.add("chatgpt-general-container")
  //logo
  const gptLogo = document.createElement('img');
  gptLogo.classList.add('gpt-logo-general-interface')
  gptLogo.src = "https://i.ibb.co/Pg4BMCg/openai-avatar.png"

  //prompt input
  const promptInput = document.createElement("input");
  promptInput.type = "text";
  promptInput.placeholder = "ChatGPT Prompt Input"
  promptInput.classList.add("gpt-general-prompt-input", "hidden")

  //output
  const output = document.createElement("output");
  output.textContent = "Output"
  output.classList.add("chatgpt-general-output", "hidden");

  //run button
  const runButton = document.createElement("button");
  runButton.classList.add("chatgpt-general-run-button", "hidden");
  runButton.textContent = "RUN";

  //clear button
  const clearButton = document.createElement("button");
  clearButton.classList.add("chatgpt-general-clear-button", "hidden");
  clearButton.textContent = "CLEAR";

  //message body selection
  const fieldset = document.createElement("fieldset");
  fieldset.classList.add("chatgpt-text-input-fieldset", "hidden");
  const legend = document.createElement("legend");
  legend.textContent = "Select ChatGPT Input Text: "
  const selectedTextContainer = document.createElement("div");
  const selectedTextRadio = document.createElement("input");
  selectedTextRadio.id = "selected-text-radio";
  selectedTextRadio.name = "chatgpt-input-text"
  selectedTextRadio.type = "radio";
  selectedTextRadio.value = "selected-text";
  selectedTextRadio.setAttribute("checked", true)
  const selectedTextLabel = document.createElement("label");
  selectedTextLabel.textContent = "Highlighted/Selected Text";
  selectedTextLabel.setAttribute("for", "selected-text-radio");
  selectedTextContainer.append(selectedTextRadio, selectedTextLabel);

  const outputContainer = document.createElement("div");
  const outputTextRadio = document.createElement("input");
  outputTextRadio.id = "output-text-radio";
  outputTextRadio.name = "chatgpt-input-text"
  outputTextRadio.type = "radio";
  outputTextRadio.value = "output-text";
  const outputTextLabel = document.createElement("label");
  outputTextLabel.textContent = "GPT Output Text";
  outputTextLabel.setAttribute("for", "output-text-radio");
  outputContainer.append(outputTextRadio, outputTextLabel);

  fieldset.append(legend, selectedTextContainer, outputContainer)


  container.append(promptInput, gptLogo, output, runButton, clearButton, fieldset)
  body.insertBefore(container, body.firstChild)
}
function runGeneralChatGPT(){
  const runButton = document.querySelector(".chatgpt-general-run-button");
  const chatGPTShowButton = document.querySelector(".gpt-logo-general-interface");
  const clearButton = document.querySelector(".chatgpt-general-clear-button")
  const chatGPTInput = document.querySelector(".gpt-general-prompt-input");
  const output = document.querySelector(".chatgpt-general-output");
  const fieldset = document.querySelector(".chatgpt-text-input-fieldset");
  runButton.addEventListener("click", () => {
    const selectedTextRadio = document.querySelector("#selected-text-radio").checked
    const highlightedText = window.getSelection().toString();
    chrome.runtime.sendMessage(
      {
        type: 'CHATGPT',
        payload: {
          prompt: chatGPTInput.value, 
          message: `${(selectedTextRadio) ? highlightedText : output.innerHTML}`
        },
      },
      (response) => {
        const formattedText = response.res.text.replace(/\n/g, '<br>')
        output.innerHTML = (formattedText);
        console.log(response.res)
      }
    );
  })
  clearButton.addEventListener("click", () => {
    chatGPTInput.value = "";
    output.innerHTML = "";
  })
  chatGPTShowButton.addEventListener("click", () => {
    clearButton.classList.toggle("hidden");
    runButton.classList.toggle("hidden");
    chatGPTInput.classList.toggle("hidden");
    output.classList.toggle("hidden");
    fieldset.classList.toggle("hidden")
  })
}
createChatGPTGeneralInterface();
runGeneralChatGPT();
function createChatGPTGmailInterface() {
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
        type: 'CHATGPT',
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
      createChatGPTGmailInterface();
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
