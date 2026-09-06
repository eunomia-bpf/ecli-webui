const http = require('http');

http.get('http://127.0.0.1:9222/json', (res) => {
  let data = '';
  res.on('data', (c) => data += c);
  res.on('end', () => {
    const targets = JSON.parse(data);
    const target = targets.find(t => t.url && t.url.includes('5173') && t.type === 'page');
    if (!target) return console.error("Page not found");
    
    // We can't easily use raw WS from node without 'ws' module.
    // Wait, let's just write a Python script since Python has `websockets`? No, python has standard `urllib` but no standard websockets.
    // But Node.js doesn't have a built-in ws client.
    console.log(target.webSocketDebuggerUrl);
  });
});
