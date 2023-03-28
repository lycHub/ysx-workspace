const express = require('express');
const history = require('connect-history-api-fallback');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const PORT = 80;
app.use(history());
app.use(express.static('dist'));
app.use('/chatgptapi', createProxyMiddleware({
  target: "https://leads.dev.zeiss.com.cn",
  changeOrigin: true
}));
app.listen(PORT, function(err) {
  if (err) {
    console.log('err :', err);
  } else {
    console.log('Listen at http://localhost:' + PORT);
  }
});
