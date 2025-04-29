const express = require('express');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all('*', (req, res) => {
  const options = {
    hostname: '6b2a-46-193-65-190.ngrok-free.app', // Ton URL ngrok actuelle
    port: 443, // HTTPS par défaut
    path: req.originalUrl,
    method: req.method,
    headers: req.headers,
    rejectUnauthorized: false // Permet d'accepter les certificats ngrok
  };

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
