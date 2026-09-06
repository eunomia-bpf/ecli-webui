const http = require('http');

http.get('http://127.0.0.1:9222/json', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const targets = JSON.parse(data);
    const target = targets.find(t => t.url && t.url.includes('5173') && t.type === 'page');
    if (!target) return console.log("no page");
    
    // We can use curl to send a WebSocket command if we use a helper, 
    // or just use node `ws`? Oh, node doesn't have `ws` built in.
    console.log(target.webSocketDebuggerUrl);
  });
});
