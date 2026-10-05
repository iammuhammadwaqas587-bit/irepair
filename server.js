import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');

// Reverse proxy for WooCommerce / WordPress API calls
app.use('/api/wp', (req, res) => {
  const targetUrl = 'https://irepair-mobiles.co.uk' + req.url;

  const headers = { ...req.headers };
  delete headers.host;
  headers.host = 'irepair-mobiles.co.uk';

  const clientReq = https.request(
    targetUrl,
    {
      method: req.method,
      headers: headers,
    },
    (clientRes) => {
      res.writeHead(clientRes.statusCode || 200, clientRes.headers);
      clientRes.pipe(res);
    }
  );

  clientReq.on('error', (err) => {
    console.error('Proxy connection error:', err.message);
    if (!res.headersSent) {
      res.status(502).json({ error: 'Failed to connect to WooCommerce backend' });
    }
  });

  req.pipe(clientReq);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', uptime: process.uptime() });
});

// Verify dist directory exists
if (fs.existsSync(DIST_DIR)) {
  // Serve static assets with appropriate caching
  app.use(express.static(DIST_DIR, {
    maxAge: '1d',
    etag: true,
  }));

  // SPA fallback for all client routes
  app.get('*', (req, res) => {
    const indexPath = path.join(DIST_DIR, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('Application build in progress. Please rebuild with npm run build.');
    }
  });
} else {
  app.get('*', (req, res) => {
    res.status(503).send('Distribution files not found. Please run "npm run build" before starting the server.');
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server started successfully on port ${PORT}`);
  console.log(`Serving static files from: ${DIST_DIR}`);
});
