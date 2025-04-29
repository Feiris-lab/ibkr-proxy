const express = require('express');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all('*', (req, res) => {
  const options = {
    hostname: 'a9ae-46-193-65-190.ngrok-free.app',
    port: 443,
    path: req.originalUrl,
    method: req.method,
    headers: req.headers,
  };
options.rejectUnauthorized = false;
  
  const proxy = https.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  req.pipe(proxy, { end: true });

  proxy.on('error', (e) => {
    console.error(e);
    res.status(500).send('Erreur proxy');
  });
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});

