import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

const myRequest = new Request('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer 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'
  },
  body: JSON.stringify({
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Hello!"}]
  })
});
fetch(myRequest).then(response => response.json())
.then(json => console.log(json));