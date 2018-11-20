const express = require('express');
const path = require('path');

const server = express();

server.use(express.static(path.resolve(__dirname, '..', 'client_dist')));

server.get('/assets/:asset', (req, res) => {
  const folder = req.params.asset.split('_')[0];
  res.sendFile(path.resolve(__dirname, 'assets', folder, req.params.asset));
})

server.listen(3000, 'localhost', () => {
  console.log('server running on http://localhost:3000');
});