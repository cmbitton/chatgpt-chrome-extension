import { ChatGPTUnofficialProxyAPI } from 'chatgpt'
import './background.css'
'use strict';
// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'CHATGPT') {

      const api = new ChatGPTUnofficialProxyAPI({
        accessToken: CHATGPT_ACCESS_TOKEN
      })
      console.log(request.payload.prompt)
      api.sendMessage(`${request.payload.prompt}: ${request.payload.message}`).then((res) => {
        sendResponse({
          res,
        });
      })

    

    // Log message coming from the `request` parameter
    console.log(request.payload.message);
    // Send a response message
    return true
  }
});
