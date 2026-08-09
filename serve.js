const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const DIST = path.join(__dirname, 'client', 'dist');
const PORT = 5173;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.map': 'application/json; charset=utf-8',
};

function sendFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
    });
    res.end(data);
  });
}

function listen(port, attemptsLeft) {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);

    let filePath = path.join(DIST, urlPath);
    if (urlPath === '/') filePath = path.join(DIST, 'index.html');

    if (!filePath.startsWith(DIST)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    fs.stat(filePath, (err, stats) => {
      if (!err && stats.isFile()) {
        sendFile(res, filePath);
      } else {
        const indexPath = path.join(DIST, 'index.html');
        fs.stat(indexPath, (err2) => {
          if (err2) {
            res.writeHead(503, { 'Content-Type': 'text/plain' });
            res.end('Build not found. Run "npm run build" once in the project folder.');
            return;
          }
          sendFile(res, indexPath);
        });
      }
    });
  });

  server.on('error', (e) => {
    if (e.code === 'EADDRINUSE' && attemptsLeft > 0) {
      listen(port + 1, attemptsLeft - 1);
    } else {
      console.error('Could not start server:', e.message);
    }
  });

  server.listen(port, '127.0.0.1', () => {
    const url = 'http://127.0.0.1:' + port;
    console.log('45-Day DSA Placement Prep is running at ' + url);
    console.log('Press Ctrl+C to stop it.');
    setTimeout(() => {
      if (!process.env.NO_BROWSER) {
        exec('start "" "' + url + '"', { shell: 'cmd.exe' });
      }
    }, 300);
  });
}

listen(PORT, 10);
