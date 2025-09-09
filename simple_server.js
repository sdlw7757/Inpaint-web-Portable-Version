const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = process.env.PORT || 5173;

// MIME types mapping
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf'
};

// Simple HTTP server
const server = http.createServer((req, res) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  // Handle root path
  let url = req.url;
  if (url === '/') {
    url = '/index.html';
  }
  
  // Construct file path
  let filePath = path.join(__dirname, 'dist', url);
  
  // Security check to prevent directory traversal
  const resolvedBase = path.resolve(__dirname, 'dist');
  const resolvedPath = path.resolve(filePath);
  if (!resolvedPath.startsWith(resolvedBase)) {
    res.writeHead(403);
    res.end('403 Forbidden');
    return;
  }
  
  // Check if path is a directory
  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
    
    // Get file extension
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    // Read file
    fs.readFile(filePath, (err, data) => {
      if (err) {
        // If file not found, try to serve index.html (for SPA)
        if (err.code === 'ENOENT') {
          fs.readFile(path.join(__dirname, 'dist', 'index.html'), (err, data) => {
            if (err) {
              res.writeHead(404);
              res.end('404 Not Found');
            } else {
              res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
              res.end(data);
            }
          });
        } else {
          res.writeHead(500);
          res.end(`500 Internal Server Error: ${err.code}`);
        }
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      }
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`==================================`);
  console.log(`     Inpaint Web Application Started!`);
  console.log(`==================================`);
  console.log(``);
  console.log(`Local Access: http://localhost:${PORT}`);
  console.log(`Network Access: http://your-ip-address:${PORT}`);
  console.log(``);
  console.log(`Press Ctrl+C to close the application`);
  console.log(``);
  
  // Try to open browser
  setTimeout(() => {
    const url = `http://localhost:${PORT}`;
    let command;
    
    if (process.platform === 'win32') {
      command = `start "" "${url}"`;
    } else if (process.platform === 'darwin') {
      command = `open "${url}"`;
    } else {
      command = `xdg-open "${url}"`;
    }
    
    exec(command, (error) => {
      if (error) {
        console.log('Could not automatically open browser, please visit manually:', url);
      } else {
        console.log('Browser opened successfully');
      }
    });
  }, 2000);
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already in use, trying another port...`);
    server.close();
    const newPort = PORT + 1;
    server.listen(newPort, '0.0.0.0');
  } else {
    console.error('Server failed to start:', err);
  }
});

console.log(`Starting Inpaint Web Application...`);
console.log(`Serving files from: ${path.join(__dirname, 'dist')}`);